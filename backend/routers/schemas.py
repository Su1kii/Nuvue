from datetime import datetime
from typing import List

from pydantic import BaseModel


# Input model when registering a user
class UserBase(BaseModel):
    username: str
    email: str
    password: str


# Output model when returning a user
class UserDisplay(BaseModel):
    username: str
    email: str

    class Config:
        from_attributes = True


# Input model when creating a post
class PostBase(BaseModel):
    image_url: str
    image_url_type: str
    caption: str
    creator_id: int  # creator_id to user_id to match your DB


# Used inside PostDisplay to show nested user
class User(BaseModel):
    username: str

    class Config:
        from_attributes = True


# For Post display
class Comment(BaseModel):
    username: str
    text: str
    timestamp: datetime

    class Config:
        from_attributes = True


# Output model when returning a post
class PostDisplay(BaseModel):
    id: int
    image_url: str
    image_url_type: str
    caption: str
    timestamp: datetime
    user: User  # ✅ nested user from relationship
    comments: List[Comment]

    class Config:
        from_attributes = True


class UserAuth(BaseModel):
    id: int
    username: str
    email: str


class CommentBase(BaseModel):
    username: str
    text: str
    post_id: int


class PostCreate(BaseModel):
    image_url: str
    image_url_type: str
    caption: str
