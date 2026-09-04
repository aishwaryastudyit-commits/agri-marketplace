from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.core.database import get_db
from app.services import bulk_order_service


router = APIRouter()


# =========================================================
# REQUEST SCHEMAS
# =========================================================

class BulkOrderItem(BaseModel):
    product_id: int
    quantity: float


class BulkOrderRequest(BaseModel):
    buyer_id: int
    items: List[BulkOrderItem]


class OrderStatusRequest(BaseModel):
    status: str


# =========================================================
# CREATE BULK ORDER
# =========================================================

@router.post("/")
def create_bulk_order(
    data: BulkOrderRequest,
    db: Session = Depends(get_db)
):

    try:

        orders = bulk_order_service.create_bulk_order(
            db=db,
            buyer_id=data.buyer_id,
            items=data.items
        )

        return {
            "message": "Bulk order created successfully",
            "buyer_id": data.buyer_id,
            "order_count": len(orders),
            "orders": [
                {
                    **bulk_order_service.bulk_order_payload(order)
                }
                for order in orders
            ]
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Could not create bulk order: {str(error)}"
        )


# =========================================================
# GET BUYER'S BULK ORDERS
# =========================================================

@router.get("/buyer/{buyer_id}")
def get_buyer_bulk_orders(
    buyer_id: int,
    db: Session = Depends(get_db)
):

    try:

        orders = bulk_order_service.get_buyer_bulk_orders(
            db=db,
            buyer_id=buyer_id
        )

        return {
            "buyer_id": buyer_id,
            "order_count": len(orders),
            "orders": [
                {
                    **order
                }
                for order in orders
            ]
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


# =========================================================
# GET SINGLE ORDER
# =========================================================

@router.get("/{order_id}")
def get_bulk_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    try:

        order = bulk_order_service.get_bulk_order(
            db=db,
            order_id=order_id
        )

        return {
            **bulk_order_service.bulk_order_payload(order)
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


# =========================================================
# UPDATE ORDER STATUS
# =========================================================

@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusRequest,
    db: Session = Depends(get_db)
):

    try:

        order = bulk_order_service.update_order_status(
            db=db,
            order_id=order_id,
            status=data.status
        )

        return {
            "message": "Order status updated",
            "order": {
                "id": order.id,
                "buyer_id": order.buyer_id,
                "product_id": order.product_id,
                "quantity": order.quantity,
                "total_amount": order.total_amount,
                "status": order.status
            }
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
