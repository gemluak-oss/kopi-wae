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

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-950 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const inputBg = isDark ? "bg-gray-800 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-800" : "bg-[#EAE8E1]";

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
      console.error("Gagal ambil produk:", err);
      setIsLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/kategori", { headers: { Authorization: `Bearer ${token}` } });
      setKategori(res.data.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
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
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/produk/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProduk();
    } catch (err) {
      alert("Gagal menghapus produk");
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
      const payload = {
        ...formData,
        gambar: gambarUrl,
        harga_kopi: Number(formData.harga_kopi),
        stok: Number(formData.stok),
        stok_minimal: Number(formData.stok_minimal),
      };

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

  if (isLoading) {
    return (
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat Data Produk</div>
      </main>
    );
  }

  return (
    <main className={`p-6 min-h-screen font-mono space-y-6 ${bg}`}>
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Manajemen Produk</h1>
          <p className="text-xs font-bold uppercase opacity-60 mt-1">Kelola daftar menu kopi dan stok</p>
        </div>
        <button
          onClick={handleAddClick}
          className={`px-5 py-3 border-3 ${b} bg-[#00F5D4] text-[#1A1A1A] font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}
        >
          + Tambah Produk
        </button>
      </header>

      <div className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase tracking-wider`}>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"} w-16 text-center`}>No</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"} w-24`}>Gambar</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Nama Menu</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Deskripsi</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Kategori</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Harga</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Stok</th>
                <th className="p-4 text-center w-44">Aksi</th>
              </tr>
            </thead>
            <tbody className={`divide-y-2 ${isDark ? "divide-white/10" : "divide-[#1A1A1A]/10"} text-xs font-bold uppercase`}>
              {produk.map((item, i) => (
                <tr key={item.id_kopi} className="hover:bg-current/5 transition-colors">
                  <td className={`p-4 text-center font-mono font-black opacity-60 border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>{i + 1}</td>
                  <td className={`p-4 border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>
                    <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100"} alt="" className={`w-12 h-12 border-2 ${b} object-cover shadow-[2px_2px_0px_0px] ${shadow}`} />
                  </td>
                  <td className={`p-4 font-black tracking-tight border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>{item.nama_kopi}</td>
                  {/* ✅ Kolom Deskripsi */}
                  <td className={`p-4 border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"} text-[10px] normal-case font-medium opacity-70 max-w-[200px] truncate`}>{item.deskripsi || "-"}</td>
                  <td className={`p-4 border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>
                    <span className={`px-2 py-0.5 border ${b} bg-[#FFC700] text-black text-[10px] font-black tracking-wider`}>{item.nama_kategori}</span>
                  </td>
                  <td className={`p-4 border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"} font-mono`}>{formatRupiah(item.harga_kopi)}</td>
                  <td className={`p-4 border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"} font-mono`}>{item.stok}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className={`px-3 py-1.5 border-2 ${b} bg-[#FFC700] text-black font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_kopi)}
                        className={`px-3 py-1.5 border-2 ${b} bg-[#FF6B6B] text-black font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
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

      {/* MODAL */}
      {isModalOpen && (
        <div className={`fixed inset-0 ${isDark ? "bg-black/60" : "bg-[#1A1A1A]/40"} flex justify-center items-center z-50 p-4 overflow-y-auto`}>
          <div className={`${cardBg} border-4 ${b} w-full max-w-lg shadow-[8px_8px_0px_0px] ${shadow} my-auto`}>
            <div className={`p-4 border-b-4 ${b} bg-[#FFC700] text-black flex justify-between items-center`}>
              <h2 className="text-sm font-black uppercase tracking-widest">{editingId ? "Edit Data Produk" : "Tambah Produk Baru"}</h2>
              <button onClick={() => setIsModalOpen(false)} className={`w-8 h-8 border-2 ${b} bg-white text-black flex items-center justify-center font-black text-lg hover:bg-[#FF6B6B] transition-colors`}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Nama Kopi</label>
                <input required name="nama_kopi" value={formData.nama_kopi} onChange={handleInputChange} className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`} />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  rows="3"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat produk..."
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg} resize-none`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Kategori</label>
                <select name="id_kategori" value={formData.id_kategori} onChange={handleInputChange} className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`}>
                  <option value="">Pilih Kategori</option>
                  {kategori.map((k) => (
                    <option key={k.id_kategori} value={k.id_kategori}>
                      {k.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Harga Produk</label>
                <input required type="number" name="harga_kopi" value={formData.harga_kopi} onChange={handleInputChange} className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Stok Awal</label>
                  <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`} />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Stok Minimal</label>
                  <input type="number" name="stok_minimal" value={formData.stok_minimal} onChange={handleInputChange} className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`} />
                </div>
              </div>

              <div className={`border-2 border-dashed ${isDark ? "border-white/40" : "border-[#1A1A1A]/40"} p-4 ${inputBg} space-y-3`}>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Unggah Gambar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full text-xs font-bold file:mr-4 file:py-1.5 file:px-3 file:border-2 file:border-current file:bg-[#FFC700] file:text-black file:text-[10px] file:font-black file:uppercase file:cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Atau URL Gambar</label>
                  <input name="gambar" value={formData.gambar} onChange={handleInputChange} placeholder="https://..." className={`w-full border-2 ${b} p-2 text-xs font-bold focus:outline-none ${cardBg}`} />
                </div>
                {formData.gambar && (
                  <div className="pt-2">
                    <p className="text-[9px] font-black uppercase opacity-50 mb-1">Pratinjau:</p>
                    <img src={formData.gambar} alt="" className={`w-24 h-24 object-cover border-2 ${b} shadow-[2px_2px_0px_0px] ${shadow}`} />
                  </div>
                )}
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-5 py-2.5 border-2 ${b} bg-white text-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 border-2 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
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
