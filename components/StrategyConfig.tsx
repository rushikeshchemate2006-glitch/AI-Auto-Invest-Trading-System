import React from 'react';
import { BotConfig, MarketType, StrategyType, RiskProfile, AIModel } from '../types';
import { Settings, Sliders, AlertTriangle, Cpu, ShieldAlert, LineChart } from 'lucide-react';

interface StrategyConfigProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
}

const StrategyConfig: React.FC<StrategyConfigProps> = ({ config, setConfig }) => {
  
  const handleChange = (field: keyof BotConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4 text-indigo-400">
        <Settings size={20} />
        <h2 className="text-lg font-bold text-white">System Configuration</h2>
      </div>

      {/* Core Setup */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Target Market</label>
          <select 
            value={config.market}
            onChange={(e) => handleChange('market', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {Object.values(MarketType).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Trading Strategy</label>
          <select 
            value={config.strategy}
            onChange={(e) => handleChange('strategy', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {Object.values(StrategyType).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="border-t border-slate-700"></div>

      {/* AI & Profile */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400">
            <Cpu size={16} />
            <h3 className="text-sm font-bold">AI Model & Profile</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Risk Profile</label>
            <select 
                value={config.riskProfile}
                onChange={(e) => handleChange('riskProfile', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200"
            >
                {Object.values(RiskProfile).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            </div>
            <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Prediction Model</label>
            <select 
                value={config.aiModel}
                onChange={(e) => handleChange('aiModel', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200"
            >
                {Object.values(AIModel).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            </div>
        </div>
      </div>

      <div className="border-t border-slate-700"></div>
        
      {/* Risk Management */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-yellow-500">
            <ShieldAlert size={16} />
            <h3 className="text-sm font-bold">Risk Management</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Stop Loss (%)</label>
            <input 
              type="number" 
              value={config.stopLoss}
              onChange={(e) => handleChange('stopLoss', parseFloat(e.target.value))}
              step={0.1}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-red-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Take Profit (%)</label>
            <input 
              type="number" 
              value={config.takeProfit}
              onChange={(e) => handleChange('takeProfit', parseFloat(e.target.value))}
              step={0.1}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-green-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Risk/Trade (%)</label>
            <input 
              type="number" 
              value={config.riskPerTrade}
              onChange={(e) => handleChange('riskPerTrade', parseFloat(e.target.value))}
              step={0.1}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Max Leverage</label>
            <input 
              type="number" 
              value={config.leverage}
              onChange={(e) => handleChange('leverage', parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center space-x-2">
                    <Sliders size={14} className="text-slate-400"/>
                    <span className="text-xs text-slate-300">Trailing Stop Loss</span>
                </div>
                <input 
                    type="checkbox" 
                    checked={config.useTrailingStop}
                    onChange={(e) => handleChange('useTrailingStop', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-800 border-slate-600 rounded"
                />
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center space-x-2">
                    <LineChart size={14} className="text-slate-400"/>
                    <span className="text-xs text-slate-300">Auto-Rebalance Portfolio</span>
                </div>
                <input 
                    type="checkbox" 
                    checked={config.autoRebalance}
                    onChange={(e) => handleChange('autoRebalance', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-800 border-slate-600 rounded"
                />
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center space-x-2">
                    <AlertTriangle size={14} className="text-slate-400"/>
                    <span className="text-xs text-slate-300">Volatility Safe Mode</span>
                </div>
                <input 
                    type="checkbox" 
                    checked={config.safeMode}
                    onChange={(e) => handleChange('safeMode', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-800 border-slate-600 rounded"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyConfig;