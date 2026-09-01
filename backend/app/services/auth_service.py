from sqlalchemy.orm import Session

from app.models.user import User
from app.services.notification_service import create_notification

import hashlib
import secrets


# =========================================================
# PASSWORD HELPERS
# =========================================================

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000
    ).hex()

    return f"{salt}${password_hash}"


def verify_password(
    password: str,
    stored_password: str
) -> bool:

    try:
        salt, stored_hash = stored_password.split(
            "$", 1
        )

        password_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100_000
        ).hex()

        return secrets.compare_digest(
            password_hash,
            stored_hash
        )

    except Exception:
        return False


# =========================================================
# REGISTER USER
# =========================================================

def register_user(
    db: Session,
    full_name: str,
    email: str = None,
    phone: str = None,
    password: str = "",
    role: str = "consumer"
):

    if not email and not phone:
        raise ValueError(
            "Email or phone number is required"
        )

    # Check email
    if email:

        existing_email = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_email:
            raise ValueError(
                "Email already registered"
            )

    # Check phone
    if phone:

        existing_phone = (
            db.query(User)
            .filter(User.phone == phone)
            .first()
        )

        if existing_phone:
            raise ValueError(
                "Phone number already registered"
            )

    # Create user
    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        role=role,
        password_hash=hash_password(password),
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Welcome notification
    create_notification(
        db,
        user_id=user.id,
        title="Welcome to ANNAM",
        message=(
            "Your account has been created successfully. "
            "You can now start exploring buyers and orders."
        ),
        notification_type="account"
    )

    return user


# =========================================================
# LOGIN USER
# =========================================================

def login_user(
    db: Session,
    email: str = None,
    phone: str = None,
    password: str = ""
):

    if not email and not phone:
        raise ValueError(
            "Email or phone number is required"
        )

    user = None

    # Find by email
    if email:

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    # Find by phone
    elif phone:

        user = (
            db.query(User)
            .filter(User.phone == phone)
            .first()
        )

    if not user:
        raise ValueError(
            "Invalid email/phone or password"
        )

    if not user.is_active:
        raise PermissionError(
            "Account is inactive"
        )

    if not user.password_hash:
        raise ValueError(
            "Password is not configured for this account"
        )

    if not verify_password(
        password,
        user.password_hash
    ):
        raise ValueError(
            "Invalid email/phone or password"
        )

    return user


# =========================================================
# GET USER
# =========================================================

def get_user(
    db: Session,
    user_id: int
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise ValueError("User not found")

    return user