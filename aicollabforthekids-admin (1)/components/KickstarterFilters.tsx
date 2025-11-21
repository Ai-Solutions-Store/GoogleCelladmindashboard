import React from 'react';
import { Search, DollarSign } from './IconComponents';

interface KickstarterFiltersProps {
  nameFilter: string;
  onNameChange: (name: string) => void;
  goalFilter: number | '';
  onGoalChange: (goal: number | '') => void;
  onClear: () => void;
}

const KickstarterFilters: React.FC<KickstarterFiltersProps> = ({ nameFilter, onNameChange, goalFilter, onGoalChange, onClear }) => {
  return (
    <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:w-1/2">
        <label htmlFor="nameFilter" className="sr-only">Filter by name</label>
        <input
          id="nameFilter"
          type="text"
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 glass-input"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div className="relative w-full sm:w-1/2">
        <label htmlFor="goalFilter" className="sr-only">Filter by max goal</label>
        <input
          id="goalFilter"
          type="number"
          placeholder="Filter by max goal amount..."
          value={goalFilter}
          onChange={(e) => onGoalChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full pl-10 pr-4 py-2 glass-input"
        />
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      <button 
        onClick={onClear}
        className="px-4 py-2 text-sm font-medium text-slate-200 bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none whitespace-nowrap"
      >
          Clear Filters
      </button>
    </div>
  );
};

export default KickstarterFilters;
