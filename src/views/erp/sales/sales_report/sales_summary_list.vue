<template>
    <div>
        <basic-container>
            <div class="avue-crud-container" v-if="isShow">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="按客户" name="customer">
                        <avue-crud ref="crud"
                                   v-if="isShow"
                                   :page="page"
                                   :data="list"
                                   :table-loading="loading"
                                   :option="tableOption"
                                   @refresh-change="refreshChange"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   @search-change="handleSearchChange"
                                   @search-reset="handleSearchReset"
                                   :summary-method="getSummaries"
                                   @sort-change="handleSortChange"
                                   :cell-style="handleCellStyle">
                        </avue-crud>
                    </el-tab-pane>
                    <el-tab-pane label="按部门" name="departId">
                        <avue-crud ref="crud"
                                   v-if="isShow"
                                   :page="page"
                                   :data="list"
                                   :table-loading="loading"
                                   :option="tableOption"
                                   @refresh-change="refreshChange"
                                   :summary-method="getSummaries"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   @search-change="handleSearchChange"
                                   @search-reset="handleSearchReset"
                                   @sort-change="handleSortChange"
                                   :cell-style="handleCellStyle">
                        </avue-crud>
                    </el-tab-pane>
                    <el-tab-pane label="按销售员" name="salerId">
                        <avue-crud ref="crud"
                                   v-if="isShow"
                                   :page="page"
                                   :data="list"
                                   :table-loading="loading"
                                   :option="tableOption"
                                   @refresh-change="refreshChange"
                                   :summary-method="getSummaries"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   @search-change="handleSearchChange"
                                   @search-reset="handleSearchReset"
                                   @sort-change="handleSortChange"
                                   :cell-style="handleCellStyle">
                        </avue-crud>
                    </el-tab-pane>
                    <el-tab-pane label="按分类" name="categoryId">
                        <avue-crud ref="crud"
                                   v-if="isShow"
                                   :page="page"
                                   :data="list"
                                   :table-loading="loading"
                                   :option="tableOption"
                                   @refresh-change="refreshChange"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   @search-change="handleSearchChange"
                                   @search-reset="handleSearchReset"
                                   :summary-method="getSummaries"
                                   @sort-change="handleSortChange"
                                   :cell-style="handleCellStyle">
                        </avue-crud>
                    </el-tab-pane>
                    <el-tab-pane label="按商品" name="skuNo">
                        <avue-crud ref="crud"
                                   v-if="isShow"
                                   :page="page"
                                   :data="list"
                                   :table-loading="loading"
                                   :option="tableOption"
                                   @refresh-change="refreshChange"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   @search-change="handleSearchChange"
                                   @search-reset="handleSearchReset"
                                   :summary-method="getSummaries"
                                   @sort-change="handleSortChange"
                                   :cell-style="handleCellStyle">
                        </avue-crud>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {selectPage} from '@/api/erp/sales/bill/salesSummary';
    import {listCatAndBrand} from '@/api/erp/goods/goods';

    export default {
        name: "sales_summary_list",
        data() {
            return {
                activeName: 'customer',
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
                            name: "stockOutPrice",
                            type: "sum"
                        }, {
                            name: "stockOutQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "stockOutAmount",
                            type: "sum"
                        }, {
                            name: "returnStockPrice",
                            type: "sum"
                        },{
                            name: "returnStockQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "returnStockAmount",
                            type: "sum"
                        },
                    ],
                    column: []
                },
                billOneColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        width: 120,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        width: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        width: 85,
                        overHidden:true,
                        search: true,
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
                        width: 50,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "出库单价",
                        prop: "stockOutPrice",
                        width: 100,
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
                                "出库单价"
                            );
                        }
                    },
                    {
                        label: "出库数量",
                        prop: "stockOutQty",
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
                                "出库数量"
                            );
                        }
                    },
                    {
                        label: "出库金额",
                        prop: "stockOutAmount",
                        width: 100,
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
                                "出库金额"
                            );
                        }
                    },
                    {
                        label: "退库单价",
                        prop: "returnStockPrice",
                        width: 100,
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
                                "退库单价"
                            );
                        }
                    },
                    {
                        label: "退库数量",
                        prop: "returnStockQty",
                        width: 70,
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
                                "退库数量"
                            );
                        }
                    },
                    {
                        label: "退库金额",
                        prop: "returnStockAmount",
                        minWidth: 100,
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
                                "退库金额"
                            );
                        }
                    },
                ],
                billTwoColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "分类",
                        prop: "categoryName",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },
                    // {
                    //     label: "单位",
                    //     prop: "unit",
                    //     minWidth: 100,
                    //     align: 'left',
                    // },
                    {
                        label: "出库单价",
                        prop: "stockOutPrice",
                        minWidth: 120,
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
                                "出库单价"
                            );
                        }
                    },
                    {
                        label: "出库数量",
                        prop: "stockOutQty",
                        minWidth: 160,
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
                        }
                    },
                    {
                        label: "出库金额",
                        prop: "stockOutAmount",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "退库单价",
                        prop: "returnStockPrice",
                        minWidth: 100,
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
                                "退库单价"
                            );
                        }
                    },
                    {
                        label: "退库数量",
                        prop: "returnStockQty",
                        minWidth: 100,
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
                                "退库数量"
                            );
                        }
                    },
                    {
                        label: "退库金额",
                        prop: "returnStockAmount",
                        minWidth: 100,
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
                                "退库金额"
                            );
                        }
                    },
                    {
                        label: "日期",
                        prop: "billDate",
                        width: 120,
                        search: true,
                        sortable: true,
                        align: 'center',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        hide: true
                    }
                ],
                billTreeColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "客户编号",
                        prop: "customerCode",
                        minWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "出库数量",
                        prop: "stockOutQty",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "出库金额",
                        prop: "stockOutAmount",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "退库数量",
                        prop: "returnStockQty",
                        minWidth: 100,
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
                                "退库数量"
                            );
                        }
                    },
                    {
                        label: "退库金额",
                        prop: "returnStockAmount",
                        minWidth: 100,
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
                                "退库金额"
                            );
                        }
                    },
                    {
                        label: "日期",
                        prop: "billDate",
                        width: 120,
                        search: true,
                        sortable: true,
                        align: 'center',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        hide: true
                    }
                ],
                billFourColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "部门",
                        prop: "departName",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "出库数量",
                        prop: "stockOutQty",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "出库金额",
                        prop: "stockOutAmount",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "退库数量",
                        prop: "returnStockQty",
                        minWidth: 100,
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
                                "退库数量"
                            );
                        }
                    },
                    {
                        label: "退库金额",
                        prop: "returnStockAmount",
                        minWidth: 100,
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
                                "退库金额"
                            );
                        }
                    },
                    {
                        label: "日期",
                        prop: "billDate",
                        width: 120,
                        search: true,
                        sortable: true,
                        align: 'center',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        hide: true
                    }
                ],
                billFreeColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "业务员",
                        prop: "salerName",
                        minWidth: 120,
                        search: true,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "出库数量",
                        prop: "stockOutQty",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "出库金额",
                        prop: "stockOutAmount",
                        minWidth: 100,
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
                        }
                    },
                    {
                        label: "退库数量",
                        prop: "returnStockQty",
                        minWidth: 100,
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
                                "退库数量"
                            );
                        }
                    },
                    {
                        label: "退库金额",
                        prop: "returnStockAmount",
                        minWidth: 100,
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
                                "退库金额"
                            );
                        }
                    },
                    {
                        label: "日期",
                        prop: "billDate",
                        width: 120,
                        search: true,
                        sortable: true,
                        align: 'center',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        hide: true
                    }
                ],
                categoryList: [],
                brandList: [],
            }
        },
        watch: {
            activeName(val) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption.column = [];
                    if (val == 'skuNo') {
                        this.tableOption.column = this.billOneColumn;
                    }
                    if (val == 'categoryId') {
                        this.tableOption.column = this.billTwoColumn;
                    }
                    if (val == 'customer') {
                        this.tableOption.column = this.billTreeColumn;
                    }
                    if (val == 'departId') {
                        this.tableOption.column = this.billFourColumn;
                    }
                    if (val == 'salerId') {
                        this.tableOption.column = this.billFreeColumn;
                    }
                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
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
            listCatAndBrand().then(response => {
                this.categoryList = response.data.data.categoryList;
                this.brandList = response.data.data.brandList;
            });
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.tableOption.column = this.billTreeColumn;
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
                let queryObj = Object.assign(params, this.listQuery, {
                    page: page.currentPage,
                    limit: page.pageSize,
                    activeName: this.activeName
                });
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPage;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
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
        }
    }
</script>

<style scoped lang="scss">

</style>
