import React from 'react';
import Section from '../layout/Section';
import { posts } from '../../data/posts';
import { Link } from 'react-router-dom';

const Blog = () => {
    return (
        <Section id="blog" className="pt-32 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">Writing</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                    Thoughts on software development, design, and my learning journey.
                </p>

                <div className="space-y-8">
                    {posts.map(post => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="block group">
                            <article className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{post.date}</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {post.excerpt}
                                </p>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Blog;
