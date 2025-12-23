import React from 'react';
import Section from '../layout/Section';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
    return (
        <Section id="hero" className="min-h-screen flex items-center justify-center pt-32 pb-20">
            <div className="flex flex-col items-start space-y-8 max-w-4xl px-4 md:px-0">
                <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 tracking-wide drop-shadow-sm">
                        Hi, my name is
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight drop-shadow-lg">
                        Binod.
                    </h1>
                    <h2 className="text-3xl md:text-6xl font-bold text-gray-600 dark:text-slate-200/80 leading-tight drop-shadow-md">
                        I build interactive data experiences.
                    </h2>
                </div>

                <div className="glass p-8 rounded-2xl max-w-2xl transform hover:scale-[1.01] transition-transform duration-500">
                    <p className="text-lg md:text-xl text-gray-700 dark:text-slate-100 leading-relaxed font-light">
                        I'm a Computer Science Student & Full-Stack Developer utilizing modern tools like <span className="text-gray-900 dark:text-white font-semibold">React</span> and <span className="text-gray-900 dark:text-white font-semibold">WebGL</span> to visualize complex problems. Currently focused on building accessible, performance-critical dashboards.
                    </p>
                </div>

                <div className="flex flex-wrap gap-5 pt-4">
                    <a
                        href="#projects"
                        className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 backdrop-blur-md border border-white/20 text-lg font-medium rounded-xl transition-all duration-300 shadow-xl hover:-translate-y-1"
                    >
                        Check out my work
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="group flex items-center gap-3 px-8 py-4 bg-transparent hover:bg-gray-100/10 dark:hover:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl transition-colors text-gray-800 dark:text-white text-lg font-medium"
                    >
                        Resume
                        <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                    </a>
                </div>
            </div>
        </Section>
    );
};

export default Hero;
