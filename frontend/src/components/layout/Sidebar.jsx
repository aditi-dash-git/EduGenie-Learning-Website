import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
  GraduationCap,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const isEducator = user?.role === "educator";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  if (isEducator) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-200 ${
          isSidebarOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-blue-100 z-50 md:relative md:w-64 md:flex md:flex-col md:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <BrainCircuit size={20} />
            </div>

            <div>
              <h1 onClick={() => navigate("/")} className="text-sm font-bold text-gray-800">
                AI Learning
              </h1>

              <p className="text-xs text-gray-500">
                Assistant
              </p>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="md:hidden text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              <link.icon size={19} />
              {link.text}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-blue-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={18} />
            HomePage
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;