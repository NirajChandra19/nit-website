"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Force a router refresh so the Server Component re-runs and sees the new cookie
        router.refresh();
      } else {
        alert(data.error || 'Invalid admin credentials');
        setLoading(false);
      }
    } catch (err) {
      alert('Login failed. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl font-bold text-center mb-8 italic">Admin <span className="text-blue-500">Login</span></h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-400 block mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-slate-700 border border-slate-600 p-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
              value={adminForm.username}
              onChange={e => setAdminForm({...adminForm, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-400 block mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-700 border border-slate-600 p-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
              value={adminForm.password}
              onChange={e => setAdminForm({...adminForm, password: e.target.value})}
              required
            />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20 disabled:opacity-50">
            {loading ? "Authenticating..." : "Access Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
