import { useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const categoryOptions = categories.filter((category) => category !== "Semua");

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "Semua" || menu.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [menus, search, categoryFilter]);

  const activeMenus = menus.filter((menu) => menu.isAvailable);
  const inactiveMenus = menus.filter((menu) => !menu.isAvailable);
  const outOfStockMenus = menus.filter((menu) => Number(menu.stock) <= 0);

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

    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-900 to-orange-700 p-8 text-white shadow-xl">
        <p className="font-bold uppercase tracking-[0.25em] text-orange-200">
          Kelola Menu
        </p>
        <h1 className="mt-3 text-4xl font-black">Menu Dimsum Imono</h1>
        <p className="mt-3 max-w-2xl text-orange-100">
          Tambah, edit, hapus, dan atur ketersediaan menu yang tampil di halaman
          pelanggan.
        </p>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(initialForm);
          }}
          className="mt-6 rounded-2xl bg-white px-6 py-4 font-black text-red-900 transition hover:bg-orange-50"
        >
          + Tambah Menu Baru
        </button>
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Total Menu
          </p>
          <h2 className="mt-2 text-3xl font-black text-red-900">
            {menus.length}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Menu Aktif
          </p>
          <h2 className="mt-2 text-3xl font-black text-green-700">
            {activeMenus.length}
          </h2>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Stok Habis
          </p>
          <h2 className="mt-2 text-3xl font-black text-red-700">
            {outOfStockMenus.length}
          </h2>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-orange-100 md:p-8"
        >
          <div className="mb-6">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              {editId ? "Edit Menu" : "Tambah Menu"}
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">
              {editId ? "Perbarui data menu" : "Masukkan menu baru"}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Nama Menu
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Dimsum Ayam"
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Kategori
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              >
                {categoryOptions.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Harga
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="15000"
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">Stok</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="20"
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Icon / Emoji
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="🥟"
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-800">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-gray-800">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi singkat menu"
                className="h-28 w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 font-bold text-gray-800">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="h-5 w-5"
              />
              Menu tersedia untuk pelanggan
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-red-800 px-6 py-4 font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-red-900"
            >
              {editId ? "Simpan Perubahan" : "Tambah Menu"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl bg-gray-100 px-6 py-4 font-black text-gray-700 hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama menu..."
            className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-red-700"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-sm font-semibold text-gray-500">
          Menampilkan {filteredMenus.length} dari {menus.length} menu. Menu
          nonaktif: {inactiveMenus.length}
        </p>
      </div>

      {filteredMenus.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-orange-100">
          <div className="text-6xl">🔍</div>
          <p className="mt-4 text-xl font-black text-gray-800">
            Menu tidak ditemukan.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMenus.map((menu) => (
            <article
              key={menu.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-orange-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-gradient-to-br from-orange-100 to-red-50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-6xl shadow-inner">
                    {menu.image}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      menu.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {menu.isAvailable ? "Tersedia" : "Nonaktif"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-950">
                      {menu.name}
                    </h2>
                    <p className="mt-1 text-sm font-bold text-red-700">
                      {menu.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-800">
                    ⭐ {menu.rating}
                  </span>
                </div>

                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-600">
                  {menu.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs font-bold text-gray-500">Harga</p>
                    <p className="mt-1 font-black text-red-800">
                      {formatCurrency(menu.price)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs font-bold text-gray-500">Stok</p>
                    <p
                      className={`mt-1 font-black ${
                        Number(menu.stock) <= 0
                          ? "text-red-700"
                          : "text-gray-950"
                      }`}
                    >
                      {Number(menu.stock) <= 0 ? "Habis" : menu.stock}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <button
                    onClick={() => handleEdit(menu)}
                    className="rounded-2xl bg-orange-100 px-4 py-3 text-sm font-black text-red-800 hover:bg-orange-200"
                  >
                    Edit Menu
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleAvailability(menu.id)}
                      className="rounded-2xl bg-blue-100 px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-200"
                    >
                      {menu.isAvailable ? "Nonaktifkan" : "Aktifkan"}
                    </button>

                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-black text-red-800 hover:bg-red-200"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ManageMenu;