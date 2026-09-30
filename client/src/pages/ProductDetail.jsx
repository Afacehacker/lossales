import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle, ChevronRight, HelpCircle, User as UserIcon, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState(user);

    useEffect(() => {
        if(user) {
            API.get('/users/profile').then(res => setCurrentUser(res.data)).catch(() => {});
        }
    }, [user]);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const { data } = await API.get(`/accounts/${id}`);
                setAccount(data);
            } catch (error) {
                toast.error('Account not found');
                navigate('/shop');
            }
            setLoading(false);
        };
        fetchAccount();
    }, [id, navigate]);

    const handlePurchase = async () => {
        if (!user) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

        if(currentUser.balance < account.price) {
            toast.error('Insufficient balance. Fund wallet first.');
            navigate('/wallet');
            return;
        }

        setPlacingOrder(true);
        try {
            await API.post('/orders', { accountId: account._id });
            toast.success('Purchase successful! Credentials saved in your Orders.');
            
            const res = await API.get('/users/profile');
            setCurrentUser(res.data);
            navigate('/dashboard');
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return <div className="pt-32 pb-20 text-center font-extrabold text-pink-600 dark:text-pink-400 animate-pulse">Loading Product Details...</div>;
    }

    if (!account) return null;

    let platColor = 'bg-pink-600';
    const plat = (account?.platform || '').toLowerCase();
    if(plat.includes('facebook')) platColor = 'bg-[#1877F2]';
    if(plat.includes('twitter')) platColor = 'bg-black dark:bg-slate-800';
    if(plat.includes('instagram')) platColor = 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600';
    if(plat.includes('tools')) platColor = 'bg-indigo-600';

    return (
        <div className="bg-[#fdf2f8] dark:bg-[#090d16] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-32">
            
            {/* Nav Header */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-pink-100 dark:border-slate-800 flex items-center justify-between sticky top-[60px] z-40">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 hover:bg-pink-100 transition-colors shrink-0">
                    <ArrowLeft size={18} />
                </button>
                <h2 className="font-black text-sm md:text-base text-pink-950 dark:text-white truncate px-4">{account.title}</h2>
                <div className="w-9 shrink-0" />
            </div>

            <div className="max-w-xl mx-auto pt-4 px-4">
                
                {/* Product Main Display */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-pink-100 dark:border-slate-800 shadow-sm mb-6">
                    {(() => {
                        const mediaList = account.media && account.media.length > 0 ? account.media : [account.image || 'https://via.placeholder.com/600'];
                        const activeMediaUrl = mediaList[activeMediaIndex] || mediaList[0];
                        const isVideo = activeMediaUrl.includes('/video/upload/') || activeMediaUrl.match(/\.(mp4|mov|avi|webm)$/i);

                        return (
                            <>
                                <div className={`${platColor} w-full rounded-2xl flex items-center justify-center relative overflow-hidden aspect-video max-h-[350px] bg-black/10`}>
                                    {isVideo ? (
                                        <video 
                                            src={activeMediaUrl} 
                                            className="w-full h-full max-h-[350px] object-contain" 
                                            controls 
                                            autoPlay 
                                            muted 
                                            playsInline 
                                        />
                                    ) : (
                                        <img 
                                            src={activeMediaUrl} 
                                            alt={account.title} 
                                            className="w-full h-full max-h-[350px] object-contain"
                                        />
                                    )}
                                    <div className="absolute inset-x-4 top-4 flex justify-between items-start drop-shadow-md z-10">
                                        <span className="bg-white dark:bg-slate-900 text-pink-950 dark:text-white font-black text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase shadow-sm">
                                            {account.platform}
                                        </span>
                                        <span className="bg-emerald-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full tracking-normal flex items-center gap-1 shadow-sm border border-emerald-400">
                                            <CheckCircle size={12}/> {account.quality || 99}% Quality
                                        </span>
                                    </div>
                                </div>

                                {mediaList.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto py-3 px-1 no-scrollbar scrollbar-none snap-x mt-2">
                                        {mediaList.map((url, idx) => {
                                            const isUrlVideo = url.includes('/video/upload/') || url.match(/\.(mp4|mov|avi|webm)$/i);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveMediaIndex(idx)}
                                                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-black flex items-center justify-center snap-start ${
                                                        activeMediaIndex === idx ? 'border-pink-600 scale-105 shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'
                                                    }`}
                                                >
                                                    {isUrlVideo ? (
                                                        <video src={url} className="w-full h-full object-cover" muted playsInline />
                                                    ) : (
                                                        <img src={url} className="w-full h-full object-cover" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        );
                    })()}

                    <div className="p-4 space-y-4">
                        <div>
                            <h1 className="text-xl font-black text-pink-950 dark:text-white leading-tight mb-2">{account.title}</h1>
                            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed">{account.description}</p>
                        </div>

                        {/* Price Details Block */}
                        <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-pink-950 dark:from-slate-800 dark:to-slate-950 text-white rounded-2xl p-5 shadow-md">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-pink-200">Price Per Unit</span>
                                <span className="font-black text-2xl tracking-tight text-white">₦{account.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-xs font-bold text-pink-200">Available Stock</span>
                                <span className={`font-black text-[11px] uppercase tracking-widest px-3 py-1 rounded-full ${account.stock > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
                                    {account.stock} Pcs
                                </span>
                            </div>
                        </div>

                        {/* Warranty Guarantee notice */}
                        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                            <ShieldCheck size={18} className="shrink-0" />
                            <span>100% Replacement Warranty: Invalid logins replaced within 24 hours.</span>
                        </div>
                    </div>
                </div>

                {/* Checkout Block */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-pink-100 dark:border-slate-800 shadow-sm">
                    {account.stock <= 0 ? (
                        <div className="text-center font-black text-rose-500 py-4">
                            Out of Stock
                        </div>
                    ) : !user ? (
                        <div className="text-center">
                            <UserIcon className="mx-auto mb-2 text-pink-300 dark:text-slate-700" size={32} />
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-4">Please log in to your account to complete purchase.</p>
                            <Link to="/login" className="block w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white py-4 rounded-2xl font-black text-sm text-center shadow-lg">
                                Login To Purchase
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {/* Wallet Info Summary */}
                            <div className="flex items-center justify-between mb-5 pb-4 border-b border-pink-100 dark:border-slate-800 cursor-pointer" onClick={() => navigate('/wallet')}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-400 p-2.5 rounded-full border border-pink-200 dark:border-slate-700">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Wallet Balance</p>
                                        <p className="font-black text-base text-pink-950 dark:text-white">₦{currentUser?.balance?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400" />
                            </div>

                            {/* Buy Logic */}
                            {currentUser?.balance < account.price ? (
                                <div>
                                    <div className="flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold mb-4 bg-rose-50 dark:bg-rose-950/40 py-3 rounded-xl border border-rose-200 dark:border-rose-900 text-xs">
                                        <HelpCircle size={16} /> Insufficient Balance for this item
                                    </div>
                                    <Link to="/wallet" className="block w-full text-center bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25">
                                        Fund Wallet Now
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePurchase}
                                    disabled={placingOrder}
                                    className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:opacity-95 transition-all text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-pink-500/25 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    {placingOrder ? 'Processing Order...' : `Buy Now • ₦${account.price.toLocaleString()}`}
                                    {!placingOrder && <ChevronRight size={18} />}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default ProductDetail;
