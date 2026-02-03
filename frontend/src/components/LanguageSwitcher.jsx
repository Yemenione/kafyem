import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
    };

    const currentLang = i18n.language.toUpperCase();

    return (
        <div className="relative group z-50">
            <button className="flex items-center text-white/90 hover:text-white transition-colors text-xs font-medium focus:outline-none">
                <Globe className="w-3.5 h-3.5 mr-1" />
                <span>{currentLang}</span>
                <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
            </button>
            <div className="absolute right-0 pt-2 w-32 hidden group-hover:block animate-fade-in">
                <div className="bg-white rounded shadow-xl border border-gray-100 overflow-hidden py-1">
                    <button onClick={() => changeLanguage('en')} className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-accent-gold">
                        <span className="w-6">🇺🇸</span> English
                    </button>
                    <button onClick={() => changeLanguage('fr')} className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-accent-gold">
                        <span className="w-6">🇫🇷</span> Français
                    </button>
                    <button onClick={() => changeLanguage('ar')} className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-accent-gold text-right font-serif">
                        <span className="w-6">🇾🇪</span> العربية
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
