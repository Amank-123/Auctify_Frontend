import React from "react";

const watchlistItems = [
    {
        id: 1,
        title: "Apple Watch Series 9",
        price: "₹25,000",
        status: "Winning",
        timeLeft: "3h 20m",
        image: "https://source.unsplash.com/400x300/?watch",
    },
    {
        id: 2,
        title: "DSLR Camera",
        price: "₹40,000",
        status: "Outbid",
        timeLeft: "6h 10m",
        image: "https://source.unsplash.com/400x300/?camera",
    },
];

export default function Watchlist() {
    return (
        <div className="min-h-screen bg-[#F8F8FF] px-6 py-10">
            <h1 className="text-3xl font-semibold text-[#1F2937] mb-8">Your Watchlist</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {watchlistItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition flex overflow-hidden"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-40 h-full object-cover"
                        />

                        <div className="p-4 flex flex-col justify-between w-full">
                            <div>
                                <h3 className="font-medium text-lg">{item.title}</h3>

                                <p className="text-[#C2410C] font-semibold mt-1">{item.price}</p>

                                <p className="text-sm text-gray-500 mt-1">{item.timeLeft} left</p>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span
                                    className={`text-sm font-medium ${
                                        item.status === "Winning"
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {item.status}
                                </span>

                                <button className="text-sm text-gray-500 hover:text-red-500">
                                    Remove
                                </button>
                            </div>

                            <button className="mt-3 bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1D4ED8] transition">
                                View Auction
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
