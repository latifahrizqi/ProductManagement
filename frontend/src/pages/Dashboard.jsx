import React, { useEffect } from "react";
import Layout from "./Layout";
import Welcome from "../components/Welcome";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getMe } from "../features/authSlice";
import DashboardStats from "../components/DashboardStats";
import { IoCube, IoAddCircleOutline } from "react-icons/io5";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <Welcome />

      {user && user.role === "admin" ? (
        <DashboardStats />
      ) : (
        <div className="mt-6 bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-full text-3xl shadow">
              <IoCube />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Halo, {user?.name} 👋
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Ayo mulai kelola produkmu hari ini!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Link
              to="/products"
              className="bg-white hover:bg-green-50 border border-green-200 p-4 rounded-xl shadow transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-green-600">Lihat Daftar Produk</h3>
                <p className="text-sm text-gray-500">Cek produk yang sudah kamu buat</p>
              </div>
              <IoCube className="text-3xl text-green-400" />
            </Link>

            <Link
              to="/products/add"
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl shadow transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">Tambah Produk Baru</h3>
                <p className="text-sm">Langsung buat produk sekarang</p>
              </div>
              <IoAddCircleOutline className="text-3xl" />
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
