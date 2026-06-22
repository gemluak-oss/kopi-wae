import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLayout({ onLogout, isDark, setIsDark }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDF6] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const yellowBg = isDark ? "bg-yellow-500" : "bg-[#FFC700]";

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const loadAdmin = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/profil/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAdminData(res.data.data);
    } catch (err) {
      setAdminData({ user_name: user.name || "Admin", email: user.email || "", foto: user.foto || null });
    }
  };

  useEffect(() => {
    loadAdmin();
    window.addEventListener("adminUpdated", loadAdmin);
    return () => window.removeEventListener("adminUpdated", loadAdmin);
  }, []);

  const menuItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/kategori", label: "Kategori" },
    { path: "/admin/produk", label: "Produk" },
    { path: "/admin/pesanan", label: "Pesanan" },
    { path: "/admin/pengguna", label: "Pengguna" },
    { path: "/admin/voucher", label: "Voucher" },
    { path: "/admin/laporan", label: "Laporan" },
    { path: "/admin/profil", label: "Profil Saya" },
  ];

  const getPageTitle = () => {
    const item = menuItems.find((m) => m.path === location.pathname);
    return item ? item.label : "Dashboard";
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    onLogout();
    navigate("/login");
  };

  return (
    <div className={`flex h-screen ${bg} font-mono`}>
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r-4 ${b} transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <div className={`flex items-center gap-3 px-6 h-16 border-b-4 ${b} ${yellowBg}`}>
          <div className={`w-8 h-8 border-2 ${b} ${cardBg} flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px] ${shadow}`}>KW</div>
          <div className="text-black">
            <h2 className="font-black text-xs uppercase">Kopi Wae</h2>
            <p className="text-[10px] font-bold uppercase opacity-60">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 border-2 ${b} text-xs font-black uppercase tracking-wider transition-all
                  ${active ? "bg-[#00F5D4] text-black translate-x-1 translate-y-1 shadow-none" : `${cardBg} shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5`}`}
              >
                <span>{item.label}</span>
                {active && <span className="w-2 h-2 bg-black" />}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t-4 ${b} ${isDark ? "bg-gray-800" : "bg-[#FFFDF6]"}`}>
          <div className={`flex items-center gap-3 p-3 border-2 ${b} ${cardBg} shadow-[3px_3px_0px_0px] ${shadow} mb-3`}>
            <div className={`w-8 h-8 border-2 ${b} ${yellowBg} flex items-center justify-center overflow-hidden flex-shrink-0`}>
              {adminData?.foto ? <img src={adminData.foto} alt="" className="w-full h-full object-cover" /> : <span className="font-black text-xs text-black">{adminData?.user_name?.charAt(0)?.toUpperCase() || "A"}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase truncate">{adminData?.user_name || "Admin"}</p>
              <p className="text-[10px] font-bold opacity-60 truncate">{adminData?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full px-2 py-2.5 border-2 ${b} bg-red-400 text-black font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`flex items-center justify-between px-6 h-16 border-b-4 ${b} ${cardBg}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-1 border-2 ${b} ${cardBg} lg:hidden`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider">{getPageTitle()}</h1>
              <p className="text-[10px] font-bold uppercase opacity-50">Kopi Wae Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* DARK MODE TOGGLE - PINDAH KE SINI */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`px-3 py-1.5 border-2 ${b} font-black text-xs uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${isDark ? "bg-yellow-400 text-black" : "bg-black text-white"}`}
            >
              {isDark ? "LIGHT" : "DARK"}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black uppercase">{adminData?.user_name || "Admin"}</p>
              <p className="text-[10px] font-bold uppercase opacity-50">Administrator</p>
            </div>
            <Link
              to="/admin/profil"
              className={`w-9 h-9 border-2 ${b} ${yellowBg} flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px] ${shadow} hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all`}
            >
              {adminData?.foto ? <img src={adminData.foto} alt="" className="w-full h-full object-cover" /> : <span className="font-black text-sm text-black">{adminData?.user_name?.charAt(0)?.toUpperCase() || "A"}</span>}
            </Link>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-6 ${isDark ? "bg-gray-900/50" : "bg-[#FFFDF6]"}`}>
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className={`${cardBg} border-4 ${b} p-6 max-w-sm w-full text-left shadow-[8px_8px_0px_0px] ${shadow}`}>
            <h3 className="text-lg font-black uppercase mb-2">Konfirmasi</h3>
            <p className="text-xs font-bold uppercase opacity-60 mb-6">Apakah kamu yakin ingin keluar?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 border-2 ${b} ${cardBg} py-2.5 font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className={`flex-1 border-2 ${b} bg-red-400 text-black py-2.5 font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
