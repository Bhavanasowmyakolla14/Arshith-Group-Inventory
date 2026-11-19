import React, { useState } from 'react';
import { Settings, Save, Shield, Database, BellRing } from 'lucide-react';

export const SettingsPage = () => {
  const [budgetThreshold, setBudgetThreshold] = useState(80);
  const [currency, setCurrency] = useState('INR (₹)');
  const [overdueAlertDays, setOverdueAlertDays] = useState(7);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-800" /> Enterprise Portfolio Settings & Rules
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure financial alert thresholds, project ID numbering schemas, and notification triggers.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-blue-100 text-blue-800 rounded-xl font-semibold">
          Configuration parameters updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 uppercase font-mono text-xs mb-3">
            Financial & Budget Governance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Budget Warning Alert Threshold (%)
              </label>
              <input
                type="number"
                value={budgetThreshold}
                onChange={(e) => setBudgetThreshold(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Triggers automatic warning notifications when project spend reaches this % of approved budget.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Portfolio Base Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 text-xs font-mono font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Fixed base currency for Arshith Infotech India.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h3 className="font-bold text-slate-900 uppercase font-mono text-xs mb-3">
            Deadline & Escalation Monitoring
          </h3>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Upcoming Deadline Notice (Days)</label>
            <input
              type="number"
              value={overdueAlertDays}
              onChange={(e) => setOverdueAlertDays(e.target.value)}
              className="w-48 p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

