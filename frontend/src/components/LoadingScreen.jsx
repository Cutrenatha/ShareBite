import React from "react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
         style={{ background: 'linear-gradient(145deg, #FFFAF6 0%, #FCEEE8 100%)' }}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-brand-light border-t-brand-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🍱</div>
      </div>
      <p className="text-brand-primary font-bold" style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', letterSpacing: '-0.01em', fontSize: '1.5rem' }}>ShareBite</p>
      <p className="text-brand-muted text-xs uppercase tracking-widest" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Memuat...</p>
    </div>
  );
}
