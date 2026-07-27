import React, { useState } from "react";
import { Search } from "lucide-react";

const PenilaianMahasiswa = () => {
  const [search, setSearch] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [penilaian, setPenilaian] = useState({});

  const mahasiswa = [
    {
      id: 1,
      nama: "Sukma Putri",
      nim: "22.11.4321",
      prodi: "Informatika",
      posisi: "Web Developer",
      periode: "Feb - Mei 2026",
      status: "Belum Dinilai",
    },
    {
      id: 2,
      nama: "Arief Kurniawan",
      nim: "22.11.4312",
      prodi: "Informatika",
      posisi: "Backend Developer",
      periode: "Feb - Mei 2026",
      status: "Draft",
    },
    {
      id: 3,
      nama: "Sonia Clarissa",
      nim: "22.11.4299",
      prodi: "Informatika",
      posisi: "UI/UX Designer",
      periode: "Jan - Apr 2026",
      status: "Sudah Dinilai",
    },
  ];

const handleUpdate = () => {
  if (!masihBisaUpdate()) {
    alert(
      "Batas waktu update penilaian sudah berakhir."
    );
    return;
  }

  setIsEditing(true);
};

  const hasilPencarian = mahasiswa.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const belumDinilai = mahasiswa.filter(
    (item) => item.status === "Belum Dinilai"
  ).length;

  const draft = mahasiswa.filter(
    (item) => item.status === "Draft"
  ).length;

  const sudahDinilai = mahasiswa.filter(
    (item) => item.status === "Sudah Dinilai"
  ).length;

  return (
    <>
      {selectedMahasiswa ? (
  <DetailPenilaian
    mahasiswa={selectedMahasiswa}
    dataPenilaian={penilaian[selectedMahasiswa.id]}
    onBack={() => setSelectedMahasiswa(null)}

    onSubmit={(data) => {
      setPenilaian((prev) => ({
        ...prev,

        [selectedMahasiswa.id]: {
          ...data,

          submittedAt:
            prev[selectedMahasiswa.id]?.submittedAt ||
            Date.now(),
        },
      }));

      setSelectedMahasiswa(null);
    }}
  />
) : (
        <div className="penilaian-mahasiswa-page">

          {/* HEADER */}
          <div className="penilaian-page-header">
            <h1>Penilaian Mahasiswa</h1>
            <p>
              Kelola dan berikan penilaian kepada mahasiswa yang telah
              menyelesaikan kegiatan magang.
            </p>
          </div>

          {/* SUMMARY */}
          <div className="penilaian-summary-grid">

            <div className="penilaian-summary-card">
              <span>Total Mahasiswa</span>
              <strong>{mahasiswa.length}</strong>
            </div>

            <div className="penilaian-summary-card">
              <span>Belum Dinilai</span>
              <strong>{belumDinilai}</strong>
            </div>

            <div className="penilaian-summary-card">
              <span>Draft Penilaian</span>
              <strong>{draft}</strong>
            </div>

            <div className="penilaian-summary-card">
              <span>Sudah Dinilai</span>
              <strong>{sudahDinilai}</strong>
            </div>

          </div>

          {/* DAFTAR */}
          <div className="penilaian-list-card">

            <div className="penilaian-list-header">

              <div>
                <h2>Daftar Mahasiswa</h2>
                <p>
                  Mahasiswa magang yang terdaftar di perusahaan Anda.
                </p>
              </div>

              <div className="penilaian-search">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Cari mahasiswa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            </div>

            {/* HEADER KOLOM */}
            <div className="penilaian-table-header">
              <span>Mahasiswa</span>
              <span>Posisi</span>
              <span>Status Penilaian</span>
              <span>Aksi</span>
            </div>

            {/* DATA */}
            <div className="penilaian-student-list">

              {hasilPencarian.map((item) => {
  const sudahDinilai =
    item.status === "Sudah Dinilai" ||
    !!penilaian[item.id];

  return (
                <div
                  className="penilaian-student-card"
                  key={item.id}
                >

                  {/* MAHASISWA */}
                  <div className="penilaian-identity">

                    <div className="penilaian-avatar">
                      {item.nama.charAt(0)}
                    </div>

                    <div className="penilaian-student-info">
                      <h3>{item.nama}</h3>
                      <span>{item.nim}</span>
                    </div>

                  </div>

                  {/* POSISI */}
                  <div className="penilaian-position">
                    <strong>{item.posisi}</strong>
                    <span>{item.periode}</span>
                  </div>

                  {/* STATUS */}
<div className="penilaian-status-wrapper">
  <span
    className={`penilaian-status ${
      sudahDinilai
        ? "done"
        : item.status === "Draft"
        ? "draft"
        : "waiting"
    }`}
  >
    {sudahDinilai ? "Sudah Dinilai" : item.status}
  </span>
</div>

                  {/* AKSI */}
                  {/* AKSI */}
<div className="penilaian-action">

  {sudahDinilai ? (
    <button
      className="penilaian-secondary-btn"
      onClick={() => setSelectedMahasiswa(item)}
    >
      Lihat Penilaian
    </button>

  ) : item.status === "Draft" ? (
    <button
      className="penilaian-primary-btn"
      onClick={() => setSelectedMahasiswa(item)}
    >
      Lanjutkan Penilaian
    </button>

  ) : (
    <button
      className="penilaian-primary-btn"
      onClick={() => setSelectedMahasiswa(item)}
    >
      Beri Penilaian
    </button>
  )}

</div>

                </div>
                );
})}

            </div>
          </div>

        </div>
      )}

      {/* CSS SELALU DIRENDER */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .penilaian-mahasiswa-page,
        .detail-penilaian {
          width: 100%;
        }
        
        .btn-update {
  min-width: 160px;
  padding: 11px 20px;

  border: 1px solid #b432f2;
  border-radius: 10px;

  background: #b432f2;
  color: #ffffff;

  font-family: inherit;
  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.2s ease;
}

.btn-update:hover {
  background: #a126df;
  border-color: #a126df;
  transform: translateY(-1px);
}

.btn-update:active {
  transform: translateY(0);
}

/* ketika batas update 24 jam sudah habis */
.btn-update:disabled {
  background: #e5e7eb;
  border-color: #e5e7eb;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
}


        /* ================= HEADER ================= */

        .penilaian-page-header,
        .detail-title {
          margin-bottom: 28px;
        }

        .penilaian-page-header h1,
        .detail-title h1 {
          margin: 0 0 7px;
          color: #111827;
          font-size: 30px;
          font-weight: 800;
        }

        .penilaian-page-header p,
        .detail-title p {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }


        /* ================= SUMMARY ================= */

        .penilaian-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .penilaian-summary-card {
          padding: 24px;
          background: white;
          border: 1px solid #e9e2f2;
          border-radius: 18px;
        }

        .penilaian-summary-card span {
          display: block;
          margin-bottom: 8px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .penilaian-summary-card strong {
          color: #b432f2;
          font-size: 28px;
          font-weight: 800;
        }


        /* ================= LIST ================= */

        .penilaian-list-card {
          padding: 28px;
          background: white;
          border: 1px solid #e9e2f2;
          border-radius: 20px;
        }

        .penilaian-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .penilaian-list-header h2 {
          margin: 0 0 5px;
          color: #111827;
          font-size: 18px;
          font-weight: 800;
        }

        .penilaian-list-header p {
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
        }


        /* ================= SEARCH ================= */

        .penilaian-search {
          width: 280px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .penilaian-search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: 12px;
        }


        /* ================= TABLE HEADER ================= */

        .penilaian-table-header {
          display: grid;

          grid-template-columns:
            1.5fr
            1fr
            0.8fr
            0.8fr;

          gap: 25px;

          padding: 0 28px 14px;

          border-bottom: 1px solid #eee7f5;

          color: #94a3b8;

          font-size: 10px;
          font-weight: 800;

          text-transform: uppercase;
        }


        /* ================= STUDENT ================= */

        .penilaian-student-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 14px;
        }

        .penilaian-student-card {
          display: grid;

          grid-template-columns:
            1.5fr
            1fr
            0.8fr
            0.8fr;

          align-items: center;

          gap: 25px;

          padding: 20px 28px;

          border: 1px solid #eee7f5;
          border-radius: 16px;

          background: white;
        }

        .penilaian-identity {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .penilaian-avatar {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 12px;

          background: #f5e9ff;
          color: #b432f2;

          font-size: 15px;
          font-weight: 800;
        }

        .penilaian-student-info h3 {
          margin: 0 0 5px;
          color: #111827;
          font-size: 13px;
          font-weight: 800;
        }

        .penilaian-student-info span {
          color: #94a3b8;
          font-size: 11px;
        }

        .penilaian-position {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .penilaian-position strong {
          color: #111827;
          font-size: 13px;
        }

        .penilaian-position span {
          color: #94a3b8;
          font-size: 11px;
        }


        /* ================= STATUS ================= */

        .penilaian-status {
          font-size: 10px;
          font-weight: 700;
        }

        .penilaian-status.waiting {
          color: #64748b;
        }

        .penilaian-status.draft {
          color: #d97706;
        }

        .penilaian-status.done {
          color: #2563eb;
        }


        /* ================= BUTTON ================= */

        .penilaian-primary-btn,
        .penilaian-secondary-btn {
          min-width: 140px;

          padding: 11px 16px;

          border-radius: 10px;

          font-family: inherit;
          font-size: 11px;
          font-weight: 700;

          cursor: pointer;
        }

        .penilaian-primary-btn {
          border: none;
          background: #b432f2;
          color: white;
        }

        .penilaian-secondary-btn {
          border: 1px solid #dfcbea;
          background: white;
          color: #a828e5;
        }


        /* ==================================================
           DETAIL
        ================================================== */

        .detail-back {
          margin-bottom: 18px;

          padding: 9px 14px;

          border: 1px solid #dfcbea;
          border-radius: 10px;

          background: white;
          color: #a82bea;

          font-family: inherit;
          font-size: 12px;
          font-weight: 700;

          cursor: pointer;
        }


        /* ================= DETAIL CARD ================= */

        .detail-student-card,
        .detail-nilai-card {
          width: 100%;

          padding: 26px;

          border: 1px solid #e9e2f2;
          border-radius: 20px;

          background: white;
        }

        .detail-student-card {
          margin-bottom: 24px;
        }

        .detail-student-title,
        .detail-nilai-title {
          margin-bottom: 22px;
        }

        .detail-student-title h2,
        .detail-nilai-title h2 {
          margin: 0 0 5px;

          color: #111827;

          font-size: 18px;
          font-weight: 800;
        }

        .detail-student-title p,
        .detail-nilai-title p {
          margin: 0;

          color: #94a3b8;

          font-size: 12px;
        }


        /* ================= DATA DETAIL ================= */

        .detail-student-grid {
          display: grid;

          grid-template-columns: repeat(3, 1fr);

          gap: 14px;
        }

        .detail-student-grid > div {
          min-height: 75px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          gap: 7px;

          padding: 16px 18px;

          border: 1px solid #eee7f5;
          border-radius: 12px;

          background: #faf8fc;
        }

        .detail-student-grid span {
          color: #94a3b8;

          font-size: 10px;
          font-weight: 800;

          text-transform: uppercase;
        }

        .detail-student-grid strong {
          color: #111827;

          font-size: 13px;
          font-weight: 700;
        }


        /* ================= TABLE NILAI ================= */

        .nilai-table-wrapper {
          width: 100%;

          overflow-x: auto;

          border: 1px solid #eee7f5;
          border-radius: 14px;
        }

        .nilai-table {
          width: 100%;

          border-collapse: collapse;

          background: white;
        }

        .nilai-table thead {
          background: #faf8fc;
        }

        .nilai-table th {
          padding: 15px 18px;

          border-bottom: 1px solid #e9e2f2;

          color: #94a3b8;

          font-size: 10px;
          font-weight: 800;

          text-align: left;

          text-transform: uppercase;
        }

        .nilai-table td {
          padding: 18px;

          border-bottom: 1px solid #eee7f5;

          color: #111827;

          font-size: 12px;
        }

        .nilai-table tbody tr:last-child td {
          border-bottom: none;
        }

        .nilai-table th:first-child,
        .nilai-table td:first-child {
          width: 70px;
          text-align: center;
        }

        .nilai-table th:nth-child(3),
        .nilai-table td:nth-child(3) {
          width: 220px;
        }

        .nilai-table th:nth-child(4),
        .nilai-table td:nth-child(4) {
          width: 170px;
          text-align: center;
        }


        /* ================= INPUT ================= */

        .nilai-table input {
          width: 130px;

          padding: 10px 12px;

          border: 1px solid #ddd6e5;
          border-radius: 9px;

          outline: none;

          font-family: inherit;
          font-size: 12px;
        }

        .nilai-table input:focus {
          border-color: #b432f2;

          box-shadow:
            0 0 0 3px rgba(180, 50, 242, 0.08);
        }


        /* ================= NILAI HURUF ================= */

        .nilai-huruf {
          min-width: 45px;
          height: 36px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 0 12px;

          border-radius: 9px;

          background: #f5e9ff;
          color: #a626e7;

          font-size: 12px;
          font-weight: 800;
        }


        /* ================= BUTTON DETAIL ================= */

        .detail-buttons {
          display: flex;
          justify-content: flex-end;

          gap: 12px;

          margin-top: 24px;
        }

        .btn-draft,
.btn-submit,
.btn-update {
  min-width: 160px;
  padding: 11px 20px;
  border-radius: 10px;

  font-family: inherit;
  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-draft {
  border: 1px solid #d9c5e5;
  background: white;
  color: #a82bea;
}

.btn-submit,
.btn-update {
  border: 1px solid #b432f2;
  background: #b432f2;
  color: white;
}

.btn-submit:hover,
.btn-update:hover {
  background: #a126df;
  border-color: #a126df;
}

.btn-update:disabled {
  background: #e5e7eb;
  border-color: #e5e7eb;
  color: #94a3b8;
  cursor: not-allowed;
}

        .btn-draft {
          border: 1px solid #d9c5e5;

          background: white;
          color: #a82bea;
        }

        .btn-submit {
          border: 1px solid #b432f2;

          background: #b432f2;
          color: white;
        }


        /* ================= RESPONSIVE ================= */

        @media (max-width: 1000px) {

          .penilaian-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .penilaian-table-header {
            display: none;
          }

          .penilaian-student-card {
            grid-template-columns: 1fr 1fr;
          }

        }

        @media (max-width: 700px) {

          .penilaian-list-header {
            flex-direction: column;
            align-items: stretch;
          }

          .penilaian-search {
            width: 100%;
          }

          .detail-student-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 500px) {

          .penilaian-summary-grid {
            grid-template-columns: 1fr;
          }

          .penilaian-student-card {
            grid-template-columns: 1fr;
          }

          .detail-buttons {
            flex-direction: column-reverse;
          }

          .btn-draft,
          .btn-submit {
            width: 100%;
          }

          .nilai-table {
            min-width: 650px;
          }

        }

      `}</style>
    </>
  );
};


/* ======================================================
   DETAIL PENILAIAN
====================================================== */

const DetailPenilaian = ({
  mahasiswa,
  onBack,
  onSubmit,
  dataPenilaian,
}) => {

  const [nilai, setNilai] = useState(
  dataPenilaian?.nilai || {
    web: "",
    proyek: "",
    basisData: "",
  }
);

const [isEditing, setIsEditing] = useState(!dataPenilaian);
const isSubmitted = !!dataPenilaian;
const BATAS_UPDATE = 24 * 60 * 60 * 1000;

const masihBisaUpdate = () => {
  if (!dataPenilaian?.submittedAt) {
    return true;
  }

  return (
    Date.now() - dataPenilaian.submittedAt <
    BATAS_UPDATE
  );
};

const handleUpdate = () => {
  if (!masihBisaUpdate()) {
    alert("Batas waktu update penilaian sudah berakhir.");
    return;
  }

  setIsEditing(true);
};

  const getNilaiHuruf = (angka) => {
    if (angka === "") return "-";

    const n = Number(angka);

    if (n >= 81) return "A";
    if (n >= 61) return "B";
    if (n >= 41) return "C";
    if (n >= 21) return "D";
    return "E";
  };

  const mataKuliah = [
    {
      id: "web",
      nama: "Pemrograman Web Lanjut",
    },
    {
      id: "proyek",
      nama: "Proyek Perangkat Lunak",
    },
    {
      id: "basisData",
      nama: "Basis Data Lanjut",
    },
  ];

  const handleKirimPenilaian = () => {
  const semuaTerisi = mataKuliah.every(
    (mk) => nilai[mk.id] !== ""
  );

  if (!semuaTerisi) {
    alert("Semua nilai mata kuliah harus diisi.");
    return;
  }

  onSubmit({
    nilai,
    status: "Sudah Dinilai",
  });
};


  const handleNilai = (id, value) => {

    if (value === "") {
      setNilai({
        ...nilai,
        [id]: "",
      });

      return;
    }

    const angka = Number(value);

    if (angka >= 0 && angka <= 100) {
      setNilai({
        ...nilai,
        [id]: value,
      });
    }
  };

  return (
    <div className="detail-penilaian">

      <button
        className="detail-back"
        onClick={onBack}
      >
        ← Kembali
      </button>


      {/* HEADER */}

      <div className="detail-title">

        <h1>Penilaian Mahasiswa</h1>

        <p>
          Berikan nilai berdasarkan hasil kegiatan magang mahasiswa.
        </p>

      </div>


      {/* DATA MAHASISWA */}

      <div className="detail-student-card">

        <div className="detail-student-title">

          <h2>Data Mahasiswa</h2>

          <p>
            Informasi mahasiswa yang akan diberikan penilaian.
          </p>

        </div>


        <div className="detail-student-grid">

          <div>
            <span>Nama Mahasiswa</span>
            <strong>{mahasiswa.nama}</strong>
          </div>

          <div>
            <span>NIM</span>
            <strong>{mahasiswa.nim}</strong>
          </div>

          <div>
            <span>Program Studi</span>
            <strong>{mahasiswa.prodi}</strong>
          </div>

          <div>
            <span>Posisi Magang</span>
            <strong>{mahasiswa.posisi}</strong>
          </div>

          <div>
            <span>Periode Magang</span>
            <strong>{mahasiswa.periode}</strong>
          </div>

        </div>

      </div>


      {/* PENILAIAN */}

      <div className="detail-nilai-card">

        <div className="detail-nilai-title">

          <h2>Penilaian Mata Kuliah</h2>

          <p>
            Masukkan nilai angka untuk setiap mata kuliah.
          </p>

        </div>


        <div className="nilai-table-wrapper">

          <table className="nilai-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama Mata Kuliah</th>
                <th>Nilai Angka</th>
                <th>Nilai Huruf</th>
              </tr>
            </thead>


            <tbody>

              {mataKuliah.map((mk, index) => (

                <tr key={mk.id}>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    <strong>
                      {mk.nama}
                    </strong>
                  </td>

                  <td>

                    <input
  type="number"
  min="0"
  max="100"
  placeholder="0 - 100"
  value={nilai[mk.id]}
  disabled={isSubmitted && !isEditing}
  onChange={(e) => handleNilai(mk.id, e.target.value)}
/>

                  </td>

                  <td>

                    <span className="nilai-huruf">
                      {getNilaiHuruf(
                        nilai[mk.id]
                      )}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        <div className="detail-buttons">

  {!isSubmitted || isEditing ? (
    <>
      <button className="btn-draft">
        Simpan Draft
      </button>

      <button
        className="btn-submit"
        onClick={handleKirimPenilaian}
      >
        Kirim Penilaian
      </button>
    </>
  ) : masihBisaUpdate() ? (
    <button
      className="btn-update"
      onClick={handleUpdate}
    >
      Update Penilaian
    </button>
  ) : (
    <button
      className="btn-update"
      disabled
    >
      Update Ditutup
    </button>
  )}

</div>

      </div>

    </div>
  );
};


export default PenilaianMahasiswa;