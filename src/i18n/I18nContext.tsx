import React, { createContext, useContext, useState } from 'react';
import zhTranslations from './translations/zh.json';

interface I18nContextType {
    t: (key: string) => any;
    locale: string;
    setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState('zh');
    
    const translations: Record<string, any> = {
        zh: zhTranslations
    };

    const t = (keyPath: string) => {
        const keys = keyPath.split('.');
        let current: any = translations[locale];
        for (const key of keys) {
            if (current === undefined || current[key] === undefined) {
                return keyPath; // fallback to key path if not found
            }
            current = current[key];
        }
        return current;
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
