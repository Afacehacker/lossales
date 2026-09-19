import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        bankName: 'Rubies Microfinance Bank',
        accountName: 'Afeez Salaudeen',
        accountNumber: '8025329616',
        telegramLink: 'https://t.me/boostnaija1'
    });
    const [settingsLoading, setSettingsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await API.get('/settings');
                if (data) {
                    setSettings(data);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setSettingsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, settingsLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};
