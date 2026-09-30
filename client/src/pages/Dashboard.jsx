import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Package, ShieldCheck, Clock, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to load orders:", error);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Credentials copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!user) return <div className="pt-32 text-center text-gray-500 dark:text-gray-400 font-bold">Please log in to view your order dashboard.</div>;

    return (
        <div className="bg-[#fdf2f8] dark:bg-[#090d16] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-32">
            
            <div className="px-4 pt-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-pink-950 dark:text-white tracking-tight mb-1">
                            My Orders 📦
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Access your purchased accounts and instant delivery vault.
                        </p>
                    </div>
                    <div className="bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <Package size={18} />
                        <span className="font-extrabold text-sm">{orders.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl h-28 animate-pulse border border-pink-100 dark:border-slate-800" />
                        ))}
                    </div>
                ) : (Array.isArray(orders) && orders.length > 0) ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-pink-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-11 h-11 bg-pink-50 dark:bg-slate-800 border border-pink-200 dark:border-slate-700 rounded-xl flex items-center justify-center font-black text-pink-700 dark:text-pink-300 text-base uppercase shrink-0">
                                            {order.account?.platform ? order.account.platform[0] : 'L'}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-pink-950 dark:text-white text-sm md:text-base leading-snug line-clamp-1">
                                                {order.account?.title || 'Account Removed'}
                                            </h3>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                Order ID: {order.orderId?.substring(0, 8) || '......'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                                            order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {order.status === 'completed' && order.account && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                        <p className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" /> Instant Delivery Vault
                                        </p>
                                        <div className="flex items-center justify-between gap-3 bg-pink-50/50 dark:bg-slate-800/80 border border-pink-100 dark:border-slate-700/80 p-3 rounded-xl overflow-hidden">
                                            <code className="text-pink-950 dark:text-slate-200 font-mono text-xs truncate select-all">
                                                {order.account.credentials}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(order.account.credentials, order._id)}
                                                className="shrink-0 bg-white dark:bg-slate-700 border border-pink-200 dark:border-slate-600 p-2 rounded-lg text-pink-600 dark:text-pink-300 hover:bg-pink-600 hover:text-white transition-colors"
                                                title="Copy Credentials"
                                            >
                                                {copiedId === order._id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'pending' && (
                                    <div className="mt-4 pt-4 border-t border-pink-100 dark:border-slate-800 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
                                        <Clock size={16} /> Automated delivery in progress...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-pink-100 dark:border-slate-800 p-6 shadow-sm">
                        <Package size={48} className="mx-auto mb-4 text-pink-300 dark:text-slate-700" />
                        <p className="text-pink-950 dark:text-white font-black text-base mb-1">No Orders Found</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">You haven't purchased any accounts or digital assets yet.</p>
                        <Link to="/shop" className="text-white font-extrabold text-xs bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 rounded-xl inline-block shadow-md hover:opacity-90 transition-all">
                            Explore Marketplace Now
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
