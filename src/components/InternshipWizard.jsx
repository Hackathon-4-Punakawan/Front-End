import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
  Clock,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';

const InternshipWizard = ({ currentUser, onCancel, onSubmit, prefillIdMagang, prefillData }) => {
  // Generated ID Magang (only set when Faculty approves)
  const [generatedIdMagang, setGeneratedIdMagang] = useState('');

  // Step 1 Status: 'draft' | 'pending' | 'approved'
  const [step1Status, setStep1Status] = useState('draft');

  // Steps state
  const [activeStep, setActiveStep] = useState(1);
  const [savedSteps, setSavedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

  // QR verification modal state for Step 2
  const [showQrVerification, setShowQrVerification] = useState(false);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info' // 'success' | 'error' | 'warning' | 'info'
  });

  // Form Data State
  const [formData, setFormData] = useState({
    step1: {
      email: currentUser?.email || '',
      jenisPengajuan: 'Magang Merdeka (MSIB)',
      nama: currentUser?.name || '',
      nim: currentUser?.identity || '',
      prodi: 'Informatika',
      kepadaYth: '',
      namaInstansi: '',
      alamatInstansi: '',
      semester: '6',
      tahunAkademik: '2026/2027',
    },
    step2: {
      email: 'kusrini.kaprodi@amikom.ac.id',
      nama: 'Prof. Kusrini, M.Kom.',
      identitas: '0419077902',
      keperluan: 'Persetujuan Pelaksanaan Magang Mandiri',
      ditujukanKepada: 'Ketua Program Studi Informatika',
      dokumenUlasan: '',
      dokumenPendukung: '',
      pesan: currentUser?.identity || '',
    },
    step3: {
      email: currentUser?.email || '',
      idMagang: '',
      tglMulai: '',
      tglBerakhir: '',
      periodeMagang: '',
    },
    step4: {
      email: currentUser?.email || '',
      idMagang: '',
      nama: currentUser?.name || '',
      nim: currentUser?.identity || '',
      sks: '20',
      buktiDiterima: '',
      khs: '',
    }
  });

  // Track field error messages for active step validation
  const [errors, setErrors] = useState({});

  // Trigger Custom Alert
  const triggerAlert = (title, message, type = 'info') => {
    setCustomAlert({
      show: true,
      title,
      message,
      type
    });
  };

  // Sync auto-generated fields when ID Magang is created
  useEffect(() => {
    if (generatedIdMagang) {
      setFormData(prev => ({
        ...prev,
        step3: { ...prev.step3, idMagang: generatedIdMagang },
        step4: { ...prev.step4, idMagang: generatedIdMagang }
      }));
    }
  }, [generatedIdMagang]);

  // Prefill hook from props (if initial registration was approved)
  useEffect(() => {
    if (prefillIdMagang && prefillData) {
      setGeneratedIdMagang(prefillIdMagang);
      setStep1Status('approved');
      setSavedSteps(prev => ({
        ...prev,
        step1: true
      }));
      setFormData(prev => ({
        ...prev,
        step1: {
          ...prev.step1,
          email: prefillData.email || prev.step1.email,
          jenisPengajuan: prefillData.jenisPengajuan || prev.step1.jenisPengajuan,
          nama: prefillData.nama || prev.step1.nama,
          nim: prefillData.nim || prev.step1.nim,
          prodi: prefillData.prodi || prev.step1.prodi,
          kepadaYth: prefillData.kepadaYth || prev.step1.kepadaYth,
          namaInstansi: prefillData.namaInstansi || prev.step1.namaInstansi,
          alamatInstansi: prefillData.alamatInstansi || prev.step1.alamatInstansi,
          semester: prefillData.semester || prev.step1.semester,
          tahunAkademik: prefillData.tahunAkademik || prev.step1.tahunAkademik,
        },
        step3: {
          ...prev.step3,
          idMagang: prefillIdMagang
        },
        step4: {
          ...prev.step4,
          idMagang: prefillIdMagang
        }
      }));
      
      // Auto move active step to step 2 since step 1 is pre-approved!
      setActiveStep(2);
    }
  }, [prefillIdMagang, prefillData]);

  // Auto calculate period in Step 3 based on dates
  useEffect(() => {
    const { tglMulai, tglBerakhir } = formData.step3;
    if (tglMulai && tglBerakhir) {
      const start = new Date(tglMulai);
      const end = new Date(tglBerakhir);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.round(diffDays / 30);
        const periodStr = months > 0 ? `${months} Bulan (${diffDays} Hari)` : `${diffDays} Hari`;
        setFormData(prev => ({
          ...prev,
          step3: { ...prev.step3, periodeMagang: periodStr }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          step3: { ...prev.step3, periodeMagang: 'Tanggal tidak valid' }
        }));
      }
    }
  }, [formData.step3.tglMulai, formData.step3.tglBerakhir]);

  // Handle Input Changes
  const handleInputChange = (stepKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value
      }
    }));
    // Clear error for that field
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Mock file selector change
  const handleFileChange = (stepKey, field, e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange(stepKey, field, file.name);
    }
  };

  // Remove mock file
  const handleRemoveFile = (stepKey, field) => {
    handleInputChange(stepKey, field, '');
  };

  // Validation function per step
  const validateStep = (stepNumber) => {
    const stepErrors = {};
    if (stepNumber === 1) {
      const data = formData.step1;
      if (!data.email) stepErrors.email = 'Email wajib diisi';
      if (!data.kepadaYth) stepErrors.kepadaYth = 'Penerima surat wajib diisi (Kepada Yth.)';
      if (!data.namaInstansi) stepErrors.namaInstansi = 'Nama instansi wajib diisi';
      if (!data.alamatInstansi) stepErrors.alamatInstansi = 'Alamat instansi wajib diisi';
      if (!data.semester) stepErrors.semester = 'Semester wajib dipilih';
      if (!data.tahunAkademik) stepErrors.tahunAkademik = 'Tahun akademik wajib diisi';
    } else if (stepNumber === 2) {
      const data = formData.step2;
      if (!data.email) stepErrors.email = 'Email Kaprodi wajib diisi';
      if (!data.nama) stepErrors.nama = 'Nama Kaprodi wajib diisi';
      if (!data.identitas) stepErrors.identitas = 'NIDN/Identitas wajib diisi';
      if (!data.keperluan) stepErrors.keperluan = 'Keperluan persetujuan wajib diisi';
      if (!data.ditujukanKepada) stepErrors.ditujukanKepada = 'Pihak tujuan wajib diisi';
      if (!data.dokumenUlasan) stepErrors.dokumenUlasan = 'Dokumen yang diusulkan wajib diunggah';
      if (!data.pesan) {
        stepErrors.pesan = 'Pesan wajib diisi';
      } else if (!data.pesan.includes(formData.step1.nim)) {
        stepErrors.pesan = `Mahasiswa: wajib mengisikan NIM Anda (${formData.step1.nim}) di dalam kolom pesan!`;
      }
    } else if (stepNumber === 3) {
      const data = formData.step3;
      if (!data.email) stepErrors.email = 'Email wajib diisi';
      if (!data.tglMulai) stepErrors.tglMulai = 'Tanggal mulai magang wajib diisi';
      if (!data.tglBerakhir) stepErrors.tglBerakhir = 'Tanggal berakhir magang wajib diisi';
      if (new Date(data.tglBerakhir) < new Date(data.tglMulai)) {
        stepErrors.tglBerakhir = 'Tanggal berakhir tidak boleh mendahului tanggal mulai';
      }
    } else if (stepNumber === 4) {
      const data = formData.step4;
      if (!data.email) stepErrors.email = 'Email wajib diisi';
      if (!data.sks) stepErrors.sks = 'Jumlah SKS wajib diisi';
      if (!data.buktiDiterima) stepErrors.buktiDiterima = 'Bukti penerimaan magang wajib diunggah';
      if (!data.khs) stepErrors.khs = 'Berkas KHS wajib diunggah';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Save current step data
  const handleSaveStep = (stepNumber) => {
    if (validateStep(stepNumber)) {
      if (stepNumber === 1) {
        setSavedSteps(prev => ({
          ...prev,
          step1: true
        }));
        setStep1Status('pending');
        triggerAlert(
          'Penyimpanan Sukses', 
          'Data Langkah 1 berhasil disimpan! Status pengajuan saat ini berubah menjadi PENDING (Menunggu ACC Fakultas).', 
          'success'
        );
      } else {
        setSavedSteps(prev => ({
          ...prev,
          [`step${stepNumber}`]: true
        }));
        triggerAlert(
          'Penyimpanan Sukses', 
          `Data pada Langkah ${stepNumber} berhasil disimpan! Anda sekarang dapat melanjutkan.`, 
          'success'
        );
      }
    } else {
      const firstError = Object.values(errors)[0] || 'Harap lengkapi semua kolom wajib dengan benar!';
      triggerAlert('Gagal Menyimpan', firstError, 'error');
    }
  };

  // Simulator ACC Fakultas
  const handleApproveStep1 = (e) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `MGG-2026-${randomNum}`;
    setGeneratedIdMagang(newId);
    setStep1Status('approved');
    triggerAlert(
      'Simulasi Sukses', 
      `Fakultas memberikan ACC dan menerbitkan ID Magang Anda: ${newId}. Langkah 2 sekarang terbuka!`, 
      'success'
    );
  };

  // Navigate to next step
  const handleNext = () => {
    if (activeStep === 1 && step1Status !== 'approved') {
      if (step1Status === 'draft') {
        triggerAlert(
          'Langkah Terkunci', 
          'Silakan lengkapi data Langkah 1 dan klik "Simpan" terlebih dahulu.', 
          'warning'
        );
      } else {
        triggerAlert(
          'Menunggu ACC', 
          'Pengajuan Anda masih berstatus PENDING. Silakan klik tombol "Simulasikan ACC Fakultas" terlebih dahulu untuk menerbitkan ID Magang.', 
          'warning'
        );
      }
      return;
    }
    const isCurrentSaved = savedSteps[`step${activeStep}`];
    if (!isCurrentSaved) {
      triggerAlert(
        'Langkah Terkunci', 
        `Maaf, Anda belum menyimpan data Langkah ${activeStep}. Silakan klik tombol "Simpan Langkah ${activeStep}" sebelum melanjutkan.`, 
        'warning'
      );
      return;
    }
    if (activeStep < 4) {
      setActiveStep(prev => prev + 1);
      setErrors({});
    }
  };

  // Navigate to previous step
  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
      setErrors({});
    }
  };

  // Direct stepper click handler
  const handleStepClick = (stepNumber) => {
    if (stepNumber > 1 && step1Status !== 'approved') {
      triggerAlert(
        'Langkah Terkunci', 
        'Langkah 2 ke atas terkunci karena status Langkah 1 masih pending / menunggu ACC Fakultas.', 
        'warning'
      );
      return;
    }
    // Check if the user is trying to skip to a step without saving prior steps
    for (let i = 1; i < stepNumber; i++) {
      if (!savedSteps[`step${i}`]) {
        triggerAlert(
          'Langkah Terkunci', 
          `Langkah ${i} belum disimpan. Anda tidak dapat melompati langkah sebelum data disimpan!`, 
          'warning'
        );
        return;
      }
    }
    setActiveStep(stepNumber);
    setErrors({});
  };

  // Form submit handler at Step 4
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step1Status !== 'approved') {
      triggerAlert('Pengajuan Ditolak', 'Pengajuan Langkah 1 belum di-ACC oleh Fakultas!', 'error');
      return;
    }
    if (!savedSteps.step1 || !savedSteps.step2 || !savedSteps.step3) {
      triggerAlert(
        'Pengiriman Gagal', 
        'Harap simpan Langkah 1, 2, dan 3 terlebih dahulu sebelum mengirim pengajuan!', 
        'error'
      );
      return;
    }
    if (!savedSteps.step4) {
      if (!validateStep(4)) {
        triggerAlert(
          'Pengiriman Gagal', 
          'Gagal mengirim: Harap lengkapi dan simpan data Langkah 4!', 
          'error'
        );
        return;
      }
    }

    // Submit data
    const finalData = {
      company: formData.step1.namaInstansi,
      location: formData.step1.alamatInstansi,
      position: formData.step1.jenisPengajuan,
      type: formData.step1.jenisPengajuan,
      details: formData
    };
    onSubmit(finalData);
  };

  const isStep1Locked = step1Status === 'pending' || step1Status === 'approved';

  return (
    <div className="wizard-card fade-in">
      {/* Wizard Header */}
      <div className="wizard-header">
        <button className="wizard-back-btn" onClick={onCancel}>
          <ChevronLeft size={16} />
          <span>Kembali</span>
        </button>
        <div className="wizard-title-wrap">
          <h2 className="wizard-title">Formulir Pengajuan Magang Bertahap</h2>
          <p className="wizard-subtitle">Silakan isi formulir di bawah ini langkah demi langkah. Data harus disimpan pada setiap tahap.</p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="stepper-container">
        {[
          { num: 1, label: 'Pendaftaran' },
          { num: 2, label: 'Approval Kaprodi' },
          { num: 3, label: 'Surat Pengantar' },
          { num: 4, label: 'Dosen Pembimbing' }
        ].map((s) => {
          const isActive = activeStep === s.num;
          const isSaved = savedSteps[`step${s.num}`];
          return (
            <React.Fragment key={s.num}>
              <div 
                className={`step-node ${isActive ? 'active' : ''} ${isSaved ? 'saved' : ''}`}
                onClick={() => handleStepClick(s.num)}
                style={{ cursor: 'pointer' }}
              >
                <div className="step-badge">
                  {isSaved ? <Check size={14} strokeWidth={3} /> : s.num}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {s.num < 4 && (
                <div className={`step-connector-line ${savedSteps[`step${s.num}`] ? 'active' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* PENDING APPROVAL OR APPROVED BANNER IN STEP 1 */}
      {activeStep === 1 && (
        <>
          {step1Status === 'pending' && (
            <div className="status-banner pending fade-in">
              <Clock className="banner-icon" size={24} />
              <div className="banner-text-wrap">
                <h4>Status Pengajuan: PENDING (Menunggu ACC Fakultas)</h4>
                <p>Data pendaftaran Anda telah berhasil disimpan. Fakultas sedang memverifikasi data untuk menerbitkan ID Magang Anda. Anda dapat melanjutkan ke Langkah 2 setelah disetujui.</p>
              </div>
              <div className="simulator-action-card">
                <span className="sim-pill">SIMULATOR</span>
                <button className="btn-sim-approve" onClick={handleApproveStep1}>
                  ⚡ Simulasikan ACC Fakultas & Terbitkan ID Magang
                </button>
              </div>
            </div>
          )}

          {step1Status === 'approved' && (
            <div className="status-banner approved fade-in">
              <CheckCircle2 className="banner-icon" size={24} />
              <div className="banner-text-wrap">
                <h4>Status Pengajuan: DISETUJUI / ACC FAKULTAS</h4>
                <p>Selamat! Pendaftaran magang Anda telah disetujui. ID Magang resmi Anda: <strong>{generatedIdMagang}</strong>. Akses Langkah 2 telah terbuka.</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP FORM PANELS */}
      <div className="step-form-content">
        {/* STEP 1: FORMULIR PENDAFTARAN MAGANG */}
        {activeStep === 1 && (
          <div className="step-pane fade-in">
            <h3 className="step-pane-title">Step 1: Formulir Pendaftaran Magang</h3>
            <p className="step-pane-desc">Isikan detail informasi awal instansi tempat pengajuan magang Anda.</p>

            <div className="form-grid-2">
              <div className="form-group col-span-2">
                <label className="form-label font-bold">Email <span className="text-red">*</span></label>
                <input 
                  type="email" 
                  className={`input-field-wizard ${errors.email ? 'error' : ''} ${isStep1Locked ? 'readonly-field' : ''}`}
                  placeholder="Masukkan alamat email Anda..."
                  value={formData.step1.email}
                  onChange={(e) => handleInputChange('step1', 'email', e.target.value)}
                  disabled={isStep1Locked}
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Jenis Pengajuan</label>
                <select 
                  className={`input-field-wizard ${isStep1Locked ? 'readonly-field' : ''}`} 
                  value={formData.step1.jenisPengajuan}
                  onChange={(e) => handleInputChange('step1', 'jenisPengajuan', e.target.value)}
                  disabled={isStep1Locked}
                >
                  <option value="Magang Merdeka (MSIB)">Magang Merdeka (MSIB)</option>
                  <option value="Magang Mandiri">Magang Mandiri</option>
                  <option value="Kerja Praktek">Kerja Praktek (KP)</option>
                  <option value="Magang Internasional">Magang Internasional</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Nama Mahasiswa</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step1.nama}
                  readOnly 
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold">NIM</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step1.nim}
                  readOnly 
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Program Studi</label>
                <select 
                  className={`input-field-wizard ${isStep1Locked ? 'readonly-field' : ''}`}
                  value={formData.step1.prodi}
                  onChange={(e) => handleInputChange('step1', 'prodi', e.target.value)}
                  disabled={isStep1Locked}
                >
                  <option value="Informatika">Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknologi Informasi">Teknologi Informasi</option>
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Kepada Yth. <span className="text-red">*</span></label>
                <input 
                  type="text" 
                  className={`input-field-wizard ${errors.kepadaYth ? 'error' : ''} ${isStep1Locked ? 'readonly-field' : ''}`}
                  placeholder="Contoh: Pimpinan HRD / Direktur Utama"
                  value={formData.step1.kepadaYth}
                  onChange={(e) => handleInputChange('step1', 'kepadaYth', e.target.value)}
                  disabled={isStep1Locked}
                />
                {errors.kepadaYth && <span className="field-error-text">{errors.kepadaYth}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Nama Instansi / Perusahaan <span className="text-red">*</span></label>
                <input 
                  type="text" 
                  className={`input-field-wizard ${errors.namaInstansi ? 'error' : ''} ${isStep1Locked ? 'readonly-field' : ''}`}
                  placeholder="Contoh: PT. Telekomunikasi Indonesia"
                  value={formData.step1.namaInstansi}
                  onChange={(e) => handleInputChange('step1', 'namaInstansi', e.target.value)}
                  disabled={isStep1Locked}
                />
                {errors.namaInstansi && <span className="field-error-text">{errors.namaInstansi}</span>}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label font-bold">Alamat Instansi <span className="text-red">*</span></label>
                <textarea 
                  className={`input-field-wizard textarea-wizard ${errors.alamatInstansi ? 'error' : ''} ${isStep1Locked ? 'readonly-field' : ''}`}
                  placeholder="Masukkan alamat lengkap kantor instansi..."
                  rows="3"
                  value={formData.step1.alamatInstansi}
                  onChange={(e) => handleInputChange('step1', 'alamatInstansi', e.target.value)}
                  disabled={isStep1Locked}
                />
                {errors.alamatInstansi && <span className="field-error-text">{errors.alamatInstansi}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Semester <span className="text-red">*</span></label>
                <select 
                  className={`input-field-wizard ${isStep1Locked ? 'readonly-field' : ''}`}
                  value={formData.step1.semester}
                  onChange={(e) => handleInputChange('step1', 'semester', e.target.value)}
                  disabled={isStep1Locked}
                >
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Tahun Akademik <span className="text-red">*</span></label>
                <input 
                  type="text" 
                  className={`input-field-wizard ${errors.tahunAkademik ? 'error' : ''} ${isStep1Locked ? 'readonly-field' : ''}`}
                  placeholder="Contoh: 2026/2027"
                  value={formData.step1.tahunAkademik}
                  onChange={(e) => handleInputChange('step1', 'tahunAkademik', e.target.value)}
                  disabled={isStep1Locked}
                />
                {errors.tahunAkademik && <span className="field-error-text">{errors.tahunAkademik}</span>}
              </div>
            </div>

            {/* Step Status Links Card */}
            <div className="status-links-card">
              <div className="links-card-title">
                <Info size={16} />
                <span>Silakan cek status pengajuan surat di:</span>
              </div>
              <ul className="links-list">
                <li>
                  <a href="https://fik.amikom.ac.id/page/status-pengajuan-layanan" target="_blank" rel="noopener noreferrer">
                    🌐 https://fik.amikom.ac.id/page/status-pengajuan-layanan
                  </a>
                </li>
                <li>
                  <a href="http://t.me/AMIKOMFakultasbot" target="_blank" rel="noopener noreferrer">
                    💬 http://t.me/AMIKOMFakultasbot (Aplikasi Telegram)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 2: APPROVAL KAPRODI INFORMATIKA */}
        {activeStep === 2 && (
          <div className="step-pane fade-in">
            <h3 className="step-pane-title">Step 2: Approval Kaprodi Informatika</h3>
            <p className="step-pane-desc">Ajukan persetujuan rencana magang Anda kepada Kepala Program Studi Informatika.</p>

            {/* Interactive QR Signature Example Preview */}
            <div className="signature-preview-container">
              <div className="sig-preview-header">
                <QrCode size={18} />
                <span>Panduan Dokumen & Scan QR Code Verifikasi Tanda Tangan Kaprodi</span>
              </div>
              <div className="sig-preview-content">
                <div className="sig-doc-mockup">
                  <div className="mock-doc-title">SURAT PERNYATAAN KELAYAKAN MAGANG</div>
                  <div className="mock-doc-body">
                    Dengan ini menyetujui mahasiswa bernama <strong>{formData.step1.nama}</strong> ({formData.step1.nim}) melaksanakan program magang di <strong>{formData.step1.namaInstansi || '[Nama Instansi]'}</strong>.
                  </div>
                  <div className="mock-doc-footer-sign">
                    <p>Yogyakarta, 27 Juli 2026</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Menyetujui secara elektronik,</p>
                    <div className="signature-dotted-box">
                      <span className="digital-sig-badge">
                        <ShieldCheck size={12} />
                        Signed Digital via QR
                      </span>
                      <div className="qr-code-stamp" onClick={() => setShowQrVerification(true)}>
                        <QrCode size={32} />
                        <span className="qr-stamp-text">KLIK UNTUK SCAN</span>
                      </div>
                    </div>
                    <p style={{ fontWeight: 'bold', marginTop: '4px' }}>Prof. Kusrini, M.Kom.</p>
                    <p style={{ fontSize: '9px', color: '#94a3b8' }}>NIDN. 0419077902</p>
                  </div>
                </div>

                <div className="sig-doc-expl">
                  <h5>Penjelasan Alur QR Code:</h5>
                  <p>Dokumen yang dikeluarkan Fakultas menggunakan tanda tangan digital QR Code resmi.</p>
                  <ul>
                    <li>Bagian tanda tangan berisi cap verifikasi elektronik Amikom.</li>
                    <li>Mengklik/memindai QR Code tersebut akan mengarahkan ke halaman verifikasi keabsahan dokumen untuk validasi instansi luar.</li>
                  </ul>
                  <button className="btn-preview-qr-action" onClick={() => setShowQrVerification(true)}>
                    Simulasikan Scan Hasil QR Code
                  </button>
                </div>
              </div>
            </div>

            {/* QR Simulation Modal */}
            {showQrVerification && (
              <div className="qr-sim-overlay fade-in">
                <div className="qr-sim-modal">
                  <div className="qr-sim-header">
                    <h4>🔍 Hasil Scan Verifikasi Dokumen Digital</h4>
                    <button className="close-sim-btn" onClick={() => setShowQrVerification(false)}>×</button>
                  </div>
                  <div className="qr-sim-body">
                    <div className="qr-success-header">
                      <ShieldCheck size={48} className="verified-shield-icon" />
                      <div className="verified-banner-text">DOKUMEN TERVERIFIKASI ASLI</div>
                      <div className="verified-timestamp">Sistem Fakultas Ilmu Komputer Universitas Amikom Yogyakarta</div>
                    </div>

                    <table className="qr-detail-table">
                      <tbody>
                        <tr>
                          <th>Jenis Layanan:</th>
                          <td>Approval Magang (Kaprodi)</td>
                        </tr>
                        <tr>
                          <th>Nama Penanda Tangan:</th>
                          <td>{formData.step2.nama}</td>
                        </tr>
                        <tr>
                          <th>Identitas / NIDN:</th>
                          <td>{formData.step2.identitas}</td>
                        </tr>
                        <tr>
                          <th>Nama Mahasiswa:</th>
                          <td>{formData.step1.nama}</td>
                        </tr>
                        <tr>
                          <th>NIM Mahasiswa:</th>
                          <td>{formData.step1.nim}</td>
                        </tr>
                        <tr>
                          <th>Perihal / Keperluan:</th>
                          <td>{formData.step2.keperluan}</td>
                        </tr>
                        <tr>
                          <th>Ditujukan Kepada:</th>
                          <td>{formData.step2.ditujukanKepada}</td>
                        </tr>
                        <tr>
                          <th>Status Dokumen:</th>
                          <td><span className="qr-badge-status-approved">DISANDIKAN & SAH</span></td>
                        </tr>
                        <tr>
                          <th>Kode Verifikasi:</th>
                          <td><code style={{ fontSize: '11px', color: '#B432F2' }}>AMK-SIGN-2026-X83921-VERIFIED</code></td>
                        </tr>
                      </tbody>
                    </table>

                    <button className="btn-sim-close-action" onClick={() => setShowQrVerification(false)}>
                      Selesai Meninjau
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group col-span-2">
                <label className="form-label font-bold">Email Kaprodi <span className="text-red">*</span></label>
                <input 
                  type="email" 
                  className={`input-field-wizard ${errors.email ? 'error' : ''}`}
                  value={formData.step2.email}
                  onChange={(e) => handleInputChange('step2', 'email', e.target.value)}
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Nama Lengkap Dosen / Kaprodi</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step2.nama}
                  readOnly 
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Identitas (NIDN/NIM Dosen)</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step2.identitas}
                  readOnly 
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label font-bold">Keperluan <span className="text-red">*</span></label>
                <input 
                  type="text" 
                  className={`input-field-wizard ${errors.keperluan ? 'error' : ''}`}
                  value={formData.step2.keperluan}
                  onChange={(e) => handleInputChange('step2', 'keperluan', e.target.value)}
                />
                {errors.keperluan && <span className="field-error-text">{errors.keperluan}</span>}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label font-bold">Ditujukan Kepada <span className="text-red">*</span></label>
                <input 
                  type="text" 
                  className={`input-field-wizard ${errors.ditujukanKepada ? 'error' : ''}`}
                  value={formData.step2.ditujukanKepada}
                  onChange={(e) => handleInputChange('step2', 'ditujukanKepada', e.target.value)}
                />
                {errors.ditujukanKepada && <span className="field-error-text">{errors.ditujukanKepada}</span>}
              </div>

              {/* Uploads */}
              <div className="form-group">
                <label className="form-label font-bold">Dokumen yang Diusulkan (Permohonan Magang) <span className="text-red">*</span></label>
                {formData.step2.dokumenUlasan ? (
                  <div className="uploaded-file-row">
                    <FileText size={18} color="#B432F2" />
                    <span className="uploaded-file-name">{formData.step2.dokumenUlasan}</span>
                    <button className="btn-remove-uploaded" onClick={() => handleRemoveFile('step2', 'dokumenUlasan')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="drag-upload-zone">
                    <Upload size={24} className="upload-icon" />
                    <span className="upload-lbl">Seret berkas ke sini, atau <strong>Pilih File</strong></span>
                    <span className="upload-sublbl">Maksimal ukuran file: 2MB (format PDF)</span>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      className="hidden-file-input"
                      onChange={(e) => handleFileChange('step2', 'dokumenUlasan', e)}
                    />
                  </div>
                )}
                {errors.dokumenUlasan && <span className="field-error-text">{errors.dokumenUlasan}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Dokumen Pendukung (Optional)</label>
                {formData.step2.dokumenPendukung ? (
                  <div className="uploaded-file-row">
                    <FileText size={18} color="#B432F2" />
                    <span className="uploaded-file-name">{formData.step2.dokumenPendukung}</span>
                    <button className="btn-remove-uploaded" onClick={() => handleRemoveFile('step2', 'dokumenPendukung')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="drag-upload-zone">
                    <Upload size={24} className="upload-icon" />
                    <span className="upload-lbl">Seret berkas ke sini, atau <strong>Pilih File</strong></span>
                    <span className="upload-sublbl">Maksimal ukuran file: 5MB</span>
                    <input 
                      type="file" 
                      className="hidden-file-input"
                      onChange={(e) => handleFileChange('step2', 'dokumenPendukung', e)}
                    />
                  </div>
                )}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label font-bold">Pesan (Wajib isikan NIM Anda) <span className="text-red">*</span></label>
                <textarea 
                  className={`input-field-wizard textarea-wizard ${errors.pesan ? 'error' : ''}`}
                  placeholder="Tuliskan pesan permohonan persetujuan. Pastikan mencantumkan NIM Anda..."
                  rows="3"
                  value={formData.step2.pesan}
                  onChange={(e) => handleInputChange('step2', 'pesan', e.target.value)}
                />
                <span className="tip-input-text">Mahasiswa: wajib menuliskan NIM Anda <strong>({formData.step1.nim})</strong> dalam pesan.</span>
                {errors.pesan && <span className="field-error-text">{errors.pesan}</span>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PENGAJUAN SURAT PENGANTAR MAGANG */}
        {activeStep === 3 && (
          <div className="step-pane fade-in">
            <h3 className="step-pane-title">Step 3: Pengajuan Surat Pengantar Magang</h3>
            <p className="step-pane-desc">Ajukan dokumen resmi surat pengantar dari Fakultas untuk diserahkan ke instansi.</p>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label font-bold">Email Penerima Surat Pengantar <span className="text-red">*</span></label>
                <input 
                  type="email" 
                  className={`input-field-wizard ${errors.email ? 'error' : ''}`}
                  value={formData.step3.email}
                  onChange={(e) => handleInputChange('step3', 'email', e.target.value)}
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">ID Magang (Generated)</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step3.idMagang}
                  readOnly 
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Tanggal Mulai Magang <span className="text-red">*</span></label>
                <input 
                  type="date" 
                  className={`input-field-wizard ${errors.tglMulai ? 'error' : ''}`}
                  value={formData.step3.tglMulai}
                  onChange={(e) => handleInputChange('step3', 'tglMulai', e.target.value)}
                />
                {errors.tglMulai && <span className="field-error-text">{errors.tglMulai}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Tanggal Berakhir Magang <span className="text-red">*</span></label>
                <input 
                  type="date" 
                  className={`input-field-wizard ${errors.tglBerakhir ? 'error' : ''}`}
                  value={formData.step3.tglBerakhir}
                  onChange={(e) => handleInputChange('step3', 'tglBerakhir', e.target.value)}
                />
                {errors.tglBerakhir && <span className="field-error-text">{errors.tglBerakhir}</span>}
              </div>

              <div className="form-group col-span-2">
                <label className="form-label font-bold">Periode Magang (Kalkulasi Otomatis)</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field"
                  placeholder="Isi tanggal di atas untuk menghitung durasi periode..."
                  value={formData.step3.periodeMagang}
                  readOnly 
                />
              </div>
            </div>

            {/* Step Status Links Card */}
            <div className="status-links-card">
              <div className="links-card-title">
                <Info size={16} />
                <span>Silakan cek status pengajuan surat di:</span>
              </div>
              <ul className="links-list">
                <li>
                  <a href="https://fik.amikom.ac.id/page/status-pengajuan-layanan" target="_blank" rel="noopener noreferrer">
                    🌐 https://fik.amikom.ac.id/page/status-pengajuan-layanan
                  </a>
                </li>
                <li>
                  <a href="http://t.me/AMIKOMFakultasbot" target="_blank" rel="noopener noreferrer">
                    💬 http://t.me/AMIKOMFakultasbot (Aplikasi Telegram)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 4: FORM PENGAJUAN DOSEN PEMBIMBING MAGANG */}
        {activeStep === 4 && (
          <div className="step-pane fade-in">
            <h3 className="step-pane-title">Step 4: Form Pengajuan Dosen Pembimbing Magang</h3>
            <p className="step-pane-desc">Langkah terakhir, lengkapi berkas penerimaan dan KHS untuk penentuan Dosen Pembimbing Magang.</p>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label font-bold">Email <span className="text-red">*</span></label>
                <input 
                  type="email" 
                  className={`input-field-wizard ${errors.email ? 'error' : ''}`}
                  value={formData.step4.email}
                  onChange={(e) => handleInputChange('step4', 'email', e.target.value)}
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label font-bold">ID Magang</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step4.idMagang}
                  readOnly 
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold">Nama Mahasiswa</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step4.nama}
                  readOnly 
                />
              </div>

              <div className="form-group">
                <label className="form-label font-bold">NIM Mahasiswa</label>
                <input 
                  type="text" 
                  className="input-field-wizard readonly-field" 
                  value={formData.step4.nim}
                  readOnly 
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label font-bold">SKS yang Ditempuh <span className="text-red">*</span></label>
                <input 
                  type="number" 
                  className={`input-field-wizard ${errors.sks ? 'error' : ''}`}
                  placeholder="Contoh: 110"
                  value={formData.step4.sks}
                  onChange={(e) => handleInputChange('step4', 'sks', e.target.value)}
                />
                {errors.sks && <span className="field-error-text">{errors.sks}</span>}
              </div>

              {/* Upload Bukti Diterima */}
              <div className="form-group">
                <label className="form-label font-bold">Bukti Diterima Magang (Upload Dokumen) <span className="text-red">*</span></label>
                {formData.step4.buktiDiterima ? (
                  <div className="uploaded-file-row">
                    <FileText size={18} color="#B432F2" />
                    <span className="uploaded-file-name">{formData.step4.buktiDiterima}</span>
                    <button className="btn-remove-uploaded" onClick={() => handleRemoveFile('step4', 'buktiDiterima')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="drag-upload-zone">
                    <Upload size={24} className="upload-icon" />
                    <span className="upload-lbl">Unggah LoA / Bukti Diterima (.pdf)</span>
                    <span className="upload-sublbl">Maksimal: 2MB</span>
                    <input 
                      type="file" 
                      accept=".pdf"
                      className="hidden-file-input"
                      onChange={(e) => handleFileChange('step4', 'buktiDiterima', e)}
                    />
                  </div>
                )}
                {errors.buktiDiterima && <span className="field-error-text">{errors.buktiDiterima}</span>}
              </div>

              {/* Upload KHS */}
              <div className="form-group">
                <label className="form-label font-bold">KHS (Kartu Hasil Studi Terakhir) <span className="text-red">*</span></label>
                {formData.step4.khs ? (
                  <div className="uploaded-file-row">
                    <FileText size={18} color="#B432F2" />
                    <span className="uploaded-file-name">{formData.step4.khs}</span>
                    <button className="btn-remove-uploaded" onClick={() => handleRemoveFile('step4', 'khs')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="drag-upload-zone">
                    <Upload size={24} className="upload-icon" />
                    <span className="upload-lbl">Unggah KHS Terakhir (.pdf)</span>
                    <span className="upload-sublbl">Maksimal: 3MB</span>
                    <input 
                      type="file" 
                      accept=".pdf"
                      className="hidden-file-input"
                      onChange={(e) => handleFileChange('step4', 'khs', e)}
                    />
                  </div>
                )}
                {errors.khs && <span className="field-error-text">{errors.khs}</span>}
              </div>
            </div>

            {/* Step Status Links Card */}
            <div className="status-links-card">
              <div className="links-card-title">
                <Info size={16} />
                <span>Silakan cek status pengajuan surat di:</span>
              </div>
              <ul className="links-list">
                <li>
                  <a href="https://fik.amikom.ac.id/page/status-pengajuan-layanan" target="_blank" rel="noopener noreferrer">
                    🌐 https://fik.amikom.ac.id/page/status-pengajuan-layanan
                  </a>
                </li>
                <li>
                  <a href="http://t.me/AMIKOMFakultasbot" target="_blank" rel="noopener noreferrer">
                    💬 http://t.me/AMIKOMFakultasbot (Aplikasi Telegram)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* WIZARD ACTIONS FOOTER */}
      <div className="wizard-footer">
        <button 
          className="btn-wizard-nav prev-btn" 
          onClick={handlePrev}
          disabled={activeStep === 1}
        >
          <ChevronLeft size={16} />
          <span>Sebelumnya</span>
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Save Button for active step */}
          {activeStep === 1 ? (
            <button 
              className={`btn-wizard-action save-btn ${isStep1Locked ? 'step-is-saved' : ''}`}
              onClick={() => handleSaveStep(1)}
              disabled={isStep1Locked}
            >
              {step1Status === 'draft' && 'Simpan Langkah 1'}
              {step1Status === 'pending' && '⌛ Menunggu ACC Fakultas'}
              {step1Status === 'approved' && '✓ Disetujui & Disimpan'}
            </button>
          ) : (
            <button 
              className={`btn-wizard-action save-btn ${savedSteps[`step${activeStep}`] ? 'step-is-saved' : ''}`}
              onClick={() => handleSaveStep(activeStep)}
            >
              {savedSteps[`step${activeStep}`] ? '✓ Berhasil Disimpan' : `Simpan Langkah ${activeStep}`}
            </button>
          )}

          {activeStep < 4 ? (
            <button 
              className="btn-wizard-nav next-btn" 
              onClick={handleNext}
              disabled={activeStep === 1 ? (step1Status !== 'approved') : !savedSteps[`step${activeStep}`]}
            >
              <span>Selanjutnya</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              className="btn-wizard-submit" 
              onClick={handleSubmit}
              disabled={!savedSteps.step4 || step1Status !== 'approved'}
            >
              Kirim & Ajukan Magang
            </button>
          )}
        </div>
      </div>

      {/* CUSTOM MODAL ALERT DI TENGAH LAYAR */}
      {customAlert.show && (
        <div className="custom-modal-alert-overlay fade-in">
          <div className="custom-modal-alert-card">
            <div className={`alert-icon-wrapper ${customAlert.type}`}>
              {customAlert.type === 'success' && <CheckCircle2 size={36} />}
              {customAlert.type === 'error' && <AlertCircle size={36} />}
              {customAlert.type === 'warning' && <ShieldAlert size={36} />}
              {customAlert.type === 'info' && <Info size={36} />}
            </div>
            <h3 className="alert-modal-title">{customAlert.title}</h3>
            <p className="alert-modal-message">{customAlert.message}</p>
            <button 
              className={`btn-alert-modal-close ${customAlert.type}`}
              onClick={() => setCustomAlert(prev => ({ ...prev, show: false }))}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Embedded Component Styles */}
      <style>{`
        .wizard-card {
          background: #ffffff;
          border: 1px solid #e9e2f2;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(180, 50, 242, 0.04);
          text-align: left;
          position: relative;
        }

        .wizard-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid #f6f1fb;
          padding-bottom: 24px;
          margin-bottom: 30px;
        }

        .wizard-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid #e9e2f2;
          background: #ffffff;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wizard-back-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .wizard-title-wrap {
          flex-grow: 1;
        }

        .wizard-title {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .wizard-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        /* Stepper Styles */
        .stepper-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
          padding: 0 10px;
        }

        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          z-index: 2;
          width: 90px;
        }

        .step-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-node.active .step-badge {
          background: #B432F2;
          border-color: #B432F2;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(180, 50, 242, 0.2);
        }

        .step-node.saved .step-badge {
          background: #10b981;
          border-color: #10b981;
          color: #ffffff;
        }

        .step-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .step-node.active .step-label {
          color: #B432F2;
        }

        .step-node.saved .step-label {
          color: #10b981;
        }

        .step-connector-line {
          height: 3px;
          background: #e2e8f0;
          flex-grow: 1;
          margin: 0 -25px;
          z-index: 1;
          margin-top: -20px;
          transition: background 0.3s ease;
        }

        .step-connector-line.active {
          background: #10b981;
        }

        /* Status Banners */
        .status-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 16px;
          margin-bottom: 30px;
          border: 1px solid transparent;
        }

        .status-banner.pending {
          background-color: #fffbeb;
          border-color: #fef3c7;
          color: #b45309;
        }

        .status-banner.approved {
          background-color: #f0fdf4;
          border-color: #dcfce7;
          color: #15803d;
        }

        .banner-icon {
          flex-shrink: 0;
        }

        .banner-text-wrap {
          flex-grow: 1;
        }

        .banner-text-wrap h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .banner-text-wrap p {
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }

        .simulator-action-card {
          background: #ffffff;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          box-shadow: 0 4px 6px -1px rgba(180, 50, 242, 0.02);
        }

        .sim-pill {
          font-size: 9px;
          font-weight: 800;
          background: #fdf2f8;
          color: #db2777;
          border: 1px solid #fbcfe8;
          padding: 1px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .btn-sim-approve {
          background-color: #db2777;
          color: #ffffff;
          border: none;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(219, 39, 119, 0.15);
        }

        .btn-sim-approve:hover {
          background-color: #be185d;
          transform: translateY(-1px);
        }

        /* Step Panels */
        .step-pane-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .step-pane-desc {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 24px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 24px;
        }

        .col-span-2 {
          grid-column: span 2;
        }

        .input-field-wizard {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-field-wizard:focus {
          border-color: #B432F2;
          box-shadow: 0 0 0 3px rgba(180, 50, 242, 0.1);
        }

        .input-field-wizard.error {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .input-field-wizard.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .readonly-field {
          background-color: #f8fafc;
          border-color: #e2e8f0;
          color: #475569;
          cursor: not-allowed;
        }

        .textarea-wizard {
          resize: vertical;
          min-height: 80px;
          font-family: var(--font-sans);
        }

        .field-error-text {
          color: #ef4444;
          font-size: 11px;
          font-weight: 600;
          margin-top: 4px;
        }

        .tip-input-text {
          color: #64748b;
          font-size: 11px;
          margin-top: 4px;
        }

        /* File Uploader Mocking */
        .drag-upload-zone {
          border: 2px dashed #cbd5e1;
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .drag-upload-zone:hover {
          border-color: #B432F2;
          background-color: #fdfaff;
        }

        .upload-icon {
          color: #94a3b8;
          margin-bottom: 4px;
          transition: color 0.2s ease;
        }

        .drag-upload-zone:hover .upload-icon {
          color: #B432F2;
        }

        .upload-lbl {
          font-size: 13px;
          color: #334155;
        }

        .upload-sublbl {
          font-size: 11px;
          color: #64748b;
        }

        .hidden-file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .uploaded-file-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background-color: #fdfaff;
          border: 1px solid #e9cbef;
          border-radius: 10px;
        }

        .uploaded-file-name {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          flex-grow: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-remove-uploaded {
          background: #fef2f2;
          border: none;
          color: #ef4444;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-remove-uploaded:hover {
          background-color: #fee2e2;
        }

        /* Status Check Links Card */
        .status-links-card {
          margin-top: 30px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 24px;
        }

        .links-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .links-card-title svg {
          color: #B432F2;
        }

        .links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .links-list li a {
          font-size: 13px;
          font-weight: 600;
          color: #B432F2;
          text-decoration: none;
        }

        .links-list li a:hover {
          text-decoration: underline;
        }

        /* Step 2 Signature Preview UI */
        .signature-preview-container {
          background-color: #fcfaff;
          border: 1px solid #e9dcf5;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sig-preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #B432F2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sig-preview-content {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 20px;
        }

        .sig-doc-mockup {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          padding: 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .mock-doc-title {
          font-size: 8px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 12px;
          border-bottom: 1px double #e2e8f0;
          padding-bottom: 4px;
        }

        .mock-doc-body {
          font-size: 7px;
          line-height: 1.4;
          color: #475569;
          margin-bottom: 16px;
        }

        .mock-doc-footer-sign {
          margin-left: auto;
          text-align: left;
          font-size: 6px;
        }

        .signature-dotted-box {
          border: 1.5px dashed #B432F2;
          background-color: #fdfaff;
          border-radius: 4px;
          padding: 4px;
          margin: 4px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          position: relative;
        }

        .digital-sig-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 5px;
          font-weight: 700;
          background-color: #ecfdf5;
          color: #10b981;
          border: 0.5px solid #a7f3d0;
          border-radius: 2px;
          padding: 1px 3px;
        }

        .qr-code-stamp {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #3b82f6;
          transition: transform 0.2s ease;
        }

        .qr-code-stamp:hover {
          transform: scale(1.05);
        }

        .qr-stamp-text {
          font-size: 4px;
          font-weight: 700;
        }

        .sig-doc-expl {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }

        .sig-doc-expl h5 {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .sig-doc-expl p {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 10px;
        }

        .sig-doc-expl ul {
          padding-left: 18px;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .sig-doc-expl li {
          margin-bottom: 6px;
        }

        .btn-preview-qr-action {
          align-self: flex-start;
          background-color: #fdfaff;
          color: #B432F2;
          border: 1px solid #d9cbef;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-preview-qr-action:hover {
          background-color: #B432F2;
          color: #ffffff;
          border-color: #B432F2;
        }

        /* QR Simulation Overlay/Modal */
        .qr-sim-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .qr-sim-modal {
          background-color: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(180, 50, 242, 0.25);
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .qr-sim-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .qr-sim-header h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .close-sim-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #94a3b8;
          cursor: pointer;
          line-height: 1;
        }

        .close-sim-btn:hover {
          color: #0f172a;
        }

        .qr-sim-body {
          padding: 24px;
          text-align: center;
        }

        .qr-success-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .verified-shield-icon {
          color: #10b981;
        }

        .verified-banner-text {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #10b981;
        }

        .verified-timestamp {
          font-size: 11px;
          color: #64748b;
        }

        .qr-detail-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .qr-detail-table th, 
        .qr-detail-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .qr-detail-table th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #475569;
          width: 150px;
        }

        .qr-detail-table td {
          color: #0f172a;
        }

        .qr-detail-table tr:last-child th,
        .qr-detail-table tr:last-child td {
          border-bottom: none;
        }

        .qr-badge-status-approved {
          background-color: #d1fae5;
          color: #065f46;
          font-weight: 800;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .btn-sim-close-action {
          width: 100%;
          background-color: #0f172a;
          color: #ffffff;
          border: none;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-sim-close-action:hover {
          background-color: #1e293b;
        }

        /* Wizard Footer Actions */
        .wizard-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f6f1fb;
        }

        .btn-wizard-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
        }

        .prev-btn {
          background-color: #ffffff;
          color: #475569;
        }

        .prev-btn:hover:not(:disabled) {
          background-color: #f8fafc;
          border-color: #cbd5e1;
        }

        .prev-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .next-btn {
          background-color: #B432F2;
          color: #ffffff;
          border-color: #B432F2;
        }

        .next-btn:hover:not(:disabled) {
          background-color: #9f1be0;
        }

        .next-btn:disabled {
          background-color: #f1f5f9;
          border-color: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .btn-wizard-action {
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #334155;
        }

        .save-btn:hover:not(:disabled) {
          border-color: #B432F2;
          color: #B432F2;
          background-color: #fdfaff;
        }

        .save-btn.step-is-saved {
          background-color: #ecfdf5;
          border-color: #10b981;
          color: #10b981;
        }

        .save-btn:disabled {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .btn-wizard-submit {
          background-color: #10b981;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          transition: all 0.2s ease;
        }

        .btn-wizard-submit:hover:not(:disabled) {
          background-color: #059669;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        .btn-wizard-submit:disabled {
          background-color: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Custom Centered Modal Alert Styles */
        .custom-modal-alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .custom-modal-alert-card {
          background-color: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 380px;
          padding: 32px 24px 24px 24px;
          box-shadow: 0 20px 25px -5px rgba(180, 50, 242, 0.1), 0 10px 10px -5px rgba(180, 50, 242, 0.04);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #e9e2f2;
          animation: alertPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes alertPopIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .alert-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .alert-icon-wrapper.success {
          background-color: #ecfdf5;
          color: #10b981;
        }

        .alert-icon-wrapper.error {
          background-color: #fef2f2;
          color: #ef4444;
        }

        .alert-icon-wrapper.warning {
          background-color: #fff7ed;
          color: #f97316;
        }

        .alert-icon-wrapper.info {
          background-color: #eff6ff;
          color: #3b82f6;
        }

        .alert-modal-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .alert-modal-message {
          font-size: 13px;
          line-height: 1.5;
          color: #64748b;
          margin-bottom: 24px;
          padding: 0 10px;
        }

        .btn-alert-modal-close {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-alert-modal-close.success {
          background-color: #10b981;
          color: #ffffff;
        }
        .btn-alert-modal-close.success:hover {
          background-color: #059669;
        }

        .btn-alert-modal-close.error {
          background-color: #ef4444;
          color: #ffffff;
        }
        .btn-alert-modal-close.error:hover {
          background-color: #dc2626;
        }

        .btn-alert-modal-close.warning {
          background-color: #f97316;
          color: #ffffff;
        }
        .btn-alert-modal-close.warning:hover {
          background-color: #ea580c;
        }

        .btn-alert-modal-close.info {
          background-color: #3b82f6;
          color: #ffffff;
        }
        .btn-alert-modal-close.info:hover {
          background-color: #2563eb;
        }

        @media (max-width: 768px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .col-span-2 {
            grid-column: span 1;
          }
          .sig-preview-content {
            grid-template-columns: 1fr;
          }
          .stepper-container {
            flex-wrap: wrap;
            gap: 16px;
          }
          .step-connector-line {
            display: none;
          }
          .wizard-footer {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          .wizard-footer div {
            display: flex;
            flex-direction: column;
          }
          .status-banner {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .simulator-action-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default InternshipWizard;
