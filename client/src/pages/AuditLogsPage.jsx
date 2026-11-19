import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { History, Shield, Filter, Search } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (entityFilter !== 'ALL') params.append('entityType', entityFilter);
      const res = await api.getAuditLogs(params.toString());
      if (res.success) setLogs(res.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter]);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-blue-800" /> Enterprise Governance Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tamper-evident record of all system events, approvals, financial disbursements, and status modifications.
        </p>
      </div>

      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
        >
          <option value="ALL">All Entity Audits</option>
          <option value="PROJECT">Projects</option>
          <option value="EXPENSE">Expenses & Financials</option>
          <option value="STATUS">Status Workflow Transitions</option>
          <option value="ASSIGNMENT">Employee Assignments</option>
          <option value="USER">User Authentication</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Performed By</th>
                <th className="py-2.5 px-4">Audit Payload Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{log.entityType}</td>
                  <td className="py-2.5 px-4 font-bold text-blue-800">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-700 font-sans">
                    {log.performedBy ? `${log.performedBy.name} (${log.performedBy.role})` : 'System Daemon'}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-md truncate">
                    {JSON.stringify(log.changes || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

