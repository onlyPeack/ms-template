<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container">
                <div class="bill_form_title">基础信息</div>
                <div class="bill_form_conent">
                    <div>
                        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="方案编号" prop="planNo">
                                        <el-input v-model="dataForm.planNo" placeholder="请输入方案编号"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="方案名称" prop="planName">
                                        <el-input v-model="dataForm.planName" placeholder="请输入方案名称"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="起止时间" prop="startTime">
                                        <el-date-picker
                                                v-model="value2"
                                                type="daterange"
                                                @change="timeBtn"
                                                value-format="yyyy-MM-dd"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="bill_form_conent_item_title"><span style="color: #F56C6C;margin-right: 4px;">*</span>提成类型
                    </div>
                    <div class="bill_form_conent_item">
                        <el-radio v-model="dataForm.commissionType" label="0">按金额</el-radio>
                        <el-radio v-model="dataForm.commissionType" label="1">按毛利</el-radio>
                        <el-radio v-model="dataForm.commissionType" label="4">按金额+毛利</el-radio>
                        <el-radio v-model="dataForm.commissionType" label="2">按数量</el-radio>
                        <el-radio v-model="dataForm.commissionType" label="3">按回款</el-radio>
                    </div>
                    <div class="bill_form_conent_item_title">适用商品</div>
                    <div class="bill_form_conent_item">
                        <el-radio v-model="dataForm.applyGoodsType" label="0">全部商品</el-radio>
                        <el-radio v-model="dataForm.applyGoodsType" label="1">指定商品</el-radio>
                        <div>
                            <el-button type="primary" v-if="dataForm.applyGoodsType=='1'" @click="applyGoodsBtn">
                                选择商品({{dataForm.goodsItems.length}})
                            </el-button>
                            <el-button type="info" v-else>选择商品</el-button>
                        </div>
                    </div>
                    <div class="bill_form_conent_item_title">适用业务员</div>
                    <div class="bill_form_conent_item">
                        <el-radio v-model="dataForm.applyUserType" label="0">全部业务员</el-radio>
                        <el-radio v-model="dataForm.applyUserType" label="1">指定业务员</el-radio>
                        <div>
                            <el-button type="primary" v-if="dataForm.applyUserType=='1'" @click="applyUserBtn">
                                选择业务员({{dataForm.userItems.length}})
                            </el-button>
                            <el-button type="info" v-else>选择业务员</el-button>
                        </div>
                    </div>
                </div>
                <div class="bill_form_title">提成规则</div>
                <div class="bill_form_conent">
                    <div style="margin: 10px 0px;">
                        <el-button type="primary" icon="el-icon-plus" @click="ruleListBtn">增加提成规则</el-button>
                    </div>
                    <div v-for="(item,index) in dataForm.ruleItems" class="royaltRuleItem">
                        <div>提成区间&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        <div>{{dataForm.commissionType=='0'||dataForm.commissionType=='4'?'金额 >'
                            :dataForm.commissionType=='1'?'毛利 >':dataForm.commissionType=='2'?'数量 >':'回款 >'}}&nbsp;&nbsp;
                        </div>
                        <el-input v-model="item.value" placeholder="" style="width: 60px;"></el-input>
                        <div v-if="dataForm.commissionType=='4'?true:false">&nbsp;&nbsp;元,&nbsp;&nbsp;且&nbsp;&nbsp;毛利 >&nbsp;&nbsp;</div>
                        <el-input v-if="dataForm.commissionType=='4'" v-model="item.profitValue" placeholder=""
                                  style="width: 60px;"></el-input>
                        <div>&nbsp;&nbsp;{{dataForm.commissionType=='2'?'单位':'元'}}&nbsp;&nbsp;{{dataForm.commissionType=='2'?'提成金额':'提成比例'}}&nbsp;&nbsp;</div>
                        <el-input v-model="item.percentage" placeholder="" style="width: 60px;"
                                  @blur="inputBtn(index,true)"></el-input>
                        <div>&nbsp;&nbsp;{{dataForm.commissionType=='2'?'元/单位，':'%，'}}&nbsp;&nbsp;或固定提成金额:&nbsp;&nbsp;
                        </div>
                        <el-input v-model="item.amount" placeholder="" style="width: 60px;"
                                  @blur="inputBtn(index,false)"></el-input>
                        <div>&nbsp;&nbsp;元&nbsp;&nbsp;</div>
                        <el-button type="text" icon="el-icon-delete" @click="handleRemoveRow(index)">删除</el-button>
                    </div>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :selectType="typeName=='userTypes' && !id ? 0 :1"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :searchObj="{planId:dataForm.id}"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {addObj, getObj, putObj} from '@/api/erp/sales/bill/salesCommissionPlan';
    import {getHistoryBill} from "@/api/erp/product/product_config/product_process_managerment";
    import {uploadPath} from '@/api/erp/goods/storage'
    import {userOption, commodityOption} from '@/util/table';
    import {isvalidatemobile} from "@/util/validate";

    export default {
        name: "sales_commission_config_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value2: '',
                dataForm: {
                    commissionType: '0',
                    applyGoodsType: '0',
                    applyUserType: '0',
                    goodsItems: [],
                    userItems: [],
                    startTime: '',
                    endTime: '',
                    ruleItems: [
                        {
                            value: '',
                            percentage: '',
                            amount: ''
                        },

                    ]
                },
                rules: {
                    planNo: [
                        {
                            required: true,
                            message: '请输入方案编号',
                            trigger: 'change'
                        },
                    ],
                    planName: [
                        {
                            required: true,
                            message: '请输入方案名称',
                            trigger: 'change'
                        },
                    ],
                    startTime: [
                        {
                            required: true,
                            message: '请选择起止时间',
                            trigger: 'change'
                        },
                    ],
                },
                readonly: false,
                types: 'text',
                dialogPositionVisible: false,
                publicVisible: false,
                publicTitle: undefined,
                typeName: undefined,
                isSingle: false,
                dialogDepartVisible: false,
                option: undefined,
                isShow: true,
                loading: false,
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            inputBtn(index, type) {
                if (type) {
                    if (this.dataForm.ruleItems[index].percentage != undefined || this.dataForm.ruleItems[index].percentage != '') {
                        this.dataForm.ruleItems[index].amount = '0';
                    }
                } else {
                    if (this.dataForm.ruleItems[index].amount != undefined || this.dataForm.ruleItems[index].amount != '') {
                        this.dataForm.ruleItems[index].percentage = '0';
                    }
                }
            },
            applyGoodsBtn() {
                this.dataForm.goodsItems = [];
                this.isSingle = false;
                this.publicTitle = '请选择商品';
                this.typeName = 'commodityType';
                this.option = commodityOption;
                this.publicVisible = true;
            },
            applyUserBtn() {
                this.dataForm.userItems = [];
                this.isSingle = false;
                this.publicTitle = '请选择业务员';
                this.typeName = 'userTypes';
                this.option = userOption;
                this.publicVisible = true;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'commodityType') {
                        this.dataForm.goodsItems = list;
                    }
                    if (this.typeName == 'userTypes') {
                        this.dataForm.userItems = list;
                        this.dataForm.userItems = []
                        for (let i in list) {
                            this.dataForm.userItems.push({
                                userId: list[i].id,
                                userCode: list[i].no,
                                userName: list[i].username,
                                name: list[i].name
                            })
                        }

                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            timeBtn() {
                this.dataForm.startTime = this.value2[0]
                this.dataForm.endTime = this.value2[1]
            },
            handleRemoveRow(index) {
                let ValueIndex = this.dataForm.ruleItems.length;
                if (ValueIndex === 1) {
                    return
                }
                this.dataForm.ruleItems.splice(index, 1);
            },
            ruleListBtn() {
                this.dataForm.ruleItems.push({
                    commissionType: this.dataForm.commissionType,
                    value: '',
                    profitValue: '',
                    percentage: '',
                    amount: ''
                },)
            },
            reload() {
                this.loading = true;
                setTimeout(() => {
                    this.isShow = false;
                    this.$nextTick(() => {
                        this.init();
                        this.isShow = true;
                    })
                }, 17)
            },
            init() {
                if (this.id) {
                    this.handleGetBill(getObj, this.id);
                } else {
                    this.value2 = '';
                    this.dataForm = {
                        commissionType: '0',
                        applyGoodsType: '0',
                        applyUserType: '0',
                        goodsItems: [],
                        userItems: [],
                        startTime: '',
                        endTime: '',
                        ruleItems: [
                            {
                                value: '',
                                profitValue: '',
                                percentage: '',
                                amount: ''
                            },

                        ]
                    };
                    this.loading = false;
                }
            },
            //新增
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if (res.data.code == '2000') {
                        let formData = res.data.data;
                        this.value2 = [formData.startTime, formData.endTime];
                        this.dataForm = formData;
                        this.dataForm.goodsItems = formData.goodsItems && formData.goodsItems.length > 0 ? formData.goodsItems : [];
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/sales_commission_config_form',
                            name: '提成方案设置制单',
                            query: {
                                id: this.dataForm.id,
                                type: this.type
                            }
                        });
                        this.$refs.billContainer.refreshId(this.dataForm.id);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                // this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                let list = JSON.parse(JSON.stringify(this.dataForm));
                if (list.applyGoodsType == '0') {
                    delete list.goodsItems
                }
                if (list.applyUserType == '0') {
                    delete list.userItems
                }
                if (list.applyGoodsType == '1') {
                    if (list.goodsItems.length < 1) {
                        this.vueMessage('warning', '请选择指定商品!');
                        return
                    }
                }
                if (list.applyUserType == '1') {
                    if (list.userItems.length < 1) {
                        this.vueMessage('warning', '请选择指定业务员!');
                        return
                    }
                }
                for (let i in list.ruleItems) {
                    if (list.ruleItems[i].value == '') {
                        this.vueMessage('warning', '请填写提成规则');
                        return
                    }
                    if (list.commissionType == '4' && this.isEmpty(list.ruleItems[i].profitValue)) {
                        this.vueMessage('warning', '请输入金额或者毛利!');
                        return
                    }
                    if (this.isEmpty(list.ruleItems[i].percentage) || this.isEmpty(list.ruleItems[i].amount == '')) {
                        this.vueMessage('warning', '请输入提成比例或者固定提现金额!');
                        return
                    }
                    if (list.commissionType != '4') {
                        list.ruleItems[i].profitValue = '';
                    }
                    list.ruleItems[i].commissionType = list.commissionType;
                }
                let saveBill = this.id ? putObj : addObj;
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        saveBill(list).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 2000 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$router.push({
                                    path: '/sales_commission_config',
                                    name: '提成方案设置',
                                    meta: {
                                        i18n: 'sales_commission_config'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            } else if (res.data.code == 401 || res.data.code == '401') {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                            this.preventRepeatSubmit(false, type);
                        });
                    }
                })

            }
        }
    };
</script>
<style>
    .bill_form_title {
        font-weight: bold;
        line-height: 40px;
    }

    .bill_form_conent {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .bill_form_conent_item_title {
        font-size: 14px;
        line-height: 40px;
        margin-left: 40px;
    }

    .bill_form_conent_item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-left: 60px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .royaltRuleItem {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        margin-top: 10px;
    }
</style>
