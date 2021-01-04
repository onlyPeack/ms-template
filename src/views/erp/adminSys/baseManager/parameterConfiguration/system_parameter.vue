<template>
    <basic-container>
        <el-form ref="form" :model="form" label-width="120px">
            <div class="config_title">
                单据格式配置
                <div class="avue-crud-diag">
                    <img style="width: 12px;height: 12px;" src="http://hejigy.com.cn/jingao.png" />
                    <div>&nbsp;系统数据小数位数仅可初始化一次，请确认小数位数后保存设置</div>
                </div>
            </div>
            <el-form-item>
                <span class="config_span">折扣小数配置（小数位数）:</span>
                <el-select v-model="config1.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <span class="config_span">金额小数配置（小数位数）:</span>
                <el-select v-model="config2.value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit" v-loading="formLoading">保 存</el-button>
            </el-form-item>
        </el-form>
    </basic-container>
</template>

<script>
    import {parameterCreate, parameterList} from '@/api/erp/manager/config/index'

    export default {
        name: "system_parameter",
        data() {
            return {
                form: {},
                options: [
                    {
                        label: '1位小数',
                        value: 1
                    }, {
                        label: '2位小数',
                        value: 2
                    }, {
                        label: '3位小数',
                        value: 3
                    }, {
                        label: '4位小数',
                        value: 4
                    }
                ],
                config1: {
                    type: 0,
                    name: '折扣小数配置',
                    value: 2
                },
                config2: {
                    type: 0,
                    name: '金额小数配置',
                    value: 2
                },
                formLoading: false
            }
        },
        created() {
            parameterList().then((res) => {
                const list = res.data.data.records;
                this.findItem(list, this.config1, 'config1');
                this.findItem(list, this.config2, 'config2');
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
                var list = [this.config1, this.config2];
                this.formLoading = true;
                parameterCreate(list).then((res) => {
                    this.formLoading = false;
                    console.log(res)
                    if (res.data.code == 200 || res.data.code == '2000') {
                        let sysParam = {
                            discountDecimal: this.config1.value,
                            amountDecimal: this.config2.value
                        };
                        this.$store.commit('SET_SYSPARAM', sysParam);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        let userinfo = JSON.parse(JSON.stringify(this.$store.getters.userInfo));
                        userinfo.isInit = 1;
                        this.$store.commit('SET_USERIFNO', userinfo);
                        this.$router.push({
                            path: '/stock_configuration',
                            name: '库存设置',
                            meta: {
                                i18n: 'stock_configuration'
                            },
                            query: {
                                timeStamp: new Date().getTime()
                            },
                        });
                    } else {
                        this.$message({
                            type: "warning",
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

<style scoped>
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
        margin-bottom: 20px;
    }

    .config_span {
        margin-right: 15px;
    }
</style>
<style lang="scss">

    .avue-crud-diag{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        padding:2px 6px;
        height: 16px;
        margin-left: 10px;
        color: #E0A242;
        background:rgba(252,251,226,1);
        border:1px solid rgba(240,227,202,1);

    }
</style>