import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  icon: Icon,
  placeholder,
  value,
  onChange,
  id,
  required = false,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon">
            <Icon size={20} />
          </span>
        )}
        <input
          id={id}
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`input-field ${Icon ? 'with-icon' : ''} ${isPassword ? 'input-field-password' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={handleTogglePassword}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default Input;
