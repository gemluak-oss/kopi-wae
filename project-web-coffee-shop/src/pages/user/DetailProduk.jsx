import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DetailProduk = ({ isDark }) => {
  const [jumlah, setJumlah] = useState(1);
  const [produkAktif, setProdukAktif] = useState(null);
  const [produkTerkait, setProdukTerkait] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchProduk(id);
    } else {
      setError("Silakan pilih produk dari halaman Menu.");
      setIsLoading(false);
    }
  }, [id]);

  const fetchProduk = async (produkId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/produk/${produkId}`);
      setProdukAktif(res.data.data);

      if (res.data.data.id_kategori) {
        const terkait = await axios.get(`http://localhost:5000/api/user/produk?kategori=${res.data.data.id_kategori}`);
        const filtered = terkait.data.data.filter((p) => p.id_kopi !== res.data.data.id_kopi).slice(0, 4);
        setProdukTerkait(filtered);
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
    if (jumlah < produkAktif.stok) {
      setJumlah(jumlah + 1);
    } else {
      alert("Jumlah tidak boleh melebihi stok.");
    }
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
      <main className={`min-h-screen ${bg} font-mono flex items-center justify-center`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-sm uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat Produk...</div>
      </main>
    );

  if (error)
    return (
      <main className={`min-h-screen ${bg} font-mono flex flex-col items-center justify-center`}>
        <div className={`${cardBg} p-8 border-4 ${b} shadow-[8px_8px_0px_0px] ${shadow} max-w-md`}>
          <h2 className="text-2xl font-black uppercase mb-4">Error</h2>
          <p className="text-xs uppercase opacity-70 mb-6">{error}</p>
          <button
            onClick={() => navigate("/home/produk")}
            className="w-full bg-[#FFC700] text-black border-4 border-[#121212] py-3 font-black text-xs uppercase shadow-[4px_4px_0px_0px] shadow-[#121212] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Kembali ke Menu
          </button>
        </div>
      </main>
    );

  return (
    <main className={`min-h-screen ${bg} font-mono py-10`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-xs font-black tracking-widest uppercase mb-8">
          <button onClick={() => navigate("/home")} className="hover:underline">
            Beranda
          </button>
          <span className="opacity-40">/</span>
          <button onClick={() => navigate("/home/produk")} className="hover:underline">
            Menu
          </button>
          <span className="opacity-40">/</span>
          <span className="opacity-60">{produkAktif.nama_kategori}</span>
        </nav>

        {/* Detail Produk */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gambar */}
          <div className={`lg:col-span-5 ${cardBg} border-4 ${b} p-3 shadow-[6px_6px_0px_0px] ${shadow} relative h-fit`}>
            <span className={`absolute top-4 left-4 z-10 text-[10px] font-black px-3 py-1 border-2 ${b} uppercase shadow-[2px_2px_0px_0px] ${shadow} ${produkAktif.stok > 0 ? "bg-[#00F5D4] text-black" : "bg-red-400 text-black"}`}>
              {produkAktif.stok > 0 ? "Tersedia" : "Habis"}
            </span>
            <div className={`aspect-square border-2 ${b} overflow-hidden`}>
              <img src={produkAktif.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={produkAktif.nama_kopi} className={`w-full h-full object-cover ${produkAktif.stok <= 0 ? "grayscale" : ""}`} />
            </div>
          </div>

          {/* Info */}
          <div className={`lg:col-span-7 ${cardBg} border-4 ${b} p-6 shadow-[6px_6px_0px_0px] ${shadow}`}>
            <span className={`inline-block border-2 ${b} text-[10px] font-black px-2 py-0.5 mb-3 uppercase`}>{produkAktif.nama_kategori}</span>
            <h1 className="text-2xl md:text-3xl font-black mb-2 uppercase">{produkAktif.nama_kopi}</h1>

            {/* ✅ Deskripsi */}
            {produkAktif.deskripsi && <p className="text-xs font-medium uppercase opacity-70 mb-4 leading-relaxed max-w-lg">{produkAktif.deskripsi}</p>}

            <div className={`bg-[#FFC700] text-black border-4 ${b} px-4 py-2 inline-block font-black text-xl shadow-[3px_3px_0px_0px] ${shadow} mb-6`}>{formatRupiah(produkAktif.harga_kopi)}</div>

            <div className="border-t-4 border-dashed pt-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase opacity-60 w-20">Stok</span>
                <span className={`text-[10px] font-black uppercase border-2 ${b} px-2 py-1 ${produkAktif.stok > 0 ? "" : "bg-red-400/20"}`}>{produkAktif.stok > 0 ? `${produkAktif.stok} Tersedia` : "Habis"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`flex items-center border-4 ${b} ${cardBg} h-12`}>
                <button onClick={kurangJumlah} className={`w-10 h-full font-black text-lg hover:bg-stone-100 border-r-4 ${b}`}>
                  -
                </button>
                <span className="w-10 text-center font-black text-sm">{jumlah}</span>
                <button onClick={tambahJumlah} className={`w-10 h-full font-black text-lg hover:bg-stone-100 border-l-4 ${b}`}>
                  +
                </button>
              </div>
              <button
                onClick={tambahKeKeranjang}
                disabled={produkAktif.stok <= 0}
                className={`flex-1 ${cardBg} border-4 ${b} h-12 font-black text-[10px] uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-30`}
              >
                + Keranjang
              </button>
              <button
                onClick={beliSekarang}
                disabled={produkAktif.stok <= 0}
                className="flex-1 bg-[#00F5D4] text-black border-4 border-[#121212] h-12 font-black text-[10px] uppercase shadow-[3px_3px_0px_0px] shadow-[#121212] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:hidden"
              >
                Beli Langsung
              </button>
            </div>
          </div>
        </section>

        {/* Produk Terkait */}
        {produkTerkait.length > 0 && (
          <section className="mt-16">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold mb-2">Related Products</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase">
                Produk <span className={`px-2 bg-[#FFC700] text-black border-2 ${b} inline-block shadow-[3px_3px_0px_0px] ${shadow}`}>Terkait</span>
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
                  className={`group cursor-pointer border-4 ${b} ${cardBg} shadow-[5px_5px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  <div className={`h-48 border-b-4 ${b} overflow-hidden bg-stone-100`}>
                    <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase opacity-60">{item.nama_kategori}</span>
                    <h3 className="text-sm font-black uppercase mt-1 mb-2 truncate">{item.nama_kopi}</h3>
                    <p className={`text-xs font-bold px-2 py-1 inline-block bg-[#FFC700] text-black border-2 ${b}`}>{formatRupiah(item.harga_kopi)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default DetailProduk;
