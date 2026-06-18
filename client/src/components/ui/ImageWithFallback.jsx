import { useState } from 'react';

const CATEGORY_DEFAULTS = {
  Mobiles: '/uploads/products/default-mobiles.svg',
  Laptops: '/uploads/products/default-laptops.svg',
  Electronics: '/uploads/products/default-electronics.svg',
  Fashion: '/uploads/products/default-fashion.svg',
  Accessories: '/uploads/products/default-accessories.svg',
  Home: '/uploads/products/default-home.svg',
  Sports: '/uploads/products/default-sports.svg',
};

function isInvalid(src) {
  if (!src) return true;
  if (src.startsWith('data:')) return true;
  if (src.startsWith('http://') || src.startsWith('https://')) return true;
  if (src.startsWith('file://')) return true;
  if (src.includes('C:\\') || src.includes('D:\\')) return true;
  return false;
}

function getFallback(category) {
  return CATEGORY_DEFAULTS[category] || '/uploads/products/default-mobiles.svg';
}

export default function ImageWithFallback({ src, alt, className = '', category = '', ...props }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const getSrc = () => {
    if (fallbackLevel === 2) return getFallback(category);
    if (fallbackLevel === 1) return getFallback(category);
    if (isInvalid(src)) return getFallback(category);
    return src;
  };

  const currentSrc = getSrc();

  const handleError = () => {
    if (fallbackLevel < 2) {
      setFallbackLevel(fallbackLevel + 1);
      setLoaded(false);
    } else {
      setError(true);
    }
  };

  if (error) {
    return (
      <div className={`bg-[var(--color-surface)] flex items-center justify-center ${className}`} style={{ background: 'linear-gradient(135deg, var(--color-card) 0%, var(--color-surface) 100%)' }} {...props}>
        <span className="text-[10px] text-[var(--color-text-secondary)] opacity-50">{category || 'Product'}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
