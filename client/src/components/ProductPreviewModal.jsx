import { X, ShieldCheck, Zap, ShoppingCart, ArrowRight } from 'lucide-react';
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Modal Title / Platform Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                        {account.platform || 'Verified Account'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Zap size={12} fill="currentColor" /> Instant Auto-Delivery
                    </span>
                </div>

                <h3 className="text-xl font-black text-pink-950 dark:text-white leading-snug mb-3">
                    {account.title}
                </h3>

                {/* Price & Stock info */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-pink-600 dark:text-pink-400">
                        {formatCurrency(account.price)}
                    </span>
                    <span className="text-xs bg-pink-50 dark:bg-slate-800 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-slate-700 font-bold px-3 py-1 rounded-full">
                        {account.stock} Pcs Available
                    </span>
                </div>

                {/* Account Details / Description */}
                <div className="space-y-3 mb-6">
                    <div className="bg-pink-50/50 dark:bg-slate-800/50 rounded-2xl p-4 text-xs space-y-2 text-gray-700 dark:text-slate-300">
                        <div className="flex justify-between font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Account Type:</span>
                            <span className="text-pink-950 dark:text-white uppercase">{account.type || 'Standard Log'}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Format:</span>
                            <span className="text-pink-950 dark:text-white">Email : Password : Cookies/Token</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Warranty:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">24 Hours Replacement</span>
                        </div>
                    </div>

                    {account.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {account.description}
                        </p>
                    )}
                </div>

                {/* Risk-free Guarantee Banner */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-6 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <span>Every log is pre-checked. Invalid credentials are swapped automatically.</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onClose}
                        className="py-3.5 px-4 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-extrabold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Close Preview
                    </button>
                    <button 
                        onClick={handleBuyClick}
                        className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white font-extrabold text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <ShoppingCart size={15} /> Buy Now <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewModal;
