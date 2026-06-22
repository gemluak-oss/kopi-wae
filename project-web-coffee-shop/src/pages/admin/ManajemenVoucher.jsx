import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenVoucher({ isDark }) {
  const [voucher, setVoucher] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ kode: "", diskon_persen: "", max_diskon: "", min_belanja: "", kuota: "" });

  // Konfigurasi Variabel Dark Mode & Neo-Brutalism
  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-950 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const inputBg = isDark ? "bg-gray-800 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-800" : "bg-[#EAE8E1]";

  useEffect(() => {
    fetchVoucher();
  }, []);

  const fetchVoucher = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/voucher", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVoucher(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data voucher:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        diskon_persen: Number(form.diskon_persen),
        max_diskon: form.max_diskon ? Number(form.max_diskon) : null,
        min_belanja: form.min_belanja ? Number(form.min_belanja) : 0,
        kuota: form.kuota ? Number(form.kuota) : 0,
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/voucher/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:5000/api/admin/voucher", payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowModal(false);
      setEditingId(null);
      fetchVoucher();
    } catch (err) {
      alert("Gagal menyimpan voucher");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus voucher?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/voucher/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchVoucher();
    } catch (err) {
      alert("Gagal menghapus voucher");
    }
  };

  return (
    <main className={`p-6 min-h-screen font-mono space-y-6 ${bg}`}>
      {/* HEADER SECTION */}
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} flex justify-between items-center`}>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Manajemen Voucher</h1>
          <p className="text-xs font-bold uppercase opacity-60 mt-1">Kelola kode promo dan kuota diskon</p>
        </div>
        <button
          onClick={() => {
            setForm({ kode: "", diskon_persen: "", max_diskon: "", min_belanja: "", kuota: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className={`px-5 py-3 border-3 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}
        >
          + Tambah Voucher
        </button>
      </header>

      {/* DATA TABLE CONTAINER */}
      <div className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase tracking-wider`}>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Kode Kupon</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"} w-32`}>Besar Diskon</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Potongan Maksimal</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>Minimal Belanja</th>
                <th className={`p-4 border-r-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"} w-32`}>Sisa Kuota</th>
                <th className="p-4 text-center w-40">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className={`divide-y-2 ${isDark ? "divide-white/10" : "divide-[#1A1A1A]/10"} text-xs font-bold uppercase`}>
              {voucher.map((v) => (
                <tr key={v.id_voucher} className="hover:bg-current/5 transition-colors">
                  <td className={`p-4 font-black tracking-wider border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>
                    <span className={`px-2 py-1 border-2 ${b} ${isDark ? "bg-amber-950 text-amber-300" : "bg-[#FFFDF6] text-amber-700"} shadow-[2px_2px_0px_0px] ${shadow}`}>{v.kode}</span>
                  </td>
                  <td className={`p-4 font-mono font-black text-sm border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>{v.diskon_persen}%</td>
                  <td className={`p-4 font-mono border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>{v.max_diskon ? `Rp ${v.max_diskon.toLocaleString("id-ID")}` : "—"}</td>
                  <td className={`p-4 font-mono border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"}`}>Rp {v.min_belanja?.toLocaleString("id-ID")}</td>
                  <td className={`p-4 font-mono border-r-2 ${isDark ? "border-white/10" : "border-[#1A1A1A]/10"} font-black`}>{v.kuota}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setForm(v);
                          setEditingId(v.id_voucher);
                          setShowModal(true);
                        }}
                        className={`px-3 py-1.5 border-2 ${b} bg-[#FFC700] text-black font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id_voucher)}
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

      {/* OVERLAY MODAL FORM */}
      {showModal && (
        <div className={`fixed inset-0 ${isDark ? "bg-black/60" : "bg-[#1A1A1A]/40"} flex justify-center items-center z-50 p-4`}>
          <div className={`${cardBg} border-4 ${b} w-full max-w-md shadow-[8px_8px_0px_0px] ${shadow}`}>
            {/* Modal Header */}
            <div className={`p-4 border-b-4 ${b} bg-[#FFC700] text-black flex justify-between items-center`}>
              <h2 className="text-sm font-black uppercase tracking-widest">{editingId ? "Ubah Parameter Voucher" : "Buat Voucher Baru"}</h2>
              <button onClick={() => setShowModal(false)} className={`w-8 h-8 border-2 ${b} bg-white text-black flex items-center justify-center font-black text-lg hover:bg-[#FF6B6B] transition-colors focus:outline-none`}>
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Kode Kupon Promosi</label>
                <input
                  placeholder="Contoh: KOPIASIK"
                  value={form.kode}
                  onChange={(e) => setForm({ ...form, kode: e.target.value })}
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none ${inputBg}`}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Persentase Diskon (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.diskon_persen}
                  onChange={(e) => setForm({ ...form, diskon_persen: e.target.value })}
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg}`}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Maksimal Potongan Harga (Rp)</label>
                <input
                  type="number"
                  placeholder="Kosongkan jika tanpa batas"
                  value={form.max_diskon || ""}
                  onChange={(e) => setForm({ ...form, max_diskon: e.target.value })}
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Minimal Belanja Syarat (Rp)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.min_belanja || ""}
                  onChange={(e) => setForm({ ...form, min_belanja: e.target.value })}
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5">Kuota Pemakaian</label>
                <input
                  type="number"
                  placeholder="Jumlah penggunaan kupon"
                  value={form.kuota || ""}
                  onChange={(e) => setForm({ ...form, kuota: e.target.value })}
                  className={`w-full border-2 ${b} p-2.5 text-xs font-bold focus:outline-none ${inputBg}`}
                />
              </div>

              {/* Modal Actions */}
              <div className={`flex gap-3 pt-4 border-t-2 ${isDark ? "border-white/20" : "border-[#1A1A1A]/20"}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2.5 border-2 ${b} bg-white text-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2.5 border-2 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
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
