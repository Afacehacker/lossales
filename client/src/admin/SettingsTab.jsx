import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { Save, Banknote, Link } from 'lucide-react';

const SettingsTab = () => {
    const [settings, setSettings] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        telegramLink: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/settings');
            if (data) {
                setSettings({
                    bankName: data.bankName || '',
                    accountName: data.accountName || '',
                    accountNumber: data.accountNumber || '',
                    telegramLink: data.telegramLink || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.put('/settings', settings);
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="p-4 md:p-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Platform Settings</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Bank Details Section */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Banknote size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Bank Account Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Bank Name</label>
                            <input 
                                type="text" 
                                name="bankName"
                                value={settings.bankName} 
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="e.g. Rubies Microfinance Bank"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Account Name</label>
                            <input 
                                type="text" 
                                name="accountName"
                                value={settings.accountName} 
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="e.g. Afeez Salaudeen"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                            <input 
                                type="text" 
                                name="accountNumber"
                                value={settings.accountNumber} 
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono font-bold tracking-wider"
                                placeholder="e.g. 8025329616"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Link size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Telegram Link</label>
                        <input 
                            type="url" 
                            name="telegramLink"
                            value={settings.telegramLink} 
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-blue-600"
                            placeholder="https://t.me/yourlink"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save size={20} />
                        )}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsTab;
