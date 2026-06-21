import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import axios from "axios";

const UserLayout = ({ role, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [jumlahKeranjang, setJumlahKeranjang] = useState(0);

  const hitungKeranjang = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || role !== "user") {
      setJumlahKeranjang(0);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/user/keranjang/${user.id}`);
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

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-stone-50">
      <header className="bg-stone-900 text-stone-100 py-3 px-6 md:px-10 flex items-center justify-between border-b border-stone-800 fixed top-0 left-0 right-0 z-[100] shadow-md">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/home")}>
          <svg className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
          </svg>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-wider leading-none text-white">KOPI WAE</h1>
            <p className="text-[9px] md:text-[10px] tracking-[0.2em] text-amber-600/80 uppercase font-semibold">Coffee & Roasters</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-bold tracking-wider uppercase text-stone-300">
            <Link to="/home" className="hover:text-amber-500 transition-colors">
              Beranda
            </Link>
            <Link to="/home/produk" className="hover:text-amber-500 transition-colors">
              Produk
            </Link>
            <Link to="/home/history" className="hover:text-amber-500 transition-colors">
              Riwayat
            </Link>
            <Link to="/home/profil" className="hover:text-amber-500 transition-colors">
              Profil
            </Link>
          </nav>

          <Link to="/home/keranjang" className="relative hover:text-amber-500 transition-colors hidden sm:block text-stone-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {role === "user" && jumlahKeranjang > 0 && <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{jumlahKeranjang}</span>}
          </Link>

          {role === "guest" ? (
            <button onClick={() => navigate("/login")} className="hidden lg:block bg-amber-700 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase transition-all">
              Daftar / Masuk
            </button>
          ) : (
            <button onClick={() => setShowLogoutModal(true)} className="hidden lg:block border border-stone-600 hover:border-red-500 text-stone-300 hover:text-red-500 px-5 py-2 rounded-full text-[11px] font-bold uppercase transition-all">
              Keluar
            </button>
          )}

          <button className="lg:hidden text-stone-300 p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      <div className={`lg:hidden fixed inset-0 z-[90] bg-stone-900/95 backdrop-blur-md transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-lg font-bold uppercase text-stone-300">
          <Link to="/home" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500">
            Beranda
          </Link>
          <Link to="/home/produk" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500">
            Katalog
          </Link>
          <Link to="/home/history" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500">
            Riwayat
          </Link>
          <Link to="/home/keranjang" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500">
            Keranjang {jumlahKeranjang > 0 ? `(${jumlahKeranjang})` : ""}
          </Link>
          <Link to="/home/profil" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500">
            Profil
          </Link>
          {role === "guest" ? (
            <button
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              className="mt-6 bg-amber-700 text-white px-10 py-3 rounded-full font-bold uppercase"
            >
              Daftar / Masuk
            </button>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="mt-6 border border-red-500/50 text-red-400 px-10 py-3 rounded-full"
            >
              Keluar Akun
            </button>
          )}
        </div>
      </div>

      <main className={`flex-grow pt-16 transition-all duration-300 ${isMenuOpen ? "blur-md scale-[0.98]" : ""}`}>
        <Outlet />
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Konfirmasi Logout</h3>
            <p className="text-stone-500 text-sm mb-6">Apakah kamu yakin ingin keluar dari akun?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 border border-stone-200 py-3 rounded-xl font-semibold text-stone-600 hover:bg-stone-50 transition-colors">
                Batal
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors">
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
