from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.services import auth_service
from app.core.security import create_access_token


router = APIRouter()


# =========================================================
# REQUEST SCHEMAS
# =========================================================

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr | None = None
    phone: str | None = None
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr | None = None
    phone: str | None = None
    password: str


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        user = auth_service.register_user(
            db=db,
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            password=data.password,
            role=data.role
        )

        return {
            "message": "Registration successful",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "is_active": user.is_active
            }
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

        user = auth_service.login_user(
            db=db,
            email=data.email,
            phone=data.phone,
            password=data.password
        )

        return {
            "message": "Login successful",
            "access_token": create_access_token(user),
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "is_active": user.is_active
            }
        }

    except PermissionError as error:

        raise HTTPException(
            status_code=403,
            detail=str(error)
        )

    except ValueError as error:

        raise HTTPException(
            status_code=401,
            detail=str(error)
        )


# =========================================================
# GET USER
# =========================================================

@router.get("/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    try:

        user = auth_service.get_user(
            db=db,
            user_id=user_id
        )

        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )
