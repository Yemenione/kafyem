import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingBag, Users, Settings,
    LogOut, ChevronRight, Menu, Bell, Search, Globe,
    Tag, Layers, BadgePercent, Mail, MessageSquare,
    Ticket, FileText, Image as ImageIcon, Truck,
    Coins, Languages as LangIcon, ShieldCheck, Newspaper
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils'; // Assuming cn utility exists or I'll create it

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'fr' : i18n.language === 'fr' ? 'ar' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const navModules = [
        {
            title: 'General',
            items: [
                { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
            ]
        },
        {
            title: 'Catalog',
            items: [
                { to: '/admin/products', icon: <Package size={20} />, label: 'Products' },
                { to: '/admin/categories', icon: <Layers size={20} />, label: 'Categories' },
                { to: '/admin/attributes', icon: <Tag size={20} />, label: 'Attributes' },
                { to: '/admin/brands', icon: <BadgePercent size={20} />, label: 'Brands' },
            ]
        },
        {
            title: 'Sales',
            items: [
                { to: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
                { to: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
            ]
        },
        {
            title: 'Marketing & Support',
            items: [
                { to: '/admin/coupons', icon: <BadgePercent size={20} />, label: 'Coupons' },
                { to: '/admin/newsletter', icon: <Mail size={20} />, label: 'Newsletter' },
                { to: '/admin/chat', icon: <MessageSquare size={20} />, label: 'Live Chat' },
                { to: '/admin/tickets', icon: <Ticket size={20} />, label: 'Support Tickets' },
            ]
        },
        {
            title: 'Content',
            items: [
                { to: '/admin/cms', icon: <FileText size={20} />, label: 'CMS Pages' },
                { to: '/admin/blog', icon: <Newspaper size={20} />, label: 'Blog Posts' },
                { to: '/admin/files', icon: <ImageIcon size={20} />, label: 'Media Library' },
            ]
        },
        {
            title: 'System',
            items: [
                { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
                { to: '/admin/carriers', icon: <Truck size={20} />, label: 'Shipping' },
                { to: '/admin/tax', icon: <ShieldCheck size={20} />, label: 'Tax Rules' },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-black font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 ease-in-out flex flex-col z-50",
                    isSidebarOpen ? "w-72" : "w-20"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-zinc-900 overflow-hidden shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
                            <span className="text-white font-serif font-bold">Y</span>
                        </div>
                        {isSidebarOpen && (
                            <span className="font-serif font-bold text-xl tracking-tight text-coffee-dark dark:text-gold whitespace-nowrap">
                                Yemen Kaf
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                    {navModules.map((module, mIdx) => (
                        <div key={mIdx} className="space-y-2">
                            {isSidebarOpen && (
                                <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                                    {module.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {module.items.map((item, iIdx) => (
                                    <NavItem
                                        key={iIdx}
                                        {...item}
                                        collapsed={!isSidebarOpen}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-zinc-900 space-y-2">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={20} className={cn(isSidebarOpen && "mr-3")} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>

                    {isSidebarOpen && (
                        <div className="px-3 py-2 flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/50 rounded-xl mt-4">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-zinc-400">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">{user?.name || 'Admin'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-500 truncate capitalize">{user?.role || 'Administrator'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 shrink-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-slate-600 dark:text-zinc-400"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                            <span>Admin</span>
                            <ChevronRight size={14} />
                            <span className="text-slate-900 dark:text-zinc-100 font-medium capitalize">
                                {location.pathname.split('/').pop() || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-zinc-900 rounded-full px-4 py-1.5 gap-2 border border-slate-200 dark:border-zinc-800">
                            <Search size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-transparent border-none focus:outline-none text-xs w-48 text-slate-600 dark:text-zinc-400"
                            />
                        </div>

                        <button
                            onClick={toggleLanguage}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors relative text-slate-600 dark:text-zinc-400 group"
                            title="Change Language"
                        >
                            <Globe size={20} />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-white uppercase">
                                {i18n.language}
                            </span>
                        </button>

                        <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors relative text-slate-600 dark:text-zinc-400">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-zinc-800 mx-2"></div>

                        <div className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-zinc-900">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth bg-slate-50/50 dark:bg-transparent">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, end, collapsed }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                isActive
                    ? "bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100",
                collapsed && "justify-center px-3"
            )
        }
    >
        <div className={cn("transition-transform duration-200", !collapsed && "mr-3 group-hover:scale-110")}>
            {icon}
        </div>
        {!collapsed && <span>{label}</span>}
        {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100]">
                {label}
            </div>
        )}
    </NavLink>
);

export default AdminLayout;
