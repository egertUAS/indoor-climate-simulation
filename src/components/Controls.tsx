import React from 'react';
import { User, Thermometer, Wind, RefreshCcw, Power } from 'lucide-react';

interface ControlsProps {
    peopleCount: number;
    setPeopleCount: (val: number) => void;
    targetTemp: number;
    setTargetTemp: (val: number) => void;
    fanSpeed: number;
    setFanSpeed: (val: number) => void;
    heatRecovery: boolean;
    setHeatRecovery: (val: boolean) => void;
    outdoorTemp: number; // Read-only or controllable? Plan says controllable within limits/presets
    setOutdoorTemp: (val: number) => void;
    hvacActive: boolean;
    setHvacActive: (val: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
    peopleCount, setPeopleCount,
    targetTemp, setTargetTemp,
    fanSpeed, setFanSpeed,
    heatRecovery, setHeatRecovery,
    outdoorTemp, setOutdoorTemp,
    hvacActive, setHvacActive
}) => {
    return (
        <div className="flex flex-col gap-8">

            {/* Outdoor Temp */}
            <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium opacity-80">
                    <span className="flex items-center gap-2"><Thermometer size={16} /> Outdoor Temp</span>
                    <span>{outdoorTemp}°C</span>
                </label>
                <input
                    type="range" min="-30" max="40" step="1"
                    value={outdoorTemp}
                    onChange={(e) => setOutdoorTemp(Number(e.target.value))}
                    className="w-full accent-orange-500 h-2 bg-gray-700/30 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Target Indoor Temp */}
            <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium opacity-80">
                    <span className="flex items-center gap-2"><Thermometer size={16} /> Target Indoor Temp</span>
                    <span>{targetTemp}°C</span>
                </label>
                <input
                    type="range" min="15" max="30" step="0.5"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-gray-700/30 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Occupancy */}
            <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium opacity-80">
                    <span className="flex items-center gap-2"><User size={16} /> Occupancy</span>
                    <span>{peopleCount} People</span>
                </label>
                <input
                    type="range" min="0" max="50" step="1"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="w-full accent-green-500 h-2 bg-gray-700/30 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Ventilation Rate */}
            <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium opacity-80">
                    <span className="flex items-center gap-2"><Wind size={16} /> Fan Speed</span>
                    <span>{fanSpeed}%</span>
                </label>
                <input
                    type="range" min="0" max="100" step="1"
                    value={fanSpeed}
                    onChange={(e) => setFanSpeed(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-2 bg-gray-700/30 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="flex gap-4">
                {/* HVAC System Toggle */}
                <div className="flex-1 flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <Power size={20} className={hvacActive ? "text-blue-400" : "text-gray-400"} />
                        <span className="font-medium">Climate Control</span>
                    </div>
                    <button
                        onClick={() => setHvacActive(!hvacActive)}
                        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${hvacActive ? 'bg-blue-500' : 'bg-gray-600'}`}
                    >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${hvacActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Heat Recovery Toggle */}
                <div className="flex-1 flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <RefreshCcw size={20} className={heatRecovery ? "text-green-400 spin-slow" : "text-gray-400"} />
                        <span className="font-medium text-sm">Heat Recov.</span>
                    </div>
                    <button
                        onClick={() => setHeatRecovery(!heatRecovery)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${heatRecovery ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${heatRecovery ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

        </div>
    );
};
