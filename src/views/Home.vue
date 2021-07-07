<template>
    <div class="home" @click="submit">这是首页</div>
</template>
<script type="ts">
import { POST } from '@/api/request.ts';
export default {
    name: "Home",
    data() {
        return {};
    },
    mounted() {
        console.log('tesst');
    },
    methods: {
        submit() {
            POST('http://192.168.60.158:9000/api/helloDubboPost?token=123', { msg: 'hello world'});
        }
    }
};
</script>
<style lang="scss" scoped>
.home {
    border: 1px solid #ccc;
    width: 200px;
    height: 200px;
}
</style>
