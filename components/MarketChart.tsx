import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MarketData } from '../types';

interface MarketChartProps {
  data: MarketData[];
  color?: string;
}

const MarketChart: React.FC<MarketChartProps> = ({ data, color = "#10b981" }) => {
  return (
    <div className="h-64 w-full bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-400">Live Market Simulation (BTC/USDT)</h3>
        <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-green-500">Live Connection</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#94a3b8" 
            fontSize={12} 
            tickFormatter={(number) => `$${number.toFixed(0)}`}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
            labelStyle={{ color: '#94a3b8' }}
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
  );
};

export default MarketChart;