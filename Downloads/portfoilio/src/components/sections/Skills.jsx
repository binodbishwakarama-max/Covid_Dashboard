import React from 'react';
import Section from '../layout/Section';
import SpotlightCard from '../ui/SpotlightCard';

const Skills = () => {
    const skillCategories = [
        {
            title: "Frontend",
            skills: ["JavaScript (ES6+)", "React", "Tailwind CSS", "Three.js", "HTML5/CSS3"]
        },
        {
            title: "Backend",
            skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs"]
        },
        {
            title: "Tools & DevOps",
            skills: ["Git / GitHub", "Vite", "VS Code", "Figma", "Vercel"]
        }
    ];

    return (
        <Section id="skills" className="py-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900 dark:text-white text-center drop-shadow-md">
                <span className="text-blue-600 dark:text-blue-400">03.</span> Technical Arsenal
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {skillCategories.map((category, index) => (
                    <SpotlightCard key={index} className="p-8 hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">{category.title}</h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {category.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-4 py-2 bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-full text-gray-700 dark:text-slate-200 text-sm hover:bg-white/60 dark:hover:bg-white/20 hover:scale-105 transition-all cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </SpotlightCard>
                ))}
            </div>
        </Section>
    );
};

export default Skills;
