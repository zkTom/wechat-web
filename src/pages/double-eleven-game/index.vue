<template>
    <div class="kugou-content">
        <!-- banner图 -->
        <img src="../../assets/img/banner.png" alt class="bg-banner" />
        <!-- 滚动号码 -->
        <div class="kugou-scroll">
            <ul class="bg-scroll">
                <img src="../../assets/img/name.png" alt class="notice-img" />
                <li v-for="(item, i) in list" :key="i" ref="rollLi" :class="{ anim: animate && i == 0 }">
                    <span class="lkq-name">{{ item.phone }}</span>
                </li>
            </ul>
        </div>
        <!-- 抽奖弹窗 -->
        <div class="turntable">
            <!-- 转动背景 -->
            <img src="../../assets/img/flash.png" alt :class="['run-item-' + current]" />
            <!-- 礼品框 -->
            <img src="../../assets/img/present.png" alt class="present-content" />
            <!-- 抽奖按钮 -->
            <img @click="handleStart" src="../../assets/img/bigBottom.png" alt class="start-btn-big" />
        </div>
        <!-- 活动介绍 -->
        <div class="intro">
            <span class="title1">抽奖活动注意事项：</span>
            <span class="title2"
                >参与活动前，请详细阅读活动规则及相关条款。凡参与本次活动，则视为同意活动规则及免费声明。</span
            >
            <div class="items">
                <span class="item">1、奖品不设退、换服务。</span>
                <span class="item">2、活动奖品以收到的实物为准。</span>
                <span class="item">3、活动过程中，最终礼品发放以用户填写的真实身份信息为准。</span>
            </div>
            <span class="no-duty"
                >免责说明：河北在哪儿为答谢邯郸本地用户，特举行“双十一巨惠，好礼送不停”活动，此活动秉着公平、公正、公开、真实的原则，不存在任何违法行为。</span
            >
            <span class="explain">河北在哪儿拥有本次活动的修改权、更新权及最终解释权。</span>
        </div>
        <!-- 奖品弹框 -->
        <van-overlay :show="show" z-index="999">
            <div class="custom-dialog">
                <img class="reward-img" src="../../assets/img/reward.png" />
                <van-icon name="close" class="close-btn" @click.stop="show = false" />
                <div class="custom-dialog-body">
                    <p class="p2">恭喜您获得</p>
                    <p class="p3" v-if="this.award.id">{{ this.awards[this.award.id - 1].name }}</p>
                </div>
                <div class="custom-dialog-footer">
                    请您在7个工作日内携带身份证以及要备案的电动车 到滏东南大街明珠广场西楼邯郸市公共安全物联网中心
                    兑换奖品 兑奖时间：上午9：00-11；30 下午14:00-17：00
                </div>
            </div>
        </van-overlay>
    </div>
</template>
<script>
import { activityLottery } from '../../api/userApi';
import { parseQs, debounce } from '../../utils/common';
const giftMap = {
    A: 8,
    B: 1,
    C: 4,
    D: 7
};
const awards = [
    // 奖品列表
    {
        id: 1,
        name: '头盔'
    },
    {
        id: 2,
        name: 'iphone12'
    },
    {
        id: 3,
        name: '小牛电动车'
    },
    {
        id: 4,
        name: '话费现金券'
    },
    {
        id: 5,
        name: '橘洲满减券'
    },
    {
        id: 6,
        name: '神秘礼品'
    },
    {
        id: 7,
        name: '上牌免单'
    },
    {
        id: 8,
        name: '精品食用油'
    }
];
export default {
    name: 'DoubleElevenGame',
    data() {
        return {
            animate: false,
            initSpeed: 200, // 初始速度
            speed: null, // 变化速度
            diff: 20, // 速度变化的值，值越大，变化地越快
            award: {}, // 抽中的奖品
            awards: awards,
            time: 0, // 记录开始抽奖的时间
            current: 0, // 当前转动的位置
            isRuningLucky: false, // 是否正在抽奖
            list: [
                // 中奖号码
            ],
            form: {
                openid: ''
            },
            show: false, // 奖品弹出框
            state: 0 // 0服务器错误，-1:非微信环境 1: 状态正常
        };
    },
    created() {},
    mounted() {
        const key = '__11_openid__';
        // 获取localStorage的openid
        const localOpenid = localStorage.getItem(key);
        // 去除
        // http://localhost:3000/double-eleven-game.html?openid=1111#/
        let href = window.location.href;
        const idx = href.indexOf('#');
        if (idx > 0) {
            href = href.substring(0, idx);
        }

        const o = parseQs(href);
        if (localOpenid) {
            this.form.openid = localOpenid;
        } else if (o && o['openid']) {
            this.form.openid = o['openid'];
        }
        setInterval(this.scroll, 2000);
    },
    methods: {
        // 抽奖
        handleStart() {
            if (!this.form.openid) {
                this.state = -1;
                this.$toast('请在微信内打开页面');
                return;
            }
            // 如果抽过奖那么不能再抽奖
            if (this.award.id) {
                this.$toast('您已经抽取过奖品了');
                return;
            }
            if (this.isRuningLucky) {
                // this.$toast('正在抽奖中...')
                return;
            }
            if (isNaN(Number(this.initSpeed))) {
                return false;
            }
            this.speed = this.initSpeed;
            // 开始抽奖
            this.isRuningLucky = true;
            this.time = Date.now();
            this.drawAward();
        },
        drawAward: debounce(async function() {
            // 请求接口，模拟一个抽奖数据(假设请求时间为2s)
            // setTimeout(() => {
            //     this.award = {
            //         id: '4'
            //     };
            // }, 2000);
            // this.move();
            try {
                const res = await activityLottery(this.form);
                if (res.respCode === '0000') {
                    const letter = res.respData;
                    this.award = {
                        id: giftMap[letter]
                    };
                    this.move();
                } else {
                    this.$toast(res.respMsg);
                    throw new Error(res.respMsg || '');
                }
            } catch (error) {
                this.state = 0;
                // this.$toast(error);
            }
        }, 300),
        move() {
            let timer = setTimeout(() => {
                this.current++;
                if (this.current > 7) {
                    this.current = 0;
                }
                // 若抽中的奖品id存在，则开始减速转动
                if (this.award.id && (Date.now() - this.time) / 1000 > 2) {
                    console.log('奖品出来了');
                    this.speed += this.diff; // 转动减速

                    // 若转动时间超过4秒，并且奖品id等于小格子的奖品id，则停下来
                    if (
                        (Date.now() - this.time) / 1000 > 4 &&
                        parseInt(this.award.id) === this.awards[this.current].id
                    ) {
                        clearTimeout(timer);

                        setTimeout(() => {
                            this.isRuningLucky = false;
                            // 这里写停下来要执行的操作（弹出奖品框）
                            this.show = true;
                        }, 150);
                        return;
                    }

                    // 若抽中的奖品不存在，则加速转动
                } else {
                    if (this.speed >= 50) {
                        this.speed -= this.diff; // 转动加速
                    }
                }

                this.move();
            }, this.speed);
        },
        // 中奖名单滚动
        scroll() {
            this.animate = true;
            setTimeout(() => {
                this.list.push(this.list[0]);
                this.list.shift();
                this.animate = false;
            }, 500);
        }
    }
};
</script>
<style lang="scss" scoped>
.kugou-content {
    background-color: #1f1f2f;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 4.1rem;
    min-height: 100vh;
}
.kugou-content .bg-banner {
    position: absolute;
    top: 0;
    right: 0;
    width: 8.4rem;
}
.kugou-content .kugou-scroll .bg-scroll {
    position: relative;
    background: url('../../assets/img/phone.png') center top no-repeat;
    background-size: 100%;
    width: 100%;
    height: 0.74rem;
    line-height: 0.74rem;
    font-size: 0.35rem;
    overflow: hidden;
    text-align: center;
    letter-spacing: 0.03rem;
}
.kugou-content .kugou-scroll .lkq-name {
    margin: 0 auto;
    color: #fff;
    font-size: 0.28rem;
}
.kugou-content .kugou-scroll .anim {
    -webkit-transition: all 0.5s linear;
    transition: all 0.5s linear;
    margin-top: -0.74rem;
}
.kugou-content .turntable {
    position: relative;
    background: url('../../assets/img/lottery.png') center top no-repeat;
    background-size: 8.5rem;
    background-position: -1.06rem -0.9rem;
    height: 8.2rem;
    padding: 1.55rem 0.83rem 1.15rem;
}
.kugou-content .turntable .present-content {
    width: 75%;
    position: absolute;
    top: 1.68rem;
    left: 0.96rem;
    z-index: 100;
}
.kugou-content .turntable .start-btn-big {
    width: 1.8rem;
    position: absolute;
    top: 3.55rem;
    left: 2.88rem;
    z-index: 999;
    animation: btn-animation 0.3s ease-out infinite alternate;
}
.kugou-content .turntable .run-item-0 {
    width: 2.03rem;
}
.kugou-content .turntable .run-item-1 {
    width: 2.03rem;
    display: block;
    margin: 0 0 0 1.93rem;
}
.kugou-content .turntable .run-item-2 {
    width: 2.03rem;
    display: block;
    margin: 0 0 0 3.85rem;
}
.kugou-content .turntable .run-item-3 {
    width: 2.03rem;
    display: block;
    margin: 1.9rem 0 0 3.85rem;
}
.kugou-content .turntable .run-item-4 {
    width: 2.03rem;
    display: block;
    margin: 3.8rem 0 0 3.85rem;
}
.kugou-content .turntable .run-item-5 {
    width: 2.03rem;
    display: block;
    margin: 3.8rem 0 0 1.925rem;
}
.kugou-content .turntable .run-item-6 {
    width: 2.03rem;
    display: block;
    margin: 3.8rem 0 0 0;
}
.kugou-content .turntable .run-item-7 {
    width: 2.03rem;
    display: block;
    margin: 1.9rem 0 0 0;
}
.notice-img {
    position: absolute;
    top: 0.12rem;
    left: 0.55rem;
}
@keyframes btn-animation {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0.85);
    }
}
// 活动介绍css
.intro {
    display: flex;
    flex-direction: column;
    margin: 40px 10px 0;
    padding: 0 15px;

    .title1 {
        font-weight: 800;
        font-size: 12px;
        color: #fdedc1;
        padding-bottom: 20px;
    }
    .title2 {
        font-weight: 400;
        font-size: 12px;
        color: #fdedc1;
        padding-bottom: 20px;
    }
    .items {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }
    .items:last-child {
        margin-bottom: 30px;
    }
    .item {
        font-size: 12px;
        font-weight: 400;
        color: #e5e7f9;
        line-height: 20px;
    }
    .no-duty {
        font-size: 10px;
        color: #e5e7f9;
        padding-bottom: 20px;
    }
    .explain {
        font-size: 12px;
        color: #e5e7f9;
        padding-bottom: 20px;
    }
}
.custom-dialog {
    position: relative;
    top: 30%;
    margin: 20px 25px;
    &-body {
        background-color: #fff;
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding: 30px 0;
    }
    &-footer {
        background: linear-gradient(132deg, #ffffff 0%, #e7ebf3 100%);
        border-radius: 0 0 8px 8px;
        padding: 15px;
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
    }
    .p2 {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 15px;
    }
    .p3 {
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 26px;
    }
    .reward-img {
        position: absolute;
        top: -140px;
        width: 100%;
        max-height: 100%;
    }
    .close-btn {
        position: absolute;
        top: -60px;
        right: 5px;
        font-size: 26px;
        color: #ccc;
    }
}
</style>
