import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DetailProduk = () => {
  const [jumlah, setJumlah] = useState(1);
  const [produkAktif, setProdukAktif] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchProduk(id);
    } else {
      setError("Silakan pilih produk dari halaman Menu terlebih dahulu.");
      setIsLoading(false);
    }
  }, [id]);

  const fetchProduk = async (produkId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/produk/${produkId}`);
      setProdukAktif(res.data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Produk tidak ditemukan");
      setIsLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const kurangJumlah = () => {
    if (jumlah > 1) setJumlah(jumlah - 1);
  };

  const tambahJumlah = () => {
    if (jumlah < produkAktif.stok) {
      setJumlah(jumlah + 1);
    } else {
      alert("Jumlah tidak boleh melebihi stok yang tersedia.");
    }
  };

  const tambahKeKeranjang = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      navigate("/login");
      return;
    }

    if (produkAktif.stok <= 0) {
      alert("Maaf, stok produk sedang habis.");
      return;
    }

    const token = localStorage.getItem("token"); // 👈 TAMBAH

    try {
      await axios.post(
        "http://localhost:5000/api/user/keranjang",
        {
          userId: user.id,
          kopiId: produkAktif.id_kopi,
          qty: jumlah,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // 👈 TAMBAH
        },
      );

      window.dispatchEvent(new Event("keranjangChanged"));
      alert(`${produkAktif.nama_kopi} (${jumlah}x) berhasil ditambahkan!`);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  const beliSekarang = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu!");
      navigate("/login");
      return;
    }
    tambahKeKeranjang();
    navigate("/home/keranjang");
  };

  // Loading
  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-amber-900 tracking-widest uppercase text-sm">Menyiapkan Produk...</p>
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-stone-200">
          <p className="text-6xl mb-4">☕</p>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Oops!</h2>
          <p className="text-stone-500 mb-8">{error}</p>
          <button onClick={() => navigate("/home/produk")} className="w-full bg-amber-700 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition">
            Kembali ke Daftar Menu
          </button>
        </div>
      </main>
    );
  }

  // Detail
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-stone-400 mb-8">
          <button onClick={() => navigate("/home")} className="hover:text-amber-600 transition">
            Beranda
          </button>
          <span>/</span>
          <button onClick={() => navigate("/home/produk")} className="hover:text-amber-600 transition">
            Menu
          </button>
          <span>/</span>
          <span className="text-amber-700">{produkAktif.nama_kategori}</span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden bg-stone-100 shadow-inner group">
            <span className="absolute top-6 left-6 z-10 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-lg">{produkAktif.stok > 0 ? "Tersedia" : "Habis"}</span>
            <img
              src={produkAktif.gambar || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"}
              alt={produkAktif.nama_kopi}
              className={`w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 ${produkAktif.stok <= 0 ? "grayscale" : ""}`}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400";
              }}
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 w-max uppercase tracking-widest">{produkAktif.nama_kategori}</span>

            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">{produkAktif.nama_kopi}</h1>

            <div className="flex items-end gap-4 mb-6">
              <h2 className="text-4xl font-black text-amber-700">{formatRupiah(produkAktif.harga_kopi)}</h2>
            </div>

            <div className="space-y-3 text-sm font-medium mb-8">
              <div className="flex items-center">
                <span className="w-32 text-stone-400 uppercase tracking-widest text-[11px] font-black">Status Stok</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${produkAktif.stok > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {produkAktif.stok > 0 ? `${produkAktif.stok} Porsi Tersedia` : "Habis Terjual"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center border-2 border-stone-200 rounded-2xl overflow-hidden h-14 w-full sm:w-auto">
                <button onClick={kurangJumlah} className="w-14 h-full text-2xl hover:bg-stone-100 transition text-stone-500 font-medium">
                  -
                </button>
                <span className="w-16 text-center font-bold text-lg">{jumlah}</span>
                <button onClick={tambahJumlah} className="w-14 h-full text-2xl hover:bg-stone-100 transition text-stone-500 font-medium">
                  +
                </button>
              </div>

              <button
                onClick={tambahKeKeranjang}
                disabled={produkAktif.stok <= 0}
                className="flex-1 bg-stone-900 text-white h-14 rounded-2xl font-bold tracking-wider hover:bg-amber-700 transition shadow-lg disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                + KERANJANG
              </button>

              <button onClick={beliSekarang} disabled={produkAktif.stok <= 0} className="flex-1 bg-amber-600 text-white h-14 rounded-2xl font-bold tracking-wider hover:bg-amber-700 transition shadow-lg shadow-amber-600/30 disabled:hidden">
                BELI LANGSUNG
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DetailProduk;
