import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { Phone, Mail, Lock, AlertCircle, CheckCircle2, KeyRound, ArrowLeft, X, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundNotification';
import { BroaderLogo } from '../components/BroaderLogo';

export const SignInScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const setSignedIn = useBroaderStore((s) => s.setSignedIn);
  const setUser = useBroaderStore((s) => s.setUser);

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('chrisbak.music@gmail.com');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [form, setForm] = useState({
    email: 'chrisbak.music@gmail.com',
    phone: '8031234567',
    password: 'password123',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    soundEngine.playClick();
    if (form.phone.length < 10) {
      setError('Please enter a valid 10 or 11-digit Nigerian phone number');
      return;
    }
    setError(null);
    setOtpSent(true);
    setOtpCode('582910'); // Simulated real-time SMS delivery
  };

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundEngine.playClick();
    setError(null);

    if (authMode === 'email' && !form.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (authMode === 'phone' && form.phone.length < 10) {
      setError('Please enter a valid 10 or 11-digit Nigerian phone number');
      return;
    }
    if (authMode === 'phone' && useOtpLogin && otpCode.length < 6) {
      setError('Please enter the 6-digit OTP code sent to your phone');
      return;
    }

    const userData = {
      id: 'usr_broader_ng_101',
      name: 'Chris Baker',
      email: form.email,
      phone: authMode === 'phone' ? `+234${form.phone}` : '+234 803 123 4567',
      walletBalance: 24500,
    };

    try {
      localStorage.setItem(
        'broader_user_session',
        JSON.stringify({
          ...userData,
          token: 'brd_sess_' + Date.now(),
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore
    }

    soundEngine.playSuccess();
    setUser(userData);
    setSignedIn(true);
    setScreen('home');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    if (!forgotIdentifier.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#020408] text-white select-none relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#9EE6B5]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#9EE6B5]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner Image */}
      <div className="relative w-full h-[180px] bg-black overflow-hidden shrink-0">
        <img
          src="/assets/images/signup-car.png"
          alt="Sign In"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-black/40 to-transparent" />
        <div className="absolute top-4 left-5 z-20">
          <BroaderLogo className="h-6 w-auto" />
        </div>
        <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#9EE6B5] font-JakartaBold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NIGERIA URBAN MOBILITY</span>
            </div>
            <h2 className="text-xl text-white font-JakartaBold tracking-tight">
              Welcome back to Broader
            </h2>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Toggle Mode */}
          <div className="flex bg-white/[0.06] p-1 rounded-2xl mb-4 text-xs font-JakartaBold border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAuthMode('email');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'email'
                  ? 'bg-[#0286FF] text-white shadow-[0_0_12px_rgba(2,134,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setAuthMode('phone');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'phone'
                  ? 'bg-[#0286FF] text-white shadow-[0_0_12px_rgba(2,134,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone (+234)</span>
            </button>
          </div>

          {error && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 font-JakartaMedium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-3">
            {authMode === 'email' ? (
              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@domain.ng"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0286FF] transition-all"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
                  Nigerian Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 border-r border-white/10 pr-2">
                    <span className="text-xs font-JakartaBold text-cyan-300">+234</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="803 123 4567"
                    className="w-full pl-16 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaBold text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0286FF] transition-all tracking-wide"
                  />
                </div>
              </div>
            )}

            {authMode === 'phone' && (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-JakartaMedium text-neutral-400">Sign-in method</span>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setUseOtpLogin(!useOtpLogin);
                    setError(null);
                  }}
                  className="text-[10px] font-JakartaBold text-[#0286FF] hover:underline"
                >
                  {useOtpLogin ? 'Use Password instead' : 'Use SMS OTP instead'}
                </button>
              </div>
            )}

            {useOtpLogin && authMode === 'phone' ? (
              <div>
                <label className="block text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
                  6-Digit Verification Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-mono font-bold tracking-widest text-white focus:outline-none focus:border-[#0286FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-xs font-JakartaBold whitespace-nowrap border border-blue-500/30"
                  >
                    {otpSent ? 'Resend OTP' : 'Get OTP'}
                  </button>
                </div>
                {otpSent && (
                  <p className="text-[10px] text-emerald-400 font-JakartaMedium mt-1">
                    OTP sent to +234 {form.phone}. (Demo code: 582910)
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-JakartaSemiBold text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setShowForgotModal(true);
                    }}
                    className="text-[10px] font-JakartaSemiBold text-[#0286FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0286FF] transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-3 py-3 rounded-2xl bg-[#0286FF] hover:bg-blue-500 active:scale-[0.98] text-white font-JakartaBold text-xs shadow-[0_0_18px_rgba(2,134,255,0.4)] transition-all"
            >
              Sign In to Broader
            </button>

            {/* Divider */}
            <div className="flex items-center my-3 gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-neutral-500 font-JakartaMedium">Or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={() => handleSignIn()}
              className="w-full py-2.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] text-white font-JakartaSemiBold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <img src="/assets/icons/google.png" alt="Google" className="w-4 h-4 object-contain" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-neutral-400 font-JakartaMedium">
            Don't have an account?{' '}
            <button
              onClick={() => {
                soundEngine.playClick();
                setScreen('sign-up');
              }}
              className="text-[#0286FF] font-JakartaBold hover:underline ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-white/15 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-[#0286FF] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-JakartaBold text-white">Reset Password</h4>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-JakartaBold text-white">Reset Link Dispatched</p>
                <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                  We've sent password reset instructions to <span className="text-cyan-300">{forgotIdentifier}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <p className="text-xs text-neutral-400 font-JakartaMedium">
                  Enter your registered Broader email address or phone number to receive a secure recovery code.
                </p>
                <div>
                  <label className="block text-[10px] font-JakartaBold text-neutral-300 mb-1">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="email@domain.com or 080..."
                    className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaMedium text-white focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0286FF] hover:bg-blue-500 text-white font-JakartaBold text-xs shadow-md transition-all"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
