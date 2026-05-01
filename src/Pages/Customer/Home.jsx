import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import MenuDetailModal from "@/Components/MenuDetailModal";
import { categories, menuList as defaultMenuList } from "@/Data/menuData";
import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage, setStorage } from "@/Utils/storage";

const Home = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [cart, setCart] = useState(() => getStorage("cart", []));
  const [menus] = useState(() => getStorage("menus", defaultMenuList));
  const [selectedMenu, setSelectedMenu] = useState(null);

  const filteredMenu = useMemo(() => {
    return menus.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "Semua" || item.category === activeCategory;
      const isActive = item.isAvailable;

      return matchSearch && matchCategory && isActive;
    });
  }, [search, activeCategory, menus]);

  const favoriteMenus = useMemo(() => {
    return menus.filter((item) => item.isAvailable).slice(0, 3);
  }, [menus]);

  const handleAddToCart = (menu, quantity = 1) => {
    if (menu.stock <= 0) {
      toast.error("Menu sedang habis");
      return;
    }

    let updatedCart = [];
    const existingItem = cart.find((item) => item.id === menu.id);

    if (existingItem) {
      if (existingItem.quantity + quantity > menu.stock) {
        toast.error("Jumlah pesanan melebihi stok tersedia");
        return;
      }

      updatedCart = cart.map((item) =>
        item.id === menu.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      if (quantity > menu.stock) {
        toast.error("Jumlah pesanan melebihi stok tersedia");
        return;
      }

      updatedCart = [...cart, { ...menu, quantity }];
    }

    setCart(updatedCart);
    setStorage("cart", updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${menu.name} ditambahkan ke keranjang`);
  };

  const totalCartItem = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-800 to-orange-700 text-white">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-red-500/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center lg:py-20">
          <div>
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100 ring-1 ring-white/20">
                <span>🔥</span>
                <span>Dimsum hangat siap dipesan hari ini</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-green-400/20 px-4 py-2 text-sm font-bold text-green-100 ring-1 ring-green-200/30">
                <span>🟢</span>
                <span>Buka Sekarang • 10.00 - 21.00 WIB</span>
              </div>
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Dimsum lezat, praktis dipesan, langsung checkout ke WhatsApp.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-orange-100">
              Pilih menu favoritmu, masukkan ke keranjang, lalu kirim pesanan
              otomatis ke WhatsApp Dimsum Imono.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="rounded-2xl bg-white px-6 py-4 font-extrabold text-red-900 shadow-lg transition hover:-translate-y-1 hover:bg-orange-50"
              >
                Pesan Sekarang
              </a>

              <Link
                to="/cart"
                className="rounded-2xl bg-orange-200 px-6 py-4 font-extrabold text-red-950 shadow-lg transition hover:-translate-y-1 hover:bg-orange-100"
              >
                Keranjang ({totalCartItem})
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="text-2xl font-black">10+</p>
                <p className="text-sm text-orange-100">Pilihan Menu</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="text-2xl font-black">Fresh</p>
                <p className="text-sm text-orange-100">Dibuat Harian</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="text-2xl font-black">WA</p>
                <p className="text-sm text-orange-100">Order Cepat</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 rounded-2xl bg-yellow-300 px-4 py-3 font-black text-red-950 shadow-xl rotate-6">
              Best Seller
            </div>

            <div className="rounded-[2rem] bg-white/10 p-6 text-center shadow-2xl ring-1 ring-white/20 backdrop-blur">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-yellow-100 text-8xl shadow-inner">
                🥟
              </div>

              <h2 className="mt-6 text-3xl font-black">Dimsum Imono</h2>
              <p className="mt-2 text-orange-100">
                Original • Mentai • Mozzarella • Hakau • Minuman
              </p>

              <div className="mt-6 rounded-2xl bg-white p-4 text-left text-gray-900">
                <p className="text-sm font-bold text-gray-500">
                  Rekomendasi Hari Ini
                </p>

                <div className="mt-3 space-y-3">
                  {favoriteMenus.map((menu) => (
                    <div
                      key={menu.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{menu.image}</span>
                        <div>
                          <p className="text-sm font-bold">{menu.name}</p>
                          <p className="text-xs text-gray-500">
                            {menu.category}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-black text-red-800">
                        {formatCurrency(menu.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="promo" className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 text-xl font-black text-gray-900">
              Order Cepat
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Pesanan langsung tersusun otomatis dan dikirim ke WhatsApp toko.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <div className="text-4xl">🥟</div>
            <h3 className="mt-4 text-xl font-black text-gray-900">
              Dimsum Fresh
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Menu dibuat dengan rasa rumahan yang cocok untuk camilan harian.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <div className="text-4xl">🛍️</div>
            <h3 className="mt-4 text-xl font-black text-gray-900">
              Ambil / Delivery
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Pilih ambil di toko atau delivery saat checkout.
            </p>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Menu Dimsum Imono
            </p>

            <h2 className="mt-2 text-4xl font-black text-gray-950">
              Pilih menu favoritmu
            </h2>

            <p className="mt-2 max-w-xl text-gray-600">
              Gunakan pencarian atau filter kategori untuk menemukan menu yang
              kamu mau.
            </p>
          </div>

          <Link
            to="/cart"
            className="rounded-2xl bg-red-800 px-5 py-3 text-center font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-red-900"
          >
            Lihat Keranjang ({totalCartItem})
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <input
              type="text"
              placeholder="Cari menu dimsum, minuman, atau gorengan..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
            />

            <div className="rounded-2xl bg-red-50 px-5 py-4 font-bold text-red-900">
              {filteredMenu.length} menu tersedia
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  activeCategory === category
                    ? "bg-red-800 text-white shadow-md"
                    : "bg-orange-100 text-red-900 hover:bg-orange-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenu.map((menu) => (
            <article
              key={menu.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative bg-gradient-to-br from-orange-100 to-red-50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-6xl shadow-inner">
                    {menu.image}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-red-800 shadow-sm">
                      {menu.category}
                    </span>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-800">
                      ⭐ {menu.rating || "4.5"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-gray-950">
                  {menu.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                  {menu.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-red-800">
                      {formatCurrency(menu.price)}
                    </p>

                    <p
                      className={`mt-1 text-xs font-bold ${
                        menu.stock <= 0 ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      {menu.stock <= 0 ? "Stok habis" : `Stok: ${menu.stock}`}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedMenu(menu)}
                    className="rounded-2xl bg-orange-100 px-4 py-3 text-sm font-black text-red-800 transition hover:bg-orange-200"
                  >
                    Detail
                  </button>

                  <button
                    onClick={() => handleAddToCart(menu)}
                    disabled={menu.stock <= 0}
                    className={`rounded-2xl px-4 py-3 text-sm font-black text-white transition ${
                      menu.stock <= 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-red-800 hover:bg-red-900"
                    }`}
                  >
                    {menu.stock <= 0 ? "Habis" : "Tambah"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-orange-100">
            <div className="text-5xl">🔍</div>

            <p className="mt-4 text-lg font-black text-gray-800">
              Menu tidak ditemukan
            </p>

            <p className="mt-2 text-gray-500">
              Coba kata kunci lain atau pilih kategori berbeda.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-900 to-orange-700 p-8 text-white shadow-xl md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold uppercase tracking-[0.25em] text-orange-200">
                Siap pesan?
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Checkout sekarang dan kirim pesanan langsung ke WhatsApp.
              </h2>
            </div>

            <Link
              to="/cart"
              className="rounded-2xl bg-white px-6 py-4 text-center font-black text-red-900 transition hover:-translate-y-1 hover:bg-orange-50"
            >
              Buka Keranjang
            </Link>
          </div>
        </div>
      </section>

      <MenuDetailModal
        menu={selectedMenu}
        onClose={() => setSelectedMenu(null)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
};

export default Home;