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

  const b = isDark ? "border-white" : "border-[#121212]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#121212]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-stone-50";

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
      <main className={`min-h-screen ${bg} font-mono flex items-center justify-center`}>
        <div className={`px-6 py-3 border-4 ${b} ${cardBg} font-bold animate-pulse uppercase`}>Memuat keranjang...</div>
      </main>
    );

  if (error && !user)
    return (
      <main className={`min-h-screen ${bg} font-mono flex items-center justify-center`}>
        <div className={`text-center ${cardBg} p-8 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} max-w-md`}>
          <h2 className="text-xl font-black uppercase mb-2">Akses Terbatas</h2>
          <p className="text-xs uppercase opacity-60 mb-6">{error}</p>
          <button onClick={() => navigate("/login")} className="bg-[#FFB703] text-black border-2 border-[#121212] px-6 py-3 font-black text-xs uppercase">
            Login
          </button>
        </div>
      </main>
    );

  return (
    <main className={`min-h-screen ${bg} font-mono py-16`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest font-bold mb-2">Shopping Cart</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            MY <span className={`px-2 bg-[#FFB703] text-black border-2 ${b} inline-block shadow-[4px_4px_0px_0px] ${shadow}`}>CART</span>
          </h1>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-black text-lg uppercase">Daftar Belanja ({totalItem} Item)</h2>
              {items.length > 0 && (
                <button onClick={kosongkanKeranjang} className="text-xs text-red-400 font-black uppercase border-b-2 border-red-400 hover:text-red-600 transition-colors">
                  Kosongkan
                </button>
              )}
            </div>
            <div className={`${cardBg} border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} divide-y-4`}>
              {items.length === 0 ? (
                <div className={`p-12 text-center ${mutedBg}`}>
                  <h2 className="text-xl font-black uppercase mb-2">Keranjang Kosong</h2>
                  <button onClick={() => navigate("/home/produk")} className="bg-[#00F5D4] text-black border-2 border-[#121212] px-6 py-3 font-black text-xs uppercase mt-6">
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id_itemkeranjang} className="flex flex-col sm:flex-row sm:items-center gap-6 p-6">
                    <div className={`w-20 h-20 border-2 ${b} overflow-hidden flex-shrink-0`}>
                      <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-md uppercase">{item.nama_kopi}</h3>
                      <p className="text-sm font-bold opacity-60 mt-1">{formatRupiah(item.harga_kopi)}</p>
                    </div>
                    <div className={`flex items-center border-2 ${b} ${cardBg} w-fit`}>
                      <button onClick={() => kurangJumlah(item)} className="px-3 py-1.5 font-black text-sm hover:bg-red-400 border-r-2 transition-colors">
                        -
                      </button>
                      <span className={`px-4 font-black text-xs ${mutedBg}`}>{item.qty}</span>
                      <button onClick={() => tambahJumlah(item)} className="px-3 py-1.5 font-black text-sm hover:bg-[#00F5D4] border-l-2 transition-colors">
                        +
                      </button>
                    </div>
                    <div className="sm:w-28">
                      <p className={`text-md font-black bg-[#FFB703] text-black border-2 ${b} px-2 py-0.5 inline-block`}>{formatRupiah(item.harga_kopi * item.qty)}</p>
                    </div>
                    <button onClick={() => hapusItem(item.id_itemkeranjang)} className="border-2 border-[#121212] bg-red-400 text-black p-2 font-black text-xs uppercase hover:bg-black hover:text-white transition-colors">
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="h-fit sticky top-28">
            <div className={`${cardBg} border-4 ${b} p-6 shadow-[6px_6px_0px_0px] ${shadow}`}>
              <h2 className="text-lg font-black uppercase mb-6">Ringkasan</h2>
              <div className="space-y-3 text-xs font-bold uppercase mb-6">
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span className="opacity-50">Item</span>
                  <span>{totalItem} Porsi</span>
                </div>
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span className="opacity-50">Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                {items.length > 0 && (
                  <div className="flex justify-between border-b border-dashed pb-2">
                    <span className="opacity-50">Ongkir</span>
                    <span>{formatRupiah(ongkir)}</span>
                  </div>
                )}
              </div>
              <div className={`bg-[#FFB703] border-3 ${b} p-4 mb-6 text-black`}>
                <div className="flex justify-between">
                  <span className="font-black text-xs uppercase">Total</span>
                  <span className="font-black text-xl">{formatRupiah(items.length === 0 ? 0 : total)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className={`w-full h-12 border-4 ${b} bg-[#121212] text-white font-black uppercase text-xs hover:bg-[#00F5D4] hover:text-black transition-all disabled:opacity-30`}
              >
                Checkout
              </button>
              <button onClick={() => navigate("/home/produk")} className={`w-full h-12 border-4 ${b} ${cardBg} font-black uppercase text-xs mt-3 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}>
                Lanjut Belanja
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Keranjang;
