import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LaporanPenjualan({ isDark }) {
  const [laporan, setLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-[#EAE8E1]";

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
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat Laporan...</div>
      </main>
    );

  return (
    <main className={`p-6 min-h-screen font-mono space-y-6 ${bg}`}>
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div>
          <h1 className="text-2xl font-black uppercase">Laporan Penjualan</h1>
          <p className="text-xs font-bold uppercase opacity-60 mt-1">Ringkasan 30 hari terakhir</p>
        </div>
        <button onClick={exportCSV} className={`px-5 py-3 border-3 ${b} ${cardBg} font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}>
          Export CSV
        </button>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Volume Transaksi", value: `${totalTransaksi} Transaksi`, color: "" },
          { label: "Bruto Omzet", value: formatRupiah(totalPendapatan), color: "bg-[#00F5D4] text-black" },
          { label: "Rata-Rata Harian", value: formatRupiah(totalPendapatan / (laporan.length || 1)), color: "bg-purple-300 text-black" },
        ].map((s, i) => (
          <div key={i} className={`${s.color || cardBg} p-5 border-4 ${b} shadow-[4px_4px_0px_0px] ${shadow}`}>
            <p className="text-[10px] font-black uppercase opacity-60">{s.label}</p>
            <p className="text-xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </section>

      <div className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
        <h2 className="text-xs font-black uppercase tracking-widest mb-6 border-b-2 pb-2">Grafik Pendapatan</h2>
        <div className="flex items-end gap-2 h-64 overflow-x-auto pb-2">
          {laporan.map((item, index) => {
            const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full min-w-[50px]">
                <span className="text-[8px] font-black mb-1.5 whitespace-nowrap">{item.total > 0 ? formatRupiah(item.total) : ""}</span>
                <div
                  className="w-full bg-[#FFC700] hover:bg-[#00F5D4] border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-[2px_2px_0px_0px] shadow-[#1A1A1A]"
                  style={{ height: `${Math.max(height, 4)}%`, minHeight: item.total > 0 ? "16px" : "0px" }}
                  title={`${item.tanggal}: ${formatRupiah(item.total)}`}
                ></div>
                <span className="text-[9px] font-black uppercase opacity-70 mt-3 text-center">
                  {item.tanggal.split(" ")[0]}
                  <br />
                  <span className="text-[8px] opacity-60">{item.tanggal.split(" ")[1]}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t-4 border-dashed text-xs font-black uppercase">
          <span>
            Total: <strong className="bg-[#00F5D4] text-black px-2 py-0.5 border-2 border-[#1A1A1A] ml-1">{formatRupiah(totalPendapatan)}</strong>
          </span>
          <span className="opacity-60">{laporan.length} hari</span>
        </div>
      </div>

      <div className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase tracking-wider`}>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-center">Transaksi</th>
                <th className="p-4 text-right">Omzet</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-current/10 text-xs font-bold uppercase">
              {laporan.map((item, index) => (
                <tr key={index} className="hover:bg-black/5 transition-colors">
                  <td className="p-4 font-black">{item.tanggal}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 border-2 ${b} shadow-[2px_2px_0px_0px] ${shadow}`}>{item.jumlah} tx</span>
                  </td>
                  <td className="p-4 text-right font-black">{formatRupiah(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
