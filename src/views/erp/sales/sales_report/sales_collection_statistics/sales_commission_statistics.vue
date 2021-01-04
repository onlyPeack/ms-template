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
                           :cell-style="handleCellStyle">
                    <template slot="opt" slot-scope="scope">
                        <el-button size="mini" @click="handleRowDbsClick(scope.row)">明细</el-button>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="dialogSelectVisible" v-if="dialogSelectVisible" width="60%" @close="handleDetailClose"
                   :close-on-click-modal="false" :before-close="handleDetailClose" title="明细" append-to-body
                   class="public-dialog">
            <avue-crud ref="detailCrud" :page="detailPage" :data="detailList" :option="detailOption"
                       :summary-method="getDetailSummaries" @size-change="handleDetailSizeChange"
                       @current-change="handleDetailCurrentChange" :table-loading="detailLoading">
            </avue-crud>
        </el-dialog>
    </div>
</template>

<script>
    import {commissionStatistics as selectPage, getItemsByUserId} from '@/api/erp/sales/bill/salesCommissionPlan';

    export default {
        name: "sales_commission_statistics",
        data() {
            return {
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
                detailLoading: false,
                userId: undefined,
                detailPage: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                detailOption: {
                    height: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
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
                            name: "amount",
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
                            label: "方案编号",
                            prop: "planNo",
                            minWidth: 140
                        },
                        {
                            label: "方案名称",
                            prop: "planName",
                            minWidth: 140
                        },
                        {
                            label: "提成类型",
                            prop: "commissionType",
                            minWidth: 120,
                            align: 'center',
                            dicData: [
                                {
                                    value: '0',
                                    label: '按金额'
                                },
                                {
                                    value: '1',
                                    label: '按毛利'
                                },
                                {
                                    value: '2',
                                    label: '按数量'
                                },
                                {
                                    value: '3',
                                    label: '按回款'
                                },
                                {
                                    value: '4',
                                    label: '按金额+毛利'
                                },
                            ]
                        },
                        {
                            label: "单据日期",
                            prop: "crtTime",
                            minWidth: 160,
                            align: 'center'
                        },
                        {
                            label: "单据编号",
                            prop: "billNo",
                            minWidth: 160
                        },
                        {
                            label: "单据类型",
                            prop: "objectName",
                            minWidth: 100,
                            align: 'center'
                        },
                        {
                            label: "客户",
                            prop: "customerName",
                            minWidth: 140
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            minWidth: 120,
                            align: 'right'
                        }
                    ]
                },
                detailList: [],
                tableOption: {
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
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
                            name: "salesTotalAmount",
                            type: "sum",
                        }, {
                            name: "returnAmount",
                            type: "sum"
                        }, {
                            name: "receiveTotalAmount",
                            type: "sum"
                        }, {
                            name: "salesAmount",
                            type: "sum"
                        }, {
                            name: "salesProfit",
                            type: "sum"
                        },
                        {
                            name: "profitCommission",
                            type: "sum"
                        },
                        {
                            name: "salesQty",
                            type: "sum"
                        },
                        {
                            name: "qtyCommission",
                            type: "sum"
                        },
                        {
                            name: "receiveAmount",
                            type: "sum"
                        },
                        {
                            name: "receiveCommission",
                            type: "sum"
                        },
                        {
                            name: "totalCommission",
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
                        minWidth: 160,
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "单据类型",
                        prop: "billType",
                        minWidth: 100,
                        align: 'center',
                        hide: true
                    },
                    {
                        label: "业务员名称",
                        prop: "userName",
                        minWidth: 120,
                        search: true
                    },
                    {
                        label: "部门",
                        prop: "departName",
                        minWidth: 120,
                        hide: true
                    },
                    {
                        label: "销售总额",
                        prop: "salesTotalAmount",
                        minWidth: 120,
                        align: 'right'
                    },
                    {
                        label: "退货总额",
                        prop: "returnAmount",
                        minWidth: 120,
                        align: 'right'
                    },
                    {
                        label: "回款总额",
                        prop: "receiveTotalAmount",
                        minWidth: 120,
                        align: 'right'
                    },
                    {
                        label: "按金额",
                        align: 'center',
                        children: [{
                            label: '销售金额',
                            prop: 'salesAmount',
                            minWidth: 120,
                            align: 'right'
                        }, {
                            label: '金额提成',
                            prop: 'amountCommission',
                            minWidth: 120,
                            align: 'right'
                        }]
                    },
                    {
                        label: "按毛利",
                        align: 'center',
                        children: [{
                            label: '销售毛利',
                            prop: 'salesProfit',
                            minWidth: 120,
                            align: 'right'
                        }, {
                            label: '毛利提成',
                            prop: 'profitCommission',
                            minWidth: 120,
                            align: 'right'
                        }]
                    },
                    {
                        label: "按金额+毛利",
                        align: 'center',
                        children: [{
                            label: '销售金额',
                            prop: 'salesAmount1',
                            minWidth: 120,
                            align: 'right'
                        },
                            {
                                label: '销售毛利',
                                prop: 'salesProfit1',
                                minWidth: 120,
                                align: 'right'
                            },
                            {
                                label: '提成',
                                prop: 'amountProfitCommission',
                                minWidth: 120,
                                align: 'right'
                            }]
                    },
                    {
                        label: "按数量",
                        align: 'center',
                        children: [{
                            label: '销售数量',
                            prop: 'salesQty',
                            minWidth: 120,
                            align: 'right'
                        }, {
                            label: '数量提成',
                            prop: 'qtyCommission',
                            minWidth: 120,
                            align: 'right'
                        }]
                    },
                    {
                        label: "按回款",
                        align: 'center',
                        children: [{
                            label: '销售回款',
                            prop: 'receiveAmount',
                            minWidth: 120,
                            align: 'right'
                        }, {
                            label: '回款提成',
                            prop: 'receiveCommission',
                            minWidth: 120,
                            align: 'right'
                        }]
                    },
                    {
                        label: "提成合计",
                        prop: "totalCommission",
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
                                "提成合计"
                            );
                        }
                    },
                    {
                        label: "统计时间段",
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
            //查看明细
            handleRowDbsClick(row) {
                this.userId = row.userId;
                this.detailPage.currentPage = 1;
                this.dialogSelectVisible = true;
                this.getItemsByUserId();
            },
            handleDetailClose() {
                this.dialogSelectVisible = false;
                this.userId = undefined;
            },
            //明细分页
            handleDetailCurrentChange(val) {
                this.detailPage.currentPage = val;
                this.getItemsByUserId();
            },
            handleDetailSizeChange(val) {
                this.detailPage.currentPage = 1;
                this.detailPage.pageSize = val;
                this.getItemsByUserId();
            },
            //汇总
            getDetailSummaries(param) {
                return this.getSummariesMethod(param, this.detailOption.sumColumnList);
            },
            getItemsByUserId() {
                this.detailLoading = true;
                getItemsByUserId({
                    page: this.detailPage.currentPage,
                    limit: this.detailPage.pageSize,
                    userId: this.userId
                }).then(res => {
                    this.detailLoading = false;
                    this.detailPage.total = res.data.data.total;
                    this.detailList = res.data.data.records;
                });
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
