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
import { VEHICLE_CATEGORIES } from '../data/mockData';

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
  });

  const handleDocToggle = (key: string) => {
    setUploadedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDriverApplication({
      id: 'app_drv_' + Date.now().toString().slice(-4),
      applicantName: formData.fullName,
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
      documentsUploaded: ['Driver License', 'Vehicle Registration', 'Roadworthiness & Insurance'],
    });
  };

  // If already applied and has status
  if (driverApplication) {
    return (
      <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen('profile')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Driver Application</h2>
              <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">Broader Partner Fleet</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center text-center">
          {driverApplication.status === 'pending' ? (
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-JakartaBold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                Under Verification
              </span>
              <h3 className="text-lg font-JakartaBold text-slate-900 mt-2">Application Submitted</h3>
              <p className="text-xs text-slate-500 font-JakartaMedium mt-1 leading-relaxed">
                Thank you for applying, <span className="font-bold text-slate-800">{driverApplication.applicantName}</span>.
                Our Lagos safety team is verifying your LASDRI license and vehicle papers.
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 my-4 text-left text-xs space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Application ID</span>
                  <span className="font-mono font-bold text-slate-700">{driverApplication.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle</span>
                  <span className="font-JakartaSemiBold text-slate-700">{driverApplication.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted</span>
                  <span className="font-JakartaSemiBold text-slate-700">{driverApplication.submissionDate}</span>
                </div>
              </div>

              {/* Instant demo approval button for evaluation */}
              <button
                onClick={() => {
                  setDriverApplicationStatus('approved');
                  setIsDriverMode(true);
                  setScreen('driver-home');
                }}
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-JakartaBold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Instant Approval & Open Driver App</span>
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-JakartaBold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                Approved Partner
              </span>
              <h3 className="text-lg font-JakartaBold text-slate-900 mt-2">You are an Approved Driver!</h3>
              <p className="text-xs text-slate-500 font-JakartaMedium mt-1 leading-relaxed">
                Your documents and vehicle ({driverApplication.vehicleModel}) are certified for commercial trips across Lagos.
              </p>

              <button
                onClick={() => {
                  setIsDriverMode(true);
                  setScreen('driver-home');
                }}
                className="w-full mt-5 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all"
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
    <div className="flex flex-col h-full bg-[#F6F8FA] select-none">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('profile')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-JakartaBold text-slate-900 leading-none">Drive with Broader</h2>
            <p className="text-[11px] text-slate-400 font-JakartaMedium mt-0.5">Earn on your own schedule in Nigeria</p>
          </div>
        </div>

        {/* Step Counter Indicator */}
        <span className="text-xs font-JakartaBold text-[#0286FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Step {step} of 3
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-JakartaBold text-slate-900">Personal & Residence Information</h3>
              <p className="text-[11px] text-slate-400 font-JakartaMedium">
                Please provide your official contact details matching your valid ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">Nigerian Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaBold text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">Residential Address</label>
              <input
                type="text"
                required
                value={formData.residentialAddress}
                onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA]"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-2 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1"
            >
              <span>Continue to Vehicle Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Vehicle Specs */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-JakartaBold text-slate-900">Vehicle Specifications</h3>
              <p className="text-[11px] text-slate-400 font-JakartaMedium">
                Choose your Broader category and specify vehicle registration.
              </p>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1.5">Vehicle Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['car', 'suv', 'van', 'tricycle', 'motorcycle', 'bus'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({ ...formData, vehicleType: cat })}
                    className={`py-2 px-1 rounded-xl text-center capitalize text-xs font-JakartaBold border transition-all ${
                      formData.vehicleType === cat
                        ? 'bg-blue-50 border-[#0286FF] text-[#0286FF]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">Make</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                  placeholder="e.g. Toyota"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">Model & Year</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  placeholder="e.g. Corolla 2019"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaMedium text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-JakartaSemiBold text-slate-700 mb-1">License Plate Number</label>
              <input
                type="text"
                required
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                placeholder="e.g. LND-892-BC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-JakartaBold text-slate-900 focus:outline-none focus:border-[#0286FF] bg-[#F6F8FA] uppercase tracking-wider"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-JakartaBold text-xs hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1"
              >
                <span>Continue to Documents</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Document Uploads & Submission */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-JakartaBold text-slate-900">Required Official Documents</h3>
              <p className="text-[11px] text-slate-400 font-JakartaMedium">
                Broader requires valid regulatory documents for passenger transport certification.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'license', title: 'National Driver’s License / FRSC', sub: 'Must be unexpired' },
                { id: 'registration', title: 'Vehicle License & Proof of Ownership', sub: 'State motor registry' },
                { id: 'insurance', title: 'Third-Party or Comprehensive Insurance', sub: 'Active policy' },
                { id: 'inspection', title: 'Roadworthiness Certificate / LASDRI', sub: 'Lagos State certified' },
              ].map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocToggle(doc.id)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        uploadedDocs[doc.id]
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {uploadedDocs[doc.id] ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-JakartaBold text-slate-800">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-JakartaMedium">{doc.sub}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-JakartaBold px-2 py-0.5 rounded-full ${
                      uploadedDocs[doc.id]
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
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
                className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-JakartaBold text-xs hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-2 py-3 rounded-full bg-[#0286FF] hover:bg-blue-600 text-white font-JakartaBold text-xs shadow-md shadow-blue-500/25 transition-all"
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
