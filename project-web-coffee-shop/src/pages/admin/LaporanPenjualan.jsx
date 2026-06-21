import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LaporanPenjualan() {
  const [laporan, setLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/laporan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data.map((item) => ({
        ...item,
        tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      }));
      setLaporan(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  };

  const totalPendapatan = laporan.reduce((sum, item) => sum + Number(item.total), 0);
  const totalTransaksi = laporan.reduce((sum, item) => sum + item.jumlah, 0);
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
      <main className="p-4 md:p-8 bg-stone-50 min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );

  return (
    <main className="p-4 md:p-6 bg-stone-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Laporan Penjualan</h1>
          <p className="text-stone-500 text-sm mt-1">Ringkasan pendapatan 30 hari terakhir</p>
        </div>
        <button onClick={exportCSV} className="bg-white hover:bg-stone-50 text-stone-700 px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-xs uppercase font-semibold">Total Transaksi</p>
          <p className="text-2xl font-bold text-stone-800 mt-1">{totalTransaksi}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-xs uppercase font-semibold">Total Pendapatan</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatRupiah(totalPendapatan)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-xs uppercase font-semibold">Rata-rata / Hari</p>
          <p className="text-xl font-bold text-green-600 mt-1">{formatRupiah(totalPendapatan / (laporan.length || 1))}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 mb-6">
        <h2 className="font-bold text-stone-800 mb-4">Grafik Pendapatan</h2>
        <div className="flex items-end gap-2 h-64">
          {laporan.map((item, index) => {
            const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[9px] font-semibold text-stone-500 mb-1">{item.total > 0 ? formatRupiah(item.total) : ""}</span>
                <div
                  className="w-full bg-amber-500 hover:bg-amber-400 rounded-t transition cursor-pointer"
                  style={{
                    height: `${Math.max(height, 3)}%`,
                    minHeight: item.total > 0 ? "12px" : "0px",
                  }}
                  title={`${item.tanggal}: ${item.jumlah} transaksi - ${formatRupiah(item.total)}`}
                ></div>
                <span className="text-[9px] text-stone-400 mt-1.5 text-center">
                  {item.tanggal.split(" ")[0]}
                  <br />
                  <span className="text-[8px]">{item.tanggal.split(" ")[1]}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">
            Total: <strong className="text-stone-700">{formatRupiah(totalPendapatan)}</strong>
          </span>
          <span className="text-xs text-stone-400">{laporan.length} hari</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-xs uppercase">
              <th className="text-left px-6 py-3 font-semibold">Tanggal</th>
              <th className="text-center px-6 py-3 font-semibold">Transaksi</th>
              <th className="text-right px-6 py-3 font-semibold">Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {laporan.map((item, index) => (
              <tr key={index} className="hover:bg-stone-50">
                <td className="px-6 py-3 text-sm font-medium text-stone-800">{item.tanggal}</td>
                <td className="px-6 py-3 text-sm text-center text-stone-600">{item.jumlah} tx</td>
                <td className="px-6 py-3 text-sm text-right font-semibold text-green-600">{formatRupiah(item.total)}</td>
              </tr>
            ))}
            {laporan.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-16 text-center text-stone-400">
                  Belum ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
