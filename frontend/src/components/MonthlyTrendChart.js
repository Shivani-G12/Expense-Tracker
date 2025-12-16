// frontend/src/components/MonthlyTrendChart.js

import React from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

const MonthlyTrendChart = ({ trendData }) => {
    
    // The data is displayed chronologically (oldest on the left)
    const chartData = [...trendData].reverse();

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h4 style={{ textAlign: 'center', color: '#34495e', marginBottom: '15px' }}>
                Income & Expense Trend (Last 6 Months)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="label" // Month label (e.g., Aug 25)
                        interval={0} 
                        angle={-30} 
                        textAnchor="end"
                        height={50}
                        stroke="#666"
                    />
                    <YAxis 
                        label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                        stroke="#666"
                    />
                    <Tooltip 
                        formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
                    />
                    <Legend />
                    
                    {/* Income Line (Green) */}
                    <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#28a745" // Green
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                    />
                    
                    {/* Expense Line (Red) */}
                    <Line 
                        type="monotone" 
                        dataKey="expense" 
                        stroke="#dc3545" // Red
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyTrendChart;