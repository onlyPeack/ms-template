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
    import { addObj, getObj, delObj, putObj} from '@/api/erp/financial/financialBankAccount';

    export default {
        name: "capital_account_form",
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
                                label: "账户编码",
                                prop: "accountCode",
                                disabled: true,
                                placeholder: "自动生成",
                                span:8
                            },
                            {
                                label: "账户名称",
                                prop: "name",
                                span: 8,
                                rules: [{
                                    required: true,
                                    message: "请输入名称",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "简称",
                                prop: "abbrName",
                                span: 8
                            },
                            {
                                label: "账户类型",
                                prop: "accountType",
                                span: 8,
                                type: 'select',
                                dicData: [
                                    {
                                        value: '银行账户',
                                        label: '银行账户'
                                    },
                                    {
                                        value: '承兑账户',
                                        label: '承兑账户'
                                    },
                                    {
                                        value: '支付宝账户',
                                        label: '支付宝账户'
                                    },
                                    {
                                        value: '微信账户',
                                        label: '微信账户'
                                    },
                                ],
                                rules: [{
                                    required: true,
                                    message: "请选择账户类型",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "账户号码",
                                prop: "accountNo",
                                span: 8,
                                rules: [{
                                    required: true,
                                    message: "请输入账户号码",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "排序",
                                prop: "sort",
                                span: 8,
                                rules: [{
                                    required: true,
                                    message: "请输入排序",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "备注",
                                prop: "note",
                                type:'textarea',
                                span: 24
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
                    let formData = {}
                    this.formData = formData
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;

                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/capital_account_form',
                    name: '银行账户制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'capital_account_form'
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
                                        path: '/capital_account',
                                        name: '银行账户',
                                        meta: {
                                            i18n: 'capital_account'
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
                                        path: '/capital_account',
                                        name: '银行账户',
                                        meta: {
                                            i18n: 'capital_account'
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
