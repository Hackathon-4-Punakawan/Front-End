import React, { useState } from 'react';
import {
  ArrowLeft, Send, FileText, User, Mail, Hash, Phone,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react';

const Field = ({ k, label, icon: Icon, placeholder, type = 'text', readOnly = false, form, errors, set }) => (
  <div className="psf-field">
    <label className="psf-label">{Icon && <Icon size={12} />} {label}</label>
    <input
      type={type}
      className={`psf-input ${errors[k] ? 'psf-input-error' : ''} ${readOnly ? 'psf-input-readonly' : ''}`}
      value={form[k]}
      onChange={e => !readOnly && set(k, e.target.value)}
      readOnly={readOnly}
      disabled={readOnly}
      placeholder={placeholder}
    />
    {errors[k] && <span className="psf-error">{errors[k]}</span>}
    {readOnly && <span className="psf-auto-note">Terisi otomatis</span>}
  </div>
);

const SuratPengantarForm = ({ currentUser, idMagangValue, approvedProposal, onCancel, onSubmit, triggerAlert }) => {
  const [form, setForm] = useState({
    email: currentUser?.email || '',
    idMagang: idMagangValue || '',
    tanggalMulai: approvedProposal?.tanggalMulai || '',
    tanggalSelesai: approvedProposal?.tanggalSelesai || '',
    periodeMagang: '2 Bulan',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const c = { ...p }; delete c[k]; return c; });
  };

  const validate = () => {
    const e = {};
    if (!form.tanggalMulai) e.tanggalMulai = 'Tanggal mulai magang wajib diisi';
    if (!form.tanggalSelesai) e.tanggalSelesai = 'Tanggal berakhir magang wajib diisi';
    if (!form.periodeMagang) e.periodeMagang = 'Periode magang wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    } else {
      triggerAlert('Formulir Belum Lengkap', 'Harap lengkapi semua kolom yang wajib diisi.', 'error');
    }
  };

  return (
    <div className="psf-wrapper fade-in">
      {/* Sticky Header */}
      <div className="psf-sticky-header">
        <button className="psf-back-btn" onClick={onCancel}>
          <ArrowLeft size={15} /> Kembali ke Dashboard
        </button>
        <div className="psf-id-chip">
          <CheckCircle2 size={13} />
          ID Magang: <strong>{idMagangValue}</strong>
        </div>
      </div>

      {/* Hero Header */}
      <div className="psf-hero">
        <div className="psf-hero-deco psf-hero-deco-1" />
        <div className="psf-hero-deco psf-hero-deco-2" />
        <div className="psf-hero-content">
          <div>
            <p className="psf-hero-sub">Fakultas Ilmu Komputer</p>
            <h1 className="psf-hero-title">Pengajuan Surat Pengantar Magang</h1>
            <p className="psf-hero-desc">Permohonan penerbitan surat pengantar resmi dari Fakultas untuk instansi tujuan magang Anda.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="psf-body">
        <div className="psf-section-card">
          <div className="psf-section-head">
            <div className="psf-section-icon"><FileText size={16} /></div>
            <div>
              <h2 className="psf-section-title">Formulir Pengajuan Surat Pengantar</h2>
              <p className="psf-section-desc">Data di bawah ini disesuaikan dengan profil dan proposal yang telah disetujui prodi.</p>
            </div>
          </div>

          <div className="psf-grid-2">
            <Field k="email" label="Email Mahasiswa" icon={Mail} readOnly form={form} errors={errors} set={set} />
            <Field k="idMagang" label="ID Magang" icon={Hash} readOnly form={form} errors={errors} set={set} />
            <Field k="tanggalMulai" label="Tanggal Mulai Magang" icon={Clock} type="date" form={form} errors={errors} set={set} />
            <Field k="tanggalSelesai" label="Tanggal Berakhir Magang" icon={Clock} type="date" form={form} errors={errors} set={set} />

            <div className="psf-field col-span-2">
              <label className="psf-label"><Clock size={12} /> Periode Magang</label>
              <select
                className={`psf-input ${errors.periodeMagang ? 'psf-input-error' : ''}`}
                value={form.periodeMagang}
                onChange={e => set('periodeMagang', e.target.value)}
              >
                <option value="1 Bulan">1 Bulan</option>
                <option value="2 Bulan">2 Bulan</option>
                <option value="3 Bulan">3 Bulan</option>
                <option value="4 Bulan">4 Bulan</option>
                <option value="5 Bulan">5 Bulan</option>
                <option value="6 Bulan">6 Bulan</option>
              </select>
              {errors.periodeMagang && <span className="psf-error">{errors.periodeMagang}</span>}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="psf-action-bar">
          <button type="button" className="psf-btn-cancel" onClick={onCancel}>Batal</button>
          <button type="submit" className="psf-btn-submit">
            <Send size={15} />
            Kirim Surat Pengantar Magang
          </button>
        </div>
      </form>

      <style>{`
        .psf-wrapper { padding-bottom: 60px; }

        .psf-sticky-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 0 0 18px; flex-wrap: wrap;
        }
        .psf-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #fff; color: #475569; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .psf-back-btn:hover { border-color: #B432F2; color: #B432F2; background: #fdfaff; }
        .psf-id-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 99px; font-size: 12px; font-weight: 600; color: #15803d;
        }
        .psf-id-chip strong { font-family: 'Outfit', monospace; font-weight: 800; letter-spacing: 0.5px; }

        .psf-hero {
          position: relative;
          background: linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%);
          border-radius: 22px; padding: 32px; margin-bottom: 24px; overflow: hidden;
        }
        .psf-hero-deco { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.06); pointer-events: none; }
        .psf-hero-deco-1 { width: 280px; height: 280px; top: -100px; right: -60px; }
        .psf-hero-deco-2 { width: 160px; height: 160px; bottom: -60px; left: 20px; }
        .psf-hero-content { position: relative; display: flex; align-items: flex-start; gap: 20px; }
        .psf-step-badge {
          display: flex; flex-direction: column; align-items: center;
          background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 14px; padding: 8px 14px; flex-shrink: 0; backdrop-filter: blur(4px);
        }
        .psf-step-badge span:first-child { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.75); letter-spacing: 1.5px; }
        .psf-step-num { font-size: 26px; font-weight: 900; color: #fff; line-height: 1.1; font-family: 'Outfit', sans-serif; }
        .psf-hero-sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .psf-hero-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; line-height: 1.25; }
        .psf-hero-desc { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 560px; }

        .psf-body { display: flex; flex-direction: column; gap: 20px; }

        .psf-section-card {
          background: #fff; border: 1.5px solid #e9e2f2; border-radius: 20px;
          padding: 28px; box-shadow: 0 4px 20px rgba(180,50,242,0.04);
        }
        .psf-section-head {
          display: flex; align-items: flex-start; gap: 14px;
          margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9;
        }
        .psf-section-icon {
          width: 40px; height: 40px; border-radius: 11px;
          background: linear-gradient(135deg, #a855f7, #9333ea); color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 10px rgba(168,85,247,0.25);
        }
        .psf-section-title { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .psf-section-desc { font-size: 12px; color: #64748b; }

        .psf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
        .psf-grid-2 .col-span-2 { grid-column: span 2; }

        .psf-field { display: flex; flex-direction: column; gap: 5px; }
        .psf-label { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; }
        .psf-auto-note { font-size: 10px; color: #94a3b8; font-weight: 500; }

        .psf-input {
          width: 100%; padding: 10px 13px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #fff; color: #0f172a;
          font-size: 13.5px; font-family: inherit; outline: none;
          transition: all 0.2s; box-sizing: border-box;
        }
        .psf-input:focus { border-color: #B432F2; box-shadow: 0 0 0 3px rgba(180,50,242,0.1); background: #fdfaff; }
        .psf-input-error { border-color: #ef4444 !important; background: #fef2f2 !important; }
        .psf-input-readonly { background: #f8fafc !important; color: #64748b !important; cursor: not-allowed !important; }
        .psf-error { font-size: 11px; color: #ef4444; font-weight: 600; }

        .psf-action-bar { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 4px; }
        .psf-btn-cancel {
          padding: 12px 22px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          background: #fff; color: #64748b; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .psf-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
        .psf-btn-submit {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 16px rgba(168,85,247,0.3); transition: all 0.2s; font-family: inherit;
        }
        .psf-btn-submit:hover { background: linear-gradient(135deg, #9333ea, #7c3aed); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(168,85,247,0.4); }

        @media (max-width: 680px) {
          .psf-grid-2 { grid-template-columns: 1fr; }
          .psf-grid-2 .col-span-2 { grid-column: span 1; }
          .psf-hero { padding: 24px 20px; }
          .psf-hero-content { flex-direction: column; }
          .psf-action-bar { flex-direction: column-reverse; }
          .psf-btn-cancel, .psf-btn-submit { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default SuratPengantarForm;
