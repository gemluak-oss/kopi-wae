import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManajemenPengguna({ isDark }) {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("semua");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ user_name: "", email: "", password: "", role: "user", no_hp: "", foto: "" });
  const currentUser = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-200";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-800";

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
      const res = await axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      setAllUsers(res.data.data);
      setUsers(res.data.data);
      setIsLoading(false);
    } catch (err) {
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
    if (!window.confirm(`Yakin hapus "${userName}"?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!editingUser && !payload.password) return alert("Password wajib diisi");
      if (editingUser && !payload.password) delete payload.password;
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id_user}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:5000/api/admin/users", payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowModal(false);
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    }
  };

  const stats = { total: allUsers.length, admin: allUsers.filter((u) => u.role === "admin").length, user: allUsers.filter((u) => u.role === "user").length };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className={`text-sm ${mutedText} mt-1`}>Kelola akun pengguna dan admin</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pengguna
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: stats.total, borderLight: "border-slate-200", bgLight: "", borderDark: "border-slate-700", bgDark: "" },
          { label: "Admin", value: stats.admin, borderLight: "border-purple-200", bgLight: "bg-purple-50", borderDark: "border-purple-800", bgDark: "bg-purple-950/50" },
          { label: "Users", value: stats.user, borderLight: "border-amber-200", bgLight: "bg-amber-50", borderDark: "border-amber-800", bgDark: "bg-amber-950/50" },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-xl border ${isDark ? `${s.borderDark} ${s.bgDark}` : `${s.borderLight} ${s.bgLight}`} p-4 text-center shadow-sm`}>
            <p className="text-xs font-medium text-slate-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["semua", "admin", "user"].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${filterRole === r ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {r} ({r === "semua" ? stats.total : r === "admin" ? stats.admin : stats.user})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`${cardBg} rounded-xl border ${border} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Foto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">No.HP</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-44">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                    Tidak ada pengguna
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id_user} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-400 font-mono">#{u.id_user}</td>
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {u.foto ? <img src={u.foto} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-slate-500">{u.user_name.charAt(0).toUpperCase()}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{u.user_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 text-sm">{u.no_hp || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(u)} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-all">
                          Edit
                        </button>
                        {currentUser?.id !== u.id_user && (
                          <button onClick={() => handleDelete(u.id_user, u.user_name)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 transition-all">
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-2xl border ${border} w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold">{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: "Nama", key: "user_name", type: "text", required: true },
                { label: "Email", key: "email", type: "email", required: true },
                { label: "Password", key: "password", type: "password", required: !editingUser, placeholder: editingUser ? "Kosongkan jika tidak diubah" : "" },
                { label: "No.HP", key: "no_hp", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    placeholder={f.placeholder || ""}
                    className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                    required={f.required}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full rounded-lg border ${border} ${inputBg} px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="border border-dashed border-slate-300 rounded-lg p-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Foto Profil</label>
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
                  className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-medium file:cursor-pointer"
                />
                {formData.foto && <img src={formData.foto} alt="" className="w-14 h-14 rounded-lg object-cover border mt-3" />}
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-lg border ${border} text-sm font-medium hover:bg-slate-50 transition-all`}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
