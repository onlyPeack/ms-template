<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"></button-bar>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block;">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0;">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit" :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'" >
                                <div>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionName">
                                <div @click="positionBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.positionName" placeholder="请选择仓位"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div>
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="qtyBlur(scope.row.$index,scope.row.qty)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              :disabled="type=='view'?true:false"
                                              @blur="pricesBlur(scope.row.$index,scope.row.taxPrice,false)"></el-input>
                                </div>
                            </template>
                            <!--<template slot-scope="scope" slot="price">-->
                                <!--<div>-->
                                    <!--<el-input v-model="scope.row.price" placeholder="请输入单价"-->
                                              <!--:disabled="type=='view'?true:false"-->
                                              <!--@blur="priceBlur(scope.row.$index,scope.row.price,false)"></el-input>-->
                                <!--</div>-->
                            <!--</template>-->
                            <template slot-scope="scope" slot="taxRate">
                                <div class="zRightClass">
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                               @change="handleTypeChange(scope.row.$index,scope.row.taxRate)"
                                               :disabled="type &&type== 'view'?true:false">
                                        <el-option v-for="item in  taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请填写备注"
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" selectType="1" :code="formData.warehouseId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, addBill, tempAddBill, auditBill} from "@/api/erp/wms/bill/salesStockReturn";
    import {salesOption, warehouseOption, userOption,positionOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "sales_stock_out_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                isSingle: true,
                isShow: true,
                loading: false,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                itemsOption: {
                    border: true,
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    menu: false,
                    height: 'auto',
                    calcHeight: 350,
                    selection: false,
                    selectionWidth: 50,
                    index: true,
                    indexLabel:'序号',
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "taxPrice",
                            type: "sum"
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        }, {
                            name: "amount",
                            type: "sum"
                        }, {
                            name: "price",
                            type: "sum"
                        }, {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },  {
                            name: "tax",
                            type: "sum"
                        }, {
                            name: "billAmount",
                            type: "sum"
                        }, {
                            name: "taxBillAmount",
                            type: "sum"
                        }
                    ],
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            minWidth: 80,
                            slot: true,
                        },{
                            label: "仓位",
                            prop: "positionName",
                            width: 130,
                            overHidden:true,
                            placeholder: '请选择仓位',
                            align: 'left',
                            slot: true,
                        },{
                            label: "商品名称",
                            prop: "skuName",
                            width: 160,
                            overHidden:true,
                            placeholder: '请选择商品',
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
                            width: 150,
                            overHidden:true,
                            align: 'left'
                        },{
                            label: "订货号",
                            prop: "itemNo",
                            placeholder: ' ',
                            width: 130,
                            overHidden:true,
                            align: 'left'
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
                            width: 70,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            overHidden:true,
                            align:'right',
                        },
                        {
                            label: "退货数量",
                            prop: "qty",
                            width: 100,
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
                                    "退货数量"
                                );
                            }
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                            slot: true,
                        },
                        {
                            label: "价税合计",
                            prop: "taxAmount",
                            width: 100,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 90,
                            overHidden:true,
                            align: 'right',
                            slot: true
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 100,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 105,
                            overHidden:true,
                            align: 'right',
                            // slot: true,
                            // renderHeader: h => {
                            //     return h(
                            //         "span",
                            //         {
                            //             style: {
                            //                 color: "#ff0000"
                            //             }
                            //         },
                            //         "单价"
                            //     );
                            // }
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 100,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "整单备注",
                            prop: "note",
                            minWidth: 120,
                            overHidden:true,
                            align: 'left',
                            slot: true
                        },
                    ]
                },
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
                            span:6
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
                            label: "关联单据",
                            prop: "sourceBillNo",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择关联单据',
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
                                this.typeName = 'salesType';
                                this.option = salesOption;
                                this.isSingle = false;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "客户名称ID",
                            prop: "customerId",
                            display: false
                        },
                        {
                            label: "客户名称编号",
                            prop: "customerCode",
                            display: false
                        },
                        {
                            label: "客户名称",
                            prop: "customerName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            disabled: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择客户名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "入库仓库Id",
                            prop: "warehouseId",
                            display: false
                        },
                        {
                            label: "入库仓库",
                            prop: "warehouseName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择入库仓库',
                            rules: [{
                                required: true,
                                message: "请选择入库仓库",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择入库仓库';
                                this.typeName = 'warehouseType';
                                this.option = warehouseOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
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
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择业务员',
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
                            label: "快递名称",
                            prop: "expressName",
                            span: 6,
                        },
                        {
                            label: "快递单号",
                            prop: "expressNo",
                            span: 6,
                        },
                        {
                            label: "备注",
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
                positionIndex: undefined,

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
            positionBtn(val, index) {
                if (this.type != 'view') {
                    if (!this.formData.warehouseId) {
                        this.vueMessage('warning', '请先选入库仓库!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择仓位';
                    this.typeName = 'positionType';
                    this.option = positionOption;
                    this.publicVisible = true;
                    this.positionIndex = index;
                }
            },
            handleTypeChange(index, val) {
                if (this.formData.items[index].price && this.formData.items[index].qty) {
                    if (!isNaN(this.formData.items[index].taxPrice) && !isNaN(this.formData.items[index].qty)) {
                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].price) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                }
            },
            pricesBlur(index, val, type) {
                if (!isNaN(val)) {
                    if (this.formData.items[index].qty && !isNaN(this.formData.items[index].qty)) {
                        this.formData.items[index].taxPrice = Number(val).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                } else {
                    this.formData.items[index].price = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
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
                    this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
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
                    if (this.typeName == 'positionType') {
                        this.formData.items[this.positionIndex].positionName = list[0].name;
                        this.formData.items[this.positionIndex].positionId = list[0].id;
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                        this.publicVisible = false;
                    }
                    if (this.typeName == 'salesType') {
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerId = list[0].mainDTO.customerId;
                        this.formData.customerName = list[0].customerName;
                        this.formData.salerName = list[0].mainDTO.salerName;
                        this.formData.salerCode = list[0].mainDTO.salerCode;
                        this.formData.salerId = list[0].mainDTO.salerId;
                        this.formData.warehouseName = list[0].mainDTO.warehouseName;
                        this.formData.warehouseId = list[0].mainDTO.warehouseId;
                        this.formData.sourceBillNo = list[0].billNo;
                        if (this.formData.items && this.formData.items.length > 0) {
                            this.$confirm("切换已选单据将清空相应的数据，确认切换吗?", "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                this.formData.items = [];
                                for (var index in list) {
                                    var item = list[index];
                                    var itemObj = {};
                                    itemObj.sourceBillId = item.id;
                                    itemObj.sourceBillNo = item.billNo;
                                    itemObj.sourceObjectKey = 'XSCK';
                                    itemObj.skuName = item.skuName;
                                    itemObj.skuNo = item.skuNo;
                                    itemObj.itemNo = item.itemNo;
                                    itemObj.brandName = item.brandName;
                                    itemObj.specifications = item.specifications;
                                    itemObj.categoryName = item.categoryName;
                                    itemObj.seriesName = item.seriesName;
                                    itemObj.qty = item.qty;
                                    itemObj.price = item.price;
                                    itemObj.amount = item.amount;
                                    itemObj.taxRate = item.taxRate;
                                    itemObj.tax = item.tax;
                                    itemObj.taxPrice = item.taxPrice;
                                    itemObj.taxAmount = item.taxAmount;
                                    itemObj.unit = item.unit;
                                    itemObj.surfacePrice = item.surfacePrice;
                                    this.formData.items.push(itemObj);
                                }
                                this.$nextTick(() => {
                                    //清除没有商品ID的数据
                                    this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                                });
                                this.publicVisible = false;
                            })
                        } else {
                            for (var index in list) {
                                var item = list[index];
                                var itemObj = {};
                                itemObj.sourceBillId = item.id;
                                itemObj.sourceBillNo = item.billNo;
                                itemObj.sourceObjectKey = 'XSCK';
                                itemObj.skuName = item.skuName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.itemNo = item.itemNo;
                                itemObj.brandName = item.brandName;
                                itemObj.specifications = item.specifications;
                                itemObj.categoryName = item.categoryName;
                                itemObj.seriesName = item.seriesName;
                                itemObj.qty = item.qty;
                                itemObj.price = item.price;
                                itemObj.amount = item.amount;
                                itemObj.taxRate = item.taxRate;
                                itemObj.tax = item.tax;
                                itemObj.taxPrice = item.taxPrice;
                                itemObj.taxAmount = item.taxAmount;
                                itemObj.unit = item.unit;
                                itemObj.surfacePrice = item.surfacePrice;
                                this.formData.items.push(itemObj);
                            }
                            this.$nextTick(() => {
                                //清除没有商品ID的数据
                                this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            });
                            this.publicVisible = false;
                        }
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name;
                        this.formData.warehouseId = list[0].id;
                        this.publicVisible = false;
                    }
                    if (this.typeName == 'userType') {
                        this.formData.salerName = list[0].name;
                        this.formData.salerCode = list[0].no;
                        this.formData.salerId = list[0].id;
                        this.publicVisible = false;
                    }
                    this.$refs.publicSelector.selectionClear();
                } else {
                    this.publicVisible = false;
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
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: []
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
                this.handleBillAdd(this,{path: '/sales_stock_return_form', name: '销售退货制单'});
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
                            path: '/sales_stock_return_form',
                            name: '销售退货制单',
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
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        let amount = 0;
                        let taxAmount = 0;
                        for (let i in this.formData.items) {
                            amount = Number(this.formData.items[i].amount) + Number(amount);
                            taxAmount = Number(this.formData.items[i].taxAmount) + Number(taxAmount);
                        }
                        this.formData.billAmount = Number(amount).toFixed(this.sysParam.amountDecimal);
                        this.formData.taxBillAmount = Number(taxAmount).toFixed(this.sysParam.amountDecimal);
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/sales_stock_return',
                                    name: '销售退货',
                                    meta: {
                                        i18n: 'sales_stock_return'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            } else if (res.data.code == '401') {
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
