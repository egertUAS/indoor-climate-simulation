import React from 'react';
import { BadgeEuro, Factory, Clock } from 'lucide-react';

interface StatsTickerProps {
    energyCost: number;
    co2Ppm: number;
    indoorTemp: number;
    simulatedTime: Date;
    onResetTime: () => void;
}

export const StatsTicker: React.FC<StatsTickerProps> = ({ energyCost, co2Ppm, indoorTemp, simulatedTime, onResetTime }) => {
    const isCo2High = co2Ppm > 1000;
    const isCo2Critical = co2Ppm > 2000;

    return (
        <div className="flex flex-wrap gap-4 items-center justify-around w-full">

            {/* Time */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 group relative">
                <div className="text-white p-2">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Time</p>
                    <p className="text-2xl font-bold font-mono">
                        {simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                </div>
                <button
                    onClick={onResetTime}
                    className="absolute -top-2 -right-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Reset to 07:00"
                >
                    <Clock size={12} />
                </button>
            </div>

            {/* Financial Impact */}
            <div className="flex items-center gap-3 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <div className="bg-emerald-500 text-white p-2 rounded-lg">
                    <BadgeEuro size={24} />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Energy Cost</p>
                    <p className="text-2xl font-bold font-mono">
                        €{energyCost.toFixed(2)}<span className="text-sm opacity-60">/hr</span>
                    </p>
                </div>
            </div>

            {/* Indoor Temp */}
            <div className="flex items-center gap-3 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <div className="text-center min-w-[3rem]">
                    <span className="text-2xl font-bold">{indoorTemp.toFixed(1)}°C</span>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Indoor Temp</p>
                </div>
            </div>

            {/* Air Quality */}
            <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-500 ${isCo2Critical ? 'bg-red-500/20 border-red-500/50 animate-pulse' :
                isCo2High ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-teal-500/10 border-teal-500/20'
                }`}>
                <div className={`${isCo2Critical ? 'text-red-400' : isCo2High ? 'text-yellow-400' : 'text-teal-400'} p-2 rounded-lg`}>
                    <Factory size={24} />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Air Quality (CO₂)</p>
                    <p className="text-2xl font-bold font-mono">
                        {Math.round(co2Ppm)} <span className="text-sm opacity-60">PPM</span>
                    </p>
                </div>
            </div>

        </div>
    );
};
