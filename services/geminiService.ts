import { GoogleGenAI, Type } from "@google/genai";
import { BotConfig, MarketData, TradeSignal } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

/**
 * Analyzes simulated market data to provide a detailed trading signal with regime and sentiment.
 */
export const analyzeMarket = async (
  data: MarketData[],
  config: BotConfig
): Promise<TradeSignal> => {
  try {
    const recentData = data.slice(-20);
    const dataString = JSON.stringify(recentData);

    const prompt = `
      You are an elite institutional financial analyst AI.
      Analyze the following OHLCV market data (last 20 candles):
      ${dataString}

      Configuration:
      - Strategy: ${config.strategy}
      - Risk Profile: ${config.riskProfile}
      - Market: ${config.market}

      Determine:
      1. Market Regime (Bull, Bear, Sideways, Volatile)
      2. Market Sentiment based on price action and volume
      3. Trading Signal (Buy, Sell, Hold, Safe Mode)
      4. Confidence Score

      Output ONLY JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD", "SAFE_MODE"] },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            marketRegime: { type: Type.STRING, enum: ["BULL", "BEAR", "SIDEWAYS", "VOLATILE"] },
            sentiment: { type: Type.STRING, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
            reasoning: { type: Type.STRING, description: "Detailed technical analysis summary" }
          },
          required: ["type", "confidence", "reasoning", "marketRegime", "sentiment"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return {
        ...result,
        timestamp: new Date().toLocaleTimeString()
      };
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      type: 'HOLD',
      confidence: 0,
      marketRegime: 'SIDEWAYS',
      sentiment: 'NEUTRAL',
      reasoning: "AI Analysis unavailable. Check API Key.",
      timestamp: new Date().toLocaleTimeString()
    };
  }
};

/**
 * Generates the Complete System Architecture Python code.
 */
export const generateBotCode = async (config: BotConfig): Promise<string> => {
  try {
    const prompt = `
      Act as a Lead Quantitative Architect at a hedge fund.
      Design and generate a COMPLETE Python Automated Investment & Trading System.

      System Requirements:
      1. **Architecture**: Modular class-based design.
      2. **Market**: ${config.market}
      3. **Strategy Core**: ${config.strategy} (Implement logic using pandas/numpy/ta-lib).
      4. **AI Module**: Implement a placeholder for ${config.aiModel} using sklearn/tensorflow logic (e.g., predict_next_price).
      5. **Risk Management Layer (Crucial)**:
         - Profile: ${config.riskProfile}
         - Max Risk Per Trade: ${config.riskPerTrade}%
         - Stop Loss: ${config.stopLoss}%
         - Daily Loss Limit
         - Emergency 'Kill Switch' method.
      6. **Auto-Invest/Rebalance**: ${config.autoRebalance ? "Include 'PortfolioManager' class for asset allocation and rebalancing." : "Trading focus only."}
      7. **Execution**: ${config.market.includes('Crypto') ? "Use 'ccxt' library" : "Use generic Broker API structure"}.

      The code must be a SINGLE runnable Python script (simulating a multi-file project structure).
      Include copious comments explaining "Best Practices" and "Deployment" (e.g., "Deploy on AWS EC2/t3.micro with Docker").

      Output ONLY Python code.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Good for large code generation
      contents: prompt,
    });

    return response.text || "# Error generating system code.";
  } catch (error) {
    console.error("Code Gen Error:", error);
    return "# Error generating code. Please check API Key.";
  }
};

/**
 * Generates robust backtesting and paper trading code.
 */
export const generateBacktestCode = async (config: BotConfig): Promise<string> => {
  try {
      const prompt = `
      Generate a professional Python Backtesting script using 'backtrader' framework.
      
      Strategy: ${config.strategy}
      Risk Management:
      - Stop Loss: ${config.stopLoss}%
      - Take Profit: ${config.takeProfit}%
      - Trailing Stop: ${config.useTrailingStop}
      
      Features:
      1. Load data from CSV.
      2. Implement the strategy logic inside a backtrader Strategy class.
      3. Add 'Sizers' to manage risk per trade (${config.riskPerTrade}% of capital).
      4. Add Analyzers: Sharpe Ratio, Drawdown, Trade Analyzer.
      5. Print final portfolio value.

      Output ONLY the Python code.
      `;
      
      const response = await ai.models.generateContent({
          model: modelId,
          contents: prompt
      });
      return response.text || "# Error generating backtest code.";
  } catch (e) {
      return "# Error generating backtest code.";
  }
}