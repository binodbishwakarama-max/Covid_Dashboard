import React from 'react';
import Section from '../layout/Section';

const About = () => {
    return (
        <Section id="about" className="py-24">
            <div className="glass p-8 md:p-12 rounded-3xl">
                <div className="grid md:grid-cols-[2fr,1fr] gap-16 items-start">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-4 drop-shadow-md">
                            <span className="text-blue-600 dark:text-blue-400">01.</span> About Me
                        </h2>

                        <div className="space-y-6 text-lg text-gray-700 dark:text-slate-200 leading-relaxed font-light">
                            <p>
                                I am a Computer Science student with a passion for building software that solves real-world problems. My journey began with a curiosity about how data can be visualized to drive decisions, which led me to specialize in full-stack development.
                            </p>
                            <p>
                                Currently, I focus on building accessible, high-performance web applications. I have a strong foundation in algorithmic problem solving and enjoy bridging the gap between complex backend logic and intuitive frontend interfaces.
                            </p>
                            <p>
                                I'm actively seeking opportunities where I can apply my skills in <strong className="text-gray-900 dark:text-white font-medium">React ecosystem</strong> and <strong className="text-gray-900 dark:text-white font-medium">data visualization</strong> to contribute to meaningful projects.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">Technical Skills</h3>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-sm max-w-lg">
                                {['JavaScript (ES6+)', 'React.js / Vite', 'Node.js / Express', 'Tailwind CSS', 'PostgreSQL / MongoDB', 'Git / CI/CD'].map((tech) => (
                                    <li key={tech} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                                        <span className="text-blue-600 dark:text-blue-400">▹</span> {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Profile / Decorative Side */}
                    <div className="relative group max-w-xs mx-auto md:mx-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="relative z-10 bg-white/30 dark:bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 aspect-[4/5] flex items-center justify-center shadow-2xl group-hover:transform group-hover:scale-[1.02] transition-all duration-300">
                            {/* Replace with actual image */}
                            <div className="text-center p-6">
                                <div className="text-6xl mb-4 drop-shadow-lg">👨‍💻</div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 font-mono">Image Place</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
