import { motion } from 'framer-motion';
import { Package, MapPin, ExternalLink } from 'lucide-react';

const deliveries = [
    { id: 1, user: 'U***91', platform: 'Instagram', price: '₦45,000', time: '2 mins ago' },
    { id: 2, user: 'D***k2', platform: 'Twitter (X)', price: '₦120,000', time: '5 mins ago' },
    { id: 3, user: 'K***s1', platform: 'Facebook', price: '₦85,000', time: '8 mins ago' },
];

const DeliveryFeed = () => {
    return (
        <div className="glass-card h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-primary" /> Recent Deliveries
            </h3>
            <div className="space-y-4 flex-grow">
                {deliveries.map((delivery, index) => (
                    <motion.div
                        key={delivery.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                                {delivery.platform[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{delivery.user}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{delivery.platform} • <span className="text-primary/70 dark:text-primary-light font-medium">{delivery.price}</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-emerald-600 dark:text-green-400 font-bold uppercase tracking-widest">{delivery.time}</p>
                            <ExternalLink size={14} className="ml-auto mt-2 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
            <button className="mt-8 w-full py-3 text-xs font-bold text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white transition-all border-t border-gray-100 dark:border-white/5 pt-6 uppercase tracking-widest">
                VIEW DELIVERY PROOFS →
            </button>
        </div>
    );
};

export default DeliveryFeed;
