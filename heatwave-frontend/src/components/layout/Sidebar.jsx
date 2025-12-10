import React from 'react';
import { LayoutDashboard, Map as MapIcon, Settings, Bell, Info } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={clsx(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium',
            active
                ? 'bg-yellow-50 text-yellow-600 font-bold'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        )}
    >
        <Icon size={20} />
        <span>{label}</span>
    </button>
);

export const Sidebar = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4 relative z-50">
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                    <MapIcon className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">HeatWatch</h1>
                    <p className="text-xs text-slate-500">Pakistan Alert System</p>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />
                <NavItem
                    icon={MapIcon}
                    label="Statistics"
                    active={activeTab === 'statistics'}
                    onClick={() => onTabChange('statistics')}
                />
                <NavItem
                    icon={Bell}
                    label="Alerts"
                    active={activeTab === 'alerts'}
                    onClick={() => onTabChange('alerts')}
                />
                <NavItem
                    icon={Info}
                    label="Reports"
                    active={activeTab === 'reports'}
                    onClick={() => onTabChange('reports')}
                />
            </div>

            <div className="mt-auto border-t border-slate-200 pt-4">
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
