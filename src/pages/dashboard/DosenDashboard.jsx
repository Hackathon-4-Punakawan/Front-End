import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, BookOpen, Clock, FileText, ClipboardList, CheckCircle2, AlertCircle, Bell, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import amikomLogo from '../../assets/amikom.png';

const DosenDashboard = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data bimbingan mahasiswa
  const students = [
    { id: 1, nim: '22.11.4321', name: 'Budi Santoso', company: 'Google Indonesia', program: 'Cloud Engineering', logbookStatus: 'Perlu Review', pendingConversations: 2 },
    { id: 2, nim: '22.11.4300', name: 'Dewi Lestari', company: 'PT. Telekomunikasi Indonesia', program: 'Network Engineer', logbookStatus: 'Disetujui', pendingConversations: 0 },
    { id: 3, nim: '22.11.4288', name: 'Rian Hidayat', company: 'Tokopedia', program: 'Data Analyst', logbookStatus: 'Perlu Review', pendingConversations: 1 },
    { id: 4, nim: '22.11.4215', name: 'Siti Aminah', company: 'Traveloka', program: 'Software Quality Assurance', logbookStatus: 'Disetujui', pendingConversations: 0 },
    { id: 5, nim: '22.11.4190', name: 'Fajar Nugraha', company: 'Gojek', program: 'Product Management', logbookStatus: 'Belum Kumpul', pendingConversations: 3 },
  ];

  const getLogbookStyle = (status) => {
    switch (status) {
      case 'Disetujui': return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'Perlu Review': return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
      default: return { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5' };
    }
  };

  return (
    <div className="custom-dashboard-container fade-in">
      {/* 1. Left Sidebar */}
      <aside className={`custom-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#B432F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
            {!isSidebarCollapsed && <span className="section-title">DOSEN</span>}
            <button className="nav-item active">
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Dashboard</span>}
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

          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{currentUser?.name}</span>
              <span className="user-role-badge">{getRoleLabel(currentUser?.role)}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content" style={{ maxWidth: '100%', margin: '0', padding: '32px' }}>
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2 className="welcome-title">Selamat Datang, {currentUser?.name}!</h2>
          <p className="welcome-desc">
            NIDN Anda: <strong>{currentUser?.identity}</strong> | Dosen Pembimbing Lapangan. Silakan kelola bimbingan, verifikasi logbook bulanan, dan rekomendasikan konversi sks mahasiswa.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">12</span>
              <span className="stat-label">Mahasiswa Bimbingan</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">5 Laporan</span>
              <span className="stat-label">Logbook Perlu Review</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">6 Usulan</span>
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
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>MAHASISWA</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>MITRA INDUSTRI</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>LOGBOOK</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>USULAN KULIAH</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const logStyle = getLogbookStyle(student.logbookStatus);
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{student.name}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{student.nim}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px' }}>{student.company}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{student.program}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
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
                        <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>
                          {student.pendingConversations > 0 ? (
                            <span style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                              {student.pendingConversations} Usulan
                            </span>
                          ) : (
                            <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600' }}>Sudah Diverifikasi</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => alert(`Membuka modal review untuk mahasiswa: ${student.name}`)}
                            style={{
                              background: 'var(--primary)',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
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

          {/* Sidebar */}
          <section className="sidebar-panel">
            <h3 className="panel-title">
              <Bell size={20} className="text-primary" />
              Notifikasi Pembimbing
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="list-item">
                <div className="item-bullet"></div>
                <div className="item-content">
                  <span className="item-title">Logbook Dikirim</span>
                  <span className="item-desc">Budi Santoso mengunggah laporan logbook untuk minggu ke-5.</span>
                </div>
              </div>

              <div className="list-item">
                <div className="item-bullet" style={{ background: '#d97706' }}></div>
                <div className="item-content">
                  <span className="item-title">Evaluasi Tengah Program</span>
                  <span className="item-desc">Diharapkan mengisi evaluasi mahasiswa bimbingan sebelum tanggal 30 Juli.</span>
                </div>
              </div>

              <div className="list-item">
                <div className="item-bullet" style={{ background: '#4b5563' }}></div>
                <div className="item-content">
                  <span className="item-title">Persetujuan Industri</span>
                  <span className="item-desc">Mitra Tokopedia memverifikasi kehadiran magang Rian Hidayat.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      </div>
    </div>
  );
};

export default DosenDashboard;
