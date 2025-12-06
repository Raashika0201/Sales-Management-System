import { useState } from "react";

const SortingDropdown = ({ setParams }) => {
  const [sortBy, setSortBy] = useState("transactionIdAsc");

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setParams((prev) => ({ ...prev, sortBy: value, page: 1 }));
  };

  return (
    <div className="sorting-dropdown">
      <label>Sort by:</label>
      <select value={sortBy} onChange={handleSortChange}>
        <option value="date">Date (Newest First)</option>
        <option value="dateAsc">Date (Oldest First)</option>
        <option value="transactionId">Transaction ID (High to Low)</option>
        <option value="transactionIdAsc">Transaction ID (Low to High)</option>
        <option value="customerName">Customer Name (A-Z)</option>
        <option value="customerNameDesc">Customer Name (Z-A)</option>
        <option value="totalAmount">Total Amount (High to Low)</option>
        <option value="totalAmountAsc">Total Amount (Low to High)</option>
        <option value="quantity">Quantity (High to Low)</option>
        <option value="quantityAsc">Quantity (Low to High)</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
  