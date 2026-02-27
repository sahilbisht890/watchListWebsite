import {Route, Routes } from 'react-router-dom';
import MovieListPage from '../moviesList/index';
import MovieDetails from '../moviesList/movieDetails';
import SideBar from '../sidebar/index'
import WatchListPage from '../moviesList/userWatchList';
const HomePage = () => {

    return (
            <div className="homePageContainer">
                <div className="homeGrid">
                    <aside className="homeSidebar">
                        <SideBar/> 
                    </aside>
                    <main className="homeMain"> 
                        <Routes>
                            <Route path="/" element={<MovieListPage />} />
                            <Route path="/details/:imdbID" element={<MovieDetails/>} />
                            <Route path="/watchList/:listIndex" element={<WatchListPage/>} />
                        </Routes>
                    </main>
                </div>
            </div>
    );
};

export default HomePage;
