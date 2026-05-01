import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage, removeStorage, setStorage } from "@/Utils/storage";

const STORE_WHATSAPP_NUMBER = "6281234567890";

const paymentOptions = [
  {
    value: "Bayar di tempat",
    label: "Bayar di tempat",
    description: "Pembayaran dilakukan saat pesanan diambil / diterima.",
    icon: "💵",
  },
  {
    value: "Transfer Bank",
    label: "Transfer Bank",
    description: "Admin akan mengirim detail rekening melalui WhatsApp.",
    icon: "🏦",
  },
  {
    value: "QRIS",
    label: "QRIS",
    description: "Admin akan mengirim kode QR pembayaran melalui WhatsApp.",
    icon: "📱",
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const cart = getStorage("cart", []);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    method: "Ambil di toko",
    payment: "Bayar di tempat",
    address: "",
    note: "",
  });

  const totalItem = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const selectedPayment = paymentOptions.find(
    (payment) => payment.value === form.payment
  );

  const estimatedTime =
    form.method === "Delivery" ? "30–45 menit" : "15–25 menit";

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const buildWhatsappMessage = () => {
    const itemText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} = ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    return `Halo Dimsum Imono, saya ingin pesan:

Nama: ${form.name}
No WhatsApp: ${form.whatsapp}
Metode Pengambilan: ${form.method}
Estimasi Waktu: ${estimatedTime}
Metode Pembayaran: ${form.payment}
Alamat: ${form.method === "Delivery" ? form.address : "-"}

Pesanan:
${itemText}

Total Item: ${totalItem}
Total: ${formatCurrency(totalPrice)}

Catatan:
${form.note || "-"}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }

    if (!form.name || !form.whatsapp) {
      toast.error("Nama dan nomor WhatsApp wajib diisi");
      return;
    }

    if (form.method === "Delivery" && !form.address) {
      toast.error("Alamat wajib diisi untuk delivery");
      return;
    }

    if (!form.payment) {
      toast.error("Metode pembayaran wajib dipilih");
      return;
    }

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer: form,
      items: cart,
      total: totalPrice,
      status: "Menunggu",
      paymentStatus: "Belum Dibayar",
      estimatedTime,
      createdAt: new Date().toLocaleString("id-ID"),
    };

    const oldOrders = getStorage("orders", []);
    setStorage("orders", [newOrder, ...oldOrders]);

    const message = encodeURIComponent(buildWhatsappMessage());
    window.open(
      `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`,
      "_blank"
    );

    removeStorage("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    setStorage("lastOrder", newOrder);

    toast.success("Pesanan berhasil dibuat");
    navigate("/success");
  };

  return (
    <main>
      <section className="bg-gradient-to-br from-red-950 via-red-800 to-orange-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="font-bold uppercase tracking-[0.3em] text-orange-200">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Lengkapi data pesanan
          </h1>
          <p className="mt-3 max-w-2xl text-orange-100">
            Setelah dikirim, pesanan akan otomatis diarahkan ke WhatsApp Dimsum
            Imono.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 md:p-8">
          <div className="mb-6">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Data Pembeli
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">
              Informasi Pemesanan
            </h2>
            <p className="mt-2 text-gray-600">
              Isi data dengan benar agar pesanan mudah dikonfirmasi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold text-gray-800">
                  Nama Pembeli
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama"
                  className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-gray-800">
                  Nomor WhatsApp
                </label>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="Contoh: 08123456789"
                  className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Metode Pengambilan
              </label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              >
                <option>Ambil di toko</option>
                <option>Delivery</option>
              </select>

              <div className="mt-3 rounded-2xl bg-orange-50 p-4 text-sm text-gray-700">
                <p className="font-black text-red-900">
                  ⏱️ Estimasi pesanan: {estimatedTime}
                </p>
                <p className="mt-1 text-gray-600">
                  {form.method === "Delivery"
                    ? "Estimasi dapat berubah tergantung jarak dan kondisi pengiriman."
                    : "Pesanan akan disiapkan untuk diambil langsung di toko."}
                </p>
              </div>
            </div>

            {form.method === "Delivery" && (
              <div>
                <label className="mb-2 block font-bold text-gray-800">
                  Alamat Delivery
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  className="h-28 w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
                />
              </div>
            )}

            <div>
              <label className="mb-3 block font-bold text-gray-800">
                Metode Pembayaran
              </label>

              <div className="grid gap-3 md:grid-cols-3">
                {paymentOptions.map((payment) => (
                  <label
                    key={payment.value}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      form.payment === payment.value
                        ? "border-red-700 bg-red-50 ring-2 ring-red-700"
                        : "border-orange-200 bg-orange-50 hover:bg-orange-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={payment.value}
                      checked={form.payment === payment.value}
                      onChange={handleChange}
                      className="sr-only"
                    />

                    <div className="text-3xl">{payment.icon}</div>
                    <p className="mt-3 font-black text-gray-950">
                      {payment.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {payment.description}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Catatan Pesanan
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Contoh: saus dipisah, tidak pedas, dll"
                className="h-28 w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to="/cart"
                className="rounded-2xl border border-orange-200 px-6 py-4 text-center font-black text-red-800 transition hover:bg-orange-50"
              >
                Kembali ke Keranjang
              </Link>

              <button
                type="submit"
                className="rounded-2xl bg-red-800 px-6 py-4 font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-red-900"
              >
                Kirim ke WhatsApp
              </button>
            </div>
          </form>
        </div>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 lg:sticky lg:top-28">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Ringkasan
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-950">
            Pesanan Kamu
          </h2>

          {cart.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-orange-50 p-6 text-center">
              <div className="text-5xl">🛒</div>
              <p className="mt-3 font-bold text-gray-700">
                Keranjang masih kosong.
              </p>

              <Link
                to="/"
                className="mt-4 inline-block rounded-xl bg-red-800 px-5 py-3 font-bold text-white"
              >
                Pilih Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-2xl bg-orange-50 p-3"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl">
                      {item.image}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-black text-gray-900">{item.name}</p>
                        <p className="font-black text-red-800">
                          x{item.quantity}
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-orange-100 pt-5">
                <div className="flex justify-between text-gray-600">
                  <span>Total Item</span>
                  <span className="font-bold text-gray-900">{totalItem}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Jumlah Menu</span>
                  <span className="font-bold text-gray-900">{cart.length}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimasi</span>
                  <span className="font-bold text-gray-900">
                    {estimatedTime}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Pembayaran</span>
                  <span className="font-bold text-gray-900">
                    {selectedPayment?.label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-lg font-black text-gray-950">
                    Total
                  </span>
                  <span className="text-2xl font-black text-red-800">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-900">
                Pesanan akan dikirim melalui WhatsApp toko. Pastikan data kamu
                sudah benar sebelum menekan tombol kirim.
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
};

export default Checkout;