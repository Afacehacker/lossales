import { useState, useEffect } from 'react';
import { X, Trash } from 'lucide-react';
import API from '../services/api';
import { toast } from 'react-hot-toast';

const AddListingModal = ({ isOpen, onClose, onSuccess, listing = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        platform: 'Instagram',
        type: 'Aged',
        description: '',
        price: '',
        stock: '1',
        credentials: '',
        image: '',
        media: []
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (listing) {
                setFormData({
                    title: listing.title || '',
                    platform: listing.platform || 'Instagram',
                    type: listing.type || 'Aged',
                    description: listing.description || '',
                    price: listing.price || '',
                    stock: listing.stock || '1',
                    credentials: listing.credentials || '',
                    image: listing.image || '',
                    media: listing.media || []
                });
            } else {
                setFormData({
                    title: '',
                    platform: 'Instagram',
                    type: 'Aged',
                    description: '',
                    price: '',
                    stock: '1',
                    credentials: '',
                    image: '',
                    media: []
                });
            }
        }
    }, [listing, isOpen]);

    if (!isOpen) return null;

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadData = new FormData();
        files.forEach(file => {
            uploadData.append('files', file); // 'files' is handled by upload.any()
        });

        setUploading(true);

        try {
            const { data } = await API.post('/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle both single string and array of strings
            const newUrls = Array.isArray(data) ? data : [data];
            const updatedMedia = [...(formData.media || []), ...newUrls];

            setFormData({
                ...formData,
                media: updatedMedia,
                image: updatedMedia[0] || '' // Fallback first image for compatibility
            });
            
            toast.success(`${files.length} file(s) Uploaded`);
            setUploading(false);
        } catch (error) {
            toast.error('File upload failed');
            setUploading(false);
        }
    };

    const removeMediaItem = (idxToRemove) => {
        const updatedMedia = (formData.media || []).filter((_, idx) => idx !== idxToRemove);
        setFormData({
            ...formData,
            media: updatedMedia,
            image: updatedMedia[0] || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (listing) {
                await API.put(`/accounts/${listing._id}`, formData);
                toast.success('Listing updated successfully!');
            } else {
                await API.post('/accounts', formData);
                toast.success('Listing added successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#faf9f6] dark:bg-[#1e293b] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative border border-gray-200 dark:border-white/10">
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {listing ? 'Edit Product Listing' : 'Add New Listing'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                                placeholder="E.g., 2018 Verified Instagram"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Platform</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            >
                                <option value="Instagram">Instagram</option>
                                <option value="Twitter (X)">Twitter (X)</option>
                                <option value="Facebook">Facebook</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Snapchat">Snapchat</option>
                                <option value="Discord">Discord</option>
                                <option value="Tools">Tools</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Account Type</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Aged">Aged</option>
                                <option value="Verified">Verified</option>
                                <option value="High Follower">High Follower</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (₦)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                                placeholder="E.g., 150"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock Amount</label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Upload Images/Videos (Select Multiple)</label>
                            <input
                                type="file"
                                id="image-file"
                                accept="image/*,video/*"
                                multiple
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white cursor-pointer"
                                onChange={uploadFileHandler}
                            />
                            {uploading && <p className="text-xs text-primary mt-1">Uploading media...</p>}
                        </div>
                    </div>

                    {/* Media Gallery Grid */}
                    {formData.media && formData.media.length > 0 && (
                        <div className="border-t border-gray-150 dark:border-white/10 pt-4">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Product Gallery ({formData.media.length} items)
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-gray-100 dark:bg-white/5 rounded-2xl">
                                {formData.media.map((url, idx) => {
                                    const isVideo = url.includes('/video/upload/') || url.match(/\.(mp4|mov|avi|webm)$/i);
                                    return (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 dark:border-white/10 bg-black flex items-center justify-center">
                                            {isVideo ? (
                                                <video src={url} className="w-full h-full object-cover" muted playsInline />
                                            ) : (
                                                <img src={url} className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeMediaItem(idx)}
                                                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-extrabold text-xs rounded-xl gap-1"
                                            >
                                                <Trash size={12} /> Remove
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Credentials (For Buyer Only)</label>
                        <textarea
                            required
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                            placeholder="username:password / Email details (Only visible after purchase)"
                            value={formData.credentials}
                            onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Public Description</label>
                        <textarea
                            required
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                            placeholder="What makes this account special?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button disabled={loading || uploading} type="submit" className="btn-primary py-3 px-8 text-sm">
                            {(loading || uploading) ? 'Please wait...' : (listing ? 'Save Changes' : 'Add to Market')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddListingModal;
