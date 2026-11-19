import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Users, Check, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SystemSettingsView: React.FC = () => {
  const { showToast } = useApp();

  const [platformName, setPlatformName] = useState('CodeLekho LMS');
  const [passingThreshold, setPassingThreshold] = useState('70');
  const [supportEmail, setSupportEmail] = useState('codelekho@arshithgroup.com');
  const [enableProctoring, setEnableProctoring] = useState(true);
  const [autoCertificates, setAutoCertificates] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Platform parameters updated successfully.');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            System Administration & Security Policies
          </h1>
          <p className="text-xs text-slate-500">
            Configure proctoring thresholds, certificate issuance triggers, email notifications, and RBAC permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Platform General Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Platform Title</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Academic Director Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 pt-2">
              Examination & Certification Policies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Proctored Pass Benchmark (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                />
                <span className="text-[10px] text-slate-400">Standard CodeLekho policy: 70% passing</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableProctoring}
                  onChange={(e) => setEnableProctoring(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Mandatory AI Proctoring & Webcam Verification</div>
                  <div className="text-[11px] text-slate-500">Flag multiple faces, screen lock changes, and external tabs.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCertificates}
                  onChange={(e) => setAutoCertificates(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Auto-Issue QR Blockchain Verified Certificates</div>
                  <div className="text-[11px] text-slate-500">Instantly generate cryptographic credentials on 70%+ score pass.</div>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Security & Roles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
            Administrator Roles & RBAC
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Arshith Sharma</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Super Admin</span>
              </div>
              <p className="text-[11px] text-slate-500">Full system override, billing, and database access</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Ravi Kumar</span>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Instructor</span>
              </div>
              <p className="text-[11px] text-slate-500">Curriculum management & student grading</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Dr. Vivek Menon</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Chief Proctor</span>
              </div>
              <p className="text-[11px] text-slate-500">Assessment auditing & anti-cheat approvals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

