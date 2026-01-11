import { useState, useEffect } from "react";
import { CourseData } from "../Context/CourseContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../main";

export default function PaymentDebug() {
  const { courses } = CourseData();
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState("checking...");
  const [paymentIntentStatus, setPaymentIntentStatus] = useState("not tested");

  useEffect(() => {
    // Test API connectivity
    const testAPI = async () => {
      try {
        const response = await axios.get(`${API}/api/test`, {
          timeout: 5000,
        });
        setApiStatus("✅ API is reachable: " + response.status);
      } catch (error) {
        setApiStatus(
          "❌ API Error: " +
            (error.message || "Cannot reach backend on port 2000")
        );
      }
    };
    testAPI();
  }, []);

  const testPaymentIntent = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPaymentIntentStatus("❌ No token in localStorage");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/payment/create-intent`,
        {
          amount: 99,
          currency: "usd",
          courseId,
        },
        {
          headers: {
            token,
          },
          timeout: 10000,
        }
      );

      if (response.data.clientSecret) {
        setPaymentIntentStatus("✅ Payment intent created: " + response.status);
      } else {
        setPaymentIntentStatus("❌ No clientSecret in response");
      }
    } catch (error) {
      setPaymentIntentStatus(
        "❌ Error: " +
          (error.response?.data?.message ||
            error.message ||
            "Payment intent creation failed")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Payment Debug</h1>

      {/* API Status */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🌐 API Connectivity</h2>
        <div className="space-y-4">
          <div className="p-4 rounded bg-gray-50 border-l-4 border-blue-500">
            <p className="text-lg font-mono">{apiStatus}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Backend URL:</strong>
              <p className="font-mono text-blue-600">
                {API}/api
              </p>
            </div>
            <div>
              <strong>Frontend URL:</strong>
              <p className="font-mono text-green-600">{window.location.href}</p>
            </div>
            <div>
              <strong>Token Status:</strong>
              <p className="font-mono">
                {localStorage.getItem("token") ? "✅ Present" : "❌ Missing"}
              </p>
            </div>
            <div>
              <strong>Stripe Key:</strong>
              <p className="font-mono">
                {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
                  ? "✅ Loaded"
                  : "❌ Missing"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📚 Courses in System</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Title</th>
                <th className="border p-3 text-left">Price</th>
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course) => (
                <tr key={course._id} className="hover:bg-gray-100">
                  <td className="border p-3 font-semibold">{course.title}</td>
                  <td className="border p-3 text-lg font-bold text-green-600">
                    ${course.price}
                  </td>
                  <td className="border p-3 font-mono text-xs text-gray-500">
                    {course._id.slice(0, 8)}...
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => {
                        const isFree =
                          course.price === 0 ||
                          course.price === "0" ||
                          !course.price;
                        if (isFree) {
                          alert(
                            `FREE COURSE - Would navigate to /lectures/${course._id}`
                          );
                        } else {
                          alert(
                            `PAID COURSE - Would navigate to /payment/${course._id}`
                          );
                          navigate(`/payment/${course._id}`);
                        }
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Test Enroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Total: {courses?.length || 0} courses
        </p>
      </div>

      {/* Payment Intent Test */}
      {courses && courses.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">💳 Payment Intent Test</h2>
          <div className="mb-4 p-4 rounded bg-gray-50 border-l-4 border-purple-500">
            <p className="font-mono text-lg">{paymentIntentStatus}</p>
          </div>
          <button
            onClick={() => testPaymentIntent(courses[0]._id)}
            disabled={!localStorage.getItem("token")}
            className={`px-6 py-3 rounded font-semibold text-white ${
              localStorage.getItem("token")
                ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Test Payment Intent Creation
          </button>
          {!localStorage.getItem("token") && (
            <p className="mt-3 text-red-600 font-semibold">
              ⚠️ You must be logged in to test payment intent
            </p>
          )}
        </div>
      )}
    </div>
  );
}
