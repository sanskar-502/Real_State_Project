import "./searchBar.scss";
import { Link, useNavigate } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar({ query, setQuery }) {
  const navigate = useNavigate();
  
  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Input validation for price fields
    if (name === 'minPrice' || name === 'maxPrice') {
      // Immediately reject if too long
      if (value.length > 12) {
        console.warn('Price input too long, truncating');
        e.target.value = value.substring(0, 12);
        return;
      }
      
      // Only allow digits and one decimal point
      if (value && !/^\d*\.?\d*$/.test(value)) {
        console.warn('Invalid characters in price, ignoring');
        e.target.value = query[name]; // Reset to previous value
        return;
      }
      
      // Check numeric value
      if (value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0 || numValue > 10000000000) {
          console.warn('Price out of range, ignoring');
          e.target.value = query[name]; // Reset to previous value
          return;
        }
      }
    }
    
    setQuery((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };
  
  const performSearch = () => {
    // Validate and sanitize query before navigation
    const sanitizedQuery = { ...query };
    
    // Clean up price values
    ['minPrice', 'maxPrice'].forEach(priceField => {
      if (sanitizedQuery[priceField]) {
        const price = parseFloat(sanitizedQuery[priceField]);
        if (isNaN(price) || price < 0 || price > 10000000000) {
          sanitizedQuery[priceField] = '';
        }
      }
    });
    
    const queryParams = new URLSearchParams();
    Object.entries(sanitizedQuery).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });
    
    navigate(`/list?${queryParams.toString()}`);
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>
      <div className="search-fields">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={query.city}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000000}
          placeholder="Min Price"
          value={query.minPrice}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            if (e.target.value.length > 12) {
              e.target.value = e.target.value.substring(0, 12);
            }
          }}
          title="Maximum price: ₹10,000,000,000 (10 billion)"
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000000}
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            if (e.target.value.length > 12) {
              e.target.value = e.target.value.substring(0, 12);
            }
          }}
          title="Maximum price: ₹10,000,000,000 (10 billion)"
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          onClick={(e) => {
            e.preventDefault();
            performSearch();
          }}
        >
          <button type="button" title="Search properties">
            <img src="/search.png" alt="Search" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SearchBar;
