import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import FilterDemo from './components/FilterDemo.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FilterDemo', FilterDemo);
  },
} satisfies Theme;
