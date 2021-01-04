<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="justify-content: unset;position:relative;">
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
                                 :to="{path:'/print/purchase_order_print',query:{id:id}}">
                        <!--<el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印-->
                        <!--</el-button>-->
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
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'"  :summary-method="getSummaries"
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
                            <template slot-scope="scope" slot="sourceBillNo">
                                <div @click="skuBtn" class="zLeftClass">
                                    <el-input v-model="scope.row.sourceBillNo" placeholder="请选择采购订单号" readonly
                                              :disabled="type=='view'?true:false" ></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="verificationQty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.verificationQty" placeholder="请输入核销数量"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.verificationQty,'verificationQty', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="verificationAmount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.verificationAmount" placeholder="请输入核销金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.verificationAmount,'verificationAmount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
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
                <div class="order-making-info" v-if="type=='view'">
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
                            :code="formData.supplierId" :selectType="typeName =='invoiceType'? 1 : 2"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :operationType="formData.operationType"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, auditBill, tempAddBill} from "@/api/erp/financial/PurchaseInvoiceVerification";
    import {purchaseOption, userOption, applysOption, commodityOption, warehouseOption,purchasesOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "invoice_verification_form",
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
                            name: "verificationQty",
                            type: "sum",
                            len: 0
                        },{
                            name: "verificationAmount",
                            type: "sum"
                        },{
                            name: "returnQty",
                            type: "sum"
                        },{
                            name: "purchasePrice",
                            type: "sum"
                        },{
                            name: "notVerificationAmount",
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
                            label: "采购订单号",
                            prop: "sourceBillNo",
                            width: 150,
                            overHidden:true,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            align: 'left',
                            width: 120,
                            overHidden:true,
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            align: 'left',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            align: 'left',
                            width: 85,
                            overHidden:true,
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            align: 'left',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            align: 'left',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            align: 'left',
                            width: 70,
                            overHidden:true,
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            placeholder: ' ',
                            align:'right',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "核销数量",
                            prop: "verificationQty",
                            align: 'right',
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
                                    "核销数量"
                                );
                            }
                        },
                        {
                            label: "核销金额",
                            prop: "verificationAmount",
                            align: 'right',
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
                                    "核销金额"
                                );
                            }
                        },
                        {
                            label: "采购数量",
                            prop: "purchaseQty",
                            align: 'right',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "退货数量",
                            prop: "returnQty",
                            align: 'right',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "采购单价",
                            prop: "purchasePrice",
                            align: 'right',
                            width: 100,
                            overHidden:true,
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
                                span: 8
                            },
                            {
                                label: "单据日期",
                                prop: "billDate",
                                span: 8,
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
                                span: 8,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择供应商',
                                clearable: false,
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
                                label: "发票号码",
                                prop: "invoiceNo",
                                span: 8,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择发票号码',
                                rules: [{
                                    required: true,
                                    message: "请选择发票号码",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    if(this.formData.supplierName == ''){
                                        this.vueMessage('warning','请先选择供应商!');
                                        return
                                    }
                                    this.publicTitle = '请选择发票号码';
                                    this.typeName = 'invoiceTypes';
                                    this.option = applysOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "发票代码",
                                prop: "invoiceCode",
                                span: 8,
                                disabled: true,
                            },
                            {
                                label: "未核销金额",
                                prop: "notVerificationAmount",
                                span: 8,
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
                    if(this.formData.supplierName == ''){
                        this.vueMessage('warning','请先选择供应商!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择合同单号';
                    this.typeName = 'purchasesType';
                    this.option = purchasesOption;
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
                if(!isNaN(val)){
                if (name == 'verificationQty') {
                    if(val> this.formData.items[index].maxQty){
                        this.formData.items[index].verificationQty = this.formData.items[index].maxQty;
                        this.vueMessage('warning','数量已超出最多输入数量');
                    }
                    this.formData.items[index].verificationAmount = (Number(this.formData.items[index].purchasePrice) * Number(this.formData.items[index].verificationQty)).toFixed(this.sysParam.amountDecimal);
                }
                if (name == 'verificationAmount') {
                    if(val> this.formData.items[index].maxAmount){
                        this.formData.items[index].verificationAmount = this.formData.items[index].maxAmount;
                        console.log(this.formData.items[index])
                        this.vueMessage('warning','金额已超出最大输入金额');
                    }
                    this.formData.items[index].verificationQty = (Number(this.formData.items[index].verificationAmount) / Number(this.formData.items[index].purchasePrice)).toFixed(this.sysParam.amountDecimal);
                }
                this.vueSet(this.formData.items, index, this.formData.items[index]);
                }
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
                        this.formData.invoiceNo = '';
                        this.formData.items=[{}];
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
                    if (this.typeName == 'invoiceTypes') {
                        this.formData.invoiceNo = list[0].invoiceNo;
                        this.formData.invoiceCode = list[0].invoiceCode;
                        this.formData.notVerificationAmount =(list[0].taxAmount*1 - list[0].verificationAmount*1).toFixed(this.sysParam.amountDecimal);
                        this.formData.invoiceAmount =list[0].taxAmount;
                        this.formData.sourceBillId  =list[0].id;
                    }
                    if (this.typeName == 'userType') {
                        this.formData.purchaserId = list[0].id;
                        this.formData.purchaserCode = list[0].no;
                        this.formData.purchaserName = list[0].name;
                        this.formData.purchaserDepartName =  JSON.parse(list[0].departId).name;
                    }
                    if(this.typeName == 'purchasesType'){
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceBillId = item.id;
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.itemNo = item.itemNo;
                            itemObj.brandName = item.brandName;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.unit = item.unit;
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.purchaseQty = item.qty;
                            itemObj.returnQty = item.stockReturnQty;
                            itemObj.stockReturnAmount = item.stockReturnAmount;
                            itemObj.purchasePrice = item.taxPrice;
                            itemObj.verificationQty =item.qty * 1 - item.stockReturnQty * 1 - item.verificationQty * 1;
                            itemObj.maxQty = item.qty * 1 - item.stockReturnQty * 1 - item.verificationQty * 1;
                            itemObj.verificationAmount = (item.taxPrice * itemObj.verificationQty).toFixed(this.sysParam.amountDecimal);
                            itemObj.taxAmount = item.taxAmount;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow();
                        });
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
                    path: '/invoice_verification_form',
                    name: '发票核销制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'invoice_verification_form'
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
                    if (this.isEmpty(items[i].skuName)) {
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
                    if (!this.isEmpty(items[i].sourceBillNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].sourceBillNo)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的合同单号为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].verificationQty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的核销数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].verificationAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的核销金额为必填项');
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
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        let list = JSON.parse(JSON.stringify(this.formData.items));
                        let sumAmount = 0;
                        let sumTaxAmount = 0;
                        let verificationAmount = 0;
                        for (let i in list) {
                            sumAmount = Number(sumAmount) + Number(list[i].amount);
                            sumTaxAmount = Number(sumTaxAmount) + Number(list[i].taxAmount);
                            verificationAmount = Number(verificationAmount) + Number(list[i].verificationAmount);
                        }
                        this.formData.billAmount = sumAmount.toFixed(this.sysParam.amountDecimal);
                        this.formData.verificationAmount = sumTaxAmount.toFixed(this.sysParam.amountDecimal);
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/invoice_verification',
                                    name: '发票核销',
                                    meta: {
                                        i18n: 'invoice_verification'
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
