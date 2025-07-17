import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-100">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Container bawah Navbar */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`bg-white w-64 min-h-screen fixed md:static top-0 left-0 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <Sidebar />
        </aside>

        {/* Overlay (untuk mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Konten utama */}
        <main className="flex-1 md:ml-30 px-6 pb-20 pt-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
