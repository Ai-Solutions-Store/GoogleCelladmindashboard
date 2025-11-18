import React from 'react';

const Shimmer: React.FC = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
);

export const StatCardSkeleton: React.FC = () => (
    <div className="glass-card p-5 overflow-hidden relative">
        <div className="h-4 bg-white/5 rounded w-3/4"></div>
        <div className="h-8 bg-white/5 rounded w-1/2 mt-4"></div>
        <div className="h-5 bg-white/5 rounded w-1/3 mt-4"></div>
        <Shimmer />
    </div>
);

export const ChartSkeleton: React.FC = () => (
    <div className="w-full h-[450px] glass-card flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading Chart Data...</p>
    </div>
);

export const TableSkeleton: React.FC = () => (
    <div className="glass-card overflow-hidden relative">
        <div className="w-full">
            <div className="h-12 bg-white/5"></div>
            <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-white/5 rounded"></div>
                ))}
            </div>
        </div>
        <Shimmer />
    </div>
);

export const KickstarterListSkeleton: React.FC = () => (
    <div className="glass-card h-full overflow-hidden relative">
        <div className="p-4 border-b border-white/10">
             <div className="h-5 bg-white/5 rounded w-1/3"></div>
        </div>
        <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="h-4 bg-white/5 rounded w-1/2"></div>
                        <div className="h-4 bg-white/5 rounded w-1/4"></div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full"></div>
                </div>
            ))}
        </div>
        <Shimmer />
    </div>
);