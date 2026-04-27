import { useState, useRef, useEffect } from 'react';

// 請替換為你的 Firebase Functions 本機或正式網址
const API_URL = import.meta.env.VITE_CHAT_API_URL || "http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1/chatWithAI";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: '您好！我是年會小助手，關於 2026 年鳳凰城年會有什麼我可以協助您的？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error('API response failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.answer || '抱歉，我目前無法回答這個問題。' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: '發生錯誤，請確認網路連線或稍後再試。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 聊天視窗 */}
      <div 
        className={`mb-4 w-[350px] max-w-[calc(100vw-2rem)] bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-5 py-4 border-b border-amber-500/20 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
            <h3 className="text-amber-400 font-medium tracking-widest text-sm">年會小助手</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors relative z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="h-[400px] max-h-[60vh] overflow-y-auto p-4 space-y-4 bg-zinc-900/50 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-amber-500/10 text-amber-100 border border-amber-500/20 rounded-br-sm' 
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 border border-zinc-700/50 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800/80">
          <div className="flex items-center bg-zinc-800/80 rounded-full border border-zinc-700/80 focus-within:border-amber-500/50 overflow-hidden transition-colors px-1 shadow-inner">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入訊息..."
              className="flex-1 bg-transparent text-white text-sm px-4 py-2.5 focus:outline-none placeholder-zinc-500"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-1.5 mr-1 text-amber-500 hover:bg-amber-500/10 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -rotate-90 transform translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 懸浮觸發按鈕 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen 
            ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/50 rotate-90 shadow-none' 
            : 'bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-900 shadow-amber-500/30'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
}
