import { useMemo, useState } from "react";
import {
  Search,
  Shield,
  Gavel,
  CreditCard,
  Truck,
  User,
  ChevronDown,
  Mail,
  BookOpen,
  ArrowUpRight,
  FileText,
  Clock,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  {
    icon: Gavel,
    title: "Bidding & Auctions",
    desc: "Live auctions, bids, reserve prices, winning process.",
    count: 18,
    hot: true,
  },
  {
    icon: User,
    title: "Selling on Auctify",
    desc: "Create listings, manage auctions, upload products.",
    count: 22,
    hot: false,
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    desc: "Secure checkout, refunds, seller payouts.",
    count: 15,
    hot: false,
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    desc: "Tracking orders, delivery issues, returns.",
    count: 12,
    hot: false,
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    desc: "Verification, scams, account protection.",
    count: 9,
    hot: false,
  },
  {
    icon: BookOpen,
    title: "Policies",
    desc: "Marketplace rules, prohibited items, fees.",
    count: 11,
    hot: false,
  },
];

const FAQS = [
  {
    q: "How do I place a bid?",
    a: "Open a live auction, enter your bid amount above the current highest bid, and confirm. If you are the highest bidder when the timer reaches zero, you win and receive a notification to complete payment.",
    tag: "Bidding",
    tagCls: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    q: "How do I sell an item?",
    a: "Go to Seller Dashboard and click Create Auction. Add a title, images, starting price, and duration, then publish. Your listing goes live immediately.",
    tag: "Selling",
    tagCls: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    q: "When do sellers get paid?",
    a: "Seller payouts are initiated within 2 business days after the buyer confirms delivery. Funds typically arrive within 3–5 business days depending on your bank.",
    tag: "Payments",
    tagCls: "bg-orange-50 text-orange-600 border border-orange-100",
  },
  {
    q: "Can I cancel a bid?",
    a: "Bid cancellation is only permitted in specific circumstances and must be approved by support. Some auctions explicitly prohibit cancellations. Contact us with your bid ID to request a review.",
    tag: "Bidding",
    tagCls: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    q: "How are disputes handled?",
    a: "Our support team collects evidence from both parties — messages, transaction records, and shipping details — before reaching a decision. Most disputes resolve within 5 business days.",
    tag: "Safety",
    tagCls: "bg-purple-50 text-purple-600 border border-purple-100",
  },
  {
    q: "Is payment secure?",
    a: "Yes. All transactions are end-to-end encrypted and processed through PCI-compliant payment providers. Auctify never stores your full card details on our servers.",
    tag: "Payments",
    tagCls: "bg-orange-50 text-orange-600 border border-orange-100",
  },
];

const SUPPORT = [
  {
    icon: Mail,
    title: "Email Support",
    desc: "Send a message and we'll respond within 2 hours on business days.",
    badge: "~2 hr response",
    badgeCls: "bg-blue-50 text-blue-600 border border-blue-100",
    iconBg: "bg-blue-50",
    cta: "Send email",
  },
  {
    icon: FileText,
    title: "Submit a Ticket",
    desc: "For disputes, refunds, or account issues that need documentation.",
    badge: "Tracked & logged",
    badgeCls: "bg-slate-100 text-slate-500 border border-slate-200",
    iconBg: "bg-slate-50",
    cta: "Open ticket",
  },
  {
    icon: CheckCircle2,
    title: "Report an Issue",
    desc: "Flag a fraudulent listing, suspicious bidder, or policy violation.",
    badge: "Priority review",
    badgeCls: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    iconBg: "bg-emerald-50",
    cta: "File report",
  },
  {
    icon: Clock,
    title: "Track Your Ticket",
    desc: "Already submitted a request? Check its status and resolution time.",
    badge: "No login needed",
    badgeCls: "bg-amber-50 text-amber-600 border border-amber-100",
    iconBg: "bg-amber-50",
    cta: "Check status",
  },
];

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 160 }}
      className={`border rounded-2xl overflow-hidden bg-white transition-colors duration-200 ${
        open ? "border-blue-200" : "border-[#E5E7EB]"
      }`}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${item.tagCls}`}>
            {item.tag}
          </span>
          <span className="text-sm font-semibold text-[#1F2937] leading-snug">
            {item.q}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#6B7280] flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 pt-4 text-sm text-[#6B7280] leading-7 border-t border-[#E5E7EB]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HelpCenter() {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(
    () =>
      FAQS.filter(
        (f) =>
          f.q.toLowerCase().includes(query.toLowerCase()) ||
          f.a.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="min-h-screen bg-[#F8F8FF] text-[#1F2937]">

      {/* ── HERO ── */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* left */}
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-4 h-px bg-[#2563EB]" />
                <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">
                  Auctify Support
                </span>
                <span className="w-4 h-px bg-[#2563EB]" />
              </div>

              <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-4">
                How can we{" "}
                <span className="text-[#2563EB]">help you?</span>
              </h1>

              <p className="text-[#6B7280] text-lg mt-3 max-w-xl leading-relaxed mb-8">
                Find answers about bidding, selling, payments, shipping, and
                keeping your account secure.
              </p>

              <div className="relative max-w-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search help articles..."
                  className="w-full h-14 pl-14 pr-5 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#2563EB] text-sm transition-all"
                />
              </div>

              <p className="text-xs text-[#6B7280] mt-3">
                Popular:{" "}
                <button
                  onClick={() => setQuery("bid")}
                  className="font-semibold text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  place a bid
                </button>
                {" · "}
                <button
                  onClick={() => setQuery("payout")}
                  className="font-semibold text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  seller payout
                </button>
                {" · "}
                <button
                  onClick={() => setQuery("dispute")}
                  className="font-semibold text-[#1F2937] hover:text-[#2563EB] transition-colors"
                >
                  dispute
                </button>
              </p>
            </div>

            {/* right stats */}
            <div className="hidden lg:flex flex-col gap-3">
              {[
                { val: "120+", lbl: "Help articles published", icon: BookOpen },
                { val: "< 2 hrs", lbl: "Average support response time", icon: Clock },
                { val: "98%", lbl: "Customer satisfaction rate", icon: CheckCircle2 },
              ].map(({ val, lbl, icon: Icon }) => (
                <div
                  key={lbl}
                  className="flex items-center gap-4 bg-[#F8F8FF] border border-[#E5E7EB] rounded-2xl px-5 py-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#2563EB]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#1F2937] leading-none">
                      {val}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-xs uppercase tracking-widest font-bold text-[#6B7280] mb-2">
          Browse by topic
        </p>
        <h2 className="text-2xl font-semibold text-[#1F2937] mb-8">
          Support Categories
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 cursor-pointer hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.8} />
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.hot && (
                      <span className="text-[10px] font-bold bg-[#2563EB] text-white px-2.5 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-[#E5E7EB] group-hover:text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-6 mb-4">
                  {cat.desc}
                </p>
                <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                  {cat.count} articles
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#6B7280] mb-2">
              Quick answers
            </p>
            <h2 className="text-2xl font-semibold text-[#1F2937]">
              Popular Questions
            </h2>
          </div>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-sm font-semibold text-[#2563EB] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, i) => (
              <FaqItem key={i} item={item} index={i} />
            ))
          ) : (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-8 py-12 text-center">
              <p className="text-base font-semibold text-[#1F2937] mb-2">
                No results found
              </p>
              <p className="text-sm text-[#6B7280]">
                Try different keywords or browse the categories above.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── STILL NEED HELP ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] grid grid-cols-1 lg:grid-cols-[280px_1fr]">

          {/* blue left panel */}
          <div
            className="p-10 flex flex-col justify-between"
            style={{
              background: "linear-gradient(155deg,#1e40af 0%,#2563eb 50%,#4f46e5 100%)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Headphones className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="text-2xl font-semibold text-white leading-snug mb-3">
                Still need help?
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Our support team handles urgent auction and account issues.
                Choose the channel that works best for you.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs text-white/50 font-medium">
                Mon – Sat, 9 am – 7 pm IST
              </span>
            </div>
          </div>

          {/* right options */}
          <div className="bg-white p-8 grid sm:grid-cols-2 gap-4 content-center">
            {SUPPORT.map((opt) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={opt.title}
                  whileHover={{ y: -2 }}
                  className="group border border-[#E5E7EB] rounded-2xl p-5 cursor-pointer hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200 flex flex-col"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${opt.iconBg} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-5 h-5 text-[#2563EB]" strokeWidth={1.8} />
                  </div>
                  <div className="text-base font-semibold text-[#1F2937] mb-1">
                    {opt.title}
                  </div>
                  <div className="text-sm text-[#6B7280] leading-6 mb-4 flex-1">
                    {opt.desc}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${opt.badgeCls}`}>
                      {opt.badge}
                    </span>
                    <span className="text-xs font-bold text-[#2563EB] group-hover:underline">
                      {opt.cta} →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}