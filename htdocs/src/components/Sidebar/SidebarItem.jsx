import { useLocation, useNavigate } from "react-router-dom";

export default function SidebarItem({ Icon, label, path }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      className={`
        flex items-center gap-2 py-2 px-4 rounded-xl border cursor-pointer
        transition-all duration-200 transform
        ${isActive 
          ? "bg-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] border-[var(--color-primary)] scale-105"
          : "border-transparent hover:bg-[color-mix(in_srgb,var(--color-text-primary)_5%,transparent)] hover:scale-105"
        }
        animate-fade-in
      `}
    >
      {Icon && (
        <div className="flex-shrink-0 transition-transform duration-200">
          <Icon width={32} height={32} />
        </div>
      )}

      {/* Texto */}
      <span
        className={`px-2 py-1 rounded transition-colors duration-200 font-bold ${
          isActive ? "text-[var(--color-primary)]" : "theme-text"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
