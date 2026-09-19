import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await API.get('/users/profile');
            setUser(prev => {
                if (!prev) return data;
                const updatedUser = { ...prev, ...data };
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                return updatedUser;
            });
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    }, []);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            fetchUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [fetchUser]);

    const login = useCallback(async (email, password) => {
        const { data } = await API.post('/users/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        return data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const { data } = await API.post('/users', { name, email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
