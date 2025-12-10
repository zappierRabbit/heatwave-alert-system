
import {
    LayoutDashboard,
    Map as MapIcon,
    Settings,
    BarChart3,
    FileText,

    ChevronLeft,
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-all duration-200 ${active
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
    >
        <Icon size={20} strokeWidth={1.8} />
        <span>{label}</span>
    </button>
);

export const Sidebar = ({ activeTab, onTabChange, collapsed = false, onToggleCollapse }) => {
    return (
        <div className="flex h-screen w-64 flex-col bg-slate-900 relative z-50">
            {/* Toggle Button */}
            <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-800">
                <button
                    onClick={onToggleCollapse}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                    <ChevronLeft size={18} strokeWidth={2} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Hide Menu</span>
                </button>
            </div>

            {/* Brand */}
            <div className="px-4 py-6">
                <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-xs align-top">M</span>
                    <h1 className="text-2xl font-bold text-white tracking-tight">HeatWatch</h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />
                <NavItem
                    icon={MapIcon}
                    label="Campaign"
                    active={activeTab === 'campaign'}
                    onClick={() => onTabChange('campaign')}
                />


                <NavItem
                    icon={BarChart3}
                    label="Statistics"
                    active={activeTab === 'statistics'}
                    onClick={() => onTabChange('statistics')}
                />
                <NavItem
                    icon={FileText}
                    label="Reports"
                    active={activeTab === 'reports'}
                    onClick={() => onTabChange('reports')}
                />

            </nav>

            {/* Footer */}
            <div className="border-t border-slate-800 p-3">
                <NavItem
                    icon={Settings}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />
            </div>
        </div>
    );
};
