import React from 'react';
import { X, Award, CheckCircle2, Clock, BookOpen, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentProfileModal: React.FC = () => {
  const { selectedStudentForProfile, setSelectedStudentForProfile, showToast } = useApp();

  if (!selectedStudentForProfile) return null;

  const st = selectedStudentForProfile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-6 pb-12">
          <button
            onClick={() => setSelectedStudentForProfile(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-blue-200">
            <span>CodeLekho Student Profile</span>
            <span>•</span>
            <span className="text-cyan-300 font-bold">{st.studentId}</span>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 -mt-8 relative z-10 flex items-end justify-between">
          <div className="flex items-end gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center border-4 border-white shadow-md uppercase">
              {st.name.trim().slice(0, 2)}
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-slate-800">{st.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{st.track} Specialization Fellow</p>
            </div>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-1 ${
            st.status === 'Active' || st.status === 'Graduated'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {st.status}
          </span>
        </div>

        {/* Content Tabs / Info */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-mono">{st.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{st.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Enrolled: {st.registrationDate}</span>
            </div>
          </div>

          {/* Academic Overview Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Course Progress</span>
              <div className="text-xl font-extrabold text-blue-600 mt-0.5">{st.courseProgress}%</div>
              <span className="text-[10px] text-slate-500">{st.modulesCompleted} / {st.totalModules} modules</span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Assessment Score</span>
              <div className="text-xl font-extrabold text-purple-600 mt-0.5">
                {st.examScore ? `${st.examScore}%` : 'Scheduled'}
              </div>
              <span className="text-[10px] text-slate-500">Passing criteria: 70%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Certification</span>
              <div className="text-xs font-extrabold text-emerald-700 mt-1 truncate">
                {st.certificateStatus === 'Issued' ? 'Verified Credential' : st.certificateStatus}
              </div>
              <span className="text-[10px] text-slate-500">QR Code Hash</span>
            </div>
          </div>

          {/* Enrolled Tracks */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enrolled Curriculum Tracks</h4>
            <div className="space-y-2">
              {st.enrolledCourses.map((c, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">{c}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Cohort 2026-Fall</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Credential Box if issued */}
          {st.certificateId && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Certificate of Professional Competence</h4>
                  <p className="text-[11px] text-emerald-700 font-mono">ID: {st.certificateId}</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Certificate Downloaded', `Generated verifiable PDF for ${st.name}`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedStudentForProfile(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

