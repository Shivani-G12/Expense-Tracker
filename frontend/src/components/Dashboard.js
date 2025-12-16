
// frontend/src/components/Dashboard.js (FINAL VERSION)

import React from 'react';
import CategoryChart from "./CategoryChart"; 
import MonthlyTrendChart from "./MonthlyTrendChart"; 

const Dashboard = ({ analytics, getCategoryIcon }) => {
    
    // Destructure with default values for maximum safety
    const { 
        currentBalance = 0, 
        totalIncome = 0, 
        totalExpenses = 0, 
        categoryTotals = {}, 
        monthlyTrendData = [] 
    } = analytics || {}; 

    // --- Income vs Expense Bar Logic ---
    const hasData = totalIncome > 0 || totalExpenses > 0;
    const incomePercent = hasData ? (totalIncome / (totalIncome + totalExpenses)) * 100 : 50;
    const expensePercent = 100 - incomePercent;

    // --- Category Chart Data Check ---
    const categoryLabels = Object.keys(categoryTotals);
    const hasCategoryData = categoryLabels.length > 0 && categoryLabels.some(label => categoryTotals[label] > 0);


    return (
        <div>
            {/* === SUMMARY SECTION === */}
            <div style={{ 
                display: 'flex', 
                gap: '20px',
                marginBottom: '30px', 
                padding: '20px',
                border: '1px solid #e0e0e0', 
                borderRadius: '10px', 
                background: '#ffffff',
                flexWrap: 'wrap'
            }}>
                {/* Balance Card */}
                <div style={{ 
                    flex: '1 1 200px', 
                    textAlign: "center", 
                    padding: "20px", 
                    borderRadius: "8px",
                    backgroundColor: currentBalance >= 0 ? "#e6ffed" : "#ffebeb",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)" 
                }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#34495e" }}>Current Balance</h3>
                    <p style={{ 
                        fontSize: "2.5em", 
                        margin: 0, 
                        fontWeight: 'bold',
                        color: currentBalance >= 0 ? "#28a745" : "#dc3545" 
                    }}>
                        ₹{currentBalance.toFixed(2)}
                    </p>
                </div>

                {/* Income/Expense Cards */}
                <div style={{ flex: '2 1 400px', display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1, padding: '15px', borderRadius: '8px', backgroundColor: '#e9f7fe', boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                        <h4 style={{ color: '#007bff', margin: '0 0 5px 0' }}>Total Income</h4>
                        <p style={{ fontSize: '1.8em', fontWeight: 'bold', margin: 0 }}>
                            ₹{totalIncome.toFixed(2)}
                        </p>
                    </div>
                    <div style={{ flex: 1, padding: '15px', borderRadius: '8px', backgroundColor: '#fff3f0', boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                        <h4 style={{ color: '#dc3545', margin: '0 0 5px 0' }}>Total Expenses</h4>
                        <p style={{ fontSize: '1.8em', fontWeight: 'bold', margin: 0 }}>
                            ₹{totalExpenses.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* === INCOME VS EXPENSE BAR === */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ color: '#34495e', margin: '0 0 10px 0' }}>Overall Income vs Expense</h3>
                <div style={{ display: 'flex', height: '30px', borderRadius: '6px', overflow: 'hidden' }}>
                    {/* Income Bar */}
                    <div 
                        style={{ 
                            width: `${incomePercent}%`, 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            fontWeight: 'bold',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.9em'
                        }}
                    >
                        {totalIncome > 0 ? `${incomePercent.toFixed(0)}% Inc` : ''}
                    </div>
                    {/* Expense Bar */}
                    <div 
                        style={{ 
                            width: `${expensePercent}%`, 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            fontWeight: 'bold',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.9em'
                        }}
                    >
                        {totalExpenses > 0 ? `${expensePercent.toFixed(0)}% Exp` : ''}
                    </div>
                </div>
            </div>

            {/* === MONTHLY TREND LINE CHART (DEFENSIVE CHECK) === */}
            {monthlyTrendData && monthlyTrendData.length > 0 && (
                <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <MonthlyTrendChart trendData={monthlyTrendData} />
                </div>
            )}
            
            {/* === CATEGORY BREAKDOWN === */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
                
                {/* Pie Chart Component */}
                <div style={{ flex: '1 1 350px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3 style={{ color: '#34495e', margin: '0 0 15px 0' }}>Expense Breakdown by Category</h3>
                    {hasCategoryData ? (
                        <CategoryChart categoryTotals={categoryTotals} />
                    ) : (
                        <p style={{ textAlign: 'center', color: 'gray' }}>No expense data for chart.</p>
                    )}
                </div>

                {/* Category List Summary */}
                <div style={{ flex: '2 1 450px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3 style={{ color: '#34495e', margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        Spending Summary
                    </h3>
                    {categoryLabels.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'gray' }}>No expenses recorded yet.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {Object.entries(categoryTotals).map(([category, amount]) => (
                                <li key={category} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '10px 0',
                                    borderBottom: '1px solid #f0f0f0' 
                                }}>
                                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        {getCategoryIcon(category)} {category}
                                    </span>
                                    <span style={{ fontWeight: 'bold', color: '#dc3545', fontSize: '1.1em' }}>
                                        -₹{amount.toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;