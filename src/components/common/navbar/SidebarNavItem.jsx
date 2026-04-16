import { NavLink } from "react-router-dom";

export default function SidebarNavItem({ to, children, onClick, highlight = false }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    highlight
                        ? "text-[#C2410C] hover:bg-[#C2410C]/5"
                        : "text-[#1F2937] hover:bg-[#F8F8FF] hover:text-[#2563EB]"
                } ${isActive ? "bg-[#2563EB]/10 text-[#2563EB]" : ""}`
            }
        >
            {children}
        </NavLink>
    );
}
