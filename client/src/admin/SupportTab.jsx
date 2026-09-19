import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { useChat } from '../context/ChatContext';
import { Send, Search, Filter, CheckCircle, Clock, AlertCircle, Image as ImageIcon, Check, X, Download, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SupportTab = () => {
    const [conversations, setConversations] = useState([]);
    const { messages, setMessages, activeChat, setActiveChat, sendMessage, socket, markSeen, isTyping } = useChat();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [adminInput, setAdminInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeChat) {
            markSeen(activeChat.user._id);
        }
    }, [activeChat, messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/chats');
            setConversations(data);
        } catch (error) {
            toast.error('Failed to load conversations');
        }
        setLoading(false);
    };

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        setMessages(chat.messages);
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if ((!adminInput.trim() && !uploading) || !activeChat) return;

        const text = adminInput.trim();
        setAdminInput('');

        await sendMessage(text, null, activeChat.user._id);
        
        if (socket) {
            socket.emit('typing', { senderId: 'admin', receiverId: activeChat.user._id, isTyping: false, isAdmin: true });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !activeChat) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data: imageUrl } = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await sendMessage("", imageUrl, activeChat.user._id);
            toast.success('Photo sent');
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to send photo');
        } finally {
            setUploading(false);
        }
    };

    const handleTyping = (e) => {
        setAdminInput(e.target.value);
        if (socket && activeChat) {
            socket.emit('typing', { senderId: 'admin', receiverId: activeChat.user._id, isTyping: e.target.value.length > 0, isAdmin: true });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const updateStatus = async (status) => {
        if (!activeChat) return;
        try {
            await API.put(`/chats/${activeChat._id}/status`, { status });
            setActiveChat({ ...activeChat, status });
            toast.success(`Marked as ${status}`);
            fetchConversations();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleApproveDeposit = async (msg) => {
        if (!activeChat || !msg.image) return;
        const amount = prompt("Enter deposit amount to credit:");
        if (!amount || isNaN(amount)) return;

        try {
            await API.post('/chats/deposit/approve', {
                userId: activeChat.user._id,
                amount: Number(amount),
                imageUrl: msg.image
            });
            toast.success('Deposit approved and credited!');
            fetchConversations();
        } catch (error) {
            toast.error('Failed to approve deposit');
        }
    };

    const handleRejectDeposit = async (msg) => {
        if (!activeChat) return;
        const reason = prompt("Enter rejection reason (optional):") || "Invalid receipt or payment not found.";
        
        try {
            await sendMessage(`❌ Your deposit request was rejected. Reason: ${reason}`, null, activeChat.user._id);
            toast.success('Rejection message sent');
        } catch (error) {
            toast.error('Failed to send rejection');
        }
    };

    const filteredConversations = (Array.isArray(conversations) ? conversations : []).filter(c => 
        c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[700px] bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Sidebar: Conv List */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : (
                        filteredConversations.map(chat => (
                            <div 
                                key={chat._id} 
                                onClick={() => handleSelectChat(chat)}
                                className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-gray-50 flex items-center gap-4 ${activeChat?._id === chat._id ? 'bg-white border-l-4 border-primary' : ''}`}
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                    {chat.user?.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-gray-900 truncate">{chat.user?.name}</h4>
                                        <span className="text-[10px] text-gray-400">{new Date(chat.lastMessage).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                        {(Array.isArray(chat?.messages) && chat.messages.length > 0) ? chat.messages[chat.messages.length - 1]?.message : 'No messages'}
                                    </p>
                                </div>
                                {chat.unreadCountAdmin > 0 && (
                                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {chat.unreadCountAdmin}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                                {activeChat.user?.name?.[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{activeChat.user?.name}</h3>
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{activeChat.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select 
                                value={activeChat.status} 
                                onChange={(e) => updateStatus(e.target.value)}
                                className="text-xs font-bold border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="open">Open</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                activeChat.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {activeChat.status}
                            </span>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                        {Array.isArray(messages) && messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] group ${msg.sender === 'admin' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                                    <div className={`p-4 rounded-2xl shadow-sm ${
                                        msg.sender === 'admin' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                        {msg.message && <p className="text-sm leading-relaxed">{msg.message}</p>}
                                        {msg.image && (
                                            <div className="relative mt-3 group-chat">
                                                <img src={msg.image} alt="Upload" className="rounded-xl border border-gray-200 max-h-60 object-contain cursor-pointer" onClick={() => window.open(msg.image)} />
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <a href={msg.image} download className="p-2 bg-black/50 text-white rounded-lg hover:bg-black transition-colors backdrop-blur-sm"><Download size={14} /></a>
                                                    {msg.sender === 'user' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleApproveDeposit(msg)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-600 transition-all shadow-lg active:scale-95">
                                                                <CheckCircle size={14} /> APPROVE
                                                            </button>
                                                            <button onClick={() => handleRejectDeposit(msg)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-600 transition-all shadow-lg active:scale-95">
                                                                <X size={14} /> REJECT
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <p className={`text-[10px] mt-2 opacity-60 font-medium ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <span className="text-[10px] text-gray-400 font-bold animate-pulse uppercase tracking-wider">User is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex items-center gap-4">
                        <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-2">
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || !activeChat} />
                            {uploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <ImageIcon size={24} />}
                        </label>
                        <textarea 
                            rows="1"
                            value={adminInput}
                            onChange={handleTyping}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a reply..."
                            className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                        />
                        <button type="submit" disabled={!adminInput.trim() && !uploading} className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send size={24} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/10">
                    <MessageCircle size={64} className="mb-4 opacity-10" />
                    <p className="font-bold">Select a conversation to start chatting</p>
                    <p className="text-xs uppercase tracking-widest mt-2">2026 Admin Portal v2.0</p>
                </div>
            )}
        </div>
    );
};

export default SupportTab;
