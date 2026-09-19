import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { Copy, PlusCircle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
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
            console.error(error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTransactions();
        if (fetchUser) fetchUser(); // Ensure balance is updated when opening wallet
    }, [navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploading(true);

        try {
            const { data } = await API.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data', },
            });
            setPaymentProof(data);
            toast.success('Proof Uploaded');
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
        toast.success('Copied!');
    };

    if (!user) return null;

    return (
        <div className="bg-[#f8fafc] min-h-screen text-gray-900 pb-32">
            <div className="px-5 pt-8 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold uppercase tracking-tight text-[#1f2231] mb-6">
                    Fund Wallet
                </h1>

                {/* Balance Card */}
                <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[20px] p-6 text-white shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                    <p className="text-blue-100 font-medium text-sm mb-1 uppercase tracking-widest">Available Balance</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">₦{user.balance?.toLocaleString() || '0.00'}</h2>
                </div>

                {/* Desktop/Mobile Important Notice & Bank Details */}
                <div className="bg-white border border-red-100 rounded-[24px] p-6 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full opacity-50 blur-2xl" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-red-600 text-white p-2 rounded-xl shadow-md">
                                <ShieldCheck size={20} fill="currentColor" />
                            </div>
                            <h3 className="font-extrabold text-[#1f2231] uppercase tracking-tight text-lg">Payment Guidelines</h3>
                        </div>

                        {/* Notice Box */}
                        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <div>
                                    <h4 className="text-[13px] font-black text-red-700 uppercase mb-1">⚠️ Important notice:</h4>
                                    <div className="space-y-3">
                                        <p className="text-[12.5px] leading-relaxed text-red-900 font-medium italic">
                                            Please <span className="underline font-black">DO NOT</span> send with **OPAY**. It takes our bank over 2 hours to receive money from OPAY.
                                        </p>
                                        <p className="text-[12.5px] leading-relaxed text-red-900 font-medium italic">
                                            Warning: <span className="underline font-black">DO NOT</span> send payments to Moniepoint or any other bank. Only use the bank details provided below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Box */}
                        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-4">
                             <h4 className="text-[11px] font-black text-gray-400 uppercase mb-3 tracking-widest text-center">Transfer To:</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center text-[13px] font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Bank Name</span>
                                    <span className="text-blue-700 uppercase">{settings?.bankName || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] font-bold border-y border-gray-100 py-3">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Account Name</span>
                                    <span className="text-gray-800 uppercase">{settings?.accountName || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] font-bold">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-blue-900 tracking-tighter">{settings?.accountNumber || 'Loading...'}</span>
                                        <button 
                                            onClick={() => copyToClipboard(settings?.accountNumber || '')}
                                            className="p-1.5 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all transform active:scale-90"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm mb-10">
                    <h3 className="font-bold text-lg mb-4 text-[#1f2231]">Confirm Deposit</h3>
                    <form onSubmit={handleDeposit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Amount Sent (₦)</label>
                            <input
                                type="number"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-black font-bold focus:outline-none focus:border-blue-500"
                                placeholder="E.g. 5000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Payment Receipt</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                required={!paymentProof}
                            />
                            {uploading && <p className="text-xs text-blue-500 mt-2 font-bold">Uploading...</p>}
                            {paymentProof && <p className="text-xs text-green-500 mt-2 font-bold flex items-center gap-1"><CheckCircle size={14} /> Uploaded successfully</p>}
                        </div>
                        <button disabled={loading || uploading} type="submit" className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors mt-4 flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : <><PlusCircle size={20} /> Request Deposit</>}
                        </button>
                    </form>
                </div>

                {/* History */}
                <h3 className="font-bold text-lg mb-4 text-[#1f2231]">Recent Wallet History</h3>
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No recent transactions</p>
                    ) : (
                        transactions.map(tx => (
                            <div key={tx._id} className="bg-white border border-gray-100 p-4 rounded-2xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-[14px] text-gray-800 capitalize leading-none mb-1">{tx.description}</p>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black tracking-tight ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                    </p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm inline-block ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-green-100 text-green-700' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
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
