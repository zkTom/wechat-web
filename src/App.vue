<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
export default {
    name: 'App',
    data() {
        return {};
    }
};
</script>

<style lang="scss">
// 全局样式
@import './assets/scss/index.scss';
@import './assets/css/theme/index.css';
</style>
