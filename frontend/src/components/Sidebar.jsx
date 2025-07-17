import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoHome, IoPricetag, IoPerson, IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import Swal from "sweetalert2";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin logout?",
      text: "Anda akan keluar dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
      }
    });
  };

  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200 px-4 py-6 flex flex-col">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="bg-green-500 text-white font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">
          M
        </div>
        <h1 className="text-xl font-bold text-gray-800">MyApp Admin</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-2">
        <NavItem to="/dashboard" icon={<IoHome />} label="Dashboard" />
        <NavItem to="/products" icon={<IoPricetag />} label="Products" />

        {user?.role === "admin" && (
          <>
            <div className="mt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
              Admin
            </div>
            <NavItem to="/users" icon={<IoPerson />} label="Users" />
          </>
        )}

        <div className="mt-6 text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
          Settings
        </div>

        {/* Link ke halaman informasi akun */}
        <NavItem to="/account" icon={<IoPerson />} label="Akun Saya" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-gray-700 px-3 py-2 hover:bg-red-100 rounded-lg transition-colors"
        >
          <IoLogOut className="text-lg text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
          isActive
            ? "bg-green-500 text-white"
            : "text-gray-700 hover:bg-green-100"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;
