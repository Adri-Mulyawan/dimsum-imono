import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { listenOrders, updateOrderStatus } from "@/Services/orderService";
import { formatCurrency } from "@/Utils/formatCurrency";

const statusOptions = [
  "Menunggu",
  "Diproses",
  "Siap Diambil",
  "Selesai",
  "Dibatalkan",
];

const filterOptions = ["Semua", ...statusOptions];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    const unsubscribe = listenOrders((ordersData) => {
      setOrders(ordersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChangeStatus = async (firebaseId, status) => {
    try {
      await updateOrderStatus(firebaseId, status);
      toast.success("Status pesanan diperbarui");
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status pesanan");
    }
  };

  const handlePrintReceipt = (order) => {
    const itemRows = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${formatCurrency(item.price)}</td>
            <td style="text-align:right;">${formatCurrency(
              item.price * item.quantity
            )}</td>
          </tr>
        `
      )
      .join("");

    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Struk ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #111827;
            }

            .receipt {
              max-width: 420px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 12px;
            }

            h1, h2, p {
              margin: 0;
            }

            .center {
              text-align: center;
            }

            .store-name {
              font-size: 24px;
              font-weight: bold;
              color: #7f1d1d;
            }

            .muted {
              color: #6b7280;
              font-size: 13px;
            }

            .section {
              margin-top: 16px;
              padding-top: 12px;
              border-top: 1px dashed #d1d5db;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              font-size: 13px;
            }

            th {
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
              padding: 6px 0;
            }

            td {
              padding: 6px 0;
              vertical-align: top;
            }

            .total {
              display: flex;
              justify-content: space-between;
              margin-top: 12px;
              font-size: 18px;
              font-weight: bold;
              color: #7f1d1d;
            }

            .status {
              display: inline-block;
              margin-top: 8px;
              padding: 6px 10px;
              border-radius: 999px;
              background: #ffedd5;
              color: #9a3412;
              font-size: 12px;
              font-weight: bold;
            }

            .footer {
              margin-top: 18px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }

            @media print {
              button {
                display: none;
              }

              body {
                padding: 0;
              }

              .receipt {
                border: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">
            <div class="center">
              <h1 class="store-name">Dimsum Imono</h1>
              <p class="muted">Struk Pemesanan</p>
              <p class="muted">${order.createdAt}</p>
            </div>

            <div class="section">
              <p><strong>Kode:</strong> ${order.id}</p>
              <p><strong>Nama:</strong> ${order.customer?.name || "-"}</p>
              <p><strong>WhatsApp:</strong> ${order.customer?.whatsapp || "-"}</p>
              <p><strong>Metode:</strong> ${order.customer?.method || "-"}</p>
              <p><strong>Pembayaran:</strong> ${
                order.customer?.payment || "-"
              }</p>
              <p><strong>Estimasi:</strong> ${order.estimatedTime || "-"}</p>
              ${
                order.customer?.address
                  ? `<p><strong>Alamat:</strong> ${order.customer.address}</p>`
                  : ""
              }
              ${
                order.customer?.note
                  ? `<p><strong>Catatan:</strong> ${order.customer.note}</p>`
                  : ""
              }
              <span class="status">${order.status}</span>
            </div>

            <div class="section">
              <h2 style="font-size: 16px;">Detail Pesanan</h2>
              <table>
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;">Harga</th>
                    <th style="text-align:right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <div class="total">
                <span>Total</span>
                <span>${formatCurrency(order.total)}</span>
              </div>
            </div>

            <p class="footer">
              Terima kasih sudah memesan di Dimsum Imono.
            </p>

            <div class="center section">
              <button onclick="window.print()" style="
                background:#7f1d1d;
                color:white;
                border:none;
                padding:10px 16px;
                border-radius:8px;
                cursor:pointer;
                font-weight:bold;
              ">
                Cetak Struk
              </button>
            </div>
          </div>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        order.id?.toLowerCase().includes(keyword) ||
        order.customer?.name?.toLowerCase().includes(keyword) ||
        order.customer?.whatsapp?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "Semua" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders
    .filter((order) => order.status !== "Dibatalkan")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  const completedOrders = orders.filter((order) => order.status === "Selesai");
  const cancelledOrders = orders.filter(
    (order) => order.status === "Dibatalkan"
  );
  const waitingOrders = orders.filter((order) => order.status === "Menunggu");
  const processOrders = orders.filter((order) => order.status === "Diproses");

  const getStatusClass = (status) => {
    if (status === "Selesai") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Dibatalkan") {
      return "bg-gray-100 text-gray-700";
    }

    if (status === "Diproses") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Siap Diambil") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  if (isLoading) {
    return (
      <section>
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-orange-100">
          <div className="text-5xl">⏳</div>
          <p className="mt-4 text-xl font-black text-gray-800">
            Memuat pesanan realtime...
          </p>
          <p className="mt-2 text-gray-500">
            Mengambil data pesanan dari Firebase.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-900 to-orange-700 p-8 text-white shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-orange-200">
          Pesanan Realtime
        </p>
        <h1 className="mt-3 text-4xl font-black">Pesanan Masuk</h1>
        <p className="mt-3 max-w-2xl text-orange-100">
          Kelola pesanan pelanggan secara realtime dari Firebase Firestore.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">Total Pesanan</p>
          <h2 className="mt-2 text-3xl font-black text-red-900">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">Pendapatan</p>
          <h2 className="mt-2 text-xl font-black text-green-700">
            {formatCurrency(totalRevenue)}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">Menunggu</p>
          <h2 className="mt-2 text-3xl font-black text-yellow-600">
            {waitingOrders.length}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">Diproses</p>
          <h2 className="mt-2 text-3xl font-black text-blue-700">
            {processOrders.length}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">Selesai</p>
          <h2 className="mt-2 text-3xl font-black text-green-700">
            {completedOrders.length}
          </h2>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">
            Pesanan Dibatalkan
          </p>
          <h2 className="mt-2 text-3xl font-black text-gray-700">
            {cancelledOrders.length}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-semibold text-gray-500">
            Total Ditampilkan
          </p>
          <h2 className="mt-2 text-3xl font-black text-red-900">
            {filteredOrders.length}
          </h2>
        </div>
      </div>

      <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari kode pesanan, nama pelanggan, atau nomor WhatsApp..."
            className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
          >
            {filterOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-sm font-semibold text-gray-500">
          Menampilkan {filteredOrders.length} dari {orders.length} pesanan.
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-orange-100">
          <div className="text-6xl">📭</div>
          <p className="mt-4 text-xl font-black text-gray-800">
            Tidak ada pesanan yang sesuai.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <article
              key={order.firebaseId}
              className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-gray-900">
                      {order.id}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{order.createdAt}</p>

                  <div className="mt-3 text-sm text-gray-700">
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
                      <span className="font-bold">Pembayaran:</span>{" "}
                      {order.customer?.payment}
                    </p>
                    <p>
                      <span className="font-bold">Estimasi:</span>{" "}
                      {order.estimatedTime}
                    </p>

                    {order.customer?.address && (
                      <p>
                        <span className="font-bold">Alamat:</span>{" "}
                        {order.customer.address}
                      </p>
                    )}

                    {order.customer?.note && (
                      <p>
                        <span className="font-bold">Catatan:</span>{" "}
                        {order.customer.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="min-w-48">
                  <label className="mb-1 block text-sm font-bold text-gray-700">
                    Ubah Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleChangeStatus(order.firebaseId, event.target.value)
                    }
                    className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-red-700"
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handlePrintReceipt(order)}
                    className="mt-3 w-full rounded-2xl bg-orange-100 px-4 py-3 font-black text-red-800 hover:bg-orange-200"
                  >
                    Cetak Struk
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <h3 className="font-black text-gray-900">Detail Pesanan</h3>

                <div className="mt-3 space-y-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-orange-200 pt-3 text-lg font-black">
                  <span>Total</span>
                  <span className="text-red-800">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;