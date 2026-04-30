import { useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { categories, menuList } from "@/Data/menuData";
import { formatCurrency } from "@/Utils/formatCurrency";
import { getStorage, setStorage } from "@/Utils/storage";

const initialForm = {
  name: "",
  category: "Dimsum",
  price: "",
  stock: "",
  image: "🥟",
  description: "",
  rating: "4.5",
  isAvailable: true,
};

const ManageMenu = () => {
  const [menus, setMenus] = useState(() => getStorage("menus", menuList));
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const categoryOptions = categories.filter((category) => category !== "Semua");

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  const updateMenus = (updatedMenus) => {
    setMenus(updatedMenus);
    setStorage("menus", updatedMenus);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.category || !form.price || !form.stock) {
      toast.error("Nama, kategori, harga, dan stok wajib diisi");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }

    if (Number(form.stock) < 0) {
      toast.error("Stok tidak boleh negatif");
      return;
    }

    if (editId) {
      const updatedMenus = menus.map((menu) =>
        menu.id === editId
          ? {
              ...menu,
              ...form,
              price: Number(form.price),
              stock: Number(form.stock),
              rating: Number(form.rating),
            }
          : menu
      );

      updateMenus(updatedMenus);
      toast.success("Menu berhasil diperbarui");
      resetForm();
      return;
    }

    const newMenu = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
    };

    updateMenus([newMenu, ...menus]);
    toast.success("Menu berhasil ditambahkan");
    resetForm();
  };

  const handleEdit = (menu) => {
    setEditId(menu.id);
    setShowForm(true);
    setForm({
      name: menu.name,
      category: menu.category,
      price: menu.price,
      stock: menu.stock,
      image: menu.image,
      description: menu.description,
      rating: menu.rating || 4.5,
      isAvailable: menu.isAvailable,
    });
  };

  const handleDelete = async (menuId) => {
    const result = await Swal.fire({
      title: "Hapus Menu?",
      text: "Menu yang dihapus tidak akan tampil di daftar menu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const updatedMenus = menus.filter((menu) => menu.id !== menuId);
      updateMenus(updatedMenus);
      toast.success("Menu berhasil dihapus");
    }
  };

  const handleToggleAvailability = (menuId) => {
    const updatedMenus = menus.map((menu) =>
      menu.id === menuId
        ? { ...menu, isAvailable: !menu.isAvailable }
        : menu
    );

    updateMenus(updatedMenus);
    toast.success("Status menu diperbarui");
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-900">Kelola Menu</h1>
          <p className="text-gray-600">
            Tambah, edit, hapus, dan atur ketersediaan menu.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(initialForm);
          }}
          className="rounded-xl bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900"
        >
          Tambah Menu
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-2xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {editId ? "Edit Menu" : "Tambah Menu"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Nama Menu
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Dimsum Ayam"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Kategori
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              >
                {categoryOptions.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Harga
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="15000"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Stok
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="20"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Icon / Emoji
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="🥟"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-700">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block font-semibold text-gray-700">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi singkat menu"
                className="h-24 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <label className="flex items-center gap-2 font-semibold text-gray-700">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Menu tersedia
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900"
            >
              {editId ? "Simpan Perubahan" : "Tambah Menu"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {menus.map((menu) => (
          <article key={menu.id} className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-start justify-between">
              <div className="text-5xl">{menu.image}</div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  menu.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {menu.isAvailable ? "Tersedia" : "Nonaktif"}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {menu.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{menu.category}</p>
            <p className="mt-2 min-h-12 text-sm text-gray-600">
              {menu.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-red-800">
                  {formatCurrency(menu.price)}
                </p>
                <p className="text-xs text-gray-500">
                  Stok: {menu.stock} • Rating: {menu.rating}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => handleEdit(menu)}
                className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-orange-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleToggleAvailability(menu.id)}
                className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
              >
                {menu.isAvailable ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <button
                onClick={() => handleDelete(menu.id)}
                className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-200"
              >
                Hapus
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ManageMenu;