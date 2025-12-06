import { useEffect, useState, useCallback } from "react";
import { fetchSales } from "../services/api";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import SortingDropdown from "../components/SortingDropdown";
import TransactionTable from "../components/TransactionTable";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, sortBy: "transactionIdAsc" });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSales(params);
      console.log("API Response:", res); 
      if (res.success !== false) {
        setSales(res.data || []);
        setPagination(res.pagination || {});
        setStats(res.stats || {
          totalUnitsSold: 0,
          totalAmount: 0,
          totalDiscount: 0,
        });
      } else {
        console.error("API Error:", res.message);
        setSales([]);
        setPagination({});
        setStats({
          totalUnitsSold: 0,
          totalAmount: 0,
          totalDiscount: 0,
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setSales([]);
      setPagination({});
      setStats({
        totalUnitsSold: 0,
        totalAmount: 0,
        totalDiscount: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Sales Management System</h1>
      
      {/* Top Controls */}
      <div className="top-controls">
        <SearchBar setParams={setParams} />
        <SortingDropdown setParams={setParams} />
      </div>

      {/* Filters */}
      <div className="filters-row">
        <FilterPanel setParams={setParams} />
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total units sold</div>
          <div className="stat-value">{stats.totalUnitsSold || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Amount</div>
          <div className="stat-value">
            ₹{Number(stats.totalAmount || 0).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Discount</div>
          <div className="stat-value">
            ₹{Number(stats.totalDiscount || 0).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p className="loader-text">Loading data...</p>
          </div>
        ) : (
          <>
            <TransactionTable data={sales} />
            <Pagination pagination={pagination} setParams={setParams} />
          </>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
