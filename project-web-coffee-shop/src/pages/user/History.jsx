import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime"; // ✅ import

const History = ({ isDark }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#2a2522]" : "bg-white";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";
  const borderColor = "border-[#C77A23]/20";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, []);

  // ✅ Auto refresh
  useRealtime("historyUpdate", (data) => {
    if (data.userId === user?.id) fetchHistory();
  });
  useRealtime("statusUpdate", () => fetchHistory());

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/history/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil history:", err);
      setIsLoading(false);
    }
  };

  const fetchDetailPesanan = async (idTransaksi) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/history/detail/${idTransaksi}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedOrder(res.data.data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getStatusStyle = (status) => {
    const c = { selesai: "bg-green-500 text-white", dikirim: "bg-blue-500 text-white", diproses: "bg-[#C77A23] text-white", dibatalkan: "bg-red-500 text-white", menunggu: "bg-purple-500 text-white" };
    return c[status] || "bg-gray-500 text-white";
  };

  if (isLoading)
    return (
      <main className={`min-h-screen ${bg} font-body flex items-center justify-center`}>
        <div className={`px-8 py-4 rounded-full border ${borderColor} ${cardBg} text-sm uppercase tracking-wider animate-pulse shadow-lg`}>Memuat riwayat...</div>
      </main>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; } .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; transition: all 0.3s ease; font-family: 'Roboto', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; } .caramel-btn:hover { background: #3A2F2B; }
        .order-card { border-radius: 16px; border: 1px solid rgba(199,122,35,0.2); transition: all 0.4s ease; overflow: hidden; } .order-card:hover { box-shadow: 0 10px 25px rgba(199,122,35,0.2); transform: translateY(-4px); }
      `}</style>

      <main className={`min-h-screen ${bg} font-body py-16`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <section className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C77A23] font-medium mb-2">Coffee Journey</p>
            <h1 className={`font-serif text-4xl md:text-6xl font-bold leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
              ORDER <span className="text-[#C77A23] italic">HISTORY</span>
            </h1>
          </section>

          {orders.length === 0 ? (
            <div className={`${cardBg} rounded-2xl border ${borderColor} p-12 text-center shadow-xl max-w-2xl mx-auto`}>
              <h2 className={`font-serif text-2xl font-bold mb-3`}>Belum Ada Pesanan</h2>
              <p className={`text-sm mb-8 ${textMuted}`}>Riwayat transaksi akan muncul setelah checkout.</p>
              <button onClick={() => navigate("/home/produk")} className="caramel-btn px-6 py-3 text-xs">
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {orders.map((order) => (
                <div key={order.id_transaksi} onClick={() => fetchDetailPesanan(order.id_transaksi)} className={`order-card cursor-pointer ${cardBg}`}>
                  <div className="p-6">
                    <div className="mb-4 flex justify-between items-start">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-body font-medium uppercase tracking-wider ${getStatusStyle(order.status_pesanan)}`}>{order.status_pesanan}</span>
                      <span className={`text-[10px] font-body uppercase tracking-wider ${textMuted}`}>Detail →</span>
                    </div>
                    <p className={`text-xs font-body uppercase tracking-wider mb-6 ${textMuted}`}>{formatDate(order.tgl_transaksi)}</p>
                    <div className="space-y-4">
                      <div>
                        <p className={`text-[10px] font-body uppercase tracking-wider ${textMuted}`}>Invoice</p>
                        <p className={`font-body font-bold text-sm px-3 py-1 rounded-lg inline-block ${isDark ? "bg-[#3A2F2B]" : "bg-[#E8D8C6]"} border ${borderColor}`}>TRX-{String(order.id_transaksi).padStart(4, "0")}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] font-body uppercase tracking-wider ${textMuted}`}>Pembayaran</p>
                        <p className="font-body font-medium text-sm">{order.metode_pembayaran || "-"}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] font-body uppercase tracking-wider ${textMuted}`}>Total Item</p>
                        <p className="font-body font-medium text-sm">{order.total_item || 0} produk</p>
                      </div>
                      <div className="pt-4 border-t border-dashed border-[#C77A23]/20">
                        <p className={`text-[10px] font-body uppercase tracking-wider mb-1 ${textMuted}`}>Total</p>
                        <p className="font-body text-xl font-bold text-[#C77A23]">{formatRupiah(order.total_harga)}</p>
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
            <div className={`${cardBg} rounded-2xl border ${borderColor} max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
              <div className="p-6 border-b border-[#C77A23]/20 bg-[#C77A23] text-white flex justify-between items-center rounded-t-2xl">
                <div>
                  <h2 className="font-serif text-xl font-bold">Detail Pesanan</h2>
                  <p className="text-xs font-body opacity-80">TRX-{String(selectedOrder.id_transaksi).padStart(4, "0")}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-body hover:bg-white/30 transition-all">
                  X
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-xs font-body uppercase">
                  <div className={`rounded-xl border ${borderColor} p-3`}>
                    <p className={`mb-1 ${textMuted}`}>Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-white font-medium ${getStatusStyle(selectedOrder.status_pesanan)}`}>{selectedOrder.status_pesanan}</span>
                  </div>
                  <div className={`rounded-xl border ${borderColor} p-3`}>
                    <p className={`mb-1 ${textMuted}`}>Tanggal</p>
                    <p className="font-medium">{formatDateTime(selectedOrder.tgl_transaksi)}</p>
                  </div>
                </div>
                <div className={`rounded-xl border ${borderColor} p-3 text-xs font-body uppercase`}>
                  <p className={`mb-1 ${textMuted}`}>Metode Pembayaran</p>
                  <p className="font-medium">{selectedOrder.metode_pembayaran || "-"}</p>
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-sm mb-3 pb-2 border-b border-dashed ${borderColor}`}>Produk Dipesan</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 rounded-xl border border-dashed ${borderColor} p-3`}>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                          <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-xs truncate">{item.nama_kopi}</p>
                          <p className={`text-[10px] ${textMuted}`}>
                            {item.qty}x @ {formatRupiah(item.harga_saat_ini)}
                          </p>
                        </div>
                        <p className="font-body font-bold text-xs">{formatRupiah(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#C77A23]/20 pt-4 space-y-2">
                  <div className={`flex justify-between text-xs font-body uppercase ${textMuted}`}>
                    <span>Subtotal</span>
                    <span>{formatRupiah(selectedOrder.items?.reduce((s, i) => s + Number(i.subtotal), 0) || 0)}</span>
                  </div>
                  {selectedOrder.items &&
                    (() => {
                      const s = selectedOrder.items.reduce((a, i) => a + Number(i.subtotal), 0);
                      const d = s - Number(selectedOrder.total_harga);
                      if (d > 0)
                        return (
                          <div className="flex justify-between text-xs font-body uppercase text-green-500 font-medium">
                            <span>Diskon</span>
                            <span>- {formatRupiah(d)}</span>
                          </div>
                        );
                      return null;
                    })()}
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#C77A23]/20">
                    <span className="text-xs font-body font-bold uppercase">Total</span>
                    <span className="font-body text-2xl font-bold text-[#C77A23]">{formatRupiah(selectedOrder.total_harga)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[#C77A23]/20">
                <button onClick={() => setSelectedOrder(null)} className="w-full py-3 rounded-xl bg-[#3A2F2B] text-white font-body text-sm uppercase tracking-wider hover:bg-[#C77A23] transition-all">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default History;
