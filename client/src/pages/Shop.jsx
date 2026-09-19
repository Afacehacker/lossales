import { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search, Grid, List, RefreshCw, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        platform: 'all',
        type: 'all',
        search: ''
    });

    const platforms = ['all', 'Instagram', 'Twitter (X)', 'Facebook', 'TikTok', 'Snapchat', 'Discord', 'Tools'];
    const types = ['all', 'Aged', 'Verified', 'High Follower', 'Premium'];

    useEffect(() => {
        fetchAccounts();
    }, [filters]);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/accounts', { params: filters });
            setAccounts(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen text-gray-900 pb-32">
            
            {/* Header Content */}
            <div className="px-5 pt-8 max-w-lg mx-auto mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-[#1f2231] tracking-tight mb-1">Marketplace</h1>
                        <p className="text-gray-500 text-sm font-medium">Verified accounts & details.</p>
                    </div>
                    <button onClick={fetchAccounts} className="bg-white border border-gray-200 p-3 rounded-[12px] shadow-sm text-gray-400 hover:text-blue-600 transition-colors">
                        <RefreshCw size={20} className={loading ? 'animate-spin border-blue-600' : ''} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full bg-white border border-gray-100 rounded-[14px] pl-12 pr-4 py-4 text-black font-bold focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Filters - Type Slider (Horizontal Scroll) */}
                <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                        {types.map(t => (
                            <button
                                key={t}
                                onClick={() => setFilters({ ...filters, type: t })}
                                className={`shrink-0 snap-start px-5 py-2.5 rounded-[12px] text-xs font-bold transition-all shadow-sm ${
                                    filters.type === t ? 'bg-[#1b2331] text-white' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters - Platform Chips */}
                <div className="mb-8 bg-white p-3 rounded-[16px] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-1 mb-3 ml-1">
                        <Filter size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1f2231]">Platforms</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {platforms.map(p => (
                            <button
                                key={p}
                                onClick={() => setFilters({ ...filters, platform: p })}
                                className={`px-3 py-1.5 rounded-[8px] text-[11px] font-bold transition-colors ${
                                    filters.platform === p ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-[#f8fafc] text-gray-500 border border-gray-100 hover:bg-gray-100'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-[20px] h-32 animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : (Array.isArray(accounts) && accounts.length > 0) ? (
                        <div className="space-y-4">
                            {accounts.map(account => (
                                <ProductCard key={account._id} account={account} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-[20px] border border-gray-100 mt-6">
                            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-[#1f2231] font-bold text-lg mb-1">No Assets Found</p>
                            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters.</p>
                            <button
                                onClick={() => setFilters({ platform: 'all', type: 'all', search: '' })}
                                className="text-blue-600 font-bold bg-blue-50 px-6 py-2 rounded-lg inline-block hover:bg-blue-100 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
