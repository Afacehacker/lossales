import { ShoppingBag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ account, onPreview }) => {
    const navigate = useNavigate();
    
    // Formatter for Currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(val || 0).replace('NGN', '₦');
    };

    // Render Product Picture / Platform Brand Image in exact w-12 h-12 rounded-2xl shape
    const getProductPicture = () => {
        // Priority 1: User uploaded account image or media picture
        const mediaUrl = account.image || (account.media && account.media.length > 0 ? account.media[0] : null);
        
        if (mediaUrl) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-slate-800 border border-pink-200 dark:border-slate-700 overflow-hidden shrink-0 shadow-sm">
                    <img 
                        src={mediaUrl} 
                        alt={account.title || 'Product'} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            // Fallback if image load fails
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80';
                        }}
                    />
                </div>
            );
        }

        // Priority 2: High-Quality Platform Brand Images in exact w-12 h-12 rounded-2xl container
        const plat = (account.platform || '').toLowerCase();
        
        if (plat.includes('tiktok')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-black overflow-hidden shrink-0 shadow-md border border-slate-700 flex items-center justify-center p-0.5">
                    <img 
                        src="https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&w=150&q=80" 
                        alt="TikTok" 
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            );
        }

        if (plat.includes('facebook')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2] overflow-hidden shrink-0 shadow-md flex items-center justify-center p-0.5">
                    <img 
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=150&q=80" 
                        alt="Facebook" 
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            );
        }

        if (plat.includes('instagram')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 overflow-hidden shrink-0 shadow-md p-0.5">
                    <img 
                        src="https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=150&q=80" 
                        alt="Instagram" 
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            );
        }

        if (plat.includes('twitter') || plat.includes('x')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-black overflow-hidden shrink-0 shadow-md border border-slate-700 p-0.5">
                    <img 
                        src="https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=150&q=80" 
                        alt="Twitter X" 
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            );
        }

        if (plat.includes('telegram')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-[#0088cc] overflow-hidden shrink-0 shadow-md p-0.5">
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" 
                        alt="Telegram" 
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            );
        }

        // Default Product Image container
        return (
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-slate-800 flex items-center justify-center shadow-sm overflow-hidden border border-pink-200 dark:border-slate-700 shrink-0">
                <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80" 
                    alt="Digital Product" 
                    className="w-full h-full object-cover" 
                />
            </div>
        );
    };

    return (
        <div 
            className="bg-white dark:bg-slate-900/90 rounded-[1.5rem] p-4 flex gap-4 items-center shadow-sm border border-pink-100 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 w-full mb-3 group"
        >
            {/* Left Picture Icon Frame */}
            <div 
                onClick={() => navigate(`/shop/${account._id}`)}
                className="shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform cursor-pointer"
            >
                {getProductPicture()}
            </div>

            {/* Middle Content */}
            <div 
                onClick={() => navigate(`/shop/${account._id}`)}
                className="flex-grow flex flex-col justify-center min-w-0 pr-2 cursor-pointer"
            >
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-pink-950 dark:text-white font-extrabold text-[14px] md:text-[15px] leading-snug line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {account.title}
                    </h3>
                </div>
                
                <div className="flex items-center gap-2 mt-auto flex-wrap">
                    <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white text-xs font-black px-3 py-1 rounded-[8px] tracking-wide whitespace-nowrap shadow-xs">
                        {formatCurrency(account.price)}
                    </span>
                    <span className="text-pink-200 dark:text-slate-700 font-bold hidden sm:inline">|</span>
                    <span className="bg-pink-50 dark:bg-slate-800/80 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-slate-700 text-xs font-bold px-2.5 py-1 rounded-[8px] tracking-wide whitespace-nowrap">
                        {account.stock} Available
                    </span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="shrink-0 flex items-center gap-2 pl-1">
                {onPreview && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(account);
                        }}
                        title="Quick Preview"
                        className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors border border-pink-200 dark:border-slate-700"
                    >
                        <Eye size={17} />
                    </button>
                )}

                <button
                    onClick={() => navigate(`/shop/${account._id}`)}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/25 group-hover:scale-105 transition-transform"
                    title="Buy Now"
                >
                    <ShoppingBag size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
