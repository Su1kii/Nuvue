from db.database import get_db
from db.db_user import create_user
from fastapi import APIRouter, Depends
from routers.schemas import UserBase, UserDisplay
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/", response_model=UserDisplay)
def create_users(request: UserBase, db: Session = Depends(get_db)):
    return create_user(db, request)
