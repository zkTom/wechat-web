<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item, index) in tagsList" :class="{ active: isActive(item.path) }" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{ item.title }}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <span class="tags-close-btn"> 标签选项<i class="el-icon-arrow-down el-icon--right"></i> </span>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        tagsList() {
            return this.$store.state.tags.tagsList;
        },
        currentTag() {
            return this.$store.state.tags.currentTag;
        },
        showTags() {
            return this.tagsList.length > 0;
        }
    },
    methods: {
        isActive(path) {
            return path === this.currentTag.path;
        },
        // 关闭单个标签
        closeTags(index) {
            const delItem = this.tagsList[index];
            const oldTagPath = this.currentTag.path;
            this.$store.dispatch('delTag', { index });
            const currentTag = this.currentTag;
            if (this.tagsList.length > 0 && currentTag !== null && currentTag.path.length > 0) {
                delItem.path === oldTagPath && this.$router.push(currentTag.path);
            } else {
                this.$router.push('/');
            }
        },
        // 关闭全部标签
        closeAll() {
            this.$store.commit('DEL_ALL_TAG');
            this.$router.push('/');
        },
        // 关闭其他标签
        closeOther() {
            const curItem = this.tagsList.find(item => item.path === this.$route.path);
            this.$store.commit('DEL_OTHER_TAG', curItem);
        },
        // 设置标签
        setTags(route) {
            const tag = {
                title: route.meta.title,
                path: route.path,
                name: route.matched[1].components.default.name
            };
            this.$store.dispatch('moveToCurrent', tag);
        },
        handleTags(command) {
            command === 'other' ? this.closeOther() : this.closeAll();
        }
    },
    watch: {
        $route(newValue) {
            this.setTags(newValue);
        }
    },
    created() {
        this.setTags(this.$route);
    }
};
</script>

<style lang="scss" scoped>
$-tags-height: 40px;
.tags {
    background-color: $--tags-background-color;
    box-sizing: border-box;
    box-shadow: 0 5px 10px #ddd;
    position: relative;
    height: 40px;
    overflow: hidden;
    padding-right: 120px;
}

.tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.tags-li {
    float: left;
    margin: 5px;
    border-radius: 3px;
    cursor: pointer;
    height: 30px;
    border: 1px solid #eee;
    background-color: $--tags-background-color;
    padding: 0 5px 0 12px;
    overflow: hidden;
    /* transition: background-color .3s ease-in-out; */

    color: $--tag-text-color;
    font-size: 12px;
    line-height: 30px;
    vertical-align: middle;
}

.tags-li:not(.active):hover {
    background: #f8f8f8;
}

.tags-li.active {
    background-color: $--tag-active-background-color;
    color: $--tag-active-text-color;
}

.tags-li-title {
    float: left;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;
    margin-right: 5px;
}
.tags-li-title:hover {
    color: #000;
    text-decoration: none;
}
.tags-li.active .tags-li-title {
    color: #fff;
    text-decoration: none;
}
.tags-li-icon:hover {
    color: #f5f5f5;
}

.tags-close-box {
    background-color: $--tag-active-background-color;
    border-radius: 3px;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 5px;
    text-align: center;
    width: 110px;
    height: 30px;
    line-height: 30px;
    z-index: 10;
}
.tags-close-btn {
    color: $--tag-active-text-color;
    font-size: 14px;
}
</style>
