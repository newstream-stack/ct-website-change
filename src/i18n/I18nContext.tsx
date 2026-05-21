import React, { createContext, useContext, useState } from 'react';
import zhTranslations from './translations/zh.json';

interface I18nContextType {
    t(key: `${string}.plans`): unknown[];
    t(key: string): string;
    locale: string;
    setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState('zh');
    
    const translations: Record<string, any> = {
        zh: zhTranslations
    };

    const t = (keyPath: string): string | unknown[] => {
        const keys = keyPath.split('.');
        let current: unknown = translations[locale];
        for (const key of keys) {
            if (current == null || typeof current !== 'object' || !(key in (current as object))) {
                return keyPath; // fallback
            }
            current = (current as Record<string, unknown>)[key];
        }
        if (Array.isArray(current)) return current;
        if (typeof current === 'string') return current;
        return keyPath;
    };

    return (
        <I18nContext.Provider value={{ t, locale, setLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
