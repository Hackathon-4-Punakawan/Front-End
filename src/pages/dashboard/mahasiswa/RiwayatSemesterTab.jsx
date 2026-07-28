import React, { useState, useEffect } from 'react';
import { 
  History, 
  Calendar, 
  Building2, 
  UserCheck, 
  FileCheck, 
  Download, 
  Eye, 
  CheckCircle2, 
  Award, 
  Clock, 
  FileText, 
  GraduationCap, 
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getMahasiswaRiwayatSemesterApi } from '../../../services/pengajuanFikService';

const RiwayatSemesterTab = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);
  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState(0);
  const [previewDoc, setPreviewDoc] = useState(null);

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  useEffect(() => {
    const fetchRiwayat = async () => {
      setLoading(true);
      try {
        const res = await getMahasiswaRiwayatSemesterApi(token);
        if (res.success && res.data) {
          setHistoryData(res.data);
        }
      } catch (err) {
        console.error('Gagal mengambil data riwayat semester:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, [token]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        marginTop: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3.5px solid #e2e8f0',
          borderTopColor: '#B432F2',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ marginTop: '14px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
          Memuat riwayat magang per semester...
        </span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const semesters = historyData?.riwayat_per_semester || [];
  const currentSemester = semesters[selectedSemesterIndex] || semesters[0];
  const mhs = historyData?.mahasiswa;

  return (
    <div className="riwayat-semester-container fade-in">
      {/* Header Banner */}
      <div className="riwayat-header-banner" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
        borderRadius: '24px',
        padding: '32px 36px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
        marginBottom: '28px'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,50,242,0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '14px' }}>
              <History size={14} color="#e9d5ff" />
              <span>ARSIP RESMI DOKUMEN & MAGANG</span>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              Histori Magang Per Semester
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
              Lihat riwayat keikutsertaan magang, DPL pembimbing, ringkasan konversi SKS, serta berkas dokumen resmi yang telah disetujui (ACC) di setiap semester.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #B432F2 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px',
              boxShadow: '0 4px 12px rgba(180, 50, 242, 0.4)'
            }}>
              {historyData?.total_periode || 2}
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', fontWeight: '600' }}>TOTAL PERIODE</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>Magang & Studi Independen</span>
            </div>
          </div>
        </div>

        {/* Semester Tabs Selector */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '28px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          overflowX: 'auto'
        }}>
          {semesters.map((sem, idx) => (
            <button
              key={sem.semester_number}
              onClick={() => setSelectedSemesterIndex(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                borderRadius: '12px',
                background: selectedSemesterIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                color: selectedSemesterIndex === idx ? '#0f172a' : '#cbd5e1',
                border: selectedSemesterIndex === idx ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: selectedSemesterIndex === idx ? '0 4px 14px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <Calendar size={16} color={selectedSemesterIndex === idx ? '#B432F2' : '#94a3b8'} />
              <span>Semester {sem.semester_number}</span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '20px',
                background: selectedSemesterIndex === idx ? '#f1f5f9' : 'rgba(255,255,255,0.15)',
                color: selectedSemesterIndex === idx ? '#64748b' : '#ffffff'
              }}>
                {sem.semester_type} {sem.tahun_akademik}
              </span>
            </button>
          ))}
        </div>
      </div>

      {currentSemester && (
        <>
          {/* Main Semester Card Info */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#B432F2', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {currentSemester.semester_label}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>
                  {currentSemester.program?.nama_instansi}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '600' }}>
                  {currentSemester.program?.posisi} • {currentSemester.program?.jenis_program}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  background: currentSemester.program?.status_badge?.includes('SELESAI') ? '#ecfdf5' : '#f0f9ff',
                  color: currentSemester.program?.status_badge?.includes('SELESAI') ? '#059669' : '#0284c7',
                  fontSize: '12px',
                  fontWeight: '800',
                  border: `1px solid ${currentSemester.program?.status_badge?.includes('SELESAI') ? '#a7f3d0' : '#bae6fd'}`
                }}>
                  <CheckCircle2 size={15} />
                  {currentSemester.program?.status_badge || 'SELESAI VALIDASI'}
                </span>
              </div>
            </div>

            {/* Grid Stats per Semester */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9'
            }}>
              {/* DPL Card */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block' }}>DOSEN PEMBIMBING (DPL)</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                    {currentSemester.program?.dosen_pembimbing?.nama}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>
                    NIDN: {currentSemester.program?.dosen_pembimbing?.nidn}
                  </span>
                </div>
              </div>

              {/* SKS & Konversi Card */}
              <div style={{
                background: '#faf5ff',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #f3e8ff',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#f3e8ff',
                  color: '#B432F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', display: 'block' }}>RINGKASAN KONVERSI SKS</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#581c87' }}>
                    {currentSemester.ringkasan_konversi?.total_sks || 20} SKS ({currentSemester.ringkasan_konversi?.total_mk || 5} MK)
                  </span>
                  <span style={{ fontSize: '12px', color: '#9333ea', fontWeight: '600', display: 'block' }}>
                    Nilai Rata-rata: {currentSemester.ringkasan_konversi?.nilai_rata_rata || '91.8'} ({currentSemester.ringkasan_konversi?.nilai_huruf || 'A'})
                  </span>
                </div>
              </div>

              {/* Durasi Card */}
              <div style={{
                background: '#f0fdf4',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #dcfce7',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', display: 'block' }}>DURASI PELAKSANAAN</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#14532d' }}>
                    {currentSemester.program?.durasi || '6 Bulan'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#15803d', display: 'block' }}>
                    Status: {currentSemester.program?.status_program}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section List Berkas Dokumen ACC */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck size={20} color="#B432F2" />
                  <span>Berkas & Dokumen Resmi ACC ({currentSemester.dokumen_acc?.length || 0})</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Seluruh surat keputusan, pengantar, KHS, dan sertifikat yang telah divalidasi dan disetujui di semester ini.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {currentSemester.dokumen_acc?.map((doc) => (
                <div
                  key={doc.id_dokumen}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d8b4fe';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(180, 50, 242, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f1f5f9';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: doc.jenis_dokumen === 'SURAT_PENGANTAR_FIK' ? '#B432F2' : doc.jenis_dokumen === 'SK_DPL' ? '#3b82f6' : '#10b981'
                  }} />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: '#f1f5f9',
                        color: '#475569'
                      }}>
                        {doc.kategori || 'Fakultas Ilmu Komputer'}
                      </span>

                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={13} />
                        {doc.status_approval || 'Disetujui'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                      {doc.nama_dokumen}
                    </h4>

                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                      <span style={{ display: 'block' }}>Nomor: <strong>{doc.nomor_surat}</strong></span>
                      <span style={{ display: 'block', marginTop: '2px', color: '#94a3b8' }}>Tanggal ACC: {doc.tanggal_acc}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f8fafc',
                    marginTop: 'auto'
                  }}>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#faf5ff',
                        color: '#B432F2',
                        border: '1px solid #f3e8ff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Download size={14} />
                      <span>Unduh</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal Preview Dokumen */}
      {previewDoc && (
        <div style={{
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
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            animation: 'modalSlide 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#B432F2', textTransform: 'uppercase' }}>
                  {previewDoc.kategori}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  {previewDoc.nama_dokumen}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div style={{
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Status Validasi:</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#34d399' }}>✓ ACC & SAH</span>
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0' }}>
                  <p style={{ margin: '0 0 4px 0' }}>Nomor Dokumen: <strong>{previewDoc.nomor_surat}</strong></p>
                  <p style={{ margin: 0 }}>Tanggal ACC: <strong>{previewDoc.tanggal_acc}</strong></p>
                </div>
              </div>

              <div style={{
                height: '300px',
                background: '#f1f5f9',
                borderRadius: '14px',
                border: '2px dashed #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                textAlign: 'center',
                padding: '20px'
              }}>
                <FileText size={48} color="#B432F2" />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#334155', margin: '0 0 4px 0' }}>
                    Preview Berkas PDF Tersedia
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Dokumen ini dapat langsung diunduh atau dibuka di tab baru untuk dicetak.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              background: '#f8fafc',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px'
            }}>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>
              <a
                href={previewDoc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #B432F2 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(180, 50, 242, 0.3)'
                }}
              >
                <ExternalLink size={15} />
                <span>Buka Dokumen PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatSemesterTab;
