import { useState, useEffect } from 'react';
import API from '../services/api';
import {
    Users, ShoppingCart, Tag, BarChart3,
    Settings, Check, X, Edit, Trash2,
    Plus, ExternalLink, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import AddListingModal from './AddListingModal';
import SupportTab from './SupportTab';
import SettingsTab from './SettingsTab';
import UsersTab from './UsersTab';
import { MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [listingToEdit, setListingToEdit] = useState(null);

    const handleEditClick = (listing) => {
        setListingToEdit(listing);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setListingToEdit(null);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: oData } = await API.get('/orders');
            const { data: aData } = await API.get('/accounts');
            const { data: tData } = await API.get('/transactions');
            const { data: cData } = await API.get('/chats');
            setOrders(oData);
            setAccounts(aData);
            setTransactions(tData);
            setChats(cData);
        } catch (error) {
            toast.error('Failed to fetch admin data');
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/orders/${id}/status`, { status });
            toast.success('Order updated successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    const handleDepositStatus = async (id, status) => {
        try {
            await API.put(`/transactions/${id}/status`, { status });
            toast.success(`Deposit ${status} successfully`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update deposit');
        }
    };

    const handleDeleteAccount = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await API.delete(`/accounts/${id}`);
                toast.success('Listing deleted');
                fetchData();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-gray-900">
            <div className="mb-8 md:mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent tracking-tight leading-tight">Admin Hub</h1>
                    <p className="text-gray-500 font-medium text-sm">Control orders, assets, and deposits.</p>
                </div>
                <button onClick={fetchData} className="bg-white p-3 rounded-xl shadow-sm hover:text-blue-600 border border-gray-100 transition-colors">
                    <RefreshCw size={20} className={loading ? 'animate-spin border-blue-600' : ''} />
                </button>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8">
                {/* Sidebar / Tabs */}
                <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar snap-x snap-mandatory">
                    <TabButton id="overview" active={activeTab} set={setActiveTab} icon={<BarChart3 size={18} />} label="Stats" />
                    <TabButton id="orders" active={activeTab} set={setActiveTab} icon={<ShoppingCart size={18} />} label="Orders" count={(Array.isArray(orders) ? orders : []).filter(o => o.status === 'pending').length} />
                    <TabButton id="deposits" active={activeTab} set={setActiveTab} icon={<Users size={18} />} label="Payments" count={(Array.isArray(transactions) ? transactions : []).filter(t => t.status === 'pending').length} />
                    <TabButton id="users" active={activeTab} set={setActiveTab} icon={<Users size={18} />} label="Users" />
                    <TabButton id="support" active={activeTab} set={setActiveTab} icon={<MessageSquare size={18} />} label="Support" count={(Array.isArray(chats) ? chats : []).reduce((acc, curr) => acc + (curr.unreadCountAdmin || 0), 0)} />
                    <TabButton id="accounts" active={activeTab} set={setActiveTab} icon={<Tag size={18} />} label="Products" />
                    <TabButton id="settings" active={activeTab} set={setActiveTab} icon={<Settings size={18} />} label="Settings" />
                </div>

                {/* Content */}
                <div className="lg:col-span-4 bg-white rounded-3xl min-h-[600px] border border-gray-100 shadow-sm overflow-hidden">
                    {activeTab === 'overview' && <OverviewTab orders={orders} accounts={accounts} transactions={transactions} />}
                    {activeTab === 'orders' && <OrdersTab orders={orders} onUpdate={handleStatusUpdate} />}
                    {activeTab === 'deposits' && <DepositsTab transactions={transactions} onUpdate={handleDepositStatus} />}
                    {activeTab === 'users' && <UsersTab />}
                    {activeTab === 'accounts' && <AccountsTab accounts={accounts} onDelete={handleDeleteAccount} onAdd={() => setIsAddModalOpen(true)} onEdit={handleEditClick} />}
                    {activeTab === 'support' && <SupportTab />}
                    {activeTab === 'settings' && <SettingsTab />}
                </div>
            </div>
            <AddListingModal isOpen={isAddModalOpen} onClose={handleCloseModal} onSuccess={fetchData} listing={listingToEdit} />
        </div>
    );
};

const TabButton = ({ id, active, set, icon, label, count }) => (
    <button
        onClick={() => set(id)}
        className={`flex-shrink-0 lg:w-full flex items-center justify-between px-5 py-3 lg:px-6 lg:py-4 rounded-2xl transition-all snap-start ${active === id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10' : 'bg-white lg:bg-transparent border border-gray-100 lg:border-none hover:bg-gray-100 text-gray-500'}`}
    >
        <div className="flex items-center gap-2 lg:gap-3">
            {icon}
            <span className="font-bold text-sm lg:text-base whitespace-nowrap">{label}</span>
        </div>
        {count > 0 && <span className="bg-red-500 text-[10px] text-white px-2 py-0.5 rounded-full font-bold ml-2 lg:ml-0">{count}</span>}
    </button>
);

const OverviewTab = ({ orders, accounts }) => {
    const revenue = (Array.isArray(orders) ? orders : []).filter(o => o.status === 'completed').reduce((acc, curr) => acc + (curr.account?.price || 0), 0);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-8">Performance Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Total Revenue" value={`₦${revenue}`} color="text-green-400" />
                <StatCard label="Pending Orders" value={(Array.isArray(orders) ? orders : []).filter(o => o.status === 'pending').length} color="text-yellow-400" />
                <StatCard label="Active Listings" value={(Array.isArray(accounts) ? accounts : []).length} color="text-primary-light" />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</p>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
);

const OrdersTab = ({ orders, onUpdate }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Proof</th>
                    <th className="px-6 py-4">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {(Array.isArray(orders) ? orders : []).map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                        <td className="px-6 py-4">
                            <p className="text-sm font-bold">{order.account?.title}</p>
                            <p className="text-[10px] text-gray-500">{order.user?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                                }`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4 text-primary underline">
                            {order.paymentProof ? <a href={order.paymentProof} target="_blank"><ExternalLink size={16} /></a> : 'None'}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                            {order.status === 'pending' && (
                                <>
                                    <button onClick={() => onUpdate(order._id, 'completed')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 transition-colors hover:text-white"><Check size={16} /></button>
                                    <button onClick={() => onUpdate(order._id, 'cancelled')} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 transition-colors hover:text-white"><X size={16} /></button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AccountsTab = ({ accounts, onDelete, onAdd, onEdit }) => (
    <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold">Product Inventory</h2>
            <button onClick={onAdd} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-black transition-all active:scale-95"><Plus size={18} /> POST NEW PRODUCT</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Array.isArray(accounts) ? accounts : []).map(acc => (
                <div key={acc._id} className="p-4 bg-[#f8fafc] rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <img src={acc.image || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        <div>
                            <p className="font-bold text-sm text-black line-clamp-1">{acc.title}</p>
                            <p className="text-xs text-gray-500 font-medium">₦{acc.price} • Stock: {acc.stock}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(acc)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-50 hover:text-white transition-colors" title="Edit Listing"><Edit size={16} /></button>
                        <button onClick={() => onDelete(acc._id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors" title="Delete Listing"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DepositsTab = ({ transactions, onUpdate }) => (
    <div className="overflow-x-auto p-4">
        <h2 className="text-xl font-bold mb-6 px-2">Wallet Funding Requests</h2>
        <table className="w-full text-left bg-white border border-gray-100 rounded-xl">
            <thead className="bg-[#f8fafc] text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 rounded-tl-xl">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Proof</th>
                    <th className="px-6 py-4 rounded-tr-xl">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {(Array.isArray(transactions) ? transactions : []).map(tx => (
                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900">{tx.user?.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">{tx.user?.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">₦{tx.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-green-100 text-green-700' : tx.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{tx.status}</span>
                        </td>
                        <td className="px-6 py-4 text-blue-600 underline font-semibold text-sm">
                            {tx.paymentProof ? <a href={tx.paymentProof} target="_blank" className="flex items-center gap-1 hover:text-blue-800"><ExternalLink size={14} /> View</a> : 'None'}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                            {tx.status === 'pending' && (
                                <>
                                    <button onClick={() => onUpdate(tx._id, 'approved')} className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-500 hover:text-white transition-colors" title="Approve"><Check size={16} /></button>
                                    <button onClick={() => onUpdate(tx._id, 'rejected')} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Reject"><X size={16} /></button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;
