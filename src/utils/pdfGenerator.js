// Helper Format Tanggal Indonesia
function formatTanggalIndo(dateStr) {
  if (!dateStr) return '23 Juni 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
}

// Helper Window Preview PDF Instant & Safe
function openDocumentPreviewWindow(title, htmlBodyContent) {
  const printWindow = window.open('', '_blank', 'width=950,height=1050,scrollbars=yes,resizable=yes');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk melihat dokumen surat resmi.');
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
          margin: 10mm 15mm 15mm 15mm;
        }
        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          background-color: #0f172a;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .preview-toolbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          background: #1e1b4b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
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
          padding: 15mm 20mm 20mm 20mm;
          margin: 76px auto 40px auto;
          background: #ffffff;
          box-shadow: 0 12px 36px rgba(0,0,0,0.4);
          box-sizing: border-box;
          position: relative;
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
        <h1>📄 Dokumen Resmi Universitas Amikom Yogyakarta — ${title}</h1>
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

// 1. SURAT PENGANTAR MAGANG (DUMMY AMIKOM RESMI)
export function generateSuratPengantarMagangPdf(data = {}) {
  const {
    nomorSurat = '55/FIK-IF/AMIKOM/MAGANG/VI/2026',
    tanggalSurat = '23 Juni 2026',
    namaMitra = 'Narendra Wicaksono',
    perusahaan = 'Dicoding',
    alamatMitra = 'Jl. Batik Kumeli No. 50, Sukaluyu, Kec. Cibeunying Kaler, Kota Bandung, Jawa Barat 40123',
    namaMahasiswa = 'Arundaya Xenia Naurachmawan',
    nimMahasiswa = '24.11.5967',
    prodi = 'S1 Informatika',
    tanggalMulai = '09 Februari 2026',
    tanggalSelesai = '27 Juli 2026'
  } = data;

  const content = `
    <!-- KOP SURAT AMIKOM YOGYAKARTA -->
    <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px;">
      <div style="display: flex; align-items: flex-start; gap: 14px;">
        <div style="width: 75px; height: 75px; background: radial-gradient(circle, #facc15 0%, #7e22ce 70%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 26px; border: 2px solid #6b21a8;">
          AM
        </div>
        <div>
          <h2 style="margin: 0; font-size: 17px; font-weight: 800; color: #581c87; text-transform: uppercase;">UNIVERSITAS AMIKOM YOGYAKARTA</h2>
          <div style="font-size: 9.5px; color: #1e1b4b; margin-top: 3px; font-weight: 600; line-height: 1.3;">
            <strong>PROGRAM DOKTOR:</strong> Informatika<br>
            <strong>PROGRAM MAGISTER:</strong> Informatika, PJJ Informatika<br>
            <strong>PROGRAM SARJANA:</strong> Informatika, Sistem Informasi, Teknologi Informasi (Animasi), Teknik Komputer (IoT & Cyber Security), Arsitektur, Geografi, Kewirausahaan, Ekonomi, Akuntansi, Ilmu Pemerintahan, Ilmu Komunikasi, Hubungan Internasional<br>
            <strong>PROGRAM DIPLOMA III:</strong> Teknik Informatika, Manajemen Informatika
          </div>
        </div>
      </div>
      <div style="text-align: right; font-family: sans-serif;">
        <div style="display: inline-block; border: 2px solid #f59e0b; padding: 4px 10px; border-radius: 6px; text-align: center; background: #fffbeb;">
          <div style="font-size: 9px; font-weight: 800; color: #b45309; letter-spacing: 1px;">TERAKREDITASI</div>
          <div style="font-size: 16px; font-weight: 900; color: #b45309; letter-spacing: 1.5px;">UNGGUL</div>
          <div style="font-size: 7px; color: #78350f;">NOMOR: 3107/SK/BAN-PT/Ak/PT/XII/2025</div>
        </div>
        <div style="font-size: 10px; color: #d97706; font-weight: 700; margin-top: 6px;">FIK3950245</div>
      </div>
    </div>

    <!-- NOMOR & TANGGAL -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13.5px; line-height: 1.6;">
      <div>
        <table style="border-collapse: collapse;">
          <tr><td style="width: 60px;">No</td><td>: ${nomorSurat}</td></tr>
          <tr><td>Hal</td><td>: Pengantar magang</td></tr>
        </table>
      </div>
      <div style="text-align: right; font-weight: 600;">
        ${tanggalSurat}
      </div>
    </div>

    <!-- TUJUAN -->
    <div style="margin-bottom: 24px; font-size: 13.5px; line-height: 1.5;">
      Yth. ${namaMitra}<br>
      <strong>${perusahaan}</strong><br>
      ${alamatMitra}
    </div>

    <!-- ISI -->
    <div style="font-size: 13.5px; line-height: 1.6; text-align: justify; margin-bottom: 20px;">
      Dengan hormat,<br>
      Sehubungan dengan pelaksanaan magang Program Studi S1 Informatika Fakultas Ilmu Komputer Universitas AMIKOM Yogyakarta Semester Genap Tahun Akademik 2025/2026, kami sampaikan permohonan ijin mahasiswa di bawah ini:
    </div>

    <!-- TABEL MAHASISWA -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; border: 1.5px solid #000;">
      <thead>
        <tr style="border-bottom: 1.5px solid #000; background-color: #f8fafc;">
          <th style="padding: 8px 12px; text-align: left; border-right: 1.5px solid #000; width: 45%;">NAMA</th>
          <th style="padding: 8px 12px; text-align: left; border-right: 1.5px solid #000; width: 25%;">NIM</th>
          <th style="padding: 8px 12px; text-align: left; width: 30%;">PROGRAM STUDI</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 10px 12px; border-right: 1.5px solid #000; font-weight: bold;">${namaMahasiswa}</td>
          <td style="padding: 10px 12px; border-right: 1.5px solid #000;">${nimMahasiswa}</td>
          <td style="padding: 10px 12px;">${prodi}</td>
        </tr>
      </tbody>
    </table>

    <!-- PERIODE & PENUTUP -->
    <div style="font-size: 13.5px; line-height: 1.6; text-align: justify; margin-bottom: 30px;">
      untuk melaksanakan magang atau praktek kerja lapangan pada tanggal <strong>${tanggalMulai}</strong> s.d. <strong>${tanggalSelesai}</strong>. Demi kelancaran kegiatan tersebut, kami mohon konfirmasi kesediaan dari Bapak/Ibu.<br><br>
      Demikian surat ini kami buat, atas kerjasama dan kesediaan Bapak/Ibu kami ucapkan terima kasih.
    </div>

    <!-- TTD DEKAN -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
      <div style="text-align: left; width: 240px; font-size: 13.5px;">
        Hormat Kami,<br>
        Dekan Fakultas Ilmu Komputer,<br>
        <div style="margin: 12px 0;">
          <!-- SIMULASI QR CODE DEKAN -->
          <div style="width: 75px; height: 75px; border: 2px solid #000; padding: 3px; display: flex; align-items: center; justify-content: center; background: #fff;">
            <div style="width: 100%; height: 100%; background: repeating-concentric-gradient(#000 0 4px, #fff 4px 8px); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; text-align: center;">
              QR<br>AMIKOM
            </div>
          </div>
        </div>
        <strong>Prof. Dr. Kusrini, M.Kom.</strong><br>
        NIK 190302106
      </div>
    </div>

    <!-- FOOTER ISO & QS STARS -->
    <div style="position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 8.5px; color: #475569; font-family: sans-serif;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold; color: #7e22ce;">ISO 21001:2018 Certified</span> | <span style="font-weight: bold; color: #b45309;">QS STARS 4-RATING</span>
      </div>
      <div style="text-align: right;">
        <strong>GRAHA AMIKOM:</strong> Jl. Pajajaran Ring Road Utara, Condongcatur, Sleman, Yogyakarta<br>
        Telp: (0274) 884201 - 204 | Website: <strong>www.amikom.ac.id</strong>
      </div>
    </div>
  `;

  openDocumentPreviewWindow('Surat Pengantar Magang FIK AMIKOM', content);
}

// 2. SURAT PRASURVEY MAGANG (DUMMY AMIKOM RESMI)
export function generateSuratPrasurveyMagangPdf(data = {}) {
  generateSuratPengantarMagangPdf(data);
}

// 3. SURAT PENUNJUKAN DOSEN PEMBIMBING MAGANG (STDM DUMMY AMIKOM RESMI)
export function generateSuratPenunjukanDplPdf(data = {}) {
  const {
    nomorSurat = '45/FIK-IF/AMIKOM/STDM/VI/2026',
    tanggalSurat = '1 Juli 2026',
    namaDosen = 'Drs. Asro Nasiri, M.Kom.',
    namaMahasiswa = 'ARUNDAYA XENIA NAURACHMAWAN',
    nimMahasiswa = '24.11.5967',
    prodi = 'S1 Informatika',
    instansi = 'Dicoding',
    periodeMulai = '09 Februari 2026',
    durasi = '6 Bulan.'
  } = data;

  const content = `
    <!-- KOP SURAT AMIKOM YOGYAKARTA -->
    <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px;">
      <div style="display: flex; align-items: flex-start; gap: 14px;">
        <div style="width: 75px; height: 75px; background: radial-gradient(circle, #facc15 0%, #7e22ce 70%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 26px; border: 2px solid #6b21a8;">
          AM
        </div>
        <div>
          <h2 style="margin: 0; font-size: 17px; font-weight: 800; color: #581c87; text-transform: uppercase;">UNIVERSITAS AMIKOM YOGYAKARTA</h2>
          <div style="font-size: 9.5px; color: #1e1b4b; margin-top: 3px; font-weight: 600; line-height: 1.3;">
            <strong>PROGRAM DOKTOR:</strong> Informatika<br>
            <strong>PROGRAM MAGISTER:</strong> Informatika, PJJ Informatika<br>
            <strong>PROGRAM SARJANA:</strong> Informatika, Sistem Informasi, Teknologi Informasi (Animasi), Teknik Komputer (IoT & Cyber Security), Arsitektur, Geografi, Kewirausahaan, Ekonomi, Akuntansi, Ilmu Pemerintahan, Ilmu Komunikasi, Hubungan Internasional<br>
            <strong>PROGRAM DIPLOMA III:</strong> Teknik Informatika, Manajemen Informatika
          </div>
        </div>
      </div>
      <div style="text-align: right; font-family: sans-serif;">
        <div style="display: inline-block; border: 2px solid #f59e0b; padding: 4px 10px; border-radius: 6px; text-align: center; background: #fffbeb;">
          <div style="font-size: 9px; font-weight: 800; color: #b45309; letter-spacing: 1px;">TERAKREDITASI</div>
          <div style="font-size: 16px; font-weight: 900; color: #b45309; letter-spacing: 1.5px;">UNGGUL</div>
          <div style="font-size: 7px; color: #78350f;">NOMOR: 3107/SK/BAN-PT/Ak/PT/XII/2025</div>
        </div>
        <div style="font-size: 10px; color: #d97706; font-weight: 700; margin-top: 6px;">FIK3950245</div>
      </div>
    </div>

    <!-- NOMOR & TANGGAL -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13.5px; line-height: 1.6;">
      <div>
        <table style="border-collapse: collapse;">
          <tr><td style="width: 60px;">No</td><td>: ${nomorSurat}</td></tr>
          <tr><td>Hal</td><td>: Penunjukan dosen pembimbing magang</td></tr>
        </table>
      </div>
      <div style="text-align: right; font-weight: 600;">
        ${tanggalSurat}
      </div>
    </div>

    <!-- TUJUAN DOSEN -->
    <div style="margin-bottom: 24px; font-size: 13.5px; line-height: 1.5;">
      Yth. Bapak/Ibu Dosen<br>
      <strong>${namaDosen}</strong><br>
      Fakultas Ilmu Komputer.
    </div>

    <!-- ISI -->
    <div style="font-size: 13.5px; line-height: 1.6; text-align: justify; margin-bottom: 20px;">
      Dengan Hormat,<br>
      Yang bertandatangan di bawah ini, Dekan Fakultas Ilmu Komputer Universitas Amikom Yogyakarta, menunjuk Bapak/Ibu sebagai dosen pembimbing magang bagi mahasiswa:
    </div>

    <!-- DETAIL BIMBINGAN -->
    <div style="margin-left: 30px; margin-bottom: 24px; font-size: 13.5px; line-height: 1.9;">
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="width: 140px;">nama</td><td>: <strong>${namaMahasiswa}</strong></td></tr>
        <tr><td>nim</td><td>: ${nimMahasiswa}</td></tr>
        <tr><td>program Studi</td><td>: ${prodi}</td></tr>
        <tr><td>instansi</td><td>: ${instansi}</td></tr>
        <tr><td>periode mulai</td><td>: ${periodeMulai}</td></tr>
        <tr><td>durasi</td><td>: ${durasi}</td></tr>
      </table>
    </div>

    <!-- PENUTUP -->
    <div style="font-size: 13.5px; line-height: 1.6; text-align: justify; margin-bottom: 30px;">
      Demikian Surat Penunjukkan ini kami buat, agar dipergunakan sebagaimana mestinya.
    </div>

    <!-- TTD DEKAN -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
      <div style="text-align: left; width: 240px; font-size: 13.5px;">
        Hormat Kami,<br>
        Dekan Fakultas Ilmu Komputer,<br>
        <div style="margin: 12px 0;">
          <!-- SIMULASI QR CODE DEKAN -->
          <div style="width: 75px; height: 75px; border: 2px solid #000; padding: 3px; display: flex; align-items: center; justify-content: center; background: #fff;">
            <div style="width: 100%; height: 100%; background: repeating-concentric-gradient(#000 0 4px, #fff 4px 8px); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; text-align: center;">
              QR<br>AMIKOM
            </div>
          </div>
        </div>
        <strong>Prof. Dr. Kusrini, M.Kom.</strong><br>
        NIK 190302106
      </div>
    </div>

    <!-- FOOTER ISO & QS STARS -->
    <div style="position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 8.5px; color: #475569; font-family: sans-serif;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold; color: #7e22ce;">ISO 21001:2018 Certified</span> | <span style="font-weight: bold; color: #b45309;">QS STARS 4-RATING</span>
      </div>
      <div style="text-align: right;">
        <strong>GRAHA AMIKOM:</strong> Jl. Pajajaran Ring Road Utara, Condongcatur, Sleman, Yogyakarta<br>
        Telp: (0274) 884201 - 204 | Website: <strong>www.amikom.ac.id</strong>
      </div>
    </div>
  `;

  openDocumentPreviewWindow('Surat Penunjukan DPL FIK AMIKOM', content);
}

// 4. TRANSKRIP KONVERSI SKS (SEBAGAI MODAL RINCIAN TEKS)
export function generateTranskripKonversiPdf(data = {}) {
  generateSuratPengantarMagangPdf(data);
}
