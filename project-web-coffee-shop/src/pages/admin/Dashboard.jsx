import React, { useState, useEffect } from "react";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime";

export default function Dashboard({ isDark }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  useEffect(() => {
    fetchDashboard();
  }, []);

  useRealtime("pesananBaru", () => fetchDashboard());
  useRealtime("produkUpdate", () => fetchDashboard());
  useRealtime("pesananUpdate", () => fetchDashboard());
  useRealtime("statusUpdate", () => fetchDashboard());
  useRealtime("userUpdate", () => fetchDashboard());
  useRealtime("profilUpdate", () => fetchDashboard());
  useRealtime("voucherUpdate", () => fetchDashboard());
  useRealtime("kategoriUpdate", () => fetchDashboard());

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = res.data;
      setStats({
        pendapatan: d.pendapatan,
        pesanan_baru: d.pesanan_baru,
        total_produk: d.total_produk,
        pesanan_terbaru: [...(d.pesanan_terbaru || [])],
        top_kopi: [...(d.top_kopi || [])],
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka || 0);

  const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

  const getStatusBadge = (status) => {
    const s = {
      selesai: "bg-emerald-100 text-emerald-700 border-emerald-300",
      diproses: "bg-amber-100 text-amber-700 border-amber-300",
      dikirim: "bg-blue-100 text-blue-700 border-blue-300",
      menunggu: "bg-red-100 text-red-700 border-red-300",
    };
    return s[status] || "bg-slate-100 text-slate-700 border-slate-300";
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Ringkasan performa bisnis Kopi Wae</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium uppercase tracking-wider ${mutedText}`}>Total Pendapatan</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v12m-3-2.818l.251.11a3.375 3.375 0 004.496-2.355c.192-.94-.467-1.894-1.423-2.08l-2.241-.437c-.956-.187-1.615-1.14-1.423-2.08a3.375 3.375 0 014.496-2.355l.25.11"
                />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold">{formatRupiah(stats?.pendapatan)}</p>
          <p className="text-xs mt-2 text-emerald-500">Revenue</p>
        </div>
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium uppercase tracking-wider ${mutedText}`}>Total Produk</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold">{formatNumber(stats?.total_produk)}</p>
          <p className={`text-xs mt-2 ${mutedText}`}>Active products</p>
        </div>
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium uppercase tracking-wider ${mutedText}`}>Pesanan Masuk</span>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold">{formatNumber(stats?.pesanan_baru)}</p>
          <p className={`text-xs mt-2 ${mutedText}`}>Total orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <h2 className="text-sm font-semibold mb-6">Top Produk Terlaris</h2>
          <div className="space-y-3">
            {stats?.top_kopi?.length > 0 ? (
              stats.top_kopi.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                    <span className="text-sm font-medium">{item.nama_kopi}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{item.total_terjual} sold</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada data penjualan</p>
            )}
          </div>
        </div>
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <h2 className="text-sm font-semibold mb-6">Transaksi Terbaru</h2>
          <div className="space-y-3">
            {stats?.pesanan_terbaru?.length > 0 ? (
              stats.pesanan_terbaru.map((order) => (
                <div key={order.id_transaksi} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">
                      #{order.id_transaksi} - {order.pelanggan}
                    </p>
                    <p className={`text-xs ${mutedText}`}>{new Date(order.tgl_transaksi).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatRupiah(order.total_harga)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(order.status_pesanan)}`}>{order.status_pesanan}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada transaksi</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
