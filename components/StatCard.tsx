import React from 'react';
import { ArrowUp, ArrowDown } from './IconComponents';

interface StatCardProps {
  title: string;
  value: string;
  Icon: React.ElementType;
  change: string;
  changeType: 'positive' | 'negative';
  theme: 'users' | 'revenue' | 'matches' | 'engagement';
}

const themeClasses = {
    users: 'from-indigo-500 to-purple-500',
    revenue: 'from-pink-500 to-red-500',
    matches: 'from-sky-500 to-cyan-500',
    engagement: 'from-emerald-500 to-lime-500',
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, change, changeType, theme }) => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${themeClasses[theme]}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
       <div className={`mt-2 flex items-center text-sm font-semibold ${
            changeType === 'positive' ? 'text-green-400' : 'text-red-400'
        }`}>
            {changeType === 'positive' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            <span>{change}</span>
            <span className="text-slate-400 font-normal ml-2">from last month</span>
        </div>
    </div>
  );
};

export default StatCard;