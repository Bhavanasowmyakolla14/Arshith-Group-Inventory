import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, CheckCircle2, AlertTriangle, Info, CheckCheck } from 'lucide-react';

export const NotificationsPage = ({ onSelectProject }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res.success) setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      fetchNotifs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto text-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-800" /> Notifications & Operational Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time notifications for status transitions, budget utilization thresholds and overdue tasks.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              handleMarkRead(n.id);
              if (n.relatedProjectId) onSelectProject(n.relatedProjectId);
            }}
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 cursor-pointer transition-all ${
              n.isRead ? 'bg-white border-slate-200 opacity-80' : 'bg-blue-50/40 border-blue-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`p-2 rounded-lg flex-shrink-0 ${
                  n.type === 'ALERT'
                    ? 'bg-red-100 text-red-700'
                    : n.type === 'WARNING'
                    ? 'bg-amber-100 text-amber-700'
                    : n.type === 'SUCCESS'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {n.type === 'ALERT' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : n.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-xs">{n.title}</h3>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                </div>
                <p className="text-slate-600 mt-1">{n.message}</p>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

