<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"i
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">

                        <avue-crud :option="itemsOption" :data="formData.items" ref="crud"  class="bill-items-container"
                                   @current-row-change="handleCurrentRowChange">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <!--<i class="el-icon-plus" @click="handleAddRow(true)"-->
                                    <!--style="margin-right: 15px;color:  #409EFF;"></i>-->
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,true)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="newQty">
                                <div>
                                    <el-input v-model="scope.row.newQty" placeholder="请输入新订单数量"
                                              @change="qtyBlur(scope.row.$index,scope.row.newQty,true)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="newTaxPrice">
                                <div>
                                    <el-input v-model="scope.row.newTaxPrice" placeholder="请输入含税单价"
                                              @change="priceBlur(scope.row.$index,scope.row.newTaxPrice,true)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                    <template slot-scope="scope" slot="items2">
                        <avue-crud :option="itemsTwoOption" :data="items2.items"  class="bill-items-container">
                            <template slot="menuLeft">
                                <h3 style="margin-left: 4px;margin: 10px 0px;">器件清单</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index,false)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="newQty">
                                <div>
                                    <el-input v-model="scope.row.newQty" placeholder="请输入数量"
                                              @change="qtyBlur(scope.row.$index,scope.row.newQty,false)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="newTaxPrice">
                                <div>
                                    <el-input v-model="scope.row.newTaxPrice" placeholder="请输入新含税单价"
                                              @change="priceBlur(scope.row.$index,scope.row.newTaxPrice,false)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
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
            <div style="margin-top: 5px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block;margin-bottom: 60px;">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
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
        auditBill
    } from "@/api/erp/product/shop_manager/product_order_changes";
    import {userOption, customerOption, manufactureOption, commodityOption} from '@/util/table';
    import {getBill as getBillProject} from "@/api/erp/product/shop_manager/product_order";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    export default {
        name: "product_order_changes_form",
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
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                item2: {items: []},
                selectedRows: [],
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {},
                selectData: [],
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
                            label: "订单编号",
                            prop: "billNo",
                            display: false
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
                            prop: "relationBill",
                            span: 6,
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择关联单据",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == "view"||  this.type == "edit") {
                                    return
                                }
                                this.publicTitle = '请选择关联单据';
                                this.typeName = 'manufactureType';
                                this.option = manufactureOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "销售员ID",
                            prop: "salesId",
                            display: false
                        },
                        {
                            label: "销售员编号",
                            prop: "salesCode",
                            display: false
                        },
                        {
                            label: "销售员",
                            prop: "salesName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择销售员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == "view"||  this.type == "edit") {
                                    return
                                }
                                this.publicTitle = '请选择销售员';
                                this.typeName = 'userType';
                                this.option = userOption;
                                this.isSingle = true;
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
                            label: "客户名称",
                            prop: "customerName",
                            span: 6,
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
                                if (this.type == "view"|| this.type == "edit") {
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
                        {
                            prop: "items2",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        }
                    ]
                },
                itemsOption: {
                    border: true,
                    menu: false,
                    height: 300,
                    highlightCurrentRow: true,
                    addBtn: false, //新增
                    columnBtn: false, //列显示隐藏
                    refreshBtn: false, //刷新
                    searchShow: false, //首次加载是否显示搜索
                    selection: false,
                    selectionWidth: 60,
                    index: true,
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 120,
                            slot: true,
                        },
                        {
                            label: "产品名称",
                            prop: "skuName",
                            placeholder: '请选择产品',
                            fixed: true,
                            align: 'left',
                            width: 180,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 130,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "型号",
                            prop: "specifications",
                            width: 130,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "计量单位",
                            prop: "unit",
                            width: 100,
                            align: 'center',
                            placeholder: ' ',
                        },
                        {
                            label: "原订单数量",
                            prop: "primaryQty",
                            width: 120,
                            align: 'right',
                            type: 'number',
                        },
                        {
                            label: "新订单数量",
                            prop: "newQty",
                            width: 148,
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
                                    "新订单数量"
                                );
                            }
                        },
                        {
                            label: "原含税单价",
                            prop: "taxPrice",
                            width: 120,
                            align: 'right',
                        },
                        {
                            label: "新含税单价",
                            prop: "newTaxPrice",
                            width: 150,
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
                                    "新含税单价"
                                )
                            },
                        },
                        {
                            label: "原含税金额",
                            prop: "taxAmount",
                            width: 120,
                            align: 'right',
                        },
                        {
                            label: "新含税金额",
                            prop: "newTaxAmount",
                            width: 120,
                            align: 'right',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 140,
                            slot: true,
                        },
                    ]
                },
                itemsTwoOption: {
                    border: true,
                    menu: false,
                    height: 300,
                    highlightCurrentRow: true,
                    addBtn: false, //新增
                    columnBtn: false, //列显示隐藏
                    refreshBtn: false, //刷新
                    searchShow: false, //首次加载是否显示搜索
                    selection: false,
                    selectionWidth: 60,
                    index: true,
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 120,
                            slot: true,
                        },
                        {
                            label: "产品名称",
                            prop: "skuName",
                            placeholder: '请选择产品',
                            fixed: true,
                            align: 'left',
                            width: 180,
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 120,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 100,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 150,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 100,
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "原器件数量",
                            prop: "qty",
                            width: 120,
                            align: 'right',
                        },
                        {
                            label: "新器件数量",
                            prop: "newQty",
                            width: 120,
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
                                    "新器件数量"
                                );
                            }
                        },
                        {
                            label: "原含税单价",
                            prop: "taxPrice",
                            width: 100,
                            align: 'right',
                        },
                        {
                            label: "新含税单价",
                            prop: "newTaxPrice",
                            width: 120,
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
                                    "新含税单价"
                                )
                            },
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 100,
                            align: 'right',
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 100,
                            align: 'right',
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 80,
                            align: 'right',
                            dicData:this.taxRateOptions
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 80,
                            align: 'right'
                        },

                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 120,
                            align: 'right',
                        },
                        {
                            label: "新含税金额",
                            prop: "newTaxAmount",
                            width: 120,
                            align: 'right',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            slot: true,
                        },
                    ]
                },
                publicVisible: false,
                publicTitle: '',
                isSingle: true,
                typeName: '',
                itemVisible: true,
                itemTwo: [],
                items2: {items: []},
                skuNoIndex: undefined,
            };
        },
        mounted() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        methods: {
            handleCurrentRowChange(val) {
                this.selectedRows = [val];
                if (val != null && val != undefined && val.skuName && val.skuName != '') {
                    this.skuNoIndex = this.selectedRows[0].skuNo;
                    let flag = false;
                    let sum;
                    if (this.itemTwo.length > 0) {
                        for (let i in this.itemTwo) {
                            if (this.itemTwo[i].skuNo == this.skuNoIndex) {
                                flag = true;
                                sum = i;
                            }
                            if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                this.itemTwo[i] = JSON.parse(JSON.stringify(this.items2));
                            }
                        }
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};

                        if (flag) {
                            if (this.itemTwo[sum].items.length == 0) {
                                const d = {
                                    skuName: '',
                                    goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                                };
                                this.items2.items.push(d);
                            } else {
                                this.items2.items = JSON.parse(JSON.stringify(this.itemTwo[sum].items));
                            }
                        } else {
                            this.itemTwo.push({
                                skuNo: this.skuNoIndex,
                                items: [],
                            });
                            const d = {
                                skuName: '',
                                goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                            };
                            this.items2.items.push(d);
                        }
                    } else {
                        this.itemTwo.push({
                            skuNo: this.skuNoIndex,
                            items: [],
                        });
                        const d = {
                            skuName: '',
                            goodsDate: new Date().toLocaleDateString().replace(/\//g, '-')
                        };
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};
                        this.items2.items.push(d);
                    }
                } else if (val == null || val != undefined && !val.skuName || val.skuName != '') {
                    //this.vueMessage('warning', '请先选择产品信息!');
                    this.selectedRows = [];
                }
            },
            priceBlur(index, val, type) {
                if (type) {
                    this.formData.items[index].newTaxAmount = (Number(this.formData.items[index].newQty) * Number(this.formData.items[index].newTaxPrice)).toFixed(2);
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                }else{
                    this.items2.items[index].newTaxAmount = (Number(this.items2.items[index].newQty) * Number(this.items2.items[index].newTaxPrice)).toFixed(2);
                    this.vueSet(this.items2.items, index, this.items2.items[index]);
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                            this.itemTwo[i].items = JSON.parse(JSON.stringify(this.items2.items));
                        }
                    }
                }
            },
            qtyBlur(index, val, type) {
                if (type) {
                    if(val> this.formData.items[index].primaryQty){
                        this.formData.items[index].newQty = this.formData.items[index].primaryQty;
                        this.vueMessage('warning','新订单数量不能大于原订单数量!');
                    }
                    this.formData.items[index].newTaxAmount = (parseInt(val) * Number(this.formData.items[index].newTaxPrice)).toFixed(2);
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                } else {
                    this.items2.items[index].newTaxAmount = (parseInt(val) * Number(this.items2.items[index].newTaxPrice)).toFixed(2);
                    this.vueSet(this.items2.items, index, this.items2.items[index]);
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                            this.itemTwo[i].items = JSON.parse(JSON.stringify(this.items2.items));
                        }
                    }
                }
            },
            handleAddRow(type) {
                const d = {
                    skuName: '',
                    goodsDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                };
                if (type) {
                    this.formData.items.push(d);
                } else {
                    this.items2.items.push(d);
                }
            },
            handleRemoveRow(item, index, type) {
                let ValueIndex = type ? this.formData.items.length : this.items2.items.length;
                if (ValueIndex === 1) {
                    return
                }
                if (type) {
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == item.skuNo) {
                            this.itemTwo.splice(i, 1);
                        }
                    }
                    if (this.items2.skuNo == item.skuNo) {
                        this.items2 = {items: []};
                    }
                    this.formData.items.splice(index, 1);
                } else {
                    this.items2.items.splice(index, 1);
                    for (let i in this.itemTwo) {
                        if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                            this.itemTwo[i].items = this.items2.items;
                        }
                    }
                }
            },
            //多选框状态改变时
            handleSelectionChange(selection) {
                if (selection.length > 1) {
                    this.vueMessage('warning', '请选择一条产品!');
                }
                this.selectedRows = selection;

                if (this.selectedRows.length == 1 && selection[0].skuName != '') {
                    this.skuNoIndex = this.selectedRows[0].skuNo;
                    let flag = false;
                    let sum;

                    if (this.itemTwo.length > 0) {
                        for (let i in this.itemTwo) {
                            if (this.itemTwo[i].skuNo == this.skuNoIndex) {
                                flag = true;
                                sum = i;
                            }
                            if (this.itemTwo[i].skuNo == this.items2.skuNo) {
                                this.itemTwo[i] = JSON.parse(JSON.stringify(this.items2));
                            }
                        }
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};

                        if (flag) {
                            if (this.itemTwo[sum].items.length == 0) {
                                const d = {
                                    skuName: '',
                                };
                                this.items2.items.push(d);
                            } else {
                                this.items2.items = JSON.parse(JSON.stringify(this.itemTwo[sum].items));
                            }
                        } else {
                            this.itemTwo.push({
                                skuNo: this.skuNoIndex,
                                items: [],
                            });
                            const d = {
                                skuName: '',
                            };
                            this.items2.items.push(d);
                        }

                    } else {
                        this.itemTwo.push({
                            skuNo: this.skuNoIndex,
                            items: [],
                        });
                        const d = {
                            skuName: '',
                        };
                        this.items2 = {skuNo: this.selectedRows[0].skuNo, items: []};
                        this.items2.items.push(d);
                    }
                }
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        this.formData.customerId = list[0].id;
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                    }
                    if (this.typeName == 'userType') {
                        this.formData.salesId = list[0].id;
                        this.formData.salesCode = list[0].no;
                        this.formData.salesName = list[0].name;
                    }
                    if (this.typeName == 'manufactureType') {
                        if (list[0].id) {
                            getBillProject(list[0].id).then(res => {
                                if (res.data.code == '2000' && res.data.data) {
                                    let data = JSON.parse(JSON.stringify(res.data.data));
                                    this.itemTwo = [];
                                    let itemData = [];
                                    for(let i=data.items.length - 1; i>=0;i--){
                                        if(data.items[i].workerQty > 0){
                                            data.items.splice(i*1, 1);
                                        }
                                    }
                                    if(data.items.length < 1){
                                        this.vueMessage('warning','该单据已派工无法变更!');
                                        return
                                    }
                                    this.formData.customerId = res.data.data.customerId;
                                    this.formData.customerCode = res.data.data.customerCode;
                                    this.formData.customerName = res.data.data.customerName;
                                    this.formData.salesId = list[0].salesId;
                                    this.formData.salesCode = list[0].salesCode;
                                    this.formData.salesName = list[0].salesName;
                                    for (let i in data.items) {
                                        data.items[i].primaryQty = data.items[i].qty;
                                        data.items[i].sourceBillId = data.items[i].id;
                                        data.items[i].id = '';
                                        for (let j in data.items[i].items) {
                                            data.items[i].items[j].sourceBillId = data.items[i].items[j].id;
                                            data.items[i].items[j].id = '';
                                        }
                                        let obj = {
                                            skuNo: data.items[i].skuNo,
                                            items: data.items[i].items,
                                        };
                                        itemData.push(obj);
                                    }
                                    this.formData.relationBill = data.billNo;
                                    this.formData.items = data.items;
                                    this.itemTwo = itemData;
                                }
                            })
                        }
                    }
                    this.$refs.publicSelector.selectionClear();
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
                this.processId = '';
                if(this.$refs.form){
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.itemsTwoOption.column[0].hide = true;
                    this.formOption.disabled = true;
                }else if(this.type == 'edit'){
                    this.itemsOption.column[0].hide = false;
                    this.itemsTwoOption.column[0].hide = false;
                    this.formOption.disabled = true;
                }else {
                    this.itemsOption.column[0].hide = false;
                    this.itemsTwoOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }

                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        goodsDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [],
                        items2: []
                    };
                    this.items2 = {items: []};
                    this.$nextTick(()=>{
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/product_order_changes_form',
                    name: '生产订单变更单制单',
                    query: {
                        type: 'add'
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
                let sum =await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
                    this.clocseCurrent(this,this.$route);
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
                        this.formData = formData;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);
                        this.itemTwo = [];
                        let itemData = [];
                        for (let i in formData.items) {
                            let data = {
                                skuNo: formData.items[i].skuNo,
                                items: formData.items[i].items,
                            }
                            itemData.push(data)
                        }
                        this.itemTwo = itemData;
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/warehousing-order-form',
                            name: '入库订单制单',
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
            handleCheckItemFuc(items) {
                var flag = true;
                var flagTwo = true;
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的产品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].newQty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的新订单数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].newTaxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的新含含税单价为必填项');
                            return false;
                        }
                    }
                    if (!this.isEmpty(items[i].skuNo) && items[i].items.length > 0) {
                        for (var j in items[i].items) {
                            flagTwo = false;
                            let itemTwo = items[i].items[j];
                            if (!this.isEmpty(itemTwo.skuNo)) {
                                flag = false;
                                if (this.isEmpty(itemTwo.newQty) ) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                                    return false;
                                }
                                if (itemTwo.newQty % items[i].newQty != 0) {
                                    this.vueMessage('warning', '第' + (i * 1 + 1) + '行的订单数量必须为新订单数量的倍数!');
                                    return false;
                                }
                            }
                        }
                    }
                }
                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                if (flagTwo) {
                    this.vueMessage('warning', '产品单据明细不能为空');
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
                if (this.itemTwo.length == 0) {
                    this.vueMessage('warning', '产品单据明细不能为空');
                    return false;
                }
                let data = JSON.parse(JSON.stringify(this.formData));
                let twoData = JSON.parse(JSON.stringify(this.itemTwo));
                delete data.items2;
                for (let i in data.items) {
                    for (let j in twoData) {
                        if (data.items[i].skuNo == twoData[j].skuNo) {
                            data.items[i].items = twoData[j].items;
                        }
                    }
                }
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc(data.items)) {
                    return;
                }
                data.items = this.clearNoGoodsIdData(data.items);
                if (data.deliverDate && data.deliverDate !== undefined && data.deliverDate.length > 0) {
                    data.startValidityPeriod = data.deliverDate[0] + ' 00:00:00';
                    data.endValidityPeriod = data.deliverDate[1] + ' 23:59:59';
                    delete data.deliverDate;
                }

                this.$refs['form'].validate((valid) => {
                    if (valid) {

                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        saveBill(data).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/product_order_changes',
                                    name: '生产订单变更单',
                                    meta: {
                                        i18n: 'product_order_changes'
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
