// frontend/src/components/ExpenseForm.js (FINAL CORRECT CODE)

import React, { useState, useEffect } from 'react';

// Utility function to format date for display/submission (yyyy-mm-dd)
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date)) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                // Returns date in yyyy-mm-dd format expected by input type="date"
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return '';
        }
        return date.toISOString().substring(0, 10);

    } catch (e) {
        return '';
    }
}

const ExpenseForm = ({ CATEGORIES, onSubmit, initialData = {}, onCancel, isEditing = false }) => {
    
    // Set initial state from props or default values
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        amount: initialData.amount || '',
        date: formatDate(initialData.date) || formatDate(new Date()),
        type: initialData.type || 'expense', // Default to expense
        category: initialData.category || CATEGORIES[0] || 'Uncategorized',
    });

    // Sync external changes (e.g., when clicking 'Edit')
    useEffect(() => {
        if (initialData && initialData.date) {
            setFormData({
                ...initialData,
                date: formatDate(initialData.date)
            });
        }
    }, [initialData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation check
        if (!formData.name || !formData.amount || !formData.date || !formData.type || !formData.category) {
            alert("Please fill out all fields.");
            return;
        }

        // Prepare data for submission (ensure amount is a number)
        const submissionData = {
            ...formData,
            amount: Number(formData.amount),
        };
        
        onSubmit(submissionData);
        
        // Reset form for 'Add' mode
        if (!isEditing) {
            setFormData({
                name: '',
                amount: '',
                date: formatDate(new Date()),
                type: 'expense',
                category: CATEGORIES[0] || 'Uncategorized',
            });
        }
    };

    const isIncome = formData.type === 'income';

    return (
        <form onSubmit={handleSubmit} style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            border: isEditing ? '2px dashed #007bff' : '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: isEditing ? '#f0f8ff' : '#f9f9f9'
        }}>
            <h4 style={{ color: '#34495e', marginTop: '0' }}>{isEditing ? 'Edit Transaction' : 'Record New Entry'}</h4>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                
                {/* Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Title"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                
                {/* Amount */}
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    style={inputStyle}
                />
                
                {/* Date */}
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                
                {/* Type (Income/Expense Dropdown) */}
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                {/* Category Dropdown (Only for Expenses) */}
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* Submit/Save Button */}
                <button type="submit" style={{ ...buttonStyle, backgroundColor: '#007bff' }}>
                    {isEditing ? 'Save Changes' : 'Add Entry'}
                </button>
                
                {/* Cancel Button (Only for Editing) */}
                {isEditing && (
                    <button type="button" onClick={onCancel} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

// Reusable styles
const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flexGrow: 1,
    minWidth: '120px',
    fontSize: '1.1em',
};

const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
};

export default ExpenseForm;