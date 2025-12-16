import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Component Imports
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";

// --- CATEGORIES LIST ---
const CATEGORIES = [
  'Uncategorized', 
  'Food', 
  'Salary', 
  'Rent', 
  'Travel', 
  'Utilities', 
  'Debt Payment', 
  'Investment', 
  'Other',
  'Health & Wellness',
  'Shopping',
  'Entertainment',
  'Gifts & Donations',
  'Education',
  'Transportation',
];

// Simple icon mapping for display
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food': return '🍔';
    case 'Salary': return '💰';
    case 'Rent': return '🏠';
    case 'Travel': return '✈️';
    case 'Utilities': return '💡';
    case 'Debt Payment': return '💳';
    case 'Investment': return '📈';
    case 'Health & Wellness': return '💊'; 
    case 'Shopping': return '🛍️';         
    case 'Entertainment': return '🎬';      
    case 'Gifts & Donations': return '🎁'; 
    case 'Education': return '📚';        
    case 'Transportation': return '🚗';     
    default: return '🛒';
  }
};

// Utility: Calculate Analytics 
const calculateAnalytics = (expenses) => {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals = {};
  
  const monthlyTrends = {};
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = date.toISOString().slice(0, 7); // YYYY-MM
      monthlyTrends[monthYear] = { income: 0, expense: 0, label: date.toLocaleString('default', { month: 'short', year: '2-digit' }) };
  }

  expenses.forEach(exp => {
      const amount = Number(exp.amount);
      const expMonthYear = exp.date.slice(0, 7);
      const categoryName = exp.category || 'Uncategorized';

      // 1. Overall & Category Totals
      if (exp.type === 'income') {
          totalIncome += amount;
      } else {
          totalExpenses += amount;
          categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
      }

      // 2. Monthly Trends Calculation
      if (monthlyTrends[expMonthYear]) {
          monthlyTrends[expMonthYear][exp.type] += amount;
      }
  });

  const currentBalance = totalIncome - totalExpenses;
  
  const sortedTrends = Object.keys(monthlyTrends)
      .sort()
      .map(monthYear => monthlyTrends[monthYear]);

  return { 
    totalIncome, 
    totalExpenses, 
    currentBalance, 
    categoryTotals,
    monthlyTrendData: sortedTrends,
  };
};

function App() {
  const [expenses, setExpenses] = useState([]);

  // --- CENTRALIZED FILTERING STATES ---
  const [filterType, setFilterType] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [startDate, setStartDate] = useState('');     
  const [endDate, setEndDate] = useState('');       

  // *** HANDLER TO RESET ALL FILTERS ***
  const handleResetFilters = () => {
      setFilterType('All');
      setCategoryFilter('All');
      setSearchTerm('');
      setStartDate('');
      setEndDate('');
  };
  
  // *** QUICK DATE FILTER HANDLER ***
  const handleQuickDateFilter = (period) => {
    const today = new Date();
    let newStartDate = '';
    let newEndDate = today.toISOString().substring(0, 10); // End today

    if (period === 'Last 7 Days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        newStartDate = sevenDaysAgo.toISOString().substring(0, 10);
        
    } else if (period === 'This Month') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        newStartDate = firstDayOfMonth.toISOString().substring(0, 10);
        
    } else if (period === 'Last 30 Days') { 
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        newStartDate = thirtyDaysAgo.toISOString().substring(0, 10);
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };


  // --- DATA FETCHING (Unchanged) ---
  const fetchData = () => {
    axios.get("http://localhost:5000/api/expenses")
      .then((res) => setExpenses(res.data))
      .catch((err) => {
        console.error("Failed to fetch expenses:", err);
        setExpenses([]); 
      });
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // --- CRUD HELPERS (Unchanged) ---
  const addExpense = async (newTransaction) => {
    try {
      const res = await axios.post("http://localhost:5000/api/expenses", newTransaction);
      setExpenses([...expenses, res.data]);
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error.response ? error.response.data : error.message);
      return false;
    }
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const saveEdit = async (id, updatedData) => {
    try {
        const res = await axios.put(`http://localhost:5000/api/expenses/${id}`, updatedData);
        setExpenses(expenses.map(exp => 
            exp.id === id ? res.data : exp
        ));
        return true;
    } catch (error) {
        console.error("Error updating transaction:", error.response ? error.response.data : error.message);
        return false;
    }
  };

  // --- COMBINED FILTERING LOGIC ---
  const filteredExpenses = useMemo(() => {
    return expenses
        .filter(exp => {
            // 1. Filter by Type
            if (filterType !== 'All' && exp.type !== filterType.toLowerCase()) {
                return false;
            }

            // 2. Filter by Category
            if (categoryFilter !== 'All' && exp.category !== categoryFilter) {
                return false;
            }
            
            // 3. Filter by Search Term
            const expName = exp.name ? exp.name.toLowerCase() : '';
            const expCategory = exp.category ? exp.category.toLowerCase() : '';
            const search = searchTerm.toLowerCase();

            const matchesSearch = expName.includes(search) || expCategory.includes(search);
            
            if (searchTerm && !matchesSearch) {
                return false;
            }

            // 4. Filter by Date Range
            const expDate = new Date(exp.date);
            
            if (startDate) {
                const start = new Date(startDate);
                if (expDate < start) {
                    return false;
                }
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); 
                if (expDate > end) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filterType, categoryFilter, searchTerm, startDate, endDate]);


  // --- ANALYTICS CALCULATION ---
  const analytics = useMemo(() => {
    return calculateAnalytics(filteredExpenses); 
  }, [filteredExpenses]);


  return (
    <Router>
      <div style={{ fontFamily: "Arial", background: "#f0f2f5", minHeight: "100vh", padding: "20px 0" }}>
        <div style={{ maxWidth: "1000px", margin: "auto", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          
          <h1 style={{ color: "#2c3e50", margin: "0 0 25px 0", textAlign: 'center', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
              📊 Expense Tracker
          </h1>
          
          {/* --- Navigation Bar --- */}
          <nav style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px', textAlign: 'center' }}>
            <Link to="/" style={linkStyle}>Dashboard</Link>
            <Link to="/transactions" style={linkStyle}>Transactions</Link>
          </nav>
          
          {/* --- Routes --- */}
          <Routes>
            <Route path="/" element={
              <Dashboard 
                // Dashboard receives analytics based on filtered data
                analytics={analytics} 
                getCategoryIcon={getCategoryIcon}
              />
            } />
            <Route path="/transactions" element={
              <Transactions 
                // Transactions receives the filtered list for display
                expenses={filteredExpenses} 
                CATEGORIES={CATEGORIES} 
                getCategoryIcon={getCategoryIcon}
                
                // CRUD handlers
                addExpense={addExpense}
                deleteExpense={deleteExpense}
                saveEdit={saveEdit}
                
                // Pass down FILTER STATES
                filterType={filterType}
                categoryFilter={categoryFilter}
                searchTerm={searchTerm}
                startDate={startDate}
                endDate={endDate}

                // Pass down FILTER SETTERS
                setFilterType={setFilterType}
                setCategoryFilter={setCategoryFilter}
                setSearchTerm={setSearchTerm}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                
                // Pass down RESET HANDLER
                handleResetFilters={handleResetFilters}
                
                // *** NEW: QUICK FILTER HANDLER ***
                handleQuickDateFilter={handleQuickDateFilter}
              />
            } />
          </Routes>
          
        </div>
      </div>
    </Router>
  );
}

// Simple styling for links
const linkStyle = {
  margin: '0 15px',
  textDecoration: 'none',
  fontSize: '1.1em',
  fontWeight: 'bold',
  color: '#007bff',
  padding: '8px 15px',
  borderRadius: '6px',
  transition: 'background-color 0.2s',
  border: '1px solid transparent'
};

export default App;