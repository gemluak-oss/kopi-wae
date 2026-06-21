import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [namaKategori, setNamaKategori] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/kategori", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKategoriList(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaKategori.trim()) return;
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/admin/kategori/${editingId}`,
          { nama_kategori: namaKategori },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/admin/kategori",
          { nama_kategori: namaKategori },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/kategori/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKategori();
    } catch (err) {
      alert("Gagal menghapus kategori");
    }
  };

  const handleCancelEdit = () => {
    setNamaKategori("");
    setEditingId(null);
  };

  if (isLoading)
    return (
      <main className="p-4 md:p-8 bg-stone-50 min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );

  return (
    <main className="p-4 md:p-8 bg-stone-50 min-h-screen">
      <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-100">
        <h1 className="text-2xl font-bold text-stone-800">Manajemen Kategori</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h2 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">{editingId ? "Edit Kategori" : "Tambah Kategori Baru"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={namaKategori}
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Masukkan nama kategori..."
                  required
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium">
                  {editingId ? "Simpan Perubahan" : "Tambah Kategori"}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="bg-stone-200 hover:bg-stone-300 text-stone-700 py-2 px-4 rounded-lg font-medium">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-100 text-stone-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-semibold w-16">No</th>
                  <th className="p-4 font-semibold">Nama Kategori</th>
                  <th className="p-4 font-semibold text-center w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {kategoriList.map((item, index) => (
                  <tr key={item.id_kategori} className="hover:bg-stone-50">
                    <td className="p-4 text-stone-500">{index + 1}</td>
                    <td className="p-4 font-bold text-stone-800">{item.nama_kategori}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800 font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id_kategori)} className="text-red-600 hover:text-red-800 font-medium">
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
