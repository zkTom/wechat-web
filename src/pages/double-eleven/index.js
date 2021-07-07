import Vue from 'vue';
import DoubleEleven from './index.vue';
import { Button, CellGroup, Field, Toast, NoticeBar, Popup, Form, Loading, Picker, Icon, Dialog } from 'vant';
import '@/assets/scss/index.scss';
import 'vant/lib/field/style';
import 'vant/lib/button/style';
import 'vant/lib/cell-group/style';
import 'vant/lib/toast/style';
import 'vant/lib/notice-bar/style';
import 'vant/lib/popup/style';
import 'vant/lib/picker/style';
import 'vant/lib/icon/style';
import 'vant/lib/dialog/style';

Vue.use(Field);
Vue.use(Button);
Vue.use(CellGroup);
Vue.use(Toast);
Vue.use(NoticeBar);
Vue.use(Form);
Vue.use(Loading);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Icon);
Vue.use(Dialog);

Vue.$toast = Toast;
Vue.$dialog = Dialog;
Vue.config.productionTip = false;

new Vue({
    render: h => h(DoubleEleven)
}).$mount('#app');
