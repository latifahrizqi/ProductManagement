import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-image.png"; // Gambar ilustrasi hero

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-blue-100 to-blue-200 flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white shadow-2xl rounded-3xl p-10 overflow-hidden">
        {/* Left Text Section */}
        <div className="flex flex-col justify-center animate-fadeInLeft">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 leading-tight mb-4">
            Kelola Produkmu <br /> Lebih Cepat & Mudah
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            MyApp adalah solusi sederhana untuk manajemen produk digital.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition duration-300 shadow-md"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex items-center justify-center animate-fadeInRight">
          <img
            src={heroImage}
            alt="Hero Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
