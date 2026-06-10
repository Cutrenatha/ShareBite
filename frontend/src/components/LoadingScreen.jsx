export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-brand-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🍱</div>
      </div>
      <p className="font-display font-bold text-brand-primary text-lg">ShareBite</p>
    </div>
  );
}
