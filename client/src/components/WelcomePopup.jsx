import { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { ShieldCheck, Send, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { settings } = useContext(SettingsContext);

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 1500); // 1.5s delay
        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white rounded-[24px] max-w-sm w-full p-6 pb-8 relative shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background portion */}
                        <div className="absolute top-0 left-0 w-full h-28 bg-[#f8fafc] border-b border-gray-100" />
                        
                        <button 
                            onClick={closePopup}
                            className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors z-20 shadow-sm border border-gray-100"
                        >
                            <X size={18} />
                        </button>

                        <div className="relative z-10 text-center mt-2">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-gray-100">
                                <ShieldCheck size={32} className="text-[#3b82f6]" strokeWidth={2.5} />
                            </div>
                            
                            <h2 className="text-2xl font-black text-[#1f2231] tracking-tight mb-2">Buy with Confidence!</h2>
                            
                            <p className="text-gray-500 text-[13px] mb-6 leading-relaxed font-medium mx-auto max-w-[280px]">
                                LOGS=SALES is your trusted marketplace and hub for verified digital assets. 
                                We guarantee safe and instant deliveries.
                            </p>

                            <div className="bg-white border border-gray-100 shadow-sm rounded-[16px] p-4 mb-6 text-left space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-50 text-yellow-500 p-1.5 rounded-lg shrink-0 border border-yellow-100">
                                        <Star size={16} fill="currentColor" />
                                    </div>
                                    <p className="text-sm font-bold text-[#1f2231]">100% Verified Accounts</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-50 text-green-500 p-1.5 rounded-lg shrink-0 border border-green-100">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <p className="text-sm font-bold text-[#1f2231]">Escrow Protection & Warranty</p>
                                </div>
                            </div>

                            <a 
                                href={settings?.telegramLink || "https://t.me/boostnaija1"} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                                onClick={closePopup}
                            >
                                <Send size={18} fill="currentColor" className="-ml-1 mt-0.5" />
                                Join Telegram Channel
                            </a>
                            
                            <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest leading-relaxed">
                                Join for Bulk Deals &<br/>Speedy Complaint Handling
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;
