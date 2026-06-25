import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useRealtime from "../../hooks/useRealtime";

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

  const bg = isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-[#E8D8C6] text-[#3A2F2B]";
  const cardBg = isDark ? "bg-[#2a2522]" : "bg-white";
  const textMuted = isDark ? "text-[#E8D8C6]/50" : "text-[#3A2F2B]/50";
  const borderColor = "border-[#C77A23]/20";

  useEffect(() => {
    window.scrollTo(0, 0);
    const userLogin = JSON.parse(localStorage.getItem("user")) || null;
    if (!userLogin) {
      navigate("/login");
      return;
    }
    fetchProfil();
    fetchTotalOrders();
  }, []);

  // ✅ SSE Auto refresh dengan guard
  useRealtime("profilUpdate", () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || null;
    if (currentUser) fetchProfil();
  });

  useRealtime("userUpdate", () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || null;
    if (currentUser) fetchProfil();
  });

  useRealtime("historyUpdate", () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || null;
    if (currentUser) fetchTotalOrders();
  });

  const fetchProfil = async () => {
    try {
      const userLogin = JSON.parse(localStorage.getItem("user")) || null;
      const token = localStorage.getItem("token");
      if (!userLogin?.id) return;

      const res = await axios.get(`http://localhost:5000/api/user/profil/${userLogin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
      setFormData({
        user_name: res.data.data.user_name,
        email: res.data.data.email,
        no_hp: res.data.data.no_hp || "",
      });
      if (res.data.data.foto) setPreview(res.data.data.foto);

      // ✅ Update localStorage biar navbar + komponen lain ikut ke-update
      const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...updatedUser,
          name: res.data.data.user_name,
          email: res.data.data.email,
          foto: res.data.data.foto,
        }),
      );
      window.dispatchEvent(new Event("storage"));

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const userLogin = JSON.parse(localStorage.getItem("user")) || null;
      const token = localStorage.getItem("token");
      if (!userLogin?.id) return;

      const res = await axios.get(`http://localhost:5000/api/user/history/${userLogin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const userLogin = JSON.parse(localStorage.getItem("user")) || null;
      const token = localStorage.getItem("token");
      let fotoUrl = preview;
      if (selectedFile) {
        const formImg = new FormData();
        formImg.append("gambar", selectedFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formImg);
        fotoUrl = uploadRes.data.url;
      }
      await axios.put(`http://localhost:5000/api/user/profil/${userLogin.id}`, { ...formData, foto: fotoUrl || null }, { headers: { Authorization: `Bearer ${token}` } });

      // ✅ Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userLogin,
          name: formData.user_name,
          foto: fotoUrl,
        }),
      );
      window.dispatchEvent(new Event("storage"));

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
    window.dispatchEvent(new Event("storage"));
    setShowLogoutModal(false);
    navigate("/login");
  };

  if (isLoading)
    return (
      <main className={`min-h-screen ${bg} font-body flex items-center justify-center`}>
        <div className={`px-8 py-4 rounded-full border ${borderColor} ${cardBg} text-sm uppercase tracking-wider animate-pulse shadow-lg`}>Memuat profil...</div>
      </main>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');
        .font-serif { font-family: 'Lora', serif; } .font-body { font-family: 'Roboto', sans-serif; }
        .caramel-btn { background: #C77A23; color: white; border-radius: 10px; transition: all 0.3s ease; } .caramel-btn:hover { background: #3A2F2B; }
      `}</style>

      <main className={`min-h-screen ${bg} font-body py-16`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <section className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C77A23] font-medium mb-2">My Account</p>
            <h1 className={`font-serif text-4xl md:text-6xl font-bold leading-none ${isDark ? "text-[#E8D8C6]" : "text-[#3A2F2B]"}`}>
              MY <span className="text-[#C77A23] italic">PROFILE</span>
            </h1>
          </section>

          <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
            <div className={`${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-44 h-44 rounded-full border-2 border-[#C77A23] flex items-center justify-center text-5xl font-serif font-bold overflow-hidden bg-[#C77A23]/10">
                  {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-[#C77A23]">{user?.user_name?.charAt(0)?.toUpperCase() || "?"}</span>}
                </div>
                {isEditing && (
                  <label className="mt-4 caramel-btn px-4 py-2 text-xs cursor-pointer inline-block">
                    Pilih Foto <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
                <h2 className="font-serif text-2xl font-bold mt-6 truncate">{user?.user_name || "Coffee Lover"}</h2>
                <span className={`mt-1 text-xs font-body ${textMuted}`}>{user?.email}</span>
                <span className="mt-4 bg-[#C77A23] text-white rounded-full px-4 py-1 text-xs font-body font-medium uppercase tracking-wider">{user?.role === "admin" ? "Admin" : "Member"}</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#C77A23] text-white rounded-2xl p-6 flex items-center justify-between shadow-lg">
                <h3 className="font-serif text-lg font-bold">Statistik</h3>
                <div className="flex items-center gap-4 bg-white/20 rounded-xl px-4 py-2">
                  <h4 className="font-body text-3xl font-bold">{totalOrders}</h4>
                  <p className="text-[10px] font-body uppercase font-medium opacity-80">
                    Total
                    <br />
                    Order
                  </p>
                </div>
              </div>

              <section className={`${cardBg} rounded-2xl border ${borderColor} p-8 shadow-xl`}>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className={`text-[10px] font-body uppercase tracking-wider mb-1 ${textMuted}`}>Personal Information</p>
                    <h2 className="font-serif text-2xl font-bold">Informasi Akun</h2>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-5 py-2 rounded-xl font-body text-xs uppercase font-medium transition-all ${isEditing ? "bg-red-400 text-white" : "border " + borderColor + " hover:bg-[#C77A23]/10"}`}
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
                      <label className={`text-xs font-body uppercase font-medium mb-2 block ${textMuted}`}>{f.label}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData[f.key]}
                          onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                          className={`w-full rounded-xl border ${borderColor} px-4 py-3 font-body text-sm outline-none focus:border-[#C77A23] ${isDark ? "bg-[#3A2F2B] text-[#E8D8C6]" : "bg-white text-[#3A2F2B]"}`}
                        />
                      ) : (
                        <p className={`font-body font-medium text-lg px-4 py-2 rounded-xl inline-block border ${borderColor} ${isDark ? "bg-[#3A2F2B]" : "bg-[#E8D8C6]"}`}>{user?.[f.key] || "-"}</p>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <button onClick={handleSave} className="mt-8 caramel-btn h-12 px-6 text-xs">
                    Simpan
                  </button>
                )}
              </section>

              <button onClick={() => setShowLogoutModal(true)} className="w-full bg-red-400/10 text-red-400 rounded-2xl border border-red-400/20 h-14 font-body font-bold uppercase text-xs hover:bg-red-400 hover:text-white transition-all">
                Keluar Akun
              </button>
            </div>
          </div>
        </div>

        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${cardBg} rounded-2xl border ${borderColor} p-8 max-w-sm w-full text-center shadow-2xl`}>
              <h3 className="font-serif text-2xl font-bold mb-2">Konfirmasi</h3>
              <p className={`text-sm mb-8 ${textMuted}`}>Apakah kamu yakin ingin keluar?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-3 rounded-xl border ${borderColor} font-body text-sm uppercase font-medium hover:bg-[#C77A23]/5 transition-all`}>
                  Batal
                </button>
                <button onClick={handleLogout} className="flex-1 bg-red-400 text-white py-3 rounded-xl font-body text-sm uppercase font-medium hover:bg-red-500 transition-all">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Profil;
