import React from 'react';
import { ProbabilityResult } from '../types';

interface StatsPanelProps {
  probabilityResult?: ProbabilityResult;
}

const StatCard: React.FC<{ label: string; value: string | number; colorClass: string; isHighlight?: boolean }> = ({ label, value, colorClass, isHighlight }) => (
  <div className={`p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center text-center ${isHighlight ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-slate-100'}`}>
    <span className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isHighlight ? 'text-indigo-700' : 'text-slate-500'}`}>{label}</span>
    <span className={`text-2xl font-bold ${colorClass}`}>{typeof value === 'number' ? value.toFixed(isHighlight ? 4 : 2) : value}</span>
    {isHighlight && typeof value === 'number' && (
      <span className="text-xs text-indigo-500 font-medium mt-1">{(value * 100).toFixed(2)}%</span>
    )}
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ probabilityResult }) => {
  if (!probabilityResult) return null;

  return (
    <div className="mb-6">
      <StatCard 
        label={probabilityResult.label} 
        value={probabilityResult.value} 
        colorClass="text-indigo-700"
        isHighlight={true}
      />
    </div>
  );
};

export default StatsPanel;