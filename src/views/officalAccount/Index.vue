<template>
    <div class="account-container">
        <div class="account-header">
            <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="0px">
                <el-form-item style="width: 150px;">
                    <el-select v-model="searchForm.serviceTypeInfo" placeholder="选择公众号类型">
                        <el-option
                            v-for="serviceTypeInfoItem in serviceTypeInfoList"
                            :key="serviceTypeInfoItem.value"
                            :label="serviceTypeInfoItem.label"
                            :value="serviceTypeInfoItem.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 150px;">
                    <el-select v-model="searchForm.verifyTypeInfo" placeholder="选择认证类型">
                        <el-option
                            v-for="verifyTypeInfoItem in verifyTypeInfoList"
                            :key="verifyTypeInfoItem.value"
                            :label="verifyTypeInfoItem.label"
                            :value="verifyTypeInfoItem.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.nickname" placeholder="公众号名称">
                        <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" icon="el-icon-plus">添加公众号</el-button>
        </div>
        <div class="account-body clearfix">
            <el-table :data="list" stripe border>
                <el-table-column label="公众号" align="center" width="200">
                    <template slot-scope="{ row }">
                        <img :src="row.headImg" width="30" height="30" />
                        <span>{{ row.nickName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceTypeInfo"
                    label="公众号类型"
                    align="center"
                    width="200"
                    :formatter="formatServiceTypeInfo"
                ></el-table-column>
                <el-table-column
                    prop="verifyTypeInfo"
                    label="认证类型"
                    align="center"
                    width="200"
                    :formatter="formatVerifyTypeInfo"
                ></el-table-column>
                <el-table-column prop="fans" label="粉丝数" width="200" align="center"></el-table-column>
                <el-table-column prop="livingFans" label="活跃粉丝数" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" width="160" align="center">
                    <el-button type="text" size="small">删除</el-button>
                    <el-button type="text" size="small">分组</el-button>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
    name: 'OfficalAccountListView',
    data() {
        return {
            searchForm: {
                serviceTypeInfo: -1, // 公众号类型
                verifyTypeInfo: -2,// 公众号认证类型
                nickname: '' // 公众号名称
            },
            // 公众号类型 0 订阅号 1 由历史老帐号升级后的订阅号 2 服务号
            serviceTypeInfoList: [
                {
                    label: '全部公众号类型',
                    value: -1
                },
                {
                    label: '订阅号',
                    value: 0
                },
                {
                    label: '由历史老帐号升级后的订阅号',
                    value: 1
                },
                {
                    label: '服务号',
                    value: 2
                }
            ],
            // 公众号认证类型 -1 未认证 0 微信认证 1 新浪微博认证 2 腾讯微博认证 3 已资质认证通过但还未通过名称认证 4 已资质认证通过、还未通过名称认证，但通过了新浪微博认证 5 已资质认证通过、还未通过名称认证，但通过了腾讯微博认证
            verifyTypeInfoList: [
                {
                    label: '全部认证类型',
                    value: -2
                },
                {
                    label: '未认证',
                    value: -1
                },
                {
                    label: '已认证',
                    value: 0
                }
            ],
            list: [
                {
                    id: 1,
                    headImg: 'http://wx.qlogo.cn/mmopen/o9OiaNOkYSIWvZFNo3uoLJ7UQ4bAjsbryB44XAb2Hic0T55sicjgreuhmeOJAMtV756KFlN9uosiaNbpSKiciamYTFGjRcLya34q76/0',
                    nickName: '家校慧痛',
                    serviceTypeInfo: 1,
                    verifyTypeInfo: 0,
                    fans: 200,
                    livingFans: 20

                }
            ]
        };
    },
    mounted() {},
    methods: {
        formatServiceTypeInfo(row, column, value) {
            const list = this.serviceTypeInfoList;
            const item = list.find(item => item.value === value);

            return item && item.label || "不支持";
        },
        formatVerifyTypeInfo(row, column, value) {
            const list = this.verifyTypeInfoList;
            const item = list.find(item => item.value === value);

            return item && item.label || "不支持";
        }
    }
};
</script>
<style lang="scss" scoped>
.account-header {
    background-color: #fff;
    border-radius: 6px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 20px 20px 0;
    .el-form-block {
        display: flex;
        align-items: flex-start;
    }
}
.account-body {
    background-color: #fff;
    margin-top: 10px;
    padding: 20px;
}
</style>
