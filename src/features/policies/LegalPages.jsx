import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LegalPage = ({ title, description, sections }) => {
  const [active, setActive] = useState("");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -100;
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

        if (rect.top <= 150 && rect.bottom >= 150) {
          current = id;
        }
      }

      if (current) setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen pb-30">

  <div className="relative bg-[#F8F8FF] overflow-hidden">

  {/* GRADIENT HERO */}
  <div className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white shadow-md">

    <div className="max-w-[1400px] mx-auto px-8 py-24 text-center">

      <h1 className="text-4xl font-semibold tracking-tight">
        {title}
      </h1>

      <p className="text-[15px] text-blue-100 mt-3 pb-5">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      

    </div>

    {/* CURVE (FIXED COLOR) */}
    <div className="absolute bottom-[-80px] left-0 w-full h-[160px] bg-[#FFFFFF] rounded-t-[100%]" />

  </div>

</div>

      {/* MAIN */}
      <div className="max-w-[1400px] mx-auto px-8 py-12 grid md:grid-cols-[260px_1fr] gap-16">

        {/* TOC */}
        <div className="hidden md:block">
          <div className="sticky top-28">
            <p className="text-xs font-medium text-[#6B7280] uppercase mb-5">
              Contents
            </p>

            <ul className="space-y-5">
              {sections.map((sec, i) => (
                <li key={sec.id}>
                  <button
                    onClick={() => scrollTo(sec.id)}
                    className={`block text-left text-sm ${
                      active === sec.id
                        ? "text-[#2563EB] font-medium"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {i + 1}. {sec.title}
                  </button>

                  <ul className="ml-4 mt-2 space-y-2">
                    {sec.subs.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => scrollTo(sub.id)}
                          className={`block text-sm ${
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
        <div className="space-y-20 text-[15px] leading-7">

      {/* INFO BOX */}
{description && (
  <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-6">
    <p className="text-[#1F2937] text-[15px] leading-7">
      {description}
    </p>
  </div>
)}

          {sections.map((sec, i) => (
            <section
              key={sec.id}
              id={sec.id}
              className={`pl-6 border-l-2 ${
                active === sec.id
                  ? "border-[#2563EB]"
                  : "border-[#E5E7EB]"
              }`}
            >
              <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
                {i + 1}. {sec.title}
              </h2>

              <div className="space-y-8">
                {sec.subs.map((sub) => (
                  <div key={sub.id} id={sub.id}>
                    <h3 className="text-base font-medium text-[#1F2937] mb-2">
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

export default LegalPage;