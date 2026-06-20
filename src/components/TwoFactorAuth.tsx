import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, Key, Smartphone, AlertCircle } from 'lucide-react';

interface TwoFactorAuthProps {
  onEnable: (secret: string) => void;
  onDisable: () => void;
  isEnabled: boolean;
  userEmail: string;
}

export default function TwoFactorAuth({
  onEnable,
  onDisable,
  isEnabled,
  userEmail,
}: TwoFactorAuthProps) {
  const [setupStep, setSetupStep] = useState<'idle' | 'scanning' | 'verifying' | 'completed'>('idle');
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [totpCountdown, setTotpCountdown] = useState(30);

  // Generate simulated secrets on mount or start
  useEffect(() => {
    if (setupStep === 'scanning') {
      const generatedSecret = 'LPHGHAZALI' + Math.random().toString(36).substring(2, 8).toUpperCase() + '2FA';
      setSecretKey(generatedSecret);
      setQrCodeData(`otpauth://totp/LPH-AlGhazali:${userEmail}?secret=${generatedSecret}&issuer=LPH_AlGhazali`);
    }
  }, [setupStep, userEmail]);

  // Handle countdown for Simulated OTP
  useEffect(() => {
    const interval = setInterval(() => {
      setTotpCountdown((prev) => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifySetupCode = () => {
    setError('');
    // Require 6 digits for TOTP simulation
    if (authCode.length !== 6 || !/^\d+$/.test(authCode)) {
      setError('Kode verifikasi harus berupa 6 digit angka.');
      return;
    }
    // Simulate valid verification code (e.g. any numeric 6 digits that isn't zeroes)
    if (authCode === '000000') {
      setError('Kode kadaluarsa atau tidak valid. Silakan coba kembali.');
      return;
    }

    onEnable(secretKey);
    setSetupStep('completed');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-6 text-left transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 rounded-xl ${isEnabled ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Autentikasi Dua Faktor (2FA)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Proteksi ekstra untuk data audit permohonan sertifikasi Anda</p>
        </div>
      </div>

      {/* State A: Already Enabled */}
      {isEnabled && setupStep !== 'scanning' && (
        <div className="space-y-4">
          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">2FA Aktif</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                Akun Anda terlindungi optimal. Token TOTP dari aplikasi autentikator Anda terverifikasi sebelum masuk ke portal.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-100 dark:border-slate-850">
            <div className="flex gap-2 items-center">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>Metode: Aplikasi Google Authenticator / Microsoft Auth</span>
            </div>
            <button
              onClick={() => {
                onDisable();
                setSetupStep('idle');
              }}
              className="font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Nonaktifkan
            </button>
          </div>
        </div>
      )}

      {/* State B: Inactive / Idle */}
      {!isEnabled && setupStep === 'idle' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Mengharuskan entri kode pengaman virtual acak 6 digit dari aplikasi seluler Anda (Google Authenticator, Microsoft Authenticator, atau Authy) di setiap upaya pendaftaran dan login.
          </p>

          <button
            onClick={() => setSetupStep('scanning')}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Aktifkan Autentikasi 2FA</span>
          </button>
        </div>
      )}

      {/* State C: 2FA Setup Flow */}
      {setupStep === 'scanning' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
            {/* Simulated QR Code SVG Card */}
            <div className="relative p-3 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
              <svg className="w-32 h-32 text-slate-800" viewBox="0 0 100 100">
                {/* Visual patterns to replicate a dynamic QR code */}
                <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                <rect x="4" y="4" width="12" height="12" fill="white" />
                <rect x="8" y="8" width="4" height="4" fill="currentColor" />

                <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                <rect x="84" y="4" width="12" height="12" fill="white" />
                <rect x="88" y="8" width="4" height="4" fill="currentColor" />

                <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                <rect x="4" y="84" width="12" height="12" fill="white" />
                <rect x="8" y="88" width="4" height="4" fill="currentColor" />

                {/* Random blocks */}
                <rect x="30" y="5" width="10" height="5" fill="currentColor" />
                <rect x="50" y="10" width="5" height="15" fill="currentColor" />
                <rect x="65" y="0" width="10" height="10" fill="currentColor" />
                <rect x="25" y="30" width="15" height="15" fill="currentColor" />
                <rect x="45" y="35" width="20" height="5" fill="currentColor" />
                <rect x="75" y="40" width="5" height="20" fill="currentColor" />
                <rect x="10" y="50" width="15" height="5" fill="currentColor" />
                <rect x="30" y="60" width="10" height="10" fill="currentColor" />
                <rect x="0" y="70" width="10" height="5" fill="currentColor" />
                <rect x="50" y="60" width="20" height="25" fill="currentColor" stroke="white" strokeWidth="2" />
                <rect x="55" y="65" width="10" height="15" fill="white" />
                <rect x="85" y="85" width="10" height="10" fill="currentColor" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-900 rounded-md border border-slate-100 shadow">
                <div className="w-5 h-5 bg-emerald-600 rounded-sm flex items-center justify-center text-white font-extrabold text-[8px]">
                  LPH
                </div>
              </div>
            </div>

            {/* Instruction */}
            <div className="space-y-3 flex-1">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">Langkah 1 dari 2</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Pindai Kode QR</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gunakan aplikasi Google Authenticator untuk memindai kode QR. Atau ketik kunci rahasia di bawah secara manual:
              </p>

              {/* Secret Key Input Panel */}
              <div className="flex gap-2 items-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <code className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 select-all flex-1 tracking-wider">
                  {secretKey || 'Menghasilkan...'}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">Langkah 2 dari 2</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Simulasi TOTP baru dalam {totpCountdown}s</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 text-left">Masukkan Kode Hasil Pemindaian</h4>

            <div className="flex gap-3">
              <input
                type="text"
                maxLength={6}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-mono tracking-widest text-center text-lg font-bold outline-none ring-emerald-500 focus:ring-2 focus:border-transparent"
              />
              <button
                onClick={verifySetupCode}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Simpan & Aktifkan
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-100 dark:border-red-950/40 mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <p className="text-[10px] text-slate-400 italic">
              *Tips simulasi: Masukkan sembarang 6 angka penunjuk OTP di atas (kecuali 000000) untuk memvalidasi simulasi input 2FA.
            </p>
          </div>
        </div>
      )}

      {/* State D: Completing Registration success popup */}
      {setupStep === 'completed' && (
        <div className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">2FA Berhasil Dikonfigurasi!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aplikasi autentikator seluler Anda sekarang terhubung. Kode TOTP 6-digit aman wajib dimasukkan di sesi login mendatang.
            </p>
          </div>
          <button
            onClick={() => setSetupStep('idle')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup Dialog Setup
          </button>
        </div>
      )}
    </div>
  );
}
