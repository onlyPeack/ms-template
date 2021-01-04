<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="justify-content: unset;position: relative">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="{tempAddBtn: true,addBtn: false}"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/purchase_invoice_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-buttwelon>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="taxRate">
                        <div>
                            <el-select v-model="formData.taxRate" style="width: 100%;"
                                       :disabled="type=='view'?true:false"
                                       @change="publicColumnBlurs()">
                                <el-option v-for="item in taxRateOption" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'"
                                   @selection-change="handleSelectionChange">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.taxAmount" placeholder="请输入本次到票金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,'taxAmount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.amount" placeholder="请输入不含税金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.amount,'amount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="invoiceCode">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.invoiceCode" placeholder="请输入发票代码"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="invoiceNo">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.invoiceNo" placeholder="请输入发票号码"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="invoiceDate">
                                <div class="zLeftClass">
                                    <el-date-picker v-model="scope.row.invoiceDate" align="left" type="date"
                                                     value-format="yyyy-MM-dd"
                                                    placeholder="请选择开票日期" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="receiveDate">
                                <div class="zLeftClass">
                                    <el-date-picker v-model="scope.row.receiveDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择收票日期" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
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
            <task-history v-if="processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>

            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :code="formData.customerCode" selectType="2"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :operationType="formData.operationType"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, auditBill, tempAddBill} from "@/api/erp/purchase/bill/invoiceOrder";
    import {purchaseOption, userOption, applyOption, commodityOption, warehouseOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "purchase_apply_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                    },
                },
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
                index: 0,
                taxRateOption:[
                    {
                        value: 3,
                        label: '3%'
                    },
                    {
                        value: 5,
                        label: '5%'
                    },
                    {
                        value: 6,
                        label: '6%'
                    },
                    {
                        value: 13,
                        label: '13%'
                    }
                ],
                itemsOption: {
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
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
                            name: "tax",
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
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 80,
                            slot: true,
                        },
                        {
                            label: "本次到票金额",
                            prop: "taxAmount",
                            width: 160,
                            overHidden:true,
                            align: 'right',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "本次到票金额"
                                );
                            }
                        },
                        {
                            label: "不含税金额",
                            prop: "amount",
                            align: 'right',
                            width: 150,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "不含税金额"
                                );
                            }
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            align: 'right',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "发票代码",
                            prop: "invoiceCode",
                            align: 'left',
                            width: 140,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "发票代码"
                                );
                            }
                        },
                        {
                            label: "发票号码",
                            prop: "invoiceNo",
                            align: 'left',
                            width: 140,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "发票号码"
                                );
                            }
                        },
                        {
                            label: "开票日期",
                            prop: "invoiceDate",
                            align: 'left',
                            width: 170,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "开票日期"
                                );
                            }
                        },
                        {
                            label: "收票日期",
                            prop: "receiveDate",
                            align: 'left',
                            width: 170,
                            overHidden:true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "收票日期"
                                );
                            }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 160,
                            overHidden:true,
                            align: 'left',
                            slot: true,
                        },
                    ]
                },
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
                                pickerOptions: {
                                    disabledDate(time) {
                                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                    },
                                }
                            },
                            {
                                label: "供应商",
                                prop: "supplierName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择供应商',
                                rules: [{
                                    required: true,
                                    message: "请选择供应商",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择供应商';
                                    this.typeName = 'purchaseType';
                                    this.option = purchaseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "发票类型",
                                prop: "invoiceType",
                                span: 6,
                                type: 'select',
                                dicData: this.invoiceTypeOptions,
                                filterable: true,
                                readonly: true,
                                rules: [{
                                    required: true,
                                    message: "请选择发票类型",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "税率",
                                prop: "taxRate",
                                span: 6,
                                formslot: true,
                                filterable: true,
                                rules: [{
                                    required: true,
                                    message: "请选择税率",
                                    trigger: "change"
                                }]
                            },
                            {
                                label: "采购员编号",
                                prop: "purchaserCode",
                                display: false
                            },
                            {
                                label: "采购员",
                                prop: "purchaserName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                disabled: true,
                            },
                            {
                                label: "采购员部门",
                                prop: "departName",
                                span: 12,
                                disabled: true,
                            },
                            {
                                label: "整单备注",
                                prop: "note",
                                type: 'textarea',
                                row: true,
                                span: 24
                            },
                            {
                                prop: "items",
                                type: "dynamic",
                                span: 24,
                                formslot: true
                            },
                        ]
                },
                option: [],
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
            this.changeFormWidth(this, 'formOption');
            window.addEventListener('resize', this.changeMaxHeight.bind(this, 'auto'));
        },
        destroyed() {
            window.removeEventListener("resize", this.changeMaxHeight);
        },
        updated() {
            this.changeMaxHeight();
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }
            },
            handleTypeChange(index, val) {
                if (this.formData.items[index].taxPrice && this.formData.items[index].qty) {
                    if (!isNaN(this.formData.items[index].taxPrice) && !isNaN(this.formData.items[index].qty)) {
                        this.formData.items[index].price = (this.formData.items[index].taxPrice / (Number(parseInt(100) + Number(val)) / 100)).toFixed(this.sysParam.amountDecimal)
                        this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (this.formData.items[index].taxPrice * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(val) / 100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                }
            },
            handleAddRow() {
                const d = {
                    taxAmount: '',
                    amount: '',
                }
                this.formData.items.push(d);
            },
            publicColumnBlurs(){
                for(let i in this.formData.items){
                    if(this.formData.items[i] && this.formData.items[i].amount){
                        this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[i].taxAmount = (Number(this.formData.items[i].amount) + Number(this.formData.items[i].tax)).toFixed(this.sysParam.amountDecimal);
                    }
                    this.vueSet(this.formData.items, index, this.formData.items[i]);
                }

            },
            publicColumnBlur(index, val, name, item) {
                if (name == 'amount') {
                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                    if(!this.formData.items[index].taxAmount){
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].amount) + Number(this.formData.items[index].tax)).toFixed(this.sysParam.amountDecimal);
                    }
                }
                if (name == 'taxAmount') {
                    this.formData.items[index].amount = (Number(this.formData.items[index].taxAmount) / Number(1 + Number(this.formData.taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].tax = (Number(this.formData.items[index].taxAmount) - Number(this.formData.items[index].amount)).toFixed(this.sysParam.amountDecimal);
                }
                this.vueSet(this.formData.items, index, this.formData.items[index]);
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            handleSelectionChange(selection) {
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.skuNo == item.skuNo) {
                            map.push(obj.skuNo);
                        }
                    });
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'purchaseType') {
                        this.formData.supplierCode = list[0].supplierCode;
                        this.formData.supplierName = list[0].supplierName;
                        this.formData.supplierId = list[0].id;
                        this.formData.purchaserId = list[0].managerId;
                        this.formData.departName =  list[0].departName;
                        this.formData.purchaserCode = list[0].managerCode;
                        this.formData.purchaserName = list[0].managerName;
                        this.formData.linkMan = list[0].linkMan;
                        this.formData.linkPhone = list[0].linkPhone;
                        this.formData.taxpayerNumber = list[0].taxpayerNumber;
                        this.formData.bankName = list[0].bankName;
                        this.formData.bankAccount = list[0].bankAccount;
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name
                        this.formData.warehouseId = list[0].id
                    }
                    if (this.typeName == 'userType') {
                        this.formData.purchaserId = list[0].id;
                        this.formData.purchaserCode = list[0].no;
                        this.formData.purchaserName = list[0].name;
                        this.formData.purchaserDepartName =  JSON.parse(list[0].departId).name;
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
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
            changeMaxHeight(type) {
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                this.processId = '';
                this.vueSet(this, 'formData', {});
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        operationType: '0',
                        invoiceType: '1',
                        taxRate: 13,
                        items: [
                            {
                                taxAmount: '',
                                amount: '',
                            }
                        ]
                    };
                    this.$nextTick(() => {
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/purchase_order_form',
                    name: '采购订单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'purchase_order_form'
                    }
                });
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
            async handleAuditBill(val) {
                this.formData.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                let sum = await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
                    this.clocseCurrent(this, this.$route);
                    this.$router.push({
                        path: '/taskNowList',
                        name: '待办任务',
                        meta: {
                            i18n: 'taskNowList'
                        },
                        query: {
                            timeStamp: new Date().getTime()
                        },
                    });
                    this.isAgreeLoading = false;
                    this.isRejectLoading = false;
                    this.init();

                }
            },
            getDaysBetween(dateString1, dateString2) {
                var startDate = Date.parse(dateString1);
                var endDate = Date.parse(dateString2);
                var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
                // alert(days);
                return days;
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        this.getProcessId(billPrefix);
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
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].taxAmount)) {
                        items.splice(i, 1);
                    }
                }
                return items;
            },
            handleCheckItemFuc() {
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                var items = this.formData.items;
                var flag = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].taxAmount)) {
                        flag = false;
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的本次到票金额为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].amount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的不含税金额为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].invoiceCode)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的发票代码为必填项');
                            return false;
                        }

                        if (this.isEmpty(items[i].invoiceNo)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的发票号码为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].invoiceDate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的开票日期为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].receiveDate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的收票日期为必填项');
                            return false;
                        }
                        let sum = this.getDaysBetween(items[i].invoiceDate, items[i].receiveDate);
                        if (sum < 1) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的收票日期不能大与开票日期');
                            return false
                        }
                    }
                }

                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                return true;
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            isRepeat(arr) {
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]]) {
                        return true;
                    }
                    hash[arr[i]] = true;
                }
                return false;
            },
            handleSubmit(type) {
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                let listData = [];
                for(let i in this.formData.items){
                    listData.push(this.formData.items[i].invoiceCode + this.formData.items[i].invoiceNo);

                }

                let reslut = this.isRepeat(listData);
                if(reslut){
                    this.vueMessage('warning','明细里面的发票代码和发票号码加起来不能重复!')
                    return
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        let list = JSON.parse(JSON.stringify(this.formData.items));
                        let sumAmount = 0;
                        let sumTaxAmount = 0;
                        for (let i in list) {
                            sumAmount = Number(sumAmount) + Number(list[i].amount);
                            sumTaxAmount = Number(sumTaxAmount) + Number(list[i].taxAmount);
                        }
                        this.formData.billAmount = sumAmount.toFixed(this.sysParam.amountDecimal);
                        this.formData.invoiceAmount = sumTaxAmount.toFixed(this.sysParam.amountDecimal);
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/financial/payable/purchase-invoice',
                                    name: '采购收票',
                                    meta: {
                                        i18n: 'purchase_order'
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
                            this.preventRepeatSubmit(false, type);
                        });
                    } else {
                        return false;
                    }
                });

            }
        }
    };
</script>
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
