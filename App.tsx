import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BotConfig, MarketData, MarketType, StrategyType, TradeSignal, RiskProfile, AIModel } from './types';
import StrategyConfig from './components/StrategyConfig';
import MarketChart from './components/MarketChart';
import CodeViewer from './components/CodeViewer';
import { analyzeMarket, generateBacktestCode, generateBotCode } from './services/geminiService';
import { Activity, Bot, BrainCircuit, Code, Play, RefreshCw, ShieldCheck, Zap, Server } from 'lucide-react';

const INITIAL_PRICE = 45000;

function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'architecture'>('dashboard');
  
  // Configuration State
  const [config, setConfig] = useState<BotConfig>({
    market: MarketType.CRYPTO,
    strategy: StrategyType.TREND_FOLLOWING,
    riskProfile: RiskProfile.BALANCED,
    aiModel: AIModel.LSTM,
    riskPerTrade: 1.0,
    stopLoss: 2.0,
    takeProfit: 5.0,
    useTrailingStop: true,
    autoRebalance: true,
    safeMode: true,
    leverage: 1
  });

  // Data State
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [signal, setSignal] = useState<TradeSignal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Generated Content State
  const [generatedBotCode, setGeneratedBotCode] = useState<string>("# Configure your strategy and click 'Generate System' to build your AI architecture.");
  const [generatedBacktestCode, setGeneratedBacktestCode] = useState<string>("# Backtesting code will appear here.");

  // Simulation Refs
  const intervalRef = useRef<number | null>(null);

  // --- Simulation Logic ---
  const generateCandle = useCallback((prevPrice: number): MarketData => {
    // Add some regime simulation
    const isVolatile = Math.random() > 0.8;
    const volatility = isVolatile ? 0.008 : 0.002; 
    
    const change = prevPrice * (Math.random() - 0.5) * volatility * 2;
    const close = prevPrice + change;
    const high = Math.max(prevPrice, close) + Math.random() * prevPrice * volatility;
    const low = Math.min(prevPrice, close) - Math.random() * prevPrice * volatility;
    
    return {
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      open: prevPrice,
      close,
      high,
      low,
      volume: Math.floor(Math.random() * 5000) + (isVolatile ? 5000 : 0)
    };
  }, []);

  // Initialize Data
  useEffect(() => {
    const initialData: MarketData[] = [];
    let price = INITIAL_PRICE;
    for (let i = 0; i < 50; i++) {
      const candle = generateCandle(price);
      initialData.push(candle);
      price = candle.close;
    }
    setMarketData(initialData);
    setCurrentPrice(price);
  }, [generateCandle]);

  // Live Simulation Loop
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setMarketData(prev => {
        const lastClose = prev[prev.length - 1].close;
        const newCandle = generateCandle(lastClose);
        setCurrentPrice(newCandle.close);
        return [...prev.slice(1), newCandle];
      });
    }, 1500); 

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [generateCandle]);

  // --- Handlers ---
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeMarket(marketData, config);
    setSignal(result);
    setIsAnalyzing(false);
  };

  const handleGenerateCode = async () => {
    setIsGeneratingCode(true);
    const [botCode, backtestCode] = await Promise.all([
      generateBotCode(config),
      generateBacktestCode(config)
    ]);
    setGeneratedBotCode(botCode);
    setGeneratedBacktestCode(backtestCode);
    setIsGeneratingCode(false);
  };

  // --- UI Components ---
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-500/20 shadow-lg">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">QuantAI <span className="text-indigo-400">Pro</span></h1>
            <p className="text-xs text-slate-400">AI Investment System Architect</p>
          </div>
        </div>
        
        <nav className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            Mission Control
          </button>
          <button 
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            System Architecture
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Config (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                <StrategyConfig config={config} setConfig={setConfig} />
                
                {/* Simulated Portfolio Stats */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Portfolio (Simulated)</h3>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Total Balance</span>
                            <span className="text-emerald-400 font-mono font-bold">+$12,450.20</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full">
                            <div className="bg-emerald-500 h-1.5 rounded-full w-[75%]"></div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                         <div className="bg-slate-900 p-2 rounded border border-slate-700">
                             <span className="block text-[10px] text-slate-500 uppercase">Daily PnL</span>
                             <span className="text-green-400 font-mono text-sm">+2.4%</span>
                         </div>
                         <div className="bg-slate-900 p-2 rounded border border-slate-700">
                             <span className="block text-[10px] text-slate-500 uppercase">Risk Level</span>
                             <span className="text-yellow-400 font-mono text-sm">Low</span>
                         </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: Chart & Analysis (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Chart Section */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 relative shadow-xl">
                  <div className="absolute top-4 left-4 z-10 flex flex-col">
                    <span className="text-2xl font-bold text-white tracking-tight">${currentPrice.toFixed(2)}</span>
                    <span className={`text-sm font-mono flex items-center ${marketData.length > 1 && marketData[marketData.length-1].close > marketData[marketData.length-2].close ? 'text-green-400' : 'text-red-400'}`}>
                       {marketData.length > 1 ? (marketData[marketData.length-1].close - marketData[marketData.length-2].close).toFixed(2) : '0.00'} 
                       <span className="ml-1 opacity-70">
                        ({marketData.length > 1 ? ((marketData[marketData.length-1].close - marketData[marketData.length-2].close) / marketData[marketData.length-2].close * 100).toFixed(2) : '0.00'}%)
                       </span>
                    </span>
                  </div>
                  <MarketChart data={marketData} color={marketData.length > 1 && marketData[marketData.length-1].close >= marketData[0].close ? "#10b981" : "#ef4444"} />
                </div>

                {/* AI Analyst Output */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <BrainCircuit size={20} className="text-indigo-400" />
                      </div>
                      <div>
                         <h2 className="text-lg font-bold text-white leading-none">QuantAI Analyst</h2>
                         <p className="text-xs text-slate-500 mt-1">Real-time Regime & Sentiment Detection</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                      <span>Scan Market</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Signal Card */}
                    <div className="bg-slate-900 rounded-xl p-5 border border-slate-700 relative overflow-hidden">
                       {signal ? (
                           <>
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Action</span>
                                    <div className={`text-2xl font-bold mt-1 ${signal.type === 'BUY' ? 'text-green-400' : signal.type === 'SELL' ? 'text-red-400' : signal.type === 'SAFE_MODE' ? 'text-blue-400' : 'text-yellow-400'}`}>
                                        {signal.type.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Confidence</span>
                                    <div className="text-xl font-mono text-white mt-1">{signal.confidence}%</div>
                                </div>
                             </div>
                             <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                                {signal.reasoning}
                             </p>
                           </>
                       ) : (
                           <div className="h-full flex flex-col items-center justify-center text-slate-600">
                               <Activity size={32} className="mb-2 opacity-50"/>
                               <span className="text-sm font-medium">Waiting for analysis...</span>
                           </div>
                       )}
                    </div>

                    {/* Regime/Sentiment Card */}
                    <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                        {signal ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                                        <span>Market Regime</span>
                                        <span className={`px-2 py-0.5 rounded ${signal.marketRegime === 'BULL' ? 'bg-green-500/20 text-green-400' : signal.marketRegime === 'BEAR' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                                            {signal.marketRegime}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${signal.marketRegime === 'BULL' ? 'bg-green-500' : signal.marketRegime === 'BEAR' ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: '80%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                                        <span>Sentiment</span>
                                        <span className={`${signal.sentiment === 'POSITIVE' ? 'text-green-400' : signal.sentiment === 'NEGATIVE' ? 'text-red-400' : 'text-slate-400'}`}>
                                            {signal.sentiment}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1">
                                        <div className={`h-1 flex-1 rounded-full ${signal.sentiment === 'NEGATIVE' ? 'bg-red-500' : 'bg-slate-800'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full ${signal.sentiment === 'NEUTRAL' ? 'bg-yellow-500' : 'bg-slate-800'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full ${signal.sentiment === 'POSITIVE' ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 text-right pt-2">
                                    Last Update: {signal.timestamp}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                                No data available
                            </div>
                        )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Actions (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                  <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-6">
                      <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                          <ShieldCheck size={18} /> Safe Mode Active
                      </h3>
                      <p className="text-xs text-indigo-200/70 mb-4">
                          System is monitoring for high volatility events. Auto-switch to stablecoins enabled.
                      </p>
                      <button className="w-full bg-indigo-600/50 hover:bg-indigo-600 border border-indigo-500 text-white text-xs font-bold py-2 rounded transition-colors">
                          Configure Safety Rules
                      </button>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
                          <Server size={18} /> Live Connections
                      </h3>
                      <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Binance API</span>
                              <span className="flex items-center text-green-400 text-xs font-mono"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Connected</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">ML Model</span>
                              <span className="flex items-center text-green-400 text-xs font-mono"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Ready</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Risk Manager</span>
                              <span className="flex items-center text-green-400 text-xs font-mono"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Active</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* TAB: ARCHITECTURE & CODE */}
          {activeTab === 'architecture' && (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* System Overview */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                    <div className="max-w-3xl mx-auto text-center mb-10">
                        <h2 className="text-2xl font-bold text-white mb-2">Enterprise Trading Architecture</h2>
                        <p className="text-slate-400">Generated system design based on {config.riskProfile.split(' ')[0]} profile and {config.strategy} strategy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -z-0"></div>

                        {/* Modules */}
                        <div className="relative z-10 bg-slate-900 p-6 rounded-xl border border-slate-600 flex flex-col items-center text-center shadow-lg">
                            <div className="bg-slate-800 p-3 rounded-full mb-3 text-indigo-400"><Activity /></div>
                            <h3 className="font-bold text-white text-sm">Data Feed</h3>
                            <p className="text-xs text-slate-500 mt-1">WebSocket / REST</p>
                        </div>

                        <div className="relative z-10 bg-slate-900 p-6 rounded-xl border border-slate-600 flex flex-col items-center text-center shadow-lg">
                             <div className="bg-slate-800 p-3 rounded-full mb-3 text-purple-400"><BrainCircuit /></div>
                            <h3 className="font-bold text-white text-sm">AI Engine</h3>
                            <p className="text-xs text-slate-500 mt-1">{config.aiModel}</p>
                        </div>

                         <div className="relative z-10 bg-indigo-900 p-6 rounded-xl border border-indigo-500 flex flex-col items-center text-center shadow-lg transform scale-110">
                             <div className="bg-indigo-800 p-3 rounded-full mb-3 text-white"><Bot /></div>
                            <h3 className="font-bold text-white text-sm">Core Strategy</h3>
                            <p className="text-xs text-indigo-300 mt-1">Logic Controller</p>
                        </div>

                        <div className="relative z-10 bg-slate-900 p-6 rounded-xl border border-slate-600 flex flex-col items-center text-center shadow-lg">
                             <div className="bg-slate-800 p-3 rounded-full mb-3 text-red-400"><ShieldCheck /></div>
                            <h3 className="font-bold text-white text-sm">Risk Manager</h3>
                            <p className="text-xs text-slate-500 mt-1">Max Loss {config.stopLoss}%</p>
                        </div>

                        <div className="relative z-10 bg-slate-900 p-6 rounded-xl border border-slate-600 flex flex-col items-center text-center shadow-lg">
                             <div className="bg-slate-800 p-3 rounded-full mb-3 text-green-400"><Server /></div>
                            <h3 className="font-bold text-white text-sm">Execution</h3>
                            <p className="text-xs text-slate-500 mt-1">Broker API</p>
                        </div>
                    </div>
                </div>

                {/* Generator Controls */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <button 
                        onClick={handleGenerateCode}
                        disabled={isGeneratingCode}
                        className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGeneratingCode ? <RefreshCw className="animate-spin" /> : <Code />}
                        <span>Generate Full System Code</span>
                    </button>
                    <p className="text-xs text-slate-500">Generates Python modules for Data, AI, Strategy, and Execution layers.</p>
                </div>

                {/* Code Viewers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
                    <CodeViewer 
                        title="system_main.py (Master Controller)" 
                        code={generatedBotCode} 
                        isLoading={isGeneratingCode} 
                    />
                    <CodeViewer 
                        title="backtest_engine.py" 
                        code={generatedBacktestCode} 
                        isLoading={isGeneratingCode} 
                    />
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;