export const posts = [
    {
        id: 'getting-started-with-react-three-fiber',
        title: 'Getting Started with React Three Fiber',
        excerpt: 'Learn how to create immersive 3D experiences in the web using React and Three.js. This guide covers the basics of the scene graph and lighting.',
        date: 'December 22, 2025',
        readTime: '5 min read',
        content: `
# Getting Started with React Three Fiber

3D on the web has never been easier. With **React Three Fiber (R3F)**, you can bring the power of Three.js to your React applications with a declarative, component-based approach.

## Why R3F?

Three.js is imperative. You have to create objects, add them to scenes, and manually handle updates. R3F lets you treat 3D objects like any other DOM element:

\`\`\`jsx
<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</Canvas>
\`\`\`

## setting up the Scene

To get started, we need a standard scene setup:

1. **Canvas**: The entry point for R3F.
2. **Lights**: standard \`ambientLight\` and \`pointLight\`.
3. **OrbitControls**: To allow user interaction.

Stay tuned for part 2 where we build a spinning globe!
        `
    },
    {
        id: 'why-i-love-tailwind-css',
        title: 'Why I Love Tailwind CSS for Rapid Prototyping',
        excerpt: 'Utility-first CSS might seem messy at first, but it saves hours of context switching. Here is why I switched from SCSS to Tailwind.',
        date: 'December 15, 2025',
        readTime: '3 min read',
        content: `
# Why I Love Tailwind CSS

I used to be a die-hard SCSS fan. BEM naming methodology was my bible. But then I tried Tailwind, and I haven't looked back.

## Speed

The biggest advantage is speed. You don't have to switch files. You don't have to think of class names like \`.wrapper-inner-container-blue\`. You just write:

\`\`\`html
<div class="flex items-center justify-between p-4 bg-blue-500">
\`\`\`

## Consistency

Tailwind enforces a design system. You can't just pick "any" blue. You pick \`blue-500\`, \`blue-600\`. This automatically makes your site look more consistent and professional.
        `
    }
];
