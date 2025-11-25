import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalculationOperator, DataPoint } from '../types';
import { isContinuous } from '../utils/mathUtils';

interface VisualizationProps {
  data: DataPoint[];
  type: any; // Using any loosely here to avoid circular imports if enum is needed, but practically DistributionType
  xMin?: number | 'auto';
  xMax?: number | 'auto';
  yMin?: number | 'auto';
  yMax?: number | 'auto';
  // Props for Highlighting
  targetX?: number;
  targetX2?: number;
  calcOp?: CalculationOperator;
}

const Visualization: React.FC<VisualizationProps> = ({ 
  data, 
  type,
  xMin = 'auto',
  xMax = 'auto',
  yMin = 'auto',
  yMax = 'auto',
  targetX,
  targetX2,
  calcOp
}) => {
  const isCont = isContinuous(type);

  // Helper to determine if a value falls within the calculated range
  const isHighlighted = (x: number) => {
    if (targetX === undefined || !calcOp) return false;
    
    const t1 = targetX;
    const t2 = targetX2 ?? t1;
    const minVal = Math.min(t1, t2);
    const maxVal = Math.max(t1, t2);

    switch (calcOp) {
      case CalculationOperator.LESS_EQUAL:
        // P(X <= x)
        return x <= t1;
      case CalculationOperator.GREATER:
        // P(X > x)
        if (isCont) return x >= t1;
        return x > t1; // Discrete >
      case CalculationOperator.BETWEEN:
        // P(x1 < X < x2)
        return x >= minVal && x <= maxVal;
      case CalculationOperator.EQUAL:
        // P(X = x) - Discrete only
        return Math.abs(x - t1) < 0.1;
      default:
        return false;
    }
  };

  // Process data
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      highlightY: isHighlighted(point.x) ? point.y : 0,
      baseY: point.y
    }));
  }, [data, targetX, targetX2, calcOp, type, isCont]);

  // Colors
  const highlightColor = "#a5b4fc"; // Indigo 300
  const strokeColor = "#6366f1"; // Indigo 500

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Visualização Gráfica</h2>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">
          {isCont ? 'Densidade de Probabilidade (PDF)' : 'Massa de Probabilidade (PMF)'}
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {isCont ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="x" 
                type="number"
                domain={[xMin, xMax]}
                allowDataOverflow={true}
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                domain={[yMin, yMax]}
                allowDataOverflow={true}
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val.toFixed(3)}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number, name: string) => {
                  if (name === 'highlightY') return [value.toFixed(4), 'Probabilidade (Destacada)'];
                  return [value.toFixed(4), 'Densidade'];
                }}
                labelStyle={{ color: '#475569', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="baseY" 
                stroke="#cbd5e1" 
                fill="#f1f5f9" 
                fillOpacity={1}
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="highlightY" 
                stroke={strokeColor} 
                strokeWidth={3} 
                fill={highlightColor} 
                fillOpacity={1}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              {targetX !== undefined && (
                 <ReferenceLine x={targetX} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'x', fill: '#ef4444', fontSize: 10 }} />
              )}
              {calcOp === CalculationOperator.BETWEEN && targetX2 !== undefined && (
                 <ReferenceLine x={targetX2} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'x2', fill: '#ef4444', fontSize: 10 }} />
              )}
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barCategoryGap={1}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="x" 
                type="number"
                domain={[
                  (dataMin: number) => (xMin === 'auto' ? dataMin - 0.5 : xMin - 0.5),
                  (dataMax: number) => (xMax === 'auto' ? dataMax + 0.5 : xMax + 0.5)
                ]}
                allowDecimals={false}
                allowDataOverflow={true}
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                domain={[yMin, yMax]}
                allowDataOverflow={true}
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val.toFixed(3)}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [value.toFixed(4), 'Probabilidade']}
                labelStyle={{ color: '#475569', fontWeight: 'bold' }}
              />
              <Bar dataKey="y" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isHighlighted(entry.x) ? highlightColor : "#cbd5e1"} 
                  />
                ))}
              </Bar>
               {targetX !== undefined && (
                 <ReferenceLine x={targetX} stroke="#ef4444" strokeDasharray="3 3" />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Visualization;