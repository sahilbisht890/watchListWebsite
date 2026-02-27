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
Initial search page:
![Home](https://github.com/user-attachments/assets/14f113f7-7fcf-4966-b1cc-895416944590)

Movie details page:
![Details](https://github.com/user-attachments/assets/5ef6eea8-1492-4eb5-9107-23bcf1b3630e)

Login/sign-up modal:
![Login](https://github.com/user-attachments/assets/b6ff1b70-6d11-44e0-81e8-3d826a9757dd)

Watchlist views:
![Watchlist 1](https://github.com/user-attachments/assets/5b8e5803-a609-46e6-af3c-4a479dd6f1b6)
![Watchlist 2](https://github.com/user-attachments/assets/952b91d4-f528-41f9-82db-6ccce2a309df)
