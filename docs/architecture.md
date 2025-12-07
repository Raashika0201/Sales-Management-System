# Retail Sales Management System

---

## 1. Backend Architecture

The backend of the Sales Management System is built using **Node.js, Express, and MongoDB Atlas** and follows a **layered architecture** to ensure scalability, performance, and clean separation of responsibilities.

### Backend Flow

Client → Routes → Controllers → Services → Utilities → MongoDB

---

### Entry Point: `index.js`
- Initializes the Express server
- Loads environment variables using `dotenv`
- Applies middlewares (`cors`, `express.json`)
- Establishes MongoDB Atlas connection using Mongoose
- Registers API routes
- Starts the server

---

### Routes Layer (`sales.routes.js`)
- Defines API endpoints
- Maps routes directly to controllers  
Example:
GET /api/sales → getSales Controller

---

### Controller Layer (`sales.controller.js`)
- Handles incoming HTTP requests
- Extracts query parameters from `req.query`
- Calls the service layer for business logic
- Sends formatted JSON responses
- Handles server errors safely

---

### Service Layer (`sales.services.js`)
This is the **core business logic layer**.

Responsibilities:
- Builds dynamic MongoDB queries
- Applies filtering, searching, sorting, and pagination
- Executes aggregation pipelines
- Handles large datasets using `allowDiskUse(true)`
- Calculates statistics:
  - Total Units Sold
  - Total Sales Amount
  - Total Discount

All pagination limits and page boundaries are validated before execution.

---

### Utility Layer (`utils/`)
This layer prevents logic duplication and keeps the service layer clean.

- `buildQuery.util.js`
  - Builds dynamic search and filter queries
  - Supports regex-based text search
  - Supports exact matching for numeric fields
  - Handles date ranges and tag filtering

- `sort.util.js`
  - Maps frontend sorting keys to MongoDB sort objects

- `pagination.util.js`
  - Converts page + limit into MongoDB `skip` and `limit`

---

### Database Layer (`sales.model.js`)
- Defines the Sale schema using Mongoose
- Stores normalized camelCase fields
- Indexes frequently searched fields:
  - customerName
  - phoneNumber
  - gender
  - customerRegion
  - productCategory
  - paymentMethod
- Optimized for 1M+ records

---

### Data Normalization Script (`normalizeSalesData.js`)
- Converts raw CSV-imported fields into normalized camelCase fields
- Converts string numbers to actual numbers
- Splits tags into arrays
- Ensures consistent schema for indexing and querying

---

## 2. Frontend Architecture

The frontend is built using **React with Vite** and follows a **component-driven architecture**.

---

### High-Level Component Structure

Dashboard (State Manager)
├── SearchBar  
├── FilterPanel  
├── SortingDropdown  
├── TransactionTable  
└── Pagination  

---

### Page Layer (`Dashboard.jsx`)
- Maintains global query state (`params`)
- Maintains sales data and pagination state
- Calls backend API using `fetchSales`
- Re-fetches data when:
  - Search changes
  - Filters change
  - Sorting changes
  - Page changes
- Passes handlers and state to child components

This ensures **predictable state flow** using the lifted state concept.

---

### Components

- `SearchBar.jsx`
  - Field-based search selection
  - Updates backend query dynamically
  - Resets pagination on every new search

- `FilterPanel.jsx`
  - Supports:
    - Region
    - Gender
    - Age Range
    - Product Category
    - Tags
    - Payment methods
    - Date Range
  - Supports clearing all filters

- `SortingDropdown.jsx`
  - Controls server-side sorting
  - Resets pagination when sorting changes

- `TransactionTable.jsx`
  - Renders sales data in tabular form
  - Displays "No Results Found" for empty datasets
  - Formats currency and dates properly

- `Pagination.jsx`
  - Controls page navigation
  - Shows active page
  - Uses Previous / Next navigation
  - Dynamically limits visible page buttons

---

### API Layer (`api.js`)
- Builds clean query strings
- Reads API base URL from environment variables
- Handles fetch requests and response parsing
- Centralizes API logic outside UI components

---

## 3. Data Flow

User Action → UI Component → API Service → Express Route → Controller → Service → MongoDB  
MongoDB → Service → Controller → API Response → UI Render

All heavy operations such as:
- Searching
- Filtering
- Sorting
- Pagination  
are performed on the **backend** for performance optimization.

---

## 4. Folder Structure

### Backend
backend/ 
│── src/ 
│ ├── config/
│ ├── controllers/ 
│ ├── models/ 
│ ├── routes/ 
│ ├── services/ 
│ ├── utils/ 
│ ├── index.js

### Frontend 
frontend/ 
│── src/ 
│ ├── components/ 
│ ├── pages/ 
│ ├── routes/
│ ├── services/ 
│ ├── styles/
│ ├── App.jsx 
│ ├── main.jsx


## 5. Module Responsibilities

- **Routes:** Define API endpoints and connect requests to controllers.
- **Controllers:** Handle incoming requests, call services, and return API responses.
- **Services:** Contain core business logic for search, filtering, sorting, pagination, and aggregation.
- **Utils:** Reusable helpers for building MongoDB queries, sorting rules, and pagination logic.
- **Models:** Define MongoDB schema, enforce structure, and optimize fields with indexes.
- **Data Normalization Script:** Converts raw CSV data into clean, searchable, optimized fields.
- **Frontend Pages:** Manage API calls, global state, and layout (e.g., Dashboard).
- **Frontend Components:** Handle UI interactions like search, filters, sorting, table rendering, and pagination.
- **API Service (Frontend):** Builds query params, calls backend APIs, and handles responses.


