import random
import shutil
import string
from typing import List

from auth.oauth2 import get_current_user
from db import db_post
from db.database import get_db
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from routers.schemas import PostBase, PostCreate, PostDisplay, UserAuth
from sqlalchemy.orm import Session

router = APIRouter(prefix="/post", tags=["post"])


image_url_type = ["absoulute", "relative"]


@router.post("/", response_model=PostDisplay)
def create(
    request: PostCreate,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user),
):
    return db_post.create(db, request, current_user.id)


@router.get("/all", response_model=List[PostDisplay])
def posts(db: Session = Depends(get_db)):
    return db_post.get_all(db)


@router.post("/image")
def upload_image(
    image: UploadFile = File(...), current_user: UserAuth = Depends(get_current_user)
):
    if not image.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    # Generate a random 6-letter string
    rand_str = "".join(random.choices(string.ascii_letters, k=6))

    # Split filename safely
    name_parts = image.filename.rsplit(".", 1)
    if len(name_parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid file format.")

    filename = f"{name_parts[0]}_{rand_str}.{name_parts[1]}"
    path = f"images/{filename}"

    # Save the uploaded image
    with open(path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {"filename": path}


@router.delete("/delete/{id}")
def delete(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user),
):
    return db_post.delete(db, id, current_user.id)
