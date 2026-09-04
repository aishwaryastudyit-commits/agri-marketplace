"""Small dependency-free HS256 JWT implementation for ANNAM's API."""
import base64
import hashlib
import hmac
import json
import os
import time

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

bearer = HTTPBearer(auto_error=False)
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-in-production")
JWT_TTL_SECONDS = int(os.getenv("JWT_TTL_SECONDS", "28800"))


def _b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode()


def _unb64(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def create_access_token(user) -> str:
    header = _b64(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = _b64(json.dumps({"sub": str(user.id), "role": user.role, "exp": int(time.time()) + JWT_TTL_SECONDS}, separators=(",", ":")).encode())
    signature = _b64(hmac.new(JWT_SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
    return f"{header}.{payload}.{signature}"


def current_identity(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        header, payload, signature = credentials.credentials.split(".")
        expected = _b64(hmac.new(JWT_SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(expected, signature):
            raise ValueError("bad signature")
        claims = json.loads(_unb64(payload))
        if int(claims["exp"]) < time.time():
            raise ValueError("expired")
        return claims
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")


def require_roles(*roles):
    def dependency(identity: dict = Depends(current_identity)):
        if identity.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient role permission")
        return identity
    return dependency
