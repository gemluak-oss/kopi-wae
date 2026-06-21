import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [produkTerbaru, setProdukTerbaru] = useState([]);

  const slides = [
    {
      id: 1,
      title: "Signature Latte",
      tagline: "Experience the Gold Standard",
      desc: "Sensasi creamy dalam setiap tegukan untuk memulai hari Anda.",
      img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Dark Espresso",
      tagline: "Awaken Your Senses",
      desc: "Energi murni dari biji pilihan dengan aroma yang sangat kuat.",
      img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const features = [
    { id: 1, title: "Slow Bar Experience", icon: "⚖️", desc: "Nikmati penyeduhan manual dengan teknik presisi tinggi untuk rasa yang otentik." },
    { id: 2, title: "Ethically Sourced", icon: "🌱", desc: "Bekerja sama langsung dengan petani lokal Magelang untuk kualitas terbaik." },
    { id: 3, title: "Modern Roastery", icon: "🔥", desc: "Biji kopi disangrai segar setiap hari di workshop kami untuk menjaga aroma." },
  ];

  const testimonials = [
    { id: 1, name: "Andi Wijaya", role: "Coffee Enthusiast", text: "Aren Latte-nya juara! Rasa kopinya tetap kuat meski dicampur susu yang creamy.", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Siska Putri", role: "Freelancer", text: "Tempat terbaik buat kerja. Kopinya enak, suasananya tenang banget.", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Budi Santoso", role: "Graphic Designer", text: "Visual produknya sebanding dengan rasanya. Sangat estetik!", img: "https://i.pravatar.cc/150?u=3" },
  ];

  const news = [
    { id: 1, date: "12 Mei 2026", title: "Pembukaan Cabang Baru di Magelang", category: "Update", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop" },
    { id: 2, date: "05 Mei 2026", title: "Kolaborasi Spesial: Kopi & Seni Lokal", category: "Event", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop" },
  ];

  useEffect(() => {
    fetchProdukTerbaru();
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
    } catch (error) {
      console.error("Gagal ambil produk:", error);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans tracking-tight ${isDarkMode ? "bg-[#1A1A1B] text-white" : "bg-[#F5F5DC] text-[#1A1A1B]"}`}>
      <div className="fixed top-8 right-8 z-[120] flex items-center space-x-4">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* HERO */}
      <section className="relative h-[90vh] md:h-screen flex flex-col md:flex-row items-center overflow-hidden">
        <div className="w-full md:w-1/2 px-10 md:px-20 z-20 mt-28 md:mt-0">
          <span className="inline-block text-[#A67C52] font-bold tracking-[0.4em] text-xs uppercase mb-4">{slides[currentSlide].tagline}</span>
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.8] tracking-tighter uppercase">
            {slides[currentSlide].title.split(" ")[0]} <br />
            <span className="text-[#A67C52]">{slides[currentSlide].title.split(" ")[1]}</span>
          </h1>
          <p className="text-lg max-w-sm mb-10 leading-relaxed font-medium opacity-60">{slides[currentSlide].desc}</p>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => document.getElementById("produk-section").scrollIntoView({ behavior: "smooth" })}
              className={`h-16 w-16 rounded-full flex items-center justify-center hover:bg-[#A67C52] transition-all duration-500 shadow-2xl ${isDarkMode ? "bg-white text-[#1A1A1B]" : "bg-[#1A1A1B] text-white"}`}
            >
              <span className="text-2xl">→</span>
            </button>
            <span className="text-sm font-black uppercase tracking-widest opacity-40">Mulai Jelajah</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full relative p-10 md:p-20 flex items-center">
          <div className="relative h-[80%] w-full rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-2xl border-4 border-white/10 group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
            <img src={slides[currentSlide].img} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" alt="Hero" />
          </div>
        </div>
      </section>

      {/* TRANSITION QUOTE */}
      <div className="py-20 text-center opacity-20 select-none">
        <span className="text-4xl md:text-8xl font-black italic tracking-tighter uppercase">Authentic • Local • Passion</span>
      </div>

      {/* STORY */}
      <section className={`py-40 px-10 transition-colors duration-1000 ${isDarkMode ? "bg-[#212122]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#A67C52]/10 rounded-full blur-3xl"></div>
              <div className="relative h-[500px] md:h-[700px] rounded-[3rem] md:rounded-[10rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)]">
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Barista" />
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 text-white">
                  <p className="text-xs font-black uppercase tracking-widest mb-2">Quality Control</p>
                  <p className="text-sm opacity-80 leading-relaxed italic">"Setiap biji kopi melewati proses seleksi manual untuk memastikan standar emas Kopi Wae."</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 order-1 md:order-2">
              <span className="text-[#A67C52] font-black text-xs uppercase tracking-[0.6em] mb-6 inline-block">The Origin</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-12">
                KREATIFITAS <br /> <span className="text-[#A67C52]">TANPA BATAS</span>
              </h2>
              <div className="space-y-8 max-w-lg">
                <p className="text-xl leading-relaxed opacity-80 font-medium italic border-l-4 border-[#A67C52] pl-6">"Berawal dari mimpi sederhana di sudut kota Magelang, kami ingin membawa kopi lokal ke level yang berbeda."</p>
                <p className="text-md leading-relaxed opacity-60">Kopi Wae bukan sekadar tempat nongkrong. Ini adalah rumah bagi mereka yang menghargai proses.</p>
              </div>
              <div className="grid grid-cols-2 gap-12 mt-16 pt-12 border-t border-current/10">
                <div>
                  <p className="text-5xl font-black text-[#A67C52] mb-2">2024</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Tahun Berdiri</p>
                </div>
                <div>
                  <p className="text-5xl font-black text-[#A67C52] mb-2">100%</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Biji Lokal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK TERBARU */}
      <section id="produk-section" className={`py-40 px-10 transition-colors duration-700 ${isDarkMode ? "bg-[#1A1A1B]" : "bg-[#FDFDF7]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[#A67C52] font-black text-xs uppercase tracking-[0.6em] mb-4 inline-block">Menu</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
              PRODUK <span className="text-[#A67C52]">TERBARU</span>
            </h2>
          </div>

          {produkTerbaru.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#A67C52]/20 border-t-[#A67C52] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {produkTerbaru.map((item) => (
                <div key={item.id_kopi} onClick={() => navigate(`/produk/${item.id_kopi}`)} className="group cursor-pointer">
                  <div className="h-72 rounded-[4rem] overflow-hidden mb-8">
                    <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A67C52]">{item.nama_kategori}</span>
                  <h3 className="text-2xl font-black mt-3 mb-2 group-hover:text-[#A67C52] transition-colors uppercase tracking-tighter">{item.nama_kopi}</h3>
                  <p className="text-xl font-black text-[#A67C52]">{formatRupiah(item.harga_kopi)}</p>
                  <p className="text-xs opacity-40 mt-1">Stok: {item.stok}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-20">
            <button
              // Tombol "Lihat Semua Produk"
              onClick={() => navigate("/home/produk")}
              className={`px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 ${isDarkMode ? "bg-white text-[#1A1A1B] hover:bg-[#A67C52] hover:text-white" : "bg-[#1A1A1B] text-white hover:bg-[#A67C52]"}`}
            >
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`py-40 transition-colors duration-1000 ${isDarkMode ? "bg-[#212122]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-24">
            <span className="text-[#A67C52] font-black text-xs uppercase tracking-[0.6em] mb-4 inline-block">Kenapa Kami</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
              LEBIH DARI <br /> <span className="text-[#A67C52]">SEKADAR KOPI</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {features.map((f) => (
              <div key={f.id} className="relative group p-12 rounded-[4rem] border border-current/5 hover:bg-[#A67C52] transition-all duration-700">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500 inline-block">{f.icon}</div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-lg opacity-60 leading-relaxed group-hover:text-white group-hover:opacity-90 transition-all">{f.desc}</p>
                <div className="mt-10 h-1 w-0 group-hover:w-full bg-white/30 transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40 px-10 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-[#A67C52] font-black text-xs uppercase tracking-[0.5em] mb-4">Feedback</span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
            KATA <span className="text-[#A67C52]">MEREKA</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t) => (
            <div key={t.id} className="p-12 rounded-[4rem] bg-[#A67C52]/5 border border-[#A67C52]/10 hover:bg-[#1A1A1B] hover:text-white transition-all duration-700 group">
              <p className="text-xl font-medium leading-relaxed mb-10 italic">"{t.text}"</p>
              <div className="flex items-center space-x-5">
                <img src={t.img} className="w-14 h-14 rounded-full grayscale group-hover:grayscale-0 transition-all shadow-xl" alt={t.name} />
                <div>
                  <p className="font-black leading-none text-lg">{t.name}</p>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section className={`py-32 rounded-t-[5rem] transition-all duration-1000 ${isDarkMode ? "bg-[#121212]" : "bg-[#1A1A1B] text-white"}`}>
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-20 italic">
            Warta <span className="text-[#A67C52]">Kopi Wae</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {news.map((n) => (
              <div key={n.id} className="group flex flex-col md:flex-row gap-8 items-center bg-white/5 p-8 rounded-[4rem] hover:bg-white/10 transition-all border border-white/5">
                <div className="w-full md:w-56 h-56 rounded-[3rem] overflow-hidden flex-shrink-0">
                  <img src={n.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={n.title} />
                </div>
                <div>
                  <span className="text-[10px] font-black bg-[#A67C52] px-4 py-1.5 rounded-full text-white mb-6 inline-block uppercase tracking-widest">{n.category}</span>
                  <h4 className="text-2xl font-black group-hover:text-[#A67C52] transition-colors">{n.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-24 px-10 transition-colors duration-700 ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#FDFDF7] text-[#1A1A1B]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-1">
              <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase italic">
                Kopi <span className="text-[#A67C52]">Wae</span>
              </h3>
              <p className="text-sm opacity-60 leading-relaxed mb-8">Menyajikan kehangatan dari biji kopi pilihan langsung dari tanah Magelang.</p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-[#A67C52] hover:text-white transition-all">
                  IG
                </a>
                <a href="#" className="h-10 w-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-[#A67C52] hover:text-white transition-all">
                  FB
                </a>
                <a href="#" className="h-10 w-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-[#A67C52] hover:text-white transition-all">
                  TW
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#A67C52] mb-8">Tautan Cepat</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest opacity-70">
                <li className="hover:text-[#A67C52] transition-colors">
                  <a href="#">Beranda</a>
                </li>
                <li className="hover:text-[#A67C52] transition-colors">
                  <a href="#">Menu Kami</a>
                </li>
                <li className="hover:text-[#A67C52] transition-colors">
                  <a href="#">Tentang Kami</a>
                </li>
                <li className="hover:text-[#A67C52] transition-colors">
                  <a href="#">Kontak</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#A67C52] mb-8">Lokasi & Kontak</h4>
              <div className="text-sm space-y-6 opacity-70">
                <div>
                  <p className="font-black uppercase mb-1">Workshop Magelang</p>
                  <p className="leading-relaxed italic">Jl. Glondong No. 12, Magelang Utara.</p>
                </div>
                <div>
                  <p className="font-black uppercase mb-1">Email</p>
                  <p className="italic">hello@kopiwae.id</p>
                </div>
                <div>
                  <p className="font-black uppercase mb-1">WhatsApp</p>
                  <p className="italic">+62 812-3456-7890</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#A67C52] mb-8">Berlangganan</h4>
              <p className="text-sm opacity-60 mb-6">Dapatkan info promo dan menu musiman terbaru.</p>
              <div className="relative">
                <input type="email" placeholder="Email anda..." className="w-full bg-transparent border-b-2 border-current/20 py-3 text-sm focus:border-[#A67C52] outline-none transition-all italic" />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#A67C52]">Kirim</button>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-current/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">© 2026 Kopi Wae Indonesia — Est. Magelang</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
              <a href="#" className="hover:opacity-100 transition-opacity">
                Privacy Policy
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
          <div className={`max-w-sm w-full rounded-[5rem] p-16 text-center border-b-[20px] border-[#A67C52] relative shadow-2xl ${isDarkMode ? "bg-[#252525]" : "bg-[#F5F5DC]"}`}>
            <button onClick={() => setShowPopup(false)} className="absolute top-10 right-10 opacity-30">
              ✕
            </button>
            <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase">KOPI WAE</h2>
            <p className="text-6xl font-black text-[#A67C52] my-10">30% OFF</p>
            <button onClick={() => setShowPopup(false)} className="w-full py-6 rounded-full font-black bg-[#1A1A1B] text-white hover:bg-[#A67C52]">
              AMBIL DISKON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
