import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = ({ isDark }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [kodeVoucher, setKodeVoucher] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [voucherMsg, setVoucherMsg] = useState({ type: "", text: "" }); // ✅ state pesan voucher

  const [formData, setFormData] = useState({ nama: "", telepon: "", alamat: "", pembayaran: "Transfer Bank" });
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#121212]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#121212]";
  const darkBg = isDark ? "bg-gray-700" : "bg-[#121212]";

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
      const res = await axios.get(`http://localhost:5000/api/user/keranjang/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data.data.items);
    } catch (err) {}
  };

  // ✅ Fungsi cek voucher dengan notif bagus
  const cekVoucher = async () => {
    if (!kodeVoucher.trim()) {
      setVoucherMsg({ type: "error", text: "Masukkan kode voucher terlebih dahulu!" });
      setVoucher(null);
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/user/voucher", { kode: kodeVoucher.toUpperCase(), subtotal, userId: user.id }, { headers: { Authorization: `Bearer ${token}` } });
      setVoucher(res.data.data);
      setVoucherMsg({ type: "success", text: `Voucher ${res.data.data.kode} berhasil digunakan! Diskon Rp ${res.data.data.diskon.toLocaleString("id-ID")}` });
    } catch (err) {
      setVoucher(null);
      setVoucherMsg({ type: "error", text: err.response?.data?.message || "Voucher tidak valid" });
    }
  };

  // ✅ Hapus voucher
  const hapusVoucher = () => {
    setVoucher(null);
    setVoucherMsg({ type: "", text: "" });
    setKodeVoucher("");
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));
  const subtotal = items.reduce((total, item) => total + item.harga_kopi * item.qty, 0);
  const ongkir = items.length > 0 ? 10000 : 0;
  const diskon = voucher ? voucher.diskon : 0;
  const total = subtotal + ongkir - diskon;
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const pilihMetode = (metode) => setFormData({ ...formData, pembayaran: metode });

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
      if (voucher) {
        await axios.put(`http://localhost:5000/api/user/voucher/kurang/${voucher.kode}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      await axios.post("http://localhost:5000/api/user/checkout", { userId: user.id, metodePembayaran: formData.pembayaran }, { headers: { Authorization: `Bearer ${token}` } });
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
    <main className={`min-h-screen ${bg} font-mono py-16`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest font-bold mb-2">Premium Checkout</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            COMPLETE <span className={`px-2 bg-[#FFB703] text-black border-2 ${b} inline-block shadow-[4px_4px_0px_0px] ${shadow}`}>ORDER</span>
          </h1>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-12">
          <div className="space-y-12">
            {/* ALAMAT */}
            <section className={`${cardBg} border-4 ${b} p-8 shadow-[8px_8px_0px_0px] ${shadow}`}>
              <h2 className="text-2xl font-black uppercase mb-8 bg-[#00F5D4] p-2 inline-block border-2 border-[#121212] text-black">Alamat Pengiriman</h2>
              <div className="space-y-6">
                {[
                  { label: "Nama Penerima", name: "nama", type: "text" },
                  { label: "Nomor Telepon", name: "telepon", type: "text" },
                  { label: "Alamat Lengkap", name: "alamat", type: "textarea" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-black uppercase mb-2">
                      <span className="text-red-500">*</span> {f.label}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea
                        rows="4"
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        className={`w-full ${cardBg} border-4 ${b} px-4 py-4 font-bold text-sm outline-none placeholder-stone-400 shadow-[4px_4px_0px_0px] ${shadow} focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all resize-none`}
                      />
                    ) : (
                      <input
                        type="text"
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        className={`w-full ${cardBg} border-4 ${b} px-4 py-4 font-bold text-sm outline-none placeholder-stone-400 shadow-[4px_4px_0px_0px] ${shadow} focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* VOUCHER */}
            <section className={`${cardBg} border-4 ${b} p-8 shadow-[8px_8px_0px_0px] ${shadow}`}>
              <h2 className="text-2xl font-black uppercase mb-6">Kode Voucher</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="CONTOH: KOPIHEMAT"
                  value={kodeVoucher}
                  onChange={(e) => {
                    setKodeVoucher(e.target.value.toUpperCase());
                    setVoucherMsg({ type: "", text: "" });
                  }}
                  className={`flex-1 ${cardBg} border-4 ${b} px-4 py-4 font-black text-sm outline-none uppercase shadow-[4px_4px_0px_0px] ${shadow} transition-all`}
                  disabled={!!voucher}
                />
                {voucher ? (
                  <button
                    onClick={hapusVoucher}
                    className="bg-red-400 text-black border-4 border-[#121212] px-8 py-4 font-black text-sm uppercase shadow-[4px_4px_0px_0px_#121212] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Hapus
                  </button>
                ) : (
                  <button
                    onClick={cekVoucher}
                    className="bg-[#FFB703] text-black border-4 border-[#121212] px-8 py-4 font-black text-sm uppercase shadow-[4px_4px_0px_0px_#121212] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Pakai
                  </button>
                )}
              </div>

              {/* ✅ Notif voucher */}
              {voucherMsg.text && (
                <div className={`mt-4 border-4 px-4 py-3 font-black text-xs uppercase ${voucherMsg.type === "success" ? "bg-green-100 border-green-600 text-green-700" : "bg-red-100 border-red-500 text-red-700"}`}>{voucherMsg.text}</div>
              )}

              {/* Info voucher aktif */}
              {voucher && (
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase opacity-70">
                  <span>Min Belanja: Rp {Number(voucher.min_belanja).toLocaleString("id-ID")}</span>
                  <span>|</span>
                  <span>Max Potongan: Rp {Number(voucher.max_diskon).toLocaleString("id-ID")}</span>
                </div>
              )}
            </section>

            {/* PEMBAYARAN */}
            <section className={`${cardBg} border-4 ${b} p-8 shadow-[8px_8px_0px_0px] ${shadow}`}>
              <h2 className="text-2xl font-black uppercase mb-6">Pilih Pembayaran</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {["Transfer Bank", "E-Wallet", "QRIS", "Cash On Delivery"].map((metode) => (
                  <button
                    key={metode}
                    onClick={() => pilihMetode(metode)}
                    className={`p-5 text-left border-4 ${b} transition-all font-black uppercase text-xs shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${formData.pembayaran === metode ? `${darkBg} text-white` : `${cardBg} text-current`}`}
                  >
                    {metode}
                  </button>
                ))}
              </div>
            </section>

            {/* PRODUK */}
            <section className={`${cardBg} border-4 ${b} p-8 shadow-[8px_8px_0px_0px] ${shadow}`}>
              <h2 className="text-2xl font-black uppercase mb-6">Produk Dipesan</h2>
              {items.length === 0 ? (
                <p className="text-center py-6 text-xs opacity-50">Keranjang kosong</p>
              ) : (
                items.map((item) => (
                  <div key={item.id_itemkeranjang} className="flex items-center gap-4 py-4 border-t-2 border-dashed">
                    <div className={`w-16 h-16 border-2 ${b} flex-shrink-0`}>
                      <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-sm uppercase">{item.nama_kopi}</h3>
                      <p className="text-xs opacity-50">Jumlah: {item.qty}</p>
                    </div>
                    <p className={`font-black text-sm border-2 ${b} px-2 py-0.5`}>{formatRupiah(item.harga_kopi * item.qty)}</p>
                  </div>
                ))
              )}
            </section>
          </div>

          {/* RINGKASAN */}
          <aside className="h-fit sticky top-28">
            <div className={`${darkBg} text-white border-4 ${b} p-6 shadow-[8px_8px_0px_0px] ${shadow}`}>
              <h2 className="text-xl font-black uppercase mb-8">Ringkasan</h2>
              <div className="space-y-3 text-xs font-bold uppercase mb-6">
                <div className="flex justify-between border-b border-stone-700 pb-2">
                  <span className="opacity-60">Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-stone-700 pb-2">
                  <span className="opacity-60">Ongkir</span>
                  <span>{formatRupiah(ongkir)}</span>
                </div>
                {diskon > 0 && (
                  <div className="flex justify-between border-b border-stone-700 pb-2">
                    <span className="opacity-60">Diskon</span>
                    <span className="text-green-400">- {formatRupiah(diskon)}</span>
                  </div>
                )}
              </div>
              <div className="bg-white text-black border-4 border-[#121212] p-4 mb-8">
                <div className="flex justify-between">
                  <span className="font-black text-xs uppercase">Total</span>
                  <span className="font-black text-xl">{formatRupiah(total)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full h-14 border-4 border-[#121212] bg-[#00F5D4] text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#121212] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-30"
              >
                Bayar Sekarang
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* MODALS */}
      {[
        { show: showValidationModal, title: "Data Belum Lengkap", msg: validationMessage, onConfirm: () => setShowValidationModal(false) },
        { show: showPaymentModal, title: "Konfirmasi Pembayaran", msg: `Total: ${formatRupiah(total)} | ${formData.pembayaran}`, onConfirm: verifyPayment, loading: isVerifying, onCancel: () => setShowPaymentModal(false) },
        {
          show: showSuccessModal,
          title: "Pesanan Berhasil!",
          msg: "Pesanan kamu sedang disiapkan.",
          onConfirm: () => {
            setShowSuccessModal(false);
            navigate("/home/history");
          },
        },
      ].map(
        (m, i) =>
          m.show && (
            <div key={i} className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-5">
              <div className={`${cardBg} border-4 ${b} p-8 max-w-sm w-full text-center shadow-[10px_10px_0px_0px] ${shadow}`}>
                <h2 className="text-xl font-black uppercase mb-2">{m.title}</h2>
                <p className="text-xs opacity-60 mb-6">{m.msg}</p>
                <div className="space-y-3">
                  <button
                    onClick={m.onConfirm}
                    disabled={m.loading}
                    className="w-full h-12 border-4 border-[#121212] bg-[#00F5D4] text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#121212] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    {m.loading ? "Memproses..." : "OK"}
                  </button>
                  {m.onCancel && (
                    <button
                      onClick={m.onCancel}
                      className="w-full h-12 border-4 border-[#121212] bg-stone-100 text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_#121212] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          ),
      )}
    </main>
  );
};

export default Checkout;
