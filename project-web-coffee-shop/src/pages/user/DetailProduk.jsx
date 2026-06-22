import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DetailProduk = ({ isDark }) => {
  const [jumlah, setJumlah] = useState(1);
  const [produkAktif, setProdukAktif] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const text = isDark ? "text-white" : "text-[#1A1A1A]";

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
      setIsLoading(false);
    } catch (err) {
      setError("Produk tidak ditemukan");
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

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
            className="w-full bg-[#FFC700] text-black border-4 ${b} py-3 font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Kembali ke Menu
          </button>
        </div>
      </main>
    );

  return (
    <main className={`min-h-screen ${bg} font-mono py-12`}>
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex items-center gap-3 text-xs font-black tracking-widest uppercase mb-10">
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

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className={`lg:col-span-5 ${cardBg} border-4 ${b} p-4 shadow-[8px_8px_0px_0px] ${shadow} relative`}>
            <span className={`absolute top-8 left-8 z-10 text-xs font-black px-4 py-2 border-2 ${b} uppercase shadow-[3px_3px_0px_0px] ${shadow} ${produkAktif.stok > 0 ? "bg-[#00F5D4] text-black" : "bg-red-400 text-black"}`}>
              {produkAktif.stok > 0 ? "Tersedia" : "Habis"}
            </span>
            <div className={`aspect-square border-2 ${b} overflow-hidden`}>
              <img src={produkAktif.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={produkAktif.nama_kopi} className={`w-full h-full object-cover ${produkAktif.stok <= 0 ? "grayscale" : ""}`} />
            </div>
          </div>

          <div className={`lg:col-span-7 ${cardBg} border-4 ${b} p-8 shadow-[8px_8px_0px_0px] ${shadow}`}>
            <span className={`inline-block border-2 ${b} text-xs font-black px-3 py-1 mb-4 uppercase`}>{produkAktif.nama_kategori}</span>
            <h1 className="text-3xl md:text-4xl font-black mb-6 uppercase">{produkAktif.nama_kopi}</h1>
            <div className={`bg-[#FFC700] text-black border-4 ${b} px-5 py-3 inline-block font-black text-2xl shadow-[4px_4px_0px_0px] ${shadow} mb-8`}>{formatRupiah(produkAktif.harga_kopi)}</div>

            <div className="border-t-4 border-dashed pt-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase opacity-60 w-32">Stok</span>
                <span className={`text-xs font-black uppercase border-2 ${b} px-3 py-1.5 ${produkAktif.stok > 0 ? "" : "bg-red-400/20"}`}>{produkAktif.stok > 0 ? `${produkAktif.stok} Tersedia` : "Habis"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className={`flex items-center border-4 ${b} ${cardBg} h-14`}>
                <button onClick={kurangJumlah} className={`w-14 h-full font-black text-xl ${isDark ? "hover:bg-gray-600" : "hover:bg-stone-100"} border-r-4 ${b}`}>
                  -
                </button>
                <span className="w-14 text-center font-black text-sm">{jumlah}</span>
                <button onClick={tambahJumlah} className={`w-14 h-full font-black text-xl ${isDark ? "hover:bg-gray-600" : "hover:bg-stone-100"} border-l-4 ${b}`}>
                  +
                </button>
              </div>
              <button
                onClick={tambahKeKeranjang}
                disabled={produkAktif.stok <= 0}
                className={`flex-1 ${cardBg} border-4 ${b} h-14 font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-30`}
              >
                + Keranjang
              </button>
              <button
                onClick={beliSekarang}
                disabled={produkAktif.stok <= 0}
                className="flex-1 bg-[#00F5D4] text-black border-4 border-[#121212] h-14 font-black text-xs uppercase shadow-[4px_4px_0px_0px] shadow-[#121212] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:hidden"
              >
                Beli Langsung
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DetailProduk;
