import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, ArrowRight, Zap } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const TelegramCommunity = () => {
    const { settings } = useContext(SettingsContext);
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#0088cc]/20 to-primary/10 border border-[#0088cc]/30 p-12 md:p-20 shadow-2xl shadow-[#0088cc]/10"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0088cc]/10 rounded-full blur-[100px]" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-[#0088cc]/20 text-[#0088cc] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-[#0088cc]/30">
                                <Zap size={14} fill="currentColor" /> Live Feed & Support
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-gray-900 dark:text-white">
                                Join Our Elite <br />
                                <span className="text-[#0088cc] italic underline decoration-[#0088cc]/30">Telegram</span> Channel
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                                Get instant alerts on new premium logs, bulk discounts, and professional
                                trading tips. For any complaints or support, reach out directly via our channel.
                                Join <span className="text-gray-900 dark:text-white font-bold">5,000+</span> active traders.
                            </p>

                            <div className="flex flex-wrap gap-6 items-center">
                                <a
                                    href={settings?.telegramLink || "https://t.me/boostnaija1"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-5 px-12 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-[#0088cc]/30 group"
                                >
                                    <Send size={24} className="group-hover:rotate-12 transition-transform" /> JOIN CHANNEL <ArrowRight size={20} />
                                </a>

                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-dark-bg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-white dark:border-dark-bg bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                                        +5k
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <CommunityFeature
                                icon={<Users className="text-[#0088cc]" size={28} />}
                                title="Admin Support"
                                desc="Direct support for all complaints"
                            />
                            <CommunityFeature
                                icon={<Zap className="text-yellow-500" size={28} />}
                                title="Flash Sales"
                                desc="Up to 60% OFF bulk orders"
                            />
                            <CommunityFeature
                                icon={<Send className="text-blue-400" size={28} />}
                                title="Live Proofs"
                                desc="Success feed of all trades"
                            />
                            <CommunityFeature
                                icon={<ArrowRight className="text-primary" size={28} />}
                                title="Daily Drops"
                                desc="Fresh logs every 6 hours"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const CommunityFeature = ({ icon, title, desc }) => (
    <div className="glass p-8 rounded-3xl border-gray-200 dark:border-white/5 bg-[#faf9f6] dark:bg-white/5 hover:bg-[#f5f4f0] dark:hover:bg-white/10 transition-all shadow-sm">
        <div className="mb-6">{icon}</div>
        <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{desc}</p>
    </div>
);

export default TelegramCommunity;
