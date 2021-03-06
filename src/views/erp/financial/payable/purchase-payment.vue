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
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    objectKey="FKD"
                                    :objectType="isDetailed ? 1 : 0"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <!--<template slot="menuRight">-->
                        <!--<el-switch v-model="isDetailed" active-text="详情" inactive-text="单据" class="el-switch-select"-->
                                   <!--@change="handleSwitchChange"></el-switch>-->
                    <!--</template>-->
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {selectPage, selectPageByItem, batchDelBill} from "@/api/erp/purchase/bill/purchasePayment";
    import {getObj as getSetting} from "@/api/erp/config/index";

    export default {
        name: "purchase-payment",
        props: ['timeStamp'],
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
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel:'序号',
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
                            name: "applyAmount",
                            type: "sum"
                        },
                        {
                            name: "thisPaymentAmount",
                            type: "sum"
                        },
                        {
                            name: "sumOfAdvance",
                            type: "sum"
                        },
                        {
                            name: "payAmount",
                            type: "sum"
                        },
                    ],
                    column: []
                },
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "单据编号",
                        prop: "billNo",
                        width: 140,
                        overHidden:true,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        width: 80,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        searchFilterable: true
                    },
                    {
                        label: "关联单据",
                        prop: "sourceBillNo",
                        width: 140,
                        overHidden:true,
                        sortable: true,
                        search: true,
                        // fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "sourceBillDate",
                        width: 100,
                        overHidden:true,
                        sortable: true,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "应付金额",
                        prop: "applyAmount",
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
                                "应付金额"
                            );
                        },
                    },
                    {
                        label: "已付金额",
                        prop: "paymentAmount",
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
                                "已付金额"
                            );
                        },
                    },
                    {
                        label: "本次付款",
                        prop: "thisPaymentAmount",
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
                                "本次付款"
                            );
                        },
                    },
                ],
                billColumn: [
                    {
                        label: "单据编号",
                        prop: "billNo",
                        width: 140,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        searchLabelWidth:100,
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        width: 180,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        searchFilterable: true
                    },
                    {
                        label: "供应商",
                        prop: "supplierName",
                        width: 190,
                        overHidden:true,
                        search: true,
                        searchLabelWidth:100,
                        align: 'left',
                    },
                    {
                        label: "采购员",
                        prop: "crtUserName",
                        width: 80,
                        overHidden:true,
                        search: true,
                        searchLabelWidth:100,
                        align: 'left',
                    },
                    {
                        label: "采购部门",
                        prop: "departName",
                        width: 190,
                        overHidden:true,
                        search: true,
                        searchLabelWidth:100,
                        align: 'left',
                    },
                    {
                        label: "付款账户",
                        prop: "payAccount",
                        width: 80,
                        overHidden:true,
                        search: true,
                        searchLabelWidth:100,
                        align: 'left',
                    },
                    {
                        label: "开户银行",
                        prop: "bankName",
                        width: 180,
                        align: 'left',
                    },
                    {
                        label: "银行账户",
                        prop: "bankAccount",
                        width:80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "付(退)款金额",
                        prop: "payAmount",
                        width: 120,
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
                                "付(退)款金额"
                            );
                        },
                    },
                    {
                        label: "付(退)款形式",
                        prop: "paymentForm",
                        width: 120,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: '直接付款'
                            },
                            {
                                value: '1',
                                label: '预付款'
                            },
                            {
                                value: '2',
                                label: '直接退款'
                            },
                            {
                                value: '3',
                                label: '预退款'
                            }
                        ],
                    },
                    {
                        label: "付(退)款方式",
                        prop: "paymentMethod",
                        width: 120,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        search: true,
                        searchLabelWidth:100,
                        dicData: [
                            {
                                value: '0',
                                label: '按单付款'
                            },
                            {
                                value: '1',
                                label: '普通付款'
                            },
                            {
                                value: '2',
                                label: '按单退款'
                            },
                            {
                                value: '3',
                                label: '普通退款'
                            }
                        ],
                        searchFilterable: true
                    },
                    {
                        label: "结算方式",
                        prop: "paymentsMeans",
                        width: 120,
                        overHidden:true,
                        align: 'left',
                        // search: true,
                        dicMethod: 'get',
                        dicUrl: '/api/manager/payments-means/pageAll',
                        props: {
                            value: 'value',
                            label: 'label'
                        },
                    },
                    // {
                    //     label: "冲抵预付金额",
                    //     prop: "sumOfAdvance",
                    //     width: 120,
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
                    //             "冲抵预付金额"
                    //         );
                    //     },
                    // },
                    {
                        label: "单据日期",
                        prop: "billDate",
                        width: 100,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        searchLabelWidth:100,
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
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
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
            this.tableOption.column = this.billColumn;
            this.getConfigList();
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
                this.setList(this, 'FKD');
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
                this.handleBillAdd(this,{path: '/purchase-payment-form', name: '付款单制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.tableOption.column = this.detailedColumn;
                    } else {
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
                select(queryObj).then(res => {
                    const data = res.data.data;
                    for(let i in data.records){
                        data.records[i].paymentsMeans = parseInt(data.records[i].paymentsMeans);
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
                    path: '/purchase-payment-form',
                    name: '付款单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'purchase-payment-form'
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
                    path: '/purchase-payment-form',
                    name: '付款单制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'purchase-payment-form'
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
        }
    }
</script>

<style scoped lang="scss">

</style>
