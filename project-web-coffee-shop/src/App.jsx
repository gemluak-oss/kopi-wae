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

  const [role, setRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || "guest";
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRole("guest");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setRole={setRole} isDark={isDark} />} />
        <Route path="/register" element={<Register isDark={isDark} />} />

        <Route path="/admin" element={role === "admin" ? <AdminLayout onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard isDark={isDark} />} />
          <Route path="kategori" element={<ManajemenKategori isDark={isDark} />} />
          <Route path="produk" element={<ManajemenProduk isDark={isDark} />} />
          <Route path="pesanan" element={<ManajemenPesanan isDark={isDark} />} />
          <Route path="pengguna" element={<ManajemenPengguna isDark={isDark} />} />
          <Route path="laporan" element={<LaporanPenjualan isDark={isDark} />} />
          <Route path="profil" element={<ProfilAdmin isDark={isDark} />} />
          <Route path="voucher" element={<ManajemenVoucher isDark={isDark} />} />
        </Route>

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

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
