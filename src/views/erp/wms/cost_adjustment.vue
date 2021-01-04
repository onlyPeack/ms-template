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
                           :summary-method="getSummaries"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    objectKey="CBTZD"
                                    :objectType="isDetailed ? 1 : 0"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handleDelete="handleRowDelete"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <template slot="menuRight">
                        <el-checkbox v-model="isDetailed" @change="handleSwitchChange" style="margin-right: 20px;">显示详情</el-checkbox>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {batchDelBill, selectPage, selectPageByItem} from "@/api/erp/wms/bill/costAdjust";

    export default {
        props: ['timeStamp'],
        name: "cost_adjustment",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
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
                    selectionWidth: 50,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮
                    searchShow: false,
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "costPrice",
                            type: "sum"
                        }, {
                            name: "adjustPrice",
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
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true,
                        sortable: true
                    },
                    {
                        label: "仓库ID",
                        prop: "warehouseId",
                        hide: true,
                        align: 'left',
                        sortable: true
                    },
                    {
                        label: "调整仓库",
                        prop: "warehouseName",
                        minWidth: 150,
                        align: 'left',
                        search: true,
                        sortable: true
                    },
                    {
                        label: "调整人",
                        prop: "operatorId",
                        hide: true,
                        align: 'left',
                        sortable: true
                    },
                    {
                        label: "调整人姓名",
                        prop: "operatorName",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        sortable: true
                    },
                    // {
                    //     label: "调整人编号",
                    //     prop: "operatorCode",
                    //     minWidth: 120,
                    //     align: 'left',
                    //     sortable: true
                    // },
                    {
                        label: "调整部门",
                        prop: "departName",
                        minWidth: 190,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        sortable: true
                    },
                    {
                        label: "备注",
                        prop: "note",
                        align: 'left',
                        minWidth: 120,
                        overHidden:true,
                        sortable: true
                    },
                    {
                        label: "单据日期",
                        prop: "billDate",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'left',
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
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 70,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true,
                    },
                    {
                        label: "调整仓库",
                        prop: "warehouseName",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        sortable: true
                    },
                    {
                        label: "批次号",
                        prop: "batchNo",
                        minWidth: 120,
                        overHidden:true,
                        search: true,
                        sortable: true
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 120,
                        overHidden:true,
                        search: true,
                        align: 'left',
                        sortable: true
                    },
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                        sortable: true
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        sortable: true
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        sortable: true
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 50,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "库存成本",
                        prop: "costPrice",
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
                                "库存成本"
                            );
                        },
                    },
                    {
                        label: "调整成本",
                        prop: "adjustPrice",
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
                                "调整成本"
                            );
                        },
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        width: 130,
                        overHidden:true,
                        search: true,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                ]
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
            this.getConfigList();
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
            getConfigList() {
                this.setList(this, 'CBTZD');
            },
            handleSettingSubmit(obj) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption = obj;
                    if (this.isDetailed) {
                        this.detailedColumn = obj.column;
                    } else {
                        this.billColumn = obj.column;
                    }
                    this.isShow = true;
                })
            },
            handleAdd() {
                this.handleBillAdd(this,{path: '/cost_adjustment_form', name: '成本调整单制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.tableOption.showSummary = true;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.tableOption.showSummary = false;
                        this.tableOption.column = this.billColumn;
                    }

                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                if (this.isDetailed) {
                    select = selectPageByItem;
                } else {
                    select = selectPage;
                }
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
                    if (this.isDetailed) {
                        for (let i in data.records) {
                            data.records[i].billNo = data.records[i].mainDTO.billNo;
                            data.records[i].billStatus = data.records[i].mainDTO.billStatus;
                            data.records[i].warehouseName = data.records[i].mainDTO.warehouseName;
                        }
                    }
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
                const id = this.isDetailed ? row.masterId : row.id;
                this.$router.push({
                    path: '/cost_adjustment_form',
                    name: '成本调整单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'cost_adjustment_form'
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

                if (type != 'view') {
                    if (this.selectedRows[0].billStatus == 2 || this.selectedRows[0].billStatus == 3 || this.selectedRows[0].billStatus == 4) {
                        this.vueMessage('warning', '该状态不可编辑');
                        return false;
                    }
                }

                const id = this.isDetailed ? this.selectedRows[0].masterId : this.selectedRows[0].id;
                this.$router.push({
                    path: '/cost_adjustment_form',
                    name: '成本调整单制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'cost_adjustment_form'
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
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    //this.vueNotification('success', '提示', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    if (row.billStatus == 2 || row.billStatus == 3 || row.billStatus == 4) {
                        this.vueMessage('warning', '选择包含不能删除的单据!');
                        flag = false;
                    }
                    ids.push(row.id)
                });
                if (flag) {
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        batchDelBill(ids).then((res) => {
                            if (res.data.code == 200 || res.data.code == '2000') {
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
                }
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
