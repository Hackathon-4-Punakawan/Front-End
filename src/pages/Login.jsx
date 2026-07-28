import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import { User, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import unikaLogo from '../assets/unika-logo.svg';

const Login = () => {
  const { login, currentUser, getRoleLabel } = useAuth();
  const navigate = useNavigate();

  // Role selections: mahasiswa, dosen, mitra, kaprodi
  const [role, setRole] = useState('mahasiswa');
  const [identityInput, setIdentityInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah login, langsung arahkan ke dashboard yang sesuai
  useEffect(() => {
    if (currentUser) {
      navigate(`/dashboard/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  // Uji coba Akun Demo (Auto-fill)
  const handleAutoFill = () => {
    setError('');
    if (role === 'mahasiswa') {
      setIdentityInput('22.11.4321');
      setPassword('password123');
    } else if (role === 'dosen') {
      setIdentityInput('0412088501');
      setPassword('password123');
    } else if (role === 'mitra') {
      setIdentityInput('hr@google.co.id');
      setPassword('password123');
    } else if (role === 'kaprodi') {
      setIdentityInput('0419077902');
      setPassword('password123');
    }
  };

  // Reset inputs saat ganti peran
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setIdentityInput('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identityInput || !password) {
      setError('Harap isi semua kolom input.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulasi loading 800ms agar terasa seperti request API sungguhan
    setTimeout(() => {
      const result = login(identityInput, password, role);
      setIsLoading(false);
      
      if (result.success) {
        navigate(`/dashboard/${result.user.role}`);
      } else {
        setError(result.message);
      }
    }, 800);
  };

  return (
    <div className="auth-container fade-in">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src={unikaLogo} alt="UNIKA Logo" style={{ height: '56px', width: 'auto' }} />
        </div>
        <h1 className="auth-title" style={{ textAlign: 'center' }} >Selamat Datang di Konversi Amikom</h1>
        <p className="auth-subtitle">Login Menggunakan Akun Amikom</p>

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

        <form onSubmit={handleSubmit}>
          {/* Pilih Peran */}
          <div className="form-group">
            <label className="form-label">PILIH PERAN</label>
            <div className="role-grid">
              <button
                type="button"
                className={`role-button ${role === 'mahasiswa' ? 'active' : ''}`}
                onClick={() => handleRoleChange('mahasiswa')}
              >
                Mahasiswa
              </button>
              <button
                type="button"
                className={`role-button ${role === 'dosen' ? 'active' : ''}`}
                onClick={() => handleRoleChange('dosen')}
              >
                Dosen
              </button>
              <button
                type="button"
                className={`role-button ${role === 'mitra' ? 'active' : ''}`}
                onClick={() => handleRoleChange('mitra')}
              >
                Mitra Industri
              </button>
              <button
                type="button"
                className={`role-button ${role === 'kaprodi' ? 'active' : ''}`}
                onClick={() => handleRoleChange('kaprodi')}
              >
                Admin / Kaprodi
              </button>
            </div>
          </div>

          {/* Email / NIM Input */}
          <Input
            id="identity"
            label={role === 'mahasiswa' ? 'EMAIL / NIM' : role === 'mitra' ? 'EMAIL MITRA / ID' : 'EMAIL / NIDN'}
            placeholder={role === 'mahasiswa' ? 'john.doe@university.edu' : role === 'mitra' ? 'Contoh: email perusahaan atau ID' : 'Contoh: NIDN atau email'}
            type="text"
            icon={User}
            value={identityInput}
            onChange={(e) => setIdentityInput(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* Password Input */}
          <Input
            id="password"
            label={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>PASSWORD</span>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Fitur reset password belum tersedia pada versi demo ini.'); }} style={{ textTransform: 'none', fontWeight: '600', color: 'var(--primary)', letterSpacing: 'normal' }}>Lupa Password?</a>
              </div>
            }
            placeholder="••••••••"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* Quick Demo Autofill Hint */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', marginTop: '-8px' }}>
            <button
              type="button"
              onClick={handleAutoFill}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'underline',
                padding: '4px',
              }}
            >
              Isi Otomatis Akun Demo {getRoleLabel(role)}
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner"></span> Memproses...
              </span>
            ) : (
              <>
                Masuk <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="separator">atau</div>

        {/* SSO Button */}
        <button
          type="button"
          className="btn-sso"
          onClick={() => {
            setError('');
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              // Langsung masuk sebagai Mahasiswa dengan SSO Kampus
              login('22.11.4321', 'password123', 'mahasiswa');
              navigate('/dashboard/mahasiswa');
            }, 1000);
          }}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Masuk dengan SSO Kampus
        </button>

        {/* Footer */}
        <div className="auth-footer">
          Belum memiliki akun? <Link to="/register">Daftar Akun Baru</Link>
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.5px' }}>
        VERSI 2.4.1 MBKM-OBE
      </div>
      
      {/* Spinner animation inline */}
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

export default Login;
