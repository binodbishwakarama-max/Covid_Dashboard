import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 py-8 border-t dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                    © {new Date().getFullYear()} Binod. All rights reserved.
                </div>

                <div className="flex space-x-6">
                    <a href="https://github.com/binodbishwakarama-max" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Github size={20} />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href="mailto:binodbishwakarama@gmail.com" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Mail size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
