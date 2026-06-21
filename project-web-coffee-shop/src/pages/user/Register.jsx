import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    no_hp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan({ tipe: "", teks: "" });

    if (!formData.user_name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setPesan({ tipe: "error", teks: "Nama, email, dan password wajib diisi." });
      return;
    }

    setLoadingRegister(true);

    try {
      await axios.post("http://localhost:5000/api/user/register", formData);
      setPesan({ tipe: "success", teks: "Registrasi berhasil! Silakan login." });
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setPesan({ tipe: "error", teks: err.response?.data?.message || "Gagal mendaftar" });
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-stone-200">
        <div className="bg-stone-900 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-stone-500/20 rounded-full blur-xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-2xl mb-4 shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/home")}>
              ☕
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Buat Akun</h2>
            <p className="text-stone-400 mt-2 text-sm leading-relaxed">Daftar untuk menyimpan menu favorit dan nikmati layanan dari Kopi Wae.</p>
          </div>
        </div>

        <div className="p-8">
          {pesan.teks && (
            <div className={`mb-6 rounded-xl p-4 text-sm font-semibold text-center transition-all ${pesan.tipe === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {pesan.teks}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="cth: Jonathan Doe"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all text-sm"
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="cth: coffee@email.com"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all text-sm"
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Buat password yang kuat"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 pr-20 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all text-sm"
                  disabled={loadingRegister}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-amber-600 font-bold hover:text-amber-700" disabled={loadingRegister}>
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">No. HP (Opsional)</label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                placeholder="cth: 08123456789"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all text-sm"
                disabled={loadingRegister}
              />
            </div>

            <button
              type="submit"
              disabled={loadingRegister}
              className={`w-full mt-2 py-3.5 rounded-xl font-bold tracking-wide transition-all text-sm ${loadingRegister ? "bg-stone-300 text-stone-500 cursor-not-allowed" : "bg-stone-900 text-white hover:bg-amber-700 shadow-lg hover:shadow-amber-700/30"}`}
            >
              {loadingRegister ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Sudah punya akun?{" "}
            <button onClick={() => navigate("/login")} className="text-amber-600 font-bold hover:underline">
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
