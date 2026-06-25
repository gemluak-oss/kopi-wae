import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime"; // ✅ import

const DetailProduk = ({ isDark }) => {
  const [jumlah, setJumlah] = useState(1);
  const [produkAktif, setProdukAktif] = useState(null);
  const [produkTerkait, setProdukTerkait] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#2a2522]" : "bg-white";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";
  const borderColor = "border-[#C77A23]/30";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchProduk(id);
    else {
      setError("Silakan pilih produk dari halaman Menu.");
      setIsLoading(false);
    }
  }, [id]);

  // ✅ Auto refresh
  useRealtime("produkUpdate", () => {
    if (id) fetchProduk(id);
  });

  const fetchProduk = async (produkId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/produk/${produkId}`);
      setProdukAktif(res.data.data);
      if (res.data.data.id_kategori) {
        const terkait = await axios.get(`http://localhost:5000/api/user/produk?kategori=${res.data.data.id_kategori}`);
        setProdukTerkait(terkait.data.data.filter((p) => p.id_kopi !== res.data.data.id_kopi).slice(0, 4));
      }
      setIsLoading(false);
    } catch (err) {
      setError("Produk tidak ditemukan");
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(angka));

  const kurangJumlah = () => {
    if (jumlah > 1) setJumlah(jumlah - 1);
  };
  const tambahJumlah = () => {
    if (jumlah < produkAktif.stok) setJumlah(jumlah + 1);
    else alert("Jumlah tidak boleh melebihi stok.");
  };

  const tambahKeKeranjang = async () => {
    if (!user) {
      alert("Silakan login!");
      navigate("/login");
      return;
    }
    if (produkAktif.stok <= 0) {
      alert("Stok habis.");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/user/keranjang", { userId: user.id, kopiId: produkAktif.id_kopi, qty: jumlah }, { headers: { Authorization: `Bearer ${token}` } });
      window.dispatchEvent(new Event("keranjangChanged"));
      alert(`${produkAktif.nama_kopi} ditambahkan!`);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal");
    }
  };

  const beliSekarang = async () => {
    if (!user) {
      alert("Silakan login!");
      navigate("/login");
      return;
    }
    await tambahKeKeranjang();
    navigate("/home/keranjang");
  };

  if (isLoading)
    return (
      <main className={`min-h-screen ${bg} font-body flex items-center justify-center`}>
        <div className={`px-8 py-4 rounded-full border ${borderColor} ${cardBg} text-sm uppercase tracking-wider animate-pulse shadow-lg`}>Memuat Produk...</div>
      </main>
    );

  if (error)
    return (
      <main className={`min-h-screen ${bg} font-body flex flex-col items-center justify-center`}>
        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-2xl max-w-md text-center`}>
          <h2 className="font-serif text-2xl font-bold mb-4 text-[#C77A23]">Error</h2>
          <p className={`text-sm mb-6 ${textMuted}`}>{error}</p>
          <button onClick={() => navigate("/home/produk")} className="caramel-btn px-8 py-3 text-sm">
            Kembali ke Menu
          </button>
        </div>
      </main>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; } .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; transition: all 0.3s ease; font-family: 'Roboto', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; } .caramel-btn:hover { background: #3A2F2B; }
        .card-related { border-radius: 12px; border: 1px solid rgba(199,122,35,0.2); transition: all 0.4s ease; overflow: hidden; } .card-related:hover { box-shadow: 0 10px 25px rgba(199,122,35,0.2); transform: translateY(-4px); }
      `}</style>

      <main className={`min-h-screen ${bg} font-body py-10`}>
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] mb-8 font-medium">
            <button onClick={() => navigate("/home")} className="hover:text-[#C77A23] transition-all">
              Beranda
            </button>
            <span className="opacity-30">/</span>
            <button onClick={() => navigate("/home/produk")} className="hover:text-[#C77A23] transition-all">
              Menu
            </button>
            <span className="opacity-30">/</span>
            <span className="text-[#C77A23]">{produkAktif.nama_kategori}</span>
          </nav>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className={`lg:col-span-5 ${cardBg} rounded-2xl border ${borderColor} p-3 shadow-xl relative h-fit`}>
              <span className={`absolute top-4 left-4 z-10 text-[10px] font-body font-medium px-3 py-1.5 rounded-full uppercase tracking-wider ${produkAktif.stok > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {produkAktif.stok > 0 ? "Tersedia" : "Habis"}
              </span>
              <div className="rounded-xl overflow-hidden">
                <img src={produkAktif.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={produkAktif.nama_kopi} className={`w-full aspect-square object-cover ${produkAktif.stok <= 0 ? "grayscale" : ""}`} />
              </div>
            </div>

            <div className={`lg:col-span-7 ${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
              <span className="inline-block text-[10px] font-body font-medium text-[#C77A23] uppercase tracking-[0.15em] mb-3 bg-[#C77A23]/10 px-3 py-1 rounded-full">{produkAktif.nama_kategori}</span>
              <h1 className={`font-serif text-3xl md:text-4xl font-bold mb-3 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{produkAktif.nama_kopi}</h1>
              {produkAktif.deskripsi && <p className={`font-body text-sm leading-relaxed mb-5 ${textMuted}`}>{produkAktif.deskripsi}</p>}
              <div className="inline-block bg-[#C77A23] text-white rounded-xl px-6 py-3 font-body text-2xl font-bold mb-6 shadow-lg shadow-[#C77A23]/20">{formatRupiah(produkAktif.harga_kopi)}</div>
              <div className="border-t border-dashed border-[#C77A23]/20 pt-5 mb-6">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-body uppercase tracking-wider ${textMuted}`}>Stok</span>
                  <span className={`text-xs font-body font-medium uppercase px-3 py-1 rounded-full ${produkAktif.stok > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {produkAktif.stok > 0 ? `${produkAktif.stok} Tersedia` : "Habis"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className={`flex items-center rounded-xl border ${borderColor} ${cardBg} h-12`}>
                  <button onClick={kurangJumlah} className="w-10 h-full font-body text-lg hover:bg-[#C77A23]/10 rounded-l-xl transition-all">
                    -
                  </button>
                  <span className="w-10 text-center font-body font-bold text-sm">{jumlah}</span>
                  <button onClick={tambahJumlah} className="w-10 h-full font-body text-lg hover:bg-[#C77A23]/10 rounded-r-xl transition-all">
                    +
                  </button>
                </div>
                <button
                  onClick={tambahKeKeranjang}
                  disabled={produkAktif.stok <= 0}
                  className={`flex-1 rounded-xl border ${borderColor} ${cardBg} h-12 font-body text-xs uppercase tracking-wider hover:bg-[#C77A23] hover:text-white transition-all disabled:opacity-30`}
                >
                  + Keranjang
                </button>
                <button onClick={beliSekarang} disabled={produkAktif.stok <= 0} className="flex-1 caramel-btn h-12 text-xs disabled:opacity-30 disabled:cursor-not-allowed">
                  Beli Langsung
                </button>
              </div>
            </div>
          </section>

          {produkTerkait.length > 0 && (
            <section className="mt-16">
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C77A23] font-body font-medium mb-2">Related Products</p>
                <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
                  Produk <span className="text-[#C77A23] italic">Terkait</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {produkTerkait.map((item) => (
                  <div
                    key={item.id_kopi}
                    onClick={() => {
                      setJumlah(1);
                      navigate(`/home/detail/${item.id_kopi}`);
                      window.scrollTo(0, 0);
                    }}
                    className={`card-related cursor-pointer ${cardBg}`}
                  >
                    <div className="h-48 overflow-hidden">
                      <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] text-[#C77A23] font-body uppercase tracking-wider">{item.nama_kategori}</span>
                      <h3 className={`font-serif text-sm font-bold mt-1 mb-2 truncate ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{item.nama_kopi}</h3>
                      <p className="text-xs font-body font-bold text-[#C77A23]">{formatRupiah(item.harga_kopi)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default DetailProduk;
