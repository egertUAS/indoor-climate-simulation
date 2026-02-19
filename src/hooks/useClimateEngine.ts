import { useState, useEffect } from 'react';

// Constants
const AIR_DENSITY = 1.2; // kg/m^3
const SPECIFIC_HEAT_AIR = 1005; // J/kg*K
const CO2_GENERATION_PER_PERSON = 0.005; // L/s per person (approx)
const BASE_CO2_PPM = 420;
const ROOM_VOLUME = 150; // m^3 (Example approx for an office)
const THERMAL_MASS_FACTOR = 500; // Arbitrary factor to slow down temp changes

interface ClimateState {
    peopleCount: number;
    outdoorTemp: number;
    targetTemp: number;
    fanSpeed: number; // 0-100%
    heatRecovery: boolean;
    isInWinterMode: boolean;
    hvacActive: boolean;
}

export const useClimateEngine = (inputs: ClimateState) => {
    // No internal state for inputs, use props directly
    const [indoorTemp, setIndoorTemp] = useState(inputs.targetTemp); // Start at target
    const [co2Ppm, setCo2Ppm] = useState(BASE_CO2_PPM);
    const [energyCost, setEnergyCost] = useState(0); // Euros/hr
    const [ventilationRate, setVentilationRate] = useState(0); // L/s
    const [simulatedTime, setSimulatedTime] = useState(new Date('2024-01-01T08:00:00'));
    const [history, setHistory] = useState<any[]>([]);
    const [costBreakdown, setCostBreakdown] = useState({ fan: 0, heating: 0, cooling: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            // Advance time by 5 minutes per tick for better visibility
            setSimulatedTime(prev => new Date(prev.getTime() + 5 * 60000));

            // 1. Calculate Ventilation Rate (L/s)
            const maxVentilation = 200;
            const currentVentilation = (inputs.fanSpeed / 100) * maxVentilation;
            setVentilationRate(currentVentilation);

            // 2. CO2 Calculation
            const co2Generation = inputs.peopleCount * CO2_GENERATION_PER_PERSON; // L/s

            let co2Change = 0;
            if (currentVentilation > 0) {
                const addedPPM = (co2Generation / (currentVentilation || 1)) * 1000000;
                const targetCo2 = BASE_CO2_PPM + addedPPM;
                const diff = targetCo2 - co2Ppm;
                co2Change = diff * 0.1; // Approach target
            } else {
                // No ventilation, CO2 builds up
                // Added parts per million = (Generation L/s * DeltaTime) / RoomVolume L * 1e6
                // Room 150m3 = 150,000 L
                const addedPPM = (co2Generation / 150000) * 1000000;
                co2Change = addedPPM * 10; // Fast buildup
            }
            setCo2Ppm(prev => Math.min(5000, Math.max(BASE_CO2_PPM, prev + co2Change)));



            // 3. Thermal Calculation
            const volFlowM3s = currentVentilation / 1000;
            const massFlow = volFlowM3s * AIR_DENSITY;

            // Fan Energy Calculation
            // SFP = Specific Fan Power in kW / (m^3/s). Typical good system ~1.5 - 2.5.
            const SFP = 2.0;
            const PRICE_PER_KWH = 0.20;
            const fanPowerKW = volFlowM3s * SFP;
            const fanCost = fanPowerKW * PRICE_PER_KWH;

            // Internal Heat Gains (People)
            const personHeat = 100; // Watts
            const totalInternalGain = inputs.peopleCount * personHeat;

            // Transmission Loss (Simplified U-value approx)
            // Q = U * A * dT
            // Say U*A = 50 W/K (Good insulation)
            const transmissionUA = 50;
            const transmissionLoss = transmissionUA * (indoorTemp - inputs.outdoorTemp);

            if (!inputs.hvacActive) {
                // HVAC IS OFF (Heating/Cooling Off, but Fan might be running if Speed > 0)
                // Heat Balance = Internal Gain - Ventilation Loss - Transmission Loss
                // Ventilation Heat Loss = m * Cp * (T_indoor - T_outdoor)
                // Note: If Heat Recovery ON, T_supply is warmer, so loss is less.

                let supplyTempNatural = inputs.outdoorTemp;
                if (inputs.heatRecovery && inputs.isInWinterMode) {
                    const efficiency = 0.8;
                    supplyTempNatural = inputs.outdoorTemp + efficiency * (indoorTemp - inputs.outdoorTemp);
                }

                // If fan is off, massFlow is 0, so vent loss is 0.
                const ventilationLoss = massFlow * SPECIFIC_HEAT_AIR * (indoorTemp - supplyTempNatural);

                const netHeatInput = totalInternalGain - ventilationLoss - transmissionLoss;

                // Temp Change
                // Q = mc dT/dt
                const roomMass = ROOM_VOLUME * AIR_DENSITY;
                const tempChange = netHeatInput / (roomMass * SPECIFIC_HEAT_AIR);

                setIndoorTemp(prev => prev + tempChange * 60 * 5);

                // Cost is only the fan
                setEnergyCost(fanCost);
                setCostBreakdown({ fan: fanCost, heating: 0, cooling: 0 });

            } else {
                // HVAC IS ON (Auto Mode)

                let supplyTemp = inputs.outdoorTemp;
                if (inputs.heatRecovery && inputs.isInWinterMode) {
                    const efficiency = 0.8;
                    supplyTemp = inputs.outdoorTemp + efficiency * (indoorTemp - inputs.outdoorTemp);
                }

                // Power needed to treat incoming air to Target
                const ventilationLoad = massFlow * SPECIFIC_HEAT_AIR * (inputs.targetTemp - supplyTemp);

                // Power needed to offset Internal Gains & Transmission to maintain Target
                // Load = VentLoad + TransLoad - InternalGains
                const transmissionLoadAtTarget = transmissionUA * (inputs.targetTemp - inputs.outdoorTemp);

                const netLoad = ventilationLoad + transmissionLoadAtTarget - totalInternalGain;

                // If netLoad > 0: Heating needed
                // If netLoad < 0: Cooling needed

                const maxPower = 5000;
                let actualPower = netLoad;

                if (Math.abs(netLoad) > maxPower) {
                    actualPower = netLoad > 0 ? maxPower : -maxPower;
                    const deficit = netLoad - actualPower;
                    const roomMass = ROOM_VOLUME * AIR_DENSITY;
                    const tempChange = deficit / (roomMass * SPECIFIC_HEAT_AIR);
                    setIndoorTemp(prev => prev - tempChange * 10);
                } else {
                    // System works, temp approaches target
                    setIndoorTemp(prev => {
                        const diff = inputs.targetTemp - prev;
                        return prev + diff * 0.1;
                    });
                }

                const thermalLoadKW = Math.abs(actualPower) / 1000;
                const thermalCost = thermalLoadKW * PRICE_PER_KWH;

                const isHeating = actualPower > 0;

                setEnergyCost(fanCost + thermalCost);
                setCostBreakdown({
                    fan: fanCost,
                    heating: isHeating ? thermalCost : 0,
                    cooling: isHeating ? 0 : thermalCost
                });
            }


            // 4. Update History
            const newPoint = {
                time: simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                co2: Math.round(co2Ppm),
                temp: indoorTemp,
                cost: energyCost,
                outdoor: inputs.outdoorTemp
            };

            setHistory(prev => {
                const newHistory = [...prev, newPoint];
                if (newHistory.length > 288) { // 24h * 12 ticks/hr = 288
                    return newHistory.slice(newHistory.length - 288);
                }
                return newHistory;
            });

        }, 1000); // 1s real time = 5 mins sim time

        return () => clearInterval(timer);
    }, [inputs, indoorTemp, co2Ppm, energyCost, costBreakdown, simulatedTime]); // Added energyCost and simulatedTime to dep array for accuracy

    return {
        indoorTemp,
        co2Ppm,
        energyCost,
        costBreakdown,
        ventilationRate,
        simulatedTime,
        setSimulatedTime,
        history
    };
};

