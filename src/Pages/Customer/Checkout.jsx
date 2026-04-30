import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage, removeStorage, setStorage } from "@/Utils/storage";

const STORE_WHATSAPP_NUMBER = "628112761995"; 

const Checkout = () => {
  const navigate = useNavigate();
  const cart = getStorage("cart", []);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    method: "Ambil di toko",
    address: "",
    note: "",
  });

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
Metode: ${form.method}
Alamat: ${form.method === "Delivery" ? form.address : "-"}

Pesanan:
${itemText}

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

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer: form,
      items: cart,
      total: totalPrice,
      status: "Menunggu",
      createdAt: new Date().toLocaleString("id-ID"),
    };

    const oldOrders = getStorage("orders", []);
    setStorage("orders", [newOrder, ...oldOrders]);

    const message = encodeURIComponent(buildWhatsappMessage());
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`, "_blank");

    removeStorage("cart");
    setStorage("lastOrder", newOrder);

    toast.success("Pesanan berhasil dibuat");
    navigate("/success");
  };

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-6">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-red-900">Checkout</h1>
            <p className="text-gray-600">Lengkapi data pemesanan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Nama Pembeli
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Nomor WhatsApp
              </label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Contoh: 08123456789"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Metode Pengambilan
              </label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              >
                <option>Ambil di toko</option>
                <option>Delivery</option>
              </select>
            </div>

            {form.method === "Delivery" && (
              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  Alamat Delivery
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  className="h-24 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Catatan Pesanan
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Contoh: saus dipisah, tidak pedas, dll"
                className="h-24 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900"
            >
              Kirim Pesanan ke WhatsApp
            </button>
          </form>
        </div>

        <aside className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900">Ringkasan Pesanan</h2>

          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-red-800">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <Link
            to="/cart"
            className="mt-5 block text-center font-semibold text-red-800 hover:underline"
          >
            Kembali ke Keranjang
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default Checkout;