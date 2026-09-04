import pytest
from fastapi import HTTPException

from app.api.cart.routes import CartItemRequest, add_cart_item, checkout_cart
from app.core.database import SessionLocal
from app.models.buyer import Buyer
from app.models.cart_item import CartItem
from app.models.notification import Notification
from app.models.order import Order
from app.models.product import Product
from app.models.delivery import Delivery


def seed_cart(db, *, stock=5, quantity=2):
    buyer = Buyer(full_name="Cart Buyer", phone="9000000001", location="Chennai", buyer_type="consumer")
    product = Product(
        name="Tomatoes", category="Vegetables", price=40, quantity=stock,
        unit="kg", farmer_name="Green Farm", is_available=True,
    )
    db.add_all([buyer, product])
    db.flush()
    db.add(CartItem(buyer_id=buyer.id, product_id=product.id, quantity=quantity))
    db.commit()
    return buyer, product


def test_checkout_moves_cart_to_orders_and_creates_notification():
    db = SessionLocal()
    try:
        buyer, product = seed_cart(db)

        response = checkout_cart(buyer.id, db)

        assert response["message"] == "Order placed successfully"
        assert len(response["orders"]) == 1
        assert db.query(CartItem).filter_by(buyer_id=buyer.id).count() == 0
        assert db.query(Order).filter_by(buyer_id=buyer.id).one().total_amount == 80
        delivery = db.query(Delivery).filter_by(order_id=db.query(Order).filter_by(buyer_id=buyer.id).one().id).one()
        assert delivery.current_location == "Order placed — payment verification pending"
        assert db.query(Product).filter_by(id=product.id).one().quantity == 3
        notification = db.query(Notification).filter_by(user_id=buyer.id).one()
        assert notification.title == "Order received"
        assert notification.is_read is False
    finally:
        db.close()


def test_adding_to_cart_creates_an_acknowledgement_notification():
    db = SessionLocal()
    try:
        buyer, product = seed_cart(db, quantity=1)
        db.query(CartItem).delete()
        db.commit()

        cart_item = add_cart_item(buyer.id, CartItemRequest(product_id=product.id, quantity=1), db)

        assert cart_item["cartQuantity"] == 1
        notification = db.query(Notification).filter_by(user_id=buyer.id).one()
        assert notification.title == "Added to cart"
        assert notification.is_read is False
    finally:
        db.close()


def test_checkout_keeps_cart_when_stock_has_changed():
    db = SessionLocal()
    try:
        buyer, product = seed_cart(db, stock=1, quantity=2)

        with pytest.raises(HTTPException, match="unavailable quantity"):
            checkout_cart(buyer.id, db)

        assert db.query(CartItem).filter_by(buyer_id=buyer.id).count() == 1
        assert db.query(Order).filter_by(buyer_id=buyer.id).count() == 0
        assert db.query(Product).filter_by(id=product.id).one().quantity == 1
    finally:
        db.close()
