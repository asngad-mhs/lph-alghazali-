import React, { useState, useRef, useEffect } from 'react';
import { ClipboardList, PlusCircle, Trash, Check, ArrowRight, ArrowLeft, PenTool, Award, ShieldCheck, HelpCircle } from 'lucide-react';
import { HalalApplication, ProductDetail, ProductType } from '../types';

interface CertificationWizardProps {
  onComplete: (data: Omit<HalalApplication, 'id' | 'userId' | 'status' | 'submissionDate' | 'lastUpdated'>) => void;
  onCancel: () => void;
  companyNameDefault: string;
  nibDefault: string;
}

export default function CertificationWizard({
  onComplete,
  onCancel,
  companyNameDefault,
  nibDefault,
}: CertificationWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [companyName, setCompanyName] = useState(companyNameDefault || '');
  const [nib, setNib] = useState(nibDefault || '');
  const [brandName, setBrandName] = useState('');
  const [productType, setProductType] = useState<ProductType>('Makanan');
  const [products, setProducts] = useState<ProductDetail[]>([
    { id: '1', name: '', ingredients: '' }
  ]);
  
  // Signature Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [typedSign, setTypedSign] = useState('');
  const [signMethod, setSignMethod] = useState<'draw' | 'type'>('draw');

  // Trigger default company values
  useEffect(() => {
    if (companyNameDefault && !companyName) setCompanyName(companyNameDefault);
    if (nibDefault && !nib) setNib(nibDefault);
  }, [companyNameDefault, nibDefault]);

  // Signature Canvas Helpers
  useEffect(() => {
    if (step === 3 && signMethod === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#022c22'; // deep emerald sign color
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [step, signMethod]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Product List Helpers
  const addProductRow = () => {
    const newId = String(products.length + 1);
    setProducts([...products, { id: newId, name: '', ingredients: '' }]);
  };

  const removeProductRow = (id: string) => {
    if (products.length === 1) return;
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProductField = (id: string, field: 'name' | 'ingredients', value: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple checks
    if (!companyName || !nib || !brandName) {
      setStep(1);
      return;
    }

    const filteredProducts = products.filter(p => p.name.trim() !== '');
    if (filteredProducts.length === 0) {
      setStep(2);
      return;
    }

    const secureSeal = 'BSR-ESIGN-' + Math.random().toString(16).substring(2, 10).toUpperCase() + '-LPHAG';

    onComplete({
      companyName,
      nib,
      brandName,
      productType,
      products: filteredProducts,
      esignatureStatus: 'Signed',
      esignatureDate: new Date().toLocaleDateString('id-ID'),
      esignatureSeal: secureSeal,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden text-left max-w-3xl mx-auto transition-all duration-300">
      
      {/* Wizard Header Progress */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white relative">
        <h3 className="text-lg font-black tracking-tight">Form Registrasi Sertifikasi Halal</h3>
        <p className="text-xs text-emerald-100 mt-1">Lembaga Pemeriksa Halal Al-Ghazali — Pendaftaran Online Sesuai Standar BPJPH</p>
        
        {/* Stepper Progress Visualizer */}
        <div className="flex items-center justify-between mt-6 max-w-sm">
          {[
            { num: 1, label: 'Legalitas' },
            { num: 2, label: 'Data Produk' },
            { num: 3, label: 'Tanda Tangan' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div 
                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border transition-all ${
                  step >= s.num 
                    ? 'bg-white text-emerald-700 border-white font-extrabold shadow-sm' 
                    : 'bg-emerald-700/50 text-emerald-250 border-emerald-600'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
              </div>
              <span className={`text-[11px] font-bold ${step >= s.num ? 'text-white' : 'text-emerald-350'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Step 1: Legal Business Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex gap-2.5 items-center mb-1">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Langkah 1: Identitas dan Legalitas Usaha</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1">Nama Perusahaan*</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: PT Bogasari Flavor Mandiri"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1">Nomor Induk Berusaha (NIB)*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1210210087123"
                  value={nib}
                  onChange={(e) => setNib(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1">Merek Dagang / Nama Brand*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sambal Bakar Al-Fath"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1">Jenis Layanan / Scope Produk</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as ProductType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Kosmetik">Kosmetik</option>
                  <option value="Obat">Obat-obatan</option>
                  <option value="Barang Gunaan">Barang Penyulingan / Barang Gunaan</option>
                  <option value="Jasa">Jasa Penyembelihan / Logistik Makanan</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 mt-4 flex items-start gap-2.5">
              <span className="p-1 px-2 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">INFO</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Pastikan nomor NIB Anda valid dan terdaftar di portal OSS Indonesia. Tim Audit LPH Al-Ghazali akan melakukan pengecekan legalitas izin dasar sebelum berkas dilimpahkan ke tahapan verifikasi lapangan.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!companyName || !nib || !brandName}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Selanjutnya (Data Produk)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Product Entries */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex gap-2.5 items-center">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Langkah 2: Informasi Produk Terdaftar</h4>
              </div>
              <button
                type="button"
                onClick={addProductRow}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-350 flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Varian Produk</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {products.map((prod, index) => (
                <div key={prod.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl relative space-y-3 bg-white dark:bg-slate-900/40">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400">VARIAN #{index + 1}</span>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductRow(prod.id)}
                        className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Nama Produk*</label>
                      <input
                        type="text"
                        required
                        value={prod.name}
                        onChange={(e) => updateProductField(prod.id, 'name', e.target.value)}
                        placeholder="Contoh: Roti Manis Isian Cokelat"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Bahan Utama & Rantai Pasok*</label>
                      <input
                        type="text"
                        required
                        value={prod.ingredients}
                        onChange={(e) => updateProductField(prod.id, 'ingredients', e.target.value)}
                        placeholder="Contoh: Tepung Terigu, Gula, Kakao Bubuk Halal MUI"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={products.filter(p => p.name.trim() !== '').length === 0}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Ke Tanda Tangan Digital</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: E-Signature Draw & BSrE verification */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex gap-2.5 items-center mb-1">
              <PenTool className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Langkah 3: Integrasi API Tanda Tangan Elektronik</h4>
            </div>

            {/* Signature format togglers */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-60">
              <button
                type="button"
                onClick={() => setSignMethod('draw')}
                className={`flex-1 py-1 px-3 text-xs font-bold rounded-lg transition-all ${
                  signMethod === 'draw'
                    ? 'bg-white dark:bg-slate-850 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-550'
                }`}
              >
                Draw Signature
              </button>
              <button
                type="button"
                onClick={() => setSignMethod('type')}
                className={`flex-1 py-1 px-3 text-xs font-bold rounded-lg transition-all ${
                  signMethod === 'type'
                    ? 'bg-white dark:bg-slate-850 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-550'
                }`}
              >
                Tipe Karakter
              </button>
            </div>

            <p className="text-xs text-slate-450 dark:text-slate-400">
              Surat Pernyataan Halal ini akan diunggah ke sistem BPJPH dengan metadata tanda tangan elektronik terverifikasi (BSrE Indonesia).
            </p>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner">
              {signMethod === 'draw' ? (
                /* Drawings Canvas Area */
                <div className="p-4 flex flex-col items-center">
                  <div className="bg-white rounded-xl border border-slate-200 relative overflow-hidden inline-block cursor-crosshair">
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={180}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="touch-none bg-white block"
                    />
                    {!hasSigned && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-350 opacity-60">
                        <PenTool className="w-8 h-8 mb-1 animate-bounce" />
                        <span className="text-[10px] font-bold">Goyangkan Kursor/Sentuh Di Sini untuk Tanda Tangan</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full max-w-[480px] flex justify-between items-center mt-3">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono italic">Canvas Lebar: 480px X 180px</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Bersihkan Gambar
                    </button>
                  </div>
                </div>
              ) : (
                /* Text Sign inputs representation */
                <div className="p-6 space-y-4 text-center">
                  <div className="max-w-[400px] mx-auto">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 text-left mb-1">
                      Ketik Nama Lengkap Penanggungjawab*
                    </label>
                    <input
                      type="text"
                      value={typedSign}
                      onChange={(e) => {
                        setTypedSign(e.target.value);
                        setHasSigned(e.target.value.length > 2);
                      }}
                      placeholder="Contoh: Ahmad Al-Ghazali, M.Ag."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none font-serif text-lg text-center"
                    />
                  </div>

                  {typedSign && (
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl inline-block">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Visualisasi Tanda Tangan:</p>
                      <p className="text-3xl font-bold font-serif italic text-emerald-850 tracking-wider text-emerald-800 px-8 py-2">
                        {typedSign}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BSrE Security Banner */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-450 uppercase tracking-wide">LPH E-SIGNATURE GATEWAY</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-500 leading-normal mt-0.5">
                  Dengan menandatangani berkas ini secara elektronik, Anda menyatakan dokumen permohonan Halal ini adalah sah-sebenar-benarnya keabsahan bahan dasar & alur produksi.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="submit"
                disabled={!hasSigned}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Award className="w-4 h-4" />
                <span>Kirim Berkas Sertifikasi</span>
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
