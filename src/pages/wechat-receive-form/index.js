import Vue from 'vue';
import store from '@/store';
import WechatReceiveForm from './index.vue';
import { Button, CellGroup, Field, Toast, NoticeBar, Dialog } from 'vant';
import '@/assets/scss/index.scss';
import 'vant/lib/field/style';
import 'vant/lib/button/style';
import 'vant/lib/cell-group/style';
import 'vant/lib/toast/style';
import 'vant/lib/notice-bar/style';
import 'vant/lib/dialog/style';

Vue.use(Field);
Vue.use(Button);
Vue.use(CellGroup);
Vue.use(Toast);
Vue.use(NoticeBar);
Vue.use(Dialog);
Vue.$toast = Toast;
Vue.$dialog = Dialog;
Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(WechatReceiveForm)
}).$mount('#app');
