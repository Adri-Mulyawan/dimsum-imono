import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage, setStorage } from "@/Utils/storage";

const Cart = () => {
  const [cart, setCart] = useState(() => getStorage("cart", []));

  const updateCart = (newCart) => {
    setCart(newCart);
    setStorage("cart", newCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleIncrease = (id) => {
    const selectedItem = cart.find((item) => item.id === id);

    if (selectedItem.quantity >= selectedItem.stock) {
      toast.error("Jumlah pesanan sudah mencapai stok tersedia");
      return;
    }

    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    updateCart(newCart);
  };

  const handleDecrease = (id) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  };

  const handleRemove = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
    toast.success("Item dihapus dari keranjang");
  };

  const totalItem = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main>
      <section className="bg-gradient-to-br from-red-950 via-red-800 to-orange-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="font-bold uppercase tracking-[0.3em] text-orange-200">
            Keranjang Pesanan
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Cek kembali pesananmu
          </h1>
          <p className="mt-3 max-w-2xl text-orange-100">
            Pastikan menu, jumlah, dan total pesanan sudah sesuai sebelum lanjut
            checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <div>
          {cart.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-orange-100">
              <div className="text-7xl">🛒</div>
              <h2 className="mt-5 text-3xl font-black text-gray-950">
                Keranjang masih kosong
              </h2>
              <p className="mt-2 text-gray-600">
                Yuk pilih menu Dimsum Imono favoritmu terlebih dahulu.
              </p>

              <Link
                to="/"
                className="mt-6 inline-block rounded-2xl bg-red-800 px-6 py-4 font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-red-900"
              >
                Pilih Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-orange-100 transition hover:shadow-lg"
                >
                  <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-red-50 text-6xl">
                      {item.image}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black text-gray-950">
                          {item.name}
                        </h2>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-red-800">
                          {item.category}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        Stok tersedia: {item.stock}
                      </p>

                      <p className="mt-2 text-lg font-black text-red-800">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <div className="flex items-center gap-3 rounded-2xl bg-orange-50 p-2">
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-red-800 shadow-sm hover:bg-orange-100"
                        >
                          -
                        </button>

                        <span className="w-8 text-center text-lg font-black text-gray-950">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-red-800 shadow-sm hover:bg-orange-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-800 hover:bg-red-100"
                      >
                        Hapus Item
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-orange-100 bg-orange-50 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-600">Subtotal</span>
                      <span className="text-xl font-black text-red-800">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 lg:sticky lg:top-28">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Ringkasan
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-950">
            Total Pesanan
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Total Item</span>
              <span className="font-bold text-gray-900">{totalItem}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Jumlah Menu</span>
              <span className="font-bold text-gray-900">{cart.length}</span>
            </div>

            <div className="border-t border-orange-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-gray-950">Total</span>
                <span className="text-2xl font-black text-red-800">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {cart.length > 0 ? (
            <Link
              to="/checkout"
              className="mt-6 block rounded-2xl bg-red-800 px-6 py-4 text-center font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-red-900"
            >
              Lanjut Checkout
            </Link>
          ) : (
            <Link
              to="/"
              className="mt-6 block rounded-2xl bg-orange-100 px-6 py-4 text-center font-black text-red-800 transition hover:bg-orange-200"
            >
              Pilih Menu
            </Link>
          )}

          <Link
            to="/"
            className="mt-3 block rounded-2xl border border-orange-200 px-6 py-4 text-center font-black text-red-800 transition hover:bg-orange-50"
          >
            Tambah Menu Lagi
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default Cart;