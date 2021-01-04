<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false"
               :before-close="handleClose" :title="title" append-to-body class="public-dialog">
        <div>
            <basic-container>
                <div class="avue-crud-container" v-if="isShow">
                    <avue-crud ref="crud"
                               v-if="isShow"
                               :page="page"
                               :data="list"
                               :table-loading="loading"
                               :option="tableOption"
                               @refresh-change="refreshChange"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               @selection-change="handleSelectionChange"
                               @search-change="handleSearchChange"
                               @search-reset="handleSearchReset"
                               @sort-change="handleSortChange"
                               @row-click="handleRowClick"
                               @on-load="onLoad">
                        <!--自定义按钮-->
                        <template slot="menuRight">
                            <!--<el-switch style="margin-bottom: 10px;" v-model="isDetailed" active-text="收货通知单" inactive-text="采购订单"-->
                                       <!--@change="handleSwitchChange"></el-switch>-->
                        </template>
                    </avue-crud>
                </div>
            </basic-container>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {selectPageByItem as receiptGoodNotice} from '@/api/erp/purchase/bill/purchaseReceiptGoodsNotice'
    import {selectPageByItem as purchaseOrder} from '@/api/erp/purchase/bill/purchaseOrder'
    export default {
        props: ['dialogVisible', 'isSingle', 'title','associatedName','selectType','typeName'],
        data() {
            return {
                form: {},
                query: {},
                loading: true,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                selectionList: [],
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                listQuery: {},
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                tableOption: {
                    height: '300',
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: false,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
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
                            name: "purchaseInvoiceQty",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'center',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 80,
                        align: 'center',
                        type: 'select',
                        dicData: this.orderType,
                        searchFilterable: true
                    },
                    {
                        label: "供应商名称",
                        prop: "supplierName",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        minWidth: 150,
                        align: 'left',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 180,
                        align: 'left',
                    },
                    // {
                    //     label: "商品编码",
                    //     prop: "skuNo",
                    //     minWidth: 240,
                    //     align: 'left',
                    // },
                    {
                        label: "单位",
                        prop: "unit",
                        minWidth: 80,
                        align: 'left',
                    },
                    {
                        label: "未处理数量",
                        prop: "applyQty",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "处理数量",
                        prop: "qty",
                        minWidth: 80,
                        align: 'center',
                    },
                    {
                        label: "付款单价",
                        prop: "taxPrice",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "税额",
                        prop: "tax",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "不含税单价",
                        prop: "price",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "价税合计",
                        prop: "taxAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    // {
                    //     label: "收货数量",
                    //     prop: "deliverQty",
                    //     minWidth: 80,
                    //     align: 'right',
                    // },
                    {
                        label: "入库数量",
                        prop: "stockInPurchaseQty",
                        minWidth: 80,
                        align: 'right',
                    },
                    {
                        label: "未入库数量",
                        prop: "notStockInPurchaseQty",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "入库金额",
                        prop: "stockInPurchaseAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "未入库金额",
                        prop: "notStockInPurchaseAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    // {
                    //     label: "入库状态",
                    //     prop: "storageStatus",
                    //     minWidth: 80,
                    //     align: 'center',
                    //     type: 'select',
                    //     dicData: this.storageStatusOptions,
                    //     searchFilterable: true
                    // },
                    // {
                    //     label: "收货状态",
                    //     prop: "receiptStatus",
                    //     minWidth: 80,
                    //     align: 'center',
                    //     type: 'select',
                    //     dicData: this.receiptStatusOptions,
                    //     searchFilterable: true
                    // },
                    // {
                    //     label: "交货日期",
                    //     prop: "deliverDate",
                    //     minWidth: 180,
                    //     sortable: true,
                    //     align: 'center',
                    //     type: 'date',
                    //     valueFormat: 'yyyy-MM-dd',
                    //     format: 'yyyy-MM-dd',
                    //     type: "daterange",
                    //     startPlaceholder: '开始日期',
                    //     endPlaceholder: '结束日期',
                    // },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        minWidth: 180,
                        sortable: true,
                        align: 'center',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                ],
                detailedColumn: [
                    {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'center',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 80,
                        align: 'center',
                        type: 'select',
                        dicData: this.orderType,
                        searchFilterable: true
                    },
                    {
                        label: "供应商编号",
                        prop: "supplierCode",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "供应商名称",
                        prop: "supplierName",
                        minWidth: 240,
                        align: 'center',
                    },
                    {
                        label: "采购员编号",
                        prop: "purchaserCode",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "采购员",
                        prop: "purchaserName",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "采购部门",
                        prop: "departName",
                        minWidth: 240,
                        align: 'center',
                    },
                    {
                        label: "到货仓库",
                        prop: "warehouseName",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "金额",
                        prop: "billAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "价税合计",
                        prop: "taxBillAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    // {
                    //     label: "商品编码",
                    //     prop: "skuNo",
                    //     minWidth: 180,
                    //     align: 'center',
                    // },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 180,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 180,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        minWidth: 80,
                        align: 'center',
                    },
                    {
                        label: "数量",
                        prop: "qty",
                        minWidth: 80,
                        align: 'center',
                    },
                    {
                        label: "单价",
                        prop: "price",
                        minWidth: 100,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        minWidth: 100,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "税额",
                        prop: "tax",
                        minWidth: 100,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "含税单价",
                        prop: "taxPrice",
                        minWidth: 100,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "价税合计",
                        prop: "taxAmount",
                        minWidth: 100,
                        align: 'right',
                        textColor:"#ff0000"
                    },
                    {
                        label: "入库数量",
                        prop: "stockInPurchaseQty",
                        minWidth: 80,
                        align: 'right',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        minWidth: 180,
                        sortable: true,
                        align: 'center',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                ]
            };
        },
        computed: {
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        methods: {
            handleSearchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            handleSearchChange(params) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
            },
            handleSelectionChange(list) {
                this.selectionList = list;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            handleCurrentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            handleSizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            rowClick(row, event, column) {
                this.$refs.crud.toggleSelection([row]);
            },
            onLoad(page, params = {}) {
                this.loading = true;
                let queryObj;
                let select;
                if(this.associatedName == 'purchaseStockIn'){
                    if(this.isDetailed){
                        queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType});
                        select = receiptGoodNotice;
                    }else{
                        queryObj = Object.assign(params, this.query, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType});
                        select = purchaseOrder;
                    }
                }
                this.tableOption.column = [];
                this.list = [];
                if (this.isDetailed) {
                    this.tableOption.column = this.detailedColumn;
                } else {
                    this.tableOption.column = this.billColumn;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for (let i in data.records) {
                        if(data.records[i].mainDTO){
                            data.records[i].customerCode = data.records[i].mainDTO.customerCode;
                            data.records[i].customerName = data.records[i].mainDTO.customerName;
                            data.records[i].storageStatus = data.records[i].mainDTO.storageStatus;
                            data.records[i].billStatus = data.records[i].mainDTO.billStatus;
                            data.records[i].salerName = data.records[i].mainDTO.salerName;
                            data.records[i].salerCode = data.records[i].mainDTO.salerCode;
                            data.records[i].receiptStatus = data.records[i].mainDTO.receiptStatus;
                            data.records[i].purchaserName = data.records[i].mainDTO.purchaserName;
                            data.records[i].purchaserCode = data.records[i].mainDTO.purchaserCode;
                            data.records[i].supplierCode = data.records[i].mainDTO.supplierCode;
                            data.records[i].supplierName = data.records[i].mainDTO.supplierName;
                            data.records[i].warehouseName = data.records[i].mainDTO.warehouseName;
                            data.records[i].billAmount = data.records[i].mainDTO.billAmount;
                            data.records[i].taxBillAmount = data.records[i].mainDTO.taxBillAmount;
                        }
                    }
                    this.list = data.records;
                    this.loading = false;
                    this.searchDisable = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
            },
            handleClose() {
                this.$emit('handleClose');
            },
            handleSubmit() {
                if (this.isSingle) {
                    if (this.selectionList.length > 1) {
                        this.vueMessage('warning', '只能选择一条数据');
                        return;
                    }
                }else{
                    if(this.associatedName == 'purchaseStockIn'){
                        for (let i in this.selectionList) {
                            if (this.selectionList[0].mainDTO.billNo != this.selectionList[i].mainDTO.billNo) {
                                this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
                                return;
                            }
                        }
                    }
                }
                this.$emit('handleSubmit', this.selectionList);
            },
            //排序
            handleSortChange(obj) {
                let defaultSort = {};
                if (obj.order == 'ascending') {
                    defaultSort.ascs = this.convertToUnderline(obj.prop);
                } else if (obj.order = 'descending') {
                    defaultSort.descs = this.convertToUnderline(obj.prop);
                }
                this.defaultSort = defaultSort;
                this.getList(this.page);
            },
            //行点击事件
            handleRowClick(row, event, column) {
                this.$refs.crud.toggleSelection([row]);
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.onLoad(this.page, this.query);
                    this.isShow = true;
                });
            },
        }
    };
</script>

<style>
</style>
