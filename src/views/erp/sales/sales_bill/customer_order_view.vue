<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="permission"
                                @handleAdd="handleAdd"
                                @handleFirst="handleFirst"
                                @handleLast="handleLast"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <el-button v-if="type == 'view' && formData && formData.billStatus == '4'" @click="handleDownLoad" icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印</el-button>
                </div>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items" >
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'"  :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <task-history v-if="formData.billNo && processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, auditBill,selectAllById} from "@/api/erp/sales/bill/salesOrder";
    import {getDefaultWarehouse} from "@/api/erp/config/index";
    import {getUseStockQty} from "@/api/erp/manager/config/index";
    import {getBill as getBills} from "@/api/erp/purchase/bill/purchasePrices";
    import { getDefault} from '@/api/erp/project_management/projectOverview';
    import {
        customerOption,
        userOption,
        sourceOption,
        commodityOption,
        priceOption,
        quotationOption,
        warehouseOption
    } from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "customer_order_view",
        props: ['type', 'id', 'taskType', 'step','ids'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            var validateMobile = (rule, value, callback) => {
                if (value && value != '' && !isMobile(value)) {
                    callback(new Error('请输入正确的手机号码'));
                } else {
                    callback();
                }
            };
            return {
                warehouseIndex: undefined,
                permission: {tempAddBtn: true, addBtn: false,lastBtn: true,firstBtn: true},
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                warehouse:{},
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "id",
                            prop: "id",
                            display: false
                        },
                        {
                            label: "单据编号",
                            prop: "billNo",
                            disabled: true,
                            placeholder: "自动生成",
                            span: 6
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            disabled: true,
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                        {
                            label: "客户ID",
                            prop: "customerId",
                            display: false
                        },
                        {
                            label: "客户",
                            prop: "customerName",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择客户',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择客户",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择客户';
                                this.typeName = 'customerType';
                                this.option = customerOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "供货单位ID",
                            prop: "companyId",
                            display: false
                        },
                        // {
                        //     label: "供货单位",
                        //     prop: "companyName",
                        //     span: 6,
                        //     type: 'text',
                        //     filterable: true,
                        //     readonly: true,
                        // },
                        {
                            label: "订单编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "业务员Id",
                            prop: "salerId",
                            display: false
                        },
                        {
                            label: "业务员编号",
                            prop: "salerCode",
                            display: false
                        },
                        {
                            label: "业务员",
                            prop: "salerName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择业务员',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择业务员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.isSingle = true;
                                this.publicTitle = '请选择业务员';
                                this.typeName = 'userType';
                                this.option = userOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "交货日期",
                            prop: "deliverDate",
                            span: 6,
                            disabled: true,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                        {
                            label: "关联单据",
                            prop: "sourceBillNo",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择关联单据',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                if (!this.formData.customerName) {
                                    this.vueMessage('warning', '请先选择客户!');
                                    return
                                }
                                this.isSingle = false;
                                this.publicTitle = '请选择单据';
                                this.typeName = 'quotationType';
                                this.option = JSON.parse(JSON.stringify(quotationOption));
                                this.publicVisible = true;
                            }
                        },
                        // {
                        //     label: "仓库ID",
                        //     prop: "warehouseId",
                        //     display: false
                        // },
                        // {
                        //     label: "仓库",
                        //     prop: "warehouseName",
                        //     span: 6,
                        //     type: 'text',
                        //     dicData: [],
                        //     filterable: true,
                        //     readonly: true,
                        //     clearable: false,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择仓库",
                        //         trigger: "change"
                        //     }],
                        //     click: ({value, column}) => {
                        //         if (this.type == 'view') {
                        //             return
                        //         }
                        //         this.publicTitle = '请选择仓库';
                        //         this.typeName = 'warehouseType';
                        //         this.option = warehouseOption;
                        //         this.isSingle = true;
                        //         this.publicVisible = true;
                        //     }
                        // },
                        // {
                        //     label: "收款类型",
                        //     prop: "paymentType",
                        //     span: 6,
                        //     type: 'select',
                        //     dicMethod: 'get',
                        //     dicUrl: '/api/manager/receipt-type/pageAll',
                        //     props: {
                        //         value: 'name',
                        //         label: 'name'
                        //     },
                        //     filterable: true,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择收款类型",
                        //         trigger: "change"
                        //     }]
                        // },
                        {
                            label: "订单类型",
                            prop: "billType",
                            span: 6,
                            disabled: true,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/sales-order-type/pageAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择订单类型",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "结算方式",
                            prop: "accountMethod",
                            span: 6,
                            disabled: true,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/payments-means/pageAll',
                            props: {
                                value: 'label',
                                label: 'label'
                            },

                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择结算方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "联系人",
                            prop: "linkPerson",
                            span: 6,
                            disabled: true,
                            // readonly: true,
                        },
                        {
                            label: "联系电话",
                            prop: "linkPhone",
                            span: 6,
                            disabled: true,
                            // readonly: true,
                            rules: [{
                                validator: validateMobile,
                                trigger: "blur"
                            }]
                        },
                        // {
                        //     label: "收货地址",
                        //     prop: "linkAddress",
                        //     readonly: true,
                        //     span: 6,
                        // },
                        {
                            label: "整单备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24,
                            disabled: true,
                        },
                        {
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        },
                    ]
                },
                itemsOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    index: true,
                    indexLabel: '序号',
                    height: 'auto',
                    calcHeight: 350,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "taxPrice",
                            type: "sum"
                        },{
                            name: "taxAmount",
                            type: "sum"
                        },{
                            name: "price",
                            type: "sum"
                        },{
                            name: "amount",
                            type: "sum"
                        },
                    ],
                    idNum: '',
                    column: [
                        {
                            label: "仓库",
                            prop: "warehouseName",
                            width: 130,
                            overHidden:true,
                            placeholder: '请选择仓库',
                            align: 'left',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "仓库"
                                );
                            }
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品',
                            align: 'left',
                            width: 130,
                            overHidden:true,
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            width: 60,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            placeholder: ' ',
                        },
                        {
                            label: "可用库存",
                            prop: "stockQty",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            placeholder: ' ',
                        },
                        {
                            label: "折扣",
                            prop: "discount",
                            width: 112,
                            overHidden:true,
                            align: 'right',
                            placeholder: ' ',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "折扣"
                                );
                            }
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 112,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 140,
                            overHidden:true,
                            align: 'right',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "含税单价"
                                );
                            }
                        },
                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 140,
                            overHidden:true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "含税金额"
                                );
                            }
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 110,
                            overHidden:true,
                            align: 'right',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "货期(天)",
                            prop: "deliveryDate",
                            span: 6,
                            width: 132,
                            overHidden:true,
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 80,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            overHidden:true,
                        },
                    ]
                },
                option: [],
            };
        },
        computed: {},
        mounted() {
            this.__cachehandleGetbill = this.id;
            this.idNum = this.id;
            this.__cachetype = this.type;
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
            this.changeFormWidth(this, 'formOption');
            window.addEventListener('resize', this.changeMaxHeight.bind(this, 'auto'));
            this.init();
        },
        destroyed() {
            window.removeEventListener("resize", this.changeMaxHeight);
        },
        updated() {
            this.changeMaxHeight();
        },
        methods: {
            handleFirst(){
                let ids = JSON.parse(this.ids);
                for(let i in ids){
                    if(ids[i] == this.idNum){
                        this.idNum = ids[i * 1+1];
                        this.loading = true;
                        setTimeout(() => {
                            this.isShow = false;
                            this.$nextTick(() => {
                                this.init();
                                this.isShow = true;
                            })
                        }, 17)
                        return
                    }
                }

            },
            handleLast(){
                let ids = JSON.parse(this.ids);
                for(let i in ids){
                    if(ids[i] == this.idNum){
                        this.idNum = ids[i * 1-1];
                        this.loading = true;
                        setTimeout(() => {
                            this.isShow = false;
                            this.$nextTick(() => {
                                this.init();
                                this.isShow = true;
                            })
                        }, 17)
                        return
                    }
                }

            },
            handleDownLoad(){
                getDefault(0).then(res => {
                    if(res.data.code == '401'){
                        this.vueMessage('warning',res.data.msg);
                    }else{
                        this.$router.push({path:'/print/customer_order_print',query:{id:this.idNum}})
                    }
                })

            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            reload() {
                this.loading = true;
                this.idNum = this.id;
                setTimeout(() => {
                    this.isShow = false;
                    this.$nextTick(() => {
                        this.init();
                        this.isShow = true;
                    })
                }, 17)
            },
            changeMaxHeight(type) {
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                if(JSON.parse(this.ids)[0] != this.idNum && JSON.parse(this.ids)[JSON.parse(this.ids).length-1] != this.idNum){
                    this.permission.lastBtn = true;
                    this.permission.firstBtn = true;
                }else{
                    if(JSON.parse(this.ids)[0] == this.idNum){
                        this.permission.lastBtn = false;
                        this.permission.firstBtn = true;
                    }
                    if(JSON.parse(this.ids)[JSON.parse(this.ids).length-1] == this.idNum){
                        this.permission.lastBtn = true;
                        this.permission.firstBtn = false;
                    }
                }
                this.formOption.disabled = false;
                getDefaultWarehouse().then(res=>{
                    this.warehouse = res.data.data
                    if (this.$refs.form) {
                        this.$refs.form.resetForm();
                        this.$nextTick(this.$refs.form.clearValidate)
                    }
                    console.log(this.idNum)
                    if (this.idNum) {
                        this.handleGetBill(getBill, this.idNum);
                    } else {
                        this.vueSet(this, 'formData', {});
                        getSelfCompany().then(response => {
                            let formData = {
                                salerId: this.$store.getters.userInfo.id,
                                salerCode: this.$store.getters.userInfo.no,
                                salerName: this.$store.getters.userInfo.name,
                                billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                items: []
                            };
                            formData.companyId = response.data.id ? response.data.id : undefined
                            formData.companyName = response.data.companyName ? response.data.companyName : undefined
                            this.formData = formData;
                            this.$nextTick(() => {
                                this.vueSet(this, 'formData', formData);
                            })
                            this.loading = false;
                        })

                    }
                })

            },
            getProcessId(billPrefix) {
                getProcessId({
                    billPrefix: billPrefix
                }).then(response => {
                    if (response != null && response != '') {
                        this.processId = response.data;
                    }
                });
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/customer_order_form',
                    name: '销售订单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'customer_order_form'
                    }
                });
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/warehousing-order-form',
                            name: '销售订单制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            }
                        });
                        this.$refs.billContainer.refreshId(this.formData.id);
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
        }
    };
</script>
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
