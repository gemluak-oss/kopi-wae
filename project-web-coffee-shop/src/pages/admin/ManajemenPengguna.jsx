import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenPengguna() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("semua");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ user_name: "", email: "", password: "", role: "user", no_hp: "", foto: "" });

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (filterRole === "semua") setUsers(allUsers);
    else setUsers(allUsers.filter((u) => u.role === filterRole));
  }, [filterRole, allUsers]);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data.data);
      setUsers(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil user:", err);
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ user_name: "", email: "", password: "", role: "user", no_hp: "", foto: "" });
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setFormData({ user_name: user.user_name, email: user.email, password: "", role: user.role, no_hp: user.no_hp || "", foto: user.foto || "" });
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id, userName) => {
    if (!window.confirm(`Yakin hapus user "${userName}"?`)) return;
    if (!window.confirm("Data tidak bisa dikembalikan. Lanjutkan?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!editingUser && !payload.password) return alert("Password wajib diisi");
      if (editingUser && !payload.password) delete payload.password;

      if (editingUser) {
        await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id_user}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/admin/users", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan user");
    }
  };

  const stats = { total: allUsers.length, admin: allUsers.filter((u) => u.role === "admin").length, user: allUsers.filter((u) => u.role === "user").length };

  return (
    <main className="p-4 md:p-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Manajemen Pengguna</h1>
          <p className="text-stone-500 mt-1">Kelola semua akun</p>
        </div>
        <button onClick={handleAdd} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Tambah Pengguna
        </button>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <p className="text-stone-500 text-xs uppercase">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <p className="text-stone-500 text-xs uppercase">Admin</p>
          <p className="text-2xl font-bold text-purple-600">{stats.admin}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <p className="text-stone-500 text-xs uppercase">User</p>
          <p className="text-2xl font-bold text-blue-600">{stats.user}</p>
        </div>
      </section>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex gap-2">
          {["semua", "admin", "user"].map((r) => (
            <button key={r} onClick={() => setFilterRole(r)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filterRole === r ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600"}`}>
              {r} ({r === "semua" ? stats.total : r === "admin" ? stats.admin : stats.user})
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b text-stone-600 text-xs uppercase">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Foto</th>
                <th className="text-left px-4 py-3">Nama</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">No. HP</th>
                <th className="text-center px-4 py-3">Role</th>
                <th className="text-center px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id_user} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-sm">#{u.id_user}</td>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                      {u.foto ? <img src={u.foto} alt="" className="w-full h-full object-cover" /> : <span className="text-amber-600 font-bold text-sm">{u.user_name.charAt(0).toUpperCase()}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{u.user_name}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">{u.email}</td>
                  <td className="px-4 py-3 text-sm">{u.no_hp || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        Edit
                      </button>
                      {currentUser?.id !== u.id_user && (
                        <button onClick={() => handleDelete(u.id_user, u.user_name)} className="text-red-600 hover:text-red-800 text-sm font-semibold">
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex justify-between">
              <h2 className="text-xl font-bold">{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input required type="text" value={formData.user_name} onChange={(e) => setFormData({ ...formData, user_name: e.target.value })} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password {editingUser && "(kosongkan jika tidak diganti)"}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full border rounded-lg p-2" required={!editingUser} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full border rounded-lg p-2">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. HP</label>
                <input type="text" value={formData.no_hp} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Foto Profil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formImg = new FormData();
                    formImg.append("gambar", file);
                    const uploadRes = await axios.post("http://localhost:5000/api/upload", formImg);
                    setFormData({ ...formData, foto: uploadRes.data.url });
                  }}
                  className="w-full border rounded-lg p-2 text-sm"
                />
                {formData.foto && <img src={formData.foto} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover" />}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 border rounded-lg">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-600 text-white rounded-lg">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
