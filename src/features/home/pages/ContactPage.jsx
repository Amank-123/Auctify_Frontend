import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);

    // connect your backend here
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] text-[#1F2937]">
      {/* HERO */}
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-[#2563EB] border border-blue-100">
              Auctify Support
            </span>

            <h1 className="text-5xl font-bold tracking-tight mt-5">
              Contact Us
            </h1>

            <p className="text-[#6B7280] text-lg mt-3 max-w-2xl">
              Need help with auctions, bidding, payments, or your account?
              Reach out and our support team will get back to you quickly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT INFO */}
          <div className="space-y-5">
            {/* Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#2563EB]" />
              </div>

              <h3 className="text-lg font-semibold mt-4">Email Support</h3>

              <p className="text-[#6B7280] mt-2 text-sm leading-6">
                Send us your issue anytime and we'll respond as soon as
                possible.
              </p>

              <p className="mt-4 font-medium">support@auctify.com</p>
            </div>

            {/* Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#C2410C]" />
              </div>

              <h3 className="text-lg font-semibold mt-4">Call Us</h3>

              <p className="text-[#6B7280] mt-2 text-sm">
                Mon - Sat, 9:00 AM to 7:00 PM
              </p>

              <p className="mt-4 font-medium">+91 98765 43210</p>
            </div>

            {/* Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#2563EB]" />
              </div>

              <h3 className="text-lg font-semibold mt-4">Office</h3>

              <p className="text-[#6B7280] mt-2 text-sm leading-6">
                Lucknow, Uttar Pradesh, India
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-3xl p-8">
            <h2 className="text-2xl font-semibold">Send us a message</h2>

            <p className="text-[#6B7280] mt-2">
              Fill the form below and our team will contact you shortly.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full h-12 px-4 rounded-xl border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full h-12 px-4 rounded-xl border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full h-12 px-4 rounded-xl border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Message
                </label>

                <textarea
                  rows="6"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* EXTRA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
            <MessageCircle className="text-[#2563EB]" />
            <h3 className="font-semibold mt-4">Live Chat</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Quick answers from our support team.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
            <Clock className="text-[#C2410C]" />
            <h3 className="font-semibold mt-4">Fast Response</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Average response time under 24 hours.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
            <ShieldCheck className="text-[#2563EB]" />
            <h3 className="font-semibold mt-4">Trusted Support</h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Secure assistance for payments and disputes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}