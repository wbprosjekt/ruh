import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x'  // Correct runtime format for Vercel
    })
  },
  preprocess: preprocess()
};
