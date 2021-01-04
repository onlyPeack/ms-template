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
                           :summary-method="getSummaries"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                </avue-crud>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {summary as selectPage} from '@/api/erp/wms/stock_query/stock-change-records';

    export default {
        name: "sales_detail_list",
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
                    index: true,
                    indexLabel:'序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "beginningPeriod",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "zzcxStockIn",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "purchaseStockIn",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "allocateStockIn",
                            type: "sum",
                            len: 0
                        }, {
                            name: "inventoryProfitStockIn",
                            type: "sum",
                            len: 0
                        }, {
                            name: "salesStockReturn",
                            type: "sum",
                            len: 0
                        }, {
                            name: "otherStockIn",
                            type: "sum",
                            len: 0
                        }, {
                            name: "totalStockIn",
                            type: "sum",
                            len: 0
                        }, {
                            name: "salesStockOut",
                            type: "sum",
                            len: 0
                        }, {
                            name: "allocateStockOut",
                            type: "sum",
                            len: 0
                        }, {
                            name: "inventoryLossesStockOut",
                            type: "sum",
                            len: 0
                        }, {
                            name: "purchaseStockReturn",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "otherStockOut",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "zzcxStockOut",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "totalStockOut",
                            type: "sum",
                            len: 0
                        }, {
                            name: "endPeriod",
                            type: "sum",
                            len: 0
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
                        label: "商品名称",
                        prop: "skuName",
                        search: true,
                        width: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        search: true,
                        width: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        search: true,
                        width: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 60,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "仓库",
                        prop: "warehouseName",
                        width: 100,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },

                    {
                        label: "采购入库",
                        prop: "purchaseStockIn",
                        width: 80,
                        overHidden:true,
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
                                "采购入库"
                            );
                        },
                    },
                    {
                        label: "销售退货",
                        prop: "salesStockReturn",
                        width: 80,
                        overHidden:true,
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
                                "销售退货"
                            );
                        },
                    },
                    {
                        label: "调拨入库",
                        prop: "allocateStockIn",
                        width: 80,
                        overHidden:true,
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
                                "调拨入库"
                            );
                        },
                    },
                    {
                        label: "盘盈入库",
                        prop: "inventoryProfitStockIn",
                        width: 80,
                        overHidden:true,
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
                                "盘盈入库"
                            );
                        },
                    },
                    {
                        label: "组装入库",
                        prop: "zzcxStockIn",
                        width: 80,
                        overHidden:true,
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
                                "组装入库"
                            );
                        },
                    },
                    {
                        label: "其它入库",
                        prop: "otherStockIn",
                        width: 80,
                        overHidden:true,
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
                                "其它入库"
                            );
                        },
                    },
                    {
                        label: "入库合计",
                        prop: "totalStockIn",
                        width: 80,
                        overHidden:true,
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
                                "入库合计"
                            );
                        },
                    },
                    {
                        label: "销售出库",
                        prop: "salesStockOut",
                        width: 80,
                        overHidden:true,
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
                                "销售出库"
                            );
                        },
                    },
                    {
                        label: "采购退货",
                        prop: "purchaseStockReturn",
                        width: 80,
                        overHidden:true,
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
                                "采购退货"
                            );
                        },
                    },
                    {
                        label: "调拨出库",
                        prop: "allocateStockOut",
                        width: 80,
                        overHidden:true,
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
                                "调拨出库"
                            );
                        },
                    },
                    {
                        label: "盘亏出库",
                        prop: "inventoryLossesStockOut",
                        width: 80,
                        overHidden:true,
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
                                "盘亏出库"
                            );
                        },
                    },
                    {
                        label: "组装出库",
                        prop: "zzcxStockOut",
                        width: 80,
                        overHidden:true,
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
                                "组装出库"
                            );
                        },
                    },
                    {
                        label: "其他出库",
                        prop: "otherStockOut",
                        width: 80,
                        overHidden:true,
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
                                "其他出库"
                            );
                        },
                    },
                    {
                        label: "出库合计",
                        prop: "totalStockOut",
                        width: 80,
                        overHidden:true,
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
                                "出库合计"
                            );
                        },
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
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
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
