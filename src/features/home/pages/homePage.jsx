import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { useAuth } from "@/hooks/useAuth";

const fmtINR = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS = {
  active: { label: "● Live",  cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  draft:  { label: "Draft",   cls: "bg-zinc-100  text-zinc-500   border border-zinc-200" },
  ended:  { label: "Ended",   cls: "bg-orange-50 text-orange-600 border border-orange-200" },
};

/* ── animated counter ── */
function Counter({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      setV(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <>{v}</>;
}

/* ── live countdown (static demo) ── */
function LiveTimer({ status }) {
  if (status !== "active") return null;
  return (
    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-md">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      Ends soon
    </div>
  );
}

/* ── filter pill ── */
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 border ${
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
      }`}
    >
      {label}
    </button>
  );
}

/* ── auction card ── */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

function AuctionCard({ item, isOwner, index }) {
  const cfg = STATUS[item.status] || STATUS.draft;
  const price = item.currentHighestBid || item.startPrice;
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 140 }}
      whileHover={{ y: -4 }}
      className="group bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col transition-colors duration-200"
    >
      {/* image */}
      <div className="relative h-40 bg-zinc-100 overflow-hidden flex-shrink-0">
        {!imgErr ? (
          <img
            src={item.media?.[0]}
            alt={item.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-medium px-2.5 py-1 rounded-full ${cfg.cls}`}>
          {cfg.label}
        </span>
        <LiveTimer status={item.status} />
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-sm font-medium text-zinc-900 leading-snug line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-0.5">
              {item.status === "active" ? "Current bid" : "Starting price"}
            </p>
            <p className="text-xl font-bold text-zinc-900 font-serif leading-none">{fmtINR(price)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-zinc-900">{item.bidCount ?? 0}</p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">bids</p>
          </div>
        </div>

        {/* cta */}
        {isOwner ? (
          <button className="w-full py-2.5 rounded-xl text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors">
            Manage auction
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors"
          >
            Place bid
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ── skeleton ── */
function CardSkeleton() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-zinc-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-zinc-100 rounded w-3/4" />
        <div className="h-3 bg-zinc-100 rounded w-1/2" />
        <div className="h-8 bg-zinc-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

/* ── section ── */
function Section({ title, seeAll, children }) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-14">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-serif text-2xl font-bold text-zinc-900">{title}</h2>
        {seeAll && (
          <button onClick={seeAll} className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-700 transition-colors">
            See all
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

/* ══════════════════════════════════
   MAIN
══════════════════════════════════ */
export default function Homepage() {
  const { User } = useAuth();
  const [auctions, setAuctions]   = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          api.get(API_ENDPOINTS.Auction.GET_ALL),
          User ? api.get(API_ENDPOINTS.Auction.GET_BY_SELLER) : Promise.resolve(null),
        ]);
        setAuctions(allRes.data.data || []);
        if (myRes) setMyAuctions(myRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [User]);

  const filtered = auctions
    .filter(a => filter === "all" || a.status === filter)
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    live:  auctions.filter(a => a.status === "active").length,
    total: auctions.length,
    bids:  auctions.reduce((s, a) => s + (a.bidCount || 0), 0),
  };

  const FILTERS = ["all", "active", "draft", "ended"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        body, * { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        @keyframes live-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .live-blink { animation: live-pulse 1.6s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-zinc-50">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border-b border-zinc-100 text-center px-6 pt-14 pb-12"
        >
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-blink" />
            Live bidding open now
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
            className="font-serif text-5xl md:text-6xl font-black text-zinc-900 leading-[1.06] tracking-tight mb-4"
          >
            Discover. Bid.{" "}
            <em className="text-orange-600 not-italic">Win.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="text-zinc-500 text-base max-w-sm mx-auto leading-relaxed mb-8"
          >
            Real-time auctions where every second counts. Find rare items and place your bid before someone else does.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <button
              onClick={() => listRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="bg-zinc-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Browse auctions
            </button>
            <button className="border border-zinc-200 hover:border-zinc-400 text-zinc-600 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
              How it works
            </button>
          </motion.div>

          {/* stats row */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-10 mt-10 pt-8 border-t border-zinc-100"
            >
              {[
                { label: "Live now",    val: stats.live },
                { label: "Total",       val: stats.total },
                { label: "Bids placed", val: stats.bids },
              ].map(({ label, val }, i) => (
                <div key={label} className="text-center">
                  <p className="font-serif text-3xl font-black text-zinc-900">
                    <Counter to={val} />
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="pt-12" ref={listRef}>

          {/* ── LIVE AUCTIONS ── */}
          <Section
            title="Live auctions"
            seeAll={() => setFilter("active")}
          >
            {/* search */}
            <input
              type="text"
              placeholder="Search auctions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 bg-white text-zinc-900 placeholder-zinc-400"
            />

            {/* filters */}
            <div className="flex gap-2 flex-wrap mb-6">
              {FILTERS.map((f) => (
                <FilterPill
                  key={f}
                  label={f === "all" ? "All" : f === "active" ? "Live" : f.charAt(0).toUpperCase() + f.slice(1)}
                  active={filter === f}
                  onClick={() => setFilter(f)}
                />
              ))}
            </div>

            {/* grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-2xl">
                No auctions found.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                >
                  {filtered.map((item, i) => (
                    <AuctionCard key={item._id} item={item} index={i} isOwner={false} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </Section>

          {/* ── MY AUCTIONS ── */}
          {User && myAuctions.length > 0 && (
            <Section title="Your auctions">
              <motion.div
                className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              >
                {myAuctions.map((item, i) => (
                  <AuctionCard key={item._id} item={item} index={i} isOwner />
                ))}
              </motion.div>
            </Section>
          )}

        </div>
      </div>
    </>
  );
}