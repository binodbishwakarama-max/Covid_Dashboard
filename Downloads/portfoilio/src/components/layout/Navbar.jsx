import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 rounded-2xl ${isScrolled ? 'bg-white/70 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/20 shadow-2xl' : 'bg-transparent'}`}>
            <div className="px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                    Binod.
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1">
                    <Link to="/blog" className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 hover:backdrop-blur-md transition-all">
                        Blog
                    </Link>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 hover:backdrop-blur-md transition-all cursor-pointer"
                        >
                            {link.name}
                        </a>
                    ))}

                    {/* iOS Style Theme Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative overflow-hidden shadow-inner">
                            {/* Sun/Moon Icons inside the toggle for extra flare */}
                            <Sun size={14} className="absolute left-2 top-1.5 text-yellow-500 opacity-100 peer-checked:opacity-0 transition-opacity transform duration-300" />
                            <Moon size={14} className="absolute right-2 top-1.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity transform duration-300" />
                        </div>
                    </label>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative overflow-hidden shadow-inner">
                            <Sun size={14} className="absolute left-2 top-1.5 text-yellow-500 opacity-100 peer-checked:opacity-0 transition-opacity transform duration-300" />
                            <Moon size={14} className="absolute right-2 top-1.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity transform duration-300" />
                        </div>
                    </label>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700 dark:text-gray-200 focus:outline-none">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full mt-2 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl py-4 flex flex-col items-center space-y-2 p-4">
                    <Link
                        to="/blog"
                        className="w-full text-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100 font-medium hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Blog
                    </Link>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="w-full text-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-100 font-medium hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                            onClick={(e) => handleNavClick(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
