// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import App from './App';
import router from './router';
import { store } from './store.js';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import VueYouTubeEmbed from 'vue-youtube-embed';
import Chartkick from 'vue-chartkick';
import 'chart.js';
// import 'hchs-vue-charts';
 
const opts = {
  theme: { disable: true },
  iconfont: 'fa4',
  icons: {
    iconfont: 'mdiSvg' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  }
};
Vue.use(Vuetify);
Vue.use(VueYouTubeEmbed);
// Vue.use(window.VueCharts);
Vue.use(Chartkick.use(Chart));

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify: new Vuetify(opts),
  components: { App },
  template: '<App/>'
});
