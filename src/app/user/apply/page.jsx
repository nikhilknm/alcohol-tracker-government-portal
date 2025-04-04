"use client"
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Sun, 
  Moon, 
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const AlcoholRegulationApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    aadharNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    employmentStatus: '',
    annualIncome: '',
    weight: '',
    medicalHistory: {
      alcoholConsumption: '',
      medicalConditions: ''
    },
    mpin:''
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check system preference and set initial dark mode
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } 
    // Handle nested medical history fields
    else if (name.startsWith('medicalHistory.')) {
      const medicalField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [medicalField]: value
        }
      }));
    } 
    // Handle regular fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validation for each step
  const validateStep = () => {
    switch(step) {
      case 1:
        return formData.fullName && formData.email && formData.mobileNumber && formData.dateOfBirth;
      case 2:
        return formData.aadharNumber  &&
               formData.address.street && 
               formData.address.city && 
               formData.address.state && 
               formData.address.pincode;
      case 3:
        return formData.employmentStatus && formData.annualIncome && formData.weight&& formData.mpin  ;
      default:
        return false;
    }
  };

  // Move to next step
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    } else {
      setError('Please fill in all required fields');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Move to previous step
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Calculate recommended alcohol limit based on weight
  const calculateBottleLimit = (weight) => {
    // Basic calculation - adjust as needed for your specific requirements
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) return 0;
    
    // Example formula: 1 bottle per 15kg of weight per month, max 6 bottles
    const bottles = Math.min(Math.ceil(weightNum / 15), 6);
    return bottles;
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (true) {
      setLoading(true);
      setError(null);
      
      try {
        // Prepare data for API
        const totalBottles = calculateBottleLimit(formData.weight);
  
        const userData = {
          name: formData.fullName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          dob: formData.dateOfBirth,
          aadharnumber: formData.aadharNumber,
          address: {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            pincode: formData.address.pincode
          },
          employmentStatus: formData.employmentStatus,
          annualIncome: formData.annualIncome,
          weight: formData.weight,
          medicalHistory: {
            alcoholConsumption: formData.medicalHistory.alcoholConsumption,
            medicalConditions: formData.medicalHistory.medicalConditions
          },
          mpin: formData.mpin, // In a real app, allow the user to set this
          isactive: false,
          totalbottles: totalBottles,
          remainingbottles: totalBottles
        };
        const baseurl = "http://localhost:7333/api/register";
        // Send request to the backend API
        const response = await fetch(baseurl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
  
        const data = await response.json();
  console.log(response)
        if (response.ok) {
          setIsSubmitted(true);
        } else {
          throw new Error(data.message || 'Failed to register user');
        }
      } catch (err) {
        setError('Error submitting application. Please try again.');
       ////  console.error('Submission error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please complete all required fields');
      setTimeout(() => setError(null), 3000);
    }
  };
  

  // Render different steps
  const renderStep = () => {
    if (isSubmitted) {
      return (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 text-white rounded-full p-4">
              <Check size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your application for the Alcohol Regulation Card has been received. 
            You will be notified about the status via email and SMS.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md mb-4">
            <p className="text-blue-700 dark:text-blue-300">
              Expected Processing Time: 7-10 Working Days
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md">
            <p className="text-green-700 dark:text-green-300">
              Your monthly allocation: {calculateBottleLimit(formData.weight)} bottles
            </p>
          </div>
        </div>
      );
    }

    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Mobile Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-gray-400" size={20} />
                  </div>
                  <input 
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                    placeholder="10-digit number"
                    required
                    maxLength={10}
                    pattern="\d{10}"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Date of Birth *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <input 
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Address and Identification
            </h2>
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Aadhar Number *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="text-gray-400" size={20} />
                </div>
                <input 
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="12-digit Aadhar number"
                  required
                  maxLength={12}
                  pattern="\d{12}"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Street Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-gray-400" size={20} />
                  </div>
                  <input 
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Street address"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">City *</label>
                <input 
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="City"
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">State *</label>
                <input 
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Pincode *</label>
                <input 
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="6-digit pincode"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Profile and Health Details
            </h2>
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Employment Status *</label>
              <select 
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              >
                <option value="">Select Employment Status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Annual Income (₹) *</label>
                <input 
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter annual income"
                  required
                />
              </div>
              <div className="grid md:grid-cols-1 gap-2">
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">MPin *</label>
                <input 
                   type="text"  // Changed from "number" to "text"
                   name="mpin"  // Ensure this matches your form state key
                   maxLength={4} // Limit MPIN to 6 digits
                   pattern="\d{4,4}" // Allow only 4 to 6 digits
                 
                  minLength={4}
                  required
                  value={formData.mpin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="mpin"
                  
                />
              </div>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Weight (kg) *</label>
                <input 
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter your weight"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Current Alcohol Consumption *</label>
              <select 
                name="medicalHistory.alcoholConsumption"
                value={formData.medicalHistory.alcoholConsumption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              >
                <option value="">Select Consumption Level</option>
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Any Medical Conditions</label>
              <textarea 
                name="medicalHistory.medicalConditions"
                value={formData.medicalHistory.medicalConditions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                placeholder="Describe any relevant medical conditions"
                rows={3}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Review Application
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Personal Information
              </h3>
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Mobile:</strong> {formData.mobileNumber}</p>
              <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Address Details
              </h3>
              <p><strong>Aadhar Number:</strong> {formData.aadharNumber}</p>
              <p><strong>Address:</strong> {formData.address.street}, {formData.address.city}, {formData.address.state} - {formData.address.pincode}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Additional Details
              </h3>
              <p><strong>Employment Status:</strong> {formData.employmentStatus}</p>
              <p><strong>Annual Income:</strong> ₹{formData.annualIncome}</p>
              <p><strong>Weight:</strong> {formData.weight} kg</p>
              <p><strong>Alcohol Consumption:</strong> {formData.medicalHistory.alcoholConsumption}</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-200">
                Monthly Allocation
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Based on your weight, you will be eligible for <strong>{calculateBottleLimit(formData.weight)} bottles</strong> per month
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2 text-yellow-700 dark:text-yellow-200">
                Terms and Conditions
              </h3>
              <div className="flex items-start mb-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="terms" className="text-yellow-700 dark:text-yellow-300 text-sm">
                  I confirm that all information provided is accurate and I understand that providing false information can lead to rejection of my application.
                </label>
              </div>
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="rules" 
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="rules" className="text-yellow-700 dark:text-yellow-300 text-sm">
                  I agree to abide by the alcohol consumption regulations set by the authorities and understand that my card can be revoked if I violate these rules.
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-gray-800" />
          )}
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Alcohol Regulation Card Application
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Apply for your personalized monthly alcohol quota
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            {/* Progress Indicator */}
            {!isSubmitted && (
              <div className="bg-gray-100 dark:bg-gray-900 p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Step {step} of 4</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {step === 1 ? "Personal Details" : 
                     step === 2 ? "Address" : 
                     step === 3 ? "Profile" : "Review"}
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4].map((item) => (
                    <div 
                      key={item} 
                      className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                        step >= item 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:text-red-300">
                <p>{error}</p>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {renderStep()}

              {/* Navigation Buttons */}
              {!isSubmitted && (
                <div className="flex justify-between mt-8">
                  {step > 1 && !isSubmitted && (
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      disabled={loading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>
                  )}
                  {step < 4 && !isSubmitted && (
                    <button 
                      type="button"
                      onClick={nextStep}
                      className="flex items-center ml-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      disabled={loading}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  {step === 4 && !isSubmitted && (
                    <button 
                      type="submit"
                      className="flex items-center ml-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Check className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
          
          {/* Help Text */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Need help? Contact support at <span className="font-medium">support@rec.gov.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlcoholRegulationApp;