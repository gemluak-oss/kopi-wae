import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenProduk({ isDark }) {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    nama_kopi: "",
    id_kategori: "",
    deskripsi: "",
    harga_kopi: "",
    stok: "",
    stok_minimal: "",
    gambar: "",
  });

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-800";

  useEffect(() => {
    fetchProduk();
    fetchKategori();
  }, []);

  const fetchProduk = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/produk", { headers: { Authorization: `Bearer ${token}` } });
      setProduk(res.data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/kategori", { headers: { Authorization: `Bearer ${token}` } });
      setKategori(res.data.data);
    } catch (err) {}
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setFormData({ nama_kopi: "", id_kategori: "", deskripsi: "", harga_kopi: "", stok: "", stok_minimal: "", gambar: "" });
    setEditingId(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setFormData({
      nama_kopi: item.nama_kopi,
      id_kategori: item.id_kategori,
      deskripsi: item.deskripsi || "",
      harga_kopi: item.harga_kopi,
      stok: item.stok,
      stok_minimal: item.stok_minimal,
      gambar: item.gambar || "",
    });
    setEditingId(item.id_kopi);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/produk/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProduk();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let gambarUrl = formData.gambar;
      if (selectedFile) {
        const formImg = new FormData();
        formImg.append("gambar", selectedFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formImg);
        gambarUrl = uploadRes.data.url;
      }
      const payload = { ...formData, gambar: gambarUrl, harga_kopi: Number(formData.harga_kopi), stok: Number(formData.stok), stok_minimal: Number(formData.stok_minimal) };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/produk/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:5000/api/admin/produk", payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setIsModalOpen(false);
      setSelectedFile(null);
      fetchProduk();
    } catch (err) {
      alert("Gagal menyimpan");
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Produk</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Kelola daftar menu kopi dan stok</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{produk.length} products</span>
          <button onClick={handleAddClick} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`${cardBg} rounded-xl border ${border} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-16 text-center">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-20">Gambar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Harga</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stok</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produk.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                produk.map((item, i) => (
                  <tr key={item.id_kopi} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-400 text-center">{i + 1}</td>
                    <td className="px-4 py-3">
                      <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100"} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span>{item.nama_kopi}</span>
                      {item.deskripsi && <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{item.deskripsi}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">{item.nama_kategori}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{formatRupiah(item.harga_kopi)}</td>
                    <td className="px-4 py-3 text-sm">{item.stok}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEditClick(item)} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id_kopi)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 transition-all">
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
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-2xl border ${border} w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Nama Kopi</label>
                <input
                  required
                  name="nama_kopi"
                  value={formData.nama_kopi}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  rows="2"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat..."
                  className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Kategori</label>
                <select name="id_kategori" value={formData.id_kategori} onChange={handleInputChange} className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}>
                  <option value="">Pilih Kategori</option>
                  {kategori.map((k) => (
                    <option key={k.id_kategori} value={k.id_kategori}>
                      {k.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Harga</label>
                  <input
                    required
                    type="number"
                    name="harga_kopi"
                    value={formData.harga_kopi}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Stok</label>
                  <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Min Stok</label>
                  <input
                    type="number"
                    name="stok_minimal"
                    value={formData.stok_minimal}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                </div>
              </div>
              <div className="border border-dashed border-slate-300 rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Upload Gambar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-medium file:cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Atau URL Gambar</label>
                  <input name="gambar" value={formData.gambar} onChange={handleInputChange} placeholder="https://..." className={`w-full rounded-lg border ${border} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`} />
                </div>
                {formData.gambar && <img src={formData.gambar} alt="" className="w-20 h-20 rounded-lg object-cover border" />}
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 py-2.5 rounded-lg border ${border} text-sm font-medium hover:bg-slate-50 transition-all`}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
