import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilAdmin({ isDark }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ user_name: "", email: "", no_hp: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  // Konfigurasi Variabel Dark Mode & Neo-Brutalism
  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-950 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[4px_4px_0px_0px_#1A1A1A]";
  const shadowCard = isDark ? "shadow-white" : "shadow-[6px_6px_0px_0px_#1A1A1A]";
  const shadowBtn = isDark ? "shadow-white" : "shadow-[3px_3px_0px_0px_#1A1A1A]";
  const inputBg = isDark ? "bg-gray-800 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const textContainerBg = isDark ? "bg-gray-800/60" : "bg-[#EAE8E1]/40";

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const userLogin = JSON.parse(localStorage.getItem("user")) || null;
      const token = localStorage.getItem("token");

      if (!userLogin?.id) return;

      const res = await axios.get(`http://localhost:5000/api/user/profil/${userLogin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
      setFormData({ user_name: res.data.data.user_name, email: res.data.data.email, no_hp: res.data.data.no_hp || "" });
      if (res.data.data.foto) setPreview(res.data.data.foto);
    } catch (err) {
      console.error("Gagal ambil profil:", err);
    }
  };

  const handleSave = async () => {
    try {
      const userLogin = JSON.parse(localStorage.getItem("user")) || null;
      const token = localStorage.getItem("token");

      let fotoUrl = preview;
      if (selectedFile) {
        const formImg = new FormData();
        formImg.append("gambar", selectedFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formImg);
        fotoUrl = uploadRes.data.url;
      }

      await axios.put(
        `http://localhost:5000/api/user/profil/${userLogin.id}`,
        {
          user_name: formData.user_name,
          email: formData.email,
          no_hp: formData.no_hp,
          foto: fotoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedUser = { ...userLogin, name: formData.user_name, email: formData.email, foto: fotoUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("adminUpdated"));

      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
      setSelectedFile(null);
      fetchProfil();
    } catch (err) {
      alert("Gagal update profil");
    }
  };

  if (!user) {
    return (
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-xs uppercase tracking-widest ${shadow}`}>Sinkronisasi Profil</div>
      </main>
    );
  }

  return (
    <main className={`p-6 min-h-screen font-mono flex flex-col items-center justify-center ${bg}`}>
      <div className="w-full max-w-xl space-y-6">
        {/* PAGE TITLE */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-black uppercase tracking-tight">Profil Saya</h1>
          <p className="text-xs font-bold uppercase opacity-60 mt-1">Konfigurasi data diri institusi operator</p>
        </div>

        {/* MAIN PROFILE CARD */}
        <div className={`${cardBg} border-4 ${b} p-6 md:p-8 shadow-[6px_6px_0px_0px] ${shadowCard}`}>
          {/* AVATAR UPLOAD COMPONENT */}
          <div className="flex flex-col items-center mb-8 space-y-4">
            <div className={`w-32 h-32 border-4 ${b} bg-[#FFFDF6] flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px] ${shadow}`}>
              {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <span className={`text-4xl font-black ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>{user.user_name?.charAt(0).toUpperCase()}</span>}
            </div>

            {isEditing && (
              <label
                className={`px-4 py-2 border-2 ${b} bg-[#FFC700] text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px] ${isDark ? "shadow-white" : "shadow-[#1A1A1A]"} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer`}
              >
                Ganti Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-60">Nama Lengkap</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`}
                />
              ) : (
                <div className={`p-2.5 border-2 border-transparent font-black text-sm uppercase ${textContainerBg}`}>{user.user_name}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-60">Alamat Email</label>
              {isEditing ? (
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg}`} />
              ) : (
                <div className={`p-2.5 border-2 border-transparent font-mono text-sm ${textContainerBg}`}>{user.email}</div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-60">Nomor Telepon / Kontak</label>
              {isEditing ? (
                <input type="text" value={formData.no_hp} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })} className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg}`} />
              ) : (
                <div className={`p-2.5 border-2 border-transparent font-mono text-sm ${textContainerBg}`}>{user.no_hp || "—"}</div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className={`mt-8 pt-4 border-t-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"} flex gap-3`}>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className={`px-5 py-2.5 border-2 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px] ${shadowBtn} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPreview(user.foto || null);
                  }}
                  className={`px-5 py-2.5 border-2 ${b} bg-[#FF6B6B] text-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px] ${shadowBtn} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`w-full sm:w-auto px-6 py-3 border-2 ${b} bg-[#A1A1FF] text-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px] ${shadowBtn} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
              >
                Edit Konten Profil
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
