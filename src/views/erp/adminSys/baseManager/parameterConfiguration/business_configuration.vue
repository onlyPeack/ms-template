<template>
    <basic-container>
        <el-form ref="form" :model="form" label-width="120px">
            <div class="config_title">
                订单出库规则
            </div>
            <el-form-item class="config_titles">
                <el-radio-group v-model="config1.value">
                    <el-radio :label="0">先进先出</el-radio>
                    <el-tooltip class="item" effect="dark" content="订单出库商品根据入库批次，先入库的优先出库" placement="top-start">
                        <div class="xianji"></div>
                    </el-tooltip>
                    <el-radio :label="1">手工选批次</el-radio>
                    <el-tooltip class="item" effect="dark" content="手动选择商品批次号进行出库" placement="top-start">
                        <div class="xianji"></div>
                    </el-tooltip>
                </el-radio-group>
            </el-form-item>
            <div class="config_title">
                订单配置
            </div>
            <el-form-item class="config_titles">
                <span class="config_span">是否允许超卖:</span>
                <el-switch v-model="config2.value" :active-value="0" :inactive-value="1"
                           @change="handleSwitch"></el-switch>
                <el-tooltip class="item" effect="dark" content="销售订单制单时，如果订单商品没有库存，是否允许期货下单" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </el-form-item>
            <el-form-item class="config_titles">
                <span class="config_span">是否允许锁库:</span>
                <el-switch v-model="config3.value" :active-value="0" :inactive-value="1"
                           :disabled="config2.value==0?true:false"></el-switch>
                <el-tooltip class="item" effect="dark"
                            content="销售订单制单时，提交订单是否进行锁库，若不允许，订单出库前不影响库存；若允许，订单提交锁定库存数量，库存可用数量扣减" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </el-form-item>
            <!--<el-form-item>-->
            <!--<span class="config_span">是否判断库存:</span>-->
            <!--<el-switch v-model="config4.value" :active-value="0" :inactive-value="1"></el-switch>-->
            <!--</el-form-item>-->
            <div class="config_title">
                开票规则
            </div>
            <el-form-item class="config_titles">
                <span class="config_span">是否允许未出库先开票:</span>
                <el-switch v-model="config5.value" :active-value="0" :inactive-value="1"></el-switch>
                <el-tooltip class="item" effect="dark" content="销售开票单制单时，根据开票规则确定开票数量取值于订单数量中的商品数量还是订单数量中已出库商品数量。"
                            placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </el-form-item>
            <div class="config_title">
                缺货补货设置
                <el-tooltip class="item" effect="dark" content="设置采购申请缺货补货的商品数量" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;margin-left: 120px; margin-top: 20px;margin-bottom: 30px;">
                <div style="font-size: 13px;">缺货数量&nbsp;&nbsp;=&nbsp;&nbsp;</div>
                <el-select v-model="config6.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit" v-loading="formLoading">保 存</el-button>
            </el-form-item>
        </el-form>
    </basic-container>
</template>

<script>
    import {businessCreate, businessList} from '@/api/erp/manager/config/index'

    export default {
        name: "business_configuration",
        data() {
            return {
                options: [
                    {
                        value: 0,
                        label: '待出库数量-可用库存'
                    },
                    {
                        value: 1,
                        label: '待出库数量-待入库数量-可用库存'
                    }
                ],
                form: {},
                config1: {
                    type: 0,
                    name: '订单出库规则',
                    value: 0
                },
                config2: {
                    type: 0,
                    name: '是否允许超卖',
                    value: 1
                },
                config3: {
                    type: 0,
                    name: '是否允许锁库',
                    value: 1
                },
                // config4: {
                //     type: 0,
                //     name: '是否判断库存',
                //     value: 1
                // },
                config5: {
                    type: 0,
                    name: '是否允许未出库先开票',
                    value: 1
                },
                config6: {
                    type: 0,
                    name: '缺货补货设置',
                    value: 0
                },
                formLoading: false
            }
        },
        created() {
            businessList().then((res) => {
                const list = res.data.data.records;
                this.findItem(list, this.config1, 'config1');
                this.findItem(list, this.config2, 'config2');
                this.findItem(list, this.config3, 'config3');
                // this.findItem(list, this.config4, 'config4');
                this.findItem(list, this.config5, 'config5');
                this.findItem(list, this.config6, 'config6');
            }, error => {
            });
        },
        methods: {
            handleSwitch(val) {
                if (val == 0) {
                    this.config3.value = 1;
                }
            },
            findItem(list, obj, config) {
                var index = list.findIndex(item => item.name == obj.name);
                if (index > -1) {
                    this[config] = list[index];
                }
            },
            handleSubmit() {
                var list = [this.config1, this.config2, this.config3, this.config5, this.config6];
                this.formLoading = true;
                businessCreate(list).then((res) => {
                    this.formLoading = false;
                    if (res.status == 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        let userinfo = JSON.parse(JSON.stringify(this.$store.getters.userInfo))
                        userinfo.isInit = 1;
                        this.$store.commit('SET_USERIFNO', userinfo);
                        this.$router.push({
                            path: '/system_parameter',
                            name: '系统参数',
                            meta: {
                                i18n: 'system_parameter'
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
