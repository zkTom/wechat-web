import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import tags from './modules/tags';
import { getCaptcha } from '@/api/userApi';

Vue.use(Vuex);

interface RootState {
    [x: string]: any;
}
export default new Vuex.Store<RootState>({
    actions: {
        getCaptcha
    },
    modules: {
        user,
        tags
    },
    strict: process.env.NODE_ENV !== 'production'
});
