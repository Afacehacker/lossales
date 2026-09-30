import { ShoppingBag, Eye, Zap } from 'lucide-react';
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

    // Pick an icon or logo based on platform
    const getPlatformIcon = (platform = '') => {
        const plat = platform.toLowerCase();
        if (plat.includes('proxy')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md text-white font-black text-xl">
                    9
                </div>
            );
        }
        if (plat.includes('facebook')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center shadow-md text-white font-black text-xl">
                    f
                </div>
            );
        }
        if (plat.includes('twitter') || plat.includes('x')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-black dark:bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md text-white font-black text-xl">
                    X
                </div>
            );
        }
        if (plat.includes('instagram')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-md text-white font-black text-xl">
                    Ig
                </div>
            );
        }
        if (plat.includes('telegram')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-[#0088cc] flex items-center justify-center shadow-md text-white font-black text-xl">
                    Tg
                </div>
            );
        }
        if (plat.includes('google') || plat.includes('gmail') || plat.includes('youtube')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shadow-md text-white font-black text-xl">
                    G
                </div>
            );
        }
        if (plat.includes('tiktok')) {
            return (
                <div className="w-12 h-12 rounded-2xl bg-black dark:bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md text-white font-black text-xl">
                    Tk
                </div>
            );
        }
        // Default avatar/image
        return (
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-slate-800 flex items-center justify-center shadow-sm overflow-hidden border border-pink-200 dark:border-slate-700 shrink-0">
                <img src={account.image || 'https://via.placeholder.com/150'} alt="Icon" className="w-full h-full object-cover" />
            </div>
        );
    };

    return (
        <div 
            className="bg-white dark:bg-slate-900/90 rounded-[1.5rem] p-4 flex gap-4 items-center shadow-sm border border-pink-100 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 w-full mb-3 group"
        >
            {/* Left Icon */}
            <div 
                onClick={() => navigate(`/shop/${account._id}`)}
                className="shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform cursor-pointer"
            >
                {getPlatformIcon(account.platform)}
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
