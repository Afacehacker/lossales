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
        <div className="bg-[#fdf2f8] min-h-screen text-gray-900 pb-32">
            <WelcomePopup />
            
            {/* Header Content */}
            <div className="px-5 pt-8 max-w-lg mx-auto">
                <h1 className="text-xl font-black uppercase tracking-tight text-pink-900">
                    <span className="text-pink-600">HI </span>
                    {user ? user.name : 'GUEST'},
                </h1>

                {/* Categories Dropdown Filter */}
                <div className="mt-3 relative">
                    <select className="w-full bg-gradient-to-r from-pink-900 via-pink-800 to-rose-900 text-white text-[15px] rounded-[14px] px-4 py-4 appearance-none outline-none font-bold cursor-pointer shadow-md shadow-pink-900/20">
                        <option>Categories</option>
                        {Object.keys(groupedAccounts).map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-200">
                        <ChevronDown size={20} />
                    </div>
                </div>

                {/* Recent Order Status */}
                <div className="mt-6 mb-4">
                    <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 rounded-[12px] text-center py-3 text-white font-extrabold tracking-widest text-sm shadow-md shadow-pink-500/25">
                        ⚡ RECENT ORDERS
                    </div>
                </div>

                {/* Recent Order List */}
                <div className="bg-white border border-pink-100 rounded-[16px] shadow-sm shadow-pink-500/5 mb-10 overflow-hidden">
                    <div className="flex justify-between px-5 py-4 border-b border-pink-100 font-extrabold text-pink-950 text-base">
                        <span>Item</span>
                        <span>Time</span>
                    </div>
                    <div className="max-h-56 overflow-hidden relative p-1">
                        {Array.isArray(recentOrders) && recentOrders.map((order, index) => (
                            <div key={order.id || index} className="flex justify-between items-center px-4 py-3.5 border-b border-pink-50 last:border-0 hover:bg-pink-50/50 transition-colors">
                                <div>
                                    <p className="text-gray-500 text-[13px] mb-0.5">{order.name}, <span className="text-pink-600 font-bold text-[13px]">just purchased</span></p>
                                    <p className="text-pink-950 text-[13px] font-extrabold uppercase">{order.item} <span className="text-rose-600 font-black ml-1">{order.price}</span></p>
                                </div>
                                <span className="text-pink-400 text-xs font-bold whitespace-nowrap pl-4">{order.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explore Product Tag */}
                <h2 className="text-xl font-black text-pink-950 tracking-tight mb-4 border-l-4 border-pink-600 pl-3">
                    Explore Products 👈
                </h2>

                {/* Products Grouped */}
                {loading ? (
                    <div className="py-20 text-center text-pink-600 font-bold animate-pulse">Loading verified products...</div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(groupedAccounts).map((groupName, idx) => (
                            <div key={idx}>
                                {/* Group Header */}
                                <div className="bg-gradient-to-r from-pink-800 via-rose-800 to-pink-900 text-white rounded-[12px] px-4 py-3.5 font-extrabold text-sm mb-4 uppercase tracking-wider shadow-md shadow-pink-900/15 flex items-center justify-between">
                                    <span>{groupName} ACCOUNTS / TOOLS</span>
                                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">{groupedAccounts[groupName].length} items</span>
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
                                        <Link to="/shop" className="block w-full text-center bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 transition-all text-white py-4 rounded-xl shadow-lg shadow-pink-500/25 font-black uppercase text-[13px] tracking-widest active:scale-98">
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
                className="fixed bottom-24 right-5 md:right-10 bg-gradient-to-tr from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all p-4 rounded-full shadow-xl shadow-pink-500/40 z-50 flex items-center justify-center border-2 border-white transform hover:scale-110 active:scale-95">
                <Send size={26} className="text-white -ml-0.5 mt-0.5" fill="currentColor" />
            </a>
            
        </div>
    );
};

export default Home;
