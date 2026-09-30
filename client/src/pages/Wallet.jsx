import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { Copy, PlusCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
    const { user, fetchUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [paymentProof, setPaymentProof] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const { settings } = useContext(SettingsContext);

    const fetchTransactions = async () => {
        try {
            const { data } = await API.get('/transactions/my');
            setTransactions(data);
        } catch (error) {
            console.error("Failed to load transactions:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTransactions();
        if (fetchUser) fetchUser();
    }, [navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploading(true);

        try {
            const { data } = await API.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data', },
            });
            setPaymentProof(data);
            toast.success('Proof Uploaded Successfully');
            setUploading(false);
        } catch (error) {
            toast.error('Image upload failed');
            setUploading(false);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!amount || amount < 500) return toast.error('Minimum deposit is ₦500');
        if (!paymentProof) return toast.error('Please upload proof of payment');

        setLoading(true);
        try {
            await API.post('/transactions/deposit', { amount, paymentProof });
            toast.success('Deposit request sent! Awaiting admin approval.');
            setAmount('');
            setPaymentProof('');
            fetchTransactions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Deposit failed');
        }
        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    if (!user) return null;

    return (
        <div className="bg-[#fdf2f8] dark:bg-[#090d16] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-32">
            <div className="px-4 pt-8 max-w-lg mx-auto">
                <h1 className="text-2xl font-black uppercase tracking-tight text-pink-950 dark:text-white mb-6">
                    Fund Wallet 💳
                </h1>

                {/* Balance Card */}
                <div className="bg-gradient-to-tr from-pink-600 via-rose-600 to-pink-700 rounded-3xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                    <p className="text-pink-100 font-bold text-xs uppercase tracking-widest mb-1">Available Balance</p>
                    <h2 className="text-4xl font-black tracking-tight">₦{user.balance?.toLocaleString() || '0.00'}</h2>
                </div>

                {/* Bank Guidelines & Account Details */}
                <div className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-rose-600 text-white p-2 rounded-xl shadow-md">
                                <ShieldCheck size={20} fill="currentColor" />
                            </div>
                            <h3 className="font-black text-pink-950 dark:text-white uppercase tracking-tight text-base">Deposit Guidelines</h3>
                        </div>

                        {/* Notice Box */}
                        <div className="bg-rose-50 dark:bg-rose-950/40 border-l-4 border-rose-500 rounded-r-xl p-4 mb-5">
                            <h4 className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase mb-1">⚠️ Important notice:</h4>
                            <p className="text-xs leading-relaxed text-rose-900 dark:text-rose-200 font-semibold">
                                Transfer to the official bank account below and upload your receipt for instant wallet crediting.
                            </p>
                        </div>

                        {/* Bank Box */}
                        <div className="bg-pink-50/50 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700/60 rounded-2xl p-4">
                             <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-widest text-center">Transfer Details</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">Bank Name</span>
                                    <span className="text-pink-700 dark:text-pink-300 uppercase font-black">{settings?.bankName || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold border-y border-pink-100 dark:border-slate-700 py-2.5">
                                    <span className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">Account Name</span>
                                    <span className="text-pink-950 dark:text-white uppercase font-extrabold">{settings?.accountName || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-pink-600 dark:text-pink-400 tracking-tighter">{settings?.accountNumber || 'Loading...'}</span>
                                        <button 
                                            onClick={() => copyToClipboard(settings?.accountNumber || '')}
                                            className="p-1.5 bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 rounded-lg shadow-xs border border-pink-200 dark:border-slate-600 hover:bg-pink-600 hover:text-white transition-all transform active:scale-90"
                                        >
                                            <Copy size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deposit Form */}
                <div className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-10">
                    <h3 className="font-black text-base mb-4 text-pink-950 dark:text-white">Confirm Deposit</h3>
                    <form onSubmit={handleDeposit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">Amount Sent (₦)</label>
                            <input
                                type="number"
                                className="w-full bg-pink-50/50 dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-xl px-4 py-3.5 text-pink-950 dark:text-white font-extrabold focus:outline-none focus:border-pink-500"
                                placeholder="E.g. 5000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">Payment Receipt Screenshot</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-pink-100 dark:file:bg-slate-800 file:text-pink-700 dark:file:text-pink-300 hover:file:bg-pink-200 cursor-pointer"
                                required={!paymentProof}
                            />
                            {uploading && <p className="text-xs text-pink-600 font-bold mt-2 animate-pulse">Uploading proof image...</p>}
                            {paymentProof && <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1"><CheckCircle size={14} /> Receipt attached</p>}
                        </div>
                        <button disabled={loading || uploading} type="submit" className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:opacity-95 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-500/25 transition-all mt-4 flex items-center justify-center gap-2 active:scale-95">
                            {loading ? 'Processing...' : <><PlusCircle size={18} /> Submit Deposit</>}
                        </button>
                    </form>
                </div>

                {/* History */}
                <h3 className="font-black text-base mb-4 text-pink-950 dark:text-white">Recent Wallet History</h3>
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <p className="text-gray-400 text-xs text-center py-6 bg-white dark:bg-slate-900 rounded-2xl border border-pink-100 dark:border-slate-800">
                            No recent transactions found
                        </p>
                    ) : (
                        transactions.map(tx => (
                            <div key={tx._id} className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center shadow-xs">
                                <div>
                                    <p className="font-black text-xs text-pink-950 dark:text-white capitalize mb-1">{tx.description}</p>
                                    <p className="text-[11px] text-gray-400 font-bold">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-sm tracking-tight ${tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                    </p>
                                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full inline-block ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : tx.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
