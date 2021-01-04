<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
        </basic-container>
    </bill-container>
</template>

<script>
    import {  addObj, getObj, delObj, putObj} from '@/api/erp/financial/account';
    var DIC = {
        dcKey: [{
            value: '借方',
            label: '借方'
        }, {
            value: '贷方',
            label: '贷方'
        }],
        adjustRate:[
            {
                value: '0',
                label: '否'
            },
            {
                value: '1',
                label: '是'
            }
        ],
        status: [
            {
                value: '0',
                label: '启用'
            }, {
                value: '1',
                label: '禁用'
            }
        ]
    }
    export default {
        name: "subject_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                index:0,
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column:
                        [
                            {
                                label: "id",
                                prop: "id",
                                display: false
                            },
                            {
                                label: "科目编码",
                                prop: "number",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请选择科目编码",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "科目名称",
                                prop: "name",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请选择科目名称",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "科目类别",
                                prop: "groupKey",
                                span: 6,
                                type: 'select',
                                rules: [{
                                    required: true,
                                    message: "请选择科目类别",
                                    trigger: "change"
                                }],
                                dicData: [
                                    {
                                        value: '1',
                                        label: '负债类'
                                    }, {
                                        value: '2',
                                        label: '损益类'
                                    }, {
                                        value: '3',
                                        label: '所有者权益类'
                                    }, {
                                        value: '4',
                                        label: '资产类'
                                    }
                                    //   ,{
                                    //   value: '5',
                                    //   label: '所有者权益'
                                    // }, {
                                    //   value: '6',
                                    //   label: '成本'
                                    // }, {
                                    //   value: '7',
                                    //   label: '营业收入'
                                    // }, {
                                    //   value: '8',
                                    //   label: '营业成本及税金'
                                    // }, {
                                    //   value: '9',
                                    //   label: '期间费用'
                                    // }, {
                                    //   value: '10',
                                    //   label: '其他收益'
                                    // }, {
                                    //   value: '11',
                                    //   label: '其他损失'
                                    // }, {
                                    //   value: '12',
                                    //   label: '以前年度损益调整'
                                    // }, {
                                    //   value: '13',
                                    //   label: '所得税'
                                    // }
                                ]
                            },
                            {
                                label: "科目属性",
                                prop: "attribute",
                                span: 6,
                                type: 'select',
                                dicData: [
                                    {
                                        value: '0',
                                        label: '无'
                                    }, {
                                        value: '1',
                                        label: '银行科目'
                                    }, {
                                        value: '2',
                                        label: '现金科目'
                                    }, {
                                        value: '3',
                                        label: '现金等价物'
                                    }
                                ]
                            },
                            {
                                label: "辅助核算",
                                prop: "detailJson",
                                span: 6,
                                type: 'select',
                                dicData: [
                                    {
                                        value: '1',
                                        label: '银行账户'
                                    }, {
                                        value: '2',
                                        label: '客户'
                                    }, {
                                        value: '3',
                                        label: '供应商'
                                    }, {
                                        value: '4',
                                        label: '部门'
                                    }, {
                                        value: '5',
                                        label: '仓库'
                                    }, {
                                        value: '6',
                                        label: '用户'
                                    }, {
                                        value: '7',
                                        label: '项目'
                                    }, {
                                        value: '8',
                                        label: '门店'
                                    }, {
                                        value: '9',
                                        label: '商品'
                                    }
                                ],
                            },
                            {
                                label: "余额方向",
                                prop: "dcKey",
                                span: 6,
                                type: "radio",
                                dicData: DIC.dcKey,
                                rules: [{
                                    required: true,
                                    message: "请选择余额方向",
                                    trigger: "blur"
                                }],
                                mock:{
                                    type:'dic'
                                },
                                change:({value,column})=>{
                                }
                            },
                            {
                                label: "期末调汇",
                                prop: "isAdjustRate",
                                span: 6,
                                type: "radio",
                                dicData: DIC.adjustRate,
                                mock:{
                                    type:'dic'
                                },
                                change:({value,column})=>{
                                }
                            },
                            {
                                label: "科目状态",
                                prop: "status",
                                span: 6,
                                type: "radio",
                                dicData: DIC.status,
                                mock:{
                                    type:'dic'
                                },
                                change:({value,column})=>{
                                }
                            },
                        ]
                },
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            handleSelectionChange(selection) {

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
                this.vueSet(this, 'formData', {});
                if(this.$refs.form){
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getObj, this.id);
                } else {
                    let formData = {attribute: '0',isAdjustRate: '0',status: '0', dcKey: '借方'};
                    this.formData = formData;
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;

                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/subject_form',
                    name: '科目制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'subject_form'
                    }
                });
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.$nextTick(() => {
                            this.vueSet(this, 'formData', formData);
                        })
                        this.index = 0;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = !this.id ? addObj : putObj;
                        if(!this.id){
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/subject',
                                        name: '科目',
                                        meta: {
                                            i18n: 'subjec'
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
                                this.preventRepeatSubmit(false, type);
                            });
                        }else{
                            saveBill(this.id,this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.init();
                                    this.$router.push({
                                        path: '/subject',
                                        name: '科目',
                                        meta: {
                                            i18n: 'subject'
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
                                this.preventRepeatSubmit(false, type);
                            });
                        }

                    } else {
                        return false;
                    }
                });

            }
        }
    };
</script>
