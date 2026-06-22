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
      setPesan({ tipe: "error", teks: "NAMA, EMAIL, DAN PASSWORD WAJIB DIISI!" });
      return;
    }

    setLoadingRegister(true);

    try {
      await axios.post("http://localhost:5000/api/user/register", formData);
      setPesan({ tipe: "success", teks: "REGISTRASI BERHASIL! SILAKAN LOGIN." });
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setPesan({
        tipe: "error",
        teks: err.response?.data?.message?.toUpperCase() || "GAGAL MENDAFTAR",
      });
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EAE8E1] flex items-center justify-center px-4 py-12 font-mono text-[#1A1A1A]">
      <div className="w-full max-w-lg border-4 border-[#1A1A1A] bg-[#FFFDF6] shadow-[10px_10px_0px_0px_#1A1A1A]">
        {/* === HEADER BRANDING === */}
        <div className="bg-[#FFC700] p-6 text-center border-b-4 border-[#1A1A1A] relative">
          <div className="flex flex-col items-center">
            <div
              className="w-12 h-12 border-3 border-[#1A1A1A] bg-[#00F5D4] text-black flex items-center justify-center font-black text-xl mb-3 shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              onClick={() => navigate("/home")}
            >
              ☕
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Buat Akun</h2>
            <p className="text-xs font-bold uppercase opacity-80 mt-1 max-w-sm leading-relaxed">Daftar untuk menyimpan menu favorit dan nikmati layanan dari Kopi Wae.</p>
          </div>
        </div>

        {/* === FORM CONTAINER === */}
        <div className="p-6 md:p-8">
          {/* NOTIFIKASI PESAN */}
          {pesan.teks && <div className={`mb-6 border-3 border-[#1A1A1A] p-4 text-xs font-black text-center tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] ${pesan.tipe === "success" ? "bg-[#00F5D4]" : "bg-[#FF6B6B]"}`}>{pesan.teks}</div>}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="cth: Jonathan Doe"
                className="w-full border-4 border-[#1A1A1A] bg-white p-3.5 text-sm font-bold placeholder-[#1A1A1A]/40 outline-none focus:bg-[#FFFDF6] focus:ring-4 focus:ring-[#00F5D4] transition-all disabled:opacity-50"
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Alamat Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="cth: coffee@email.com"
                className="w-full border-4 border-[#1A1A1A] bg-white p-3.5 text-sm font-bold placeholder-[#1A1A1A]/40 outline-none focus:bg-[#FFFDF6] focus:ring-4 focus:ring-[#00F5D4] transition-all disabled:opacity-50"
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Kata Sandi (Password)</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Buat password yang kuat"
                  className="w-full border-4 border-[#1A1A1A] bg-white p-3.5 pr-28 text-sm font-bold placeholder-[#1A1A1A]/40 outline-none focus:bg-[#FFFDF6] focus:ring-4 focus:ring-[#00F5D4] transition-all disabled:opacity-50"
                  disabled={loadingRegister}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 border-2 border-[#1A1A1A] bg-[#EAE8E1] hover:bg-[#A1A1FF] active:bg-[#00F5D4] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors z-10"
                  disabled={loadingRegister}
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">No. HP (Opsional)</label>
              <input
                type="text"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                placeholder="cth: 08123456789"
                className="w-full border-4 border-[#1A1A1A] bg-white p-3.5 text-sm font-bold placeholder-[#1A1A1A]/40 outline-none focus:bg-[#FFFDF6] focus:ring-4 focus:ring-[#00F5D4] transition-all disabled:opacity-50"
                disabled={loadingRegister}
              />
            </div>

            <button
              type="submit"
              disabled={loadingRegister}
              className={`w-full py-4 border-3 border-[#1A1A1A] font-black text-xs uppercase tracking-widest transition-all ${
                loadingRegister ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1A1A1A] text-white hover:bg-[#00F5D4] hover:text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              }`}
            >
              {loadingRegister ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-xs font-bold uppercase mt-6 tracking-wide">
            Sudah punya akun?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-amber-700 font-black underline hover:text-[#1A1A1A] transition-colors">
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
