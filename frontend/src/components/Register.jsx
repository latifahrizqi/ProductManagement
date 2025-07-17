import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../features/authSlice";
import Swal from "sweetalert2";
import loginImage from "../assets/login-image.png"; // opsional kalau mau tambah gambar

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        RegisterUser({ name, email, password, confPassword })
      ).unwrap();

      Swal.fire({
        title: "Berhasil!",
        text: "Registrasi berhasil. Silakan login.",
        icon: "success",
      }).then(() => navigate("/"));
    } catch (error) {
      Swal.fire({
        title: "Gagal",
        text: error,
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-200 to-blue-300">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left image (optional) */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 p-4">
          <img
            src={loginImage}
            alt="Register Illustration"
            className="w-full h-auto object-contain max-h-[400px]"
          />
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
            Daftar Akun Baru
          </h2>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Konfirmasi Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Ulangi password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Daftar
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Sudah punya akun?{" "}
              <a href="/" className="text-blue-600 hover:underline font-medium">
                Login di sini
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
