import style from "../../styles/movieList.module.scss";
import { Image, Tooltip, Modal, Button } from "antd";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import LoginFormModal from "../loginForm/index";
import { useGlobalContext } from "../../globalProvider";
import { useEffect, useState } from "react";
import WatchList from "../watchListForm/watchList";
import {
  IconTrash,
  IconShare
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { fetchMoviesDetails, removeFromWatchList } from "../utilis/index.";
import { toast } from "react-hot-toast";
import { FaWhatsapp, FaFacebookF, FaLink } from "react-icons/fa";


const MovieCard = ({ movieData , view='normallist' , index, handleRemoveMovie}) => {
  const navigate = useNavigate();
  const { listIndex } = useParams();
  const { userKey, setUserKey } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState("unlock");
  const [isWatchListModalOpen, setIsWatchListModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [imdbRating, setImdbRating] = useState("");
  const [imdbVotes, setImdbVotes] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (!movieData?.imdbID) {
      return;
    }
    fetchMoviesDetails(movieData.imdbID).then((movieDetails) => {
      if (movieDetails?.imdbRating && movieDetails.imdbRating !== "N/A") {
        setImdbRating(movieDetails.imdbRating);
        setImdbVotes(movieDetails.imdbVotes || "");
      }
    });
  }, [movieData?.imdbID]);

  const handleMovieDetails = () => {
    navigate(`/details/${movieData?.imdbID}`);
  }
  const handleBookmarkClick = (movieData) => {
    if(!userKey){
      setIsModalVisible(true);
    }else {
      setSelectedMovie(movieData);
      setIsWatchListModalOpen(true);
    }
  }

  const handleRemoveBookmark = (id) => {
       removeFromWatchList(userKey , listIndex , id );
       handleRemoveMovie(id);
  }

  const shareUrl = () => {
    if (typeof window === "undefined") {
      return "";
    }

    const moviePath = movieData?.imdbID ? `#/details/${movieData.imdbID}` : "#/";
    return `${window.location.origin}${window.location.pathname}${moviePath}`;
  };

  const handleShare = (type) => {
    const url = shareUrl();
    const encodedUrl = encodeURIComponent(url);
    if (type === "whatsapp") {
      window.open(`https://wa.me/?text=${encodedUrl}`, "_blank");
      return;
    }
    if (type === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
      return;
    }
    if (type === "copy") {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      } else {
        toast.error("Copy not supported in this browser.");
      }
      return;
    }
  };
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
              fallback={`${process.env.PUBLIC_URL}/images/icons8-video-100.png`}
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
                  fill="rgb(256,256,256)"
                  d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5z"
                />
                <path
                  fill="rgb(31 32 32)"
                  d="M7.5 4.25v2H6v1h1.5v1.5h1V7.25H10v-1H8.5V4.25h-1z"
                />
              </svg>
            </Tooltip>
          </div> :          <div className="selectedIcon" onClick={() => handleRemoveBookmark(movieData.imdbID)}>
            <Tooltip title="Remove From WatchList">
            <IconTrash size={26} color="#e11d48" />
            </Tooltip>
          </div>
            }
          <div className="shareIcon" onClick={(e) => { e.stopPropagation(); setIsShareOpen(true); }}>
            <Tooltip title="Share">
              <IconShare size={18} color="#111827" />
            </Tooltip>
          </div>
        </div>
        <div className="p-2 movieInfo" onClick={handleMovieDetails}>
          <div className={`fw-medium movieTitle`}>{movieData.Title}</div>
          <div className="releaseYear">Release Year : {movieData?.Year}</div>
          {imdbRating ? (
            <div className="imdbRating">
              <img src={`${process.env.PUBLIC_URL}/images/icons8-imdb-48.png`} alt="IMDb" />
              <span>{imdbRating}/10</span>
              {imdbVotes ? <span className="imdbVotes">({imdbVotes})</span> : null}
            </div>
          ) : null}
        </div>
      </div>
      <Modal
        title="Share WatchLists"
        open={isShareOpen}
        onCancel={() => setIsShareOpen(false)}
        footer={null}
        width={520}
      >
        <div className="shareOptions">
          <Button className="shareBtn shareWhatsapp" onClick={() => handleShare("whatsapp")}>
            <FaWhatsapp /> Share on WhatsApp
          </Button>
          <Button className="shareBtn shareFacebook" onClick={() => handleShare("facebook")}>
            <FaFacebookF /> Share on Facebook
          </Button>
          <Button className="shareBtn shareCopy" onClick={() => handleShare("copy")}>
            <FaLink /> Copy Link
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MovieCard;
