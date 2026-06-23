import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = ({ isDark }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#121212]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#121212]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-stone-100";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/history/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil history:", err);
      setIsLoading(false);
    }
  };

  const fetchDetailPesanan = async (idTransaksi) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/history/detail/${idTransaksi}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(res.data.data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (isLoading) {
    return (
      <main className={`min-h-screen ${bg} font-mono flex items-center justify-center`}>
        <div className={`px-6 py-3 border-4 ${b} ${cardBg} font-bold animate-pulse uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat riwayat...</div>
      </main>
    );
  }

  const getStatusStyle = (status) => {
    const colors = { selesai: "bg-[#00F5D4]", dikirim: "bg-[#00B4D8]", diproses: "bg-[#FFB703]", dibatalkan: "bg-red-400", menunggu: "bg-purple-300" };
    return colors[status] || "bg-purple-300";
  };

  return (
    <main className={`min-h-screen ${bg} font-mono py-16`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest font-bold mb-2">Coffee Journey</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            ORDER <span className={`px-2 bg-[#FFB703] text-black border-2 ${b} inline-block shadow-[4px_4px_0px_0px] ${shadow}`}>HISTORY</span>
          </h1>
        </section>

        {orders.length === 0 ? (
          <div className={`${cardBg} border-4 ${b} p-12 text-center shadow-[8px_8px_0px_0px] ${shadow} max-w-2xl mx-auto`}>
            <h2 className="text-2xl font-black mb-3 uppercase">Belum Ada Pesanan</h2>
            <p className="text-sm font-medium opacity-70 mb-8">Riwayat transaksi akan muncul setelah checkout.</p>
            <button
              onClick={() => navigate("/home/produk")}
              className={`px-6 py-3 border-3 ${b} bg-[#FFB703] text-black font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div
                key={order.id_transaksi}
                onClick={() => fetchDetailPesanan(order.id_transaksi)}
                className={`${cardBg} border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer`}
              >
                <div className="p-6">
                  <div className="mb-4 flex justify-between items-start">
                    <span className={`inline-block px-3 py-1 border-2 ${b} text-[10px] font-black uppercase text-black ${getStatusStyle(order.status_pesanan)}`}>{order.status_pesanan}</span>
                    <span className="text-[10px] font-black uppercase opacity-40">Detail</span>
                  </div>
                  <p className="text-xs font-black opacity-60 uppercase mb-6">{formatDate(order.tgl_transaksi)}</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-black opacity-40">Invoice</p>
                      <p className={`font-bold text-sm ${mutedBg} border-2 ${b} px-2 py-0.5 inline-block`}>TRX-{String(order.id_transaksi).padStart(4, "0")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black opacity-40">Pembayaran</p>
                      <p className="font-black text-sm uppercase">{order.metode_pembayaran || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black opacity-40">Total Item</p>
                      <p className="font-black text-sm uppercase">{order.total_item || 0} produk</p>
                    </div>
                    <div className="pt-4 border-t-2 border-dashed">
                      <p className="text-[10px] uppercase font-black opacity-40 mb-1">Total</p>
                      <p className={`text-xl font-black bg-[#FFB703] text-black border-2 ${b} px-3 py-1 inline-block`}>{formatRupiah(order.total_harga)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${cardBg} border-4 ${b} max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[12px_12px_0px_0px] ${shadow}`}>
            <div className={`p-6 border-b-4 ${b} bg-[#FFB703] text-black flex justify-between items-center`}>
              <div>
                <h2 className="text-xl font-black uppercase">Detail Pesanan</h2>
                <p className="text-xs font-bold uppercase opacity-70">TRX-{String(selectedOrder.id_transaksi).padStart(4, "0")}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className={`w-8 h-8 border-2 ${b} bg-white text-black flex items-center justify-center font-black hover:bg-red-400 transition-all`}>
                X
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase">
                <div className={`border-2 ${b} p-3`}>
                  <p className="opacity-50 mb-1">Status</p>
                  <span className={`inline-block px-2 py-0.5 border-2 ${b} text-black font-black ${getStatusStyle(selectedOrder.status_pesanan)}`}>{selectedOrder.status_pesanan}</span>
                </div>
                <div className={`border-2 ${b} p-3`}>
                  <p className="opacity-50 mb-1">Tanggal</p>
                  <p className="font-black">{formatDateTime(selectedOrder.tgl_transaksi)}</p>
                </div>
              </div>

              <div className={`border-2 ${b} p-3 text-xs font-bold uppercase`}>
                <p className="opacity-50 mb-1">Metode Pembayaran</p>
                <p className="font-black">{selectedOrder.metode_pembayaran || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase mb-3 border-b-2 border-dashed pb-2">Produk Dipesan</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 border-2 border-dashed p-3">
                      <div className={`w-12 h-12 border-2 ${b} flex-shrink-0 bg-stone-200`}>
                        <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-xs uppercase truncate">{item.nama_kopi}</p>
                        <p className="text-[10px] opacity-50">
                          {item.qty}x @ {formatRupiah(item.harga_saat_ini)}
                        </p>
                      </div>
                      <p className="font-black text-xs">{formatRupiah(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ TOTAL + DISKON */}
              <div className={`border-t-4 ${b} pt-4 space-y-2`}>
                <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                  <span>Subtotal</span>
                  <span>{formatRupiah(selectedOrder.items?.reduce((s, i) => s + Number(i.subtotal), 0) || 0)}</span>
                </div>
                {selectedOrder.items &&
                  (() => {
                    const subtotalItems = selectedOrder.items.reduce((s, i) => s + Number(i.subtotal), 0);
                    const diskon = subtotalItems - Number(selectedOrder.total_harga);
                    if (diskon > 0) {
                      return (
                        <div className="flex justify-between text-xs font-bold uppercase text-green-600">
                          <span>Diskon</span>
                          <span>- {formatRupiah(diskon)}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                <div className="flex justify-between items-center pt-2 border-t-2 border-dashed">
                  <span className="text-xs font-black uppercase">Total</span>
                  <span className="text-2xl font-black bg-[#FFB703] text-black px-3 py-1 border-2 border-[#121212]">{formatRupiah(selectedOrder.total_harga)}</span>
                </div>
              </div>
            </div>

            <div className={`p-4 border-t-4 ${b}`}>
              <button onClick={() => setSelectedOrder(null)} className="w-full py-3 font-black border-4 border-[#121212] bg-black text-white uppercase hover:bg-[#FFB703] hover:text-black transition-all text-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default History;
