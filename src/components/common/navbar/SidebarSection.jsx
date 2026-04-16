export default function SidebarSection({ title, children }) {
    return (
        <section className="mb-5">
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                {title}
            </div>
            <div className="space-y-1">{children}</div>
        </section>
    );
}
