import Vue from 'vue';
import store from '@/store';
import VideoGameTree from './index.vue';
import TTGame from './TTGame.vue';
import { Tree, Button, Loading, Input, Form, FormItem, Message, Upload, Radio, RadioGroup, Tooltip, Autocomplete } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './index.scss';
import { parseQs } from './utils';
Vue.config.productionTip = false;
Vue.use(Loading);
Vue.use(Tree);
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Tooltip);
Vue.use(Autocomplete);
Vue.prototype.$message = Message;
// 根据queryString 加载组件
let href = window.location.href;
const idx = href.indexOf('#');
if (idx > 0) {
    href = href.substring(0, idx);
}

const o = parseQs(href);
if (o && o['tt']) {
    new Vue({
        store,
        render: h => h(TTGame)
    }).$mount('#app');
} else {
    new Vue({
        store,
        render: h => h(VideoGameTree)
    }).$mount('#app');
}

