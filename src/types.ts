export type ProductType = 'Makanan' | 'Minuman' | 'Kosmetik' | 'Obat' | 'Barang Gunaan' | 'Jasa';

export interface ProductDetail {
  id: string;
  name: string;
  ingredients: string;
}

export type ApplicationStatus = 'Draft' | 'Dokumen Lengkap' | 'Verifikasi Lapangan' | 'Sidang Fatwa' | 'Sertifikat Terbit';

export interface HalalApplication {
  id: string;
  userId: string;
  companyName: string;
  nib: string; // Nomor Induk Berusaha
  brandName: string;
  productType: ProductType;
  products: ProductDetail[];
  status: ApplicationStatus;
  submissionDate: string;
  lastUpdated: string;
  esignatureStatus: 'Pending' | 'Signed';
  esignatureDate?: string;
  esignatureSeal?: string; // Digital signing certificate SHA hash
  auditorName?: string;
  auditDate?: string;
  certificateNumber?: string;
  halalID?: string; // ID32xxxxxxxxxx
  validUntil?: string;
}

export interface UserAccount {
  email: string;
  name: string;
  companyName: string;
  nib: string;
  phone: string;
  is2faEnabled: boolean;
  tfaSecret?: string;
  createdAt: string;
  role?: 'admin pusat' | 'admin' | 'admin editor' | 'admin auditor' | 'staff' | 'pelaku usaha';
}

export interface SystemNotification {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface AnalyticsData {
  statusDistribution: { name: string; value: number; color: string }[];
  monthlySubmissions: { month: string; total: number; approved: number }[];
  categoryDistribution: { name: string; count: number }[];
  auditStats: {
    totalApplications: number;
    ongoingAudits: number;
    certifiedProducts: number;
    avgProcessingDays: number;
  };
}
