const getPagination = (page = 1, limit = 10) => {
    const skip = (Number(page) - 1) * Number(limit);
    return { skip, limit: Number(limit) };
  };
  
module.exports = getPagination;
  