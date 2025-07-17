import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data users:", error.message);
    }
  };

  const deleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Hapus Pengguna?",
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
        await axios.delete(`http://localhost:5000/users/${userId}`, {
          withCredentials: true,
        });
        getUsers();
        Swal.fire("Berhasil!", "Pengguna telah dihapus.", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus user.", "error");
      }
    }
  };

  const showUserDetail = (user) => {
    Swal.fire({
      title: user.name,
      html: `
        <div style="text-align: left">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Tutup",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole =
      selectedRole === "all" || user.role.toLowerCase() === selectedRole;

    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daftar Pengguna</h1>
            <p className="text-sm text-gray-500">Kelola semua user di sistem</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <Link
              to="/users/add"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition duration-200"
            >
              + Tambah
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gradient-to-r from-green-200 via-teal-300 to-blue-200 text-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">No</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-20 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.uuid}
                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => showUserDetail(user)}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/users/edit/${user.uuid}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          <IoPencilOutline size={18} /> Edit
                        </Link>
                        <button
                          onClick={() => deleteUser(user.uuid)}
                          className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition"
                        >
                          <IoTrashOutline size={18} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    Pengguna tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Userlist;
