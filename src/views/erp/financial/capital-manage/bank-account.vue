<template>
    <div>
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
                            <div class="bgItem">
                                <div class="bgItem_item">
                                    <div class="bgItem_item_left">
                                        <span>￥{{dataObj.amountIn}}</span>
                                        <div>收入</div>
                                    </div>
                                    <div>
                                        <img src="http://hejigy.com.cn/TIM%E5%9B%BE%E7%89%8720200422174812.png" style="width: 40px;height: 40px;"/>
                                    </div>
                                </div>
                                <div class="bgItem_item" style="background: rgb(255, 183, 82);">
                                    <div class="bgItem_item_left">
                                        <span>￥{{dataObj.amountOut}}</span>
                                        <div>支出</div>
                                    </div>
                                    <div>
                                        <img src="http://hejigy.com.cn/TIM%E5%9B%BE%E7%89%8720200422174840.png" style="width: 40px;height: 40px;"/>
                                    </div>
                                </div>
                                <div class="bgItem_item" style="background: rgb(135, 184, 127);">
                                    <div class="bgItem_item_left">
                                        <span>￥{{dataObj.afterAmount}}</span>
                                        <div>账户余额</div>
                                    </div>
                                    <div>
                                        <img src="http://hejigy.com.cn/TIM%E5%9B%BE%E7%89%8720200422174831.png" style="width: 40px;height: 40px;"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!--<template slot="menuRight">-->
                            <!--<el-switch v-model="isDetailed" active-text="交易记录" inactive-text="资金账户"-->
                                       <!--@change="handleSwitchChange" class="el-switch-select"></el-switch>-->
                        <!--</template>-->
                    </avue-crud>
                </div>
            </basic-container>
        </list-container>
    </div>

</template>

<script>
    import {page as capitalAccount,summary} from '@/api/erp/financial/financialCapitalAccount';
    import {page as transactionFlow} from '@/api/erp/financial/financialTransactionFlow';

    export default {
        name: "corporate-account",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                dataObj:{
                    afterAmount: 0,
                    amountIn: 0,
                    amountOut: 0
                },
                formData: {},
                isShow: true,
                isDetailed: true,
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
                    delBtn: false,
                    editBtn: false,
                    viewBtn: false,
                    bomBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                bomList: [],
                selectedRows: [],
                loading: false,
                tableOption: {
                    height: 'auto',
                    menu: false,
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: true,//首次加载是否显示搜索
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    addBtn: false,//新增
                    saveBtn: false,
                    updateBtn: false,
                    cancelBtn: false,
                    delBtn: false,
                    editBtn: false,
                    page: false,
                    align: 'center',
                    sumColumnList: [
                        {
                            name: "amountIn",
                            type: "sum"
                        },
                        {
                            name: "amountOut",
                            type: "sum"
                        },
                        // {
                        //     name: "afterAmount",
                        //     type: "sum"
                        // },
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
                        label: "账户号",
                        prop: "accountCode",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "账户名称",
                        prop: "accountName",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "账户金额",
                        prop: "amount",
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
                                "账户金额"
                            );
                        },
                        searchFilterable: true
                    },
                    {
                        label: "可用余额",
                        prop: "availableAmount",
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
                                "可用余额"
                            );
                        },
                        searchFilterable: true
                    },
                    {
                        label: "账户状态",
                        prop: "status",
                        minWidth: 180,
                        align: 'left',
                        dicData:[
                            {
                                value: 0,
                                label: '启用'
                            }, {
                                value: 1,
                                label: '冻结'
                            }, {
                                value: 2,
                                label: '禁用'
                            }
                        ]
                    },
                    {
                        label: "最后更新时间",
                        prop: "updTime",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                ],
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "单据编号",
                        prop: "orderNo",
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "账户编号",
                        prop: "accountCode",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "账户名称",
                        prop: "accountName",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "日期",
                        prop: "crtTime",
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "业务类型",
                        prop: "tradeType",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData:[
                            {
                                value: 1,
                                label: '收款单'
                            },
                            {
                                value: 25,
                                label: '付款单'
                            },
                            {
                                value: 16,
                                label: '费用报销'
                            },
                            {
                                value: 42,
                                label: '费用登记'
                            }
                        ],
                        search: true,
                    },
                    {
                        label: "收入",
                        prop: "amountIn",
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
                                "收入"
                            );
                        },
                    },
                    {
                        label: "支出",
                        prop: "amountOut",
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
                                "支出"
                            );
                        },
                    },
                    {
                        label: "账户余额",
                        prop: "afterAmount",
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
                                "账户余额"
                            );
                        },
                    },
                    {
                        label: "往来单位",
                        prop: "resource",
                        minWidth: 190,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "收/付款人",
                        prop: "crtUserName",
                        minWidth: 90,
                        overHidden:true,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                ],
                selectOption: {
                    height: '350',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    menu: false,
                    column: [
                        {
                            label: "id",
                            prop: "id",
                            sortable: true,
                            hide: true
                        }, {
                            label: "商品名称",
                            prop: "skuName",
                            minWidth: 180,
                            align: 'center',
                        }, {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 120,
                            align: 'center',
                        },
                        {
                            label: "计量单位",
                            prop: "unit",
                            minWidth: 80,
                            align: 'center',
                        },
                        {
                            label: "需求数量",
                            prop: "qty",
                            minWidth: 80,
                            align: 'right',
                        },
                        {
                            label: "已分配数量",
                            prop: "branchQty",
                            minWidth: 120,
                            align: 'right',
                        },
                        {
                            label: "在途数量",
                            prop: "wayQty",
                            minWidth: 80,
                            align: 'right',
                        },
                        {
                            label: "已领用数量",
                            prop: "pickingOutQty",
                            minWidth: 80,
                            align: 'right',
                        },
                    ]
                },
                publicVisible: false,
                typeName: '',
                option: '',
                isSingle: true,
                publicTitle: '',
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
            this.tableOption.column = this.detailedColumn;
            if (this.isDetailed) {
                this.permission.bomBtn = false;
            } else {
                this.permission.bomBtn = false;
            }
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
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
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.permission.bomBtn = false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.bomBtn = false;
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
                summary(this.listQuery.accountCode).then(res=>{
                    this.dataObj = res.data.data;
                })
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,selectType: "4"});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                if (this.isDetailed) {
                    select = transactionFlow;
                } else {
                    select = capitalAccount;
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
                    for(let i in data.records){
                        if(data.records[i].tradeType == '收款单'){
                            data.records[i].tradeType = 1
                        }
                        if(data.records[i].tradeType == '付款单'){
                            data.records[i].tradeType = 25
                        }
                        if(data.records[i].tradeType == '费用报销'){
                            data.records[i].tradeType = 16
                        }
                        if(data.records[i].tradeType == '费用登记'){
                            data.records[i].tradeType = 42
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
            },
            //编辑
            handleEdit(type) {
                // const text = type == 'view' ? '查看' : '编辑';
                // if (this.selectedRows.length < 1) {
                //     this.vueMessage('warning', '请选择要' + text + '的条目');
                //     return false;
                // } else if (this.selectedRows.length > 1) {
                //     this.vueMessage('warning', '只能' + text + '一个条目');
                //     return false;
                // }
                //
                // if (type != 'view') {
                //     if (this.selectedRows[0].billStatus == 2 || this.selectedRows[0].billStatus == 3 || this.selectedRows[0].billStatus == 4) {
                //         this.vueMessage('warning', '该状态不可编辑');
                //         return false;
                //     }
                // }
                // const id = this.isDetailed ? this.selectedRows[0].masterId : this.selectedRows[0].id;
                // this.$router.push({
                //     path: '/product_order_form',
                //     name: '生产订单制单',
                //     query: {
                //         id: id,
                //         type: type
                //     },
                //     meta: {
                //         i18n: 'product_order_form'
                //     }
                // });
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
            }
        }
    }
</script>

<style scoped lang="scss">
.bgItem{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .bgItem_item{
        padding: 26px;
        display: flex;
        width: 200px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background: rgb(111, 179, 224);
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        color: white;
        border-radius: 5px;
        .bgItem_item_left{
            span{
                font-size: 20px;
            }
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
    }
}
</style>
