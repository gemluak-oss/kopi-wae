import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenPesanan({ isDark }) {
  const [pesanan, setPesanan] = useState([]);
  const [allPesanan, setAllPesanan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const token = localStorage.getItem("token");

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  useEffect(() => {
    fetchPesanan();
  }, []);

  useEffect(() => {
    if (filterStatus === "semua") setPesanan(allPesanan);
    else setPesanan(allPesanan.filter((o) => o.status_pesanan === filterStatus));
  }, [filterStatus, allPesanan]);

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pesanan", { headers: { Authorization: `Bearer ${token}` } });
      setAllPesanan(res.data.data);
      setPesanan(res.data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/pesanan/${id}`, { status_pesanan: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchPesanan();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  const getStatusStyle = (status) => {
    const styles = {
      menunggu: "bg-amber-100 text-amber-700 border-amber-200",
      diproses: "bg-blue-100 text-blue-700 border-blue-200",
      dikirim: "bg-purple-100 text-purple-700 border-purple-200",
      selesai: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dibatalkan: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const totalPesanan = allPesanan.length;
  const pesananBaru = allPesanan.filter((o) => o.status_pesanan === "menunggu").length;
  const pesananDiproses = allPesanan.filter((o) => o.status_pesanan === "diproses" || o.status_pesanan === "dikirim").length;
  const pesananSelesai = allPesanan.filter((o) => o.status_pesanan === "selesai").length;
  const totalPendapatan = allPesanan.filter((o) => o.status_pesanan === "selesai").reduce((sum, o) => sum + Number(o.total_harga), 0);

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
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pesanan</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Kelola dan update status pesanan</p>
        </div>
        <button onClick={fetchPesanan} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Orders", value: totalPesanan, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-slate-600" },
          { label: "Pending", value: pesananBaru, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-amber-500" },
          { label: "Processing", value: pesananDiproses, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-blue-500" },
          { label: "Completed", value: pesananSelesai, icon: "M5 13l4 4L19 7", color: "text-emerald-500" },
          {
            label: "Revenue",
            value: formatRupiah(totalPendapatan),
            icon: "M12 6v12m-3-2.818l.251.11a3.375 3.375 0 004.496-2.355c.192-.94-.467-1.894-1.423-2.08l-2.241-.437c-.956-.187-1.615-1.14-1.423-2.08a3.375 3.375 0 014.496-2.355l.25.11",
            color: "text-emerald-600",
            isCurrency: true,
          },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-xl border ${border} p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</span>
              <svg className={`w-4 h-4 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} />
              </svg>
            </div>
            <p className={`text-xl font-bold ${s.isCurrency ? "text-sm" : ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {["semua", "menunggu", "diproses", "dikirim", "selesai", "dibatalkan"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === s ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {s} ({s === "semua" ? totalPesanan : allPesanan.filter((o) => o.status_pesanan === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`${cardBg} rounded-xl border ${border} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Pelanggan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Metode</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pesanan.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                    Tidak ada pesanan
                  </td>
                </tr>
              ) : (
                pesanan.map((item) => (
                  <tr key={item.id_transaksi} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-bold">#{item.id_transaksi}</td>
                    <td className="px-4 py-3 text-sm font-medium">{item.pelanggan}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{new Date(item.tgl_transaksi).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">{formatRupiah(item.total_harga)}</td>
                    <td className="px-4 py-3 text-sm">{item.metode_pembayaran || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <select value={item.status_pesanan} onChange={(e) => updateStatus(item.id_transaksi, e.target.value)} className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer ${getStatusStyle(item.status_pesanan)}`}>
                        <option value="menunggu">Menunggu</option>
                        <option value="diproses">Diproses</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.status_pesanan !== "selesai" && item.status_pesanan !== "dibatalkan" ? (
                        <button onClick={() => updateStatus(item.id_transaksi, "selesai")} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 transition-all">
                          Selesai
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
