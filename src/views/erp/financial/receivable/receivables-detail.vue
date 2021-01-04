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
                           @row-click="handleRowClick">
                    <template slot="menuLeft">
                        <div class="bgItem">
                            <div class="bgItem_item" style="background: rgb(183,129,20);">
                                <div class="bgItem_item_left">
                                    <span>￥{{dataObj.frozenAmount}}</span>
                                    <div>冻结</div>
                                </div>
                                <div>
                                    <img src="http://hejigy.com.cn/dongjie.png" style="width: 40px;height: 40px;"/>
                                </div>
                            </div>
                            <div class="bgItem_item">
                                <div class="bgItem_item_left">
                                    <span>￥{{dataObj.amount}}</span>
                                    <div>应收</div>
                                </div>
                                <div>
                                    <img src="http://hejigy.com.cn/TIM%E5%9B%BE%E7%89%8720200422174812.png" style="width: 40px;height: 40px;"/>
                                </div>
                            </div>
                            <div class="bgItem_item" style="background: rgb(255, 183, 82);">
                                <div class="bgItem_item_left">
                                    <span>￥{{dataObj.receiptAmount}}</span>
                                    <div>已收</div>
                                </div>
                                <div>
                                    <img src="http://hejigy.com.cn/TIM%E5%9B%BE%E7%89%8720200422174840.png" style="width: 40px;height: 40px;"/>
                                </div>
                            </div>
                            <div class="bgItem_item" style="background: rgb(135, 184, 127);">
                                <div class="bgItem_item_left">
                                    <span>￥{{dataObj.notReceiptAmount}}</span>
                                    <div>应收余额</div>
                                </div>
                                <div>
                                    <img src="http://hejigy.com.cn/TIM%E5%9B%BE%E7%89%8720200422174831.png" style="width: 40px;height: 40px;"/>
                                </div>
                            </div>
                        </div>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {selectPage,customerSummary} from '@/api/erp/financial/financialReceivableDetail'
    export default {
        name: "receivables-detail",
        props: ['timeStamp'],
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
                dataObj:{
                    frozenAmount:0,
                    amount: 0,
                    receiptAmount: 0,
                    notReceiptAmount: 0
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
                            name: "amount",
                            type: "sum"
                        },{
                            name: "notReceiptAmount",
                            type: "sum"
                        },{
                            name: "receiptAmount",
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
                        align: 'left',
                    },
                    {
                        label: "单据类型",
                        prop: "objectName",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 190,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "业务员",
                        prop: "managerName",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "所属部门",
                        prop: "departName",
                        minWidth: 190,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "冻结金额",
                        prop: "frozenAmount",
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
                                "冻结金额"
                            );
                        },
                    },
                    {
                        label: "应收金额",
                        prop: "amount",
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
                                "应收金额"
                            );
                        },
                    },
                    {
                        label: "已收金额",
                        prop: "receiptAmount",
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
                                "已收金额"
                            );
                        },
                    },
                    {
                        label: "应收余额",
                        prop: "notReceiptAmount",
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
                                "应收余额"
                            );
                        },
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
                customerSummary(this.listQuery).then(res=>{
                    this.dataObj = res.data.data;
                })
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

