import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostBreakdownProps {
    breakdown: { fan: number; heating: number; cooling: number };
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ breakdown }) => {
    const data = [
        { name: 'Fan Energy', value: breakdown.fan },
        { name: 'Heating', value: breakdown.heating },
        { name: 'Cooling', value: breakdown.cooling },
    ];

    // Filter out zero values to avoid ugly empty segments or labels
    const activeData = data.filter(d => d.value > 0);

    // If total is 0, show placeholder
    if (activeData.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-xs italic">
                Systems Offline (No Cost)
            </div>
        );
    }

    const COLORS = {
        'Fan Energy': '#06b6d4', // Cyan
        'Heating': '#f97316',    // Orange
        'Cooling': '#3b82f6'     // Blue
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <h3 className="absolute top-2 left-4 text-white/80 text-xs font-semibold uppercase tracking-wider z-10">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="55%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {activeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number | undefined) => [`€${(value ?? 0).toFixed(2)}/hr`, 'Cost']}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
