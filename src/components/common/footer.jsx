import { motion } from "framer-motion";
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
  <p className="mb-3.5 text-[13px] font-semibold text-[#1F2937]">
    {children}
  </p>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-[13px] text-[#6B7280] transition-all duration-150 hover:text-[#2563EB]"
    >
      {children}
    </a>
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
    <footer className="bg-[#F8F8FF] border-t border-[#E5E7EB] mt-20">
      <div className="max-w-[1700px] mx-auto px-6 pt-12 pb-6">

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-40">

          {/* LEFT */}
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="visible">
            <img
  src={logo}
  alt="Auctify Logo"
  className="h-20 w-auto pb-5"
/>

            <p className="text-sm text-[#6B7280] leading-relaxed max-w-[240px]">
              A real-time auction platform enabling seamless buying and selling through competitive bidding.
            </p>

            {/* Social */}
            <div className="flex gap-2 mt-5">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">

            {/* Product */}
            <motion.div variants={fadeUp(0.05)} initial="hidden" whileInView="visible">
              <ColHead>Product</ColHead>
              <ul className="space-y-2">
                <FooterLink href="/auctions">Live Auctions</FooterLink>
                <FooterLink href="/categories">Categories</FooterLink>
                <FooterLink href="/create-auction">Create Auction</FooterLink>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
              </ul>
            </motion.div>

            {/* Sell */}
            <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="visible">
              <ColHead>Sell</ColHead>
              <ul className="space-y-2">
                <FooterLink href="/seller-guide">How to Sell</FooterLink>
                <FooterLink href="/my-auctions">My Listings</FooterLink>
                <FooterLink href="/analytics">Analytics</FooterLink>
                <FooterLink href="/fees">Fees & Payments</FooterLink>
              </ul>
            </motion.div>

            {/* Account */}
            <motion.div variants={fadeUp(0.15)} initial="hidden" whileInView="visible">
              <ColHead>Account</ColHead>
              <ul className="space-y-2">
                <FooterLink href="/profile">Profile</FooterLink>
                <FooterLink href="/bids">My Bids</FooterLink>
                <FooterLink href="/watchlist">Watchlist</FooterLink>
                <FooterLink href="/login">Sign In</FooterLink>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={fadeUp(0.2)} initial="hidden" whileInView="visible">
              <ColHead>Support</ColHead>
              <ul className="space-y-2">
                <FooterLink href="/support">Help Center</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
              </ul>
            </motion.div>

          </div>
        </div>

        {/* Divider */}
        <hr className="mt-10 border-[#E5E7EB]" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#6B7280] mt-4">
          <span>© {new Date().getFullYear()} Auctify. All rights reserved.</span>

          <div className="flex gap-5 mt-2 md:mt-0">
            <a href="/privacy" className="hover:text-[#2563EB]">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#2563EB]">Terms</a>
            <a href="/cookies" className="hover:text-[#2563EB]">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;