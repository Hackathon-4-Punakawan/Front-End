import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building, ShieldCheck, FileCheck2, BarChart2, Star, CheckCircle, Clock, Bell, ChevronLeft, ChevronRight, LayoutDashboard, Search } from 'lucide-react';
import amikomLogo from '../../assets/amikom.png';
import unikaLogo from '../../assets/unika-logo.svg';

const MitraDashboard = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data mahasiswa magang di perusahaan Mitra
  const interns = [
    { id: 1, nim: '22.11.4321', name: 'Budi Santoso', division: 'Cloud Infrastructure', attendance: '98%', evaluation: 'Sudah Dinilai', score: 'A' },
    { id: 2, nim: '22.11.4312', name: 'Arief Kurniawan', division: 'Backend Development', attendance: '96%', evaluation: 'Perlu Evaluasi', score: '-' },
    { id: 3, nim: '22.11.4299', name: 'Sonia Clarissa', division: 'UI/UX Design', attendance: '100%', evaluation: 'Sudah Dinilai', score: 'A+' },
    { id: 4, nim: '22.11.4111', name: 'Rendra Pramudya', division: 'Frontend Web Dev', attendance: '90%', evaluation: 'Perlu Evaluasi', score: '-' },
  ];

  return (
    <div className="custom-dashboard-container purple-gradient-theme fade-in">
      {/* 1. Left Sidebar */}
      <aside className={`custom-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={unikaLogo} alt="UNIKA Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
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
            {!isSidebarCollapsed && <span className="section-title">MITRA</span>}
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

          <div className="header-actions">
            <button className="icon-btn" onClick={() => alert('Pencarian modul...')}>
              <Search size={20} />
            </button>
            <div className="notification-wrapper">
              <button className="icon-btn" onClick={() => alert('Membuka panel notifikasi...')}>
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>
            </div>
            
            <div className="profile-badge">
              <div className="profile-info">
                <span className="profile-name">{currentUser?.name || 'Google Indonesia'}</span>
                <span className="profile-role">{currentUser?.identity || 'MITRA-GOOG'}</span>
              </div>
              <div className="profile-avatar">
                {currentUser?.name ? currentUser.name.charAt(0) : 'M'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content" style={{ maxWidth: '100%', margin: '0', padding: '32px' }}>
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2 className="welcome-title">Mitra Portal - {currentUser?.name}</h2>
          <p className="welcome-desc">
            ID Mitra: <strong>{currentUser?.identity}</strong> | Partner Industri Pendidikan. Evaluasi kinerja mahasiswa, kelola kuota magang industri, dan tinjau logbook harian/mingguan mereka.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Building size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">25 Kuota</span>
              <span className="stat-label">Total Kapasitas Magang</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">18 Orang</span>
              <span className="stat-label">Mahasiswa Aktif</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FileCheck2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">76% Lulus</span>
              <span className="stat-label">Konversi Kehadiran</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <BarChart2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">2 Perlu</span>
              <span className="stat-label">Evaluasi Kinerja</span>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <div className="info-grid">
          {/* Main Panel */}
          <section className="main-panel">
            <h3 className="panel-title">
              <Star size={20} className="text-primary" />
              Daftar Peserta Magang Aktif
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>MAHASISWA</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>DIVISI KERJA</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>KEHADIRAN</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>EVALUASI AKHIR</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>NILAI</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.map((intern) => (
                    <tr key={intern.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{intern.name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{intern.nim}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px' }}>{intern.division}</td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>{intern.attendance}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: intern.evaluation === 'Sudah Dinilai' ? '#ecfdf5' : '#fffbeb',
                          color: intern.evaluation === 'Sudah Dinilai' ? '#059669' : '#d97706',
                          border: intern.evaluation === 'Sudah Dinilai' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}>
                          {intern.evaluation === 'Sudah Dinilai' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {intern.evaluation}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '700', color: intern.score !== '-' ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {intern.score}
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => alert(`Mengisi formulir evaluasi untuk: ${intern.name}`)}
                          style={{
                            background: intern.evaluation === 'Sudah Dinilai' ? 'transparent' : 'var(--primary)',
                            color: intern.evaluation === 'Sudah Dinilai' ? 'var(--primary)' : 'white',
                            border: intern.evaluation === 'Sudah Dinilai' ? '1px solid var(--primary)' : 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          {intern.evaluation === 'Sudah Dinilai' ? 'Edit Nilai' : 'Beri Nilai'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sidebar */}
          <section className="sidebar-panel">
            <h3 className="panel-title">
              <Bell size={20} className="text-primary" />
              Notifikasi Mitra
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="list-item">
                <div className="item-bullet"></div>
                <div className="item-content">
                  <span className="item-title">Sesi Sinkronisasi Akademik</span>
                  <span className="item-desc">Rapat koordinasi kurikulum bersama Kaprodi Amikom pada 29 Juli 2026.</span>
                </div>
              </div>

              <div className="list-item">
                <div className="item-bullet" style={{ background: '#d97706' }}></div>
                <div className="item-content">
                  <span className="item-title">Penyerahan Sertifikat</span>
                  <span className="item-desc">Mohon persiapkan draf sertifikat kelulusan magang untuk periode ini.</span>
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

export default MitraDashboard;
