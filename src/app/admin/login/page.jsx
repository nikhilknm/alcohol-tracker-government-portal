"use client"
import React, { useState, useEffect } from 'react';
import { Lock, User, Sun, Moon } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from "next/navigation";
export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // Check system preference and set initial dark mode
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Here you would typically make an API call to verify admin credentials
    try {
      // Placeholder for authentication logic
      console.log('Attempting admin login', { username });
      
      // Reset error if login is successful
      setError('');
      if(username === 'admin' && password === 'admin123') {
        console.log('Login successful!');
        sessionStorage.setItem("isadmin", true);

        router.push("/admin/dashboard"); 
      }
      else {
        throw new Error('Invalid credentials');
      }
      
      
      // You might want to add navigation or state management here
      // For example: router.push('/admin-dashboard') or dispatch login action
    } catch (loginError) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="grid  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
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

        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 transition-colors">
          <div className="text-center mb-6">
             <Image
                  src="/tnlogo.png"
                  width={200}
                  height={200}
                  className='mx-auto'
                  alt="Picture of the author"
                />  <p className="text-gray-600  dark:text-gray-400 mt-2">Secure Access for Administrators</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>

            <div className="text-center mt-4">
              <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>
          </form>
          {/* Admin-specific footer note */}
 <div className="text-center mt-5 text-gray-500 dark:text-gray-400 text-sm">
          Unauthorized access is strictly prohibited
        </div>
        </div>
 
       
      </div>
    </div>
  );
}