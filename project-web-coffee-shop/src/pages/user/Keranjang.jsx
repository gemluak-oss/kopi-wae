import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Keranjang = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ongkir = 10000;
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  };

  useEffect(() => {
    if (!user) {
      setError("Silakan login terlebih dahulu!");
      setLoading(false);
      return;
    }
    fetchKeranjang();
  }, []);

  const fetchKeranjang = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/keranjang/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await axios.put(
        `http://localhost:5000/api/user/keranjang/${idItem}`,
        { qty: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      await fetchKeranjang();
      window.dispatchEvent(new Event("keranjangChanged"));
    } catch (err) {
      alert("Gagal update jumlah");
    }
  };

  const hapusItem = async (idItem) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/keranjang/${idItem}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await axios.delete(`http://localhost:5000/api/user/keranjang/${item.id_itemkeranjang}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await fetchKeranjang();
    window.dispatchEvent(new Event("keranjangChanged"));
  };

  const totalItem = items.reduce((total, item) => total + item.qty, 0);
  const subtotal = items.reduce((total, item) => total + item.harga_kopi * item.qty, 0);
  const total = subtotal + (items.length > 0 ? ongkir : 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }
    navigate("/home/checkout");
  };

  if (loading)
    return (
      <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );

  if (error && !user)
    return (
      <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-md border border-[#F0E4D0]">
          <h2 className="text-xl font-bold text-stone-800 mb-2">Akses Terbatas</h2>
          <p className="text-stone-500 mb-6">{error}</p>
          <button onClick={() => navigate("/login")} className="bg-amber-700 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-800 transition">
            Login Sekarang
          </button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.4em] font-black text-amber-700 mb-4">Shopping Cart</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-stone-800">
            MY <span className="text-amber-700">CART</span>
          </h1>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-stone-800 text-xl">Daftar Produk ({totalItem} item)</h2>
              {items.length > 0 && (
                <button onClick={kosongkanKeranjang} className="text-sm text-red-500 hover:text-red-700 font-bold">
                  Kosongkan
                </button>
              )}
            </div>

            <div className="bg-white rounded-[3rem] overflow-hidden shadow-lg border border-[#F0E4D0]">
              {items.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black mb-2 text-stone-800">Keranjang kosong</h2>
                  <button onClick={() => navigate("/home/produk")} className="bg-amber-700 text-white px-8 py-3 rounded-full font-bold mt-4 hover:bg-amber-800 transition">
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id_itemkeranjang} className="flex items-center gap-4 px-5 py-5 border-t border-[#F0E4D0] hover:bg-[#FFF9F0] transition-colors">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 shadow-inner">
                      <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-800">{item.nama_kopi}</h3>
                      <p className="text-amber-700 font-bold">{formatRupiah(item.harga_kopi)}</p>
                    </div>
                    <div className="flex items-center border border-[#F0E4D0] rounded-xl overflow-hidden">
                      <button onClick={() => kurangJumlah(item)} className="px-3 py-1.5 font-bold hover:bg-stone-100">
                        -
                      </button>
                      <span className="px-3 font-bold bg-[#FFF9F0]">{item.qty}</span>
                      <button onClick={() => tambahJumlah(item)} className="px-3 py-1.5 font-bold hover:bg-stone-100">
                        +
                      </button>
                    </div>
                    <p className="font-bold text-amber-700 w-24 text-right">{formatRupiah(item.harga_kopi * item.qty)}</p>
                    <button onClick={() => hapusItem(item.id_itemkeranjang)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="h-fit sticky top-28">
            <div className="bg-white rounded-[3rem] p-8 shadow-lg border border-[#F0E4D0]">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Ringkasan Belanja</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Item</span>
                  <span className="font-bold text-stone-800">{totalItem} porsi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-bold text-stone-800">{formatRupiah(subtotal)}</span>
                </div>
                {items.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ongkir</span>
                    <span className="font-bold text-stone-800">{formatRupiah(ongkir)}</span>
                  </div>
                )}
              </div>
              <div className="bg-[#FFF9F0] rounded-2xl p-4 mb-6 border border-[#F0E4D0]">
                <div className="flex justify-between">
                  <span className="font-black text-xs uppercase text-stone-600">Total</span>
                  <span className="font-black text-amber-700 text-2xl">{formatRupiah(items.length === 0 ? 0 : total)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={items.length === 0} className="w-full py-4 rounded-2xl font-bold bg-stone-800 text-white hover:bg-amber-700 transition disabled:bg-stone-200 disabled:text-stone-400 shadow-md">
                Checkout
              </button>
              <button onClick={() => navigate("/home/produk")} className="w-full mt-4 border-2 border-[#F0E4D0] py-4 rounded-2xl font-bold text-stone-600 hover:border-amber-600 hover:text-amber-700 transition">
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
