import type { User } from "../../types";

export type Page =
  | "dashboard"
  | "batches"
  | "approvals"
  | "certificates"
  | "verification";

interface SidebarProps {
  user: User;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({
  user,
  activePage,
  onNavigate,
}: SidebarProps) {
  const menuItems: { id: Page; label: string; icon: string }[] =
    (() => {
      switch (user.role) {
        case "TRAINING_CENTRE":
          return [
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "▦",
            },
            {
              id: "batches",
              label: "My Batches",
              icon: "▤",
            },
          ];

        case "DISTRICT_OFFICER":
          return [
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "▦",
            },
            {
              id: "batches",
              label: "Batches",
              icon: "▤",
            },
            {
              id: "approvals",
              label: "District Approvals",
              icon: "✓",
            },
          ];

        case "QUALITY_OFFICER":
          return [
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "▦",
            },
            {
              id: "batches",
              label: "Batches",
              icon: "▤",
            },
            {
              id: "approvals",
              label: "Quality Review",
              icon: "✓",
            },
          ];

        case "STATE_OFFICER":
          return [
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "▦",
            },
            {
              id: "batches",
              label: "Batches",
              icon: "▤",
            },
            {
              id: "approvals",
              label: "State Approvals",
              icon: "✓",
            },
            {
              id: "certificates",
              label: "Certificates",
              icon: "♧",
            },
            {
              id: "verification",
              label: "Verification",
              icon: "⌕",
            },
          ];

        default:
          return [
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "▦",
            },
          ];
      }
    })();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✓</div>
        <h2>CertiFlow</h2>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="profile">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <strong>{user.name}</strong>
          <small>{user.role.replace(/_/g, " ")}</small>
        </div>
      </div>
    </aside>
  );
}