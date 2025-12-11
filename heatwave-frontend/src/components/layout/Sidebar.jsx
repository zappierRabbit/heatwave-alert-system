
import {
    LayoutDashboard,
    Settings,
    BarChart3,
    FileText,
    BookOpen,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Map,
    History,
} from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-all duration-200 ${active
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            } ${collapsed ? 'justify-center' : ''}`}
    >
        <Icon size={20} strokeWidth={1.8} />
        {!collapsed && <span>{label}</span>}
    </button>
);

export const Sidebar = ({ activeTab, onTabChange, collapsed = false, onToggleCollapse }) => {
    return (
        <div className={`flex h-screen flex-col bg-slate-900 relative z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* Toggle Button */}
            <div className={`flex items-center gap-2 px-4 py-4 border-b border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
                <button
                    onClick={onToggleCollapse}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight size={20} strokeWidth={2} />
                    ) : (
                        <>
                            <ChevronLeft size={18} strokeWidth={2} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Hide Menu</span>
                        </>

                    )}
                </button>
            </div>

            {/* Brand */}
            <div className={`px-4 py-6 ${collapsed ? 'flex justify-center' : ''}`}>
                {collapsed ? (
                    <h1 className="text-xl font-bold text-white tracking-tight">HW</h1>
                ) : (
                    <div className="flex items-center gap-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight ">HeatWatch</h1>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                    collapsed={collapsed}
                />
                <NavItem
                    icon={Map}
                    label="Heat Map"
                    active={activeTab === 'heatmap'}
                    onClick={() => onTabChange('heatmap')}
                    collapsed={collapsed}
                />

                <NavItem
                    icon={FileText}
                    label="Reports"
                    onClick={() => onTabChange('reports')}
                    collapsed={collapsed}
                />
                <NavItem
                    icon={AlertTriangle}
                    label="Alerts"
                    active={activeTab === 'alerts'}
                    onClick={() => onTabChange('alerts')}
                    collapsed={collapsed}
                />
                <NavItem
                    icon={BookOpen}
                    label="SOPs & Resources"
                    active={activeTab === 'sops'}
                    onClick={() => onTabChange('sops')}
                    collapsed={collapsed}
                />


            </nav>

            {/* Footer */}
            <div className="border-t border-slate-800 p-3">
                <NavItem
                    icon={Settings}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                    collapsed={collapsed}
                />
            </div>
        </div>
    );
};
