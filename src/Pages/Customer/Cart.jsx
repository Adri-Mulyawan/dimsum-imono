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

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="px-4 py-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-red-900">Keranjang</h1>
          <p className="mt-1 text-gray-600">
            Cek kembali pesananmu sebelum checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="font-semibold text-gray-700">
              Keranjang masih kosong.
            </p>

            <Link
              to="/"
              className="mt-5 inline-block rounded-xl bg-red-800 px-5 py-3 font-semibold text-white"
            >
              Pilih Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  <div className="text-5xl">{item.image}</div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-xs text-gray-500">
                      Stok tersedia: {item.stock}
                    </p>

                    <p className="mt-1 font-semibold text-red-800">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="h-9 w-9 rounded-lg bg-orange-100 font-bold text-red-800"
                  >
                    -
                  </button>

                  <span className="w-8 text-center font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="h-9 w-9 rounded-lg bg-orange-100 font-bold text-red-800"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-800"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-red-800">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-5 block rounded-xl bg-red-800 px-5 py-3 text-center font-semibold text-white hover:bg-red-900"
              >
                Lanjut Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;