import { Routes, Route, useMatch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRoute from "./components/AdminRoute";
import AdminShows from "./pages/admin/AdminShows";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const isSeatLayoutPage = useMatch(
    "/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout",
  );

  const isCheckoutPage = useMatch("/shows/:showId/:state/checkout");

  return (
    <div className="flex flex-col min-h-screen">
      {!isSeatLayoutPage && !isCheckoutPage && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
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
          <Route path="/shows/:showId/:state/checkout" element={<Checkout />} />
          <Route path="/booking-success" element={<BookingSuccess />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* Default route when visiting /admin */}
            <Route index element={<AdminDashboard />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="shows" element={<AdminShows />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </main>

      {!isSeatLayoutPage && !isCheckoutPage && <Footer />}
    </div>
  );
}

export default App;
