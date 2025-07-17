import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaBoxOpen } from "react-icons/fa";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    productsByUser: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/stats/dashboard", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="px-6 md:px-10 py-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Ringkasan Aktivitas
      </h2>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center space-x-4 border-l-4 border-blue-500">
          <div className="bg-blue-100 p-4 rounded-full">
            <FaUsers className="text-blue-600 text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-blue-700">{stats.totalUsers}</p>
            <p className="text-gray-600">Total Pengguna</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center space-x-4 border-l-4 border-green-500">
          <div className="bg-green-100 p-4 rounded-full">
            <FaBoxOpen className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-green-700">{stats.totalProducts}</p>
            <p className="text-gray-600">Total Produk</p>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Jumlah Produk per Pengguna
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats.productsByUser}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="productCount" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default DashboardStats;
