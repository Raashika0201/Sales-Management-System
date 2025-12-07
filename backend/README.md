# Backend

## Overview
This backend powers the TruEstate Sales Dashboard by providing scalable APIs for searching, filtering, sorting, pagination, and analytics over large transaction datasets (1M+ records). It is designed for high performance and clean separation of concerns.

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas

## Features
- Advanced search with field-level control
- Multiple filter combinations
- Server-side sorting
- Scalable pagination
- Aggregation-based statistics (total sales, discounts, quantities)
- Data normalization for optimized querying

## API Endpoint
- GET /api/sales


### Query Parameters Supported
- `page`
- `limit`
- `sortBy`
- `search`
- `searchField`
- `region`
- `gender`
- `minAge`, `maxAge`
- `category`
- `startDate`, `endDate`
- `paymentMethod`

## Architecture Overview
- **Routes** handle API endpoints
- **Controllers** manage request/response
- **Services** handle business logic and aggregation
- **Utils** build dynamic queries, sorting, and pagination
- **Models** define MongoDB schemas
- **Normalization Script** cleans raw CSV data into optimized structure

## Setup Instructions

1. Install dependencies:
```npm install ```

2. Create .env file
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the server
``` node src/index.js```

4. Run data normalization (only once after CSV import):
```node src/utils/normalizeSalesData.js```






