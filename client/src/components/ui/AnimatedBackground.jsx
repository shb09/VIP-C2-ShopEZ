import { useEffect, useRef } from 'react';

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getAccentColor() {
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue('--color-accent').trim();
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };

    const starLayers = [
      Array.from({ length: 80 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 0.4 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 0.01 + Math.random() * 0.02,
      })),
      Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.3 + 0.15,
        twinkleSpeed: 0.3 + Math.random() * 1.0,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 0.02 + Math.random() * 0.03,
      })),
      Array.from({ length: 20 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.3 + 0.2,
        twinkleSpeed: 0.2 + Math.random() * 0.8,
        twinklePhase: Math.random() * Math.PI * 2,
        parallax: 0.03 + Math.random() * 0.05,
      })),
    ];

    const nebulaBlobs = Array.from({ length: 3 }, (_, i) => ({
      x: 0.1 + Math.random() * 0.8,
      y: 0.1 + Math.random() * 0.8,
      radius: 0.2 + Math.random() * 0.35,
      dx: (Math.random() - 0.5) * 0.00008,
      dy: (Math.random() - 0.5) * 0.00008,
      opacity: 0.008 + Math.random() * 0.006,
      hue: i * 80,
      pulseSpeed: 0.05 + Math.random() * 0.05,
    }));

    const auroraWaves = Array.from({ length: 2 }, (_, i) => ({
      amplitude: 12 + Math.random() * 20,
      frequency: 0.0003 + Math.random() * 0.0005,
      speed: 0.03 + Math.random() * 0.05,
      phase: i * 2.8,
      yBase: 0.2 + i * 0.3,
      opacity: 0.008 + Math.random() * 0.005,
    }));

    const lightStreaks = Array.from({ length: 2 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.4,
      angle: (Math.random() - 0.5) * 0.3,
      speed: 0.08 + Math.random() * 0.1,
      length: 0.08 + Math.random() * 0.12,
      opacity: 0.004 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
    }));

    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.0003,
      speedY: (Math.random() - 0.5) * 0.0003 - 0.0001,
      opacity: Math.random() * 0.04 + 0.005,
      pulseSpeed: 0.15 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    window.addEventListener('mousemove', onMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      time += 0.002;

      const accent = getAccentColor();

      nebulaBlobs.forEach((blob) => {
        blob.x += blob.dx + (mouseX - 0.5) * 0.00002;
        blob.y += blob.dy + (mouseY - 0.5) * 0.00002;
        if (blob.x < -0.05) blob.x = 1.05;
        if (blob.x > 1.05) blob.x = -0.05;
        if (blob.y < -0.05) blob.y = 1.05;
        if (blob.y > 1.05) blob.y = -0.05;

        const cx = w * blob.x;
        const cy = h * blob.y;
        const r = w * blob.radius;
        const pulse = Math.sin(time * blob.pulseSpeed + blob.hue) * 0.1 + 0.9;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * pulse);
        grad.addColorStop(0, hexToRgba(accent, blob.opacity));
        grad.addColorStop(0.4, hexToRgba(accent, blob.opacity * 0.3));
        grad.addColorStop(0.8, hexToRgba(accent, blob.opacity * 0.05));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      starLayers.forEach((layer, layerIdx) => {
        const parallaxFactor = (layerIdx + 1) * 0.015;
        layer.forEach((star) => {
          const sx = (star.x - 0.5) * w + (mouseX - 0.5) * parallaxFactor * w + w * 0.5;
          const sy = (star.y - 0.5) * h + (mouseY - 0.5) * parallaxFactor * h + h * 0.5;
          if (sx < 0 || sx > w || sy < 0 || sy > h) return;
          const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(accent, star.opacity * twinkle);
          ctx.fill();
        });
      });

      auroraWaves.forEach((wave) => {
        ctx.beginPath();
        const baseY = h * wave.yBase;
        for (let x = 0; x <= w; x += 4) {
          const y = baseY +
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 0.5 + wave.phase + 1.2) * wave.amplitude * 0.15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, h);
        grad.addColorStop(0, hexToRgba(accent, wave.opacity * 0.05));
        grad.addColorStop(0.1, hexToRgba(accent, wave.opacity));
        grad.addColorStop(0.5, hexToRgba(accent, wave.opacity * 0.15));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      });

      lightStreaks.forEach((streak) => {
        const px = streak.x * w + Math.cos(streak.angle) * time * streak.speed * w;
        const py = streak.y * h + Math.sin(streak.angle) * time * streak.speed * h * 0.2;
        const pxMod = ((px % (w + w * streak.length)) + w + w * streak.length) % (w + w * streak.length) - w * streak.length;
        const pyMod = ((py % (h * 0.6)) + h * 0.6) % (h * 0.6);
        if (pxMod < -streak.length * w || pxMod > w) return;

        const grad = ctx.createLinearGradient(pxMod, pyMod, pxMod + streak.length * w, pyMod);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.3, hexToRgba(accent, streak.opacity));
        grad.addColorStop(0.5, hexToRgba(accent, streak.opacity * 1.2));
        grad.addColorStop(0.7, hexToRgba(accent, streak.opacity));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(pxMod - 1, pyMod - 0.5, streak.length * w + 2, 1);
      });

      particles.forEach((p) => {
        p.x += p.speedX + (mouseX - 0.5) * 0.0001;
        p.y += p.speedY + (mouseY - 0.5) * 0.0001;
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        if (p.y > 1.02) { p.y = -0.02; p.x = Math.random(); }
        const pulse = Math.sin(time * p.pulseSpeed + p.phase) * 0.25 + 0.75;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(accent, p.opacity * pulse);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
      <div className="vignette" />
      <div className="noise-overlay" />
    </>
  );
}
