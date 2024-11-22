import React, { useEffect, useState, useRef } from "react";
import style from "../../styles/movieList.module.scss";
import MovieCard from "./movieCard.js";
import { Input, Spin, Pagination, Image } from "antd";
import { IconSearch, IconDeviceTvFilled, IconShare} from "@tabler/icons-react";
import { fetchMovies } from "../utilis/index..js";


const { Search } = Input;
const MovieListPage = () => {
  const searchRef = useRef(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("Batman");
  const [moviesList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMovieList, setTotalMovieList] = useState(0);

  useEffect(() => {
    fetchMovies(search, page).then((movies) => {
      setMovieList(movies.data);
      setTotalMovieList(movies.total);
      setLoading(false);
    });
  }, []);

  const handleButtonClick = () => {
    searchRef.current?.focus();
  };

  const handleMovieSearch = (searchValue) => {
    setPage(1);
    if (searchValue === "") {
      searchValue = "Batman"; //as the api doesnt give the movies randomly
    }
    setLoading(true);
    fetchMovies(searchValue, 1).then((movies) => {
      setMovieList(movies.data);
      setTotalMovieList(movies.total);
      setLoading(false);
      setSearch(searchValue);
    });
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setPage(page);
    fetchMovies(search, page).then((movies) => {
      setMovieList(movies.data);
      setLoading(false);
    });
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading">
            <Spin size="large" />
          </div>
        </div>
      )}
      <div className={`${style.movieListContainer} rounded  h-100`}>
        <div className="headingCard rounded p-3">
          <div className="cardHeading">
            Welcome to <span className="mainColor">WatchLists</span>
          </div>
          <div className="d-flex gap-3 text-white flex-wrap websitePoints mt-3">
            <span
              className="d-flex align-items-center gap-2 btn cursor-pointer"
              onClick={handleButtonClick}
            >
              <IconSearch /><div className='websitePointsLabel'>Browse movies</div> 
            </span>
            <span className="d-flex align-items-center gap-2">
              <IconDeviceTvFilled /> <div className='websitePointsLabel'>Add movies to watchList</div>
            </span>
            <span className="d-flex align-items-center gap-2">
              <IconShare /><div className='websitePointsLabel'>Share with your friends</div>
            </span>
          </div>
        </div>

        <div className="movieSearch mt-3">
          <Search
            ref={searchRef}
            placeholder="Search Movies"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={handleMovieSearch}
          />
        </div>
        {moviesList?.length > 0 && (
          <div className="d-flex flex-column gap-2">
            <div className="mt-3 d-flex flex-wrap moviesList justify-content-between">
              {moviesList.map((movieData, index) => (
                <MovieCard movieData={movieData} key={index} />
              ))}
            </div>
            {totalMovieList > 10 && !loading && (
              <div className="p-3">
                <Pagination
                  align="center"
                  current={page}
                  total={totalMovieList > 50 ? 50 : totalMovieList}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
        {moviesList.length === 0 && !loading ? (
          <div
            className={`d-flex flex-column gap-2 align-items-center justify-content-center mt-5 pt-5 ${style.noDataContainer}`}
          >
            <Image
              src={`${process.env.PUBLIC_URL}/images/noData.jpg`}
              className="rounded"
              width={"18%"}
              preview={false}
            />
            <div className="fw-medium text-secondary">No Movie Found</div>
          </div>
        ) : (
          " "
        )}
      </div>
    </>
  );
};

export default MovieListPage;
