import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    alamat: "",
    pembayaran: "Transfer Bank",
  });

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate("/login");
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
    } catch (err) {
      console.error("Gagal ambil keranjang:", err);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  };

  const subtotal = items.reduce((total, item) => total + item.harga_kopi * item.qty, 0);
  const ongkir = items.length > 0 ? 10000 : 0;
  const diskon = subtotal >= 100000 ? 10000 : 0;
  const total = subtotal + ongkir - diskon;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const pilihMetode = (metode) => {
    setFormData({ ...formData, pembayaran: metode });
  };

  const handleCheckout = () => {
    if (!formData.nama.trim()) {
      setValidationMessage("Nama penerima wajib diisi.");
      setShowValidationModal(true);
      return;
    }
    if (!formData.telepon.trim()) {
      setValidationMessage("Nomor telepon wajib diisi.");
      setShowValidationModal(true);
      return;
    }
    if (!formData.alamat.trim()) {
      setValidationMessage("Alamat pengiriman wajib diisi.");
      setShowValidationModal(true);
      return;
    }
    setShowPaymentModal(true);
  };

  const verifyPayment = async () => {
    setIsVerifying(true);
    try {
      await axios.post(
        "http://localhost:5000/api/user/checkout",
        {
          userId: user.id,
          metodePembayaran: formData.pembayaran,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      window.dispatchEvent(new Event("keranjangChanged"));
      setIsVerifying(false);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal checkout");
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.4em] font-black text-amber-700 mb-4">Premium Checkout</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            COMPLETE <span className="text-amber-700">ORDER</span>
          </h1>
        </section>

        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-10">
          <div className="space-y-8">
            <section className="bg-stone-50 rounded-[3rem] p-8 border border-stone-100">
              <h2 className="text-3xl font-black mb-6">Alamat Pengiriman</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase text-stone-500 mb-3">Nama Penerima</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full rounded-2xl border px-5 py-4 outline-none focus:border-amber-600" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-stone-500 mb-3">Nomor Telepon</label>
                  <input type="text" name="telepon" value={formData.telepon} onChange={handleChange} className="w-full rounded-2xl border px-5 py-4 outline-none focus:border-amber-600" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-stone-500 mb-3">Alamat Lengkap</label>
                  <textarea rows="4" name="alamat" value={formData.alamat} onChange={handleChange} className="w-full rounded-2xl border px-5 py-4 outline-none focus:border-amber-600" />
                </div>
              </div>
            </section>

            <section className="bg-stone-50 rounded-[3rem] p-8 border border-stone-100">
              <h2 className="text-3xl font-black mb-6">Pilih Pembayaran</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {["Transfer Bank", "E-Wallet", "QRIS", "Cash On Delivery"].map((metode) => (
                  <button
                    key={metode}
                    onClick={() => pilihMetode(metode)}
                    className={`rounded-[2rem] p-5 text-left border-2 transition-all ${formData.pembayaran === metode ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-200 hover:border-amber-600"}`}
                  >
                    <p className="font-black">{metode}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-stone-50 rounded-[3rem] p-8 border border-stone-100">
              <h2 className="text-3xl font-black mb-6">Produk Dipesan</h2>
              {items.length === 0 ? (
                <p className="text-center py-10 text-stone-500">Keranjang kosong</p>
              ) : (
                items.map((item) => (
                  <div key={item.id_itemkeranjang} className="flex items-center gap-4 bg-white rounded-2xl p-4 mb-3">
                    <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200"} alt={item.nama_kopi} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-black">{item.nama_kopi}</h3>
                      <p className="text-stone-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-black text-amber-700">{formatRupiah(item.harga_kopi * item.qty)}</p>
                  </div>
                ))
              )}
            </section>
          </div>

          <div>
            <div className="sticky top-28 bg-stone-900 text-white rounded-[3rem] p-8">
              <h2 className="text-3xl font-black mb-8">Ringkasan</h2>
              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="font-bold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Ongkir</span>
                  <span className="font-bold">{formatRupiah(ongkir)}</span>
                </div>
                {diskon > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Diskon</span>
                    <span className="font-bold text-green-400">- {formatRupiah(diskon)}</span>
                  </div>
                )}
                <hr className="border-stone-700" />
                <div className="flex justify-between">
                  <span className="text-lg font-black">Total</span>
                  <span className="text-3xl font-black text-amber-500">{formatRupiah(total)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={items.length === 0} className="w-full mt-8 bg-amber-600 hover:bg-amber-500 h-14 rounded-2xl font-black uppercase disabled:bg-stone-700">
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {showValidationModal && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-5">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center">
            <p className="text-5xl mb-4">!</p>
            <h2 className="text-2xl font-black mb-3">Data Belum Lengkap</h2>
            <p className="text-stone-500 mb-8">{validationMessage}</p>
            <button onClick={() => setShowValidationModal(false)} className="w-full h-14 rounded-2xl bg-stone-900 text-white font-black">
              OK
            </button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-5">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-black mb-4">Konfirmasi Pembayaran</h2>
            <p className="text-stone-500 mb-2">
              Total: <span className="font-black text-amber-700 text-xl">{formatRupiah(total)}</span>
            </p>
            <p className="text-stone-500 mb-6">Metode: {formData.pembayaran}</p>
            <button onClick={verifyPayment} disabled={isVerifying} className="w-full h-14 rounded-2xl bg-amber-600 text-white font-black">
              {isVerifying ? "Memproses..." : "Konfirmasi Bayar"}
            </button>
            <button onClick={() => setShowPaymentModal(false)} className="w-full mt-3 h-14 rounded-2xl border font-black">
              Batal
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-5">
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center">
            <p className="text-7xl mb-4">OK</p>
            <h2 className="text-3xl font-black mb-4">Pesanan Berhasil!</h2>
            <p className="text-stone-500 mb-8">Pesanan kamu sedang diproses.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/home/history");
              }}
              className="w-full h-14 rounded-2xl bg-stone-900 text-white font-black"
            >
              Lihat Riwayat
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
