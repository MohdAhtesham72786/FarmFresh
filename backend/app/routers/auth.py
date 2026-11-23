from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.auth.security import create_access_token, verify_password
from app.database import get_db
from app.models.admin import Admin
from app.schemas.auth import AdminMeResponse, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    admin = db.query(Admin).filter(Admin.username == payload.username).first()
    if not admin or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    token = create_access_token(admin.username)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AdminMeResponse)
def admin_me(admin: Admin = Depends(get_current_admin)) -> AdminMeResponse:
    return AdminMeResponse.model_validate(admin)