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
  const activeClass = isDark ? "bg-white text-black border-white" : "bg-black text-white border-[#121212]";
  const inactiveClass = isDark ? "border-transparent hover:border-white hover:bg-gray-700" : "border-transparent hover:border-[#121212] hover:bg-white";

  return (
    <div className={`min-h-screen flex flex-col font-mono ${isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]"}`}>
      <header className={`border-b-4 py-4 px-6 md:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-[100] ${isDark ? "bg-gray-800 border-white" : "bg-[#FFB703] border-[#121212]"}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
          <div className={`p-1 border-2 shadow-[2px_2px_0px_0px] ${isDark ? "bg-gray-700 border-white shadow-white" : "bg-white border-[#121212] shadow-[#121212]"}`}>
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">KOPI WAE</h1>
            <p className="text-[10px] font-black uppercase opacity-70">Coffee & Roasters</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-2 text-xs font-black uppercase">
            {[
              { to: "/home", label: "Beranda" },
              { to: "/home/produk", label: "Produk" },
              { to: "/home/history", label: "Riwayat" },
              { to: "/home/profil", label: "Profil" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className={`border-2 px-4 py-2 transition-all ${isActive(link.to) ? activeClass : inactiveClass}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`border-3 p-2 font-black text-xs uppercase shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${isDark ? "bg-yellow-400 border-white text-black shadow-white" : "bg-black border-[#121212] text-white"}`}
          >
            {isDark ? "LIGHT" : "DARK"}
          </button>

          <Link to="/home/keranjang" className="relative">
            <div
              className={`border-3 p-2 shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${isDark ? "bg-gray-700 border-white shadow-white" : "bg-white border-[#121212] shadow-[#121212]"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {role === "user" && jumlahKeranjang > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-400 border-2 border-[#121212] text-black text-[10px] w-5 h-5 rounded-none flex items-center justify-center font-black">{jumlahKeranjang}</span>
            )}
          </Link>

          {role === "guest" ? (
            <button
              onClick={() => navigate("/login")}
              className={`hidden lg:block border-3 px-5 py-2 font-black shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase text-xs ${isDark ? "bg-purple-400 border-white text-black shadow-white" : "bg-purple-300 border-[#121212]"}`}
            >
              Masuk
            </button>
          ) : (
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`hidden lg:block border-3 px-5 py-2 font-black shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase text-xs ${isDark ? "bg-gray-600 border-white text-white shadow-white" : "bg-white border-[#121212]"}`}
            >
              Keluar
            </button>
          )}

          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`border-3 p-2 shadow-[3px_3px_0px_0px] transition-all ${isDark ? "bg-gray-700 border-white shadow-white" : "bg-white border-[#121212] shadow-[#121212]"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu - KEEP SAME */}
      <div className={`lg:hidden fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
      <div
        className={`lg:hidden fixed top-0 bottom-0 right-0 w-[280px] z-[95] border-l-4 p-8 pt-24 transition-transform duration-300 ${isDark ? "bg-gray-800 border-white" : "bg-[#FFB703] border-[#121212]"} ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col gap-4 text-md font-black uppercase">
          {[
            { to: "/home", label: "Beranda" },
            { to: "/home/produk", label: "Produk" },
            { to: "/home/history", label: "Riwayat" },
            { to: "/home/keranjang", label: `Keranjang ${jumlahKeranjang > 0 ? `(${jumlahKeranjang})` : ""}` },
            { to: "/home/profil", label: "Profil" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`p-3 border-2 transition-all ${isActive(link.to) ? activeClass : isDark ? "border-transparent hover:bg-gray-700 hover:border-white" : "border-transparent hover:bg-white hover:border-[#121212]"}`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-t-2 my-4 border-current" />
          {role === "guest" ? (
            <button
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              className="w-full bg-purple-300 border-3 border-[#121212] py-3 font-black shadow-[4px_4px_0px_0px_#121212] uppercase text-black"
            >
              MASUK
            </button>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full bg-white border-3 border-[#121212] py-3 font-black shadow-[4px_4px_0px_0px_#121212] uppercase text-black"
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
          <div className={`border-4 p-8 max-w-sm w-full text-center shadow-[10px_10px_0px_0px] ${isDark ? "bg-gray-800 border-white shadow-white" : "bg-white border-[#121212] shadow-[#121212]"}`}>
            <h3 className="text-2xl font-black mb-2 uppercase">Konfirmasi</h3>
            <p className="opacity-70 font-medium text-xs uppercase mb-8">Apakah kamu yakin ingin keluar?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 border-3 py-3 font-black uppercase shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${isDark ? "bg-gray-700 border-white shadow-white" : "bg-stone-100 border-[#121212]"}`}
              >
                Batal
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-400 text-black border-3 border-[#121212] py-3 font-black uppercase shadow-[3px_3px_0px_0px_#121212] hover:shadow-[1px_1px_0px_0px] transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLayout;
