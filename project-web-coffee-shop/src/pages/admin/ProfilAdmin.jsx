import React, { useState, useEffect } from "react";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime";

export default function ProfilAdmin({ isDark }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ user_name: "", email: "", no_hp: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-800";
  const textBg = isDark ? "bg-slate-800/50" : "bg-slate-50";

  useEffect(() => {
    fetchProfil();
  }, []);

  // ✅ SSE: Auto refresh
  useRealtime("profilUpdate", () => fetchProfil());
  useRealtime("userUpdate", () => fetchProfil());

  const fetchProfil = async () => {
    try {
      const userLogin = JSON.parse(localStorage.getItem("user")) || null;
      const token = localStorage.getItem("token");
      if (!userLogin?.id) return;
      const res = await axios.get(`http://localhost:5000/api/user/profil/${userLogin.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data.data);
      setFormData({ user_name: res.data.data.user_name, email: res.data.data.email, no_hp: res.data.data.no_hp || "" });
      if (res.data.data.foto) setPreview(res.data.data.foto);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify({ ...userLogin, name: res.data.data.user_name, email: res.data.data.email, foto: res.data.data.foto }));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {}
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
      await axios.put(`http://localhost:5000/api/user/profil/${userLogin.id}`, { user_name: formData.user_name, email: formData.email, no_hp: formData.no_hp, foto: fotoUrl }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem("user", JSON.stringify({ ...userLogin, name: formData.user_name, email: formData.email, foto: fotoUrl }));
      window.dispatchEvent(new Event("storage"));
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
      setSelectedFile(null);
      // Ga perlu fetchProfil() karena SSE
    } catch (err) {
      alert("Gagal update profil");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className={`text-sm ${mutedText} mt-1`}>Konfigurasi data diri administrator</p>
      </div>

      <div className={`${cardBg} rounded-2xl border ${border} p-8 shadow-sm`}>
        <div className="flex flex-col items-center mb-8">
          <div className={`w-28 h-28 rounded-full border-2 ${isDark ? "border-slate-600" : "border-slate-200"} flex items-center justify-center overflow-hidden bg-slate-100`}>
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl font-bold text-slate-400">{user.user_name?.charAt(0).toUpperCase()}</span>}
          </div>
          {isEditing && (
            <label className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-medium cursor-pointer hover:bg-emerald-600 transition-all">
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

        <div className="space-y-5">
          {[
            { label: "Nama Lengkap", key: "user_name", type: "text" },
            { label: "Alamat Email", key: "email", type: "email" },
            { label: "Nomor Telepon", key: "no_hp", type: "text" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{f.label}</label>
              {isEditing ? (
                <input
                  type={f.type}
                  value={formData[f.key]}
                  onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                  className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                />
              ) : (
                <div className={`px-3 py-2 rounded-lg border border-transparent text-sm font-medium ${textBg}`}>{user[f.key] || "—"}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex gap-3">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all">
                Simpan
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPreview(user.foto || null);
                }}
                className="px-5 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200 hover:bg-red-100 transition-all"
              >
                Batal
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all">
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
