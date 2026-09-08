import React, { useState } from 'react';
import { useBroaderStore } from '../../store/useBroaderStore';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Percent,
  X,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export const DriverEarningsView: React.FC = () => {
  const driverEarnings = useBroaderStore((s) => s.driverEarnings);
  const driverTripsHistory = useBroaderStore((s) => s.driverTripsHistory);
  const withdrawDriverEarnings = useBroaderStore((s) => s.withdrawDriverEarnings);

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [selectedBank, setSelectedBank] = useState('Access Bank');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('Chris Bakare');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const nigerianBanks = [
    'Access Bank',
    'Guaranty Trust Bank (GTBank)',
    'Zenith Bank',
    'United Bank for Africa (UBA)',
    'First Bank of Nigeria',
    'Kuda Microfinance Bank',
    'OPay Digital Services',
    'Moniepoint MFB',
  ];

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > driverEarnings.availableBalance) {
      return;
    }
    setIsProcessing(true);
    const success = await withdrawDriverEarnings(amount, selectedBank, accountNumber, accountName);
    setIsProcessing(false);
    if (success) {
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setWithdrawModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-3 pb-6 animate-in fade-in duration-200">
      {/* Available Balance Hero Card */}
      <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-JakartaMedium text-neutral-400 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#0286FF]" />
            Available Payout Balance
          </span>
          <span className="text-[10px] font-JakartaBold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Instant NIBSS Settlement
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-JakartaBold text-white tracking-tight">
              ₦{driverEarnings.availableBalance.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-400 font-JakartaMedium">NGN</span>
          </div>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            disabled={driverEarnings.availableBalance <= 0}
            className="px-3.5 py-2 rounded-xl bg-[#0286FF] hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-JakartaBold shadow-[0_0_16px_rgba(2,134,255,0.4)] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Withdraw</span>
          </button>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-xs">
          <div className="p-2 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block">Today</span>
            <span className="font-JakartaBold text-white">₦{driverEarnings.today.toLocaleString()}</span>
          </div>
          <div className="p-2 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block">This Week</span>
            <span className="font-JakartaBold text-white">₦{driverEarnings.thisWeek.toLocaleString()}</span>
          </div>
          <div className="p-2 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <span className="text-[10px] text-neutral-400 font-JakartaMedium block">This Month</span>
            <span className="font-JakartaBold text-white">₦{driverEarnings.thisMonth.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Platform Commission & Performance Card */}
      <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xl space-y-2.5">
        <h4 className="text-xs font-JakartaBold text-white uppercase tracking-wide flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-[#0286FF]" />
          Platform Settlement & Fees
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center p-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-[#0286FF] flex items-center justify-center">
                <Percent className="w-3 h-3" />
              </div>
              <span className="text-neutral-300 font-JakartaMedium text-[11px]">Broader Platform Service Fee</span>
            </div>
            <span className="font-JakartaBold text-white">15.0%</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <span className="text-neutral-300 font-JakartaMedium text-[11px]">Completed Passenger Rides</span>
            </div>
            <span className="font-JakartaBold text-white">{driverEarnings.completedTrips} Trips</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-3 h-3" />
              </div>
              <span className="text-neutral-300 font-JakartaMedium text-[11px]">Driver Bonuses & Incentives</span>
            </div>
            <span className="font-JakartaBold text-emerald-400">+₦{driverEarnings.bonusesEarned.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Per-Trip Earnings Statement List */}
      <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-JakartaBold text-white uppercase tracking-wide">
            Recent Per-Trip Payouts
          </h4>
          <span className="text-[10px] text-neutral-400 font-JakartaMedium">
            {driverTripsHistory.length} records
          </span>
        </div>

        <div className="space-y-2">
          {driverTripsHistory.slice(0, 5).map((trip) => (
            <div
              key={trip.id}
              className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.08] space-y-1.5 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      trip.passengerImage ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                    }
                    alt={trip.passengerName}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <p className="text-xs font-JakartaBold text-white">{trip.passengerName}</p>
                    <span className="text-[10px] text-neutral-400 font-JakartaMedium">{trip.timestamp}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-JakartaBold text-emerald-400 block">
                    +₦{trip.netEarnings.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-neutral-400">
                    Gross ₦{trip.fare.toLocaleString()} • Fee -₦{trip.commission.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 font-JakartaMedium flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span className="truncate max-w-[200px]">{trip.pickup.split(',')[0]} → {trip.destination.split(',')[0]}</span>
                <span>{trip.distanceKm} km • {trip.durationMinutes}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WITHDRAWAL MODAL TO NIGERIAN BANK */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-5 shadow-2xl border border-white/15 space-y-3.5 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-[#0286FF] border border-blue-500/30 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-JakartaBold text-white">Withdraw to Nigerian Bank</h3>
                  <p className="text-[10px] text-neutral-400 font-JakartaMedium">Instant NIBSS NIP Transfer</p>
                </div>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-JakartaBold text-emerald-300">Payout Successfully Sent</h4>
                <p className="text-[11px] text-emerald-200/90">
                  ₦{parseFloat(withdrawAmount).toLocaleString()} dispatched to {selectedBank} ({accountNumber}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div>
                  <label className="text-[11px] font-JakartaBold text-neutral-300 block mb-1">
                    Amount to Withdraw (Max ₦{driverEarnings.availableBalance.toLocaleString()})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-400">₦</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={driverEarnings.availableBalance}
                      min={100}
                      className="w-full pl-7 pr-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-JakartaBold text-white focus:outline-hidden focus:border-[#0286FF]"
                      placeholder="5000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-JakartaBold text-neutral-300 block mb-1">Destination Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-black/80 border border-white/15 rounded-xl text-xs font-JakartaMedium text-white focus:outline-hidden focus:border-[#0286FF]"
                  >
                    {nigerianBanks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-JakartaBold text-neutral-300 block mb-1">Account Number</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-[#0286FF]"
                      placeholder="0123456789"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-JakartaBold text-neutral-300 block mb-1">Account Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-JakartaBold text-white focus:outline-hidden focus:border-[#0286FF]"
                      placeholder="Chris Bakare"
                      required
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-2 text-[10px] text-blue-300">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#0286FF]" />
                  <span>Zero transfer fees on Broader driver earnings payouts.</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing || parseFloat(withdrawAmount) > driverEarnings.availableBalance}
                    className="w-full py-2.5 rounded-xl bg-[#0286FF] hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-JakartaBold shadow-[0_0_16px_rgba(2,134,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{isProcessing ? 'Processing Transfer...' : 'Confirm Bank Payout'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
