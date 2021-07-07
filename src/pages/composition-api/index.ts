import Vue from 'vue';
import CompositionApi from './index.vue';
import VueCompositionApi from '@vue/composition-api';

import '@/assets/scss/index.scss';

Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
    render: h => h(CompositionApi)
}).$mount('#app');
