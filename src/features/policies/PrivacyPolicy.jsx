import { useEffect, useState } from "react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    subs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Auctify is a digital auction platform designed to enable users to participate in real-time bidding. We are committed to maintaining transparency and ensuring that users clearly understand how their data is collected and processed.",
      },
      {
        id: "scope",
        label: "Scope",
        content:
          "This policy applies to all users accessing the platform, including buyers, sellers, and visitors interacting with any part of the service.",
      },
    ],
  },

  {
    id: "information",
    title: "Information We Collect",
    subs: [
      {
        id: "personal",
        label: "Personal Information",
        content:
          "We collect personal details such as name, email address, and login credentials during account registration to identify users and provide access to platform features.",
      },
      {
        id: "usage",
        label: "Usage Data",
        content:
          "Usage data includes browsing activity, device type, IP address, and interaction logs used to improve performance and detect unusual activity.",
      },
      {
        id: "transaction",
        label: "Transaction Data",
        content:
          "We store information related to bids, purchases, and listings to maintain accurate auction records and ensure transparency.",
      },
    ],
  },

  {
    id: "usage-section",
    title: "How We Use Information",
    subs: [
      {
        id: "operations",
        label: "Platform Operations",
        content:
          "User data is used to manage auctions, process bids, and maintain system functionality.",
      },
      {
        id: "communication",
        label: "User Communication",
        content:
          "We may send notifications regarding bids, account activity, or important updates.",
      },
      {
        id: "improvement",
        label: "Service Improvement",
        content:
          "Data helps us analyze user behavior and continuously improve platform performance and features.",
      },
      {
        id: "security-monitoring",
        label: "Security Monitoring",
        content:
          "We monitor user activity to detect suspicious behavior and prevent fraud.",
      },
    ],
  },

  {
    id: "sharing",
    title: "Sharing of Information",
    subs: [
      {
        id: "thirdparty",
        label: "Third-Party Services",
        content:
          "We may share data with trusted third-party providers such as payment gateways and analytics tools.",
      },
      {
        id: "legal",
        label: "Legal Requirements",
        content:
          "We may disclose information if required by law or to protect the rights and safety of users.",
      },
    ],
  },

  {
    id: "cookies",
    title: "Cookies & Tracking",
    subs: [
      {
        id: "cookies-use",
        label: "How We Use Cookies",
        content:
          "Cookies help maintain session data and provide a consistent user experience.",
      },
      {
        id: "analytics",
        label: "Analytics",
        content:
          "We use analytics tools to understand user interactions and improve the platform.",
      },
      {
        id: "preferences",
        label: "User Preferences",
        content:
          "Cookies allow us to remember settings such as language and login sessions.",
      },
      {
        id: "control",
        label: "Managing Cookies",
        content:
          "Users can control cookie settings through their browser preferences.",
      },
    ],
  },

  {
    id: "retention",
    title: "Data Retention",
    subs: [
      {
        id: "duration",
        label: "Retention Period",
        content:
          "We retain user data only for as long as necessary to fulfill the purposes outlined in this policy.",
      },
    ],
  },

  {
    id: "rights",
    title: "User Rights",
    subs: [
      {
        id: "access",
        label: "Access to Data",
        content:
          "Users can request access to their personal data stored on the platform.",
      },
      {
        id: "update",
        label: "Data Updates",
        content:
          "Users can update their personal information through account settings.",
      },
      {
        id: "deletion",
        label: "Right to Deletion",
        content:
          "Users may request deletion of their data, subject to legal and operational constraints.",
      },
      {
        id: "restriction",
        label: "Restriction of Processing",
        content:
          "Users may request limitations on how their data is processed.",
      },
      {
        id: "portability",
        label: "Data Portability",
        content:
          "Users can request a copy of their data in a structured format.",
      },
    ],
  },

  {
    id: "security",
    title: "Security",
    subs: [
      {
        id: "protection",
        label: "Data Protection Measures",
        content:
          "We implement encryption, secure storage, and access controls to protect user data.",
      },
      {
        id: "limitations",
        label: "Limitations",
        content:
          "Despite our efforts, no system can guarantee absolute security. Users should safeguard their credentials.",
      },
    ],
  },

  {
    id: "children",
    title: "Children’s Privacy",
    subs: [
      {
        id: "age-limit",
        label: "Age Restriction",
        content:
          "Our platform is not intended for users under the age of 18. We do not knowingly collect data from minors.",
      },
    ],
  },

  {
    id: "changes",
    title: "Changes to This Policy",
    subs: [
      {
        id: "updates",
        label: "Policy Updates",
        content:
          "We may update this Privacy Policy periodically. Users will be notified of significant changes.",
      },
    ],
  },
];

const PrivacyPolicy = () => {
  const [active, setActive] = useState("");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      let current = "";

      const ids = sections.flatMap((s) => [
        s.id,
        ...s.subs.map((sub) => sub.id),
      ]);

      for (let id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 120 && rect.bottom >= 120) {
          current = id;
        }
      }

      if (current) setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#F8F8FF] min-h-screen">

      {/* HEADER */}
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-[1100px] mx-auto px-6 py-10 grid md:grid-cols-[240px_1fr] gap-12">

        {/* TOC */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <p className="text-xs font-medium text-[#6B7280] uppercase mb-4">
              Contents
            </p>

            <ul className="space-y-5 text-sm">
              {sections.map((sec, i) => (
                <li key={sec.id}>
                  <button
                    onClick={() => scrollTo(sec.id)}
                    className={`block ${
                      active === sec.id
                        ? "text-[#2563EB] underline"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {i + 1}. {sec.title}
                  </button>

                  <ul className="ml-4 mt-2 space-y-2 text-sm">
                    {sec.subs.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => scrollTo(sub.id)}
                          className={`block ${
                            active === sub.id
                              ? "text-[#2563EB] underline"
                              : "text-[#6B7280]"
                          }`}
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-16 text-[14px] leading-7">

          {sections.map((sec, i) => (
            <section key={sec.id} id={sec.id} className="border-l-2 border-[#E5E7EB] pl-6">

              <h2 className="text-lg font-semibold text-[#1F2937] mb-6">
                {i + 1}. {sec.title}
              </h2>

              <div className="space-y-8">
                {sec.subs.map((sub) => (
                  <div key={sub.id} id={sub.id}>

                    <h3 className="text-[15px] font-medium text-[#1F2937] mb-2">
                      {sub.label}
                    </h3>

                    <p className="text-[#6B7280]">
                      {sub.content}
                    </p>

                  </div>
                ))}
              </div>

            </section>
          ))}

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;