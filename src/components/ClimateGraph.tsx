import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ClimateGraphProps {
    history: any[];
}

export const ClimateGraph: React.FC<ClimateGraphProps> = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-white/50">
                Waiting for simulation data...
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[200px] flex flex-col">
            <h3 className="text-white/80 text-sm font-semibold mb-2 px-4 uppercase tracking-wider">24h History</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={history}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="time"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fontSize: 10 }}
                        minTickGap={30}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: 'white', opacity: 0.5 }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fontSize: 10 }}
                        label={{ value: 'CO2 (PPM)', angle: 90, position: 'insideRight', fill: 'white', opacity: 0.5 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        itemStyle={{ fontSize: 12 }}
                        labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: 5 }}
                    />

                    <ReferenceLine y={1000} yAxisId="right" stroke="yellow" strokeDasharray="3 3" label={{ position: 'right', value: 'Warn', fill: 'yellow', fontSize: 10 }} />
                    <ReferenceLine y={2000} yAxisId="right" stroke="red" strokeDasharray="3 3" label={{ position: 'right', value: 'Crit', fill: 'red', fontSize: 10 }} />

                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="outdoor"
                        stackId="1"
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        fillOpacity={0.1}
                        name="Outdoor Temp"
                    />
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="temp"
                        stackId="2"
                        stroke="#60a5fa"
                        fill="url(#colorTemp)"
                        fillOpacity={0.3}
                        name="Indoor Temp"
                        strokeWidth={2}
                    />
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="co2"
                        stackId="3"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.1}
                        name="CO2 Level"
                        strokeWidth={2}
                    />

                    <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
