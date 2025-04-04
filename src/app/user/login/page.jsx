"use client";
import React, { useState } from "react";
import { Lock, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

// 🔹 Popup Modal Component (Move it outside for better optimization)
const InactiveAccountModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blur text-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">Account Inactive</h2>
        <p>Your account is inactive. Please contact support.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function UserLogin() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const baseurl = "http://localhost:7333/api/login";
  React.useEffect(() => {
    // Get Aadhar number from local storage
    const aadharNumber = localStorage.getItem("mobileNumber");

    if (aadharNumber) {
      setError("autologin..");
    
      router.push("/user/dashboard"); 
      return;
    }


  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10 || mpin.length !== 4) {
      setError("Invalid mobile number or MPIN");
      return;
    }

    try {
      const response = await fetch(baseurl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, mpin }),
      });

      const data = await response.json();
      console.log("Response Data:", data); // ✅ Log correctly

      if (!response.ok) {
        if (response.status === 403) {
          setIsModalOpen(true); // 🔹 Show modal for inactive account
        } else {
          setError(data.message || "Login failed"); // Handle other errors
        }
       return;
      }

      // ✅ Store token safely
      localStorage.setItem("token", data.token);
      localStorage.setItem("mobileNumber", data.user.mobileNumber);

      router.push("/user/dashboard"); // ✅ Redirect to dashboard

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  };
  return (
    <div className="grid items-center justify-items-center min-h-screen p-5 pb-10 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {/* 🔹 Show modal if account is inactive */}
      {isModalOpen ? (
        <InactiveAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      ) : (
        <>
          <h1 className="text-red-500 font-bold text-[120%] text-center font-mono">
            Don't drink and drive, and you'll stay alive!!!
          </h1>
  
          <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Login</h2>
              <p className="text-gray-600 mt-2">Enter your mobile number and MPIN</p>
            </div>
  
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Mobile Number Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, ""); // Allow only numbers
                    setMobileNumber(input.slice(0, 10)); // Limit to 10 digits
                  }}
                  placeholder="Mobile Number"
                  className="w-full text-black pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={10}
                />
              </div>
  
              {/* MPIN Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={mpin}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, ""); // Allow only numbers
                    setMpin(input.slice(0, 4)); // Limit to 4 digits
                  }}
                  placeholder="MPIN (4 digits)"
                  className="w-full text-black pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={4}
                />
              </div>
  
              {/* Error Message */}
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
  
              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
  
              {/* Forgot MPIN Link */}
              <div className="text-center mt-4">
                <a href="#" className="text-blue-500 hover:underline text-sm">
                  Forgot MPIN?
                </a>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}  