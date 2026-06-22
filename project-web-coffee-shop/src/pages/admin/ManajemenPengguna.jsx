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

  const b = isDark ? "border-white" : "border-[#1A1A1A]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#EAE8E1] text-[#1A1A1A]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#1A1A1A]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-[#EAE8E1]";
  const inputBg = isDark ? "bg-gray-700" : "bg-[#FFFDF6]";

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
      <main className={`p-6 min-h-screen font-mono flex justify-center items-center ${bg}`}>
        <div className={`px-8 py-4 border-4 ${b} ${cardBg} font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat Pengguna...</div>
      </main>
    );

  return (
    <main className={`p-6 min-h-screen font-mono space-y-6 ${bg}`}>
      <header className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div>
          <h1 className="text-2xl font-black uppercase">Manajemen Pengguna</h1>
        </div>
        <button onClick={handleAdd} className={`px-5 py-3 border-3 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase shadow-[4px_4px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}>
          + Tambah Pengguna
        </button>
      </header>

      <section className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total, color: "" },
          { label: "Admin", value: stats.admin, color: "bg-purple-300 text-black" },
          { label: "User", value: stats.user, color: "bg-[#FFC700] text-black" },
        ].map((s, i) => (
          <div key={i} className={`${s.color || cardBg} p-4 border-4 ${b} shadow-[4px_4px_0px_0px] ${shadow} text-center`}>
            <p className="text-[10px] font-black uppercase opacity-60">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </section>

      <div className={`${cardBg} p-4 border-4 ${b} shadow-[4px_4px_0px_0px] ${shadow}`}>
        <div className="flex gap-2">
          {["semua", "admin", "user"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-4 py-2 border-2 ${b} font-black text-xs uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${filterRole === r ? (isDark ? "bg-white text-black" : "bg-black text-white") : `${cardBg}`}`}
            >
              {r} ({r === "semua" ? stats.total : r === "admin" ? stats.admin : stats.user})
            </button>
          ))}
        </div>
      </div>

      <div className={`${cardBg} p-6 border-4 ${b} shadow-[6px_6px_0px_0px] ${shadow} overflow-x-auto`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`${mutedBg} border-b-4 ${b} text-xs font-black uppercase`}>
              <th className="p-4">ID</th>
              <th className="p-4">Foto</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Email</th>
              <th className="p-4">No.HP</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-current/10 text-xs font-bold uppercase">
            {users.map((u) => (
              <tr key={u.id_user} className="hover:bg-black/5 transition-colors">
                <td className="p-4 opacity-60">#{u.id_user}</td>
                <td className="p-4">
                  <div className={`w-10 h-10 border-2 ${b} ${inputBg} flex items-center justify-center overflow-hidden`}>
                    {u.foto ? <img src={u.foto} alt="" className="w-full h-full object-cover" /> : <span className="font-black text-sm">{u.user_name.charAt(0).toUpperCase()}</span>}
                  </div>
                </td>
                <td className="p-4 font-black">{u.user_name}</td>
                <td className="p-4 opacity-80">{u.email}</td>
                <td className="p-4">{u.no_hp || "-"}</td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 border-2 ${b} text-[9px] font-black uppercase ${u.role === "admin" ? "bg-purple-300 text-black" : "bg-[#FFC700] text-black"}`}>{u.role}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className={`px-3 py-1.5 border-2 ${b} bg-[#FFC700] text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                    >
                      Edit
                    </button>
                    {currentUser?.id !== u.id_user && (
                      <button
                        onClick={() => handleDelete(u.id_user, u.user_name)}
                        className={`px-3 py-1.5 border-2 ${b} bg-red-400 text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      >
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className={`${cardBg} border-4 ${b} w-full max-w-md shadow-[8px_8px_0px_0px] ${shadow}`}>
            <div className={`p-4 border-b-4 ${b} bg-purple-300 text-black flex justify-between items-center`}>
              <h2 className="text-sm font-black uppercase">{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</h2>
              <button onClick={() => setShowModal(false)} className={`w-8 h-8 border-2 ${b} ${cardBg} flex items-center justify-center font-black`}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: "Nama", key: "user_name", type: "text", required: true },
                { label: "Email", key: "email", type: "email", required: true },
                { label: "Password", key: "password", type: "password", required: !editingUser },
                { label: "Role", key: "role", type: "select", options: ["user", "admin"] },
                { label: "No.HP", key: "no_hp", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] font-black uppercase mb-1.5">{f.label}</label>
                  {f.type === "select" ? (
                    <select value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className={`w-full border-2 ${b} p-2.5 text-xs font-bold uppercase ${inputBg}`}>
                      {f.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input type={f.type} value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className={`w-full border-2 ${b} p-2.5 text-xs font-bold ${inputBg}`} required={f.required} />
                  )}
                </div>
              ))}
              <div className={`border-2 border-dashed p-4 ${inputBg}`}>
                <label className="block text-[10px] font-black uppercase mb-1">Foto Profil</label>
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
                  className="w-full text-xs font-bold"
                />
                {formData.foto && (
                  <div className="pt-2 flex items-center gap-3">
                    <img src={formData.foto} alt="" className="w-14 h-14 border-2 object-cover" />
                    <span className="text-[9px] font-black opacity-50">Preview</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-5 py-2.5 border-2 ${b} ${cardBg} font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 border-2 ${b} bg-[#00F5D4] text-black font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                >
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
