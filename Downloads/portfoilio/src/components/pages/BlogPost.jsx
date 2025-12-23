import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import Section from '../layout/Section';
import { posts } from '../../data/posts';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
    const { id } = useParams();
    const post = posts.find(p => p.id === id);

    if (!post) {
        return (
            <Section className="py-32 text-center">
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Post not found</h1>
                <Link to="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
            </Section>
        );
    }

    return (
        <Section className="pt-32 pb-20">
            <div className="max-w-3xl mx-auto">
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Blog
                </Link>

                <header className="mb-10">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <Markdown>{post.content}</Markdown>
                </div>
            </div>
        </Section>
    );
};

export default BlogPost;
