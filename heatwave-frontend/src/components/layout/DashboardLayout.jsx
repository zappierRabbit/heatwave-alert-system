import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChevronDown, Search, Bell, User } from 'lucide-react';

const Header = ({ activeTab }) => {
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      campaign: 'Campaign',
      statistics: 'Statistics',
      reports: 'Reports',
      settings: 'Settings',
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      {/* Left side - Page title and breadcrumb */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Displaying</span>
          <button className=" flex items-center gap-1 text-slate-700 font-medium hover:text-slate-900 transition-colors">
            Campaigns
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Right side - Search and actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
          />
        </div>

        {/* Generate Report Button */}
        <button className="h-10 px-5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-sm">
          Generate Report
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} className="text-slate-500" />
        </button>

        {/* User Avatar */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <User size={20} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
};

export const DashboardLayout = ({ children, activeTab, onTabChange }) => {
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
        <Header activeTab={activeTab} />
        <main className="flex-1 relative overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
