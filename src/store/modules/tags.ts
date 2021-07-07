// 处理多标签处理方式
/**
 * tag:
 * tag.name
 * tag.title
 * tag.path
 */
interface Tag {
    path: string;
    title: string;
    name: string;
}
const tags = {
    state: {
        maxCachedNum: 10, // 最大缓存数量
        tagsList: [], // 缓存列表
        currentTag: null //当前激活的tag
    },
    mutations: {
        ADD_TAG: (state: any, tag: Tag) => {
            state.tagsList.push(tag);
        },
        DEL_TAG_BY_INDEX: (state: any, index: number) => {
            state.tagsList.splice(index, 1);
        },
        DEL_ALL_TAG: (state: any) => {
            state.tagsList = [];
        },
        DEL_OTHER_TAG: (state: any, tag: Tag) => {
            state.tagsList = [tag];
        },
        SET_CURRENT_TAG: (state: any, tag: Tag) => {
            state.currentTag = tag;
        },
        SET_MAX_CACHED_NUM: (state: any, maxCachedNum: number) => {
            state.maxCachedNum = maxCachedNum;
        },
        CLEAR_TAG_DATA: (state: any) => {
            state.tagsList = [];
            state.currentTag = null;
        }
    },
    actions: {
        // 删除标签数组对应项，调整当前项
        delTag: ({ state, commit }: any, { index }: { index: number }) => {
            const { tagsList, currentTag } = state;
            const delItem = tagsList[index];
            commit('DEL_TAG_BY_INDEX', index);
            const item = tagsList[index] ? tagsList[index] : tagsList[index - 1];
            // 删除的是当前tag，则要更换tag(如果只有一项激活项，则清除currentTag)
            if (delItem.path === currentTag.path) {
                if (item !== null && typeof item === 'object') {
                    commit('SET_CURRENT_TAG', item);
                } else {
                    commit('SET_CURRENT_TAG', null);
                }
            }
        },
        moveToCurrent: ({ state, commit }: any, tag: Tag) => {
            const { tagsList, maxCachedNum } = state;
            const isExist = tagsList.findIndex((item: Tag) => item.path === tag.path);

            if (isExist === -1 && tagsList.length >= maxCachedNum) {
                commit('DEL_TAG_BY_INDEX', 0);
            }
            if (isExist === -1) {
                commit('ADD_TAG', tag);
            }
            commit('SET_CURRENT_TAG', tag);
        }
    }
};
export default tags;
