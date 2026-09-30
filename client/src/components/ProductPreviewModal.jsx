import { X, ShieldCheck, Zap, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductPreviewModal = ({ account, onClose }) => {
    const navigate = useNavigate();

    if (!account) return null;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(val || 0).replace('NGN', '₦');
    };

    const handleBuyClick = () => {
        onClose();
        navigate(`/shop/${account._id}`);
    };

    // Determine primary media/image url
    const mediaUrl = account.image || (account.media && account.media.length > 0 ? account.media[0] : null);
    const isVideo = mediaUrl && (mediaUrl.includes('/video/upload/') || mediaUrl.match(/\.(mp4|mov|avi|webm)$/i));

    // Fallback platform image generators
    const getFallbackPlatformImage = (platform = '') => {
        const plat = platform.toLowerCase();
        if (plat.includes('facebook')) return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80';
        if (plat.includes('instagram')) return 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=600&q=80';
        if (plat.includes('twitter') || plat.includes('x')) return 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=600&q=80';
        if (plat.includes('tiktok')) return 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&w=600&q=80';
        if (plat.includes('telegram')) return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
        return 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80';
    };

    const displayImage = mediaUrl || getFallbackPlatformImage(account.platform);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div 
                className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
                >
                    <X size={18} />
                </button>

                {/* PRODUCT PICTURE SHOWCASE BANNER */}
                <div className="relative w-full rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-4 border border-pink-100 dark:border-slate-800">
                    {isVideo ? (
                        <video 
                            src={displayImage} 
                            className="w-full h-full object-cover" 
                            controls 
                            autoPlay 
                            muted 
                            playsInline 
                        />
                    ) : (
                        <img 
                            src={displayImage} 
                            alt={account.title} 
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-pink-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            {account.platform || 'Verified Log'}
                        </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                        <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Zap size={12} fill="currentColor" /> 1-Min Auto-Delivery
                        </span>
                        <span className="bg-black/60 backdrop-blur-xs text-emerald-400 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                            <CheckCircle size={12} /> {account.quality || 99}% Verified
                        </span>
                    </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-pink-950 dark:text-white leading-snug mb-2">
                    {account.title}
                </h3>

                {/* Price & Stock info */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-pink-600 dark:text-pink-400">
                        {formatCurrency(account.price)}
                    </span>
                    <span className="text-xs bg-pink-50 dark:bg-slate-800 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-slate-700 font-bold px-3 py-1 rounded-full">
                        {account.stock} Pcs Available
                    </span>
                </div>

                {/* Account Details / Specs */}
                <div className="space-y-3 mb-5">
                    <div className="bg-pink-50/60 dark:bg-slate-800/60 rounded-2xl p-4 text-xs space-y-2 text-gray-700 dark:text-slate-300 border border-pink-100/50 dark:border-slate-700/50">
                        <div className="flex justify-between font-extrabold">
                            <span className="text-gray-500 dark:text-gray-400">Category / Type:</span>
                            <span className="text-pink-950 dark:text-white uppercase">{account.type || 'Aged Account'}</span>
                        </div>
                        <div className="flex justify-between font-extrabold">
                            <span className="text-gray-500 dark:text-gray-400">Format Structure:</span>
                            <span className="text-pink-950 dark:text-white">Email : Password : Cookies/2FA</span>
                        </div>
                        <div className="flex justify-between font-extrabold">
                            <span className="text-gray-500 dark:text-gray-400">Replacement Guarantee:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-black">24 Hours Auto Replacement</span>
                        </div>
                    </div>

                    {account.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {account.description}
                        </p>
                    )}
                </div>

                {/* Risk-free Guarantee Banner */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-5 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <span>Every log is pre-checked. Invalid credentials replaced within 24h.</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onClose}
                        className="py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-extrabold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Close Preview
                    </button>
                    <button 
                        onClick={handleBuyClick}
                        className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-black text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <ShoppingCart size={15} /> Buy Now <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewModal;
