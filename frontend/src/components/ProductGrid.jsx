import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import ProductCard from './ProductCard';
import Navbar from './Navbar';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet"

const ProductGrid = ({ isPage = true, limit = null }) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams(); // Read URL params
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Initialize category from URL if available
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            // Capitalize first letter to match our category names logic (simple version)
            const formattedCat = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
            if (categories.includes(formattedCat)) {
                setSelectedCategory(formattedCat);
            } else if (categoryParam.toLowerCase() === 'honey') setSelectedCategory('Honey');
            else if (categoryParam.toLowerCase() === 'coffee') setSelectedCategory('Coffee');
            else if (categoryParam.toLowerCase() === 'spices') setSelectedCategory('Spices');
            else if (categoryParam.toLowerCase() === 'gifts') setSelectedCategory('Gifts');
        }
    }, [searchParams]);

    // Mock data for initial display if API fails
    const mockProducts = [
        {
            id: 1,
            name: "Sidr Honey (Royal)",
            name_ar: "عسل سدر ملكي",
            name_fr: "Miel Sidr Royal",
            description: "Premium Royal Sidr Honey from Do'an Valley.",
            price: 150,
            category: "Honey",
            imageUrl: "https://placehold.co/500x700/D4AF37/FFFFFF?text=Royal+Sidr"
        },
        {
            id: 2,
            name: "Yemeni Coffee (Mocha)",
            name_ar: "بن يمني (موكا)",
            name_fr: "Café Yéménite (Moka)",
            description: "Authentic Yemeni Mocha beans, medium roast.",
            price: 45,
            category: "Coffee",
            imageUrl: "https://placehold.co/500x700/4B3621/FFFFFF?text=Mocha+Beans",
            is_new: true
        },
        {
            id: 3,
            name: "Sidr Leaves Powder",
            name_ar: "مسحوق أوراق السدر",
            name_fr: "Poudre de feuilles de Sidr",
            description: "Organic Sidr leaves powder for health and beauty.",
            price: 25,
            category: "Spices",
            imageUrl: "https://placehold.co/500x700/3A5A40/FFFFFF?text=Sidr+Leaves"
        },
        {
            id: 4,
            name: "White Honey",
            name_ar: "العسل الأبيض",
            name_fr: "Miel Blanc",
            description: "Rare white honey from the mountains of Yemen.",
            price: 200,
            category: "Honey",
            imageUrl: "https://placehold.co/500x700/F0E68C/333333?text=White+Honey",
            discount: 10,
            old_price: 220
        },
        {
            id: 5,
            name: "Saffron Spices",
            name_ar: "بهارات الزعفران",
            name_fr: "Épices de Safran",
            description: "Premium grade saffron threads.",
            price: 85,
            category: "Spices",
            imageUrl: "https://placehold.co/500x700/E63946/FFFFFF?text=Saffron"
        },
        {
            id: 6,
            name: "Silver Jewelry Box",
            name_ar: "صندوق مجوهرات فضي",
            name_fr: "Boîte à bijoux en argent",
            description: "Handcrafted silver box from Sana'a.",
            price: 350,
            category: "Gifts",
            imageUrl: "https://placehold.co/500x700/C0C0C0/333333?text=Silver+Box"
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            const searchQuery = searchParams.get('search');
            try {
                let API_URL = 'http://localhost:5000/api/products';
                if (searchQuery) {
                    API_URL += `?search=${encodeURIComponent(searchQuery)}`;
                }

                const response = await axios.get(API_URL);
                if (response.data && response.data.length > 0) {
                    setProducts(response.data);
                } else {
                    // Only use mock if NO data returned and NO search (if searching, empty result is valid)
                    if (!searchQuery) setProducts(mockProducts);
                    else setProducts([]);
                }
            } catch (error) {
                console.log("API not reachable, using mock data.");
                if (!searchParams.get('search')) setProducts(mockProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    const categories = ['All', 'Honey', 'Coffee', 'Spices', 'Gifts'];

    let filteredProducts = products.filter(p =>
        (selectedCategory === 'All' || p.category === selectedCategory)
    );

    if (limit) {
        filteredProducts = filteredProducts.slice(0, limit);
    }

    if (loading) {
        return <div className="h-64 flex items-center justify-center text-gold font-serif">loading exquisite items...</div>;
    }

    const Content = () => (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters (Desktop) - Only show if isPage is true */}
            {isPage && (
                <div className="hidden lg:block w-64 flex-shrink-0 space-y-10">
                    {/* Categories */}
                    <div>
                        <h3 className="font-serif text-lg font-bold text-coffee-dark mb-6 pb-2 border-b border-gray-100">Categories</h3>
                        <ul className="space-y-4">
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-sm tracking-wide transition-colors duration-200 ${selectedCategory === cat ? 'text-gold font-bold pl-2 border-l-2 border-gold' : 'text-gray-500 hover:text-gold'}`}
                                    >
                                        {cat === 'All' ? 'View All' : cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Placeholder */}
                    <div>
                        <h3 className="font-serif text-lg font-bold text-coffee-dark mb-6 pb-2 border-b border-gray-100">Price Range</h3>
                        <div className="px-2">
                            <div className="h-1 bg-gray-200 rounded-full mb-4">
                                <div className="h-1 bg-gold w-1/2 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>$0</span>
                                <span>$500+</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Grid Area */}
            <div className="flex-1">
                {/* Mobile Filters and Sort Bar - Only show if isPage is true */}
                {isPage && (
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="lg:hidden w-full md:w-auto">
                            <Sheet>
                                <SheetTrigger className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-widest text-coffee-dark border border-gray-200 px-6 py-3 rounded-sm hover:border-gold transition">
                                    <SlidersHorizontal size={16} /> Filters
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle className="font-serif text-2xl text-coffee-dark">Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-8 space-y-8">
                                        <div>
                                            <h4 className="font-medium mb-4 text-gold">Categories</h4>
                                            <ul className="space-y-3">
                                                {categories.map(cat => (
                                                    <li key={cat}>
                                                        <button onClick={() => setSelectedCategory(cat)} className={`${selectedCategory === cat ? 'font-bold text-coffee-dark' : 'text-gray-500'}`}>
                                                            {cat}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="hidden lg:flex items-center gap-4 ml-auto">
                            <span className="text-sm text-gray-500">Showing <span className="font-bold text-coffee-dark">{filteredProducts.length}</span> results</span>
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <span className="text-sm font-medium text-gray-500 group-hover:text-gold transition">Sort by: Featured</span>
                                <ChevronDown size={14} className="text-gray-400 group-hover:text-gold" />
                            </div>
                        </div>
                    </div>
                )}

                <div className={`grid grid-cols-2 ${isPage ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-x-6 gap-y-12`}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {isPage && (
                    <div className="mt-20 text-center">
                        <button className="text-xs uppercase tracking-[0.2em] text-coffee-dark hover:text-gold border-b border-coffee-dark hover:border-gold pb-1 transition-all duration-300">
                            Load More Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // If it's a full page, wrap in structural layout
    if (isPage) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                {/* Header / Banner */}
                <div className="bg-[#1A1A1A] py-16 md:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold mb-4 tracking-tight">Our Collections</h1>
                        <p className="text-gray-400 font-light max-w-2xl mx-auto text-lg">
                            Discover the authentic flavors and treasures of Yemen, curated for the modern connoisseur.
                        </p>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-12">
                    <Content />
                </div>
            </div>
        );
    }

    // If embedded (e.g. Home page), just return the content wrapper (without container constraints if parent handles it)
    return <Content />;
};

export default ProductGrid;
