import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // Ambil data produk
  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`, {
          withCredentials: true,
        });
        setName(response.data.name);
        setPrice(response.data.price);
        setPreview(`http://localhost:5000/images/${response.data.image}`);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
  }, [id]);

  const loadImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (image) {
        formData.append("image", image); // ✅ hanya kirim jika ada
      }

      await axios.patch(`http://localhost:5000/products/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto relative px-4">
      <div className="relative bg-white shadow-lg rounded-xl p-8">
        <button
          onClick={() => navigate("/products")}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl leading-none focus:outline-none"
        >
          &times;
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Edit Product
        </h1>
        {msg && (
          <p className="text-red-600 text-center font-medium mb-2">{msg}</p>
        )}

        <form onSubmit={updateProduct} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Price</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Ganti Gambar (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={loadImage}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:border-0 file:bg-green-100 file:text-green-700 file:rounded-lg"
            />
          </div>

          {preview && (
            <div className="mt-4">
              <p className="text-gray-600 mb-1">Preview Gambar:</p>
              <img
                src={preview}
                alt="preview"
                className="w-40 h-auto rounded shadow"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditProduct;
