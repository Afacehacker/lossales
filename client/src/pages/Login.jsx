import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 pb-20">
            <div className="w-full max-w-md bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-[14px] flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <LogIn className="text-blue-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1f2231] tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-sm font-medium">Access your digital vault and orders.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1f2231] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-[14px] pl-12 pr-4 py-4 text-black font-bold focus:outline-none focus:border-blue-500 transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yours@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1f2231] mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-[14px] pl-12 pr-4 py-4 text-black font-bold focus:outline-none focus:border-blue-500 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#1b2331] hover:bg-black text-white font-bold py-4 rounded-[14px] shadow-lg transition-colors flex items-center justify-center gap-2 mt-2">
                        LOGIN TO PORTAL <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 font-medium text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
