import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, BookOpen, Clock, FileText, ClipboardList, 
  CheckCircle2, AlertCircle, Bell, ChevronLeft, ChevronRight, 
  LayoutDashboard, Search, X, Building2, User, FileCheck, CheckCircle, XCircle, Send, Award, Download, ExternalLink, Lock
} from 'lucide-react';
import amikomLogo from '../../../assets/amikom.png';

import unikaLogo from '../../../assets/unika-logo.svg';

const UnikaLogo = ({ size = 26 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" style={{ width: size, height: size, objectFit: 'contain' }}>
    <defs>
      <linearGradient id="unikaGradMainDos" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="50%" stopColor="#7e22ce" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>
      <linearGradient id="unikaGradAccentDos" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="60%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    <g>
      <polygon points="250,55 425,145 250,235 75,145" fill="url(#unikaGradMainDos)" />
      <polygon points="250,85 390,145 250,205 110,145" fill="url(#unikaGradAccentDos)" opacity="0.35" />
      <path d="M 405,150 C 418,190 415,220 412,235" stroke="url(#unikaGradMainDos)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="412" cy="242" r="9" fill="url(#unikaGradMainDos)" />
      <polygon points="405,250 419,250 422,305 402,305" fill="url(#unikaGradMainDos)" />
      <path d="M 135,210 L 192,238 L 192,315 C 192,385 308,385 308,315 L 308,238 L 365,210 L 365,315 C 365,435 135,435 135,315 Z" fill="url(#unikaGradMainDos)" />
      <path d="M 135,210 C 135,345 235,430 275,415 C 210,415 192,345 192,238 Z" fill="url(#unikaGradAccentDos)" />
    </g>
  </svg>
);

const DosenDashboard = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('dashboard'); // 'dashboard' | 'verifikasi' | 'penilaian'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPopover, setShowSearchPopover] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data bimbingan mahasiswa dengan rincian logbook & usulan SKS
  const [studentsData, setStudentsData] = useState([
    { 
      id: 1, 
      nim: '22.11.4321', 
      name: 'Budi Santoso', 
      company: 'Google Indonesia', 
      program: 'Cloud Engineering', 
      logbookStatus: 'Perlu Review', 
      pendingConversations: 2,
      email: 'budi.santoso@students.amikom.ac.id',
      gpa: '3.85',
      sks: 110,
      mentorName: 'Ir. Handoko Prasetyo (Lead Cloud Architect)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Mengembangkan infrastruktur Microservices menggunakan Kubernetes dan Docker. Melakukan konfigurasi CI/CD Pipeline dengan GitHub Actions dan Terraform.',
        hours: '40 Jam',
        submittedAt: '21 Juli 2026, 17:45 WIB'
      },
      usulanKuliah: [
        { code: 'IF204', name: 'Komputasi Awan (Cloud Computing)', sks: 4, status: 'Menunggu Verifikasi Dosen' },
        { code: 'IF302', name: 'Keamanan Jaringan & Sistem', sks: 3, status: 'Menunggu Verifikasi Dosen' }
      ]
    },
    { 
      id: 2, 
      nim: '22.11.4300', 
      name: 'Dewi Lestari', 
      company: 'PT. Telekomunikasi Indonesia', 
      program: 'Network Engineer', 
      logbookStatus: 'Disetujui', 
      pendingConversations: 0,
      email: 'dewi.lestari@students.amikom.ac.id',
      gpa: '3.72',
      sks: 108,
      mentorName: 'Siti Rahmawati, S.T. (Senior Network Lead)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Monitoring lalu lintas jaringan serat optik regional 3. Mengatur routing BGP dan maintenance switch core Telkom.',
        hours: '40 Jam',
        submittedAt: '20 Juli 2026, 14:10 WIB'
      },
      usulanKuliah: [
        { code: 'IF208', name: 'Jaringan Komputer Lanjut', sks: 4, status: 'Sudah Diverifikasi' }
      ]
    },
    { 
      id: 3, 
      nim: '22.11.4288', 
      name: 'Rian Hidayat', 
      company: 'Tokopedia', 
      program: 'Data Analyst', 
      logbookStatus: 'Perlu Review', 
      pendingConversations: 1,
      email: 'rian.hidayat@students.amikom.ac.id',
      gpa: '3.68',
      sks: 104,
      mentorName: 'Bagus Setiawan (Data Science Lead Tokopedia)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Pembuatan dashboard visualisasi churn rate pengguna menggunakan Tableau dan BigQuery SQL queries.',
        hours: '38 Jam',
        submittedAt: '21 Juli 2026, 20:15 WIB'
      },
      usulanKuliah: [
        { code: 'IF310', name: 'Sistem Basis Data Lanjut', sks: 3, status: 'Menunggu Verifikasi Dosen' }
      ]
    },
    { 
      id: 4, 
      nim: '22.11.4215', 
      name: 'Siti Aminah', 
      company: 'Traveloka', 
      program: 'Software Quality Assurance', 
      logbookStatus: 'Disetujui', 
      pendingConversations: 0,
      email: 'siti.aminah@students.amikom.ac.id',
      gpa: '3.90',
      sks: 112,
      mentorName: 'Anita Wijaya (QA Manager Traveloka)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Automated E2E Testing pada alur pemesanan tiket pesawat menggunakan Cypress dan Appium JavaScript framework.',
        hours: '40 Jam',
        submittedAt: '19 Juli 2026, 16:30 WIB'
      },
      usulanKuliah: [
        { code: 'IF205', name: 'Pengujian & Kualitas Perangkat Lunak', sks: 3, status: 'Sudah Diverifikasi' }
      ]
    },
    { 
      id: 5, 
      nim: '22.11.4190', 
      name: 'Fajar Nugraha', 
      company: 'Gojek', 
      program: 'Product Management', 
      logbookStatus: 'Belum Kumpul', 
      pendingConversations: 3,
      email: 'fajar.nugraha@students.amikom.ac.id',
      gpa: '3.55',
      sks: 100,
      mentorName: 'Dimas Arisandi (Group Product Manager Gojek)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Belum ada data logbook disubmit untuk minggu ini.',
        hours: '0 Jam',
        submittedAt: '-'
      },
      usulanKuliah: [
        { code: 'IF312', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, status: 'Menunggu Verifikasi Dosen' },
        { code: 'IF314', name: 'Interaksi Manusia & Komputer', sks: 3, status: 'Menunggu Verifikasi Dosen' },
        { code: 'IF318', name: 'Kewirausahaan Teknologi', sks: 2, status: 'Menunggu Verifikasi Dosen' }
      ]
    },
    {
      id: 6,
      nim: '22.11.4177',
      name: 'Nabila Putri',
      company: 'Shopee Indonesia',
      program: 'UI/UX Design',
      logbookStatus: 'Disetujui',
      pendingConversations: 0,
      email: 'nabila.putri@students.amikom.ac.id',
      gpa: '3.88',
      sks: 114,
      mentorName: 'Kevin Wijaya (Head of Product Design Shopee)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Redesign alur checkout aplikasi mobile Shopee dan pengujian usabilitas dengan 15 responden.',
        hours: '40 Jam',
        submittedAt: '20 Juli 2026, 11:20 WIB'
      },
      usulanKuliah: [
        { code: 'IF314', name: 'Interaksi Manusia & Komputer', sks: 3, status: 'Sudah Diverifikasi' }
      ]
    },
    {
      id: 7,
      nim: '22.11.4150',
      name: 'Dimas Saputra',
      company: 'Bukalapak',
      program: 'Backend Engineering',
      logbookStatus: 'Perlu Review',
      pendingConversations: 2,
      email: 'dimas.saputra@students.amikom.ac.id',
      gpa: '3.62',
      sks: 102,
      mentorName: 'Rudi Hartono (Senior Go Engineer Bukalapak)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Refactoring RESTful API layanan pembayaran menggunakan Golang dan Redis caching layer.',
        hours: '40 Jam',
        submittedAt: '21 Juli 2026, 19:00 WIB'
      },
      usulanKuliah: [
        { code: 'IF202', name: 'Pemrograman Web Lanjut', sks: 4, status: 'Menunggu Verifikasi Dosen' }
      ]
    },
    {
      id: 8,
      nim: '22.11.4132',
      name: 'Reza Rahadian',
      company: 'Blibli.com',
      program: 'DevOps & Cyber Security',
      logbookStatus: 'Disetujui',
      pendingConversations: 0,
      email: 'reza.rahadian@students.amikom.ac.id',
      gpa: '3.79',
      sks: 109,
      mentorName: 'Agus Pratama (Security Operations Lead)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Vulnerability assessment dan penetration testing pada endpoint API portal e-commerce.',
        hours: '38 Jam',
        submittedAt: '20 Juli 2026, 15:40 WIB'
      },
      usulanKuliah: [
        { code: 'IF302', name: 'Keamanan Jaringan & Sistem', sks: 3, status: 'Sudah Diverifikasi' }
      ]
    },
    {
      id: 9,
      nim: '22.11.4105',
      name: 'Ayu Lestari',
      company: 'Bank Mandiri',
      program: 'Data Engineering',
      logbookStatus: 'Belum Kumpul',
      pendingConversations: 1,
      email: 'ayu.lestari@students.amikom.ac.id',
      gpa: '3.70',
      sks: 106,
      mentorName: 'Hendra Gunawan (Head of Data Infrastructure)',
      logbookDetail: {
        week: 'Minggu ke-5 (15 - 21 Juli 2026)',
        activity: 'Penyusunan ETL pipeline data transaksi nasabah menggunakan Apache Airflow.',
        hours: '0 Jam',
        submittedAt: '-'
      },
      usulanKuliah: [
        { code: 'IF310', name: 'Sistem Basis Data Lanjut', sks: 3, status: 'Menunggu Verifikasi Dosen' }
      ]
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDocStudent, setSelectedDocStudent] = useState(null);
  const [docReviewState, setDocReviewState] = useState({}); // { [docIdx]: 'valid' | 'invalid' }
  const [docRejectionReasons, setDocRejectionReasons] = useState({}); // { [docIdx]: string }
  const [activeRejectPopoverIdx, setActiveRejectPopoverIdx] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({}); // { [docIdx]: true }
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('logbook'); // 'logbook' | 'usulan' | 'mitra'
  const [toastMessage, setToastMessage] = useState('');

  // 8 Dokumen Persyaratan Pengajuan Magang MSIB
  const requiredDocumentList = [
    { title: 'Proposal Magang MSIB', description: 'Proposal rencana program & aktivitas magang' },
    { title: 'Transkrip Nilai / IPK Terbaru', description: 'Capaian SKS & IPK minimal 3.00' },
    { title: 'Surat Rekomendasi Kaprodi / Fakultas', description: 'Surat resmi persetujuan perguruan tinggi' },
    { title: 'Surat Pertanggungjawaban Mutlak (SPTJM)', description: 'Pernyataan keabsahan dokumen ber-materai' },
    { title: 'Curriculum Vitae (CV) ATS Format', description: 'Daftar riwayat hidup & portofolio terkini' },
    { title: 'Sertifikat Prestasi / Pelatihan Khusus', description: 'Pendukung keahlian kompetensi mahasiswa' },
    { title: 'Kartu Tanda Mahasiswa (KTM) / KTP', description: 'Identitas resmi mahasiswa aktif' },
    { title: 'Surat Izin Orang Tua / Wali', description: 'Surat persetujuan orang tua/wali mahasiswa' }
  ];

  // Data History & Verifikasi Berkas Pengajuan Magang
  const [proposalsReviewData, setProposalsReviewData] = useState([
    { id: 1, name: 'Budi Santoso', nim: '22.11.4321', company: 'Google Indonesia', files: ['Proposal_Cloud.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf'], collected: 3, total: 8, hasilBerkas: 'Belum Lengkap' },
    { id: 2, name: 'Dewi Lestari', nim: '22.11.4300', company: 'PT. Telekomunikasi Indonesia', files: ['Proposal_Telkom.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf', 'SPTJM.pdf', 'CV_ATS.pdf', 'Sertifikat.pdf', 'KTP.pdf', 'Surat_Izin.pdf'], collected: 8, total: 8, hasilBerkas: 'ACC Berkas' },
    { id: 3, name: 'Rian Hidayat', nim: '22.11.4288', company: 'Tokopedia', files: ['Proposal_DataAnalyst.pdf', 'Surat_Rekomendasi.pdf'], collected: 2, total: 8, hasilBerkas: 'Belum Lengkap' },
    { id: 4, name: 'Siti Aminah', nim: '22.11.4215', company: 'Traveloka', files: ['Proposal_QA.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf', 'SPTJM.pdf', 'CV_ATS.pdf'], collected: 5, total: 8, hasilBerkas: 'Belum Lengkap' },
    { id: 5, name: 'Fajar Nugraha', nim: '22.11.4190', company: 'Gojek', files: ['Proposal_ProductMgmt.pdf', 'Transkrip_IPK.pdf', 'Surat_Rekomendasi.pdf', 'SPTJM.pdf'], collected: 4, total: 8, hasilBerkas: 'Belum Lengkap' }
  ]);

  // Data Penilaian Proposal & Rilis Nilai Akhir (Website Informatika Flowchart)
  const [finalGradesData, setFinalGradesData] = useState([
    { id: 1, name: 'Budi Santoso', nim: '22.11.4321', company: 'Google Indonesia', proposalFile: 'Proposal_Cloud_Architecture_Budi.pdf', reportFile: 'Laporan_Akhir_Magang_Google_Budi.pdf', proposalScore: 92, partnerScore: 95, finalGrade: 'A (4.00)', status: 'Draft' },
    { id: 2, name: 'Dewi Lestari', nim: '22.11.4300', company: 'PT. Telekomunikasi Indonesia', proposalFile: 'Proposal_Telkom_Network_Dewi.pdf', reportFile: 'Laporan_Akhir_Magang_Telkom_Dewi.pdf', proposalScore: 88, partnerScore: 90, finalGrade: 'A- (3.75)', status: 'Sudah Dirilis ke Website' },
    { id: 3, name: 'Rian Hidayat', nim: '22.11.4288', company: 'Tokopedia', proposalFile: 'Proposal_Data_Analyst_Tokopedia_Rian.pdf', reportFile: 'Laporan_Akhir_Tokopedia_Rian.pdf', proposalScore: 85, partnerScore: 88, finalGrade: 'B+ (3.50)', status: 'Draft' },
    { id: 4, name: 'Siti Aminah', nim: '22.11.4215', company: 'Traveloka', proposalFile: 'Proposal_QA_Automation_Traveloka_Siti.pdf', reportFile: 'Laporan_Akhir_Traveloka_Siti.pdf', proposalScore: 95, partnerScore: 96, finalGrade: 'A (4.00)', status: 'Sudah Dirilis ke Website' },
    { id: 5, name: 'Fajar Nugraha', nim: '22.11.4190', company: 'Gojek', proposalFile: 'Proposal_Product_Mgmt_Gojek_Fajar.pdf', reportFile: 'Laporan_Akhir_Gojek_Fajar.pdf', proposalScore: 82, partnerScore: 84, finalGrade: 'B (3.00)', status: 'Draft' }
  ]);

  const handleAccProposal = (id) => {
    const target = proposalsReviewData.find(p => p.id === id);
    setProposalsReviewData(prev => prev.map(p => p.id === id ? { ...p, collected: 8, hasilBerkas: 'ACC Berkas' } : p));
    if (target) {
      showToast(`Dokumen pengajuan magang ${target.name} (${target.company}) diverifikasi lengkap (8/8) & di-ACC!`);
    }
  };

  const handleRejectProposal = (id, reason = 'Berkas belum lengkap / perlu revisi') => {
    const target = proposalsReviewData.find(p => p.id === id);
    setProposalsReviewData(prev => prev.map(p => p.id === id ? { ...p, hasilBerkas: 'Dikembalikan' } : p));
    if (target) {
      showToast(`Berkas pengajuan magang ${target.name} dikembalikan dengan catatan: "${reason}"`);
    }
  };

  const handleReleaseGrade = (id) => {
    const target = finalGradesData.find(g => g.id === id);
    setFinalGradesData(prev => prev.map(g => g.id === id ? { ...g, status: 'Sudah Dirilis ke Website' } : g));
    if (target) {
      showToast(`Nilai Akhir Konversi SKS (${target.finalGrade}) untuk ${target.name} berhasil dirilis ke Website Informatika!`);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filter search results for Header Search Popover Dropdown
  const searchResultsStudents = searchQuery.trim() ? studentsData.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.company.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const searchResultsProposals = searchQuery.trim() ? proposalsReviewData.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const searchResultsGrades = searchQuery.trim() ? finalGradesData.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.company.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const totalSearchResults = searchResultsStudents.length + searchResultsProposals.length + searchResultsGrades.length;

  const filteredProposalsReviewData = proposalsReviewData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFinalGradesData = finalGradesData.filter(grade =>
    grade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApproveLogbook = (studentId) => {
    setStudentsData(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, logbookStatus: 'Disetujui' };
      }
      return s;
    }));
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => ({ ...prev, logbookStatus: 'Disetujui' }));
    }
    showToast(`Logbook mingguan ${selectedStudent?.name} berhasil disetujui!`);
  };

  const handleVerifyUsulan = (studentId) => {
    setStudentsData(prev => prev.map(s => {
      if (s.id === studentId) {
        return { 
          ...s, 
          pendingConversations: 0,
          usulanKuliah: s.usulanKuliah.map(u => ({ ...u, status: 'Sudah Diverifikasi' }))
        };
      }
      return s;
    }));
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => ({ 
        ...prev, 
        pendingConversations: 0,
        usulanKuliah: prev.usulanKuliah.map(u => ({ ...u, status: 'Sudah Diverifikasi' }))
      }));
    }
    showToast(`Semua usulan mata kuliah konversi SKS ${selectedStudent?.name} berhasil diverifikasi!`);
  };

  const getLogbookStyle = (status) => {
    switch (status) {
      case 'Disetujui': return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'Perlu Review': return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
      default: return { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5' };
    }
  };

  return (
    <div className="custom-dashboard-container purple-gradient-theme fade-in">
      {/* 1. Left Sidebar */}
      <aside className={`custom-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <UnikaLogo size={26} />
          </div>
          {!isSidebarCollapsed && (
            <div className="logo-text">
              <h4>UNIKA.IN</h4>
            </div>
          )}
        </div>

        {/* Sidebar Nav Categories */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isSidebarCollapsed && <span className="section-title">DOSEN PEMBIMBING</span>}
            <button 
              className={`nav-item ${activeNavTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>
            <button 
              className={`nav-item ${activeNavTab === 'verifikasi' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('verifikasi')}
            >
              <FileCheck size={18} />
              {!isSidebarCollapsed && <span>Pengajuan Magang</span>}
            </button>
            <button 
              className={`nav-item ${activeNavTab === 'penilaian' ? 'active' : ''}`}
              onClick={() => setActiveNavTab('penilaian')}
            >
              <Award size={18} />
              {!isSidebarCollapsed && <span>Penilaian Akhir</span>}
            </button>
          </div>
        </nav>
        <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #f6f1fb' }}>
          <button
            className="nav-item"
            onClick={handleLogout}
            style={{
              width: '100%',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: isSidebarCollapsed ? '0' : '12px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Floating Toggle Sidebar Button */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        style={{
          position: 'absolute',
          left: isSidebarCollapsed ? '66px' : '246px',
          top: '22px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1px solid #e9e2f2',
          boxShadow: '0 2px 8px rgba(180, 50, 242, 0.2)',
          color: '#B432F2',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s, transform 0.2s'
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.backgroundColor = '#f8ebff';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* 2. Main Viewport */}
      <div className="main-viewport">
        {/* Top Header */}
        <header className="custom-header">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img 
              src={amikomLogo} 
              alt="Logo Universitas Amikom Yogyakarta" 
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              lineHeight: '1.2',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#B432F2',
                margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>UNIVERSITAS AMIKOM</h3>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#94a3b8',
                margin: 0,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>YOGYAKARTA</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {showSearchPopover ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#faf5ff',
                  border: '1px solid #B432F2',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  boxShadow: '0 4px 14px rgba(180, 50, 242, 0.15)',
                  transition: 'all 0.25s ease'
                }}>
                  <Search size={16} color="#B432F2" />
                  <input
                    type="text"
                    placeholder="Cari Nama, NIM, Mitra..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1e1b4b',
                      width: '220px'
                    }}
                  />
                  <X
                    size={16}
                    color="#94a3b8"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchPopover(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : (
                <button 
                  className="icon-btn" 
                  onClick={() => setShowSearchPopover(true)}
                  title="Cari Nama Mahasiswa, NIM, atau Mitra Industri"
                >
                  <Search size={20} />
                </button>
              )}

              {/* Floating Search Results Dropdown Popover */}
              {showSearchPopover && searchQuery.trim() !== '' && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '380px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(88, 28, 135, 0.22)',
                  border: '1px solid #e9d5ff',
                  zIndex: 1000,
                  overflow: 'hidden',
                  textAlign: 'left'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Search size={16} color="#e9d5ff" />
                      <span style={{ fontSize: '13px', fontWeight: '800' }}>Hasil Pencarian</span>
                    </div>
                    <span style={{ fontSize: '11px', backgroundColor: '#9333ea', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                      {totalSearchResults} Ditemukan
                    </span>
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px 0' }}>
                    {totalSearchResults === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>
                        Tidak ditemukan hasil untuk "{searchQuery}"
                      </div>
                    ) : (
                      <>
                        {/* Section: Monitoring Bimbingan */}
                        {searchResultsStudents.length > 0 && (
                          <div style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: '800', color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            📊 Monitoring Mahasiswa ({searchResultsStudents.length})
                          </div>
                        )}
                        {searchResultsStudents.map(student => (
                          <div
                            key={`search-student-${student.id}`}
                            onClick={() => {
                              setSelectedStudent(student);
                              setActiveNavTab('dashboard');
                              setActiveModalTab('logbook');
                              setShowSearchPopover(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>{student.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{student.nim} • {student.company}</div>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: student.logbookStatus === 'Disetujui' ? '#ecfdf5' : student.logbookStatus === 'Perlu Review' ? '#fffbeb' : '#fef2f2',
                              color: student.logbookStatus === 'Disetujui' ? '#059669' : student.logbookStatus === 'Perlu Review' ? '#d97706' : '#ef4444',
                              border: student.logbookStatus === 'Disetujui' ? '1px solid #a7f3d0' : student.logbookStatus === 'Perlu Review' ? '1px solid #fde68a' : '1px solid #fca5a5'
                            }}>
                              {student.logbookStatus}
                            </span>
                          </div>
                        ))}

                        {/* Section: Pengajuan Magang */}
                        {searchResultsProposals.length > 0 && (
                          <div style={{ padding: '12px 16px 4px', fontSize: '11px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            📁 Pengajuan Magang ({searchResultsProposals.length})
                          </div>
                        )}
                        {searchResultsProposals.map(item => (
                          <div
                            key={`search-prop-${item.id}`}
                            onClick={() => {
                              setActiveNavTab('verifikasi');
                              setShowSearchPopover(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>{item.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{item.nim} • Berkas ({item.collected}/8)</div>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: item.hasilBerkas === 'ACC Berkas' ? '#ecfdf5' : '#fffbeb',
                              color: item.hasilBerkas === 'ACC Berkas' ? '#059669' : '#d97706',
                              border: item.hasilBerkas === 'ACC Berkas' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                            }}>
                              {item.hasilBerkas}
                            </span>
                          </div>
                        ))}

                        {/* Section: Penilaian Akhir */}
                        {searchResultsGrades.length > 0 && (
                          <div style={{ padding: '12px 16px 4px', fontSize: '11px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            🎓 Penilaian Akhir ({searchResultsGrades.length})
                          </div>
                        )}
                        {searchResultsGrades.map(grade => (
                          <div
                            key={`search-grade-${grade.id}`}
                            onClick={() => {
                              setActiveNavTab('penilaian');
                              setShowSearchPopover(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>{grade.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{grade.nim} • Grade: {grade.finalGrade}</div>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#ecfdf5' : '#f3e8ff',
                              color: grade.status === 'Sudah Dirilis ke Website' ? '#059669' : '#7e22ce',
                              border: grade.status === 'Sudah Dirilis ke Website' ? '1px solid #a7f3d0' : '1px solid #e9d5ff'
                            }}>
                              {grade.status}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <button 
                className="icon-btn" 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{ backgroundColor: showNotifDropdown ? '#f3e8ff' : '' }}
                title="Pemberitahuan Sistem Bimbingan & Berkas Magang"
              >
                <Bell size={20} color={showNotifDropdown ? '#7e22ce' : 'currentColor'} />
                <span className="notification-dot"></span>
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '360px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(88, 28, 135, 0.22)',
                  border: '1px solid #e9d5ff',
                  zIndex: 1000,
                  overflow: 'hidden',
                  textAlign: 'left'
                }}>
                  <div style={{
                    padding: '14px 18px',
                    background: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="#e9d5ff" />
                      <span style={{ fontSize: '14px', fontWeight: '800' }}>Notifikasi Bimbingan & Berkas</span>
                    </div>
                    <span style={{ fontSize: '11px', backgroundColor: '#9333ea', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                      5 Baru
                    </span>
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px 0' }}>
                    {/* Item 1: Monitoring Logbook */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('dashboard'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>📊 MONITORING LOGBOOK</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Baru saja</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Budi Santoso (Google Indonesia)</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Mengirimkan Logbook Bimbingan Minggu ke-5 (28 Jam Aktivitas).</div>
                    </div>

                    {/* Item 2: Berkas Pengajuan Magang (3/8) */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('verifikasi'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>📁 BERKAS MAGANG (3/8)</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mnt lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Budi Santoso</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Mengunggah Proposal Magang, Transkrip IPK & Surat Rekomendasi.</div>
                    </div>

                    {/* Item 3: Berkas Lengkap 8/8 */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('verifikasi'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#d1fae5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>✅ BERKAS LENGKAP (8/8)</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>25 mnt lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Dewi Lestari (PT Telkom)</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Melengkapi seluruh 8/8 Dokumen Persyaratan Pengajuan Magang.</div>
                    </div>

                    {/* Item 4: Usulan SKS */}
                    <div 
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('dashboard'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>🎓 USULAN SKS</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 jam lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Dewi Lestari</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Mengajukan usulan konversi 4 Mata Kuliah SKS (16 SKS Total).</div>
                    </div>

                    {/* Item 5: Pembaruan Berkas */}
                    <div 
                      style={{ padding: '12px 16px', cursor: 'pointer', transition: 'background-color 0.15s ease' }} 
                      onClick={() => { setActiveNavTab('verifikasi'); setShowNotifDropdown(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>📁 PEMBARUAN BERKAS (5/8)</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 jam lalu</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>Siti Aminah (Traveloka)</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Memperbarui berkas SPTJM & CV ATS (5/8 Dokumen Terkumpul).</div>
                    </div>
                  </div>

                  <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <button 
                      onClick={() => { setActiveNavTab('dashboard'); setShowNotifDropdown(false); }}
                      style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Lihat Semua Notifikasi di Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="profile-badge">
              <div className="profile-info">
                <span className="profile-name">{currentUser?.name || 'Dr. Ahmad Dahlan, M.T.'}</span>
                <span className="profile-role">{currentUser?.identity || '0412088501'}</span>
              </div>
              <div className="profile-avatar">
                {currentUser?.name ? currentUser.name.charAt(0) : 'D'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content" style={{ maxWidth: '100%', margin: '0', padding: '32px' }}>
        
        {/* TAB 1: MAIN DASHBOARD */}
        {activeNavTab === 'dashboard' && (
          <>
            {/* Welcome Section */}
            <section className="welcome-section">
              <h2 className="welcome-title">Selamat Datang, {currentUser?.name || 'Dr. Ahmad Dahlan, M.T.'}!</h2>
              <p className="welcome-desc">
                NIDN Anda: <strong>{currentUser?.identity || '0412088501'}</strong> | Dosen Pembimbing Lapangan. Silakan kelola bimbingan, verifikasi logbook bulanan, dan rekomendasikan konversi sks mahasiswa.
              </p>
            </section>

            {/* Stats Grid */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{studentsData.length}</span>
                  <span className="stat-label">Mahasiswa Bimbingan</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{studentsData.filter(s => s.logbookStatus === 'Perlu Review').length} Laporan</span>
                  <span className="stat-label">Logbook Perlu Review</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BookOpen size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{studentsData.reduce((acc, s) => acc + s.pendingConversations, 0)} Usulan</span>
                  <span className="stat-label">Konversi SKS Baru</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">94%</span>
                  <span className="stat-label">Tingkat Kelulusan</span>
                </div>
              </div>
            </section>

            {/* Details Grid */}
            <div className="info-grid">
              {/* Main Panel */}
              <section className="main-panel">
                <h3 className="panel-title">
                  <ClipboardList size={20} className="text-primary" />
                  Monitoring Mahasiswa Magang MSIB
                </h3>
                
                <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                        <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MAHASISWA</th>
                        <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MITRA INDUSTRI</th>
                        <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>LOGBOOK</th>
                        <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>USULAN KULIAH</th>
                        <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.map((student) => {
                        const logStyle = getLogbookStyle(student.logbookStatus);
                        return (
                          <tr key={student.id}>
                            <td style={{ padding: '16px 8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b' }}>{student.name}</span>
                                <span className="sub-text" style={{ fontSize: '12px', color: '#7e22ce' }}>{student.nim}</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px 8px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e1b4b' }}>{student.company}</span>
                                <span className="sub-text" style={{ fontSize: '12px', color: '#7e22ce' }}>{student.program}</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: '99px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                backgroundColor: logStyle.bg,
                                color: logStyle.color,
                                border: `1px solid ${logStyle.border}`
                              }}>
                                {student.logbookStatus}
                              </span>
                            </td>
                            <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '600', whiteSpace: 'nowrap' }}>
                              {student.pendingConversations > 0 ? (
                                <span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: '#7e22ce', backgroundColor: '#f3e8ff', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', border: '1px solid #e9d5ff' }}>
                                  {student.pendingConversations} Usulan
                                </span>
                              ) : (
                                <span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: '#059669', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid #a7f3d0' }}>Sudah Diverifikasi</span>
                              )}
                            </td>
                            <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setActiveModalTab('logbook');
                                }}
                                style={{
                                  background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                                  cursor: 'pointer',
                                  transition: 'transform 0.15s ease'
                                }}
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Sidebar Notifikasi Monitoring & Berkas Pengajuan Magang */}
              <section className="sidebar-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #e9d5ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} color="#B432F2" />
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#B432F2', lineHeight: '1.3' }}>
                      Notifikasi Bimbingan & Berkas
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', backgroundColor: '#f8ebff', color: '#B432F2', border: '1px solid #e9e2f2', padding: '4px 10px', borderRadius: '99px', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    5 Baru
                  </span>
                </div>

                {/* Scrollable list so it doesn't extend to the bottom */}
                <div style={{ maxHeight: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  {/* Item 1: Monitoring Logbook */}
                  <div className="list-item" style={{ borderLeft: '4px solid #B432F2', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                          📊 MONITORING LOGBOOK
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Baru saja</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Budi Santoso (Google Indonesia)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengirimkan Logbook Bimbingan Minggu ke-5 (28 Jam Aktivitas).
                      </span>
                    </div>
                  </div>

                  {/* Item 2: Berkas Pengajuan Magang (Dokumen Dikumpul) */}
                  <div className="list-item" style={{ borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                          📁 BERKAS MAGANG (3/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mnt lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Budi Santoso
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengunggah berkas Proposal Magang, Transkrip IPK & Surat Rekomendasi (3/8 Dokumen).
                      </span>
                    </div>
                  </div>

                  {/* Item 3: Berkas Pengajuan Magang Lengkap 8/8 */}
                  <div className="list-item" style={{ borderLeft: '4px solid #10b981', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>
                          ✅ BERKAS LENGKAP (8/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>25 mnt lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Dewi Lestari (PT Telkom)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Telah melengkapi seluruh 8/8 Dokumen Persyaratan Pengajuan Magang MSIB (Siap di-ACC).
                      </span>
                    </div>
                  </div>

                  {/* Item 4: Monitoring SKS */}
                  <div className="list-item" style={{ borderLeft: '4px solid #d97706', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fffbeb', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>
                          🎓 USULAN SKS
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 jam lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Dewi Lestari
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengajukan usulan konversi 4 Mata Kuliah SKS (16 SKS Total).
                      </span>
                    </div>
                  </div>

                  {/* Item 5: Pembaruan Berkas */}
                  <div className="list-item" style={{ borderLeft: '4px solid #7e22ce', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                          📁 PEMBARUAN BERKAS (5/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 jam lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Siti Aminah (Traveloka)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Memperbarui berkas SPTJM & CV ATS Format (5/8 Dokumen Terkumpul).
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {/* TAB 2: PENGAJUAN MAGANG */}
        {activeNavTab === 'verifikasi' && (
          <>
            <section className="welcome-section" style={{ marginBottom: '24px' }}>
              <h2 className="welcome-title">Pengajuan Magang Mahasiswa MSIB</h2>
              <p className="welcome-desc">
                Pilih mahasiswa untuk memeriksa kelengkapan berkas pengajuan (Proposal Magang, Transkrip IPK, Surat Rekomendasi) dan berikan status <strong>ACC Proposal</strong>.
              </p>
            </section>

            <section className="main-panel">
              <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={20} className="text-primary" />
                Pengajuan Magang & ACC Proposal
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                Verifikasi kelengkapan berkas pengajuan magang MSIB dan berikan persetujuan ACC Proposal Mahasiswa.
              </p>

          <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                  <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MAHASISWA</th>
                  <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>HISTORY PENGAJUAN MAGANG</th>
                  <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>HASIL BERKAS</th>
                  <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>DOKUMEN DIKUMPUL</th>
                  <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#581c87', backgroundColor: '#f3e8ff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>VERIFIKASI BERKAS</th>
                </tr>
              </thead>
                <tbody>
                  {filteredProposalsReviewData.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap' }}>{item.name}</span>
                        <span className="sub-text" style={{ fontSize: '12px', color: '#7e22ce' }}>{item.nim} • {item.company}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {item.files.map((file, idx) => (
                          <a
                            key={idx}
                            href="#download"
                            onClick={(e) => { e.preventDefault(); alert(`Mengunduh berkas ${file}`); }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#f3e8ff',
                              color: '#7e22ce',
                              border: '1px solid #e9d5ff',
                              fontSize: '11px',
                              fontWeight: '600',
                              textDecoration: 'none'
                            }}
                          >
                            <FileText size={12} /> {file}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: item.hasilBerkas === 'ACC Berkas' ? '#ecfdf5' : '#fffbeb',
                        color: item.hasilBerkas === 'ACC Berkas' ? '#059669' : '#d97706',
                        border: item.hasilBerkas === 'ACC Berkas' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                      }}>
                        {item.hasilBerkas === 'ACC Berkas' && <CheckCircle size={12} />}
                        {item.hasilBerkas}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        backgroundColor: item.collected === item.total ? '#ecfdf5' : '#f3e8ff',
                        color: item.collected === item.total ? '#059669' : '#7e22ce',
                        fontWeight: '800',
                        fontSize: '13px',
                        border: item.collected === item.total ? '1px solid #a7f3d0' : '1px solid #e9d5ff'
                      }}>
                        {item.collected}/{item.total} Dokumen
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedDocStudent(item)}
                        style={{
                          background: item.collected === item.total 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                            : 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <FileText size={13} /> Cek Berkas ({item.collected}/8)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    )}

    {/* TAB 3: PENILAIAN AKHIR */}
    {activeNavTab === 'penilaian' && (
      <>
        <section className="welcome-section" style={{ marginBottom: '24px' }}>
          <h2 className="welcome-title">Penilaian Proposal & Rilis Nilai Akhir Konversi</h2>
          <p className="welcome-desc">
            Masukkan akumulasi nilai proposal dan nilai kinerja magang mitra, lalu publikasikan Nilai Akhir Konversi SKS ke Website Informatika.
          </p>
        </section>

            <div className="info-grid">
              {/* Section 2: Penilaian Proposal & Rilis Nilai Akhir melalui Website Informatika */}
              <section className="main-panel">
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} className="text-primary" />
                  Penilaian Proposal & Rilis Nilai Akhir (Website Informatika)
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Verifikasi nilai proposal, nilai kinerja magang mitra, dan publikasikan nilai konversi SKS ke Website Informatika.
                </p>

                <div style={{ overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e9d5ff' }}>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>MAHASISWA</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, whiteSpace: 'nowrap' }}>BERKAS PROPOSAL & LAPORAN</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>NILAI PROPOSAL</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>NILAI MITRA & LOGBOOK</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>NILAI AKHIR KONVERSI</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>STATUS RILIS PRODI</th>
                        <th style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '700', color: '#B432F2', backgroundColor: '#f8ebff', position: 'sticky', top: 0, zIndex: 5, textAlign: 'center', whiteSpace: 'nowrap' }}>PUBLIKASI WEBSITE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFinalGradesData.map((grade) => (
                        <tr key={grade.id}>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap' }}>{grade.name}</span>
                              <span className="sub-text" style={{ fontSize: '12px', color: '#B432F2' }}>{grade.nim} • {grade.company}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <button
                                type="button"
                                title="Cek Proposal Magang"
                                onClick={() => alert(`Membuka File Proposal Magang: ${grade.proposalFile}`)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #e9e2f2',
                                  backgroundColor: '#faf5ff',
                                  color: '#B432F2',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <FileText size={12} /> Cek Proposal
                              </button>
                              <button
                                type="button"
                                title="Cek Laporan Akhir Magang"
                                onClick={() => alert(`Membuka File Laporan Akhir Magang: ${grade.reportFile}`)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #a7f3d0',
                                  backgroundColor: '#ecfdf5',
                                  color: '#047857',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <FileCheck size={12} /> Cek Laporan
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={grade.proposalScore}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFinalGradesData(prev => prev.map(g => g.id === grade.id ? { ...g, proposalScore: val } : g));
                              }}
                              disabled={grade.status === 'Sudah Dirilis ke Website'}
                              style={{
                                width: '56px',
                                padding: '6px 4px',
                                textAlign: 'center',
                                borderRadius: '6px',
                                border: '1px solid #c084fc',
                                fontWeight: '700',
                                color: '#581c87',
                                backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#f3e8ff' : '#ffffff'
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={grade.partnerScore}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFinalGradesData(prev => prev.map(g => g.id === grade.id ? { ...g, partnerScore: val } : g));
                              }}
                              disabled={grade.status === 'Sudah Dirilis ke Website'}
                              style={{
                                width: '56px',
                                padding: '6px 4px',
                                textAlign: 'center',
                                borderRadius: '6px',
                                border: '1px solid #c084fc',
                                fontWeight: '700',
                                color: '#581c87',
                                backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#f3e8ff' : '#ffffff'
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <span style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#f3e8ff',
                              color: '#7e22ce',
                              fontWeight: '800',
                              fontSize: '12px',
                              border: '1px solid #e9d5ff'
                            }}>
                              {grade.finalGrade}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '99px',
                              fontSize: '11px',
                              fontWeight: '700',
                              backgroundColor: grade.status === 'Sudah Dirilis ke Website' ? '#ecfdf5' : '#fffbeb',
                              color: grade.status === 'Sudah Dirilis ke Website' ? '#059669' : '#d97706',
                              border: grade.status === 'Sudah Dirilis ke Website' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                            }}>
                              {grade.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {grade.status === 'Draft' ? (
                              <button
                                type="button"
                                onClick={() => handleReleaseGrade(grade.id)}
                                style={{
                                  background: 'linear-gradient(135deg, #B432F2 0%, #9f1be0 100%)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  boxShadow: '0 4px 12px rgba(180, 50, 242, 0.25)',
                                  cursor: 'pointer'
                                }}
                              >
                                <Send size={13} /> Rilis Nilai Akhir
                              </button>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700', backgroundColor: '#ecfdf5', padding: '5px 10px', borderRadius: '6px', border: '1px solid #a7f3d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <ExternalLink size={13} /> Terpublikasi di Website
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Sidebar Notifikasi Monitoring & Berkas Pengajuan Magang */}
              <section className="sidebar-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #e9d5ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} color="#7e22ce" />
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#581c87', lineHeight: '1.3' }}>
                      Notifikasi Bimbingan & Berkas
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff', padding: '4px 10px', borderRadius: '99px', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    5 Baru
                  </span>
                </div>

                <div style={{ maxHeight: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  <div className="list-item" style={{ borderLeft: '4px solid #9333ea', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                          📊 MONITORING LOGBOOK
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Baru saja</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Budi Santoso (Google Indonesia)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengirimkan Logbook Bimbingan Minggu ke-5 (28 Jam Aktivitas).
                      </span>
                    </div>
                  </div>

                  <div className="list-item" style={{ borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                          📁 BERKAS MAGANG (3/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mnt lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Budi Santoso
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengunggah berkas Proposal Magang, Transkrip IPK & Surat Rekomendasi (3/8 Dokumen).
                      </span>
                    </div>
                  </div>

                  <div className="list-item" style={{ borderLeft: '4px solid #10b981', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px' }}>
                          ✅ BERKAS LENGKAP (8/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>25 mnt lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Dewi Lestari (PT Telkom)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Telah melengkapi seluruh 8/8 Dokumen Persyaratan Pengajuan Magang MSIB (Siap di-ACC).
                      </span>
                    </div>
                  </div>

                  <div className="list-item" style={{ borderLeft: '4px solid #d97706', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#fffbeb', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>
                          🎓 USULAN SKS
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 jam lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Dewi Lestari
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Mengajukan usulan konversi 4 Mata Kuliah SKS (16 SKS Total).
                      </span>
                    </div>
                  </div>

                  <div className="list-item" style={{ borderLeft: '4px solid #7e22ce', paddingLeft: '12px' }}>
                    <div className="item-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px' }}>
                          📁 PEMBARUAN BERKAS (5/8)
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 jam lalu</span>
                      </div>
                      <span className="item-title" style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>
                        Siti Aminah (Traveloka)
                      </span>
                      <span className="item-desc" style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                        Memperbarui berkas SPTJM & CV ATS Format (5/8 Dokumen Terkumpul).
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#3b0764',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 300,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} style={{ color: '#4ade80' }} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{toastMessage}</span>
        </div>
      )}

      {/* Modal Review Bimbingan Mahasiswa */}
      {selectedStudent && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="modal-content" style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.35)',
            border: '1px solid #e9d5ff',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #6b21a8 0%, #9333ea 60%, #c084fc 100%)',
              padding: '24px 28px',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ClipboardList size={22} />
                  <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Review Bimbingan Mahasiswa</h3>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#f3e8ff' }}>
                  Kelola dan verifikasi logbook, usulan kuliah, serta evaluasi mitra industri.
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Profile & Mitra Info Header Card */}
            <div style={{
              padding: '20px 28px',
              backgroundColor: '#faf5ff',
              borderBottom: '1px solid #e9d5ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              {/* Mahasiswa Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '800',
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)'
                }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e1b4b' }}>{selectedStudent.name}</h4>
                  <span style={{ fontSize: '13px', color: '#7e22ce', fontWeight: '600' }}>NIM: {selectedStudent.nim} • {selectedStudent.email}</span>
                </div>
              </div>

              {/* Mitra Industri Info Badge */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e9d5ff',
                padding: '10px 16px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Building2 size={22} style={{ color: '#9333ea' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>{selectedStudent.company}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Program: {selectedStudent.program}</span>
                </div>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e9d5ff',
              padding: '0 28px',
              backgroundColor: '#ffffff',
              gap: '12px'
            }}>
              <button
                onClick={() => setActiveModalTab('logbook')}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: activeModalTab === 'logbook' ? '3px solid #9333ea' : '3px solid transparent',
                  color: activeModalTab === 'logbook' ? '#9333ea' : '#64748b',
                  fontWeight: activeModalTab === 'logbook' ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ClipboardList size={18} />
                Action Logbook
              </button>

              <button
                onClick={() => setActiveModalTab('usulan')}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: activeModalTab === 'usulan' ? '3px solid #9333ea' : '3px solid transparent',
                  color: activeModalTab === 'usulan' ? '#9333ea' : '#64748b',
                  fontWeight: activeModalTab === 'usulan' ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <BookOpen size={18} />
                Cek Usulan SKS ({selectedStudent.usulanKuliah ? selectedStudent.usulanKuliah.length : 0})
              </button>

              <button
                onClick={() => setActiveModalTab('mitra')}
                style={{
                  padding: '14px 16px',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: activeModalTab === 'mitra' ? '3px solid #9333ea' : '3px solid transparent',
                  color: activeModalTab === 'mitra' ? '#9333ea' : '#64748b',
                  fontWeight: activeModalTab === 'mitra' ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Building2 size={18} />
                Mahasiswa & Mitra
              </button>
            </div>

            {/* Modal Tab Content */}
            <div style={{ padding: '24px 28px', backgroundColor: '#ffffff' }}>
              {/* TAB 1: ACTION LOGBOOK */}
              {activeModalTab === 'logbook' && (
                <div>
                  <div style={{
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '800', color: '#581c87', fontSize: '15px' }}>
                        {selectedStudent.logbookDetail?.week}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: getLogbookStyle(selectedStudent.logbookStatus).bg,
                        color: getLogbookStyle(selectedStudent.logbookStatus).color,
                        border: `1px solid ${getLogbookStyle(selectedStudent.logbookStatus).border}`
                      }}>
                        Status: {selectedStudent.logbookStatus}
                      </span>
                    </div>

                    <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                      <strong>Deskripsi Kegiatan Magang:</strong><br />
                      {selectedStudent.logbookDetail?.activity}
                    </p>

                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#64748b' }}>
                      <span><strong>Total Jam:</strong> {selectedStudent.logbookDetail?.hours}</span>
                      <span><strong>Waktu Submit:</strong> {selectedStudent.logbookDetail?.submittedAt}</span>
                    </div>
                  </div>

                  {/* Actions for Logbook */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    {selectedStudent.logbookStatus !== 'Disetujui' ? (
                      <button
                        type="button"
                        onClick={() => handleApproveLogbook(selectedStudent.id)}
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        Setujui Logbook Mingguan
                      </button>
                    ) : (
                      <div style={{
                        color: '#059669',
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <CheckCircle2 size={18} />
                        Logbook Telah Disetujui
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CEK USULAN MATA KULIAH */}
              {activeModalTab === 'usulan' && (
                <div>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#581c87', fontWeight: '800' }}>
                    Daftar Mata Kuliah Usulan Konversi SKS
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {selectedStudent.usulanKuliah && selectedStudent.usulanKuliah.map((usulan, idx) => (
                      <div key={idx} style={{
                        background: '#faf5ff',
                        border: '1px solid #e9d5ff',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <span style={{ display: 'block', fontWeight: '700', color: '#1e1b4b', fontSize: '14px' }}>
                            [{usulan.code}] {usulan.name}
                          </span>
                          <span style={{ fontSize: '12px', color: '#7e22ce', fontWeight: '600' }}>
                            Bobot: {usulan.sks} SKS
                          </span>
                        </div>

                        <span style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '4px 12px',
                          borderRadius: '99px',
                          backgroundColor: usulan.status === 'Sudah Diverifikasi' ? '#ecfdf5' : '#fffbeb',
                          color: usulan.status === 'Sudah Diverifikasi' ? '#059669' : '#d97706',
                          border: usulan.status === 'Sudah Diverifikasi' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}>
                          {usulan.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions for Usulan */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {selectedStudent.pendingConversations > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyUsulan(selectedStudent.id)}
                        style={{
                          background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        Verifikasi Semua Usulan SKS
                      </button>
                    ) : (
                      <div style={{
                        color: '#059669',
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <CheckCircle2 size={18} />
                        Semua Usulan SKS Telah Diverifikasi
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MAHASISWA & MITRA INDUSTRI */}
              {activeModalTab === 'mitra' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Detail Mahasiswa */}
                    <div style={{
                      background: '#faf5ff',
                      border: '1px solid #e9d5ff',
                      borderRadius: '16px',
                      padding: '18px'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#581c87', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} /> Profile Mahasiswa
                      </h4>
                      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155' }}>
                        <div><strong>Nama:</strong> {selectedStudent.name}</div>
                        <div><strong>NIM:</strong> {selectedStudent.nim}</div>
                        <div><strong>Email:</strong> {selectedStudent.email}</div>
                        <div><strong>IPK Kumulatif:</strong> {selectedStudent.gpa}</div>
                        <div><strong>SKS Lulus:</strong> {selectedStudent.sks} SKS</div>
                      </div>
                    </div>

                    {/* Detail Mitra Industri */}
                    <div style={{
                      background: '#faf5ff',
                      border: '1px solid #e9d5ff',
                      borderRadius: '16px',
                      padding: '18px'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#581c87', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={18} /> Mitra Industri & Mentor
                      </h4>
                      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155' }}>
                        <div><strong>Perusahaan:</strong> {selectedStudent.company}</div>
                        <div><strong>Posisi Magang:</strong> {selectedStudent.program}</div>
                        <div><strong>Mentor Industri:</strong> {selectedStudent.mentorName}</div>
                        <div><strong>Presensi Kehadiran:</strong> <span style={{ color: '#059669', fontWeight: '700' }}>98% (Sangat Baik)</span></div>
                        <div><strong>Evaluasi Industri:</strong> <span style={{ color: '#9333ea', fontWeight: '700' }}>Disetujui Mentor</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Modal Checklist Berkas Pengajuan Magang */}
      {selectedDocStudent && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDocStudent(null);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(88, 28, 135, 0.25)',
            border: '1px solid #e9d5ff',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Checklist Berkas Pengajuan Magang</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#e9d5ff' }}>
                  {selectedDocStudent.name} ({selectedDocStudent.nim}) • {selectedDocStudent.company}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDocStudent(null)}
                style={{ background: 'transparent', border: 'none', color: '#e9d5ff', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: List of 8 required documents */}
            <div style={{ padding: '24px', maxHeight: '460px', overflowY: 'auto' }}>
              {(() => {
                const validCount = Object.values(docReviewState).filter(v => v === 'valid').length;
                return (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#f3e8ff',
                    borderRadius: '10px',
                    border: '1px solid #e9d5ff'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#581c87' }}>Progres Verifikasi Dokumen</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#7e22ce', backgroundColor: '#ffffff', padding: '4px 12px', borderRadius: '6px' }}>
                      {validCount} / {selectedDocStudent.total} Dokumen Di-ACC
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {requiredDocumentList.map((doc, idx) => {
                  const isUploaded = idx < (selectedDocStudent.collected || selectedDocStudent.files?.length || 0);
                  const currentReview = docReviewState[idx] || 'pending';
                  const isValidated = currentReview === 'valid';
                  const isRejected = currentReview === 'invalid';
                  const isFileChecked = checkedDocs[idx] || isValidated;

                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: !isUploaded 
                        ? '1px solid #e2e8f0' 
                        : isRejected 
                        ? '1px solid #fecaca' 
                        : isValidated 
                        ? '1px solid #a7f3d0' 
                        : '1px solid #c084fc',
                      backgroundColor: !isUploaded 
                        ? '#f8fafc' 
                        : isRejected 
                        ? '#fef2f2' 
                        : isValidated 
                        ? '#ecfdf5' 
                        : '#faf5ff',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        {!isUploaded ? (
                          <FileText size={18} color="#94a3b8" />
                        ) : isValidated ? (
                          <CheckCircle size={18} color="#059669" />
                        ) : isRejected ? (
                          <XCircle size={18} color="#dc2626" />
                        ) : (
                          <AlertCircle size={18} color="#9333ea" />
                        )}
                        <div>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            color: !isUploaded ? '#64748b' : isRejected ? '#991b1b' : isValidated ? '#065f46' : '#581c87', 
                            display: 'block' 
                          }}>
                            {idx + 1}. {doc.title}
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            color: !isUploaded ? '#94a3b8' : isRejected ? '#b91c1c' : isValidated ? '#047857' : '#7e22ce' 
                          }}>
                            {!isUploaded 
                              ? 'Belum Diunggah Mahasiswa' 
                              : isValidated 
                              ? '✓ Dokumen Valid & Di-ACC' 
                              : isRejected 
                              ? `✕ Dokumen Ditolak • ${docRejectionReasons[idx] ? `Catatan: "${docRejectionReasons[idx]}"` : 'Perlu Revisi'}` 
                              : isFileChecked 
                              ? '🔍 File Sudah Dicek • Siap Di-ACC' 
                              : '🔍 File Sudah Dicek • Siap Di-ACC'}
                          </span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      {!isUploaded ? (
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          Belum Ada File
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckedDocs(prev => ({ ...prev, [idx]: true }));
                              alert(`Membuka & memeriksa pratinjau dokumen: ${doc.title}`);
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: isFileChecked ? '1px solid #a855f7' : '1px solid #d8b4fe',
                              backgroundColor: isFileChecked ? '#f3e8ff' : '#faf5ff',
                              color: '#7e22ce',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <FileText size={12} /> {isFileChecked ? 'Cek Ulang File' : 'Cek File'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDocReviewState(prev => ({ ...prev, [idx]: 'valid' }));
                              setActiveRejectPopoverIdx(null);
                              showToast(`Dokumen #${idx + 1} (${doc.title}) diverifikasi & di-ACC!`);
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: isValidated ? '1px solid #10b981' : '1px solid #10b981',
                              backgroundColor: isValidated ? '#10b981' : '#ecfdf5',
                              color: isValidated ? '#ffffff' : '#059669',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}
                          >
                            <CheckCircle size={14} /> {isValidated ? 'Di-ACC' : 'ACC Dokumen'}
                          </button>

                          {/* Silang Button with Inline Popover next to it */}
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              type="button"
                              title="Tolak / Minta Revisi Dokumen Ini"
                              onClick={() => {
                                if (activeRejectPopoverIdx === idx) {
                                  setActiveRejectPopoverIdx(null);
                                } else {
                                  setActiveRejectPopoverIdx(idx);
                                }
                              }}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: isRejected ? '1px solid #ef4444' : '1px solid #e2e8f0',
                                backgroundColor: isRejected ? '#ef4444' : '#ffffff',
                                color: isRejected ? '#ffffff' : '#dc2626',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <XCircle size={15} />
                            </button>

                            {/* Small Popover floating next to silang button */}
                            {activeRejectPopoverIdx === idx && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '34px',
                                width: '250px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #fca5a5',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.22)',
                                padding: '12px',
                                zIndex: 100,
                                textAlign: 'left'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#991b1b' }}>⚠️ Catatan Revisi Dokumen</span>
                                  <X 
                                    size={14} 
                                    color="#94a3b8" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => setActiveRejectPopoverIdx(null)} 
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Tulis alasan revisi / penolakan..."
                                  value={docRejectionReasons[idx] || ''}
                                  onChange={(e) => setDocRejectionReasons(prev => ({ ...prev, [idx]: e.target.value }))}
                                  autoFocus
                                  style={{
                                    width: '100%',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #fecaca',
                                    fontSize: '12px',
                                    outline: 'none',
                                    marginBottom: '8px',
                                    backgroundColor: '#fff5f5',
                                    color: '#7f1d1d'
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setDocReviewState(prev => ({ ...prev, [idx]: 'invalid' }));
                                      setActiveRejectPopoverIdx(null);
                                      showToast(`Dokumen #${idx + 1} ditolak dengan catatan: "${docRejectionReasons[idx] || 'Perlu revisi'}"`);
                                    }
                                  }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => setActiveRejectPopoverIdx(null)}
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '4px',
                                      backgroundColor: '#ffffff',
                                      color: '#64748b',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDocReviewState(prev => ({ ...prev, [idx]: 'invalid' }));
                                      setActiveRejectPopoverIdx(null);
                                      showToast(`Dokumen #${idx + 1} ditolak dengan catatan: "${docRejectionReasons[idx] || 'Perlu revisi'}"`);
                                    }}
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      border: 'none',
                                      borderRadius: '4px',
                                      backgroundColor: '#dc2626',
                                      color: '#ffffff',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Simpan Alasan
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setSelectedDocStudent(null);
                  setActiveRejectPopoverIdx(null);
                  setDocReviewState({});
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.values(docReviewState).includes('invalid') && (
                  <button
                    onClick={() => {
                      const combinedReasons = Object.entries(docRejectionReasons)
                        .filter(([dIdx]) => docReviewState[dIdx] === 'invalid')
                        .map(([dIdx, r]) => `${requiredDocumentList[dIdx]?.title}: ${r || 'Perlu revisi'}`)
                        .join('; ');
                      handleRejectProposal(selectedDocStudent.id, combinedReasons || 'Berkas tidak lengkap / perlu revisi');
                      setSelectedDocStudent(null);
                      setActiveRejectPopoverIdx(null);
                      setDocReviewState({});
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <XCircle size={14} /> Kembalikan Berkas ke Mahasiswa
                  </button>
                )}

                {(() => {
                  const isFullyComplete = selectedDocStudent.collected === selectedDocStudent.total && !Object.values(docReviewState).includes('invalid');
                  return (
                    <button
                      type="button"
                      disabled={!isFullyComplete}
                      onClick={() => {
                        if (!isFullyComplete) return;
                        handleAccProposal(selectedDocStudent.id);
                        setSelectedDocStudent(null);
                        setShowRejectInput(false);
                        setDocReviewState({});
                      }}
                      title={isFullyComplete ? "Setujui & ACC Berkas Pengajuan" : `Berkas belum lengkap (${selectedDocStudent.collected}/8), belum bisa di-ACC`}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isFullyComplete 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                          : '#cbd5e1',
                        color: isFullyComplete ? '#ffffff' : '#64748b',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: isFullyComplete ? 'pointer' : 'not-allowed',
                        boxShadow: isFullyComplete ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={14} /> Setujui & ACC Berkas (8/8)
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DosenDashboard;
