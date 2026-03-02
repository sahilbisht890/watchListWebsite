import axios from "axios";
import toast from "react-hot-toast";


const movieApi = process.env.REACT_APP_MOVIE_API;
const USER_ACCOUNTS_KEY = "userAccounts";
const LEGACY_PASSKEYS_KEY = "userPasskeys";
const ENCRYPTION_SECRET = "watchlist_local_secret_v1";
const SEARCH_CACHE_TTL_MS = 60 * 1000;
const DETAILS_CACHE_TTL_MS = 5 * 60 * 1000;
const moviesSearchCache = new Map();
const moviesDetailsCache = new Map();
const inflightSearchRequests = new Map();
const inflightDetailsRequests = new Map();

const toBase64 = (value) => {
  try {
    return window.btoa(value);
  } catch (error) {
    return "";
  }
};

const fromBase64 = (value) => {
  try {
    return window.atob(value);
  } catch (error) {
    return "";
  }
};

const xorCipher = (value, secret) => {
  if (!value) {
    return "";
  }
  let result = "";
  for (let i = 0; i < value.length; i += 1) {
    result += String.fromCharCode(
      value.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    );
  }
  return result;
};

const encryptValue = (plainText) => {
  const safeValue = String(plainText || "");
  return toBase64(xorCipher(safeValue, ENCRYPTION_SECRET));
};

const decryptValue = (encryptedText) => {
  const decoded = fromBase64(encryptedText || "");
  return xorCipher(decoded, ENCRYPTION_SECRET);
};

const normalizeAnswer = (answer) => String(answer || "").trim().toLowerCase();

const getStoredAccounts = () => {
  const encryptedAccounts = JSON.parse(localStorage.getItem(USER_ACCOUNTS_KEY)) || [];
  if (encryptedAccounts.length > 0) {
    return encryptedAccounts;
  }

  const legacyPasskeys = JSON.parse(localStorage.getItem(LEGACY_PASSKEYS_KEY)) || [];
  if (!legacyPasskeys.length) {
    return [];
  }

  const migratedAccounts = legacyPasskeys.map((passkey) => ({
    passkey: encryptValue(passkey),
    question: encryptValue(""),
    answer: encryptValue(""),
  }));
  localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(migratedAccounts));
  localStorage.removeItem(LEGACY_PASSKEYS_KEY);
  return migratedAccounts;
};

const saveStoredAccounts = (accounts) => {
  localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const fetchMovies = async (search, page) => {
  try {
    if (!movieApi) {
      throw new Error("API URL is not defined. Check your .env file.");
    }
    const safeSearch = String(search || "").trim().toLowerCase();
    const safePage = Number(page) || 1;
    const cacheKey = `${safeSearch}|${safePage}`;
    const cachedEntry = moviesSearchCache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < SEARCH_CACHE_TTL_MS) {
      return cachedEntry.value;
    }

    if (inflightSearchRequests.has(cacheKey)) {
      return inflightSearchRequests.get(cacheKey);
    }

    const requestPromise = axios
      .get(`${movieApi}&s=${encodeURIComponent(safeSearch)}&page=${safePage}`)
      .then((response) => {
        if (response.data.Response === "True") {
          const total = response?.data?.totalResults;
          const value = { data: response.data.Search, total: total };
          moviesSearchCache.set(cacheKey, { value, timestamp: Date.now() });
          return value;
        }
        console.error("Error fetching movies:", response.data.Error);
        return { data: [], total: 0 };
      })
      .finally(() => {
        inflightSearchRequests.delete(cacheKey);
      });

    inflightSearchRequests.set(cacheKey, requestPromise);
    return requestPromise;
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
    const safeImdbId = String(imbd || "").trim();
    if (!safeImdbId) {
      return {};
    }

    const cachedEntry = moviesDetailsCache.get(safeImdbId);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < DETAILS_CACHE_TTL_MS) {
      return cachedEntry.value;
    }

    if (inflightDetailsRequests.has(safeImdbId)) {
      return inflightDetailsRequests.get(safeImdbId);
    }

    const requestPromise = axios
      .get(`${movieApi}&i=${encodeURIComponent(safeImdbId)}&plot=full`)
      .then((response) => {
        if (response.data.Response === "True") {
          moviesDetailsCache.set(safeImdbId, {
            value: response.data,
            timestamp: Date.now(),
          });
          return response.data;
        }
        console.error("Error fetching movies:", response.data.Error);
        return {};
      })
      .finally(() => {
        inflightDetailsRequests.delete(safeImdbId);
      });

    inflightDetailsRequests.set(safeImdbId, requestPromise);
    return requestPromise;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return {};
  }
};

export const createNewAccount = (userKey) => {
  createNewAccountWithRecovery(userKey, "", "");
};

export const userAlreadyPresentOrNot = (userKey) => {
  const existingAccounts = getStoredAccounts();
  return existingAccounts.some(
    (account) => decryptValue(account.passkey) === userKey
  );
};

export const createNewAccountWithRecovery = (userKey, question, answer) => {
  const existingAccounts = getStoredAccounts();
  const updatedAccounts = [
    ...existingAccounts,
    {
      passkey: encryptValue(userKey),
      question: encryptValue(question),
      answer: encryptValue(normalizeAnswer(answer)),
    },
  ];
  saveStoredAccounts(updatedAccounts);
};

export const recoverPasskeyWithQuestion = (question, answer) => {
  const existingAccounts = getStoredAccounts();
  const normalizedQuestion = String(question || "").trim();
  const normalizedInputAnswer = normalizeAnswer(answer);

  const matchedAccount = existingAccounts.find((account) => {
    const storedQuestion = decryptValue(account.question);
    const storedAnswer = decryptValue(account.answer);
    return (
      storedQuestion === normalizedQuestion &&
      storedAnswer &&
      storedAnswer === normalizedInputAnswer
    );
  });

  if (!matchedAccount) {
    return "";
  }

  return decryptValue(matchedAccount.passkey);
};

export const addToWatchList = (movieData, userKey, watchListIndex) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};
  if (!watchListsData[userKey]) {
    toast.error("User doesn't have any watchlists created.");
    return false;
  }
  const userWatchLists = watchListsData[userKey];
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

export const getWatchList = (userKey) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};
  if (!watchListsData[userKey]) {
    return [];
  }
  return watchListsData[userKey];
};

export const createWatchList = (userKey, watchListName, about) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};
  if (!watchListsData[userKey]) {
    watchListsData[userKey] = [];
  }
  const safeName = (watchListName || '').trim();
  const safeAbout = (about || '').trim();
  if (!safeName) {
    toast.error('Watchlist title cannot be empty.');
    return false;
  }
  const isWatchListExists = watchListsData[userKey].some(
    (watchList) => watchList.watchListName.toLowerCase() === safeName.toLowerCase()
  );

  if (isWatchListExists) {
    toast.error('A watchlist with this name already exists.');
    return false;
  }
  const newWatchList = {
    watchListName: safeName,
    about: safeAbout,
    movies: [],
  };

  watchListsData[userKey].unshift(newWatchList);
  localStorage.setItem('watchLists', JSON.stringify(watchListsData));
  toast.success('Watchlist created successfully!');
  return true ;
};

export const removeFromWatchList = (userKey, watchListIndex, imdbID) => {
  const watchListsData = JSON.parse(localStorage.getItem('watchLists')) || {};

  if (!watchListsData[userKey]) {
    toast.error("User doesn't have any watchlists created.");
    return false;
  }

  const userWatchLists = watchListsData[userKey];

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







