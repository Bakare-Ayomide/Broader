import React, { useState } from 'react';
import { useBroaderStore } from '../store/useBroaderStore';
import {
  ArrowLeft,
  Car,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const BecomeDriverScreen: React.FC = () => {
  const setScreen = useBroaderStore((s) => s.setScreen);
  const driverApplication = useBroaderStore((s) => s.driverApplication);
  const submitDriverApplication = useBroaderStore((s) => s.submitDriverApplication);
  const setDriverApplicationStatus = useBroaderStore((s) => s.setDriverApplicationStatus);
  const setIsDriverMode = useBroaderStore((s) => s.setIsDriverMode);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: 'Chris Baker Adewale',
    phone: '+234 803 123 4567',
    city: 'Lagos',
    state: 'Lagos State',
    residentialAddress: '15 Admiralty Way, Lekki Phase 1, Lagos',
    vehicleType: 'car',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla',
    vehicleYear: '2019',
    plateNumber: 'LND-892-BC',
    vehicleColor: 'Silver Metallic',
    driversLicenseNumber: 'DL-LAG-2024-99812',
  });

  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: boolean }>({
    license: true,
    registration: true,
    insurance: true,
    inspection: true,
    driverPhoto: true,
    vehiclePhoto: true,
  });

  const handleDocToggle = (key: string) => {
    setUploadedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveDraft = () => {
    submitDriverApplication({
      id: driverApplication?.id || 'app_drv_' + Date.now().toString().slice(-4),
      fullName: formData.fullName,
      phone: formData.phone,
      vehicleType: formData.vehicleType,
      vehicleModel: `${formData.vehicleMake} ${formData.vehicleModel}`,
      plateNumber: formData.plateNumber,
      status: 'draft',
      submissionDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      documentsUploaded: ['In progress draft'],
    });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDriverApplication({
      id: driverApplication?.id || 'app_drv_' + Date.now().toString().slice(-4),
      applicantName: formData.fullName,
      fullName: formData.fullName,
      phone: formData.phone,
      vehicleType: formData.vehicleType,
      vehicleModel: `${formData.vehicleMake} ${formData.vehicleModel} (${formData.plateNumber})`,
      plateNumber: formData.plateNumber,
      status: 'pending',
      submissionDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      documentsUploaded: [
        'Driver License',
        'Vehicle Registration',
        'Roadworthiness & Insurance',
        'Driver Photo',
        'Vehicle Photos',
      ],
    });
  };

  // If already applied and has status other than not_submitted
  if (driverApplication && driverApplication.status && driverApplication.status !== 'not_submitted') {
    return (
      <div className="flex flex-col h-full bg-[#000000] text-white select-none">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 glass-nav border-b border-white/[0.08] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen('profile')}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-JakartaBold text-white leading-none">Driver Application</h2>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">Broader Partner Fleet</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center text-center">
          {/* 1. Pending Review State */}
          {(driverApplication.status === 'pending' || driverApplication.status === 'pending_review') && (
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/15 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/25">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-JakartaBold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                Pending Review
              </span>
              <h3 className="text-lg font-JakartaBold text-white mt-2">Application Under Review</h3>
              <p className="text-xs text-neutral-300 font-JakartaMedium mt-1 leading-relaxed">
                Thank you for applying, <span className="font-bold text-white">{driverApplication.applicantName || driverApplication.fullName}</span>.
                Our Lagos safety desk is actively verifying your vehicle documents and license papers.
              </p>

              <div className="bg-white/[0.04] rounded-2xl p-3 my-4 text-left text-xs space-y-1.5 border border-white/[0.06]">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Application ID</span>
                  <span className="font-mono font-bold text-neutral-200">{driverApplication.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Vehicle</span>
                  <span className="font-JakartaSemiBold text-neutral-200">{driverApplication.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Submitted</span>
                  <span className="font-JakartaSemiBold text-neutral-200">{driverApplication.submissionDate}</span>
                </div>
              </div>

              {/* Status Simulation Buttons for Review */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setDriverApplicationStatus('approved');
                    setIsDriverMode(true);
                    setScreen('driver-home');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-JakartaBold text-xs shadow-[0_0_14px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Admin Approval</span>
                </button>
                <button
                  onClick={() => setDriverApplicationStatus('requires_correction')}
                  className="w-full py-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-JakartaBold text-xs transition-all"
                >
                  Simulate Correction Required
                </button>
              </div>
            </div>
          )}

          {/* 2. Requires Correction State */}
          {driverApplication.status === 'requires_correction' && (
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-amber-500/30 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/25">
                <AlertCircle className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-JakartaBold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full uppercase border border-amber-500/30">
                Correction Required
              </span>
              <h3 className="text-lg font-JakartaBold text-white mt-2">Action Required</h3>
              <div className="my-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-left text-xs text-amber-200 leading-relaxed font-JakartaMedium">
                <p className="font-JakartaBold mb-1 text-amber-300">Feedback from Lagos Verification Desk:</p>
                <p>The uploaded Driver's License photo was blurry and LASDRI certificate was obscured. Please provide clear, legible scans to complete approval.</p>
              </div>

              <button
                onClick={() => {
                  setStep(3);
                  setDriverApplicationStatus('draft');
                }}
                className="w-full py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)] transition-all"
              >
                Re-upload Documents & Resubmit
              </button>
            </div>
          )}

          {/* 3. Rejected State */}
          {driverApplication.status === 'rejected' && (
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-rose-500/30 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/25">
                <AlertCircle className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-JakartaBold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full uppercase border border-rose-500/30">
                Application Rejected
              </span>
              <h3 className="text-lg font-JakartaBold text-white mt-2">Unable to Verify</h3>
              <p className="text-xs text-neutral-400 font-JakartaMedium mt-2 leading-relaxed">
                Unfortunately, your vehicle or documents did not meet the regulatory criteria mandated for commercial ride-hailing in Lagos.
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setDriverApplicationStatus('draft');
                    setStep(1);
                  }}
                  className="w-full py-2.5 rounded-2xl glass-panel hover:bg-white/10 text-white font-JakartaBold text-xs border border-white/15"
                >
                  Start New Application
                </button>
                <a
                  href="mailto:support@broader.ng"
                  className="block w-full py-2 text-center text-xs font-JakartaBold text-neutral-400 hover:text-white hover:underline"
                >
                  Contact Driver Support
                </a>
              </div>
            </div>
          )}

          {/* 4. Draft State */}
          {driverApplication.status === 'draft' && (
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/15 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-[#9EE6B5]/15 text-[#9EE6B5] flex items-center justify-center mx-auto mb-3 border border-[#9EE6B5]/25">
                <FileText className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 border border-[#9EE6B5]/25 px-2.5 py-0.5 rounded-full uppercase">
                Saved Draft
              </span>
              <h3 className="text-lg font-JakartaBold text-white mt-2">Continue Your Application</h3>
              <p className="text-xs text-neutral-400 font-JakartaMedium mt-1 leading-relaxed">
                You have a saved draft. Your entered information and document progress are ready for completion.
              </p>

              <button
                onClick={() => setStep(step)}
                className="w-full mt-4 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)] transition-all"
              >
                Resume Application (Step {step} of 3)
              </button>
            </div>
          )}

          {/* 5. Approved State */}
          {driverApplication.status === 'approved' && (
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-emerald-500/30 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-JakartaBold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full uppercase">
                Approved Partner
              </span>
              <h3 className="text-lg font-JakartaBold text-white mt-2">You are an Approved Driver!</h3>
              <p className="text-xs text-neutral-300 font-JakartaMedium mt-1 leading-relaxed">
                Your documents and vehicle ({driverApplication.vehicleModel}) are certified for commercial trips across Lagos.
              </p>

              <button
                onClick={() => {
                  setIsDriverMode(true);
                  setScreen('driver-home');
                }}
                className="w-full mt-5 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)] transition-all"
              >
                Launch Driver Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#000000] text-white select-none">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 glass-nav border-b border-white/[0.08] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('profile')}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-JakartaBold text-white leading-none">Drive with Broader</h2>
            <p className="text-[11px] text-neutral-400 font-JakartaMedium mt-0.5">Earn on your own schedule in Nigeria</p>
          </div>
        </div>

        {/* Step Counter Indicator */}
        <span className="text-xs font-JakartaBold text-[#9EE6B5] bg-[#9EE6B5]/10 px-2.5 py-1 rounded-full border border-[#9EE6B5]/25">
          Step {step} of 3
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-JakartaBold text-white">Personal & Residence Information</h3>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                Please provide your official contact details matching your valid ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaMedium text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 placeholder-neutral-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">Nigerian Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaBold text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 placeholder-neutral-500"
                />
              </div>
                <div>
                <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaMedium text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 placeholder-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">Residential Address</label>
              <input
                type="text"
                required
                value={formData.residentialAddress}
                onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaMedium text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 placeholder-neutral-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 py-3 rounded-2xl border border-white/15 text-neutral-300 font-JakartaBold text-xs hover:bg-white/5"
              >
                Save Draft
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-2 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)] flex items-center justify-center gap-1 transition-all"
              >
                <span>Continue to Vehicle</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Specs */}
        {step === 2 && (
          <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-JakartaBold text-white">Vehicle Specifications</h3>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                Choose your Broader category and specify vehicle registration.
              </p>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1.5">Vehicle Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['car', 'suv', 'van', 'tricycle', 'motorcycle', 'bus'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({ ...formData, vehicleType: cat })}
                    className={`py-2 px-1 rounded-xl text-center capitalize text-xs font-JakartaBold border transition-all ${
                      formData.vehicleType === cat
                        ? 'bg-[#9EE6B5] border-[#9EE6B5] text-black font-extrabold shadow-[0_0_10px_rgba(158,230,181,0.4)]'
                        : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">Make</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                  placeholder="e.g. Toyota"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaMedium text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">Model & Year</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  placeholder="e.g. Corolla 2019"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaMedium text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 placeholder-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-neutral-300 mb-1">License Plate Number</label>
              <input
                type="text"
                required
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                placeholder="e.g. LND-892-BC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-JakartaBold text-white focus:outline-none focus:border-[#9EE6B5] bg-black/60 uppercase tracking-wider placeholder-neutral-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-2xl border border-white/15 text-neutral-300 font-JakartaBold text-xs hover:bg-white/5"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 py-3 rounded-2xl border border-[#9EE6B5]/25 bg-[#9EE6B5]/10 text-[#9EE6B5] font-JakartaBold text-xs hover:bg-[#9EE6B5]/20"
              >
                Save Draft
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)] flex items-center justify-center gap-1 transition-all"
              >
                <span>Documents</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Document Uploads & Submission */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="glass-panel rounded-3xl p-5 border border-white/10 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-JakartaBold text-white">Required Official Documents & Photos</h3>
              <p className="text-[11px] text-neutral-400 font-JakartaMedium">
                Broader requires official regulatory licenses and vehicle photos for verification.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'license', title: 'National Driver’s License / FRSC', sub: 'Must be unexpired' },
                { id: 'registration', title: 'Vehicle License & Proof of Ownership', sub: 'State motor registry' },
                { id: 'insurance', title: 'Third-Party or Comprehensive Insurance', sub: 'Active policy' },
                { id: 'inspection', title: 'Roadworthiness Certificate / LASDRI', sub: 'Lagos State certified' },
                { id: 'driverPhoto', title: 'Driver Passport Photograph', sub: 'Clear portrait, plain background' },
                { id: 'vehiclePhoto', title: 'Vehicle Exterior Photos', sub: 'Front, rear & plate visible' },
              ].map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocToggle(doc.id)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-white/10 hover:border-blue-400/40 bg-white/[0.03] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        uploadedDocs[doc.id]
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-neutral-500'
                      }`}
                    >
                      {uploadedDocs[doc.id] ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-JakartaBold text-white">{doc.title}</p>
                      <p className="text-[10px] text-neutral-400 font-JakartaMedium">{doc.sub}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-JakartaBold px-2.5 py-0.5 rounded-full ${
                      uploadedDocs[doc.id]
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {uploadedDocs[doc.id] ? 'Attached' : 'Tap to Upload'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-2xl border border-white/15 text-neutral-300 font-JakartaBold text-xs hover:bg-white/5"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-2 py-3 rounded-2xl bg-[#9EE6B5] hover:bg-[#8fd8a6] text-black font-extrabold font-JakartaBold text-xs shadow-[0_0_14px_rgba(158,230,181,0.4)] transition-all"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
