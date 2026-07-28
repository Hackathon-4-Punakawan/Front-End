import React, { useState, useEffect } from 'react';
import { getKonversiCatalogApi, getAiRecommendationApi, submitKonversiMatkulApi } from '../../../services/konversiMatkulService';
import {
  GraduationCap, AlertCircle, Plus, Trash2, Save,
  CheckCircle2, BookOpen, Clock, FileText, ClipboardList,
  ArrowLeft, Search, ShieldCheck, Mail, Calendar, Briefcase,
  Send, Sparkles
} from 'lucide-react';

const PREDEFINED_COURSES = [
  { id: 'IF184523', code: 'IF184523', name: 'Pengembangan Aplikasi Web Lanjut', sks: 4, cpmk: 'Mampu merancang dan mengimplementasikan arsitektur web modern yang scalable.' },
  { id: 'IF184524', code: 'IF184524', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, cpmk: 'Mampu merencanakan, mengelola, dan memantau daur hidup pengembangan software.' },
  { id: 'IF184525', code: 'IF184525', name: 'Keamanan Sistem Informasi', sks: 3, cpmk: 'Mampu menganalisis kerentanan keamanan dan menerapkan protokol enkripsi/proteksi.' },
  { id: 'IF184526', code: 'IF184526', name: 'Pembelajaran Mesin (Machine Learning)', sks: 4, cpmk: 'Mampu membangun, melatih, dan mengevaluasi model prediktif cerdas berbasis data.' },
  { id: 'IF184527', code: 'IF184527', name: 'Kecerdasan Buatan (AI)', sks: 3, cpmk: 'Mampu mendesain agen cerdas menggunakan logika heuristik dan jaringan saraf.' },
  { id: 'IF184528', code: 'IF184528', name: 'Desain UI/UX & Interaksi', sks: 3, cpmk: 'Mampu merancang wireframe dan antarmuka interaktif yang memiliki usabilitas tinggi.' },
];

const StatusKonversi = ({
  currentUser,
  idMagangValue,
  onCancel,
  onSubmit,
  triggerAlert,
  conversionState,
  setConversionState,
  approvedProposal,
  suratPengantar,
  suratAkhirSubmitted,
  setSuratAkhirSubmitted
}) => {
  // Local state untuk data input di wizard
  const [rows, setRows] = useState([
    {
      id: 1,
      selectedCourseId: 'IF184523',
      objective: 'Mengembangkan dashboard aplikasi web dengan standardisasi modular.',
      durasi: '6 Bulan',
      nilaiAngka: '',
      selected: false,
    },
    {
      id: 2,
      selectedCourseId: 'IF184524',
      objective: 'Mempraktikkan metodologi Agile Scrum dalam manajemen tim developer.',
      durasi: '6 Bulan',
      nilaiAngka: '',
      selected: false,
    }
  ]);

  // Local state untuk mengedit nilai angka di tab Magang
  const [editableCourses, setEditableCourses] = useState([]);

  // Sinkronkan data edit dengan data di conversionState
  useEffect(() => {
    if (conversionState && conversionState.courses) {
      setEditableCourses(JSON.parse(JSON.stringify(conversionState.courses)));
    }
  }, [conversionState]);

  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const calculateGrade = (angka) => {
    const n = parseFloat(angka);
    if (isNaN(n) || angka === '') return '-';
    if (n >= 80) return 'A';
    if (n >= 75) return 'B+';
    if (n >= 70) return 'B';
    if (n >= 65) return 'C+';
    if (n >= 60) return 'C';
    if (n >= 50) return 'D';
    return 'E';
  };

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, {
      id: newId,
      selectedCourseId: '',
      objective: '',
      durasi: '',
      nilaiAngka: '',
      selected: false
    }]);
  };

  const handleUpdateRow = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setIsSavedSuccessfully(false);
  };

  const handleSelectAll = (checked) => {
    setRows(prev => prev.map(r => ({ ...r, selected: checked })));
  };

  const handleRemoveSelected = () => {
    const selectedCount = rows.filter(r => r.selected).length;
    if (selectedCount === 0) {
      if (triggerAlert) {
        triggerAlert('Hapus Gagal', 'Silakan pilih minimal satu mata kuliah untuk dihapus.', 'warning');
      } else {
        alert('Silakan pilih minimal satu mata kuliah untuk dihapus.');
      }
      return;
    }
    setRows(prev => prev.filter(r => !r.selected));
    setIsSavedSuccessfully(false);
    if (triggerAlert) {
      triggerAlert('Berhasil Dihapus', `${selectedCount} baris mata kuliah berhasil dibersihkan dari draf.`, 'success');
    }
  };

  const [courseCatalog, setCourseCatalog] = useState(PREDEFINED_COURSES);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  useEffect(() => {
    if (!token) return;
    const fetchCatalog = async () => {
      const res = await getKonversiCatalogApi(token);
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map(c => ({
          id: c.kode_mk,
          code: c.kode_mk,
          name: c.nama_mk,
          sks: c.sks,
          cpmk: Array.isArray(c.cpmk) ? c.cpmk.join('; ') : (c.default_objective || ''),
        }));
        setCourseCatalog(mapped);
      }
    };
    fetchCatalog();
  }, [token]);

  const handleFetchAiRecommendation = async () => {
    if (!token) return;
    setIsLoadingAi(true);
    const res = await getAiRecommendationApi(token);
    setIsLoadingAi(false);

    if (res.success && res.data) {
      const recs = res.data.recommended_courses || res.data.items || [];
      if (recs.length > 0) {
        const mappedRows = recs.map((item, idx) => ({
          id: idx + 1,
          selectedCourseId: item.kode_mk || item.selectedCourseId,
          objective: item.objective || item.default_objective || 'Disesuaikan dengan kompetensi industri.',
          durasi: '6 Bulan',
          nilaiAngka: '',
          selected: false,
        }));
        setRows(mappedRows);
        if (triggerAlert) {
          triggerAlert('Rekomendasi AI Diterapkan', `Berhasil memuat ${mappedRows.length} rekomendasi mata kuliah konversi dari AI!`, 'success');
        }
      }
    } else if (triggerAlert) {
      triggerAlert('AI Konversi', res.message || 'Gagal memuat rekomendasi AI.', 'error');
    }
  };

  const handleSave = async () => {
    const isAnyEmpty = rows.some(r => !r.selectedCourseId || !r.objective || !r.durasi);
    if (isAnyEmpty) {
      if (triggerAlert) {
        triggerAlert('Data Belum Lengkap', 'Harap isi semua kolom pilihan mata kuliah, objective, dan durasi.', 'error');
      } else {
        alert('Harap isi semua kolom pilihan mata kuliah, objective, dan durasi.');
      }
      return;
    }

    setIsSubmitting(true);
    const items = rows.map(r => {
      const course = courseCatalog.find(c => c.id === r.selectedCourseId) || PREDEFINED_COURSES.find(c => c.id === r.selectedCourseId);
      return {
        kode_mk: course?.code || r.selectedCourseId,
        nama_mk: course?.name || r.selectedCourseId,
        sks: course?.sks || 3,
        objective: r.objective,
        durasi: r.durasi,
      };
    });

    const res = await submitKonversiMatkulApi(token, { items });
    setIsSubmitting(false);

    if (res.success) {
      setIsSavedSuccessfully(true);
      if (onSubmit) {
        onSubmit(rows);
      } else if (triggerAlert) {
        triggerAlert('Konversi Disimpan', 'Matriks Konversi SKS Akademik berhasil diajukan dan sedang diverifikasi oleh DPL!', 'success');
      }
    } else if (triggerAlert) {
      triggerAlert('Gagal Mengirim Konversi', res.message || 'Gagal mengajukan tabel konversi SKS.', 'error');
    }
  };

  // Handler untuk mengedit nilai di tab Magang
  const handleEditGrade = (courseIdx, value) => {
    setEditableCourses(prev => {
      const copy = [...prev];
      copy[courseIdx] = { ...copy[courseIdx], nilaiAngka: value };
      return copy;
    });
  };

  // Handler untuk menyimpan hasil edit nilai di tab Magang
  const handleSaveEditedGrades = () => {
    if (setConversionState) {
      setConversionState(prev => ({
        ...prev,
        courses: editableCourses
      }));
      if (triggerAlert) {
        triggerAlert('Nilai Berhasil Disimpan', 'Nilai angka dan huruf untuk konversi SKS Anda berhasil diperbarui!', 'success');
      }
    }
  };

  // Hitung total SKS di wizard
  const totalSKS = rows.reduce((acc, r) => {
    const course = PREDEFINED_COURSES.find(c => c.id === r.selectedCourseId);
    return acc + (course ? course.sks : 0);
  }, 0);

  const allSelected = rows.length > 0 && rows.every(r => r.selected);
  const anySelected = rows.some(r => r.selected);

  // Prefill data untuk form Surat Akhir
  const displayEmail = currentUser?.email || 'student@amikom.ac.id';
  const displayMulai = approvedProposal?.tanggalMulai || suratPengantar?.tanggalMulai || '27 Juli 2026';
  const displaySelesai = approvedProposal?.tanggalSelesai || suratPengantar?.tanggalSelesai || '27 Januari 2027';
  const displayPeriode = suratPengantar?.periodeMagang || '6 Bulan';

  // ─── RENDER MODE 1: WIZARD STEP ──────────────────────────────────────────
  if (onCancel) {
    return (
      <div className="tab-pane fade-in">
        <div className="sk-sticky-header">
          <button className="sk-back-btn" onClick={onCancel}>
            <ArrowLeft size={15} /> Kembali ke Dashboard
          </button>
          <div className="sk-id-chip">
            <CheckCircle2 size={13} />
            ID Magang: <strong>{idMagangValue}</strong>
          </div>
        </div>

        <div className="page-heading-with-btn">
          <div className="page-heading">
            <div className="path-breadcrumbs">
              <span>Home</span> / <span>Dashboard</span> / <span className="active">Konversi SKS</span>
            </div>
            <h1 className="main-title">Konversi SKS Akademik</h1>
            <p className="main-subtitle">
              Pilih mata kuliah yang akan dikonversikan dengan proyek lapangan/magang Anda serta lengkapi capaian pembelajarannya.
            </p>
          </div>
          
          <div className="total-sks-badge">
            <div className="badge-icon-wrap">
              <GraduationCap size={18} />
            </div>
            <div className="badge-text">
              <span className="b-label">TOTAL SKS KONVERSI</span>
              <span className="b-val">{totalSKS} SKS</span>
            </div>
          </div>
        </div>

        <div className="panel-container" style={{ marginTop: '20px', padding: '24px' }}>
          <div className="table-header-action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 className="panel-inner-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
              <ClipboardList size={18} style={{ color: '#B432F2' }} />
              <span>Matriks Konversi Kegiatan MBKM ke Mata Kuliah</span>
            </h3>
            <button className="sk-add-btn" onClick={handleAddRow}>
              <Plus size={14} /> Tambah Mata Kuliah
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-data-table sk-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="sk-checkbox"
                    />
                  </th>
                  <th style={{ width: '120px' }}>KODE MATKUL</th>
                  <th style={{ width: '250px' }}>NAMA MATA KULIAH / CPMK</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>SKS</th>
                  <th>OBJECTIVE (INPUT MANUAL)</th>
                  <th style={{ width: '120px' }}>DURASI</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>NILAI ANGKA (OPSIONAL)</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>NILAI HURUF</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const currentCourse = PREDEFINED_COURSES.find(c => c.id === row.selectedCourseId);
                  return (
                    <tr key={row.id} className={row.selected ? 'sk-row-selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={(e) => handleUpdateRow(row.id, 'selected', e.target.checked)}
                          className="sk-checkbox"
                        />
                      </td>
                      <td className="font-bold" style={{ fontFamily: 'Outfit, monospace', color: '#475569' }}>
                        {currentCourse ? currentCourse.code : <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '500' }}>Otomatis</span>}
                      </td>
                      <td>
                        <select
                          className="sk-select"
                          value={row.selectedCourseId}
                          onChange={(e) => handleUpdateRow(row.id, 'selectedCourseId', e.target.value)}
                        >
                          <option value="">-- Pilih Mata Kuliah --</option>
                          {PREDEFINED_COURSES.map(c => (
                            <option key={c.id} value={c.id}>
                              [{c.code}] {c.name} ({c.sks} SKS)
                            </option>
                          ))}
                        </select>
                        {currentCourse && (
                          <div className="sk-cpmk-box">
                            <strong>CPMK:</strong> {currentCourse.cpmk}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#1e293b' }}>
                        {currentCourse ? `${currentCourse.sks} SKS` : '-'}
                      </td>
                      <td>
                        <textarea
                          className="sk-textarea"
                          value={row.objective}
                          onChange={(e) => handleUpdateRow(row.id, 'objective', e.target.value)}
                          placeholder="Deskripsikan relevansi objective pekerjaan magang..."
                          rows={2}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="sk-input"
                          value={row.durasi}
                          onChange={(e) => handleUpdateRow(row.id, 'durasi', e.target.value)}
                          placeholder="e.g. 6 Bulan"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="sk-input text-center"
                          value={row.nilaiAngka}
                          onChange={(e) => handleUpdateRow(row.id, 'nilaiAngka', e.target.value)}
                          placeholder="Opsional"
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`sk-grade-badge grade-${calculateGrade(row.nilaiAngka).replace(/\+/g, '\\+')}`}>
                          {calculateGrade(row.nilaiAngka)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="sk-action-footer-row">
            <div className="sk-footer-left">
              {anySelected && (
                <button className="sk-delete-btn" onClick={handleRemoveSelected}>
                  <Trash2 size={15} /> Hapus Terpilih
                </button>
              )}
            </div>
            <div className="sk-footer-right">
              {isSavedSuccessfully && (
                <div className="sk-saved-alert">
                  <CheckCircle2 size={14} /> <span>Draf konversi berhasil disimpan!</span>
                </div>
              )}
              <button className="sk-save-btn" onClick={handleSave}>
                <Save size={15} /> Simpan Konversi SKS
              </button>
            </div>
          </div>
        </div>

        {styles}
      </div>
    );
  }

  // ─── RENDER MODE 2: SIDEBAR TAB (MAGANG) ───────────────────────────────────
  const hasConversion = conversionState && conversionState.status !== 'none';
  const isApproved = conversionState?.status === 'DISETUJUI';
  
  const totalApprovedSKS = editableCourses.reduce((acc, r) => {
    const course = PREDEFINED_COURSES.find(c => c.id === r.selectedCourseId);
    return acc + (course ? course.sks : 0);
  }, 0);

  return (
    <div className="tab-pane fade-in">
      <div className="page-heading-with-btn">
        <div className="page-heading">
          <div className="path-breadcrumbs">
            <span>Home</span> / <span>Dashboard</span> / <span className="active">Magang Aktif</span>
          </div>
          <h1 className="main-title">Kelola & Evaluasi Magang</h1>
          <p className="main-subtitle">
            Kirimkan surat akhir magang Anda serta lengkapi penilaian nilai angka/huruf mata kuliah konversi.
          </p>
        </div>
        
        {hasConversion && suratAkhirSubmitted && (
          <div className="total-sks-badge" style={{ 
            background: isApproved ? '#f0fdf4' : '#fffbeb', 
            border: isApproved ? '1.5px solid #bbf7d0' : '1.5px solid #fef08a' 
          }}>
            <div className="badge-icon-wrap" style={{ background: isApproved ? '#16a34a' : '#ca8a04' }}>
              <ShieldCheck size={18} />
            </div>
            <div className="badge-text">
              <span className="b-label" style={{ color: isApproved ? '#15803d' : '#854d0e' }}>
                {isApproved ? 'TOTAL SKS DISETUJUI' : 'TOTAL SKS DIAJUKAN'}
              </span>
              <span className="b-val" style={{ color: isApproved ? '#16a34a' : '#ca8a04' }}>
                {totalApprovedSKS} SKS
              </span>
            </div>
          </div>
        )}
      </div>

      {!hasConversion ? (
        // EMPTY STATE 1: Student has not finished SKS Conversion wizard yet
        <div className="sk-empty-card fade-in">
          <div className="sk-empty-icon-wrap">
            <GraduationCap size={44} />
          </div>
          <h3 className="sk-empty-title">Belum Mengisi Konversi SKS</h3>
          <p className="sk-empty-desc">
            Silakan selesaikan seluruh rangkaian pendaftaran magang hingga **Langkah 5 (Konversi SKS)** di menu **Pengajuan Magang** terlebih dahulu sebelum memproses Surat Akhir.
          </p>
          <div style={{ marginTop: '10px' }}>
            <span className="sk-status-pill none">
              Status Progres: <strong>TAHAPAN BELUM SIAP</strong>
            </span>
          </div>
        </div>
      ) : !suratAkhirSubmitted ? (
        // SUB-STATE: Fill Surat Akhir form first
        <div className="panel-container fade-in" style={{ marginTop: '20px', padding: '32px', maxWidth: '750px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fdf4ff', color: '#B432F2', display: 'inline-flex', alignItems: 'center', justifyContents: 'center', border: '1.5px solid #f3e8ff', marginBottom: '14px', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
              FORM PENGAJUAN SURAT AKHIR DAN UCAPAN TERIMA KASIH
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: '1.5' }}>
              Fakultas Ilmu Komputer Universitas Amikom Yogyakarta. Harap tinjau data otomatis di bawah ini sebelum mengirimkan laporan akhir magang Anda.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div className="sa-form-group">
              <label className="sa-label">Email Mahasiswa</label>
              <div className="sa-readonly-box">
                <Mail size={14} className="sa-icon" />
                <span>{displayEmail}</span>
              </div>
            </div>

            <div className="sa-form-group">
              <label className="sa-label">Periode Magang</label>
              <div className="sa-readonly-box">
                <Briefcase size={14} className="sa-icon" />
                <span>{displayPeriode}</span>
              </div>
            </div>

            <div className="sa-form-group">
              <label className="sa-label">Tanggal Mulai Magang</label>
              <div className="sa-readonly-box">
                <Calendar size={14} className="sa-icon" />
                <span>{displayMulai}</span>
              </div>
            </div>

            <div className="sa-form-group">
              <label className="sa-label">Tanggal Berakhir Magang</label>
              <div className="sa-readonly-box">
                <Calendar size={14} className="sa-icon" />
                <span>{displaySelesai}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button 
              className="sk-save-btn" 
              onClick={() => {
                setSuratAkhirSubmitted(true);
                if (triggerAlert) {
                  triggerAlert('Surat Akhir Dikirim', 'Pengajuan Surat Akhir & Ucapan Terima Kasih berhasil diajukan! Anda sekarang dapat menambahkan nilai.', 'success');
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '13px' }}
            >
              <Send size={15} /> Kirim Pengajuan Surat Akhir
            </button>
          </div>
        </div>
      ) : (
        // POPULATED STATE: Shows editable Conversion Matrix Table
        <div className="conversion-view-layout fade-in" style={{ marginTop: '20px' }}>
          <div className="conversion-left-list" style={{ flex: 1 }}>
            <div className="conversion-main-card" style={{ padding: '24px' }}>
              <div className="main-card-header" style={{ marginBottom: '20px' }}>
                <div className="card-desc-group">
                  <span className="category-text-label" style={{ color: '#B432F2' }}>LAPORAN AKHIR & EVALUASI NILAI</span>
                  <h3 className="internship-title">Matriks Penilaian Konversi SKS</h3>
                  <span className="internship-role">
                    {isApproved ? 'Tervalidasi secara resmi oleh Kaprodi' : 'Laporan Terkirim • Menunggu Verifikasi Penilaian'}
                  </span>
                </div>
                <span className={`status-capsule ${isApproved ? 'badge-green-solid' : 'badge-amber-solid'}`}>
                  {isApproved ? '✓ DISETUJUI' : '⌛ PROSES VALIDASI'}
                </span>
              </div>

              <div className="overall-progress-section" style={{ marginBottom: '24px' }}>
                <span className="progress-title-lbl">VALIDASI AKADEMIK KESELURUHAN</span>
                <div className="progress-slider-wrap">
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${isApproved ? 'fill-green' : 'fill-amber'}`} style={{ width: isApproved ? '100%' : '30%' }}></div>
                  </div>
                  <span className="progress-percentage-lbl" style={{ color: isApproved ? '#16a34a' : '#d97706' }}>
                    {isApproved ? '100%' : '30%'}
                  </span>
                </div>
              </div>

              {/* Visual Timeline Nodes for Overall validation */}
              <div className="horizontal-nodes" style={{ margin: '20px 0 32px', justifyContent: 'space-around' }}>
                <div className="h-node active">
                  <span className="node-circle">✓</span>
                  <span className="node-lbl">Diajukan</span>
                </div>
                
                <div className={`h-node-line ${isApproved ? 'active' : ''}`} style={{ backgroundColor: isApproved ? '#16a34a' : '#e2e8f0', flex: 1, margin: '0 12px' }}></div>
                
                <div className={`h-node ${isApproved ? 'active' : ''}`}>
                  <span className="node-circle">{isApproved ? '✓' : ''}</span>
                  <span className="node-lbl">Validasi Dosen</span>
                </div>
                
                <div className={`h-node-line ${isApproved ? 'active' : ''}`} style={{ backgroundColor: isApproved ? '#16a34a' : '#e2e8f0', flex: 1, margin: '0 12px' }}></div>
                
                <div className={`h-node ${isApproved ? 'active' : ''}`} style={{ color: isApproved ? '#16a34a' : '#64748b' }}>
                  <span className="node-circle" style={{ 
                    backgroundColor: isApproved ? '#16a34a' : '#fff', 
                    borderColor: isApproved ? '#16a34a' : '#cbd5e1' 
                  }}>{isApproved ? '✓' : ''}</span>
                  <span className="node-lbl" style={{ color: isApproved ? '#16a34a' : '#64748b', fontWeight: isApproved ? '700' : '500' }}>Kaprodi ACC</span>
                </div>
                
                <div className={`h-node-line ${isApproved ? 'active' : ''}`} style={{ backgroundColor: isApproved ? '#16a34a' : '#e2e8f0', flex: 1, margin: '0 12px' }}></div>
                
                <div className={`h-node ${isApproved ? 'active' : ''}`} style={{ color: isApproved ? '#16a34a' : '#64748b' }}>
                  <span className="node-circle" style={{ 
                    backgroundColor: isApproved ? '#16a34a' : '#fff', 
                    borderColor: isApproved ? '#16a34a' : '#cbd5e1' 
                  }}>{isApproved ? '✓' : ''}</span>
                  <span className="node-lbl" style={{ color: isApproved ? '#16a34a' : '#64748b', fontWeight: isApproved ? '700' : '500' }}>SK Terbit</span>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 className="detail-section-title" style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                    Matriks Konversi Hasil Kegiatan MBKM (Bisa Di-edit)
                  </h4>
                  <span style={{ fontSize: '11px', color: '#ef4444', background: '#fef2f2', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
                    * Masukkan Nilai Angka Anda di bawah ini
                  </span>
                </div>
                
                <div className="table-responsive">
                  <table className="custom-data-table sk-table">
                    <thead>
                      <tr>
                        <th style={{ width: '120px' }}>KODE MATKUL</th>
                        <th style={{ width: '250px' }}>NAMA MATA KULIAH / CPMK</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>SKS</th>
                        <th>OBJECTIVE (INPUT MANUAL)</th>
                        <th style={{ width: '120px' }}>DURASI</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>NILAI ANGKA</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>NILAI HURUF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableCourses.map((row, idx) => {
                        const course = PREDEFINED_COURSES.find(c => c.id === row.selectedCourseId);
                        if (!course) return null;
                        return (
                          <tr key={idx}>
                            <td className="font-bold" style={{ fontFamily: 'Outfit, monospace', color: '#475569' }}>
                              {course.code}
                            </td>
                            <td>
                              <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>{course.name}</div>
                              <div className="sk-cpmk-box" style={{ marginTop: '6px' }}>
                                <strong>CPMK:</strong> {course.cpmk}
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: '700', color: '#1e293b' }}>
                              {course.sks} SKS
                            </td>
                            <td>
                              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', borderLeft: isApproved ? '3px solid #16a34a' : '3px solid #d97706', fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
                                {row.objective}
                              </div>
                            </td>
                            <td style={{ color: '#475569', fontWeight: '600', fontSize: '12.5px' }}>
                              {row.durasi}
                            </td>
                            <td>
                              <input 
                                type="number" 
                                min="0" 
                                max="100" 
                                className="sk-input text-center" 
                                value={row.nilaiAngka || ''} 
                                onChange={(e) => handleEditGrade(idx, e.target.value)} 
                                placeholder="0-100"
                                style={{ fontWeight: '700', fontSize: '13px', background: '#fffbeb', borderColor: '#fde68a' }}
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`sk-grade-badge grade-${calculateGrade(row.nilaiAngka).replace(/\+/g, '\\+')}`}>
                                {calculateGrade(row.nilaiAngka)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Save Button for editing grades in Tab Magang */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                <button className="sk-save-btn" onClick={handleSaveEditedGrades}>
                  <Save size={15} /> Simpan Nilai Konversi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {styles}
    </div>
  );
};

const styles = (
  <style>{`
    /* Surat Akhir Form styles */
    .sa-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .sa-label {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sa-readonly-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
    }
    .sa-icon {
      color: #94a3b8;
    }

    .sk-sticky-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; padding: 0 0 18px; flex-wrap: wrap; margin-bottom: 12px;
    }
    .sk-back-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 14px; border-radius: 9px; border: 1.5px solid #e2e8f0;
      background: #fff; color: #475569; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.2s; font-family: inherit;
    }
    .sk-back-btn:hover { border-color: #B432F2; color: #B432F2; background: #fdfaff; }
    .sk-id-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 99px; font-size: 12px; font-weight: 600; color: #15803d;
    }
    .sk-id-chip strong { font-family: 'Outfit', monospace; font-weight: 800; letter-spacing: 0.5px; }

    .panel-container {
      background: #fff;
      border: 1.5px solid #e9e2f2;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(180,50,242,0.02);
    }

    .sk-add-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 9px;
      border: none;
      background: linear-gradient(135deg, #a855f7, #9333ea);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 3px 8px rgba(147, 51, 234, 0.15);
    }
    .sk-add-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(147, 51, 234, 0.25);
    }

    .sk-select {
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
      background: #fff;
      font-size: 12.5px;
      font-family: inherit;
      color: #1e293b;
      outline: none;
      transition: border 0.2s;
    }
    .sk-select:focus {
      border-color: #B432F2;
    }

    .sk-cpmk-box {
      margin-top: 6px;
      padding: 6px 10px;
      background: #f8fafc;
      border-left: 2.5px solid #a855f7;
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
      border-radius: 0 6px 6px 0;
    }

    .sk-textarea {
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
      font-size: 12px;
      font-family: inherit;
      resize: none;
      outline: none;
      box-sizing: border-box;
      transition: border 0.2s;
    }
    .sk-textarea:focus {
      border-color: #B432F2;
    }

    .sk-input {
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
      font-size: 12px;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
      transition: border 0.2s;
    }
    .sk-input:focus {
      border-color: #B432F2;
    }
    .text-center {
      text-align: center;
    }

    .sk-checkbox {
      width: 15px;
      height: 15px;
      accent-color: #a855f7;
      cursor: pointer;
    }

    .sk-row-selected {
      background-color: #faf7ff !important;
    }

    .sk-grade-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 800;
    }
    .grade-A { background: #dcfce7; color: #15803d; }
    .grade-B\\+ { background: #dcfce7; color: #16a34a; }
    .grade-B { background: #eff6ff; color: #1d4ed8; }
    .grade-C\\+ { background: #fef9c3; color: #a16207; }
    .grade-C { background: #fef9c3; color: #ca8a04; }
    .grade-D { background: #fee2e2; color: #b91c1c; }
    .grade-E { background: #fee2e2; color: #ef4444; }
    .grade-- { background: #f1f5f9; color: #94a3b8; }

    .sk-action-footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid #f1f5f9;
    }

    .sk-footer-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sk-delete-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 9px;
      border: 1.5px solid #fee2e2;
      background: #fff;
      color: #ef4444;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sk-delete-btn:hover {
      background: #fee2e2;
    }

    .sk-save-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border-radius: 9px;
      border: none;
      background: linear-gradient(135deg, #a855f7, #9333ea);
      color: #fff;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
    }
    .sk-save-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(147, 51, 234, 0.3);
    }

    .sk-saved-alert {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #16a34a;
      font-size: 12px;
      font-weight: 600;
    }

    /* Empty state styling */
    .sk-empty-card {
      background: #fff;
      border: 1.5px dashed #e2d9ec;
      border-radius: 20px;
      padding: 60px 24px;
      text-align: center;
      max-width: 580px;
      margin: 40px auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8px 30px rgba(180,50,242,0.02);
    }
    .sk-empty-icon-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f8fafc;
      border: 1.5px solid #f1f5f9;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .sk-empty-card:hover .sk-empty-icon-wrap {
      background: #fdfaff;
      border-color: #e9d5ff;
      color: #B432F2;
      transform: scale(1.05);
      transition: all 0.2s ease;
    }
    .sk-empty-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .sk-empty-desc {
      font-size: 13.5px;
      color: #64748b;
      line-height: 1.6;
      max-width: 440px;
      margin-bottom: 18px;
    }
    .sk-status-pill {
      font-size: 11.5px;
      padding: 6px 14px;
      border-radius: 99px;
    }
    .sk-status-pill.none { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
    .sk-status-pill.pending { background: #fffbeb; color: #d97706; border: 1px solid #fef08a; }

    /* Conversion Details approved/pending styling */
    .badge-green-solid {
      background: #16a34a;
      color: #fff;
    }
    .badge-amber-solid {
      background: #d97706;
      color: #fff;
    }
    .badge-green-outline {
      border: 1.5px solid #bbf7d0;
      color: #16a34a;
      background: #f0fdf4;
    }
    .badge-amber-outline {
      border: 1.5px solid #fef08a;
      color: #d97706;
      background: #fffbeb;
    }
    .fill-green {
      background-color: #16a34a !important;
    }
    .fill-amber {
      background-color: #d97706 !important;
    }
  `}</style>
);

export default StatusKonversi;
