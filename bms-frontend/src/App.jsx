import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<h1>profile Page</h1>} />
            <Route path="/movies" element={<Movies />} />
            <Route
              path="/movies/:state/:movieName/:id/ticket"
              element={<MovieDetails />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
              element={<SeatLayout />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
