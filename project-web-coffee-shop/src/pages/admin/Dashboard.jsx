import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

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
      console.error("Gagal ambil dashboard:", err);
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-700 border border-green-200";
      case "diproses":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "dikirim":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "menunggu":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  if (isLoading) {
    return (
      <main className="p-4 md:p-8 bg-stone-50 min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8 bg-stone-50 min-h-screen">
      <header className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-stone-100">
        <h1 className="text-2xl font-bold text-stone-800">Dashboard Admin</h1>
        <p className="text-stone-500 mt-1">Ringkasan performa Coffee Wae.</p>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
            <span className="text-sm text-stone-500">Total Pendapatan</span>
            <span className="text-2xl font-bold text-amber-600 block mt-1">{formatRupiah(stats?.pendapatan || 0)}</span>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
            <span className="text-sm text-stone-500">Total Produk</span>
            <span className="text-2xl font-bold text-stone-800 block mt-1">{stats?.total_produk || 0}</span>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
            <span className="text-sm text-stone-500">Total Pesanan</span>
            <span className="text-2xl font-bold text-blue-600 block mt-1">{stats?.pesanan_baru || 0}</span>
          </div>
        </div>

        {stats?.top_kopi?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h2 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Top Kopi Terlaris</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.top_kopi.map((item, index) => (
                <div key={index} className="p-4 rounded-xl border bg-stone-50 text-center">
                  <span className="text-3xl font-bold text-amber-600">#{index + 1}</span>
                  <p className="font-bold text-stone-800 mt-2 text-sm">{item.nama_kopi}</p>
                  <p className="text-xs text-stone-500 mt-1">{item.total_terjual} terjual</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h2 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Pesanan Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-stone-600 text-sm uppercase">
                  <th className="p-4">ID</th>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats?.pesanan_terbaru?.map((order) => (
                  <tr key={order.id_transaksi} className="hover:bg-stone-50">
                    <td className="p-4 text-stone-500 font-mono text-sm">#{order.id_transaksi}</td>
                    <td className="p-4 font-medium text-stone-800">{order.pelanggan}</td>
                    <td className="p-4 font-medium text-stone-700">{formatRupiah(order.total_harga)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status_pesanan)}`}>{order.status_pesanan}</span>
                    </td>
                    <td className="p-4 text-sm text-stone-500">{new Date(order.tgl_transaksi).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
