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
  const [voucherMsg, setVoucherMsg] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({ nama: "", telepon: "", alamat: "", pembayaran: "Transfer Bank" });
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#2a2522]" : "bg-white";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";
  const borderColor = "border-[#C77A23]/20";
  const inputBg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-white text-[#3A2F2B]";

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

  const cekVoucher = async () => {
    if (!kodeVoucher.trim()) {
      setVoucherMsg({ type: "error", text: "Masukkan kode voucher terlebih dahulu!" });
      setVoucher(null);
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/user/voucher", { kode: kodeVoucher.toUpperCase(), subtotal, userId: user.id }, { headers: { Authorization: `Bearer ${token}` } });
      setVoucher(res.data.data);
      setVoucherMsg({ type: "success", text: `Voucher ${res.data.data.kode} berhasil! Diskon Rp ${res.data.data.diskon.toLocaleString("id-ID")}` });
    } catch (err) {
      setVoucher(null);
      setVoucherMsg({ type: "error", text: err.response?.data?.message || "Voucher tidak valid" });
    }
  };

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
      await axios.post(
        "http://localhost:5000/api/user/checkout",
        {
          userId: user.id,
          metodePembayaran: formData.pembayaran,
          diskon,
          voucherKode: voucher?.kode || null,
          total,
          subtotal,
          ongkir,
        },
        { headers: { Authorization: `Bearer ${token}` } },
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; }
        .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; transition: all 0.3s ease; font-family: 'Roboto', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        .caramel-btn:hover { background: #3A2F2B; }
        .checkout-input { border-radius: 10px; border: 1px solid rgba(199,122,35,0.3); transition: all 0.3s ease; }
        .checkout-input:focus { border-color: #C77A23; box-shadow: 0 0 0 3px rgba(199,122,35,0.1); outline: none; }
        .payment-btn { border-radius: 12px; border: 1px solid rgba(199,122,35,0.3); transition: all 0.3s ease; }
        .payment-btn.active { background: #C77A23; color: white; border-color: #C77A23; }
      `}</style>

      <main className={`min-h-screen ${bg} font-body py-16`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <section className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C77A23] font-medium mb-2">Premium Checkout</p>
            <h1 className={`font-serif text-4xl md:text-6xl font-bold leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
              COMPLETE <span className="text-[#C77A23] italic">ORDER</span>
            </h1>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-12">
            <div className="space-y-12">
              {/* ALAMAT */}
              <section className={`${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
                <h2 className="font-serif text-xl font-bold mb-8 text-[#C77A23]">Alamat Pengiriman</h2>
                <div className="space-y-6">
                  {[
                    { label: "Nama Penerima", name: "nama", type: "text" },
                    { label: "Nomor Telepon", name: "telepon", type: "text" },
                    { label: "Alamat Lengkap", name: "alamat", type: "textarea" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-body font-medium mb-2">
                        <span className="text-red-400">*</span> {f.label}
                      </label>
                      {f.type === "textarea" ? (
                        <textarea rows="4" name={f.name} value={formData[f.name]} onChange={handleChange} className={`checkout-input w-full ${inputBg} px-4 py-3 text-sm resize-none`} />
                      ) : (
                        <input type="text" name={f.name} value={formData[f.name]} onChange={handleChange} className={`checkout-input w-full ${inputBg} px-4 py-3 text-sm`} />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* VOUCHER */}
              <section className={`${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
                <h2 className="font-serif text-xl font-bold mb-6 text-[#C77A23]">Kode Voucher</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="CONTOH: KOPIHEMAT"
                    value={kodeVoucher}
                    onChange={(e) => {
                      setKodeVoucher(e.target.value.toUpperCase());
                      setVoucherMsg({ type: "", text: "" });
                    }}
                    className={`checkout-input flex-1 ${inputBg} px-4 py-3 text-sm font-medium uppercase`}
                    disabled={!!voucher}
                  />
                  {voucher ? (
                    <button onClick={hapusVoucher} className="px-8 py-3 rounded-xl bg-red-400/10 text-red-400 font-body text-sm font-medium uppercase hover:bg-red-400 hover:text-white transition-all">
                      Hapus
                    </button>
                  ) : (
                    <button onClick={cekVoucher} className="caramel-btn px-8 py-3 text-sm">
                      Pakai
                    </button>
                  )}
                </div>
                {voucherMsg.text && <div className={`mt-4 rounded-xl px-4 py-3 font-body text-xs font-medium ${voucherMsg.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{voucherMsg.text}</div>}
                {voucher && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-body uppercase font-medium text-[#C77A23]">
                    <span>Min: Rp {Number(voucher.min_belanja).toLocaleString("id-ID")}</span>
                    <span>|</span>
                    <span>Max: Rp {Number(voucher.max_diskon).toLocaleString("id-ID")}</span>
                  </div>
                )}
              </section>

              {/* PEMBAYARAN */}
              <section className={`${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
                <h2 className="font-serif text-xl font-bold mb-6 text-[#C77A23]">Pilih Pembayaran</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {["Transfer Bank", "E-Wallet", "QRIS", "Cash On Delivery"].map((metode) => (
                    <button
                      key={metode}
                      onClick={() => pilihMetode(metode)}
                      className={`payment-btn p-5 text-left font-body font-medium text-xs uppercase tracking-wider hover:bg-[#C77A23]/5 transition-all ${formData.pembayaran === metode ? "active" : isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}
                    >
                      {metode}
                    </button>
                  ))}
                </div>
              </section>

              {/* PRODUK */}
              <section className={`${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
                <h2 className="font-serif text-xl font-bold mb-6 text-[#C77A23]">Produk Dipesan</h2>
                {items.length === 0 ? (
                  <p className={`text-center py-6 text-sm ${textMuted}`}>Keranjang kosong</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id_itemkeranjang} className="flex items-center gap-4 py-4 border-t border-dashed border-[#C77A23]/20">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#C77A23]/20">
                        <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200"} alt={item.nama_kopi} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-body font-bold text-sm">{item.nama_kopi}</h3>
                        <p className={`text-xs ${textMuted}`}>Jumlah: {item.qty}</p>
                      </div>
                      <p className="font-body font-bold text-sm text-[#C77A23]">{formatRupiah(item.harga_kopi * item.qty)}</p>
                    </div>
                  ))
                )}
              </section>
            </div>

            {/* RINGKASAN */}
            <aside className="h-fit sticky top-28">
              <div className={`${cardBg} rounded-2xl border ${borderColor} p-6 shadow-xl`}>
                <h2 className={`font-serif text-lg font-bold mb-8 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Ringkasan</h2>
                <div className="space-y-3 text-xs font-body uppercase mb-6">
                  <div className="flex justify-between border-b border-dashed border-[#C77A23]/20 pb-2">
                    <span className={textMuted}>Subtotal</span>
                    <span className="font-medium">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-[#C77A23]/20 pb-2">
                    <span className={textMuted}>Ongkir</span>
                    <span className="font-medium">{formatRupiah(ongkir)}</span>
                  </div>
                  {diskon > 0 && (
                    <div className="flex justify-between border-b border-dashed border-[#C77A23]/20 pb-2">
                      <span className={textMuted}>Diskon</span>
                      <span className="font-medium text-green-500">- {formatRupiah(diskon)}</span>
                    </div>
                  )}
                </div>
                <div className="bg-[#C77A23] rounded-xl p-4 mb-8 text-white">
                  <div className="flex justify-between">
                    <span className="font-body font-bold text-xs uppercase">Total</span>
                    <span className="font-body font-bold text-xl">{formatRupiah(total)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} disabled={items.length === 0} className="caramel-btn w-full h-14 text-sm disabled:opacity-30">
                  Bayar Sekarang
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* MODALS */}
        {[
          { show: showValidationModal, title: "Data Belum Lengkap", msg: validationMessage, onConfirm: () => setShowValidationModal(false) },
          {
            show: showPaymentModal,
            title: "Konfirmasi Pembayaran",
            msg: `Total: ${formatRupiah(total)} | ${formData.pembayaran}${diskon > 0 ? ` | Diskon: ${formatRupiah(diskon)}` : ""}`,
            onConfirm: verifyPayment,
            loading: isVerifying,
            onCancel: () => setShowPaymentModal(false),
          },
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
                <div className={`${cardBg} rounded-2xl border ${borderColor} p-8 max-w-sm w-full text-center shadow-2xl`}>
                  <h2 className={`font-serif text-xl font-bold mb-2 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{m.title}</h2>
                  <p className={`text-sm mb-6 ${textMuted}`}>{m.msg}</p>
                  <div className="space-y-3">
                    <button onClick={m.onConfirm} disabled={m.loading} className="caramel-btn w-full h-12 text-xs">
                      {m.loading ? "Memproses..." : "OK"}
                    </button>
                    {m.onCancel && (
                      <button onClick={m.onCancel} className={`w-full h-12 rounded-xl border ${borderColor} font-body text-xs uppercase font-medium hover:bg-[#C77A23]/5 transition-all`}>
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
        )}
      </main>
    </>
  );
};

export default Checkout;
