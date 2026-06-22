import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenPesanan({ isDark }) {
  const [pesanan, setPesanan] = useState([]);
  const [allPesanan, setAllPesanan] = useState([]); // Simpan semua data
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-[#EAE8E1]";

  useEffect(() => {
    fetchPesanan();
  }, []); // Hanya fetch sekali saat mount

  // Filter data lokal saat filterStatus berubah
  useEffect(() => {
    if (filterStatus === "semua") {
      setPesanan(allPesanan);
    } else {
      setPesanan(allPesanan.filter((o) => o.status_pesanan === filterStatus));
    }
  }, [filterStatus, allPesanan]);

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pesanan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllPesanan(res.data.data);
      setPesanan(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil pesanan:", err);
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/pesanan/${id}`, { status_pesanan: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchPesanan(); // Refresh data setelah update
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  const getStatusColor = (status) => {
    const c = {
      menunggu: "bg-[#FFC700] text-black",
      diproses: "bg-[#00F5D4] text-black",
      dikirim: "bg-purple-300 text-black",
      selesai: "bg-[#38EF7D] text-black",
      dibatalkan: "bg-red-400 text-black",
    };
    return c[status] || "bg-white text-black";
  };

  // Menggunakan allPesanan untuk perhitungan statistik
  const totalPesanan = allPesanan.length;
  const pesananBaru = allPesanan.filter((o) => o.status_pesanan === "menunggu").length;
  const pesananDiproses = allPesanan.filter((o) => o.status_pesanan === "diproses" || o.status_pesanan === "dikirim").length;
  const pesananSelesai = allPesanan.filter((o) => o.status_pesanan === "selesai").length;

  if (isLoading)
    return (
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat Pesanan...</div>
      </main>
    );

  return (
    <main className={`p-6 min-h-screen font-mono space-y-6 ${bg}`}>
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} flex flex-col sm:flex-row justify-between gap-4`}>
        <div>
          <h1 className="text-2xl font-black uppercase">Manajemen Pesanan</h1>
        </div>
        <button onClick={fetchPesanan} className={`px-5 py-3 border-3 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}>
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: totalPesanan, color: "" },
          { label: "Baru", value: pesananBaru, color: "bg-[#FFC700] text-black" },
          { label: "Diproses", value: pesananDiproses, color: "bg-[#00F5D4] text-black" },
          { label: "Selesai", value: pesananSelesai, color: "bg-[#38EF7D] text-black" },
        ].map((s, i) => (
          <div key={i} className={`${s.color || cardBg} p-4 border-4 ${b} shadow-[4px_4px_0px_0px] ${shadow}`}>
            <p className="text-[10px] font-black uppercase opacity-60">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </section>

      <div className={`${cardBg} p-4 border-4 ${b} shadow-[4px_4px_0px_0px] ${shadow}`}>
        <div className="flex flex-wrap gap-2">
          {["semua", "menunggu", "diproses", "dikirim", "selesai", "dibatalkan"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 border-2 ${b} font-black text-xs uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${
                filterStatus === s ? (isDark ? "bg-white text-black" : "bg-black text-white") : cardBg
              }`}
            >
              {s} ({s === "semua" ? totalPesanan : allPesanan.filter((o) => o.status_pesanan === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} overflow-x-auto`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase`}>
              <th className="p-4">ID</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4">Metode</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-current/10 text-xs font-bold uppercase">
            {pesanan.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center opacity-50">
                  Tidak ada pesanan {filterStatus !== "semua" ? `dengan status "${filterStatus}"` : ""}
                </td>
              </tr>
            ) : (
              pesanan.map((item) => (
                <tr key={item.id_transaksi} className="hover:bg-black/5 transition-colors">
                  <td className="p-4 font-black">#{item.id_transaksi}</td>
                  <td className="p-4">{item.pelanggan}</td>
                  <td className="p-4 opacity-80">{new Date(item.tgl_transaksi).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 text-right font-black">{formatRupiah(item.total_harga)}</td>
                  <td className="p-4">{item.metode_pembayaran || "-"}</td>
                  <td className="p-4 text-center">
                    <select
                      value={item.status_pesanan}
                      onChange={(e) => updateStatus(item.id_transaksi, e.target.value)}
                      className={`text-[10px] font-black uppercase text-center p-2 border-2 ${b} cursor-pointer ${getStatusColor(item.status_pesanan)}`}
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="diproses">Diproses</option>
                      <option value="dikirim">Dikirim</option>
                      <option value="selesai">Selesai</option>
                      <option value="dibatalkan">Dibatalkan</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    {item.status_pesanan !== "selesai" && item.status_pesanan !== "dibatalkan" ? (
                      <button
                        onClick={() => updateStatus(item.id_transaksi, "selesai")}
                        className={`px-3 py-1.5 border-2 ${b} bg-[#38EF7D] text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      >
                        Selesai
                      </button>
                    ) : (
                      <span className="text-[10px] opacity-30">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
