import React, { useState, useEffect } from "react";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime";

export default function ManajemenVoucher({ isDark }) {
  const [voucher, setVoucher] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ kode: "", diskon_persen: "", max_diskon: "", min_belanja: "", kuota: "", max_usage_per_user: 1 });

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-800";

  useEffect(() => {
    fetchVoucher();
  }, []);

  // ✅ SSE: Auto refresh
  useRealtime("voucherUpdate", () => fetchVoucher());

  const fetchVoucher = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/voucher", { headers: { Authorization: `Bearer ${token}` } });
      setVoucher(res.data.data);
    } catch (err) {}
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
        max_usage_per_user: Number(form.max_usage_per_user) || 1,
      };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/voucher/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:5000/api/admin/voucher", payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowModal(false);
      setEditingId(null);
      // Ga perlu fetchVoucher() karena SSE
    } catch (err) {
      alert("Gagal menyimpan voucher");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus voucher?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/voucher/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      // Ga perlu fetchVoucher() karena SSE
    } catch (err) {
      alert("Gagal menghapus voucher");
    }
  };

  const formatRp = (num) => {
    if (!num && num !== 0) return "—";
    return "Rp " + Number(num).toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Voucher</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Kelola kode promo dan kuota diskon</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{voucher.length} vouchers</span>
          <button
            onClick={() => {
              setForm({ kode: "", diskon_persen: "", max_diskon: "", min_belanja: "", kuota: "", max_usage_per_user: 1 });
              setEditingId(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Voucher
          </button>
        </div>
      </div>

      <div className={`${cardBg} rounded-xl border ${border} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Kode</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-16">Diskon</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Max Potongan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Min Belanja</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-16">Kuota</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-20">Limit/User</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-16">Used</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {voucher.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada voucher
                  </td>
                </tr>
              ) : (
                voucher.map((v) => (
                  <tr key={v.id_voucher} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">{v.kode}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold">{v.diskon_persen}%</td>
                    <td className="px-4 py-3 text-sm">{formatRp(v.max_diskon)}</td>
                    <td className="px-4 py-3 text-sm">{formatRp(v.min_belanja)}</td>
                    <td className="px-4 py-3 text-center text-sm font-semibold">{v.kuota}</td>
                    <td className="px-4 py-3 text-center text-sm font-semibold text-blue-600">{v.max_usage_per_user || 1}x</td>
                    <td className="px-4 py-3 text-center text-sm">{v.total_digunakan || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setForm({ kode: v.kode, diskon_persen: v.diskon_persen, max_diskon: v.max_diskon || "", min_belanja: v.min_belanja || "", kuota: v.kuota, max_usage_per_user: v.max_usage_per_user || 1 });
                            setEditingId(v.id_voucher);
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-all"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(v.id_voucher)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 transition-all">
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-2xl border ${border} w-full max-w-md shadow-2xl`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Voucher" : "Tambah Voucher"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Kode Kupon</label>
                <input
                  placeholder="KOPIASIK"
                  value={form.kode}
                  onChange={(e) => setForm({ ...form, kode: e.target.value })}
                  required
                  className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm font-bold uppercase focus:ring-2 focus:ring-emerald-500 outline-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Diskon (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.diskon_persen}
                  onChange={(e) => setForm({ ...form, diskon_persen: e.target.value })}
                  required
                  className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Max Potongan (Rp)</label>
                  <input
                    type="number"
                    placeholder="Opsional"
                    value={form.max_diskon || ""}
                    onChange={(e) => setForm({ ...form, max_diskon: e.target.value })}
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Min Belanja (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.min_belanja || ""}
                    onChange={(e) => setForm({ ...form, min_belanja: e.target.value })}
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Kuota</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={form.kuota || ""}
                    onChange={(e) => setForm({ ...form, kuota: e.target.value })}
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Limit per User</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={form.max_usage_per_user || 1}
                    onChange={(e) => setForm({ ...form, max_usage_per_user: e.target.value })}
                    min="1"
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Max pemakaian per user</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-lg border ${border} text-sm font-medium hover:bg-slate-50 transition-all`}>
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
