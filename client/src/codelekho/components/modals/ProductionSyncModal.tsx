import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  RefreshCw, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  LogOut, 
  Radio, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductionSyncModal: React.FC = () => {
  const { 
    isSyncModalOpen, 
    setIsSyncModalOpen, 
    productionHealth, 
    productionSyncStatus, 
    productionSyncError, 
    productionSource, 
    isStaffAuthenticated, 
    staffProfile, 
    syncLiveStudentsNow, 
    loginStaff, 
    logoutStaff, 
    registerLiveStudent,
    students,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'status' | 'login' | 'register' | 'token'>('status');
  const [email, setEmail] = useState('');
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New student form
  const [newStudent, setNewStudent] = useState({
    name: '',
    regNo: '',
    phone: '',
    email: '',
    password: ''
  });

  if (!isSyncModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Validation Error', 'Email and password are required', 'error');
      return;
    }
    setIsSubmitting(true);
    const success = await loginStaff({ email, regNo, password });
    setIsSubmitting(false);
    if (success) {
      setActiveTab('status');
    }
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    localStorage.setItem('arb_staff', manualToken.trim());
    localStorage.setItem('codelekho_staff_token', manualToken.trim());
    showToast('Token Saved', 'Staff bearer token saved to secure session.');
    syncLiveStudentsNow();
    setActiveTab('status');
  };

  const handleRegisterLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email || !newStudent.phone || !newStudent.regNo) {
      showToast('Validation Error', 'All fields are required', 'error');
      return;
    }
    setIsSubmitting(true);
    const success = await registerLiveStudent(newStudent);
    setIsSubmitting(false);
    if (success) {
      setNewStudent({ name: '', regNo: '', phone: '', email: '', password: '' });
      setActiveTab('status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30">
              <Database className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide">Live CodeLekho Production Synchronization</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SUPABASE CLOUD
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Direct authenticated telemetry & student records from https://codelekho.com/api
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsSyncModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'status' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Connection Status
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Staff Admin Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'register' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Test Live Registration
          </button>
          <button
            onClick={() => setActiveTab('token')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'token' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct Token
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Server Diagnostics Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  PRODUCTION TELEMETRY DIAGNOSTICS
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Service Name</span>
                    <span className="font-bold text-slate-900">{productionHealth?.service || 'CodeLekho Secure Backend API'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Production Database</span>
                    <span className="font-bold text-emerald-600 font-mono">Supabase PostgreSQL</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Backend Host & Gateway</span>
                    <span className="font-mono text-slate-800 text-[11px]">147.93.19.77 (nginx/1.28.3)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Admin API Target</span>
                    <span className="font-mono text-blue-600 text-[11px]">https://codelekho.com/api/admin/students</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Auto-Sync Engine</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Active (Polling every 15s)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Real Students in State</span>
                    <span className="font-mono font-black text-slate-900 text-sm">{students.length} Learners</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {isStaffAuthenticated ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-900">Staff Authentication Active</div>
                      <p className="text-emerald-700 text-[11px] mt-0.5">
                        Authenticated as CodeLekho staff administrator. Live students are synchronizing in real time.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logoutStaff}
                    className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900">Staff Authentication Required</div>
                      <p className="text-amber-700 text-[11px] mt-0.5">
                        CodeLekho production protects `/admin/students` behind staff credentials. Sign in below to pull all live registered learners.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('login')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => syncLiveStudentsNow()}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Now from codelekho.com</span>
                </button>
                <a
                  href="https://codelekho.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs">
                Log in with your existing CodeLekho staff administrator account. Credentials are authenticated securely against <code className="font-mono text-[11px] bg-blue-100 px-1 py-0.5 rounded">https://codelekho.com/api/learners/login</code>.
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] uppercase">Admin / Staff Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@codelekho.com or your registered staff email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] uppercase">Staff ID / Reg Number (Optional)</label>
                <input
                  type="text"
                  placeholder="CL-ADMIN-01 or registration ID"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] uppercase">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer text-center"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In & Connect Live Students'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: REGISTER LIVE STUDENT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterLive} className="space-y-4">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                Register a new learner directly into the live production database via <code className="font-mono text-[11px] bg-emerald-100 px-1 py-0.5 rounded">POST https://codelekho.com/api/learners/register</code>. It will instantly show up on the live website and Admin Dashboard.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px] uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px] uppercase">Student ID / Roll No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CL-2026-0042"
                    value={newStudent.regNo}
                    onChange={(e) => setNewStudent({ ...newStudent, regNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px] uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh.kumar@example.com"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px] uppercase">Phone (10 digits)</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] uppercase">Initial Password</label>
                <input
                  type="password"
                  placeholder="CodeLekho@2026 (Default)"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer text-center"
                >
                  {isSubmitting ? 'Registering on Live Database...' : 'Register on codelekho.com Production'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: DIRECT TOKEN */}
          {activeTab === 'token' && (
            <form onSubmit={handleManualTokenSubmit} className="space-y-4">
              <div className="p-3 bg-slate-100 rounded-xl text-slate-700 text-xs">
                If you already have your production staff JWT or <code className="font-mono text-[11px] bg-slate-200 px-1 py-0.5 rounded">arb_staff</code> session token, paste it here to authenticate immediately.
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-[11px] uppercase">Staff Bearer Token (JWT)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer text-center"
                >
                  Save Token & Sync Live Records
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

