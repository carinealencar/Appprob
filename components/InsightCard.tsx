import React from 'react';
import { GeminiInsightState } from '../types';
import Markdown from 'react-markdown';

interface InsightCardProps {
  insight: GeminiInsightState;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  if (!insight.text && !insight.loading && !insight.error) return null;

  return (
    <div className="mt-6 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-md border border-indigo-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </div>
        <h3 className="text-lg font-bold text-indigo-900">Análise Inteligente (Gemini)</h3>
      </div>

      <div className="text-slate-700 leading-relaxed text-sm">
        {insight.loading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-100 rounded w-full"></div>
            <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
          </div>
        ) : insight.error ? (
          <p className="text-red-500 font-medium">{insight.error}</p>
        ) : (
          <div className="prose prose-sm prose-indigo max-w-none">
            <Markdown>{insight.text || ''}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
