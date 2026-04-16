import React from "react";

const dummyItems = [
    {
        id: 1,
        title: "iPhone 14 Pro",
        price: "₹75,000",
        bids: 12,
        timeLeft: "2h 15m",
        image: "https://source.unsplash.com/400x300/?iphone",
    },
    {
        id: 2,
        title: "Gaming Laptop",
        price: "₹55,000",
        bids: 8,
        timeLeft: "5h 40m",
        image: "https://source.unsplash.com/400x300/?laptop",
    },
    {
        id: 3,
        title: "Sneakers Limited Edition",
        price: "₹8,000",
        bids: 20,
        timeLeft: "1h 10m",
        image: "https://source.unsplash.com/400x300/?shoes",
    },
];

export default function Explore() {
    return (
        <div className="min-h-screen bg-[#F8F8FF] px-6 py-10">
            {/* Header */}
            <h1 className="text-3xl font-semibold text-[#1F2937] mb-8">Explore Auctions</h1>

            {/* Section - Trending */}
            <div className="mb-10">
                <h2 className="text-xl font-medium mb-4 text-[#2563EB]">🔥 Trending Now</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {dummyItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-4">
                                <h3 className="font-medium text-lg mb-1">{item.title}</h3>

                                <p className="text-[#C2410C] font-semibold">
                                    Current Bid: {item.price}
                                </p>

                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>{item.bids} bids</span>
                                    <span>{item.timeLeft} left</span>
                                </div>

                                <button className="mt-4 w-full bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1D4ED8] transition">
                                    Place Bid
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section - Ending Soon */}
            <div>
                <h2 className="text-xl font-medium mb-4 text-[#C2410C]">⏳ Ending Soon</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {dummyItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-4">
                                <h3 className="font-medium text-lg mb-1">{item.title}</h3>

                                <p className="text-[#C2410C] font-semibold">{item.price}</p>

                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>{item.bids} bids</span>
                                    <span className="text-red-500 font-medium">
                                        {item.timeLeft}
                                    </span>
                                </div>

                                <button className="mt-4 w-full border border-[#2563EB] text-[#2563EB] py-2 rounded-lg hover:bg-[#2563EB] hover:text-white transition">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
