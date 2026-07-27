import React from 'react';
import { GraduationCap, AlertCircle, FolderOpen, Eye, Clock, ChevronRight } from 'lucide-react';

const StatusKonversi = ({ handleAlertAction }) => {
  return (
    <div className="tab-pane fade-in">
      <div className="page-heading-with-btn">
        <div className="page-heading">
          <div className="path-breadcrumbs">
            <span>Home</span> / <span>Dashboard</span> / <span className="active">Status Konversi</span>
          </div>
          <h1 className="main-title">Status Konversi Mata Kuliah</h1>
          <p className="main-subtitle">
            Pantau progres persetujuan konversi SKS kegiatan Kampus Merdeka Anda.
          </p>
        </div>
        
        <div className="total-sks-badge">
          <div className="badge-icon-wrap">
            <GraduationCap size={18} />
          </div>
          <div className="badge-text">
            <span className="b-label">TOTAL SKS DIAJUKAN</span>
            <span className="b-val">20 SKS</span>
          </div>
        </div>
      </div>

      {/* Conversion Layout Columns */}
      <div className="conversion-view-layout">
        {/* Left Side: Conversion timeline list */}
        <div className="conversion-left-list">
          {/* Card Block */}
          <div className="conversion-main-card">
            <div className="main-card-header">
              <div className="card-desc-group">
                <span className="category-text-label">MAGANG BERSERTIFIKAT</span>
                <h3 className="internship-title">PT Global Tech Nusantara</h3>
                <span className="internship-role">Software Engineering Intern • Batch 5</span>
              </div>
              <span className="status-capsule badge-purple-solid">Proses Validasi</span>
            </div>

            <div className="overall-progress-section">
              <span className="progress-title-lbl">PROGRES KESELURUHAN</span>
              <div className="progress-slider-wrap">
                <div className="progress-bar-track">
                  <div className="progress-bar-fill fill-purple" style={{ width: '60%' }}></div>
                </div>
                <span className="progress-percentage-lbl">60%</span>
              </div>
            </div>

            {/* Course list detail rows with vertical progress nodes */}
            <div className="conversion-subjects-timeline">
              <h4 className="detail-section-title">Rincian Mata Kuliah</h4>

              {/* Subject Node 1 */}
              <div className="subject-timeline-node">
                <div className="node-subject-header">
                  <div>
                    <h5 className="sub-title">Pengembangan Aplikasi Web Lanjut</h5>
                    <span className="sub-meta">IF184523 • 4 SKS • Semester 6</span>
                  </div>
                  <span className="status-capsule badge-blue-outline">Disetujui Kaprodi</span>
                </div>

                {/* Visual Dots Timeline */}
                <div className="horizontal-nodes">
                  <div className="h-node active">
                    <span className="node-circle">✓</span>
                    <span className="node-lbl">Diajukan</span>
                  </div>
                  <div className="h-node-line active"></div>
                  <div className="h-node active">
                    <span className="node-circle">✓</span>
                    <span className="node-lbl">Validasi Dosen</span>
                  </div>
                  <div className="h-node-line active"></div>
                  <div className="h-node active">
                    <span className="node-circle">✓</span>
                    <span className="node-lbl">Setuju Kaprodi</span>
                  </div>
                  <div className="h-node-line"></div>
                  <div className="h-node">
                    <span className="node-circle"></span>
                    <span className="node-lbl">SK Terbit</span>
                  </div>
                </div>
              </div>

              {/* Subject Node 2 */}
              <div className="subject-timeline-node">
                <div className="node-subject-header">
                  <div>
                    <h5 className="sub-title">Manajemen Proyek Perangkat Lunak</h5>
                    <span className="sub-meta">IF184524 • 3 SKS • Semester 6</span>
                  </div>
                  <span className="status-capsule badge-purple-solid-mini">Validasi Dosen</span>
                </div>

                {/* Visual Dots Timeline */}
                <div className="horizontal-nodes">
                  <div className="h-node active">
                    <span className="node-circle">✓</span>
                    <span className="node-lbl">Diajukan</span>
                  </div>
                  <div className="h-node-line active"></div>
                  <div className="h-node active">
                    <span className="node-circle">✓</span>
                    <span className="node-lbl">Validasi Dosen</span>
                  </div>
                  <div className="h-node-line"></div>
                  <div className="h-node">
                    <span className="node-circle"></span>
                    <span className="node-lbl">Setuju Kaprodi</span>
                  </div>
                  <div className="h-node-line"></div>
                  <div className="h-node">
                    <span className="node-circle"></span>
                    <span className="node-lbl">SK Terbit</span>
                  </div>
                </div>

                {/* Dosen comment box */}
                <div className="dosen-comment-box">
                  <div className="comment-icon">
                    <AlertCircle size={16} />
                  </div>
                  <p className="comment-text">
                    <strong>Catatan Dosen Pembimbing:</strong> Mohon lampirkan ulang bukti logbook minggu ke-4 yang lebih jelas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Supporting documents list & actions */}
        <div className="conversion-right-sidebar">
          <div className="sidebar-box-card">
            <h3 className="box-card-title">
              <FolderOpen size={18} />
              <span>Dokumen Pendukung</span>
            </h3>

            <div className="doc-list-items">
              {/* Doc item 1 */}
              <div className="doc-row">
                <div className="doc-info-wrap">
                  <div className="doc-check-icon checked">✓</div>
                  <div className="doc-text">
                    <h5>Logbook Kegiatan</h5>
                    <span>Diperbarui 2 hari lalu</span>
                  </div>
                </div>
                <button className="doc-view-btn" onClick={() => handleAlertAction('Membuka Logbook Kegiatan')}>
                  <Eye size={16} />
                </button>
              </div>

              {/* Doc item 2 */}
              <div className="doc-row">
                <div className="doc-info-wrap">
                  <div className="doc-check-icon alert">!</div>
                  <div className="doc-text">
                    <h5>Sertifikat Mitra</h5>
                    <span style={{ color: '#ef4444' }}>Belum diunggah</span>
                  </div>
                </div>
                <button className="doc-upload-btn" onClick={() => handleAlertAction('Mengunggah Sertifikat Mitra')}>
                  <span>Unggah</span>
                </button>
              </div>

              {/* Doc item 3 */}
              <div className="doc-row">
                <div className="doc-info-wrap">
                  <div className="doc-check-icon checked">✓</div>
                  <div className="doc-text">
                    <h5>Laporan Akhir</h5>
                    <span>Menunggu penilaian</span>
                  </div>
                </div>
                <button className="doc-view-btn" onClick={() => handleAlertAction('Membuka Laporan Akhir')}>
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <button className="view-history-outline-btn" onClick={() => handleAlertAction('Membuka riwayat pengajuan konversi')}>
              <Clock size={16} />
              <span>Lihat Riwayat Pengajuan</span>
            </button>
          </div>

          {/* Illustration panel */}
          <div className="sidebar-illustration-panel">
            <svg viewBox="0 0 200 150" className="illust-svg" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="160" height="110" rx="10" fill="#f8ebff" stroke="#e9cfbf" strokeWidth="2"/>
              <rect x="40" y="40" width="120" height="8" rx="4" fill="#B432F2" opacity="0.3"/>
              <rect x="40" y="60" width="100" height="8" rx="4" fill="#B432F2" opacity="0.15"/>
              <rect x="40" y="80" width="80" height="8" rx="4" fill="#B432F2" opacity="0.15"/>
              <circle cx="150" cy="90" r="25" fill="#B432F2" opacity="0.2"/>
              <path d="M142 90l5 5 10-10" stroke="#B432F2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusKonversi;
