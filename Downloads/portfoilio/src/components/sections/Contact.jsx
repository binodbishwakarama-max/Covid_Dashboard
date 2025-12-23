import React from 'react';
import Section from '../layout/Section';

const Contact = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Section id="contact" className="py-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-lg block drop-shadow-sm">04. What's Next?</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white drop-shadow-lg">Get In Touch</h2>
                    <p className="max-w-xl mx-auto text-gray-600 dark:text-slate-200 text-lg font-light leading-relaxed">
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, feel free to drop a message!
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                        <a href="mailto:binodbishwakarama@gmail.com" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md transition-all">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <span className="text-gray-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">binodbishwakarama@gmail.com</span>
                        </a>
                        <a href="tel:+9779886556155" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md transition-all">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            <span className="text-gray-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">+977 9886 556 155</span>
                        </a>
                    </div>
                </div>

                <div className="glass p-8 md:p-12 rounded-3xl max-w-2xl mx-auto">
                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                            <p className="text-gray-600 dark:text-slate-300">Thanks for reaching out. I'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 ml-1">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 focus:bg-white/60 dark:focus:bg-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/20 transition-all font-light"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 ml-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 focus:bg-white/60 dark:focus:bg-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/20 transition-all font-light"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 ml-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 focus:bg-white/60 dark:focus:bg-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/20 transition-all resize-none font-light"
                                    placeholder="Your message..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default Contact;
