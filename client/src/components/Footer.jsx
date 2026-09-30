import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { ShieldCheck, Send, Rocket } from 'lucide-react';

const Footer = () => {
    const { settings } = useContext(SettingsContext);
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-pink-100 dark:border-slate-800 pt-16 pb-28 md:pb-12 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 mb-12 text-center md:text-left">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="text-2xl md:text-3xl font-black mb-4 flex items-center gap-2 justify-center md:justify-start group">
                        <div className="p-2 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-amber-400 text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
                            <Rocket size={22} fill="currentColor" className="transform -rotate-12" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <div className="flex items-center gap-1">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-pink-700 to-rose-600 dark:from-white dark:via-pink-200 dark:to-pink-400 font-black tracking-tighter text-xl md:text-2xl">
                                    LOGS<span className="text-pink-600 dark:text-pink-400">=SALES</span>
                                </span>
                                <span className="text-[9px] bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                                    2027
                                </span>
                            </div>
                        </div>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base max-w-sm font-medium mx-auto md:mx-0">
                        The world's premier marketplace for verified social media accounts, advertising logs, and digital tools. 1-Minute automated delivery guaranteed.
                    </p>
                </div>

                <div>
                    <h4 className="font-extrabold mb-4 text-pink-950 dark:text-white uppercase tracking-widest text-xs">Marketplace</h4>
                    <ul className="space-y-2.5 text-xs md:text-sm text-gray-600 dark:text-gray-400 font-semibold">
                        <li><Link to="/shop" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">All Accounts</Link></li>
                        <li><Link to="/shop?platform=instagram" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Instagram Logs</Link></li>
                        <li><Link to="/shop?platform=twitter" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Twitter (X) Hub</Link></li>
                        <li><Link to="/shop?platform=facebook" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Facebook Assets</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-extrabold mb-4 text-pink-950 dark:text-white uppercase tracking-widest text-xs">Support & Community</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 font-medium">Need help or bulk orders? Join our official Telegram:</p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <SocialIcon icon={<Send size={20} className="text-white -ml-0.5 mt-0.5" fill="currentColor" />} href={settings?.telegramLink || "https://t.me/boostnaija1"} bg="bg-[#0088cc]" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 dark:text-gray-500 text-xs font-bold">
                <p>© 2027 LOGS=SALES®. All rights reserved.</p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck size={16} /> <span className="uppercase tracking-tighter text-[11px] font-extrabold">256-BIT SSL SECURED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon, href, bg }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${bg || 'bg-gray-100 text-gray-600'}`}
    >
        {icon}
    </a>
);

export default Footer;
