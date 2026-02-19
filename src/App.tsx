import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BuildingCrossSection } from './components/BuildingCrossSection';
import { Controls } from './components/Controls';
import { StatsTicker } from './components/StatsTicker';
import { ClimateGraph } from './components/ClimateGraph';
import { CostBreakdown } from './components/CostBreakdown';
import { useClimateEngine } from './hooks/useClimateEngine';

function App() {
    const [isInWinterMode, setIsInWinterMode] = useState(true);

    // Initial State Defaults
    const [peopleCount, setPeopleCount] = useState(5);
    const [targetTemp, setTargetTemp] = useState(21);
    const [fanSpeed, setFanSpeed] = useState(50);
    const [heatRecovery, setHeatRecovery] = useState(false);
    const [outdoorTemp, setOutdoorTemp] = useState(-5);
    const [hvacActive, setHvacActive] = useState(true);

    // Hook into Physics Engine
    const engine = useClimateEngine({
        peopleCount,
        outdoorTemp,
        targetTemp,
        fanSpeed,
        heatRecovery,
        isInWinterMode,
        hvacActive
    });

    // Handle Mode Switching Presets
    useEffect(() => {
        if (isInWinterMode) {
            setOutdoorTemp(-15);
            setHeatRecovery(true); // Default to generic good practice, or let user discover? Prompt says presets.
        } else {
            setOutdoorTemp(30);
            setHeatRecovery(false); // Often bypass in summer unless cooling recovery
        }
    }, [isInWinterMode]);

    return (
        <Layout isInWinterMode={isInWinterMode} setIsInWinterMode={setIsInWinterMode}>
            <Dashboard
                visualizer={
                    <BuildingCrossSection
                        peopleCount={peopleCount}
                        ventilationRate={engine.ventilationRate}
                        indoorTemp={engine.indoorTemp}
                        outdoorTemp={outdoorTemp}
                        heatRecovery={heatRecovery}
                    />
                }
                stats={
                    <StatsTicker
                        energyCost={engine.energyCost}
                        co2Ppm={engine.co2Ppm}
                        indoorTemp={engine.indoorTemp}
                        simulatedTime={engine.simulatedTime}
                        onResetTime={() => {
                            // Reset to 7:00 AM today
                            const newTime = new Date(engine.simulatedTime);
                            newTime.setHours(7, 0, 0, 0);
                            engine.setSimulatedTime(newTime);
                        }}
                    />
                }
                graph={
                    <ClimateGraph history={engine.history} />
                }
                breakdown={
                    <CostBreakdown breakdown={engine.costBreakdown} />
                }
                controls={
                    <Controls
                        peopleCount={peopleCount}
                        setPeopleCount={setPeopleCount}
                        targetTemp={targetTemp}
                        setTargetTemp={setTargetTemp}
                        fanSpeed={fanSpeed}
                        setFanSpeed={setFanSpeed}
                        heatRecovery={heatRecovery}
                        setHeatRecovery={setHeatRecovery}
                        outdoorTemp={outdoorTemp}
                        setOutdoorTemp={setOutdoorTemp}
                        hvacActive={hvacActive}
                        setHvacActive={setHvacActive}
                    />
                }
            />
        </Layout>
    );
}

export default App;
