# Retail Sales Management System

## 1. Overview
This is a full-stack Sales Management System built to analyze and manage large-scale transaction data (1M+ records).  
It supports real-time search, advanced filtering, sorting, pagination, and statistics calculation.  
The system is optimized for performance with server-side processing and MongoDB aggregation.
Also included the stats for the total items sold only when Order status is Completed.

**Live Application URL:**  
https://sales-management-system-frontend-oyjy.onrender.com/

## 2. Tech Stack
- Frontend: React (Vite), CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- ORM: Mongoose

## 3. Search Implementation Summary
The search functionality is implemented using a dynamic, field-based query generator on the backend.  
The frontend allows users to select a specific field (such as Transaction ID, Customer Name, Phone Number, Product Category, or Region) and enter a search value.  
This data is sent as query parameters to the backend.

On the backend:
- For **text-based fields**, MongoDB `$regex` queries with case-insensitive matching are used.
- For **numeric fields** (such as `transactionId`, `age`, `quantity`, and `totalAmount`), exact numeric matching is applied.
- Phone number search normalizes digits and performs partial matching to allow flexible input formats.
- All search logic is centralized inside a single `buildQuery` utility to avoid duplication and ensure consistency.

This design allows efficient and scalable searching across large datasets.

---

## 4. Filter Implementation Summary
Filtering is executed entirely on the backend to maintain performance with large data volumes.  
The frontend provides filters for:
- Customer Region  
- Gender  
- Age Range (Min–Max)  
- Product Category 
- Tags
- Payment Method 
- Date Range  

The backend dynamically constructs a MongoDB query using:
- `$gte` and `$lte` for numeric and date ranges  
- Direct equality for categorical filters such as gender and region  

Multiple filters can be combined safely without overwriting each other.  
If filters conflict or result in zero matching records, the API returns an empty dataset instead of throwing errors.

---

## 5. Sorting Implementation Summary
Sorting is implemented server-side to prevent browser performance issues caused by large datasets.  
The frontend sends the selected sort option as a `sortBy` query parameter.

On the backend:
- A centralized `buildSort` utility maps frontend sort keys to MongoDB sort objects.
- Sorting supports:
  - Date (Ascending & Descending)
  - Transaction ID (Ascending & Descending)
  - Customer Name (Ascending & Descending)
  - Total Amount (Ascending & Descending)
  - Quantity (Ascending & Descending)

This ensures stable and consistent sorting regardless of dataset size.

---

## 6. Pagination Implementation Summary
Pagination is handled entirely on the backend using MongoDB’s `skip` and `limit` strategy.  

Logic Flow:
- The API calculates `skip` using:  
  `(currentPage - 1) * limit`
- Only the required records for the selected page are fetched from the database.
- The total document count is calculated using `countDocuments()` and converted into `totalPages`.

On the frontend:
- Pagination state is maintained using React state.
- Previous, Next, and numbered page buttons dynamically update the active page.
- Page values are validated to prevent out-of-range navigation.

This approach allows smooth navigation even with 1M+ records without performance degradation.


## 7. Setup Instructions
1. Clone the repository.
2. Setup backend:
   - Navigate to `/backend`
   - Install dependencies using `npm install`
   - Create `.env` file with MongoDB URI
   - Run `node src/index.js`
3. Setup frontend:
   - Navigate to `/frontend`
   - Install dependencies using `npm install`
   - Create `.env` file with API base URL
   - Run `npm run dev`
4. Open browser at `http://localhost:5173`
