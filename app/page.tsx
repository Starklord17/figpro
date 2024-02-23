import dynamic from 'next/dynamic';

/**
 * Disable ssr to avoid pre-rendering issues of Next.js
 *
 * This application includes a canvas element that, due to its client-side JavaScript dependency, cannot be pre-rendered on the server-side.
 *  https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
 */
const App = dynamic(() => import('./App'), { ssr: false })

export default App;