import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenKategori({ isDark }) {
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [namaKategori, setNamaKategori] = useState("");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-[#EAE8E1]";
  const inputBg = isDark ? "bg-gray-700" : "bg-[#FFFDF6]";

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/kategori", { headers: { Authorization: `Bearer ${token}` } });
      setKategoriList(res.data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
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
      setNamaKategori("");
      setEditingId(null);
      fetchKategori();
    } catch (err) {
      alert("Gagal menyimpan kategori");
    }
  };

  const handleEditClick = (item) => {
    setNamaKategori(item.nama_kategori);
    setEditingId(item.id_kategori);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/kategori/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchKategori();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };
  const handleCancelEdit = () => {
    setNamaKategori("");
    setEditingId(null);
  };

  if (isLoading)
    return (
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat Kategori...</div>
      </main>
    );

  return (
    <main className={`p-6 min-h-screen font-mono space-y-6 ${bg}`}>
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
        <h1 className="text-2xl font-black uppercase">Manajemen Kategori</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`md:col-span-1 ${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
          <h2 className="text-xs font-black uppercase tracking-widest mb-6 pb-2 border-b-4 border-dashed">{editingId ? "Edit Kategori" : "Kategori Baru"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              placeholder="Nama kategori..."
              required
              className={`w-full border-3 ${b} p-3 text-xs font-bold uppercase ${inputBg} shadow-[2px_2px_0px_0px] ${shadow} focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 transition-all`}
            />
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className={`w-full py-3 border-3 ${b} font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${editingId ? "bg-[#FFC700] text-black" : "bg-[#00F5D4] text-black"}`}
              >
                {editingId ? "Simpan" : "Tambah"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`w-full py-2.5 border-3 ${b} ${cardBg} font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={`md:col-span-2 ${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase`}>
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="p-4">Nama Kategori</th>
                  <th className="p-4 text-center w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-current/10 text-xs font-bold uppercase">
                {kategoriList.map((item, index) => (
                  <tr key={item.id_kategori} className="hover:bg-black/5 transition-colors">
                    <td className="p-4 text-center opacity-60">{index + 1}</td>
                    <td className="p-4 font-black">{item.nama_kategori}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className={`px-3 py-1.5 border-2 ${b} bg-[#FFC700] text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_kategori)}
                          className={`px-3 py-1.5 border-2 ${b} bg-red-400 text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
