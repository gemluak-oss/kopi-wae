import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = ({ isDark }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  if (isLoading) {
    return (
      <main className={`min-h-screen ${bg} font-mono flex items-center justify-center`}>
        <div className={`px-6 py-3 border-4 ${b} ${cardBg} font-bold animate-pulse uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat riwayat...</div>
      </main>
    );
  }

  const getStatusStyle = (status) => {
    const colors = { selesai: "bg-[#00F5D4]", dikirim: "bg-[#00B4D8]", diproses: "bg-[#FFB703]", dibatalkan: "bg-red-400" };
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
              <div key={order.id_transaksi} className={`${cardBg} border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-1 hover:translate-y-1 transition-all`}>
                <div className="p-6">
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 border-2 ${b} text-[10px] font-black uppercase text-black ${getStatusStyle(order.status_pesanan)}`}>{order.status_pesanan}</span>
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
    </main>
  );
};

export default History;
