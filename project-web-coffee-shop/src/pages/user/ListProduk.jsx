import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ListProduk({ isDark }) {
  const [products, setProducts] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const b = isDark ? "border-white" : "border-[#121212]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#121212]";
  const btnOff = isDark ? "bg-gray-700 text-white" : "bg-[#E0E0E0] text-[#121212]";

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
    <section className={`min-h-screen py-24 ${bg} font-mono`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-md w-full">
            <span className="font-bold text-xs uppercase tracking-widest block mb-2">Selection</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6 leading-none">
              MENU <span className={`px-2 bg-[#FFB703] text-black border-2 ${b} shadow-[3px_3px_0px_0px] ${shadow}`}>KAMI</span>
            </h2>
            <div className={`flex shadow-[4px_4px_0px_0px] ${shadow} ${cardBg} border-4 ${b}`}>
              <input
                type="text"
                placeholder="Cari kopi favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-transparent px-4 py-3 outline-none text-sm font-bold placeholder-stone-400"
              />
              <button onClick={handleSearch} className={`border-l-4 ${b} bg-[#FFB703] text-black font-black px-6 text-xs uppercase hover:bg-black hover:text-white transition-colors`}>
                Cari
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory("semua")}
              className={`px-6 py-3 border-4 ${b} font-black text-xs uppercase tracking-wider transition-all ${activeCategory === "semua" ? "bg-[#00F5D4] text-black translate-x-1 translate-y-1 shadow-none" : `${btnOff} shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5`}`}
            >
              Semua
            </button>
            {kategori.map((kat) => (
              <button
                key={kat.id_kategori}
                onClick={() => setActiveCategory(kat.id_kategori)}
                className={`px-6 py-3 border-4 ${b} font-black text-xs uppercase tracking-wider transition-all ${activeCategory === kat.id_kategori ? "bg-[#00F5D4] text-black translate-x-1 translate-y-1 shadow-none" : `${btnOff} shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5`}`}
              >
                {kat.nama_kategori}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-24 text-center">
              <div className={`px-6 py-3 border-4 ${b} ${cardBg} font-bold inline-block animate-pulse uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat menu...</div>
            </div>
          ) : products.length > 0 ? (
            products.map((p) => (
              <div
                key={p.id_kopi}
                onClick={() => handleDetailClick(p)}
                className={`group cursor-pointer border-4 ${b} ${cardBg} p-6 shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-1 hover:translate-y-1 transition-all`}
              >
                <div className={`relative h-64 border-4 ${b} overflow-hidden mb-6 bg-stone-100`}>
                  {p.stok <= 0 && (
                    <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center">
                      <span className="text-black bg-red-400 border-2 border-[#121212] font-black uppercase px-4 py-1.5 text-xs">Habis</span>
                    </div>
                  )}
                  <img
                    src={p.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"}
                    className={`h-full w-full object-cover group-hover:scale-105 transition-transform ${p.stok <= 0 ? "grayscale" : ""}`}
                    alt={p.nama_kopi}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#FFB703] text-black text-[10px] font-black px-2.5 py-1 border-2 border-[#121212] uppercase">{p.nama_kategori}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="max-w-[70%]">
                    <h4 className="text-xl font-black mb-2 uppercase truncate">{p.nama_kopi}</h4>
                    <p className={`text-md font-bold px-2 py-0.5 inline-block bg-[#FFB703] text-black border-2 ${b} mb-2`}>{formatRupiah(p.harga_kopi)}</p>
                    <p className="text-2xs font-black uppercase opacity-50">Stok: {p.stok}</p>
                  </div>
                  <button
                    disabled={p.stok <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailClick(p);
                    }}
                    className={`h-12 w-12 border-3 ${b} bg-[#121212] text-white text-xl font-black flex items-center justify-center hover:bg-[#FFB703] hover:text-black disabled:opacity-30`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className={`px-6 py-4 border-4 border-dashed font-black uppercase tracking-widest opacity-40 inline-block ${cardBg}`}>Menu tidak ditemukan</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
