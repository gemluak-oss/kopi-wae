import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setRole }) => {
  const navigate = useNavigate();

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
    ingatSaya: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormLogin({
      ...formLogin,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan({ tipe: "", teks: "" });

    if (!formLogin.email.trim() || !formLogin.password.trim()) {
      setPesan({ tipe: "error", teks: "EMAIL DAN PASSWORD WAJIB DIISI!" });
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

      setPesan({ tipe: "success", teks: "LOGIN BERHASIL! MENGALIHKAN..." });

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 500);
    } catch (err) {
      setPesan({
        tipe: "error",
        teks: err.response?.data?.message?.toUpperCase() || "GAGAL LOGIN, COBA LAGI.",
      });
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EAE8E1] flex items-center justify-center px-4 py-12 font-mono text-[#1A1A1A]">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 border-4 border-[#1A1A1A] bg-white shadow-[10px_10px_0px_0px_#1A1A1A]">
        {/* === BAGIAN KIRI (HERO BRANDING) === */}
        <section className="lg:col-span-5 bg-[#FFC700] p-8 lg:p-10 border-b-4 lg:border-b-0 lg:border-r-4 border-[#1A1A1A] flex flex-col justify-between space-y-12">
          <div>
            <div
              className="inline-flex items-center gap-3 bg-white border-3 border-[#1A1A1A] px-4 py-2 shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all mb-12"
              onClick={() => navigate("/home")}
            >
              <div className="w-8 h-8 border-2 border-[#1A1A1A] bg-[#00F5D4] flex items-center justify-center font-black text-base">K</div>
              <h1 className="text-sm font-black uppercase tracking-wider">Kopi Wae</h1>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black uppercase leading-none tracking-tight mb-6">Masuk dan nikmati kopi favoritmu.</h2>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80 leading-relaxed">Login untuk melanjutkan belanja, melihat keranjang, dan memesan produk kopi pilihan dari Kopi Wae.</p>
          </div>

          <div className="bg-white border-3 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
            <p className="text-xs font-bold uppercase italic mb-3 leading-relaxed">"Kopi terbaik bukan hanya soal rasa, tapi juga tentang pengalaman yang nyaman dari memilih sampai menikmati."</p>
            <p className="text-xs font-black uppercase tracking-wider text-amber-700">[ Kopi Wae Roasters ]</p>
          </div>
        </section>

        {/* === BAGIAN KANAN (FORM LOGIN) === */}
        <section className="lg:col-span-7 p-8 lg:p-12 bg-[#FFFDF6] flex flex-col justify-center">
          <div className="mb-8">
            <span className="inline-block bg-[#A1A1FF] text-xs font-black uppercase tracking-widest px-2.5 py-1 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] mb-3">Welcome Back</span>
            <h2 className="text-3xl font-black uppercase tracking-tight">Login Akun</h2>
            <p className="text-xs font-bold uppercase opacity-60 mt-1">Masukkan email dan password untuk melanjutkan.</p>
          </div>

          {/* NOTIFIKASI PESAN */}
          {pesan.teks && <div className={`mb-6 border-3 border-[#1A1A1A] p-4 text-xs font-black tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] ${pesan.tipe === "success" ? "bg-[#00F5D4]" : "bg-[#FF6B6B]"}`}>{pesan.teks}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Alamat Email</label>
              <input
                type="email"
                name="email"
                value={formLogin.email}
                onChange={handleChange}
                placeholder="contoh: admin@kopiwae.com"
                /* KELAS uppercase TELAH DIHAPUS DI SINI */
                className="w-full border-4 border-[#1A1A1A] bg-white p-3.5 text-sm font-bold placeholder-[#1A1A1A]/40 outline-none focus:bg-[#FFFDF6] focus:ring-4 focus:ring-[#00F5D4] transition-all disabled:opacity-50"
                disabled={loadingLogin}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Kata Sandi (Password)</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formLogin.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border-4 border-[#1A1A1A] bg-white p-3.5 pr-28 text-sm font-bold outline-none focus:bg-[#FFFDF6] focus:ring-4 focus:ring-[#00F5D4] transition-all disabled:opacity-50"
                  disabled={loadingLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 border-2 border-[#1A1A1A] bg-[#EAE8E1] hover:bg-[#A1A1FF] active:bg-[#00F5D4] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors z-10"
                  disabled={loadingLogin}
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2.5 font-black uppercase tracking-wider cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="ingatSaya"
                  checked={formLogin.ingatSaya}
                  onChange={handleChange}
                  className="w-4 h-4 border-2 border-[#1A1A1A] accent-[#1A1A1A] rounded-none cursor-pointer disabled:opacity-50"
                  disabled={loadingLogin}
                />
                Ingat Saya
              </label>
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className={`w-full py-4 border-3 border-[#1A1A1A] font-black text-xs uppercase tracking-widest transition-all ${
                loadingLogin ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1A1A1A] text-white hover:bg-[#00F5D4] hover:text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              }`}
            >
              {loadingLogin ? "Memproses..." : "Masuk Ke Akun"}
            </button>
          </form>

          <p className="text-center text-xs font-bold uppercase mt-8 tracking-wide">
            Belum punya akun?{" "}
            <button type="button" onClick={() => navigate("/register")} className="text-amber-700 font-black underline hover:text-[#1A1A1A] transition-colors">
              Daftar sekarang
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
