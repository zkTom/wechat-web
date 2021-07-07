import Vue from 'vue';
import DoubleElevenGame from './index.vue';
import { Button, Toast, Overlay, Icon } from 'vant';
import '@/assets/scss/index.scss';
import 'vant/lib/button/style';
import 'vant/lib/toast/style';
import 'vant/lib/overlay/style';
import 'vant/lib/icon/style';

Vue.use(Button);
Vue.use(Toast);
Vue.use(Overlay);
Vue.use(Icon);

Vue.prototype.$toast = Toast;
Vue.config.productionTip = false;

new Vue({
    render: h => h(DoubleElevenGame)
}).$mount('#app');
