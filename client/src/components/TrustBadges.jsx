import { motion } from 'framer-motion';
import { Users, Truck, CheckCircle, ShieldCheck } from 'lucide-react';

const TrustBadges = () => {
    const stats = [
        { icon: <Users className="text-primary" />, value: '15k+', label: 'Active Users' },
        { icon: <CheckCircle className="text-green-500" />, value: '100%', label: 'Success Rate' },
        { icon: <Truck className="text-accent-neon" />, value: '50k+', label: 'Deliveries' },
        { icon: <ShieldCheck className="text-blue-500" />, value: '24/7', label: 'Support' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card flex flex-col items-center text-center group bg-[#faf9f6]/80 dark:bg-white/5"
                >
                    <div className="mb-4 bg-gray-100 dark:bg-white/5 p-4 rounded-2xl group-hover:bg-primary/20 dark:group-hover:bg-primary/20 transition-all duration-300">
                        {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default TrustBadges;
