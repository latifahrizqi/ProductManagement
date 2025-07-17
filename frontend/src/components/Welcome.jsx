import React from "react";
import { useSelector } from "react-redux";
import { FaSmileWink } from "react-icons/fa";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl shadow p-6 mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
          Selamat Datang{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Ini adalah dashboard utama aplikasi kamu.
        </p>
      </div>
      <div className="hidden sm:flex items-center text-green-600 text-5xl">
        <FaSmileWink />
      </div>
    </div>
  );
};

export default Welcome;
