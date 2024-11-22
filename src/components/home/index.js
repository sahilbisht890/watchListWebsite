import {Route, Routes } from 'react-router-dom';
import MovieListPage from '../moviesList/index';
import MovieDetails from '../moviesList/movieDetails';
import SideBar from '../sidebar/index'
import WatchListPage from '../moviesList/userWatchList';
const HomePage = () => {

    return (
            <div className="homePageContainer p-4 h-100">
                <div className="row w-100 h-100">
                    <div className="col-md-3 h-100">
                        <SideBar/> 
                    </div>
                    <div className="col-md-9 h-100"> 
                        <Routes>
                            <Route path="/" element={<MovieListPage />} />
                            <Route path="/details/:imdbID" element={<MovieDetails/>} />
                            <Route path="/watchList/:listIndex" element={<WatchListPage/>} />
                        </Routes>
                    </div>
                </div>
            </div>
    );
};

export default HomePage;
