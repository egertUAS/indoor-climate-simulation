import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BuildingCrossSectionProps {
    peopleCount: number;
    ventilationRate: number; // L/s
    indoorTemp: number;
    outdoorTemp: number;
    heatRecovery: boolean;
}

export const BuildingCrossSection: React.FC<BuildingCrossSectionProps> = ({
    peopleCount,
    ventilationRate,
    indoorTemp,
    outdoorTemp,
    heatRecovery
}) => {
    // Determine particle speed duration based on ventilation rate
    // Higher rate = lower duration (faster)
    // Max rate approx 200 L/s -> 1s duration
    // Min rate 0 L/s -> infinite or very slow

    const particleSpeed = useMemo(() => {
        if (ventilationRate <= 0) return 10000;
        // Map 0-200 to 10s-0.5s
        const rate = Math.min(Math.max(ventilationRate, 0), 200);
        return 10 - (rate / 200) * 9.5;
    }, [ventilationRate]);

    // Determine colors
    const outdoorColor = outdoorTemp < 10 ? '#3b82f6' : outdoorTemp > 25 ? '#ef4444' : '#22c55e';
    const indoorColor = indoorTemp < 18 ? '#60a5fa' : indoorTemp > 24 ? '#f87171' : '#4ade80';

    // Heat recovery visual
    const recoveryActive = heatRecovery && outdoorTemp < indoorTemp; // only useful in winter generally or if AC diff? Simplified to on/off state visual

    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
            <svg viewBox="0 0 800 500" className="w-full h-full max-w-4xl drop-shadow-2xl">
                {/* Building Shell */}
                <defs>
                    <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                    </pattern>
                </defs>

                {/* Ground */}
                <rect x="0" y="450" width="800" height="50" fill="#475569" />

                {/* Room - Main Box */}
                <rect x="100" y="100" width="600" height="350" fill="url(#wallGradient)" stroke="#94a3b8" strokeWidth="4" />
                <rect x="100" y="100" width="600" height="350" fill="url(#grid)" />

                {/* Window */}
                <rect x="120" y="150" width="10" height="150" fill="#bae6fd" opacity="0.5" stroke="#7dd3fc" strokeWidth="2" />

                {/* HVAC Vents */}
                {/* Inlet (Top Left) */}
                <path d="M 100 120 L 50 120" stroke="#94a3b8" strokeWidth="8" fill="none" />
                <text x="20" y="125" fill="white" fontSize="12" opacity="0.7">INLET</text>

                {/* Outlet (Top Right) */}
                <path d="M 700 120 L 750 120" stroke="#94a3b8" strokeWidth="8" fill="none" />
                <text x="760" y="125" fill="white" fontSize="12" opacity="0.7">OUTLET</text>

                {/* Heat Recovery Unit (Conceptual) */}
                <rect x="350" y="50" width="100" height="50" rx="4" fill={heatRecovery ? "#10b981" : "#64748b"} opacity="0.8" />
                <text x="400" y="80" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">HVAC / HRU</text>

                {/* Internal Ducts */}
                <path d="M 100 120 L 350 75" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="5,5" fill="none" opacity="0.3" />
                <path d="M 450 75 L 700 120" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="5,5" fill="none" opacity="0.3" />

                {/* Particles - Inlet Flow */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.circle
                        key={`inlet-${i}`}
                        r={4}
                        fill={outdoorColor}
                        initial={{ x: 50, y: 120, opacity: 0 }}
                        animate={{
                            x: [50, 200, 400, 500, 600],
                            y: [120, 150, 300, 200, 400], // Chaotically dispersion into room
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: particleSpeed,
                            repeat: Infinity,
                            delay: i * (particleSpeed / 15),
                            ease: "linear"
                        }}
                    />
                ))}

                {/* Particles - Internal Circulation (representing room air temp) */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.circle
                        key={`room-${i}`}
                        r={3}
                        fill={indoorColor}
                        initial={{ x: 200, y: 300, opacity: 0 }}
                        animate={{
                            x: Math.random() * 500 + 150,
                            y: Math.random() * 300 + 120,
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                        }}
                    />
                ))}

                {/* Particles - Exhaust Flow */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.circle
                        key={`exhaust-${i}`}
                        r={4}
                        fill={heatRecovery ? (indoorColor) : indoorColor} // If HR, maybe lose heat? Visually just keep room color exiting
                        initial={{ x: 600, y: 150, opacity: 0 }}
                        animate={{
                            x: [600, 700, 750],
                            y: [150, 120, 120],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: particleSpeed * 0.8,
                            repeat: Infinity,
                            delay: i * (particleSpeed / 15),
                            ease: "linear"
                        }}
                    />
                ))}

                {/* People */}
                {Array.from({ length: Math.min(peopleCount, 25) }).map((_, i) => {
                    // Distribute people
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const x = 150 + col * 60 + Math.random() * 20;
                    const y = 350 - row * 60;

                    return (
                        <g key={`person-${i}`}>
                            <circle cx={x} cy={y} r="10" fill="#fdba74" />
                            <path d={`M ${x - 10} ${y + 10} Q ${x} ${y + 40} ${x + 10} ${y + 10} Z`} fill="#3b82f6" />
                            {/* Heat Radiating - Only show if many people or simplify */}
                        </g>
                    );
                })}

                {/* Data Overlay in Scene? */}
                <text x="400" y="480" textAnchor="middle" fill="white" opacity="0.5" fontSize="14">
                    Office Section View • {peopleCount} Occupants
                </text>

            </svg>
        </div>
    );
};
