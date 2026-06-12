import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Utensils } from "lucide-react";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 18% 16%, rgba(255, 165, 92, 0.25) 0%, transparent 28%), radial-gradient(circle at 88% 12%, rgba(255, 111, 32, 0.18) 0%, transparent 26%), radial-gradient(circle at 90% 90%, rgba(255, 190, 120, 0.25) 0%, transparent 30%), linear-gradient(135deg, #FFF7F1 0%, #FFF0E6 45%, #FFE3CE 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 lg:px-14 py-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white shadow-md border border-orange-100 flex items-center justify-center">
            🍱
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#E97D32]">
              ShareBite
            </h1>

            <p className="text-xs uppercase tracking-[0.18em] text-[#7A5C46] font-medium">
              Food Rescue Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm font-semibold text-[#7A4A2D]">
          <Link
            to="/login"
            className="hover:text-[#E8621A] transition"
          >
            Masuk
          </Link>

          <Link
            to="/register"
            className="bg-[#E97D32] text-white px-6 py-3 rounded-full shadow-lg shadow-orange-200/60 hover:bg-[#D96E23] transition"
          >
            Bergabung
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative grid lg:grid-cols-2 min-h-[calc(100vh-96px)] items-center px-8 lg:px-24 pb-10">
        {/* LEFT */}
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E97D32]" />

            <p className="uppercase tracking-[0.18em] text-xs font-bold text-[#E97D32]">
              Selamatkan Makanan, Bantu Sesama
            </p>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black leading-[1.02] text-[#2F3A56] mb-6">
            Berbagi Makanan
            <br />
            Lebih Mudah
            <br />
            Bersama{" "}
            <span className="text-[#E97D32]">
              ShareBite
            </span>
          </h2>

          <p className="text-lg text-[#7A4A2D] max-w-xl leading-relaxed mb-8">
            ShareBite membantu pendonor makanan dan relawan terhubung
            dalam satu platform, agar makanan berlebih bisa tersalurkan
            lebih cepat, rapi, dan tepat sasaran.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/register"
              className="bg-[#E97D32] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-orange-200/70 hover:bg-[#D96E23] transition active:scale-95"
            >
              Bergabung Dengan Kami
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 max-w-xl">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-orange-100 shadow-sm">
              <Utensils
                size={22}
                className="text-[#E8621A] mb-3"
              />
              <p className="text-2xl font-black text-[#2F3A56]">
                150+
              </p>
              <p className="text-xs text-[#7A4A2D]">
                Donasi makanan
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-orange-100 shadow-sm">
              <Users
                size={22}
                className="text-[#E8621A] mb-3"
              />
              <p className="text-2xl font-black text-[#241006]">
                75+
              </p>
              <p className="text-xs text-[#7A4A2D]">
                Relawan aktif
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-orange-100 shadow-sm">
              <Heart
                size={22}
                className="text-[#E8621A] mb-3"
              />
              <p className="text-2xl font-black text-[#241006]">
                500+
              </p>
              <p className="text-xs text-[#7A4A2D]">
                Porsi tersalurkan
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
<div className="relative hidden lg:flex items-center justify-center -mt-24">
  {/* Background Circle */}
  <div className="absolute w-[650px] h-[650px] rounded-full border border-orange-100" />

  <div className="absolute w-[560px] h-[560px] rounded-full bg-[#FFE1C7]" />

  {/* Main Image */}
  <div className="relative z-10">
    <div className="w-[520px] h-[520px] rounded-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-[14px] border-[#FFE1C7]">
      <img
        src="/food_donation.jpeg"
        alt="Food Donation"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</div>
      </section>
    </div>
  );
}
