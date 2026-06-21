import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenPesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPesanan();
  }, [filterStatus]);

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pesanan", {
        params: filterStatus !== "semua" ? { status: filterStatus } : {},
        headers: { Authorization: `Bearer ${token}` },
      });
      setPesanan(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil pesanan:", err);
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/pesanan/${id}`,
        { status_pesanan: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchPesanan();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "dikirim":
        return "bg-purple-100 text-purple-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPesanan = pesanan.length;
  const pesananBaru = pesanan.filter((o) => o.status_pesanan === "menunggu").length;
  const pesananDiproses = pesanan.filter((o) => o.status_pesanan === "diproses" || o.status_pesanan === "dikirim").length;
  const pesananSelesai = pesanan.filter((o) => o.status_pesanan === "selesai").length;

  return (
    <main className="p-4 md:p-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Manajemen Pesanan</h1>
          <p className="text-stone-500 mt-1">Kelola semua pesanan kopi</p>
        </div>
        <button onClick={fetchPesanan} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-stone-500 text-xs uppercase">Total</p>
          <p className="text-2xl font-bold">{totalPesanan}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-stone-500 text-xs uppercase">Baru</p>
          <p className="text-2xl font-bold text-amber-600">{pesananBaru}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-stone-500 text-xs uppercase">Diproses</p>
          <p className="text-2xl font-bold text-blue-600">{pesananDiproses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-stone-500 text-xs uppercase">Selesai</p>
          <p className="text-2xl font-bold text-green-600">{pesananSelesai}</p>
        </div>
      </section>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-wrap gap-2">
          {["semua", "menunggu", "diproses", "dikirim", "selesai", "dibatalkan"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filterStatus === s ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
              {s} ({s === "semua" ? totalPesanan : pesanan.filter((o) => o.status_pesanan === s).length})
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b text-stone-600 text-xs uppercase">
                <th className="text-left px-4 py-3">No.</th>
                <th className="text-left px-4 py-3">Pelanggan</th>
                <th className="text-left px-4 py-3">Tanggal</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Pembayaran</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pesanan.map((item, i) => (
                <tr key={item.id_transaksi} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-sm font-semibold text-amber-700">#{item.id_transaksi}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item.pelanggan}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">{new Date(item.tgl_transaksi).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{formatRupiah(item.total_harga)}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">{item.metode_pembayaran || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={item.status_pesanan}
                      onChange={(e) => updateStatus(item.id_transaksi, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer ${getStatusColor(item.status_pesanan)}`}
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="diproses">Diproses</option>
                      <option value="dikirim">Dikirim</option>
                      <option value="selesai">Selesai</option>
                      <option value="dibatalkan">Dibatalkan</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => updateStatus(item.id_transaksi, "selesai")} className="text-green-600 hover:text-green-800 text-sm font-semibold">
                      Selesai
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
