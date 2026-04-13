export default function Homepage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Hero */}
            <section className="px-6 py-16 text-center">
                <h2 className="text-3xl font-bold mb-3">Bid Smart. Win Big.</h2>
                <p className="text-gray-600 mb-6">Discover items and win auctions easily.</p>

                <input
                    placeholder="Search items..."
                    className="w-full max-w-md mx-auto px-4 py-2 border rounded-lg outline-none"
                />
            </section>

            {/* Auctions */}
            <section className="px-6 py-10">
                <h3 className="text-xl font-semibold mb-4">Trending Auctions</h3>

                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white p-4 rounded-lg shadow">
                            <div className="h-32 bg-gray-200 rounded mb-3" />
                            <h4 className="font-medium">Item #{item}</h4>
                            <p className="text-sm text-gray-500">₹{item * 500}</p>
                            <button className="mt-2 w-full bg-black text-white py-1 rounded">
                                Bid
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="px-6 py-10">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Electronics", "Fashion", "Vehicles", "Others"].map((cat) => (
                        <div key={cat} className="bg-white p-4 text-center rounded shadow">
                            {cat}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
