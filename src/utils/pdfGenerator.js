// Helper Format Tanggal Indonesia
function formatTanggalIndo(dateStr) {
  if (!dateStr) return '28 Juli 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

// Helper untuk Membuka Window Preview & Print PDF secara Instant & Safe (Tanpa Blank/Crash)
function openDocumentPreviewWindow(title, htmlBodyContent) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000,scrollbars=yes,resizable=yes');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk membuka pratinjau dokumen PDF.');
    return;
  }

  const documentHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          color: #000;
          background-color: #f1f5f9;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .preview-toolbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 54px;
          background: #1e1b4b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .preview-toolbar h1 {
          font-size: 14px;
          font-weight: 700;
          margin: 0;
          color: #f3e8ff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-btn {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-print {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(168,85,247,0.4);
        }
        .btn-print:hover { background: #7e22ce; }
        .btn-close {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
          margin-left: 8px;
        }
        .btn-close:hover { background: rgba(255,255,255,0.25); }

        .document-page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm 20mm;
          margin: 70px auto 40px auto;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          box-sizing: border-box;
        }

        @media print {
          .preview-toolbar { display: none !important; }
          body { background: #ffffff !important; }
          .document-page {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="preview-toolbar">
        <h1>📄 Pratinjau Dokumen Resmi Amikom — ${title}</h1>
        <div>
          <button class="preview-btn btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
          <button class="preview-btn btn-close" onclick="window.close()">❌ Tutup Window</button>
        </div>
      </div>

      <div class="document-page">
        ${htmlBodyContent}
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
}

// 1. GENERATE SURAT PENGANTAR MAGANG (FIK-IF AMIKOM)
export function generateSuratPengantarMagangPdf(data = {}) {
  const {
    nomorSurat = '55/FIK-IF/AMIKOM/MAGANG/VI/2026',
    tanggalSurat = new Date().toISOString(),
    namaMitra = 'PT GoTo Gojek Tokopedia Tbk',
    alamatMitra = 'Jakarta Selatan, DKI Jakarta',
    namaMahasiswa = 'Budi Santoso',
    nimMahasiswa = '21.11.4001',
    prodi = 'S1 Informatika',
    tanggalMulai = '1 Februari 2026',
    tanggalSelesai = '31 Juli 2026'
  } = data;

  const content = `
    <!-- KOP SURAT RESMI UNIVERSITAS AMIKOM YOGYAKARTA -->
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 70px; height: 70px; background-color: #6b21a8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 24px; font-family: sans-serif;">
          AM
        </div>
        <div>
          <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #581c87; text-transform: uppercase; font-family: sans-serif;">UNIVERSITAS AMIKOM YOGYAKARTA</h2>
          <h3 style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #1e1b4b; font-family: sans-serif;">FAKULTAS ILMU KOMPUTER</h3>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Jl. Ring Road Utara, Condongcatur, Depok, Sleman, Yogyakarta 55283</p>
          <p style="margin: 1px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Telp: (0274) 884201, Fax: (0274) 884208 | Website: amikom.ac.id</p>
        </div>
      </div>
    </div>

    <!-- HEADER SURAT -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px;">
      <div>
        <table style="border-collapse: collapse;">
          <tr><td style="width: 80px; padding: 2px 0;">No</td><td>: ${nomorSurat}</td></tr>
          <tr><td style="padding: 2px 0;">Hal</td><td>: <strong>Pengantar Magang</strong></td></tr>
          <tr><td style="padding: 2px 0;">Lampiran</td><td>: -</td></tr>
        </table>
      </div>
      <div style="text-align: right;">
        Sleman, ${formatTanggalIndo(tanggalSurat)}
      </div>
    </div>

    <!-- TUJUAN SURAT -->
    <div style="margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
      Yth. Pimpinan / HRD Manager<br>
      <strong>${namaMitra}</strong><br>
      ${alamatMitra}
    </div>

    <!-- ISI SURAT -->
    <div style="font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 20px;">
      Dengan hormat,<br><br>
      Sehubungan dengan pelaksanaan kegiatan Magang Industri / MBKM Program Studi S1 Informatika Fakultas Ilmu Komputer Universitas AMIKOM Yogyakarta Semester Genap Tahun Akademik 2025/2026, kami sampaikan permohonan ijin bagi mahasiswa di bawah ini:
    </div>

    <!-- TABEL MAHASISWA -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
      <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; background-color: #f8fafc;">
        <th style="padding: 8px 12px; text-align: left; width: 40px;">No</th>
        <th style="padding: 8px 12px; text-align: left;">Nama Mahasiswa</th>
        <th style="padding: 8px 12px; text-align: left; width: 140px;">NIM</th>
        <th style="padding: 8px 12px; text-align: left; width: 180px;">Program Studi</th>
      </tr>
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 10px 12px;">1.</td>
        <td style="padding: 10px 12px; font-weight: bold;">${namaMahasiswa}</td>
        <td style="padding: 10px 12px;">${nimMahasiswa}</td>
        <td style="padding: 10px 12px;">${prodi}</td>
      </tr>
    </table>

    <!-- PERIODE MAGANG -->
    <div style="font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 24px;">
      Mahasiswa tersebut diusulkan untuk melaksanakan kegiatan magang / praktek kerja lapangan terhitung mulai tanggal <strong>${tanggalMulai}</strong> sampai dengan <strong>${tanggalSelesai}</strong>.<br><br>
      Demi kelancaran kegiatan tersebut, kami sangat mengharapkan konfirmasi kesediaan serta bimbingan dari Bapak/Ibu pimpinan instansi.<br><br>
      Demikian surat pengantar ini kami sampaikan. Atas perhatian, kerjasama, dan kesediaan Bapak/Ibu, kami ucapkan terima kasih.
    </div>

    <!-- TANDA TANGAN DEKAN & QR CODE VERIFIKASI -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px;">
      <div style="border: 1px dashed #7e22ce; padding: 10px; border-radius: 8px; background-color: #faf5ff; display: flex; align-items: center; gap: 10px; width: 260px;">
        <div style="width: 50px; height: 50px; background-color: #7e22ce; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border-radius: 4px; text-align: center; font-family: sans-serif;">
          QR VALIDATED
        </div>
        <div style="font-size: 10px; color: #581c87; font-family: sans-serif;">
          <strong>VERIFIKASI RESMI DIGITAL</strong><br>
          Dokumen Terverifikasi Sah oleh Sistem UNIKA.IN Amikom.<br>
          <span style="color: #6b21a8;">ID: ${nomorSurat}</span>
        </div>
      </div>

      <div style="text-align: center; width: 260px; font-size: 14px;">
        Hormat Kami,<br>
        Dekan Fakultas Ilmu Komputer,<br>
        <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-style: italic; color: #7e22ce; font-weight: bold; font-size: 16px;">
          ( Digital Signed )
        </div>
        <strong><u>Prof. Dr. Kusrini, M.Kom.</u></strong><br>
        NIK. 190302106
      </div>
    </div>
  `;

  openDocumentPreviewWindow(`Surat Pengantar Magang - ${namaMahasiswa}`, content);
}

// 2. GENERATE SURAT PRASURVEY MAGANG (FIK-IF AMIKOM)
export function generateSuratPrasurveyMagangPdf(data = {}) {
  const {
    nomorSurat = '84/FIK-IF/AMIKOM/PSM/V/2026',
    tanggalSurat = new Date().toISOString(),
    namaMitra = 'PT Bank Central Asia Tbk',
    alamatMitra = 'Yogyakarta, D.I. Yogyakarta',
    namaMahasiswa = 'Fathur Rahman',
    nimMahasiswa = '21.11.4002',
    prodi = 'S1 Informatika'
  } = data;

  const content = `
    <!-- KOP SURAT RESMI UNIVERSITAS AMIKOM YOGYAKARTA -->
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 70px; height: 70px; background-color: #6b21a8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 24px; font-family: sans-serif;">
          AM
        </div>
        <div>
          <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #581c87; text-transform: uppercase; font-family: sans-serif;">UNIVERSITAS AMIKOM YOGYAKARTA</h2>
          <h3 style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #1e1b4b; font-family: sans-serif;">FAKULTAS ILMU KOMPUTER</h3>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Jl. Ring Road Utara, Condongcatur, Depok, Sleman, Yogyakarta 55283</p>
          <p style="margin: 1px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Telp: (0274) 884201, Fax: (0274) 884208 | Website: amikom.ac.id</p>
        </div>
      </div>
    </div>

    <!-- HEADER SURAT -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px;">
      <div>
        <table style="border-collapse: collapse;">
          <tr><td style="width: 80px; padding: 2px 0;">No</td><td>: ${nomorSurat}</td></tr>
          <tr><td style="padding: 2px 0;">Hal</td><td>: <strong>Pengantar Pra Survey Magang</strong></td></tr>
          <tr><td style="padding: 2px 0;">Lampiran</td><td>: -</td></tr>
        </table>
      </div>
      <div style="text-align: right;">
        Sleman, ${formatTanggalIndo(tanggalSurat)}
      </div>
    </div>

    <!-- TUJUAN SURAT -->
    <div style="margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
      Yth. Pimpinan / Manajer Operasional<br>
      <strong>${namaMitra}</strong><br>
      ${alamatMitra}
    </div>

    <!-- ISI SURAT -->
    <div style="font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 20px;">
      Dengan hormat,<br><br>
      Sehubungan dengan pelaksanaan persiapan kegiatan Magang Industri Program Studi S1 Informatika Fakultas Ilmu Komputer Universitas AMIKOM Yogyakarta Semester Genap Tahun Akademik 2025/2026, kami sampaikan permohonan ijin pra-survey bagi mahasiswa di bawah ini:
    </div>

    <!-- TABEL MAHASISWA -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
      <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000; background-color: #f8fafc;">
        <th style="padding: 8px 12px; text-align: left; width: 40px;">No</th>
        <th style="padding: 8px 12px; text-align: left;">Nama Mahasiswa</th>
        <th style="padding: 8px 12px; text-align: left; width: 140px;">NIM</th>
        <th style="padding: 8px 12px; text-align: left; width: 180px;">Program Studi</th>
      </tr>
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 10px 12px;">1.</td>
        <td style="padding: 10px 12px; font-weight: bold;">${namaMahasiswa}</td>
        <td style="padding: 10px 12px;">${nimMahasiswa}</td>
        <td style="padding: 10px 12px;">${prodi}</td>
      </tr>
    </table>

    <!-- DETAIL PRA SURVEY -->
    <div style="font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 24px;">
      Mahasiswa tersebut di atas memohon ijin untuk melakukan observasi awal dan pra-survey guna mengumpulkan informasi profil instansi serta analisis kebutuhan posisi magang pada perusahaan/instansi yang Bapak/Ibu pimpin.<br><br>
      Demi kelancaran kegiatan pra-survey tersebut, kami sangat berterima kasih atas bantuan dan fasilitas yang Bapak/Ibu berikan.<br><br>
      Demikian surat pengantar pra-survey ini kami buat. Atas kerjasama dan kebaikan Bapak/Ibu kami ucapkan terima kasih.
    </div>

    <!-- TANDA TANGAN DEKAN & QR CODE -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px;">
      <div style="border: 1px dashed #7e22ce; padding: 10px; border-radius: 8px; background-color: #faf5ff; display: flex; align-items: center; gap: 10px; width: 260px;">
        <div style="width: 50px; height: 50px; background-color: #7e22ce; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border-radius: 4px; text-align: center; font-family: sans-serif;">
          QR VALIDATED
        </div>
        <div style="font-size: 10px; color: #581c87; font-family: sans-serif;">
          <strong>VERIFIKASI RESMI DIGITAL</strong><br>
          Dokumen Terverifikasi Sah oleh Sistem UNIKA.IN Amikom.<br>
          <span style="color: #6b21a8;">ID: ${nomorSurat}</span>
        </div>
      </div>

      <div style="text-align: center; width: 260px; font-size: 14px;">
        Hormat Kami,<br>
        Dekan Fakultas Ilmu Komputer,<br>
        <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-style: italic; color: #7e22ce; font-weight: bold; font-size: 16px;">
          ( Digital Signed )
        </div>
        <strong><u>Prof. Dr. Kusrini, M.Kom.</u></strong><br>
        NIK. 190302106
      </div>
    </div>
  `;

  openDocumentPreviewWindow(`Surat Prasurvey Magang - ${namaMahasiswa}`, content);
}

// 3. GENERATE SURAT PENUNJUKAN DOSEN PEMBIMBING MAGANG (FIK-IF AMIKOM)
export function generateSuratPenunjukanDplPdf(data = {}) {
  const {
    nomorSurat = '45/FIK-IF/AMIKOM/STDM/VI/2026',
    tanggalSurat = new Date().toISOString(),
    namaDosen = 'Dr. Indah Susanti, M.Kom',
    namaMahasiswa = 'Budi Santoso',
    nimMahasiswa = '21.11.4001',
    prodi = 'S1 Informatika',
    namaInstansi = 'PT GoTo Gojek Tokopedia Tbk',
    periodeMulai = '1 Februari 2026',
    durasi = '6 Bulan'
  } = data;

  const content = `
    <!-- KOP SURAT RESMI UNIVERSITAS AMIKOM YOGYAKARTA -->
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 70px; height: 70px; background-color: #6b21a8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 24px; font-family: sans-serif;">
          AM
        </div>
        <div>
          <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #581c87; text-transform: uppercase; font-family: sans-serif;">UNIVERSITAS AMIKOM YOGYAKARTA</h2>
          <h3 style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #1e1b4b; font-family: sans-serif;">FAKULTAS ILMU KOMPUTER</h3>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Jl. Ring Road Utara, Condongcatur, Depok, Sleman, Yogyakarta 55283</p>
          <p style="margin: 1px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Telp: (0274) 884201, Fax: (0274) 884208 | Website: amikom.ac.id</p>
        </div>
      </div>
    </div>

    <!-- HEADER SURAT -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px;">
      <div>
        <table style="border-collapse: collapse;">
          <tr><td style="width: 80px; padding: 2px 0;">No</td><td>: ${nomorSurat}</td></tr>
          <tr><td style="padding: 2px 0;">Hal</td><td>: <strong>Penunjukan Dosen Pembimbing Magang</strong></td></tr>
          <tr><td style="padding: 2px 0;">Lampiran</td><td>: -</td></tr>
        </table>
      </div>
      <div style="text-align: right;">
        Sleman, ${formatTanggalIndo(tanggalSurat)}
      </div>
    </div>

    <!-- TUJUAN SURAT -->
    <div style="margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
      Yth. Bapak/Ibu Dosen<br>
      <strong>${namaDosen}</strong><br>
      Fakultas Ilmu Komputer Universitas AMIKOM Yogyakarta
    </div>

    <!-- ISI SURAT -->
    <div style="font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 16px;">
      Dengan Hormat,<br><br>
      Yang bertandatangan di bawah ini, Dekan Fakultas Ilmu Komputer Universitas Amikom Yogyakarta, menunjuk Bapak/Ibu sebagai <strong>Dosen Pembimbing Lapangan (DPL) Magang</strong> bagi mahasiswa berikut:
    </div>

    <!-- TABEL MAHASISWA BIMBINGAN -->
    <div style="margin-left: 20px; margin-bottom: 24px; font-size: 14px; line-height: 1.8;">
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="width: 140px; font-weight: bold;">Nama Mahasiswa</td><td>: ${namaMahasiswa}</td></tr>
        <tr><td style="font-weight: bold;">NIM</td><td>: ${nimMahasiswa}</td></tr>
        <tr><td style="font-weight: bold;">Program Studi</td><td>: ${prodi}</td></tr>
        <tr><td style="font-weight: bold;">Instansi Magang</td><td>: ${namaInstansi}</td></tr>
        <tr><td style="font-weight: bold;">Periode Mulai</td><td>: ${periodeMulai}</td></tr>
        <tr><td style="font-weight: bold;">Durasi Magang</td><td>: ${durasi}</td></tr>
      </table>
    </div>

    <!-- TUGAS DPL -->
    <div style="font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 24px;">
      Adapun tugas Dosen Pembimbing Lapangan meliputi melakukan pembimbingan akademis, memantau logbook berkala, melakukan komunikasi evaluasi dengan pihak supervisor mitra industri, serta memberikan penilaian akhir usulan & klaim konversi SKS kurikulum OBE.<br><br>
      Demikian Surat Penunjukan ini kami buat, agar dipergunakan sebagaimana mestinya. Atas perhatian dan kesediaan Bapak/Ibu, kami ucapkan terima kasih.
    </div>

    <!-- TANDA TANGAN DEKAN & QR CODE -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px;">
      <div style="border: 1px dashed #7e22ce; padding: 10px; border-radius: 8px; background-color: #faf5ff; display: flex; align-items: center; gap: 10px; width: 260px;">
        <div style="width: 50px; height: 50px; background-color: #7e22ce; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border-radius: 4px; text-align: center; font-family: sans-serif;">
          QR VALIDATED
        </div>
        <div style="font-size: 10px; color: #581c87; font-family: sans-serif;">
          <strong>VERIFIKASI RESMI DIGITAL</strong><br>
          Dokumen Terverifikasi Sah oleh Sistem UNIKA.IN Amikom.<br>
          <span style="color: #6b21a8;">ID: ${nomorSurat}</span>
        </div>
      </div>

      <div style="text-align: center; width: 260px; font-size: 14px;">
        Hormat Kami,<br>
        Dekan Fakultas Ilmu Komputer,<br>
        <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-style: italic; color: #7e22ce; font-weight: bold; font-size: 16px;">
          ( Digital Signed )
        </div>
        <strong><u>Prof. Dr. Kusrini, M.Kom.</u></strong><br>
        NIK. 190302106
      </div>
    </div>
  `;

  openDocumentPreviewWindow(`Surat Penunjukan DPL - ${namaDosen}`, content);
}

// 4. GENERATE TRANSKRIP HASIL KONVERSI SKS & CPMK (OBE)
export function generateTranskripKonversiPdf(data = {}) {
  const {
    namaMahasiswa = 'Budi Santoso',
    nimMahasiswa = '21.11.4001',
    prodi = 'S1 Informatika',
    idMagang = 'FIK6206030',
    namaInstansi = 'PT GoTo Gojek Tokopedia Tbk',
    dpl = 'Dr. Indah Susanti, M.Kom',
    courses = [
      { kode_mk: 'IF184523', nama_mk: 'Pengembangan Aplikasi Web Lanjut', sks: 4, nilai_angka: 88, nilai_huruf: 'A', cpmk: 'Mampu merancang dan mengimplementasikan arsitektur web modern yang scalable.' },
      { kode_mk: 'IF184524', nama_mk: 'Manajemen Proyek Perangkat Lunak', sks: 3, nilai_angka: 85, nilai_huruf: 'A', cpmk: 'Mampu merencanakan, mengelola, dan memantau daur hidup pengembangan software.' },
      { kode_mk: 'IF184525', nama_mk: 'Keamanan Sistem Informasi', sks: 3, nilai_angka: 82, nilai_huruf: 'A', cpmk: 'Mampu menganalisis kerentanan keamanan dan menerapkan protokol enkripsi/proteksi.' }
    ]
  } = data;

  const totalSks = courses.reduce((acc, c) => acc + (Number(c.sks) || 3), 0);

  const content = `
    <!-- KOP SURAT RESMI UNIVERSITAS AMIKOM YOGYAKARTA -->
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 70px; height: 70px; background-color: #6b21a8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 24px; font-family: sans-serif;">
          AM
        </div>
        <div>
          <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #581c87; text-transform: uppercase; font-family: sans-serif;">UNIVERSITAS AMIKOM YOGYAKARTA</h2>
          <h3 style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #1e1b4b; font-family: sans-serif;">FAKULTAS ILMU KOMPUTER</h3>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Jl. Ring Road Utara, Condongcatur, Depok, Sleman, Yogyakarta 55283</p>
          <p style="margin: 1px 0 0 0; font-size: 11px; color: #475569; font-family: sans-serif;">Telp: (0274) 884201, Fax: (0274) 884208 | Website: amikom.ac.id</p>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <h3 style="margin: 0; font-size: 16px; font-weight: bold; text-decoration: underline; text-transform: uppercase; font-family: sans-serif;">TRANSKRIP HASIL KONVERSI SKS & HASIL CAPAIAN PEMBELAJARAN (OBE)</h3>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569; font-family: sans-serif;">PROGRAM MAGANG MERDEKA / MBKM INFORMATIKA AMIKOM</p>
    </div>

    <!-- IDENTITAS MAHASISWA -->
    <div style="margin-bottom: 20px; font-size: 13px; line-height: 1.8;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="width: 140px; font-weight: bold;">Nama Mahasiswa</td><td>: ${namaMahasiswa}</td><td style="width: 140px; font-weight: bold;">ID Magang Resmi</td><td>: ${idMagang}</td></tr>
        <tr><td style="font-weight: bold;">NIM</td><td>: ${nimMahasiswa}</td><td style="font-weight: bold;">Instansi Magang</td><td>: ${namaInstansi}</td></tr>
        <tr><td style="font-weight: bold;">Program Studi</td><td>: ${prodi}</td><td style="font-weight: bold;">DPL Pembimbing</td><td>: ${dpl}</td></tr>
      </table>
    </div>

    <!-- TABEL HASIL KONVERSI -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
      <thead>
        <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000; background-color: #f1f5f9;">
          <th style="padding: 8px 10px; text-align: left; width: 35px;">NO</th>
          <th style="padding: 8px 10px; text-align: left; width: 90px;">KODE MK</th>
          <th style="padding: 8px 10px; text-align: left;">MATA KULIAH & CAPAIAN PEMBELAJARAN (CPMK)</th>
          <th style="padding: 8px 10px; text-align: center; width: 50px;">SKS</th>
          <th style="padding: 8px 10px; text-align: center; width: 80px;">NILAI ANGKA</th>
          <th style="padding: 8px 10px; text-align: center; width: 80px;">NILAI HURUF</th>
        </tr>
      </thead>
      <tbody>
        ${courses.map((c, i) => `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px; vertical-align: top;">${i + 1}.</td>
            <td style="padding: 10px; vertical-align: top; font-weight: bold;">${c.kode_mk || c.code || 'IF184523'}</td>
            <td style="padding: 10px; vertical-align: top;">
              <div style="font-weight: bold;">${c.nama_mk || c.name || 'Mata Kuliah Konversi'}</div>
              <div style="font-size: 11px; color: #475569; margin-top: 3px;"><strong>CPMK:</strong> ${c.cpmk || 'Capaian Pembelajaran Utama'}</div>
            </td>
            <td style="padding: 10px; text-align: center; vertical-align: top; font-weight: bold;">${c.sks || 3}</td>
            <td style="padding: 10px; text-align: center; vertical-align: top; font-weight: bold;">${c.nilai_angka || 88}</td>
            <td style="padding: 10px; text-align: center; vertical-align: top; font-weight: bold; color: #047857;">${c.nilai_huruf || 'A'}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000; background-color: #faf5ff;">
          <td colSpan="3" style="padding: 10px; font-weight: bold; text-align: right;">TOTAL SKS AKADEMIK DIKONVERSI:</td>
          <td style="padding: 10px; text-align: center; font-weight: bold; color: #7e22ce;">${totalSks} SKS</td>
          <td colSpan="2" style="padding: 10px; text-align: center; font-weight: bold; color: #047857;">STATUS: LULUS KONVERSI (ACC)</td>
        </tr>
      </tfoot>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px;">
      <div style="border: 1px dashed #7e22ce; padding: 10px; border-radius: 8px; background-color: #faf5ff; display: flex; align-items: center; gap: 10px; width: 260px;">
        <div style="width: 50px; height: 50px; background-color: #7e22ce; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border-radius: 4px; text-align: center; font-family: sans-serif;">
          QR VALIDATED
        </div>
        <div style="font-size: 10px; color: #581c87; font-family: sans-serif;">
          <strong>VERIFIKASI TRANSKRIP OBE</strong><br>
          Dokumen Terverifikasi Sah oleh Sistem UNIKA.IN Amikom.<br>
          <span style="color: #6b21a8;">ID: ${idMagang}</span>
        </div>
      </div>

      <div style="text-align: center; width: 260px; font-size: 14px;">
        Sleman, ${formatTanggalIndo(new Date())}<br>
        Dekan Fakultas Ilmu Komputer,<br>
        <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-style: italic; color: #7e22ce; font-weight: bold; font-size: 16px;">
          ( Digital Signed )
        </div>
        <strong><u>Prof. Dr. Kusrini, M.Kom.</u></strong><br>
        NIK. 190302106
      </div>
    </div>
  `;

  openDocumentPreviewWindow(`Transkrip Konversi SKS - ${namaMahasiswa}`, content);
}
