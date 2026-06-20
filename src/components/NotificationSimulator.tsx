import React, { useState, useEffect } from 'react';
import { Mail, Phone, Bell, CheckCheck, Trash2, Calendar, Send, ShieldAlert } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationSimulatorProps {
  notifications: SystemNotification[];
  onTriggerStatusSMS?: (msg: string) => void;
  onClearNotifications: () => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationSimulator({
  notifications,
  onClearNotifications,
  onMarkAllAsRead,
}: NotificationSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'email' | 'sms'>('all');
  const [selectedNotification, setSelectedNotification] = useState<SystemNotification | null>(null);

  const filtered = notifications.filter(n => {
    if (activeTab === 'email') return n.type === 'email';
    if (activeTab === 'sms') return n.type === 'sms';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/20 dark:via-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl relative">
            <Bell className="w-5 h-5 animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Pusat Notifikasi Otomatis</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Simulasi Notifikasi Email & SMS Gateway LPH</p>
          </div>
        </div>

        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                title="Tandai Semua Sudah Dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai Baca</span>
              </button>
              <button
                onClick={onClearNotifications}
                className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Bersihkan Semua Log"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Semua ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'email'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Email ({notifications.filter(n => n.type === 'email').length})
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'sms'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          SMS ({notifications.filter(n => n.type === 'sms').length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 h-[380px]">
        {/* Left Side: List */}
        <div className="overflow-y-auto p-3 space-y-2 h-[380px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Tidak ada notifikasi otomatis</p>
              <p className="text-xs text-slate-300 dark:text-slate-600 mt-1 max-w-[200px]">
                Notifikasi akan terpicu secara langsung saat status sertifikasi Anda diperbarui.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNotification(item)}
                className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                  selectedNotification?.id === item.id
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                    : item.isRead
                    ? 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 opacity-75'
                    : 'border-slate-200 dark:border-slate-800 bg-emerald-500/[0.02] dark:bg-teal-500/[0.02] hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      item.type === 'email'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400'
                    }`}
                  >
                    {item.type === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate ${item.isRead ? 'text-slate-700 dark:text-slate-350' : 'text-slate-900 dark:text-slate-100'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Preview Detail */}
        <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 h-[380px] overflow-y-auto">
          {selectedNotification ? (
            selectedNotification.type === 'email' ? (
              /* Email Client Template Mockup */
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-left">
                {/* Email Header */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="mb-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Dari: </span>
                    info@lph-alghazali.or.id (LPH Al-Ghazali) <span className="text-emerald-600 font-semibold">[Verified]</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Kepad: </span>
                    {selectedNotification.recipient}
                  </div>
                </div>

                <div className="p-4">
                  {/* Email Subject */}
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    {selectedNotification.title}
                  </h4>

                  {/* Email Logo Brand */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[10px] text-white">
                      AG
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Lembaga Pemeriksa Halal</div>
                      <div className="text-[9px] text-emerald-600 dark:text-emerald-400 leading-tight">Yayasan Al-Ghazali Cilacap</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="text-xs text-slate-600 dark:text-slate-350 space-y-3 leading-relaxed whitespace-pre-line">
                    {selectedNotification.message}
                  </div>

                  {/* Email Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                    Email ini dikirimkan secara otomatis oleh Sistem Sertifikasi Halal Digital LPH Al-Ghazali. Jangan membalas email ini secara langsung. Untuk kendala hubungi Helpdesk Halal BPJPH/LPH.
                  </div>
                </div>
              </div>
            ) : (
              /* Phone / SMS Canvas Mockup */
              <div className="max-w-[270px] mx-auto bg-slate-900 border-[6px] border-slate-800 dark:border-slate-700 rounded-3xl overflow-hidden shadow-md text-left text-white font-sans relative">
                {/* Notch */}
                <div className="w-1/2 h-4 bg-slate-800 mx-auto rounded-b-xl flex justify-center items-center gap-1.5 absolute top-0 left-1/4 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  <div className="w-6 h-1 rounded-full bg-slate-700"></div>
                </div>

                {/* Status Bar */}
                <div className="bg-slate-900 pt-5 px-3 pb-1 text-[9px] flex justify-between items-center text-slate-400">
                  <span>05:00 LPH-GATEWAY</span>
                  <div className="flex gap-1 items-center">
                    <span>4G LTE</span>
                    <div className="w-3.5 h-2 border border-slate-400 rounded-sm"></div>
                  </div>
                </div>

                {/* SMS Sender */}
                <div className="bg-slate-800 p-2 border-b border-slate-700 text-center text-xs">
                  <div className="font-semibold text-white">LPH_AL_GHAZALI</div>
                  <div className="text-[9px] text-slate-400">SMS Gateway Berbayar</div>
                </div>

                {/* Message Body screen */}
                <div className="p-3 bg-slate-950 h-56 overflow-y-auto space-y-3 text-[11px]">
                  <div className="text-center text-[9px] text-slate-500 bg-slate-900/50 py-0.5 rounded">Hari Ini</div>

                  {/* Message Bubble */}
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tl-none p-3 max-w-[85%] shadow relative">
                    <p className="leading-relaxed">{selectedNotification.message}</p>
                    <span className="text-[8px] text-emerald-200 block text-right mt-1.5">
                      {selectedNotification.timestamp}
                    </span>
                  </div>

                  <div className="flex gap-1.5 items-center justify-center p-1 bg-slate-900/30 border border-slate-800/40 rounded-lg text-[9px] text-slate-400">
                    <ShieldAlert className="w-3 h-3 text-emerald-500" />
                    <span>Enkripsi SMS Terverifikasi BSrE</span>
                  </div>
                </div>

                {/* SMS Input Mock */}
                <div className="p-2 bg-slate-800 border-t border-slate-700 flex gap-2 items-center">
                  <input
                    type="text"
                    disabled
                    placeholder="Pesan Masuk"
                    className="flex-1 bg-slate-900 text-[10px] rounded-full px-2.5 py-1 text-slate-400 outline-none"
                  />
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Send className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-5050 text-center">
              <p className="text-xs">Pilih salah satu notifikasi otomatis di daftar sebelah kiri untuk memproses pratinjau detail.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
