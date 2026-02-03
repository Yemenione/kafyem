import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, Heart, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext'; // Assuming this exists from previous steps

// UI Components
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { cartItems } = useCart();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
    };

    const navLinks = [
        { name: 'Honey', href: '/products?category=honey', image: 'https://placehold.co/400x300/D4AF37/FFFFFF?text=Honey' },
        { name: 'Coffee', href: '/products?category=coffee', image: 'https://placehold.co/400x300/4B3621/FFFFFF?text=Coffee' },
        { name: 'Spices', href: '/products?category=spices', image: 'https://placehold.co/400x300/E85D04/FFFFFF?text=Spices' },
        { name: 'Gifts', href: '/products?category=gifts', image: 'https://placehold.co/400x300/800000/FFFFFF?text=Gifts' }
    ];

    return (
        <div className="flex flex-col w-full z-50">
            {/* 1. Utility Bar (Dark) */}
            <div className="bg-[#1a1a1a] text-white py-2 px-4 text-[10px] md:text-xs">
                <div className="container mx-auto flex justify-between items-center">
                    <p className="hidden md:block tracking-widest uppercase font-medium text-gold">Free Worldwide Shipping orders $150+</p>
                    <div className="flex items-center gap-6 ml-auto">
                        <div className="flex items-center gap-4 border-r border-white/20 pr-6">
                            <button onClick={() => changeLanguage('en')} className={`hover:text-gold transition ${i18n.language === 'en' ? 'font-bold' : ''}`}>EN</button>
                            <button onClick={() => changeLanguage('ar')} className={`hover:text-gold transition font-serif ${i18n.language === 'ar' ? 'font-bold' : ''}`}>عربي</button>
                        </div>
                        <Link to="/help" className="hover:text-gold transition">Help</Link>
                    </div>
                </div>
            </div>

            {/* 2. Main Header (Logo & Icons) */}
            <header className="bg-white border-b border-gray-100 relative z-40">
                <div className="container mx-auto px-4 h-24 flex items-center justify-between">

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px]">
                                <div className="flex flex-col gap-6 mt-8">
                                    <h2 className="font-serif text-2xl font-bold text-coffee-dark px-2">Menu</h2>
                                    <nav className="flex flex-col space-y-4 px-2">
                                        <Link to="/" className="text-lg font-medium border-b border-gray-100 pb-2">Home</Link>
                                        <Link to="/products" className="text-lg font-medium border-b border-gray-100 pb-2">Shop All</Link>
                                        {navLinks.map(link => (
                                            <Link key={link.name} to={link.href} className="text-lg text-gray-600 hover:text-gold transition-colors pb-2">
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo (Centered on Desktop) */}
                    <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-dark tracking-tight">
                                YEMENI<span className="text-gold">.MARKET</span>
                            </h1>
                        </div>
                    </Link>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {/* Search Toggle */}
                        <div className="hidden md:block relative">
                            {isSearchOpen ? (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 bg-white shadow-lg rounded-full flex items-center border border-gray-200">
                                    <input
                                        autoFocus
                                        className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-sm"
                                        placeholder="Search products..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                navigate(`/products?search=${e.target.value}`);
                                                setIsSearchOpen(false);
                                            }
                                        }}
                                        onBlur={() => {
                                            // Optional: delay closing so clicks on X work, or check unrelated focus
                                            // For now keep simple
                                            setTimeout(() => setIsSearchOpen(false), 200);
                                        }}
                                    />
                                    <X size={16} className="mr-3 cursor-pointer text-gray-400" onClick={() => setIsSearchOpen(false)} />
                                </div>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover:text-gold transition">
                                    <Search className="w-5 h-5" />
                                </Button>
                            )}
                        </div>

                        <Link to="/login">
                            <Button variant="ghost" size="icon" className="hidden md:flex hover:text-gold transition">
                                <User className="w-5 h-5" />
                            </Button>
                        </Link>

                        <div className="relative">
                            <Link to="/cart">
                                <Button variant="ghost" size="icon" className="hover:text-gold transition">
                                    <ShoppingBag className="w-5 h-5" />
                                    {cartItems && cartItems.length > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-gold hover:bg-gold/90 text-coffee-dark h-5 w-5 flex items-center justify-center rounded-full text-[10px]">
                                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. Navigation Bar (Mega Menu) */}
            <nav className="hidden md:block bg-white border-b border-gray-100 relative z-30">
                <div className="container mx-auto flex justify-center">
                    <ul className="flex items-center space-x-12 h-14">
                        <li>
                            <Link to="/" className="text-xs font-bold uppercase tracking-[0.15em] hover:text-gold transition-colors py-4">Home</Link>
                        </li>

                        {/* Mega Menu Trigger: SHOP */}
                        <li
                            className="group static"
                            onMouseEnter={() => setActiveMenu('shop')}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link to="/products" className="text-xs font-bold uppercase tracking-[0.15em] hover:text-gold transition-colors py-4 flex items-center gap-1">
                                Shop <ChevronDown size={12} />
                            </Link>

                            {/* Using Group Hover Logic for CSS-only Mega Menu fallback, or conditional rendering for React */}
                            {activeMenu === 'shop' && (
                                <div className="absolute left-0 top-full w-full bg-white border-b border-gray-200 shadow-xl py-12 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="container mx-auto px-4 grid grid-cols-4 gap-12">

                                        {/* Col 1: Categories */}
                                        <div className="space-y-4">
                                            <h3 className="font-serif text-lg font-bold text-coffee-dark mb-4">Categories</h3>
                                            <ul className="space-y-3">
                                                {navLinks.map(link => (
                                                    <li key={link.name}>
                                                        <Link to={link.href} className="text-sm text-gray-500 hover:text-gold hover:pl-2 transition-all block">
                                                            {link.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li><Link to="/products" className="text-sm text-gray-500 hover:text-gold hover:pl-2 transition-all block">View All</Link></li>
                                            </ul>
                                        </div>

                                        {/* Col 2: Featured Collections */}
                                        <div className="space-y-4">
                                            <h3 className="font-serif text-lg font-bold text-coffee-dark mb-4">Collections</h3>
                                            <ul className="space-y-3">
                                                <li><Link to="#" className="text-sm text-gray-500 hover:text-gold hover:pl-2 transition-all block">New Arrivals</Link></li>
                                                <li><Link to="#" className="text-sm text-gray-500 hover:text-gold hover:pl-2 transition-all block">Best Sellers</Link></li>
                                                <li><Link to="#" className="text-sm text-gray-500 hover:text-gold hover:pl-2 transition-all block">Ramadan Specials</Link></li>
                                                <li><Link to="#" className="text-sm text-gray-500 hover:text-gold hover:pl-2 transition-all block">Gift Sets</Link></li>
                                            </ul>
                                        </div>

                                        {/* Col 3 & 4: Highlight Images */}
                                        <div className="col-span-2 grid grid-cols-2 gap-6">
                                            <div className="relative group cursor-pointer overflow-hidden rounded-md">
                                                <img src="https://placehold.co/400x300/D4AF37/FFFFFF?text=Royal+Sidr+Honey" alt="Featured 1" className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <span className="text-white font-serif font-bold text-lg tracking-wider">Royal Honey</span>
                                                </div>
                                            </div>
                                            <div className="relative group cursor-pointer overflow-hidden rounded-md">
                                                <img src="https://placehold.co/400x300/4B3621/FFFFFF?text=Premium+Coffee" alt="Featured 2" className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <span className="text-white font-serif font-bold text-lg tracking-wider">Haraz Coffee</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </li>

                        <li><Link to="/products?category=honey" className="text-xs font-bold uppercase tracking-[0.15em] hover:text-gold transition-colors py-4">Honey</Link></li>
                        <li><Link to="/products?category=coffee" className="text-xs font-bold uppercase tracking-[0.15em] hover:text-gold transition-colors py-4">Coffee</Link></li>
                        <li><Link to="/products?category=gifts" className="text-xs font-bold uppercase tracking-[0.15em] text-gold hover:text-gold/80 transition-colors py-4">Gifts</Link></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
