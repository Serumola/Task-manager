import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./user-profile.css";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="user-menu-container">

      {/* TRIGGER */}
      <div
        className="user-menu-trigger"
        onClick={() => setOpen(!open)}
      >
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="user-avatar"
        />

        <span className="user-name">Michael Jordan</span>

        <ChevronDown
          size={16}
          className={`chevron ${open ? "rotate" : ""}`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="user-dropdown">
          <p>Profile</p>
          <p>Settings</p>
          <p className="logout">Logout</p>
        </div>
      )}

    </div>
  );
}