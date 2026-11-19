import React, { useState } from 'react';
import { Layers, Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Building2, GraduationCap, ChevronDown, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [company, setCompany] = useState('arshith'); // 'arshith' | 'codelekho' | 'arshithfresh'
  const [email, setEmail] = useState('admin@arshithgroup.com');
  const [password, setPassword] = useState('ArshithInventory');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompanyChange = (newCompany) => {
    setCompany(newCompany);
    setError('');
    if (newCompany === 'arshith') {
      setEmail('admin@arshithgroup.com');
      setPassword('ArshithInventory');
    } else if (newCompany === 'codelekho') {
      setEmail('admin@codelekho.com');
      setPassword('CodeLekho2026');
    } else if (newCompany === 'arshithfresh') {
      setEmail('admin@arshithfresh.com');
      setPassword('admin123');
    }
  };

  const handleFillAdminCredentials = () => {
    if (company === 'arshith') {
      setEmail('admin@arshithgroup.com');
      setPassword('ArshithInventory');
    } else if (company === 'codelekho') {
      setEmail('admin@codelekho.com');
      setPassword('CodeLekho2026');
    } else if (company === 'arshithfresh') {
      setEmail('admin@arshithfresh.com');
      setPassword('admin123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, company);
      if (!res.success) {
        setError(res.message || 'Invalid administrator credentials for the selected company.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate administrator.');
    } finally {
      setLoading(false);
    }
  };

  const isArshith = company === 'arshith';
  const isCodeLekho = company === 'codelekho';
  const isFresh = company === 'arshithfresh';

  const companyName = isArshith 
    ? 'Arshith Infotech' 
    : isCodeLekho 
      ? 'CodeLekho ERP' 
      : 'Arshith Fresh IMS';

  return (
    <div className="min-h-screen w-screen bg-[#101827] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isArshith ? 'bg-blue-600/20' : isCodeLekho ? 'bg-indigo-600/25' : 'bg-emerald-600/20'
      }`}></div>
      <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isArshith ? 'bg-sky-500/20' : isCodeLekho ? 'bg-cyan-500/20' : 'bg-orange-500/20'
      }`}></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-700/30 overflow-hidden relative z-10">
        {/* Dynamic Brand Header */}
        <div className={`p-8 pb-6 text-white text-center relative transition-all duration-300 ${
          isArshith 
            ? 'bg-gradient-to-b from-[#101827] via-[#1E293B] to-[#1E3A8A]' 
            : isCodeLekho
              ? 'bg-gradient-to-b from-[#0a1020] via-[#0f172a] to-[#1e1b4b]'
              : 'bg-gradient-to-b from-[#131b17] via-[#1b2b22] to-[#14532d]'
        }`}>
          <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center shadow-lg mb-3 border transition-colors ${
            isArshith 
              ? 'bg-[#2563EB] shadow-blue-950/60 border-blue-400/30 text-white' 
              : isCodeLekho
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-indigo-950/60 border-indigo-400/30 text-white'
                : 'bg-gradient-to-tr from-emerald-600 to-orange-500 shadow-emerald-950/60 border-emerald-400/30 text-white'
          }`}>
            {isArshith ? (
              <Layers className="w-8 h-8" />
            ) : isCodeLekho ? (
              <GraduationCap className="w-8 h-8" />
            ) : (
              <Leaf className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h1 className="text-xl font-extrabold tracking-wide uppercase font-sans">
            {isArshith ? (
              <>Arshith <span className="text-sky-400 font-semibold">Infotech</span></>
            ) : isCodeLekho ? (
              <>Code<span className="text-cyan-400 font-semibold">Lekho</span> <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-400/30 ml-1">ERP</span></>
            ) : (
              <>Arshith <span className="text-orange-400 font-semibold">Fresh</span> <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-400/30 ml-1">IMS</span></>
            )}
          </h1>
          
          <p className="text-xs text-slate-300 tracking-wider font-mono mt-0.5">
            {isArshith 
              ? 'PROJECT INVENTORY & PORTFOLIO MANAGEMENT SYSTEM' 
              : isCodeLekho
                ? 'ACADEMY ADMIN OS & LMS COMMAND CENTER'
                : 'INVENTORY & SUPPLY CHAIN MANAGEMENT SYSTEM'
            }
          </p>

          <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium ${
            isArshith 
              ? 'bg-blue-900/60 border-blue-400/30 text-blue-200' 
              : isCodeLekho
                ? 'bg-indigo-900/60 border-indigo-400/30 text-indigo-200'
                : 'bg-emerald-900/60 border-emerald-400/30 text-emerald-200'
          }`}>
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {isArshith 
                ? 'Administrator Access Portal' 
                : isCodeLekho
                  ? 'Academic ERP & Staff Command Portal'
                  : 'Supply Chain & Inventory Portal'
              }
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 pt-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* COMPANY SELECTION DROPDOWN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Select Company / Organization <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-blue-600 font-semibold">Separate Portals</span>
              </div>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={company}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-[#F5F7FA] border-2 border-blue-300 hover:border-blue-500 focus:border-blue-600 rounded-xl text-xs text-[#111827] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 transition-all cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="arshith">🏢 Arshith Infotech — Project Inventory & Portfolio OS</option>
                  <option value="codelekho">🎓 CodeLekho — Academic ERP & LMS Command Center</option>
                  <option value="arshithfresh">🌱 Arshith Fresh — Inventory & Supply Chain Management</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                {isArshith 
                  ? 'Accessing Projects, Sprints, Team Allocations, and Financial Milestones.' 
                  : isCodeLekho
                    ? 'Accessing Students, Course Curriculum, Proctored Exams, and Academy Analytics.'
                    : 'Accessing Warehouse Stock, Cold-Pressed Oils, Batches & Expiry, and Purchase Orders.'}
              </p>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1.5">
                {isArshith ? 'Admin Email Address' : isCodeLekho ? 'Staff / Admin Email Address' : 'Fresh IMS Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isArshith ? 'admin@arshithgroup.com' : isCodeLekho ? 'admin@codelekho.com' : 'admin@arshithfresh.com'}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-xs text-[#111827] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleFillAdminCredentials}
                  className="text-[11px] text-[#2563EB] hover:text-[#1D4ED8] font-semibold underline cursor-pointer"
                >
                  Fill Default {isArshith ? 'Arshith' : isCodeLekho ? 'CodeLekho' : 'Arshith Fresh'} Admin
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-xs text-[#111827] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isArshith 
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-blue-900/20' 
                  : isCodeLekho
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
              }`}
            >
              <span>{loading ? 'Authenticating...' : `Sign In to ${companyName}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Admin Credentials Hint */}
          <div className="pt-4 border-t border-[#E2E8F0] bg-[#F5F7FA] -mx-8 -mb-8 p-5 text-center text-xs text-[#64748B] rounded-b-2xl space-y-1">
            <div className="font-semibold text-[#111827] mb-1 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Dedicated {companyName} Account</span>
            </div>
            <div className="font-mono text-[11px] text-[#64748B]">
              User: <span className="text-[#111827] font-semibold">{isArshith ? 'admin@arshithgroup.com' : isCodeLekho ? 'admin@codelekho.com' : 'admin@arshithfresh.com'}</span> | Pass: <span className="text-[#111827] font-semibold">{isArshith ? 'ArshithInventory' : isCodeLekho ? 'CodeLekho2026' : 'admin123'}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              (Master admin <span className="font-mono text-slate-600">admin@arshithgroup.com</span> has access to all three companies)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
