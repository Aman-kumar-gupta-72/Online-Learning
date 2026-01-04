import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Shield } from "lucide-react";
import { UserData } from "../../Context/UserContext";
 import imageAce  from "../../assets/Ace.jpeg"
 
const Header = () => {
  const [open, setOpen] = useState(false);
 
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const { isAuth, user, logoutUser } = UserData(); // get user + auth

  return (
    <nav className="w-full px-10 py-4 flex justify-between items-center bg-blue-100 relative shadow-md transition-colors duration-300">

      {/* Logo */}
      <Link to="/">
        <span>
          <img src={imageAce} alt="ok" className="h-20 w-25 ml-15 " />
        </span>
      </Link>

    

      {/* Mobile Toggle Button */}
      <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
        {open ? "✖" : "☰"}
      </button>

      {/* Menu Items */}
      <div
        className={`md:flex md:items-center md:gap-14 absolute md:static left-0 top-full w-full md:w-auto bg-blue-100 transition-all duration-300 overflow-hidden ${open ? "h-auto py-4" : "h-0 md:h-auto md:py-0"
          }`}
      >
        {/* Center Menu */}
        <div className="flex flex-col md:flex-row md:gap-8 text-lg px-6 md:px-0">
          {isAuth && user?.role === "admin" ? (
            // Admin Menu
            ["Home", "About", "Course"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group py-2 font-semibold"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))
          ) : (
            // User/Guest Menu
            ["Home", "About", "Course", "Account"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group py-2 font-semibold"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))
          )}
        </div>

        {/* Right Sidebar Items */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 md:px-0 mt-4 md:mt-0">

          {/* Search Button */}
          {/* <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-white  top-5 rounded-full shadow hover:shadow-md transition-all absolute  right-26  mt-2  animate-fadeIn"
          >
            <Search className=" " size={20} />
          </button> */}

          {/* AUTH LOGIC SECTION */}
          {isAuth ? (
            <div className="static">
              {/* Profile Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow hover:shadow-md transition-all"
              >
                {/* Profile Icon with First Letter */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl w-48 p-2 z-20 animate-fadeIn">
                  {user?.role === "admin" ? (
                    <>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-100 rounded-lg text-indigo-600 font-semibold"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/promote-user"
                        className="block px-4 py-2 hover:bg-indigo-100 rounded-lg text-indigo-600"
                      >
                        Manage Users
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/account"
                        className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/account?tab=courses"
                        className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        My Courses
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => logoutUser(navigate)}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            // NOT LOGGED IN => show Login + Signup
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <Link
                to="/signup"
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                Signup
              </Link>

              <Link
                to="/login"
                className="bg-amber-300 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
