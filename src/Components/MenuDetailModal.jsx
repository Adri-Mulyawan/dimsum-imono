import { useEffect, useState } from "react";

import { formatCurrency } from "@/Utils/formatCurrency";

const MenuDetailModal = ({ menu, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [menu]);

  if (!menu) {
    return null;
  }

  const handleIncrease = () => {
    if (quantity >= menu.stock) {
      return;
    }

    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      return;
    }

    setQuantity((prevQuantity) => prevQuantity - 1);
  };

  const handleAdd = () => {
    onAddToCart(menu, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">
              Detail Menu
            </p>
            <h2 className="mt-1 text-2xl font-black text-gray-950">
              {menu.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-black text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-orange-100 to-red-50 p-6 text-center">
          <div className="text-7xl">{menu.image}</div>
          <p className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-black text-red-800 shadow-sm">
            {menu.category}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <p className="leading-7 text-gray-600">{menu.description}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs font-bold text-gray-500">Harga</p>
              <p className="font-black text-red-800">
                {formatCurrency(menu.price)}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs font-bold text-gray-500">Stok</p>
              <p
                className={`font-black ${
                  menu.stock <= 0 ? "text-red-600" : "text-gray-950"
                }`}
              >
                {menu.stock <= 0 ? "Habis" : menu.stock}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs font-bold text-gray-500">Rating</p>
              <p className="font-black text-gray-950">
                ⭐ {menu.rating || "4.5"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-orange-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-black text-gray-950">Jumlah Pesanan</p>
                <p className="text-sm text-gray-500">
                  Pilih jumlah sebelum masuk keranjang.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 font-black text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  -
                </button>

                <span className="w-8 text-center text-lg font-black text-gray-950">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrease}
                  disabled={quantity >= menu.stock || menu.stock <= 0}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 font-black text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-orange-200 pt-4">
              <span className="font-bold text-gray-600">Subtotal</span>
              <span className="text-xl font-black text-red-800">
                {formatCurrency(menu.price * quantity)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gray-100 px-5 py-4 font-black text-gray-700 hover:bg-gray-200"
          >
            Tutup
          </button>

          <button
            onClick={handleAdd}
            disabled={menu.stock <= 0}
            className={`w-full rounded-2xl px-5 py-4 font-black text-white ${
              menu.stock <= 0
                ? "cursor-not-allowed bg-gray-400"
                : "bg-red-800 hover:bg-red-900"
            }`}
          >
            {menu.stock <= 0
              ? "Stok Habis"
              : `Tambah ${quantity} ke Keranjang`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailModal;