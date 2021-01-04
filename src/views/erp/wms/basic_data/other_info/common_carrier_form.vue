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
    var DIC = {
        statusOptionList: [{
            value: 0,
            label: '开启'
        }, {
            value: 1,
            label: '关闭'
        }],
    }
    import {
        page,
        addObj,
        getObj,
        delObj,
        putObj
    } from '@/api/erp/wms/config/Logistics';

    export default {
        name: "seriesForm",
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
                index: 0,
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
                                label: "承运商编码",
                                prop: "code",
                                disabled: true,
                                placeholder: "自动生成",
                                span:6
                            },
                            {
                                label: "承运商名称",
                                prop: "name",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入承运商名称",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "运输方式",
                                prop: "transport",
                                span: 6,
                            },
                            {
                                label: "网点名称",
                                prop: "networkName",
                                span: 6,
                            },
                            {
                                label: "网点地址",
                                prop: "networkAddress",
                                span: 6,
                            },
                            {
                                label: "联系人",
                                prop: "linkMan",
                                span: 6,
                            },
                            {
                                label: "联系电话",
                                prop: "linkPhone",
                                span: 6,
                            },
                            {
                                label: "网址",
                                prop: "website",
                                span: 6,
                            },
                            // {
                            //     label: "状态",
                            //     prop: "status",
                            //     span: 6,
                            //     type: "radio",
                            //     dicData: DIC.statusOptionList,
                            //     mock: {
                            //         type: 'dic'
                            //     },
                            //     change: ({value, column}) => {
                            //     }
                            // },
                            {
                                label: "备注",
                                prop: "note",
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
                    let formData = {status: 0};
                    this.formData = formData;
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;

                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/common_carrier_form',
                    name: '承运商制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'common_carrier_form'
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
                        if (!this.id) {
                            saveBill(this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/common_carrier',
                                        name: '承运商',
                                        meta: {
                                            i18n: 'common_carrier'
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
                        }else {
                            saveBill(this.id, this.formData).then((res) => {
                                this.preventRepeatSubmit(false, type);
                                if (res.data.code == 200 || res.data.code == '2000') {
                                    this.$message({
                                        type: "success",
                                        message: "操作成功!"
                                    });
                                    this.$router.push({
                                        path: '/common_carrier',
                                        name: '承运商',
                                        meta: {
                                            i18n: 'common_carrier'
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
