import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ListProduk({ isDarkMode }) {
  const [products, setProducts] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchKategori();
  }, []);

  useEffect(() => {
    fetchProduk();
  }, [activeCategory]);

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/kategori");
      setKategori(res.data.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  const fetchProduk = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (activeCategory !== "semua") params.kategori = activeCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await axios.get("http://localhost:5000/api/user/produk", { params });
      setProducts(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Gagal ambil produk:", error);
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProduk();
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleDetailClick = (product) => {
    navigate(`/home/detail/${product.id_kopi}`);
  };

  return (
    <section className={`min-h-screen py-24 transition-colors duration-700 ${isDarkMode ? "bg-[#1A1A1B]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div className="max-w-md w-full">
            <span className="text-[#A67C52] font-black text-[10px] uppercase tracking-[0.4em] mb-2 inline-block">Selection</span>
            <h2 className={`text-5xl font-black tracking-tighter uppercase mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>
              MENU <span className="text-[#A67C52]">KAMI</span>
            </h2>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari kopi favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full bg-transparent border-b-2 py-4 outline-none transition-all text-lg font-medium
                  ${isDarkMode ? "border-white/10 focus:border-[#A67C52] text-white placeholder:text-white/20" : "border-black/10 focus:border-[#A67C52] text-black placeholder:text-black/20"}`}
              />
              <button onClick={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#A67C52] font-bold text-sm">
                Cari
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory("semua")}
              className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500
                ${activeCategory === "semua" ? "bg-[#A67C52] text-white shadow-xl" : isDarkMode ? "bg-white/5 text-white/50" : "bg-black/5 text-black/50"}`}
            >
              Semua
            </button>
            {kategori.map((kat) => (
              <button
                key={kat.id_kategori}
                onClick={() => setActiveCategory(kat.id_kategori)}
                className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500
                  ${activeCategory === kat.id_kategori ? "bg-[#A67C52] text-white shadow-xl" : isDarkMode ? "bg-white/5 text-white/50" : "bg-black/5 text-black/50"}`}
              >
                {kat.nama_kategori}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            <div className="col-span-full py-24 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#A67C52]/40 border-t-[#A67C52] animate-spin mx-auto mb-4"></div>
              <p className="font-black uppercase tracking-widest opacity-40">Memuat menu...</p>
            </div>
          ) : products.length > 0 ? (
            products.map((p) => (
              <div key={p.id_kopi} onClick={() => handleDetailClick(p)} className="group relative rounded-[3.5rem] p-8 transition-all duration-700 cursor-pointer bg-gray-50 hover:bg-white hover:shadow-2xl">
                <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-8 shadow-sm">
                  {p.stok <= 0 && (
                    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-white font-black uppercase tracking-widest border border-white/30 px-6 py-2 rounded-full text-[10px]">Habis</span>
                    </div>
                  )}
                  <img
                    src={p.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"}
                    className={`h-full w-full object-cover transform transition-transform duration-1000 group-hover:scale-110 ${p.stok <= 0 ? "grayscale" : ""}`}
                    alt={p.nama_kopi}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#A67C52] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{p.nama_kategori}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="max-w-[70%]">
                    <h4 className="text-2xl font-black mb-1 truncate group-hover:text-[#A67C52] transition-colors text-black">{p.nama_kopi}</h4>
                    <p className="text-[#A67C52] text-xl font-bold">{formatRupiah(p.harga_kopi)}</p>
                    <p className="text-xs opacity-40 mt-1">Stok: {p.stok}</p>
                  </div>

                  <button
                    disabled={p.stok <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailClick(p);
                    }}
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black transition-all duration-500 bg-[#1A1A1B] text-white hover:bg-[#A67C52]"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <p className="text-5xl mb-6">☕</p>
              <p className="font-black uppercase tracking-widest opacity-20">Menu tidak ditemukan...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
