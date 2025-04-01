import React, { useState } from "react";
import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";

function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-gray-100 dark:bg-gray-900 shadow-md transition-all 
      shadow-[4px_4px_8px_#cfcfcf,-4px_-4px_8px_#ffffff] dark:shadow-none">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Sidebar Toggle Button */}
          <button
            className="text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 p-2 rounded-lg transition-all 
              shadow-[inset_2px_2px_5px_#d1d1d1,inset_-2px_-2px_5px_#ffffff] dark:shadow-none hover:scale-105"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <rect x="4" y="5" width="16" height="2" />
              <rect x="4" y="11" width="16" height="2" />
              <rect x="4" y="17" width="16" height="2" />
            </svg>
          </button>

          {/* Right-side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-all
                shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] 
                dark:shadow-none hover:scale-105"
              onClick={() => setSearchModalOpen(true)}
              aria-controls="search-modal"
            >
              <span className="sr-only">Search</span>
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 16 16">
                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
                <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z" />
              </svg>
            </button>
            <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />

            {/* Notifications, Help & Theme Toggle */}
            <Notifications align="right" />
            <Help align="right" />
            <ThemeToggle />

            {/* Divider */}
            <hr className="w-px h-6 bg-gray-300 dark:bg-gray-700 border-none" />

            {/* User Menu */}
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
