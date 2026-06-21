import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

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

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.4em] font-black text-amber-700 mb-4">Coffee Journey</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-stone-800">
            ORDER <span className="text-amber-700">HISTORY</span>
          </h1>
        </section>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-lg border border-[#F0E4D0]">
            <p className="text-7xl mb-6">☕</p>
            <h2 className="text-3xl font-black mb-4 text-stone-800">Belum Ada Pesanan</h2>
            <p className="text-stone-500">Riwayat transaksi akan muncul setelah kamu melakukan checkout.</p>
            <button onClick={() => navigate("/home/produk")} className="mt-6 bg-amber-700 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-800 transition">
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div key={order.id_transaksi} className="bg-white rounded-[3rem] overflow-hidden shadow-lg border border-[#F0E4D0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="p-8">
                  <span
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status_pesanan === "selesai"
                        ? "bg-green-100 text-green-700"
                        : order.status_pesanan === "dikirim"
                          ? "bg-blue-100 text-blue-700"
                          : order.status_pesanan === "diproses"
                            ? "bg-amber-100 text-amber-700"
                            : order.status_pesanan === "dibatalkan"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status_pesanan}
                  </span>
                  <p className="text-stone-500 text-sm mt-4 mb-4">{formatDate(order.tgl_transaksi)}</p>
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Invoice</p>
                      <p className="font-bold text-stone-800">TRX-{String(order.id_transaksi).padStart(4, "0")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Pembayaran</p>
                      <p className="font-bold text-stone-800">{order.metode_pembayaran || "-"}</p>
                    </div>
                    <div className="pt-3 border-t border-stone-100">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Total</p>
                      <p className="text-2xl font-black text-amber-700">{formatRupiah(order.total_harga)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default History;
