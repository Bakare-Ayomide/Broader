import React, { useState, useEffect } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import { Phone, Mail, Lock, User, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';

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

    setVerificationState('success');
  };

  const handleFinishSuccess = () => {
    setVerificationState('idle');
    setSignedIn(true);
    setScreen('home');
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative select-none">
      {/* Header Banner */}
      <div className="relative w-full h-[190px] bg-slate-900 overflow-hidden shrink-0">
        <img
          src="/assets/images/signup-car.png"
          alt="Sign Up"
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <h2 className="text-2xl text-white font-JakartaSemiBold absolute bottom-4 left-5">
          Join Broader Nigeria
        </h2>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-JakartaMedium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSignUpSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <img
                src="/assets/icons/person.png"
                alt="person"
                className="w-4 h-4 absolute left-3.5 opacity-60"
              />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Chris Baker"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">
              Phone Number (+234)
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

          <div>
            <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">
              Password
            </label>
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
                placeholder="Create secure password"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FA] border border-slate-200 rounded-xl text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 active:scale-[0.99] text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            Create Broader Account
          </button>
        </form>

        <div className="text-center mt-4 pb-1">
          <p className="text-xs text-slate-500 font-JakartaMedium">
            Already have an account?{' '}
            <button
              onClick={() => setScreen('sign-in')}
              className="text-[#0286FF] font-JakartaBold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal with 60s Resend Timer */}
      {verificationState === 'pending' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95">
            <h3 className="text-lg font-JakartaBold text-slate-900">OTP Phone Verification</h3>
            <p className="text-xs text-slate-500 font-JakartaMedium mt-1.5 leading-relaxed">
              We sent an SMS OTP to <span className="font-bold text-slate-800">+234{form.phone}</span>
            </p>

            <div className="my-4 w-full">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-[0.4em] text-2xl font-JakartaBold py-2 bg-slate-100 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0286FF]"
              />
            </div>

            <div className="flex items-center justify-between w-full text-xs text-slate-500 mb-4 px-1">
              <span>Expires in {resendTimer}s</span>
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => setResendTimer(60)}
                className={`font-JakartaBold ${
                  resendTimer === 0 ? 'text-[#0286FF] hover:underline' : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-3 rounded-full bg-[#0286FF] text-white font-JakartaBold text-xs hover:bg-blue-600 transition-all shadow-md shadow-blue-500/25"
            >
              Verify & Complete Registration
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {verificationState === 'success' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-JakartaBold text-slate-900">Registration Complete!</h3>
            <p className="text-xs text-slate-500 font-JakartaMedium mt-1">
              Welcome to Broader Nigeria. Your account and wallet are ready.
            </p>

            <button
              onClick={handleFinishSuccess}
              className="w-full mt-5 py-3 rounded-full bg-[#0286FF] text-white font-JakartaBold text-xs hover:bg-blue-600 transition-all shadow-md shadow-blue-500/25"
            >
              Enter Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
