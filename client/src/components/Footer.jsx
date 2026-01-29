const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            RealEstate Market
          </h2>
          <p className="text-sm leading-relaxed">
            Your trusted platform to buy, sell, and rent properties with ease.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-sky-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/listings" className="hover:text-sky-400 transition">
                Listings
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-sky-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-sky-400 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@realestatemarket.com</li>
            <li>Phone: +251 900 000 000</li>
            <li>Addis Ababa, Ethiopia</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} RealEstate Market. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
