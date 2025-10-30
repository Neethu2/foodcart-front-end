import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import SigninFormik from "./pages/signup-signIn/SigninFormik";
import Register from "./pages/signup-signIn/Register";
import "./assets/styles/style.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<SigninFormik />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="tvshows" element={<TVShows />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
