<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
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
                           :summary-method="getSummaries"
                           :cell-style="handleCellStyle">
                    <template slot="opt" slot-scope="scope">
                        <el-button size="mini" @click="handleRowDbsClick(scope.row)">明细</el-button>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="dialogSelectVisible" width="60%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="明细" append-to-body class="public-dialog">
            <avue-crud ref="selectCrud" :data="bomList" :option="selectOption" :summary-method="getSummariess">
            </avue-crud>
        </el-dialog>
    </list-container>
</template>

<script>
    import {orderTrack as selectPage, orderItemTracks} from '@/api/erp/sales/bill/salesOrder';

    export default {
        name: "sales_order_tail",
        data() {
            return {
                dialogShow: false,
                dialogSelectVisible: false,
                isShow: true,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                selectOption: {
                    height: '350',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: true,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    menu: false,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "taxAmount",
                            type: "sum"
                        },
                        {
                            name: "taxAmount",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "stockInSaleAmount",
                            type: "sum"
                        },
                        {
                            name: "stockReturnQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "stockReturnAmount",
                            type: "sum"
                        },
                        {
                            name: "purchaseInvoiceQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "invoiceBillAmount",
                            type: "sum"
                        }
                    ],
                    column: [
                        {
                            label: "id",
                            prop: "id",
                            sortable: true,
                            hide: true
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            minWidth: 140,
                            align: 'left',
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 140,
                            align: 'left',
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            minWidth: 160,
                            align: 'left',
                        },
                        {
                            label: "品牌名称",
                            prop: "brandName",
                            minWidth: 120,
                            align: 'left',
                        },
                        // {
                        //     label: "系列名称",
                        //     prop: "seriesName",
                        //     minWidth: 120,
                        //     align: 'left',
                        // },
                        {
                            label: "单位",
                            prop: "unit",
                            minWidth: 100,
                            align: 'right',
                        },
                        {
                            label: "订单数量",
                            prop: "qty",
                            width:  80,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "订单数量"
                                );
                            },
                        },
                        {
                            label: "已锁定数量",
                            prop: "lockedQty",
                            width:  100,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "已锁定数量"
                                );
                            },
                        },
                        {
                            label: "订单金额",
                            prop: "taxAmount",
                            width: 100,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "订单金额"
                                );
                            },
                        },
                        {
                            label: "采购申请数量",
                            prop: "applyQty",
                            width:  100,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "采购申请数量"
                                );
                            },
                        },
                        // {
                        //     label: "在途数量",
                        //     prop: "orderQty",
                        //     width:  80,
                        //     overHidden:true,
                        //     search: false,
                        //     align: 'right',
                        //     textColor: "#ff0000",
                        //     renderHeader: h => {
                        //         return h(
                        //             "span",
                        //             {
                        //                 style: {
                        //                     color: "#ff0000"
                        //                 }
                        //             },
                        //             "在途数量"
                        //         );
                        //     },
                        // },
                        {
                            label: "出库数量",
                            prop: "stockOutSaleQty",
                            width: 80,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "出库数量"
                                );
                            },
                        },
                        {
                            label: "出库金额",
                            prop: "stockInSaleAmount",
                            width: 100,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "出库金额"
                                );
                            },
                        },
                        {
                            label: "退货数量",
                            prop: "stockReturnQty",
                            width: 80,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
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
                            },
                        },
                        {
                            label: "退货金额",
                            prop: "stockReturnAmount",
                            width: 80,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "退货金额"
                                );
                            },
                        },
                        {
                            label: "已开票数量",
                            prop: "purchaseInvoiceQty",
                            width: 100,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "已开票数量"
                                );
                            },
                        },
                        {
                            label: "已开票金额",
                            prop: "invoiceBillAmount",
                            width: 100,
                            overHidden:true,
                            search: false,
                            align: 'right',
                            textColor: "#ff0000",
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "已开票金额"
                                );
                            },
                        },
                    ]
                },
                bomList: [],
                tableOption: {
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: true,
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "allBillQuantity",
                            type: "sum",
                            len: 0
                        }, {
                            name: "allBillAmount",
                            type: "sum"
                        }, {
                            name: "allStockOutQuantity",
                            type: "sum",
                            len: 0
                        }, {
                            name: "allStockOutQuantity",
                            type: "sum"
                        }, {
                            name: "allStockOutAmount",
                            type: "sum"
                        }, {
                            name: "shouldPurchaseInvoiceQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "invoiceBillAmount",
                            type: "sum"
                        },
                        {
                            name: "receivableAmount",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: '操作',
                        prop: 'opt',
                        width: 100,
                        align: 'center',
                        slot: true
                    },
                    {
                        label: "单据编号",
                        prop: "billNo",
                        width: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "客户编号",
                        prop: "customerCode",
                        width: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        width: 170,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "销售员编号",
                        prop: "salerCode",
                        width: 90,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "销售员",
                        prop: "salerName",
                        width: 70,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "销售员部门",
                        prop: "departName",
                        width: 190,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "订单数量",
                        prop: "allBillQuantity",
                        width:  80,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "订单数量"
                            );
                        },
                    },
                    {
                        label: "已锁定数量",
                        prop: "allLockedQty",
                        width:  100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "已锁定数量"
                            );
                        },
                    },
                    {
                        label: "订单金额",
                        prop: "allBillAmount",
                        width: 100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "订单金额"
                            );
                        },
                    },
                    {
                        label: "采购申请数量",
                        prop: "allApplyQty",
                        width:  100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "采购申请数量"
                            );
                        },
                    },
                    // {
                    //     label: "在途数量",
                    //     prop: "allOrderQty",
                    //     width:  80,
                    //     overHidden:true,
                    //     search: false,
                    //     align: 'right',
                    //     textColor: "#ff0000",
                    //     renderHeader: h => {
                    //         return h(
                    //             "span",
                    //             {
                    //                 style: {
                    //                     color: "#ff0000"
                    //                 }
                    //             },
                    //             "在途数量"
                    //         );
                    //     },
                    // },
                    {
                        label: "出库数量",
                        prop: "allStockOutQuantity",
                        width: 80,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "出库数量"
                            );
                        },
                    },
                    {
                        label: "出库金额",
                        prop: "allStockOutAmount",
                        width: 100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "出库金额"
                            );
                        },
                    },
                    {
                        label: "退货数量",
                        prop: "allStockReturnQty",
                        width: 80,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
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
                        },
                    },
                    {
                        label: "退货金额",
                        prop: "allStockReturnAmount",
                        width: 80,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "退货金额"
                            );
                        },
                    },
                    {
                        label: "收款金额",
                        prop: "receivableAmount",
                        width: 100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "收款金额"
                            );
                        },
                    },
                    {
                        label: "已开票数量",
                        prop: "shouldPurchaseInvoiceQty",
                        width: 100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "已开票数量"
                            );
                        },
                    },
                    {
                        label: "已开票金额",
                        prop: "invoiceBillAmount",
                        width: 100,
                        overHidden:true,
                        search: false,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "已开票金额"
                            );
                        },
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        width: 130,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'center',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        overHidden:true,
                        minWidth: 120,
                        search: false,
                        align: 'center',
                    },
                ],
            }
        },
        props: ['timeStamp','id'],
        computed: {
            ids() {
                let ids = [];
                this.selectedRows.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getSummariess(param) {
                return this.getSummariesMethod(param, this.selectOption.sumColumnList);
            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
            handleSelectClose() {
                this.dialogSelectVisible = false;
            },
            //获取数据
            getList(page, params = {}) {

                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                if(!this.dialogShow && this.$route.query.id!=undefined){
                    queryObj.billNo = this.$route.query.id;
                }
                let select;
                select = selectPage;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                if (queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0) {
                    queryObj.startBillDate = queryObj.crtTime[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.crtTime[1] + ' 23:59:59';
                    delete queryObj.crtTime;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.list = data.records;
                    this.loading = false;
                    this.searchDisable = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
                    this.searchDisable = false;
                });
            },
            //刷新表格
            refreshChange() {
                this.getList(this.page, this.listQuery);
            },
            //当前页改变时
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList(this.page, this.listQuery);
            },
            //页面显示条数改变时
            handleSizeChange(val) {
                this.page.currentPage = 1;
                this.page.pageSize = val;
                this.getList(this.page, this.listQuery)
            },
            //多选框状态改变时
            handleSelectionChange(selection) {
                if (selection.length > 0) {
                    this.controlButtonShow(selection[selection.length - 1], this);
                }
                this.selectedRows = selection;
            },
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
            },
            //搜索
            handleSearchChange(params) {
                if (this.searchDisable) {
                    return;
                }
                this.searchDisable = true;
                this.listQuery = params;
                this.page.currentPage = 1;
                this.getList(this.page, params);
            },
            //清空
            handleSearchReset() {
                this.dialogShow = true;
                this.listQuery = {};
                this.getList(this.page);
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
            //列样式
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },
            //行点击事件
            handleRowClick(row, event, column) {
                this.controlButtonShow(row, this);
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbsClick(row) {
                this.dialogSelectVisible = true;
                orderItemTracks(row.id).then(res => {
                    this.bomList = res.data.data.records;
                })
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
