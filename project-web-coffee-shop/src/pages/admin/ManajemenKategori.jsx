import React, { useState, useEffect } from "react";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime";

export default function ManajemenKategori({ isDark }) {
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [namaKategori, setNamaKategori] = useState("");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-800";

  useEffect(() => {
    fetchKategori();
  }, []);

  // ✅ SSE: Auto refresh pas ada perubahan kategori
  useRealtime("kategoriUpdate", () => fetchKategori());

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/kategori", { headers: { Authorization: `Bearer ${token}` } });
      setKategoriList(res.data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setNamaKategori("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setNamaKategori(item.nama_kategori);
    setEditingId(item.id_kategori);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNamaKategori("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaKategori.trim()) return;
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/kategori/${editingId}`, { nama_kategori: namaKategori }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:5000/api/admin/kategori", { nama_kategori: namaKategori }, { headers: { Authorization: `Bearer ${token}` } });
      }
      handleCloseModal();
      // Ga perlu fetchKategori() karena SSE bakal trigger
    } catch (err) {
      alert("Gagal menyimpan kategori");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/kategori/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      // Ga perlu fetchKategori() karena SSE bakal trigger
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  if (isLoading)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Kategori</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Kelola kategori produk kopi</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{kategoriList.length} categories</span>
          <button onClick={handleOpenAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kategori
          </button>
        </div>
      </div>

      <div className={`${cardBg} rounded-xl border ${border} shadow-sm overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Kategori</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kategoriList.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-sm text-slate-400">
                  Belum ada kategori
                </td>
              </tr>
            ) : (
              kategoriList.map((item, index) => (
                <tr key={item.id_kategori} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{item.nama_kategori}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-all">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id_kategori)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 transition-all">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-2xl border ${border} w-full max-w-md shadow-2xl`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Kategori" : "Tambah Kategori"}</h2>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nama Kategori</label>
                <input
                  type="text"
                  value={namaKategori}
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Masukkan nama kategori..."
                  required
                  autoFocus
                  className={`w-full rounded-lg border ${border} ${inputBg} px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`}
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={handleCloseModal} className={`flex-1 py-2.5 rounded-lg border ${border} text-sm font-medium hover:bg-slate-50 transition-all`}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm">
                  {editingId ? "Simpan Perubahan" : "Tambah Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
