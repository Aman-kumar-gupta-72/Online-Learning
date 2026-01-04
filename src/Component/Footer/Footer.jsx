const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide">MyLogo</h2>
          <p className="mt-3 text-gray-200 leading-relaxed">
            Learn with us — we provide best courses, tutorials, and learning resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "About", "Courses", "Contact"].map((item) => (
              <li key={item} className="hover:text-yellow-300 transition cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Important */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Important</h3>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms & Conditions", "FAQ", "Support"].map((item) => (
              <li key={item} className="hover:text-yellow-300 transition cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a className="hover:scale-110 transition-transform cursor-pointer">📘</a>
            <a className="hover:scale-110 transition-transform cursor-pointer">📷</a>
            <a className="hover:scale-110 transition-transform cursor-pointer">🐦</a>
            <a className="hover:scale-110 transition-transform cursor-pointer">🎥</a>
          </div>

          <p className="mt-4 text-gray-200">Email: support@myapp.com</p>
          <p className="text-gray-200">Phone: +91 9876543210</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/20 pt-5 text-center text-gray-200 text-sm">
        © {new Date().getFullYear()} MyLogo — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
