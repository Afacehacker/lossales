import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast.success('Registration Successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-12 pb-24">
            <div className="w-full max-w-md bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-[14px] flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <UserPlus className="text-blue-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1f2231] tracking-tight mb-2">Create Account</h2>
                    <p className="text-gray-500 text-sm font-medium">Join our marketplace community today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1f2231] mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full bg-[#f8fafc] border border-gray-200 rounded-[14px] pl-12 pr-4 py-4 text-black font-bold focus:outline-none focus:border-blue-500 transition-colors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

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
                        CREATE ACCOUNT <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 font-medium text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
