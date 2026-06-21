import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({ user_name: "", email: "", no_hp: "" });

  const userLogin = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userLogin) {
      navigate("/login");
      return;
    }
    fetchProfil();
    fetchTotalOrders();
  }, []);

  const fetchProfil = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/profil/${userLogin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
      setFormData({ user_name: res.data.data.user_name, email: res.data.data.email, no_hp: res.data.data.no_hp || "" });
      if (res.data.data.foto) setPreview(res.data.data.foto);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil profil:", err);
      setIsLoading(false);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/history/${userLogin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalOrders(res.data.data.length);
    } catch (err) {
      console.error("Gagal ambil history:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      let fotoUrl = preview;
      if (selectedFile) {
        const formImg = new FormData();
        formImg.append("gambar", selectedFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formImg);
        fotoUrl = uploadRes.data.url;
      }
      await axios.put(`http://localhost:5000/api/user/profil/${userLogin.id}`, { user_name: formData.user_name, email: formData.email, no_hp: formData.no_hp, foto: fotoUrl || null }, { headers: { Authorization: `Bearer ${token}` } });
      const updatedUser = { ...userLogin, name: formData.user_name, foto: fotoUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
      setSelectedFile(null);
      fetchProfil();
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  if (isLoading)
    return (
      <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.4em] font-black text-amber-700 mb-4">My Account</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-stone-800">
            MY <span className="text-amber-700">PROFILE</span>
          </h1>
        </section>

        <div className="grid lg:grid-cols-[380px_1fr] gap-10">
          <div className="bg-[#FFF9F0] rounded-[3rem] p-8 shadow-lg border border-[#F0E4D0] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center">
              <div className="w-44 h-44 rounded-full bg-amber-100 flex items-center justify-center text-6xl overflow-hidden shadow-inner ring-4 ring-[#F5E6D0]">
                {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : user?.user_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              {isEditing && (
                <label className="mt-4 bg-amber-700 text-white px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer hover:bg-amber-800 transition shadow-md">
                  Pilih Foto
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              <h2 className="text-3xl font-black mt-6 text-stone-800">{user?.user_name || "Coffee Lover"}</h2>
              <span className="mt-2 text-stone-500">{user?.email}</span>
              <span className="mt-4 bg-amber-100 text-amber-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">{user?.role === "admin" ? "Admin" : "Member"}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-stone-800 text-white rounded-[3rem] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-black mb-6">Statistics</h3>
              <div className="text-center">
                <h4 className="text-5xl font-black text-amber-400">{totalOrders}</h4>
                <p className="text-xs uppercase tracking-widest text-stone-400 mt-2">Total Orders</p>
              </div>
            </div>

            <section className="bg-[#FFF9F0] rounded-[3rem] p-8 shadow-lg border border-[#F0E4D0] hover:shadow-xl transition-all duration-300">
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] font-black text-amber-700 mb-3">Personal Information</p>
                  <h2 className="text-3xl font-black text-stone-800">Informasi Akun</h2>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="text-amber-700 font-bold text-sm hover:bg-amber-50 px-5 py-2.5 rounded-full transition-colors border border-amber-200">
                  {isEditing ? "Batal" : "Edit"}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black uppercase text-stone-400 mb-1 block">Nama</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                      className="bg-[#FEFAF3] rounded-2xl border border-[#E8D5B0] px-5 py-4 w-full outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  ) : (
                    <p className="font-bold text-lg text-stone-800">{user?.user_name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-stone-400 mb-1 block">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#FEFAF3] rounded-2xl border border-[#E8D5B0] px-5 py-4 w-full outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  ) : (
                    <p className="font-bold text-lg text-stone-800">{user?.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-stone-400 mb-1 block">No. HP</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                      className="bg-[#FEFAF3] rounded-2xl border border-[#E8D5B0] px-5 py-4 w-full outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  ) : (
                    <p className="font-bold text-lg text-stone-800">{user?.no_hp || "-"}</p>
                  )}
                </div>
              </div>
              {isEditing && (
                <button onClick={handleSave} className="mt-8 bg-stone-800 hover:bg-amber-700 text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest transition-all shadow-md hover:shadow-xl active:scale-95">
                  Save Changes
                </button>
              )}
            </section>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full bg-[#FFF9F0] border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 h-14 rounded-2xl font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
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
    </main>
  );
};

export default Profil;
