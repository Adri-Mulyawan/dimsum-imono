import { Link } from "react-router-dom";

import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage } from "@/Utils/storage";

const OrderSuccess = () => {
  const order = getStorage("lastOrder", null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✅
        </div>

        <h1 className="mt-4 text-3xl font-bold text-red-900">
          Pesanan Berhasil
        </h1>
        <p className="mt-2 text-gray-600">
          Pesanan kamu sudah dibuat dan diarahkan ke WhatsApp Dimsum Imono.
        </p>

        {order && (
          <div className="mt-6 rounded-xl bg-orange-50 p-4 text-left">
            <p className="font-semibold text-gray-700">Kode Pesanan</p>
            <p className="text-red-800">{order.id}</p>

            <p className="mt-3 font-semibold text-gray-700">Total</p>
            <p className="text-red-800">{formatCurrency(order.total)}</p>

            <p className="mt-3 font-semibold text-gray-700">Status</p>
            <p className="text-red-800">{order.status}</p>
          </div>
        )}

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900"
        >
          Kembali ke Menu
        </Link>
      </section>
    </main>
  );
};

export default OrderSuccess;