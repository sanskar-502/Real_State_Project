import { useState, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const [resultCount, setResultCount] = useState(0);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
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
            value={query.minPrice}
            min="0"
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
            value={query.maxPrice}
            min="0"
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
