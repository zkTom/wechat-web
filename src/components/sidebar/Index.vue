<template>
    <div class="sidebar">
        <!-- 折叠按钮 -->
        <hamburger
            :toggle-click="collapseChage"
            :is-active="collapse"
            :class="['collapse-btn', collapse ? 'is-collapse' : '']"
        />
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            :background-color="backgroundColor"
            :text-color="textColor"
            :active-text-color="activeTextColor"
            unique-opened
            router
        >
            <template v-for="item in secondMenu">
                <template v-if="item.children">
                    <el-submenu :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.path" :key="subItem.path">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem, i) in subItem.children"
                                    :key="i"
                                    :index="threeItem.path"
                                    >{{ threeItem.title }}</el-menu-item
                                >
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.path" :key="subItem.path">{{
                                subItem.title
                            }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { sidebarTextColor, sidebarActiveTextColor, sidebarBackgroundColor } from '@/assets/scss/variable.scss';
import bus from '../common/Bus.ts';
import Hamburger from '@/components/hamburger/Index.vue';
export default {
    components: {
        Hamburger
    },
    data() {
        return {
            collapse: false,
            backgroundColor: sidebarBackgroundColor,
            textColor: sidebarTextColor,
            activeTextColor: sidebarActiveTextColor
        };
    },
    computed: {
        secondMenu() {
            return this.$store.getters.secondMenu;
        },
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
        });
    },
    mounted() {
        if (document.body.clientWidth < 1200) {
            this.collapseChage();
        }
    },
    methods: {
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        }
    }
};
</script>

<style lang="scss" scoped>
$-sidebar-width: 180px;
$-sidebar-collapse-width: 64px;
.sidebar {
    background-color: $--sidebar-background-color;
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 180px;
}

.sidebar > ul {
    height: 100%;
}
.collapse-btn {
    background-color: $--sidebar-background-color;
    border-right: solid 1px #e6e6e6;
    box-sizing: border-box;
    width: $-sidebar-width;
    padding: 10px 0;
    text-align: center;
    transition: width 0.3s ease-in-out;
    &.is-collapse {
        width: $-sidebar-collapse-width;
    }
}
</style>
