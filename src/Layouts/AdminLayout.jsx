import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Anda akan keluar dari halaman admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("admin");
      navigate("/admin/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-orange-50">
      <aside className="w-64 bg-red-900 text-white">
        <div className="border-b border-red-800 p-5">
          <h1 className="text-xl font-bold">Dimsum Imono</h1>
          <p className="text-sm text-orange-200">Admin Panel</p>
        </div>

        <nav className="space-y-2 p-4">
            <Link
                to="/admin/dashboard"
                className="block rounded-xl px-4 py-3 font-semibold hover:bg-red-800"
            >
                Dashboard
            </Link>

            <Link
                to="/admin/orders"
                className="block rounded-xl px-4 py-3 font-semibold hover:bg-red-800"
            >
                Pesanan
            </Link>

            <Link
                to="/admin/menu"
                className="block rounded-xl px-4 py-3 font-semibold hover:bg-red-800"
            >
                Kelola Menu
            </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
          <div>
            <h2 className="font-bold text-gray-900">Admin Dimsum Imono</h2>
            <p className="text-sm text-gray-500">Kelola pesanan pelanggan</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-800 hover:bg-red-200"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;