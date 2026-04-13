const Footer = () => {
  return (
   <footer className="bg-gray-900 text-gray-300 mt-10">
  <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* Brand */}
    <div>
      <h2 className="text-xl font-semibold text-white">Auctify</h2>
      <p className="text-sm mt-2">
        Real-time auction platform where users can bid, win, and explore deals.
      </p>
    </div>

    {/* Links */}
    <div>
      <h3 className="text-white font-medium mb-2">Quick Links</h3>
      <ul className="space-y-1 text-sm">
        <li><a href="/" className="hover:text-white">Home</a></li>
        <li><a href="/auction" className="hover:text-white">Auctions</a></li>
        <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
        <li><a href="/profile" className="hover:text-white">Profile</a></li>
      </ul>
    </div>

    {/* Contact / Info */}
    <div>
      <h3 className="text-white font-medium mb-2">Contact</h3>
      <p className="text-sm">support@bidzone.com</p>
      <p className="text-sm mt-1">+91 98765 43210</p>
    </div>

  </div>

  {/* Bottom */}
  <div className="border-t border-gray-800 text-center py-4 text-sm">
    © {new Date().getFullYear()} BidZone. All rights reserved.
  </div>
</footer>
  );
};

export default Footer;