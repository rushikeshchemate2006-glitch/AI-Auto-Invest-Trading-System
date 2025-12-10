
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BotConfig, MarketData, MarketType, StrategyType, TradeSignal, RiskProfile, AIModel, Asset } from './types';
import StrategyConfig from './components/StrategyConfig';
import MarketChart from './components/MarketChart';
import CodeViewer from './components/CodeViewer';
import AIAssistant from './components/AIAssistant';
import { analyzeMarket, generateBacktestCode, generateBotCode } from './services/geminiService';
import { Activity, Bot, BrainCircuit, Code, Play, RefreshCw, ShieldCheck, Zap, Server, Lock, Wallet, ArrowRightLeft, QrCode, Shield, X, Maximize2, Copy, TrendingUp, Search, Briefcase, LayoutDashboard, ChevronRight, ArrowUpRight, ArrowDownRight, User } from 'lucide-react';

const INITIAL_CAPITAL = 50000;
const DEPOSIT_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

const MOCK_ASSETS: Asset[] = [
  { id: '1', symbol: 'NIFTY 50', name: 'Nifty 50 Index', price: 22150.50, change: 0.45, type: 'INDEX', icon: '🇮🇳' },
  { id: '2', symbol: 'BTC', name: 'Bitcoin', price: 64230.10, change: -1.2, type: 'CRYPTO', icon: '₿' },
  { id: '3', symbol: 'ETH', name: 'Ethereum', price: 3450.80, change: 0.8, type: 'CRYPTO', icon: 'Ξ' },
  { id: '4', symbol: 'RELIANCE', name: 'Reliance Ind.', price: 2950.00, change: 1.5, type: 'STOCK', icon: 'R' },
  { id: '5', symbol: 'TATA', name: 'Tata Motors', price: 980.20, change: -0.5, type: 'STOCK', icon: 'T' },
  { id: '6', symbol: 'GOLD', name: 'Gold (XAU)', price: 2150.40, change: 0.1, type: 'INDEX', icon: '🥇' },
];

function App() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'explore' | 'investments' | 'algo'>('explore');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
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
    leverage: 1,
    useSecureWallet: true,
    vaultReservePercent: 80,
    strictNoLossMode: false
  });

  // Data State
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(64000); // Default BTCish
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

  // Initialize Data when asset changes
  useEffect(() => {
    const initialPrice = selectedAsset ? selectedAsset.price : 64000;
    const initialData: MarketData[] = [];
    let price = initialPrice;
    for (let i = 0; i < 50; i++) {
      const candle = generateCandle(price);
      initialData.push(candle);
      price = candle.close;
    }
    setMarketData(initialData);
    setCurrentPrice(price);
    setSignal(null); // Reset signal on asset change
  }, [generateCandle, selectedAsset]);

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

  const copyAddress = () => {
    navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    alert("Wallet Address Copied!");
  };

  // --- Calculations for Wallet UI ---
  const vaultAmount = config.useSecureWallet ? (INITIAL_CAPITAL * config.vaultReservePercent) / 100 : 0;
  const tradingAmount = INITIAL_CAPITAL - vaultAmount;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(DEPOSIT_ADDRESS)}&bgcolor=ffffff`;

  // --- Views ---

  const renderExplore = () => (
    <div className="space-y-6">
       {/* Indices / Top Cards */}
       <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {MOCK_ASSETS.slice(0, 3).map(asset => (
             <div key={asset.id} onClick={() => setSelectedAsset(asset)} className="min-w-[200px] bg-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                   <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-lg">{asset.icon}</div>
                   <span className={`text-xs font-bold px-2 py-1 rounded ${asset.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                   </span>
                </div>
                <div className="font-bold text-white text-lg">{asset.symbol}</div>
                <div className="text-slate-400 text-sm">${asset.price.toLocaleString()}</div>
             </div>
          ))}
       </div>

       {/* List View */}
       <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
             <h2 className="text-white font-bold flex items-center gap-2"><TrendingUp size={18} className="text-indigo-400"/> Market Movers</h2>
          </div>
          <div>
             {MOCK_ASSETS.map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => setSelectedAsset(asset)}
                  className="flex items-center justify-between p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl shadow-lg">{asset.icon}</div>
                      <div>
                         <div className="font-bold text-white">{asset.name}</div>
                         <div className="text-xs text-slate-400">{asset.type}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-mono text-white font-medium">${asset.price.toLocaleString()}</div>
                      <div className={`text-xs font-bold ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                         {asset.change > 0 ? '+' : ''}{asset.change}%
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderAssetDetail = () => {
    if (!selectedAsset) return null;
    return (
      <div className="space-y-6">
         <button onClick={() => {setSelectedAsset(null); setSignal(null);}} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm mb-2">
            &larr; Back to Explore
         </button>

         {/* Header */}
         <div className="flex justify-between items-start">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-2xl shadow-lg">{selectedAsset.icon}</div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{selectedAsset.name}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-mono text-indigo-300">${currentPrice.toFixed(2)}</span>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${marketData.length > 1 && currentPrice > marketData[marketData.length-2].close ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                           LIVE
                        </span>
                    </div>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-500/20">BUY</button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold">SELL</button>
             </div>
         </div>

         {/* Chart & AI Analysis Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
               <MarketChart data={marketData} height={400} />
               
               {/* Quick SIP / Auto Invest */}
               <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-indigo-500/20 p-2 rounded-full text-indigo-400"><Bot size={20}/></div>
                     <div>
                        <div className="font-bold text-white text-sm">Start AI SIP</div>
                        <div className="text-xs text-indigo-200">Auto-invest $500 monthly in {selectedAsset.symbol}</div>
                     </div>
                  </div>
                  <button className="text-indigo-400 font-bold text-sm hover:text-white">Configure &gt;</button>
               </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
               {/* AI Analyst Card */}
               <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-white flex items-center gap-2"><BrainCircuit size={18} className="text-purple-400"/> AI Analyst</h3>
                     <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white flex items-center gap-1"
                     >
                        {isAnalyzing ? <RefreshCw size={12} className="animate-spin"/> : <Zap size={12}/>} Scan
                     </button>
                  </div>
                  
                  {signal ? (
                     <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center">
                           <span className="text-slate-400 text-xs uppercase font-bold">Signal</span>
                           <span className={`text-lg font-black ${signal.type === 'BUY' ? 'text-green-400' : signal.type === 'SELL' ? 'text-red-400' : 'text-yellow-400'}`}>
                              {signal.type}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-slate-400 text-xs uppercase font-bold">Confidence</span>
                           <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full" style={{width: `${signal.confidence}%`}}></div>
                           </div>
                        </div>
                        <div className="p-3 bg-slate-900 rounded text-xs text-slate-300 border border-slate-700 leading-relaxed">
                           {signal.reasoning}
                        </div>
                        <div className="flex gap-2">
                           <div className="flex-1 bg-slate-900 p-2 rounded text-center">
                              <div className="text-[10px] text-slate-500">REGIME</div>
                              <div className="text-xs font-bold text-white">{signal.marketRegime}</div>
                           </div>
                           <div className="flex-1 bg-slate-900 p-2 rounded text-center">
                              <div className="text-[10px] text-slate-500">SENTIMENT</div>
                              <div className="text-xs font-bold text-white">{signal.sentiment}</div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="text-center py-8 text-slate-500 text-sm">
                        Tap "Scan" to analyze market conditions.
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderInvestments = () => (
    <div className="space-y-6">
       {/* Portfolio Summary Card */}
       <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
             <div>
                <div className="text-indigo-300 text-sm font-medium mb-1 flex items-center gap-2"><Briefcase size={16}/> Total Portfolio Value</div>
                <div className="text-4xl font-bold text-white tracking-tight">${INITIAL_CAPITAL.toLocaleString()}</div>
                <div className="text-emerald-400 text-sm font-bold mt-1 flex items-center gap-1"><TrendingUp size={14}/> +$1,240.50 (2.4%)</div>
             </div>
             
             <div className="flex gap-3">
                <button onClick={() => setShowQrModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2">
                   <ArrowDownRight size={16}/> Deposit
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                   <ArrowUpRight size={16}/> Withdraw
                </button>
             </div>
          </div>
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
       </div>

       {/* Wallet Split */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Secure Vault */}
          <div className={`bg-slate-800 rounded-xl p-5 border ${config.useSecureWallet ? 'border-indigo-500/50' : 'border-slate-700'}`}>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2"><Lock size={18} className="text-indigo-400"/> Secure Vault</h3>
                {config.useSecureWallet && <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded font-bold">LOCKED</span>}
             </div>
             <div className="text-2xl font-mono text-white mb-2">${vaultAmount.toLocaleString()}</div>
             <div className="text-slate-400 text-xs leading-relaxed">
                {config.useSecureWallet 
                  ? `${config.vaultReservePercent}% of your capital is cryptographically locked and isolated from trading risks.`
                  : "Vault is currently disabled. Enable it in Algo Studio."}
             </div>
          </div>

          {/* Active Trading */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Trading Wallet</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded font-bold">ACTIVE</span>
             </div>
             <div className="text-2xl font-mono text-white mb-2">${tradingAmount.toLocaleString()}</div>
             <div className="text-slate-400 text-xs leading-relaxed">
                Capital available for AI Auto-Trade strategies and manual execution.
             </div>
          </div>
       </div>

       {/* Current Holdings List (Mock) */}
       <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
             <h3 className="font-bold text-white">Current Holdings</h3>
          </div>
          <div>
             <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">₿</div>
                   <div>
                      <div className="text-white font-bold text-sm">Bitcoin</div>
                      <div className="text-slate-500 text-xs">0.45 BTC</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-white font-bold text-sm">$28,903.50</div>
                   <div className="text-green-400 text-xs">+12.4%</div>
                </div>
             </div>
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">R</div>
                   <div>
                      <div className="text-white font-bold text-sm">Reliance Ind.</div>
                      <div className="text-slate-500 text-xs">50 Qty</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-white font-bold text-sm">$1,475.00</div>
                   <div className="text-red-400 text-xs">-1.2%</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderAlgoStudio = () => (
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
           <StrategyConfig config={config} setConfig={setConfig} />
        </div>
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-bold text-white">System Architect</h2>
                    <p className="text-xs text-slate-400">Generate Python source code for your custom bot.</p>
                 </div>
                 <button 
                   onClick={handleGenerateCode}
                   disabled={isGeneratingCode}
                   className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                 >
                    {isGeneratingCode ? <RefreshCw className="animate-spin" size={16}/> : <Code size={16}/>} Generate
                 </button>
              </div>
              <div className="h-[600px]">
                 <CodeViewer 
                   title="algo_engine.py" 
                   code={generatedBotCode} 
                   isLoading={isGeneratingCode} 
                 />
              </div>
           </div>
        </div>
     </div>
  );

  // --- Main Render ---
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-200">
      
      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQrModal(false)}>
            <div className="bg-slate-900 border border-indigo-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2"><Wallet size={18}/> Deposit to Secure Vault</h3>
                    <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="bg-white p-4 rounded-xl flex justify-center mb-4">
                    <img src={qrUrl} alt="Deposit QR" className="w-48 h-48 object-contain" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold">Wallet Address (ERC-20)</label>
                    <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded border border-slate-800">
                        <code className="text-xs text-indigo-300 font-mono flex-1 break-all">{DEPOSIT_ADDRESS}</code>
                        <button onClick={copyAddress} className="text-slate-400 hover:text-white"><Copy size={14}/></button>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-2 text-emerald-400 bg-emerald-900/20 p-2 rounded">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold">AES-256 Encrypted Storage</span>
                </div>
            </div>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
                  <div className="bg-indigo-600 p-1.5 rounded-lg"><Bot size={20}/></div>
                  InvestAI
               </div>
               
               {/* Desktop Nav */}
               <nav className="hidden md:flex items-center gap-1">
                  <button 
                     onClick={() => {setActiveTab('explore'); setSelectedAsset(null);}} 
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'explore' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'}`}
                  >
                     Explore
                  </button>
                  <button 
                     onClick={() => setActiveTab('investments')} 
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'investments' ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'}`}
                  >
                     Investments
                  </button>
                  <button 
                     onClick={() => setActiveTab('algo')} 
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'algo' ? 'text-indigo-400 bg-indigo-900/20 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                     Algo Studio
                  </button>
               </nav>
            </div>

            <div className="flex items-center gap-4">
               {/* Search Bar */}
               <div className="hidden md:flex items-center bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 w-64 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <Search size={14} className="text-slate-500 mr-2"/>
                  <input type="text" placeholder="Search stocks, crypto..." className="bg-transparent border-none focus:outline-none text-sm text-white w-full placeholder-slate-500" />
               </div>
               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800 cursor-pointer">
                  <User size={14}/>
               </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
         {activeTab === 'explore' && (selectedAsset ? renderAssetDetail() : renderExplore())}
         {activeTab === 'investments' && renderInvestments()}
         {activeTab === 'algo' && renderAlgoStudio()}
      </main>
      
      {/* Floating AI Assistant (Always visible) */}
      <AIAssistant currentPrice={currentPrice} config={config} lastSignal={signal} />
    </div>
  );
}

export default App;