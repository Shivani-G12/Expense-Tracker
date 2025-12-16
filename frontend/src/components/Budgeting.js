// frontend/src/components/Transactions.js

import React, { useState } from 'react';

const Transactions = ({ expenses, CATEGORIES, getCategoryIcon, addExpense, deleteExpense, saveEdit }) => {
  // Local State for New Transaction Form
  const [newExpense, setNewExpense] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState("expense");
  const [newCategory, setNewCategory] = useState("Uncategorized"); 
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Local State for Filters and Sorting
  const [filterType, setFilterType] = useState('all'); 
  const [filterCategory, setFilterCategory] = useState('all'); // NEW: State for Category filter
  const [sortBy, setSortBy] = useState('date-desc'); // NEW: State for Sorting (default: date, newest first)
  
  // Local State for Editing
  const [editingId, setEditingId] = useState(null); 
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState(""); 

  // --- NEW: Input Validation Helper ---
  const validateInputs = (title, amount, date) => {
    if (!title.trim()) return "Title cannot be empty.";
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return "Amount must be a positive number.";
    if (!date) return "Date is required.";
    return null; // Validation passed
  };


  const handleAdd = async () => {
    // --- UPDATED: Validation Check ---
    const validationError = validateInputs(newExpense, newAmount, newDate);
    if (validationError) return alert(`Validation Error: ${validationError}`);
    // ----------------------------------
    
    const success = await addExpense({
        title: newExpense,
        amount: Number(newAmount),
        date: newDate, 
        type: newType,
        category: newCategory, 
    });

    if (success) {
        setNewExpense("");
        setNewAmount("");
        setNewType("expense"); 
        setNewCategory("Uncategorized");
    }
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setEditTitle(exp.title);
    setEditAmount(exp.amount.toString());
    setEditType(exp.type);
    setEditCategory(exp.category);
    setEditDate(exp.date); 
  };

  const handleSaveEdit = async (id) => {
    // --- UPDATED: Validation Check ---
    const validationError = validateInputs(editTitle, editAmount, editDate);
    if (validationError) return alert(`Validation Error: ${validationError}`);
    // ----------------------------------
    
    const updatedData = {
        title: editTitle,
        amount: Number(editAmount),
        type: editType,
        category: editCategory,
        date: editDate,
    };
    
    const success = await saveEdit(id, updatedData);
    if (success) {
        setEditingId(null);
    }
  };

  // --- NEW: Combined Filtering Logic ---
  let processedExpenses = expenses.filter(exp => {
    // Filter by Type (All, Income, Expense)
    if (filterType !== 'all' && exp.type !== filterType) return false;
    
    // NEW: Filter by Category
    if (filterCategory !== 'all' && exp.category !== filterCategory) return false;
    
    return true;
  });

  // --- NEW: Sorting Logic ---
  processedExpenses.sort((a, b) => {
      const [field, direction] = sortBy.split('-');
      let comparison = 0;

      if (field === 'date') {
          // Date comparison
          if (a.date < b.date) comparison = -1;
          if (a.date > b.date) comparison = 1;
      } else if (field === 'amount') {
          // Amount comparison (use Math.abs for consistent sorting regardless of income/expense type)
          comparison = Math.abs(Number(a.amount)) - Math.abs(Number(b.amount));
      }
      
      // Apply direction (descending is -1 * comparison)
      return direction === 'asc' ? comparison : comparison * -1;
  });

  // ------------------------------------

  return (
    <div>
        {/* === TRANSACTION INPUT SECTION === */}
        <h2 style={{ color: "#2c3e50", marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Add New Transaction
        </h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: 'wrap', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Name/Source"
            value={newExpense}
            onChange={(e) => setNewExpense(e.target.value)}
            style={{ flex: 2, padding: "10px", borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Amount (e.g. 500.00)"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <select value={newType} onChange={(e) => setNewType(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: '1px solid #ccc' }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: '1px solid #ccc' }}>
             {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: newType === 'expense' ? "#dc3545" : "#28a745",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "6px",
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>

        {/* === TRANSACTION LIST & FILTER CONTROLS (UPDATED) === */}
        <h2 style={{ color: "#2c3e50", marginBottom: '15px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            Transaction History
        </h2>
        
        <div style={{ marginBottom: "20px", padding: "10px", background: '#f1f3f4', borderRadius: '8px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 'bold' }}>Filter & Sort:</span>

            {/* Filter by Type */}
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: '1px solid #ccc' }}>
                <option value="all">Type: All</option>
                <option value="income">Type: Income Only</option>
                <option value="expense">Type: Expenses Only</option>
            </select>
            
            {/* NEW: Filter by Category */}
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: '1px solid #ccc' }}>
                <option value="all">Category: All</option>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>Category: {cat}</option>
                ))}
            </select>

            {/* NEW: Sort By */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: '1px solid #ccc' }}>
                <option value="date-desc">Sort By: Newest First</option>
                <option value="date-asc">Sort By: Oldest First</option>
                <option value="amount-desc">Sort By: Amount (High)</option>
                <option value="amount-asc">Sort By: Amount (Low)</option>
            </select>
        </div>

        {/* Expense List */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {processedExpenses.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray", padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                No transactions found matching the current filters.
            </p>
          ) : (
            processedExpenses.map((exp) => (
              <li
                key={exp.id} 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: exp.type === 'income' ? "#e6ffed" : "#ffebeb",
                  marginBottom: "10px",
                  padding: "15px",
                  borderRadius: "8px",
                  borderLeft: `5px solid ${exp.type === 'income' ? '#28a745' : '#dc3545'}`
                }}
              >
                {/* Conditional Rendering: Edit Mode vs. Display Mode */}
                {editingId === exp.id ? (
                  // EDIT MODE
                  <div style={{ display: 'flex', flexGrow: 1, gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ flex: 2, padding: '5px' }} />
                    <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} style={{ flex: 1, padding: '5px' }} />
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ flex: 1, padding: '5px' }} />
                    <select value={editType} onChange={(e) => setEditType(e.target.value)} style={{ padding: '5px' }}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ padding: '5px' }}>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button onClick={() => handleSaveEdit(exp.id)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  // DISPLAY MODE (Enhanced Look)
                  <>
                    {/* Title, Category, Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#34495e' }}>
                            {getCategoryIcon(exp.category)} {exp.title}
                        </span>
                        <span style={{ fontSize: '0.8em', color: '#6c757d', marginTop: '3px' }}>
                            {exp.category} | {exp.date}
                        </span>
                    </div>

                    {/* Amount */}
                    <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.3em', 
                        marginLeft: '20px',
                        color: exp.type === 'income' ? '#28a745' : '#dc3545' 
                    }}>
                        {exp.type === 'income' ? '+' : '-'}₹{Number(exp.amount).toFixed(2)}
                    </span>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '5px', marginLeft: '20px' }}>
                        <button
                          onClick={() => startEdit(exp)}
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExpense(exp.id)} 
                          style={{
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
  );
};

export default Transactions;