// frontend/src/components/CategoryChart.js

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Define a consistent color palette for categories
const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#00bfa5'
];

// Helper to calculate total expenses for percentage display
const getTotalExpenses = (data) => data.reduce((sum, entry) => sum + entry.value, 0);

const CategoryChart = ({ categoryTotals }) => {
    
    // 1. Format the data for the Pie Chart
    const pieData = Object.entries(categoryTotals)
        .filter(([, amount]) => amount > 0) // Exclude categories with zero expenses
        .map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length] // Assign a color
        }));

    // 2. Check if there is data to display
    const totalExpenses = getTotalExpenses(pieData);
    if (totalExpenses === 0) {
        return <p style={{ textAlign: 'center', color: 'gray', padding: '50px 0' }}>No expense data for chart.</p>;
    }
    
    // Custom Tooltip content to show percentage
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dataEntry = payload[0];
            const percentage = ((dataEntry.value / totalExpenses) * 100).toFixed(1);
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <p style={{ color: dataEntry.color, margin: 0 }}>{dataEntry.name}</p>
                    <p style={{ margin: 0 }}>Amount: ₹{dataEntry.value.toFixed(2)}</p>
                    <p style={{ margin: 0 }}>Share: {percentage}%</p>
                </div>
            );
        }
        return null;
    };
    
    // Custom Label for the Pie slices (optional)
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
        
        // Only show label if slice is large enough (> 5%)
        if (percent * 100 > 5) { 
            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%" // Center X position
                        cy="50%" // Center Y position
                        outerRadius={100} // Radius of the pie
                        innerRadius={50} // Makes it a Donut Chart
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomLabel}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;