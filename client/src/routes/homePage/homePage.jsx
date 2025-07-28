import { useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
// Add icon imports
import { FaTrophy, FaHome, FaRegCalendarAlt } from "react-icons/fa";

const defaultQuery = {
  type: "buy",
  city: "",
  minPrice: "",
  maxPrice: "",
};

function HomePage() {
  const [query, setQuery] = useState(defaultQuery);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Unlock Your Perfect Home: Where Dreams Meet Reality</h1>
          <p className="subtitle">
            Discover the best properties, connect with trusted agents, and make your next move with confidence. Your dream home is just a search away.
          </p>
          <SearchBar query={query} setQuery={setQuery} />
          <div className="boxes">
            <div className="box">
              <div className="icon"><FaRegCalendarAlt /></div>
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <div className="icon"><FaTrophy /></div>
              <h1>200</h1>
              <h2>Awards Gained</h2>
            </div>
            <div className="box">
              <div className="icon"><FaHome /></div>
              <h1>2000+</h1>
              <h2>Properties Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <div className="imgOverlay"></div>
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
