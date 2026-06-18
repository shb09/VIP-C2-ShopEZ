import { useEffect, useRef, createContext, useContext, useCallback } from 'react';

const MouseContext = createContext(null);

export function MouseProvider({ children }) {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = -300;
    let mouseY = -300;
    let currentX = -300;
    let currentY = -300;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onLeave = () => {
      mouseX = -300;
      mouseY = -300;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;
      glow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const createRipple = useCallback((e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }, []);

  return (
    <MouseContext.Provider value={{ createRipple }}>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      {children}
    </MouseContext.Provider>
  );
}

export function useMouse() {
  const ctx = useContext(MouseContext);
  if (!ctx) throw new Error('useMouse must be used within MouseProvider');
  return ctx;
}

export function RippleButton({ children, onClick, className = '', ...props }) {
  const { createRipple } = useMouse();

  const handleClick = (e) => {
    createRipple(e);
    onClick?.(e);
  };

  return (
    <button
      className={`${className} relative overflow-hidden`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
