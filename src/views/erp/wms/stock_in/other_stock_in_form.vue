<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud"  :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries"
                                   @current-row-change="handleCurrentRowChange" clasNs="bill-items-container">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index,true)" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.qty,true,'qty', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="price">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.price" placeholder="请输入入库单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.price,true,'price', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.amount" placeholder="请输入入库金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.amount,true,'amount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionName">
                                <div @click="positionBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.positionName" placeholder="请选择仓位" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxRate">
                                <div class="zRightClass">
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                               :disabled="type == 'view'? true:false"
                                               @change="publicColumnBlur(scope.row.$index,scope.row.taxRate,true,'taxRate', scope.row)">
                                        <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,true,'taxPrice', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.taxAmount" placeholder="请输入含税金额"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,true,'taxAmount', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>

                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input
                                            @blur="publicColumnBlur(scope.row.$index,scope.row.note,true,'note', scope.row)"
                                            v-model="scope.row.note" placeholder="请输入备注"
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :code="formData.warehouseId"
                            :itemVisible="itemVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :typeOption="formData.type"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill} from "@/api/erp/wms/bill/otherStockIn";
    import {userOption, commodityOption, warehouseOption, sendOption, otherOption, positionOption} from '@/util/table';
    import {getObj} from "@/api/admin/user/index";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    export default {
        name: "other_stock_in_form",
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
                fileList: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                selectedRows: [],
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {},
                swith: undefined,
                selectData: [],
                selectIndex: 0,
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
                            readonly: true,
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
                            label: "操作员ID",
                            prop: "operatorId",
                            display: false
                        },
                        {
                            label: "操作员编号",
                            prop: "operatorCode",
                            display: false
                        },
                        {
                            label: "操作员",
                            prop: "operatorName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择操作员',
                            rules: [{
                                required: true,
                                message: "请选择操作员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择操作员';
                                this.typeName = 'userType';
                                this.option = userOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "部门",
                            prop: "departName",
                            span: 6
                        },
                        {
                            label: "往来单位",
                            prop: "companyName",
                            span: 6,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择往来单位',
                            rules: [{
                                required: true,
                                message: "请选择往来单位",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择往来单位';
                                this.typeName = 'otherType';
                                this.option = otherOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "入库类型",
                            prop: "stockType",
                            minWidth: 150,
                            type: 'select',
                            align: 'center',
                            span: 6,
                            dicData: [
                                {
                                    value: '0',
                                    label: '还入'
                                },
                                {
                                    value: '1',
                                    label: '赠品'
                                },
                                {
                                    value: '2',
                                    label: '货抵'
                                }
                            ]
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
                                if(this.type == 'view'){
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
                            label: "承运商",
                            prop: "expressName",
                            span: 6,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/sales-stock-out/selectExpress',
                            props: {
                                value: 'expressName',
                                label: 'expressName'
                            },
                            filterable: true,
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
                            formslot: true,
                            labelslot: true,
                            errorslot: true,
                        },
                    ]
                },
                itemsOption: {
                    border: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    height: 'auto',
                    calcHeight: 350,
                    highlightCurrentRow: true,
                    index: true,
                    indexLabel:'序号',
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
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            minWidth: 120,
                            slot: true,
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品',
                            fixed: true,
                            align: 'left',
                            width: 130,
                            overHidden:true,
                            slot: true,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 80,
                            overHidden:true,
                            align: 'left',
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
                            label: "数量",
                            prop: "qty",
                            width: 120,
                            overHidden:true,
                            align: 'right',
                            type: 'number',
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
                            },
                        },
                        {
                            label: "入库单价",
                            prop: "price",
                            width: 140,
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
                                    "入库单价"
                                );
                            },
                        },
                        {
                            label: "入库金额",
                            prop: "amount",
                            width: 140,
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
                                    "入库金额"
                                );
                            },
                        },
                        {
                            label: "仓位",
                            prop: "positionName",
                            width: 120,
                            overHidden:true,
                            placeholder: '请选择仓位',
                            align: 'left',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "仓位"
                                );
                            },
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 105,
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
                                    "税率"
                                );
                            },
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 100,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 140,
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
                                    "含税单价"
                                );
                            },
                        },
                        {
                            label: "价税合计",
                            prop: "taxAmount",
                            width: 140,
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
                                    "价税合计"
                                );
                            },
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 120,
                            overHidden:true,
                            slot: true,
                        },
                    ]
                },
                publicVisible: false,
                publicTitle: '',
                isSingle: true,
                typeName: '',
                itemVisible: true,
                skuNoIndex: undefined,
                positionIndex: undefined
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
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
                    if (this.formData.items[index] && this.formData.items[index].skuNo) {
                        this.isSingle = false;
                        this.publicTitle = '请选择仓位';
                        this.typeName = 'positionType';
                        this.option = positionOption;
                        this.publicVisible = true;
                        this.positionIndex = index;
                    } else {
                        this.vueMessage('warning', '请先选入产品!');
                        return
                    }

                }
            },
            publicColumnBlur(index, val, type, name, item) {
                if (!isNaN(item.qty) && !isNaN(item.price)) {
                    if (name == 'qty' || name == 'price') {
                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                    }
                    if (name == 'amount') {
                        this.formData.items[index].price = (Number(this.formData.items[index].amount) / Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                    }
                    if (name == 'taxPrice') {
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                    }
                    if (name == 'taxAmount') {
                        this.formData.items[index].taxPrice = (Number(this.formData.items[index].taxAmount) / Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                    }
                    if (name == 'taxRate') {
                        this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].price) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
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
            handleAddRow() {
                const d = {
                    skuName: '',
                };
                this.formData.items.push(d);
            },
            handleCurrentRowChange(val) {
                // this.selectedRows = [val];
                // if (val == null || val != undefined && !val.skuName || val.skuName != '') {
                //     this.vueMessage('warning', '请先选择产品信息!');
                //     this.selectedRows = [];
                // }
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    if(this.formData.warehouseName !=''){
                        this.itemVisible = true;
                        this.isSingle = false;
                        this.publicTitle = '请选择商品';
                        this.typeName = 'commodityType';
                        this.option = commodityOption;
                        this.publicVisible = true;
                    }else{
                        this.vueMessage('warning','请先选择入库仓库!');
                        return
                    }

                }

            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'positionType') {
                        this.formData.items[this.positionIndex].positionName = list[0].name;
                        this.formData.items[this.positionIndex].positionId = list[0].id;
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    if (this.typeName == 'otherType') {
                        this.formData.companyName = list[0].name;
                        this.formData.companyId = list[0].id;
                    }
                    if (this.typeName == 'customerType') {
                        this.formData.customerId = list[0].id;
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                        this.formData.contactPhone = list[0].linkPhone;
                        this.formData.contactName = list[0].linkMan;
                    }
                    if (this.typeName == 'userType') {
                        getObj(list[0].id).then(res => {
                            if (res.data && res.data.data && res.data.data.departId) {
                                this.formData.operatorId = list[0].id;
                                this.formData.operatorCode = list[0].no;
                                this.formData.operatorName = list[0].name;
                                this.formData.departName = JSON.parse(res.data.data.departId).name;
                            }
                        })
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseId = list[0].id;
                        this.formData.warehouseName = list[0].name;
                    }
                    if (this.typeName == 'commodityType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.whether = 1;
                            itemObj.skuName = item.goodsName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.qty = 1;
                            itemObj.price = item.price;
                            itemObj.taxRate = 13;
                            itemObj.taxAmount = item.taxAmount;
                            itemObj.unit = item.unit;
                            itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            itemObj.amount = item.amount;
                            itemObj.tax = item.tax;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.taxAmount = item.taxAmount;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow();
                        });
                    }
                    this.$refs.publicSelector.selectionClear();
                }
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
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].skuNo)) {
                        items.splice(i, 1);
                    }
                }
                return items;
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
            init() {
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
                    this.handleGetBill(getBill, this.id);
                } else {
                    getObj(this.$store.getters.userInfo.id).then(res => {
                        if (res.data && res.data.data && res.data.data.departId) {
                            let formData = {
                                operatorId: this.$store.getters.userInfo.id,
                                operatorCode: this.$store.getters.userInfo.no,
                                operatorName: this.$store.getters.userInfo.name,
                                departName: JSON.parse(res.data.data.departId).name,
                                billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                items: [{
                                    skuName: '',
                                    deliveryDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                }],
                            };
                            this.vueSet(this, 'formData', formData);
                        }
                    })
                    this.loading = false;
                }
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
                        formData.deliverDate = [formData.startValidityPeriod, formData.endValidityPeriod];
                        this.fileList = [{name: formData.enclosure, url: formData.enclosure}];
                        this.formData = formData;
                        let billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);

                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/other_stock_in_form',
                            name: '其它入库制单',
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
            //校验是否已选择
            handleCheckItemFuc(items) {
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
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的入库单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].amount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的入库金额为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].positionName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的仓位为必填项');
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
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                let data = JSON.parse(JSON.stringify(this.formData));
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc(data.items)) {
                    return;
                }
                data.items = this.clearNoGoodsIdData(data.items);
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
                        let taxAmount = 0;
                        for (let i in data.items) {
                            taxAmount = Number(data.items[i].taxAmount) + Number(taxAmount);
                        }
                        data.taxBillAmount = Number(taxAmount).toFixed(this.sysParam.amountDecimal);
                        saveBill(data).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$router.push({
                                    path: '/other_stock_in',
                                    name: '其它入库',
                                    meta: {
                                        i18n: 'other_stock_in'
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
