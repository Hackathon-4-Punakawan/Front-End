import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import { User, Lock, Mail, CreditCard, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('mahasiswa');
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah login, langsung arahkan ke dashboard
  useEffect(() => {
    if (currentUser) {
      navigate(`/dashboard/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !identity || !email || !password) {
      setError('Harap isi semua kolom input.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await register(name, identity, email, password, role);
      setIsLoading(false);

      if (result.success) {
        setSuccess('Pendaftaran berhasil! Mengarahkan Anda ke Dashboard...');
        setTimeout(() => {
          navigate(`/dashboard/${result.user?.role || 'mahasiswa'}`);
        }, 1200);
      } else {
        setError(result.message || 'Registrasi gagal.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Terjadi kesalahan pada server saat pendaftaran.');
    }
  };

  return (
    <div className="auth-container fade-in">
      <Card>
        <h1 className="auth-title">Daftar Akun Baru (Mahasiswa)</h1>
        <p className="auth-subtitle">Buat akun mahasiswa mandiri untuk mulai pengajuan MBKM Konversi Amikom.</p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'left'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#047857',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'left'
          }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <Input
            id="name"
            label="NAMA LENGKAP"
            placeholder="Contoh: Rizky Ramadhan"
            type="text"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* NIM / NIDN / ID */}
          <Input
            id="identity"
            label="NIM (NOMOR INDUK MAHASISWA)"
            placeholder="Contoh: 21.11.4005"
            type="text"
            icon={CreditCard}
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* Email */}
          <Input
            id="email"
            label="ALAMAT EMAIL STUDENT"
            placeholder="Contoh: rizky.ramadhan@students.amikom.ac.id"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* Password */}
          <Input
            id="password"
            label="BUAT PASSWORD"
            placeholder="Masukkan minimal 6 karakter"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* Submit Button */}
          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }} disabled={isLoading}>
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner"></span> Mendaftarkan ke API...
              </span>
            ) : (
              <>
                Daftar Akun Baru <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Sudah memiliki akun? <Link to="/login">Masuk Sekarang</Link>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.5px' }}>
        VERSI 2.4.1 MBKM-OBE
      </div>

      <style>{`
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
