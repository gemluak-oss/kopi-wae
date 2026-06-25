import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime"; // ✅ import

export default function Home({ isDark }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [produkTerbaru, setProdukTerbaru] = useState([]);
  const [voucherAktif, setVoucherAktif] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#3A2F2B]/80 border-[#C77A23]/30" : "bg-white border-[#C77A23]/20";
  const footerBg = isDark ? "bg-[#1a1a1a] text-[#E8D8C6]" : "bg-[#3A2F2B] text-[#E8D8C6]";
  const sectionAlt = isDark ? "bg-[#2a2522]" : "bg-white/50";
  const testimonialBg = isDark ? "bg-[#3A2F2B]" : "bg-[#3A2F2B]";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";

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

  // ✅ Auto refresh realtime
  useRealtime("produkUpdate", () => fetchProdukTerbaru());
  useRealtime("voucherUpdate", () => fetchVoucherAktif());

  const fetchProdukTerbaru = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/beranda");
      setProdukTerbaru(res.data.data);
    } catch (e) {}
  };

  const fetchVoucherAktif = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id || "guest";
      const res = await axios.get(`http://localhost:5000/api/user/voucher/aktif?userId=${userId}`);
      setVoucherAktif(res.data.data);
    } catch (e) {}
  };

  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

  const handleCopy = (kode) => {
    navigator.clipboard.writeText(kode);
    setCopiedCode(kode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; } .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; box-shadow: 0 6px 15px rgba(199,122,35,0.3); transition: all 0.4s ease-in-out; } .caramel-btn:hover { background: #3A2F2B; box-shadow: 0 8px 20px rgba(58,47,43,0.4); transform: translateY(-2px); }
        .card-premium { border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); transition: all 0.4s ease-in-out; border: 1px solid rgba(199,122,35,0.2); } .card-premium:hover { box-shadow: 0 10px 25px rgba(199,122,35,0.25); transform: translateY(-4px); }
        .linen-texture-light { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30Z' fill='none' stroke='%23C77A23' stroke-width='0.3' opacity='0.1'/%3E%3C/svg%3E"); }
        .linen-texture-dark { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30Z' fill='none' stroke='%23C77A23' stroke-width='0.3' opacity='0.05'/%3E%3C/svg%3E"); }
      `}</style>

      <div className={`min-h-screen ${bg} font-body selection:bg-[#C77A23] selection:text-white`}>
        {/* HERO */}
        <section className={`relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-12 overflow-hidden ${isDark ? "linen-texture-dark" : "linen-texture-light"}`}>
          <div className="w-full md:w-1/2 py-12 md:py-0 z-20">
            <span className={`inline-block px-4 py-2 text-[#C77A23] font-body text-xs uppercase tracking-[0.2em] rounded-full mb-6 backdrop-blur-sm ${isDark ? "bg-[#C77A23]/10" : "bg-[#F0C98D]/30"}`}>{slides[currentSlide].tagline}</span>
            <h1 className={`font-serif text-5xl md:text-8xl font-bold mb-6 leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
              {slides[currentSlide].title.split(" ")[0]} <br />
              <span className="text-[#C77A23] italic">{slides[currentSlide].title.split(" ")[1]}</span>
            </h1>
            <p className={`text-lg max-w-md mb-8 font-body font-light ${isDark ? "text-[#E8D8C6]/70" : "text-[#3A2F2B]/70"}`}>{slides[currentSlide].desc}</p>
            <button onClick={() => document.getElementById("produk-section").scrollIntoView({ behavior: "smooth" })} className="caramel-btn px-8 py-4 font-body text-sm uppercase tracking-[0.15em]">
              Jelajahi Menu
            </button>
          </div>
          <div className="w-full md:w-1/2 p-4 md:p-12 flex justify-center">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl shadow-[#C77A23]/20 overflow-hidden border-4 ${isDark ? "border-[#C77A23]/30" : "border-white"}`}>
              <img src={slides[currentSlide].img} className="w-full h-full object-cover" alt="Coffee" />
            </div>
          </div>
        </section>

        {/* RUNNING TEXT */}
        <div className={`py-4 border-y border-[#C77A23]/20 font-body font-medium uppercase tracking-wider text-lg flex select-none overflow-hidden whitespace-nowrap ${isDark ? "bg-[#C77A23] text-white" : "bg-[#3A2F2B] text-[#E8D8C6]"}`}>
          <div className="animate-marquee">
            <span>AUTHENTIC LOCAL PASSION &bull;</span>
            <span>COFFEE ROASTERY MAGELANG &bull;</span>
            <span>EST 2024 &bull;</span>
          </div>
          <div className="animate-marquee" aria-hidden="true">
            <span>AUTHENTIC LOCAL PASSION &bull;</span>
            <span>COFFEE ROASTERY MAGELANG &bull;</span>
            <span>EST 2024 &bull;</span>
          </div>
        </div>

        {/* STORY */}
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`rounded-2xl overflow-hidden shadow-xl shadow-[#C77A23]/15 border-4 ${isDark ? "border-[#C77A23]/30" : "border-white"}`}>
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600" className="w-full h-full object-cover" alt="Barista" />
            </div>
            <div>
              <span className="font-body text-xs uppercase tracking-[0.2em] text-[#C77A23] block mb-2 font-medium">The Origin</span>
              <h2 className={`font-serif text-4xl md:text-6xl font-bold mb-6 leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Kreativitas Tanpa Batas</h2>
              <div className={`card-premium p-6 mb-8 ${isDark ? "bg-[#2a2522]" : "bg-white"}`}>
                <p className={`font-serif italic ${isDark ? "text-[#E8D8C6]/70" : "text-[#3A2F2B]/70"}`}>"Berawal dari mimpi sederhana di sudut kota Magelang."</p>
              </div>
              <p className={`mb-8 font-body leading-relaxed ${isDark ? "text-[#E8D8C6]/70" : "text-[#3A2F2B]/70"}`}>Kopi Wae bukan sekadar tempat nongkrong. Ini adalah rumah bagi mereka yang menghargai proses panjang sebuah racikan.</p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "2024", label: "Tahun Berdiri" },
                  { num: "100%", label: "Biji Lokal" },
                ].map((s, i) => (
                  <div key={i} className={`card-premium p-4 text-center ${isDark ? "bg-[#2a2522]" : "bg-white"}`}>
                    <p className="font-serif text-3xl font-bold text-[#C77A23]">{s.num}</p>
                    <p className={`text-xs font-body uppercase tracking-wider ${textMuted}`}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRODUK TERBARU */}
        <section id="produk-section" className={`py-24 px-6 md:px-12 ${sectionAlt}`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-[#C77A23] font-medium">Katalog</span>
              <h2 className={`font-serif text-4xl md:text-6xl font-bold mt-2 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Produk Terbaru</h2>
            </div>
            {produkTerbaru.length === 0 ? (
              <div className="flex justify-center py-20">
                <div className={`px-8 py-4 rounded-full animate-pulse uppercase tracking-wider text-sm font-body ${isDark ? "bg-[#C77A23]/20 text-[#C77A23]" : "bg-[#C77A23]/10 text-[#C77A23]"}`}>Memuat menu...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {produkTerbaru.map((item) => (
                  <div key={item.id_kopi} onClick={() => navigate(`/home/detail/${item.id_kopi}`)} className={`card-premium cursor-pointer overflow-hidden ${isDark ? "bg-[#2a2522]" : "bg-white"}`}>
                    <div className="h-56 overflow-hidden">
                      <img src={item.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"} alt={item.nama_kopi} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-[#C77A23] font-body uppercase tracking-wider">{item.nama_kategori}</span>
                      <h3 className={`font-serif text-xl font-bold mt-1 mb-2 truncate ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{item.nama_kopi}</h3>
                      <p className="text-lg font-bold text-[#C77A23]">{formatRupiah(item.harga_kopi)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-16">
              <button onClick={() => navigate("/home/produk")} className="caramel-btn px-10 py-4 font-body text-sm uppercase tracking-[0.15em]">
                Lihat Semua Produk
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className={`font-serif text-4xl md:text-6xl font-bold mb-16 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Lebih Dari Sekadar Kopi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f) => (
                <div key={f.id} className={`card-premium p-8 text-center ${isDark ? "bg-[#2a2522]" : "bg-white"}`}>
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#C77A23]/10 rounded-full flex items-center justify-center">
                    <span className="font-serif text-xl font-bold text-[#C77A23]">{f.code}</span>
                  </div>
                  <h3 className={`font-serif text-2xl font-bold mb-3 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{f.title}</h3>
                  <p className={`text-sm font-body leading-relaxed ${textMuted}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className={`py-24 px-6 md:px-12 ${testimonialBg}`}>
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#E8D8C6] mb-16">Kata Mereka</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className={`p-8 rounded-xl text-left border border-[#C77A23]/20 ${isDark ? "bg-white/5" : "bg-white/5"}`}>
                  <p className="text-[#E8D8C6]/80 font-body mb-8 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-[#C77A23]/20">
                    <img src={t.img} className="w-12 h-12 rounded-full border-2 border-[#C77A23]" alt={t.name} />
                    <div>
                      <p className="text-[#E8D8C6] font-body text-sm font-medium uppercase">{t.name}</p>
                      <p className="text-[#C77A23] font-body text-xs uppercase">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={`pt-16 pb-8 px-6 md:px-12 ${footerBg}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#C77A23]/30">
            <div className="md:col-span-5">
              <h2 className="font-serif text-3xl font-bold italic mb-4">Kopi Wae</h2>
              <p className="text-sm opacity-80 font-body leading-relaxed mb-6">Menyajikan racikan kopi murni berkualitas tinggi langsung dari petani lokal Magelang.</p>
              <div className="flex gap-3">
                {["IG", "FB", "TW", "YT"].map((soc, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-[#C77A23]/30 rounded-full flex items-center justify-center font-body text-xs uppercase hover:bg-[#C77A23] hover:text-white transition-all">
                    {soc}
                  </a>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#C77A23] mb-6 font-medium">Navigasi</h3>
              <ul className="space-y-3 text-sm font-body">{/* ... links ... */}</ul>
            </div>
            <div className="md:col-span-4">
              <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[#C77A23] mb-6 font-medium">Jam Operasional & Alamat</h3>
              <div className="space-y-4 text-sm font-body opacity-80">
                <p>
                  <span className="block text-xs text-[#C77A23] uppercase">Setiap Hari:</span>09:00 AM - 11:00 PM WIB
                </p>
                <p>
                  <span className="block text-xs text-[#C77A23] uppercase">Lokasi Roastery:</span>Jl. Pemuda No. 42, Magelang, Jawa Tengah.
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-60 font-body uppercase tracking-wider">
            <p>&copy; 2026 Kopi Wae. All Rights Reserved.</p>
            <p>Built with Passion</p>
          </div>
        </footer>

        {/* POPUP VOUCHER */}
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`rounded-2xl max-w-md w-full p-8 shadow-2xl border border-[#C77A23]/20 ${isDark ? "bg-[#2a2522] text-[#E8D8C6]" : "bg-white text-[#3A2F2B]"}`}>
              <button onClick={() => setShowPopup(false)} className={`absolute top-4 right-4 font-body text-sm transition-all ${isDark ? "text-[#E8D8C6]/50 hover:text-[#C77A23]" : "text-[#3A2F2B]/50 hover:text-[#C77A23]"}`}>
                X
              </button>
              <h2 className={`font-serif text-2xl font-bold mb-6 ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>Kupon Spesial</h2>
              <div className="space-y-4 mb-6">
                {voucherAktif.length === 0 ? (
                  <p className={`text-center text-sm font-body py-8 ${textMuted}`}>Belum ada voucher tersedia</p>
                ) : (
                  voucherAktif.map((v, i) => {
                    const habis = v.kuota_habis === 1;
                    return (
                      <div key={i} className={`card-premium p-5 ${habis ? "opacity-50" : ""} ${isDark ? "bg-[#3A2F2B]" : "bg-white"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-serif text-xl font-bold text-[#C77A23]">{v.kode}</span>
                          <span className={`font-body text-lg font-bold ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>{v.diskon_persen}% OFF</span>
                        </div>
                        <div className="border-t border-dashed border-[#C77A23]/20 my-3" />
                        <div className="space-y-2 text-xs font-body uppercase mb-4">
                          <p className="flex justify-between">
                            <span className={textMuted}>Max Potongan</span>
                            <span className="font-medium">Rp {Number(v.max_diskon || 0).toLocaleString("id-ID")}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className={textMuted}>Min Pembelian</span>
                            <span className="font-medium">Rp {Number(v.min_belanja || 0).toLocaleString("id-ID")}</span>
                          </p>
                        </div>
                        {habis ? (
                          <div className={`w-full py-2.5 text-center rounded-lg font-body text-xs uppercase ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-400"}`}>
                            Sudah Dipakai ({v.sudah_dipakai}/{v.max_usage_per_user})
                          </div>
                        ) : (
                          <button onClick={() => handleCopy(v.kode)} className={`w-full py-2.5 rounded-lg font-body text-xs uppercase tracking-wider transition-all ${copiedCode === v.kode ? "bg-green-500 text-white" : "caramel-btn"}`}>
                            {copiedCode === v.kode ? "Tersalin" : "Salin Kode"}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className={`w-full py-3 rounded-lg font-body text-sm uppercase tracking-wider transition-all ${isDark ? "bg-[#E8D8C6] text-[#3A2F2B] hover:bg-[#C77A23] hover:text-white" : "bg-[#3A2F2B] text-white hover:bg-[#C77A23]"}`}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
