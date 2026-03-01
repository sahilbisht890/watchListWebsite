# Movie Watchlist Website

A React app for searching movies, viewing detailed metadata, and organizing personal watchlists.

## Live Demo
- https://sahilbisht890.github.io/watchListWebsite/

## Features
- Search movies from OMDb with pagination
- View movie details (plot, ratings, metadata)
- Create a local account (email-based key)
- Create multiple watchlists per user
- Add and remove movies from watchlists
- Quick watchlist navigation from sidebar

## Tech Stack
- React 18 (Create React App)
- React Router
- Axios
- Ant Design + Bootstrap
- Sass
- react-hot-toast

## Prerequisites
- Node.js 18+ (or current LTS)
- npm

## Environment Variables
Create a `.env` file in the project root:

```env
REACT_APP_MOVIE_API=https://www.omdbapi.com/?apikey=YOUR_OMDB_API_KEY
```

Get an API key from OMDb: https://www.omdbapi.com/apikey.aspx

## Run Locally
```bash
npm install
npm start
```

Open: http://localhost:3000

## Available Scripts
- `npm start` - Run in development mode
- `npm run build` - Create production build in `build/`
- `npm test` - Run test suite
- `npm run deploy` - Deploy `build/` to GitHub Pages

## Data Storage Notes
- User keys and watchlists are stored in browser `localStorage`.
- This is client-side only and not secure authentication.

## Screenshots
<img width="1919" height="863" alt="Screenshot 2026-02-27 221217" src="https://github.com/user-attachments/assets/80cc8523-9c3f-4e18-9381-95b653872568" />
<img width="1919" height="867" alt="Screenshot 2026-02-27 221232" src="https://github.com/user-attachments/assets/0d9da7af-0af2-46a0-b3d3-7c7c47786e14" />
<img width="1917" height="864" alt="Screenshot 2026-02-27 221411" src="https://github.com/user-attachments/assets/e0d32f40-3687-4648-b4b5-c7d7f5893c88" />
<img width="1919" height="867" alt="Screenshot 2026-02-27 221246" src="https://github.com/user-attachments/assets/e082c82c-4be2-4169-bab0-5a6512b4db00" />
<img width="1919" height="869" alt="Screenshot 2026-02-27 221350" src="https://github.com/user-attachments/assets/3d142272-5149-4e41-83c0-fdb64729fc5a" />
<img width="1919" height="859" alt="Screenshot 2026-02-27 221420" src="https://github.com/user-attachments/assets/9aa09b02-7e63-43f8-b924-658536d1fffc" />
<img width="1919" height="861" alt="Screenshot 2026-02-27 221443" src="https://github.com/user-attachments/assets/379c6931-4ded-4e9e-bf80-9bfbdd34908e" />








