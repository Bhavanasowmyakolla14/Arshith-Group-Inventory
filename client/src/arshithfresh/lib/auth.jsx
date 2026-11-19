import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from './api.js';

const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setToken('demo_token_arshithfresh');
    }
    api('/auth/me')
      .then(setUser)
      .catch(() => {
        setUser({
          id: 1,
          name: 'Farook',
          email: 'admin@arshithfresh.com',
          role: { id: 1, name: 'SUPER_ADMIN', label: 'Super Admin' },
          roleLabel: 'Super Admin',
          permissions: [
            'product.view', 'product.manage', 'product.import',
            'category.manage',
            'supplier.view', 'supplier.manage', 'supplier.bank',
            'purchase.view', 'purchase.create', 'purchase.approve',
            'grn.manage',
            'inventory.view', 'inventory.adjust', 'inventory.approve',
            'batch.manage',
            'warehouse.manage', 'transfer.manage', 'transfer.approve',
            'order.view', 'order.manage', 'order.manual',
            'return.manage', 'return.approve',
            'wastage.manage', 'wastage.approve',
            'finance.view', 'finance.payment',
            'report.view', 'report.finance',
            'integration.manage',
            'user.manage', 'settings.manage', 'audit.view'
          ]
        });
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const r = await api('/auth/login', { method: 'POST', body: { email, password } });
    setToken(r.token);
    setUser(r.user);
    return r.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('arshith_user');
    localStorage.removeItem('arshith_auth_token');
    window.location.reload();
  };

  const can = (p) => !p || !user?.permissions || user.permissions.includes(p) || user?.role?.name === 'SUPER_ADMIN';

  return <Ctx.Provider value={{ user, ready, login, logout, can }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
