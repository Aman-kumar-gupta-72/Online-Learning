import { Link } from 'react-router-dom';
 import imageAce  from "../../assets/Ace.jpeg"

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/course" },
    { name: "Contact", path: "/contact" },
  ];

  const importantLinks = [
    { name: "Privacy Policy", path: "#" },
    { name: "Terms & Conditions", path: "#" },
    { name: "FAQ", path: "#" },
    { name: "Support", path: "mailto:support@Ace!Mind.com" },
  ];

  const socialLinks = [
    { icon: "📘", url: "https://facebook.com", label: "Facebook" },
    { icon: "📷", url: "https://instagram.com", label: "Instagram" },
    { icon: "🐦", url: "https://twitter.com", label: "Twitter" },
    { icon: "🎥", url: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <img src={imageAce} alt="Logo" className="h-30 w-auto" />
          </Link>
          <p className="mt-3 text-gray-200 leading-relaxed">
            Learn with us — we provide best courses, tutorials, and learning resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className="hover:text-yellow-300 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Important */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Important</h3>
          <ul className="space-y-2">
            {importantLinks.map((link) => (
              <li key={link.name}>
                {link.path.startsWith("mailto") ? (
                  <a 
                    href={link.path}
                    className="hover:text-yellow-300 transition"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    to={link.path}
                    className="hover:text-yellow-300 transition"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform cursor-pointer"
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className="mt-4 text-gray-200">Email: ag86898138@gmail.com</p>
          <p className="text-gray-200">Phone: +91 8689813842</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/20 pt-5 text-center text-gray-200 text-sm">
        © {new Date().getFullYear()} Your Logo — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
