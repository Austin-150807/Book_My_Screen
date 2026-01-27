import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";

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
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
