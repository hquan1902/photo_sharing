# Photo Sharing API Server

Backend setup for Lab 2.

## Setup

1. Install dependencies in `server/`.
2. Create `server/.env` from `server/.env.example`.
3. Set `DB_URL` to your MongoDB Atlas connection string.

### CodeSandbox note

If you don't want to create a file, you can set `DB_URL` as an environment variable in the sandbox settings.

## Run

- Start API server: `npm start`
- Load fake data into MongoDB once: `node ./db/dbLoad.js`

## Notes

- Backend in this folder uses CommonJS (`require/module.exports`).
- Frontend in `src/` uses ES modules (`import/export`).
