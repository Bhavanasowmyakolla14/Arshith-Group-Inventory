import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, Download, RefreshCw, FileSpreadsheet, Filter } from 'lucide-react';

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('1');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reportList = [
    { id: '1', label: '1. Complete Project Inventory' },
    { id: '2', label: '2. Project-wise Budget Allocation' },
    { id: '3', label: '3. Actual Expenditure Breakdown' },
    { id: '4', label: '4. Accepted Projects Report' },
    { id: '5', label: '5. Rejected Projects Report' },
    { id: '6', label: '6. In-Progress Delivery Report' },
    { id: '7', label: '7. On-Hold Risk & Impact' },
    { id: '8', label: '8. Completed Projects Performance' },
    { id: '9', label: '9. Delivered & Warranty Report' },
    { id: '10', label: '10. Employee-wise Project Allocation' },
    { id: '11', label: '11. Employee Workload & Capacity' },
    { id: '12', label: '12. Project Manager Delivery' },
    { id: '13', label: '13. Client-wise Project Portfolio' },
    { id: '14', label: '14. Monthly Project Intake/Outflow' },
    { id: '15', label: '15. Delayed & Overdue Critical Report' },
    { id: '16', label: '16. Project Profitability & Cost Margin' },
  ];

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.getReportData(selectedReport, 'json');
      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedReport]);

  const handleDownloadCSV = () => {
    window.open(`/api/reports?reportType=${selectedReport}&format=csv`, '_blank');
  };

  const rows = reportData?.data || [];
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-800" /> Reports & Analytics Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade business intelligence and regulatory compliance reporting generated from live database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selection Dropdown & Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <label className="block text-slate-700 font-semibold text-xs">Select Analytical Report</label>
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
        >
          {reportList.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Report Table View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              {reportData?.title || 'Report Output'}
            </h2>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Live Database Audit • Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold text-[10px]">
            {rows.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 select-none">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className="py-2.5 px-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    Compiling live dataset...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-8 text-center text-slate-400">
                    No records found for this report criteria.
                  </td>
                </tr>
              ) : (
                rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    {headers.map((header, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3.5 whitespace-nowrap text-slate-700">
                        {header.includes('₹') || header.includes('Budget') || header.includes('Cost') || header.includes('Value') ? (
                          <span className="font-mono font-semibold text-slate-900">
                            {typeof row[header] === 'number'
                              ? `₹${row[header].toLocaleString('en-IN')}`
                              : row[header]}
                          </span>
                        ) : (
                          row[header]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

