import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button } from './button';
import { useTranslation } from '../../../hooks/useTranslation';

const Header: React.FC = () => {
    const { t, language, changeLanguage } = useTranslation();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    const handleLanguageChange = (newLanguage: 'en' | 'vi') => {
        changeLanguage(newLanguage);
        setIsLanguageDropdownOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img 
                        src="/logo.png" 
                        alt="AZT Logo" 
                        className="h-12 w-13 md:h-20 md:w-20 lg:h-20 lg:w-24 object-contain -ml-2 -my-1"
                    />
                    <span className="text-xl font-bold font-heading tracking-tight">AZT VietNam</span>
                </div>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center gap-8 hover:text-primary-foreground">
                    <a
                        href="#categories"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t('header.categories')}
                    </a>
                    <a 
                        href="#collaborators" 
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t('header.collaboration')}
                    </a>
                    <a 
                        href="#about" 
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t('header.about')}
                    </a>
                    <a 
                        href="#solutions" 
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t('header.solutions')}
                    </a>
                    <a
                        href="#contact"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t('header.contact')}
                    </a>
                </nav>

                {/* Right Side - Language & Actions */}
                <div className="flex items-center gap-3">
                    {/* Language Switcher with Dropdown */}
                    <div className="relative">
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className="flex items-center gap-2"
                        >
                            <Icon icon="solar:translation-bold" className="size-4" />
                            {language.toUpperCase()}
                            <Icon 
                                icon="solar:alt-arrow-down-bold" 
                                className={`size-3 transition-transform ${
                                    isLanguageDropdownOpen ? 'rotate-180' : ''
                                }`} 
                            />
                        </Button>

                        {/* Language Dropdown */}
                        {isLanguageDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg z-50">
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className={`w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent transition-colors ${
                                        language === 'en' 
                                            ? 'bg-primary/10 text-primary font-medium' 
                                            : 'text-foreground'
                                    }`}
                                >
                                    <span>🇺🇸</span>
                                    English
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('vi')}
                                    className={`w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent transition-colors ${
                                        language === 'vi' 
                                            ? 'bg-primary/10 text-primary font-medium' 
                                            : 'text-foreground'
                                    }`}
                                >
                                    <span>🇻🇳</span>
                                    Tiếng Việt
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {/* <Button size="sm" variant="ghost">
                        {t('header.signIn')}
                    </Button>
                    <Button
                        size="sm"
                        className="shadow-lg shadow-primary/20 bg-gradient-to-br from-primary to-primary/90"
                    >
                        {t('header.getStarted')}
                    </Button> */}
                    <Link to="/admin/login">
                        <Button size="sm" variant="outline" className="ml-2">                        
                            <Icon icon="solar:settings-bold" className="size-4" />
                            {t('header.admin')}             
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;