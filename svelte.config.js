import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

export default {
  kit: {
    adapter: adapter({
      runtime: 'node18'  // Force Node.js 18 in Vercel
    })
  },
  preprocess: preprocess()
};
