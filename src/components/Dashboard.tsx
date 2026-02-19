import React from 'react';

interface DashboardProps {
    visualizer: React.ReactNode;
    controls: React.ReactNode;
    stats: React.ReactNode;
    graph: React.ReactNode;
    breakdown: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ visualizer, controls, stats, graph, breakdown }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Visualizer takes up 2 columns on large screens */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl h-[50vh] relative overflow-hidden">
                    {visualizer}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[30vh]">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-lg overflow-hidden">
                        {graph}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-lg flex items-center">
                            {stats}
                        </div>
                        <div className="col-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg overflow-hidden p-2">
                            {breakdown}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls sidebar */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl h-fit">
                <h2 className="text-xl font-bold mb-6 opacity-90">Control Panel</h2>
                {controls}
            </div>
        </div>
    );
};
