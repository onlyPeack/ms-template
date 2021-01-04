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
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/sales-invoice-print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                    <div v-if="processId && processId!='' && taskType=='now'"
                         style="float: left;display: inline-block;">
                        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                                   v-if="formData.billStatus!=5">驳 回
                        </el-button>
                        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                    </div>
                </div>

                <div style="display:flex;flex-direction: column;justify-content: flex-end;">
                    <h3 v-if="formData && formData.billNo">&nbsp;&nbsp;&nbsp;No.{{formData.billNo}}</h3>
                    <el-button type="text" icon="el-icon-download" style="text-align: right;"
                               v-if="formData && formData.billNo">
                        <a @click="daoChu"
                           style="color: #409EFF;">导出开票单</a>
                    </el-button>
                </div>

            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           :class="type == 'view'?'main-form':'main-form main-form-select'" v-if="isShow"
                           :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="operationType">
                        <div style="margin-right: 10px;">
                            <el-select v-model="formData.operationType" @change="handleReceiveMethodsChange"
                                       :disabled="type == 'view'? true : false">
                                <el-option :value="'0'" label="开票"></el-option>
                                <el-option :value="'1'" label="退票"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items"
                                   :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div  class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="qtyBlur(scope.row.$index,scope.row.qty)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div  class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请填写备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
                </div>
            </div>
            <task-history v-if="formData.billNo && processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :config="config"
                            :selectType="typeName == 'customersOrderType'? 3 : 2"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :operationType="formData.operationType"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        getBill,
        getHistoryBill,
        addBill,
        tempAddBill,
        auditBill,
        getInvoiceConfig,
        checkTaxCode
    } from "@/api/erp/financial/financialSalesInvoice";
    import {customersOrderOption, warehouseOption, sendOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getObj} from '@/api/erp/crm/customer/index'
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    const transportOption = [
        {
            value: '0',
            label: '快递运输'
        },
        {
            value: '1',
            label: '运费到付'
        },
        {
            value: '2',
            label: '货物自提'
        }
    ]
    export default {
        name: "sales_stock_out_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
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
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                permission: {tempAddBtn: true, addBtn: false},
                rateOption: [
                    {
                        value: 0,
                        label: '0%'
                    },
                    {
                        value: 13,
                        label: '13%'
                    },
                    {
                        value: 16,
                        label: '16%'
                    },
                    {
                        value: 17,
                        label: '17%'
                    },
                    {
                        value: 18,
                        label: '18%'
                    },
                    {
                        value: 19,
                        label: '19%'
                    },
                    {
                        value: 20,
                        label: '20%'
                    }
                ],
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                itemsOption: {
                    border: true,
                    menu: false,
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    height: 'auto',
                    calcHeight: 350,
                    selection: false,
                    selectionWidth: 50,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "taxPrice",
                            type: "sum"
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        }, {
                            name: "price",
                            type: "sum"
                        }, {
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
                            minWidth: 80,
                            slot: true,
                        }, {
                            label: "订单号",
                            prop: "sourceBillNo",
                            width: 170,
                            overHidden: true,
                            placeholder: '请选择订单号',
                            align: 'left'
                        },
                        // {
                        //     label: "仓位",
                        //     prop: "positionName",
                        //     minWidth: 180,
                        //     placeholder: '请选择仓位',
                        //     align: 'left',
                        //     slot: true,
                        // },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            width: 160,
                            overHidden: true,
                            placeholder: '请选择商品名称',
                            align: 'left'
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
                            placeholder: ' ',
                            width: 160,
                            overHidden: true,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 100,
                            overHidden:true,
                            placeholder: ' ',
                            readonly: true,
                            align: 'left',
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 80,
                            overHidden:true,
                            placeholder: ' ',
                            readonly: true,
                            align: 'left',
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
                            placeholder: ' ',
                            width: 80,
                            align: 'center',
                            overHidden: true,
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            overHidden:true,
                            align:'right',
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 112,
                            overHidden: true,
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
                                    "数量"
                                );
                            }
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 100,
                            overHidden: true,
                            align: 'right',
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 100,
                            overHidden: true,
                            align: 'right'
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 80,
                            overHidden: true,
                            align: 'right',
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 100,
                            overHidden: true,
                            align: 'right'
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 100,
                            overHidden: true,
                            align: 'right'
                        },
                        {
                            label: "价税合计",
                            prop: "taxAmount",
                            width: 100,
                            overHidden: true,
                            align: 'right'
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            align: 'left',
                            slot: true,
                            overHidden: true,
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
                                label: "操作类型",
                                prop: "operationType",
                                span: 6,
                                type: 'select',
                                rules: [{
                                    required: true,
                                    message: "请选择操作类型",
                                    trigger: "change"
                                }],
                                formslot: true,
                            },
                            {
                                label: "关联单据",
                                prop: "sourceBillNo",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                suffixIcon: 'el-icon-search',
                                placeholder: '请选择关联单据',
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择关联单据",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择关联单据';
                                    this.typeName = 'customersOrderType';
                                    this.option = customersOrderOption;
                                    this.isSingle = false;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "客户ID",
                                prop: "customerId",
                                display: false
                            },
                            {
                                label: "客户编号",
                                prop: "customerCode",
                                display: false
                            },
                            {
                                label: "客户",
                                prop: "customerName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                disabled: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择客户",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "发票类型",
                                prop: "invoiceType",
                                align: 'center',
                                span: 6,
                                type: 'select',
                                dicData: [
                                    {
                                        value: '1',
                                        label: '增值税专用发票'
                                    },
                                    {
                                        value: '2',
                                        label: '采购普通发票'
                                    }
                                ],
                            },
                            {
                                label: "开票电话",
                                prop: "kpTel",
                                span: 6,
                            },
                            {
                                label: "开票地址",
                                prop: "kpAddress",
                                span: 6,
                            },
                            {
                                label: "收票人",
                                prop: "spMan",
                                span: 6,
                            },
                            {
                                label: "收票电话",
                                prop: "spTel",
                                span: 6,
                            },
                            {
                                label: "收票地址",
                                prop: "spAddress",
                                span: 6,
                            },
                            {
                                label: "寄票类型",
                                prop: "sendInvoiceType",
                                align: 'center',
                                span: 6,
                                type: 'select',
                                dicData: [
                                    {
                                        value: '0',
                                        label: '单寄'
                                    },
                                    {
                                        value: '1',
                                        label: '合寄'
                                    },
                                    {
                                        value: '2',
                                        label: '自领'
                                    }
                                ],
                            },
                            {
                                label: "物流名称",
                                prop: "expressName",
                                span: 6,
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择物流名称",
                                    trigger: "change"
                                }],
                                type: 'select',
                                dicMethod: 'get',
                                dicUrl: '/api/manager/sales-stock-out/selectExpress',
                                props: {
                                    value: 'expressName',
                                    label: 'expressName'
                                },
                            },
                            {
                                label: "纳税人识别号",
                                prop: "taxpayerNumber",
                                span: 6,
                            },
                            {
                                label: "开户银行",
                                prop: "bankName",
                                span: 6,
                            },
                            {
                                label: "银行账号",
                                prop: "bankAccount",
                                span: 6,
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
                config: 0,
                option: [],
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
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
            daoChu(){
                checkTaxCode().then(res=>{
                    console.log(res)
                    if(res.data.code == '2000' ||res.data.code == 2000){
                        window.location.href= '/api/manager/financial-sales-invoice/downTemplate?billNo='+ this.formData.id
                    }else{
                        this.$alert(res.data.msg ,'提示', {
                            confirmButtonText: '前往设置',
                            type: 'warning',
                            callback: action => {
                                this.$router.push({
                                    path: '/goods_tax_code',
                                    name: '商品税务编码',
                                    meta: {
                                        i18n: 'goods_tax_code'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            }
                        });

                    }
                })

            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            handleReceiveMethodsChange() {
                this.formData.items = [];
            },
            handleTypeChange(index, val) {
                if (this.formData.items[index].price && this.formData.items[index].qty) {
                    if (!isNaN(this.formData.items[index].price) && !isNaN(this.formData.items[index].qty)) {
                        this.formData.items[index].taxPrice = Number(Number(this.formData.items[index].price) + (Number(this.formData.items[index].price) * (Number(val) / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(val) / 100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                }
            },
            priceBlur(index, val, type) {
                if (!isNaN(val)) {
                    if (this.formData.items[index].qty && !isNaN(this.formData.items[index].qty)) {
                        this.formData.items[index].price = val;
                        this.formData.items[index].amount = (Number(val) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxPrice = Number(Number(this.formData.items[index].price) + (Number(this.formData.items[index].price) * (Number(this.formData.items[index].taxRate) / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                } else {
                    this.formData.items[index].price = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                }
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            qtyBlur(index, val) {
                if (!isNaN(val)) {
                    if (val > this.formData.items[index].maxQty) {
                        this.formData.items[index].qty = this.formData.items[index].maxQty;
                        this.vueMessage('warning', '数量已超出最多输入数量');
                    }
                    this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                }
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    if (item.skuNo) {
                        list.forEach(function (obj) {
                            if (obj.skuNo == item.skuNo) {
                                map.push(obj.skuNo);
                            }
                        });
                    }
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customersOrderType') {
                        getObj(list[0].mainDTO.customerId).then(res => {
                            this.formData.customerName = res.data.data.customerName;
                            this.formData.customerCode = res.data.data.customerCode;
                            this.formData.customerId = res.data.data.id;
                            this.formData.bankAccount = res.data.data.bankAccount;
                            this.formData.bankName = res.data.data.bankName;
                            this.formData.taxpayerNumber = res.data.data.taxpayerNumber;
                            this.formData.kpTel = res.data.data.kpTel;
                            this.formData.kpAddress = res.data.data.kpAddress;
                            this.formData.spAddress = res.data.data.spAddress;
                            this.formData.spMan = res.data.data.spMan;
                            this.formData.spTel = res.data.data.spTel;
                        })
                        this.formData.sourceBillNo = list[0].billNo;
                        this.formData.sourceObjectKey = 'CGDD';
                        this.formData.sourceObjectName = '销售订单';
                        if(list[0].mainDTO){
                            this.formData.sourceBillId = list[0].mainDTO.id;
                        }

                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceObjectName = '销售订单';
                            itemObj.sourceObjectKey = 'CGDD';
                            itemObj.sourceBillId = item.id;
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.itemNo = item.itemNo;
                            itemObj.brandName = item.brandName;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            if (this.formData.operationType == '0') {
                                if (this.config == 0) {
                                    itemObj.maxQty = item.qty * 1 - item.purchaseInvoiceQty * 1 + item.returnInvoiceQty * 1 - item.stockReturnQty * 1;
                                } else {
                                    itemObj.maxQty = item.stockOutSaleQty * 1 - item.purchaseInvoiceQty * 1 + item.returnInvoiceQty * 1 - item.stockReturnQty * 1;
                                }
                            } else {
                                itemObj.maxQty = item.purchaseInvoiceQty * 1 - item.returnInvoiceQty * 1;

                            }
                            itemObj.qty = itemObj.maxQty;
                            itemObj.price = item.price;
                            itemObj.taxRate = item.taxRate;
                            itemObj.tax = item.tax;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.amount = (Number(itemObj.price) * parseInt(itemObj.qty)).toFixed(this.sysParam.amountDecimal);
                            itemObj.taxAmount = (Number(itemObj.taxPrice) * parseInt(itemObj.qty)).toFixed(this.sysParam.amountDecimal);
                            itemObj.unit = item.unit;
                            itemObj.surfacePrice = item.surfacePrice;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    if (this.typeName == 'sendType') {
                        this.formData.expressName = list[0].name;
                        this.formData.expressId = list[0].id;
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
                getInvoiceConfig().then(res => {
                    this.config = res.data;
                })
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    getSelfCompany().then(response => {
                        let formData = {
                            billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            invoiceType: '1',
                            operationType: '0',
                            items: []
                        };
                        formData.companyId = response.data.id ? response.data.id : undefined
                        formData.companyName = response.data.companyName ? response.data.companyName : undefined
                        this.vueSet(this, 'formData', formData);
                        this.loading = false;
                    })

                }
            },
            //新增
            handleAdd() {
                this.handleBillAdd(this, {path: '/sales-invoice', name: '销售开票单制单'});
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
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/sales-invoice-form',
                            name: '销售开票单制单',
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
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].skuNo)) {
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
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].price)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxRate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的金额不能小于1');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的价税合计为必填项');
                            return false;
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
            handleSubmit(type) {
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        for(let i in this.expressOption){
                            if(this.expressOption[i].expressName == this.formData.expressName){
                                this.formData.expressId = this.expressOption[i].expressId;
                            }
                        }
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        let sumAmount = 0;
                        let sumTaxAmount = 0;
                        let list = this.formData.items;
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
                                    path: '/sales-invoice',
                                    name: '销售发票',
                                    meta: {
                                        i18n: 'sales-invoice'
                                    }, query: {
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
                                    message: "操作失败!"
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
