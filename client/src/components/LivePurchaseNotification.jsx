import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const mockNames = ['Alex', 'Jordan', 'Sarah', 'Kev', 'Mike', 'Lisa', 'Emma', 'Daniel', 'Chris'];
const mockPlatforms = ['Instagram', 'Twitter (X)', 'Facebook', 'TikTok', 'Snapchat'];

const LivePurchaseNotification = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const showNotification = () => {
            const name = mockNames[Math.floor(Math.random() * mockNames.length)];
            const platform = mockPlatforms[Math.floor(Math.random() * mockPlatforms.length)];

            setNotification({ name, platform });

            setTimeout(() => setNotification(null), 4000);
        };

        const interval = setInterval(showNotification, 12000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 20, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="fixed bottom-10 left-0 z-[60] glass-card !p-4 flex items-center gap-4 bg-white/90 dark:bg-dark-bg/90 border-primary/30"
                >
                    <div className="bg-primary/20 p-2 rounded-full">
                        <ShoppingCart size={20} className="text-primary-light" />
                    </div>
                    <div>
                        <p className="text-xs text-primary-light font-bold uppercase tracking-wider">Live Purchase</p>
                        <p className="text-sm">
                            <span className="font-bold">{notification.name}</span> just bought an
                            <span className="text-accent-neon ml-1">{notification.platform}</span> account
                        </p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 italic">Verified 2 minutes ago</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LivePurchaseNotification;
