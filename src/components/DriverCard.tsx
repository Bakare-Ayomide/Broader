import React from 'react';
import { MarkerData } from '../types';
import { Star, Users, Clock, DollarSign } from 'lucide-react';

interface DriverCardProps {
  item: MarkerData;
  selected: boolean;
  onSelect: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ item, selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer mb-3 border ${
        selected
          ? 'bg-[#E6F3FF] border-[#0286FF] shadow-sm ring-1 ring-[#0286FF]'
          : 'bg-white border-neutral-200 hover:border-slate-300'
      }`}
    >
      {/* Driver Avatar */}
      <img
        src={item.profile_image_url}
        alt={item.title}
        className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
      />

      {/* Info Middle */}
      <div className="flex-1 flex flex-col items-start justify-center mx-3 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-base font-JakartaSemiBold text-slate-900 truncate">
            {item.title}
          </span>
          <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 text-xs font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-JakartaMedium text-slate-500">
          <span className="font-JakartaBold text-emerald-600 flex items-center">
            ${item.price || '22.50'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-slate-600">
            <Clock className="w-3 h-3 text-slate-400" />
            {item.time || 4} mins
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-slate-600">
            <Users className="w-3 h-3 text-slate-400" />
            {item.car_seats} seats
          </span>
        </div>
      </div>

      {/* Car Vehicle Preview */}
      <div className="w-14 h-12 flex items-center justify-center shrink-0">
        <img
          src={item.car_image_url}
          alt="Car"
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>
    </div>
  );
};
