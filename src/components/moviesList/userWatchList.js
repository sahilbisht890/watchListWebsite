import React, { useEffect, useState, useRef } from "react";
import style from "../../styles/movieList.module.scss";
import MovieCard from "./movieCard.js";
import {Spin, Pagination, Image } from "antd";
import { useGlobalContext } from "../../globalProvider";
import { useParams } from "react-router-dom";




const WatchListPage = () => {
  const [page, setPage] = useState(1);
  const { listIndex } = useParams();
  console.log('-------o>>',listIndex);
  const { userEmail, setUserEmail, userWatchListData, setUserWatchListData } = useGlobalContext();
  const [moviesList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalMovieList, setTotalMovieList] = useState(0);
  const [paginatedMovieList , setPaginatedMovieList] = useState([]);
  const [watchListInfo , setWatchListInfo] = useState({
    watchListName : '',
    about : ''
 })

  useEffect(() => {
    const temp = userWatchListData[listIndex];
    const tempMovieList = temp.movies;
    const watchListTemp = {
        watchListName : temp?.watchListName ,
        about : temp?.about 
    }

    setWatchListInfo(watchListTemp);
    setMovieList(tempMovieList);
    setPaginatedMovieList(tempMovieList.slice(0 , 10));
    setTotalMovieList(tempMovieList.length);
  }, [listIndex]);


  const handlePageChange = (page) => {
    setPaginatedMovieList(moviesList.slice((10*page-1) , 10*page))
    setPage(page);
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
          <div className="cardHeading mainColor">
              {watchListInfo?.watchListName}
          </div>
          <div className="cardHeadingAbout">
              {watchListInfo?.about}
          </div>
        </div>

        {totalMovieList > 0 && (
          <div className="d-flex flex-column gap-2 mt-5">
            <div className="mt-3 d-flex flex-wrap moviesList justify-content-between">
              {paginatedMovieList.map((movieData, index) => (
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
                  defaultPageSize={10}
                />
              </div>
            )}
          </div>
        )}
        {totalMovieList === 0 && !loading ? (
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

export default WatchListPage;
