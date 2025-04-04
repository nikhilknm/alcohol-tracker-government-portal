"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  RefreshCw, 
  User, 
  MapPin, 
  Calendar, 
  FileText 
} from 'lucide-react';

// Custom Badge Component
const Badge = ({ children, className = '' }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};

const AlcoholConsumptionDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  React.useEffect(() => {
    // Get Aadhar number from local storage
    const aadharNumber = localStorage.getItem("mobileNumber");

    if (!aadharNumber) {
      setError("loading...");
      setLoading(false);
      router.push("/user/login"); 
      return;
    }

    // Fetch user details from API
    fetch(`http://localhost:7333/api/viewdetails/${aadharNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user details");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUserData(data.user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

 
  const getCardStatusColor = () => {
    switch(userData.cardStatus) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return (
    <div className="max-w-xl mx-auto bg-white text-black w-full p-4 space-y-4">
      {/* User Profile Card */}
      <Card>
        <CardHeader className="bg-blue-50 border-b flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="mr-2" />
            User Profile
          </CardTitle>
          <Badge className={getCardStatusColor()}>
            {userData.cardStatus}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <CreditCard className="mr-2 h-4 w-4" /> Mobile Number
            </p>
            <p className="font-semibold">{userData.mobileNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Expiry Date
            </p>
            <p className="font-semibold">{userData.expirydate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <User className="mr-2 h-4 w-4" /> Name
            </p>
            <p className="font-semibold">{userData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Aadhar Number
            </p>
            <p className="font-semibold">{userData.aadharnumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="mr-2 h-4 w-4" /> Address
            </p>
            <p className="text-sm">{userData.address}</p>
          </div>
          <button
  onClick={() => {
    localStorage.clear();
    window.location.href = "/user/login"; // Redirect to login page
  }}
  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
>
  Logout
</button>
        </CardContent>
      </Card>

      {/* Card Renewal Card */}
      <Card>
        <CardHeader className="bg-yellow-50 border-b">
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-2" />
            Card Renewal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Last Renewal Date</p>
              <p className="font-semibold">{userData.expirydate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Renewal Due</p>
              <p className="font-semibold">{userData.renewaldate}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Renewal Eligibility: 
              {userData.renewalEligibility ? (
                <span className="text-green-600 ml-2">Eligible</span>
              ) : (
                <span className="text-red-600 ml-2">Not Eligible</span>
              )}
            </p>
            <p className="text-sm text-gray-600">
              Renewal Cost: ₹300
            </p>
          </div>
          
          <Button 
          //  onClick={handleCardRenewal}
            disabled={!userData.renewalEligibility}
            className="w-full"
          >
            Initiate Card Renewal
          </Button>
        </CardContent>
      </Card>

      {/* Consumption Tracking Card */}
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2" />
            Consumption Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Monthly Alcohol Limit</h3>
              <p className="text-sm">
                {userData.remainingbottles} / {userData.totalbottles} Bottles
              </p>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-green-500 h-full" 
                style={{
                  width: `${(userData.remainingbottles / userData.totalbottles) * 100}%`
                }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Remaining: {userData.totalbottles - userData.remainingbottles} Bottles
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-md">
            <h4 className="font-medium mb-2">Health Recommendation</h4>
            <p className="text-sm text-gray-700">{userData.healthRecommendation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlcoholConsumptionDashboard;