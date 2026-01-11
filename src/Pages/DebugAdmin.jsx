// import React from "react";
// import { UserData } from "../Context/UserContext";

// export default function DebugAdmin() {
//   const { user, isAuth, loading } = UserData();

//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Debug Admin Info</h1>

//         <div className="space-y-6">
//           {/* Loading Status */}
//           <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
//             <h2 className="text-lg font-bold text-blue-900 mb-2">Loading Status:</h2>
//             <p className="text-blue-700 text-lg">
//               <span className="font-mono">{loading ? "🔄 LOADING" : "✅ LOADED"}</span>
//             </p>
//           </div>

//           {/* Auth Status */}
//           <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
//             <h2 className="text-lg font-bold text-purple-900 mb-2">Auth Status:</h2>
//             <p className="text-purple-700 text-lg">
//               <span className="font-mono">{isAuth ? "✅ AUTHENTICATED" : "❌ NOT AUTHENTICATED"}</span>
//             </p>
//           </div>

//           {/* User Data */}
//           <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
//             <h2 className="text-lg font-bold text-green-900 mb-2">User Data:</h2>
//             <div className="space-y-3 text-green-700">
//               <p>
//                 <strong>ID:</strong> <span className="font-mono">{user?._id || "N/A"}</span>
//               </p>
//               <p>
//                 <strong>Name:</strong> <span className="font-mono">{user?.name || "N/A"}</span>
//               </p>
//               <p>
//                 <strong>Email:</strong> <span className="font-mono">{user?.email || "N/A"}</span>
//               </p>
//               <p>
//                 <strong>Role:</strong>{" "}
//                 <span className="font-mono font-bold text-lg">
//                   {user?.role ? (
//                     <span className={user.role === "admin" ? "text-red-600" : "text-blue-600"}>
//                       {user.role.toUpperCase()}
//                     </span>
//                   ) : (
//                     "N/A"
//                   )}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Full User Object */}
//           <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
//             <h2 className="text-lg font-bold text-gray-900 mb-2">Full User Object:</h2>
//             <pre className="text-sm overflow-auto bg-gray-900 text-green-400 p-4 rounded font-mono">
//               {JSON.stringify(user, null, 2)}
//             </pre>
//           </div>

//           {/* Instructions */}
//           <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
//             <h2 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Instructions:</h2>
//             <ol className="text-yellow-700 space-y-2 list-decimal list-inside">
//               <li>If Role says "admin" → You can go to /admin</li>
//               <li>If Role says something else → Need to promote account to admin</li>
//               <li>Check browser console (F12) for more debug logs</li>
//             </ol>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             {isAuth && user?.role === "admin" ? (
//               <a
//                 href="/admin"
//                 className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-center transition"
//               >
//                 ✅ Go to Admin Dashboard
//               </a>
//             ) : (
//               <div className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold text-center">
//                 ❌ Not Admin
//               </div>
//             )}
//             <button
//               onClick={() => window.location.reload()}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
//             >
//               🔄 Reload
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
