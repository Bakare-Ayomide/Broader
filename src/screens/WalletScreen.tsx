import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const walletBalance = useBroaderStore((s) => s.walletBalance);
  const walletTransactions = useBroaderStore((s) => s.walletTransactions);
  const topUpWallet = useBroaderStore((s) => s.topUpWallet);

  const [customAmount, setCustomAmount] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank'>('card');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [txFilter, setTxFilter] = useState<'all' | 'credits' | 'debits'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  const presetAmounts = [2000, 5000, 10000, 25000];

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (txFilter === 'credits') return tx.type === 'topup' || tx.type === 'refund';
    if (txFilter === 'debits') return tx.type === 'ride_payment';
    return true;
  });

  const handleTopUp = (amount: number) => {
    if (amount <= 0) return;
    const methodTitle = selectedMethod === 'card' ? 'Debit Card (Mastercard)' : 'Direct Bank Transfer (GTBank)';
    topUpWallet(amount, methodTitle);
    setShowTopUpModal(false);
    setCustomAmount('');
    setSuccessMessage(`₦${amount.toLocaleString()} successfully credited to your Broader Wallet!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] text-white select-none">
      {/* Header - Frosted Glass */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 glass-nav border-b border-white/[0.08] shrink-0">
        <button
          onClick={() => setScreen('home')}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/20 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-JakartaBold text-white">Broader Wallet</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-JakartaSemiBold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Clean Balanced Wallet Card - Frosted Glass */}
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-5 shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-JakartaMedium flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#9EE6B5]" />
              Available Broader Balance
            </span>
            <span className="text-[11px] font-JakartaSemiBold text-[#9EE6B5] bg-[#9EE6B5]/10 px-2 py-0.5 rounded-full border border-[#9EE6B5]/20">
              Active • Nigeria
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-JakartaBold text-white tracking-tight">
              ₦{walletBalance.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => setShowTopUpModal(true)}
              className="flex-1 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_20px_rgba(158,230,181,0.4)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Top Up Wallet</span>
            </button>
          </div>
        </div>

        {/* Quick Top-Up Presets */}
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-4 shadow-xl backdrop-blur-xl">
          <h3 className="text-xs font-JakartaBold text-neutral-300 mb-2.5">
            Quick Add Funds (₦)
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleTopUp(amt)}
                className="py-2.5 px-2 rounded-2xl glass-panel border border-white/10 hover:border-[#9EE6B5] hover:bg-[#9EE6B5]/10 active:scale-95 text-xs font-JakartaBold text-white transition-all text-center"
              >
                +₦{(amt / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Linked Payment Methods Card */}
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-JakartaBold text-white uppercase tracking-wider">
              Payment Methods
            </h3>
            <span className="text-[11px] font-JakartaSemiBold text-[#9EE6B5]">3 Configured</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#9EE6B5]/10 text-[#9EE6B5] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-JakartaBold text-white">Broader Wallet</p>
                  <p className="text-[10px] text-neutral-400 font-JakartaMedium">Instant 1-tap checkout</p>
                </div>
              </div>
              <span className="text-[10px] font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 px-2 py-0.5 rounded-full border border-[#9EE6B5]/20">
                Primary
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-neutral-300 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-JakartaBold text-white">Mastercard Debit</p>
                  <p className="text-[10px] text-neutral-400 font-JakartaMedium">•••• •••• •••• 4242</p>
                </div>
              </div>
              <span className="text-[10px] font-JakartaSemiBold text-neutral-400">Connected</span>
            </div>
          </div>
        </div>

        {/* Transaction History with Filter Tabs */}
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-JakartaBold text-white">Activity & Statements</h3>
            <span className="text-[11px] font-JakartaMedium text-neutral-400">
              {filteredTransactions.length} records
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl mb-3">
            {(['all', 'credits', 'debits'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTxFilter(filter)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-JakartaBold capitalize transition-all ${
                  txFilter === filter
                    ? 'bg-white/10 text-white shadow-sm border border-white/15'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'credits' ? 'Credits (+)' : 'Payments (-)'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'topup' || tx.type === 'refund';
              return (
                <button
                  type="button"
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="w-full text-left flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors border border-transparent hover:border-white/[0.06]"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/10 text-neutral-300 border border-white/10'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-JakartaBold text-white truncate">
                        {tx.title}
                      </p>
                      <p className="text-[11px] font-JakartaMedium text-neutral-400 truncate">
                        {tx.date} • {tx.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span
                      className={`text-xs font-JakartaBold block ${
                        isCredit ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </span>
                    <span className="inline-block text-[9px] font-JakartaSemiBold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded uppercase border border-emerald-500/20">
                      {tx.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-white/15 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-JakartaBold text-white">Transaction Receipt</h4>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-4 bg-white/[0.04] rounded-2xl border border-white/[0.06] mb-4">
              <span className="text-2xl font-JakartaBold text-white">
                ₦{selectedTransaction.amount.toLocaleString()}
              </span>
              <p className="text-xs font-JakartaMedium text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transaction Successful</span>
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Description</span>
                <span className="font-JakartaBold text-white text-right max-w-[200px] truncate">
                  {selectedTransaction.title}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Date & Time</span>
                <span className="font-JakartaSemiBold text-neutral-200">{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Reference</span>
                <span className="font-mono text-neutral-300 font-bold">{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-neutral-400 font-JakartaMedium">Type</span>
                <span className="font-JakartaSemiBold uppercase text-neutral-200">
                  {selectedTransaction.type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400 font-JakartaMedium">Payment Channel</span>
                <span className="font-JakartaSemiBold text-neutral-200">
                  {selectedTransaction.description || 'Broader Core Payment'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTransaction(null)}
              className="w-full mt-5 py-3 rounded-full bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_16px_rgba(158,230,181,0.4)] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-white/15 animate-in zoom-in-95 text-white">
            <h3 className="text-base font-JakartaBold text-white mb-1">Top Up Broader Wallet</h3>
            <p className="text-xs text-neutral-400 font-JakartaMedium mb-4">
              Add funds instantly using Debit Card or Nigerian Bank Transfer.
            </p>

            {/* Method Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-JakartaSemiBold flex items-center justify-center gap-2 transition-all ${
                  selectedMethod === 'card'
                    ? 'border-[#9EE6B5] bg-[#9EE6B5]/15 text-[#9EE6B5] font-JakartaBold'
                    : 'glass-panel border-white/10 text-neutral-300 hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('bank')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-JakartaSemiBold flex items-center justify-center gap-2 transition-all ${
                  selectedMethod === 'bank'
                    ? 'border-[#9EE6B5] bg-[#9EE6B5]/15 text-[#9EE6B5] font-JakartaBold'
                    : 'glass-panel border-white/10 text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Bank Transfer</span>
              </button>
            </div>

            {/* Amount input */}
            <div className="mb-4">
              <label className="block text-xs font-JakartaBold text-neutral-300 mb-1.5">
                Amount (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl text-sm font-JakartaBold text-white placeholder-neutral-500 focus:outline-none focus:border-[#9EE6B5]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="flex-1 py-3 rounded-2xl border border-white/15 text-neutral-300 font-JakartaBold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleTopUp(Number(customAmount) || 5000)}
                className="flex-1 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_16px_rgba(158,230,181,0.4)]"
              >
                Pay ₦{Number(customAmount) ? Number(customAmount).toLocaleString() : '5,000'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
