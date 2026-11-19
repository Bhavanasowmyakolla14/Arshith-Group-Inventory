export const inr = (v, compact = false) => {
  if (v === null || v === undefined) return '—';
  const n = Number(v || 0);
  if (compact && Math.abs(n) >= 1e5) return Math.abs(n) >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(2)} L`;
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};
export const qty = (v, unit) => (v === null || v === undefined ? '—' : `${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 3 })}${unit ? ` ${unit}` : ''}`);
export const fdate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const fdatetime = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const today = () => new Date().toISOString().slice(0, 10);
export const words = (s) => (s ? String(s).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : '—');
