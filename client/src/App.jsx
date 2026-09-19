import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import API from './services/api';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import AdminDashboard from './admin/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    // Keep Render Backend Awake while the tab is open
    useEffect(() => {
        const pingServer = () => {
            API.get('/ping').catch(() => { });
        };
        // Ping immediately on load
        pingServer();

        // Ping every 10 minutes (600000ms) to prevent render from sleeping
        const interval = setInterval(pingServer, 600000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <SettingsProvider>
                    <ChatProvider>
                        <div className="min-h-screen bg-[#f8fafc] text-[#1f2231] flex flex-col">
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: '#1e293b',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                    },
                                }}
                            />
                            <Navbar />
                            <main className="flex-grow relative">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/shop" element={<Shop />} />
                                    <Route path="/shop/:id" element={<ProductDetail />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/wallet" element={
                                        <ProtectedRoute>
                                            <Wallet />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/*" element={
                                        <AdminRoute>
                                            <AdminDashboard />
                                        </AdminRoute>
                                    } />
                                </Routes>
                                <ChatWidget />
                            </main>
                            <Footer />
                        </div>
                    </ChatProvider>
                    </SettingsProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
