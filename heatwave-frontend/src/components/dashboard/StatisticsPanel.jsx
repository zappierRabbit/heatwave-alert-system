import React, { useState } from 'react';
import { Copy, Share2, Expand, CheckCircle2, ChevronRight, X, Filter, ChevronDown, Calendar, ArrowLeft } from 'lucide-react';
import { HeatmapMap } from '../map/HeatmapMap'; // Reuse the map for the visual

export const StatisticsPanel = ({ data, onBack }) => {
    const [showShareModal, setShowShareModal] = useState(true);

    return (
        <div className="flex flex-col h-full w-full bg-slate-50 overflow-y-auto">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="font-semibold text-slate-900 mx-2">Heat Map</span>
                    <span>Displaying</span>
                    <span className="text-blue-500 font-medium cursor-pointer">Poland</span>
                </div>

                {/* Top Actions */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">Show on map</span>
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-2 shadow-sm min-w-[120px]">
                        Impressions <ChevronDown size={14} className="ml-auto text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Generated Link Card - Floating Top */}
            <div className="mx-auto w-full max-w-3xl mb-6 relative z-10">
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 pl-4 pr-2">
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Generated link to your heatmap</label>
                        <div className="text-blue-500 text-sm truncate bg-blue-50/50 px-2 py-1 rounded">
                            https://openmobi.com/134858/campaigns/filters/heatmap/share
                        </div>
                    </div>
                    <button className="h-9 px-6 bg-white border border-yellow-400 text-yellow-600 font-bold rounded-lg hover:bg-yellow-50 transition-all text-sm uppercase tracking-wide shadow-sm">
                        Copy
                    </button>
                </div>
            </div>


            {/* Map Container */}
            <div className="relative mx-8 h-[500px] bg-slate-200 rounded-3xl overflow-hidden border-4 border-white shadow-xl group">
                {/* Reusing the heatmap component but maybe with fewer controls if needed, or just a placeholder visual for now since it's a "Statistics" view */}
                <div className="absolute inset-0 grayscale-[20%] opacity-90">
                    <HeatmapMap data={data || []} selectedCity={null} onCitySelect={() => { }} />
                </div>

                {/* Map Controls Overlay */}
                <div className="absolute top-4 left-4 bg-white p-2 rounded-xl shadow-md border border-slate-100">
                    <Expand size={20} className="text-slate-400" />
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-6 left-6">
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-yellow-400/30"
                    >
                        <Share2 size={16} className="text-yellow-500" /> Share the Map
                    </button>
                </div>

                {/* Info Markers (Decorative) */}
                <div className="absolute top-1/3 left-1/4 pointer-events-none">
                    <div className="bg-yellow-400/20 backdrop-blur-sm p-8 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Bottom Section - Filters & Data Table */}
            <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left - Country Selector */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Country</h3>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium shadow-sm">
                            Date: Today <span className="text-slate-300">|</span> Poland <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Country</th>
                                    <th className="px-6 py-4">Impressions</th>
                                    <th className="px-6 py-4">Clicks</th>
                                    <th className="px-6 py-4">CTR</th>
                                    <th className="px-6 py-4">Conversions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: 'Germany', imp: '43,123', clicks: '10,202', ctr: '64%', conv: '52%' },
                                    { name: 'Poland', imp: '43,123', clicks: '10,202', ctr: '12%', conv: '52%' },
                                    { name: 'Ukraine', imp: '43,123', clicks: '10,202', ctr: '33%', conv: '52%' },
                                    { name: 'Czech Republic', imp: '43,123', clicks: '10,202', ctr: '66%', conv: '52%' },
                                    { name: 'Other', imp: '43,123', clicks: '10,202', ctr: '78%', conv: '52%' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors text-slate-600 font-medium">
                                        <td className="px-6 py-4 text-blue-500 font-semibold">{row.name}</td>
                                        <td className="px-6 py-4">{row.imp}</td>
                                        <td className="px-6 py-4">{row.clicks}</td>
                                        <td className="px-6 py-4">{row.ctr}</td>
                                        <td className="px-6 py-4">{row.conv}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>Showing 1 to 10 of 22 entries</span>
                            <div className="flex gap-2">
                                <button className="hover:text-slate-600">Previous</button>
                                <div className="flex gap-1">
                                    <span className="w-5 h-5 flex items-center justify-center bg-slate-900 text-white rounded">1</span>
                                    <span className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer">2</span>
                                    <span className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer">3</span>
                                </div>
                                <button className="hover:text-slate-600">Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Share Modal / Filters Panel */}
                <div className="relative">
                    {showShareModal && (
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 absolute -top-40 right-0 w-full lg:w-[400px] z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-blue-500">Heat map Share</h3>
                                <button onClick={() => setShowShareModal(false)} className="text-slate-300 hover:text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Generated link to your heatmap</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value="https://openmobi.com/134858/campaigns/filters/heatmap/share"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-blue-500 font-medium focus:outline-none"
                                    />
                                    <button className="px-4 py-2 bg-white border border-yellow-400 text-yellow-600 text-xs font-bold uppercase rounded-lg hover:bg-yellow-50">
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-slate-700 font-semibold border-b border-slate-100 pb-2">
                                    <span>Map Filters</span>
                                    <ChevronDown size={16} className="text-blue-500" />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Campaign</div>
                                        <div className="text-sm font-medium text-blue-500">Test Campaign Name created by Gbx Soft</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Ad Sets</div>
                                        <div className="text-sm font-medium text-blue-500">Test Ad Set Name created by Gbx Soft</div>
                                        <div className="text-sm font-medium text-blue-500 mt-1">Test Ad Set Name created by Gbx Soft</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Creatives list:</div>
                                    <ul className="space-y-2">
                                        {[
                                            'http://www.zencorporation.com',
                                            'Language exam papers',
                                            'http://www.zencorporation.com',
                                            'Language exam papers'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 size={10} className="text-yellow-500" />
                                                </div>
                                                <span className="text-blue-400 hover:underline cursor-pointer truncate">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Floating success marker outside */}
                            <div className="absolute top-1/2 -left-16 bg-white p-3 rounded-2xl shadow-lg border border-slate-100">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-green-500" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
