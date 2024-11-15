import React, { useState, useEffect } from "react";
import { Icon } from "@/components/icons.component";

// Types for props
interface SidebarItemProps {
  name: string;
  icon: string;
}

interface DropdownItem {
  name: string;
  icon?: string;
}

interface SidebarState {
  isProfileDropdownOpen: boolean;
  isMoreDropdownOpen: boolean;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isProfileDropdownOpen: false,
    isMoreDropdownOpen: false,
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user-storage");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load sidebar state from localStorage
    const storedSidebarState = localStorage.getItem("user-storage");
    if (storedSidebarState) {
      setSidebarState(JSON.parse(storedSidebarState));
    }
  }, []);

  useEffect(() => {
    // Save sidebar state to localStorage whenever it changes
    localStorage.setItem("sidebarState", JSON.stringify(sidebarState));
  }, [sidebarState]);

  const toggleProfileDropdown = () => {
    setSidebarState((prev) => ({
      ...prev,
      isProfileDropdownOpen: !prev.isProfileDropdownOpen,
    }));
  };

  const toggleMoreDropdown = () => {
    setSidebarState((prev) => ({
      ...prev,
      isMoreDropdownOpen: !prev.isMoreDropdownOpen,
    }));
  };

  // Sidebar items configuration
  const sidebarItems: SidebarItemProps[] = [
    { name: "Courses", icon: "book-open" },
    { name: "Batches", icon: "users" },
    { name: "Jobs", icon: "briefcase" },
    { name: "Statistics", icon: "trending-up" },
  ];

  const moreItems: SidebarItemProps[] = [
    { name: "Code Cloud", icon: "cloud-lightning" },
    { name: "Terms of Certification", icon: "file-text" },
    { name: "Terms of Use", icon: "circle-check-big" },
    { name: "Cookie Policy", icon: "cookie" },
    { name: "Privacy Policy", icon: "lock-keyhole" },
  ];

  const dropdownItems: DropdownItem[] = [
    { name: "Profile", icon: "user" },
    { name: "Settings", icon: "settings" },
    { name: "Logout", icon: "logout" },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col justify-between bg-gray-50 w-56">
      <div className="flex flex-col overflow-hidden h-full">
        {/* Header */}
        <DropdownHeader
          title={user?.state?.user?.data?.username.toUpperCase() || "Profile"}
          logoUrl={user.avatar || "https://via.placeholder.com/150"}
          isOpen={sidebarState.isProfileDropdownOpen}
          onToggle={toggleProfileDropdown}
          items={dropdownItems}
        />

        {/* Sidebar Items */}
        <SidebarSection items={sidebarItems} />

        {/* More Section */}
        <SidebarSection
          title="More"
          items={moreItems}
          isOpen={sidebarState.isMoreDropdownOpen}
          onToggle={toggleMoreDropdown}
        />
      </div>
    </div>
  );
};

// Dropdown Header Component
const DropdownHeader: React.FC<{
  title: string;
  logoUrl: string;
  isOpen: boolean;
  onToggle: () => void;
  items: DropdownItem[];
}> = ({ title, logoUrl, isOpen, onToggle, items }) => (
  <div className="relative text-left p-2">
    <button
      className="flex h-12 items-center rounded-md hover:bg-gray-200 px-2 w-52"
      onClick={onToggle}
    >
      <img src={logoUrl} alt={`${title} Logo`} className="w-8 h-8 rounded" />
      <div className="ml-2 flex-1">
        <div className="text-base font-medium text-gray-900">{title}</div>
      </div>
      <svg
        className={`h-4 w-4 text-gray-700 transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <div
      className={`transition-all duration-300 overflow-hidden ${
        isOpen ? "max-h-40" : "max-h-0"
      }`}
    >
      <div className="mt-2">
        {items.map((item, index) => (
          <SidebarItem key={index} name={item.name} icon={item.icon || ""} />
        ))}
      </div>
    </div>
  </div>
);

// Sidebar Section Component
const SidebarSection: React.FC<{
  title?: string;
  items: SidebarItemProps[];
  isOpen?: boolean;
  onToggle?: () => void;
}> = ({ title, items, isOpen = true, onToggle }) => (
  <div className="flex flex-col">
    {title && onToggle && (
      <button
        className="flex items-center justify-between px-4 py-2 text-sm text-gray-600"
        onClick={onToggle}
      >
        {title}
        <svg
          className={`h-4 w-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    )}
    <div
      className={`transition-all duration-300 overflow-hidden ${
        isOpen ? "max-h-50" : "max-h-0"
      }`}
    >
      {items.map((item, index) => (
        <SidebarItem key={index} name={item.name} icon={item.icon} />
      ))}
    </div>
  </div>
);

// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon }) => (
  <button className="flex w-full items-center rounded text-gray-800 hover:bg-gray-100 px-2 py-1 mx-2 my-2">
    <span className="grid h-5 w-6 place-items-center">
      <Icon name={icon} />
    </span>
    <span className="ml-2 text-sm">{name}</span>
  </button>
);

export default Sidebar;
