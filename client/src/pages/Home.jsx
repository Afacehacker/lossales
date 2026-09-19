import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { Send, ChevronDown, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import WelcomePopup from '../components/WelcomePopup';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { settings } = useContext(SettingsContext);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await API.get('/accounts', { params: { platform: 'all', type: 'all' } });
                setAccounts(data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchAccounts();
    }, []);

    // Group accounts by platform or type
    const groupedAccounts = Array.isArray(accounts) ? accounts.reduce((acc, current) => {
        // Group by platform using uppercase to match the blue bars
        const group = current.platform?.toUpperCase() || 'OTHER';
        if (!acc[group]) acc[group] = [];
        acc[group].push(current);
        return acc;
    }, {}) : {};


    // Generate initial live orders based on actual products
    useEffect(() => {
        if (accounts.length > 0 && recentOrders.length === 0) {
            const fakeNames = ['alex..', 'mary..', 'john..', 'sarah..', 'mike..', 'emmy..', 'david..', 'paul..', 'lucy..', 'tobi..'];
            
            // Randomly pick 3 accounts to form the initial list
            const initialOrders = Array.from({ length: 3 }).map((_, i) => {
                const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
                return {
                    id: Date.now() + i,
                    name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
                    item: (randomAccount?.title || 'Account').substring(0, 20) + '...',
                    price: `₦${randomAccount?.price?.toLocaleString() || '0'}`,
                    time: `${(i + 1) * 3} mins ago`
                };
            });
            setRecentOrders(initialOrders);
        }
    }, [accounts]);

    // Interval to push a new purchase every 40 seconds
    useEffect(() => {
        if (accounts.length === 0) return;
        
        const fakeNames = ['chris..', 'kemi..', 'tunde..', 'susan..', 'femi..', 'ayo..', 'lisa..', 'peter..', 'chuks..', 'zainab..'];

        const intervalId = setInterval(() => {
            const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
            const newName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            const newItemTitle = (randomAccount?.title || 'Account').substring(0, 20) + '...';
            
            const newOrder = {
                id: Date.now(),
                name: newName,
                item: newItemTitle,
                price: `₦${randomAccount.price.toLocaleString()}`,
                time: 'Just now'
            };

            // Update list, keep only top 5
            setRecentOrders(prev => {
                return [newOrder, ...prev].slice(0, 5); 
            });

            // Fire floating side message notification
            toast.custom((t) => (
                <div className={`${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} transition-all duration-300 max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex p-4 border border-gray-100`}>
                    <div className="flex-1 w-0 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                            <span className="text-xl">🛒</span>
                        </div>
                        <div className="ml-1 flex-1">
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                {newName.replace('..', '')} <span className="text-blue-600 font-extrabold text-[12px] uppercase tracking-widest ml-1">Bought!</span>
                            </p>
                            <p className="mt-1 text-[13px] text-gray-500 font-medium truncate">
                                {randomAccount.title}
                            </p>
                        </div>
                    </div>
                </div>
            ), { duration: 5000, position: 'bottom-left' });

        }, 40000); // 40 seconds

        return () => clearInterval(intervalId);
    }, [accounts]);

    return (
        <div className="bg-[#f8fafc] min-h-screen text-gray-900 pb-32">
            <WelcomePopup />
            
            {/* Header Content */}
            <div className="px-5 pt-8 max-w-lg mx-auto">
                <h1 className="text-xl font-bold uppercase tracking-tight text-[#4f0c86]">
                    <span className="text-blue-700">HI </span>
                    {user ? user.name : 'GUEST'},
                </h1>

                {/* Categories Dropdown Filter */}
                <div className="mt-3 relative">
                    <select className="w-full bg-[#1b2331] text-white text-[15px] rounded-[12px] px-4 py-4 appearance-none outline-none font-medium cursor-pointer">
                        <option>Categories</option>
                        {Object.keys(groupedAccounts).map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={20} />
                    </div>
                </div>

                {/* Recent Order Status */}
                <div className="mt-6 mb-4">
                    <div className="bg-[#596168] rounded-[10px] text-center py-3 text-white font-bold tracking-widest text-sm shadow-sm">
                        RECENT ORDER
                    </div>
                </div>

                {/* Recent Order List */}
                <div className="bg-white border border-gray-100 rounded-[14px] shadow-sm mb-10 overflow-hidden">
                    <div className="flex justify-between px-5 py-4 border-b border-gray-100 font-bold text-lg">
                        <span>Item</span>
                        <span>Time</span>
                    </div>
                    <div className="max-h-56 overflow-hidden relative p-1">
                        <div className="animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                            {/* Visual effect for scroll list */}
                        </div>
                        {Array.isArray(recentOrders) && recentOrders.map((order, index) => (
                            <div key={order.id || index} className="flex justify-between items-center px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-gray-500 text-[13px] mb-1">{order.name}, <span className="text-pink-600 font-semibold text-[13px]">just purchase</span></p>
                                    <p className="text-gray-600 text-[13px] font-bold uppercase">{order.item} <span className="text-black ml-1">{order.price}</span></p>
                                </div>
                                <span className="text-gray-400 text-sm whitespace-nowrap pl-4">{order.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explore Product Tag */}
                <h2 className="text-xl font-extrabold text-[#1f2231] tracking-tight mb-4 border-l-4 border-yellow-400 pl-3">
                    Explore Product 👈
                </h2>

                {/* Products Grouped */}
                {loading ? (
                    <div className="py-20 text-center text-gray-500">Loading products...</div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(groupedAccounts).map((groupName, idx) => (
                            <div key={idx}>
                                {/* Group Header */}
                                <div className="bg-[#3b427b] text-white rounded-[10px] px-4 py-3 font-semibold text-sm mb-4 uppercase tracking-wider shadow-sm">
                                    {groupName} ACCOUNTS/TOOLS
                                </div>
                                
                                {/* Products */}
                                <div className="space-y-4">
                                    {groupedAccounts[groupName].slice(0, 5).map(acc => (
                                        <ProductCard key={acc._id} account={acc} />
                                    ))}
                                </div>

                                {/* View All Button */}
                                {groupedAccounts[groupName].length > 5 && (
                                    <div className="mt-4 mb-8">
                                        <Link to="/shop" className="block w-full text-center bg-[#1b2331] hover:bg-black transition-colors text-white py-4 rounded-xl shadow-md font-black uppercase text-[13px] tracking-widest">
                                            View All {groupName}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
            </div>

            {/* Floating Telegram Button */}
            <a href={settings?.telegramLink || "https://t.me/boostnaija1"} target="_blank" rel="noopener noreferrer" 
                className="fixed bottom-36 left-6 md:left-auto md:right-32 bg-[#0088cc] hover:bg-[#0077b5] transition-colors p-4 rounded-2xl shadow-lg z-50 flex items-center justify-center border-2 border-blue-50">
                <Send size={28} className="text-white -ml-1 mt-1" fill="currentColor" />
            </a>
            
        </div>
    );
};

export default Home;
