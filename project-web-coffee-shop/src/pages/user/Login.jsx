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
      setPesan({ tipe: "error", teks: "Email dan password wajib diisi." });
      return;
    }

    setLoadingLogin(true);

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email: formLogin.email.trim(),
        password: formLogin.password.trim(),
      });

      // Simpan token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Set role
      setRole(res.data.user.role);

      setPesan({ tipe: "success", teks: "Login berhasil!" });

      // Redirect berdasarkan role
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
        teks: err.response?.data?.message || "Gagal login, coba lagi.",
      });
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200">
        {/* === Bagian Kiri (Gelap) === */}
        <section className="hidden lg:flex flex-col justify-between bg-stone-900 text-white p-10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate("/home")}>
              <div className="w-11 h-11 rounded-full bg-amber-600 flex items-center justify-center font-bold text-xl">K</div>
              <h1 className="text-2xl font-bold tracking-wider">Kopi Wae</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-5">Masuk dan nikmati kopi favoritmu.</h2>
            <p className="text-stone-300 leading-relaxed">Login untuk melanjutkan belanja, melihat keranjang, dan memesan produk kopi pilihan dari Kopi Wae.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm relative z-10 border border-white/10">
            <p className="text-sm text-stone-200 mb-3 italic">"Kopi terbaik bukan hanya soal rasa, tapi juga tentang pengalaman yang nyaman dari memilih sampai menikmati."</p>
            <p className="font-semibold text-amber-500">Kopi Wae Roasters</p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-amber-600/20 blur-2xl"></div>
          <div className="absolute right-20 bottom-28 w-32 h-32 rounded-full bg-stone-500/10 blur-xl"></div>
        </section>

        {/* === Bagian Kanan (Form Login) === */}
        <section className="p-8 md:p-12 bg-white relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate("/home")}>
            <div className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xl">K</div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-wider">Kopi Wae</h1>
          </div>

          <div className="mb-8">
            <p className="text-sm text-amber-600 font-bold tracking-wider uppercase mb-2">Welcome Back</p>
            <h2 className="text-3xl font-bold text-stone-800">Login Akun</h2>
            <p className="text-stone-500 mt-2">Masukkan email dan password untuk melanjutkan.</p>
          </div>

          {pesan.teks && (
            <div className={`mb-5 rounded-xl p-4 text-sm font-semibold transition-all ${pesan.tipe === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{pesan.teks}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold text-stone-800 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formLogin.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all"
                disabled={loadingLogin}
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formLogin.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 pr-24 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all"
                  disabled={loadingLogin}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-amber-600 font-bold hover:text-amber-700" disabled={loadingLogin}>
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input type="checkbox" name="ingatSaya" checked={formLogin.ingatSaya} onChange={handleChange} className="w-4 h-4 accent-amber-600 cursor-pointer" disabled={loadingLogin} />
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition-all ${loadingLogin ? "bg-stone-300 text-stone-500 cursor-not-allowed" : "bg-stone-900 text-white hover:bg-amber-700 shadow-lg hover:shadow-amber-700/30"}`}
            >
              {loadingLogin ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-8">
            Belum punya akun?{" "}
            <button onClick={() => navigate("/register")} className="text-amber-600 font-bold hover:underline">
              Daftar sekarang
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
