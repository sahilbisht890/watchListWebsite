import style from "../../styles/movieList.module.scss";
import { Image, Tooltip } from "antd";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import LoginFormModal from "../loginForm/index";
import { useGlobalContext } from "../../globalProvider";
import { useState } from "react";
import WatchList from "../watchListForm/watchList";
import {
  IconSquareCheckFilled
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { removeFromWatchList } from "../utilis/index.";


const MovieCard = ({ movieData , view='normallist' , index, handleRemoveMovie}) => {
  const navigate = useNavigate();
  const { listIndex } = useParams();
  const { userEmail, setUserEmail } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Sign In");
  const [isWatchListModalOpen, setIsWatchListModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});


  const handleMovieDetails = () => {
    navigate(`/details/${movieData?.imdbID}`);
  }
  const handleBookmarkClick = (movieData) => {
    if(!userEmail){
      setIsModalVisible(true);
    }else {
      setSelectedMovie(movieData);
      setIsWatchListModalOpen(true);
    }
  }

  const handleRemoveBookmark = (id) => {
       removeFromWatchList(userEmail , listIndex , id );
       handleRemoveMovie(id);
  }
  return (
    <>
      <WatchList isModalOpen ={isWatchListModalOpen} setIsModalOpen ={setIsWatchListModalOpen} movieData={selectedMovie} />
      <LoginFormModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        buttonText={buttonText}
        setButtonText={setButtonText}
      />
      <div className={`${style.movieCard} mb-3 rounded cursor-pointer`} >
        <div className="moviePosterDiv d-flex align-items-center justify-content-center position-relative">
          {movieData?.Poster === "N/A" ? (
            <Image src={`${process.env.PUBLIC_URL}/images/icons8-video-100.png`} preview={false} />
          ) : (
            <Image
              src={movieData?.Poster}
              height={"100%"}
              width={"100%"}
              alt={movieData.Title}
            />
          )}
            {
            view !== 'watchlist' ? 
          
          <div className="bookmarkIcon" onClick={() =>handleBookmarkClick(movieData)}>
            <Tooltip title="Add to WatchList">
              {/* <Image src={'/images/icons8-add-bookmark.svg'} width={'80%'} preview={false} className="cursor-pointer"/> */}
              {/* <BsFillBookmarkPlusFill  className="bookmark-icon"/> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                height="35px"
                width="35px"
              >
                <path
                  fill="rgb(31 32 32)"
                  d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5z"
                />
                <path
                  fill="white"
                  d="M7.5 4.25v2H6v1h1.5v1.5h1V7.25H10v-1H8.5V4.25h-1z"
                />
              </svg>
            </Tooltip>
          </div> :          <div className="selectedIcon" onClick={() => handleRemoveBookmark(movieData.imdbID)}>
            <Tooltip title="Remove From WatchList">
            <IconSquareCheckFilled size={27} fill='#1fb141' />
            </Tooltip>
          </div>
            }
        </div>
        <div className="p-2 movieInfo" onClick={handleMovieDetails}>
          <div className={`fw-medium movieTitle`}>{movieData.Title}</div>
          <div className="releaseYear">Release Year : {movieData?.Year}</div>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
