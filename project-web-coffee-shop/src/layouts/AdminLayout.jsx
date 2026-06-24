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

  // Financial Dashboard Theme
  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const sidebarBg = isDark ? "bg-slate-950 border-r border-slate-800" : "bg-[#003366]";
  const sidebarText = "text-white";
  const accent = "bg-emerald-500";
  const accentHover = "hover:bg-emerald-600";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

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
    { path: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/admin/kategori", label: "Kategori", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { path: "/admin/produk", label: "Produk", icon: "M16 11V7m0 4h4m-4 0v4m0-4H4m12 8h4m-4 0v-4m0 4H4m4-16v4m0 0H4m4 0v4m0-4h4" },
    { path: "/admin/pesanan", label: "Pesanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { path: "/admin/pengguna", label: "Pengguna", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { path: "/admin/voucher", label: "Voucher", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
    {
      path: "/admin/laporan",
      label: "Laporan",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    { path: "/admin/profil", label: "Profil Saya", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { path: "/home", label: "Preview Toko", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14", isExternal: true },
  ];

  const getPageTitle = () => {
    const item = menuItems.find((m) => m.path === location.pathname && !m.isExternal);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .trend-up { color: #22C55E; }
        .trend-down { color: #EF4444; }
        .metric-card { transition: all 0.2s ease; }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .count-up { font-variant-numeric: tabular-nums; }
      `}</style>

      <div className={`flex h-screen ${bg} font-sans`}>
        {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col ${sidebarBg} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-emerald-500/30">KW</div>
            <div className={sidebarText}>
              <h2 className="font-semibold text-sm tracking-tight">Kopi Wae</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">Admin Panel</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const linkClass = `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : `${sidebarText}/70 hover:bg-white/10 hover:${sidebarText}`
              }`;

              if (item.isExternal) {
                return (
                  <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsSidebarOpen(false)} className={linkClass}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)} className={linkClass}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden flex-shrink-0 text-white font-semibold text-xs">
                {adminData?.foto ? <img src={adminData.foto} alt="" className="w-full h-full object-cover" /> : adminData?.user_name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${sidebarText}`}>{adminData?.user_name || "Admin"}</p>
                <p className={`text-[10px] truncate ${sidebarText}/40`}>{adminData?.email || ""}</p>
              </div>
            </div>
            <button onClick={() => setShowLogoutModal(true)} className="w-full py-2.5 rounded-lg bg-red-500/10 text-red-400 font-medium text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all">
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className={`flex items-center justify-between px-6 h-16 border-b ${border} ${cardBg}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg ${border} ${cardBg} lg:hidden hover:bg-slate-100`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">{getPageTitle()}</h1>
                <p className={`text-[10px] uppercase tracking-wider ${mutedText}`}>Kopi Wae Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`px-3 py-1.5 rounded-lg border ${border} text-xs font-medium tracking-wider transition-all hover:bg-slate-100 ${isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-600"}`}
              >
                {isDark ? "LIGHT" : "DARK"}
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium">{adminData?.user_name || "Admin"}</p>
                <p className={`text-[10px] uppercase tracking-wider ${mutedText}`}>Administrator</p>
              </div>
              <Link to="/admin/profil" className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden text-white font-semibold text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all">
                {adminData?.foto ? <img src={adminData.foto} alt="" className="w-full h-full object-cover" /> : adminData?.user_name?.charAt(0)?.toUpperCase() || "A"}
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className={`flex-1 overflow-y-auto p-6 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
            <Outlet />
          </main>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
            <div className={`${cardBg} rounded-2xl border ${border} p-8 max-w-sm w-full text-center shadow-2xl`}>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Konfirmasi Logout</h3>
              <p className={`text-sm ${mutedText} mb-8`}>Apakah kamu yakin ingin keluar dari panel admin?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-2.5 rounded-xl border ${border} font-medium text-sm hover:bg-slate-50 transition-all`}>
                  Batal
                </button>
                <button onClick={handleLogout} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-red-600 transition-all">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminLayout;
