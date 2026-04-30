import { formatCurrency } from "@/Utils/formatCurrency";

const MenuDetailModal = ({ menu, onClose, onAddToCart }) => {
  if (!menu) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
              Detail Menu
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {menu.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-orange-50 p-6 text-center">
          <div className="text-7xl">{menu.image}</div>
          <p className="mt-3 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-red-800">
            {menu.category}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-gray-600">{menu.description}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-orange-50 p-3">
              <p className="text-xs font-semibold text-gray-500">Harga</p>
              <p className="font-bold text-red-800">
                {formatCurrency(menu.price)}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3">
              <p className="text-xs font-semibold text-gray-500">Stok</p>
              <p
                className={`font-bold ${
                  menu.stock <= 0 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {menu.stock <= 0 ? "Habis" : menu.stock}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3">
              <p className="text-xs font-semibold text-gray-500">Rating</p>
              <p className="font-bold text-gray-900">
                ⭐ {menu.rating || "4.5"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
          >
            Tutup
          </button>

          <button
            onClick={() => onAddToCart(menu)}
            disabled={menu.stock <= 0}
            className={`w-full rounded-xl px-5 py-3 font-semibold text-white ${
              menu.stock <= 0
                ? "cursor-not-allowed bg-gray-400"
                : "bg-red-800 hover:bg-red-900"
            }`}
          >
            {menu.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailModal;