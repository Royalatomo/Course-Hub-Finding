import "./App.scss";
import Header from "./components/Header";
import Home from "./Pages/Home/Main";
import Result from "./Pages/Result/Main";
import Course from "./Pages/Course/Main";
import Collection from "./Pages/Collection/Main";
import Categories from "./Pages/Categories/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Result />} />
          <Route path="/course" element={<Course />} />
          <Route path="/favourite" element={<Collection fav={true} />} />
          <Route path="/recent" element={<Collection fav={false} />} />
          <Route path="/cat" element={<Categories />} />
        </Routes>
        <div style={{ marginTop: "5rem" }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
