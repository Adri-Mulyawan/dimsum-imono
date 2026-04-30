import { Link } from "react-router-dom";

import { getStorage } from "@/Utils/storage";
import { formatCurrency } from "@/Utils/formatCurrency";

const Dashboard = () => {
  const orders = getStorage("orders", []);

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const waitingOrders = orders.filter((order) => order.status === "Menunggu");
  const doneOrders = orders.filter((order) => order.status === "Selesai");

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan pesanan Dimsum Imono.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm font-semibold text-gray-500">Total Pesanan</p>
          <h2 className="mt-2 text-3xl font-bold text-red-900">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm font-semibold text-gray-500">Menunggu</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-600">
            {waitingOrders.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm font-semibold text-gray-500">Pendapatan</p>
          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {formatCurrency(totalRevenue)}
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900">Akses Cepat</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/admin/orders"
            className="rounded-xl bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900"
          >
            Lihat Pesanan
          </Link>

          <Link
            to="/"
            className="rounded-xl bg-orange-100 px-5 py-3 font-semibold text-red-800 hover:bg-orange-200"
          >
            Lihat Menu Pelanggan
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900">Statistik Selesai</h2>
        <p className="mt-2 text-gray-600">
          Pesanan selesai: <span className="font-bold">{doneOrders.length}</span>
        </p>
      </div>
    </section>
  );
};

export default Dashboard;