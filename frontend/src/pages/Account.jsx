import React, { useEffect } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle, IoMail, IoShieldCheckmark } from "react-icons/io5";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);

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
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <IoPersonCircle className="text-7xl text-green-500 animate-pulse" />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                Aktif
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Akun Saya</h2>
            <p className="text-sm text-gray-500 mb-6">Informasi pengguna saat ini</p>
          </div>

          <div className="space-y-4">
            <InfoItem icon={<IoPersonCircle />} label="Nama" value={user?.name} />
            <InfoItem icon={<IoMail />} label="Email" value={user?.email} />
            <InfoItem icon={<IoShieldCheckmark />} label="Role" value={user?.role} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl transition hover:shadow-md hover:bg-white">
    <div className="text-green-500 text-2xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium text-gray-800 capitalize">{value}</p>
    </div>
  </div>
);

export default Account;
