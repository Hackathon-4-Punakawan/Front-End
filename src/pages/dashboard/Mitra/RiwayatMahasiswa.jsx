import React, { useState } from "react";
import {
  Search,
  Users,
  CheckCircle2,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

const RiwayatMahasiswa = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  // =========================
  // DATA MAHASISWA
  // =========================
  const mahasiswa = [
  {
    id: 1,
    nim: "22.11.4321",
    nama: "Sukma Putri",
    prodi: "Informatika",
    posisi: "Web Developer",
    periode: "Feb - Mei 2026",
    internshipStatus: "Aktif",
    status: "Belum Dinilai",
  },
  {
    id: 2,
    nim: "22.11.4312",
    nama: "Arief Kurniawan",
    prodi: "Informatika",
    posisi: "Backend Developer",
    periode: "Feb - Mei 2026",
    internshipStatus: "Aktif",
    status: "Belum Dinilai",
  },
  {
    id: 3,
    nim: "22.11.4299",
    nama: "Sonia Clarissa",
    prodi: "Informatika",
    posisi: "UI/UX Designer",
    periode: "Jan - Apr 2026",
    internshipStatus: "Selesai",
    status: "Sudah Dinilai",
  },
  {
    id: 4,
    nim: "22.11.4111",
    nama: "Rendra Pramudya",
    prodi: "Informatika",
    posisi: "Frontend Developer",
    periode: "Mar - Jun 2026",
    internshipStatus: "Aktif",
    status: "Belum Dinilai",
  },
  {
    id: 5,
    nim: "22.11.4001",
    nama: "Dinda Maharani",
    prodi: "Informatika",
    posisi: "Data Analyst",
    periode: "Jan - Apr 2026",
    internshipStatus: "Selesai",
    status: "Sudah Dinilai",
  },
  {
    id: 6,
    nim: "22.11.4002",
    nama: "Fajar Ramadhan",
    prodi: "Informatika",
    posisi: "Mobile Developer",
    periode: "Feb - Mei 2026",
    internshipStatus: "Selesai",
    status: "Sudah Dinilai",
  },
  {
    id: 7,
    nim: "22.11.4003",
    nama: "Nadia Putri",
    prodi: "Informatika",
    posisi: "Quality Assurance",
    periode: "Feb - Mei 2026",
    internshipStatus: "Selesai",
    status: "Sudah Dinilai",
  },
  {
    id: 8,
    nim: "22.11.4004",
    nama: "Bagas Pratama",
    prodi: "Informatika",
    posisi: "DevOps Engineer",
    periode: "Jan - Apr 2026",
    internshipStatus: "Selesai",
    status: "Sudah Dinilai",
  },
];

  // =========================
  // HITUNG SUMMARY
  // =========================
  const [filterStatus, setFilterStatus] = useState("Semua");

// JUMLAH DATA
const totalMahasiswa = mahasiswa.length;

const mahasiswaMagang = mahasiswa.filter(
  (m) => m.internshipStatus === "Aktif"
).length;

const mahasiswaSelesai = mahasiswa.filter(
  (m) => m.internshipStatus === "Selesai"
).length;

// DATA YANG DITAMPILKAN SESUAI FILTER
const mahasiswaTampil = mahasiswa.filter((m) => {
  if (filterStatus === "Magang") {
    return m.internshipStatus === "Aktif";
  }

  if (filterStatus === "Selesai") {
    return m.internshipStatus === "Selesai";
  }

  return true;
});

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredMahasiswa = mahasiswa.filter((item) => {
  const cocokSearch =
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.nim.toLowerCase().includes(search.toLowerCase()) ||
    item.posisi.toLowerCase().includes(search.toLowerCase());

  const cocokFilter =
    filter === "semua" ||
    (filter === "magang" && item.internshipStatus === "Aktif") ||
    (filter === "selesai" && item.internshipStatus === "Selesai");

  return cocokSearch && cocokFilter;
});

  return (
    <>
      <div className="riwayat-page">

        {/* ================= HEADER ================= */}
        <div className="riwayat-header">
          <h1>Riwayat Mahasiswa</h1>

          <p>
            Lihat mahasiswa yang sedang menjalani magang dan yang telah
            menyelesaikan kegiatan magang.
          </p>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="riwayat-summary">

          <div className="riwayat-summary-card">
            <div>
              <span>Total Mahasiswa</span>
              <strong>{mahasiswa.length}</strong>
            </div>

            <div className="summary-icon">
              <Users size={22} />
            </div>
          </div>

          <div className="riwayat-summary-card">
            <div>
              <span>Mahasiswa Magang</span>
              <strong>{mahasiswaMagang}</strong>
            </div>

            <div className="summary-icon">
              <BriefcaseBusiness size={22} />
            </div>
          </div>

          <div className="riwayat-summary-card">
            <div>
              <span>Mahasiswa Selesai</span>
              <strong>{mahasiswaSelesai}</strong>
            </div>

            <div className="summary-icon">
              <CheckCircle2 size={22} />
            </div>
          </div>

        </div>

        {/* ================= DAFTAR MAHASISWA ================= */}
        <div className="riwayat-container">

          {/* HEADER DAFTAR */}
          <div className="riwayat-top">

            <div>
              <h2>Daftar Mahasiswa</h2>
              <p>Riwayat mahasiswa magang di perusahaan Anda.</p>
            </div>

            {/* SEARCH */}
            <div className="riwayat-search">
              <Search size={19} />

              <input
                type="text"
                placeholder="Cari mahasiswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          {/* ================= FILTER ================= */}
          <div className="riwayat-filter">

            <button
              className={filter === "semua" ? "filter-active" : ""}
              onClick={() => setFilter("semua")}
            >
              Semua
            </button>

            <button
              className={filter === "magang" ? "filter-active" : ""}
              onClick={() => setFilter("magang")}
            >
              Mahasiswa Magang
            </button>

            <button
              className={filter === "selesai" ? "filter-active" : ""}
              onClick={() => setFilter("selesai")}
            >
              Mahasiswa Selesai
            </button>

          </div>

          {/* ================= HEADER KOLOM ================= */}
          <div className="riwayat-table-header">
            <span>MAHASISWA</span>
            <span>POSISI</span>
            <span>PERIODE</span>
            <span>STATUS</span>
          </div>

          {/* ================= DATA ================= */}
          <div className="riwayat-list">

            {filteredMahasiswa.map((item) => (
              <div className="riwayat-row" key={item.id}>

                {/* MAHASISWA */}
                <div className="riwayat-mahasiswa">

                  <div className="riwayat-avatar">
                    {item.nama.charAt(0)}
                  </div>

                  <div>
                    <strong>{item.nama}</strong>
                    <span>{item.nim}</span>
                  </div>

                </div>

                {/* POSISI */}
                <div className="riwayat-posisi">
                  <strong>{item.posisi}</strong>
                </div>

                {/* PERIODE */}
                <div className="riwayat-periode">
                  <CalendarDays size={17} />
                  <span>{item.periode}</span>
                </div>

                {/* STATUS */}
                {/* STATUS */}
<div className="riwayat-status">
  <span
    className={
      item.internshipStatus === "Aktif"
        ? "status-magang"
        : "status-selesai"
    }
  >
    {item.internshipStatus === "Aktif"
      ? "Sedang Magang"
      : "Selesai"}
  </span>
</div>

              </div>
            ))}

            {/* DATA KOSONG */}
            {filteredMahasiswa.length === 0 && (
              <div className="riwayat-empty">
                Mahasiswa tidak ditemukan.
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ======================================================
          CSS LANGSUNG DI FILE JSX
      ====================================================== */}

      <style>{`

        /* =========================
           PAGE
        ========================= */

        .riwayat-page {
          width: 100%;
          box-sizing: border-box;
        }

        /* =========================
           HEADER
        ========================= */

        .riwayat-header {
          margin-bottom: 32px;
        }

        .riwayat-header h1 {
          margin: 0 0 7px 0;
          font-size: 36px;
          line-height: 1.2;
          font-weight: 700;
          color: #0f172a;
        }

        .riwayat-header p {
          margin: 0;
          font-size: 16px;
          color: #8290ad;
        }

        /* =========================
           SUMMARY
        ========================= */

        .riwayat-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .riwayat-summary-card {
          min-height: 120px;
          padding: 25px 28px;

          background: #ffffff;
          border: 1px solid #e8e0ef;
          border-radius: 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          box-sizing: border-box;
        }

        .riwayat-summary-card span {
          display: block;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 10px;
        }

        .riwayat-summary-card strong {
          display: block;
          font-size: 32px;
          line-height: 1;
          font-weight: 700;
          color: #b026f3;
        }

        .summary-icon {
          width: 48px;
          height: 48px;

          display: flex;
          justify-content: center;
          align-items: center;

          flex-shrink: 0;

          border-radius: 14px;

          background: #f6e8ff;
          color: #b026f3;
        }

        /* =========================
           CONTAINER DAFTAR
        ========================= */

        .riwayat-container {
          width: 100%;

          background: #ffffff;
          border: 1px solid #e8e0ef;
          border-radius: 22px;

          padding: 30px;

          box-sizing: border-box;
        }

        /* =========================
           TOP
        ========================= */

        .riwayat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 20px;

          margin-bottom: 22px;
        }

        .riwayat-top h2 {
          margin: 0 0 5px 0;

          font-size: 23px;
          font-weight: 700;

          color: #0f172a;
        }

        .riwayat-top p {
          margin: 0;

          color: #94a3b8;
          font-size: 14px;
        }

        /* =========================
           SEARCH
        ========================= */

        .riwayat-search {
          width: 310px;
          height: 48px;

          padding: 0 16px;

          display: flex;
          align-items: center;
          gap: 10px;

          border: 1px solid #e2e8f0;
          border-radius: 14px;

          background: #ffffff;
          color: #64748b;

          box-sizing: border-box;
        }

        .riwayat-search svg {
          flex-shrink: 0;
        }

        .riwayat-search input {
          width: 100%;

          border: none;
          outline: none;

          background: transparent;

          font-size: 14px;
          color: #0f172a;
        }

        .riwayat-search input::placeholder {
          color: #94a3b8;
        }

        /* =========================
           FILTER
        ========================= */

        .riwayat-filter {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-bottom: 26px;
        }

        .riwayat-filter button {
          padding: 10px 18px;

          border: 1px solid #e5d5ef;
          border-radius: 10px;

          background: #ffffff;
          color: #64748b;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .riwayat-filter button:hover {
          border-color: #b026f3;
          color: #b026f3;
        }

        .riwayat-filter .filter-active {
          background: #b026f3;
          border-color: #b026f3;
          color: #ffffff;
        }

        .riwayat-filter .filter-active:hover {
          background: #a51ee6;
          color: #ffffff;
        }

        /* =========================
           HEADER TABEL
        ========================= */

        .riwayat-table-header {
          display: grid;

          grid-template-columns:
            minmax(250px, 2fr)
            minmax(180px, 1.4fr)
            minmax(170px, 1.2fr)
            minmax(130px, 1fr);

          align-items: center;

          gap: 20px;

          padding: 0 28px 16px 28px;

          border-bottom: 1px solid #eee7f3;

          box-sizing: border-box;
        }

        .riwayat-table-header span {
          font-size: 12px;
          font-weight: 700;

          color: #94a3b8;
        }

        /* =========================
           LIST
        ========================= */

        .riwayat-list {
          display: flex;
          flex-direction: column;

          gap: 14px;

          margin-top: 16px;
        }

        /* =========================
           ROW
        ========================= */

        .riwayat-row {
          width: 100%;

          display: grid;

          grid-template-columns:
            minmax(250px, 2fr)
            minmax(180px, 1.4fr)
            minmax(170px, 1.2fr)
            minmax(130px, 1fr);

          align-items: center;

          gap: 20px;

          min-height: 96px;

          padding: 18px 28px;

          background: #ffffff;

          border: 1px solid #eee7f3;
          border-radius: 17px;

          box-sizing: border-box;
        }

        /* =========================
           MAHASISWA
        ========================= */

        .riwayat-mahasiswa {
          display: flex;
          align-items: center;

          gap: 15px;

          min-width: 0;
        }

        .riwayat-avatar {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          background: #f3e2ff;
          color: #b026f3;

          border-radius: 13px;

          font-size: 17px;
          font-weight: 700;
        }

        .riwayat-mahasiswa strong {
          display: block;

          color: #0f172a;

          font-size: 15px;
          font-weight: 600;
        }

        .riwayat-mahasiswa span {
          display: block;

          margin-top: 5px;

          color: #94a3b8;

          font-size: 13px;
        }

        /* =========================
           POSISI
        ========================= */

        .riwayat-posisi strong {
          display: block;

          color: #0f172a;

          font-size: 15px;
          font-weight: 600;
        }

        /* =========================
           PERIODE
        ========================= */

        .riwayat-periode {
          display: flex;
          align-items: center;

          gap: 8px;

          color: #64748b;

          font-size: 14px;
        }

        .riwayat-periode svg {
          flex-shrink: 0;
        }

        /* =========================
           STATUS
        ========================= */

        .riwayat-status {
          display: flex;
          align-items: center;
        }

        .status-magang,
        .status-selesai {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          padding: 8px 14px;

          border-radius: 20px;

          font-size: 12px;
          font-weight: 600;

          white-space: nowrap;
        }

        .status-magang {
          background: #f3e8ff;
          color: #a21caf;
        }

        .status-selesai {
          background: #ecfdf5;
          color: #059669;
        }

        /* =========================
           EMPTY
        ========================= */

        .riwayat-empty {
          padding: 50px 20px;

          text-align: center;

          color: #94a3b8;

          font-size: 14px;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1100px) {

          .riwayat-container {
            overflow-x: auto;
          }

          .riwayat-table-header,
          .riwayat-list {
            min-width: 850px;
          }

        }

        @media (max-width: 900px) {

          .riwayat-summary {
            grid-template-columns: 1fr;
          }

          .riwayat-top {
            align-items: stretch;
            flex-direction: column;
          }

          .riwayat-search {
            width: 100%;
          }

          .riwayat-filter {
            flex-wrap: wrap;
          }

        }

        @media (max-width: 600px) {

          .riwayat-header h1 {
            font-size: 28px;
          }

          .riwayat-container {
            padding: 20px;
          }

          .riwayat-summary-card {
            padding: 22px;
          }

        }

      `}</style>
    </>
  );
};

export default RiwayatMahasiswa;