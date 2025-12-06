const buildSort = (sortBy) => {
    switch (sortBy) {
      case "date":
        return { "Date": -1 }; 
  
      case "dateAsc":
        return { "Date": 1 }; 
  
      case "transactionId":
        return { "Transaction ID": -1 }; 
  
      case "transactionIdAsc":
        return { "Transaction ID": 1 }; 
  
      case "customerName":
        return { "Customer Name": 1 }; 
  
      case "customerNameDesc":
        return { "Customer Name": -1 }; 
  
      case "totalAmount":
        return { "Total Amount": -1 };
  
      case "totalAmountAsc":
        return { "Total Amount": 1 }; 
  
      case "quantity":
        return { "Quantity": -1 }; 
  
      case "quantityAsc":
        return { "Quantity": 1 }; 
  
      default:
        return { "Date": -1 };
    }
  };
  
  module.exports = buildSort;
  