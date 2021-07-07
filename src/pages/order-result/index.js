import Vue from 'vue';
import OrderResult from './index.vue';
import { Button, Toast } from 'vant';
import '@/assets/scss/index.scss';
import 'vant/lib/button/style';
import 'vant/lib/toast/style';

Vue.use(Button);
Vue.use(Toast);

Vue.$toast = Toast;
Vue.config.productionTip = false;

new Vue({
    render: h => h(OrderResult)
}).$mount('#app');
