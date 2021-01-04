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

    export default {
        name: "buy_record",
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
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "beginningPeriod",
                            type: "sum",
                            len: 0
                        },
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
                        label: "订单编号",
                        prop: "billNo",
                        search: true,
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "订单类型",
                        prop: "itemNo",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        type: 'select',
                        dicData:[
                            {
                                value: 0,
                                label:'已完成'
                            },
                            {
                                value: 1,
                                label:'待付款'
                            },
                            {
                                value: 2,
                                label:'已取消'
                            }
                        ],
                    },
                    {
                        label: "金额",
                        prop: "specifications",
                        minWidth: 120,
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
                                "金额"
                            );
                        },
                    },
                    {
                        label: "支付方式",
                        prop: "unit",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "订单状态",
                        prop: "warehouseName",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData:[
                            {
                                value: 0,
                                label:'已完成'
                            },
                            {
                                value: 1,
                                label:'待付款'
                            },
                            {
                                value: 2,
                                label:'已取消'
                            }
                        ],
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "下单时间",
                        prop: "billData",
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "支付时间",
                        prop: "crtTime",
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',

                    },
                    {
                        label: "收货人",
                        prop: "endPeriod",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
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
                this.loading = false;
                this.searchDisable = false;
                // let select;
                // select = selectPage;
                // select(queryObj).then(res => {
                //     const data = res.data.data;
                //     this.page.total = data.total;
                //     this.list = data.records;
                //     this.loading = false;
                //     this.searchDisable = false;
                //     this.handleSelectionClear();
                // }).catch(() => {
                //     this.loading = false;
                //     this.searchDisable = false;
                // });
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
