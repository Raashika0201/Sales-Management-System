import { useState } from "react";

const FilterPanel = ({ setParams }) => {
  const [filters, setFilters] = useState({
    region: "",
    gender: "",
    minAge: "",
    maxAge: "",
    category: "",
    tags: "",
    payment: "",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    setParams((prev) => {
      const updated = { ...prev, page: 1 };
      
      if (newFilters.region) {
        updated.region = newFilters.region;
      } else {
        delete updated.region;
      }
      
      if (newFilters.gender) {
        updated.gender = newFilters.gender;
      } else {
        delete updated.gender;
      }
      
      if (newFilters.minAge) {
        updated.minAge = newFilters.minAge;
      } else {
        delete updated.minAge;
      }
      
      if (newFilters.maxAge) {
        updated.maxAge = newFilters.maxAge;
      } else {
        delete updated.maxAge;
      }
      
      if (newFilters.category) {
        updated.category = newFilters.category;
      } else {
        delete updated.category;
      }
      
      if (newFilters.tags) {
        updated.tags = newFilters.tags;
      } else {
        delete updated.tags;
      }
      
      if (newFilters.payment) {
        updated.payment = newFilters.payment;
      } else {
        delete updated.payment;
      }
      
      if (newFilters.startDate) {
        updated.startDate = newFilters.startDate;
      } else {
        delete updated.startDate;
      }
      
      if (newFilters.endDate) {
        updated.endDate = newFilters.endDate;
      } else {
        delete updated.endDate;
      }
      
      return updated;
    });
  };

  const clearFilters = () => {
    setFilters({
      region: "",
      gender: "",
      minAge: "",
      maxAge: "",
      category: "",
      tags: "",
      payment: "",
      startDate: "",
      endDate: "",
    });
    setParams((prev) => {
      const updated = { ...prev, page: 1 };
      delete updated.region;
      delete updated.gender;
      delete updated.minAge;
      delete updated.maxAge;
      delete updated.category;
      delete updated.tags;
      delete updated.payment;
      delete updated.startDate;
      delete updated.endDate;
      return updated;
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Customer Region</label>
        <select
          value={filters.region}
          onChange={(e) => handleFilterChange("region", e.target.value)}
        >
          <option value="">All Regions</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="Central">Central</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Gender</label>
        <select
          value={filters.gender}
          onChange={(e) => handleFilterChange("gender", e.target.value)}
        >
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Age Range</label>
        <div className="age-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.minAge}
            onChange={(e) => handleFilterChange("minAge", e.target.value)}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAge}
            onChange={(e) => handleFilterChange("maxAge", e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Product Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Tags</label>
        <select
          value={filters.tags}
          onChange={(e) => handleFilterChange("tags", e.target.value)}
        >
          <option value="">All Tags</option>
          <option value="organic">Organic</option>
          <option value="portable">Portable</option>
          <option value="casual">Casual</option>
          <option value="skincare">Skincare</option>
          <option value="unisex">Unisex</option>
          <option value="fast">Fast</option>
          <option value="gaming">Gaming</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Payment Method</label>
        <select
          value={filters.payment}
          onChange={(e) => handleFilterChange("payment", e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="Wallet">Wallet</option>
        </select>
      </div>

      <div className="filter-group filter-group-date">
        <label>Date</label>
        <div className="date-range">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <button className="clear-filters-btn" onClick={clearFilters}>
        Clear All
      </button>
    </div>
  );
};

export default FilterPanel;
  