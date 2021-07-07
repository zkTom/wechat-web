<template>
    <div class="header">
        <div class="logo" @click="goIndex">鱼小宝一站式管理平台</div>
        <div class="menu-list">
            <div
                :class="['menu-item', item.path === currentPath ? 'active' : '']"
                v-for="(item, index) in rootMenu"
                :key="index"
                @click="setIndex(index)"
            >
                {{ item.title }}
            </div>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!-- 用户头像 -->
                <div class="user-avator">{{ realName }}</div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changePassword">密码修改</el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            fullscreen: false,
            message: 2,
            dialogFormVisible: false,
            form: {
                loginPwd: ''
            }
        };
    },
    computed: {
        rootMenu() {
            return this.$store.getters.rootMenu;
        },
        currentPath() {
            return this.$store.state.user.currentPath;
        },
        realName() {
            const userInfo = this.$store.state.user.userInfo;
            let realName = '';
            if (userInfo !== null && userInfo.realName) {
                realName = userInfo.realName || userInfo.loginName;
            }
            return realName;
        }
    },

    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command === 'logout') {
                this.$store
                    .dispatch('logout')
                    .catch(() => {
                        this.$message.error('登出失败，请重试');
                    })
                    .finally(() => {
                        this.$router.push('/login');
                    });
            }
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        setIndex(index) {
            const path = this.rootMenu[index].path;
            // 改变2级+菜单
            this.$store.commit('SET_CURRENT_PATH', path);
        },
        goIndex() {
            this.$router.push('/index');
        }
    }
};
</script>
<style lang="scss" scoped>
.header {
    background-color: $--header-background-color;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: $--header-height;
    font-size: 22px;
    color: $--header-text-color;
}
.header .logo {
    float: left;
    padding: 0 20px;
    line-height: $--header-height;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: $--header-height;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: $--header-text-color;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 10px;
    font-size: 16px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: $--header-text-color;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.menu-list {
    cursor: pointer;
    float: left;
    height: $--header-height;
    line-height: $--header-height;
    .menu-item {
        background-color: $--header-background-color;
        float: left;
        font-size: 14px;
        color: $--header-text-color;
        padding: 0 15px;
    }
    .menu-item.active {
        background-color: $--header-active-background-color;
    }
}
</style>
