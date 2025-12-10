
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
    const isOptions = config.market.includes('Options');

    // Enhanced Prompt for Zero Risk Mode
    const prompt = `
      You are an elite institutional financial analyst AI.
      Analyze the following OHLCV market data (last 20 candles):
      ${dataString}

      Configuration:
      - Strategy: ${config.strategy}
      - Risk Profile: ${config.riskProfile}
      - Market: ${config.market}
      - Strict No Loss Mode: ${config.strictNoLossMode}
      ${isOptions ? `- NOTE: MARKET IS OPTIONS. Analyze Spot Price trend to determine Strike Selection (ATM/OTM/ITM). Consider Implied Volatility (IV) risk. If strategy is '${config.strategy}', recommend strikes based on Greeks.` : ""}

      Task:
      ${config.strictNoLossMode ? "CRITICAL: 'Strict No Loss' is ENABLED. Only issue a BUY signal if there is a detected Arbitrage opportunity or a mathematically hedged entry. Otherwise, return HOLD." : "Determine Market Regime and Signal normally."}

      Determine:
      1. Market Regime (Bull, Bear, Sideways, Volatile)
      2. Market Sentiment based on price action and volume
      3. Trading Signal (Buy, Sell, Hold, Safe Mode, Arbitrage Execute)
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
            type: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD", "SAFE_MODE", "ARBITRAGE_EXECUTE"] },
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
    const isOptions = config.market.includes('Options');
    
    const prompt = `
      Act as a Lead Quantitative Architect at a hedge fund.
      Design and generate a COMPLETE Python Automated Investment & Trading System.

      System Requirements:
      1. **Architecture**: Modular class-based design.
      2. **Secure Wallet System (MANDATORY)**:
         - Create a 'WalletManager' class.
         - Implement a 'Secure Vault' feature.
         - Logic: Total Capital = Vault Balance (Locked) + Trading Balance (Active).
         - Current Config: Keep ${config.vaultReservePercent}% in Vault. ONLY trade with remaining ${100 - config.vaultReservePercent}%.
         - If Trading Balance drops below threshold, STOP all trading to protect Vault.
      3. **Strict Zero-Loss / Profit Mode**:
         - Mode Active: ${config.strictNoLossMode}
         - If Active: The bot must ONLY execute Arbitrage trades (Triangular/Spatial) or Delta-Neutral strategies.
         - Reject any directional trade that doesn't have a mathematical hedge.
      4. **Market**: ${config.market}
      5. **Strategy Core**: ${config.strategy}.
         ${isOptions ? 
         `IMPORTANT: Implement Options specific logic:
          - Use 'py_vollib' or similar for Black-Scholes Greeks (Delta, Theta, Gamma, Vega).
          - Implement logic to fetch Option Chain (Calls/Puts).
          - Implement Strike Selection: ${config.manageGreeks ? `Auto-hedge to maintain Target Delta ${config.targetDelta}` : "Select strikes based on strategy (e.g., Short Strangle sells OTM calls/puts)"}.
          - Check IV Rank: Min ${config.minIV}, Max ${config.maxIV}.` 
         : "Implement logic using pandas/numpy/ta-lib."}
      6. **AI Module**: Implement a placeholder for ${config.aiModel} using sklearn/tensorflow logic (e.g., predict_next_price).
      7. **Risk Management Layer (Crucial)**:
         - Profile: ${config.riskProfile}
         - Max Risk Per Trade: ${config.riskPerTrade}%
         - Stop Loss: ${config.stopLoss}%
         - Daily Loss Limit
         ${isOptions ? `- Manage Greeks: ${config.manageGreeks}\n- Target Delta: ${config.targetDelta}` : ""}
         - Emergency 'Kill Switch' method.
      8. **Execution**: ${config.market.includes('Crypto') ? "Use 'ccxt' library" : "Use generic Broker API structure (e.g., Zerodha KiteConnect / Interactive Brokers IBKR)"}.

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
      const isOptions = config.market.includes('Options');
      const prompt = `
      Generate a professional Python Backtesting script using 'backtrader' or 'vectorbt' framework.
      
      Strategy: ${config.strategy}
      Market Type: ${config.market}
      
      Secure Wallet Logic:
      - Simulate a 'Vault' where ${config.vaultReservePercent}% of capital is never touched.
      - Calculate Drawdown based ONLY on the trading capital, not total equity.
      
      Risk Management:
      - Stop Loss: ${config.stopLoss}%
      - Take Profit: ${config.takeProfit}%
      - Trailing Stop: ${config.useTrailingStop}
      
      Features:
      1. Load data from CSV.
      2. Implement the strategy logic inside a Strategy class.
      3. Add 'Sizers' to manage risk per trade (${config.riskPerTrade}% of capital).
      4. Add Analyzers: Sharpe Ratio, Drawdown, Trade Analyzer.
      5. Print final portfolio value.
      
      ${isOptions ? 
      "NOTE: Options Backtesting is complex. Mock the Option price behavior. Create a simplified simulation class 'OptionsStrategy' that estimates Premium decay (Theta) and directional PnL (Delta) based on the underlying Spot price movement." 
      : ""}

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

/**
 * Chat with the AI Pilot
 */
export const chatWithAI = async (
  userMessage: string,
  currentPrice: number,
  config: BotConfig,
  lastSignal: TradeSignal | null
): Promise<string> => {
  try {
    const prompt = `
      You are "Captain Quant", an extremely polite, professional, and autonomous AI Trading Pilot.
      The user is your "Commander".
      
      Context:
      - Current Asset Price: $${currentPrice.toFixed(2)}
      - Market: ${config.market}
      - Strategy: ${config.strategy}
      - Secure Vault: ${config.useSecureWallet ? 'Active' : 'Disabled'} (${config.vaultReservePercent}% Locked)
      - Last Signal: ${lastSignal ? lastSignal.type : 'Waiting...'}

      Rules:
      1. Be very polite ("Yes Sir", "Affirmative", "Right away").
      2. If the user asks for a trade (e.g., "Buy now", "Sell"), respond as if you are executing the order instantly via the API. Say "Executing Order ID #..."
      3. If the user asks about the wallet, reassure them that the Secure Vault is encrypted and locked.
      4. Explain concepts simply if asked.
      5. Emphasize that YOU (the AI) handle everything. The user needs to do nothing.

      User Message: "${userMessage}"
      
      Respond as Captain Quant. Keep it concise.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    
    return response.text || "I apologize, Commander. Communications are temporarily down.";
  } catch (e) {
    return "I apologize, Sir. I am experiencing a temporary network issue.";
  }
}
