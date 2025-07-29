from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from .database import Base  # if in same folder, e.g., `db/`


class DbUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    items = relationship("DbPost", back_populates="user")


class DbPost(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    image_url_type = Column(String)
    caption = Column(String)
    timestamp = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("DbUser", back_populates="items")
    comments = relationship("DbComment", back_populates="post")


class DbComment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    text = Column(String)
    timestamp = Column(DateTime)
    post_id = Column(Integer, ForeignKey("posts.id"))
    post = relationship("DbPost", back_populates="comments")
