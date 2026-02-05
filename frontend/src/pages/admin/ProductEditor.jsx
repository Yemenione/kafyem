import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Plus, Search, Edit2, Trash2, ArrowLeft, Save,
    ShoppingBag, Layers, Image as ImageIcon, CheckCircle,
    Globe, Info, DollarSign, Package, Settings, Sparkles,
    Eye, EyeOff, UploadCloud, ChevronRight, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import ModernAdminPage from '../../components/admin/ModernAdminPage';

const ProductEditor = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    // UI State
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [activeTab, setActiveTab] = useState('basic');
    const [activeLang, setActiveLang] = useState('en');
    const [uploading, setUploading] = useState(false);

    // Data Lists
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'French' },
        { code: 'ar', label: 'Arabic' }
    ];

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_at_price: '',
        stock_quantity: 0,
        sku: '',
        category_id: '',
        brand_id: '',
        images: [],
        is_active: true,
        is_featured: false,
        weight: '',
        meta_title: '',
        meta_description: '',
        translations: {
            en: { name: '', description: '', meta_title: '', meta_description: '' },
            fr: { name: '', description: '', meta_title: '', meta_description: '' },
            ar: { name: '', description: '', meta_title: '', meta_description: '' }
        }
    });

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Parallel fetch for categories and brands
            const [catRes, brandRes] = await Promise.all([
                axios.get('/api/admin/categories', { headers }),
                axios.get('/api/admin/brands', { headers })
            ]);

            setCategories(catRes.data);
            setBrands(brandRes.data);

            if (isEdit) {
                const prodRes = await axios.get(`/api/admin/products/${id}`, { headers });
                const p = prodRes.data;

                let parsedImages = [];
                try {
                    parsedImages = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
                } catch (e) { parsedImages = []; }

                let parsedTranslations = {
                    en: { name: p.name, description: p.description, meta_title: p.meta_title || '', meta_description: p.meta_description || '' },
                    fr: { name: '', description: '', meta_title: '', meta_description: '' },
                    ar: { name: '', description: '', meta_title: '', meta_description: '' }
                };

                try {
                    if (p.translations) {
                        const tPayload = typeof p.translations === 'string' ? JSON.parse(p.translations) : p.translations;
                        parsedTranslations = { ...parsedTranslations, ...tPayload };
                    }
                } catch (e) { console.error("Translation parse error", e); }

                setFormData({
                    ...p,
                    category_id: p.category_id?.toString() || '',
                    brand_id: p.brand_id?.toString() || '',
                    images: parsedImages,
                    translations: parsedTranslations
                });
            }
        } catch (error) {
            toast.error(t('admin.products.loadFailed'));
        } finally {
            setFetching(false);
        }
    }, [id, isEdit, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTranslationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [activeLang]: {
                    ...prev.translations[activeLang],
                    [field]: value
                }
            },
            // Keep main fields in sync with English
            ...(activeLang === 'en' ? { [field]: value } : {})
        }));
    };

    const handleAutoTranslate = async () => {
        const source = formData.translations.en;
        if (!source.name) {
            toast.error(t('admin.categories.enterEnglishFirst'));
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/admin/translate', {
                text: source.name,
                targetLangs: languages.filter(l => l.code !== 'en').map(l => l.code)
            }, { headers: { Authorization: `Bearer ${token}` } });

            setFormData(prev => {
                const newTranslations = { ...prev.translations };
                Object.keys(res.data.translations).forEach(lang => {
                    newTranslations[lang] = {
                        ...newTranslations[lang],
                        name: res.data.translations[lang]
                    };
                });
                return { ...prev, translations: newTranslations };
            });
            toast.success(t('admin.categories.generated'));
        } catch (error) {
            toast.error(t('admin.categories.translationFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const uploadPromises = files.map(file => {
                const form = new FormData();
                form.append('file', file);
                form.append('folder', 'products');
                return axios.post('/api/admin/media/upload', form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            });

            const results = await Promise.all(uploadPromises);
            const newImages = results.map(r => r.data.path);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
            toast.success(t('admin.products.imageUploaded'));
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                stock_quantity: parseInt(formData.stock_quantity),
                category_id: formData.category_id ? parseInt(formData.category_id) : null,
                brand_id: formData.brand_id ? parseInt(brand_id) : null
            };

            if (isEdit) {
                await axios.put(`/api/admin/products/${id}`, payload, { headers });
            } else {
                await axios.post('/api/admin/products', payload, { headers });
            }

            toast.success(isEdit ? t('admin.products.updated') : t('admin.products.created'));
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.error || t('admin.common.operationFailed'));
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: t('admin.products.tabs.basic'), icon: Info },
        { id: 'pricing', label: t('admin.products.tabs.pricing'), icon: DollarSign },
        { id: 'inventory', label: t('admin.products.tabs.inventory'), icon: Package },
        { id: 'images', label: t('admin.products.tabs.images'), icon: ImageIcon },
        { id: 'seo', label: t('admin.products.tabs.seo'), icon: Globe }
    ];

    if (fetching) return (
        <ModernAdminPage title="..." description="...">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--coffee-brown)]"></div>
            </div>
        </ModernAdminPage>
    );

    return (
        <ModernAdminPage
            title={isEdit ? t('admin.products.editTitle') : t('admin.products.newTitle')}
            description={t('admin.products.subtitle')}
        >
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="flex items-center gap-2 text-gray-500 hover:text-zinc-900 transition-colors text-sm font-bold"
                    >
                        <ArrowLeft size={18} /> {t('admin.common.back')}
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            form="productForm"
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-black disabled:opacity-50"
                        >
                            {loading ? t('admin.common.saving') : <><Save size={18} /> {t('admin.common.save')}</>}
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-2 p-1 bg-gray-100/50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-white dark:bg-zinc-900 text-[var(--coffee-brown)] dark:text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden p-8">

                            {/* Language Switcher for Translatable Fields */}
                            {(activeTab === 'basic' || activeTab === 'seo') && (
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() => setActiveLang(lang.code)}
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeLang === lang.code
                                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                        : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                    {activeLang !== 'en' && (
                                        <button
                                            type="button"
                                            onClick={handleAutoTranslate}
                                            className="flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-colors border border-purple-100"
                                        >
                                            <Sparkles size={14} /> {t('admin.products.form.autoTranslate')}
                                        </button>
                                    )}
                                </div>
                            )}

                            {activeTab === 'basic' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.name')} ({activeLang.toUpperCase()})</label>
                                        <input
                                            required={activeLang === 'en'}
                                            type="text"
                                            className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold"
                                            value={formData.translations[activeLang]?.name || ''}
                                            onChange={e => handleTranslationChange('name', e.target.value)}
                                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.form.slug')}</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="slug"
                                                className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold text-gray-500"
                                                placeholder={t('admin.categories.autoGenerated')}
                                                value={formData.slug || ''}
                                                onChange={handleChange}
                                            />
                                            <Settings className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.form.description')} ({activeLang.toUpperCase()})</label>
                                        <textarea
                                            rows={8}
                                            className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold resize-none"
                                            value={formData.translations[activeLang]?.description || ''}
                                            onChange={e => handleTranslationChange('description', e.target.value)}
                                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.price')}</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    required
                                                    type="number"
                                                    step="0.01"
                                                    name="price"
                                                    className="w-full pl-12 pr-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-sm font-black"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.form.comparePrice')}</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="compare_at_price"
                                                    className="w-full pl-12 pr-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold text-gray-400 italic"
                                                    value={formData.compare_at_price || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-1">Marge Bénéficiaire</p>
                                                <p className="text-[10px] text-zinc-500 font-bold">Le système calcule automatiquement votre marge basée sur le prix de vente et les taxes.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">SKU</label>
                                            <input
                                                type="text"
                                                name="sku"
                                                className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-black"
                                                value={formData.sku || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.stock')}</label>
                                            <input
                                                required
                                                type="number"
                                                name="stock_quantity"
                                                className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-black"
                                                value={formData.stock_quantity}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('admin.products.form.weight')} (g)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold"
                                            value={formData.weight || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'images' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50">
                                                <img src={img} alt="Product" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                {idx === 0 && (
                                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-zinc-900/80 text-white text-[8px] font-black uppercase tracking-widest rounded-md backdrop-blur-sm">
                                                        Principal
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <label className={`aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-[var(--coffee-brown)]/40 hover:bg-gray-50/50 transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <UploadCloud className="text-gray-400" size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {uploading ? t('admin.common.uploading') : t('admin.products.form.addMedia')}
                                            </span>
                                            <input
                                                multiple
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>

                                    <p className="text-[10px] text-gray-400 font-bold text-center italic">
                                        Consigne : La première image sera utilisée comme image principale. JPG/PNG recommandé.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Meta Title ({activeLang.toUpperCase()})</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold"
                                            value={formData.translations[activeLang]?.meta_title || ''}
                                            onChange={e => handleTranslationChange('meta_title', e.target.value)}
                                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Meta Description ({activeLang.toUpperCase()})</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-5 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold resize-none"
                                            value={formData.translations[activeLang]?.meta_description || ''}
                                            onChange={e => handleTranslationChange('meta_description', e.target.value)}
                                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Settings size={14} className="text-[var(--coffee-brown)]" />
                                {t('admin.common.status')}
                            </h4>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${formData.is_active
                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                            : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                                        }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {formData.is_active ? t('admin.common.active') : t('admin.common.inactive')}
                                    </span>
                                    {formData.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${formData.is_featured
                                            ? 'bg-amber-50 border-amber-100 text-amber-700'
                                            : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                                        }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
                                    <Sparkles size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Organization Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                                <Layers size={14} className="text-[var(--coffee-brown)]" />
                                Organization
                            </h4>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Brand</label>
                                <select
                                    name="brand_id"
                                    value={formData.brand_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-200 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">Sélectionner une marque</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </ModernAdminPage>
    );
};

export default ProductEditor;
