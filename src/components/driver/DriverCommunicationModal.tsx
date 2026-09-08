import React, { useState } from 'react';
import { Phone, PhoneOff, MessageSquare, Send, X, User, Mic, MicOff, Volume2 } from 'lucide-react';

interface DriverCommunicationModalProps {
  isOpen: boolean;
  type: 'call' | 'chat';
  onClose: () => void;
  passengerName: string;
  passengerPhone?: string;
  passengerImage?: string;
}

export const DriverCommunicationModal: React.FC<DriverCommunicationModalProps> = ({
  isOpen,
  type,
  onClose,
  passengerName,
  passengerPhone = '+234 812 345 6789',
  passengerImage,
}) => {
  // Call states
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'driver' | 'passenger'; text: string; time: string }>>([
    { sender: 'passenger', text: 'Hello! Are you close to the pickup gate?', time: 'Just now' },
  ]);

  if (!isOpen) return null;

  const quickReplies = [
    "I'm outside in the silver Corolla",
    'I have arrived at the pickup location',
    'Heavy traffic on the roundabout, 2 mins away',
    'Please come out to the gate',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: 'driver',
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');

    // Simulate passenger auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'passenger',
          text: 'Got it, coming right out now. Thanks!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-5 shadow-2xl border border-white/15 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <img
              src={passengerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={passengerName}
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
            <div>
              <h3 className="text-sm font-JakartaBold text-white">{passengerName}</h3>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                {type === 'call' ? 'Broader Masked VoIP Call' : 'Encrypted In-App Chat'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CALL VIEW */}
        {type === 'call' ? (
          <div className="text-center py-6 space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={passengerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={passengerName}
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white/30"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center shadow-xs">
                <Volume2 className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div>
              <h4 className="text-base font-JakartaBold text-white">{passengerName}</h4>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{passengerPhone}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-[#0286FF] border border-blue-500/30 text-[11px] font-JakartaBold">
                {callConnected ? `Connected • 00:${callDuration < 10 ? '0' + callDuration : callDuration}` : 'Ringing passenger...'}
              </span>
            </div>

            {/* Audio waveform mock */}
            <div className="flex items-center justify-center gap-1 h-6">
              {[40, 70, 95, 60, 85, 100, 50, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#0286FF] rounded-full animate-pulse shadow-[0_0_6px_rgba(2,134,255,0.6)]"
                  style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-amber-500 text-white' : 'glass-panel text-neutral-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 active:scale-95 transition-all"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          /* CHAT VIEW */
          <div className="space-y-3">
            {/* Messages box */}
            <div className="h-56 overflow-y-auto space-y-2 p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'driver' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl ${
                      m.sender === 'driver'
                        ? 'bg-[#0286FF] text-white rounded-br-xs shadow-[0_0_8px_rgba(2,134,255,0.4)]'
                        : 'glass-panel text-neutral-100 border border-white/10 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="font-JakartaMedium leading-relaxed text-[11px]">{m.text}</p>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick response chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qr)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-blue-500/20 text-[#0286FF] hover:bg-blue-500/30 text-[10px] font-JakartaBold border border-blue-500/30 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message to passenger..."
                className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-[#0286FF]"
              />
              <button
                onClick={() => handleSendMessage()}
                className="w-10 h-10 rounded-xl bg-[#0286FF] hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(2,134,255,0.4)] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
