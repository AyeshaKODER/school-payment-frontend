// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

// 🔹 (keeping your useAppState, mockTransactions, Login, Dashboard, TransactionStatusCheck code unchanged above…)

const Sidebar = ({ currentPage, onPageChange, onLogout, user }) => {
  const [openMenu, setOpenMenu] = useState("transactions"); // default open dropdown

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "💳",
      children: [
        { id: "transactions", label: "All Transactions" },
        { id: "schools", label: "School Transactions" },
      ],
    },
    {
      id: "status",
      label: "Transaction Status",
      icon: "🔍",
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo + User */}
      <div className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="font-bold text-gray-800">SchoolPay</h1>
        </div>
        <button
          onClick={onLogout}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Logout"
        >
          ⎋
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() =>
                item.children
                  ? setOpenMenu(openMenu === item.id ? null : item.id)
                  : onPageChange(item.id)
              }
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.children && (
                <span>{openMenu === item.id ? "▲" : "▼"}</span>
              )}
            </button>

            {item.children && openMenu === item.id && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onPageChange(child.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      currentPage === child.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer user info */}
      <div className="p-4 border-t text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">
              {user?.name?.[0] || "A"}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-800">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const {
    token,
    user,
    currentPage,
    setToken,
    setUser,
    setCurrentPage,
    logout,
  } = useAppState();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const handleLogin = () => {
    setUser({ name: "Admin User", email: "admin@schoolpay.com" });
    setToken("mock-jwt-token-" + Date.now());
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case "transactions":
        return <Dashboard />;
      case "schools":
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">School Transactions</h2>
            <p>Select a school to view specific transactions…</p>
          </div>
        );
      case "status":
        return <TransactionStatusCheck />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      />
      <main className="flex-1">{renderContent()}</main>
    </div>
  );
}

export default App;
