import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenProduk() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ nama_kopi: "", id_kategori: "", harga_kopi: "", stok: "", stok_minimal: "", gambar: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduk();
    fetchKategori();
  }, []);

  const fetchProduk = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/produk", { headers: { Authorization: `Bearer ${token}` } });
      setProduk(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
      setIsLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/kategori", { headers: { Authorization: `Bearer ${token}` } });
      setKategori(res.data.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setFormData({ nama_kopi: "", id_kategori: "", harga_kopi: "", stok: "", stok_minimal: "", gambar: "" });
    setEditingId(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setFormData({ nama_kopi: item.nama_kopi, id_kategori: item.id_kategori, harga_kopi: item.harga_kopi, stok: item.stok, stok_minimal: item.stok_minimal, gambar: item.gambar || "" });
    setEditingId(item.id_kopi);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/produk/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProduk();
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      alert("Gagal menyimpan produk");
    }
  };

  return (
    <main className="p-4 md:p-8 bg-stone-50 min-h-screen">
      <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold text-stone-800">Manajemen Produk</h1>
        <button onClick={handleAddClick} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium">
          + Tambah Produk
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-100 text-stone-600 text-sm uppercase">
                <th className="p-4">No</th>
                <th className="p-4">Gambar</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {produk.map((item, i) => (
                <tr key={item.id_kopi} className="hover:bg-stone-50">
                  <td className="p-4 text-stone-500">{i + 1}</td>
                  <td className="p-4">
                    <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100"} alt="" className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-4 font-bold text-stone-800">{item.nama_kopi}</td>
                  <td className="p-4 text-sm text-amber-600">{item.nama_kategori}</td>
                  <td className="p-4 font-medium">{formatRupiah(item.harga_kopi)}</td>
                  <td className="p-4">{item.stok}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEditClick(item)} className="text-blue-600">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id_kopi)} className="text-red-600">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Kopi</label>
                <input required name="nama_kopi" value={formData.nama_kopi} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select required name="id_kategori" value={formData.id_kategori} onChange={handleInputChange} className="w-full border rounded-lg p-2">
                  <option value="">Pilih</option>
                  {kategori.map((k) => (
                    <option key={k.id_kategori} value={k.id_kategori}>
                      {k.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input required type="number" name="harga_kopi" value={formData.harga_kopi} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stok</label>
                  <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stok Minimal</label>
                  <input type="number" name="stok_minimal" value={formData.stok_minimal} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Upload Gambar</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full border rounded-lg p-2" />
                {formData.gambar && <img src={formData.gambar} alt="" className="mt-2 w-32 h-32 object-cover rounded" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Gambar</label>
                <input name="gambar" value={formData.gambar} onChange={handleInputChange} placeholder="https://..." className="w-full border rounded-lg p-2" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border rounded-lg">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-600 text-white rounded-lg">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
