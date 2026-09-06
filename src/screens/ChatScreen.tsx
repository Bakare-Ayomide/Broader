import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { Send, Phone, ArrowLeft } from 'lucide-react';

export const ChatScreen: React.FC = () => {
  const messages = useBroaderStore((s) => s.messages);
  const addMessage = useBroaderStore((s) => s.addMessage);
  const activeTrip = useBroaderStore((s) => s.activeTrip);
  const setScreen = useBroaderStore((s) => s.setScreen);
  const [inputText, setInputText] = useState('');

  const driverName = activeTrip
    ? `${activeTrip.driver.first_name} ${activeTrip.driver.last_name}`
    : 'Babatunde Adeleke';
  const driverVehicle = activeTrip
    ? `${activeTrip.driver.car_model || 'Toyota Corolla'} • ${activeTrip.driver.plate_number || 'EKY-428-AB'}`
    : 'Toyota Corolla • EKY-428-AB';
  const driverPhoto = activeTrip
    ? activeTrip.driver.profile_image_url
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addMessage(inputText.trim(), 'user');
    setInputText('');

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
          <a
            href="tel:+2348031123344"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#0286FF] transition-colors"
            title="Call driver"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
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
    </div>
  );
};
