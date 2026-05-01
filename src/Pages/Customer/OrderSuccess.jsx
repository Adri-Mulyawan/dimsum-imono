import { Link } from "react-router-dom";

import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage } from "@/Utils/storage";

const OrderSuccess = () => {
  const order = getStorage("lastOrder", null);

  return (
    <main>
      <section className="bg-gradient-to-br from-green-700 via-emerald-600 to-orange-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-6xl shadow-xl">
            ✅
          </div>

          <p className="mt-6 font-bold uppercase tracking-[0.3em] text-green-100">
            Pesanan Berhasil
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Terima kasih sudah memesan!
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-green-50">
            Pesanan kamu sudah dibuat dan diarahkan ke WhatsApp Dimsum Imono.
            Admin akan segera melakukan konfirmasi.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 md:p-8">
          <div className="mb-6">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Detail Pesanan
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">
              Ringkasan pesanan kamu
            </h2>
            <p className="mt-2 text-gray-600">
              Simpan kode pesanan untuk memudahkan konfirmasi dengan admin.
            </p>
          </div>

          {!order ? (
            <div className="rounded-2xl bg-orange-50 p-8 text-center">
              <div className="text-5xl">📦</div>
              <p className="mt-4 font-bold text-gray-700">
                Belum ada data pesanan terakhir.
              </p>
              <Link
                to="/"
                className="mt-5 inline-block rounded-2xl bg-red-800 px-6 py-4 font-black text-white"
              >
                Kembali ke Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Kode Pesanan
                  </p>
                  <p className="mt-1 break-all text-xl font-black text-red-800">
                    {order.id}
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="text-sm font-bold text-gray-500">Status</p>
                  <p className="mt-1 text-xl font-black text-orange-700">
                    {order.status}
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Estimasi Waktu
                  </p>
                  <p className="mt-1 text-xl font-black text-green-700">
                    {order.estimatedTime || "15–25 menit"}
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Pembayaran
                  </p>
                  <p className="mt-1 text-xl font-black text-gray-900">
                    {order.customer?.payment || "Bayar di tempat"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-red-700">
                    {order.paymentStatus || "Belum Dibayar"}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-orange-50 p-5">
                <h3 className="text-xl font-black text-gray-950">
                  Data Pembeli
                </h3>

                <div className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
                  <p>
                    <span className="font-bold">Nama:</span>{" "}
                    {order.customer?.name}
                  </p>
                  <p>
                    <span className="font-bold">WhatsApp:</span>{" "}
                    {order.customer?.whatsapp}
                  </p>
                  <p>
                    <span className="font-bold">Metode:</span>{" "}
                    {order.customer?.method}
                  </p>
                  <p>
                    <span className="font-bold">Waktu:</span> {order.createdAt}
                  </p>
                </div>

                {order.customer?.address && (
                  <p className="mt-3 text-sm text-gray-700">
                    <span className="font-bold">Alamat:</span>{" "}
                    {order.customer.address}
                  </p>
                )}

                {order.customer?.note && (
                  <p className="mt-3 text-sm text-gray-700">
                    <span className="font-bold">Catatan:</span>{" "}
                    {order.customer.note}
                  </p>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-white ring-1 ring-orange-100">
                <div className="border-b border-orange-100 p-5">
                  <h3 className="text-xl font-black text-gray-950">
                    Item Pesanan
                  </h3>
                </div>

                <div className="divide-y divide-orange-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                          {item.image}
                        </div>

                        <div>
                          <p className="font-black text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.category} • x{item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-black text-red-800">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 lg:sticky lg:top-28">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Total
          </p>

          <h2 className="mt-2 text-3xl font-black text-red-800">
            {order ? formatCurrency(order.total) : formatCurrency(0)}
          </h2>

          <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-800">
            Pesanan berhasil dibuat. Silakan lanjutkan komunikasi melalui
            WhatsApp untuk konfirmasi pembayaran dan estimasi pengambilan.
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/"
              className="block rounded-2xl bg-red-800 px-6 py-4 text-center font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-red-900"
            >
              Pesan Lagi
            </Link>

            <Link
              to="/cart"
              className="block rounded-2xl border border-orange-200 px-6 py-4 text-center font-black text-red-800 transition hover:bg-orange-50"
            >
              Lihat Keranjang
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default OrderSuccess;