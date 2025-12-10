import React from 'react';
import { BotConfig, MarketType, StrategyType, RiskProfile, AIModel } from '../types';
import { Settings, Sliders, AlertTriangle, Cpu, ShieldAlert, LineChart, Sigma, Gauge, Lock, Wallet } from 'lucide-react';

interface StrategyConfigProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
}

const StrategyConfig: React.FC<StrategyConfigProps> = ({ config, setConfig }) => {
  
  const handleChange = (field: keyof BotConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const isOptions = config.market === MarketType.OPTIONS;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4 text-indigo-400">
        <Settings size={20} />
        <h2 className="text-lg font-bold text-white">Advanced Strategy Config</h2>
      </div>

      {/* Secure Wallet & Vault Section */}
      <div className="bg-indigo-900/20 border border-indigo-500/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2 text-indigo-300">
             <Lock size={16} />
             <h3 className="text-sm font-bold">Secure Vault & Protection</h3>
        </div>
        
        <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-2">
                    <Wallet size={12} /> Enable Separate Safe Wallet
                </label>
                <input 
                    type="checkbox" 
                    checked={config.useSecureWallet}
                    onChange={(e) => handleChange('useSecureWallet', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-800 border-slate-600 rounded"
                />
             </div>

             {config.useSecureWallet && (
                 <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                        Vault Reserve (Do Not Touch): <span className="text-white font-bold">{config.vaultReservePercent}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={config.vaultReservePercent}
                        onChange={(e) => handleChange('vaultReservePercent', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                        Only {100 - config.vaultReservePercent}% of funds will be exposed to trading.
                    </p>
                 </div>
             )}

             <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-indigo-500/30">
                <div className="flex flex-col">
                    <span className="text-xs text-indigo-200 font-bold">Strict No-Loss Mode</span>
                    <span className="text-[10px] text-indigo-400/70">Trades only on Arbitrage/Hedge</span>
                </div>
                <input 
                    type="checkbox" 
                    checked={config.strictNoLossMode}
                    onChange={(e) => handleChange('strictNoLossMode', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-800 border-slate-600 rounded"
                />
             </div>
        </div>
      </div>

      <div className="border-t border-slate-700"></div>

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

      {/* Options Specific Config (Conditional) */}
      {isOptions && (
        <>
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2 text-purple-400">
                <Sigma size={16} />
                <h3 className="text-sm font-bold">Options Greeks & Volatility Matrix</h3>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded border border-purple-500/30 space-y-4">
                {/* Greeks Toggle */}
                <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-medium">Auto-Hedge Delta (Greeks Mgmt)</label>
                    <input 
                        type="checkbox" 
                        checked={config.manageGreeks || false}
                        onChange={(e) => handleChange('manageGreeks', e.target.checked)}
                        className="form-checkbox h-4 w-4 text-purple-600 bg-slate-800 border-slate-600 rounded"
                    />
                </div>

                {/* Delta Input */}
                {config.manageGreeks && (
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Target Portfolio Delta (±)</label>
                        <div className="flex items-center space-x-2">
                            <span className="text-slate-500 text-xs">Neutral</span>
                            <input 
                                type="number" 
                                placeholder="0.10"
                                value={config.targetDelta || 0.1}
                                onChange={(e) => handleChange('targetDelta', parseFloat(e.target.value))}
                                step={0.01}
                                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white"
                            />
                            <span className="text-slate-500 text-xs">Directional</span>
                        </div>
                     </div>
                )}
                
                {/* IV Filter */}
                <div>
                     <div className="flex items-center space-x-2 mb-2">
                        <Gauge size={12} className="text-orange-400"/>
                        <label className="block text-xs font-medium text-slate-400">IV Percentile Filter</label>
                     </div>
                     <div className="flex space-x-2">
                        <input 
                            type="number" 
                            placeholder="Min IV"
                            value={config.minIV || 15}
                            onChange={(e) => handleChange('minIV', parseFloat(e.target.value))}
                            className="w-1/2 bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white placeholder-slate-500"
                        />
                        <input 
                            type="number" 
                            placeholder="Max IV"
                            value={config.maxIV || 80}
                            onChange={(e) => handleChange('maxIV', parseFloat(e.target.value))}
                            className="w-1/2 bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white placeholder-slate-500"
                        />
                     </div>
                </div>
            </div>
          </div>
          <div className="border-t border-slate-700"></div>
        </>
      )}

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
              disabled={config.strictNoLossMode}
              className={`w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm ${config.strictNoLossMode ? 'text-slate-500 cursor-not-allowed' : 'text-red-400'}`}
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
              disabled={config.strictNoLossMode}
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