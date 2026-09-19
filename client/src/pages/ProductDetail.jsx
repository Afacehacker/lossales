import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle, ChevronRight, HelpCircle, User as UserIcon } from 'lucide-react';
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
    
    // User latest data to get exact balance
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
            toast.error('Insufficient balance to complete purchase. Fund wallet first.');
            navigate('/wallet');
            return;
        }

        setPlacingOrder(true);
        try {
            await API.post('/orders', { accountId: account._id });
            toast.success('Purchase successful! Item in your Orders.');
            
            // Re-fetch user so balance updates locally
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
        return <div className="pt-32 pb-20 text-center font-bold text-gray-500 animate-pulse">Loading Asset...</div>;
    }

    if (!account) return null;

    // Pick a quick color depending on platform
    let platColor = 'bg-blue-600';
    const plat = (account?.platform || '').toLowerCase();
    if(plat.includes('twitter')) platColor = 'bg-black';
    if(plat.includes('instagram')) platColor = 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600';
    if(plat.includes('tools')) platColor = 'bg-indigo-500';

    return (
        <div className="bg-[#f8fafc] min-h-screen text-gray-900 pb-32">
            
            {/* Nav Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-[60px] z-40">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-bold text-[16px] truncate px-4">{account.title}</h2>
                <div className="w-9 shrink-0" /> {/* Spacer */}
            </div>

            <div className="max-w-lg mx-auto pt-4 px-4">
                
                {/* Product Main Display */}
                <div className="bg-white rounded-[20px] p-2 border border-gray-100 shadow-sm mb-6">
                    {(() => {
                        const mediaList = account.media && account.media.length > 0 ? account.media : [account.image || 'https://via.placeholder.com/600'];
                        const activeMediaUrl = mediaList[activeMediaIndex] || mediaList[0];
                        const isVideo = activeMediaUrl.includes('/video/upload/') || activeMediaUrl.match(/\.(mp4|mov|avi|webm)$/i);

                        return (
                            <>
                                <div className={`${platColor} w-full rounded-[14px] flex items-center justify-center relative overflow-hidden aspect-video max-h-[350px] bg-black/10`}>
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
                                        <span className="bg-white text-black font-extrabold text-[10px] px-2 py-1 rounded tracking-widest uppercase shadow-sm">
                                            {account.platform}
                                        </span>
                                        <span className="bg-green-500 text-white font-extrabold text-[10px] px-2 py-1 rounded tracking-normal flex items-center gap-1 shadow-sm border border-green-400">
                                            <CheckCircle size={12}/> {account.quality}%
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
                                                        activeMediaIndex === idx ? 'border-primary scale-105 shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'
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
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-xl font-black text-[#1f2231] leading-tight mb-2">{account.title}</h1>
                                <p className="text-gray-500 text-sm leading-relaxed">{account.description}</p>
                            </div>
                        </div>

                        {/* Price Details Block */}
                        <div className="bg-[#1b2331] text-white rounded-2xl p-5 shadow-inner">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-gray-400">Unit Price</span>
                                <span className="font-black text-2xl tracking-tight text-white">₦{account.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-400">Available Stock</span>
                                <span className={`font-bold text-[12px] uppercase tracking-widest px-3 py-1 rounded ${account.stock > 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                    {account.stock} Pcs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Block */}
                <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm">
                    {account.stock <= 0 ? (
                        <div className="text-center font-bold text-red-500 py-4 opacity-70">
                            Sold Out
                        </div>
                    ) : !user ? (
                        <div className="text-center">
                            <UserIcon className="mx-auto mb-2 text-gray-300" size={32} />
                            <p className="text-gray-500 font-medium mb-4">Login to your account to purchase.</p>
                            <Link to="/login" className="block w-full bg-[#1b2331] text-white py-4 rounded-xl font-bold">
                                Login Now
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {/* Wallet Info Summary */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 cursor-pointer" onClick={() => navigate('/wallet')}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Balance</p>
                                        <p className="font-bold text-lg text-[#1f2231]">₦{currentUser?.balance?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-300" />
                            </div>

                            {/* Buy Logic */}
                            {currentUser?.balance < account.price ? (
                                <div>
                                    <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-4 bg-red-50 py-3 rounded-xl border border-red-100 text-sm">
                                        <HelpCircle size={16} /> Insufficient Funds
                                    </div>
                                    <Link to="/wallet" className="block w-full text-center bg-[#3b82f6] text-white py-4 rounded-[14px] font-bold shadow-lg shadow-blue-500/30">
                                        Fund Wallet Now
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePurchase}
                                    disabled={placingOrder}
                                    className="w-full bg-[#1b2331] hover:bg-black transition-colors text-white py-4 rounded-[14px] font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {placingOrder ? 'Processing...' : `Pay exactly ₦${account.price.toLocaleString()}`}
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
