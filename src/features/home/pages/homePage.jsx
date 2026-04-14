export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#F8F8FF] text-[#1F2937]">

      {/* HERO */}
      <section className="px-6 pt-24 pb-20 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl font-semibold tracking-tight mb-4">
          Discover. Bid. Win.
        </h1>

        <p className="text-[16px] text-[#6B7280] mb-8 leading-7 max-w-xl mx-auto">
          Join live auctions, compete in real-time, and win exclusive items at the best price.
        </p>

        {/* Search */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg relative">
            <input
              placeholder="Search auctions, items, categories..."
              className="w-full px-5 py-3 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#2563EB] transition"
            />
          </div>
        </div>
      </section>

      {/* TRENDING AUCTIONS */}
      <section className="px-6 pb-16 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Live Auctions</h2>

          <button className="text-sm text-[#2563EB] hover:underline">
            View all
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="h-40 bg-[#E5E7EB] relative">

                {/* LIVE BADGE */}
                <span className="absolute top-3 left-3 text-[11px] px-2 py-1 bg-[#C2410C] text-white rounded">
                  LIVE
                </span>

              </div>

              <div className="p-4">

                {/* Title */}
                <h3 className="text-[15px] font-medium mb-1 group-hover:text-[#2563EB] transition">
                  Premium Item #{item}
                </h3>

                {/* Price */}
                <p className="text-sm text-[#6B7280]">
                  Current Bid
                </p>

                <p className="text-lg font-semibold text-[#1F2937]">
                  ₹{item * 1200}
                </p>

                {/* Timer */}
                <p className="text-xs text-[#6B7280] mt-1">
                  Ends in 02h 15m
                </p>

                {/* Button */}
                <button className="mt-4 w-full bg-[#C2410C] text-white py-2 text-sm rounded-lg hover:opacity-90 transition">
                  Place Bid
                </button>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 pb-16 max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-semibold mb-8">Browse Categories</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {["Electronics", "Fashion", "Vehicles", "Home", "Collectibles", "Sports"].map((cat) => (
            <div
              key={cat}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 text-center hover:border-[#2563EB] hover:shadow-sm transition cursor-pointer"
            >
              <p className="text-sm font-medium">{cat}</p>
            </div>
          ))}

        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="px-6 pb-20 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              title: "Real-time Bidding",
              desc: "Place bids instantly and compete with others live.",
            },
            {
              title: "Secure Payments",
              desc: "Safe and reliable transactions powered by Razorpay.",
            },
            {
              title: "Wide Categories",
              desc: "Explore items across multiple categories.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[#6B7280] leading-6">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 text-center">
        <div className="max-w-xl mx-auto">

          <h2 className="text-2xl font-semibold mb-3">
            Start selling your items today
          </h2>

          <p className="text-[15px] text-[#6B7280] mb-6">
            Create your own auction and connect with thousands of buyers instantly.
          </p>

          <button className="px-7 py-3 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition">
            Create Auction
          </button>

        </div>
      </section>

    </div>
  );
}