import { useParams } from "react-router-dom";
import { fetchMoviesDetails } from "../utilis/index.";
import { useEffect, useState } from "react";
import style from "../../styles/movieList.module.scss";
import { Image, Tooltip, Spin } from "antd";
import { IconStarFilled } from "@tabler/icons-react";
import WatchList from "../watchListForm/watchList";
import LoginFormModal from "../loginForm";
import { useGlobalContext } from "../../globalProvider";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userKey} = useGlobalContext();

  
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [buttonText, setButtonText] = useState("unlock");
 const [isWatchListModalOpen, setIsWatchListModalOpen] = useState(false);
 const [selectedMovie , setSelectedMovie] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchMoviesDetails(imdbID).then((movieData) => {
      setMovieDetails(movieData);
      const temp = {
        "Title": movieData?.Title,
        "Year": movieData?.Year,
        "imdbID": movieData?.imdbID,
        "Type": "movie",
        "Poster": movieData?.Poster
      }
      setSelectedMovie(temp);
      setLoading(false);
    });
  }, [imdbID]);

  const handleBookmarkClick = ( ) => {
    if(!userKey){
      setIsModalVisible(true);
    }else {
      setIsWatchListModalOpen(true);
    }
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
      {loading ? (
        <div className="loading-overlay">
          <div className="loading">
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <div className={`${style.movieDetails} h-100 w-100 p-2`}>
          <div className="w-100 d-flex gap-2 align-items-end flex-wrap">
            <div className="movieTitle">{movieDetails?.Title}</div>
            {movieDetails?.Year !== "N/A" && (
              <div className="releaseYear fw-medium">{movieDetails?.Year}</div>
            )}
            {movieDetails?.Rated === "R" && (
              <div className="rRated  fw-medium rounded">R</div>
            )}
          </div>
          <div className="row w-100 mt-4">
            <div className="col-md-3">
              <div className="position-relative d-flex align-items-center justify-content-center h-100">
                {movieDetails?.Poster === "N/A" ? (
                  <Image src={`${process.env.PUBLIC_URL}/images/icons8-video-100.png`} preview={false} />
                ) : (
                  <Image
                    src={movieDetails?.Poster}
                    height={"100%"}
                    width={"100%"}
                    alt={movieDetails?.Title}
                    fallback={`${process.env.PUBLIC_URL}/images/icons8-video-100.png`}
                  />
                )}
                <div className="bookmarkIcon" onClick={handleBookmarkClick}>
                  <Tooltip title="Add to WatchList">
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
                </div>
              </div>
            </div>
            <div className="col-md-9 ps-4">
              <div className="movieInfo">
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Cast : </div>
                  <div className="infoValue fw-medium highlightInfo">
                    {movieDetails?.Actors || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Director : </div>
                  <div className="infoValue fw-medium highlightInfo">
                    {movieDetails?.Director || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Writer : </div>
                  <div className="infoValue fw-medium">
                    {movieDetails?.Writer || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Language : </div>
                  <div className="infoValue fw-medium highlightInfo">
                    {movieDetails?.Language || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Country : </div>
                  <div className="infoValue fw-medium">
                    {movieDetails?.Country || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Release Date : </div>
                  <div className="infoValue fw-medium">
                    {movieDetails?.Released || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Genre : </div>
                  <div className="infoValue fw-medium highlightInfo">
                    {movieDetails?.Genre || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Runtime : </div>
                  <div className="infoValue fw-medium">
                    {movieDetails?.Runtime || "-"}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="infoLabel fw-medium">Awards : </div>
                  <div className="infoValue fw-medium">
                    {movieDetails?.Awards || "-"}
                  </div>
                </div>
                {movieDetails?.imdbRating !== "N/A" && (
                  <div className="d-flex gap-2 align-items-center">
                    <div>
                      <Image src={`${process.env.PUBLIC_URL}/images/icons8-imdb-48.png`} preview={false} />
                    </div>
                    <div className="infoValue fw-medium">
                      <IconStarFilled size={18} color="#f5c518" />{" "}
                      {movieDetails?.imdbRating
                        ? `${movieDetails.imdbRating}/10 ${
                            movieDetails?.imdbVotes
                              ? `(${movieDetails.imdbVotes} Votes)`
                              : ""
                          }`
                        : "-"}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {movieDetails?.Plot !== "N/A" && (
              <div className="w-100 mt-4">
                <div className="infoLabel fw-medium">Plot</div>
                <div className="moviePlot fw-medium">{movieDetails?.Plot}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetails;
