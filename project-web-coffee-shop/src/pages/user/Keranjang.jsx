import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Keranjang = ({ isDark }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ongkir = 10000;
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#2a2522]" : "bg-white";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";
  const borderColor = "border-[#C77A23]/20";

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));

  useEffect(() => {
    if (!user) {
      setError("Silakan login!");
      setLoading(false);
      return;
    }
    fetchKeranjang();
  }, []);

  const fetchKeranjang = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/keranjang/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data.data.items);
      setLoading(false);
      window.dispatchEvent(new Event("keranjangChanged"));
    } catch (err) {
      setError("Gagal memuat keranjang");
      setLoading(false);
    }
  };

  const updateQty = async (idItem, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(`http://localhost:5000/api/user/keranjang/${idItem}`, { qty: newQty }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchKeranjang();
      window.dispatchEvent(new Event("keranjangChanged"));
    } catch (err) {
      alert("Gagal update jumlah");
    }
  };

  const hapusItem = async (idItem) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/keranjang/${idItem}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchKeranjang();
      window.dispatchEvent(new Event("keranjangChanged"));
    } catch (err) {
      alert("Gagal menghapus item");
    }
  };

  const tambahJumlah = (item) => {
    if (item.qty >= item.stok) {
      alert("Stok tidak mencukupi.");
      return;
    }
    updateQty(item.id_itemkeranjang, item.qty + 1);
  };
  const kurangJumlah = (item) => {
    if (item.qty <= 1) {
      hapusItem(item.id_itemkeranjang);
      return;
    }
    updateQty(item.id_itemkeranjang, item.qty - 1);
  };

  const kosongkanKeranjang = async () => {
    for (let item of items) {
      await axios.delete(`http://localhost:5000/api/user/keranjang/${item.id_itemkeranjang}`, { headers: { Authorization: `Bearer ${token}` } });
    }
    await fetchKeranjang();
    window.dispatchEvent(new Event("keranjangChanged"));
  };

  const totalItem = items.reduce((total, item) => total + item.qty, 0);
  const subtotal = items.reduce((total, item) => total + item.harga_kopi * item.qty, 0);
  const total = subtotal + (items.length > 0 ? ongkir : 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Keranjang kosong.");
      return;
    }
    navigate("/home/checkout");
  };

  if (loading)
    return (
      <main className={`min-h-screen ${bg} font-body flex items-center justify-center`}>
        <div className={`px-8 py-4 rounded-full border ${borderColor} ${cardBg} text-sm uppercase tracking-wider animate-pulse shadow-lg`}>Memuat keranjang...</div>
      </main>
    );

  if (error && !user)
    return (
      <main className={`min-h-screen ${bg} font-body flex items-center justify-center`}>
        <div className={`text-center ${cardBg} p-8 rounded-2xl border ${borderColor} shadow-xl max-w-md`}>
          <h2 className="font-serif text-xl font-bold mb-2 text-[#C77A23]">Akses Terbatas</h2>
          <p className={`text-sm mb-6 ${textMuted}`}>{error}</p>
          <button onClick={() => navigate("/login")} className="caramel-btn px-6 py-3 text-xs">
            Login
          </button>
        </div>
      </main>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; }
        .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; transition: all 0.3s ease; font-family: 'Roboto', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        .caramel-btn:hover { background: #3A2F2B; }
        .cart-item { border-radius: 12px; border: 1px solid rgba(199,122,35,0.2); transition: all 0.3s ease; }
        .cart-item:hover { border-color: rgba(199,122,35,0.4); }
      `}</style>

      <main className={`min-h-screen ${bg} font-body py-16`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <section className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C77A23] font-medium mb-2">Shopping Cart</p>
            <h1 className={`font-serif text-4xl md:text-6xl font-bold leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
              MY <span className="text-[#C77A23] italic">CART</span>
            </h1>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <section className="lg:col-span-2">
              <div className="flex justify-between items-end mb-6">
                <h2 className={`font-body font-bold text-lg uppercase tracking-wider ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Daftar Belanja ({totalItem} Item)</h2>
                {items.length > 0 && (
                  <button onClick={kosongkanKeranjang} className="text-xs text-red-400 font-body font-medium uppercase hover:text-red-600 transition-colors">
                    Kosongkan
                  </button>
                )}
              </div>
              <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-xl divide-y divide-[#C77A23]/10`}>
                {items.length === 0 ? (
                  <div className="p-12 text-center">
                    <h2 className={`font-serif text-xl font-bold mb-2 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Keranjang Kosong</h2>
                    <button onClick={() => navigate("/home/produk")} className="caramel-btn px-6 py-3 text-xs mt-6">
                      Mulai Belanja
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id_itemkeranjang} className="cart-item flex flex-col sm:flex-row sm:items-center gap-6 p-6 m-2">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#C77A23]/20">
                        <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-body font-bold text-md">{item.nama_kopi}</h3>
                        <p className={`text-sm mt-1 ${textMuted}`}>{formatRupiah(item.harga_kopi)}</p>
                      </div>
                      <div className={`flex items-center rounded-xl border ${borderColor} overflow-hidden w-fit`}>
                        <button onClick={() => kurangJumlah(item)} className="px-3 py-1.5 font-body text-sm hover:bg-red-400/20 transition-colors">
                          -
                        </button>
                        <span className={`px-4 font-body font-bold text-xs ${isDark ? "bg-[#3A2F2B]" : "bg-[#E8D8C6]"}`}>{item.qty}</span>
                        <button onClick={() => tambahJumlah(item)} className="px-3 py-1.5 font-body text-sm hover:bg-[#C77A23]/20 transition-colors">
                          +
                        </button>
                      </div>
                      <div className="sm:w-28">
                        <p className="text-md font-body font-bold text-[#C77A23]">{formatRupiah(item.harga_kopi * item.qty)}</p>
                      </div>
                      <button onClick={() => hapusItem(item.id_itemkeranjang)} className="rounded-xl bg-red-400/10 text-red-400 p-2 font-body text-xs uppercase font-medium hover:bg-red-400 hover:text-white transition-all">
                        Hapus
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <aside className="h-fit sticky top-28">
              <div className={`${cardBg} rounded-2xl border ${borderColor} p-6 shadow-xl`}>
                <h2 className={`font-serif text-lg font-bold mb-6 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Ringkasan</h2>
                <div className="space-y-3 text-xs font-body uppercase mb-6">
                  <div className="flex justify-between border-b border-dashed border-[#C77A23]/20 pb-2">
                    <span className={textMuted}>Item</span>
                    <span className="font-medium">{totalItem} Porsi</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-[#C77A23]/20 pb-2">
                    <span className={textMuted}>Subtotal</span>
                    <span className="font-medium">{formatRupiah(subtotal)}</span>
                  </div>
                  {items.length > 0 && (
                    <div className="flex justify-between border-b border-dashed border-[#C77A23]/20 pb-2">
                      <span className={textMuted}>Ongkir</span>
                      <span className="font-medium">{formatRupiah(ongkir)}</span>
                    </div>
                  )}
                </div>
                <div className="bg-[#C77A23] rounded-xl p-4 mb-6 text-white">
                  <div className="flex justify-between">
                    <span className="font-body font-bold text-xs uppercase">Total</span>
                    <span className="font-body font-bold text-xl">{formatRupiah(items.length === 0 ? 0 : total)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} disabled={items.length === 0} className="w-full h-12 rounded-xl bg-[#3A2F2B] text-white font-body font-bold uppercase text-xs hover:bg-[#C77A23] transition-all disabled:opacity-30">
                  Checkout
                </button>
                <button onClick={() => navigate("/home/produk")} className={`w-full h-12 rounded-xl border ${borderColor} ${cardBg} font-body font-bold uppercase text-xs mt-3 hover:bg-[#C77A23]/5 transition-all`}>
                  Lanjut Belanja
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default Keranjang;
