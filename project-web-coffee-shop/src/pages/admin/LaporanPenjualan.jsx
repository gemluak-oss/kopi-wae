import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LaporanPenjualan({ isDark }) {
  const [laporan, setLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/laporan", { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data.data.map((item) => ({ ...item, tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) }));
      setLaporan(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  const totalPendapatan = laporan.reduce((sum, item) => sum + Number(item.total), 0);
  const totalTransaksi = laporan.reduce((sum, item) => sum + item.jumlah, 0);
  const avgHarian = laporan.length > 0 ? totalPendapatan / laporan.length : 0;
  const maxValue = Math.max(...laporan.map((item) => item.total), 1);

  const exportCSV = () => {
    let csv = "Tanggal,Jumlah Transaksi,Total Pendapatan\n";
    laporan.forEach((item) => {
      csv += `${item.tanggal},${item.jumlah},${item.total}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
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
          <h1 className="text-2xl font-bold tracking-tight">Laporan Penjualan</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Ringkasan 30 hari terakhir</p>
        </div>
        <button
          onClick={exportCSV}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all shadow-sm ${
            isDark ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Volume Transaksi",
            value: `${totalTransaksi} Transactions`,
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            color: "text-blue-500",
            bgLight: "",
            borderLight: "border-slate-200",
            bgDark: "",
            borderDark: "border-slate-700",
          },
          {
            label: "Gross Revenue",
            value: formatRupiah(totalPendapatan),
            icon: "M12 6v12m-3-2.818l.251.11a3.375 3.375 0 004.496-2.355c.192-.94-.467-1.894-1.423-2.08l-2.241-.437c-.956-.187-1.615-1.14-1.423-2.08a3.375 3.375 0 014.496-2.355l.25.11",
            color: "text-emerald-500",
            bgLight: "bg-emerald-50/50",
            borderLight: "border-emerald-200",
            bgDark: "bg-emerald-950/50",
            borderDark: "border-emerald-800",
          },
          {
            label: "Daily Average",
            value: formatRupiah(avgHarian),
            icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
            color: "text-purple-500",
            bgLight: "bg-purple-50/50",
            borderLight: "border-purple-200",
            bgDark: "bg-purple-950/50",
            borderDark: "border-purple-800",
          },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-xl border ${isDark ? `${s.borderDark} ${s.bgDark}` : `${s.borderLight} ${s.bgLight}`} p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</span>
              <svg className={`w-4 h-4 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} />
              </svg>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Revenue Chart
        </h2>
        <div className="flex items-end gap-2 h-56 overflow-x-auto pb-2">
          {laporan.map((item, index) => {
            const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full min-w-[40px] group">
                <span className="text-[9px] font-medium text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{formatRupiah(item.total)}</span>
                <div
                  className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all cursor-pointer"
                  style={{ height: `${Math.max(height, 2)}%`, minHeight: item.total > 0 ? "8px" : "0px" }}
                  title={`${item.tanggal}: ${formatRupiah(item.total)}`}
                />
                <span className="text-[9px] font-medium text-slate-400 mt-2 text-center truncate w-full">{item.tanggal.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 text-xs">
          <span className="text-slate-500">
            Total Revenue: <strong className="text-emerald-600 ml-1">{formatRupiah(totalPendapatan)}</strong>
          </span>
          <span className="text-slate-400">{laporan.length} days</span>
        </div>
      </div>

      {/* Table */}
      <div className={`${cardBg} rounded-xl border ${border} shadow-sm overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Transaksi</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Omzet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {laporan.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 text-sm font-medium">{item.tanggal}</td>
                <td className="px-6 py-3 text-center text-sm">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">{item.jumlah} tx</span>
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-right">{formatRupiah(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
