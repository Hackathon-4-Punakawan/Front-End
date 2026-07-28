import React, { useState, useEffect } from 'react';
import { getPengajuanDplHelperInfoApi, submitPengajuanDplApi } from '../../../services/pengajuanDplService';
import { uploadPdfFileApi } from '../../../services/uploadService';
import {
  ArrowLeft, Send, FileText, User, Mail, Hash, BookOpen,
  Clock, CheckCircle2, AlertCircle, UploadCloud, X
} from 'lucide-react';

const Field = ({ k, label, icon: Icon, placeholder, type = 'text', readOnly = false, form, errors, set }) => (
  <div className="dpf-field">
    <label className="dpf-label">{Icon && <Icon size={12} />} {label}</label>
    <input
      type={type}
      className={`dpf-input ${errors[k] ? 'dpf-input-error' : ''} ${readOnly ? 'dpf-input-readonly' : ''}`}
      value={form[k]}
      onChange={e => !readOnly && set(k, e.target.value)}
      readOnly={readOnly}
      disabled={readOnly}
      placeholder={placeholder}
    />
    {errors[k] && <span className="dpf-error">{errors[k]}</span>}
    {readOnly && <span className="dpf-auto-note">Terisi otomatis</span>}
  </div>
);

const FileUploadField = ({ label, fieldKey, value, onChange, accept, icon: Icon }) => {
  const hasFile = value !== null;
  return (
    <div className="dpf-field">
      <label className="dpf-label"><Icon size={12} /> {label}</label>
      <label className="dpf-file-area" style={hasFile ? { borderColor: '#B432F2', background: '#fdfaff' } : {}}>
        <input
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => onChange(fieldKey, e.target.files[0] || null)}
        />
        {hasFile ? (
          <div className="dpf-file-chosen">
            <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span className="dpf-file-name">{value.name}</span>
            <button
              type="button"
              className="dpf-file-remove"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onChange(fieldKey, null); }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="dpf-file-placeholder">
            <UploadCloud size={20} style={{ color: '#B432F2', marginBottom: '6px' }} />
            <span className="dpf-file-hint">Klik untuk memilih file</span>
            <span className="dpf-file-subhint">{accept.replace(/,/g, ', ')}</span>
          </div>
        )}
      </label>
    </div>
  );
};

const DosenPembimbingForm = ({ currentUser, idMagangValue, onCancel, onSubmit, triggerAlert }) => {
  const [form, setForm] = useState({
    email: currentUser?.email || '',
    idMagang: idMagangValue || '',
    namaMahasiswa: currentUser?.name || '',
    nimMahasiswa: currentUser?.identity || '',
    sksDitempuh: '',
    buktiDiterima: null,
    khs: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  useEffect(() => {
    if (!token) return;
    const loadHelper = async () => {
      const res = await getPengajuanDplHelperInfoApi(token);
      if (res.success && res.data) {
        setForm(p => ({
          ...p,
          email: res.data.email || p.email,
          idMagang: res.data.id_magang || p.idMagang,
          namaMahasiswa: res.data.nama_mahasiswa || p.namaMahasiswa,
          nimMahasiswa: res.data.nim_mahasiswa || p.nimMahasiswa,
        }));
      }
    };
    loadHelper();
  }, [token]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const c = { ...p }; delete c[k]; return c; });
  };

  const validate = () => {
    const e = {};
    if (!form.sksDitempuh) e.sksDitempuh = 'Jumlah SKS wajib diisi';
    if (!form.buktiDiterima) e.buktiDiterima = 'Bukti diterima magang wajib diunggah';
    if (!form.khs) e.khs = 'Dokumen KHS wajib diunggah';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      triggerAlert('Formulir Belum Lengkap', 'Harap lengkapi semua kolom dan unggah berkas yang wajib.', 'error');
      return;
    }

    setIsSubmitting(true);
    let buktiUrl = 'https://drive.google.com/file/d/bukti_diterima_magang.pdf';
    let khsUrl = 'https://drive.google.com/file/d/dokumen_khs.pdf';

    try {
      if (form.buktiDiterima && typeof form.buktiDiterima !== 'string') {
        const up = await uploadPdfFileApi(form.buktiDiterima);
        if (up.success) buktiUrl = up.data.url;
      }
      if (form.khs && typeof form.khs !== 'string') {
        const up = await uploadPdfFileApi(form.khs);
        if (up.success) khsUrl = up.data.url;
      }
    } catch (err) {
      console.error('Error uploading PDF in DPL form:', err);
    }

    const payload = {
      sks_ditempuh: Number(form.sksDitempuh),
      bukti_diterima_magang: buktiUrl,
      file_khs: khsUrl,
    };

    const res = await submitPengajuanDplApi(token, payload);
    setIsSubmitting(false);

    if (res.success) {
      onSubmit({
        ...form,
        namaDPL: res.data?.nama_dpl || 'Drs. Kusrini, M.Kom.',
        skDplUrl: res.data?.sk_dpl_url,
      });
    } else {
      triggerAlert('Gagal Mengirimkan Pengajuan', res.message || 'Gagal mengajukan DPL.', 'error');
    }
  };

  return (
    <div className="dpf-wrapper fade-in">
      {/* Sticky Header */}
      <div className="dpf-sticky-header">
        <button className="dpf-back-btn" onClick={onCancel}>
          <ArrowLeft size={15} /> Kembali ke Dashboard
        </button>
        <div className="dpf-id-chip">
          <CheckCircle2 size={13} />
          ID Magang: <strong>{idMagangValue}</strong>
        </div>
      </div>

      {/* Hero Header */}
      <div className="dpf-hero">
        <div className="dpf-hero-deco dpf-hero-deco-1" />
        <div className="dpf-hero-deco dpf-hero-deco-2" />
        <div className="dpf-hero-content">
          <div>
            <p className="dpf-hero-sub">Fakultas Ilmu Komputer</p>
            <h1 className="dpf-hero-title">Pengajuan Dosen Pembimbing Magang</h1>
            <p className="dpf-hero-desc">Lengkapi formulir pengajuan dosen pembimbing dengan mengunggah KHS dan bukti penerimaan magang resmi.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="dpf-body">
        <div className="dpf-section-card">
          <div className="dpf-section-head">
            <div className="dpf-section-icon"><FileText size={16} /></div>
            <div>
              <h2 className="dpf-section-title">Formulir Pengajuan Dosen Pembimbing</h2>
              <p className="dpf-section-desc">Pastikan total SKS yang Anda masukkan sesuai dengan KHS terbaru.</p>
            </div>
          </div>

          <div className="dpf-grid-2">
            <Field k="email" label="Email Mahasiswa" icon={Mail} readOnly form={form} errors={errors} set={set} />
            <Field k="idMagang" label="ID Magang" icon={Hash} readOnly form={form} errors={errors} set={set} />
            <Field k="namaMahasiswa" label="Nama Mahasiswa" icon={User} readOnly form={form} errors={errors} set={set} />
            <Field k="nimMahasiswa" label="NIM Mahasiswa" icon={Hash} readOnly form={form} errors={errors} set={set} />

            <div className="dpf-field col-span-2">
              <Field k="sksDitempuh" label="Total Jumlah SKS yang Sudah Ditempuh" icon={BookOpen} type="number" placeholder="Contoh: 110" form={form} errors={errors} set={set} />
            </div>
          </div>

          <div className="dpf-subsection-label" style={{ marginTop: '28px' }}>Berkas / Dokumen Pendukung</div>
          <div className="dpf-grid-2">
            <FileUploadField label="Bukti Diterima Magang" fieldKey="buktiDiterima" value={form.buktiDiterima} onChange={set} accept=".pdf,.jpg,.png" icon={FileText} />
            <FileUploadField label="Kartu Hasil Studi (KHS)" fieldKey="khs" value={form.khs} onChange={set} accept=".pdf,.jpg,.png" icon={BookOpen} />
          </div>
        </div>

        {/* Action Bar */}
        <div className="dpf-action-bar">
          <button type="button" className="dpf-btn-cancel" onClick={onCancel}>Batal</button>
          <button type="submit" className="dpf-btn-submit">
            <Send size={15} />
            Kirim Pengajuan Dosen Pembimbing
          </button>
        </div>
      </form>

      <style>{`
        .dpf-wrapper { padding-bottom: 60px; }

        .dpf-sticky-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 0 0 18px; flex-wrap: wrap;
        }
        .dpf-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #fff; color: #475569; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .dpf-back-btn:hover { border-color: #B432F2; color: #B432F2; background: #fdfaff; }
        .dpf-id-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 99px; font-size: 12px; font-weight: 600; color: #15803d;
        }
        .dpf-id-chip strong { font-family: 'Outfit', monospace; font-weight: 800; letter-spacing: 0.5px; }

        .dpf-hero {
          position: relative;
          background: linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%);
          border-radius: 22px; padding: 32px; margin-bottom: 24px; overflow: hidden;
        }
        .dpf-hero-deco { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.06); pointer-events: none; }
        .dpf-hero-deco-1 { width: 280px; height: 280px; top: -100px; right: -60px; }
        .dpf-hero-deco-2 { width: 160px; height: 160px; bottom: -60px; left: 20px; }
        .dpf-hero-content { position: relative; display: flex; align-items: flex-start; gap: 20px; }
        .dpf-hero-sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .dpf-hero-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; line-height: 1.25; }
        .dpf-hero-desc { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 560px; }

        .dpf-body { display: flex; flex-direction: column; gap: 20px; }

        .dpf-section-card {
          background: #fff; border: 1.5px solid #e9e2f2; border-radius: 20px;
          padding: 28px; box-shadow: 0 4px 20px rgba(180,50,242,0.04);
        }
        .dpf-section-head {
          display: flex; align-items: flex-start; gap: 14px;
          margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9;
        }
        .dpf-section-icon {
          width: 40px; height: 40px; border-radius: 11px;
          background: linear-gradient(135deg, #a855f7, #9333ea); color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 10px rgba(168,85,247,0.25);
        }
        .dpf-section-title { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .dpf-section-desc { font-size: 12px; color: #64748b; }

        .dpf-subsection-label {
          font-size: 10px; font-weight: 800; color: #9333ea; text-transform: uppercase;
          letter-spacing: 1px; margin: 22px 0 14px; padding-top: 18px; border-top: 1px dashed #e9e2f2;
        }

        .dpf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
        .dpf-grid-2 .col-span-2 { grid-column: span 2; }

        .dpf-field { display: flex; flex-direction: column; gap: 5px; }
        .dpf-label { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; }
        .dpf-auto-note { font-size: 10px; color: #94a3b8; font-weight: 500; }

        .dpf-input {
          width: 100%; padding: 10px 13px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #fff; color: #0f172a;
          font-size: 13.5px; font-family: inherit; outline: none;
          transition: all 0.2s; box-sizing: border-box;
        }
        .dpf-input:focus { border-color: #B432F2; box-shadow: 0 0 0 3px rgba(180,50,242,0.1); background: #fdfaff; }
        .dpf-input-error { border-color: #ef4444 !important; background: #fef2f2 !important; }
        .dpf-input-readonly { background: #f8fafc !important; color: #64748b !important; cursor: not-allowed !important; }
        .dpf-error { font-size: 11px; color: #ef4444; font-weight: 600; }

        .dpf-file-area {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 2px dashed #d1d5db; border-radius: 12px; padding: 18px 12px;
          cursor: pointer; background: #fafafa; transition: all 0.2s; min-height: 90px;
        }
        .dpf-file-area:hover { border-color: #B432F2; background: #fdfaff; }
        .dpf-file-placeholder { display: flex; flex-direction: column; align-items: center; }
        .dpf-file-hint { font-size: 12px; font-weight: 700; color: #475569; }
        .dpf-file-subhint { font-size: 10px; color: #94a3b8; margin-top: 2px; }
        .dpf-file-chosen { display: flex; align-items: center; gap: 8px; width: 100%; }
        .dpf-file-name { font-size: 11px; font-weight: 600; color: #0f172a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dpf-file-remove {
          width: 20px; height: 20px; border-radius: 50%; background: #fee2e2; border: none;
          color: #ef4444; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: background 0.2s;
        }
        .dpf-file-remove:hover { background: #fca5a5; }

        .dpf-action-bar { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 4px; }
        .dpf-btn-cancel {
          padding: 12px 22px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          background: #fff; color: #64748b; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .dpf-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
        .dpf-btn-submit {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 16px rgba(168,85,247,0.3); transition: all 0.2s; font-family: inherit;
        }
        .dpf-btn-submit:hover { background: linear-gradient(135deg, #9333ea, #7c3aed); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(168,85,247,0.4); }

        @media (max-width: 680px) {
          .dpf-grid-2 { grid-template-columns: 1fr; }
          .dpf-grid-2 .col-span-2 { grid-column: span 1; }
          .dpf-hero { padding: 24px 20px; }
          .dpf-action-bar { flex-direction: column-reverse; }
          .dpf-btn-cancel, .dpf-btn-submit { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default DosenPembimbingForm;
