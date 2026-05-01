import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getStorage } from "@/Utils/storage";

const CustomerLayout = () => {
  const [cart, setCart] = useState(() => getStorage("cart", []));

  useEffect(() => {
    const handleCartUpdated = () => {
      setCart(getStorage("cart", []));
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const totalCartItem = cart.reduce((total, item) => total + item.quantity, 0);

  const isStoreOpen = true;

  return (
    <div className="min-h-screen bg-[#fff7ed] pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-800 to-orange-600 text-2xl text-white shadow-md">
              🥟
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-red-950">
                Dimsum Imono
              </h1>
              <p className="text-xs font-medium text-orange-700">
                Fresh Dimsum Everyday
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <div
              className={`hidden rounded-full px-4 py-2 text-sm font-bold md:block ${
                isStoreOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isStoreOpen ? "🟢 Buka Sekarang" : "🔴 Tutup"}
            </div>

            <a
              href="/#menu"
              className="hidden rounded-xl px-4 py-2 font-semibold text-gray-700 transition hover:bg-orange-100 sm:block"
            >
              Menu
            </a>

            <a
              href="/#promo"
              className="hidden rounded-xl px-4 py-2 font-semibold text-gray-700 transition hover:bg-orange-100 md:block"
            >
              Promo
            </a>

            <Link
              to="/cart"
              className="relative hidden rounded-2xl bg-red-800 px-5 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-red-900 sm:block"
            >
              Keranjang
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-sm text-red-800">
                {totalCartItem}
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      {totalCartItem > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-2xl bg-red-800 px-5 py-4 font-black text-white shadow-2xl transition active:scale-95 sm:hidden"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span>Keranjang</span>
          </span>

          <span className="rounded-full bg-white px-3 py-1 text-sm text-red-800">
            {totalCartItem} item
          </span>
        </Link>
      )}

      <footer className="mt-10 border-t border-orange-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-800 text-2xl text-white">
                🥟
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-red-950">
                  Dimsum Imono
                </h2>
                <p className="text-sm text-orange-700">
                  Fresh Dimsum Everyday
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-600">
              Dimsum rumahan dengan rasa gurih, lembut, dan cocok untuk camilan
              harian. Pesan mudah lewat website, checkout langsung ke WhatsApp.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">Jam Operasional</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Senin - Minggu
              <br />
              10.00 - 21.00 WIB
            </p>

            <div
              className={`mt-4 inline-block rounded-full px-4 py-2 text-sm font-bold ${
                isStoreOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isStoreOpen ? "🟢 Buka Sekarang" : "🔴 Tutup"}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">Kontak</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              WhatsApp: 0812-3456-7890
              <br />
              Instagram: @dimsumimono
            </p>
          </div>
        </div>

        <div className="border-t border-orange-100 py-4 text-center text-sm text-gray-500">
          © 2026 Dimsum Imono. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;