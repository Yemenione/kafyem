import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit, Trash2, Save, X, Eye, EyeOff, UploadCloud } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import ModernAdminPage from '../../components/admin/ModernAdminPage';

const Categories = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [activeLang, setActiveLang] = useState(i18n.language || 'en');
    const [uploading, setUploading] = useState(false);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'French' },
        { code: 'ar', label: 'Arabic' }
    ];

    const [formData, setFormData] = useState({
        parent_id: '',
        name: '',
        slug: '',
        description: '',
        image_url: '',
        display_order: 0,
        is_active: 1,
        meta_title: '',
        meta_description: '',
        name_translations: { en: '', fr: '', ar: '' },
        description_translations: { en: '', fr: '', ar: '' },
        meta_title_translations: { en: '', fr: '', ar: '' },
        meta_description_translations: { en: '', fr: '', ar: '' }
    });

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (error) {
            console.error('Fetch categories error:', error);
            toast.error(t('admin.categories.loadFailed'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({
            parent_id: '',
            name: '',
            slug: '',
            description: '',
            image_url: '',
            display_order: 0,
            is_active: 1,
            name_translations: { en: '', fr: '', ar: '' },
            description_translations: { en: '', fr: '', ar: '' },
            meta_title_translations: { en: '', fr: '', ar: '' },
            meta_description_translations: { en: '', fr: '', ar: '' },
            meta_title: '',
            meta_description: ''
        });
        setIsModalOpen(true);
        setActiveLang('en');
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            parent_id: category.parent_id?.toString() || '',
            name: category.name,
            slug: category.slug,
            description: category.description,
            image_url: category.image_url,
            display_order: category.display_order,
            is_active: category.is_active,
            name_translations: category.name_translations || { en: category.name, fr: '', ar: '' },
            description_translations: category.description_translations || { en: category.description, fr: '', ar: '' },
            meta_title_translations: category.meta_title_translations || { en: category.meta_title, fr: '', ar: '' },
            meta_description_translations: category.meta_description_translations || { en: category.meta_description, fr: '', ar: '' },
            meta_title: category.meta_title,
            meta_description: category.meta_description
        });
        setIsModalOpen(true);
        setActiveLang('en');
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.products.confirmDelete'))) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(t('admin.categories.deleted'));
            fetchCategories();
        } catch (error) {
            toast.error(t('admin.categories.deleteFailed'));
        }
    };

    const handleAutoTranslate = async () => {
        const sourceText = formData.name_translations.en;
        if (!sourceText) {
            toast.error(t('admin.categories.enterEnglishFirst'));
            return;
        }

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/admin/translate', {
                text: sourceText,
                targetLangs: languages.filter(l => l.code !== 'en').map(l => l.code)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFormData(prev => ({
                ...prev,
                name_translations: { ...prev.name_translations, ...res.data.translations }
            }));
            toast.success(t('admin.categories.generated'));
        } catch (error) {
            toast.error(t('admin.categories.translationFailed'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";
        const method = editingCategory ? "put" : "post";

        try {
            const token = localStorage.getItem('token');
            const res = await axios({
                method,
                url,
                data: formData,
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(editingCategory ? t('admin.categories.updated') : t('admin.categories.created'));
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.error || t('admin.categories.operationFailed'));
        }
    };

    const getValue = (field) => {
        const translations = formData[`${field}_translations`];
        return translations ? translations[activeLang] : '';
    };

    const setValue = (field, val) => {
        setFormData(prev => {
            const translationKey = `${field}_translations`;
            const currentTranslations = prev[translationKey];

            return {
                ...prev,
                [translationKey]: {
                    ...currentTranslations,
                    [activeLang]: val
                },
                ...(activeLang === 'en' ? { [field]: val } : {})
            };
        });
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ModernAdminPage
            title={t('admin.sidebar.items.categories')}
            description={t('admin.categories.subtitle')}
        >
            <div className="space-y-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm font-bold"
                    >
                        <Plus size={18} /> {t('admin.products.addNew')}
                    </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 dark:border-zinc-800">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={t('admin.categories.searchPlaceholder')}
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">{t('admin.products.image')}</th>
                                    <th className="px-6 py-4">{t('admin.products.name')}</th>
                                    <th className="px-6 py-4">{t('admin.products.form.slug')}</th>
                                    <th className="px-6 py-4">{t('admin.categories.order')}</th>
                                    <th className="px-6 py-4">{t('admin.common.status')}</th>
                                    <th className="px-6 py-4 text-right">{t('admin.common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">{t('admin.common.loading')}</td></tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-sm text-gray-400">{t('admin.common.noResults')}</td></tr>
                                ) : (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all">
                                            <td className="px-6 py-3">
                                                <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                    {cat.image_url ? (
                                                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-300 text-[10px] uppercase">{t('admin.categories.noImg')}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 font-bold text-sm text-gray-900 dark:text-white">{cat.name}</td>
                                            <td className="px-6 py-3 text-xs text-gray-500 font-mono">{cat.slug}</td>
                                            <td className="px-6 py-3 text-sm text-gray-500 font-bold">{cat.display_order}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${cat.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                                                    }`}>
                                                    {cat.is_active ? t('admin.common.active') : t('admin.common.inactive')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(cat)} className="p-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl hover:bg-[var(--coffee-brown)] hover:text-white transition-all shadow-sm">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                                <h3 className="text-lg font-bold text-[var(--coffee-brown)] dark:text-white">
                                    {editingCategory ? t('admin.categories.editTitle') : t('admin.categories.newTitle')}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${activeLang === lang.code
                                                ? 'bg-zinc-900 text-white border-zinc-900'
                                                : 'bg-gray-50 text-gray-500 border-gray-100'
                                                }`}
                                        >
                                            {lang.code.toUpperCase()}
                                        </button>
                                    ))}
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 ml-2">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-5">
                                <form id="categoryForm" onSubmit={handleSubmit} className="space-y-5">
                                    {activeLang !== 'en' && (
                                        <button
                                            type="button"
                                            onClick={handleAutoTranslate}
                                            disabled={uploading}
                                            className="w-full py-2 bg-purple-50 text-purple-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 border border-purple-100"
                                        >
                                            ✨ {t('admin.categories.aiTranslate', { lang: languages.find(l => l.code === activeLang)?.label })}
                                        </button>
                                    )}

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('admin.products.name')} ({activeLang.toUpperCase()})</label>
                                        <input
                                            required={activeLang === 'en'}
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold"
                                            value={getValue('name')}
                                            onChange={e => setValue('name', e.target.value)}
                                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('admin.products.form.slug')}</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 rounded-xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold"
                                                placeholder={t('admin.categories.autoGenerated')}
                                                value={formData.slug}
                                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('admin.categories.order')}</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2.5 rounded-xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold"
                                                value={formData.display_order}
                                                onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('admin.products.form.description')} ({activeLang.toUpperCase()})</label>
                                        <textarea
                                            className="w-full px-4 py-2.5 rounded-xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold min-h-[80px]"
                                            value={getValue('description')}
                                            onChange={e => setValue('description', e.target.value)}
                                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('admin.categories.imageUrl')}</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 px-4 py-2.5 rounded-xl border-none bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--coffee-brown)]/20 transition-all outline-none text-sm font-bold"
                                                value={formData.image_url || ''}
                                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                            />
                                            <label className="p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                                                <UploadCloud size={20} className="text-gray-500" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    disabled={uploading}
                                                    onChange={async (e) => {
                                                        if (!e.target.files?.[0]) return;
                                                        setUploading(true);
                                                        const file = e.target.files[0];
                                                        const form = new FormData();
                                                        form.append('file', file);
                                                        form.append('folder', 'categories');
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const res = await axios.post('/api/admin/media/upload', form, {
                                                                headers: {
                                                                    Authorization: `Bearer ${token}`,
                                                                    'Content-Type': 'multipart/form-data'
                                                                }
                                                            });
                                                            setFormData(prev => ({ ...prev, image_url: res.data.path }));
                                                        } catch (err) { toast.error('Upload failed'); }
                                                        finally { setUploading(false); }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, is_active: prev.is_active ? 0 : 1 }))}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${formData.is_active
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                                                }`}
                                        >
                                            {formData.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                            {formData.is_active ? t('admin.common.active') : t('admin.common.inactive')}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    {t('admin.common.cancel')}
                                </button>
                                <button
                                    form="categoryForm"
                                    type="submit"
                                    className="px-8 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:shadow-lg transition-all text-sm font-black"
                                >
                                    {editingCategory ? t('admin.categories.saveChanges') : t('admin.categories.createCategory')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ModernAdminPage>
    );
};

export default Categories;
