import { useState, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Safe initialization with validation
  const initializeQuery = () => {
    const validatePrice = (price) => {
      if (!price) return "";
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0 || numPrice > 10000000000) return "";
      if (price.length > 15) return "";
      return price;
    };
    
    return {
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      property: searchParams.get("property") || "",
      minPrice: validatePrice(searchParams.get("minPrice")),
      maxPrice: validatePrice(searchParams.get("maxPrice")),
      bedroom: searchParams.get("bedroom") || "",
    };
  };
  
  const [query, setQuery] = useState(initializeQuery);

  const [resultCount, setResultCount] = useState(0);
  
  // Clean up URL parameters on component mount
  useEffect(() => {
    const currentQuery = initializeQuery();
    const originalMinPrice = searchParams.get("minPrice");
    const originalMaxPrice = searchParams.get("maxPrice");
    
    // Check if we sanitized any parameters
    const needsCleaning = (
      (originalMinPrice && originalMinPrice !== currentQuery.minPrice) ||
      (originalMaxPrice && originalMaxPrice !== currentQuery.maxPrice)
    );
    
    if (needsCleaning) {
      console.warn('Detected malicious URL parameters, cleaning up...');
      setSearchParams(currentQuery, { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Comprehensive input validation
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
    
    // General validation for all inputs
    if (typeof value === 'string' && value.length > 100) {
      console.warn('Input too long, truncating');
      e.target.value = value.substring(0, 100);
      return;
    }
    
    setQuery({
      ...query,
      [name]: value,
    });
  };

  const handleFilter = () => {
    // Final validation before sending to server
    const sanitizedQuery = { ...query };
    
    // Ensure price values are within safe limits
    if (sanitizedQuery.minPrice) {
      const minPrice = parseFloat(sanitizedQuery.minPrice);
      if (isNaN(minPrice) || minPrice < 0 || minPrice > 10000000000) {
        delete sanitizedQuery.minPrice;
      }
    }
    
    if (sanitizedQuery.maxPrice) {
      const maxPrice = parseFloat(sanitizedQuery.maxPrice);
      if (isNaN(maxPrice) || maxPrice < 0 || maxPrice > 10000000000) {
        delete sanitizedQuery.maxPrice;
      }
    }
    
    setSearchParams(sanitizedQuery);
  };

  const clearFilters = () => {
    const clearedQuery = {
      type: "",
      city: "",
      property: "",
      minPrice: "",
      maxPrice: "",
      bedroom: "",
    };
    setQuery(clearedQuery);
    setSearchParams(clearedQuery);
  };

  const removeFilter = (key) => {
    const newQuery = { ...query, [key]: "" };
    setQuery(newQuery);
    setSearchParams(newQuery);
  };

  const getActiveFilters = () => {
    return Object.entries(query).filter(([key, value]) => value && value !== "");
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city") || "all locations"}</b>
      </h1>
      
      {resultCount > 0 && (
        <div className="searchSummary">
          <span>Found</span>
          <span className="resultCount">{resultCount} properties</span>
          <span>matching your criteria</span>
        </div>
      )}

      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city or location"
            onChange={handleChange}
            value={query.city}
          />
        </div>
      </div>

      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Listing Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">Any type</option>
            <option value="buy">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="property">Property Type</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            value={query.property}
          >
            <option value="">Any property</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="minPrice">Min Price (₹)</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Min price"
            onChange={handleChange}
            onInput={(e) => {
              if (e.target.value.length > 12) {
                e.target.value = e.target.value.substring(0, 12);
              }
            }}
            value={query.minPrice}
            min="0"
            max="10000000000"
            step="1000"
            title="Maximum price: ₹10,000,000,000 (10 billion)"
          />
        </div>

        <div className="item">
          <label htmlFor="maxPrice">Max Price (₹)</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Max price"
            onChange={handleChange}
            onInput={(e) => {
              if (e.target.value.length > 12) {
                e.target.value = e.target.value.substring(0, 12);
              }
            }}
            value={query.maxPrice}
            min="0"
            max="10000000000"
            step="1000"
            title="Maximum price: ₹10,000,000,000 (10 billion)"
          />
        </div>

        <div className="item">
          <label htmlFor="bedroom">Bedrooms</label>
          <select
            name="bedroom"
            id="bedroom"
            onChange={handleChange}
            value={query.bedroom}
          >
            <option value="">Any</option>
            <option value="1">1 bedroom</option>
            <option value="2">2 bedrooms</option>
            <option value="3">3 bedrooms</option>
            <option value="4">4+ bedrooms</option>
          </select>
        </div>

        <button onClick={handleFilter}>
          <img src="/search.png" alt="Search" />
          Search
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="filterTags">
          {activeFilters.map(([key, value]) => (
            <div key={key} className="filterTag">
              <span>
                {key === "type" && value === "buy" && "For Sale"}
                {key === "type" && value === "rent" && "For Rent"}
                {key === "property" && value}
                {key === "minPrice" && `Min ₹${value}`}
                {key === "maxPrice" && `Max ₹${value}`}
                {key === "bedroom" && `${value} bed${value > 1 ? 's' : ''}`}
                {key === "city" && value}
              </span>
              <button
                className="removeTag"
                onClick={() => removeFilter(key)}
                title="Remove filter"
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="filterTag"
            onClick={clearFilters}
            style={{ background: "#fee2e2", color: "#dc2626", borderColor: "#fecaca" }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default Filter;
