<template>
    <div class="page-layout-container video-game-tree">
        <div class="top">
            <el-upload
                ref="json-upload"
                name="chlFile"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-error="handleError"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :show-file-list="false"
            >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传JSON文件</div>
            </el-upload>
            <el-button type="primary" @click="onExportJson">导出JSON</el-button>
        </div>
        <div class="page-layout__left">
            <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                :filter-node-method="handleFilterNode"
                class="menu-tree"
                highlight-current
                ref="elTree"
                v-loading="isLoading"
            >
                <div class="menu-item clearfix" slot-scope="{ node, data }">
                    <div class="menu-item-left">
                        <i :class="['el-icon', 'menu-item-icon', 'menu-item-icon--success']"></i>
                        <span class="menu-item-text">{{ data.name }}</span>
                    </div>
                    <div class="menu-item-right clearfix">
                        <i class="el-icon el-icon-plus menu-item-action-icon" @click.stop="onAdd(data)"></i>
                        <i class="el-icon el-icon-edit menu-item-action-icon" @click.stop="onEdit(data)"></i>
                        <i class="el-icon el-icon-delete menu-item-action-icon" @click.stop="onDelete(node, data)"></i>
                    </div>
                </div>
            </el-tree>
        </div>
        <div class="page-layout__right">
            <template v-if="menuDetail">
                <el-form
                    :model="menuDetail"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="200px"
                    class="custom-table-form"
                >
                    <el-form-item prop="id" label="视频片段id">
                        <el-input
                            v-model="menuDetail.id"
                            placeholder="视频片段名字"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="视频片段名字">
                        <el-input
                            v-model="menuDetail.name"
                            placeholder="视频片段名字"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="text" label="互动按钮文字描述">
                        <!-- <el-input
                            v-model="menuDetail.text"
                            placeholder="互动按钮文字描述"
                            :disabled="action === 'show'"
                        ></el-input> -->
                        <el-autocomplete
                            class="inline-input"
                            v-model="menuDetail.text"
                            :fetch-suggestions="querySearch"
                            placeholder="互动按钮文字描述"
                            @select="handleSelect"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item prop="url" label="互动视频链接">
                        <el-input
                            v-model="menuDetail.url"
                            placeholder="互动视频链接"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="adMark" label="是否为广告点" required>
                        <el-radio-group v-model.number="menuDetail.adMark" :disabled="action === 'show'">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                        <el-tooltip
                            effect="dark"
                            content="该配置已经废弃，不推荐使用，但是仍然生效"
                            placement="top-start"
                        >
                            <i style="margin-left: 50px" class="el-icon-warning"></i>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item prop="gameResult" label="是否为结局" required>
                        <el-radio-group v-model.number="menuDetail.gameResult" :disabled="action === 'show'">
                            <el-radio :label="0">失败结局</el-radio>
                            <el-radio :label="1">成功结局</el-radio>
                            <el-radio :label="2">无结局</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="qustData.text" label="互动选项标题">
                        <el-input
                            v-model="menuDetail.qustData.text"
                            placeholder="播放结束时的互动选项标题"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="qustData.audio" label="互动选项标题配音">
                        <el-input
                            v-model="menuDetail.qustData.audio"
                            placeholder="播放结束时的互动选项标题配音"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="tipsData.text" label="互动提示文字">
                        <el-input
                            v-model="menuDetail.tipsData.text"
                            placeholder="视频开始播放时的互动提示文字"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="tipsData.audio" label="互动提示文字配音">
                        <el-input
                            v-model="menuDetail.tipsData.audio"
                            placeholder="视频开始播放时的互动提示文字配音"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="tipsData.startTime" label="视频开始的第几秒播放">
                        <el-input
                            type="number"
                            v-model.number="menuDetail.tipsData.startTime"
                            placeholder="视频开始的第几秒播放"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="tipsData.duration" label="视频开始时的互动提示文字配音时长">
                        <el-input
                            type="number"
                            v-model.number="menuDetail.tipsData.duration"
                            placeholder="视频开始播放时的互动提示文字配音时长"
                            :disabled="action === 'show'"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="handle-button">
                    <el-button type="primary" @click="onSave" v-if="action !== 'show'">保存修改</el-button>
                </div>
            </template>
            <span class="menu-init-txt" v-else>点击左侧菜单查看明细</span>
        </div>
    </div>
</template>
<script type="ts">
import { checkHttpUrl } from '@/utils/common';
import { clothesList } from './config';
/* eslint-disable */
const FileSaver = require('file-saver');
/**
 * 将file对象（.json文件）转为json对象
 * @param {File} file file对象
 */
function fileToJson(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (res) => {
            const { result } = res.target; // 得到字符串
            const data = JSON.parse(result); // 解析成json对象
            resolve(data);
        }; // 成功回调
        reader.onerror = (err) => {
            reject(err);
        }; // 失败回调
        reader.readAsText(new Blob([file]), 'utf-8'); // 按照utf-8编码解析
    });
}
const defaultItem = {
    id: '', // 片段id
    name: '', // 片段名字，
    text: '', // 互动按钮文字描述
    iconIdx: -1, // （抖音游戏最后生成的时候为对应的idx）
    url: '', // 互动视频链接
    adMark: 0, // 是否是广告点

    gameResult: 2, // 0 失败，1成功，2,没有结局
    qustData: {
        // 播放结束时的互动配置
        text: '', // 选项标题
        audio: '' // 标题对应的音乐
    },
    tipsData: {
        // 视频开始播放时的互动提示
        text: '', // 提示文字
        audio: '', // 文字对应的音频
        startTime: '', // 视频开始的第几秒播放
        duration: '' // 音频时长
    }
    // buttons: []
};
function validateUrl(rule, value, callback) {
    if (!value) {
        return callback(new Error('视频URL不能为空'));
    }
    if (!checkHttpUrl(value)) {
        return callback(new Error('视频URL格式不正确'));
    }
    callback();
}
export default {
    name: 'TTGame',
    data() {
        return {
            action: '',
            isLoading: true,
            menuDetail: null,
            treeData: [],
            parentItem: null,
            chosenItem: null,
            defaultProps: {
                children: 'buttons',
                label: 'label'
            },
            clothesList: clothesList,
            rules: {
                id: { required: true, message: '请填写视频片段ID', trigger: 'change' },
                name: { required: true, message: '请填写视频片段名称', trigger: 'change' },
                text: { required: true, message: '请填写视频片段对应的按钮文本描述', trigger: 'change' },
                url: { validator: validateUrl, trigger: 'blur' },
                'qustData.text': { required: true, message: '请填写播放结束时的互动标题', trigger: 'change' }
            }
        };
    },
    mounted() {
        this.isLoading = false;
        const item = JSON.parse(JSON.stringify(defaultItem));
        item.name = 'test';
        item.text = '';
        this.treeData = [item];
        // 监听 ctrl + s
        document.addEventListener('keydown', (e) => {
            if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                this.onCtrlS.bind(this)();
            }
        });
    },
    methods: {
        onAdd(data) {
            this.action = 'add';
            const item = JSON.parse(JSON.stringify(defaultItem));
            this.menuDetail = item;
            this.parentItem = data;
        },
        onEdit(data) {
            this.action = 'edit';
            const item = JSON.parse(JSON.stringify(defaultItem));
            this.menuDetail = Object.assign({}, item, data);
            this.chosenItem = data;
        },
        onDelete(node, data) {
            const parent = node.parent;
            const children = parent.data.buttons || parent.data;
            const index = children.findIndex((d) => d.id === data.id);
            children.splice(index, 1);
        },
        onSave() {
            let flag = false;
            this.$refs['ruleForm'].validate((valid) => (flag = valid));
            if (!flag) {
                return;
            }
            if (this.action === 'add') {
                const data = this.parentItem;
                if (Array.isArray(data.buttons)) {
                    data.buttons.push(this.menuDetail);
                } else {
                    this.$set(data, 'buttons', []);
                    data.buttons.push(this.menuDetail);
                }
            } else if (this.action === 'edit') {
                Object.assign(this.chosenItem, this.menuDetail);
            }
            this.parentItem = null;
            this.chosenItem = null;
            this.menuDetail = null;
            this.action = '';
        },
        onExportJson() {
            const blob = new Blob([JSON.stringify(this.treeData[0])], { type: 'application/json;charset=utf-8' });
            FileSaver.saveAs(blob, 'test.json');
        },
        onCtrlS() {
            let flag = false;
            this.$refs['ruleForm'].validate((valid) => (flag = valid));
            if (!flag) {
                return;
            }
            if (this.action === 'add') {
                const data = this.parentItem;
                if (Array.isArray(data.buttons)) {
                    data.buttons.push(this.menuDetail);
                } else {
                    this.$set(data, 'buttons', []);
                    data.buttons.push(this.menuDetail);
                }
            } else if (this.action === 'edit') {
                Object.assign(this.chosenItem, this.menuDetail);
            }
        },
        handleSuccess(response, file, fileList) {
            console.log('handleSuccess', file);
            this.$message.success('上传成功');
        },
        beforeUpload(file) {
            console.log(file);
            const fileType = file.type;
            // 判断是否文件类型
            const name = file.name.toLowerCase();
            if (!/(json)$/.test(name)) {
                this.$message.error('上传格式不支持');
                return false;
            }
            // 检查大小
            fileToJson(file)
                .then((res) => {
                    console.log('转化JSON成功', res);
                    this.treeData.splice(0);
                    this.treeData.push(res);
                })
                .catch((err) => {
                    console.log('转化JSON失败', err);
                });
            return true;
        },
        handleError(err, file) {
            console.log(err, file);
            this.$message.error('上传失败，请重试');
        },
        handleNodeClick(data) {
            this.action = 'show';
            const item = JSON.parse(JSON.stringify(defaultItem));
            this.menuDetail = Object.assign({}, item, data);
        },
        handleFilterNode(value, data) {
            if (!value) return true;
            return data.item.name.indexOf(value) !== -1;
        },
        querySearch(queryString, cb) {
            // 调用 callback 返回建议列表的数据
            const clothesList = this.clothesList;
            if (queryString) {
                const results = clothesList.filter((item) => item.value.indexOf(queryString) > -1);
                cb(results);
            } else {
                cb(clothesList);
            }
        },
        handleSelect(item) {
            this.menuDetail.iconIdx = this.clothesList.findIndex((clothes) => clothes.value === item.value);
        }
    }
};
</script>
<style lang="scss" scoped>
.video-game-tree {
    margin: 100px;
    .top {
        position: absolute;
        left: 150px;
        top: -50px;
        > div {
            float: left;
        }
    }
}
.handle-button {
    display: flex;
    justify-content: center;
}
.menu {
    &-init-txt {
        height: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c5c5c5;
    }
    &-tree {
        font-size: 14px;
    }
    &-item {
        background-color: #f5f5f5;
        border: 1px solid #eee;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        &:hover .menu-item-action-icon {
            display: block;
        }
    }
    &-item-left {
        float: left;
    }
    &-item-right {
        float: right;
    }
    &-item-text {
        margin-left: 10px;
    }
    &-item-action-icon {
        display: none;
        float: left;
        line-height: 40px;
        padding-left: 5px;
        padding-right: 5px;
    }
    &-item-icon {
        background-color: #e6f5fa;
        border-width: 1px;
        border-color: #ccebf5;
        border-style: solid;
        border-radius: 4px;
        box-sizing: border-box;
        display: inline-block;
        color: #09c;
        white-space: nowrap;

        &--success {
            background-color: #f0f9eb;
            border-color: #e1f3d8;
            color: #67c23a;
        }
        &--warning {
            background-color: #fdf6ec;
            border-color: #faecd8;
            color: #e6a23c;
        }
    }
}
</style>
