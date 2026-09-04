from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.cart_item import CartItem
from app.models.order import Order
from app.models.product import Product
from app.models.buyer import Buyer
from app.services.notification_service import create_notification
from app.services.logistics_service import queue_delivery

router = APIRouter()


class CartItemRequest(BaseModel):
    product_id: int
    quantity: float = 1


def cart_payload(item, product):
    return {
        "id": item.id, "buyer_id": item.buyer_id, "product_id": product.id,
        "name": product.name, "price": product.price, "unit": product.unit,
        "farmer_name": product.farmer_name, "location": product.location,
        "available_quantity": product.quantity, "cartQuantity": item.quantity,
    }


@router.get("/{buyer_id}")
def get_cart(buyer_id: int, db: Session = Depends(get_db)):
    rows = db.query(CartItem, Product).join(Product, CartItem.product_id == Product.id) \
        .filter(CartItem.buyer_id == buyer_id).order_by(CartItem.id.desc()).all()
    return [cart_payload(item, product) for item, product in rows]


@router.post("/{buyer_id}/items")
def add_cart_item(buyer_id: int, data: CartItemRequest, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_available == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product is not available")
    if data.quantity <= 0 or data.quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Requested cart quantity is not available")
    item = db.query(CartItem).filter(CartItem.buyer_id == buyer_id, CartItem.product_id == data.product_id).first()
    if item:
        item.quantity = min(item.quantity + data.quantity, product.quantity)
    else:
        item = CartItem(buyer_id=buyer_id, product_id=data.product_id, quantity=data.quantity)
        db.add(item)
    # The cart update and acknowledgement must succeed together so the buyer
    # never sees a notification for an item that was not actually saved.
    notification = create_notification(
        db,
        buyer_id,
        "Added to cart",
        f"{product.name} is in your cart. Review it when you are ready to order.",
        "cart",
        commit=False,
    )
    db.commit()
    db.refresh(item)
    db.refresh(notification)
    payload = cart_payload(item, product)
    payload["notification"] = notification
    return payload


@router.patch("/{buyer_id}/items/{product_id}")
def change_cart_item(buyer_id: int, product_id: int, data: CartItemRequest, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.buyer_id == buyer_id, CartItem.product_id == product_id).first()
    product = db.query(Product).filter(Product.id == product_id).first()
    if not item or not product:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if data.quantity <= 0 or data.quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Requested cart quantity is not available")
    item.quantity = data.quantity
    db.commit()
    db.refresh(item)
    return cart_payload(item, product)


@router.delete("/{buyer_id}/items/{product_id}")
def remove_cart_item(buyer_id: int, product_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.buyer_id == buyer_id, CartItem.product_id == product_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed"}


@router.delete("/{buyer_id}")
def clear_cart(buyer_id: int, db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.buyer_id == buyer_id).delete()
    db.commit()
    return {"message": "Cart cleared"}


@router.post("/{buyer_id}/checkout")
def checkout_cart(buyer_id: int, db: Session = Depends(get_db)):
    """Turn the full cart into orders in one all-or-nothing transaction."""
    rows = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.buyer_id == buyer_id)
        .with_for_update()
        .all()
    )
    if not rows:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    unavailable = [
        product.name for item, product in rows
        if not product.is_available or item.quantity <= 0 or item.quantity > product.quantity
    ]
    if unavailable:
        raise HTTPException(
            status_code=400,
            detail=f"Update your cart; unavailable quantity for: {', '.join(unavailable)}",
        )

    orders = []
    try:
        buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()
        for item, product in rows:
            order = Order(
                buyer_id=buyer_id,
                product_id=product.id,
                quantity=item.quantity,
                total_amount=product.price * item.quantity,
                status="pending",
            )
            db.add(order)
            product.quantity -= item.quantity
            if product.quantity <= 0:
                product.quantity = 0
                product.is_available = False
            orders.append(order)
            db.delete(item)

        db.flush()
        for order in orders:
            queue_delivery(db, order, buyer)

        notification = create_notification(
            db,
            buyer_id,
            "Order received",
            f"We received your order for {len(orders)} item(s). Complete payment to confirm it.",
            "order",
            commit=False,
        )
        db.commit()
        for order in orders:
            db.refresh(order)
        db.refresh(notification)
    except Exception:
        db.rollback()
        raise

    return {
        "message": "Order placed successfully",
        "orders": orders,
        "notification": notification,
    }
