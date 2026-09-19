import { motion } from 'framer-motion';
import { Search, ShoppingCart, Key, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: <Search className="text-primary" size={32} />,
        title: "Browse Assets",
        desc: "Filter through our verified database of aged and high-follower social accounts."
    },
    {
        icon: <ShoppingCart className="text-accent-neon" size={32} />,
        title: "Secure Payment",
        desc: "Pay securely using your preferred method. Funds are held in escrow until delivery."
    },
    {
        icon: <Key className="text-yellow-500" size={32} />,
        title: "Instant Unlock",
        desc: "Once verified, your account credentials are automatically sent to your digital vault."
    },
    {
        icon: <CheckCircle className="text-green-500" size={32} />,
        title: "Verify & Secure",
        desc: "Check your assets, update security info, and confirm delivery to complete the trade."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 px-6 bg-white/5 dark:bg-[#1e293b]/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">HOW IT <span className="text-primary-light">WORKS</span></h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        A seamless 4-step process designed for professional traders who value speed and security.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent -z-10" />
                            )}

                            <div className="glass-card flex flex-col items-center text-center group h-full hover:border-primary/50 bg-[#faf9f6]/90 dark:bg-white/5">
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                                <div className="mt-6 text-primary/10 dark:text-primary/30 font-black text-6xl select-none group-hover:text-primary/20 transition-colors">
                                    0{index + 1}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
