import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { Phone, Mail, Lock, AlertCircle, CheckCircle2, KeyRound, ArrowLeft, X } from 'lucide-react';

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

    // Store in local storage for session persistence
    try {
      localStorage.setItem('broader_user_session', JSON.stringify({
        ...userData,
        token: 'brd_sess_' + Date.now(),
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // Ignore if localStorage disabled
    }

    setUser(userData);
    setSignedIn(true);
    setScreen('home');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-full bg-white select-none">
      {/* Header Banner Image */}
      <div className="relative w-full h-[200px] bg-slate-900 overflow-hidden shrink-0">
        <img
          src="/assets/images/signup-car.png"
          alt="Sign In"
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <h2 className="text-2xl text-white font-JakartaSemiBold absolute bottom-4 left-5">
          Welcome to Broader 👋
        </h2>
      </div>

      {/* Form Fields */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Toggle Mode */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-JakartaBold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'phone' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone (+234)</span>
            </button>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-JakartaMedium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-3.5">
            {authMode === 'email' ? (
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <img
                    src="/assets/icons/email.png"
                    alt="email"
                    className="w-4 h-4 absolute left-3.5 opacity-60"
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@domain.ng"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white transition-all"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">
                  Nigerian Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 border-r border-slate-300 pr-2">
                    <span className="text-xs font-JakartaBold text-slate-700">+234</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="803 123 4567"
                    className="w-full pl-18 pr-4 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaBold text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white transition-all tracking-wide"
                  />
                </div>
              </div>
            )}

            {authMode === 'phone' && (
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-JakartaMedium text-slate-500">Sign-in method</span>
                <button
                  type="button"
                  onClick={() => {
                    setUseOtpLogin(!useOtpLogin);
                    setError(null);
                  }}
                  className="text-[11px] font-JakartaBold text-[#0286FF] hover:underline"
                >
                  {useOtpLogin ? 'Use Password instead' : 'Use SMS OTP instead'}
                </button>
              </div>
            )}

            {useOtpLogin && authMode === 'phone' ? (
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">
                  6-Digit Verification Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-3.5 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0286FF] text-xs font-JakartaBold whitespace-nowrap border border-blue-200"
                  >
                    {otpSent ? 'Resend OTP' : 'Get OTP'}
                  </button>
                </div>
                {otpSent && (
                  <p className="text-[10px] text-emerald-600 font-JakartaMedium mt-1">
                    OTP sent to +234 {form.phone}. (Demo code: 582910)
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-JakartaSemiBold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-JakartaSemiBold text-[#0286FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <img
                    src="/assets/icons/lock.png"
                    alt="lock"
                    className="w-4 h-4 absolute left-3.5 opacity-60"
                  />
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-3 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 active:scale-[0.99] text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all"
            >
              Sign In to Broader
            </button>

            {/* Divider */}
            <div className="flex items-center my-3 gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 font-JakartaMedium">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={() => handleSignIn()}
              className="w-full py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-JakartaSemiBold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <img src="/assets/icons/google.png" alt="Google" className="w-4 h-4 object-contain" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-500 font-JakartaMedium">
            Don't have an account?{' '}
            <button
              onClick={() => setScreen('sign-up')}
              className="text-[#0286FF] font-JakartaBold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0286FF] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-JakartaBold text-slate-900">Reset Password</h4>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-JakartaBold text-slate-900">Reset Link Dispatched</p>
                <p className="text-[11px] text-slate-500 font-JakartaMedium">
                  We've sent password reset instructions to <span className="text-slate-800 font-semibold">{forgotIdentifier}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <p className="text-xs text-slate-500 font-JakartaMedium">
                  Enter your registered Broader email address or phone number to receive a secure recovery code.
                </p>
                <div>
                  <label className="block text-[11px] font-JakartaSemiBold text-slate-700 mb-1">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="email@domain.com or 080..."
                    className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all"
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
