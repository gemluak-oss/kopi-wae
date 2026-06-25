import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime"; // ✅ import

export default function ListProduk({ isDark }) {
  const [products, setProducts] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#2a2522]" : "bg-white";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";

  useEffect(() => {
    fetchKategori();
  }, []);
  useEffect(() => {
    fetchProduk();
  }, [activeCategory]);

  // ✅ Auto refresh realtime
  useRealtime("produkUpdate", () => fetchProduk());
  useRealtime("kategoriUpdate", () => fetchKategori());

  const fetchKategori = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/kategori");
      setKategori(res.data.data);
    } catch (err) {}
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
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProduk();
  };
  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  const handleDetailClick = (product) => {
    navigate(`/home/detail/${product.id_kopi}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; } .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; transition: all 0.3s ease; font-family: 'Roboto', sans-serif; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; } .caramel-btn:hover { background: #3A2F2B; }
        .card-product { border-radius: 16px; border: 1px solid rgba(199,122,35,0.25); transition: all 0.4s ease-in-out; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.08); } .card-product:hover { box-shadow: 0 12px 28px rgba(199,122,35,0.2); transform: translateY(-6px); }
        .filter-btn { border-radius: 10px; font-family: 'Roboto', sans-serif; font-weight: 500; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.75rem 1.5rem; transition: all 0.3s ease; border: 1px solid rgba(199,122,35,0.3); } .filter-btn.active { background: #C77A23; color: white; border-color: #C77A23; box-shadow: 0 4px 12px rgba(199,122,35,0.3); } .filter-btn:not(.active):hover { background: rgba(199,122,35,0.1); border-color: #C77A23; }
        .search-input { border-radius: 10px; font-family: 'Roboto', sans-serif; border: 1px solid rgba(199,122,35,0.3); transition: all 0.3s ease; } .search-input:focus { border-color: #C77A23; box-shadow: 0 0 0 3px rgba(199,122,35,0.1); outline: none; }
      `}</style>

      <section className={`min-h-screen py-24 font-body ${bg}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div className="max-w-md w-full">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C77A23] block mb-2 font-medium">Selection</span>
              <h2 className={`font-serif text-4xl md:text-6xl font-bold mb-6 leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
                MENU <span className="text-[#C77A23] italic">KAMI</span>
              </h2>
              <div className="flex search-input overflow-hidden">
                <input
                  type="text"
                  placeholder="Cari kopi favorit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className={`w-full bg-transparent px-4 py-3 text-sm font-medium placeholder-current/30 outline-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}
                />
                <button onClick={handleSearch} className="caramel-btn px-6 text-xs rounded-l-none">
                  Cari
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveCategory("semua")} className={`filter-btn ${activeCategory === "semua" ? "active" : isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
                Semua
              </button>
              {kategori.map((kat) => (
                <button key={kat.id_kategori} onClick={() => setActiveCategory(kat.id_kategori)} className={`filter-btn ${activeCategory === kat.id_kategori ? "active" : isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
                  {kat.nama_kategori}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-24 text-center">
                <div className={`inline-block px-8 py-4 rounded-full animate-pulse uppercase tracking-wider text-sm font-body ${isDark ? "bg-[#C77A23]/20 text-[#C77A23]" : "bg-[#C77A23]/10 text-[#C77A23]"}`}>Memuat menu...</div>
              </div>
            ) : products.length > 0 ? (
              products.map((p) => (
                <div key={p.id_kopi} onClick={() => handleDetailClick(p)} className={`card-product cursor-pointer ${cardBg}`}>
                  <div className="relative h-64 overflow-hidden">
                    {p.stok <= 0 && (
                      <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center">
                        <span className="text-white bg-red-500/80 rounded-full font-body font-medium px-4 py-1.5 text-xs uppercase tracking-wider">Habis</span>
                      </div>
                    )}
                    <img
                      src={p.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"}
                      className={`h-full w-full object-cover hover:scale-105 transition-transform duration-500 ${p.stok <= 0 ? "grayscale" : ""}`}
                      alt={p.nama_kopi}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#C77A23] text-white text-[10px] font-body font-medium px-3 py-1 rounded-full uppercase tracking-wider">{p.nama_kategori}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-end">
                      <div className="max-w-[70%]">
                        <h4 className={`font-serif text-xl font-bold mb-1 truncate ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{p.nama_kopi}</h4>
                        <p className="text-lg font-bold text-[#C77A23] font-body mb-1">{formatRupiah(p.harga_kopi)}</p>
                        <p className={`text-xs font-body uppercase tracking-wider ${textMuted}`}>Stok: {p.stok}</p>
                      </div>
                      <button
                        disabled={p.stok <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailClick(p);
                        }}
                        className="w-10 h-10 rounded-full bg-[#C77A23] text-white font-body text-lg flex items-center justify-center hover:bg-[#3A2F2B] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <div className={`inline-block px-6 py-4 rounded-xl border border-dashed border-[#C77A23]/30 font-body text-sm uppercase tracking-wider ${textMuted}`}>Menu tidak ditemukan</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
