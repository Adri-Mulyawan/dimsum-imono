import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-4xl font-bold text-red-800">404</h1>
        <p className="mt-2 text-gray-600">Halaman tidak ditemukan.</p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-xl bg-red-800 px-5 py-3 font-semibold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;