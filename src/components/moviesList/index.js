import React, { useEffect, useState, useRef } from "react";
import style from "../../styles/movieList.module.scss";
import MovieCard from "./movieCard.js";
import { Input, Spin, Pagination, Image, Modal, Button } from "antd";
import { IconSearch, IconDeviceTvFilled, IconShare} from "@tabler/icons-react";
import { FaWhatsapp, FaFacebookF, FaLink, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { fetchMovies } from "../utilis/index..js";
import { toast } from "react-hot-toast";


const { Search } = Input;
const MovieListPage = () => {
  const searchRef = useRef(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("Batman");
  const [moviesList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMovieList, setTotalMovieList] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

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

  const shareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
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
      {loading && (
        <div className="loading-overlay">
          <div className="loading">
            <Spin size="large" />
          </div>
        </div>
      )}
      <div className={`${style.movieListContainer} rounded  h-100 overflow-scroll p-3`}>
        <div className="headingCard rounded p-3">
          <div className="heroHeader">
            <div className="heroHeaderText">
              <div className="cardHeading">
                Your cinematic planner, <span className="mainColor">WatchLists</span>
              </div>
              <div className="cardHeadingAbout">
                Curate, track, and share what you want to watch next - all in one place.
              </div>
            </div>
            <div className="heroSocials">
              <a
                className="heroSocialLink"
                href="https://www.linkedin.com/in/sahil-bisht-234b92226/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                className="heroSocialLink"
                href="https://github.com/sahilbisht890"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>
          <div className="d-flex gap-3 text-white flex-wrap websitePoints mt-3">
            <span
              className="d-flex align-items-center gap-2 btn cursor-pointer"
              onClick={handleButtonClick}
            >
              <IconSearch /><div className='websitePointsLabel'>Browse movies</div> 
            </span>
            <span className="d-flex align-items-center gap-2">
              <IconDeviceTvFilled /> <div className='websitePointsLabel'>Add movies to your watchlist in seconds</div>
            </span>
            <span className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => setIsShareOpen(true)}>
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
            <div className="mt-3 moviesList">
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

export default MovieListPage;
