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
                           @row-click="handleRowClick">
                </avue-crud>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {pages} from '@/api/admin/tenant/index';
    export default {
        name: "orderRecords",
        props:['id'],
        data() {
            return {
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
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
                    height: '150',
                    calcHeight: 150,
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
                    column: []
                },
                billColumn: [
                    {
                        label: "订单号",
                        prop: "billNo",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "订单类型",
                        prop: "orderType",
                        minWidth: 100,
                        type: 'select',
                        align: 'center',
                        dicData: [
                            {
                                value: 1,
                                label: '新购'
                            },
                            {
                                value: 2,
                                label: '续费'
                            },
                            {
                                value: 3,
                                label: '升级'
                            }
                            ,
                            {
                                value: 4,
                                label: '退货'
                            }
                        ],
                    },
                    {
                        label: "服务名称",
                        prop: "systemServiceName",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "状态",
                        prop: "orderStatus",
                        minWidth: 100,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: 0,
                                label: '待支付'
                            },
                            {
                                value: 1,
                                label: '已支付'
                            }
                        ],
                    },
                    {
                        label: "下单日期",
                        prop: "payTime",
                        minWidth: 160,
                    },
                    {
                        label: "订单金额",
                        prop: "totalAmount",
                        width: 100,
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
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
        },
        methods: {
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,tenantId:this.id});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = pages;
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
        }
    }
</script>

<style scoped lang="scss">

</style>
