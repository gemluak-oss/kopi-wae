import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import Dashboard from "./pages/admin/Dashboard";
import ManajemenKategori from "./pages/admin/ManajemenKategori";
import ManajemenProduk from "./pages/admin/ManajemenProduk";
import ManajemenPesanan from "./pages/admin/ManajemenPesanan";
import ManajemenPengguna from "./pages/admin/ManajemenPengguna";
import LaporanPenjualan from "./pages/admin/LaporanPenjualan";
import ProfilAdmin from "./pages/admin/ProfilAdmin";

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
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={role === "admin" ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="kategori" element={<ManajemenKategori />} />
          <Route path="produk" element={<ManajemenProduk />} />
          <Route path="pesanan" element={<ManajemenPesanan />} />
          <Route path="pengguna" element={<ManajemenPengguna />} />
          <Route path="laporan" element={<LaporanPenjualan />} />
          <Route path="profil" element={<ProfilAdmin />} />
        </Route>

        <Route path="/home" element={<UserLayout role={role} onLogout={handleLogout} />}>
          <Route index element={<Home />} />
          <Route path="produk" element={<ListProduk />} />
          <Route path="detail" element={<DetailProduk />} />
          <Route path="detail/:id" element={<DetailProduk />} />
          <Route path="keranjang" element={role === "user" ? <Keranjang /> : <Navigate to="/login" />} />
          <Route path="checkout" element={role === "user" ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="history" element={role === "user" ? <History /> : <Navigate to="/login" />} />
          <Route path="profil" element={role === "user" ? <Profil /> : <Navigate to="/login" />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
