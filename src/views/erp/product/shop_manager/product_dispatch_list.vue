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
                           :summary-method="getSummaries"
                           @search-reset="handleSearchReset"
                           @sort-change="handleSortChange"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    objectKey="PGD"
                                    :objectType="isDetailed ? 1 : 0"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <template slot="menuRight">
                        <el-checkbox v-model="isDetailed" @change="handleSwitchChange" style="margin-right: 20px;">显示详情</el-checkbox>
                    </template>
                    <template slot-scope="scope" slot="opt">
                        <el-button size="small" @click="changeBtn(scope.row)">
                            变更
                        </el-button>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {selectPage, selectPageByItem, batchDelBill} from "@/api/erp/product/shop_manager/product_dispatch_list";

    export default {
        name: "product_dispatch_list",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        props: ['id','timeStamp'],
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
                    addBtn: false,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                    printBtn: true,
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
                    index: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "releaseQty",
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
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 80,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "工艺",
                        prop: "craft",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "订单量",
                        prop: "qty",
                        minWidth: 180,
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
                                "订单量"
                            );
                        },
                    },
                    {
                        label: "本次下达量",
                        prop: "releaseQty",
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
                                "本次下达量"
                            );
                        },
                    },
                    {
                        label: "开工日期",
                        prop: "startTime",
                        minWidth: 120,
                        search: true,
                        sortable: true,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "date",
                    },
                    {
                        label: "预计完工日期",
                        prop: "endTime",
                        minWidth: 120,
                        search: true,
                        sortable: true,
                        align: 'left',
                        searchLabelWidth: 120,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "date",
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        minWidth: 100,
                        align: 'center',
                        slot: true
                    }
                ],
                detailedColumn: [
                    {
                        label: "工序名称",
                        prop: "workOn",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "工序要求",
                        prop: "demand",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "操作员",
                        prop: "operatorName",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "计划工作时间",
                        prop: "planDate",
                        minWidth: 180,
                        searchLabelWidth: 120,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        search: true,
                    },
                    {
                        label: "预计工时",
                        prop: "estimateHour",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 100,
                        align: 'center',
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
                this.setList(this, 'PGD');
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
            changeBtn(val){
                console.log(1)
                this.$router.push({
                    path: '/product_dispatch_list_change_form',
                    name: '派工单变更制单',
                    query: {
                        id: val.id,
                        type: 'edit'
                    },
                    meta: {
                        i18n: 'product_dispatch_list_change_form'
                    }
                });
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
                this.handleBillAdd(this,{path: '/product_dispatch_list_form', name: '派工单制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.permission.printBtn = false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.printBtn = true;
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
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,id:this.id});

                let select;
                if (this.isDetailed) {
                    if (queryObj.planDate && queryObj.planDate !== undefined && queryObj.planDate.length > 0) {
                        queryObj.startTime = queryObj.planDate[0] + ' 00:00:00';
                        queryObj.endTime = queryObj.planDate[1] + ' 23:59:59';
                        delete queryObj.planDate;
                    }
                    select = selectPageByItem;
                } else {
                    select = selectPage;
                }
                queryObj = JSON.parse(JSON.stringify(queryObj));
                select(queryObj).then(res => {

                    const data = res.data.data;
                    if (this.isDetailed) {
                        for (let i in data.records) {
                            let sum = [];
                            for (let j in data.records[i].skills) {
                                sum.push(data.records[i].skills[j].skillName)
                            }
                            data.records[i].operatorName = sum.toString();
                        }
                    }
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
                const id = this.isDetailed ? row.masterId : row.id;
                this.$router.push({
                    path: '/product_dispatch_list_form',
                    name: '派工单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'product_dispatch_list_form'
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
                    path: '/product_dispatch_list_form',
                    name: '派工单制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'product_dispatch_list_form'
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
                this.$router.push({
                    path: '/product_dispatch_list_form',
                    name: '派工单制单',
                    query: {
                        id: this.selectedRows[0].id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'product_dispatch_list_form'
                    }
                });
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
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
        },
    }
</script>

<style scoped lang="scss">

</style>
