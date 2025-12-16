// frontend/src/components/Transactions.js (FINAL PROP-DRIVEN VERSION)

import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm'; 

// Component accepts ALL filter props and handlers
const Transactions = ({ 
    expenses, // This is the filtered list from App.js
    CATEGORIES, 
    getCategoryIcon, 
    addExpense, 
    deleteExpense, 
    saveEdit,
    
    // Filter States
    filterType,
    categoryFilter,
    searchTerm,
    startDate,
    endDate,

    // Filter Setters
    setFilterType,
    setCategoryFilter,
    setSearchTerm,
    setStartDate,
    setEndDate,

    // Handlers
    handleResetFilters,
    handleQuickDateFilter
}) => {
    
    // --- Local State for Editing (STAYS HERE) ---
    const [isEditing, setIsEditing] = useState(null); 
    const [editData, setEditData] = useState(null);  

    // --- EDIT HANDLERS (Same) ---
    const handleEdit = (exp) => {
        setIsEditing(exp.id);
        // Note: 'date' is expected to be a string like 'YYYY-MM-DD' for input fields
        setEditData({ 
            ...exp, 
            date: exp.date.substring(0, 10) 
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setEditData(null);
    };

    const handleSaveEdit = async (id, updatedData) => {
        const success = await saveEdit(id, updatedData);
        if (success) {
            handleCancelEdit();
        }
    };

    // --- CSV EXPORT HANDLER (NEW FEATURE) ---
    const handleExportCSV = () => {
        // 1. Define CSV headers
        const headers = [
            "Date", "Type", "Title", "Category", "Amount", "ID"
        ];

        // 2. Convert the CURRENTLY FILTERED list (expenses prop) to CSV rows
        const csvRows = expenses.map(exp => [
            // Ensure data strings are quoted to handle potential commas in titles
            `"${new Date(exp.date).toLocaleDateString()}"`, 
            `"${exp.type}"`,
            `"${exp.name}"`, // Using 'name' based on your expense list structure
            `"${exp.category}"`,
            exp.amount, // Numeric values
            exp.id
        ]);

        // 3. Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n');

        // 4. Create and trigger the download link using a Blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Set filename (using the current date for uniqueness)
        const date = new Date().toISOString().substring(0, 10);
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_export_${date}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Style for the new quick filter buttons
    const quickButtonStyle = {
        padding: '8px 12px',
        borderRadius: '4px',
        backgroundColor: '#17a2b8', 
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    };

    return (
        <div style={{ padding: '20px' }}>
            
            {/* === ADD NEW TRANSACTION FORM === */}
            <h3 style={{ color: '#34495e', marginBottom: '15px' }}>Add New Transaction</h3>
            <ExpenseForm 
                CATEGORIES={CATEGORIES} 
                onSubmit={addExpense} 
                isEditing={false}
            />

            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '30px', color: '#34495e' }}>Transaction History</h3>

            {/* === FILTERING CONTROLS & EXPORT BUTTON === */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px 20px', marginBottom: '10px', alignItems: 'center', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                
                {/* Category Filter */}
                <div>
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter Category:</label>
                    <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                {/* Type Filter */}
                <div>
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter Type:</label>
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="All">All</option>
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                    </select>
                </div>

                {/* Search Bar */}
                <div>
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Search:</label>
                    <input
                        type="text"
                        placeholder="Name or Category..."
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
                    />
                </div>

                {/* Date Filter: Start Date */}
                <div>
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>From:</label>
                    <input
                        type="date"
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                {/* Date Filter: End Date */}
                <div>
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>To:</label>
                    <input
                        type="date"
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Reset Button */}
                <button 
                    onClick={handleResetFilters} 
                    style={{ 
                        padding: '8px 15px', 
                        borderRadius: '4px', 
                        backgroundColor: '#6c757d', 
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Reset Filters
                </button>

                {/* === EXPORT BUTTON (NEW) === */}
                <button 
                    onClick={handleExportCSV}
                    style={{ 
                        padding: '8px 15px', 
                        borderRadius: '4px', 
                        backgroundColor: '#007bff', // Blue for 'Export' action
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Export to CSV 💾
                </button>

            </div>
            
            {/* === QUICK DATE FILTERS (NEW BUTTONS) === */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', padding: '0 5px' }}>
                <span style={{ fontWeight: 'bold', color: '#555' }}>Quick Date Range:</span>
                <button 
                    onClick={() => handleQuickDateFilter('Last 7 Days')}
                    style={quickButtonStyle}
                >
                    Last 7 Days
                </button>
                <button 
                    onClick={() => handleQuickDateFilter('Last 30 Days')}
                    style={quickButtonStyle}
                >
                    Last 30 Days
                </button>
                <button 
                    onClick={() => handleQuickDateFilter('This Month')}
                    style={quickButtonStyle}
                >
                    This Month
                </button>
            </div>

            {/* === TRANSACTION LIST RENDERING === */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {expenses.map(exp => (
                    <li key={exp.id} style={{ 
                        padding: '15px', 
                        marginBottom: '10px', 
                        borderRadius: '8px', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        backgroundColor: exp.type === 'income' ? '#e6ffed' : '#ffebeb',
                        borderLeft: exp.type === 'income' ? '5px solid #28a745' : '5px solid #dc3545'
                    }}>
                        {isEditing === exp.id ? (
                            <ExpenseForm 
                                CATEGORIES={CATEGORIES} 
                                onSubmit={(data) => handleSaveEdit(exp.id, data)} 
                                initialData={editData} 
                                onCancel={handleCancelEdit}
                                isEditing={true}
                            />
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                
                                <div>
                                    <span style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#34495e', display: 'flex', alignItems: 'center' }}>
                                        {getCategoryIcon(exp.category)} {exp.name} 
                                    </span>
                                    <div style={{ fontSize: '0.85em', color: '#6c757d', marginTop: '3px' }}>
                                        <span style={{ marginRight: '15px' }}>Category: **{exp.category}**</span>
                                        <span>Date: **{new Date(exp.date).toLocaleDateString()}**</span>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ 
                                        fontSize: '1.2em', 
                                        fontWeight: 'bold', 
                                        color: exp.type === 'income' ? '#28a745' : '#dc3545' 
                                    }}>
                                        {exp.type === 'expense' ? '-' : '+' }₹{Number(exp.amount).toFixed(2)}
                                    </span>

                                    <button 
                                        onClick={() => handleEdit(exp)} 
                                        style={{ ...buttonStyle, backgroundColor: '#ffc107', borderColor: '#ffc107' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteExpense(exp.id)} 
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Simple reusable button style
const buttonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
    transition: 'background-color 0.2s'
};

export default Transactions;