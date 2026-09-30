import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Login Successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf2f8] dark:bg-[#090d16] flex flex-col items-center justify-center px-4 py-12 pb-28 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-pink-100 dark:border-slate-800">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-200 dark:border-slate-700">
                        <LogIn className="text-pink-600 dark:text-pink-400" size={30} />
                    </div>
                    <h2 className="text-2xl font-black text-pink-950 dark:text-white tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">Access your digital account vault and order history.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-pink-950 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                className="w-full bg-pink-50/50 dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-pink-950 dark:text-white font-bold outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition-all text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yours@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-pink-950 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                className="w-full bg-pink-50/50 dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-pink-950 dark:text-white font-bold outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition-all text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:opacity-95 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 mt-2 active:scale-95 text-sm">
                        LOGIN TO PORTAL <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 dark:text-gray-400 font-medium text-xs">
                    Don't have an account? <Link to="/register" className="text-pink-600 dark:text-pink-400 font-extrabold hover:underline">Register now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
