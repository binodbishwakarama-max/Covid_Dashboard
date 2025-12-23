import React, { useEffect, useState } from 'react';
import Section from '../layout/Section';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import { fetchGitHubRepos } from '../../services/github';
import SpotlightCard from '../ui/SpotlightCard';

const Projects = () => {
    const [githubRepos, setGithubRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRepos = async () => {
            const repos = await fetchGitHubRepos();
            // Filter out the featured projects if they are already in the manual list to avoid duplicates
            // For now, we'll just show the top 6 recently updated non-forks (if logic added)
            setGithubRepos(repos.filter(repo => !repo.fork).slice(0, 6));
            setLoading(false);
        };
        loadRepos();
    }, []);

    const projects = [
        {
            title: '3D COVID-19 Analytics Dashboard',
            description: 'A production-grade 3D visualization platform tracking global pandemic statistics in real-time. Created to bridge the gap between simple data tables and interactive geographical storytelling.',
            features: [
                'Interactive WebGL Globe with zoom-to-country',
                'Real-time data fetching & caching',
                'Responsive chart visualizations'
            ],
            tags: ['React', 'Three.js / Fiber', 'Tailwind', 'REST API'],
            links: {
                github: 'https://github.com/binodbishwakarama-max/Covid_Dashboard',
                demo: '#'
            },
            featured: true
        },
        {
            title: 'Smart Study Planner AI',
            description: 'An intelligent scheduling assistant that generates personalized study plans based on exam dates and subject difficulty. Designed to help students overcome procrastination.',
            features: [
                'Automated calendar generation',
                'Progress tracking analytics',
                'Drag-and-drop schedule adjustment'
            ],
            tags: ['React', 'Node.js', 'MongoDB', 'OpenAI API'],
            links: {
                github: '#',
            },
            featured: false
        }
    ];

    return (
        <Section id="projects" className="py-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white flex items-center gap-4 drop-shadow-md">
                <span className="text-blue-600 dark:text-blue-400">02.</span> Featured Projects
            </h2>

            <div className="space-y-24 mb-32">
                {projects.map((project, index) => (
                    <div key={index} className={`relative grid md:grid-cols-12 gap-8 items-center ${index % 2 === 1 ? 'md:text-right' : ''}`}>

                        {/* Project Image Area */}
                        <div className={`md:col-span-7 relative group ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                            <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 aspect-video group-hover:border-white/30 dark:group-hover:border-white/20 transition-all duration-500`}>
                                {/* macOS Traffic Lights on the Window */}
                                <div className="absolute top-4 left-4 z-20 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm"></div>
                                </div>

                                <div className={`absolute inset-0 ${project.featured ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20' : 'bg-white/5'} mix-blend-overlay group-hover:opacity-100 transition-all duration-500`}></div>
                                {/* Abstract Representation */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl opacity-20 select-none filter blur-sm group-hover:blur-0 group-hover:scale-110 transition-all duration-700 scale-100 grayscale dark:grayscale-0">
                                        {project.title.includes('COVID') ? '🌍' : '📅'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Project Content Area */}
                        <div className={`md:col-span-5 relative z-10 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                            <p className="font-mono text-blue-600 dark:text-blue-400 mb-2 drop-shadow-sm">Featured Project</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-md">
                                {project.title}
                            </h3>

                            <div className="glass-card p-6 rounded-2xl text-gray-700 dark:text-slate-200 mb-6 text-sm leading-relaxed shadow-lg">
                                {project.description}
                            </div>

                            <ul className={`flex flex-wrap gap-3 text-sm font-mono text-gray-600 dark:text-slate-300 mb-8 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
                                {project.tags.map(tag => (
                                    <li key={tag} className="bg-white/40 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">{tag}</li>
                                ))}
                            </ul>

                            <div className={`flex items-center gap-6 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
                                {project.links.github && (
                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                        <Github size={22} />
                                    </a>
                                )}
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                        <ExternalLink size={22} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Other Noteworthy Projects (GitHub Fetch) */}
            <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12 text-center drop-shadow-md block">
                    Other Noteworthy Projects
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center space-x-2 animate-pulse">
                        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animation-delay-200"></div>
                        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animation-delay-400"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {githubRepos.map(repo => (
                            <SpotlightCard
                                key={repo.id}
                                className="p-8 flex flex-col h-full group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        {/* macOS Traffic Lights */}
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm"></div>
                                        </div>
                                        <div className="text-gray-400 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <ExternalLink size={20} />
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {repo.name}
                                    </h4>

                                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                                        {repo.description || 'No description available for this project.'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs font-mono text-gray-500 dark:text-slate-500 mt-auto">
                                        <div className="flex items-center gap-4">
                                            {repo.language && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                                    {repo.language}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Star size={12} />
                                                {repo.stargazers_count}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </SpotlightCard>
                        ))}
                    </div>
                )}
                {!loading && githubRepos.length === 0 && (
                    <p className="text-gray-600 dark:text-slate-400">No public repositories found.</p>
                )}

                <div className="mt-12">
                    <a href="https://github.com/binodbishwakarama-max" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-mono hover:bg-blue-50 dark:hover:bg-blue-400/10 transition-colors">
                        View Full Project Archive
                    </a>
                </div>
            </div>
        </Section>
    );
};

export default Projects;
