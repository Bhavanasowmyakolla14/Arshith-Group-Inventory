import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Download, Search, Filter } from 'lucide-react';

export const DocumentsPage = ({ onSelectProject }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (docTypeFilter !== 'ALL') params.append('docType', docTypeFilter);
        const res = await api.getDocuments(params.toString());
        if (res.success) setDocs(res.documents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [docTypeFilter]);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-800" /> Enterprise Document Repository
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Proposals, client agreements, SRS documents, architectural specifications and invoices across all projects.
        </p>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
        <select
          value={docTypeFilter}
          onChange={(e) => setDocTypeFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
        >
          <option value="ALL">All Document Types</option>
          <option value="Project Proposal">Project Proposals</option>
          <option value="Client Agreement">Client Agreements</option>
          <option value="SRS Document">SRS Documents</option>
          <option value="Quotations">Quotations</option>
          <option value="Invoices">Invoices</option>
          <option value="Technical Documents">Technical Documents</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <div key={d.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                {d.version}
              </span>
            </div>

            <div>
              <div className="font-bold text-slate-900 line-clamp-1">{d.title}</div>
              <div className="text-[10px] text-blue-800 font-semibold mt-0.5">{d.docType}</div>
              {d.description && <div className="text-slate-500 text-[11px] mt-1 line-clamp-2">{d.description}</div>}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <button
                onClick={() => d.project && onSelectProject(d.project.id)}
                className="font-mono text-blue-800 hover:underline font-bold"
              >
                {d.project ? d.project.projectId : 'Project'}
              </button>
              <a
                href={d.fileUrl}
                download={d.fileName}
                className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

