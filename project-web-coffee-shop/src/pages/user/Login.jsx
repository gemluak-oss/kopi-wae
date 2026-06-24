import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setRole }) => {
  const navigate = useNavigate();

  const [formLogin, setFormLogin] = useState({ email: "", password: "", ingatSaya: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormLogin({ ...formLogin, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan({ tipe: "", teks: "" });
    if (!formLogin.email.trim() || !formLogin.password.trim()) {
      setPesan({ tipe: "error", teks: "Email dan password wajib diisi!" });
      return;
    }
    setLoadingLogin(true);
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email: formLogin.email.trim(),
        password: formLogin.password.trim(),
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setRole(res.data.user.role);
      setPesan({ tipe: "success", teks: "Login berhasil! Mengalihkan..." });
      setTimeout(() => {
        navigate(res.data.user.role === "admin" ? "/admin" : "/home");
      }, 500);
    } catch (err) {
      setPesan({ tipe: "error", teks: err.response?.data?.message || "Gagal login, coba lagi." });
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; }
        .font-body { font-family: 'Roboto', sans-serif; }
        
        @keyframes steam { 0%, 100% { opacity: 0.3; transform: translateY(0) scale(1); } 50% { opacity: 0.6; transform: translateY(-10px) scale(1.05); } }
        
        .animate-steam { animation: steam 3s ease-in-out infinite; }
        .animate-steam-delayed { animation: steam 3s ease-in-out 1s infinite; }
        
        .coffee-pattern {
          background-image: radial-gradient(circle at 20% 50%, rgba(199,122,35,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(199,122,35,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 50% 80%, rgba(199,122,35,0.04) 0%, transparent 50%);
        }
        .dot-pattern {
          background-image: radial-gradient(circle, rgba(199,122,35,0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      <main className="min-h-screen bg-[#E8D8C6] flex items-center justify-center px-4 py-12 font-body relative overflow-hidden">
        {/* Background Coffee Pattern */}
        <div className="absolute inset-0 coffee-pattern pointer-events-none" />

        {/* ================= BACKGROUND DECORATIONS (THEMED COFFEE ELEMENTS) ================= */}
        {/* 1. Biji Kopi Belah - Kiri Atas */}
        <svg className="absolute top-[8%] left-[4%] w-16 h-16 text-[#3A2F2B]/70 -rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12C2,13.5 2.5,15 3.5,16C4.5,17 6,17.5 7.5,17.5C9,17.5 10.5,17 12,16C13.5,17 15,17.5 16.5,17.5C18,17.5 19.5,17 20.5,16C21.5,15 22,13.5 22,12A10,10 0 0,0 12,2M12,4C15.5,4 18.5,6 20,9C18,9.5 16,10 14,11C13,9 12,7 10,7C8,7 7,9 6,11C4,10 2,9.5 4,9C5.5,6 8.5,4 12,4Z" />
        </svg>

        {/* 2. Cangkir Kopi Espresso Mini - Kiri Tengah */}
        <svg className="absolute top-[40%] left-[3%] w-12 h-12 text-[#3A2F2B]/70 rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>

        {/* 3. Sendok Takar Kopi - Kiri Bawah */}
        <svg className="absolute bottom-[10%] left-[5%] w-14 h-14 text-[#3A2F2B]/70 -rotate-[45deg] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 11a5 5 0 1 0-7.07-7.07A5 5 0 0 0 11 11Z" />
          <path d="M9.17 9.17 19.76 19.76a2 2 0 1 1-2.83 2.83L6.34 11.99" />
        </svg>

        {/* 4. Biji Kopi Utuh Lonjong - Kiri Agak Bawah */}
        <svg className="absolute bottom-[30%] left-[10%] w-9 h-6 text-[#3A2F2B]/70 rotate-45 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="10" ry="6" />
        </svg>

        {/* 5. Kepulan Aroma Kopi (Steam Waves) - Kanan Atas */}
        <svg className="absolute top-[6%] right-[12%] w-14 h-14 text-[#3A2F2B]/70 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 20c.5-2.5 2.5-4.5 4.5-4.5s4 2 4 4.5c0 2.5-2 4.5-4.5 4.5S6.5 22.5 6 20Z" transform="rotate(-90 12 12) translate(0, -4)" />
          <path d="M10 14c.5-2 2-3.5 3.5-3.5s3 1.5 3 3.5c0 2-1.5 3.5-3.5 3.5S10.5 16 10 14Z" transform="rotate(-90 12 12) translate(2, 2)" />
        </svg>

        {/* 6. Biji Kopi Belah (Besar) - Kanan Atas Luar */}
        <svg className="absolute top-[18%] right-[4%] w-20 h-20 text-[#3A2F2B]/70 rotate-[35deg] pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12C2,13.5 2.5/15 3.5,16C4.5,17 6,17.5 7.5,17.5C9,17.5 10.5,17 12,16C13.5,17 15,17.5 16.5,17.5C18,17.5 19.5,17 20.5,16C21.5,15 22,13.5 22,12A10,10 0 0,0 12,2M12,4C15.5,4 18.5,6 20,9C18,9.5 16,10 14,11C13,9 12,7 10,7C8,7 7,9 6,11C4,10 2,9.5 4,9C5.5,6 8.5,4 12,4Z" />
        </svg>

        {/* 7. Take-Away Coffee Cup - Kanan Tengah */}
        <svg className="absolute top-[45%] right-[2%] w-12 h-12 text-[#3A2F2B]/70 -rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8l-.93 10.22A2 2 0 0 1 14.08 20H9.92a2 2 0 0 1-1.99-1.78L7 8" />
          <path d="M5 8h14V5H5z" />
          <line x1="9" y1="11" x2="9" y2="17" />
          <line x1="15" y1="11" x2="15" y2="17" />
        </svg>

        {/* 8. Kantong Biji Kopi (Coffee Bag) - Kanan Bawah */}
        <svg className="absolute bottom-[8%] right-[5%] w-16 h-16 text-[#3A2F2B]/70 rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l1 5H5z" />
          <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <circle cx="12" cy="14" r="2" />
        </svg>

        {/* 9. Biji Kopi Utuh Lonjong - Kanan Agak Bawah */}
        <svg className="absolute bottom-[28%] right-[11%] w-11 h-7 text-[#3A2F2B]/70 -rotate-45 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="10" ry="6" />
        </svg>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl shadow-[#C77A23]/20 border border-[#C77A23]/20 relative z-10">
          {/* KIRI - BRANDING */}
          <section className="lg:col-span-5 bg-[#C77A23] p-8 lg:p-10 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Dot Pattern */}
            <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 cursor-pointer hover:bg-white/30 transition-all mb-16" onClick={() => navigate("/home")}>
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-serif font-bold text-[#C77A23] text-lg shadow-lg">K</div>
                <h1 className="text-sm font-body font-bold uppercase tracking-wider">Kopi Wae</h1>
              </div>

              {/* Coffee Cup Illustration */}
              <div className="mb-8 relative">
                <svg className="w-32 h-32 mx-auto opacity-90" viewBox="0 0 120 120" fill="none">
                  {/* Saucer */}
                  <ellipse cx="60" cy="95" rx="45" ry="8" fill="white" opacity="0.2" />
                  {/* Cup body */}
                  <rect x="30" y="40" width="60" height="55" rx="8" fill="white" opacity="0.2" />
                  <rect x="33" y="43" width="54" height="49" rx="6" fill="#3A2F2B" opacity="0.3" />
                  {/* Coffee */}
                  <rect x="33" y="55" width="54" height="37" rx="4" fill="#3A2F2B" opacity="0.5" />
                  {/* Handle */}
                  <path d="M90 55 Q110 55 110 70 Q110 85 90 82" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.2" fill="none" />
                  {/* Steam */}
                  <path className="animate-steam" d="M45 30 Q50 20 45 10" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" fill="none" />
                  <path className="animate-steam-delayed" d="M60 32 Q65 22 60 12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none" />
                  <path className="animate-steam" d="M75 30 Q80 20 75 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" fill="none" />
                </svg>
              </div>

              <h2 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-4 text-center">Selamat Datang Kembali</h2>
              <p className="text-sm font-body font-light leading-relaxed opacity-90 text-center max-w-xs mx-auto">Nikmati secangkir kopi pilihan sambil menjelajahi menu favoritmu.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 relative z-10">
              <p className="text-sm font-body italic mb-3 leading-relaxed opacity-90">"Kopi terbaik bukan hanya soal rasa, tapi juga tentang pengalaman yang nyaman."</p>
              <p className="text-xs font-body font-bold uppercase tracking-wider text-white/70">Kopi Wae Roasters</p>
            </div>
          </section>

          {/* KANAN - FORM */}
          <section className="lg:col-span-7 p-8 lg:p-12 bg-white flex flex-col justify-center">
            <div className="mb-8">
              <span className="inline-block bg-[#C77A23]/10 text-[#C77A23] text-xs font-body font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Welcome Back</span>
              <h2 className="font-serif text-3xl font-bold text-[#3A2F2B]">Login Akun</h2>
              <p className="text-sm text-[#3A2F2B]/50 font-body mt-1">Masukkan email dan password untuk melanjutkan.</p>
            </div>

            {pesan.teks && (
              <div className={`mb-6 rounded-xl p-4 text-sm font-body font-medium ${pesan.tipe === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>{pesan.teks}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-body font-bold uppercase tracking-wider text-[#3A2F2B] mb-2">Alamat Email</label>
                <div className="relative flex items-center">
                  <svg className="absolute left-4 w-4 h-4 text-[#3A2F2B]/20 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formLogin.email}
                    onChange={handleChange}
                    placeholder="contoh: admin@kopiwae.com"
                    className="w-full rounded-xl border border-[#C77A23]/30 bg-white pl-11 pr-4 py-3.5 text-sm font-body outline-none focus:border-[#C77A23] focus:ring-4 focus:ring-[#C77A23]/10 transition-all disabled:opacity-50"
                    disabled={loadingLogin}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-bold uppercase tracking-wider text-[#3A2F2B] mb-2">Kata Sandi</label>
                <div className="relative flex items-center">
                  <svg className="absolute left-4 w-4 h-4 text-[#3A2F2B]/20 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formLogin.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#C77A23]/30 bg-white pl-11 pr-28 py-3.5 text-sm font-body outline-none focus:border-[#C77A23] focus:ring-4 focus:ring-[#C77A23]/10 transition-all disabled:opacity-50"
                    disabled={loadingLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-xs font-body font-bold text-[#C77A23] hover:text-[#3A2F2B] transition-colors select-none focus:outline-none"
                    disabled={loadingLogin}
                  >
                    {showPassword ? "Sembunyi" : "Lihat"}
                  </button>
                </div>
              </div>

              <div className="flex items-center text-xs">
                <label className="flex items-center gap-2 font-body font-medium text-[#3A2F2B] cursor-pointer">
                  <input type="checkbox" name="ingatSaya" checked={formLogin.ingatSaya} onChange={handleChange} className="w-4 h-4 rounded accent-[#C77A23]" disabled={loadingLogin} />
                  Ingat Saya
                </label>
              </div>

              <button
                type="submit"
                disabled={loadingLogin}
                className={`w-full py-4 rounded-xl font-body font-bold text-sm uppercase tracking-wider transition-all ${
                  loadingLogin ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#C77A23] text-white hover:bg-[#3A2F2B] shadow-lg shadow-[#C77A23]/20 hover:shadow-xl"
                }`}
              >
                {loadingLogin ? "Memproses..." : "Masuk Ke Akun"}
              </button>
            </form>

            <p className="text-center text-sm font-body text-[#3A2F2B]/60 mt-8">
              Belum punya akun?{" "}
              <button type="button" onClick={() => navigate("/register")} className="text-[#C77A23] font-bold hover:text-[#3A2F2B] transition-colors">
                Daftar sekarang
              </button>
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Login;
