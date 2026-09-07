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
    <div className="flex flex-col h-full bg-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (activeTrip) {
                setScreen('confirm-ride');
              } else {
                setScreen('home');
              }
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="relative">
            <img
              src={driverPhoto}
              alt={driverName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <h3 className="text-xs font-JakartaBold text-slate-900 leading-tight">
              {driverName}
            </h3>
            <span className="text-[10px] text-slate-500 font-JakartaMedium block truncate max-w-[170px]">
              {driverVehicle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowCallModal(true)}
            className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-[#0286FF] transition-colors border border-blue-200"
            title="In-app voice call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F6F8FA]">
        <div className="flex justify-center my-1">
          <span className="text-[10px] font-JakartaSemiBold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200">
            Broader Live Trip • Secure Chat
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSupport = msg.sender === 'support';

          if (isSupport) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-blue-50 border border-blue-200/60 rounded-xl p-2 text-center max-w-xs text-xs text-blue-900">
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
                    ? 'bg-[#0286FF] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1 font-JakartaRegular">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Message Chips */}
      <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickMessages.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(undefined, chip)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0286FF] text-slate-600 text-[11px] font-JakartaMedium shrink-0 transition-colors border border-slate-200/60"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message driver..."
          className="flex-1 py-2.5 px-4 bg-[#F6F8FA] border border-slate-200 rounded-full text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full bg-[#0286FF] disabled:opacity-40 text-white flex items-center justify-center hover:bg-blue-600 transition-all shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

      {/* Masked In-App VoIP Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-3xl p-6 text-center text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-end">
              <button
                onClick={() => setShowCallModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mx-auto w-20 h-20 my-3">
              <img
                src={driverPhoto}
                alt={driverName}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-xl"
              />
              <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
            </div>

            <h3 className="text-base font-JakartaBold">{driverName}</h3>
            <p className="text-xs text-slate-400 font-JakartaMedium mt-0.5">{driverVehicle}</p>
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-JakartaSemiBold">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Masked Private VoIP Call</span>
            </div>

            <p className="text-xs font-mono text-emerald-400 my-4">Connected • 00:34</p>

            <div className="flex items-center justify-center gap-4 my-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Mute"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowCallModal(false)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isSpeaker ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
