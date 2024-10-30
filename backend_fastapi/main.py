from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
import models
from database import SessionLocal, engine
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    email: str
    password: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


#POST, create a new user
@app.post("/createUser")
def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#GET, get a user by email and password
@app.get("/getUser")
def get_user(email: str, password: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.email == email).filter(models.User.password == password).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user





