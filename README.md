# Photo Sharing (Lab 2)

This repo contains:

- Frontend React app in the repository root.
- Backend Express + MongoDB app in `server/`.

## Quick start (fresh machine / CodeSandbox)

1. Install dependencies for both frontend and backend:

```bash
npm run setup:all
```

2. Create backend env file:

- Copy `server/.env.example` to `server/.env`
- Set `DB_URL` to your MongoDB Atlas URI.

3. (One-time) load fake data to database:

```bash
npm run db:load
```

4. Start backend and frontend in 2 terminals:

```bash
npm run start:server
```

```bash
npm run start:client
```

## Notes for GitHub / CodeSandbox

- Do not commit `node_modules`.
- Do not commit `.env`.
- Commit lockfiles (`package-lock.json`, `server/package-lock.json`) so dependencies are reproducible.

## Useful scripts

- `npm run setup:all`: install root and server dependencies.
- `npm run start:client`: run React app.
- `npm run start:server`: run Express API.
- `npm run db:load`: load seed data into MongoDB.
