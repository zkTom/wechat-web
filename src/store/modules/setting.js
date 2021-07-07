import WorkError from '@/util/WorkError';
import * as userApi from '@/api/user.js';
import Pagination from '@/util/Pagination';

// 系统参数设定，换肤/固定侧边栏/顶栏/底部等等
/**
 * dict: {code: 1, data: "全部数据", type: "rightsTypes", des: "用户权限类型"}
 */
const setting = {
    state: {
        theme: 'default',
        dictList: []
    },
    getters: {
        getDictList(state) {
            return state.dictList;
        },
        getDictByCode(state) {
            return code => {
                return state.dictList.find(dict => dict.code === code);
            };
        },
        getDictListByType(state) {
            return type => {
                return state.dictList.filter(dict => dict.type === type);
            };
        }
    },
    mutations: {
        SET_DICT(state, dict) {
            state.dictList.push(dict);
        },
        SET_DICT_LIST(state, dictList) {
            state.dictList = dictList;
        }
    },
    actions: {
        async getSysParams({ commit, getters }) {
            try {
                const dictList = getters.getDictList;
                if (dictList instanceof Array && dictList.length > 0) {
                    return dictList;
                }
                const res = await userApi.getSysParams();
                // 处理业务code
                if (res.respCode === '0000') {
                    const dictList = res.respData;
                    commit('SET_DICT_LIST', dictList);
                    return dictList;
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
        // 前端模拟分页
        async getDictListWithPage({ getters }, { pageIndex = 1, pageSize = 10, type = '' }) {
            let dictList = getters.getDictList;
            if (type.length > 0 && type !== '-1') {
                console.log(type);
                dictList = dictList.filter(dict => dict.type === type);
            }
            const totalCount = dictList.length;
            const totalPage = Math.ceil(totalCount / pageSize);
            // 页面上页码从1开始，代码里从0开始
            pageIndex = pageIndex - 1;
            pageIndex = pageIndex > totalPage ? totalPage : pageIndex;

            const start = pageIndex * pageSize;
            const end = start + pageSize > totalCount ? totalCount : start + pageSize;
            const list = dictList.slice(start, end);
            const options = {
                pageIndex: pageIndex + 1,
                pageSize,
                list,
                size: list.length,
                total: dictList.length
            };
            return new Pagination(options);
        }
    }
};
export default setting;
