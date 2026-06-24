import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DashboardAdmin({ isDark }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Financial Dashboard Theme
  const bg = isDark ? "bg-slate-950" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const profitColor = "text-emerald-500";
  const lossColor = "text-red-500";
  const blueAccent = "text-blue-600";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num);

  const getStatusBadge = (status) => {
    const styles = {
      selesai: "bg-emerald-100 text-emerald-700 border-emerald-300",
      diproses: "bg-amber-100 text-amber-700 border-amber-300",
      dikirim: "bg-blue-100 text-blue-700 border-blue-300",
      menunggu: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading Dashboard...
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Ringkasan performa bisnis Kopi Wae</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Administrator
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className={`metric-card ${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
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
          <p className="text-2xl font-bold count-up">{formatRupiah(stats?.pendapatan || 0)}</p>
          <p className={`text-xs mt-2 flex items-center gap-1 ${profitColor}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            Revenue from completed orders
          </p>
        </div>

        {/* Products */}
        <div className={`metric-card ${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium uppercase tracking-wider ${mutedText}`}>Total Produk</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold count-up">{formatNumber(stats?.total_produk || 0)}</p>
          <p className={`text-xs mt-2 ${mutedText}`}>Active products in catalog</p>
        </div>

        {/* Orders */}
        <div className={`metric-card ${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium uppercase tracking-wider ${mutedText}`}>Pesanan Masuk</span>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold count-up">{formatNumber(stats?.pesanan_baru || 0)}</p>
          <p className={`text-xs mt-2 ${mutedText}`}>Total orders received</p>
        </div>
      </div>

      {/* TOP PRODUCTS + RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Kopi */}
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Top Produk Terlaris
          </h2>
          <div className="space-y-3">
            {stats?.top_kopi?.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-400"}`}>{i + 1}</span>
                  <span className="text-sm font-medium">{item.nama_kopi}</span>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{item.total_terjual} sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Transaksi Terbaru
          </h2>
          <div className="space-y-3">
            {stats?.pesanan_terbaru?.map((order) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
