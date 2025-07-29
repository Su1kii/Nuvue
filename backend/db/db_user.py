from db.hashing import Hash
from db.models import DbUser
from fastapi import HTTPException
from routers.schemas import UserBase
from sqlalchemy.orm import Session


def create_user(db: Session, request: UserBase):
    new_user = DbUser(
        username=request.username,
        email=request.email,
        password=Hash.bcrypt(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user_by_username(db: Session, username: str):
    user = db.query(DbUser).filter(DbUser.username == username).first()
    if not user:
        raise HTTPException(
            status_code=404, detail=f"User with username {username} not found"
        )
    return user
