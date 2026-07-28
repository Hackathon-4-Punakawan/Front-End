import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Users, BookOpen, Clock, FileText, ClipboardList,
  CheckCircle2, AlertCircle, Bell, ChevronLeft, ChevronRight,
  LayoutDashboard, Search, X, Building2, User, FileCheck, CheckCircle, XCircle,
  Send, Award, Download, ExternalLink, Lock, BarChart2, RefreshCcw,
  Star, BookMarked, GraduationCap, Filter, Eye, Edit3, ChevronDown, ChevronUp,
  AlertTriangle, Hourglass
} from 'lucide-react';
import amikomLogo from '../../../assets/amikom.png';
import unikaLogo from '../../../assets/unika-logo.svg';
import {
  getDosenDashboardStatsApi,
  getDosenMahasiswaListApi,
  getDosenMahasiswaDetailApi,
  dosenReviewKonversiApi,
} from '../../../services/dosenService';

// ─── Helper: Grade Calc ──────────────────────────────────────────────────────
const calcGrade = (n) => {
  const v = parseFloat(n);
  if (isNaN(v)) return '-';
  if (v >= 81) return 'A';
  if (v >= 61) return 'B';
  if (v >= 41) return 'C';
  if (v >= 21) return 'D';
  return 'E';
};

// ─── Status Color Helpers ─────────────────────────────────────────────────────
const statusStyle = (status = '') => {
  const s = status.toLowerCase();
  if (s.includes('disetujui') || s.includes('acc')) return { color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' };
  if (s.includes('revisi')) return { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
  if (s.includes('menunggu') || s.includes('pending') || s.includes('review')) return { color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' };
  return { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };
};

// ═══════════════════════════════════════════════════════════════════════════════
// DosenDashboard Component
// ═══════════════════════════════════════════════════════════════════════════════
const DosenDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  // ── State ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'mahasiswa' | 'logbook'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // API data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null); // detail modal
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Review Modal
  const [reviewModal, setReviewModal] = useState({ show: false, item: null, nim: '' });
  const [reviewAction, setReviewAction] = useState('ACC');
  const [reviewCatatan, setReviewCatatan] = useState('');
  const [reviewNilai, setReviewNilai] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Alert
  const [customAlert, setCustomAlert] = useState({ show: false, title: '', message: '', type: 'info' });
  const triggerAlert = (title, message, type = 'info') => setCustomAlert({ show: true, title, message, type });

  // ── Fetch Data ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!token) return;
    setIsLoadingStats(true);
    try {
      const res = await getDosenDashboardStatsApi(token);
      if (res.success && res.data) setDashboardStats(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoadingStats(false); }
  }, [token]);

  const fetchMahasiswaList = useCallback(async () => {
    if (!token) return;
    setIsLoadingList(true);
    try {
      const res = await getDosenMahasiswaListApi(token, { search: searchQuery, status_konversi: filterStatus });
      if (res.success && res.data) setMahasiswaList(res.data.mahasiswa || []);
    } catch (err) { console.error(err); }
    finally { setIsLoadingList(false); }
  }, [token, searchQuery, filterStatus]);

  const fetchMahasiswaDetail = useCallback(async (nim) => {
    if (!token || !nim) return;
    setIsLoadingDetail(true);
    try {
      const res = await getDosenMahasiswaDetailApi(token, nim);
      if (res.success && res.data) setSelectedMahasiswa(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoadingDetail(false); }
  }, [token]);

  // Fetch on mount
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Fetch list when tab opens or filter changes
  useEffect(() => {
    if (activeTab === 'mahasiswa') fetchMahasiswaList();
  }, [activeTab, fetchMahasiswaList]);

  // Debounce search
  useEffect(() => {
    if (activeTab !== 'mahasiswa') return;
    const t = setTimeout(() => fetchMahasiswaList(), 350);
    return () => clearTimeout(t);
  }, [searchQuery, filterStatus]);

  // ── Submit Review ─────────────────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewAction === 'REVISI' && !reviewCatatan.trim()) {
      triggerAlert('Validasi Gagal', 'Catatan / keterangan revisi wajib diisi ketika meminta revisi.', 'warning');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const payload = {
        id_item_konversi: reviewModal.item?.id_item,
        nim: reviewModal.nim,
        action: reviewAction,
        catatan_dosen: reviewCatatan.trim() || undefined,
        nilai_angka: reviewNilai ? parseFloat(reviewNilai) : undefined,
        nilai_huruf: reviewNilai ? calcGrade(reviewNilai) : undefined,
      };
      const res = await dosenReviewKonversiApi(token, payload);
      if (res.success) {
        triggerAlert('Review Berhasil ✅', res.message || `Konversi berhasil di-${reviewAction}.`, 'success');
        setReviewModal({ show: false, item: null, nim: '' });
        setReviewCatatan('');
        setReviewNilai('');
        // Refresh detail if open
        if (selectedMahasiswa?.mahasiswa?.nim === reviewModal.nim) {
          fetchMahasiswaDetail(reviewModal.nim);
        }
        fetchMahasiswaList();
        fetchStats();
      } else {
        triggerAlert('Review Gagal', res.message || 'Terjadi kesalahan.', 'error');
      }
    } catch (err) {
      triggerAlert('Error', 'Gagal terhubung ke server.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // ── Stats shorthand ───────────────────────────────────────────────────────
  const stats = dashboardStats;
  const ringkasan = stats?.ringkasan_konversi || {};

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      display: 'flex', minHeight: '100vh', width: '100%',
      background: '#fdfcff', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      color: '#0f172a', position: 'relative'
    }}>

      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside style={{
        width: isSidebarCollapsed ? '72px' : '260px',
        background: '#ffffff', borderRight: '1px solid #e9e2f2',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)', zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid #f6f1fb', display: 'flex', alignItems: 'center', gap: '10px', minHeight: '72px' }}>
          <img src={unikaLogo} alt="UNIKA" style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }} />
          {!isSidebarCollapsed && (
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#B432F2' }}>UNIKA.IN</h4>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px' }}>DOSEN DPL</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { key: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
            { key: 'mahasiswa', icon: <Users size={18} />, label: 'Mahasiswa Bimbingan' },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '12px', border: 'none',
                background: activeTab === key ? 'linear-gradient(135deg, #f3e8ff, #ede9fe)' : 'transparent',
                color: activeTab === key ? '#B432F2' : '#64748b',
                fontWeight: activeTab === key ? '700' : '500',
                fontSize: '14px', cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden'
              }}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {!isSidebarCollapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #f6f1fb' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '12px', border: 'none',
              background: 'transparent', color: '#ef4444',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              width: '100%', textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        style={{
          position: 'fixed', left: isSidebarCollapsed ? '58px' : '246px', top: '22px',
          width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: '#ffffff', border: '1px solid #e9e2f2',
          boxShadow: '0 2px 8px rgba(180,50,242,0.2)', color: '#B432F2',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 110, transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #f1f5f9',
          padding: '0 32px', height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={amikomLogo} alt="Amikom" style={{ height: '38px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#B432F2' }}>UNIVERSITAS AMIKOM</div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1.5px' }}>YOGYAKARTA</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
              borderRadius: '10px', padding: '6px 14px',
              fontSize: '12px', fontWeight: '700', color: '#7c3aed'
            }}>
              👨‍🏫 Dosen Pembimbing Lapangan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '800', fontSize: '14px'
              }}>
                {(stats?.dosen?.nama || currentUser?.name || 'D')[0]}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                  {stats?.dosen?.nama || currentUser?.name || 'Dosen DPL'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  NIDN: {stats?.dosen?.nidn || '-'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* ═══ TAB 1: DASHBOARD OVERVIEW ═══════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                  Dashboard DPL
                </h1>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                  Selamat datang, <strong>{stats?.dosen?.nama || currentUser?.name || 'Dosen DPL'}</strong>. Pantau mahasiswa bimbingan & review konversi SKS.
                </p>
              </div>

              {isLoadingStats ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
                  <RefreshCcw size={32} style={{ animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Memuat dashboard...</div>
                  <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                    {[
                      { label: 'Total Mahasiswa', val: stats?.total_mahasiswa_ampu ?? 0, color: '#B432F2', bg: '#f8ebff', icon: <Users size={22} /> },
                      { label: 'Perlu Review', val: ringkasan.total_perlu_review ?? 0, color: '#6366f1', bg: '#eef2ff', icon: <Hourglass size={22} /> },
                      { label: 'Disetujui', val: ringkasan.total_disetujui ?? 0, color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={22} /> },
                      { label: 'Perlu Revisi', val: ringkasan.total_revisi ?? 0, color: '#f59e0b', bg: '#fffbeb', icon: <AlertTriangle size={22} /> },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: '#fff', borderRadius: '18px', padding: '20px 22px',
                        border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        display: 'flex', alignItems: 'center', gap: '16px'
                      }}>
                        <div style={{
                          width: '50px', height: '50px', borderRadius: '14px',
                          background: s.bg, color: s.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>{s.icon}</div>
                        <div>
                          <div style={{ fontSize: '28px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.val}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '3px' }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dosen Profile Card */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #7c3aed, #B432F2)',
                      borderRadius: '20px', padding: '28px 24px', color: '#fff'
                    }}>
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: 'rgba(255,255,255,0.2)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px', fontWeight: '900', marginBottom: '16px'
                      }}>
                        {(stats?.dosen?.nama || 'D')[0]}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>
                        {stats?.dosen?.nama || '-'}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>
                        NIDN: {stats?.dosen?.nidn || '-'}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.75, marginBottom: '16px' }}>
                        {stats?.dosen?.bidang_keahlian || '-'}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.85 }}>
                        📧 {stats?.dosen?.email || '-'}
                      </div>
                      <button
                        onClick={() => setActiveTab('mahasiswa')}
                        style={{
                          marginTop: '20px', padding: '10px 20px', borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                          color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        <Users size={14} /> Lihat Mahasiswa Bimbingan
                      </button>
                    </div>

                    {/* Ringkasan Mahasiswa */}
                    <div style={{
                      background: '#fff', borderRadius: '20px', padding: '24px',
                      border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} color="#B432F2" />
                        Ringkasan Mahasiswa Semester {stats?.filter_semester || 6}
                      </div>
                      {(stats?.mahasiswa_ampu_ringkasan || []).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                          <Users size={36} style={{ marginBottom: '10px', opacity: 0.3 }} />
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>Belum ada mahasiswa bimbingan</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {(stats.mahasiswa_ampu_ringkasan || []).map((m, i) => (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 16px', borderRadius: '12px',
                              background: '#fafbff', border: '1px solid #f1f5f9'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '10px',
                                  background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#B432F2', fontWeight: '800', fontSize: '13px'
                                }}>
                                  {(m.nama || '?')[0]}
                                </div>
                                <div>
                                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{m.nama}</div>
                                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{m.nim} • {m.prodi}</div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>{m.nama_instansi || '-'}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{m.posisi || '-'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ TAB 2: MAHASISWA BIMBINGAN ═══════════════════════════════════ */}
          {activeTab === 'mahasiswa' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>

              {/* Page Heading */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Mahasiswa Bimbingan</h1>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                    Daftar mahasiswa yang Anda ampui — lihat detail, review, dan ACC/Revisi konversi SKS.
                  </p>
                </div>
                <button
                  onClick={fetchMahasiswaList}
                  disabled={isLoadingList}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: '#f8f9fa', border: '1px solid #e9e2f2',
                    color: '#64748b', fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  <RefreshCcw size={14} style={isLoadingList ? { animation: 'spin 0.8s linear infinite' } : {}} />
                  Refresh
                </button>
              </div>

              {/* Search & Filter */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Cari nama, NIM, atau instansi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px 10px 36px',
                      borderRadius: '12px', border: '1.5px solid #e9e2f2',
                      fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                      boxSizing: 'border-box', background: '#fff'
                    }}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '10px 14px', borderRadius: '12px',
                    border: '1.5px solid #e9e2f2', fontSize: '13px',
                    fontFamily: 'inherit', outline: 'none', background: '#fff',
                    color: '#374151', cursor: 'pointer'
                  }}
                >
                  <option value="">Semua Status</option>
                  <option value="Menunggu Review DPL">Menunggu Review DPL</option>
                  <option value="Disetujui DPL">Disetujui DPL</option>
                  <option value="Revisi DPL">Revisi DPL</option>
                </select>
              </div>

              {/* List */}
              {isLoadingList ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  <RefreshCcw size={28} style={{ animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
                  <div style={{ fontWeight: '600' }}>Memuat daftar mahasiswa...</div>
                </div>
              ) : mahasiswaList.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px', background: '#fff',
                  borderRadius: '20px', border: '1px solid #f1f5f9'
                }}>
                  <Users size={48} style={{ color: '#e2e8f0', marginBottom: '14px' }} />
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#94a3b8' }}>Belum ada mahasiswa bimbingan</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {mahasiswaList.map((mhs, idx) => {
                    const konvStatus = mhs.konversi_sks?.status_konversi || '';
                    const st = statusStyle(konvStatus);
                    return (
                      <div key={mhs.nim || idx} style={{
                        background: '#fff', borderRadius: '18px', padding: '20px 24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '16px', flexWrap: 'wrap',
                        borderLeft: `4px solid ${st.color}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '900', fontSize: '18px', color: '#B432F2', flexShrink: 0
                          }}>
                            {(mhs.nama || '?')[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>{mhs.nama}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{mhs.nim} • {mhs.prodi} • Angkatan {mhs.angkatan}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                              🏢 {mhs.magang?.nama_instansi || '-'} — {mhs.magang?.posisi || '-'}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          {/* Status Badge */}
                          <span style={{
                            padding: '5px 12px', borderRadius: '8px',
                            fontSize: '11px', fontWeight: '700',
                            background: st.bg, color: st.color, border: `1px solid ${st.border}`
                          }}>
                            {konvStatus || 'Belum Konversi'}
                          </span>
                          <span style={{
                            padding: '5px 12px', borderRadius: '8px',
                            fontSize: '11px', fontWeight: '700',
                            background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0'
                          }}>
                            {mhs.konversi_sks?.total_matkul || 0} MK • {mhs.konversi_sks?.total_sks || 0} SKS
                          </span>
                          {/* Detail Button */}
                          <button
                            onClick={() => fetchMahasiswaDetail(mhs.nim)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '8px 16px', borderRadius: '10px',
                              background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                              color: '#fff', fontWeight: '700', fontSize: '12px',
                              border: 'none', cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(180,50,242,0.25)'
                            }}
                          >
                            <Eye size={13} /> Detail & Review
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ══ MODAL: DETAIL MAHASISWA ════════════════════════════════════════════ */}
      {isLoadingDetail && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '40px',
            textAlign: 'center', color: '#94a3b8'
          }}>
            <RefreshCcw size={32} style={{ animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
            <div style={{ fontWeight: '600' }}>Memuat detail mahasiswa...</div>
            <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      )}

      {selectedMahasiswa && !isLoadingDetail && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, padding: '20px'
        }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedMahasiswa(null); }}>
          <div style={{
            background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '960px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)', animation: 'fadeIn 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 28px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #f3e8ff 0%, #fff 100%)',
              borderRadius: '24px 24px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', fontWeight: '900', color: '#fff'
                }}>
                  {(selectedMahasiswa.mahasiswa?.nama || '?')[0]}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b' }}>
                    {selectedMahasiswa.mahasiswa?.nama}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedMahasiswa.mahasiswa?.nim} • {selectedMahasiswa.mahasiswa?.prodi} • {selectedMahasiswa.mahasiswa?.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMahasiswa(null)}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#f1f5f9', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Info Row: Magang + DPL SK */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#B432F2', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={13} /> DATA MAGANG
                  </div>
                  {[
                    ['Instansi', selectedMahasiswa.pengajuan_magang?.nama_instansi],
                    ['Posisi', selectedMahasiswa.pengajuan_magang?.posisi],
                    ['Program', selectedMahasiswa.pengajuan_magang?.jenis_program],
                    ['Durasi', `${selectedMahasiswa.pengajuan_magang?.durasi_bulan || '-'} Bulan`],
                    ['ID Magang', selectedMahasiswa.pengajuan_magang?.id_magang_fakultas],
                  ].map(([k, v]) => (
                    <div key={k} style={{ fontSize: '12px', marginBottom: '5px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '60px' }}>{k}</span>
                      <span style={{ color: '#374151', fontWeight: '600' }}>{v || '-'}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={13} /> PENGAJUAN DPL
                  </div>
                  {[
                    ['SKS Ditempuh', selectedMahasiswa.pengajuan_dpl?.sks_ditempuh],
                    ['Status', selectedMahasiswa.pengajuan_dpl?.status_pengajuan],
                  ].map(([k, v]) => (
                    <div key={k} style={{ fontSize: '12px', marginBottom: '5px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '80px' }}>{k}</span>
                      <span style={{ color: '#374151', fontWeight: '600' }}>{v || '-'}</span>
                    </div>
                  ))}
                  {selectedMahasiswa.pengajuan_dpl?.sk_dpl_url && (
                    <a
                      href={selectedMahasiswa.pengajuan_dpl.sk_dpl_url}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        marginTop: '10px', padding: '6px 12px', borderRadius: '8px',
                        background: '#eef2ff', color: '#6366f1',
                        fontSize: '11px', fontWeight: '700', textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={11} /> Lihat SK DPL
                    </a>
                  )}
                </div>
              </div>

              {/* Konversi SKS Items — Table Layout */}
              <div>
                <div style={{
                  fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookMarked size={16} color="#B432F2" />
                    Usulan Konversi SKS ({selectedMahasiswa.konversi_sks?.total_sks || 0} SKS)
                  </span>
                  {(() => {
                    const st = statusStyle(selectedMahasiswa.konversi_sks?.status_konversi || '');
                    return (
                      <span style={{
                        padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
                        background: st.bg, color: st.color, border: `1px solid ${st.border}`
                      }}>
                        {selectedMahasiswa.konversi_sks?.status_konversi || '-'}
                      </span>
                    );
                  })()}
                </div>

                <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid #e9e2f2' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)' }}>
                        {['No', 'Kode MK', 'Nama Matkul', 'SKS', 'CPMK & Objective', 'Status', 'Nilai', 'Aksi'].map((h, i) => (
                          <th key={i} style={{
                            padding: '11px 14px', textAlign: 'left', fontWeight: '800',
                            color: '#7c3aed', fontSize: '11px', letterSpacing: '0.3px',
                            whiteSpace: 'nowrap', borderBottom: '1.5px solid #ddd6fe'
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedMahasiswa.konversi_sks?.items_konversi || []).map((item, i) => {
                        const ist = statusStyle(item.status_step || '');
                        return (
                          <tr key={item.id_item || i} style={{
                            background: i % 2 === 0 ? '#fff' : '#fdfbff',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'background 0.15s'
                          }}>
                            {/* No */}
                            <td style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: '700', width: '36px' }}>
                              {i + 1}
                            </td>
                            {/* Kode MK */}
                            <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                              <span style={{
                                background: '#f3e8ff', color: '#7c3aed',
                                padding: '3px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '11px'
                              }}>{item.kode_mk || '-'}</span>
                            </td>
                            {/* Nama MK */}
                            <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b', minWidth: '160px' }}>
                              {item.nama_mk || '-'}
                            </td>
                            {/* SKS */}
                            <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <span style={{
                                background: '#ede9fe', color: '#6d28d9',
                                padding: '3px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '11px'
                              }}>{item.sks || '-'}</span>
                            </td>
                            {/* CPMK & Objective */}
                            <td style={{ padding: '12px 14px', color: '#475569', lineHeight: '1.5', minWidth: '220px' }}>
                              {item.cpmk && (
                                <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', marginBottom: '3px' }}>
                                  {item.cpmk}
                                </div>
                              )}
                              <div style={{ fontSize: '11px', color: '#64748b' }}>
                                {item.objective || '-'}
                              </div>
                              {item.catatan_dosen && (
                                <div style={{
                                  marginTop: '4px', fontSize: '11px', color: '#059669',
                                  fontStyle: 'italic'
                                }}>
                                  💬 {item.catatan_dosen}
                                </div>
                              )}
                            </td>
                            {/* Status */}
                            <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                              <span style={{
                                background: ist.bg, color: ist.color, border: `1px solid ${ist.border}`,
                                borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '700',
                                display: 'inline-block'
                              }}>
                                {item.status_step || 'Menunggu Review'}
                              </span>
                            </td>
                            {/* Nilai */}
                            <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                              {item.nilai_angka ? (
                                <span style={{
                                  background: '#fef9ee', color: '#d97706', border: '1px solid #fde68a',
                                  borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '800'
                                }}>
                                  {item.nilai_angka} ({item.nilai_huruf || calcGrade(item.nilai_angka)})
                                </span>
                              ) : (
                                <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>
                              )}
                            </td>
                            {/* Aksi */}
                            <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => {
                                  setReviewModal({ show: true, item, nim: selectedMahasiswa.mahasiswa?.nim });
                                  setReviewAction('ACC');
                                  setReviewCatatan(item.catatan_dosen || '');
                                  setReviewNilai(item.nilai_angka?.toString() || '');
                                }}
                                style={{
                                  padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
                                  background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                                  color: '#fff', border: 'none', cursor: 'pointer',
                                  boxShadow: '0 2px 8px rgba(180,50,242,0.25)'
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: REVIEW KONVERSI ════════════════════════════════════════════ */}
      {reviewModal.show && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '22px', width: '100%', maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              padding: '22px 26px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} color="#B432F2" />
                Review Konversi SKS
              </h3>
              <button
                onClick={() => setReviewModal({ show: false, item: null, nim: '' })}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* MK Info */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
                <strong>{reviewModal.item?.kode_mk}</strong> — {reviewModal.item?.nama_mk}
                <span style={{
                  marginLeft: '8px', fontSize: '11px', fontWeight: '700',
                  background: '#f3e8ff', color: '#B432F2', padding: '2px 8px', borderRadius: '6px'
                }}>{reviewModal.item?.sks} SKS</span>
              </div>

              {/* Action Select */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>Aksi DPL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ACC', 'REVISI'].map(a => (
                    <button
                      key={a} type="button"
                      onClick={() => setReviewAction(a)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                        border: reviewAction === a ? 'none' : '1.5px solid #e9e2f2',
                        background: reviewAction === a
                          ? (a === 'ACC' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)')
                          : '#fff',
                        color: reviewAction === a ? '#fff' : '#64748b'
                      }}
                    >
                      {a === 'ACC' ? '✅ ACC (Setujui)' : '⚠️ Minta Revisi'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nilai (opsional) */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Nilai Angka (Opsional — ACC saja)
                </label>
                <input
                  type="number" min="0" max="100" step="0.5"
                  placeholder="Contoh: 90"
                  value={reviewNilai}
                  onChange={(e) => setReviewNilai(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #e9e2f2', fontSize: '13px',
                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                  }}
                />
                {reviewNilai && (
                  <div style={{ fontSize: '11px', color: '#B432F2', marginTop: '4px' }}>
                    Nilai Huruf: {calcGrade(reviewNilai)}
                  </div>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Catatan Dosen {reviewAction === 'REVISI' && <span style={{ color: '#ef4444' }}>* (Wajib saat Revisi)</span>}
                </label>
                <textarea
                  rows={3}
                  placeholder={reviewAction === 'REVISI'
                    ? 'Harap perjelas objective dan CPMK mata kuliah ini...'
                    : 'Keterangan tambahan (opsional)...'}
                  value={reviewCatatan}
                  onChange={(e) => setReviewCatatan(e.target.value)}
                  required={reviewAction === 'REVISI'}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #e9e2f2', fontSize: '13px',
                    fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setReviewModal({ show: false, item: null, nim: '' })}
                  style={{
                    padding: '10px 20px', borderRadius: '10px',
                    background: '#f1f5f9', border: 'none', color: '#64748b',
                    fontWeight: '600', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', borderRadius: '10px', border: 'none',
                    background: isSubmittingReview ? '#c4b5d9'
                      : reviewAction === 'ACC' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff', fontWeight: '700', fontSize: '13px',
                    cursor: isSubmittingReview ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                >
                  {isSubmittingReview
                    ? <><RefreshCcw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Menyimpan...</>
                    : <><Send size={14} /> {reviewAction === 'ACC' ? 'ACC Konversi' : 'Kirim Revisi'}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ CUSTOM ALERT MODAL ═══════════════════════════════════════════════ */}
      {customAlert.show && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 700
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '36px 32px', maxWidth: '400px', width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)', textAlign: 'center', animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: customAlert.type === 'success' ? '#ecfdf5'
                : customAlert.type === 'error' ? '#fef2f2'
                : customAlert.type === 'warning' ? '#fffbeb' : '#eef2ff',
              color: customAlert.type === 'success' ? '#10b981'
                : customAlert.type === 'error' ? '#ef4444'
                : customAlert.type === 'warning' ? '#f59e0b' : '#6366f1'
            }}>
              {customAlert.type === 'success' ? <CheckCircle size={30} />
                : customAlert.type === 'error' ? <XCircle size={30} />
                : <AlertTriangle size={30} />}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px' }}>{customAlert.title}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 22px', lineHeight: 1.6 }}>{customAlert.message}</p>
            <button
              onClick={() => setCustomAlert(p => ({ ...p, show: false }))}
              style={{
                padding: '11px 28px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #B432F2, #7c3aed)',
                color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer'
              }}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DosenDashboard;
