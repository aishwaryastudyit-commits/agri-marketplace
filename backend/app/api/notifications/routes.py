from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.models.notification import Notification


router = APIRouter()


class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str
    notification_type: str = "info"


@router.post("/")
def create_notification_route(data: NotificationCreate, db: Session = Depends(get_db)):
    notification = Notification(
        user_id=data.user_id,
        title=data.title,
        message=data.message,
        notification_type=data.notification_type,
        is_read=False,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.get("/user/{user_id}")
def get_notifications_for_user(user_id: int, db: Session = Depends(get_db)):
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return notifications


@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
