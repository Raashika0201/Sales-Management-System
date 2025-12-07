import { useState } from "react";

const SearchBar = ({ setParams }) => {
  const [value, setValue] = useState("");
  const [searchField, setSearchField] = useState("customerName");

  const searchFields = [
    { value: "transactionId", label: "Transaction ID" },
    { value: "customerId", label: "Customer ID" },
    { value: "customerName", label: "Customer Name" },
    { value: "phoneNumber", label: "Phone Number" },
    { value: "age", label: "Age" },
    { value: "productCategory", label: "Product Category" },
    { value: "quantity", label: "Quantity" },
    { value: "totalAmount", label: "Total Amount" },
    { value: "customerRegion", label: "Customer Region" },
    { value: "productId", label: "Product ID" },
    { value: "employeeName", label: "Employee Name" },
  ];

  const handleSearch = (e) => {
    const text = e.target.value;
    setValue(text);
    setParams((prev) => {
      const updated = { ...prev, page: 1 };
      if (text.trim()) {
        updated.search = text;
        updated.searchField = searchField;
      } else {
        delete updated.search;
        delete updated.searchField;
      }
      return updated;
    });
  };

  const handleFieldChange = (e) => {
    const field = e.target.value;
    setSearchField(field);
    setParams((prev) => {
      const updated = { ...prev, page: 1 };
      if (value.trim()) {
        updated.search = value;
        updated.searchField = field;
      } else {
        delete updated.search;
        delete updated.searchField;
      }
      return updated;
    });
  };

  return (
    <div className="search-bar">
      <select
        className="search-field-select"
        value={searchField}
        onChange={handleFieldChange}
      >
        {searchFields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder={`Search in ${searchFields.find((f) => f.value === searchField)?.label}...`}
        value={value}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
