const Pagination = ({ pagination, setParams }) => {
    if (!pagination?.totalPages || pagination.totalPages <= 1) return null;
  
    const currentPage = parseInt(pagination.currentPage, 10);
    const totalPages = parseInt(pagination.totalPages, 10);
    const maxVisible = 6;
  
    const getPageNumbers = () => {
      const pages = [];
  
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
  
      if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
      }
  
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      return pages;
    };
  
    const handlePageChange = (page) => {
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        setParams((prev) => ({
          ...prev,
          page: Number(page),
        }));
      }
    };
  
    const handlePrev = () => {
      if (currentPage > 1) {
        setParams((prev) => ({
          ...prev,
          page: currentPage - 1,
        }));
      }
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) {
        setParams((prev) => ({
          ...prev,
          page: currentPage + 1,
        }));
      }
    };
  
    return (
      <div className="pagination">
        <button className="pagination-btn" onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </button>
  
        <div className="pagination-numbers">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
  
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;
  