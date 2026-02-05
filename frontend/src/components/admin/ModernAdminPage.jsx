import React from 'react';
import { useTranslation } from 'react-i18next';

const ModernAdminPage = ({ title, description, children }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-2xl">
                    {description}
                </p>
            </div>

            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                {children ? children : (
                    <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                            <span className="text-gold text-2xl animate-pulse">✨</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">
                            Module sous développement
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-xs mx-auto">
                            Nous préparons ce module avec le plus grand soin pour vous offrir une expérience premium.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernAdminPage;
