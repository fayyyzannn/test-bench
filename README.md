# learning-plan

Movie watchlist app for practicing React, FastAPI and PostgreSQL (days 3 and 4 of the learning plan).

You can add movies, mark them as watched and delete them. Everything is saved in Postgres.

## Stack

- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL

## Setup

Postgres needs to be running with a database called `learning-test` (user: `postgres`, password: `postgres`).
The `movies` table gets created when the backend starts.

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs on http://localhost:8000 (docs at http://localhost:8000/docs)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5180
