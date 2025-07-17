import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../logo.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import Swal from "sweetalert2";
import { IoMenu } from "react-icons/io5"; // ikon hamburger

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
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
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between z-50 sticky top-0">
      {/* Kiri - Logo dan menu */}
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile) */}
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-600 md:hidden focus:outline-none"
        >
          <IoMenu />
        </button>

        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-28 h-auto" />
        </NavLink>
      </div>

      {/* Kanan - Logout */}
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-gray-600 hidden md:inline">Hi, {user.name}</span>
        )}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
