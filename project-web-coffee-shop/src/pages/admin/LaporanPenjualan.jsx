import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime";

const CustomDropdown = ({ value, options, onChange, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const border = isDark ? "border-slate-600" : "border-slate-200";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border ${border} px-4 py-2.5 text-sm font-medium ${cardBg} hover:border-emerald-400 transition-all min-w-[120px] justify-between`}
      >
        <span className={value === null || value === undefined ? "text-slate-400" : ""}>{options.find((o) => o.value === value)?.label || "Pilih"}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className={`absolute z-50 mt-1 w-full rounded-lg border ${border} ${cardBg} shadow-xl overflow-hidden`}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all hover:bg-emerald-50 hover:text-emerald-700 ${opt.value === value ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-600"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function LaporanPenjualan({ isDark }) {
  const [laporan, setLaporan] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth());
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
  const [tahunOptions, setTahunOptions] = useState([]);
  const token = localStorage.getItem("token");

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const monthOptions = months.map((m, i) => ({ value: i, label: m }));
  const yearOptions = tahunOptions.map((y) => ({ value: y, label: String(y) }));

  useEffect(() => {
    fetchLaporan();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedBulan, selectedTahun, allData]);

  // ✅ SSE: Auto refresh pas ada pesanan baru atau update status
  useRealtime("pesananBaru", () => fetchLaporan());
  useRealtime("pesananUpdate", () => fetchLaporan());
  useRealtime("statusUpdate", () => fetchLaporan());

  const fetchLaporan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/laporan", { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data.data.map((item) => ({ ...item, tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }), dateObj: new Date(item.tanggal) }));
      setAllData(data);
      const years = [...new Set(data.map((item) => item.dateObj.getFullYear()))].sort((a, b) => b - a);
      setTahunOptions(years);
      if (years.length > 0 && !years.includes(selectedTahun)) setSelectedTahun(years[0]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    if (allData.length === 0) return;
    setLaporan(allData.filter((item) => item.dateObj.getMonth() === selectedBulan && item.dateObj.getFullYear() === selectedTahun));
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
    a.download = `Laporan_${months[selectedBulan]}_${selectedTahun}.csv`;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Penjualan</h1>
          <p className={`text-sm ${mutedText} mt-1`}>
            {months[selectedBulan]} {selectedTahun}
          </p>
        </div>
        <button
          onClick={exportCSV}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all shadow-sm ${isDark ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className={`${cardBg} rounded-xl border ${border} p-4 shadow-sm`}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter:</span>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Bulan</label>
            <CustomDropdown value={selectedBulan} options={monthOptions} onChange={setSelectedBulan} isDark={isDark} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Tahun</label>
            <CustomDropdown value={selectedTahun} options={yearOptions} onChange={setSelectedTahun} isDark={isDark} />
          </div>
          {laporan.length > 0 && <span className="text-xs text-slate-400 ml-auto bg-slate-100 px-3 py-1 rounded-full">{laporan.length} hari data</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: formatRupiah(totalPendapatan), color: "text-emerald-500", bg: "bg-emerald-50", borderColor: "border-emerald-200" },
          { label: "Transactions", value: totalTransaksi, color: "text-blue-500", bg: "bg-blue-50", borderColor: "border-blue-200" },
          { label: "Daily Average", value: formatRupiah(avgHarian), color: "text-purple-500", bg: "bg-purple-50", borderColor: "border-purple-200" },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-xl border ${isDark ? "border-slate-700" : s.borderColor} p-5 shadow-sm ${isDark ? "" : s.bg}`}>
            <span className="text-xs font-medium text-slate-500 uppercase">{s.label}</span>
            <p className={`text-xl font-bold mt-1 ${isDark ? "text-white" : ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {laporan.length > 0 && (
        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
          <h2 className="text-sm font-semibold mb-4">Revenue Chart</h2>
          <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-2">
            {laporan.map((item, index) => {
              const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full min-w-[36px] group">
                  <span className="text-[8px] font-medium text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{formatRupiah(item.total)}</span>
                  <div
                    className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all cursor-pointer"
                    style={{ height: `${Math.max(height, 3)}%`, minHeight: item.total > 0 ? "6px" : "0px" }}
                    title={`${item.tanggal}: ${formatRupiah(item.total)}`}
                  />
                  <span className="text-[9px] font-medium text-slate-400 mt-2 text-center whitespace-nowrap">{item.tanggal.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            {laporan.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-sm text-slate-400">
                  Tidak ada data untuk bulan ini
                </td>
              </tr>
            ) : (
              laporan.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium">{item.tanggal}</td>
                  <td className="px-6 py-3 text-center text-sm">{item.jumlah} tx</td>
                  <td className="px-6 py-3 text-sm font-semibold text-right">{formatRupiah(item.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
