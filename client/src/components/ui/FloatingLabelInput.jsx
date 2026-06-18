import { useState } from 'react';

export default function FloatingLabelInput({ label, id, type = 'text', value, onChange, error, className = '', ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className={`relative rounded-2xl transition-all duration-300 ${focused ? 'shadow-[0_0_0_3px_var(--glow-color),0_0_24px_var(--glow-color)]' : ''}`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`input-glass ${error ? '!border-[var(--color-error)]' : ''}`}
          placeholder=" "
          {...props}
        />
        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
          focused ? 'opacity-100' : 'opacity-0'
        }`}
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: focused ? 'liquidSweep 3s ease-in-out infinite' : 'none',
          }}
        />
      </div>
      <label
        htmlFor={id}
        className={`absolute left-5 transition-all duration-200 pointer-events-none ${
          focused || hasValue
            ? 'top-3 text-[10px] font-medium text-[var(--color-accent)]'
            : 'top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-secondary)]'
        }`}
      >
        {label}
      </label>
      {error && <p className="text-xs text-[var(--color-error)] mt-1.5 ml-1">{error}</p>}
    </div>
  );
}
