import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

export default {
  kit: {
    adapter: adapter()
  },
  preprocess: preprocess()
};
