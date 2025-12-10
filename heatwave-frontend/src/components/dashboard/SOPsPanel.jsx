import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronLeft, AlertTriangle, Info, MapPin, Phone, Shield, FileText, Building2 } from 'lucide-react';
import sopsData from '../../data/sops.json';

export const SOPsPanel = () => {
    const [selectedSop, setSelectedSop] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('procedures'); // 'procedures' or 'resources'
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(sopsData.procedures.map(s => s.category));
        return ['All', ...Array.from(cats)];
    }, []);

    // Filter procedures
    const filteredSops = useMemo(() => {
        return sopsData.procedures.filter(sop => {
            const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sop.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || sop.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    // Filter resources
    const filteredResources = useMemo(() => {
        return sopsData.resources.filter(res => {
            const query = searchQuery.toLowerCase();
            return res.name.toLowerCase().includes(query) ||
                res.type.toLowerCase().includes(query) ||
                (res.address && res.address.toLowerCase().includes(query)) ||
                (res.city && res.city.toLowerCase().includes(query)); // Explicitly allow searching by city
        });
    }, [searchQuery]);

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {/* Left Sidebar - List */}
            <div className={`w-1/3 min-w-[320px] bg-white border-r border-slate-200 flex flex-col ${selectedSop && activeTab === 'procedures' ? 'hidden md:flex' : 'flex'}`}>
                {/* Search & Tabs */}
                <div className="p-4 border-b border-slate-200 space-y-4">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                        <button
                            onClick={() => { setActiveTab('procedures'); setSelectedSop(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'procedures' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FileText size={16} />
                            Protocols
                        </button>
                        <button
                            onClick={() => { setActiveTab('resources'); setSelectedSop(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'resources' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Building2 size={16} />
                            Resources
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={activeTab === 'procedures' ? "Search protocols..." : "Search hospitals, address..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                        />
                    </div>

                    {/* Filters */}
                    {activeTab === 'procedures' ? (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500 px-1">
                            Showing resources for 20 major cities. Search by city name (e.g., "Bahawalpur") to filter.
                        </div>
                    )}
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'procedures' ? (
                        <div className="divide-y divide-slate-100">
                            {filteredSops.map(sop => (
                                <div
                                    key={sop.id}
                                    onClick={() => setSelectedSop(sop)}
                                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${selectedSop?.id === sop.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className={`font-semibold text-sm ${selectedSop?.id === sop.id ? 'text-blue-700' : 'text-slate-900'}`}>
                                            {sop.title}
                                        </h3>
                                        {sop.critical_alert && (
                                            <AlertTriangle size={16} className="text-red-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{sop.description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-medium border border-slate-200">
                                            {sop.category}
                                        </span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-medium border border-slate-200">
                                            {sop.audience}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {filteredSops.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No procedures found matching your criteria.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredResources.map(res => (
                                <div key={res.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{res.name}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${res.type === 'Hospital' ? 'bg-red-100 text-red-600' :
                                            res.type === 'Cooling Center' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {res.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                        <MapPin size={12} className="shrink-0" />
                                        <span>{res.address || `Lat: ${res.lat}, Lng: ${res.lng}`}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="font-medium">{res.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Phone size={12} />
                                        <span>{res.contact}</span>
                                    </div>
                                    <div className="mt-2 text-xs p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                                        <span>Status: <span className="font-medium text-slate-700">{res.status}</span></span>
                                        <span>Capacity: <span className="font-medium text-slate-700">{res.capacity}</span></span>
                                    </div>
                                </div>
                            ))}
                            {filteredResources.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No resources found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane - Detail View */}
            <div className={`flex-1 bg-white flex flex-col ${!selectedSop && activeTab === 'procedures' ? 'hidden md:flex' : 'flex'}`}>
                {activeTab === 'procedures' ? (
                    selectedSop ? (
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200">
                                <button
                                    onClick={() => setSelectedSop(null)}
                                    className="md:hidden mb-4 flex items-center text-sm text-slate-500"
                                >
                                    <ChevronLeft size={16} /> Back to list
                                </button>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                                {selectedSop.category}
                                            </span>
                                            {selectedSop.critical_alert && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                                                    <AlertTriangle size={12} /> Critical
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900">{selectedSop.title}</h1>
                                        <p className="text-slate-500 mt-1">{selectedSop.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-3xl">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <Shield size={16} className="text-slate-400" />
                                        Action Plan
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedSop.steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-slate-700 leading-relaxed pt-1">{step}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedSop.tags && (
                                        <div className="mt-8 pt-8 border-t border-slate-200">
                                            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSop.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <Info size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Select a Protocol</h3>
                            <p className="max-w-xs mx-auto">Choose a Standard Operating Procedure from the list to view detailed steps and guidelines.</p>
                        </div>
                    )
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <MapPin size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Resource Map View</h3>
                        <p className="max-w-xs mx-auto">Select a resource from the list to locate it on the map (Coming Soon).</p>
                    </div>
                )}
            </div>
        </div>
    );
};
