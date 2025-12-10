export enum MarketType {
  CRYPTO = 'Crypto (Binance/Bybit)',
  STOCKS = 'Stocks (Zerodha/Upstox)',
  FOREX = 'Forex (OANDA/Interactive Brokers)'
}

export enum StrategyType {
  TREND_FOLLOWING = 'Trend Following + EMA Crossover',
  SCALPING = 'High-Frequency Scalping (Orderflow)',
  BREAKOUT = 'Volatility Breakout + Retest',
  ML_PREDICTION = 'AI/ML Price Prediction (LSTM)',
  HYBRID = 'Multi-Factor (RSI + MACD + Volume)',
  PORTFOLIO_REBALANCE = 'Smart Portfolio Rebalancing'
}

export enum RiskProfile {
  CONSERVATIVE = 'Conservative (Low Risk, Stable Growth)',
  BALANCED = 'Balanced (Moderate Risk)',
  AGGRESSIVE = 'Aggressive (High Risk, Max Return)'
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
  type: 'BUY' | 'SELL' | 'HOLD' | 'REBALANCE' | 'SAFE_MODE';
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