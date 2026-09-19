import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
    {
        q: "Are the accounts safe to use?",
        a: "Yes, every account goes through a rigorous quality check. We ensure accounts are aged properly and have no active shadowbans or restrictions."
    },
    {
        q: "What is your refund policy?",
        a: "We offer a 100% replacement guarantee if the credentials provided do not work within the first 24 hours of purchase, provided you haven't violated our security rules."
    },
    {
        q: "How long until I receive my order?",
        a: "Delivery is near-instant. Most orders are automatically processed and delivered to your dashboard within 5-10 minutes of payment verification."
    },
    {
        q: "Do you accept custom orders?",
        a: "Yes! If you need specific types of accounts in bulk, please contact our support or join our WhatsApp community to speak with a broker."
    }
];

const FAQ = () => {
    const [selected, setSelected] = useState(null);

    return (
        <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-gray-900 dark:text-white">
                        <HelpCircle className="text-primary" /> FREQUENTLY <span className="text-primary-light">ASKED</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Everything you need to know about our trading process.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="glass rounded-3xl overflow-hidden border-gray-200 dark:border-white/5 bg-[#faf9f6]/80 dark:bg-white/5">
                            <button
                                onClick={() => setSelected(selected === i ? null : i)}
                                className="w-full flex items-center justify-between p-8 text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                <span className="font-bold text-lg text-gray-900 dark:text-white">{faq.q}</span>
                                <div className="p-2 rounded-full bg-primary/10 text-primary">
                                    {selected === i ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {selected === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-8 pb-8 text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
                                    >
                                        {faq.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
