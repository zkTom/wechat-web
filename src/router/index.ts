import Vue from 'vue';
import VueRouter from 'vue-router';
import db from '@/utils/localStorage';
import store from '@/store/index';
import Layout from '@/components/layout/Layout.vue';
import NotFound from '../components/common/404.vue';

Vue.use(VueRouter);
// 不需要鉴权的页面
const constantRoutes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue'),
                meta: {
                    title: '系统首页'
                }
            }
        ]
    },
    {
        path: ''
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "Login" */ '@/views/login/Index.vue')
    },
    {
        path: '/404',
        component: NotFound,
        meta: {
            title: '404'
        }
    }
];

function pathMapToView(path: string): string {
    const map: any = {
        '/index': 'Home.vue',
        '/channel_code': 'channelCode/Index.vue',
        '/custom_menu': 'customMenu/Index.vue',
        '/fans_list': 'fans/Index.vue',
        '/tags_list': 'wechatTags/Index.vue',
        '/offical_account_list': 'officalAccount/Index.vue'
    };
    return map[path];
}
// 路由懒加载
function loadView(viewPath: string) {
    return () => import(`@/views/${viewPath}`);
}

function normalRoute(routes: any, arr: any[] = []) {
    routes.forEach((route: any) => {
        if (Array.isArray(route.children) && route.children.length > 0) {
            normalRoute(route.children, arr);
        } else {
            arr.push({
                path: route.path,
                component: loadView(pathMapToView(route.path)),
                meta: {
                    title: route.title
                }
            });
        }
    });
}
// 异步加载路由
function asyncRoutes(routes: any) {
    const accessedRoutes = routes.map((route: any) => {
        const accessedRoute = {
            path: route.path,
            component: Layout,
            children: [],
            meta: {
                title: route.title
            }
        };
        if (Array.isArray(route.children) && route.children.length > 0) {
            normalRoute(route.children, accessedRoute.children);
        }
        return accessedRoute;
    });
    // 最后加载*路由
    accessedRoutes.push({
        path: '*',
        redirect: '/404'
    });
    return accessedRoutes;
}
const router = new VueRouter({
    // mode: 'history',
    mode: 'hash',
    routes: constantRoutes
});
// 不需要控制的页面
const whiteList = constantRoutes.map(route => route.path);
//强刷登录
router.onReady(() => {
    const userModule = store.state.user;

    router.addRoutes(asyncRoutes(userModule.menu));
});
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const authorizationStr = db.get('Authorization', '');
    if (authorizationStr.length > 0) {
        // 已登录且要跳转的页面是登录页
        if (to.path === '/login') {
            next({
                path: '/'
            });
        } else {
            const userModule = store.state.user;
            // 用户信息存在且菜单已经有,则直接加载路由
            if (userModule.userInfo === null) {
                //拉去用户信息,加载路由
                store
                    .dispatch('getUserInfo')
                    .then(() => {
                        // 没有菜单代表用户非法，无法登录
                        // if (userModule.menu.length === 0) {
                        //      store.dispath('logout').then(res => {
                        //      next({ path: '/login' })
                        //      })
                        // }
                        router.addRoutes(asyncRoutes(userModule.menu));
                        store.commit('SET_IS_LOAD_ROUTES', true);
                        next({
                            ...to
                        });
                    })
                    .catch((err: any) => {
                        console.log('加载用户信息出错：', err);
                        // 为了重新实例化vue-router对象 避免bug
                        // store.dispatch('logout').then(() => {
                        //     location.reload();
                        // });
                    });
            } else if (userModule.isLoadRoutes) {
                next();
            } else {
                router.addRoutes(asyncRoutes(userModule.menu));
                store.commit('SET_IS_LOAD_ROUTES', true);
                next({
                    ...to
                });
            }
        }
    } else {
        // no token && in whiteList
        if (whiteList.indexOf(to.path) > -1) {
            next();
        } else {
            // 是否需要清空路由表？
            next({
                path: '/login',
                replace: true
            });
        }
    }
});
export default router;
