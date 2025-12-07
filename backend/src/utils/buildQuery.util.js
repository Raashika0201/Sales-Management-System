const buildQuery = (params) => {
    const {
      search,
      searchField,
      region,
      customerRegion,
      gender,
      minAge,
      maxAge,
      category,
      productCategory,
      tags,
      payment,
      paymentMethod,
      startDate,
      endDate,
    } = params;
  
    const finalRegion = region || customerRegion;
    const finalCategory = category || productCategory;
    const finalPayment = payment || paymentMethod;
  
    let query = {};
  
    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      const selectedField = searchField || "customerName"; 

      const fieldMap = {
        transactionId: { dbFields: ["Transaction ID", "transactionId"], isNumeric: true },
        date: { dbFields: ["Date", "date"], isNumeric: false },
        customerId: { dbFields: ["Customer ID", "customerId"], isNumeric: false },
        customerName: { dbFields: ["Customer Name", "customerName"], isNumeric: false },
        phoneNumber: { dbFields: ["Phone Number", "phoneNumber"], isNumeric: false, isPhone: true },
        gender: { dbFields: ["Gender", "gender"], isNumeric: false },
        age: { dbFields: ["Age", "age"], isNumeric: true },
        productCategory: { dbFields: ["Product Category", "productCategory"], isNumeric: false },
        quantity: { dbFields: ["Quantity", "quantity"], isNumeric: true },
        totalAmount: { dbFields: ["Total Amount", "totalAmount"], isNumeric: true },
        customerRegion: { dbFields: ["Customer Region", "customerRegion"], isNumeric: false },
        productId: { dbFields: ["Product ID", "productId"], isNumeric: false },
        employeeName: { dbFields: ["Employee Name", "employeeName"], isNumeric: false },
      };

      if (fieldMap[selectedField]) {
        const fieldInfo = fieldMap[selectedField];
        const { dbFields, isNumeric, isPhone } = fieldInfo;

        if (isPhone) {
          const digitsOnly = searchTerm.replace(/\D/g, "");
          
          const phoneConditions = [];
          
          dbFields.forEach(field => {
            if (digitsOnly.length > 0) {
              phoneConditions.push({ [field]: new RegExp(digitsOnly, "i") });
            }
            
            const escapedOriginal = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            if (escapedOriginal !== digitsOnly) {
              phoneConditions.push({ [field]: new RegExp(escapedOriginal, "i") });
            }
          });
          
          if (query.$or) {
            const existingOr = query.$or;
            delete query.$or;
            query.$and = query.$and || [];
            query.$and.push({ $or: existingOr });
            query.$and.push({ $or: phoneConditions });
          } else if (query.$and) {
            query.$and.push({ $or: phoneConditions });
          } else {
            query.$or = phoneConditions;
          }
          
        } else if (isNumeric) {
          if (!isNaN(searchTerm)) {
            const numericConditions = [];
            dbFields.forEach(field => {
              numericConditions.push({ [field]: Number(searchTerm) });
            });
            
            if (query.$or) {
              const existingOr = query.$or;
              delete query.$or;
              query.$and = query.$and || [];
              query.$and.push({ $or: existingOr });
              query.$and.push({ $or: numericConditions });
            } else {
              query.$or = numericConditions;
            }
          }
        } else {
          const regex = new RegExp(searchTerm, "i");
          const textConditions = [];
          dbFields.forEach(field => {
            textConditions.push({ [field]: regex });
          });
          
          if (query.$or) {
            const existingOr = query.$or;
            delete query.$or;
            query.$and = query.$and || [];
            query.$and.push({ $or: existingOr });
            query.$and.push({ $or: textConditions });
          } else {
            query.$or = textConditions;
          }
        }
      }
    }
  
    if (finalRegion) query["Customer Region"] = finalRegion;
  
    if (gender) query["Gender"] = gender;
  
    if (minAge || maxAge) {
      query["Age"] = {};
      if (minAge) query["Age"].$gte = Number(minAge);
      if (maxAge) query["Age"].$lte = Number(maxAge);
    }
  
    if (finalCategory) query["Product Category"] = finalCategory;
  
    if (tags) {
      const tagRegex = new RegExp(tags, "i");
      const tagConditions = [
        { tags: { $elemMatch: { $regex: tagRegex } } },
        { "Tags": tagRegex }
      ];
      
      if (query.$or) {
        const existingOr = query.$or;
        delete query.$or;
        query.$and = query.$and || [];
        query.$and.push({ $or: existingOr });
        query.$and.push({ $or: tagConditions });
      } else {
        query.$or = tagConditions;
      }
    }
  
    if (finalPayment) query["Payment Method"] = finalPayment;
  
    if (startDate || endDate) {
      const dateQuery = {};
      
      if (startDate) {
        dateQuery.$gte = startDate;
      }
      
      if (endDate) {
        dateQuery.$lte = endDate;
      }
      
      if (Object.keys(dateQuery).length > 0) {
        const dateConditions = [
          { "Date": dateQuery },
          { "date": dateQuery }
        ];
        
        if (query.$or) {
          const existingOr = query.$or;
          delete query.$or;
          query.$and = query.$and || [];
          query.$and.push({ $or: existingOr });
          query.$and.push({ $or: dateConditions });
        } else {
          query.$or = dateConditions;
        }
      }
    }
  
    return query;
  };
  
  module.exports = buildQuery;
  