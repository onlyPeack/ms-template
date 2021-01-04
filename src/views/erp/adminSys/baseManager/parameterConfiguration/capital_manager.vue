<template>
    <basic-container>
        <el-form ref="form" :model="form" label-width="120px">
            <div class="config_title">
                应收应付预警
                <el-tooltip class="item" effect="dark" content="配置销售订单应收款项和采购订单应付款项超期提醒的计算规则" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-left: 120px; margin-top: 20px;margin-bottom: 30px;">
                <div style="font-size: 13px;">销售应收账款超期提醒&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <el-select v-model="config1.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span style="font-size: 13px;">&nbsp;&nbsp;天</span>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-left: 120px; margin-top: 20px;margin-bottom: 30px;">
                <div style="font-size: 13px;">采购应付账款超期提醒&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <el-select v-model="config2.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span style="font-size: 13px;">&nbsp;&nbsp;天</span>
            </div>
            <div class="config_title">
                开票收票预警
                <el-tooltip class="item" effect="dark" content="配置销售订单应开票和采购订单应应收票超期提醒的计算规则" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-left: 120px; margin-top: 20px;margin-bottom: 30px;">
                <div style="font-size: 13px;">销售应开票超期提醒&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <el-select v-model="config3.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span style="font-size: 13px;">&nbsp;&nbsp;天</span>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-left: 120px; margin-top: 20px;margin-bottom: 30px;">
                <div style="font-size: 13px;">采购应收票超期提醒&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <el-select v-model="config4.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span style="font-size: 13px;">&nbsp;&nbsp;天</span>
            </div>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit" v-loading="formLoading">保 存</el-button>
            </el-form-item>
        </el-form>
    </basic-container>
</template>

<script>
    import {financialCreate, financialList} from '@/api/erp/manager/config/index'

    export default {
        name: "capital_manager",
        data() {
            return {
                options: [
                    {
                        value: 7,
                        label: '7'
                    },
                    {
                        value: 15,
                        label: '15'
                    },
                    {
                        value: 30,
                        label: '30'
                    },
                    {
                        value: 45,
                        label: '45'
                    },
                    {
                        value: 60,
                        label: '60'
                    },
                    {
                        value: 90,
                        label: '90'
                    },
                    {
                        value: 180,
                        label: '180'
                    },
                ],
                form: {},
                config1: {
                    type: 3,
                    name: '销售应收账款超期提醒',
                    value: 30
                },
                config2: {
                    type: 3,
                    name: '采购应付账款超期提醒',
                    value: 30
                },
                config3: {
                    type: 3,
                    name: '销售应开票超期提醒',
                    value: 30
                },
                config4: {
                    type: 3,
                    name: '采购应收票超期提醒',
                    value: 30
                },
                formLoading: false
            }
        },
        created() {
            financialList().then((res) => {
                const list = res.data.data.records;
                this.findItem(list, this.config1, 'config1');
                this.findItem(list, this.config2, 'config2');
                this.findItem(list, this.config3, 'config3');
                this.findItem(list, this.config4, 'config4');
            }, error => {
            });
        },
        methods: {
            findItem(list, obj, config) {
                var index = list.findIndex(item => item.name == obj.name);
                if (index > -1) {
                    this[config] = list[index];
                }
            },
            handleSubmit() {
                var list = [this.config1, this.config2, this.config3, this.config4,];
                this.formLoading = true;
                financialCreate(list).then((res) => {
                    this.formLoading = false;
                    if (res.status == 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.$router.push({
                            path: '/adminSys/baseManager/page_setting',
                            name: '首页设置',
                            meta: {
                                i18n: 'page_setting'
                            },
                            query: {
                                timeStamp: new Date().getTime()
                            },
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                }, error => {
                    this.formLoading = false;
                });
            }
        }
    }
</script>

<style lang="scss">
    .config_title {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: 600;
        border-left: 3px solid #409EFF;
        padding-left: 20px;
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .config_span {
        margin-right: 15px;
    }

    .xianji {
        width: 14px;
        height: 14px;
        background: url("http://hejigy.com.cn/questionMark.png") 100% 100% no-repeat;
        margin-right: 40px;
        margin-left: 6px;
    }

    .xianji:hover {
        width: 14px;
        height: 14px;
        background: url("http://hejigy.com.cn/questionMarks.png") 100% 100% no-repeat;
    }

    .config_titles {
        margin-top: 20px;
        margin-bottom: 30px;
        .el-radio-group, .el-form-item__content {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            .el-radio {
                margin-right: 0px;
            }
        }
    }
</style>
