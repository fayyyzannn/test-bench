from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from database import Base, engine, get_db, Movie

Base.metadata.create_all(bind=engine)

app = FastAPI()

# allow the react app to call the api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5180"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MovieCreate(BaseModel):
    title: str
    year: int | None = None


class MovieUpdate(BaseModel):
    watched: bool


class MovieOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    year: int | None
    watched: bool


@app.get("/movies", response_model=list[MovieOut])
def get_movies(db: Session = Depends(get_db)):
    return db.query(Movie).order_by(Movie.id).all()


@app.post("/movies", response_model=MovieOut)
def add_movie(movie: MovieCreate, db: Session = Depends(get_db)):
    new_movie = Movie(title=movie.title, year=movie.year)
    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)
    return new_movie


@app.patch("/movies/{movie_id}", response_model=MovieOut)
def update_movie(movie_id: int, data: MovieUpdate, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    movie.watched = data.watched
    db.commit()
    db.refresh(movie)
    return movie


@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    db.delete(movie)
    db.commit()
    return {"message": "Movie deleted"}
