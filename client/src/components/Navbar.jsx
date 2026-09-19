import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { Clock, HelpCircle, LogOut, LayoutDashboard, Download, Rocket, Send } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { settings } = useContext(SettingsContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className="bg-white sticky top-0 z-50 px-4 py-3 border-b border-pink-100 shadow-sm shadow-pink-500/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 group">
                        <div className="bg-gradient-to-tr from-pink-600 via-rose-600 to-pink-500 text-white p-1.5 rounded-xl shadow-md shadow-pink-500/30">
                            <Rocket size={20} fill="currentColor" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-800 to-rose-600 font-extrabold">
                            LOGS<span className="text-pink-600">=SALES</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {(user?.isAdmin || user?.name?.toLowerCase().includes('admin')) && (
                        <Link to="/admin" className="flex items-center gap-1 text-[10px] md:text-xs font-extrabold text-pink-600 hover:text-pink-800 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 transition-colors">
                            <Rocket size={14} /> <span className="hidden sm:inline">ADMIN</span>
                        </Link>
                    )}
                    
                    {/* Wallet Balance Widget */}
                    <Link to="/wallet" className="flex items-center gap-2 bg-pink-50/80 px-3.5 py-1.5 rounded-full border border-pink-200 hover:bg-pink-100 transition-colors shadow-sm">
                        <div className="text-white bg-gradient-to-r from-pink-600 to-rose-600 p-1 rounded-full shadow-xs"><Send size={11} className="rotate-45" /></div>
                        <span className="font-extrabold text-pink-950 tracking-tight text-sm">₦{(user?.balance || 0).toLocaleString()}</span>
                    </Link>
                </div>
            </nav>

            {/* Desktop Navigation (if needed, otherwise hide) */}
            <div className="hidden md:flex bg-white border-b border-gray-100 py-3 px-6 justify-center gap-8">
               <Link to="/" className={`font-semibold ${location.pathname === '/' ? 'text-primary' : 'text-gray-500'}`}>Home</Link>
               <Link to="/shop" className={`font-semibold ${location.pathname === '/shop' ? 'text-primary' : 'text-gray-500'}`}>Marketplace</Link>
               <Link to="/dashboard" className={`font-semibold ${location.pathname === '/dashboard' ? 'text-primary' : 'text-gray-500'}`}>Orders</Link>
               <a href={settings?.telegramLink || "https://t.me/boostnaija1"} className="font-semibold text-gray-500">Contact</a>
               {user ? (
                   <button onClick={handleLogout} className="font-semibold text-red-500">Log Out</button>
               ) : (
                   <Link to="/login" className="font-semibold text-primary">Login</Link>
               )}
            </div>

            {/* Bottom Navigation for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pink-100 pb-safe pb-4 shadow-lg shadow-pink-500/10">
                <div className="flex justify-around items-end px-2 pt-3 pb-2">
                    <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-pink-600 font-bold' : 'text-gray-400'}`}>
                        <div className={`p-1 ${location.pathname === '/' ? 'text-pink-600' : 'text-gray-400'}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radar"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.25 16.23"/><path d="M12 18h.01"/><path d="M17.65 11.5A6 6 0 0 0 11.66 5.5"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Home</span>
                    </Link>

                    <Link to="/shop" className={`flex flex-col items-center gap-1 ${location.pathname === '/shop' ? 'text-pink-600 font-bold' : 'text-gray-400'}`}>
                        <div className="p-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Shop</span>
                    </Link>

                    <Link to="/wallet" className={`flex flex-col items-center gap-1 ${location.pathname === '/wallet' ? 'text-pink-600 font-bold' : 'text-gray-400'}`}>
                        <div className="p-1">
                            <Download strokeWidth={2} size={22} className="rotate-180" />
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Wallet</span>
                    </Link>

                    <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-pink-600 font-bold' : 'text-gray-400'}`}>
                        <div className="p-1">
                           <LayoutDashboard strokeWidth={2} size={22} />
                        </div>
                        <span className="text-[10px] whitespace-nowrap">Orders</span>
                    </Link>

                    {(user?.isAdmin || user?.name?.toLowerCase().includes('admin')) && (
                        <Link to="/admin" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/admin') ? 'text-pink-600 font-bold' : 'text-gray-400'}`}>
                            <div className="p-1">
                                <Rocket strokeWidth={2} size={22} />
                            </div>
                            <span className="text-[10px] whitespace-nowrap">Admin</span>
                        </Link>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                             <div className="p-1">
                                 <LogOut strokeWidth={2} size={22} className="rotate-180" />
                             </div>
                             <span className="text-[10px] whitespace-nowrap">Log Out</span>
                        </button>
                    ) : (
                        <Link to="/login" className="flex flex-col items-center gap-1 text-pink-600 font-bold">
                            <div className="p-1 text-pink-600">
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
