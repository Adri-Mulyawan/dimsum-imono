import { Link } from "react-router-dom";

import { getStorage } from "@/Utils/storage";
import { formatCurrency } from "@/Utils/formatCurrency";

const Dashboard = () => {
  const orders = getStorage("orders", []);
  const menus = getStorage("menus", []);

  const totalRevenue = orders
    .filter((order) => order.status !== "Dibatalkan")
    .reduce((total, order) => total + order.total, 0);

  const waitingOrders = orders.filter((order) => order.status === "Menunggu");
  const processOrders = orders.filter((order) => order.status === "Diproses");
  const doneOrders = orders.filter((order) => order.status === "Selesai");
  const cancelledOrders = orders.filter(
    (order) => order.status === "Dibatalkan"
  );

  const activeMenus = menus.filter((menu) => menu.isAvailable);
  const outOfStockMenus = menus.filter((menu) => Number(menu.stock) <= 0);

  const recentOrders = orders.slice(0, 5);

  const cards = [
    {
      title: "Total Pesanan",
      value: orders.length,
      icon: "📦",
      color: "bg-red-50 text-red-800",
    },
    {
      title: "Pendapatan",
      value: formatCurrency(totalRevenue),
      icon: "💰",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Menunggu",
      value: waitingOrders.length,
      icon: "⏳",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Diproses",
      value: processOrders.length,
      icon: "👨‍🍳",
      color: "bg-blue-50 text-blue-700",
    },
  ];

  return (
    <section>
      <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-900 to-orange-700 p-8 text-white shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-orange-200">
          Admin Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-black">Halo, Admin Dimsum Imono</h1>
        <p className="mt-3 max-w-2xl text-orange-100">
          Pantau pesanan, kelola menu, dan lihat ringkasan aktivitas toko dari
          satu halaman.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/orders"
            className="rounded-2xl bg-white px-5 py-3 font-black text-red-900 transition hover:bg-orange-50"
          >
            Lihat Pesanan
          </Link>

          <Link
            to="/admin/menu"
            className="rounded-2xl bg-orange-200 px-5 py-3 font-black text-red-950 transition hover:bg-orange-100"
          >
            Kelola Menu
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${card.color}`}
            >
              {card.icon}
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-wide text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-950">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                Pesanan Terbaru
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">
                Aktivitas pesanan pelanggan
              </h2>
            </div>

            <Link
              to="/admin/orders"
              className="rounded-2xl bg-red-800 px-4 py-3 text-sm font-black text-white hover:bg-red-900"
            >
              Semua Pesanan
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-2xl bg-orange-50 p-8 text-center">
              <div className="text-5xl">📭</div>
              <p className="mt-4 font-bold text-gray-700">
                Belum ada pesanan masuk.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-orange-50 p-5 ring-1 ring-orange-100"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-black text-gray-950">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.createdAt}</p>

                      <div className="mt-3 text-sm text-gray-700">
                        <p>
                          <span className="font-bold">Nama:</span>{" "}
                          {order.customer.name}
                        </p>
                        <p>
                          <span className="font-bold">Metode:</span>{" "}
                          {order.customer.method}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-black text-red-800">
                        {order.status}
                      </span>
                      <p className="mt-3 text-lg font-black text-red-800">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Ringkasan Status
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-yellow-50 p-4">
                <span className="font-bold text-yellow-800">Menunggu</span>
                <span className="text-xl font-black text-yellow-800">
                  {waitingOrders.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
                <span className="font-bold text-blue-800">Diproses</span>
                <span className="text-xl font-black text-blue-800">
                  {processOrders.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
                <span className="font-bold text-green-800">Selesai</span>
                <span className="text-xl font-black text-green-800">
                  {doneOrders.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gray-100 p-4">
                <span className="font-bold text-gray-700">Dibatalkan</span>
                <span className="text-xl font-black text-gray-700">
                  {cancelledOrders.length}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Ringkasan Menu
            </p>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-bold text-gray-500">Total Menu</p>
                <p className="mt-1 text-3xl font-black text-red-900">
                  {menus.length}
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm font-bold text-gray-500">Menu Aktif</p>
                <p className="mt-1 text-3xl font-black text-green-700">
                  {activeMenus.length}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-sm font-bold text-gray-500">Stok Habis</p>
                <p className="mt-1 text-3xl font-black text-red-700">
                  {outOfStockMenus.length}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;