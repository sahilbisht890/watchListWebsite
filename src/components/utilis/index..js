import axios from "axios";
import toast from "react-hot-toast";


const movieApi = process.env.REACT_APP_MOVIE_API;

export const fetchMovies = async (search, page) => {
  try {
    if (!movieApi) {
      throw new Error("API URL is not defined. Check your .env file.");
    }
    const response = await axios.get(`${movieApi}&s=${search}&page=${page}`);
    if (response.data.Response === "True") {
      const total = response?.data?.totalResults;
      return { data: response.data.Search, total: total };
    } else {
      console.error("Error fetching movies:", response.data.Error);
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    return { data: [], total: 0 };
  }
};

export const fetchMoviesDetails = async (imbd) => {
  try {
    if (!movieApi) {
      throw new Error("API URL is not defined. Check your .env file.");
    }
    const response = await axios.get(`${movieApi}&i=${imbd}&plot=full`);
    if (response.data.Response === "True") {
      return response.data;
    } else {
      console.error("Error fetching movies:", response.data.Error);
      return {};
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    return {};
  }
};

export const createNewAccount = (userEmail) => {
  const existingEmails = JSON.parse(localStorage.getItem("userEmails")) || [];
  const updatedEmails = [...existingEmails, userEmail];
  localStorage.setItem("userEmails", JSON.stringify(updatedEmails));
};

export const userAlreadyPresentOrNot = (userEmail) => {
  const existingEmails = JSON.parse(localStorage.getItem("userEmails")) || [];
  if (existingEmails.includes(userEmail)) {
    return true;
  }
  return false;
};

export const addToWatchList = (movieData, userEmail, watchListIndex) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};
  if (!watchListsData[userEmail]) {
    toast.error("User doesn't have any watchlists created.");
    return false;
  }
  const userWatchLists = watchListsData[userEmail];
  if (!userWatchLists[watchListIndex]) {
    toast.error("Invalid watchlist index!"); 
    return false;
  }
  const watchList = userWatchLists[watchListIndex];
  const isMovieAlreadyAdded = watchList.movies.some(
    (movie) => movie.imdbID === movieData.imdbID
  );

  if (!isMovieAlreadyAdded) {
    watchList.movies.unshift(movieData);
    toast.success('Movie added to your watchlist successfully!');
  } else {
    toast.error('This movie is already in your watchlist.');
    return false ;
  }
  localStorage.setItem('watchLists', JSON.stringify(watchListsData));
  return true ;
};

export const getWatchList = (userEmail) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};
  if (!watchListsData[userEmail]) {
    return [];
  }
  return watchListsData[userEmail];
};

export const createWatchList = (userEmail, watchListName, about) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};
  if (!watchListsData[userEmail]) {
    watchListsData[userEmail] = [];
  }
  const isWatchListExists = watchListsData[userEmail].some(
    (watchList) => watchList.watchListName.toLowerCase() === watchListName.toLowerCase()
  );

  if (isWatchListExists) {
    toast.error('A watchlist with this name already exists.');
    return false;
  }
  const newWatchList = {
    watchListName,
    about,
    movies: [],
  };

  watchListsData[userEmail].unshift(newWatchList);
  localStorage.setItem('watchLists', JSON.stringify(watchListsData));
  toast.success('Watchlist created successfully!');
  return true ;
};

export const removeFromWatchList = (userEmail, watchListIndex, imdbID) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};

  if (!watchListsData[userEmail]) {
    toast.error("User doesn't have any watchlists created.");
    return false;
  }

  const userWatchLists = watchListsData[userEmail];

  if (!userWatchLists[watchListIndex]) {
    toast.error("Invalid watchlist index!");
    return false;
  }

  const watchList = userWatchLists[watchListIndex];

  const movieIndex = watchList.movies.findIndex((movie) => movie.imdbID === imdbID);

  if (movieIndex === -1) {
    toast.error('Movie not found in the watchlist!');
    return false;
  }

  watchList.movies.splice(movieIndex, 1);

  toast.success('Movie removed from your watchlist successfully!');
  localStorage.setItem('watchLists', JSON.stringify(watchListsData));

  return true;
};







