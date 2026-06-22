import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ isDark }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [produkTerbaru, setProdukTerbaru] = useState([]);
  const [voucherAktif, setVoucherAktif] = useState([]);

  const b = isDark ? "border-white" : "border-[#121212]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#121212]";
  const footerBg = isDark ? "bg-gray-950" : "bg-[#121212] text-white";

  const slides = [
    { id: 1, tagline: "Experience the Gold Standard", title: "Signature Latte", desc: "Sensasi creamy dalam setiap tegukan.", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000" },
    { id: 2, tagline: "Awaken Your Senses", title: "Dark Espresso", desc: "Energi murni dari biji pilihan.", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1000" },
  ];

  const features = [
    { id: 1, title: "Slow Bar Experience", code: "SBE", desc: "Nikmati penyeduhan manual dengan teknik presisi tinggi." },
    { id: 2, title: "Ethically Sourced", code: "ETC", desc: "Bekerja sama langsung dengan petani lokal Magelang." },
    { id: 3, title: "Modern Roastery", code: "MRS", desc: "Biji kopi disangrai segar setiap hari." },
  ];

  const testimonials = [
    { id: 1, name: "Andi Wijaya", role: "Coffee Enthusiast", text: "Aren Latte-nya juara!", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Siska Putri", role: "Freelancer", text: "Tempat terbaik buat kerja.", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Budi Santoso", role: "Graphic Designer", text: "Visual produknya sebanding dengan rasanya.", img: "https://i.pravatar.cc/150?u=3" },
  ];

  useEffect(() => {
    fetchProdukTerbaru();
    fetchVoucherAktif();
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % slides.length), 7000);
    const popupTimer = setTimeout(() => setShowPopup(true), 4000);
    return () => {
      clearInterval(timer);
      clearTimeout(popupTimer);
    };
  }, []);

  const fetchProdukTerbaru = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/beranda");
      setProdukTerbaru(res.data.data);
    } catch (e) {}
  };

  const fetchVoucherAktif = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/voucher/aktif");
      setVoucherAktif(res.data.data);
    } catch (e) {}
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  return (
    <div className={`min-h-screen font-mono ${bg} selection:bg-[#FFB703]`}>
      {/* HERO */}
      <section className={`relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-12 border-b-4 ${b} overflow-hidden`}>
        <div className="w-full md:w-1/2 py-12 md:py-0 z-20">
          <span className={`inline-block px-3 py-1 font-bold border-2 ${b} bg-[#FFB703] text-black uppercase text-xs mb-6 shadow-[2px_2px_0px_0px] ${shadow}`}>{slides[currentSlide].tagline}</span>
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tight leading-none min-h-[160px] md:min-h-[260px]">
            {slides[currentSlide].title.split(" ")[0]} <br />
            <span className={`px-2 bg-[#FFB703] text-black border-2 ${b} inline-block mt-2 shadow-[4px_4px_0px_0px] ${shadow}`}>{slides[currentSlide].title.split(" ")[1]}</span>
          </h1>
          <p className="text-md md:text-lg max-w-md mb-8 font-medium opacity-90">{slides[currentSlide].desc}</p>
          <button
            onClick={() => document.getElementById("produk-section").scrollIntoView({ behavior: "smooth" })}
            className={`px-6 py-4 font-black border-4 ${b} bg-[#FFB703] text-black uppercase shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-1 hover:translate-y-1 transition-all`}
          >
            Jelajahi Menu
          </button>
        </div>
        <div className="w-full md:w-1/2 p-4 md:p-12 flex justify-center">
          <div className={`w-full max-w-md border-4 ${b} shadow-[8px_8px_0px_0px] ${shadow} bg-white overflow-hidden aspect-square`}>
            <img src={slides[currentSlide].img} className="w-full h-full object-cover" alt="Coffee" />
          </div>
        </div>
      </section>

      {/* RUNNING TEXT */}
      {/* Perhatikan penambahan kelas 'flex' setelah text-xl di bawah ini */}
      <div className={`py-4 border-b-4 ${b} bg-[#FFB703] text-black overflow-hidden whitespace-nowrap font-black uppercase tracking-wider text-xl flex select-none`}>
        {/* Blok Utama */}
        <div className="animate-marquee">
          <span>AUTHENTIC LOCAL PASSION &bull;</span>
          <span>COFFEE ROASTERY MAGELANG &bull;</span>
          <span>EST 2024 &bull;</span>
        </div>

        {/* Blok Duplikat (Menyambung tepat di belakang blok utama) */}
        <div className="animate-marquee" aria-hidden="true">
          <span>AUTHENTIC LOCAL PASSION &bull;</span>
          <span>COFFEE ROASTERY MAGELANG &bull;</span>
          <span>EST 2024 &bull;</span>
        </div>
      </div>

      {/* STORY */}
      <section className={`py-24 px-6 md:px-12 border-b-4 ${b}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`border-4 ${b} shadow-[8px_8px_0px_0px] ${shadow} bg-stone-200 aspect-[4/5] overflow-hidden`}>
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600" className="w-full h-full object-cover" alt="Barista" />
          </div>
          <div>
            <span className="font-bold text-xs uppercase tracking-widest block mb-2">The Origin</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-none">Kreativitas Tanpa Batas</h2>
            <div className={`p-6 border-4 ${b} ${cardBg} font-medium mb-8 shadow-[4px_4px_0px_0px] ${shadow}`}>"Berawal dari mimpi sederhana di sudut kota Magelang."</div>
            <p className="mb-8 opacity-80">Kopi Wae bukan sekadar tempat nongkrong. Ini adalah rumah bagi mereka yang menghargai proses panjang sebuah racikan.</p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { num: "2024", label: "Tahun Berdiri" },
                { num: "100%", label: "Biji Lokal" },
              ].map((s, i) => (
                <div key={i} className={`p-4 border-4 ${b} ${cardBg} shadow-[4px_4px_0px_0px] ${shadow}`}>
                  <p className="text-3xl font-black">{s.num}</p>
                  <p className="text-xs uppercase font-bold opacity-60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK TERBARU */}
      <section id="produk-section" className={`py-24 px-6 md:px-12 border-b-4 ${b}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-bold text-xs uppercase">Katalog</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase">Produk Terbaru</h2>
          </div>
          {produkTerbaru.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className={`px-6 py-3 border-4 ${b} font-bold animate-pulse ${cardBg} shadow-[4px_4px_0px_0px] ${shadow} uppercase`}>Memuat menu...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {produkTerbaru.map((item) => (
                <div
                  key={item.id_kopi}
                  onClick={() => navigate(`/home/detail/${item.id_kopi}`)}
                  className={`group cursor-pointer border-4 ${b} ${cardBg} shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-1 hover:translate-y-1 transition-all`}
                >
                  <div className={`h-64 border-b-4 ${b} overflow-hidden bg-stone-100`}>
                    <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold uppercase opacity-60">{item.nama_kategori}</span>
                    <h3 className="text-xl font-black uppercase mt-1 mb-2 truncate">{item.nama_kopi}</h3>
                    <p className={`text-lg font-bold px-2 py-1 inline-block bg-[#FFB703] text-black border-2 ${b}`}>{formatRupiah(item.harga_kopi)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <button
              onClick={() => navigate("/home/produk")}
              className={`px-8 py-4 border-4 ${b} ${cardBg} font-black uppercase shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-1 hover:translate-y-1 transition-all`}
            >
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`py-24 px-6 md:px-12 border-b-4 ${b}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-16">Lebih Dari Sekadar Kopi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.id} className={`p-8 border-4 ${b} ${cardBg} shadow-[6px_6px_0px_0px] ${shadow}`}>
                <div className={`w-12 h-12 flex items-center justify-center border-2 ${b} bg-[#FFB703] text-black font-black text-sm mb-6`}>{f.code}</div>
                <h3 className="text-2xl font-black uppercase mb-3">{f.title}</h3>
                <p className="text-sm font-medium opacity-80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`py-24 px-6 md:px-12 border-b-4 ${b}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-16">Kata Mereka</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className={`p-8 border-4 ${b} ${cardBg} shadow-[6px_6px_0px_0px] ${shadow} flex flex-col justify-between`}>
                <p className="font-medium text-md mb-8">"{t.text}"</p>
                <div className="flex items-center space-x-4 pt-4 border-t-2 border-dashed">
                  <img src={t.img} className={`w-12 h-12 border-2 ${b}`} alt={t.name} />
                  <div>
                    <p className="font-black text-sm uppercase">{t.name}</p>
                    <p className="text-xs font-bold uppercase opacity-50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className={`pt-16 pb-8 px-6 md:px-12 ${footerBg}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b-4 border-dashed border-gray-600">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              {/* SVG cangkir kopi menggantikan emoji ☕ */}
              <div className="inline-flex items-center gap-3 bg-[#FFB703] text-black border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#fff] mb-6">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
                </svg>
                <h2 className="text-lg font-black uppercase tracking-wider">Kopi Wae</h2>
              </div>
              <p className="text-sm max-w-sm font-medium opacity-80 leading-relaxed mb-6">Menyajikan racikan kopi murni berkualitas tinggi langsung dari petani lokal Magelang untuk melengkapi hari produktifmu.</p>
            </div>

            {/* Social Media Link */}
            <div className="flex gap-3">
              {["IG", "FB", "TW", "YT"].map((soc, i) => (
                <a key={i} href="#" className="w-10 h-10 border-2 border-white bg-gray-800 text-white flex items-center justify-center font-black text-xs uppercase hover:bg-[#FFB703] hover:text-black hover:border-black transition-colors">
                  {soc}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FFB703] mb-6">[ Navigasi ]</h3>
            <ul className="space-y-3 text-sm font-bold uppercase">
              <li>
                <button onClick={() => navigate("/home")} className="hover:text-[#FFB703] hover:underline transition-all">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/home/produk")} className="hover:text-[#FFB703] hover:underline transition-all">
                  Semua Produk
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/login")} className="hover:text-[#FFB703] hover:underline transition-all">
                  Masuk Akun
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/register")} className="hover:text-[#FFB703] hover:underline transition-all">
                  Daftar Baru
                </button>
              </li>
            </ul>
          </div>

          {/* Operational & Location Column */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FFB703] mb-6">[ Jam Operasional & Alamat ]</h3>
            <div className="space-y-4 text-sm font-medium opacity-90">
              <p>
                <span className="block font-black text-xs uppercase text-gray-400">Setiap Hari:</span>
                09:00 AM - 11:00 PM WIB
              </p>
              <p>
                <span className="block font-black text-xs uppercase text-gray-400">Lokasi Roastery:</span>
                Jl. Pemuda No. 42, Kompleks Alun-Alun, Magelang, Jawa Tengah.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Footer */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase opacity-60 tracking-wide">
          <p>&copy; 2026 Kopi Wae. All Rights Reserved.</p>
          <p>Built with Passion &amp; Neo-Brutalism Style</p>
        </div>
      </footer>

      {/* POPUP VOUCHER */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-sm w-full border-4 ${b} ${cardBg} p-8 relative shadow-[10px_10px_0px_0px] ${shadow}`}>
            <button onClick={() => setShowPopup(false)} className={`absolute top-4 right-4 font-black text-sm border-2 ${b} px-2 py-0.5`}>
              X
            </button>
            <h2 className="text-2xl font-black mb-4 uppercase">Kupon Spesial</h2>
            <div className="space-y-3 mb-6">
              {voucherAktif.map((v, i) => (
                <div key={i} className={`border-4 ${b} p-4 shadow-[4px_4px_0px_0px] ${shadow}`}>
                  <p className="text-2xl font-black">{v.kode}</p>
                  <p className="text-xs font-bold uppercase opacity-80 mt-1">Diskon {v.diskon_persen}%</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(v.kode);
                      alert(`Kode ${v.kode} disalin!`);
                    }}
                    className={`mt-3 w-full py-1.5 text-xs font-black border-2 ${b} bg-[#FFB703] text-black uppercase hover:bg-black hover:text-white transition-all`}
                  >
                    Klaim Voucher
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPopup(false)} className={`w-full py-3 font-black border-4 ${b} bg-[#FFB703] text-black uppercase hover:shadow-[2px_2px_0px_0px] transition-all`}>
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
