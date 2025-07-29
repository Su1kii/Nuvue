import datetime

from db.models import DbPost
from fastapi import HTTPException
from routers.schemas import PostBase, PostCreate
from sqlalchemy.orm import Session


def create(db: Session, request: PostCreate, user_id: int):
    new_post = DbPost(
        image_url=request.image_url,
        image_url_type=request.image_url_type,
        caption=request.caption,
        timestamp=datetime.datetime.now(),
        user_id=user_id,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


def get_all(db: Session):
    return db.query(DbPost).all()


def delete(db: Session, id: int, user_id: int):
    post = db.query(DbPost).filter(DbPost.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != user_id:  # type: ignore
        raise HTTPException(status_code=403, detail="Only the creator can delete")
    db.delete(post)
    db.commit()
    return "ok"
