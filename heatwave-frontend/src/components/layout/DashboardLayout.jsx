import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChevronDown, Search, Bell, User, X } from 'lucide-react';

const Header = ({ activeTab, onSearch, data = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      statistics: 'Statistics',
      reports: 'Reports',
      settings: 'Settings',
    };
    return titles[activeTab] || 'Dashboard';
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      // Filter cities that match the query (case-insensitive)
      const filtered = data.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setSearchQuery(cityName);
    onSearch(cityName);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside would be ideal, but for now we rely on selection or blur (with delay)
  // A simple blur might close it before click is registered, so we use a small timeout or onMouseDown on the item

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
      {/* Left side - Page title and breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
      </div>

      {/* Right side - Search and actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        {activeTab === 'dashboard' && (
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchQuery.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                // Delay hiding to allow click event to fire on suggestion
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="w-48 h-10 pl-10 pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                  onSearch('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur so button click registers
              >
                <X size={14} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((city) => (
                  <div
                    key={city.id}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 flex items-center gap-2"
                    onClick={() => handleSuggestionClick(city.name)}
                  >
                    <Search size={14} className="text-slate-400" />
                    <span>{city.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate Report Button */}
        <button className="h-10 px-5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-sm">
          Generate Report
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} className="text-slate-500" />
        </button>

        {/* User Avatar */}
        <button className="p-1 hover:bg-slate-100 rounded-full transition-colors border border-slate-200">
          <img src="/ndma_logo.png" alt="NDMA Logo" className="w-8 h-8 object-contain" />
        </button>
      </div>
    </header>
  );
};

export const DashboardLayout = ({ children, activeTab, onTabChange, onSearch, data }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-900 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} onSearch={onSearch} data={data} />
        <main className="flex-1 relative overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
