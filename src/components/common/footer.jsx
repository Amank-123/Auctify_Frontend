import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay },
  },
});

const ColHead = ({ children }) => (
  <p className="mb-3 text-[14px] font-semibold text-[#1F2937]">
    {children}
  </p>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-[14px] text-[#6B7280] transition hover:text-[#2563EB]"
    >
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ children }) => (
  <motion.div
    className="flex h-8 w-8 items-center justify-center text-[#6B7280] hover:text-[#2563EB] cursor-pointer"
    whileHover={{ y: -2 }}
  >
    {children}
  </motion.div>
);

const Footer = () => {
  return (
    <footer className="bg-[#F8F8FF] border-t border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 py-12">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 md:gap-20">

          {/* LEFT */}
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="visible">
            <img src={logo} alt="Auctify Logo" className="h-16 w-auto mb-4" />

            <p className="text-[14px] text-[#6B7280] leading-6 max-w-[260px]">
              A real-time auction platform enabling seamless buying and selling through competitive bidding.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-5">
              <SocialBtn>
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308..." />
                </svg>
              </SocialBtn>
              <SocialBtn>
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M9 19c-5 1.5..." />
                </svg>
              </SocialBtn>
              <SocialBtn>
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M20.447 20.452..." />
                </svg>
              </SocialBtn>
            </div>
          </motion.div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">

            {/* Product */}
            <motion.div variants={fadeUp(0.05)} initial="hidden" whileInView="visible">
              <ColHead>Product</ColHead>
              <ul className="space-y-2">
                <FooterLink to="/auctions">Live Auctions</FooterLink>
                <FooterLink to="/categories">Categories</FooterLink>
                <FooterLink to="/create-auction">Create Auction</FooterLink>
                <FooterLink to="/dashboard">Dashboard</FooterLink>
              </ul>
            </motion.div>

            {/* Sell */}
            <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="visible">
              <ColHead>Sell</ColHead>
              <ul className="space-y-2">
                <FooterLink to="/seller-guide">How to Sell</FooterLink>
                <FooterLink to="/my-auctions">My Listings</FooterLink>
                <FooterLink to="/analytics">Analytics</FooterLink>
                <FooterLink to="/fees">Fees & Payments</FooterLink>
              </ul>
            </motion.div>

            {/* Account */}
            <motion.div variants={fadeUp(0.15)} initial="hidden" whileInView="visible">
              <ColHead>Account</ColHead>
              <ul className="space-y-2">
                <FooterLink to="/profile">Profile</FooterLink>
                <FooterLink to="/bids">My Bids</FooterLink>
                <FooterLink to="/watchlist">Watchlist</FooterLink>
                <FooterLink to="/login">Sign In</FooterLink>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={fadeUp(0.2)} initial="hidden" whileInView="visible">
              <ColHead>Support</ColHead>
              <ul className="space-y-2">
                <FooterLink to="/support">Help Center</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/terms">Terms</FooterLink>
                <FooterLink to="/privacy">Privacy</FooterLink>
              </ul>
            </motion.div>

          </div>
        </div>

        {/* DIVIDER */}
        <hr className="mt-10 border-[#E5E7EB]" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] text-[#6B7280] mt-6">

          <span className="text-center md:text-left">
            © {new Date().getFullYear()} Auctify. All rights reserved.
          </span>

          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link to="/privacy" className="hover:text-[#2563EB]">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-[#2563EB]">
              Terms
            </Link>

            <Link to="/cookies" className="hover:text-[#2563EB]">
              Cookies
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;