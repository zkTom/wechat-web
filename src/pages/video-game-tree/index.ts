import Vue from 'vue';
import store from '@/store';
import VideoGameTree from './index.vue';
import { Tree, Button, Loading, Input, Form, FormItem, Message, Upload, Radio, RadioGroup, Tooltip } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './index.scss';
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
Vue.prototype.$message = Message;
new Vue({
    store,
    render: h => h(VideoGameTree)
}).$mount('#app');
