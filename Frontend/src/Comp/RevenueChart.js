import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { motion } from "framer-motion";

function RevenueChart({ trendData, recentSales }) {
    
    // Process recentSales to get Petrol vs Diesel consumption
    const fuelConsumption = [
        { name: 'Petrol', value: recentSales.filter(s => s.fuelType.toLowerCase() === 'petrol').reduce((acc, curr) => acc + curr.liters, 0) },
        { name: 'Diesel', value: recentSales.filter(s => s.fuelType.toLowerCase() === 'diesel').reduce((acc, curr) => acc + curr.liters, 0) }
    ];

    const COLORS = ['#F59E0B', '#2563EB']; // Warning (Petrol), Primary (Diesel)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 border-0 shadow-lg" style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)' }}>
                    <p className="text-muted mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="fw-bold mb-0" style={{ color: entry.color }}>
                            {entry.name}: {entry.name === 'Revenue' ? '₹' : ''} {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 h-100"
        >
            <div className="row">
                <div className="col-md-12 mb-4">
                    <h5 className="text-white mb-4">📈 Revenue & Sales Trend</h5>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={trendData && trendData.length > 0 ? trendData : [
                                    { date: 'Mon', revenue: 4000, sales: 24 },
                                    { date: 'Tue', revenue: 3000, sales: 13 },
                                    { date: 'Wed', revenue: 2000, sales: 98 },
                                    { date: 'Thu', revenue: 2780, sales: 39 },
                                    { date: 'Fri', revenue: 1890, sales: 48 },
                                    { date: 'Sat', revenue: 2390, sales: 38 },
                                    { date: 'Sun', revenue: 3490, sales: 43 },
                                ]}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="date" stroke="#94A3B8" tick={{fill: '#94A3B8'}} />
                                <YAxis stroke="#94A3B8" tick={{fill: '#94A3B8'}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#22C55E" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-md-12">
                    <h5 className="text-white mb-4 mt-2">⛽ Fuel Consumption (Liters)</h5>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={fuelConsumption}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                <XAxis type="number" stroke="#94A3B8" tick={{fill: '#94A3B8'}} />
                                <YAxis dataKey="name" type="category" stroke="#94A3B8" tick={{fill: '#94A3B8'}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Liters Sold" radius={[0, 4, 4, 0]}>
                                    {
                                        fuelConsumption.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default RevenueChart;