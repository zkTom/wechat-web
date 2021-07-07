<template>
    <div class="todo-list-wrapper">
        <div class="todo-list-header" ref="domRef">TODO LIST</div>
        <div class="todo-list-search">
            <span class="label">记录内容：</span>
            <div class="value">
                <input
                    type="text"
                    v-model="state.value"
                    class="core"
                    placeholder="输入记录内容"
                    @keyup.13="addToList"
                />
                <span class="right-icon" @click="addToList">确定</span>
            </div>
        </div>
        <div class="todo-list-state">
            <p class="label">事件状态：</p>
            <select name="state-list" id="state-list" v-model="state.selected">
                <option :value="item" class="state" v-for="(item, index) in state.stateList" :key="index">{{
                    item
                }}</option>
            </select>
            <div class="btn-group">
                <div class="btn btn-error" @click="deleteByBat">批量删除</div>
                <div class="btn btn-success" @click="completeByBat">批量完成</div>
            </div>
        </div>
        <ul class="todo-list-ul">
            <li class="li" v-for="(item, index) in showList" :key="index">
                <input
                    type="checkbox"
                    class="checkbox"
                    @change="checkboxChange(item)"
                    v-model="item.state"
                    v-if="!item.completed"
                />
                <div class="tip">{{ item.value }}</div>
                <div class="actions">
                    <span class="btn btn-error" @click="deleteOneByItem(item)">删除</span>
                    <span class="btn btn-success" @click="complete(item)" v-if="!item.completed">完成</span>
                    <span class="btn btn-info" v-else>已完成</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { reactive, computed, watch, ref, onUpdated, onMounted } from '@vue/composition-api';
const STATE_ALL = '全部';
const STATE_COMPLETE = '已完成';
const STATE_UNCOMPLETE = '未完成';
export default {
    name: 'CompositionApi',
    props: {
        foo: String
    },
    // beforeCreate,created取消
    // setup执行时机：在组件实例创建且props注入之后
    setup(props, context) {
        const batList = [];
        const domRef = ref(null);
        const state = reactive({
            selected: ref(STATE_ALL),
            stateList: [STATE_ALL, STATE_COMPLETE, STATE_UNCOMPLETE],
            value: ref('')
        });
        const completedObj = useOperateList();
        const unCompletedObj = useOperateList();
        // 切换展示使用
        const showList = computed(() => {
            let list;
            if (state.selected === STATE_ALL) {
                list = unCompletedObj.state.list.concat(completedObj.state.list);
            } else if (state.selected === STATE_COMPLETE) {
                list = completedObj.state.list;
            } else {
                list = unCompletedObj.state.list;
            }
            return list;
        });
        onMounted(() => {
            console.log('onMounted');
            console.log('dom element:' + domRef.value);
        });
        onUpdated(() => {
            console.log('onUpdated');
        });
        const asyncPrint = val => {
            return setTimeout(() => {
                console.log('async action:', val);
            }, 1000);
        };
        // const ref1 = ref('');
        // const ref2 = ref(1);
        // watch([ref1, ref2], ([ref1, ref2], [oldRef1, oldRef2]) => {})
        watch(
            () => state.value,
            (newVal, oldVal, onCleanup) => {
                console.log('watch input value change:' + state.value);
                // onCleanup 可以用来清除上一次watcher中注册的回调函数的side effects,比如有一个async function
                // onCleanup 的调用时机 ，每次watcher重复执行的时候/watcher被清理掉的时候
                const timerId = asyncPrint(newVal);
                onCleanup(() => clearTimeout(timerId));
            },
            {
                // vue2.x中wather callback默认是：当检测值发生改变，callback才会调用
                // vue3中会立即调用一次当组件挂载时，如果需要原来的效果则设置{ lazy: true }
                lazy: false,
                /**
                 * watcher一般会在compoent render function 结束后进行调用，但是如果需要更改调用是时期也是ok的
                 * post （default）| sync | pre
                 * post: 在所有compoent render function 结束后调用
                 * sync：同步调用，不用等组件加载完毕
                 * pre: 在所有compoent render function调用前调用
                 */
                flush: 'pre'
            }
        );
        // 手动停止监听
        // stop();
        function genItem(value) {
            return {
                value,
                state: false,
                completed: false
            };
        }
        function addToList() {
            const value = state.value;
            if (value) {
                unCompletedObj.addToRear(genItem(value));
                state.value = '';
            } else {
                console.log('输入内容不能为空');
            }
        }
        function complete(item) {
            // 可以完成那么一定在unCompletedList中，且要推入到completedList中
            item['completed'] = true;

            unCompletedObj.deleteOneByItem(item);
            completedObj.addToHead(item);
            // 如果勾选了该项那么需要手动清理掉该项在batList
            if (item.state) {
                const delIndex = batList.findIndex(batItem => batItem === item);
                delIndex > -1 && batList.splice(delIndex, 1);
            }
        }
        function completeByBat() {
            if (batList.length === 0) return;
            batList.forEach(item => complete(item));
        }
        function deleteOneByItem(item) {
            const { completed } = item;
            if (completed) {
                completedObj.deleteOneByItem(item);
            } else {
                unCompletedObj.deleteOneByItem(item);
            }
            // 如果勾选了该项那么需要手动清理掉该项在batList
            if (item.state) {
                const delIndex = batList.findIndex(batItem => batItem === item);
                delIndex && batList.splice(delIndex, 1);
            }
        }
        function deleteByBat() {
            if (batList.length === 0) return;
            batList.forEach(item => deleteOneByItem(item));
        }
        function checkboxChange(item) {
            const { state } = item;
            if (state) {
                batList.push(item);
            } else {
                const index = batList.findIndex(batItem => batItem === item);
                index > -1 && batList.splice(index, 1);
            }
        }
        return {
            domRef,
            state,
            showList,
            addToList,
            complete,
            completeByBat,
            deleteOneByItem,
            deleteByBat,
            checkboxChange
        };
    }
};
/**
 * useCompleteList
 * 集中完成相关的列表逻辑
 */
function useOperateList() {
    // state
    const state = reactive({
        list: []
    });
    const list = state.list;
    // 不能对数组自动unwrap ????
    // const list = ref([]);
    function addToHead(item) {
        list.unshift(item);
    }
    function addToRear(item) {
        list.push(item);
    }
    function deleteOneByItem(item) {
        const delIndex = getItemIndex(item);
        delIndex > -1 && list.splice(delIndex, 1);
    }
    /**
     * 批量删除，要删除的list，
     * 其中每一个都是item
     */
    function deleteBat(waitlist) {
        waitlist.forEach(item => deleteOneByItem(item));
    }
    function getItemIndex(item) {
        return list.findIndex(_item => item === _item);
    }

    return {
        state,
        addToHead,
        addToRear,
        deleteOneByItem,
        deleteBat,
        getItemIndex
    };
}
</script>
<style lang="scss" scoped>
.btn {
    cursor: pointer;
    user-select: none;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 24px;
    line-height: 24px;
    text-align: center;
    margin: 0;
    margin-right: 16px;
    border-radius: 2px;
    padding: 0 10px;
    font-size: 12px;
}
.btn-success {
    color: #fff;
    background-color: #07c160;
    border: 1px solid #07c160;
}
.btn-error {
    color: #fff;
    background-color: #ee0a24;
    border: 1px solid #ee0a24;
}
.btn-info {
    color: #fff;
    background-color: #1989fa;
    border: 1px solid #1989fa;
}
.todo-list-wrapper {
    border: 1px solid #ccc;
    width: 500px;
    margin: 50px auto;
    padding: 10px;
}
.todo-list-header {
    text-align: center;
    font-size: 28px;
    margin: 10px auto 40px;
}
.todo-list-search {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    .label {
        width: 90px;
        flex: none;
        font-size: 14px;
    }
    .value {
        border: 1px solid #f5f5f5;
        width: auto;
        flex: 1;
        position: relative;
        padding-right: 60px;
    }
    .core {
        background-color: #f5f5f5;
        width: 100%;
        line-height: 45px;
        padding-left: 10px;
        font-size: 14px;
        color: #ccc;
        border: none;
        outline: none;
    }
    .right-icon {
        position: absolute;
        top: 0;
        right: 10px;
        line-height: 45px;
        font-size: 14px;
        color: #ccc;
    }
}
.todo-list-state {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin: 10px 0;

    .label {
        font-size: 14px;
        margin-right: 10px;
    }
    .btn-group {
        position: absolute;
        right: 0px;
    }
}
select[name='state-list'] {
    height: 30px;
    padding: 5px;
    width: 100px;
}
.todo-list-ul {
    width: 100%;
    list-style: none;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 10px 0;
    .li {
        background-color: #f5f5f5;
        border-bottom: 1px solid #ccc;
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row;
        line-height: 30px;
    }
    .checkbox {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
    }
    .tip {
        width: auto;
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
    }
    .actions {
        width: 140px;
        height: 100%;
        display: flex;
        align-items: center;
        flex: none;
        flex-direction: row;
        justify-content: center;
        font-size: 14px;
    }
}
</style>
