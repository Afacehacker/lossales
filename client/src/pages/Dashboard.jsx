import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Package, ShieldCheck, Clock, ExternalLink, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
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
                console.error(error);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Credentials copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!user) return <div className="pt-32 text-center text-gray-400">Please login to view dashboard.</div>;

    return (
        <div className="bg-[#f8fafc] min-h-screen text-gray-900 pb-32">
            
            <div className="px-5 pt-8 max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-[#1f2231] tracking-tight mb-1">My Orders</h1>
                        <p className="text-gray-500 text-sm font-medium">Track accounts and tools.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Package size={20} />
                        <span className="font-bold">{orders.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-[20px] h-32 animate-pulse border border-gray-100" />)}
                    </div>
                ) : (Array.isArray(orders) && orders.length > 0) ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-[#f8fafc] border border-gray-100 rounded-xl flex items-center justify-center font-black text-[#1f2231] text-lg uppercase">
                                            {order.account?.platform[0] || 'L'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#1f2231] text-[15px] leading-snug line-clamp-1">{order.account?.title || 'Account Removed'}</h3>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                ID: {order.orderId?.substring(0, 8) || '......'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className={`px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-widest ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {order.status === 'completed' && order.account && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <ShieldCheck size={14} className="text-green-500" /> Secure Vault Delivery
                                        </p>
                                        <div className="flex items-center justify-between gap-3 bg-[#f8fafc] border border-gray-200 p-3 rounded-xl overflow-hidden">
                                            <code className="text-gray-900 font-mono text-xs truncate">
                                                {order.account.credentials}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(order.account.credentials, order._id)}
                                                className="shrink-0 bg-white border border-gray-200 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                            >
                                                {copiedId === order._id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'pending' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-yellow-600 text-xs font-bold">
                                        <Clock size={16} /> Verification in progress...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[20px] border border-gray-100">
                        <Package size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-medium mb-4">You haven't purchased anything yet.</p>
                        <Link to="/shop" className="text-blue-600 font-bold bg-blue-50 px-6 py-2 rounded-lg inline-block hover:bg-blue-100 transition-colors">
                            Explore Marketplace
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
