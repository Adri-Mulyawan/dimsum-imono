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

  const handleAddToCart = (menu) => {
    if (menu.stock <= 0) {
      toast.error("Menu sedang habis");
      return;
    }

    let updatedCart = [];
    const existingItem = cart.find((item) => item.id === menu.id);

    if (existingItem) {
      if (existingItem.quantity >= menu.stock) {
        toast.error("Jumlah pesanan sudah mencapai stok tersedia");
        return;
      }

      updatedCart = cart.map((item) =>
        item.id === menu.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...menu, quantity: 1 }];
    }

    setCart(updatedCart);
    setStorage("cart", updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${menu.name} ditambahkan ke keranjang`);
  };

  const totalCartItem = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main>
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-orange-700 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-orange-200">
              Fresh Dimsum Everyday
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Dimsum hangat, gurih, dan siap menemani harimu.
            </h1>
            <p className="mt-4 max-w-xl text-orange-100">
              Pilih menu favoritmu, masukkan ke keranjang, lalu checkout lewat
              WhatsApp. Praktis untuk pesan dari rumah maupun ambil di toko.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-red-900 hover:bg-orange-50"
              >
                Lihat Menu
              </a>

              <Link
                to="/cart"
                className="rounded-xl bg-orange-200 px-5 py-3 font-semibold text-red-900 hover:bg-orange-100"
              >
                Keranjang ({totalCartItem})
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 text-center shadow-2xl ring-1 ring-white/20">
            <div className="text-8xl">🥟</div>
            <h2 className="mt-4 text-2xl font-bold">Dimsum Imono</h2>
            <p className="mt-2 text-orange-100">
              Original • Mentai • Mozzarella • Hakau • Minuman
            </p>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl bg-white p-4 shadow">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Cari menu dimsum..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-orange-200 px-4 py-3 outline-none focus:ring-2 focus:ring-red-700 md:max-w-md"
            />

            <Link
              to="/cart"
              className="rounded-xl bg-red-800 px-4 py-3 text-center font-semibold text-white hover:bg-red-900"
            >
              Keranjang: {totalCartItem} item
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-red-800 text-white"
                    : "bg-orange-100 text-red-900 hover:bg-orange-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenu.map((menu) => (
            <article
              key={menu.id}
              className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="text-5xl">{menu.image}</div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-red-800">
                  {menu.category}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {menu.name}
              </h2>

              <p className="mt-2 min-h-12 text-sm text-gray-600">
                {menu.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-red-800">
                    {formatCurrency(menu.price)}
                  </p>

                  <p
                    className={`text-xs ${
                      menu.stock <= 0
                        ? "font-semibold text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {menu.stock <= 0 ? "Stok habis" : `Stok: ${menu.stock}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMenu(menu)}
                    className="rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-orange-200"
                  >
                    Detail
                  </button>

                  <button
                    onClick={() => handleAddToCart(menu)}
                    disabled={menu.stock <= 0}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
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
          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow">
            <p className="font-semibold text-gray-700">Menu tidak ditemukan.</p>
          </div>
        )}
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