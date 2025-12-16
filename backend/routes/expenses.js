// backend/routes/expenses.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define the path to your expenses data file
const expensesFilePath = path.join(__dirname, '..', 'data', 'expenses.json');

// Helper function to read expenses from the JSON file
const getExpenses = () => {
    try {
        const data = fs.readFileSync(expensesFilePath, 'utf8');
        // If the file is empty, return an empty array
        return data ? JSON.parse(data) : [];
    } catch (error) {
        // If file doesn't exist, return an empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error("Error reading expenses.json:", error.message);
        return [];
    }
};

// Helper function to write expenses to the JSON file
const writeExpenses = (expenses) => {
    try {
        fs.writeFileSync(expensesFilePath, JSON.stringify(expenses, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing to expenses.json:", error.message);
    }
};

// --- ROUTES ---

// GET /api/expenses - Read all transactions (R)
router.get('/', (req, res) => {
    const expenses = getExpenses();
    res.json(expenses);
});

// POST /api/expenses - Add a new transaction (C)
router.post('/', (req, res) => {
    const expenses = getExpenses();
    const newExpense = {
        id: Date.now().toString(), // Simple unique ID
        title: req.body.title,
        amount: Number(req.body.amount),
        date: req.body.date,
        type: req.body.type || 'expense', // Default to expense
        category: req.body.category || 'Uncategorized', // Default category
    };
    expenses.push(newExpense);
    writeExpenses(expenses);
    res.status(201).json(newExpense);
});

// PUT /api/expenses/:id - Update an existing transaction (U)
router.put('/:id', (req, res) => {
    const id = req.params.id;
    let expenses = getExpenses();
    const index = expenses.findIndex(exp => exp.id === id);

    if (index !== -1) {
        expenses[index] = {
            ...expenses[index],
            title: req.body.title,
            amount: Number(req.body.amount),
            date: req.body.date,
            type: req.body.type,
            category: req.body.category,
        };
        writeExpenses(expenses);
        res.json(expenses[index]);
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
});

// DELETE /api/expenses/:id - Delete a transaction (D)
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    let expenses = getExpenses();
    const initialLength = expenses.length;
    
    expenses = expenses.filter(exp => exp.id !== id);
    
    if (expenses.length < initialLength) {
        writeExpenses(expenses);
        res.status(204).send(); // 204 No Content for successful deletion
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
});

module.exports = router;