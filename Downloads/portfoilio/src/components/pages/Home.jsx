import React from 'react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Skills from '../sections/Skills';
import Contact from '../sections/Contact';

const Home = () => {
    return (
        <>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Contact />
        </>
    );
};

export default Home;
