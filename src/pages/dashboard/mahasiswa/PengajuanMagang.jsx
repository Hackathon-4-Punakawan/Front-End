import React, { useState, useEffect } from 'react';
import ProposalMagangForm from './ProposalMagangForm';
import SuratPengantarForm from './SuratPengantarForm';
import DosenPembimbingForm from './DosenPembimbingForm';
import StatusKonversi from './StatusKonversi';
import { 
  generateSuratPengantarMagangPdf, 
  generateSuratPrasurveyMagangPdf, 
  generateSuratPenunjukanDplPdf, 
  generateTranskripKonversiPdf 
} from '../../../utils/pdfGenerator';
import { 
  getPengajuanFikHelperInfoApi,
  submitPengajuanFikApi,
  getMyPengajuanFikStatusApi
} from '../../../services/pengajuanFikService';
import {
  getMyProposalStatusApi
} from '../../../services/proposalMagangService';
import { submitSuratPengantarApi, getMySuratPengantarStatusApi } from '../../../services/suratPengantarService';
import { submitPengajuanDplApi, getMyPengajuanDplStatusApi } from '../../../services/pengajuanDplService';
import { getKonversiCatalogApi, getAiRecommendationApi, submitKonversiMatkulApi, getMyKonversiStatusApi } from '../../../services/konversiMatkulService';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Building2, 
  Clock, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  User,
  Hash,
  BookOpen,
  MapPin,
  Calendar,
  Briefcase,
  Sparkles,
  Send,
  ExternalLink,
  MessageCircle,
  Shield,
  Eye
} from 'lucide-react';

const PREDEFINED_COURSES = [
  { id: 'IF184523', code: 'IF184523', name: 'Pengembangan Aplikasi Web Lanjut', sks: 4, cpmk: 'Mampu merancang dan mengimplementasikan arsitektur web modern yang scalable.' },
  { id: 'IF184524', code: 'IF184524', name: 'Manajemen Proyek Perangkat Lunak', sks: 3, cpmk: 'Mampu merencanakan, mengelola, dan memantau daur hidup pengembangan software.' },
  { id: 'IF184525', code: 'IF184525', name: 'Keamanan Sistem Informasi', sks: 3, cpmk: 'Mampu menganalisis kerentanan keamanan dan menerapkan protokol enkripsi/proteksi.' },
  { id: 'IF184526', code: 'IF184526', name: 'Pembelajaran Mesin (Machine Learning)', sks: 4, cpmk: 'Mampu membangun, melatih, dan mengevaluasi model prediktif cerdas berbasis data.' },
  { id: 'IF184527', code: 'IF184527', name: 'Kecerdasan Buatan (AI)', sks: 3, cpmk: 'Mampu mendesain agen cerdas menggunakan logika heuristik dan jaringan saraf.' },
  { id: 'IF184528', code: 'IF184528', name: 'Desain UI/UX & Interaksi', sks: 3, cpmk: 'Mampu merancang wireframe dan antarmuka interaktif yang memiliki usabilitas tinggi.' },
];

const calculateGrade = (angka) => {
  const n = parseFloat(angka);
  if (isNaN(n) || angka === '') return '-';
  if (n >= 81) return 'A';
  if (n >= 61) return 'B';
  if (n >= 41) return 'C';
  if (n >= 21) return 'D';
  return 'E';
};

const PengajuanMagang = ({
  currentUser,
  internships,
  setInternships,
  isAddingNew,
  setIsAddingNew,
  getInternStatusStyle,
  handleAlertAction,
  triggerAlert,
  idMagangStatus,
  setIdMagangStatus,
  idMagangValue,
  setIdMagangValue,
  idMagangData,
  setIdMagangData,
  conversionState,
  setConversionState,
  proposals,
  setProposals,
  suratPengantar,
  setSuratPengantar,
  dosenPembimbing,
  setDosenPembimbing,
  currentWizard,
  setCurrentWizard
}) => {
  const [isApplyingId, setIsApplyingId] = useState(idMagangStatus === 'pending');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isSubmittingFik, setIsSubmittingFik] = useState(false);

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  useEffect(() => {
    if (idMagangStatus === 'pending') setIsApplyingId(true);
  }, [idMagangStatus]);

  const [formInit, setFormInit] = useState({
    email: currentUser?.email || '',
    jenisPengajuan: 'Pengajuan ID Magang',
    nama: currentUser?.name || '',
    nim: currentUser?.identity || '',
    prodi: 'Informatika',
    kepadaYth: '',
    namaInstansi: '',
    alamatInstansi: '',
    posisi: '',
    jenisProgram: 'Magang Mandiri',
    semester: '6',
    tahunAkademik: '2026/2027'
  });

  const [formErrors, setFormErrors] = useState({});

  // 1. Pre-fill form from /api/v1/pengajuan-fik/helper-info
  useEffect(() => {
    if (!token) return;
    const loadHelperInfo = async () => {
      const res = await getPengajuanFikHelperInfoApi(token);
      if (res.success && res.data) {
        setFormInit(prev => ({
          ...prev,
          email: res.data.email || prev.email,
          nama: res.data.nama || prev.nama,
          nim: res.data.nim || prev.nim,
          prodi: res.data.prodi || prev.prodi,
          semester: res.data.semester ? String(res.data.semester) : prev.semester,
          tahunAkademik: res.data.tahun_akademik || prev.tahunAkademik,
        }));
      }
    };
    loadHelperInfo();
  }, [token]);

  // 2. Fetch & Poll /api/v1/pengajuan-fik/my-status
  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const checkStatus = async () => {
      const res = await getMyPengajuanFikStatusApi(token);
      if (isMounted && res.success && res.data && res.data.length > 0) {
        const latest = res.data[0];
        const officialId = latest.id_magang_fakultas || latest.nomor_layanan_fik;
        const statusStr = (latest.status_surat_fakultas || latest.status_pengajuan || '').toUpperCase();

        const formattedDate = latest.created_at
          ? new Date(latest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        setIdMagangData({
          jenisPengajuan: latest.jenis_pengajuan || 'Pengajuan ID Magang',
          kepadaYth: latest.tujuan_surat || '-',
          namaInstansi: latest.nama_instansi || '-',
          alamatInstansi: latest.alamat_instansi || '-',
          semester: latest.semester || '6',
          tahunAkademik: latest.tahun_akademik || '2026/2027',
          tanggalPengajuan: formattedDate,
          idMagangFakultas: officialId,
          statusSuratFakultas: latest.status_surat_fakultas,
          suratPengantarUrl: latest.surat_pengantar_url,
        });

        if (statusStr.includes('DISETUJUI') || (officialId && !officialId.includes('PENDING'))) {
          setIdMagangValue(officialId);
          setIdMagangStatus('approved');
        } else {
          setIdMagangStatus('pending');
          setIsApplyingId(true);
        }
      }
    };

    let interval = null;
    checkStatus().then(() => {
      if (isMounted && idMagangStatus === 'pending') {
        interval = setInterval(checkStatus, 4000);
      }
    });

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [token, idMagangStatus, setIdMagangData, setIdMagangStatus, setIdMagangValue]);

  // 3. Fetch & Sync Step 2 Proposal Status from /api/v1/proposal-magang/my-proposal
  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const fetchMyProposals = async () => {
      const res = await getMyProposalStatusApi(token);
      if (isMounted && res.success && res.data) {
        const mapped = res.data.map((p, idx) => {
          const statusStr = (p.status_review || 'Review Proposal Prodi').toUpperCase();
          let normStatus = 'PENDING';
          if (statusStr.includes('ACC') || statusStr.includes('SETUJU') || statusStr.includes('DISETUJUI')) {
            normStatus = 'DISETUJUI';
          } else if (statusStr.includes('REVISI') || statusStr.includes('TOLAK')) {
            normStatus = 'REVISI';
          }

          const formattedDate = p.created_at
            ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

          return {
            id: p.id_proposal || idx + 1,
            jenisPengajuan: 'Pengajuan Proposal Magang',
            namaProgramKegiatan: p.nama_program_kegiatan || '-',
            programDiikuti: p.program_diikuti || 'Magang Berdampak',
            namaInstansi: p.nama_instansi || '-',
            namaPIC: p.nama_pic || '-',
            tanggalMulai: p.tanggal_mulai || '-',
            tanggalSelesai: p.tanggal_selesai || '-',
            tanggalPengajuan: formattedDate,
            status: normStatus,
            rawStatus: p.status_review,
            catatanRevisi: p.catatan_revisi,
          };
        });
        setProposals(mapped);
      }
    };

    let interval = null;
    fetchMyProposals().then(() => {
      if (isMounted && (!proposals || proposals.length === 0 || proposals.some(p => p.status === 'PENDING'))) {
        interval = setInterval(fetchMyProposals, 5000);
      }
    });

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [token, setProposals]);

  const handleFormChange = (field, value) => {
    setFormInit(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => { const copy = { ...prev }; delete copy[field]; return copy; });
    }
  };

  const validateFormInit = () => {
    const errs = {};
    if (!formInit.email) errs.email = 'Email wajib diisi';
    if (!formInit.kepadaYth) errs.kepadaYth = 'Pihak tujuan (Kepada Yth.) wajib diisi';
    if (!formInit.namaInstansi) errs.namaInstansi = 'Nama instansi wajib diisi';
    if (!formInit.alamatInstansi) errs.alamatInstansi = 'Alamat instansi wajib diisi';
    if (!formInit.tahunAkademik) errs.tahunAkademik = 'Tahun akademik wajib diisi';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveInit = async (e) => {
    e.preventDefault();
    if (!validateFormInit()) {
      triggerAlert('Gagal Mengajukan', Object.values(formErrors)[0] || 'Harap lengkapi semua kolom wajib!', 'error');
      return;
    }

    setIsSubmittingFik(true);
    const res = await submitPengajuanFikApi(token, formInit);
    setIsSubmittingFik(false);

    if (res.success) {
      const tanggalPengajuan = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      setIdMagangData({ ...formInit, tanggalPengajuan });
      setIdMagangStatus('pending');
      setIsApplyingId(true);
      triggerAlert('Pendaftaran Terkirim', 'Formulir berhasil dikirim ke Fakultas. Sistem sedang memproses persetujuan otomatis (Simulasi 5 Detik FIK).', 'success');
    } else {
      triggerAlert('Gagal Mengajukan', res.message || 'Terjadi kesalahan saat mengirim pengajuan.', 'error');
    }
  };

  const handleSimulateApprove = (e) => {
    e.preventDefault();
    const newId = `FIK${Math.floor(6199300 + Math.random() * 100)}`;
    setIdMagangValue(newId);
    setIdMagangStatus('approved');
    triggerAlert('Persetujuan Sukses', `ID Magang resmi Anda diterbitkan: ${newId}. Anda sekarang dialihkan ke Dashboard Manajemen Pengajuan Magang.`, 'success');
  };

  const isPending = idMagangStatus === 'pending';

  // ─── RENDER 1: APPROVED — MAIN DASHBOARD OR WIZARD ───────────────────────
  if (idMagangStatus === 'approved') {
    return (
      <div className="tab-pane fade-in">
        {isAddingNew ? (
          currentWizard === 'proposal' ? (
            <ProposalMagangForm
              currentUser={currentUser}
              idMagangData={idMagangData}
              idMagangValue={idMagangValue}
              onCancel={() => setIsAddingNew(false)}
              triggerAlert={triggerAlert}
              onSubmit={(proposalData) => {
                const newProposal = {
                  id: proposals.length + 1,
                  jenisPengajuan: 'Pengajuan Proposal Magang',
                  namaProgramKegiatan: proposalData.namaProgramKegiatan,
                  programDiikuti: proposalData.programDiikuti,
                  namaInstansi: proposalData.namaInstansiMBKM,
                  namaPIC: proposalData.namaPIC,
                  tanggalMulai: proposalData.tanggalMulai,
                  tanggalSelesai: proposalData.tanggalSelesai,
                  tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  status: 'PENDING',
                };
                setProposals([newProposal]); // Simpan proposal tunggal terbaru
                setIsAddingNew(false);
                triggerAlert('Proposal Terkirim', `Proposal magang Anda untuk ${proposalData.namaInstansiMBKM} berhasil dikirim dan sedang menunggu tinjauan!`, 'success');
              }}
            />
          ) : currentWizard === 'surat_pengantar' ? (
            <SuratPengantarForm
              currentUser={currentUser}
              idMagangValue={idMagangValue}
              approvedProposal={proposals[0]}
              onCancel={() => setIsAddingNew(false)}
              triggerAlert={triggerAlert}
              onSubmit={(suratData) => {
                const newSurat = {
                  jenisPengajuan: 'Pengajuan Surat Pengantar Magang',
                  tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  status: 'PENDING',
                  periodeMagang: suratData.periodeMagang,
                  tanggalMulai: suratData.tanggalMulai,
                  tanggalSelesai: suratData.tanggalSelesai
                };
                setSuratPengantar(newSurat);
                setIsAddingNew(false);
                triggerAlert('Pengajuan Sukses', 'Formulir Pengajuan Surat Pengantar Magang berhasil dikirim dan sedang diproses!', 'success');
              }}
            />
          ) : currentWizard === 'dosen_pembimbing' ? (
            <DosenPembimbingForm
              currentUser={currentUser}
              idMagangValue={idMagangValue}
              onCancel={() => setIsAddingNew(false)}
              triggerAlert={triggerAlert}
              onSubmit={(dopemData) => {
                const newDopem = {
                  jenisPengajuan: 'Pengajuan Dosen Pembimbing Magang',
                  tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  status: 'PENDING',
                  sksDitempuh: dopemData.sksDitempuh
                };
                setDosenPembimbing(newDopem);
                setIsAddingNew(false);
                triggerAlert('Pengajuan Sukses', 'Formulir Pengajuan Dosen Pembimbing Magang berhasil dikirim dan sedang diproses!', 'success');
              }}
            />
          ) : (
            <StatusKonversi
              currentUser={currentUser}
              idMagangValue={idMagangValue}
              onCancel={() => setIsAddingNew(false)}
              onSubmit={(konversiData) => {
                setConversionState({
                  status: 'PENDING',
                  tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  courses: konversiData
                });
                setIsAddingNew(false);
                triggerAlert('Pengajuan Sukses', 'Matriks Konversi SKS Akademik berhasil diajukan and sedang diverifikasi oleh Kaprodi!', 'success');
              }}
              triggerAlert={triggerAlert}
            />
          )
        ) : (
          <>
            <div className="page-heading-with-btn">
              <div className="page-heading">
                <div className="path-breadcrumbs">
                  <span>Home</span> / <span>Dashboard</span> / <span className="active">Pengajuan Magang</span>
                </div>
                <h1 className="main-title">Pengajuan Magang</h1>
                <p className="main-subtitle">Pantau dan kelola seluruh proses pengajuan magang Anda mulai dari pendaftaran hingga persetujuan akhir.</p>
              </div>
              
              {/* Dynamic Action Button based on step progression */}
              {!proposals[0] ? (
                <button
                  className="btn-brand-primary"
                  onClick={() => {
                    setCurrentWizard('proposal');
                    setIsAddingNew(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Step Selanjutnya</span>
                </button>
              ) : proposals[0].status === 'PENDING' ? (
                <button
                  className="btn-brand-primary"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <span>Menunggu ACC Proposal</span>
                </button>
              ) : !suratPengantar ? (
                <button
                  className="btn-brand-primary"
                  onClick={() => {
                    setCurrentWizard('surat_pengantar');
                    setIsAddingNew(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Step Selanjutnya</span>
                </button>
              ) : suratPengantar.status === 'PENDING' ? (
                <button
                  className="btn-brand-primary"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <span>Menunggu ACC Surat Pengantar</span>
                </button>
              ) : !dosenPembimbing ? (
                <button
                  className="btn-brand-primary"
                  onClick={() => {
                    setCurrentWizard('dosen_pembimbing');
                    setIsAddingNew(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Step Selanjutnya</span>
                </button>
              ) : dosenPembimbing.status === 'PENDING' ? (
                <button
                  className="btn-brand-primary"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <span>Menunggu ACC Dosen Pembimbing</span>
                </button>
              ) : conversionState.status === 'none' ? (
                <button
                  className="btn-brand-primary"
                  onClick={() => {
                    setCurrentWizard('konversi_sks');
                    setIsAddingNew(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Step Selanjutnya</span>
                </button>
              ) : conversionState.status === 'PENDING' ? (
                <button
                  className="btn-brand-primary"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <span>Menunggu ACC Konversi SKS</span>
                </button>
              ) : (
                <button
                  className="btn-brand-primary"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed', background: '#16a34a' }}
                >
                  <span>✓ Semua Tahapan Selesai</span>
                </button>
              )}
            </div>

            {/* ID Magang Info Banner */}
            <div className="pm-id-info-banner">
              <div className="pm-id-info-left">
                <div className="pm-id-info-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="pm-id-info-label">ID Magang Resmi Anda</p>
                  <p className="pm-id-info-value">{idMagangValue}</p>
                </div>
              </div>
              <div className="pm-id-info-right">
                <span className="pm-id-approved-badge">✓ Disetujui Fakultas</span>
              </div>
            </div>

            {/* Simulation Block: Approve Proposal (Show only if there's a pending proposal) */}
            {proposals[0] && proposals[0].status === 'PENDING' && (
              <div style={{
                marginTop: '16px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#fffbeb',
                border: '1px solid #fef08a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#854d0e' }}>Simulasi Persetujuan Proposal (Prodi)</p>
                    <p style={{ fontSize: '11px', color: '#a16207' }}>
                      Status proposal Anda saat ini masih PENDING. Klik tombol di kanan untuk menyetujuinya.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProposals(prev => prev.map(p => p.id === proposals[0].id ? { ...p, status: 'DISETUJUI' } : p));
                    triggerAlert('Proposal Disetujui', 'Proposal Anda telah disetujui oleh Prodi. Anda dapat melanjutkan ke langkah berikutnya!', 'success');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ca8a04',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(202,138,4,0.2)'
                  }}
                >
                  Simulasikan ACC Proposal
                </button>
              </div>
            )}

            {/* Simulation Block: Approve Surat Pengantar (Show only if pending) */}
            {suratPengantar && suratPengantar.status === 'PENDING' && (
              <div style={{
                marginTop: '16px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#fffbeb',
                border: '1px solid #fef08a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#854d0e' }}>Simulasi Persetujuan Surat Pengantar (Fakultas)</p>
                    <p style={{ fontSize: '11px', color: '#a16207' }}>
                      Status surat pengantar Anda saat ini masih PENDING. Klik tombol di kanan untuk menyetujuinya.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSuratPengantar(prev => ({ ...prev, status: 'DISETUJUI' }));
                    triggerAlert('Surat Pengantar Disetujui', 'Surat Pengantar Anda telah disetujui oleh Fakultas. Anda dapat mengajukan Dosen Pembimbing!', 'success');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ca8a04',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(202,138,4,0.2)'
                  }}
                >
                  Simulasikan ACC Surat Pengantar
                </button>
              </div>
            )}

            {/* Simulation Block: Approve Dosen Pembimbing (Show only if pending) */}
            {dosenPembimbing && dosenPembimbing.status === 'PENDING' && (
              <div style={{
                marginTop: '16px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#fffbeb',
                border: '1px solid #fef08a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#854d0e' }}>Simulasi Persetujuan Dosen Pembimbing (Fakultas)</p>
                    <p style={{ fontSize: '11px', color: '#a16207' }}>
                      Status pengajuan dosen pembimbing Anda saat ini masih PENDING. Klik tombol di kanan untuk menyetujuinya.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDosenPembimbing(prev => ({ ...prev, status: 'DISETUJUI' }));
                    triggerAlert('Dosen Pembimbing Disetujui', 'Pengajuan Dosen Pembimbing Anda telah disetujui oleh Fakultas!', 'success');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ca8a04',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(202,138,4,0.2)'
                  }}
                >
                  Simulasikan ACC Dosen Pembimbing
                </button>
              </div>
            )}

            {/* Simulation Block: Approve Konversi SKS (Show only if pending) */}
            {conversionState.status === 'PENDING' && (
              <div style={{
                marginTop: '16px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#fffbeb',
                border: '1px solid #fef08a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: '#ca8a04' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#854d0e' }}>Simulasi Persetujuan Konversi SKS (Kaprodi)</p>
                    <p style={{ fontSize: '11px', color: '#a16207' }}>
                      Matriks konversi SKS Anda saat ini masih PENDING. Klik tombol di kanan untuk menyetujuinya.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setConversionState(prev => ({ ...prev, status: 'DISETUJUI' }));
                    triggerAlert('Konversi SKS Disetujui', 'Matriks Konversi SKS Akademik Anda telah disetujui oleh Kaprodi!', 'success');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ca8a04',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(202,138,4,0.2)'
                  }}
                >
                  Simulasikan ACC Konversi SKS
                </button>
              </div>
            )}

            {/* Unified Table — ID Magang + Proposals */}
            <div className="panel-container" style={{ marginTop: '20px' }}>
              <div className="table-responsive">
                <table className="custom-data-table font-medium-cells">
                  <thead>
                    <tr>
                      <th>JENIS PENGAJUAN</th>
                      <th>TANGGAL PENGAJUAN</th>
                      <th>STATUS</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1: ID Magang */}
                    {idMagangData ? (
                      <tr>
                        <td>
                          <div className="cell-primary font-bold">{idMagangData.jenisPengajuan}</div>
                          <span className="cell-secondary">Semester {idMagangData.semester} · {idMagangData.tahunAkademik}</span>
                        </td>
                        <td className="cell-primary font-regular" style={{ color: 'var(--text-muted)' }}>
                          {idMagangData.tanggalPengajuan || '-'}
                        </td>
                        <td>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'99px', fontSize:'12px', fontWeight:'700', backgroundColor:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }}>
                            <span className="status-dot-indicator" style={{ backgroundColor:'#16a34a' }}></span>
                            DISETUJUI
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedDetail({ type: 'id_magang', data: idMagangData })}
                            style={{ background: 'none', border: 'none', color: '#B432F2', cursor: 'pointer', padding: '6px' }}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign:'center', color:'var(--text-muted)', padding:'32px', fontSize:'13px' }}>
                          Data pendaftaran tidak ditemukan.
                        </td>
                      </tr>
                    )}
                    {/* Rows: Proposals */}
                    {proposals.map((p) => (
                      <tr key={`proposal-${p.id}`}>
                        <td>
                          <div className="cell-primary font-bold">{p.jenisPengajuan}</div>
                          <span className="cell-secondary">{p.programDiikuti} ({p.namaProgramKegiatan}) · PIC: {p.namaPIC}</span>
                        </td>
                        <td className="cell-primary font-regular" style={{ color: 'var(--text-muted)' }}>
                          {p.tanggalPengajuan}
                        </td>
                        <td>
                          <span style={{
                            display:'inline-flex',
                            alignItems:'center',
                            gap:'6px',
                            padding:'6px 14px',
                            borderRadius:'99px',
                            fontSize:'12px',
                            fontWeight:'700',
                            backgroundColor: p.status === 'DISETUJUI' ? '#f0fdf4' : '#fefce8',
                            color: p.status === 'DISETUJUI' ? '#16a34a' : '#a16207',
                            border: p.status === 'DISETUJUI' ? '1px solid #bbf7d0' : '1px solid #fde68a'
                          }}>
                            <span className="status-dot-indicator" style={{ backgroundColor: p.status === 'DISETUJUI' ? '#16a34a' : '#ca8a04' }}></span>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedDetail({ type: 'proposal', data: p })}
                            style={{ background: 'none', border: 'none', color: '#B432F2', cursor: 'pointer', padding: '6px' }}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Row 3: Surat Pengantar Magang */}
                    {suratPengantar && (
                      <tr>
                        <td>
                          <div className="cell-primary font-bold">{suratPengantar.jenisPengajuan}</div>
                          <span className="cell-secondary">Durasi/Periode: {suratPengantar.periodeMagang}</span>
                        </td>
                        <td className="cell-primary font-regular" style={{ color: 'var(--text-muted)' }}>
                          {suratPengantar.tanggalPengajuan}
                        </td>
                        <td>
                          <span style={{
                            display:'inline-flex',
                            alignItems:'center',
                            gap:'6px',
                            padding:'6px 14px',
                            borderRadius:'99px',
                            fontSize:'12px',
                            fontWeight:'700',
                            backgroundColor: suratPengantar.status === 'DISETUJUI' ? '#f0fdf4' : '#fefce8',
                            color: suratPengantar.status === 'DISETUJUI' ? '#16a34a' : '#a16207',
                            border: suratPengantar.status === 'DISETUJUI' ? '1px solid #bbf7d0' : '1px solid #fde68a'
                          }}>
                            <span className="status-dot-indicator" style={{ backgroundColor: suratPengantar.status === 'DISETUJUI' ? '#16a34a' : '#ca8a04' }}></span>
                            {suratPengantar.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedDetail({ type: 'surat_pengantar', data: suratPengantar })}
                            style={{ background: 'none', border: 'none', color: '#B432F2', cursor: 'pointer', padding: '6px' }}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    )}
                    {/* Row 4: Dosen Pembimbing Magang */}
                    {dosenPembimbing && (
                      <tr>
                        <td>
                          <div className="cell-primary font-bold">{dosenPembimbing.jenisPengajuan}</div>
                          <span className="cell-secondary">SKS Ditempuh: {dosenPembimbing.sksDitempuh} SKS</span>
                        </td>
                        <td className="cell-primary font-regular" style={{ color: 'var(--text-muted)' }}>
                          {dosenPembimbing.tanggalPengajuan}
                        </td>
                        <td>
                          <span style={{
                            display:'inline-flex',
                            alignItems:'center',
                            gap:'6px',
                            padding:'6px 14px',
                            borderRadius:'99px',
                            fontSize:'12px',
                            fontWeight:'700',
                            backgroundColor: dosenPembimbing.status === 'DISETUJUI' ? '#f0fdf4' : '#fefce8',
                            color: dosenPembimbing.status === 'DISETUJUI' ? '#16a34a' : '#a16207',
                            border: dosenPembimbing.status === 'DISETUJUI' ? '1px solid #bbf7d0' : '1px solid #fde68a'
                          }}>
                            <span className="status-dot-indicator" style={{ backgroundColor: dosenPembimbing.status === 'DISETUJUI' ? '#16a34a' : '#ca8a04' }}></span>
                            {dosenPembimbing.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedDetail({ type: 'dosen_pembimbing', data: dosenPembimbing })}
                            style={{ background: 'none', border: 'none', color: '#B432F2', cursor: 'pointer', padding: '6px' }}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    )}
                    {/* Row 5: Konversi SKS Akademik */}
                    {conversionState.status !== 'none' && (
                      <tr>
                        <td>
                          <div className="cell-primary font-bold">Konversi SKS Akademik</div>
                          <span className="cell-secondary">Matriks Capaian Pembelajaran & Penilaian Akademik</span>
                        </td>
                        <td className="cell-primary font-regular" style={{ color: 'var(--text-muted)' }}>
                          {conversionState.tanggalPengajuan}
                        </td>
                        <td>
                          <span style={{
                            display:'inline-flex',
                            alignItems:'center',
                            gap:'6px',
                            padding:'6px 14px',
                            borderRadius:'99px',
                            fontSize:'12px',
                            fontWeight:'700',
                            backgroundColor: conversionState.status === 'DISETUJUI' ? '#f0fdf4' : '#fefce8',
                            color: conversionState.status === 'DISETUJUI' ? '#16a34a' : '#a16207',
                            border: conversionState.status === 'DISETUJUI' ? '1px solid #bbf7d0' : '1px solid #fde68a'
                          }}>
                            <span className="status-dot-indicator" style={{ backgroundColor: conversionState.status === 'DISETUJUI' ? '#16a34a' : '#ca8a04' }}></span>
                            {conversionState.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedDetail({ type: 'konversi_sks', data: conversionState })}
                            style={{ background: 'none', border: 'none', color: '#B432F2', cursor: 'pointer', padding: '6px' }}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-pagination">
                <span className="pagination-info">Menampilkan {1 + proposals.length + (suratPengantar ? 1 : 0) + (dosenPembimbing ? 1 : 0) + (conversionState.status !== 'none' ? 1 : 0)} data pengajuan</span>
                <div className="pagination-pages">
                  <button className="pag-btn">&larr;</button>
                  <button className="pag-btn active">1</button>
                  <button className="pag-btn">&rarr;</button>
                </div>
              </div>
            </div>

            {/* Detail Overlay Modal */}
            {selectedDetail && (
              <div className="detail-modal-overlay" onClick={() => setSelectedDetail(null)}>
                <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
                  <div className="detail-modal-header">
                    <h3 className="detail-modal-title">
                      <BookOpen size={20} style={{ color: '#B432F2' }} />
                      <span>Detail {selectedDetail.type === 'id_magang' ? 'Pendaftaran ID Magang' : selectedDetail.type === 'proposal' ? 'Pengajuan Proposal Magang' : selectedDetail.type === 'surat_pengantar' ? 'Pengajuan Surat Pengantar Magang' : selectedDetail.type === 'dosen_pembimbing' ? 'Pengajuan Dosen Pembimbing Magang' : 'Konversi SKS Akademik'}</span>
                    </h3>
                    <button className="detail-modal-close" onClick={() => setSelectedDetail(null)}>&times;</button>
                  </div>
                  
                  <div className="detail-modal-body">
                    {selectedDetail.type === 'id_magang' && (
                      <div className="detail-modal-grid">
                        <div className="detail-item">
                          <span className="detail-label">Jenis Pengajuan</span>
                          <span className="detail-value">{selectedDetail.data.jenisPengajuan}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Semester & Tahun Akademik</span>
                          <span className="detail-value">Semester {selectedDetail.data.semester} · {selectedDetail.data.tahunAkademik}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Nama Mahasiswa</span>
                          <span className="detail-value">{currentUser?.name || 'Mahasiswa'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">NIM</span>
                          <span className="detail-value">{currentUser?.identity || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Program Studi</span>
                          <span className="detail-value">Informatika</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tanggal Pengajuan</span>
                          <span className="detail-value">{selectedDetail.data.tanggalPengajuan || '-'}</span>
                        </div>
                      </div>
                    )}

                    {selectedDetail.type === 'proposal' && (
                      <div className="detail-modal-grid">
                        <div className="detail-item">
                          <span className="detail-label">Nama Program Kegiatan</span>
                          <span className="detail-value">{selectedDetail.data.namaProgramKegiatan || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Program Diikuti</span>
                          <span className="detail-value">{selectedDetail.data.programDiikuti || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Nama Instansi MBKM</span>
                          <span className="detail-value">{selectedDetail.data.namaInstansi || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Nama PIC Mitra</span>
                          <span className="detail-value">{selectedDetail.data.namaPIC || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tanggal Mulai Magang</span>
                          <span className="detail-value">{selectedDetail.data.tanggalMulai || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tanggal Berakhir Magang</span>
                          <span className="detail-value">{selectedDetail.data.tanggalSelesai || '-'}</span>
                        </div>
                      </div>
                    )}

                    {selectedDetail.type === 'surat_pengantar' && (
                      <div className="detail-modal-grid">
                        <div className="detail-item">
                          <span className="detail-label">Email Mahasiswa</span>
                          <span className="detail-value">{currentUser?.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">ID Magang</span>
                          <span className="detail-value">{idMagangValue}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tanggal Mulai Magang</span>
                          <span className="detail-value">{selectedDetail.data.tanggalMulai || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tanggal Berakhir Magang</span>
                          <span className="detail-value">{selectedDetail.data.tanggalSelesai || '-'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Periode Magang</span>
                          <span className="detail-value">{selectedDetail.data.periodeMagang || '-'}</span>
                        </div>
                      </div>
                    )}

                    {selectedDetail.type === 'dosen_pembimbing' && (
                      <div className="detail-modal-grid">
                        <div className="detail-item">
                          <span className="detail-label">Email Mahasiswa</span>
                          <span className="detail-value">{currentUser?.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">ID Magang</span>
                          <span className="detail-value">{idMagangValue}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Nama Mahasiswa</span>
                          <span className="detail-value">{currentUser?.name}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">NIM Mahasiswa</span>
                          <span className="detail-value">{currentUser?.identity}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">SKS Ditempuh</span>
                          <span className="detail-value">{selectedDetail.data.sksDitempuh} SKS</span>
                        </div>
                        <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                          <span className="detail-label">Dokumen Terlampir</span>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                            <span className="detail-file-chip">Bukti_Diterima_Magang.pdf</span>
                            <span className="detail-file-chip">KHS_Terakhir.pdf</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDetail.type === 'konversi_sks' && (
                      <div>
                        <div style={{ marginBottom: '14px', fontSize: '13px', color: '#64748b' }}>
                          Berikut rincian mata kuliah konversi yang Anda ajukan:
                        </div>
                        <div className="detail-modal-table-wrap">
                          <table className="detail-modal-table">
                            <thead>
                              <tr>
                                <th>KODE</th>
                                <th>MATA KULIAH</th>
                                <th>SKS</th>
                                <th>OBJECTIVE</th>
                                <th>NILAI</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDetail.data.courses && selectedDetail.data.courses.length > 0 ? (
                                selectedDetail.data.courses.map((courseItem, cIdx) => {
                                  const match = PREDEFINED_COURSES.find(c => c.id === courseItem.selectedCourseId);
                                  return (
                                    <tr key={cIdx}>
                                      <td><strong style={{ fontFamily: 'Outfit, monospace' }}>{match ? match.code : '-'}</strong></td>
                                      <td>
                                        <div>{match ? match.name : '-'}</div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>CPMK: {match ? match.cpmk : '-'}</div>
                                      </td>
                                      <td>{match ? match.sks : '-'} SKS</td>
                                      <td>{courseItem.objective}</td>
                                      <td>
                                        <span className="detail-grade">
                                          {courseItem.nilaiAngka ? `${courseItem.nilaiAngka} (${calculateGrade(courseItem.nilaiAngka)})` : '-'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>Tidak ada mata kuliah konversi yang disimpan.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="detail-modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedDetail.type === 'surat_pengantar' && (
                        <>
                          <button
                            type="button"
                            onClick={() => generateSuratPengantarMagangPdf({
                              nomorSurat: '55/FIK-IF/AMIKOM/MAGANG/VI/2026',
                              tanggalSurat: new Date().toISOString(),
                              namaMitra: selectedDetail.data.namaInstansi || approvedProposal?.namaMitra || 'PT GoTo Gojek Tokopedia Tbk',
                              namaMahasiswa: currentUser?.name || 'Budi Santoso',
                              nimMahasiswa: currentUser?.identity || '21.11.4001',
                              prodi: 'S1 Informatika',
                              tanggalMulai: selectedDetail.data.tanggalMulai || '1 Februari 2026',
                              tanggalSelesai: selectedDetail.data.tanggalSelesai || '31 Juli 2026'
                            })}
                            style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Download size={14} /> Cetak PDF Surat Pengantar
                          </button>
                          <button
                            type="button"
                            onClick={() => generateSuratPrasurveyMagangPdf({
                              nomorSurat: '84/FIK-IF/AMIKOM/PSM/V/2026',
                              tanggalSurat: new Date().toISOString(),
                              namaMitra: selectedDetail.data.namaInstansi || 'PT Bank Central Asia Tbk',
                              namaMahasiswa: currentUser?.name || 'Budi Santoso',
                              nimMahasiswa: currentUser?.identity || '21.11.4001',
                              prodi: 'S1 Informatika'
                            })}
                            style={{ background: '#f0f9ff', border: '1px solid #38bdf8', color: '#0369a1', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Download size={14} /> Cetak PDF Prasurvey
                          </button>
                        </>
                      )}

                      {selectedDetail.type === 'dosen_pembimbing' && (
                        <button
                          type="button"
                          onClick={() => generateSuratPenunjukanDplPdf({
                            nomorSurat: '45/FIK-IF/AMIKOM/STDM/VI/2026',
                            tanggalSurat: new Date().toISOString(),
                            namaDosen: selectedDetail.data.namaDPL || 'Dr. Indah Susanti, M.Kom',
                            namaMahasiswa: currentUser?.name || 'Budi Santoso',
                            nimMahasiswa: currentUser?.identity || '21.11.4001',
                            prodi: 'S1 Informatika',
                            namaInstansi: approvedProposal?.namaMitra || 'PT GoTo Gojek Tokopedia Tbk',
                            periodeMulai: '1 Februari 2026',
                            durasi: '6 Bulan'
                          })}
                          style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Download size={14} /> Cetak PDF SK DPL
                        </button>
                      )}

                      {(selectedDetail.type === 'konversi_sks' || selectedDetail.type === 'proposal' || selectedDetail.type === 'id_magang') && (
                        <button
                          type="button"
                          onClick={() => generateTranskripKonversiPdf({
                            namaMahasiswa: currentUser?.name || 'Budi Santoso',
                            nimMahasiswa: currentUser?.identity || '21.11.4001',
                            prodi: 'S1 Informatika',
                            idMagang: idMagangValue || 'FIK6206030',
                            namaInstansi: approvedProposal?.namaMitra || 'PT GoTo Gojek Tokopedia Tbk',
                            dpl: dosenPembimbing?.namaDPL || 'Dr. Indah Susanti, M.Kom',
                            courses: selectedDetail.data.courses || []
                          })}
                          style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Download size={14} /> Cetak PDF Dokumen Resmi
                        </button>
                      )}
                    </div>
                    <button className="detail-modal-close-btn" onClick={() => setSelectedDetail(null)}>Tutup Rincian</button>
                  </div>
                </div>
              </div>
            )}

            <style>{`
              /* Detail Modal Overlay */
              .detail-modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 23, 42, 0.4);
                backdrop-filter: blur(6px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                padding: 20px;
              }
              
              /* Modal Card */
              .detail-modal-card {
                background: #fff;
                border-radius: 20px;
                width: 100%;
                max-width: 650px;
                box-shadow: 0 20px 50px rgba(180, 50, 242, 0.08);
                display: flex;
                flex-direction: column;
                max-height: 90vh;
                border: 1px solid #f1eef8;
                overflow: hidden;
                animation: modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              
              @keyframes modalEnter {
                from { opacity: 0; transform: translateY(12px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }

              .detail-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1.5px solid #f1f5f9;
              }
              .detail-modal-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 15px;
                font-weight: 800;
                color: #1e293b;
                margin: 0;
              }
              .detail-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #94a3b8;
                cursor: pointer;
                line-height: 1;
              }
              .detail-modal-close:hover {
                color: #ef4444;
              }

              .detail-modal-body {
                padding: 24px;
                overflow-y: auto;
                flex: 1;
              }

              .detail-modal-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
              }

              .detail-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 10px 14px;
                background: #f8fafc;
                border-radius: 10px;
                border-left: 3.5px solid #a855f7;
              }
              .detail-label {
                font-size: 10px;
                color: #94a3b8;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .detail-value {
                font-size: 13px;
                color: #1e293b;
                font-weight: 700;
              }

              .detail-file-chip {
                display: inline-flex;
                align-items: center;
                padding: 4px 10px;
                border-radius: 6px;
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                font-size: 11px;
                font-weight: 700;
                color: #475569;
              }

              .detail-modal-table-wrap {
                border: 1.5px solid #e2e8f0;
                border-radius: 12px;
                overflow: hidden;
                margin-top: 10px;
              }
              .detail-modal-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                text-align: left;
              }
              .detail-modal-table th {
                background: #f8fafc;
                padding: 10px 12px;
                color: #64748b;
                font-weight: 700;
                border-bottom: 1.5px solid #e2e8f0;
              }
              .detail-modal-table td {
                padding: 12px;
                border-bottom: 1px solid #f1f5f9;
                color: #334155;
                vertical-align: top;
              }
              .detail-grade {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 6px;
                background: #eff6ff;
                color: #1d4ed8;
                font-weight: 800;
                font-size: 11px;
              }

              .detail-modal-footer {
                display: flex;
                justify-content: flex-end;
                padding: 16px 24px;
                border-top: 1.5px solid #f1f5f9;
                background: #f8fafc;
              }
              .detail-modal-close-btn {
                padding: 8px 16px;
                border-radius: 8px;
                border: 1.5px solid #cbd5e1;
                background: #fff;
                color: #475569;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
              }
              .detail-modal-close-btn:hover {
                background: #f1f5f9;
                border-color: #94a3b8;
              }

              .pm-id-info-banner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border: 1px solid #bbf7d0;
                border-radius: 16px;
                padding: 16px 22px;
                margin-top: 20px;
                box-shadow: 0 2px 12px rgba(22, 163, 74, 0.08);
              }
              .pm-id-info-left {
                display: flex;
                align-items: center;
                gap: 14px;
              }
              .pm-id-info-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(22, 163, 74, 0.25);
                flex-shrink: 0;
              }
              .pm-id-info-label {
                font-size: 10px;
                font-weight: 700;
                color: #15803d;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                margin-bottom: 3px;
              }
              .pm-id-info-value {
                font-family: 'Outfit', monospace;
                font-size: 18px;
                font-weight: 800;
                color: #14532d;
                letter-spacing: 1px;
              }
              .pm-id-approved-badge {
                background: #16a34a;
                color: #ffffff;
                font-size: 11px;
                font-weight: 700;
                padding: 6px 14px;
                border-radius: 99px;
                letter-spacing: 0.3px;
              }
              .pm-step1-table-header {
                padding: 20px 24px 16px;
                border-bottom: 1px solid #f1f5f9;
              }
              .pm-step1-title-wrap {
                display: flex;
                align-items: center;
                gap: 14px;
              }
              .pm-step1-num {
                width: 34px;
                height: 34px;
                border-radius: 10px;
                background: linear-gradient(135deg, #B432F2, #9f1be0);
                color: #ffffff;
                font-size: 16px;
                font-weight: 800;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                box-shadow: 0 4px 10px rgba(180, 50, 242, 0.25);
              }
              .pm-step1-title {
                font-family: 'Outfit', sans-serif;
                font-size: 15px;
                font-weight: 800;
                color: #0f172a;
                margin-bottom: 2px;
              }
              .pm-step1-desc {
                font-size: 12px;
                color: #64748b;
              }
            `}</style>
          </>
        )}
      </div>
    );
  }

  // ─── RENDER 2: FORM (PENDING / FILLING) ──────────────────────────────────
  if (isApplyingId || isPending) {
    return (
      <div className="tab-pane fade-in pm-form-wrapper">
        
        {/* PENDING BANNER */}
        {isPending && (
          <div className="pm-pending-banner">
            <div className="pm-pending-left">
              <div className="pm-pending-icon-wrap">
                <Clock size={22} />
              </div>
              <div>
                <p className="pm-pending-label">Status Pengajuan</p>
                <h4 className="pm-pending-title">PENDING — Menunggu ACC Fakultas</h4>
                <p className="pm-pending-desc">Data formulir Anda telah tersimpan dan sedang diverifikasi oleh Fakultas Ilmu Komputer untuk penerbitan ID Magang resmi.</p>
              </div>
            </div>
            <div className="pm-sim-box">
              <span className="pm-sim-tag">🔬 SIMULATOR</span>
              <button className="pm-sim-btn" onClick={handleSimulateApprove}>
                <Shield size={14} />
                Simulasikan ACC Fakultas
              </button>
            </div>
          </div>
        )}

        {/* FORM CARD */}
        <div className="pm-form-card">
          
          {/* Decorative Header */}
          <div className="pm-form-header">
            <div className="pm-header-bg-decoration" />
            <div className="pm-header-content">
              <div className="pm-header-icon">
                <Briefcase size={28} />
              </div>
              <div>
                <p className="pm-header-sub">Fakultas Ilmu Komputer · Universitas Amikom Yogyakarta</p>
                <h2 className="pm-header-title">Formulir Pendaftaran Magang Mahasiswa</h2>
                <p className="pm-header-note">Isi semua kolom dengan data yang valid. Kolom bertanda <span style={{color:'#fca5a5'}}>*</span> wajib diisi.</p>
              </div>
            </div>
          </div>

          {/* Back button */}
          {!isPending && (
            <div style={{ padding: '20px 32px 0' }}>
              <button className="pm-back-btn" onClick={() => setIsApplyingId(false)}>
                <ArrowLeft size={14} />
                Kembali
              </button>
            </div>
          )}

          <form onSubmit={handleSaveInit} style={{ padding: '28px 32px 32px' }}>

            {/* Section: Data Pengiriman */}
            <div className="pm-section-label">
              <Send size={13} />
              <span>Data Pengiriman</span>
            </div>
            <div className="pm-grid-2">
              <div className="pm-field col-span-2">
                <label className="pm-label"><Mail size={13} /> Email Mahasiswa <span className="pm-req">*</span></label>
                <input
                  type="email"
                  className={`pm-input ${formErrors.email ? 'pm-input-error' : ''} ${isPending ? 'pm-input-readonly' : ''}`}
                  value={formInit.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  disabled={isPending}
                  placeholder="mahasiswa@amikom.ac.id"
                />
                {formErrors.email && <span className="pm-error-msg">{formErrors.email}</span>}
              </div>

              <div className="pm-field col-span-2">
                <label className="pm-label"><Sparkles size={13} /> Jenis Pengajuan <span className="pm-req">*</span></label>
                <div className="pm-select-wrap">
                  <select
                    className={`pm-input pm-select ${isPending ? 'pm-input-readonly' : ''}`}
                    value={formInit.jenisPengajuan}
                    onChange={e => handleFormChange('jenisPengajuan', e.target.value)}
                    disabled={isPending}
                  >
                    <option value="Pengajuan ID Magang">Pengajuan ID Magang</option>
                    <option value="Pra Survey Magang dan Id Magang">Pra Survey Magang dan Id Magang</option>
                  </select>
                  <ChevronRight size={14} className="pm-select-icon" />
                </div>
              </div>
            </div>

            {/* Section: Data Mahasiswa */}
            <div className="pm-section-label" style={{ marginTop: '24px' }}>
              <User size={13} />
              <span>Data Mahasiswa</span>
            </div>
            <div className="pm-grid-2">
              <div className="pm-field">
                <label className="pm-label"><User size={13} /> Nama Mahasiswa</label>
                <input type="text" className="pm-input pm-input-readonly" value={formInit.nama} readOnly disabled />
                <span className="pm-field-note">Terisi otomatis dari akun Anda</span>
              </div>
              <div className="pm-field">
                <label className="pm-label"><Hash size={13} /> NIM</label>
                <input type="text" className="pm-input pm-input-readonly" value={formInit.nim} readOnly disabled />
              </div>
              <div className="pm-field col-span-2">
                <label className="pm-label"><BookOpen size={13} /> Program Studi</label>
                <div className="pm-readonly-badge-row">
                  <input type="text" className="pm-input pm-input-readonly" value={formInit.prodi} readOnly disabled />
                  
                </div>
              </div>
            </div>

            {/* Section: Data Instansi */}
            <div className="pm-section-label" style={{ marginTop: '24px' }}>
              <Building2 size={13} />
              <span>Data Instansi Magang</span>
            </div>
            <div className="pm-grid-2">
              <div className="pm-field col-span-2">
                <label className="pm-label"><User size={13} /> Kepada Yth. <span className="pm-req">*</span></label>
                <input
                  type="text"
                  className={`pm-input ${formErrors.kepadaYth ? 'pm-input-error' : ''} ${isPending ? 'pm-input-readonly' : ''}`}
                  value={formInit.kepadaYth}
                  onChange={e => handleFormChange('kepadaYth', e.target.value)}
                  disabled={isPending}
                  placeholder="Contoh: Pimpinan HRD / Direktur Operasional"
                />
                {formErrors.kepadaYth && <span className="pm-error-msg">{formErrors.kepadaYth}</span>}
              </div>

              <div className="pm-field col-span-2">
                <label className="pm-label"><Building2 size={13} /> Nama Instansi / Perusahaan <span className="pm-req">*</span></label>
                <input
                  type="text"
                  className={`pm-input ${formErrors.namaInstansi ? 'pm-input-error' : ''} ${isPending ? 'pm-input-readonly' : ''}`}
                  value={formInit.namaInstansi}
                  onChange={e => handleFormChange('namaInstansi', e.target.value)}
                  disabled={isPending}
                  placeholder="Contoh: PT. Telekomunikasi Indonesia, Tbk."
                />
                {formErrors.namaInstansi && <span className="pm-error-msg">{formErrors.namaInstansi}</span>}
              </div>

              <div className="pm-field col-span-2">
                <label className="pm-label"><MapPin size={13} /> Alamat Instansi <span className="pm-req">*</span></label>
                <textarea
                  className={`pm-input pm-textarea ${formErrors.alamatInstansi ? 'pm-input-error' : ''} ${isPending ? 'pm-input-readonly' : ''}`}
                  value={formInit.alamatInstansi}
                  onChange={e => handleFormChange('alamatInstansi', e.target.value)}
                  disabled={isPending}
                  placeholder="Masukkan alamat lengkap kantor instansi..."
                  rows="3"
                />
                {formErrors.alamatInstansi && <span className="pm-error-msg">{formErrors.alamatInstansi}</span>}
              </div>

              <div className="pm-field">
                <label className="pm-label"><Calendar size={13} /> Semester <span className="pm-req">*</span></label>
                <div className="pm-select-wrap">
                  <select
                    className={`pm-input pm-select ${isPending ? 'pm-input-readonly' : ''}`}
                    value={formInit.semester}
                    onChange={e => handleFormChange('semester', e.target.value)}
                    disabled={isPending}
                  >
                    {['5','6','7','8'].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                  <ChevronRight size={14} className="pm-select-icon" />
                </div>
              </div>

              <div className="pm-field">
                <label className="pm-label"><Calendar size={13} /> Tahun Akademik <span className="pm-req">*</span></label>
                <input
                  type="text"
                  className={`pm-input ${formErrors.tahunAkademik ? 'pm-input-error' : ''} ${isPending ? 'pm-input-readonly' : ''}`}
                  value={formInit.tahunAkademik}
                  onChange={e => handleFormChange('tahunAkademik', e.target.value)}
                  disabled={isPending}
                  placeholder="Contoh: 2026/2027"
                />
                {formErrors.tahunAkademik && <span className="pm-error-msg">{formErrors.tahunAkademik}</span>}
              </div>
            </div>

            {/* Status Check Links */}
            <div className="pm-status-links">
              <div className="pm-status-links-header">
                <Info size={14} />
                <span>Cek status pengajuan surat Anda melalui:</span>
              </div>
              <div className="pm-links-row">
                <a href="https://fik.amikom.ac.id/page/status-pengajuan-layanan" target="_blank" rel="noopener noreferrer" className="pm-link-chip">
                  <ExternalLink size={12} />
                  <span>Portal FIK Amikom</span>
                </a>
                <a href="http://t.me/AMIKOMFakultasbot" target="_blank" rel="noopener noreferrer" className="pm-link-chip pm-link-tg">
                  <MessageCircle size={12} />
                  <span>Telegram Bot AMIKOM</span>
                </a>
              </div>
            </div>

            {/* Actions */}
            {!isPending && (
              <div className="pm-form-actions">
                <button type="button" className="pm-btn-cancel" onClick={() => setIsApplyingId(false)}>
                  Batal
                </button>
                <button type="submit" className="pm-btn-submit" disabled={isSubmittingFik}>
                  {isSubmittingFik ? (
                    <>
                      <span className="spinner" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                      Mengirim ke Backend FIK...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Simpan & Ajukan Pendaftaran
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Inline Styles */}
        <style>{`
          .pm-form-wrapper {
            padding: 8px 0 40px;
          }

          /* PENDING BANNER */
          .pm-pending-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 1px solid #fde68a;
            border-radius: 18px;
            padding: 20px 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(251, 191, 36, 0.12);
          }

          .pm-pending-left {
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }

          .pm-pending-icon-wrap {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #ffffff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          }

          .pm-pending-label {
            font-size: 10px;
            font-weight: 700;
            color: #b45309;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }

          .pm-pending-title {
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            font-weight: 800;
            color: #92400e;
            margin-bottom: 4px;
          }

          .pm-pending-desc {
            font-size: 12px;
            color: #b45309;
            line-height: 1.5;
            max-width: 480px;
          }

          .pm-sim-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }

          .pm-sim-tag {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 1px;
            background: #fdf2f8;
            color: #db2777;
            border: 1px solid #fbcfe8;
            padding: 2px 8px;
            border-radius: 4px;
          }

          .pm-sim-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #db2777, #be185d);
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .pm-sim-btn:hover {
            background: linear-gradient(135deg, #be185d, #9d174d);
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(219, 39, 119, 0.4);
          }

          /* FORM CARD */
          .pm-form-card {
            background: #ffffff;
            border-radius: 24px;
            border: 1px solid #e9e2f2;
            box-shadow: 0 12px 40px rgba(180, 50, 242, 0.06);
            overflow: hidden;
          }

          .pm-form-header {
            position: relative;
            padding: 32px;
            background: linear-gradient(135deg, #9f1be0 0%, #B432F2 45%, #7c3aed 100%);
            overflow: hidden;
          }

          .pm-header-bg-decoration {
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          }

          .pm-header-content {
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 20px;
          }

          .pm-header-icon {
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.15);
            border: 1.5px solid rgba(255, 255, 255, 0.25);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            flex-shrink: 0;
            backdrop-filter: blur(4px);
          }

          .pm-header-sub {
            font-size: 10px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 6px;
          }

          .pm-header-title {
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 6px;
            line-height: 1.3;
          }

          .pm-header-note {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.75);
          }

          /* BACK BUTTON */
          .pm-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .pm-back-btn:hover {
            background: #ffffff;
            border-color: #B432F2;
            color: #B432F2;
          }

          /* SECTION LABEL */
          .pm-section-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            font-weight: 800;
            color: #B432F2;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f6f1fb;
          }

          /* GRID */
          .pm-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px 20px;
            margin-bottom: 4px;
          }

          .pm-grid-2 .col-span-2 {
            grid-column: span 2;
          }

          /* FIELD */
          .pm-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .pm-label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .pm-req {
            color: #ef4444;
            font-weight: 900;
          }

          .pm-field-note {
            font-size: 10px;
            color: #94a3b8;
            font-weight: 500;
          }

          .pm-input {
            width: 100%;
            padding: 11px 14px;
            border-radius: 10px;
            border: 1.5px solid #e2e8f0;
            background: #ffffff;
            color: #0f172a;
            font-size: 13.5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }

          .pm-input:focus {
            border-color: #B432F2;
            box-shadow: 0 0 0 3px rgba(180, 50, 242, 0.1);
            background: #fdfaff;
          }

          .pm-input-error {
            border-color: #ef4444 !important;
            background-color: #fef2f2 !important;
          }

          .pm-input-error:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
          }

          .pm-input-readonly {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
            color: #64748b !important;
            cursor: not-allowed !important;
          }

          .pm-textarea {
            resize: vertical;
            min-height: 84px;
          }

          .pm-select-wrap {
            position: relative;
          }

          .pm-select {
            appearance: none;
            -webkit-appearance: none;
            padding-right: 36px;
            cursor: pointer;
          }

          .pm-select-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%) rotate(90deg);
            color: #94a3b8;
            pointer-events: none;
          }

          .pm-readonly-badge-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .pm-auto-badge {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            color: #059669;
            font-size: 9px;
            font-weight: 800;
            padding: 3px 10px;
            border-radius: 6px;
            border: 1px solid #a7f3d0;
            white-space: nowrap;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          .pm-error-msg {
            color: #ef4444;
            font-size: 11px;
            font-weight: 600;
          }

          /* STATUS LINKS */
          .pm-status-links {
            margin-top: 24px;
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px 20px;
          }

          .pm-status-links-header {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 12px;
          }

          .pm-status-links-header svg {
            color: #B432F2;
          }

          .pm-links-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .pm-link-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 99px;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #B432F2;
            transition: all 0.2s ease;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          }

          .pm-link-chip:hover {
            border-color: #B432F2;
            background: #fdfaff;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(180, 50, 242, 0.15);
          }

          .pm-link-tg {
            color: #0088cc;
            border-color: #bae6fd;
          }

          .pm-link-tg:hover {
            border-color: #0088cc;
            background: #f0f9ff;
          }

          /* FORM ACTIONS */
          .pm-form-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid #f6f1fb;
          }

          .pm-btn-cancel {
            padding: 12px 22px;
            border-radius: 10px;
            border: 1.5px solid #e2e8f0;
            background: #ffffff;
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .pm-btn-cancel:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            color: #0f172a;
          }

          .pm-btn-submit {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            border-radius: 10px;
            border: none;
            background: linear-gradient(135deg, #B432F2, #9f1be0);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(180, 50, 242, 0.3);
            transition: all 0.2s ease;
          }

          .pm-btn-submit:hover {
            background: linear-gradient(135deg, #9f1be0, #8900ff);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(180, 50, 242, 0.4);
          }

          @media (max-width: 640px) {
            .pm-grid-2 {
              grid-template-columns: 1fr;
            }
            .pm-grid-2 .col-span-2 {
              grid-column: span 1;
            }
            .pm-form-header {
              padding: 24px 20px;
            }
            .pm-header-content {
              flex-direction: column;
            }
            .pm-pending-banner {
              flex-direction: column;
              align-items: flex-start;
            }
            .pm-form-actions {
              flex-direction: column-reverse;
            }
            .pm-btn-cancel, .pm-btn-submit {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    );
  }

  // ─── RENDER 3: EMPTY STATE ────────────────────────────────────────────────
  return (
    <div className="tab-pane fade-in">
      <div className="pm-empty-outer">
        {/* Decorative circles */}
        <div className="pm-deco-circle pm-deco-1" />
        <div className="pm-deco-circle pm-deco-2" />

        <div className="pm-empty-card">
          <div className="pm-empty-icon-ring">
            <div className="pm-empty-icon-inner">
              <Building2 size={34} />
            </div>
          </div>

          <h2 className="pm-empty-title">Belum Ada Pengajuan Magang</h2>
          <p className="pm-empty-desc">
            Mulai perjalanan magang Anda dengan mengajukan pendaftaran ke Fakultas Ilmu Komputer. Setelah mendapatkan persetujuan dan ID Magang, Anda bisa mengelola seluruh proses pengajuan di sini.
          </p>

          <div className="pm-empty-steps">
            {[
              { icon: '📋', label: 'Isi Formulir Pendaftaran' },
              { icon: '✅', label: 'Tunggu ACC Fakultas' },
              { icon: '🚀', label: 'Kelola Pengajuan Magang' },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="pm-step-chip">
                  <span>{step.icon}</span>
                  <span>{step.label}</span>
                </div>
                {i < 2 && <div className="pm-step-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>

          <button className="pm-btn-submit pm-empty-btn" onClick={() => setIsApplyingId(true)}>
            <Briefcase size={16} />
            Pengajuan Magang
          </button>
        </div>
      </div>

      <style>{`
        .pm-empty-outer {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 480px;
          padding: 40px 20px;
          overflow: hidden;
        }

        .pm-deco-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180, 50, 242, 0.07), transparent 70%);
          pointer-events: none;
        }

        .pm-deco-1 {
          width: 500px;
          height: 500px;
          top: -150px;
          right: -100px;
        }

        .pm-deco-2 {
          width: 350px;
          height: 350px;
          bottom: -120px;
          left: -80px;
        }

        .pm-empty-card {
          position: relative;
          background: #ffffff;
          border: 1.5px solid #e9e2f2;
          border-radius: 28px;
          padding: 48px 40px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          box-shadow: 0 16px 48px rgba(180, 50, 242, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .pm-empty-icon-ring {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(180, 50, 242, 0.12), rgba(139, 0, 255, 0.06));
          border: 2px solid rgba(180, 50, 242, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
        }

        .pm-empty-icon-ring::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px dashed rgba(180, 50, 242, 0.25);
        }

        .pm-empty-icon-inner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #B432F2, #9f1be0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(180, 50, 242, 0.35);
        }

        .pm-empty-title {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .pm-empty-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 380px;
        }

        .pm-empty-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .pm-step-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 99px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
        }

        .pm-step-arrow {
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 700;
        }

        .pm-btn-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #B432F2, #9f1be0);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(180, 50, 242, 0.3);
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .pm-btn-submit:hover {
          background: linear-gradient(135deg, #9f1be0, #8900ff);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(180, 50, 242, 0.4);
        }

        .pm-empty-btn {
          padding: 14px 32px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default PengajuanMagang;
