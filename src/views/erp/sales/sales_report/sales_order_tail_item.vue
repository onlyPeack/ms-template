<template>
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
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                </avue-crud>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {orderTrack as selectPage} from '@/api/erp/sales/bill/salesOrder';
    export default {
        name: "sales_order_tail",
        data() {
            return {
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
                            name: "retailPrice",
                            type: "sum"
                        }, {
                            name: "costPrice",
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
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        align: 'center',
                    },
                    {
                        label: "单据日期",
                        prop: "billDate",
                        width: 180,
                        search: true,
                        sortable: true,
                        align: 'center',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "订单类型",
                        prop: "billType",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "销售员",
                        prop: "salerName",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "销售部门",
                        prop: "departName",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "订单数量",
                        prop: "allBillQuantity",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "订单金额",
                        prop: "taxBillAmount",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "出库状态",
                        prop: "storageStatus",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "出库数量",
                        prop: "allStockOutQuantity",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "出库金额",
                        prop: "allStockOutAmount",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "开票状态",
                        prop: "invoiceStatus",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "开票数量",
                        prop: "shouldPurchaseInvoiceQty",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "开票金额",
                        prop: "invoiceBillAmount",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        search: true,
                        align: 'center',
                    },
                ],
            }
        },
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
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPage;
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
            handleRowDbClick(row) {
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
