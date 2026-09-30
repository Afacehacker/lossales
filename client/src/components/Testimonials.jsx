import { Star, ShieldCheck, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "David O.",
        role: "Digital Marketer",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        text: "LOGS=SALES is a lifesaver! Bought 5 aged Facebook accounts with zero login issues. Instant auto-delivery straight to my order dashboard!",
        date: "2 days ago",
        verified: true
    },
    {
        name: "Sandra K.",
        role: "E-Commerce Agency Lead",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        text: "Super fast support and reliable Instagram logs with high follower counts. Funding the wallet was smooth and automated. Highly recommended!",
        date: "1 week ago",
        verified: true
    },
    {
        name: "Emeka P.",
        role: "Crypto Trader & Influencer",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
        rating: 5,
        text: "The replacement guarantee is real. One log had an issue and support swapped it within 5 minutes. Best market online right now!",
        date: "3 days ago",
        verified: true
    }
];

const Testimonials = () => {
    return (
        <section className="py-12 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                    <ShieldCheck size={14} /> 100% Verified Feedback
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-pink-950 dark:text-white tracking-tight">
                    Trusted By Thousands Of Marketers ⭐️
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium max-w-lg mx-auto mt-2">
                    Here's what our daily active buyers have to say about our instant delivery & replacement policy.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white dark:bg-slate-900/80 border border-pink-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-pink-500/5 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            {/* Rating Stars */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex text-amber-400 gap-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <Quote size={24} className="text-pink-200 dark:text-slate-700" />
                            </div>

                            <p className="text-gray-700 dark:text-slate-300 text-sm font-medium leading-relaxed mb-6 italic">
                                "{item.text}"
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800/80 pt-4">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={item.avatar} 
                                    alt={item.name} 
                                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/30" 
                                />
                                <div>
                                    <h4 className="font-extrabold text-sm text-pink-950 dark:text-white flex items-center gap-1">
                                        {item.name}
                                        {item.verified && (
                                            <span className="text-pink-600 dark:text-pink-400 text-xs font-bold" title="Verified Buyer">✓</span>
                                        )}
                                    </h4>
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block">{item.role}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{item.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
