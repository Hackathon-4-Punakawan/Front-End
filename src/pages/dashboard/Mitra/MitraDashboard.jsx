import React, { useState, useRef } from "react";
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PenilaianMahasiswa from "./PenilaianMahasiswa";
import RiwayatMahasiswa from "./RiwayatMahasiswa";
import {
  LogOut,
  Building,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Clock,
  CheckCircle,
  ClipboardCheck,
  LayoutGrid,
} from "lucide-react";
import amikomLogo from "../../../assets/amikom.png";

const MitraDashboard = () => {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const mahasiswaSectionRef = useRef(null);

    const scrollToMahasiswa = () => {
    mahasiswaSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
    };

  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // =========================
  // MOCK DATA MAHASISWA
  // =========================
  const interns = [
    {
      id: 1,
      nim: '22.11.4321',
      name: 'Sukma Putri',
      division: 'Web Developer',
      period: 'Feb - Mei 2026',
      internshipStatus: 'Aktif',
      evaluation: 'Belum Dinilai',
    },
    {
      id: 2,
      nim: '22.11.4312',
      name: 'Arief Kurniawan',
      division: 'Backend Developer',
      period: 'Feb - Mei 2026',
      internshipStatus: 'Aktif',
      evaluation: 'Belum Dinilai',
    },
    {
      id: 3,
      nim: '22.11.4299',
      name: 'Sonia Clarissa',
      division: 'UI/UX Designer',
      period: 'Jan - Apr 2026',
      internshipStatus: 'Selesai',
      evaluation: 'Sudah Dinilai',
    },
    {
      id: 4,
      nim: '22.11.4111',
      name: 'Rendra Pramudya',
      division: 'Frontend Developer',
      period: 'Mar - Jun 2026',
      internshipStatus: 'Aktif',
      evaluation: 'Belum Dinilai',
    },
    {
      id: 5,
      nim: '22.11.4001',
      name: 'Dinda Maharani',
      division: 'Data Analyst',
      period: 'Jan - Apr 2026',
      internshipStatus: 'Selesai',
      evaluation: 'Sudah Dinilai',
    },
    {
      id: 6,
      nim: '22.11.4002',
      name: 'Fajar Ramadhan',
      division: 'Mobile Developer',
      period: 'Feb - Mei 2026',
      internshipStatus: 'Selesai',
      evaluation: 'Sudah Dinilai',
    },
    {
      id: 7,
      nim: '22.11.4003',
      name: 'Nadia Putri',
      division: 'Quality Assurance',
      period: 'Feb - Mei 2026',
      internshipStatus: 'Selesai',
      evaluation: 'Sudah Dinilai',
    },
    {
      id: 8,
      nim: '22.11.4004',
      name: 'Bagas Pratama',
      division: 'DevOps Engineer',
      period: 'Jan - Apr 2026',
      internshipStatus: 'Selesai',
      evaluation: 'Sudah Dinilai',
    },
  ];

  // =========================
  // STATISTIK
  // =========================
  const totalMahasiswa = interns.length;

  const magangAktif = interns.filter(
    (intern) => intern.internshipStatus === 'Aktif'
  ).length;

  const belumDinilai = interns.filter(
    (intern) => intern.evaluation === 'Belum Dinilai'
  ).length;

  const sudahDinilai = interns.filter(
    (intern) => intern.evaluation === 'Sudah Dinilai'
  ).length;

  const mahasiswaAktif = interns.filter(
    (intern) => intern.internshipStatus === 'Aktif'
  );

  return (
    <div className="custom-dashboard-container fade-in">

      <style>{`
        .mitra-top-grid {
          display: grid;
          grid-template-columns: minmax(0, 3fr) minmax(280px, 1fr);
          gap: 24px;
          align-items: stretch;
        }
        
        .sidebar-menu-item {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 12px 16px;
  margin-bottom: 6px;

  border: none;
  border-radius: 12px;

  background: transparent;
  color: #64748b;

  font-family: inherit;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  text-align: left;

  transition: 0.2s ease;
}

.sidebar-menu-item:hover {
  background: #faf5ff;
  color: #b432f2;
}

.sidebar-menu-item.active {
  background: linear-gradient(
    90deg,
    #b432f2,
    #aa24ed
  );

  color: #ffffff;
}

.active-intern-table {
  width: 100%;
  margin-top: 24px;
}

.active-intern-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.3fr 1fr;
  gap: 24px;

  padding: 0 24px 14px;

  border-bottom: 1px solid #eee8f5;
}

.active-intern-header span {
  font-size: 12px;
  font-weight: 600;
  color: #94a0bd;
}

.active-intern-body {
  display: flex;
  flex-direction: column;
}

.active-intern-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.3fr 1fr;
  gap: 24px;

  align-items: center;

  padding: 22px 24px;

  border-bottom: 1px solid #eee8f5;
}

.active-intern-row:last-child {
  border-bottom: none;
}

.active-intern-student {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.active-intern-student strong {
  font-size: 15px;
  font-weight: 600;
  color: #07142d;
}

.active-intern-student span {
  font-size: 13px;
  color: #9aa6c3;
}

.active-intern-position,
.active-intern-period {
  font-size: 14px;
  font-weight: 600;
  color: #07142d;
}

.active-intern-status {
  display: inline-block;

  font-size: 11px;
  font-weight: 600;

  color: #64748b;

  text-transform: uppercase;
}
        
        /* =========================================
   PAGE HEADER
========================================= */

.dashboard-page-header {
  margin-bottom: 24px;
}

.dashboard-page-header h1 {
  margin: 0 0 4px;

  color: #111827;

  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
}

.dashboard-page-header p {
  margin: 0;

  color: #718096;

  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
}
        
        .user-profile {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 8px 10px 8px 18px;

  border: 1px solid #eee7f5;
  border-radius: 16px;

  background: #ffffff;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  color: #111827;

  font-size: 14px;
  font-weight: 700;

  line-height: 1.3;
}

.user-id {
  margin-top: 2px;

  color: #94a3b8;

  font-size: 11px;
  font-weight: 500;
}

.user-avatar {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: #b432f2;
  color: #ffffff;

  font-size: 15px;
  font-weight: 800;
}

        .mitra-hero-card {
          position: relative;
          overflow: hidden;
          min-height: 330px;
          padding: 36px;
          border-radius: 22px;
          color: #fff;
          background: linear-gradient(135deg, #b432f2 0%, #9918f2 100%);
          box-shadow: 0 18px 35px rgba(180, 50, 242, .18);
        }

        .mitra-hero-content { position: relative; z-index: 2; }
        .mitra-hero-circle {
          position: absolute;
          width: 250px;
          height: 250px;
          right: -70px;
          bottom: -100px;
          border-radius: 50%;
          background: rgba(255,255,255,.05);
        }

        .mitra-status-badge {
          display: inline-flex;
          padding: 5px 14px;
          border: 1px solid rgba(255,255,255,.45);
          border-radius: 999px;
          background: rgba(255,255,255,.12);
          font-size: 11px;
          font-weight: 800;
        }

        .mitra-company-name { margin: 18px 0 8px; font-size: 25px; font-weight: 800; }
        .mitra-company-info { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
        .mitra-period-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin: 36px 0 12px;
          font-size: 13px;
          font-weight: 700;
        }

        .mitra-progress {
          width: 100%;
          height: 6px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.25);
        }
        .mitra-progress-fill { height: 100%; border-radius: 999px; background: #fff; }

        .mitra-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }
        .mitra-stat-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: 0;
          padding: 16px 10px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 15px;
          background: rgba(255,255,255,.10);
          text-align: center;
        }
        .mitra-stat-value { font-size: 20px; font-weight: 800; }
        .mitra-stat-label { margin-top: 3px; font-size: 10px; font-weight: 700; }

        .mitra-right-panel { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
        .mitra-quick-action {
          width: 100%;
          padding: 20px;
          border: 1px solid #e9e2f2;
          border-radius: 18px;
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          transition: .2s ease;
        }
        .mitra-quick-action:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.05); }
        .mitra-quick-action.primary { border-color: #f1cbea; background: #fbf0ff; color: #b432f2; }
        .quick-title { display: block; font-size: 14px; font-weight: 800; }
        .quick-subtitle { display: block; margin-top: 5px; color: #64748b; font-size: 11px; }

        .mitra-notification-card, .mitra-content-card {
          border: 1px solid #e9e2f2;
          background: #fff;
        }
        .mitra-notification-card { flex: 1; padding: 20px; border-radius: 18px; }
        .notification-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 18px; }
        .notification-header h3 { margin: 0; font-size: 15px; }
        .notification-count {
          padding: 3px 8px;
          border-radius: 999px;
          background: #fff1f2;
          color: #ef4444;
          font-size: 10px;
          font-weight: 700;
        }
        .notification-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 17px; }
        .notification-item:last-child { margin-bottom: 0; }
        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #f5e9ff;
          color: #b432f2;
        }
        .notification-icon.success { background: #ecfdf5; color: #059669; }
        .notification-item p { margin: 0; color: #475569; font-size: 11px; line-height: 1.5; }
        .notification-item span { color: #94a3b8; font-size: 9px; }

        .mitra-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
          gap: 24px;
          margin-top: 28px;
        }
        .mitra-content-card { min-width: 0; padding: 26px; border-radius: 20px; }
        .mitra-section-header { margin-bottom: 20px; }
        .mitra-section-header h3 { margin: 0; color: #111827; font-size: 17px; font-weight: 800; }
        .mitra-section-header p { margin: 5px 0 0; color: #94a3b8; font-size: 12px; }

        .intern-list { display: flex; flex-direction: column; gap: 12px; }
        .intern-card { padding: 20px; border: 1px solid #eee7f5; border-radius: 16px; }
        .intern-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
        .intern-top h4 { margin: 0; font-size: 14px; }
        .intern-top > div > span { color: #94a3b8; font-size: 11px; }
        .active-badge { flex-shrink: 0; color: #64748b; font-size: 9px; font-weight: 800; }
        .intern-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 20px;
}
        .detail-label { display: block; margin-bottom: 5px; color: #94a3b8; font-size: 9px; font-weight: 800; }
        .intern-details strong { display: block; overflow-wrap: anywhere; font-size: 12px; }

        .evaluation-item { margin-bottom: 24px; }
        .evaluation-item:last-child { margin-bottom: 0; }
        .evaluation-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .evaluation-header h4 { margin: 0; font-size: 12px; }
        .evaluation-header div span { color: #94a3b8; font-size: 10px; }
        .evaluation-status { flex-shrink: 0; font-size: 9px; font-weight: 800; }
        .evaluation-status.done { color: #2563eb; }
        .evaluation-status.draft { color: #d97706; }
        .evaluation-status.waiting { color: #64748b; }
        .evaluation-progress {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 12px;
        }
        .progress-step { height: 5px; border-radius: 999px; background: #e2e8f0; }
        .progress-step.active { background: #3b82f6; }
        .evaluation-labels {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .mitra-top-grid { grid-template-columns: 1fr; }
          .mitra-right-panel { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); }
          .mitra-notification-card { grid-column: 1 / -1; }
          .mitra-bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .dashboard-content { padding: 20px !important; }
          .mitra-hero-card { min-height: auto; padding: 25px 20px; }
          .mitra-company-name { font-size: 21px; }
          .mitra-company-info { align-items: flex-start; font-size: 12px; }
          .mitra-period-row { flex-direction: column; gap: 5px; margin-top: 28px; }
          .mitra-stat-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .mitra-right-panel { grid-template-columns: 1fr; }
          .mitra-notification-card { grid-column: auto; }
          .mitra-content-card { padding: 20px; }
          .intern-details { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }

        @media (max-width: 480px) {
          .dashboard-content { padding: 16px !important; }
          .mitra-hero-card { padding: 22px 16px; }
          .mitra-stat-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .mitra-stat-card { padding: 13px 7px; }
          .mitra-stat-value { font-size: 18px; }
          .mitra-stat-label { font-size: 9px; }
          .intern-top, .evaluation-header { flex-direction: column; }
          .intern-details { grid-template-columns: 1fr; }
          .mitra-quick-action { padding: 17px; }
        }
        
        /* =====================================================
   RESPONSIVE DASHBOARD
   Tidak mengubah isi / data dashboard
===================================================== */

/* Mencegah elemen grid melebar keluar parent */
.custom-dashboard-container,
.main-viewport,
.dashboard-content,
.mitra-top-grid,
.mitra-bottom-grid,
.mitra-hero-card,
.mitra-content-card {
  min-width: 0;
  box-sizing: border-box;
}

/* =========================
   TABLET / SMALL LAPTOP
========================= */

@media (max-width: 1100px) {

  .mitra-top-grid {
    grid-template-columns: 1fr;
  }

  .mitra-bottom-grid {
    grid-template-columns: 1fr;
  }

  .mitra-right-panel {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mitra-notification-card {
    grid-column: 1 / -1;
  }

  /* Tabel tetap tabel, tetapi dapat discroll */
  .active-intern-table {
    width: 100%;
    overflow-x: auto;
  }

  .active-intern-header,
  .active-intern-row {
    min-width: 700px;
  }
}


/* =========================
   TABLET / MOBILE
========================= */

@media (max-width: 768px) {

  /* CONTENT */

  .dashboard-content {
    padding: 20px !important;
    width: 100%;
    overflow-x: hidden;
  }

  /* HEADER */

  .custom-header {
    padding-left: 20px;
    padding-right: 20px;
    gap: 15px;
  }

  .user-profile {
    padding: 7px;
  }

  .user-info {
    display: none;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
  }

  /* PAGE TITLE */

  .dashboard-page-header {
    margin-bottom: 20px;
  }

  .dashboard-page-header h1 {
    font-size: 26px;
  }

  .dashboard-page-header p {
    font-size: 14px;
  }

  /* HERO */

  .mitra-hero-card {
    min-height: auto;
    padding: 25px 20px;
  }

  .mitra-company-name {
    font-size: 21px;
  }

  .mitra-company-info {
    align-items: flex-start;
    font-size: 12px;
  }

  .mitra-period-row {
    flex-direction: column;
    gap: 5px;
    margin-top: 28px;
  }

  /* STATISTIC */

  .mitra-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* RIGHT PANEL */

  .mitra-right-panel {
    grid-template-columns: 1fr;
  }

  .mitra-notification-card {
    grid-column: auto;
  }

  /* CONTENT CARD */

  .mitra-content-card {
    padding: 20px;
  }

  /* TABLE */

  .active-intern-table {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .active-intern-header,
  .active-intern-row {
    min-width: 650px;
  }

  /* INTERN DETAILS */

  .intern-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 480px) {

  .dashboard-content {
    padding: 16px !important;
  }

  /* HEADER */

  .custom-header {
    padding-left: 15px;
    padding-right: 15px;
  }

  /* PAGE TITLE */

  .dashboard-page-header h1 {
    font-size: 24px;
  }

  .dashboard-page-header p {
    font-size: 13px;
  }

  /* HERO */

  .mitra-hero-card {
    padding: 22px 16px;
    border-radius: 18px;
  }

  .mitra-company-name {
    font-size: 19px;
  }

  .mitra-company-info {
    font-size: 11px;
  }

  /* STATISTIC */

  .mitra-stat-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .mitra-stat-card {
    padding: 13px 7px;
  }

  .mitra-stat-value {
    font-size: 18px;
  }

  .mitra-stat-label {
    font-size: 9px;
  }

  /* QUICK ACTION */

  .mitra-quick-action {
    padding: 17px;
  }

  /* CONTENT */

  .mitra-content-card {
    padding: 16px;
    border-radius: 16px;
  }

  .mitra-section-header h3 {
    font-size: 16px;
  }

  /* TABLE */

  .active-intern-table {
    overflow-x: auto;
  }

  .active-intern-header,
  .active-intern-row {
    min-width: 600px;
  }

  /* CARD */

  .intern-top,
  .evaluation-header {
    flex-direction: column;
  }

  .intern-details {
    grid-template-columns: 1fr;
  }
}
      `}</style>


      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`custom-sidebar ${
          isSidebarCollapsed ? 'collapsed' : ''
        }`}
      >
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#B432F2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {!isSidebarCollapsed && (
            <div className="logo-text">
              <h4>UNIKA.IN</h4>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="sidebar-nav">
          <div className="nav-section">

            {!isSidebarCollapsed && (
              <span className="section-title">
                MITRA
              </span>
            )}

            {/* DASHBOARD */}
            <button
  type="button"
  className={`sidebar-menu-item ${
    activeMenu === "dashboard" ? "active" : ""
  }`}
  onClick={() => setActiveMenu("dashboard")}
>
  <LayoutDashboard size={20} />

  {!isSidebarCollapsed && (
    <span>Dashboard</span>
  )}
</button>

<button
  type="button"
  className={`sidebar-menu-item ${
    activeMenu === "penilaian" ? "active" : ""
  }`}
  onClick={() => setActiveMenu("penilaian")}
>
  <ClipboardCheck size={20} />

  {!isSidebarCollapsed && (
    <span>Penilaian Mahasiswa</span>
  )}
</button>

<button
  type="button"
  className={`sidebar-menu-item ${
    activeMenu === "riwayat" ? "active" : ""
  }`}
  onClick={() => setActiveMenu("riwayat")}
>
  <Clock size={20} />

  {!isSidebarCollapsed && (
    <span>Riwayat Mahasiswa</span>
  )}
</button>

          </div>
        </nav>

        {/* LOGOUT */}
        <div
          className="sidebar-footer"
          style={{
            marginTop: 'auto',
            padding: '16px',
            borderTop: '1px solid #f6f1fb',
          }}
        >
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
            }}
          >
            <LogOut size={18} />

            {!isSidebarCollapsed && (
              <span>Keluar</span>
            )}
          </button>
        </div>
      </aside>

      {/* =========================
          TOGGLE SIDEBAR
      ========================== */}
      <button
        onClick={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        style={{
          position: 'absolute',
          left: isSidebarCollapsed ? '66px' : '246px',
          top: '22px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1px solid #e9e2f2',
          boxShadow: '0 2px 8px rgba(180,50,242,0.2)',
          color: '#B432F2',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          transition: 'left 0.3s',
        }}
      >
        {isSidebarCollapsed ? (
          <ChevronRight size={16} />
        ) : (
          <ChevronLeft size={16} />
        )}
      </button>

      {/* =========================
          MAIN VIEWPORT
      ========================== */}
      <div className="main-viewport">

        {/* HEADER */}
        <header className="custom-header">

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src={amikomLogo}
              alt="Logo Universitas Amikom Yogyakarta"
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '1.2',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#B432F2',
                  margin: 0,
                }}
              >
                UNIVERSITAS AMIKOM
              </h3>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#94a3b8',
                  letterSpacing: '1.5px',
                }}
              >
                YOGYAKARTA
              </span>
            </div>
          </div>

          {/* USER PROFILE */}
<div className="user-profile">
  <div className="user-info">
    <span className="user-name">
      {currentUser?.name || "Budi Santoso"}
    </span>

    <span className="user-id">
      {currentUser?.nim || currentUser?.id_mitra || "24.11.5956"}
    </span>
  </div>

  <div className="user-avatar">
    {(currentUser?.name || "Budi Santoso")
      .charAt(0)
      .toUpperCase()}
  </div>
</div>

        </header>

        <main
  className="dashboard-content"
  style={{
    maxWidth: "100%",
    margin: "0",
    padding: "32px",
    boxSizing: "border-box",
  }}
>
    {activeMenu === "dashboard" && (
  <div>
      {/* PAGE HEADER */}
      <div className="dashboard-page-header">
        <h1>Dashboard</h1>

        <p>
          Pantau mahasiswa magang dan kelola proses penilaian
          mahasiswa di perusahaan Anda.
        </p>
      </div>

  {/* =========================
      TOP CONTENT
  ========================== */}
  <div className="mitra-top-grid">

    {/* HERO CARD */}
    <section className="mitra-hero-card">

      {/* Dekorasi */}
      <div className="mitra-hero-circle" />

      <div className="mitra-hero-content">
        <span className="mitra-status-badge">
          MITRA AKTIF
        </span>

        <h2 className="mitra-company-name">
          {currentUser?.name || 'PT Dicoding Academy Indonesia'}
        </h2>

        <div className="mitra-company-info">
          <Building size={18} />
          <span>Partner Magang Universitas AMIKOM Yogyakarta</span>
        </div>

        {/* INFO PERIODE */}
        <div className="mitra-period-row">
          <span>Periode Magang 2026</span>
          <span>{magangAktif} Mahasiswa Aktif</span>
        </div>

        {/* PROGRESS */}
        <div className="mitra-progress">
          <div
            className="mitra-progress-fill"
            style={{
              width: totalMahasiswa
                ? `${(magangAktif / totalMahasiswa) * 100}%`
                : '0%',
            }}
          />
        </div>

        {/* STATISTIC */}
        <div className="mitra-stat-grid">

          <div className="mitra-stat-card">
            <span className="mitra-stat-value">{totalMahasiswa}</span>
            <span className="mitra-stat-label">
              Mahasiswa Magang
            </span>
          </div>

          <div className="mitra-stat-card">
            <span className="mitra-stat-value">{magangAktif}</span>
            <span className="mitra-stat-label">
              Magang Aktif
            </span>
          </div>

          <div className="mitra-stat-card">
            <span className="mitra-stat-value">{belumDinilai}</span>
            <span className="mitra-stat-label">
              Belum Dinilai
            </span>
          </div>

          <div className="mitra-stat-card">
            <span className="mitra-stat-value">{sudahDinilai}</span>
            <span className="mitra-stat-label">
              Sudah Dinilai
            </span>
          </div>

        </div>
      </div>
    </section>


    {/* =========================
        RIGHT PANEL
    ========================== */}
<div className="mitra-right-panel">

  {/* BERI PENILAIAN */}
  <button
  type="button"
  className="mitra-quick-action primary"
  onClick={() => setActiveMenu("penilaian")}
>
  <div>
    <span className="quick-title">
      Beri Penilaian
    </span>

    <span className="quick-subtitle">
      {belumDinilai} mahasiswa belum dinilai
    </span>
  </div>

  <ChevronRight size={22} />
</button>


  {/* LIHAT MAHASISWA */}
  <button
  type="button"
  className="mitra-quick-action"
  onClick={scrollToMahasiswa}
>
  <div>
    <span className="quick-title">
      Lihat Mahasiswa
    </span>

    <span className="quick-subtitle">
      {magangAktif} mahasiswa magang aktif
    </span>
  </div>

  <ChevronRight size={22} />
</button>   

</div>
</div>


  {/* =========================
      BOTTOM CONTENT
  ========================== */}
  <div className="mitra-bottom-grid">

    {/* MAHASISWA AKTIF */}
    <section
  ref={mahasiswaSectionRef}
  className="mitra-content-card mahasiswa-section"
>
  <div className="mitra-section-header">
    <h3>Mahasiswa Magang Aktif</h3>

        <p>
          Daftar mahasiswa yang sedang menjalani magang
          di perusahaan Anda.
        </p>
      </div>


      <div className="active-intern-table">

  <div className="active-intern-header">
    <span>MAHASISWA</span>
    <span>POSISI</span>
    <span>PERIODE</span>
    <span>STATUS</span>
  </div>

  <div className="active-intern-body">
    {interns
      .filter((intern) => intern.internshipStatus === "Aktif")
      .slice(0, 3)
      .map((intern) => (
        <div className="active-intern-row" key={intern.id}>

          <div className="active-intern-student">
            <strong>{intern.name}</strong>
            <span>{intern.nim}</span>
          </div>

          <div className="active-intern-position">
            {intern.division}
          </div>

          <div className="active-intern-period">
            {intern.period}
          </div>

          <div>
            <span className="active-intern-status">
              Sedang Berjalan
            </span>
          </div>

        </div>
      ))}
  </div>

</div>

    </section>


    {/* STATUS PENILAIAN */}
    <section className="mitra-content-card">

      <div className="mitra-section-header">
        <h3>Status Penilaian</h3>

        <p>
          Pantau progres penilaian mahasiswa.
        </p>
      </div>


      <div className="evaluation-list">

        {interns.slice(0, 4).map((intern) => {

          const isDone = intern.evaluation === 'Sudah Dinilai';

          return (
            <div
              className="evaluation-item"
              key={intern.id}
            >

              <div className="evaluation-header">

                <div>
                  <h4>{intern.name}</h4>
                  <span>{intern.division}</span>
                </div>

                <span
  className={
    isDone
      ? 'evaluation-status done'
      : 'evaluation-status waiting'
  }
>
  {isDone ? 'SUDAH DINILAI' : 'BELUM DINILAI'}
</span>

              </div>


              <div className="evaluation-progress">

                <div className="progress-step active" />

                <div
                  className={
                    isDone
                      ? 'progress-step active'
                      : 'progress-step'
                  }
                />

              </div>


              <div className="evaluation-labels">
                <span>MAGANG SELESAI</span>
                <span>PENILAIAN</span>
              </div>

            </div>
          );
        })}

      </div>

    </section>

</div>

  {/* PENUTUP DASHBOARD */}
  </div>
  )}

  {/* HALAMAN PENILAIAN MAHASISWA */}
  {activeMenu === "penilaian" && (
  <PenilaianMahasiswa
    interns={interns}
  />
)}

{activeMenu === "riwayat" && (
  <RiwayatMahasiswa />
)}

</main>

      </div>
    </div>
  );
};

export default MitraDashboard;