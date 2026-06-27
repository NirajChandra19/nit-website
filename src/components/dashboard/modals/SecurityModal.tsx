"use client";

import { useState } from "react";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";

export default function SecurityModal({ 
  user, 
  profile, 
  is2FAEnabled, 
  setIs2FAEnabled, 
  onClose,
  initialTab = "password"
}: { 
  user: any;
  profile: any;
  is2FAEnabled: boolean;
  setIs2FAEnabled: (enabled: boolean) => void;
  onClose: () => void;
  initialTab?: "password" | "2fa";
}) {
  const [securityTab, setSecurityTab] = useState<"password" | "2fa">(initialTab);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState(["", "", "", "", "", ""]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const form = e.target as HTMLFormElement;
    const currentPassword = (form.elements[0] as HTMLInputElement).value;
    const newPassword = (form.elements[1] as HTMLInputElement).value;
    const confirmPassword = (form.elements[2] as HTMLInputElement).value;

    if (newPassword !== confirmPassword) return alert("New passwords do not match!");

    try {
      const res = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password successfully updated!");
        onClose();
        form.reset();
      } else alert(data.error || "Failed to update password");
    } catch (err) { alert("Error updating password"); }
  };

  const handleEnable2FASetup = async () => {
    if (!user?.id) return;
    if (is2FAEnabled) {
      try {
        const res = await fetch(`/api/settings/2fa?studentId=${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setIs2FAEnabled(false);
          setQrCodeUrl("");
          alert("2FA Disabled successfully!");
        } else alert(data.error || "Failed to disable 2FA");
      } catch (err) { console.error("Error disabling 2FA"); }
      return;
    }
    
    try {
      const res = await fetch('/api/settings/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, email: profile?.email || "user@example.com" })
      });
      const data = await res.json();
      if (data.success) {
        setQrCodeUrl(data.qrCodeUrl);
        setTwoFactorSecret(data.secret);
      }
    } catch (err) { console.error("Error setting up 2FA"); }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = twoFactorToken.join("");
      const res = await fetch('/api/student/setup-2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user?.id, token: code })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIs2FAEnabled(true);
        onClose();
        alert("2FA successfully enabled!");
      } else alert(data.error || "Invalid verification code.");
    } catch (err) { alert("Error verifying 2FA"); }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex px-6 pt-4 gap-6 border-b border-gray-100 dark:border-gray-800">
        {(["password", "2fa"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSecurityTab(tab)}
            className={`pb-3 text-sm font-bold capitalize transition-colors relative ${securityTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-[#0F172A] dark:hover:text-white'}`}
          >
            {tab === "2fa" ? "Two-Factor Auth" : tab}
            {securityTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {/* Password Tab */}
        {securityTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Current Password</label>
              <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">New Password</label>
              <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
              <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors">Update Password</button>
          </form>
        )}

        {/* 2FA Tab */}
        {securityTab === "2fa" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <div>
                <h4 className="font-bold text-[#0F172A] dark:text-white text-sm">Authenticator App</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use an app like Google Authenticator to get 2FA codes.</p>
              </div>
              <button onClick={handleEnable2FASetup} className={`w-12 h-6 rounded-full relative transition-colors ${is2FAEnabled || qrCodeUrl ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${is2FAEnabled || qrCodeUrl ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {qrCodeUrl && !is2FAEnabled && (
              <div className="text-center p-6 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <Image src={qrCodeUrl} alt="QR Code" width={128} height={128} className="mx-auto rounded-lg mb-4" />
                <p className="text-sm font-bold text-[#0F172A] dark:text-white">Scan this QR code</p>
                <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code from your app below.</p>
                <div className="flex justify-center gap-2 mt-4">
                  {twoFactorToken.map((digit, i) => (
                    <input 
                      key={i} 
                      type="text" 
                      maxLength={1} 
                      value={digit}
                      onChange={(e) => {
                        const newToken = [...twoFactorToken];
                        newToken[i] = e.target.value.replace(/[^0-9]/g, "");
                        setTwoFactorToken(newToken);
                        if (e.target.value && i < 5) {
                          const nextInput = document.getElementById(`2fa-input-${i + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !twoFactorToken[i] && i > 0) {
                          const prevInput = document.getElementById(`2fa-input-${i - 1}`);
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      id={`2fa-input-${i}`}
                      className="w-10 h-12 text-center text-lg font-bold bg-gray-50 dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white outline-none focus:border-blue-500" 
                    />
                  ))}
                </div>
                <button onClick={handle2FAVerification} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">Verify & Enable</button>
              </div>
            )}
            {is2FAEnabled && (
              <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-2xl">
                <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0F172A] dark:text-white">Two-Factor Authentication is Enabled</p>
                <p className="text-xs text-gray-500 mt-1">Your account is secured with 2FA.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
