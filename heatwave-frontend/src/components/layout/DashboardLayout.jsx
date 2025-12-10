import React from 'react';
import { Sidebar } from './Sidebar';

export const DashboardLayout = ({ children }) => {
    const [activeTab, setActiveTab] = React.useState('dashboard');

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    );
};
