import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { adminUser } from "@/Data/adminData";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    if (form.email !== adminUser.email || form.password !== adminUser.password) {
      toast.error("Email atau password salah");
      return;
    }

    localStorage.setItem("admin", JSON.stringify(adminUser));
    toast.success("Login admin berhasil");
    navigate("/admin/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-red-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">Masuk ke panel Dimsum Imono</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@dimsumimono.com"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="123456"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900"
          >
            Login
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-orange-50 p-4 text-sm text-gray-700">
          <p className="font-semibold">Dummy admin:</p>
          <p>Email: admin@dimsumimono.com</p>
          <p>Password: 123456</p>
        </div>
      </section>
    </main>
  );
};

export default Login;