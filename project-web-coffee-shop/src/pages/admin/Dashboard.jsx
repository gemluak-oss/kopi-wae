import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DashboardAdmin({ isDark }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-[#FFFDF6]";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  const getStatusColor = (status) => {
    const c = { selesai: "bg-[#00F5D4] text-black", diproses: "bg-[#FFC700] text-black", dikirim: "bg-purple-300 text-black", menunggu: "bg-red-400 text-black" };
    return c[status] || "bg-white text-black";
  };

  if (isLoading)
    return (
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_0px] ${shadow}`}>MEMUAT DASHBOARD...</div>
      </main>
    );

  return (
    <main className={`p-6 md:p-10 min-h-screen font-mono space-y-10 ${bg}`}>
      {/* HEADER UTAMA */}
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[8px_8px_0px_0px] ${shadow} flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Dashboard Admin</h1>
          <p className="text-xs font-bold uppercase opacity-60 mt-1">Ringkasan performa &amp; statistik Kopi Wae</p>
        </div>
        <div className={`text-xs font-black uppercase bg-[#A1A1FF] text-black border-2 ${b} px-4 py-2 shadow-[3px_3px_0px_0px_#1A1A1A]`}>Status: Administrator</div>
      </header>

      {/* THREE-COLUMN STATS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Pendapatan */}
        <div className={`${cardBg} border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} p-6 flex items-center justify-between overflow-hidden relative group`}>
          <div className="space-y-2 z-10">
            <span className="text-xs font-black uppercase tracking-wider opacity-60 block">[ Total Pendapatan ]</span>
            <div className="inline-block">
              <span className={`text-xl lg:text-2xl font-black bg-[#FFC700] text-black border-2 ${b} px-3 py-1 block shadow-[2px_2px_0px_0px_#1A1A1A]`}>{formatRupiah(stats?.pendapatan || 0)}</span>
            </div>
          </div>
          <div className={`p-3 border-4 ${b} bg-white text-black shadow-[3px_3px_0px_0px_#1A1A1A] z-10 shrink-0`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.251.11a3.375 3.375 0 004.496-2.355c.192-.94-.467-1.894-1.423-2.08l-2.241-.437c-.956-.187-1.615-1.14-1.423-2.08a3.375 3.375 0 014.496-2.355l.25.11" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Produk */}
        <div className={`${cardBg} border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} p-6 flex items-center justify-between overflow-hidden relative group`}>
          <div className="space-y-2 z-10">
            <span className="text-xs font-black uppercase tracking-wider opacity-60 block">[ Koleksi Produk ]</span>
            <div className="inline-block">
              <span className={`text-2xl font-black bg-[#A1A1FF] text-black border-2 ${b} px-4 py-1 block shadow-[2px_2px_0px_0px_#1A1A1A]`}>{stats?.total_produk || 0} ITEMS</span>
            </div>
          </div>
          <div className={`p-3 border-4 ${b} bg-white text-black shadow-[3px_3px_0px_0px_#1A1A1A] z-10 shrink-0`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Pesanan Baru */}
        <div className={`${cardBg} border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} p-6 flex items-center justify-between overflow-hidden relative group`}>
          <div className="space-y-2 z-10">
            <span className="text-xs font-black uppercase tracking-wider opacity-60 block">[ Pesanan Masuk ]</span>
            <div className="inline-block">
              <span className={`text-2xl font-black bg-[#00F5D4] text-black border-2 ${b} px-4 py-1 block shadow-[2px_2px_0px_0px_#1A1A1A]`}>{stats?.pesanan_baru || 0} ORDERS</span>
            </div>
          </div>
          <div className={`p-3 border-4 ${b} bg-white text-black shadow-[3px_3px_0px_0px_#1A1A1A] z-10 shrink-0`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4m0 0h7.5m-7.5 0l-1.5 9.5h10.5l-1.5-9.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* TOP KOPI TERLARIS */}
      {stats?.top_kopi?.length > 0 && (
        <div className={`${cardBg} p-6 border-4 ${b} shadow-[8px_8px_0px_0px] ${shadow}`}>
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 pb-3 border-b-4 border-dashed border-current flex items-center gap-2">[ DATA ] Top Kopi Terlaris</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.top_kopi.map((item, index) => (
              <div key={index} className={`p-5 border-4 ${b} ${mutedBg} text-center shadow-[4px_4px_0px_0px] ${shadow} flex flex-col justify-between items-center relative overflow-hidden`}>
                <div className="absolute top-0 left-0 bg-black text-white px-2 py-0.5 text-[10px] font-black border-r-2 border-b-2 border-current">#{index + 1}</div>

                {/* SVG Pengganti Emoji Cangkir */}
                <div className="w-12 h-12 border-2 border-current bg-amber-500/10 flex items-center justify-center text-current mt-2 mb-3 shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
                  </svg>
                </div>

                <div className="w-full">
                  <p className="font-black text-xs uppercase truncate px-1">{item.nama_kopi}</p>
                  <p className="text-[10px] font-bold uppercase opacity-70 mt-1 bg-black/5 dark:bg-white/10 py-1 border-t-2 border-current border-dashed">{item.total_terjual} Terjual</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABEL PESANAN TERBARU */}
      <div className={`${cardBg} p-6 border-4 ${b} shadow-[8px_8px_0px_0px] ${shadow}`}>
        <h2 className="text-sm font-black uppercase tracking-widest mb-6 pb-3 border-b-4 border-dashed border-current flex items-center gap-2">[ LOG ] Transaksi Masuk Terbaru</h2>
        <div className="overflow-x-auto border-4 border-current">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase tracking-wider`}>
                <th className="p-4 border-r-2 border-current">ID Transaksi</th>
                <th className="p-4 border-r-2 border-current">Nama Pelanggan</th>
                <th className="p-4 border-r-2 border-current">Total Pembayaran</th>
                <th className="p-4 border-r-2 border-current text-center">Status Pesanan</th>
                <th className="p-4">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-current text-xs font-bold uppercase">
              {stats?.pesanan_terbaru?.map((order) => (
                <tr key={order.id_transaksi} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-black opacity-80 border-r-2 border-current">#{order.id_transaksi}</td>
                  <td className="p-4 border-r-2 border-current">{order.pelanggan}</td>
                  <td className="p-4 border-r-2 border-current font-black">{formatRupiah(order.total_harga)}</td>
                  <td className="p-4 text-center border-r-2 border-current">
                    <span className={`px-3 py-1.5 border-2 ${b} text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#1A1A1A] ${getStatusColor(order.status_pesanan)}`}>{order.status_pesanan}</span>
                  </td>
                  <td className="p-4 opacity-70">{new Date(order.tgl_transaksi).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
