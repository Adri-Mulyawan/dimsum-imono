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

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-800 text-2xl text-white">
              🥟
            </div>

            <div>
              <h1 className="text-xl font-bold text-red-900">Dimsum Imono</h1>
              <p className="text-xs text-gray-500">Fresh Dimsum Everyday</p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-xl px-4 py-2 font-semibold text-gray-700 hover:bg-orange-100 sm:block"
            >
              Menu
            </Link>

            <Link
              to="/cart"
              className="rounded-xl bg-red-800 px-4 py-2 font-semibold text-white hover:bg-red-900"
            >
              Keranjang ({totalCartItem})
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-orange-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold text-red-900">Dimsum Imono</h2>
            <p className="mt-2 text-sm text-gray-600">
              Dimsum rumahan dengan rasa gurih, lembut, dan cocok untuk camilan
              harian.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">Jam Operasional</h3>
            <p className="mt-2 text-sm text-gray-600">
              Senin - Minggu
              <br />
              10.00 - 21.00 WIB
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">Kontak</h3>
            <p className="mt-2 text-sm text-gray-600">
              WhatsApp: 08112761995
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