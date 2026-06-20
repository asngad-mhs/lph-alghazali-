import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, CheckCircle, Clock, ShieldCheck, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { HalalApplication, ProductType } from '../types';

interface AnalyticsChartsProps {
  applications: HalalApplication[];
  onTriggerExportCSV: () => void;
  onTriggerExportPrint: () => void;
}

export default function AnalyticsCharts({
  applications,
  onTriggerExportCSV,
  onTriggerExportPrint,
}: AnalyticsChartsProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Derive metrics
  const totalApps = applications.length;
  const certifiedApps = applications.filter(a => a.status === 'Sertifikat Terbit').length;
  const ongoingApps = applications.filter(a => a.status !== 'Sertifikat Terbit' && a.status !== 'Draft').length;
  
  // Total sum of all products registered
  const totalProducts = applications.reduce((sum, app) => sum + app.products.length, 0);

  // Status breakdown count
  const statusCounts = {
    'Draft': applications.filter(a => a.status === 'Draft').length,
    'Dokumen Lengkap': applications.filter(a => a.status === 'Dokumen Lengkap').length,
    'Verifikasi Lapangan': applications.filter(a => a.status === 'Verifikasi Lapangan').length,
    'Sidang Fatwa': applications.filter(a => a.status === 'Sidang Fatwa').length,
    'Sertifikat Terbit': applications.filter(a => a.status === 'Sertifikat Terbit').length,
  };

  // Convert status to percentage values for SVG Pie Charts or customized Progress Gauges
  const maxStatusVal = Math.max(...Object.values(statusCounts), 1);

  // Category breakdown
  const categoryCounts: Record<ProductType, number> = {
    'Makanan': applications.filter(a => a.productType === 'Makanan').length,
    'Minuman': applications.filter(a => a.productType === 'Minuman').length,
    'Kosmetik': applications.filter(a => a.productType === 'Kosmetik').length,
    'Obat': applications.filter(a => a.productType === 'Obat').length,
    'Barang Gunaan': applications.filter(a => a.productType === 'Barang Gunaan').length,
    'Jasa': applications.filter(a => a.productType === 'Jasa').length,
  };

  const categories = Object.keys(categoryCounts) as ProductType[];
  const maxCategoryVal = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="space-y-6">
      {/* Upper Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs text-left transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">Total Permohonan</span>
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{totalApps}</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">Berkas</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Semua status pengajuan legal</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs text-left transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">Sedang Diproses</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-955/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{ongoingApps}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">Audit</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Menunggu tahapan verifikasi</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs text-left transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">Sertifikat Terbit</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{certifiedApps}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Lulus</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Telah lulus sidang fatwa MUI</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs text-left transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">Total Produk Halal</span>
            <div className="p-1.5 bg-emerald-100/40 dark:bg-emerald-950/50 text-emerald-750 text-emerald-650 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{totalProducts}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-600/10 px-1.5 py-0.5 rounded">Varian</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Menu rincian halal terdaftar</p>
        </div>
      </div>

      {/* Main Charts & Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Card: 2D Visualizer SVGs */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Visualisasi Metrik Audit</h3>
              <p className="text-xs text-slate-400">Distribusi real-time berdasarkan data permohonan aktif</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                Live Data
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Category Distribution (Styled Bar Chart SVGs) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Penyebaran Jenis Produk</h4>
              </div>

              <div className="space-y-3 pt-2">
                {categories.map((cat, idx) => {
                  const count = categoryCounts[cat];
                  const percent = totalApps > 0 ? (count / totalApps) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{cat}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{count} ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Status Progress Pipeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Status Efektivitas Permohonan</h4>
              </div>

              {/* Status Stepper Visual representation */}
              <div className="space-y-3.5 pt-2">
                {Object.keys(statusCounts).map((status, idx) => {
                  const name = status as keyof typeof statusCounts;
                  const value = statusCounts[name];
                  const percent = totalApps > 0 ? (value / totalApps) * 100 : 0;

                  // Dynamic Badge color
                  let styleColor = 'bg-slate-400/10 text-slate-600 border-slate-300';
                  if (name === 'Sertifikat Terbit') styleColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                  if (name === 'Sidang Fatwa') styleColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
                  if (name === 'Verifikasi Lapangan') styleColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
                  if (name === 'Dokumen Lengkap') styleColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';

                  return (
                    <div key={idx} className="flex items-center gap-3 w-full">
                      {/* Count Circle */}
                      <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                        {value}
                      </div>
                      
                      <div className="flex-1 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{name}</span>
                          <span className="text-[10px] font-bold text-slate-450">{percent.toFixed(0)}%</span>
                        </div>
                        {/* Progress */}
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              name === 'Sertifikat Terbit' ? 'bg-emerald-500' :
                              name === 'Sidang Fatwa' ? 'bg-purple-500' :
                              name === 'Verifikasi Lapangan' ? 'bg-sky-500' :
                              name === 'Dokumen Lengkap' ? 'bg-indigo-5050 bg-indigo-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Card: Export Hub */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Pusat Ekspor Data LPH</h3>
              <p className="text-xs text-slate-400">Unduh dokumen registrasi legal ke format lain</p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">
              Dapatkan rincian seluruh riwayat permohonan sertifikasi halal dan varian produk pelaku usaha yang terdaftar di LPH Al-Ghazali.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onTriggerExportCSV}
                className="w-full py-3 px-4 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-3 cursor-pointer group shadow-xs"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform rounded-lg">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold">Ekspor Berkas ke CSV</p>
                  <p className="text-[10px] text-slate-400 font-normal">Kompatibel dengan Microsoft Excel & Google Sheets</p>
                </div>
              </button>

              <button
                onClick={onTriggerExportPrint}
                className="w-full py-3 px-4 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-3 cursor-pointer group shadow-xs"
              >
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold">Unduh Laporan Ringkas PDF</p>
                  <p className="text-[10px] text-slate-400 font-normal">Cetak data registrasi rangkuman silsilah</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
            <div className="flex gap-2.5 items-center justify-start text-[10px] text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Ekspor Terenkripsi SSL LPH</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
