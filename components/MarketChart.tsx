import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MarketData } from '../types';

interface MarketChartProps {
  data: MarketData[];
  color?: string;
  height?: number;
}

const MarketChart: React.FC<MarketChartProps> = ({ data, color = "#10b981", height = 300 }) => {
  return (
    // Fixed height parent container
    <div className={`w-full bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex flex-col`} style={{ height: `${height}px` }}>
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h3 className="text-sm font-semibold text-slate-400">Live Market Feed</h3>
        <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-green-500 font-mono">LIVE</span>
        </div>
      </div>
      
      {/* 
        CRITICAL FIX: 
        1. flex-1: Takes remaining height.
        2. min-h-0: Allows flex child to shrink below content size (prevents overflow).
        3. w-full: Forces full width.
        4. min-w-0: CRITICAL for flex containers to allow shrinking and proper width calculation for children.
      */}
      <div className="flex-1 w-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="#64748b" 
              fontSize={10} 
              tickFormatter={(number) => number.toFixed(0)}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
              itemStyle={{ color: '#f1f5f9' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [value.toFixed(2), "Price"]}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;