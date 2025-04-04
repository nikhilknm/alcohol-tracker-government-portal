"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  BarChart2, 
  Users, 
  Shield, 
  RefreshCw, 
  Sun, 
  Moon, 
  Database, 
  FileText, 
  Archive, 
  Clock,
  MapPin,
  Activity,
  UserPlus,
  Map,
  ShoppingBag,
  Ban
} from 'lucide-react';

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Tasmac Shops Data
  const [tasmacShops, setTasmacShops] = useState([
    { 
      id: 1, 
      name: 'Tasmac Central', 
      address: '123 Main St, Chennai', 
      latitude: 13.0827, 
      longitude: 80.2707,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Tasmac North', 
      address: '456 North Rd, Coimbatore', 
      latitude: 11.0168, 
      longitude: 76.9858,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Tasmac South', 
      address: '789 South Ave, Madurai', 
      latitude: 9.9252, 
      longitude: 78.1198,
      status: 'active'
    }
  ]);

  // Fetch users when activeSection is manageApplications
  useEffect(() => {
    if (activeSection === 'manageApplications') {
      const fetchUsers = async () => {
        try {
          const response = await fetch("http://localhost:7333/api/users");
          if (!response.ok) throw new Error("Failed to fetch users");
        
          const data = await response.json();
          console.log(data);
          setUsers(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [activeSection]);

  // Fetch dashboard stats when activeSection is dashboard
  useEffect(() => {
    if (activeSection === 'dashboard') {
      const fetchStats = async () => {
        try {
          const response = await fetch("http://localhost:7333/api/dashboard/stats");
          if (!response.ok) throw new Error("Failed to fetch stats");
  
          const data = await response.json();
          console.log(data);
          setStats(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchStats();
    }
  }, [activeSection]);

  // Dark Mode Toggle and System Preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  const handleUpdateStatus = async (mobileNumber, newStatus) => {
    try {
      const response = await fetch("http://localhost:7333/api/users/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobileNumber, isactive: newStatus }),
      });
  
      if (!response.ok) throw new Error("Failed to update user status");
  
      const data = await response.json();
  
      console.log(data);
  
      setUsers(users.map((user) => 
        user.mobileNumber === mobileNumber ? { ...user, isactive: newStatus } : user
      ));
    } catch (err) {     
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.mobileNumber?.includes(searchQuery)
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Utility Components
  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center space-x-4 transition-colors">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );

  // Dashboard Section
  const renderDashboard = () => {
    if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!stats) return <p className="text-gray-500">No stats available</p>;
  
    return (
      <div className="p-6">
        {/* 📊 Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Users className="text-blue-500" />} title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard icon={<Database className="text-green-500" />} title="Active Cards" value={stats.activeUsers} color="bg-green-500" />
          <StatCard icon={<FileText className="text-yellow-500" />} title="Pending Applications" value={stats.pendingApplications} color="bg-yellow-500" />
        </div>
  
        {/* 📌 Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          {/* 🍾 Alcohol Quota Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Alcohol Consumption Quota</h2>
              <Activity className="text-purple-500" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                Monthly Allowed Quota: <span className="font-bold text-gray-800 dark:text-gray-100">{stats.monthlyAlcoholQuota} Bottles</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Average Monthly Consumption: <span className="font-bold text-gray-800 dark:text-gray-100">{stats.averageConsumption} Bottles</span>
              </p>
            </div>
          </div>
  
          {/* ⚡ Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h2>
              <RefreshCw className="text-teal-500" />
            </div>
            <div className="space-y-3">
              <button 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                onClick={() => setActiveSection('tasmacShops')}
              >
                <MapPin size={18} />
                <span>View Tasmac Locations</span>
              </button>
              <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center space-x-2">
                <UserPlus size={18} />
                <span>Register User</span>
              </button>
              <button 
                className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition flex items-center justify-center space-x-2"
                onClick={() => setActiveSection('manageApplications')}
              >
                <Archive size={18} />
                <span>Manage Applications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tasmac Shops Section
  const renderTasmacShops = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Tasmac Shop Locations
        </h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center space-x-2">
          <ShoppingBag size={18} />
          <span>Add New Shop</span>
        </button>
      </div>
      <div className="space-y-4">
        {tasmacShops.map((shop) => (
          <div key={shop.id} className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{shop.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{shop.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-blue-500 hover:text-blue-600">
                <MapPin size={18} />
              </button>
              <button className="text-red-500 hover:text-red-600">
                <Ban size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageApplications = () => {
    if (loading) return <p className="text-gray-500">Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Manage Applications
        </h2>
  
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
        />
  
        {filteredUsers.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-gray-600 dark:text-gray-300">No matching users found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
              >
                <p className="text-gray-800 dark:text-gray-300">
                  {user.name} ({user.mobileNumber})  
                  <span className={`text-sm ${user.isactive ? "text-green-500" : "text-red-500"}`}>
                    <span className="text-white"><br></br>Login Status:</span> {user.isactive ? "Active" : "Inactive"}
                  </span>
                </p>
  
                <div className="space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(user.mobileNumber, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(user.mobileNumber, false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render different sections based on active tab
  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'tasmacShops':
        return renderTasmacShops();
      case 'manageApplications':
        return renderManageApplications();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="grid grid-rows-[20px_1fr_20px] min-h-screen bg-gray-100 dark:bg-gray-900 p-8 gap-6 transition-colors">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-gray-800" />
          )}
        </button>

        {/* Dashboard Sidebar Navigation */}
        <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md p-6">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Admin Panel
          </h2>
          <nav className="space-y-4">
            {[
              { name: 'Dashboard', icon: <BarChart2 />, section: 'dashboard' },
              { name: 'Tasmac Shops', icon: <MapPin />, section: 'tasmacShops' },
              { name: 'Manage Applications', icon: <Archive />, section: 'manageApplications' }
            ].map((item) => (
              <button 
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                  activeSection === item.section 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area with Sidebar Offset */}
        <div className="ml-64 mt-8">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}