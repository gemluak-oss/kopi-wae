import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

const UserLayout = ({ role, onLogout, isDark, setIsDark }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [jumlahKeranjang, setJumlahKeranjang] = useState(0);

  const hitungKeranjang = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token || role !== "user") {
      setJumlahKeranjang(0);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/user/keranjang/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const total = res.data.data.items.reduce((sum, item) => sum + item.qty, 0);
      setJumlahKeranjang(total);
    } catch (err) {
      setJumlahKeranjang(0);
    }
  };

  useEffect(() => {
    hitungKeranjang();
    window.addEventListener("keranjangChanged", hitungKeranjang);
    const interval = setInterval(hitungKeranjang, 3000);
    return () => {
      window.removeEventListener("keranjangChanged", hitungKeranjang);
      clearInterval(interval);
    };
  }, [role]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const isActive = (path) => {
    if (path === "/home") return location.pathname === "/home";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; }
        .font-body { font-family: 'Roboto', sans-serif; }
        .nav-link {
          border-radius: 8px; transition: all 0.3s ease;
          font-family: 'Roboto', sans-serif; font-weight: 500;
        }
        .nav-link:hover { background: rgba(199,122,35,0.1); color: #C77A23; }
        .nav-link.active { background: #C77A23; color: white; }
        .caramel-btn {
          background: #C77A23; color: white; border-radius: 10px;
          box-shadow: 0 4px 12px rgba(199,122,35,0.3);
          transition: all 0.3s ease; font-family: 'Roboto', sans-serif;
          font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .caramel-btn:hover { background: #3A2F2B; box-shadow: 0 6px 18px rgba(58,47,43,0.4); }
        .cart-badge {
          background: #C77A23; color: white; border-radius: 50%;
          font-family: 'Roboto', sans-serif; font-size: 10px; font-weight: 700;
        }
      `}</style>

      <div className={`min-h-screen flex flex-col font-body ${isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]"}`}>
        <header
          className={`py-4 px-6 md:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-[100] backdrop-blur-md ${isDark ? "bg-[#3A2F2B]/90 border-b border-[#C77A23]/30" : "bg-[#E8D8C6]/90 border-b border-[#C77A23]/30"}`}
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <div className={`p-2 rounded-xl ${isDark ? "bg-[#C77A23]/20" : "bg-[#C77A23]/10"}`}>
              <svg className="w-8 h-8 text-[#C77A23]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold italic leading-none text-[#C77A23]">KOPI WAE</h1>
              <p className="text-[10px] font-body uppercase tracking-[0.2em] opacity-60">Coffee & Roasters</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-2 text-xs uppercase">
              {[
                { to: "/home", label: "Beranda" },
                { to: "/home/produk", label: "Produk" },
                { to: "/home/history", label: "Riwayat" },
                { to: "/home/profil", label: "Profil" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className={`nav-link px-4 py-2 ${isActive(link.to) ? "active" : ""}`}>
                  {link.label}
                </Link>
              ))}
              {role === "admin" && (
                <Link to="/admin/dashboard" className="nav-link px-4 py-2 !bg-[#3A2F2B] !text-[#E8D8C6] hover:!bg-[#C77A23] hover:!text-white">
                  Dashboard
                </Link>
              )}
            </nav>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl font-body text-xs uppercase tracking-wider transition-all ${isDark ? "bg-[#C77A23]/20 text-[#E8D8C6] hover:bg-[#C77A23]/30" : "bg-[#C77A23]/10 text-[#3A2F2B] hover:bg-[#C77A23]/20"}`}
            >
              {isDark ? "LIGHT" : "DARK"}
            </button>

            <Link to="/home/keranjang" className="relative">
              <div className={`p-2 rounded-xl transition-all ${isDark ? "bg-[#C77A23]/20 hover:bg-[#C77A23]/30" : "bg-[#C77A23]/10 hover:bg-[#C77A23]/20"}`}>
                <svg className="w-5 h-5 text-[#C77A23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              {role === "user" && jumlahKeranjang > 0 && <span className="cart-badge absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">{jumlahKeranjang}</span>}
            </Link>

            {role === "guest" ? (
              <button onClick={() => navigate("/login")} className="caramel-btn hidden lg:block px-5 py-2 text-xs">
                Masuk
              </button>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`hidden lg:block px-5 py-2 rounded-xl font-body text-xs uppercase tracking-wider transition-all ${isDark ? "bg-white/10 text-[#E8D8C6] hover:bg-red-400/20" : "bg-white text-[#3A2F2B] hover:bg-red-50"}`}
              >
                Keluar
              </button>
            )}

            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className={`p-2 rounded-xl ${isDark ? "bg-[#C77A23]/20" : "bg-[#C77A23]/10"}`}>
                <svg className="w-5 h-5 text-[#C77A23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </div>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`lg:hidden fixed top-0 bottom-0 right-0 w-[280px] z-[95] p-8 pt-24 transition-transform duration-300 ${isDark ? "bg-[#3A2F2B]" : "bg-[#E8D8C6]"} ${isMenuOpen ? "translate-x-0" : "translate-x-full"} border-l border-[#C77A23]/30`}
        >
          <div className="flex flex-col gap-4 text-md font-body uppercase font-medium">
            {[
              { to: "/home", label: "Beranda" },
              { to: "/home/produk", label: "Produk" },
              { to: "/home/history", label: "Riwayat" },
              { to: "/home/keranjang", label: `Keranjang ${jumlahKeranjang > 0 ? `(${jumlahKeranjang})` : ""}` },
              { to: "/home/profil", label: "Profil" },
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={`nav-link p-3 ${isActive(link.to) ? "active" : ""}`}>
                {link.label}
              </Link>
            ))}
            {role === "admin" && (
              <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="nav-link p-3 !bg-[#3A2F2B] !text-[#E8D8C6]">
                Dashboard
              </Link>
            )}
            <hr className="border-t border-[#C77A23]/20 my-2" />
            {role === "guest" ? (
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="caramel-btn w-full py-3 text-sm"
              >
                MASUK
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full py-3 rounded-xl bg-red-400/10 text-red-400 font-body text-sm uppercase font-medium hover:bg-red-400/20 transition-all"
              >
                KELUAR
              </button>
            )}
          </div>
        </div>

        <main className="flex-grow pt-[76px]">
          <Outlet />
        </main>

        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl ${isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-white text-[#3A2F2B]"} border border-[#C77A23]/20`}>
              <h3 className="font-serif text-2xl font-bold mb-2">Konfirmasi</h3>
              <p className="opacity-60 font-body text-sm mb-8">Apakah kamu yakin ingin keluar?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-3 rounded-xl font-body text-sm uppercase font-medium transition-all ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}>
                  Batal
                </button>
                <button onClick={handleLogout} className="flex-1 bg-red-400 text-white py-3 rounded-xl font-body text-sm uppercase font-medium hover:bg-red-500 transition-all">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserLayout;
