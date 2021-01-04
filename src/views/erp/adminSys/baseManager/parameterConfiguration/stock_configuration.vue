<template>
    <basic-container>
        <el-form ref="form" :model="form" label-width="120px">
            <div class="config_title">
                库存预警设置
                <el-tooltip class="item" effect="dark" content="配置系统库存高于上限、低于下限时进行提醒的计算规则" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </div>
            <el-form-item class="config_titles">
                <el-radio-group v-model="config1.value">
                    <div style="display: flex;flex-direction: column;">
                        <div style="height: 30px;"></div>
                        <div>
                            <el-radio :label="0">可用库存>库存上限 / 可用库存
                                &lt;库存下限&nbsp;&nbsp;&nbsp;&nbsp;
                            </el-radio>
                            <el-radio :label="1">可用库存-待出库>库存上限 / 可用库存-待出库
                                &lt;库存下限&nbsp;&nbsp;&nbsp;&nbsp;
                            </el-radio>
                        </div>
                        <div style="height: 30px;"></div>
                        <div>
                            <el-radio :label="2">账面库存>库存上限 / 账面库存
                                &lt;库存下限
                            </el-radio>
                        </div>
                        <div style="height: 20px;"></div>
                    </div>
                </el-radio-group>
            </el-form-item>
            <div class="config_title">
                库存预警补货
                <el-tooltip class="item" effect="dark" content="配置库存预警缺货数量的计算规则" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </div>
            <el-form-item label="" class="config_titles">
                <el-radio-group v-model="config2.value">
                    <div style="display: flex;flex-direction: column;">
                        <div style="height: 30px;"></div>
                        <div>
                            <el-radio :label="0">缺货数量=库存下限-可用库存&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                            <el-radio :label="1">缺货数量=库存下限+待出库-可用库存-待入库&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                        </div>
                        <div style="height: 30px;"></div>
                        <div>
                            <el-radio :label="2">缺货数量=库存上限-可用库存&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                            <el-radio :label="3">缺货数量=库存上限+待出库-可用库存-待入库&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                        </div>
                        <div style="height: 20px;"></div>
                    </div>
                </el-radio-group>
            </el-form-item>
            <div class="config_title">
                销售考核价
                <el-tooltip class="item" effect="dark" content="控制业务员进行商品查询时调拨价显示的价格标准" placement="top-start">
                    <div class="xianji"></div>
                </el-tooltip>
            </div>
            <div style="height: 25px;"></div>
            <el-form-item label="" class="config_titles">
                <el-radio-group v-model="config6.value">
                    <el-radio :label="0">库存成本价</el-radio>
                    <el-tooltip class="item" effect="dark" content="商品进价即采购含税单价" placement="top-start">
                        <div class="xianji"></div>
                    </el-tooltip>
                    <el-radio :label="1">商品调拨价</el-radio>
                    <el-tooltip class="item" effect="dark" content="公司给到销售员进行商品销售的成本价即销售员利润=售价-调拨价，注：销售员独立考核时使用"
                                placement="top-start">
                        <div class="xianji"></div>
                    </el-tooltip>
                </el-radio-group>
            </el-form-item>
            <div style="height: 10px;"></div>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit" v-loading="formLoading">保 存</el-button>
            </el-form-item>
        </el-form>
    </basic-container>
</template>

<script>
    import {stockCreate, stockList} from '@/api/erp/manager/config/index'

    export default {
        name: "stock_configuration",
        data() {
            return {
                form: {},
                config1: {
                    type: 2,
                    name: '库存预警设置',
                    value: 0
                },
                config2: {
                    type: 0,
                    name: '库存预警补货',
                    value: 0
                },
                config6: {
                    type: 0,
                    name: '销售考核价',
                    value: 0
                },
                formLoading: false
            }
        },
        created() {
            stockList().then((res) => {
                if (res.data.data.records) {
                    for (let i in res.data.data.records) {
                        if (res.data.data.records[i].name == '库存预警设置') {
                            this.config1.value = res.data.data.records[i].value;
                        }
                        if (res.data.data.records[i].name == '库存预警补货') {
                            this.config2.value = res.data.data.records[i].value;
                        }
                        if (res.data.data.records[i].name == '销售考核价') {
                            this.config6.value = res.data.data.records[i].value;
                        }
                    }
                }
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
                var list = [this.config1, this.config2, this.config6];
                this.formLoading = true;
                stockCreate(list).then((res) => {
                    this.formLoading = false;
                    if (res.status == 200) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        let userinfo = JSON.parse(JSON.stringify(this.$store.getters.userInfo));
                        userinfo.isInit = 1;
                        this.$store.commit('SET_USERIFNO', userinfo);
                        this.$router.push({
                            path: '/capital_manager',
                            name: '财务设置',
                            meta: {
                                i18n: 'capital_manager'
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
