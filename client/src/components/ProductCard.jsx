import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ account }) => {
    const navigate = useNavigate();
    
    // Formatter for Currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
        }).format(val).replace('NGN', '₦');
    };

    // Pick an icon or logo based on platform
    const getPlatformIcon = (platform = '') => {
        const plat = platform.toLowerCase();
        if (plat.includes('proxy')) {
            return (
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    9
                </div>
            );
        }
        if (plat.includes('facebook')) {
            return (
                <div className="w-12 h-12 rounded-xl bg-[#1877F2] flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    f
                </div>
            );
        }
        if (plat.includes('twitter') || plat.includes('x')) {
            return (
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    X
                </div>
            );
        }
        if (plat.includes('instagram')) {
            return (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    Ig
                </div>
            );
        }
        // Default avatar/image
        return (
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden border border-gray-100 shrink-0">
                <img src={account.image || 'https://via.placeholder.com/150'} alt="Icon" className="w-full h-full object-cover" />
            </div>
        );
    };

    return (
        <div 
            onClick={() => navigate(`/shop/${account._id}`)}
            className="bg-white rounded-[1.5rem] p-4 flex gap-4 items-center shadow-sm border border-pink-100/80 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer w-full mb-3 group"
        >
            {/* Left Icon */}
            <div className="shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                {getPlatformIcon(account.platform)}
            </div>

            {/* Middle Content */}
            <div className="flex-grow flex flex-col justify-center min-w-0 pr-2">
                <h3 className="text-pink-950 font-bold text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {account.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-auto flex-wrap">
                    <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white text-xs font-black px-3 py-1 rounded-[8px] tracking-wide whitespace-nowrap shadow-xs">
                        {formatCurrency(account.price)}
                    </span>
                    <span className="text-pink-200 font-bold">|</span>
                    <span className="bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold px-3 py-1 rounded-[8px] tracking-wide whitespace-nowrap">
                        {account.stock} Pcs Available
                    </span>
                </div>
            </div>

            {/* Right Action */}
            <div className="shrink-0 pl-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/25 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={20} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
