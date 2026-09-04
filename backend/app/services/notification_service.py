from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "info",
    *,
    commit: bool = True,
) -> Notification:
    """Store a notification, optionally within the caller's transaction."""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        is_read=False,
    )
    db.add(notification)
    if commit:
        db.commit()
        db.refresh(notification)
    return notification
