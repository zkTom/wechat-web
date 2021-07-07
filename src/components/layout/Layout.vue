<template>
    <div class="app-wrapper">
        <v-head></v-head>
        <side-bar></side-bar>
        <div class="app-container" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="app-container-body">
                <transition name="move" mode="out-in">
                    <keep-alive :include="componentNameList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import SideBar from "@/components/sidebar/Index.vue";
import vHead from "@/components/header/Index.vue";
import vTags from "@/components/tags/Index.vue";
export default {
    name: "Layout",
    components: { SideBar, vHead, vTags },
    data() {
        return {
            collapse: false
        };
    },
    computed: {
        componentNameList() {
            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            const tagsList = this.$store.state.tags.tagsList;
            return tagsList.filter(tag => tag.name).map(tag => tag.name);
        }
    },
    created() {
        this.$bus.$on("collapse", msg => {
            this.collapse = msg;
        });
    }
};
</script>
<style lang="scss" scoped>
$-sidebar-width: 180px;
$-sidebar-collapse-width: 64px;
.app-wrapper {
    background-color: #f5f5f5;
    position: relative;
    height: 100%;
    width: 100%;
}
.app-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 180px;
    right: 0;
    top: 50px;
    bottom: 0;
    transition: left 0.3s ease-in-out;
    background: #f0f0f0;
    &-body {
        flex: 1;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        overflow-y: auto;
    }

    &.content-collapse {
        left: 65px;
    }
}
</style>
