const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-[#1F2937]">
      <h1 className="text-3xl font-semibold mb-6">Terms & Conditions</h1>

      <p className="mb-4 text-sm text-[#6B7280]">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          These Terms & Conditions govern your use of Auctify. By using our platform, you agree to these terms.
        </p>

        <h2 className="text-lg font-medium mt-6">1. Use of Platform</h2>
        <p>
          You must be at least 18 years old to use this platform. You agree to provide accurate information and use the platform responsibly.
        </p>

        <h2 className="text-lg font-medium mt-6">2. Auctions and Bidding</h2>
        <p>
          All bids are binding. Once a bid is placed, it cannot be withdrawn. The highest valid bid at the end of the auction wins.
        </p>

        <h2 className="text-lg font-medium mt-6">3. Seller Responsibilities</h2>
        <p>
          Sellers must provide accurate product descriptions and are responsible for fulfilling transactions.
        </p>

        <h2 className="text-lg font-medium mt-6">4. Payments</h2>
        <p>
          Payments must be completed through approved methods. Failure to complete payment may result in account restrictions.
        </p>

        <h2 className="text-lg font-medium mt-6">5. Prohibited Activities</h2>
        <p>
          Users must not engage in fraudulent activities, manipulate bids, or misuse the platform.
        </p>

        <h2 className="text-lg font-medium mt-6">6. Account Suspension</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms.
        </p>

        <h2 className="text-lg font-medium mt-6">7. Limitation of Liability</h2>
        <p>
          Auctify acts as an intermediary platform and is not responsible for disputes between buyers and sellers.
        </p>

        <h2 className="text-lg font-medium mt-6">8. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the platform implies acceptance.
        </p>

        <h2 className="text-lg font-medium mt-6">9. Contact</h2>
        <p>
          For any concerns, contact support@auctify.com.
        </p>
      </section>
    </div>
  );
};

export default Terms;