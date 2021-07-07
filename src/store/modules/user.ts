// 维护用户信息
import _ from 'lodash';
import db from '@/utils/localStorage';
import WorkError from '@/utils/WorkError';
import * as userApi from '@/api/userApi';

interface MenuRoute {
    path: string;
    icon?: string;
    title: string;
    children?: Array<MenuRoute>;
}
interface Menu {
    id: number;
    name: string;
    type: number;
    iconCode?: string;
    parentId: null | number;
    controller: string;
    sortIndex?: number;
    remarks?: string;
}
interface MenuTree {
    menu: Menu;
    children?: Array<MenuTree>;
}
function normalRoute(list: MenuTree[] | undefined, arr: MenuRoute[] = []) {
    if (!Array.isArray(list) || list.length === 0) return;
    list.forEach((item: MenuTree): void => {
        const o: MenuRoute = {
            path: item.menu.controller,
            icon: item.menu.iconCode,
            title: item.menu.name
        };
        arr.push(o);
        if (item.menu.type === 0 || item.menu.type === 1) {
            o.children = [];
            normalRoute(item.children, o.children);
        }
    });
}
const user = {
    state: {
        ROOT_MENU_KEY: '__rootmenukey__',
        userInfo: null,
        menu: [], // 后台返回的处理之后的菜单
        permissions: [], //权限列表
        currentPath: '', // 当前菜单的路径
        isLoadRoutes: false // 路由是否加载过
    },
    getters: {
        //获取当权用户权限列表
        chackPermission(state: any) {
            return (payload: any) => {
                if (state.permissions.includes(payload)) {
                    return true;
                }
                return false;
            };
        },
        // 只获取一级菜单
        rootMenu(state: any) {
            const rootMenu = state.menu.map((item: MenuRoute) => {
                return {
                    icon: item.icon,
                    path: item.path,
                    title: item.title
                };
            });
            return rootMenu;
        },
        // 获取二级菜单+
        secondMenu(state: any) {
            const { menu, currentPath } = state;
            let secondMenu = menu.find((item: MenuRoute) => item.path === currentPath);
            if (secondMenu instanceof Object) {
                // 防止通过getters修改store数据
                secondMenu = _.cloneDeep(secondMenu.children);
            } else {
                secondMenu = {};
            }
            return secondMenu;
        }
    },
    mutations: {
        INIT_USERINFO(state: any, userInfo: any) {
            state.userInfo = userInfo;
        },
        INIT_MENU(state: any, menu: any) {
            state.menu = menu;
        },
        SET_CURRENT_PATH(state: any, currentPath: string) {
            state.currentPath = currentPath;
            // 存储sessionStorage
            window.sessionStorage.setItem(state.ROOT_MENU_KEY, currentPath);
        },
        SET_IS_LOAD_ROUTES(state: any, isLoadRoutes: boolean) {
            state.isLoadRoutes = isLoadRoutes;
        },
        SET_PERMISSIONS(state: any, permissions: string[]) {
            state.permissions = permissions;
        },
        CLEAR_USER_DATA(state: any) {
            state.userInfo = null;
            state.menu = [];
            state.currentPath = '';
            state.isLoadRoutes = false;
            state.permissions = [];
        }
    },
    actions: {
        /**
         * 登录
         * @param {*} param0
         * @param {*} payload
         */
        async login({ state, commit }: any, params: UserApiTypes.loginParams) {
            try {
                const res: any = await userApi.login(params);
                // 处理业务code
                if (res.respCode === '0000') {
                    // 设置用户信息
                    db.save('Authorization', res.token);
                    db.save('__username__', params.loginName);
                    commit('INIT_USERINFO', res.userInfo);

                    // 设置菜单
                    const rootMenu: MenuTree = res.menuTree;
                    let menu: MenuRoute[] = [];
                    normalRoute(rootMenu.children, menu);
                    commit('INIT_MENU', menu);

                    // 区分对应的二级菜单
                    const rootPath = window.sessionStorage.getItem(state.ROOT_MENU_KEY);
                    if (rootPath && rootPath.length > 0) {
                        commit('SET_CURRENT_PATH', rootPath);
                    } else {
                        commit('SET_CURRENT_PATH', menu[0].path);
                    }
                } else {
                    throw new WorkError({
                        workCode: res.respCode,
                        message: res.respMsg
                    });
                }
            } catch (error) {
                console.log(error.message);
                return Promise.reject(error);
            }
        },
        async getUserInfo({ state, commit }: any) {
            try {
                const res: any = await userApi.getUserInfoByToken();
                // 处理业务code
                if (res.respCode === '0000') {
                    db.save('__username__', res.userInfo.loginName);
                    commit('INIT_USERINFO', res.userInfo);
                    // 设置菜单
                    const rootMenu: MenuTree = res.menuTree;
                    let menu: MenuRoute[] = [];
                    normalRoute(rootMenu.children, menu);
                    commit('INIT_MENU', menu);

                    // 区分对应的二级菜单
                    const rootPath = window.sessionStorage.getItem(state.ROOT_MENU_KEY);
                    if (rootPath && rootPath.length > 0) {
                        commit('SET_CURRENT_PATH', rootPath);
                    } else {
                        commit('SET_CURRENT_PATH', menu[0].path);
                    }
                } else {
                    throw new WorkError({
                        workCode: res.respCode,
                        message: res.respMsg
                    });
                }
                return res;
            } catch (error) {
                console.log(error.message);
                return Promise.reject(error);
            }
        },
        async register(context: any, params: UserApiTypes.registerParams) {
            try {
                const res: any = await userApi.register(params);
                // 处理业务code
                if (res.respCode === '0000') {
                    // 设置用户信息
                    db.save('__username__', params.loginName);
                } else {
                    throw new WorkError({
                        workCode: res.respCode,
                        message: res.respMsg
                    });
                }
                return res;
            } catch (error) {
                console.log(error.message);
                return Promise.reject(error);
            }
        },
        async logout(context: any) {
            try {
                db.remove('__username__');
                db.remove('Authorization');
                context.commit('CLEAR_USER_DATA');
                context.commit('CLEAR_TAG_DATA');
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve(null);
                    }, 200);
                });
                return 'logout-success';
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }
    }
};
export default user;
