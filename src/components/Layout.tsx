import React from 'react';
import { Sun, Snowflake } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    isInWinterMode: boolean;
    setIsInWinterMode: (mode: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isInWinterMode, setIsInWinterMode }) => {
    return (
        <div className={`min-h-screen transition-colors duration-500 ${isInWinterMode ? 'bg-slate-900 text-slate-100' : 'bg-stone-900 text-orange-50'}`}>
            <header className="p-4 border-b border-opacity-20 border-current flex justify-between items-center bg-white/5 backdrop-blur-md">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                    Indoor Climate Simulator
                </h1>
                <button
                    onClick={() => setIsInWinterMode(!isInWinterMode)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all ${isInWinterMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-orange-400 hover:bg-orange-300 text-white'
                        }`}
                >
                    {isInWinterMode ? <Snowflake size={18} /> : <Sun size={18} />}
                    {isInWinterMode ? 'Winter Mode' : 'Summer Mode'}
                </button>
            </header>
            <main className="container mx-auto p-6">
                {children}
            </main>
        </div>
    );
};
