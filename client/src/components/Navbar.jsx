import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import LogoIcon from './LogoIcon';
import { LogOut, LayoutDashboard, Download, Rocket, Send, Sun, Moon, ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { settings } = useContext(SettingsContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 px-4 py-3 border-b border-pink-100 dark:border-slate-800 shadow-sm shadow-pink-500/5 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-2">
                    {/* 2027 Standard Cyber Logo */}
                    <Link to="/" className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2.5 group">
                        <LogoIcon className="w-9 h-9" />
                        <div className="flex flex-col leading-none">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-pink-700 to-rose-600 dark:from-white dark:via-pink-200 dark:to-pink-400 font-black tracking-tighter text-lg md:text-xl">
                                LOGS<span className="text-pink-600 dark:text-pink-400">=SALES</span>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 hidden sm:block mt-0.5">
                                VERIFIED LOGS HUB
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Light/Dark Theme"
                        className="p-2 rounded-2xl bg-pink-50 dark:bg-slate-800 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all shadow-xs"
                    >
                        {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-pink-600" />}
                    </button>

                    {(user?.isAdmin || user?.name?.toLowerCase().includes('admin')) && (
                        <Link to="/admin" className="flex items-center gap-1 text-[10px] md:text-xs font-black text-pink-600 dark:text-pink-400 hover:text-pink-800 bg-pink-50 dark:bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-200 dark:border-pink-800 transition-colors">
                            <Rocket size={14} /> <span className="hidden sm:inline">ADMIN</span>
                        </Link>
                    )}
                    
                    {/* Wallet Balance Widget */}
                    <Link to="/wallet" className="flex items-center gap-2 bg-pink-50/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-pink-200 dark:border-slate-700 hover:bg-pink-100 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <div className="text-white bg-gradient-to-r from-pink-600 to-rose-600 p-1 rounded-full shadow-xs"><Send size={11} className="rotate-45" /></div>
                        <span className="font-extrabold text-pink-950 dark:text-pink-200 tracking-tight text-xs md:text-sm">₦{(user?.balance || 0).toLocaleString()}</span>
                    </Link>
                </div>
            </nav>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex bg-white/80 dark:bg-slate-900/80 border-b border-pink-100 dark:border-slate-800 py-3 px-6 justify-center items-center gap-8 transition-colors duration-300">
               <Link to="/" className={`font-semibold text-sm transition-colors ${location.pathname === '/' ? 'text-pink-600 dark:text-pink-400 font-black' : 'text-gray-600 dark:text-gray-300 hover:text-pink-600'}`}>Home</Link>
               <Link to="/shop" className={`font-semibold text-sm transition-colors ${location.pathname === '/shop' ? 'text-pink-600 dark:text-pink-400 font-black' : 'text-gray-600 dark:text-gray-300 hover:text-pink-600'}`}>Marketplace</Link>
               <Link to="/dashboard" className={`font-semibold text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-pink-600 dark:text-pink-400 font-black' : 'text-gray-600 dark:text-gray-300 hover:text-pink-600'}`}>My Orders</Link>
               <a href={settings?.telegramLink || "https://t.me/boostnaija1"} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600">Telegram Support</a>
               {user ? (
                   <button onClick={handleLogout} className="font-semibold text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1">
                       <LogOut size={16} /> Log Out
                   </button>
               ) : (
                   <Link to="/login" className="font-extrabold text-sm text-pink-600 dark:text-pink-400 hover:underline">
                       Login / Register
                   </Link>
               )}
            </div>

            {/* Bottom Navigation for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-pink-100 dark:border-slate-800 pb-safe pb-4 shadow-lg shadow-pink-500/10 transition-colors duration-300">
                <div className="flex justify-around items-end px-2 pt-3 pb-2">
                    <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                        <div className={`p-1 ${location.pathname === '/' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radar"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.25 16.23"/><path d="M12 18h.01"/><path d="M17.65 11.5A6 6 0 0 0 11.66 5.5"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Home</span>
                    </Link>

                    <Link to="/shop" className={`flex flex-col items-center gap-1 ${location.pathname === '/shop' ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                        <div className="p-1">
                            <ShoppingBag size={22} />
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Shop</span>
                    </Link>

                    <Link to="/wallet" className={`flex flex-col items-center gap-1 ${location.pathname === '/wallet' ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                        <div className="p-1">
                            <Download strokeWidth={2} size={22} className="rotate-180" />
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Wallet</span>
                    </Link>

                    <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                        <div className="p-1">
                           <LayoutDashboard strokeWidth={2} size={22} />
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Orders</span>
                    </Link>

                    {(user?.isAdmin || user?.name?.toLowerCase().includes('admin')) && (
                        <Link to="/admin" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/admin') ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                            <div className="p-1">
                                <Rocket strokeWidth={2} size={22} />
                            </div>
                            <span className="text-[10px] whitespace-nowrap">Admin</span>
                        </Link>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-pink-600">
                             <div className="p-1">
                                 <LogOut strokeWidth={2} size={22} className="rotate-180" />
                             </div>
                             <span className="text-[10px] whitespace-nowrap">Log Out</span>
                        </button>
                    ) : (
                        <Link to="/login" className="flex flex-col items-center gap-1 text-pink-600 dark:text-pink-400 font-bold">
                            <div className="p-1 text-pink-600 dark:text-pink-400">
                                <LogOut strokeWidth={2} size={22} className="rotate-180" />
                            </div>
                            <span className="text-[10px] whitespace-nowrap">Log In</span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
