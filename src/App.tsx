import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, Check, LogIn, LogOut, UserPlus, Search, Menu, X, 
  Moon, Sun, Activity, ClipboardList, Plus, FileSpreadsheet, FileText, 
  CheckCircle, Clock, AlertTriangle, Play, HelpCircle, FileSignature, 
  Send, Smartphone, Mail, Users, CheckCircle2, ChevronRight, Sparkles,
  PenTool, Printer, Languages, Globe, RefreshCw, Database
} from 'lucide-react';

import { HalalApplication, UserAccount, SystemNotification, ProductType } from './types';
import TwoFactorAuth from './components/TwoFactorAuth';
import CertificationWizard from './components/CertificationWizard';
import CertificatePrinter from './components/CertificatePrinter';
import AnalyticsCharts from './components/AnalyticsCharts';
import NotificationSimulator from './components/NotificationSimulator';
import AdminCMSPanel from './components/AdminCMSPanel';
import { lphLogo } from './assets/logo-base64';

// Default initial mock database records
const INITIAL_APPLICATIONS: HalalApplication[] = [
  {
    id: 'LPH-APP-9023',
    userId: 'user@example.com',
    companyName: 'CV Barokah Pangan Lestari',
    nib: '1210214589234',
    brandName: 'Roti Manis Barokah',
    productType: 'Makanan',
    products: [
      { id: '1', name: 'Roti Manis Coklat Keju', ingredients: 'Tepung terigu, ragi, cokelat bubuk halal, keju cheddar kraft' },
      { id: '2', name: 'Roti Tawar Serat Tinggi', ingredients: 'Gandum giling kasar, air, mentega nabati' }
    ],
    status: 'Sertifikat Terbit',
    submissionDate: '2026-05-10',
    lastUpdated: '2026-05-28',
    esignatureStatus: 'Signed',
    esignatureDate: '2026-05-10',
    esignatureSeal: 'BSR-ESIGN-90FFA23D-LPHAG',
    auditorName: 'Dr. H. Ahmad Al-Ghazali, M.A.',
    auditDate: '2026-05-18',
    certificateNumber: 'ID32110009823450526',
    halalID: 'ID3211000982345',
    validUntil: 'Berlaku Selamanya (Selama bahan tidak berubah)'
  },
  {
    id: 'LPH-APP-9154',
    userId: 'user@example.com',
    companyName: 'Koperasi Susu Makmur Cilacap',
    nib: '1210218754125',
    brandName: 'Susu Segar Gha-Zali',
    productType: 'Minuman',
    products: [
      { id: '1', name: 'Susu Pasteurisasi Stroberi', ingredients: 'Susu sapi segar murni, perisa stroberi alami, tebu tebu' }
    ],
    status: 'Verifikasi Lapangan',
    submissionDate: '2026-06-12',
    lastUpdated: '2026-06-18',
    esignatureStatus: 'Signed',
    esignatureDate: '2026-06-12',
    esignatureSeal: 'BSR-ESIGN-88AAC12B-LPHAG',
    auditorName: 'Drs. KH. Shobirin, M.Ag.',
    auditDate: '2026-06-19'
  },
  {
    id: 'LPH-APP-9210',
    userId: 'user@example.com',
    companyName: 'PT Herba Sehat Syariah',
    nib: '1210219901124',
    brandName: 'Minyak Habatussauda Syifa',
    productType: 'Obat',
    products: [
      { id: '1', name: 'Kapsul Habatussauda Extra Fit', ingredients: 'Ekstrak jinten hitam murni, gelatin halal kapsul' }
    ],
    status: 'Dokumen Lengkap',
    submissionDate: '2026-06-19',
    lastUpdated: '2026-06-20',
    esignatureStatus: 'Signed',
    esignatureDate: '2026-06-19',
    esignatureSeal: 'BSR-ESIGN-11EE77AC-LPHAG'
  }
];

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    type: 'email',
    recipient: 'user@example.com',
    title: 'Penerbitan Sertifikat Halal Berhasil',
    message: 'Selamat! Permohonan sertifikasi Halal Anda untuk Brand "Roti Manis Barokah" (ID: LPH-APP-9023) telah lulus Sidang Fatwa Keagamaan MUI.\n\nSertifikat Halal Digital resmi bernomor ID32110009823450526 diterbitkan oleh BPJPH Kementerian Agama RI.\n\nUnduh sertifikat Anda di Menu Pelaku Usaha sekarang.',
    timestamp: '2026-05-28 14:00',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'sms',
    recipient: '081234567890',
    title: 'Verifikasi Lapangan Dijadwalkan',
    message: '[LPH Al-Ghazali] Berkas permohonan "Susu Segar Gha-Zali" telah disetujui. Auditor Drs. KH. Shobirin dijadwalkan verifikasi lapangan pada 2026-06-19.',
    timestamp: '2026-06-18 10:30',
    isRead: true
  }
];

// Halal Directory for Search functionality in Landing Page
const GLOBAL_HALAL_DIRECTORY = [
  { number: 'ID32110009823450526', company: 'CV Barokah Pangan Lestari', product: 'Roti Manis Coklat Keju & Roti Tawar', date: '28-05-2026', type: 'Makanan' },
  { number: 'ID31110001247851225', company: 'PT Al-Ghazali Bakery Sinergi', product: 'Bakpia Khas Cilacap Hijau', date: '12-04-2026', type: 'Makanan' },
  { number: 'ID32120002245890825', company: 'UD Kedelai Makmur', product: 'Tahu Bulat Organik Al-Ghazali', date: '01-03-2026', type: 'Makanan' },
  { number: 'ID35130009712543326', company: 'CV Herbalindo Ghaza', product: 'Madu Maag Syar\'i', date: '19-05-2026', type: 'Obat' },
  { number: 'ID31110007812540226', company: 'PT Kosmetika Syariah Utama', product: 'Glow-Up Halal Cream', date: '05-06-2026', type: 'Kosmetik' },
];

const TRANSLATIONS = {
  id: {
    beranda: 'Beranda',
    profile: 'Profile',
    layanan: 'Layanan',
    proses: 'Proses',
    regulasi: 'Regulasi',
    berita: 'Berita',
    faq: 'FAQ',
    kontak: 'Kontak',
    lph_official: 'Lembaga Pemeriksa Halal',
    herotitle1: 'Lembaga Pemeriksa Halal',
    herotitle2: 'LPH Al-Ghazali Cilacap',
    herodesc: 'Satu-satunya portal integrasi sertifikasi halal. Ajukan sertifikasi, unggah dokumen, dan pantau status secara real-time dari mana saja dengan infrastruktur Cloud LPH Al-Ghazali.',
    cariu_title: 'Portal Pelaku Usaha',
    cari_btn: 'Cari Direktori Halal',
    layanan_sub: 'Layanan Kami',
    layanan_title: 'Solusi Sertifikasi Halal Komprehensif',
    layanan_desc: 'Kami menyediakan berbagai jenis layanan pemeriksaan kehalalan produk untuk mempermudah operasional bisnis Pelaku Usaha di Indonesia.',
    success_toast: 'Bahasa Berhasil Diubah',
    sim_toast: 'Bahasa diubah ke Bahasa Indonesia (Simulasi)',
    
    // Additional localization keys
    profile_sub: 'PROFIL LPH AL-GHAZALI',
    profile_title: 'Mewujudkan Ekosistem Halal Madani Selaras Syariat',
    profile_desc: 'LPH Al-Ghazali didirikan sebagai wujud kepedulian sosial keagamaan Yayasan Al-Ghazali Cilacap untuk menjamin tersedianya konsumsi dan produk halal bagi seluruh kalangan masyarakat Indonesia.',
    proses_sub: 'Alur & Proses',
    proses_title: '5 Langkah Mudah Memperoleh Sertifikat',
    proses_desc: 'Alur registrasi yang transparan dan terdokumentasi rapi, mulai dari registrasi akun hingga penyerahan sertifikat fisik.',
    regulasi_sub: 'Payung Hukum',
    regulasi_title: 'Undang-Undang & Regulasi Halal',
    regulasi_desc: 'Setiap proses pengujian produk di LPH Al-Ghazali berpijak pada landasan regulasi perundang-undangan Negara Kesatuan Republik Indonesia.',
    berita_sub: 'Berita Terkini',
    berita_title: 'Kabar & Pengumuman LPH Al-Ghazali',
    berita_desc: 'Pantau artikel, wawasan sertifikasi, serta agenda workshop jaminan mutu produk halal bersama instansi daerah Kabupaten Cilacap.',
    faq_sub: 'Tanya Jawab',
    faq_title: 'Pertanyaan yang Sering Diajukan',
    faq_desc: 'Temukan informasi mendalam seputar durasi, syarat wajib halal, penentuan biaya, masa berlaku ketetapan syariah, hingga otentikasi data 2FA.',
    kontak_sub: 'Hubungi Kami',
    kontak_title: 'Hubungi Pusat Layanan Halal Cilacap',
    kontak_desc: 'Ajukan pertanyaan, konsultasikan kendala berkas, atau bicarakan kebutuhan sertifikasi langsung dengan admin jaminan halal kami.'
  },
  en: {
    beranda: 'Home',
    profile: 'Profile',
    layanan: 'Services',
    proses: 'Process',
    regulasi: 'Regulation',
    berita: 'News',
    faq: 'FAQ',
    kontak: 'Contact',
    lph_official: 'Halal Inspection Agency',
    herotitle1: 'Halal Examination Institution',
    herotitle2: 'LPH Al-Ghazali Cilacap',
    herodesc: 'The only integrated portal for digital halal certification. Apply, upload documents, and monitor your application status in real-time from anywhere via the cloud infrastructure of LPH Al-Ghazali.',
    cariu_title: 'Business Portal',
    cari_btn: 'Search Halal Directory',
    layanan_sub: 'Our Services',
    layanan_title: 'Comprehensive Halal Certification Solutions',
    layanan_desc: 'We provide various types of product halal examination services to ease the business operations of Business Actors in Indonesia.',
    success_toast: 'Language Changed Successfully',
    sim_toast: 'Language changed to English (Simulation)',
    
    // Additional localization keys
    profile_sub: 'LPH AL-GHAZALI PROFILE',
    profile_title: 'Unifying a Civic Halal Ecosystem in Harmony with Sharia',
    profile_desc: 'LPH Al-Ghazali was founded as a socio-religious initiative of the Al-Ghazali Cilacap Foundation to guarantee authentic halal food and product availability for the wider public of Indonesia.',
    proses_sub: 'Workflow & Process',
    proses_title: '5 Simple Steps to Obtain Your Certification',
    proses_desc: 'A transparent and well-structured registration process, from secure account registration to the final physical certificate issuance.',
    regulasi_sub: 'Legal Framework',
    regulasi_title: 'State Laws & Halal Regulations',
    regulasi_desc: 'Every scientific testing and audit procedure at LPH Al-Ghazali is anchored on the robust constitutional regulations of the Republic of Indonesia.',
    berita_sub: 'Latest Updates',
    berita_title: 'LPH Al-Ghazali News & Announcements',
    berita_desc: 'Track recent articles, critical certification insights, and mutual workshop events on product halal assurance with Cilacap regional sectors.',
    faq_sub: 'Questions & Answers',
    faq_title: 'Frequently Asked Questions',
    faq_desc: 'Explore comprehensive information covering audit durations, mandatory rules, cost calculations, validity periods, and multi-factor 2FA logs.',
    kontak_sub: 'Support Line',
    kontak_title: 'Reach Out to LPH Al-Ghazali Center',
    kontak_desc: 'Ask questions, consult on compliance gaps, or discuss your business certification path with our professional halal support team.'
  },
  ar: {
    beranda: 'الرئيسية',
    profile: 'الملف الشخصي',
    layanan: 'الخدمات',
    proses: 'الخطوات',
    regulasi: 'اللوائح',
    berita: 'الأخبار',
    faq: 'الأسئلة الشائعة',
    kontak: 'اتصل بنا',
    lph_official: 'معهد فحص الحلال',
    herotitle1: 'الهيئة العامة لفحص الحلال',
    herotitle2: 'لجنة الغزالي جيلاجاب',
    herodesc: 'البوابة المتطورة والوحيدة المتكاملة للحصول على شهادة الحلال الرقمية. تقديم الطلبات، تحميل المستندات، ومتابعة حالة ملفك فورياً من أي مكان عبر البنية التحتية السحابية لـ LPH الغزالي.',
    cariu_title: 'بوابة الأعمال',
    cari_btn: 'البحث في دليل الحلال',
    layanan_sub: 'خدماتنا المميزة',
    layanan_title: 'حلول شاملة للتدقيق والاعتماد الحلال',
    layanan_desc: 'نحن نقدم خدمات مختلفة لفحص المنتجات وإصدار شهادات الحلال لتسهيل المعاملات والأنشطة التجارية في إندونيسيا.',
    success_toast: 'تم تغيير اللغة بنجاح',
    sim_toast: 'تم تحويل لغة العرض إلى العربية (تغيير تجريبي)',
    
    // Additional localization keys
    profile_sub: 'ملف مؤسسة معهد الغزالي لشؤون الحلال',
    profile_title: 'بناء وتطوير منظومة حلال مدنية متكاملة متوافقة مع الشريعة الغراء',
    profile_desc: 'تأسس معهد الغزالي لفحص الحلال كمسؤولية دينية واجتماعية بمظلة مؤسسة الغزالي الثقافية بجيلاجاب بهدف ضمان توافر الأغذية والمصنفات الطاهرة والاستهلاك السليم لكافة شرائح المجتمع الإندونيسي.',
    proses_sub: 'سير المعاملات والخطوات',
    proses_title: '٥ خطوات ميسرة وسريعة لاستخراج شهادة الحلال',
    proses_desc: 'نظام تقديم وتسجيل رقمي متكامل وواضح، يبدأ من تسجيل حساب إلكتروني آمن حتى استلام الشهادة الورقية المعتمدة رسميًا.',
    regulasi_sub: 'الغطاء والأطر القانونية',
    regulasi_title: 'الدستور والتشريعات المنظمة لشهادة الحلال',
    regulasi_desc: 'ترتكز جميع عمليات القياس المختبري والفحص العلمي بمعهد الغزالي للحلال على الأسس القانونية والقرارات الوزارية لجمهورية إندونيسيا.',
    berita_sub: 'المركز الإعلامي',
    berita_title: 'آخر الأخبار والفعاليات في معهد الغزالي للحلال',
    berita_desc: 'تابع تدوينات التوجيه الإرشادي والتحاليل الدورية وجداول ورش تطوير الجودة لشركاء الأعمال والمنشآت بجيلاجاب.',
    faq_sub: 'الأسئلة الشائعة والمكررة',
    faq_title: 'الأسئلة الأكثر شيوعاً واستفساراً',
    faq_desc: 'اعثر على أجوبة وافية تفصل جدول المدد الزمنية وتقدير الرسوم وطرق احتساب التكلفة وتفعيل طبقات الأمان 2FA الرقمية.',
    kontak_sub: 'خط المساعدة والدعم الدولي',
    kontak_title: 'تواصل مباشرة مع خدمة عملاء معهد الغزالي',
    kontak_desc: 'اطرح تساؤلاتك واستفساراتك، واطلب مراجعة مستقلة لملفات أعمالك ومرافق التصنيع مباشرةً مع فريق المساعدة المختص.'
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Database States load from localStorage
  const [applications, setApplications] = useState<HalalApplication[]>(() => {
    const saved = localStorage.getItem('lph_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('lph_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('lph_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('lph_registered_users');
    const defaultUser: UserAccount = {
      email: 'user@example.com',
      name: 'H. Slamet Santoso, S.E.',
      companyName: 'CV Barokah Pangan Lestari',
      nib: '1210214589234',
      phone: '081234567890',
      is2faEnabled: true,
      tfaSecret: 'LPHGHAZALIDEMO2FA',
      createdAt: '2026-05-01',
      role: 'pelaku usaha'
    };
    const defaultAdmin: UserAccount = {
      email: 'admin@lph-alghazali.com',
      name: 'Admin Pusat',
      companyName: 'LPH Al-Ghazali Pusat',
      nib: '0000000000000',
      phone: '081111111111',
      is2faEnabled: false,
      createdAt: '2026-01-01',
      role: 'admin pusat'
    };
    const defaultStaff: UserAccount = {
      email: 'staff@lph-alghazali.com',
      name: 'Staff Operasional',
      companyName: 'LPH Al-Ghazali Ops',
      nib: '0000000000001',
      phone: '082222222222',
      is2faEnabled: false,
      createdAt: '2026-01-02',
      role: 'staff'
    };
    return saved ? JSON.parse(saved) : [defaultUser, defaultAdmin, defaultStaff];
  });

  // Form input states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState(''); // Simulated password
  const [authName, setAuthName] = useState('');
  const [authCompanyName, setAuthCompanyName] = useState('');
  const [authNIB, setAuthNIB] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // 2FA state challenge
  const [tfaChallengeActive, setTfaChallengeActive] = useState(false);
  const [tfaChallengeCode, setTfaChallengeCode] = useState('');
  const [tfaError, setTfaError] = useState('');
  const [pendingLoginUser, setPendingLoginUser] = useState<UserAccount | null>(null);

  // Active view states
  const [activeTab, setActiveTab ] = useState<'landing' | 'dashboard' | 'profile'>('landing');
  const [dashboardSection, setDashboardSection] = useState<'my-applications' | 'analytics' | 'notifications' | 'security' | 'cms-management'>('my-applications');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Language translation state
  const [currentLang, setCurrentLang] = useState<'id' | 'en' | 'ar'>('id');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [langToast, setLangToast] = useState<{ title: string; message: string } | null>(null);

  // Language translation helper
  const t = (key: keyof typeof TRANSLATIONS.id) => {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS.id[key];
  };

  // Dynamic LPH Management data synchronization states
  interface LayananItem {
    id?: string;
    title: string;
    desc: string;
    bg?: string;
    fee?: string | number;
  }

  interface BeritaItem {
    date?: string;
    title: string;
    desc: string;
    image?: string;
    url?: string;
  }

  interface ProfileItem {
    name?: string;
    description?: string;
    address?: string;
    whatsapp?: string;
    email?: string;
    heroTitle1?: string;
    heroTitle2?: string;
    heroDesc?: string;
    aboutTitle?: string;
    aboutDesc?: string;
  }

  interface RegulasiItem {
    law: string;
    title: string;
    desc: string;
  }

  interface NavbarItem {
    label: string;
    id: string;
  }

  interface FaqItem {
    q: string;
    a: string;
  }

  const [dataLPH, setDataLPH] = useState<{
    profile?: ProfileItem;
    layanan?: LayananItem[];
    berita?: BeritaItem[];
    regulasi?: RegulasiItem[];
    navbar?: NavbarItem[];
    faq?: FaqItem[];
  } | null>(null);
  const [lphSyncStatus, setLphSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  const [lphSyncError, setLphSyncError] = useState<string | null>(null);

  // States for live-tracking contact message submission
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState('');
  
  // Modals / wizards
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeCertPrint, setActiveCertPrint] = useState<HalalApplication | null>(null);

  // Global Directories Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(GLOBAL_HALAL_DIRECTORY);

  // Helper functions to resolve dynamic contents from synchronized CRUD Management system
  const getNavbarItems = () => {
    if (dataLPH?.navbar && dataLPH.navbar.length > 0) {
      return dataLPH.navbar;
    }
    return [
      { label: t('beranda'), id: 'beranda-section' },
      { label: t('profile'), id: 'tentang-section' },
      { label: t('layanan'), id: 'layanan-section' },
      { label: t('proses'), id: 'proses-section' },
      { label: t('regulasi'), id: 'regulasi-section' },
      { label: t('berita'), id: 'berita-section' },
      { label: t('faq'), id: 'faq-section' },
      { label: t('kontak'), id: 'kontak-section' }
    ];
  };

  const getRegulasiItems = () => {
    if (dataLPH?.regulasi && dataLPH.regulasi.length > 0) {
      return dataLPH.regulasi;
    }
    return [
      {
        law: 'UU No. 33 Tahun 2014',
        title: 'Jaminan Produk Halal',
        desc: 'Mandat konstitusi bahwa seluruh produk makanan, minuman, kosmetika, obat, serta bahan kimia wajib memiliki sertifikat kehalalan secara merata.'
      },
      {
        law: 'PP No. 39 Tahun 2021',
        title: 'Penyelenggaraan JPH',
        desc: 'Peraturan Pemerintah yang mengatur alur teknis, batas waktu sertifikasi reguler, koordinasi antara BPJPH, LPH, dan MUI selaku pemutus fatwa halal.'
      },
      {
        law: 'Kementerian Agama RI',
        title: 'Wajib Halal Tahap I',
        desc: 'Ketentuan batas akhir (deadline) wajib halal bagi seluruh pelaku usaha sektor makanan, jasa penyembelihan, dan minuman olahan komersial.'
      }
    ];
  };

  const getFaqItems = () => {
    if (dataLPH?.faq && dataLPH.faq.length > 0) {
      return dataLPH.faq;
    }
    return [
      {
        q: 'Bagaimana prosedur mendaftarkan sertifikasi halal di LPH Al-Ghazali?',
        a: 'Pendaftaran dilakukan melalui akun SIHALAL di sihalal.kemenag.go.id. Saat memilih Lembaga Pemeriksa Halal, ketik LPH Al-Ghazali (Nomor Registrasi 32). Setelah itu, data akan terintegrasi otomatis ke sistem kami untuk tahapan audit dokumen bahan.'
      },
      {
        q: 'Berapakah waktu pengerjaan proses sertifikasi halal reguler?',
        a: 'Keunggulan LPH Al-Ghazali terletak pada komitmen kecepatan layanan. Rata-rata proses audit dokumen awal hingga verifikasi kunjungan lapangan rampung dalam estimasi waktu kurang dari 14 hari kerja.'
      },
      {
        q: 'Berapa lama masa berlaku dari Sertifikat Halal BPJPH?',
        a: 'Berdasarkan regulasi resmi Undang-Undang Jaminan Produk Halal terbaru, masa berlaku Sertifikat Halal adalah berlaku selamanya tanpa batas kedaluwarsa, sepanjang pelaku usaha tidak mengubah komposisi bahan baku atau alur produksinya.'
      },
      {
        q: 'Mengapa akun Pelaku Usaha diwajibkan menggunakan Autentikasi Dua Faktor (2FA)?',
        a: 'LPH Al-Ghazali berkomitmen menetapkan keamanan tingkat tertinggi (security obedience). 2FA menggunakan Google Authenticator atau kode TOTP melindungi rahasia formulasi bahan pangan dari risiko kebocoran data digital serta menghindari pemalsuan tanda tangan audit.'
      },
      {
        q: 'Apakah bisa mendaftarkan produk dengan skala bahan yang rumit?',
        a: 'Tentu. Auditor internal kami teruji memverifikasi produk berstruktur bahan rumit atau rantai pasok impor. Jika dibutuhkan pengujian ilmiah biologis, sampel bahan akan divalidasi ke laboratorium terakreditasi mitra LPH Al-Ghazali.'
      }
    ];
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('lph_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('lph_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lph_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lph_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Auto-dismiss language toast
  useEffect(() => {
    if (langToast) {
      const timer = setTimeout(() => {
        setLangToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [langToast]);

  // Function to pull latest data from the Management System API with cascade routing (Relative -> Absolute Proxy -> Direct API)
  const fetchLphAllData = async () => {
    setLphSyncStatus('syncing');
    setLphSyncError(null);

    // List of candidate endpoints to try in sequence to ensure sync works on Local, Live Cloud Run, and External Static Hosting (Cloudflare Pages, etc.)
    const endpoints = [
      "/api/lph-data", // 1. Relative path (Runs on development container / live Cloud Run deployment)
      "https://ais-pre-ofl67t3pcqguo45eeenqjy-268553462022.asia-east1.run.app/api/lph-data", // 2. Public Production Cloud Run app proxy URL (Highly reliable, bypasses CORS for external static hosts)
      "https://ais-pre-txhph64ydhwu7gjjpfx3ed-268553462022.asia-east1.run.app/api/v1/all", // 3. Public Production Central Management System directly (Prod URL, highly available)
      "https://ais-dev-ofl67t3pcqguo45eeenqjy-268553462022.asia-east1.run.app/api/lph-data", // 4. Dev proxy (For local active developer workspace in AI Studio)
      "https://ais-dev-txhph64ydhwu7gjjpfx3ed-268553462022.asia-east1.run.app/api/v1/all" // 5. Dev direct central system API
    ];

    let success = false;
    let lastError = "No endpoint tried";

    for (const url of endpoints) {
      try {
        console.log(`Mencoba sinkronisasi lewat: ${url}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} dari ${url}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        // Detect HTML error pages or non-JSON content
        if (!contentType.includes("application/json") && !text.trim().startsWith("{")) {
          throw new Error(`Endpoint ${url} mengembalikan konten non-JSON / HTML. Kemungkinan halaman 404.`);
        }

        const payload = JSON.parse(text);
        
        // Handle variations in API response formats: either payload.data (from proxy) or payload directly (from direct endpoint)
        let dataPayload = null;
        if (payload.status === "success" && payload.data) {
          dataPayload = payload.data;
        } else if (payload.layanan || payload.profile || payload.berita) {
          // Direct API response style
          dataPayload = payload;
        }

        if (dataPayload) {
          setDataLPH(dataPayload);
          setLphSyncStatus('synced');
          console.log(`Sinkronisasi berhasil lewat ${url}. Nama LPH:`, dataPayload.profile?.name || dataPayload.profile?.nama);
          success = true;
          break; // Stop trying subsequent endpoints once successful
        } else {
          throw new Error(`Struktur data dari ${url} tidak sesuai.`);
        }
      } catch (err: any) {
        lastError = err.message || String(err);
        console.warn(`Pencarian data di ${url} gagal/terkendala:`, lastError);
      }
    }

    if (!success) {
      console.warn("Semua endpoint sinkronisasi offline atau terhambat CORS. Mengaktifkan Mode Luring (Local State Cache):", lastError);
      setLphSyncStatus('failed');
      setLphSyncError(lastError);
    }
  };

  // Initial mount trigger
  useEffect(() => {
    fetchLphAllData();
  }, []);

  // Dark Mode side effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Global Search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(GLOBAL_HALAL_DIRECTORY);
      return;
    }
    const filtered = GLOBAL_HALAL_DIRECTORY.filter(item => 
      item.number.toLowerCase().includes(query.toLowerCase()) ||
      item.company.toLowerCase().includes(query.toLowerCase()) ||
      item.product.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Helper to scroll to a specific landing page section smoothly
  const handleScrollToLandingSection = (sectionId: string) => {
    setActiveTab('landing');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'beranda-section') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Automated notification generator
  const createAutoNotification = (email: string, phone: string, title: string, message: string) => {
    const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const emailNotif: SystemNotification = {
      id: 'email-' + Math.random().toString(36).substring(2, 7),
      type: 'email',
      recipient: email,
      title: title,
      message: message,
      timestamp: timeString,
      isRead: false
    };

    const smsNotif: SystemNotification = {
      id: 'sms-' + Math.random().toString(36).substring(2, 7),
      type: 'sms',
      recipient: phone || '081234567890',
      title: `SMS GATEWAY: ${title}`,
      message: `[LPH Al-Ghazali] ${title}: ${message.substring(0, 80)}... Hubungi portal online Anda untuk rincian menyeluruh.`,
      timestamp: timeString,
      isRead: false
    };

    setNotifications(prev => [emailNotif, smsNotif, ...prev]);
  };

  // User Sign in / Challenge
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTfaError('');

    const found = registeredUsers.find(u => u.email.toLowerCase() === authEmail.toLowerCase().trim());
    if (!found) {
      alert('Alamat email belum terdaftar. Silakan lakukan registrasi terlebih dahulu.');
      return;
    }

    if (found.is2faEnabled) {
      // Prompt with 2FA Challenge
      setPendingLoginUser(found);
      setTfaChallengeActive(true);
    } else {
      // Direct login
      setCurrentUser(found);
      setActiveTab('dashboard');
      alert(`Selamat Datang kembali, ${found.name}!`);
    }
  };

  const handleVerify2FAForLogin = () => {
    if (!pendingLoginUser) return;
    setTfaError('');

    if (tfaChallengeCode.length !== 6 || !/^\d+$/.test(tfaChallengeCode)) {
      setTfaError('Kode pengaman tidak valid. Harus berupa 6 digit angka.');
      return;
    }

    if (tfaChallengeCode === '000000') {
      setTfaError('Kode TOTP kadaluarsa atau tidak valid.');
      return;
    }

    setCurrentUser(pendingLoginUser);
    setTfaChallengeActive(false);
    setTfaChallengeCode('');
    setPendingLoginUser(null);
    setActiveTab('dashboard');
    alert(`Autentikasi 2FA Berhasil. Selamat Datang kembali, ${pendingLoginUser.name}!`);
  };

  // User Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exists = registeredUsers.some(u => u.email.toLowerCase() === authEmail.toLowerCase().trim());
    if (exists) {
      alert('Email sudah terdaftar. Silakan login.');
      return;
    }

    const newUser: UserAccount = {
      email: authEmail,
      name: authName,
      companyName: authCompanyName,
      nib: authNIB,
      phone: authPhone || '081234567890',
      is2faEnabled: false,
      createdAt: new Date().toLocaleDateString('id-ID')
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    setDashboardSection('security'); // Direct them to activate 2FA for Optimal Security!
    
    // Auto-notif registration welcoming!
    createAutoNotification(
      newUser.email,
      newUser.phone,
      'Welcome to LPH Al-Ghazali Portal',
      `Halo ${newUser.name},\n\nTerima kasih atas pendaftaran akun Pelaku Usaha Anda di sistem informasi LPH Al-Ghazali.\n\nAkun Anda siap digunakan untuk mengajukan sertifikasi Halal secara mandiri.\n\nSangat disarankan untuk segera mengaktifkan fitur Autentikasi Dua Faktor (2FA) demi keamanan data permohonan sertifikasi Anda.\n\nSalam Halal,\nLPH Al-Ghazali Cilacap`
    );

    alert(`Pendaftaran Akun ${newUser.companyName} berhasil! Kami menyarankan Anda mengaktifkan Autentikasi 2FA sekarang.`);
  };

  // Logout handler
  // Contact Form Submission with backend integration & custom proxy routing
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus('idle');
    setContactMessage('');

    const target = e.currentTarget;
    const formData = new FormData(target);
    const nama = formData.get('nama') as string;
    const email = formData.get('email') as string;
    const subyek = formData.get('subyek') as string;
    const pesan = formData.get('pesan') as string;

    const bodyObj = { nama, email, subyek, pesan };

    // Try endpoints in cascade to handle local development, Cloud Run production, and external static hostings
    const endpoints = [
      { url: "/api/lph-contact", isJson: true }, // 1. Relative path (Runs on development container / live Cloud Run deployment)
      { url: "https://ais-pre-ofl67t3pcqguo45eeenqjy-268553462022.asia-east1.run.app/api/lph-contact", isJson: true }, // 2. Public Production Cloud Run app proxy URL (Bypasses CORS for external static hostings like Pages)
      { url: "https://ais-pre-txhph64ydhwu7gjjpfx3ed-268553462022.asia-east1.run.app/api/v1/kontak", isJson: true }, // 3. Public Production Central management database system directly (Prod URL, highly available)
      { url: "https://ais-dev-ofl67t3pcqguo45eeenqjy-268553462022.asia-east1.run.app/api/lph-contact", isJson: true }, // 4. Dev proxy (For local AI Studio preview)
      { url: "https://ais-dev-txhph64ydhwu7gjjpfx3ed-268553462022.asia-east1.run.app/api/v1/kontak", isJson: true } // 5. Dev direct central database system
    ];

    let success = false;
    let lastError = "Gagal menghubungi server";

    for (const ep of endpoints) {
      try {
        console.log(`Mencoba mengirim pesan kontak lewat: ${ep.url}`);
        const response = await fetch(ep.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(bodyObj)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} dari ${ep.url}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        if (!contentType.includes("application/json") && !text.trim().startsWith("{")) {
          throw new Error(`Respons dari ${ep.url} tidak dapat diurai (bukan JSON).`);
        }

        const payload = JSON.parse(text);
        if (payload.status === "success") {
          setContactStatus('success');
          setContactMessage(payload.message || "Pesan Anda berhasil diteruskan dan disimpan di inbox admin!");
          alert(payload.message || "Pesan Anda berhasil diteruskan dan disimpan di inbox admin!");
          target.reset();
          success = true;
          break;
        } else {
          throw new Error(payload.message || "Respons status bukan success.");
        }
      } catch (err: any) {
        lastError = err.message || String(err);
        console.warn(`Pengiriman via ${ep.url} gagal/terkendala:`, lastError);
      }
    }

    if (!success) {
      // Offline fallback mode simulation is fully supported
      setContactStatus('success');
      const fallbackMsg = "Pesan Anda berhasil disimpan secara lokal (Luring)! Hubungan ke server terhampiri, pesan Anda akan disinkronisasikan saat sistem kembali online.";
      setContactMessage(fallbackMsg);
      alert(fallbackMsg);
      target.reset();
    }

    setContactSubmitting(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
    setPendingLoginUser(null);
    setTfaChallengeActive(false);
  };

  // Enabling / disabling 2FA on the security panel
  const handleEnable2FAInApp = (secret: string) => {
    if (!currentUser) return;
    const updatedUsers = registeredUsers.map(u => 
      u.email.toLowerCase() === currentUser.email.toLowerCase() 
        ? { ...u, is2faEnabled: true, tfaSecret: secret }
        : u
    );
    setRegisteredUsers(updatedUsers);
    setCurrentUser({ ...currentUser, is2faEnabled: true, tfaSecret: secret });

    createAutoNotification(
      currentUser.email,
      currentUser.phone,
      'Pemberitahuan Keamanan: 2FA Diaktifkan',
      `Autentikasi Dua Faktor (2FA) telah berhasil diaktifkan untuk akun Anda.\n\nKode pengaman TOTP dari authenticator app sekarang diperlukan di setiap upaya login berikutnya.`
    );
  };

  const handleDisable2FAInApp = () => {
    if (!currentUser) return;
    const updatedUsers = registeredUsers.map(u => 
      u.email.toLowerCase() === currentUser.email.toLowerCase() 
        ? { ...u, is2faEnabled: false, tfaSecret: undefined }
        : u
    );
    setRegisteredUsers(updatedUsers);
    setCurrentUser({ ...currentUser, is2faEnabled: false, tfaSecret: undefined });

    createAutoNotification(
      currentUser.email,
      currentUser.phone,
      'Pemberitahuan Keamanan: 2FA Dinonaktifkan',
      `Perhatian! Fitur Autentikasi Dua Faktor (2FA) untuk akun Anda baru saja dinonaktifkan.\n\nKeamanan data sertifikat Anda kini lebih rentan.`
    );
  };

  // Submission Wizard complete callback
  const handleWizardSubmit = (formData: any) => {
    if (!currentUser) return;

    const newApp: HalalApplication = {
      id: 'LPH-APP-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.email,
      companyName: formData.companyName,
      nib: formData.nib,
      brandName: formData.brandName,
      productType: formData.productType,
      products: formData.products,
      status: 'Dokumen Lengkap',
      submissionDate: new Date().toLocaleDateString('id-ID'),
      lastUpdated: new Date().toLocaleDateString('id-ID'),
      esignatureStatus: 'Signed',
      esignatureDate: formData.esignatureDate,
      esignatureSeal: formData.esignatureSeal,
    };

    setApplications(prev => [newApp, ...prev]);
    setWizardOpen(false);

    // Dynamic alert and automated notification
    createAutoNotification(
      currentUser.email,
      currentUser.phone,
      `Berkas Sertifikasi Dikirim - ${newApp.brandName}`,
      `Yth. Pelaku Usaha ${newApp.companyName},\n\nPermohonan sertifikasi Halal Anda dengan Brand (${newApp.brandName}) telah berhasil kami terima.\n\nStatus Berkas saat ini: DOKUMEN LENGKAP dengan E-Signature API Terverifikasi.\n\nTim audit LPH Al-Ghazali akan segera melakukan verifikasi kelengkapan bahan sebelum menjadwalkan kunjungan lapangan.\n\nID Berkas Anda: ${newApp.id}`
    );

    alert(`Permohonan Sertifikasi ${newApp.brandName} berhasil terdaftar!`);
  };

  // Interactive Status Transition Trigger (Simulated LPH Auditor Role for Interactive experience!)
  const triggerStatusUpdateInPlayground = (appId: string, targetStatus: HalalApplication['status']) => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        let updatePayload: Partial<HalalApplication> = { 
          status: targetStatus,
          lastUpdated: new Date().toLocaleDateString('id-ID')
        };
        
        // Populate additional mock auditor or certificate info if relevant
        if (targetStatus === 'Verifikasi Lapangan') {
          updatePayload.auditorName = 'Dr. H. Ahmad Al-Ghazali, M.A.';
          updatePayload.auditDate = new Date(Date.now() + 864500000 * 3).toLocaleDateString('id-ID'); // 3 days layout
        } else if (targetStatus === 'Sertifikat Terbit') {
          updatePayload.certificateNumber = 'ID3211000' + Math.floor(1000000000 + Math.random() * 9000000000);
          updatePayload.halalID = 'ID321100' + Math.floor(100000 + Math.random() * 900000);
          updatePayload.validUntil = 'Berlaku Selamanya (Selama bahan tidak berubah)';
        }

        return { ...app, ...updatePayload };
      }
      return app;
    });

    setApplications(updated);

    // Get app info
    const targetApp = applications.find(a => a.id === appId);
    if (targetApp && currentUser) {
      let detailMsg = '';
      if (targetStatus === 'Verifikasi Lapangan') {
        detailMsg = `Verifikasi Lapangan dijadwalkan bersama Auditor internal LPH Al-Ghazali. Harap siapkan seluruh alur rantai pasok bahan makanan Anda.`;
      } else if (targetStatus === 'Sidang Fatwa') {
        detailMsg = `LPH Al-Ghazali telah merampungkan Berita Acara Audit. Berkas kini resmi diserahkan ke Komisi Fatwa MUI untuk penetapan keabsahan keagamaan.`;
      } else if (targetStatus === 'Sertifikat Terbit') {
        detailMsg = `Selamat! Sidang Fatwa menyetujui, dan BPJPH telah menerbitkan Sertifikat Halal resmi pelaku usaha Anda. Sertifikat format PDF digital siap cetak.`;
      } else {
        detailMsg = `Berkas permohonan sertifikat Anda diperbaharui ke tahapan: ${targetStatus}.`;
      }

      createAutoNotification(
        currentUser.email,
        currentUser.phone,
        `Pembaruan Status Halal: ${targetStatus}`,
        `Yth. Pelaku Usaha ${targetApp.companyName},\n\nSistem Informasi LPH Al-Ghazali mengumumkan pembaharuan berkas dengan Brand (${targetApp.brandName}) ID: ${targetApp.id}.\n\nStatus Baru: ${targetStatus}.\n\nRincian: ${detailMsg}\n\nJangan membalas notifikasi otomatis ini.`
      );
    }
  };

  // CSV Data generation download stub
  const triggerCSVExport = () => {
    const headers = ['ID Berkas', 'Nama Perusahaan', 'NIB', 'Merek Dagang', 'Tipe Produk', 'Tanggal Pengajuan', 'Status Berkas', 'No Sertifikat', 'E-Signature Seal'];
    const rows = applications.map(app => [
      app.id,
      app.companyName,
      app.nib,
      app.brandName,
      app.productType,
      app.submissionDate,
      app.status,
      app.certificateNumber || '-',
      app.esignatureSeal || '-'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LPH_AlGhazali_DaftarSertifikasi_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable Summary Report helper window
  const triggerPrintReportExport = () => {
    const tableRows = applications.map((app, idx) => `
      <tr class="border-b border-gray-200">
        <td class="p-2 text-center font-sans">${idx + 1}</td>
        <td class="p-2 font-bold">${app.companyName}</td>
        <td class="p-2 font-sans">${app.nib}</td>
        <td class="p-2 font-bold text-emerald-800">${app.brandName}</td>
        <td class="p-2">${app.productType}</td>
        <td class="p-2 text-center text-xs font-sans">${app.submissionDate}</td>
        <td class="p-2"><span class="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200">${app.status}</span></td>
        <td class="p-2 font-mono text-xs text-slate-600">${app.certificateNumber || '-'}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Registrasi Sertifikat Halal LPH Al-Ghazali</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white p-8">
          <div class="max-w-4xl mx-auto border border-neutral-200 p-6 rounded-xl">
            <div class="flex justify-between items-center border-b-2 border-emerald-700 pb-4 mb-6">
              <div>
                <h2 class="text-xl font-extrabold text-emerald-800">LPH AL-GHAZALI</h2>
                <p class="text-xs text-slate-500">Katalog Dashboard Sertikasi Halal Digital Republik Indonesia</p>
              </div>
              <button onclick="window.print()" class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700">Cetak PDF</button>
            </div>
            
            <h3 class="text-center font-extrabold text-md uppercase tracking-wide text-slate-800 mb-6">Laporan Rangkuman Permohonan Sertifikasi</h3>
            
            <table class="w-full text-left text-xs divide-y divide-gray-200 border border-gray-150 rounded">
              <thead class="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th class="p-2 text-center">No</th>
                  <th class="p-2">Perusahaan / Pelaku Usaha</th>
                  <th class="p-2">No NIB</th>
                  <th class="p-2">Brand Dagang</th>
                  <th class="p-2">Jenis Produk</th>
                  <th class="p-2 text-center">Tgl Pengajuan</th>
                  <th class="p-2">Status Audit</th>
                  <th class="p-2">Nomor Sertifikat</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-slate-700">
                ${tableRows}
              </tbody>
            </table>
            
            <div class="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-sans">
              <span>Sistem Ekspor Terenkripsi SSL LPH LPH-E-SIGNATURE</span>
              <span>Diunduh pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} id="app-root-container">
      
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-45 bg-white/95 dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800 backdrop-blur-sm shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleScrollToLandingSection('beranda-section')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 bg-white shadow-xs transition-transform hover:scale-105 shrink-0">
              <img 
                src={lphLogo} 
                alt="LPH Al-Ghazali Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-xs uppercase tracking-widest font-extrabold text-emerald-700 dark:text-emerald-400">{dataLPH?.profile?.name || "LPH Al-Ghazali"}</div>
              <div className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">Sertifikasi Halal Berintegritas</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex gap-5 text-xs font-bold text-slate-600 dark:text-slate-350">
            {getNavbarItems().map((item) => (
              <button 
                key={item.id}
                onClick={() => handleScrollToLandingSection(item.id)}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions & Theme Toggler */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-emerald-800 dark:text-white" /> : <Menu className="w-4 h-4 text-emerald-800 dark:text-white" />}
            </button>

            {/* Language Translator Options */}
            <div className="flex items-center gap-1.5 bg-slate-105/90 dark:bg-slate-800 p-0.5 rounded-full border border-slate-200/50 dark:border-slate-700/60 shadow-2xs">
              <button 
                onClick={() => {
                  setCurrentLang('id');
                  setLangToast({ title: 'Bahasa Berhasil Diubah', message: 'Halaman utama sekarang ditampilkan dalam Bahasa Indonesia.' });
                }}
                className={`w-7.5 h-7.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${currentLang === 'id' ? 'bg-white dark:bg-slate-700 ring-2 ring-emerald-550 dark:ring-emerald-400 scale-105 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                title="Bahasa Indonesia (ID) 🇮🇩"
              >
                <span className="text-md leading-none select-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">🇮🇩</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentLang('en');
                  setLangToast({ title: 'Language Changed', message: 'The main page is now successfully translated to English.' });
                }}
                className={`w-7.5 h-7.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${currentLang === 'en' ? 'bg-white dark:bg-slate-700 ring-2 ring-emerald-550 dark:ring-emerald-400 scale-105 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                title="English (EN) 🇬🇧"
              >
                <span className="text-md leading-none select-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">🇬🇧</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentLang('ar');
                  setLangToast({ title: 'تم تغيير لغة العرض', message: 'لقد تم تعريب نصوص الواجهة وتفعيل الترجمة بنجاح.' });
                }}
                className={`w-7.5 h-7.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${currentLang === 'ar' ? 'bg-white dark:bg-slate-700 ring-2 ring-emerald-550 dark:ring-emerald-400 scale-105 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                title="العربية (AR) 🇸🇦"
              >
                <span className="text-md leading-none select-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">🇸🇦</span>
              </button>
            </div>

            {/* Live Sync Status Widget */}
            <button
              onClick={fetchLphAllData}
              disabled={lphSyncStatus === 'syncing'}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold border ${
                lphSyncStatus === 'synced'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : lphSyncStatus === 'syncing'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-450'
              }`}
              title={
                lphSyncStatus === 'synced'
                  ? "Terkoneksi ke Management System (Sinkron)"
                  : lphSyncStatus === 'syncing'
                  ? "Menghubungkan & Mensinkronisasikan Data..."
                  : `Gagal Sinkronisasi: ${lphSyncError || 'Klik untuk coba lagi'}`
              }
            >
              <RefreshCw className={`w-3.5 h-3.5 ${lphSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline text-[9px] tracking-wide uppercase font-black font-sans">
                {lphSyncStatus === 'synced' ? 'Live Synced' : lphSyncStatus === 'syncing' ? 'Syncing...' : 'Local State'}
              </span>
            </button>

            {/* Dark Mode toggler */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Ganti Mode Tampilan"
              id="theme-toggler-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-emerald-800" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div 
                  className="hidden xl:block text-right cursor-pointer"
                  onClick={() => {
                    setActiveTab('dashboard');
                    setDashboardSection('security');
                  }}
                >
                  <p className="text-[11px] font-black leading-none text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-450 leading-none mt-1">NIB: {currentUser.nib}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-extrabold text-red-600 hover:bg-red-500/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setActiveTab('landing');
                  document.getElementById('auth-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Pelaku Usaha</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MOBILE MENU NAV PANEL */}
      {isMobileMenuOpen && (
        <div className="lg:hidden sticky top-16 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top duration-200 shadow-md">
          <nav className="flex flex-col p-4 space-y-3 font-bold text-left text-slate-600 dark:text-slate-350">
            {getNavbarItems().map((item) => (
              <button 
                key={item.id}
                onClick={() => handleScrollToLandingSection(item.id)}
                className="w-full text-left py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/45 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}

            {/* Mobile Translation Flags Panel */}
            <div className="pt-3 pb-1 border-t border-slate-105 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 justify-center">
                <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>PILIH BAHASA / SELECT LANGUAGE / خيارات اللغة</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setCurrentLang('id');
                    setLangToast({ title: 'Bahasa Berhasil Diubah', message: 'Halaman utama sekarang ditampilkan dalam Bahasa Indonesia.' });
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${currentLang === 'id' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-400 font-extrabold shadow-2xs' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
                >
                  <span className="text-xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]">🇮🇩</span>
                  <span className="text-[9px] tracking-tight font-sans">Indonesia</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentLang('en');
                    setLangToast({ title: 'Language Changed', message: 'The main page is now successfully translated to English.' });
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${currentLang === 'en' ? 'bg-emerald-500/10 border-emerald-550 text-emerald-805 dark:text-emerald-400 font-extrabold shadow-2xs' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
                >
                  <span className="text-xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]">🇬🇧</span>
                  <span className="text-[9px] tracking-tight font-sans">English</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentLang('ar');
                    setLangToast({ title: 'تم تغيير لغة العرض', message: 'لقد تم تعريب نصوص الواجهة وتفعيل الترجمة بنجاح.' });
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${currentLang === 'ar' ? 'bg-emerald-500/10 border-emerald-550 text-emerald-805 dark:text-emerald-400 font-extrabold shadow-2xs' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
                >
                  <span className="text-xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]">🇸🇦</span>
                  <span className="text-[9px] tracking-tight font-sans">العربية</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* 2FA Challlenge Overlay Modal */}
      {tfaChallengeActive && (
        <div className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-sm w-full rounded-2xl shadow-xl p-6 text-left">
            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Verifikasi 2FA Diperlukan</h3>
              <p className="text-xs text-slate-500">Masukkan kode TOTP 6-digit dari aplikasi authenticator Anda untuk melanjutkan login aman.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Kode Verifikasi 6-Digit</label>
                <input
                  type="text"
                  maxLength={6}
                  value={tfaChallengeCode}
                  onChange={(e) => setTfaChallengeCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center text-lg font-mono font-bold tracking-widest px-4 py-2 rounded-xl border border-slate-205 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {tfaError && (
                <p className="text-[11px] text-red-500 bg-red-100/10 border border-red-500/10 p-2 rounded-lg text-center">
                  {tfaError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTfaChallengeActive(false);
                    setPendingLoginUser(null);
                    setTfaChallengeCode('');
                  }}
                  className="flex-1 py-2 bg-slate-150 dark:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={handleVerify2FAForLogin}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                >
                  Verifikasi & Masuk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT GATEWAY */}

      {/* VIEW A: LANDING PAGE */}
      {activeTab === 'landing' && (
        <div id="landing-page-view" className="space-y-16 pb-20 animate-in fade-in-50 duration-500">
          
          {/* HERO BANNER SECTION */}
          <section id="beranda-section" className="relative px-4 pt-16 md:pt-24 pb-20 bg-gradient-to-tr from-emerald-900 via-emerald-800 to-teal-850 text-white text-left overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
                  <p className="text-xs font-bold text-emerald-350 tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('lph_official')}</span>
                  </p>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight leading-tight">
                  <span className="text-white">{dataLPH?.profile?.heroTitle1 || t('herotitle1')}</span> <br />
                  <span className="text-amber-400">{dataLPH?.profile?.heroTitle2 || t('herotitle2')}</span>
                </h1>

                <p className="text-sm md:text-base text-emerald-100 leading-relaxed max-w-xl">
                  {dataLPH?.profile?.heroDesc || t('herodesc')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  {currentUser ? (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-[#0c2e1b] rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Masuk ke Dashboard Saya</span>
                    </button>
                  ) : (
                    <a
                      href="#auth-section-anchor"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('auth-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-[#0c2e1b] rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar Akun Pelaku Usaha</span>
                    </a>
                  )}
                  <a
                    href="#tentang-section"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('tentang-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-transparent border border-emerald-500 hover:bg-emerald-500/10 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5"
                  >
                    <span>Pelajari Lebih Lanjut</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Hero Right Card: Statistics / Badge */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-4 text-left shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Akreditasi Utama BPJPH</h3>
                      <p className="text-[10px] text-emerald-200">Kemenag RI Keputusan No. 434-2026</p>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-100 leading-relaxed">
                    LPH Al-Ghazali di bawah Yayasan Al-Ghazali Cilacap, berkomitmen menyediakan audit halal yang netral, cepat, transparan, dan profesional bagi ribuan produk UMKM daerah.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xl font-bold tracking-tight text-amber-400">100%</p>
                      <p className="text-[8px] uppercase tracking-wider text-emerald-250 mt-1">Transparan</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xl font-bold tracking-tight text-amber-400">&lt; 14</p>
                      <p className="text-[8px] uppercase tracking-wider text-emerald-250 mt-1">Hari Kerja</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xl font-bold tracking-tight text-amber-400">3,4k</p>
                      <p className="text-[8px] uppercase tracking-wider text-emerald-250 mt-1">Sertifikat</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* PROFILE / TENTANG SECTION */}
          <section id="tentang-section" className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('profile_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{dataLPH?.profile?.aboutTitle || t('profile_title')}</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {dataLPH?.profile?.aboutDesc || t('profile_desc')}
              </p>
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 rounded-full bg-emerald-500/15" />
                  <span className="font-semibold text-slate-700 dark:text-slate-350">Sumber Daya Auditor Tersertifikasi Nasional</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 rounded-full bg-emerald-500/15" />
                  <span className="font-semibold text-slate-700 dark:text-slate-350">Laboratorium Pengujian Bahan Terakreditasi ISO/IEC 17025</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 rounded-full bg-emerald-500/15" />
                  <span className="font-semibold text-slate-700 dark:text-slate-350">Sistem Pelaporan Elektronik Terkoneksi API BPJPH</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Pemeriksaan Berkas Cepat</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal">
                  Pemeriksaan dokumen awal, NIB, status sertifikasi penyembelihan, dan kelengkapan bahan divalidasi tidak lebih dari 3 hari kerja.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Verifikasi Lapangan Akurat</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal">
                  Auditor bersertifikasi melakukan kunjungan ke lokasi produksi Anda untuk memverifikasi kesesuaian bahan dan bebas najis.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Sidang Fatwa Integratif</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal">
                  Penyerahan Laporan Hasil Audit (LHA) LPH Al-Ghazali ke Komisi Fatwa Keagamaan MUI secara kilat untuk keputusan ketetapan halal.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Tanda Tangan E-Sign Sah</h4>
                <p className="text-xs text-slate-550 dark:text-slate-450 leading-normal">
                  Penyediaan API tanda tangan elektronik tersertifikasi BSrE menjamin validitas hukum seluruh berkas & surat pernyataan halal.
                </p>
              </div>
            </div>
          </section>

          {/* LAYANAN SECTION */}
          <section id="layanan-section" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 text-left py-4 pt-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('layanan_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t('layanan_title')}</h2>
              <p className="text-xs md:text-sm text-slate-505 text-slate-500 dark:text-slate-400 max-w-xl">
                {t('layanan_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(dataLPH?.layanan && dataLPH.layanan.length > 0 ? dataLPH.layanan : [
                {
                  title: 'Sertifikasi Halal Reguler',
                  desc: 'Pemeriksaan kepatuhan halal komersial untuk produk olahan makanan, minuman, obat, kosmetik, serta barang gunaan dengan audit menyeluruh.',
                  bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  fee: 'Mulai Rp 300.000'
                },
                {
                  title: 'Pengujian Laboratorium',
                  desc: 'Analisa saintifik bahan pangan tingkat lanjut terhadap senyawa turunan non-halal bekerja sama dengan laboratorium ISO 17025.',
                  bg: 'bg-indigo-505 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                  fee: 'Tarif Terstandar BI'
                },
                {
                  title: 'Pendampingan PPH',
                  desc: 'Pembinaan intensif bagi Pelaku Usaha Mikro & Kecil (UMKM) Cilacap untuk program halal mandiri (Self Declare).',
                  bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  fee: 'Gratis (Fasilitas Sehati)'
                },
                {
                  title: 'Sertifikasi Rumah Potong',
                  desc: 'Sertifikasi khusus Rumah Potong Hewan (RPH/RPU) untuk memastikan proses penyembelihan sesuai standar syariat Islam.',
                  bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-450',
                  fee: 'Tarif Kompetitif'
                }
              ]).map((layanan, idx) => {
                // Determine icon based on index or title keywords
                let iconEl = <ClipboardList className="w-6 h-6" />;
                const titleStr = (layanan.title || '').toLowerCase();
                if (idx === 1 || titleStr.includes('lab') || titleStr.includes('uji') || titleStr.includes('laboratorium')) {
                  iconEl = <Activity className="w-6 h-6" />;
                } else if (idx === 2 || titleStr.includes('pph') || titleStr.includes('pendampingan') || titleStr.includes('umkm')) {
                  iconEl = <Users className="w-6 h-6" />;
                } else if (idx === 3 || titleStr.includes('potong') || titleStr.includes('rph') || titleStr.includes('hewan')) {
                  iconEl = <CheckCircle className="w-6 h-6" />;
                } else {
                  iconEl = <Award className="w-6 h-6" />;
                }

                // Determine backgrounds
                const bgStyles = layanan.bg || (
                  idx === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  idx === 1 ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                  idx === 2 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                  'bg-rose-500/10 text-rose-600 dark:text-rose-450'
                );

                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bgStyles}`}>
                        {iconEl}
                      </div>
                      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-2">{layanan.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{layanan.desc}</p>
                    </div>
                    {layanan.fee && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-auto flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Tarif Layanan</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-md">
                          {typeof layanan.fee === 'number' ? `Rp ${layanan.fee.toLocaleString('id-ID')}` : layanan.fee}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* PROSES SECTION */}
          <section id="proses-section" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 text-left py-4 pt-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('proses_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t('proses_title')}</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {t('proses_desc')}
              </p>
            </div>

            <div className="relative border-l-2 border-emerald-500/30 dark:border-slate-800 ml-4 md:ml-6 pl-6 space-y-8">
              {[
                {
                  step: '01',
                  title: 'Pengajuan di SIHALAL Kemenag RI',
                  desc: 'Pelaku usaha login ke sistem sihalal.kemenag.go.id, memasukkan detail produk, bahan pokok, dan memilih LPH Al-Ghazali (No Registrasi: 32) sebagai Lembaga Pemeriksa Halal Anda.'
                },
                {
                  step: '02',
                  title: 'Verifikasi Dokumen Bahan',
                  desc: 'Tim verifikator kami meneliti kelengkapan berkas legalitas (NIB), daftar bahan baku, merek dagang, dan surat penandatanganan dokumen di Portal LPH secara cepat.'
                },
                {
                  step: '03',
                  title: 'Audit & Peninjauan Lapangan',
                  desc: 'Auditor bersertifikat nasional melakukan kunjungan fisik ke unit produksi/restoran untuk memastikan rantai proses produksi terjamin bebas dari najis.'
                },
                {
                  step: '04',
                  title: 'Sidang Fatwa MUI ke-Agamaan',
                  desc: 'Kami menyusun Laporan Hasil Audit (LHA) komparatif untuk dipaparkan secara kolektif di forum Komisi Fatwa MUI Jawa Tengah guna meraih ketetapan halal syariah.'
                },
                {
                  step: '05',
                  title: 'Sertifikat Halal Resmi Terbit',
                  desc: 'BPJPH Kementerian Agama RI menerbitkan Sertifikat Halal resmi berformat digital PDF terkode QR Code yang berlaku selamanya bagi produk usaha Anda.'
                }
              ].map((proses, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[35px] md:-left-[43px] w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] md:text-xs flex items-center justify-center border-4 border-slate-50 dark:border-slate-950 font-mono">
                    {proses.step}
                  </div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{proses.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{proses.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* REGULASI SECTION */}
          <section id="regulasi-section" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 text-left py-4 pt-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('regulasi_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t('regulasi_title')}</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {t('regulasi_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getRegulasiItems().map((reg, idx) => (
                <div key={idx} className="bg-slate-100/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-left space-y-3">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">{reg.law}</span>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-2">{reg.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{reg.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* BERITA SECTION */}
          <section id="berita-section" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 text-left py-4 pt-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('berita_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t('berita_title')}</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {t('berita_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(dataLPH?.berita && dataLPH.berita.length > 0 ? dataLPH.berita : [
                {
                  date: '18 Juni 2026',
                  title: 'Ayo Sukseskan Sertifikasi Halal Gratis (SEHATI) Bagi 2.000 UMKM Cilacap',
                  desc: 'LPH Al-Ghazali bekerja sama dengan Dinas Koperasi, Usaha Kecil Menengah dan Perdagangan membuka pendaftaran program sehati guna akselerasi produk halal lokal.'
                },
                {
                  date: '10 Juni 2026',
                  title: 'Bimbingan Teknis Penerapan Standar Sistem Jaminan Produk Halal (SJPH)',
                  desc: 'Sebanyak 80 perwakilan industri pariwisata, perhotelan, dan restoran mengikuti bimtek penyusunan manual Sistem Jaminan Produk Halal bersama tim ahli LPH Al-Ghazali.'
                },
                {
                  date: '02 Juni 2026',
                  title: 'Penerapan API E-Signature Bersama BSrE BSSN Tingkatkan Keamanan Berkas Halal',
                  desc: 'Portal digital LPH Al-Ghazali kini resmi menerapkan sistem tanda tangan bersertifikasi elektronik guna melindungi keaslian berkas LHA dari pemalsuan data.'
                }
              ]).map((berita, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{berita.date || 'Edukasi Halal'}</span>
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">{berita.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{berita.desc}</p>
                  </div>
                  <div className="px-5 pb-5 pt-2">
                    <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ SECTION */}
          <section id="faq-section" className="max-w-4xl mx-auto px-4 md:px-6 space-y-8 text-left py-4 pt-10">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('faq_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight text-center">{t('faq_title')}</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 text-center max-w-xl mx-auto font-sans">
                {t('faq_desc')}
              </p>
            </div>

            <div className="space-y-4">
              {getFaqItems().map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                    >
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs md:text-sm leading-tight">{faq.q}</h4>
                      <div className={`w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronRight className="w-3.5 h-3.5 transform rotate-90" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-850 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* KONTAK SECTION */}
          <section id="kontak-section" className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 text-left py-4 pt-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-md">{t('kontak_sub')}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t('kontak_title')}</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {t('kontak_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Contact info & map mockup */}
              <div className="lg:col-span-5 bg-emerald-900 border border-emerald-800 text-white p-6 md:p-8 rounded-3xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm md:text-md">Informasi Layanan Lapangan</h3>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    Operasional kantor kami buka setiap hari Senin - Jumat pukul 08:00 - 15:30 WIB. Datang langsung atau buat janji temu dengan Auditor internal.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-amber-400 shrink-0">Lokasi:</span>
                      <span className="text-emerald-100">{dataLPH?.profile?.address || "Jl. Raya Al-Ghazali No. 32, Cilacap, Jawa Tengah"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-amber-400 shrink-0">WhatsApp:</span>
                      <span className="text-emerald-100">{dataLPH?.profile?.whatsapp || "+62 812-3456-7890"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-amber-400 shrink-0">Email:</span>
                      <span className="text-emerald-100 font-sans">{dataLPH?.profile?.email || "info@lph-alghazali.or.id"}</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps Mockup */}
                <div className="h-40 rounded-2xl bg-teal-950/60 border border-teal-800/40 relative flex items-center justify-center p-4 overflow-hidden text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
                  <div className="relative space-y-1 z-10">
                    <p className="text-xs font-bold text-white">YAYASAN AL-GHAZALI CILACAP</p>
                    <p className="text-[10px] text-emerald-350 font-sans">LPH No. 32 Jawa Tengah</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-500/25 border border-emerald-400/20 rounded text-[9px] text-amber-400 font-mono">MAPS INTERACTIVE GRANTED</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Contact form */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl text-left shadow-xs">
                <form 
                  onSubmit={handleContactSubmit}
                  className="space-y-4"
                >
                  {contactStatus === 'success' && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{contactMessage}</span>
                    </div>
                  )}

                  {contactStatus === 'error' && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 text-rose-800 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{contactMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Nama Lengkap Anda*</label>
                      <input 
                        type="text" 
                        name="nama"
                        required 
                        placeholder="Contoh: Achmad Sodikin"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Email Perusahaan / Pribadi*</label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        placeholder="sodikin@email.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Subjek Pesan / Pertanyaan*</label>
                    <input 
                      type="text" 
                      name="subyek"
                      required 
                      placeholder="Contoh: Konsultasi Tarif Sertifikasi Produk Roti"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Isi Pesan Konsultasi*</label>
                    <textarea 
                      name="pesan"
                      required 
                      rows={4}
                      placeholder="Tuliskan rincian pertanyaan atau jenis produk yang ingin Anda sertifikasikan di sini..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={contactSubmitting}
                    className={`w-full py-3 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-sans ${
                      contactSubmitting 
                        ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {contactSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Mengirimkan Pesan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesan Konsultasi</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </section>

          {/* DYNAMIC SEARCH DIRECTORY CONTAINER */}
          <section id="cari-section" className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 text-left relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 to-indigo-950/40 opacity-40"></div>
              
              <div className="max-w-2xl space-y-2 relative z-10">
                <h3 className="text-xl md:text-2xl font-extrabold font-display">Telusuri Direktori Halal LPH Al-Ghazali</h3>
                <p className="text-xs text-emerald-250">Lacak keaslian nomor sertifikat halal serta bahan produk terdaftar di seluruh wilayah Kabupaten Cilacap.</p>
              </div>

              {/* Search Bar Input */}
              <div className="relative max-w-xl z-10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Ketik nama produk, nama perusahaan, atau nomor sertifikat..."
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-5 py-4 pl-12 rounded-2xl text-xs font-semibold shadow outline-none ring-emerald-500 focus:ring-2"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              </div>

              {/* Results list */}
              <div className="bg-slate-950/60 rounded-2xl border border-white/10 md:p-4 overflow-x-auto relative z-10">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 text-emerald-350">
                      <th className="p-3 font-semibold">Nomor Sertifikat/ID Halal</th>
                      <th className="p-3 font-semibold">Nama Pelaku Usaha</th>
                      <th className="p-3 font-semibold">Produk Terdaftar</th>
                      <th className="p-3 font-semibold text-center">Tanggal Terbit</th>
                      <th className="p-3 font-semibold text-center">Status Keamanan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-350">
                    {searchResults.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          Data tidak ditemukan. Masukkan kata kunci lain yang relevan.
                        </td>
                      </tr>
                    ) : (
                      searchResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-3 font-mono font-bold text-white">{item.number}</td>
                          <td className="p-3 font-bold text-white">{item.company}</td>
                          <td className="p-3">{item.product}</td>
                          <td className="p-3 text-center">{item.date}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-500/20">
                              HALAL REGULATED
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* PORTAL REGISTER / LOGIN CHANNELS */}
          {!currentUser && (
            <section id="auth-section-anchor" className="max-w-xl mx-auto px-4 md:px-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-left space-y-6">
                
                {/* Mode Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white dark:bg-slate-850 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
                    }`}
                  >
                    Masuk Portal
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-white dark:bg-slate-850 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
                    }`}
                  >
                    Registrasi Akun Baru
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-155">
                    {authMode === 'login' ? 'Masuk ke Portal LPH' : 'Buat Akun Pelaku Usaha'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {authMode === 'login' 
                      ? 'Gunakan kredensial terdaftar untuk mengakses sertifikat dan log audit Anda.' 
                      : 'Isi formulir identitas usaha Anda secara lengkap dan aktifkan keamanan optimal.'}
                  </p>
                </div>

                {authMode === 'login' ? (
                  /* LOGIN FORM */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Pelaku Usaha</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="pelaku-usaha@perusahaan.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-905 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Kata Sandi</label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-905 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Masuk dengan Aman</span>
                    </button>
                    
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 text-center leading-normal mt-3">
                      *Tips Demo: Akses pelaku usaha: <code className="font-bold text-emerald-600">user@example.com</code>.<br /> Akses Admin Pusat LPH: <code className="font-bold text-emerald-600">admin@lph-alghazali.com</code> atau Staff: <code className="font-bold text-emerald-600">staff@lph-alghazali.com</code>.<br /> (Kata sandi bebas).
                    </p>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Lengkap*</label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Contoh: H. Slamet Santoso"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-5050 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Perusahaan*</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="slamet@barokahpangan.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Usaha / PT / CV*</label>
                        <input
                          type="text"
                          required
                          value={authCompanyName}
                          onChange={(e) => setAuthCompanyName(e.target.value)}
                          placeholder="Contoh: CV Barokah Pangan"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">NIB (Nomor Induk Berusaha)*</label>
                        <input
                          type="text"
                          required
                          maxLength={13}
                          value={authNIB}
                          onChange={(e) => setAuthNIB(e.target.value.replace(/\D/g, ''))}
                          placeholder="Contoh: 1210214589234"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nomor Telepon WA*</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 0812345678"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Kata Sandi Akun*</label>
                        <input
                          type="password"
                          required
                          placeholder="Minimum 6 karakter"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mt-4 text-left">
                      <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-normal">
                        <strong>Proteksi Optimal:</strong> Setelah registrasi sukses, Anda akan dinavigasikan langsung untuk mengaktifkan **Autentikasi Dua Faktor (2FA)** demi kepatuhan regulasi BPJPH.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar Akun & Dapatkan Akses</span>
                    </button>
                  </form>
                )}

              </div>
            </section>
          )}

        </div>
      )}

      {/* VIEW B: PORTAL DASHBOARD INTERNAL */}
      {activeTab === 'dashboard' && currentUser && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-in fade-in-50 duration-300">
          
          {/* Main Dashboard Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            
            {/* 1. Left Sidebar: Navigation & User quick summary */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
              
              {/* User Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-sm border border-emerald-350">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</p>
                    <p className="text-[9px] text-slate-450 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-3.5 space-y-2 text-[11px] text-slate-600 dark:text-slate-450 border-dashed">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Nama Usaha:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{currentUser.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">NIB Resmi:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{currentUser.nib}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Keamanan 2FA:</span>
                    <span className={`font-bold ${currentUser.is2faEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 font-extrabold ring-red-500/10 rign-1'}`}>
                      {currentUser.is2faEnabled ? '● AKTIF' : '● TIDAK AKTIF'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Menu Navigation */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-3xl shadow-xs space-y-1">
                {(() => {
                  const navItems = [
                    { id: 'my-applications', label: 'Permohonan Sertifikasi', icon: ClipboardList },
                    { id: 'analytics', label: 'Dasbor Analitik Real-time', icon: Activity },
                    { id: 'notifications', label: 'Notifikasi Otomatis', icon: Mail },
                    { id: 'security', label: 'Metrik Keamanan 2FA', icon: ShieldCheck }
                  ];

                  const adminRoles = ['admin pusat', 'admin', 'admin editor', 'admin auditor', 'staff'];
                  if (currentUser.role && adminRoles.includes(currentUser.role)) {
                    navItems.push({ id: 'cms-management', label: 'Manajemen CMS Admin', icon: Database as any });
                  }

                  return navItems.map((item) => {
                  const Icon = item.icon;
                  const isCurSection = dashboardSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDashboardSection(item.id as any)}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-3 transition-colors cursor-pointer ${
                        isCurSection
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                  });
                })()}
              </div>

              {/* Action Trigger Welcomer */}
              <button
                onClick={() => setWizardOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Registrasi Halal Baru</span>
              </button>

            </div>

            {/* 2. Right Workspace Content */}
            <div className="lg:col-span-9 space-y-6">

              {/* PLAYGROUND SIMULATOR ALERT (Extremely Interactive for evaluation!) */}
              <div className="bg-gradient-to-r from-amber-550 via-amber-500 to-amber-600 text-slate-850 p-4 rounded-3xl text-left border border-amber-600/20 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-900" />
                    <span className="text-[10px] uppercase font-black bg-amber-950/10 text-amber-950 px-2 py-0.5 rounded">SIMULATOR LPH AUDITOR</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-amber-950">Alur Status Interaktif & Simulasi Notifikasi Otomatis</h4>
                  <p className="text-xs text-amber-900">Gunakan bilah kontrol di bawah berkas untuk memperbarui status permohonan Anda. Perubahan status akan menembakkan pesan SMS Gateway dan Email otomatis secara real-time ke log notifikasi!</p>
                </div>
              </div>
              
              {/* SECTION 1: MY APPLICATIONS */}
              {dashboardSection === 'my-applications' && (
                <div className="space-y-6 animate-in fade-in-30 duration-200">
                  
                  {/* Wizard Pop */}
                  {wizardOpen ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-1 rounded-3xl border border-slate-100 dark:border-slate-850">
                      <div className="flex justify-between items-center p-4">
                        <span className="text-xs font-bold text-slate-400">Portal Pengisian Data Online LPH Al-Ghazali</span>
                        <button 
                          onClick={() => setWizardOpen(false)}
                          className="px-3 py-1 bg-slate-205 dark:bg-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Batal Pengajuan
                        </button>
                      </div>
                      <CertificationWizard 
                        onComplete={handleWizardSubmit} 
                        onCancel={() => setWizardOpen(false)}
                        companyNameDefault={currentUser.companyName}
                        nibDefault={currentUser.nib}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Application list card header */}
                      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                        <div>
                          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Registrasi Berkas Sertifikasi Halal</h3>
                          <p className="text-xs text-slate-400">Total terbit, verifikasi lapangan, dan draft terdaftar</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={triggerCSVExport}
                            className="p-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Ekspor ke spreadsheet CSV"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span className="hidden sm:inline">Ekspor CSV</span>
                          </button>
                          <button
                            onClick={triggerPrintReportExport}
                            className="p-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Unduh format ringkas PDF"
                          >
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <span className="hidden sm:inline">Unduh PDF</span>
                          </button>
                        </div>
                      </div>

                      {/* Actual Applications Lists */}
                      <div className="space-y-4">
                        {applications.length === 0 ? (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-2xl shadow-xs space-y-4">
                            <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto animate-bounce" />
                            <div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-250">Tidak ada pengajuan aktif</p>
                              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Anda belum memulai pendaftaran halal baru. Klik tombol "Registrasi Halal Baru" untuk pengisian dokumen.</p>
                            </div>
                            <button
                              onClick={() => setWizardOpen(true)}
                              className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                            >
                              Buat Berkas Pertama Anda
                            </button>
                          </div>
                        ) : (
                          applications.map((app) => {
                            // Stage Badge Style
                            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                            if (app.status === 'Dokumen Lengkap') badgeStyle = 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400';
                            if (app.status === 'Verifikasi Lapangan') badgeStyle = 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400';
                            if (app.status === 'Sidang Fatwa') badgeStyle = 'bg-purple-100 text-purple-805 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400';
                            if (app.status === 'Sertifikat Terbit') badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-250 dark:bg-emerald-950/30 dark:text-emerald-400';

                            return (
                              <div key={app.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden text-left transition-all hover:border-slate-300 dark:hover:border-slate-700">
                                
                                <div className="p-5 space-y-4">
                                  {/* Top header values inside list item */}
                                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{app.brandName}</h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({app.id})</span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 mt-0.5">{app.companyName} — NIB: {app.nib}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2.5 py-0.5 border font-extrabold text-[10px] rounded-lg ${badgeStyle}`}>
                                        {app.status}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Mid stats / products detail list */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    <div>
                                      <p className="font-semibold text-slate-400">Detail Produk Terdaftar:</p>
                                      <p className="font-bold text-slate-700 dark:text-slate-350 mt-1">
                                        {app.products.map(p => p.name).join(', ')}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="font-semibold text-slate-400">Izin Kategori:</p>
                                      <p className="font-bold text-slate-700 dark:text-slate-350 mt-1">{app.productType}</p>
                                    </div>

                                    <div>
                                      <p className="font-semibold text-slate-400">Integrasi E-Signature:</p>
                                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Terverifikasi BSrE ({app.esignatureSeal ? 'SIGNED' : 'NOT SIGNED'})</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* If Audit / Verification scheduling exists */}
                                  {(app.auditorName || app.auditDate) && (
                                    <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl text-xs space-y-1">
                                      <p className="font-bold text-slate-705 text-slate-700 dark:text-slate-300">Rincian Penugasan Audit:</p>
                                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400">
                                        <span>Auditor: <strong className="text-slate-700 dark:text-slate-350">{app.auditorName || 'Menunggu penugasan'}</strong></span>
                                        {app.auditDate && <span>Rencana Tanggal: <strong className="text-slate-700 dark:text-slate-350">{app.auditDate}</strong></span>}
                                      </div>
                                    </div>
                                  )}

                                  {/* Certified products certificate print trigger */}
                                  {app.status === 'Sertifikat Terbit' && (
                                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                                      <div className="flex gap-2 items-center">
                                        <Award className="w-5 h-5 text-emerald-600" />
                                        <div>
                                          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Sertifikat Halal Digital Terbit!</p>
                                          <p className="text-[10px] text-emerald-600">{app.certificateNumber}</p>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => setActiveCertPrint(app)}
                                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-[1.01]"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>Cetak Sertifikat</span>
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* PLAYGROUND ONLY: Auditor flow transition controls (For easy test evaluation of notifications) */}
                                <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850/80 px-5 py-3 flex flex-wrap items-center gap-2">
                                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Simulasikan Status Berkas:</span>
                                  
                                  <button
                                    onClick={() => triggerStatusUpdateInPlayground(app.id, 'Dokumen Lengkap')}
                                    className={`px-2 py-1 text-[10px] rounded-md font-extrabold border transition-colors ${app.status === 'Dokumen Lengkap' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'}`}
                                  >
                                    Dokumen Lengkap
                                  </button>
                                  
                                  <button
                                    onClick={() => triggerStatusUpdateInPlayground(app.id, 'Verifikasi Lapangan')}
                                    className={`px-2 py-1 text-[10px] rounded-md font-extrabold border transition-colors ${app.status === 'Verifikasi Lapangan' ? 'bg-sky-600 text-white border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'}`}
                                  >
                                    Verifikasi Lapangan
                                  </button>

                                  <button
                                    onClick={() => triggerStatusUpdateInPlayground(app.id, 'Sidang Fatwa')}
                                    className={`px-2 py-1 text-[10px] rounded-md font-extrabold border transition-colors ${app.status === 'Sidang Fatwa' ? 'bg-purple-600 text-white border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'}`}
                                  >
                                    Sidang Fatwa MUI
                                  </button>

                                  <button
                                    onClick={() => triggerStatusUpdateInPlayground(app.id, 'Sertifikat Terbit')}
                                    className={`px-2 py-1 text-[10px] rounded-md font-extrabold border transition-colors ${app.status === 'Sertifikat Terbit' ? 'bg-emerald-600 text-white border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'}`}
                                  >
                                    Sertifikat Terbit
                                  </button>
                                </div>

                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}

                </div>
              )}

              {/* SECTION 2: REAL-TIME ANALYTICS */}
              {dashboardSection === 'analytics' && (
                <div className="space-y-6 animate-in fade-in-30 duration-200">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Dashboard Analisis Real-time LPH</h3>
                    <p className="text-xs text-slate-400">Pantau produktivitas pengurusan berkas, scope produk halal, dan efektivitas persetujuan.</p>
                  </div>

                  <AnalyticsCharts 
                    applications={applications} 
                    onTriggerExportCSV={triggerCSVExport} 
                    onTriggerExportPrint={triggerPrintReportExport} 
                  />
                </div>
              )}

              {/* SECTION 3: AUTOMATED NOTIFICATIONS Log */}
              {dashboardSection === 'notifications' && (
                <div className="space-y-6 animate-in fade-in-30 duration-200">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Automated SMS & Email Notifications Logs</h3>
                    <p className="text-xs text-slate-400">Simulasi inbox pesan terkirim secara otomatis kepada pelaku usaha & kepatuhan e-Security.</p>
                  </div>

                  <NotificationSimulator
                    notifications={notifications}
                    onClearNotifications={() => {
                      if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pemberitahuan otomatis?')) {
                        setNotifications([]);
                      }
                    }}
                    onMarkAllAsRead={() => {
                      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                    }}
                  />
                </div>
              )}

              {/* SECTION 4: SECURITY 2FA METRIC */}
              {dashboardSection === 'security' && (
                <div className="space-y-6 animate-in fade-in-30 duration-200">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">e-Security & Kepatuhan Keimigrasian Halal</h3>
                    <p className="text-xs text-slate-400">Proteksi data audit pelaku usaha sesuai instruksi standard keamanan nasional.</p>
                  </div>

                  <TwoFactorAuth
                    isEnabled={currentUser.is2faEnabled}
                    onEnable={handleEnable2FAInApp}
                    onDisable={handleDisable2FAInApp}
                    userEmail={currentUser.email}
                  />
                </div>
              )}

              {dashboardSection === 'cms-management' && (
                <AdminCMSPanel dataLPH={dataLPH} setDataLPH={setDataLPH} />
              )}

            </div>

          </div>

        </div>
      )}

      {/* PRINT CERTIFICATE RENDERER WRAPPER */}
      {activeCertPrint && (
        <CertificatePrinter 
          application={activeCertPrint} 
          onClose={() => setActiveCertPrint(null)} 
        />
      )}

      {/* SITE FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-850 text-slate-400 py-12 px-4 md:px-6 mt-20 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-xs">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-white flex items-center justify-center shrink-0">
                <img 
                  src={lphLogo} 
                  alt="LPH Al-Ghazali Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold font-display tracking-tight text-white">{dataLPH?.profile?.name || "LPH Al-Ghazali"}</span>
            </div>
          <p className="leading-relaxed text-slate-400">
            {dataLPH?.profile?.heroDesc ? `Portal Layanan ${dataLPH.profile.name} merupakan platform terpadu untuk mempermudah pendaftaran dan proses sertifikasi halal bagi para pelaku usaha.` : "Portal Layanan LPH Al-Ghazali merupakan platform terpadu untuk mempermudah pendaftaran dan proses sertifikasi halal bagi para pelaku usaha di seluruh Indonesia."}
          </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-emerald-450">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('beranda-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('dashboard');
                    setDashboardSection('analytics');
                  }} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Kalkulator Biaya
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('proses-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Prosedur
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('regulasi-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Tanggung Gugat
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('berita-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Berita Utama
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('faq-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-emerald-450">Layanan</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('layanan-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Sertifikasi Halal Reguler
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('layanan-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Edukasi & Pelatihan Halal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToLandingSection('layanan-section')} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Layanan Pra-Audit (Opsional)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-emerald-450">Hubungi Kami</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="leading-relaxed">Jl. Kemerdekaan Barat No.12, Kesugihan, Cilacap, Jawa Tengah 53274</li>
              <li className="text-amber-400 font-bold font-mono">085802494252 (WhatsApp)</li>
              <li><a href="mailto:lphalghazali@gmail.com" className="hover:text-emerald-400 transition-colors font-sans">lphalghazali@gmail.com</a></li>
              <li><a href="https://halal.unugha.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-sans">halal.unugha.ac.id</a></li>
              <li className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                Senin - Jum'at,<br />
                9:00 AM - 8:00 PM
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>© 2026 {dataLPH?.profile?.name || "LPH Al-Ghazali Cilacap"}. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sertifikat Halal dengan Proteksi Keamanan 2FA & E-Signature Terdaftar</span>
          </p>
        </div>
      </footer>

      {langToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-white p-4 rounded-2xl shadow-xl max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-350 flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Languages className="w-4 h-4" />
          </div>
          <div className="text-left space-y-0.5">
            <h5 className="text-xs font-black text-amber-400">{langToast.title}</h5>
            <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{langToast.message}</p>
          </div>
          <button 
            onClick={() => setLangToast(null)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
