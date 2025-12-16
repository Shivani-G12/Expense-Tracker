// backend/server.js

const express = require('express');
const cors = require('cors');

// Import only the necessary expense route file
const expenseRoutes = require('./routes/expenses');
// budgetRoutes import is REMOVED

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Routes ---

// Expense routes for CRUD operations
app.use('/api/expenses', expenseRoutes);

// Budget route registration is REMOVED

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});