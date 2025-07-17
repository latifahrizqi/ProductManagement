import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { IoTrash, IoPencil } from "react-icons/io5";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products", {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Gagal ambil produk:", error.message);
    }
  };

  const deleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/products/${productId}`, {
          withCredentials: true,
        });
        getProducts();
        Swal.fire("Dihapus!", "Produk berhasil dihapus.", "success");
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus produk.", "error");
      }
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredProducts = [...products]
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produk</h1>
          <p className="text-sm text-gray-500">Lihat semua produk kamu di sini</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-400 focus:outline-none"
          />

          <button
            onClick={toggleSort}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm px-4 py-2 rounded-lg"
          >
            Urutkan: {sortOrder === "asc" ? "Termurah" : "Termahal"}
          </button>

          <Link
            to="/products/add"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 italic mt-10">Tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.uuid}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={`http://localhost:5000/images/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm italic text-gray-400">No Image</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-green-600 font-bold mb-1">
                  Rp {product.price}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Dibuat oleh: {product.user.name}
                </p>

                <div className="flex justify-between">
                  <Link
                    to={`/products/edit/${product.uuid}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <IoPencil /> Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(product.uuid);
                    }}
                    className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <IoTrash /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL POPUP */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detail Produk</h2>
            {selectedProduct.image && (
              <img
                src={`http://localhost:5000/images/${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded mb-4"
              />
            )}
            <p className="text-lg text-gray-700 font-semibold mb-2">
              {selectedProduct.name}
            </p>
            <p className="text-green-600 font-bold mb-1">
              Rp {selectedProduct.price}
            </p>
            <p className="text-sm text-gray-600">
              Dibuat oleh: {selectedProduct.user.name} ({selectedProduct.user.email})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
