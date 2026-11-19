import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, User, Check, Key } from 'lucide-react';
import { ADMIN_USER } from '../context/AuthContext';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getUsers();
        if (res.success) setUsers(res.users);
      } catch (err) {
        setUsers([ADMIN_USER]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto text-xs">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-800" /> User Accounts & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise roles, authentication permissions, and corporate department mappings.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role Designation</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{u.employeeId || 'HR-Linked'}</div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-100 text-blue-900 border border-blue-200 font-mono">
                    {u.roleName}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700">{u.department || 'Management'}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
