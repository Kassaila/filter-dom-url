import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import FilterDemo from './components/FilterDemo.vue';
import Layout from './Layout.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('FilterDemo', FilterDemo);
  },
} satisfies Theme;
