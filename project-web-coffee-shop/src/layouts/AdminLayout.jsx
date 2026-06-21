import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLayout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const loadAdmin = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/profil/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminData(res.data.data);
    } catch (err) {
      // Fallback ke localStorage
      setAdminData({
        user_name: user.name || "Admin",
        email: user.email || "",
        foto: user.foto || null,
      });
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
    <div className="flex h-screen bg-stone-100">
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-stone-700/50">
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-sm">KW</div>
          <div>
            <h2 className="font-bold text-white text-sm">Kopi Wae</h2>
            <p className="text-[10px] text-stone-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-stone-400 hover:bg-stone-800 hover:text-white"}`}
              >
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-stone-700/50">
          <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-stone-800/50">
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              {adminData?.foto ? <img src={adminData.foto} alt="" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-sm">{adminData?.user_name?.charAt(0)?.toUpperCase() || "A"}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{adminData?.user_name || "Admin"}</p>
              <p className="text-[10px] text-stone-400 truncate">{adminData?.email || ""}</p>
            </div>
          </div>
          <button onClick={() => setShowLogoutModal(true)} className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-stone-400 hover:text-stone-600 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-stone-800">{getPageTitle()}</h1>
              <p className="text-xs text-stone-400">Kopi Wae Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-800">{adminData?.user_name || "Admin"}</p>
              <p className="text-xs text-stone-400">Administrator</p>
            </div>
            <Link to="/admin/profil" className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0 hover:ring-2 ring-amber-400 transition">
              {adminData?.foto ? <img src={adminData.foto} alt="" className="w-full h-full object-cover" /> : <span className="text-white font-bold">{adminData?.user_name?.charAt(0)?.toUpperCase() || "A"}</span>}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-stone-50/50">
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Konfirmasi Logout</h3>
            <p className="text-stone-500 text-sm mb-6">Apakah kamu yakin ingin keluar?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 border border-stone-200 py-3 rounded-xl font-semibold text-stone-600 hover:bg-stone-50">
                Batal
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold">
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
