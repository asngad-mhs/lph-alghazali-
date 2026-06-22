import React, { useState } from 'react';
import { Database, CheckCircle, Save, Plus, Trash2, Edit } from 'lucide-react';

interface AdminCMSPanelProps {
  dataLPH: any;
  setDataLPH: (data: any) => void;
}

export default function AdminCMSPanel({ dataLPH, setDataLPH }: AdminCMSPanelProps) {
  const [activeMenu, setActiveMenu] = useState<string>('profile');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const menus = [
    { id: 'profile', label: 'Profil Institusi' },
    { id: 'layanan', label: 'Manajemen Layanan' },
    { id: 'proses', label: 'Alur Proses' },
    { id: 'regulasi', label: 'Payung Hukum' },
    { id: 'berita', label: 'Pusat Berita' },
    { id: 'faq', label: 'Manajemen FAQ' },
    { id: 'kontak', label: 'Inbox Kontak' },
  ];

  const handleSave = () => {
    setSaveStatus('Menyimpan pembaruan ke Real-time Database...');
    setTimeout(() => {
      setSaveStatus('Data berhasil diperbarui!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1200);
  };

  const currentDataStr = JSON.stringify(dataLPH || {}, null, 2);

  return (
    <div className="space-y-6 animate-in fade-in-30 duration-200">
      <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Database className="w-24 h-24 text-emerald-600" />
        </div>
        <h3 className="font-extrabold text-emerald-800 dark:text-emerald-400 text-lg flex items-center gap-2 relative z-10">
          <Database className="w-5 h-5" />
          Sistem Manajemen Konten Master (CMS)
        </h3>
        <p className="text-xs text-slate-500 mt-1 relative z-10">
          Super-Admin Access. Modifikasi struktur data portal LPH Al-Ghazali.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Menu CMS */}
        <div className="w-full md:w-56 space-y-1">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMenu(m.id)}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-left transition-colors ${
                activeMenu === m.id
                  ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* CMS Editor Window */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase text-[11px] tracking-wide">
              Editor Modul: {menus.find(m => m.id === activeMenu)?.label}
            </h4>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400">
                <Plus className="w-3 h-3" /> Entri Baru
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden flex flex-col relative text-slate-500">
            <textarea
              className="w-full h-[300px] p-4 text-xs font-mono bg-transparent outline-none resize-none dark:text-slate-300 text-slate-700"
              value={JSON.stringify((dataLPH && dataLPH[activeMenu]) || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setDataLPH({ ...(dataLPH || {}), [activeMenu]: parsed });
                } catch(err) {
                  // Ignore parse errors on active typing
                }
              }}
              spellCheck={false}
            />
            <div className="absolute top-2 right-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded text-[9px] font-bold">
              RAW JSON EDITOR (CRUD MODE)
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px]">
              <span className="text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                Hak Akses: Admin Pusat / Admin / Editor / Auditor / Staff
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-3 h-3" /> Auto-sync enabled
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              {saveStatus && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in slide-in-from-bottom-2">
                  <CheckCircle className="w-3 h-3" /> {saveStatus}
                </span>
              )}
            </div>
            <button 
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan Publik
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
