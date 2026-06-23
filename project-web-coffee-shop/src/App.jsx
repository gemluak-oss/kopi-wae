import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import Dashboard from "./pages/admin/Dashboard";
import ManajemenKategori from "./pages/admin/ManajemenKategori";
import ManajemenProduk from "./pages/admin/ManajemenProduk";
import ManajemenPesanan from "./pages/admin/ManajemenPesanan";
import ManajemenPengguna from "./pages/admin/ManajemenPengguna";
import LaporanPenjualan from "./pages/admin/LaporanPenjualan";
import ProfilAdmin from "./pages/admin/ProfilAdmin";
import ManajemenVoucher from "./pages/admin/ManajemenVoucher";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Home from "./pages/user/Home";
import ListProduk from "./pages/user/ListProduk";
import Checkout from "./pages/user/Checkout";
import History from "./pages/user/History";
import Profil from "./pages/user/Profil";
import DetailProduk from "./pages/user/DetailProduk";
import Keranjang from "./pages/user/Keranjang";

function App() {
  const { isDark, setIsDark } = useTheme();

  // ✅ Cek localStorage SEKARANG juga (bukan cuma pas login)
  const [role, setRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (token && user) return user.role || "guest";
    return "guest";
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRole("guest");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={role !== "guest" ? <Navigate to={role === "admin" ? "/admin" : "/home"} replace /> : <Login setRole={setRole} isDark={isDark} />} />
        <Route path="/register" element={role !== "guest" ? <Navigate to={role === "admin" ? "/admin" : "/home"} replace /> : <Register isDark={isDark} />} />

        {/* ✅ ADMIN */}
        <Route path="/admin" element={role === "admin" ? <AdminLayout onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} /> : <Navigate to={role === "guest" ? "/login" : "/home"} replace />}>
          <Route index element={<Dashboard isDark={isDark} />} />
          <Route path="dashboard" element={<Dashboard isDark={isDark} />} />
          <Route path="kategori" element={<ManajemenKategori isDark={isDark} />} />
          <Route path="produk" element={<ManajemenProduk isDark={isDark} />} />
          <Route path="pesanan" element={<ManajemenPesanan isDark={isDark} />} />
          <Route path="pengguna" element={<ManajemenPengguna isDark={isDark} />} />
          <Route path="laporan" element={<LaporanPenjualan isDark={isDark} />} />
          <Route path="profil" element={<ProfilAdmin isDark={isDark} />} />
          <Route path="voucher" element={<ManajemenVoucher isDark={isDark} />} />
        </Route>

        {/* ✅ USER */}
        <Route path="/home" element={<UserLayout role={role} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />}>
          <Route index element={<Home isDark={isDark} />} />
          <Route path="produk" element={<ListProduk isDark={isDark} />} />
          <Route path="detail" element={<DetailProduk isDark={isDark} />} />
          <Route path="detail/:id" element={<DetailProduk isDark={isDark} />} />
          <Route path="keranjang" element={role === "user" ? <Keranjang isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="checkout" element={role === "user" ? <Checkout isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="history" element={role === "user" ? <History isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="profil" element={role === "user" ? <Profil isDark={isDark} /> : <Navigate to="/login" />} />
        </Route>

        {/* ✅ REDIRECT KALO ADMIN COBA BUKA / */}
        <Route path="/" element={<Navigate to={role === "admin" ? "/admin/dashboard" : "/home"} replace />} />
        <Route path="*" element={<Navigate to={role === "admin" ? "/admin/dashboard" : "/home"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
