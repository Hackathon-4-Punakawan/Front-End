import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, CheckSquare, Layers, Award, FileSpreadsheet, Check, X, Bell, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import amikomLogo from '../../assets/amikom.png';

const KaprodiDashboard = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data usulan konversi mata kuliah untuk disetujui Kaprodi
  const [proposals, setProposals] = useState([
    { id: 1, nim: '22.11.4321', name: 'Budi Santoso', company: 'Google Indonesia', subjectsCount: 2, totalSks: 8, status: 'Menunggu Persetujuan' },
    { id: 2, nim: '22.11.4302', name: 'Alif Pratama', division: 'Apple Developer Academy', company: 'Apple Inc.', subjectsCount: 4, totalSks: 16, status: 'Menunggu Persetujuan' },
    { id: 3, nim: '22.11.4299', name: 'Sonia Clarissa', company: 'Google Indonesia', subjectsCount: 3, totalSks: 12, status: 'Disetujui' },
    { id: 4, nim: '22.11.4288', name: 'Rian Hidayat', company: 'Tokopedia', subjectsCount: 3, totalSks: 9, status: 'Menunggu Persetujuan' },
  ]);

  const handleApprove = (id) => {
    setProposals((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, status: 'Disetujui' } : prop))
    );
    alert('Usulan konversi mata kuliah berhasil disetujui!');
  };

  const handleReject = (id) => {
    setProposals((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, status: 'Ditolak' } : prop))
    );
    alert('Usulan konversi mata kuliah ditolak.');
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
            {!isSidebarCollapsed && <span className="section-title">KAPRODI</span>}
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
          <h2 className="welcome-title">Kaprodi Portal - {currentUser?.name}</h2>
          <p className="welcome-desc">
            NIDN Kaprodi: <strong>{currentUser?.identity}</strong> | Kepala Program Studi Informatika. Validasi dan setujui seluruh hasil konversi mata kuliah mahasiswa yang mengikuti program MSIB.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <GraduationCap size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">148 Orang</span>
              <span className="stat-label">Mahasiswa Magang</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <CheckSquare size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {proposals.filter((p) => p.status === 'Menunggu Persetujuan').length} Pending
              </span>
              <span className="stat-label">Usulan Perlu Persetujuan</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Layers size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">15 Mitra</span>
              <span className="stat-label">Mitra Industri Aktif</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">98.2%</span>
              <span className="stat-label">Rasio Kelulusan Konversi</span>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <div className="info-grid">
          {/* Main Panel */}
          <section className="main-panel">
            <h3 className="panel-title">
              <FileSpreadsheet size={20} className="text-primary" />
              Verifikasi Kelayakan Konversi SKS (Kaprodi)
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>MAHASISWA</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>MITRA INDUSTRI</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>JUMLAH MATKUL</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>TOTAL SKS</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>STATUS</th>
                    <th style={{ padding: '12px 8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>AKSI PERSETUJUAN</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((prop) => (
                    <tr key={prop.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{prop.name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{prop.nim}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px' }}>{prop.company}</td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>{prop.subjectsCount} Mata Kuliah</td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>{prop.totalSks} SKS</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: prop.status === 'Disetujui' ? '#ecfdf5' : prop.status === 'Ditolak' ? '#fef2f2' : '#fffbeb',
                          color: prop.status === 'Disetujui' ? '#059669' : prop.status === 'Ditolak' ? '#b91c1c' : '#d97706',
                          border: prop.status === 'Disetujui' ? '1px solid #a7f3d0' : prop.status === 'Ditolak' ? '1px solid #fca5a5' : '1px solid #fde68a'
                        }}>
                          {prop.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                        {prop.status === 'Menunggu Persetujuan' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleApprove(prop.id)}
                              style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              <Check size={14} /> Setuju
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(prop.id)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              <X size={14} /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Selesai Diproses</span>
                        )}
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
              Notifikasi Kaprodi
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="list-item">
                <div className="item-bullet"></div>
                <div className="item-content">
                  <span className="item-title">Mitra Industri Baru</span>
                  <span className="item-desc">PT Tokopedia mengajukan kerjasama program magang mahasiswa informatika.</span>
                </div>
              </div>

              <div className="list-item">
                <div className="item-bullet" style={{ background: '#d97706' }}></div>
                <div className="item-content">
                  <span className="item-title">Update Panduan MSIB</span>
                  <span className="item-desc">Kementerian Ristekdikti merilis juknis konversi 20 SKS yang baru.</span>
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

export default KaprodiDashboard;
