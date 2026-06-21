import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilAdmin() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ user_name: "", email: "", no_hp: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const userLogin = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
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

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Profil Saya</h1>
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden mb-4">
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-amber-600">{user.user_name?.charAt(0)}</span>}
          </div>
          {isEditing && (
            <label className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-amber-700">
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
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase">Nama</label>
            {isEditing ? (
              <input type="text" value={formData.user_name} onChange={(e) => setFormData({ ...formData, user_name: e.target.value })} className="w-full border rounded-lg p-2 mt-1" />
            ) : (
              <p className="text-lg font-bold">{user.user_name}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase">Email</label>
            {isEditing ? <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-lg p-2 mt-1" /> : <p className="text-lg">{user.email}</p>}
          </div>
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase">No. HP</label>
            {isEditing ? <input type="text" value={formData.no_hp} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })} className="w-full border rounded-lg p-2 mt-1" /> : <p className="text-lg">{user.no_hp || "-"}</p>}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium">
                Simpan
              </button>
              <button onClick={() => setIsEditing(false)} className="border px-6 py-2 rounded-lg">
                Batal
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-stone-800 text-white px-6 py-2 rounded-lg font-medium">
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
