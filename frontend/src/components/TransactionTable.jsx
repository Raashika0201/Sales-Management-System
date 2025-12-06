const TransactionTable = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="no-results">
          <p>No results found.</p>
        </div>
      );
    }
  
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
      } catch {
        return dateString;
      }
    };
  
    const formatAmount = (amount) => {
      if (!amount) return "₹0";
      return `₹${Number(amount).toLocaleString("en-IN")}`;
    };
  
    return (
      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Customer Region</th>
              <th>Customer Type</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Product Category</th>
              <th>Tags</th>
              <th>Quantity</th>
              <th>Price per Unit</th>
              <th>Discount %</th>
              <th>Total Amount</th>
              <th>Final Amount</th>
              <th>Payment Method</th>
              <th>Order Status</th>
              <th>Delivery Type</th>
              <th>Store ID</th>
              <th>Store Location</th>
              <th>Salesperson ID</th>
              <th>Employee name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const transactionId = row.transactionId || row["Transaction ID"] || "-";
              const date = row.date || row["Date"];
              const customerId = row.customerId || row["Customer ID"] || "-";
              const customerName = row.customerName || row["Customer Name"] || "-";
              const phoneNumber = row.phoneNumber || row["Phone Number"] || "-";
              const gender = row.gender || row["Gender"] || "-";
              const age = row.age || row["Age"] || "-";
              const customerRegion = row.customerRegion || row["Customer Region"] || "-";
              const customerType = row.customerType || row["Customer Type"] || "-";
              const productId = row.productId || row["Product ID"] || "-";
              const productName = row.productName || row["Product Name"] || "-";
              const brand = row.brand || row["Brand"] || "-";
              const productCategory = row.productCategory || row["Product Category"] || "-";
              const tags = row.tags || row["Tags"] || [];
              const quantity = row.quantity || row["Quantity"] || 0;
              const pricePerUnit = row.pricePerUnit || row["Price per Unit"] || 0;
              const discountPercentage = row.discountPercentage || row["Discount Percentage"] || 0;
              const totalAmount = row.totalAmount || row["Total Amount"];
              const finalAmount = row.finalAmount || row["Final Amount"];
              const paymentMethod = row.paymentMethod || row["Payment Method"] || "-";
              const orderStatus = row.orderStatus || row["Order Status"] || "-";
              const deliveryType = row.deliveryType || row["Delivery Type"] || "-";
              const storeId = row.storeId || row["Store ID"] || "-";
              const storeLocation = row.storeLocation || row["Store Location"] || "-";
              const salespersonId = row.salespersonId || row["Salesperson ID"] || "-";
              const employeeName = row.employeeName || row["Employee Name"] || "-";
              
              return (
                <tr key={row._id || transactionId}>
                  <td>{transactionId}</td>
                  <td>{formatDate(date)}</td>
                  <td>{customerId}</td>
                  <td>{customerName}</td>
                  <td>
                    <span className="phone-cell">
                      {phoneNumber}
                    </span>
                  </td>
                  <td>{gender}</td>
                  <td>{age}</td>
                  <td>{customerRegion}</td>
                  <td>{customerType}</td>
                  <td>{productId}</td>
                  <td>{productName}</td>
                  <td>{brand}</td>
                  <td>{productCategory}</td>
                  <td>{Array.isArray(tags) ? tags.join(", ") : tags}</td>
                  <td>{String(quantity).padStart(2, "0")}</td>
                  <td className="amount-cell">{formatAmount(pricePerUnit)}</td>
                  <td>{discountPercentage}%</td>
                  <td className="amount-cell">{formatAmount(totalAmount)}</td>
                  <td className="amount-cell">{formatAmount(finalAmount)}</td>
                  <td>{paymentMethod}</td>
                  <td>{orderStatus}</td>
                  <td>{deliveryType}</td>
                  <td>{storeId}</td>
                  <td>{storeLocation}</td>
                  <td>{salespersonId}</td>
                  <td>{employeeName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TransactionTable;
  