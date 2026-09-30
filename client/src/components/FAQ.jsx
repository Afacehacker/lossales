import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';

const faqs = [
    {
        q: "How fast will I receive my accounts after payment?",
        a: "Delivery is 100% automated and instant. As soon as you purchase an item using your wallet balance, the credentials (email, password, 2FA key, cookies/tokens) will instantly appear in your My Orders dashboard."
    },
    {
        q: "What is your 24-Hour Replacement Warranty?",
        a: "We offer a guaranteed 100% replacement if any log or account has invalid credentials or login restrictions upon purchase. Simply submit a quick ticket or reach out on Telegram within 24 hours for a instant replacement."
    },
    {
        q: "How do I fund my LOGS=SALES wallet?",
        a: "You can fund your wallet via automatic Bank Transfer, Debit Card, or Cryptocurrency (USDT/BTC/LTC). Once confirmed, your wallet balance updates immediately so you can shop anytime."
    },
    {
        q: "Are the social media accounts pre-checked and aged?",
        a: "Yes! All accounts undergo rigorous quality checks. Our Facebook, Instagram, Twitter/X, and Telegram accounts are aged with real activity history to guarantee high trust scores."
    },
    {
        q: "Can I order custom or bulk accounts?",
        a: "Absolutely! If you require custom accounts in bulk or specialized tools not listed on the store, click our Telegram Support button to speak directly with an account specialist."
    }
];

const FAQ = () => {
    const [selected, setSelected] = useState(0);

    return (
        <section className="py-16 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                    <HelpCircle size={14} /> Got Questions? We Have Answers
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-pink-950 dark:text-white tracking-tight">
                    Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium max-w-md mx-auto mt-2">
                    Everything you need to know about purchasing verified digital assets securely.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div 
                        key={i} 
                        className="bg-white dark:bg-slate-900/80 rounded-2xl overflow-hidden border border-pink-100 dark:border-slate-800 shadow-sm transition-all"
                    >
                        <button
                            onClick={() => setSelected(selected === i ? null : i)}
                            className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-pink-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <span className="font-extrabold text-sm md:text-base text-pink-950 dark:text-white pr-4">
                                {faq.q}
                            </span>
                            <div className="p-2 rounded-xl bg-pink-100 dark:bg-slate-800 text-pink-600 dark:text-pink-300 shrink-0">
                                {selected === i ? <Minus size={18} /> : <Plus size={18} />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {selected === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-5 md:px-6 pb-6 text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-medium border-t border-gray-100 dark:border-slate-800/60 pt-4"
                                >
                                    {faq.a}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
