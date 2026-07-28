import React, { useState, useEffect } from 'react';
import { getProposalMagangHelperInfoApi, submitProposalMagangApi } from '../../../services/proposalMagangService';
import {
  ArrowLeft, Send, FileText, User, Mail, Hash, Phone,
  Building2, MapPin, Clock, Briefcase, BookOpen, ClipboardList,
  ChevronRight, UploadCloud, CheckCircle2, AlertCircle, X
} from 'lucide-react';

const Field = ({ k, label, icon: Icon, placeholder, type = 'text', readOnly = false, form, errors, set }) => (
  <div className="pmf-field">
    <label className="pmf-label">{Icon && <Icon size={12} />} {label}</label>
    <input
      type={type}
      className={`pmf-input ${errors[k] ? 'pmf-input-error' : ''} ${readOnly ? 'pmf-input-readonly' : ''}`}
      value={form[k]}
      onChange={e => !readOnly && set(k, e.target.value)}
      readOnly={readOnly}
      disabled={readOnly}
      placeholder={placeholder}
    />
    {errors[k] && <span className="pmf-error">{errors[k]}</span>}
    {readOnly && <span className="pmf-auto-note">Terisi otomatis</span>}
  </div>
);

const FileUploadField = ({ label, fieldKey, value, onChange, accept, icon: Icon }) => {
  const hasFile = value !== null;
  return (
    <div className="pmf-field">
      <label className="pmf-label"><Icon size={12} /> {label}</label>
      <label className="pmf-file-area" style={hasFile ? { borderColor: '#B432F2', background: '#fdfaff' } : {}}>
        <input
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => onChange(fieldKey, e.target.files[0] || null)}
        />
        {hasFile ? (
          <div className="pmf-file-chosen">
            <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span className="pmf-file-name">{value.name || 'Dokumen_Terlampir.pdf'}</span>
            <button
              type="button"
              className="pmf-file-remove"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onChange(fieldKey, null); }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="pmf-file-placeholder">
            <UploadCloud size={20} style={{ color: '#B432F2', marginBottom: '6px' }} />
            <span className="pmf-file-hint">Klik untuk memilih file</span>
            <span className="pmf-file-subhint">{accept.replace(/,/g, ', ')}</span>
          </div>
        )}
      </label>
    </div>
  );
};

const ProposalMagangForm = ({ currentUser, idMagangData, idMagangValue, onCancel, onSubmit, triggerAlert }) => {
  const [form, setForm] = useState({
    deskripsiRencana: '',
    namaProgramKegiatan: '',
    namaInstansiMBKM: idMagangData?.namaInstansi || '',
    alamatInstansiMBKM: idMagangData?.alamatInstansi || '',
    durasiPelaksanaan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    namaPIC: '',
    jabatanPIC: '',
    emailPIC: '',
    hpPIC: '',
    programDiikuti: 'Magang Berdampak',
    namaMahasiswa: currentUser?.name || '',
    emailMahasiswa: currentUser?.email || '',
    nimMahasiswa: currentUser?.identity || '',
    hpMahasiswa: '',
    alasanMendaftar: '',
    deskripsiKegiatan: '',
    keahlianUtama: '',
    fileCv: null,
    fileKRS: null,
    fileTranskrip: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = currentUser?.token || localStorage.getItem('edushift_token');

  // Load prefilled helper info
  useEffect(() => {
    if (!token) return;
    const loadHelper = async () => {
      const res = await getProposalMagangHelperInfoApi(token);
      if (res.success && res.data) {
        const instansiName = res.data.auto_filled_instansi?.nama_instansi && res.data.auto_filled_instansi.nama_instansi !== '-' 
          ? res.data.auto_filled_instansi.nama_instansi 
          : (idMagangData?.namaInstansi && idMagangData.namaInstansi !== '-' ? idMagangData.namaInstansi : '');
        
        const instansiAddress = res.data.auto_filled_instansi?.alamat_instansi && res.data.auto_filled_instansi.alamat_instansi !== '-' 
          ? res.data.auto_filled_instansi.alamat_instansi 
          : (idMagangData?.alamatInstansi && idMagangData.alamatInstansi !== '-' ? idMagangData.alamatInstansi : '');

        const picName = res.data.auto_filled_instansi?.tujuan_surat && res.data.auto_filled_instansi.tujuan_surat !== '-' 
          ? res.data.auto_filled_instansi.tujuan_surat 
          : (idMagangData?.kepadaYth && idMagangData.kepadaYth !== '-' ? idMagangData.kepadaYth : '');

        setForm(p => ({
          ...p,
          namaMahasiswa: res.data.mahasiswa?.nama || p.namaMahasiswa,
          emailMahasiswa: res.data.mahasiswa?.email || p.emailMahasiswa,
          nimMahasiswa: res.data.mahasiswa?.nim || p.nimMahasiswa,
          namaInstansiMBKM: instansiName || p.namaInstansiMBKM,
          alamatInstansiMBKM: instansiAddress || p.alamatInstansiMBKM,
          namaPIC: p.namaPIC || picName,
        }));
      }
    };
    loadHelper();
  }, [token, idMagangData]);

  const calculateDurasiString = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return '';

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return '';

    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    let totalMonths = yearDiff * 12 + monthDiff;

    const dayDiff = end.getDate() - start.getDate();
    if (dayDiff >= 15) {
      totalMonths += 1;
    }
    if (totalMonths <= 0) totalMonths = 1;

    const monthNamesIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const startMonthName = monthNamesIndo[start.getMonth()];
    const endMonthName = monthNamesIndo[end.getMonth()];
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    let rangeText = '';
    if (startYear === endYear) {
      if (start.getMonth() === end.getMonth()) {
        rangeText = `${startMonthName} ${startYear}`;
      } else {
        rangeText = `${startMonthName} – ${endMonthName} ${startYear}`;
      }
    } else {
      rangeText = `${startMonthName} ${startYear} – ${endMonthName} ${endYear}`;
    }

    return `${totalMonths} Bulan (${rangeText})`;
  };

  const set = (k, v) => {
    setForm(p => {
      const next = { ...p, [k]: v };
      if (k === 'tanggalMulai' || k === 'tanggalSelesai') {
        const autoDuration = calculateDurasiString(
          k === 'tanggalMulai' ? v : p.tanggalMulai,
          k === 'tanggalSelesai' ? v : p.tanggalSelesai
        );
        if (autoDuration) {
          next.durasiPelaksanaan = autoDuration;
        }
      }
      return next;
    });

    if (errors[k]) setErrors(p => { const c = { ...p }; delete c[k]; return c; });
    if ((k === 'tanggalMulai' || k === 'tanggalSelesai') && errors.durasiPelaksanaan) {
      setErrors(p => { const c = { ...p }; delete c.durasiPelaksanaan; return c; });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.deskripsiRencana) e.deskripsiRencana = 'Wajib diisi';
    if (!form.namaProgramKegiatan) e.namaProgramKegiatan = 'Wajib diisi';
    if (!form.durasiPelaksanaan) e.durasiPelaksanaan = 'Wajib diisi';
    if (!form.tanggalMulai) e.tanggalMulai = 'Wajib diisi';
    if (!form.tanggalSelesai) e.tanggalSelesai = 'Wajib diisi';
    if (!form.namaPIC) e.namaPIC = 'Wajib diisi';
    if (!form.jabatanPIC) e.jabatanPIC = 'Wajib diisi';
    if (!form.emailPIC) e.emailPIC = 'Wajib diisi';
    if (!form.hpPIC) e.hpPIC = 'Wajib diisi';
    if (!form.hpMahasiswa) e.hpMahasiswa = 'Wajib diisi';
    if (!form.alasanMendaftar) e.alasanMendaftar = 'Wajib diisi';
    if (!form.deskripsiKegiatan) e.deskripsiKegiatan = 'Wajib diisi';
    if (!form.keahlianUtama) e.keahlianUtama = 'Wajib diisi';
    if (!form.fileCv) e.fileCv = 'File CV wajib diunggah';
    if (!form.fileKRS) e.fileKRS = 'File KRS wajib diunggah';
    if (!form.fileTranskrip) e.fileTranskrip = 'File Transkrip wajib diunggah';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      triggerAlert('Formulir Belum Lengkap', 'Harap lengkapi semua kolom yang wajib diisi.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await submitProposalMagangApi(token, {
      ...form,
      idPengajuan: idMagangData?.id_pengajuan || null,
    });
    setIsSubmitting(false);

    if (res.success) {
      onSubmit(form);
    } else {
      triggerAlert('Gagal Mengirim Proposal', res.message || 'Terjadi kesalahan saat mengirim proposal magang.', 'error');
    }
  };

  return (
    <div className="pmf-wrapper fade-in">
      {/* Sticky Header */}
      <div className="pmf-sticky-header">
        <button className="pmf-back-btn" onClick={onCancel}>
          <ArrowLeft size={15} /> Kembali ke Dashboard
        </button>
        <div className="pmf-id-chip">
          <CheckCircle2 size={13} />
          ID Magang: <strong>{idMagangValue}</strong>
        </div>
      </div>

      {/* Hero Header */}
      <div className="pmf-hero">
        <div className="pmf-hero-deco pmf-hero-deco-1" />
        <div className="pmf-hero-deco pmf-hero-deco-2" />
        <div className="pmf-hero-content">
          <div>
            <p className="pmf-hero-sub">Fakultas Ilmu Komputer · {idMagangData?.namaInstansi || 'Instansi Magang'}</p>
            <h1 className="pmf-hero-title">Mengajukan Proposal Magang</h1>
            <p className="pmf-hero-desc">Lengkapi detail proposal, program MBKM yang diikuti, dan data diri mahasiswa peserta magang.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pmf-body">

        {/* ── SECTION 1: Proposal ─────────────────────────────── */}
        <div className="pmf-section-card">
          <div className="pmf-section-head">
            <div className="pmf-section-icon"><ClipboardList size={16} /></div>
            <div>
              <h2 className="pmf-section-title">Detail Proposal Magang</h2>
              <p className="pmf-section-desc">Informasi rencana dan program kegiatan MBKM</p>
            </div>
          </div>

          <div className="pmf-grid-2">
            <div className="pmf-field col-span-2">
              <label className="pmf-label"><FileText size={12} /> Deskripsi / Rencana Kegiatan</label>
              <textarea
                className={`pmf-input pmf-textarea ${errors.deskripsiRencana ? 'pmf-input-error' : ''}`}
                value={form.deskripsiRencana}
                onChange={e => set('deskripsiRencana', e.target.value)}
                placeholder="Tuliskan deskripsi atau rencana kegiatan magang secara singkat..."
                rows={3}
              />
              {errors.deskripsiRencana && <span className="pmf-error">{errors.deskripsiRencana}</span>}
            </div>

            <Field k="namaProgramKegiatan" label="Nama Program Kegiatan" icon={Briefcase} placeholder="Contoh: Magang Berdampak Batch 2026" form={form} errors={errors} set={set} />
            <Field k="durasiPelaksanaan" label="Durasi Pelaksanaan" icon={Clock} placeholder="Contoh: 6 Bulan (Juli – Desember 2026)" form={form} errors={errors} set={set} />

            <Field k="tanggalMulai" label="Tanggal Mulai Magang" icon={Clock} type="date" form={form} errors={errors} set={set} />
            <Field k="tanggalSelesai" label="Tanggal Berakhir Magang" icon={Clock} type="date" form={form} errors={errors} set={set} />

            <Field k="namaInstansiMBKM" label="Nama Instansi / Tempat Kegiatan MBKM" icon={Building2} placeholder="Nama tempat magang" readOnly={Boolean(form.namaInstansiMBKM && form.namaInstansiMBKM !== '-')} form={form} errors={errors} set={set} />
            <Field k="alamatInstansiMBKM" label="Alamat Tempat Kegiatan MBKM" icon={MapPin} placeholder="Masukkan alamat instansi/perusahaan tempat magang" readOnly={Boolean(form.alamatInstansiMBKM && form.alamatInstansiMBKM !== '-')} form={form} errors={errors} set={set} />
          </div>

          <div className="pmf-subsection-label">Kontak PIC (Person in Charge)</div>
          <div className="pmf-grid-2">
            <Field k="namaPIC" label="Nama PIC" icon={User} placeholder="Nama lengkap PIC" form={form} errors={errors} set={set} />
            <Field k="jabatanPIC" label="Jabatan PIC" icon={Briefcase} placeholder="Contoh: HR Manager" form={form} errors={errors} set={set} />
            <Field k="emailPIC" label="Email PIC" icon={Mail} type="email" placeholder="email.pic@perusahaan.com" form={form} errors={errors} set={set} />
            <Field k="hpPIC" label="Nomor Handphone PIC" icon={Phone} type="tel" placeholder="+62 8xx-xxxx-xxxx" form={form} errors={errors} set={set} />
          </div>
        </div>

        {/* ── SECTION 2: Program ──────────────────────────────── */}
        <div className="pmf-section-card">
          <div className="pmf-section-head">
            <div className="pmf-section-icon pmf-icon-blue"><BookOpen size={16} /></div>
            <div>
              <h2 className="pmf-section-title">Program yang Diikuti</h2>
              <p className="pmf-section-desc">Pilih skema program MBKM yang sesuai</p>
            </div>
          </div>

          <div className="pmf-program-grid">
            {[
              { val: 'Magang Berdampak', desc: 'Program magang berbasis dampak nyata di industri' },
              { val: 'Studi Independen', desc: 'Belajar mandiri dari proyek riil bersama mitra' },
              { val: 'Magang Mandiri', desc: 'Magang atas inisiatif mahasiswa sendiri' },
              { val: 'Studi Independen Mandiri', desc: 'Studi mandiri tanpa skema kampus merdeka' },
            ].map(opt => {
              const active = form.programDiikuti === opt.val;
              return (
                <label key={opt.val} className={`pmf-program-card ${active ? 'pmf-program-active' : ''}`}>
                  <input type="radio" name="programDiikuti" value={opt.val} checked={active} onChange={() => set('programDiikuti', opt.val)} style={{ display: 'none' }} />
                  <div className="pmf-program-radio">{active && <div className="pmf-radio-dot" />}</div>
                  <div>
                    <p className="pmf-program-name">{opt.val}</p>
                    <p className="pmf-program-desc">{opt.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 3: Data Mahasiswa ────────────────────────── */}
        <div className="pmf-section-card">
          <div className="pmf-section-head">
            <div className="pmf-section-icon pmf-icon-green"><User size={16} /></div>
            <div>
              <h2 className="pmf-section-title">Data Mahasiswa Peserta</h2>
              <p className="pmf-section-desc">Data diri, motivasi, dan berkas pendukung mahasiswa</p>
            </div>
          </div>

          <div className="pmf-grid-2">
            <Field k="namaMahasiswa" label="Nama Mahasiswa" icon={User} readOnly form={form} errors={errors} set={set} />
            <Field k="emailMahasiswa" label="Email Mahasiswa" icon={Mail} type="email" readOnly form={form} errors={errors} set={set} />
            <Field k="nimMahasiswa" label="NIM" icon={Hash} readOnly form={form} errors={errors} set={set} />
            <Field k="hpMahasiswa" label="Nomor Handphone" icon={Phone} type="tel" placeholder="+62 8xx-xxxx-xxxx" form={form} errors={errors} set={set} />
          </div>

          {[
            { k: 'alasanMendaftar', label: 'Alasan Mendaftar Kegiatan Project Lapangan', placeholder: 'Tuliskan alasan Anda mendaftar kegiatan project lapangan ini...' },
            { k: 'deskripsiKegiatan', label: 'Deskripsi Singkat Kegiatan Project Lapangan', placeholder: 'Deskripsikan secara singkat kegiatan project lapangan yang akan dilakukan...' },
            { k: 'keahlianUtama', label: 'Keahlian Utama yang Akan Dikembangkan', placeholder: 'Keahlian utama apa yang akan Anda lakukan dan kembangkan selama magang...' },
          ].map(({ k, label, placeholder }) => (
            <div key={k} className="pmf-field" style={{ marginTop: '20px' }}>
              <label className="pmf-label"><FileText size={12} /> {label}</label>
              <textarea
                className={`pmf-input pmf-textarea pmf-textarea-lg ${errors[k] ? 'pmf-input-error' : ''}`}
                value={form[k]}
                onChange={e => set(k, e.target.value)}
                placeholder={placeholder}
                rows={k === 'deskripsiKegiatan' ? 10 : 6}
              />
              {errors[k] && <span className="pmf-error">{errors[k]}</span>}
            </div>
          ))}

          <div className="pmf-subsection-label" style={{ marginTop: '28px' }}>Berkas / Dokumen Pendukung</div>
          <div className="pmf-grid-3">
            <FileUploadField label="Curriculum Vitae (CV)" fieldKey="fileCv" value={form.fileCv} onChange={set} accept=".pdf,.doc,.docx" icon={FileText} />
            <FileUploadField label="KRS Semester Berjalan" fieldKey="fileKRS" value={form.fileKRS} onChange={set} accept=".pdf,.jpg,.png" icon={ClipboardList} />
            <FileUploadField label="Transkrip Nilai" fieldKey="fileTranskrip" value={form.fileTranskrip} onChange={set} accept=".pdf,.jpg,.png" icon={BookOpen} />
          </div>
          {(errors.fileCv || errors.fileKRS || errors.fileTranskrip) && (
            <div className="pmf-files-error-row">
              <AlertCircle size={14} />
              <span>Semua berkas (CV, KRS, Transkrip) wajib diunggah.</span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pmf-action-bar">
          <button type="button" className="pmf-btn-cancel" onClick={onCancel} disabled={isSubmitting}>Batal</button>
          <button type="submit" className="pmf-btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                Mengirim Proposal...
              </>
            ) : (
              <>
                <Send size={15} />
                Kirim Proposal Magang
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        .pmf-wrapper { padding-bottom: 60px; }

        .pmf-sticky-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 0 0 18px; flex-wrap: wrap;
        }
        .pmf-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #fff; color: #475569; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .pmf-back-btn:hover { border-color: #B432F2; color: #B432F2; background: #fdfaff; }
        .pmf-id-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 99px; font-size: 12px; font-weight: 600; color: #15803d;
        }
        .pmf-id-chip strong { font-family: 'Outfit', monospace; font-weight: 800; letter-spacing: 0.5px; }

        .pmf-hero {
          position: relative;
          background: linear-gradient(135deg, #8900ff 0%, #B432F2 50%, #6d28d9 100%);
          border-radius: 22px; padding: 32px; margin-bottom: 24px; overflow: hidden;
        }
        .pmf-hero-deco { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.06); pointer-events: none; }
        .pmf-hero-deco-1 { width: 280px; height: 280px; top: -100px; right: -60px; }
        .pmf-hero-deco-2 { width: 160px; height: 160px; bottom: -60px; left: 20px; }
        .pmf-hero-content { position: relative; display: flex; align-items: flex-start; gap: 20px; }
        .pmf-step-badge {
          display: flex; flex-direction: column; align-items: center;
          background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 14px; padding: 8px 14px; flex-shrink: 0; backdrop-filter: blur(4px);
        }
        .pmf-step-badge span:first-child { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.75); letter-spacing: 1.5px; }
        .pmf-step-num { font-size: 26px; font-weight: 900; color: #fff; line-height: 1.1; font-family: 'Outfit', sans-serif; }
        .pmf-hero-sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .pmf-hero-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; line-height: 1.25; }
        .pmf-hero-desc { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 560px; }

        .pmf-body { display: flex; flex-direction: column; gap: 20px; }

        .pmf-section-card {
          background: #fff; border: 1.5px solid #e9e2f2; border-radius: 20px;
          padding: 28px; box-shadow: 0 4px 20px rgba(180,50,242,0.04);
        }
        .pmf-section-head {
          display: flex; align-items: flex-start; gap: 14px;
          margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9;
        }
        .pmf-section-icon {
          width: 40px; height: 40px; border-radius: 11px;
          background: linear-gradient(135deg, #B432F2, #9f1be0); color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 10px rgba(180,50,242,0.25);
        }
        .pmf-icon-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); box-shadow: 0 4px 10px rgba(59,130,246,0.25); }
        .pmf-icon-green { background: linear-gradient(135deg, #16a34a, #15803d); box-shadow: 0 4px 10px rgba(22,163,74,0.25); }
        .pmf-section-title { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .pmf-section-desc { font-size: 12px; color: #64748b; }

        .pmf-subsection-label {
          font-size: 10px; font-weight: 800; color: #B432F2; text-transform: uppercase;
          letter-spacing: 1px; margin: 22px 0 14px; padding-top: 18px; border-top: 1px dashed #e9e2f2;
        }

        .pmf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
        .pmf-grid-2 .col-span-2 { grid-column: span 2; }
        .pmf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 8px; }

        .pmf-field { display: flex; flex-direction: column; gap: 5px; }
        .pmf-label { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; }
        .pmf-auto-note { font-size: 10px; color: #94a3b8; font-weight: 500; }

        .pmf-input {
          width: 100%; padding: 10px 13px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #fff; color: #0f172a;
          font-size: 13.5px; font-family: inherit; outline: none;
          transition: all 0.2s; box-sizing: border-box;
        }
        .pmf-input:focus { border-color: #B432F2; box-shadow: 0 0 0 3px rgba(180,50,242,0.1); background: #fdfaff; }
        .pmf-input-error { border-color: #ef4444 !important; background: #fef2f2 !important; }
        .pmf-input-readonly { background: #f8fafc !important; color: #64748b !important; cursor: not-allowed !important; }
        .pmf-textarea { resize: vertical; min-height: 80px; }
        .pmf-textarea-lg { min-height: 160px; }
        .pmf-error { font-size: 11px; color: #ef4444; font-weight: 600; }

        .pmf-program-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pmf-program-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; border: 1.5px solid #e2e8f0; border-radius: 13px;
          cursor: pointer; transition: all 0.2s; background: #fafafa;
        }
        .pmf-program-card:hover { border-color: #B432F2; background: #fdfaff; }
        .pmf-program-active { border-color: #B432F2 !important; background: #fdfaff !important; box-shadow: 0 0 0 3px rgba(180,50,242,0.08); }
        .pmf-program-radio {
          width: 18px; height: 18px; border-radius: 50%; border: 2px solid #cbd5e1;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px; transition: border-color 0.2s;
        }
        .pmf-program-active .pmf-program-radio { border-color: #B432F2; }
        .pmf-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #B432F2; }
        .pmf-program-name { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .pmf-program-desc { font-size: 11px; color: #64748b; line-height: 1.4; }

        .pmf-file-area {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 2px dashed #d1d5db; border-radius: 12px; padding: 18px 12px;
          cursor: pointer; background: #fafafa; transition: all 0.2s; min-height: 90px;
        }
        .pmf-file-area:hover { border-color: #B432F2; background: #fdfaff; }
        .pmf-file-placeholder { display: flex; flex-direction: column; align-items: center; }
        .pmf-file-hint { font-size: 12px; font-weight: 700; color: #475569; }
        .pmf-file-subhint { font-size: 10px; color: #94a3b8; margin-top: 2px; }
        .pmf-file-chosen { display: flex; align-items: center; gap: 8px; width: 100%; }
        .pmf-file-name { font-size: 11px; font-weight: 600; color: #0f172a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pmf-file-remove {
          width: 20px; height: 20px; border-radius: 50%; background: #fee2e2; border: none;
          color: #ef4444; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: background 0.2s;
        }
        .pmf-file-remove:hover { background: #fca5a5; }
        .pmf-files-error-row { display: flex; align-items: center; gap: 6px; margin-top: 10px; color: #ef4444; font-size: 12px; font-weight: 600; }

        .pmf-action-bar { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 4px; }
        .pmf-btn-cancel {
          padding: 12px 22px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          background: #fff; color: #64748b; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .pmf-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
        .pmf-btn-submit {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #B432F2, #9f1be0);
          color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 16px rgba(180,50,242,0.3); transition: all 0.2s; font-family: inherit;
        }
        .pmf-btn-submit:hover { background: linear-gradient(135deg, #9f1be0, #8900ff); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(180,50,242,0.4); }

        @media (max-width: 680px) {
          .pmf-grid-2, .pmf-program-grid { grid-template-columns: 1fr; }
          .pmf-grid-2 .col-span-2 { grid-column: span 1; }
          .pmf-grid-3 { grid-template-columns: 1fr; }
          .pmf-hero { padding: 24px 20px; }
          .pmf-hero-content { flex-direction: column; }
          .pmf-action-bar { flex-direction: column-reverse; }
          .pmf-btn-cancel, .pmf-btn-submit { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default ProposalMagangForm;
