
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { BotConfig, ChatMessage, TradeSignal } from '../types';
import { chatWithAI } from '../services/geminiService';

interface AIAssistantProps {
  currentPrice: number;
  config: BotConfig;
  lastSignal: TradeSignal | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentPrice, config, lastSignal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Greetings, Commander. I am Captain Quant, your Autonomous Trading Pilot. I am monitoring the markets and your Secure Vault. Awaiting your orders, Sir.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await chatWithAI(userMsg.text, currentPrice, config, lastSignal);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-indigo-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Captain Quant</h3>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-indigo-100 opacity-90">Auto-Pilot Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-indigo-100 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-slate-950/50 backdrop-blur-sm">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
             <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-4 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Give an order, Commander..."
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                </button>
             </div>
             <div className="flex justify-center mt-2 space-x-3">
                 <button onClick={() => setInput("Status Report")} className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors border border-slate-700 px-2 py-0.5 rounded-full">Status</button>
                 <button onClick={() => setInput("Execute Buy Order")} className="text-[10px] text-slate-500 hover:text-green-400 transition-colors border border-slate-700 px-2 py-0.5 rounded-full">Buy</button>
                 <button onClick={() => setInput("Check Vault Safety")} className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors border border-slate-700 px-2 py-0.5 rounded-full">Vault</button>
             </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-700 scale-90' : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'} text-white p-4 rounded-full shadow-lg shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default AIAssistant;
