import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profil = ({ isDark }) => {
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

  const b = isDark ? "border-white" : "border-[#121212]";
  const bg = isDark ? "bg-gray-900 text-white" : "bg-[#FFFDEE] text-[#121212]";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const shadow = isDark ? "shadow-white" : "shadow-[#121212]";
  const mutedBg = isDark ? "bg-gray-700" : "bg-stone-100";

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
      const res = await axios.get(`http://localhost:5000/api/user/profil/${userLogin.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data.data);
      setFormData({ user_name: res.data.data.user_name, email: res.data.data.email, no_hp: res.data.data.no_hp || "" });
      if (res.data.data.foto) setPreview(res.data.data.foto);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/history/${userLogin.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTotalOrders(res.data.data.length);
    } catch (err) {}
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
      <main className={`min-h-screen ${bg} font-mono flex items-center justify-center`}>
        <div className={`px-6 py-3 border-4 ${b} ${cardBg} font-bold animate-pulse uppercase shadow-[4px_4px_0px_0px] ${shadow}`}>Memuat profil...</div>
      </main>
    );

  return (
    <main className={`min-h-screen ${bg} font-mono py-16`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest font-bold mb-2">My Account</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            MY <span className={`px-2 bg-[#FFB703] text-black border-2 ${b} inline-block shadow-[4px_4px_0px_0px] ${shadow}`}>PROFILE</span>
          </h1>
        </section>

        <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
          <div className={`${cardBg} border-4 ${b} p-8 shadow-[6px_6px_0px_0px] ${shadow}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-44 h-44 border-4 ${b} ${mutedBg} flex items-center justify-center text-5xl font-black overflow-hidden`}>
                {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : user?.user_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              {isEditing && (
                <label className="mt-4 bg-[#00F5D4] text-black border-2 border-[#121212] px-4 py-2 font-black text-xs uppercase cursor-pointer shadow-[2px_2px_0px_0px] hover:bg-white transition-all">
                  Pilih Foto <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              <h2 className="text-2xl font-black mt-6 uppercase truncate">{user?.user_name || "Coffee Lover"}</h2>
              <span className="mt-1 text-xs font-bold opacity-60 break-all">{user?.email}</span>
              <span className={`mt-4 bg-[#FFB703] text-black border-2 ${b} px-4 py-1 text-xs font-black uppercase`}>{user?.role === "admin" ? "Admin" : "Member"}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`${isDark ? "bg-gray-700" : "bg-[#121212]"} text-white p-6 border-4 ${b} flex items-center justify-between`}>
              <h3 className="text-lg font-black uppercase">Statistik</h3>
              <div className={`flex items-center gap-4 bg-white text-black border-2 ${b} px-4 py-2`}>
                <h4 className="text-3xl font-black">{totalOrders}</h4>
                <p className="text-[10px] font-black uppercase opacity-60">
                  Total
                  <br />
                  Order
                </p>
              </div>
            </div>

            <section className={`${cardBg} border-4 ${b} p-8 shadow-[6px_6px_0px_0px] ${shadow}`}>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase font-black mb-1">Personal Information</p>
                  <h2 className="text-2xl font-black uppercase">Informasi Akun</h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-5 py-2 border-2 ${b} font-black text-xs uppercase shadow-[3px_3px_0px_0px] ${shadow} transition-all ${isEditing ? "bg-red-400 text-black" : "bg-stone-100 hover:bg-[#00F5D4] text-black"}`}
                >
                  {isEditing ? "Batal" : "Edit"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nama", key: "user_name" },
                  { label: "Email", key: "email" },
                  { label: "No. HP", key: "no_hp" },
                ].map((f) => (
                  <div key={f.key} className={f.key === "no_hp" ? "md:col-span-2" : ""}>
                    <label className="text-xs font-black uppercase opacity-50 mb-2 block">{f.label}</label>
                    {isEditing ? (
                      <input type="text" value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className={`${mutedBg} border-3 ${b} px-4 py-3 w-full font-bold text-sm outline-none`} />
                    ) : (
                      <p className={`font-black text-lg ${mutedBg} border-2 ${b} px-4 py-2 inline-block uppercase`}>{user?.[f.key] || "-"}</p>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-8 bg-[#00F5D4] border-3 border-[#121212] text-black h-12 px-6 font-black uppercase text-xs shadow-[4px_4px_0px_0px] hover:shadow-[1px_1px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  Simpan
                </button>
              )}
            </section>

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full bg-red-400 border-4 ${b} text-black h-14 font-black uppercase text-xs shadow-[6px_6px_0px_0px] ${shadow} hover:shadow-[2px_2px_0px_0px] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
            >
              Keluar Akun
            </button>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${cardBg} border-4 ${b} p-8 max-w-sm w-full text-center shadow-[10px_10px_0px_0px] ${shadow}`}>
            <h3 className="text-2xl font-black mb-2 uppercase">Konfirmasi</h3>
            <p className="opacity-70 font-medium text-xs uppercase mb-8">Apakah kamu yakin ingin keluar?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className={`flex-1 ${mutedBg} border-3 ${b} py-3 font-black uppercase shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] transition-all`}>
                Batal
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-400 text-black border-3 border-[#121212] py-3 font-black uppercase shadow-[3px_3px_0px_0px] hover:shadow-[1px_1px_0px_0px] transition-all">
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
