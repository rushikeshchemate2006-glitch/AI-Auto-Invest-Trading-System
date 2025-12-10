
export enum MarketType {
  CRYPTO = 'Crypto (Binance/Bybit)',
  STOCKS = 'Stocks (Zerodha/Upstox)',
  FOREX = 'Forex (OANDA/Interactive Brokers)',
  OPTIONS = 'Options (Nifty/BankNifty/SPX)'
}

export enum StrategyType {
  TREND_FOLLOWING = 'Trend Following + EMA Crossover',
  SCALPING = 'High-Frequency Scalping (Orderflow)',
  BREAKOUT = 'Volatility Breakout + Retest',
  ML_PREDICTION = 'AI/ML Price Prediction (LSTM)',
  HYBRID = 'Multi-Factor (RSI + MACD + Volume)',
  PORTFOLIO_REBALANCE = 'Smart Portfolio Rebalancing',
  // Options Specific Strategies
  OPTIONS_IRON_CONDOR = 'Options: Iron Condor (Range Bound / Neutral)',
  OPTIONS_STRADDLE = 'Options: Straddle / Strangle (High Volatility)',
  OPTIONS_SPREADS = 'Options: Bull/Bear Spreads (Directional)',
  OPTIONS_WHEEL = 'Options: The Wheel Strategy (Income)',
  OPTIONS_COVERED_CALL = 'Options: Covered Call (Safe Income)',
  OPTIONS_GAMMA_SCALPING = 'Options: Gamma Scalping (Market Maker)',
  // Zero Risk / Arbitrage
  ARBITRAGE_TRIANGULAR = 'Zero Risk: Triangular Arbitrage (Crypto)',
  ARBITRAGE_CASH_CARRY = 'Zero Risk: Cash & Carry (Spot vs Future)'
}

export enum RiskProfile {
  CONSERVATIVE = 'Conservative (Low Risk, Stable Growth)',
  BALANCED = 'Balanced (Moderate Risk)',
  AGGRESSIVE = 'Aggressive (High Risk, Max Return)',
  ZERO_RISK = 'Zero Risk (Arbitrage Only)'
}

export enum AIModel {
  LSTM = 'LSTM (Long Short-Term Memory)',
  TRANSFORMER = 'Transformer (Time-Series)',
  XGBOOST = 'XGBoost / LightGBM'
}

export interface BotConfig {
  market: MarketType;
  strategy: StrategyType;
  riskProfile: RiskProfile;
  aiModel: AIModel;
  riskPerTrade: number; // Percentage
  stopLoss: number; // Percentage
  takeProfit: number; // Percentage
  useTrailingStop: boolean;
  autoRebalance: boolean;
  safeMode: boolean; // Auto-switch to stablecoins/cash in high volatility
  leverage: number;
  // Options Specific
  manageGreeks?: boolean; // Delta/Theta management
  targetDelta?: number;
  minIV?: number; // Minimum Implied Volatility to enter trade
  maxIV?: number; // Maximum Implied Volatility
  // Secure Wallet Specific
  useSecureWallet: boolean;
  vaultReservePercent: number; // % of funds LOCKED in safe wallet
  strictNoLossMode: boolean; // Only take trades with mathematically guaranteed profit (Arbitrage)
}

export interface MarketData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeSignal {
  type: 'BUY' | 'SELL' | 'HOLD' | 'REBALANCE' | 'SAFE_MODE' | 'ARBITRAGE_EXECUTE';
  confidence: number;
  reasoning: string;
  marketRegime: 'BULL' | 'BEAR' | 'SIDEWAYS' | 'VOLATILE';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  timestamp: string;
}

export interface GeneratedCode {
  fileName: string;
  language: string;
  content: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number; // Percentage
  type: 'CRYPTO' | 'STOCK' | 'INDEX';
  icon?: string;
}