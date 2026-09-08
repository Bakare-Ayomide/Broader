import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { Phone, Mail, Lock, User, AlertCircle, CheckCircle2, RotateCw, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../services/soundNotification';
import { BroaderLogo } from '../components/BroaderLogo';

export const SignUpScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const setSignedIn = useBroaderStore((s) => s.setSignedIn);
  const setUser = useBroaderStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: 'Chris Baker',
    email: 'chrisbak.music@gmail.com',
    phone: '8031234567',
    password: 'password123',
  });

  const [verificationState, setVerificationState] = useState<'idle' | 'pending' | 'success'>('idle');
  const [code, setCode] = useState('123456');
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (verificationState === 'pending' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationState, resendTimer]);

  const onSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setError(null);

    if (!form.name.trim()) {
      setError('Please provide your full legal name');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Please provide a valid email');
      return;
    }
    if (form.phone.length < 10) {
      setError('Please provide a valid Nigerian phone number');
      return;
    }

    setResendTimer(60);
    setVerificationState('pending');
  };

  const handleVerify = () => {
    soundEngine.playClick();
    if (code.length < 4) {
      setError('Please enter a valid OTP verification code');
      return;
    }

    setUser({
      id: 'usr_broader_ng_' + Date.now().toString().slice(-4),
      name: form.name,
      email: form.email,
      phone: `+234${form.phone}`,
      walletBalance: 24500,
    });

    soundEngine.playSuccess();
    setVerificationState('success');
  };

  const handleFinishSuccess = () => {
    soundEngine.playClick();
    setVerificationState('idle');
    setSignedIn(true);
    setScreen('home');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#020408] text-white relative select-none overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#9EE6B5]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#9EE6B5]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <div className="relative w-full h-[180px] bg-black overflow-hidden shrink-0">
        <img
          src="/assets/images/signup-car.png"
          alt="Sign Up"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-black/40 to-transparent" />
        <div className="absolute top-4 left-5 z-20">
          <BroaderLogo className="h-6 w-auto" />
        </div>
        <div className="absolute bottom-3 left-5 right-5">
          <div className="flex items-center gap-1.5 text-xs text-[#9EE6B5] font-JakartaBold mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CREATE YOUR ACCOUNT</span>
          </div>
          <h2 className="text-xl text-white font-JakartaBold tracking-tight">
            Join Broader Nigeria
          </h2>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 font-JakartaMedium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSignUpSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Chris Baker"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#9EE6B5] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
              Phone Number (+234)
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
                className="w-full pl-16 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaBold text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#9EE6B5] transition-all tracking-wide"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#9EE6B5] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-JakartaSemiBold text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create secure password"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-JakartaMedium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#9EE6B5] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] active:scale-[0.98] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_18px_rgba(158,230,181,0.4)] transition-all"
          >
            Create Broader Account
          </button>
        </form>

        <div className="text-center mt-4 pb-1">
          <p className="text-xs text-neutral-400 font-JakartaMedium">
            Already have an account?{' '}
            <button
              onClick={() => {
                soundEngine.playClick();
                setScreen('sign-in');
              }}
              className="text-[#9EE6B5] font-JakartaBold hover:underline ml-1"
            >
              Log In
            </button>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal with 60s Resend Timer */}
      {verificationState === 'pending' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center flex flex-col items-center border border-white/15 animate-in zoom-in-95">
            <h3 className="text-base font-JakartaBold text-white">OTP Phone Verification</h3>
            <p className="text-xs text-neutral-400 font-JakartaMedium mt-1.5 leading-relaxed">
              We sent a verification code to <span className="font-bold text-cyan-300">+234{form.phone}</span>
            </p>

            <div className="my-4 w-full">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-[0.35em] text-2xl font-JakartaBold py-2.5 bg-white/[0.06] rounded-2xl border border-white/15 text-white focus:outline-none focus:border-[#9EE6B5]"
              />
            </div>

            <div className="flex items-center justify-between w-full text-xs text-neutral-400 mb-4 px-1">
              <span>Expires in {resendTimer}s</span>
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => {
                  soundEngine.playClick();
                  setResendTimer(60);
                }}
                className={`font-JakartaBold ${
                  resendTimer === 0 ? 'text-[#9EE6B5] hover:underline' : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-3 rounded-xl bg-[#9EE6B5] text-black font-extrabold font-JakartaBold text-xs hover:bg-[#8fd8a6] transition-all shadow-[0_0_15px_rgba(158,230,181,0.4)]"
            >
              Verify & Complete Registration
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {verificationState === 'success' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center flex flex-col items-center border border-white/15 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-JakartaBold text-white">Registration Complete!</h3>
            <p className="text-xs text-neutral-400 font-JakartaMedium mt-1">
              Welcome to Broader Nigeria. Your account and digital wallet are active.
            </p>

            <button
              onClick={handleFinishSuccess}
              className="w-full mt-5 py-3 rounded-xl bg-[#9EE6B5] text-black font-extrabold font-JakartaBold text-xs hover:bg-[#8fd8a6] transition-all shadow-[0_0_15px_rgba(158,230,181,0.4)]"
            >
              Enter Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
