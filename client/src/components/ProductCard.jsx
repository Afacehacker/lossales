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
            className="bg-white rounded-[1.5rem] p-4 flex gap-4 items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer w-full mb-4"
        >
            {/* Left Icon */}
            <div className="shrink-0 flex items-center justify-center">
                {getPlatformIcon(account.platform)}
            </div>

            {/* Middle Content */}
            <div className="flex-grow flex flex-col justify-center min-w-0 pr-2">
                <h3 className="text-gray-800 font-medium text-[15px] leading-snug mb-2 line-clamp-2">
                    {account.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-auto">
                    <span className="bg-[#1f2228] text-white text-xs font-semibold px-3 py-1 rounded-[6px] tracking-wide whitespace-nowrap">
                        {formatCurrency(account.price)}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="bg-[#1f2228] text-white text-xs font-semibold px-3 py-1 rounded-[6px] tracking-wide whitespace-nowrap">
                        {account.stock} Pcs
                    </span>
                </div>
            </div>

            {/* Right Action */}
            <div className="shrink-0 pl-2">
                <button className="text-primary hover:bg-primary/10 transition-colors p-2 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={2.5} className="fill-primary text-white text-shadow-sm" />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
