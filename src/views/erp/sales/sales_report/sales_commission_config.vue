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
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot-scope="scope" slot="goodsItems">
                        <div @click="listBtn(scope.row,'goodsItems')">
                            {{scope.row.goodsItems.toString()}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="userName">
                        <div @click="listBtn(scope.row,'userItems')">
                            {{scope.row.userItems.toString()}}
                        </div>
                    </template>
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {page as pages, delObj,} from '@/api/erp/sales/bill/salesCommissionPlan';

    export default {
        name: "sales_commission_config",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
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
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    indexLabel: '序号',
                    index: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: []
                },
                billColumn: [
                    {
                        label: "方案编号",
                        prop: "planNo",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "方案名称",
                        prop: "planName",
                        minWidth: 160,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "提成类型",
                        prop: "commissionType",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        type: 'select',
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
                        label: "起始日期",
                        prop: "startTime",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期'
                    },
                    {
                        label: "到期日期",
                        prop: "endTime",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "适用商品",
                        prop: "goodsItems",
                        minWidth: 160,
                        overHidden:true,
                        slot: true,
                        align: 'left',
                    },
                    {
                        label: "适用业务员",
                        prop: "userName",
                        minWidth: 160,
                        overHidden:true,
                        slot: true,
                        search: true,
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
            listBtn(item, type) {

            },
            handleAdd() {
                this.handleBillAdd(this, {path: '/sales_commission_config_form', name: '提成方案设置制单'});
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = pages;
                if (queryObj.startTime && queryObj.startTime !== undefined && queryObj.startTime.length > 0) {
                    queryObj.startBillDate = queryObj.startTime[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.startTime[1] + ' 23:59:59';
                    delete queryObj.startTime;
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
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbClick(row) {
                const id = row.id;
                this.$router.push({
                    path: '/sales_commission_config_form',
                    name: '提成方案设置制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'sales_commission_config_form'
                    }
                });
            },
            //编辑
            handleEdit(type) {
                const text = type == 'view' ? '查看' : '编辑';
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要' + text + '的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能' + text + '一个条目');
                    return false;
                }
                const id = this.selectedRows[0].id;
                this.$router.push({
                    path: '/sales_commission_config_form',
                    name: '提成方案设置制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'sales_commission_config_form'
                    }
                });
            },
            //打印
            handlePrint() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一条数据');
                    return false;
                }
            },
            //导出
            handleExport() {
                this.$refs.crud.rowExcel();
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1 || this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一条数据');
                    return false;
                }
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(this.selectedRows[0].id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.getList(this.page);

                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    }, error => {
                    });
                });
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
