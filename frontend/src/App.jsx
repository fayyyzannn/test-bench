import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

function AddMovieForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() === "") return;

    onAdd({ title: title.trim(), year: year ? Number(year) : null });
    setTitle("");
    setYear("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        placeholder="Movie title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function MovieItem({ movie, onToggle, onDelete }) {
  return (
    <li className={movie.watched ? "movie watched" : "movie"}>
      <label>
        <input
          type="checkbox"
          checked={movie.watched}
          onChange={() => onToggle(movie)}
        />
        {movie.title} {movie.year && <span className="year">({movie.year})</span>}
      </label>
      <button onClick={() => onDelete(movie.id)}>Delete</button>
    </li>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch(() => setError("Could not connect to the backend"));
  }, []);

  async function addMovie(movie) {
    const res = await fetch(`${API_URL}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    });
    if (!res.ok) {
      alert("Could not add movie");
      return;
    }
    const newMovie = await res.json();
    setMovies([...movies, newMovie]);
  }

  async function toggleWatched(movie) {
    const res = await fetch(`${API_URL}/movies/${movie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: !movie.watched }),
    });
    if (!res.ok) {
      alert("Could not update movie");
      return;
    }
    const updated = await res.json();
    setMovies(movies.map((m) => (m.id === updated.id ? updated : m)));
  }

  async function deleteMovie(id) {
    const res = await fetch(`${API_URL}/movies/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Could not delete movie");
      return;
    }
    setMovies(movies.filter((m) => m.id !== id));
  }

  const watchedCount = movies.filter((m) => m.watched).length;

  return (
    <div className="container">
      <h1>Movie Watchlist</h1>
      <p>
        {movies.length - watchedCount} to watch, {watchedCount} watched
      </p>

      <AddMovieForm onAdd={addMovie} />

      {error && <p className="error">{error}</p>}

      {movies.length === 0 ? (
        <p>No movies yet.</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onToggle={toggleWatched}
              onDelete={deleteMovie}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
