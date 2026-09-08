import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { Send, Phone, ArrowLeft, Mic, MicOff, Volume2, PhoneOff, ShieldCheck, X } from 'lucide-react';

export const ChatScreen: React.FC = () => {
  const messages = useBroaderStore((s) => s.messages);
  const addMessage = useBroaderStore((s) => s.addMessage);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const [inputText, setInputText] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  const driverName = activeTrip
    ? `${activeTrip.driver.first_name} ${activeTrip.driver.last_name}`
    : 'Babatunde Adeleke';
  const driverVehicle = activeTrip
    ? `${activeTrip.driver.car_model || 'Toyota Corolla'} • ${activeTrip.driver.plate_number || 'EKY-428-AB'}`
    : 'Toyota Corolla • EKY-428-AB';
  const driverPhoto = activeTrip
    ? activeTrip.driver.profile_image_url
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80';

  const quickMessages = [
    "I'm beside the pharmacy.",
    "Please use the second entrance.",
    "I'm wearing a blue shirt.",
    "I'm at the second gate.",
    "I'm coming down now.",
  ];

  const handleSend = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;
    addMessage(textToSend.trim(), 'user');
    if (!customText) setInputText('');

    // Automated driver reply simulation (Nigerian context)
    setTimeout(() => {
      addMessage("Got it! I'm just on Adeola Odeku now, pulling up in 2 mins.", 'driver');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-white/[0.08] glass-nav shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (activeTrip) {
                setScreen('confirm-ride');
              } else {
                setScreen('home');
              }
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="relative">
            <img
              src={driverPhoto}
              alt={driverName}
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
          </div>
          <div>
            <h3 className="text-xs font-JakartaBold text-white leading-tight">
              {driverName}
            </h3>
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block truncate max-w-[170px]">
              {driverVehicle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowCallModal(true)}
            className="w-8 h-8 rounded-full bg-[#9EE6B5]/15 hover:bg-[#9EE6B5]/25 flex items-center justify-center text-[#9EE6B5] transition-colors border border-[#9EE6B5]/30"
            title="In-app voice call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#000000]">
        <div className="flex justify-center my-1">
          <span className="text-[10px] font-JakartaSemiBold text-neutral-400 glass-panel px-3 py-1 rounded-full border border-white/10">
            Broader Live Trip • Secure Encrypted Chat
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSupport = msg.sender === 'support';

          if (isSupport) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-[#9EE6B5]/15 border border-[#9EE6B5]/30 rounded-2xl p-2.5 text-center max-w-xs text-xs text-[#9EE6B5]">
                  <p className="font-JakartaMedium">{msg.text}</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-JakartaMedium shadow-xs ${
                  isUser
                    ? 'bg-[#9EE6B5] text-black font-extrabold rounded-br-xs shadow-[0_0_12px_rgba(158,230,181,0.3)]'
                    : 'glass-panel text-neutral-200 border border-white/10 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-neutral-500 mt-1 px-1 font-JakartaRegular">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Message Chips */}
      <div className="px-3 pt-2 pb-1 glass-nav border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickMessages.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(undefined, chip)}
            className="px-2.5 py-1 rounded-full glass-panel hover:border-blue-400 hover:bg-blue-500/15 hover:text-blue-400 text-neutral-300 text-[11px] font-JakartaMedium shrink-0 transition-all border border-white/10"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="p-3 glass-nav border-t border-white/[0.08] flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message driver..."
          className="flex-1 py-2.5 px-4 bg-white/[0.05] border border-white/10 rounded-full text-xs font-JakartaMedium text-white placeholder-neutral-500 focus:outline-none focus:border-[#9EE6B5] focus:bg-white/[0.08]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full bg-[#9EE6B5] disabled:opacity-40 text-black font-extrabold flex items-center justify-center hover:bg-[#8fd8a6] transition-all shrink-0 shadow-[0_0_12px_rgba(158,230,181,0.4)]"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

      {/* Masked In-App VoIP Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border border-white/15 w-full max-w-xs rounded-3xl p-6 text-center text-white shadow-2xl animate-in zoom-in-95 backdrop-blur-2xl">
            <div className="flex justify-end">
              <button
                onClick={() => setShowCallModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mx-auto w-20 h-20 my-3">
              <img
                src={driverPhoto}
                alt={driverName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#9EE6B5] shadow-xl"
              />
              <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
            </div>

            <h3 className="text-base font-JakartaBold text-white">{driverName}</h3>
            <p className="text-xs text-neutral-400 font-JakartaMedium mt-0.5">{driverVehicle}</p>
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-[#9EE6B5]/20 text-[#9EE6B5] text-[10px] font-JakartaSemiBold border border-[#9EE6B5]/30">
              <ShieldCheck className="w-3 h-3 text-[#9EE6B5]" />
              <span>Masked Private VoIP Call</span>
            </div>

            <p className="text-xs font-mono text-emerald-400 my-4">Connected • 00:34</p>

            <div className="flex items-center justify-center gap-4 my-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-amber-500 text-white' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                }`}
                title="Mute"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowCallModal(false)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isSpeaker ? 'bg-[#9EE6B5] text-black shadow-[0_0_12px_rgba(158,230,181,0.4)]' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                }`}
                title="Speaker"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
