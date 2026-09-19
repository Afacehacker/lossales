import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { ShieldCheck, Send, Twitter, Github, Rocket } from 'lucide-react';

const Footer = () => {
    const { settings } = useContext(SettingsContext);
    return (
        <footer className="hidden md:block bg-white border-t border-pink-100 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="text-3xl font-black mb-6 flex items-center gap-1 group w-max">
                        <div className="bg-gradient-to-tr from-pink-600 via-rose-600 to-pink-500 text-white p-2 rounded-xl shadow-md shadow-pink-500/30">
                            <Rocket size={24} fill="currentColor" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-800 to-rose-600 font-extrabold">
                            LOGS<span className="text-pink-600">=SALES</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 leading-relaxed text-lg max-w-sm font-medium">
                        The world's most trusted marketplace for verified social media accounts and digital assets.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-8 text-pink-950 uppercase tracking-widest text-xs">Marketplace</h4>
                    <ul className="space-y-4 text-gray-500 font-medium">
                        <li><Link to="/shop" className="hover:text-pink-600 transition-colors">All Accounts</Link></li>
                        <li><Link to="/shop?platform=instagram" className="hover:text-pink-600 transition-colors">Instagram Logs</Link></li>
                        <li><Link to="/shop?platform=twitter" className="hover:text-pink-600 transition-colors">Twitter (X) Hub</Link></li>
                        <li><Link to="/shop?platform=facebook" className="hover:text-pink-600 transition-colors">Facebook Assets</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-8 text-[#1f2231] uppercase tracking-widest text-xs">Community</h4>
                    <p className="text-gray-500 text-sm mb-6 max-w-[200px] font-medium">For inquiries and support, join our Telegram:</p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <SocialIcon icon={<Send size={20} className="text-white -ml-0.5 mt-0.5" fill="currentColor" />} href={settings?.telegramLink || "https://t.me/boostnaija1"} bg="bg-[#0088cc]" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 text-sm font-bold">
                <div className="flex items-center gap-6">
                    <p>© 2026 LOGS=SALES®.</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                        <ShieldCheck size={18} /> <span className="uppercase tracking-tighter">SSL SECURED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon, href, bg }) => (
    <a
        href={href}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${bg || 'bg-gray-100 text-gray-600'}`}
    >
        {icon}
    </a>
);

export default Footer;
