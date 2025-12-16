import React from "react";
import axios from "axios";

function ExpenseList({ expenses, fetchExpenses }) {
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map((exp) => (
            <li key={exp._id}>
              {exp.title} - ₹{exp.amount} - {new Date(exp.date).toLocaleDateString()}
              <button onClick={() => deleteExpense(exp._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;
