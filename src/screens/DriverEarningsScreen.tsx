import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Receipt,
  Download,
} from 'lucide-react';

export const DriverEarningsScreen: React.FC = () => {
  const driverEarnings = useBroaderStore((s) => s.driverEarnings);
  const withdrawDriverEarnings = useBroaderStore((s) => s.withdrawDriverEarnings);
  const setScreen = useBroaderStore((s) => s.setScreen);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState('0129384756');
  const [accountName, setAccountName] = useState('CHRIS ADEWALE');
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  const nigerianBanks = [
    'Guaranty Trust Bank (GTBank)',
    'Access Bank Plc',
    'Zenith Bank Plc',
    'First Bank of Nigeria',
    'United Bank for Africa (UBA)',
    'Kuda Microfinance Bank',
    'OPay Digital Services',
    'Moniepoint MFB',
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (amountNum > driverEarnings.availableBalance) return;

    withdrawDriverEarnings(amountNum);
    setWithdrawSuccess(`₦${amountNum.toLocaleString()} successfully queued for instant NIP transfer to ${selectedBank}`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setTimeout(() => setWithdrawSuccess(null), 5000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('driver-home')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Driver Earnings</h2>
            <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">Automated Daily NIP Settlements</p>
          </div>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-3 py-1.5 rounded-full bg-[#9EE6B5] text-black font-extrabold text-xs font-JakartaBold hover:bg-[#8fd8a6] transition-colors shadow-xs"
        >
          Withdraw
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Success message banner */}
        {withdrawSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-JakartaMedium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{withdrawSuccess}</span>
          </div>
        )}

        {/* Primary Available Balance Hero Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#9EE6B5]/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-JakartaMedium text-slate-400 block">Available Balance (Withdrawable)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-JakartaBold tracking-tight">
              ₦{driverEarnings.availableBalance.toLocaleString()}
            </span>
            <span className="text-xs font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 px-2.5 py-1 rounded-full">
              Instant Payout Ready
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Pending Clearance</span>
              <p className="font-JakartaBold text-slate-200">₦{driverEarnings.pendingEarnings.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Bonuses Earned</span>
              <p className="font-JakartaBold text-emerald-400">+₦{driverEarnings.bonusesEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-JakartaMedium text-slate-400 block">Today</span>
            <span className="text-sm font-JakartaBold text-slate-900 mt-0.5 block">
              ₦{driverEarnings.today.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-JakartaMedium text-slate-400 block">This Week</span>
            <span className="text-sm font-JakartaBold text-slate-900 mt-0.5 block">
              ₦{driverEarnings.thisWeek.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-JakartaMedium text-slate-400 block">This Month</span>
            <span className="text-sm font-JakartaBold text-slate-900 mt-0.5 block">
              ₦{driverEarnings.thisMonth.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Platform Fee & Commission Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs">
          <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
            Fee & Incentive Transparency
          </h4>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-JakartaMedium">Completed Trips</span>
            <span className="font-JakartaBold text-slate-800">{driverEarnings.completedTrips} trips</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-JakartaMedium">Gross Passenger Fares</span>
            <span className="font-JakartaBold text-slate-800">
              ₦{(driverEarnings.today + driverEarnings.commissionDeducted).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-JakartaMedium">Broader Service Fee (15%)</span>
            <span className="font-JakartaBold text-red-600">
              -₦{driverEarnings.commissionDeducted.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-JakartaMedium">Peak Rush Incentive</span>
            <span className="font-JakartaBold text-emerald-600">
              +₦{driverEarnings.bonusesEarned.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between pt-1 font-JakartaBold text-sm text-slate-900">
            <span>Net Driver Earnings</span>
            <span className="text-[#9EE6B5]">₦{driverEarnings.today.toLocaleString()}</span>
          </div>
        </div>

        {/* Recent Daily Settlements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-JakartaBold text-slate-900 uppercase tracking-wider">
              Settlement History
            </h4>
            <span className="text-[10px] font-JakartaSemiBold text-emerald-600">Direct NIP Payout</span>
          </div>

          <div className="space-y-2">
            {[
              { date: 'Yesterday, 11:30 PM', amount: 42300, bank: 'GTBank •••• 4756', status: 'Settled' },
              { date: '2 days ago, 11:15 PM', amount: 38900, bank: 'GTBank •••• 4756', status: 'Settled' },
              { date: '3 days ago, 11:45 PM', amount: 51200, bank: 'GTBank •••• 4756', status: 'Settled' },
            ].map((st, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#9EE6B5]/10 text-[#9EE6B5] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-JakartaBold text-slate-900">₦{st.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-JakartaMedium">{st.bank} • {st.date}</p>
                  </div>
                </div>
                <span className="text-[10px] font-JakartaBold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {st.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WITHDRAW EARNINGS MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-JakartaBold text-slate-900">Withdraw to Nigerian Bank</h4>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 font-JakartaMedium mb-3">
              Transfer funds from your Broader Driver balance directly to your bank account via instant NIP transfer.
            </p>

            <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-JakartaSemiBold mb-1">
                  Amount to Withdraw (Max: ₦{driverEarnings.availableBalance.toLocaleString()})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₦</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 20000"
                    max={driverEarnings.availableBalance}
                    min={1000}
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 font-JakartaBold text-slate-900 focus:outline-none focus:border-[#9EE6B5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-JakartaSemiBold mb-1">Destination Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#9EE6B5] bg-white"
                >
                  {nigerianBanks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-JakartaSemiBold mb-1">NUBAN Account Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-JakartaBold tracking-wider text-slate-900 focus:outline-none focus:border-[#9EE6B5]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-JakartaSemiBold mb-1">Verified Account Name</label>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 font-JakartaBold flex items-center justify-between">
                  <span>{accountName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-full bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-md shadow-emerald-500/20 transition-all"
              >
                Confirm Instant Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
