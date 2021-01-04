<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="avue-crud-container" v-if="isShow">
                <div class="projectCost">
                    <div>
                        <div class="projectCostItem projectCostItems" style="background: #E5E5E5;">&nbsp;&nbsp;&nbsp;&nbsp;项目成本</div>
                        <div class="projectCostItem projectCostItems">
                            <div>订单号:&nbsp;&nbsp;&nbsp;&nbsp;{{billNo}}</div>
                            <div  class="projectCostConent">项目名称:&nbsp;&nbsp;&nbsp;&nbsp;{{projectName|| ''}}</div>
                            <div class="projectCostConent">订单金额:&nbsp;&nbsp;&nbsp;&nbsp;{{taxBillAmount}}</div>

                        </div>
                        <div class="projectCostItem">
                            <div>完成量:&nbsp;&nbsp;&nbsp;&nbsp;{{completedQuantity}}</div>
                            <div class="projectCostConent">总成本:&nbsp;&nbsp;&nbsp;&nbsp;{{totalCost}}</div>
                        </div>
                    </div>
                </div>
                <br/>
                <div style="width: 100%;">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="元器件列表" name="first"></el-tab-pane>
                        <el-tab-pane label="耗材/辅材列表" name="second"></el-tab-pane>
                        <el-tab-pane label="工时成本" name="third"></el-tab-pane>
                        <el-tab-pane label="其他费用" name="fourth"></el-tab-pane>
                    </el-tabs>
                </div>
                <avue-crud ref="crud"
                           v-if="isShow"
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
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {findProduceData} from '@/api/erp/product/project_analysis/project_accounting';

    export default {
        name: "project_accounting",
        props: ['timeStamp', 'billNo', 'goodsDate', 'taxBillAmount','projectName'],
        data() {
            return {
                totalCost: 0,
                completedQuantity: 0,
                activeName: 'first',
                isShow: true,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 10 // 每页显示多少条
                },
                listQuery: {},
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                tableOption: {
                    maxHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
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
                    searchMenuSpan: 6,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "amount",
                            type: "sum"
                        },
                        {
                            name: "taxAmount",
                            type: "sum"
                        },
                    ],
                    column: []
                },
                firstColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "品名",
                        prop: "skuName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        label: "系列",
                        prop: "series",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 160,
                        align: 'left',
                    },
                    {
                        label: "订单数量",
                        prop: "qty",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "订单数量"
                            );
                        }
                    },
                    {
                        label: "使用数量",
                        prop: "pickOutQty",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "使用数量"
                            );
                        }
                    },
                    {
                        label: "面价",
                        prop: "surfacePrice",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "面价"
                            );
                        }
                    },
                    {
                        label: "进价",
                        prop: "taxPrice",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "进价"
                            );
                        }
                    },
                    {
                        label: "折扣",
                        prop: "discount",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "折扣"
                            );
                        }
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "金额"
                            );
                        }
                    },
                ],
                secondColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "品名",
                        prop: "skuName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 160,
                        align: 'left',
                    },
                    {
                        label: "使用数量",
                        prop: "qty",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "使用数量"
                            );
                        }
                    },
                    {
                        label: "单价",
                        prop: "taxPrice",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "单价"
                            );
                        }
                    },
                    {
                        label: "金额",
                        prop: "taxAmount",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "金额"
                            );
                        }
                    },
                ],
                thirdColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "工序",
                        prop: "workOn",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "工号",
                        prop: "skillCode",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "姓名",
                        prop: "skillName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "计划工时",
                        prop: "estimateHour",
                        minWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "使用工时",
                        prop: "workerHour",
                        minWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "工时单价/小时",
                        prop: "standardCost",
                        minWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "金额",
                        prop: "taxAmount",
                        minWidth: 100,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "金额"
                            );
                        }
                    },
                ],
                fourthColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "费用类型",
                        prop: "itemNo",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#F56C6C"
                                    }
                                },
                                "金额"
                            );
                        }
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
            this.tableOption.column = this.firstColumn;
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {
                    page: page.currentPage,
                    limit: page.pageSize,
                    billNo: this.billNo
                });
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = findProduceData;
                select(queryObj).then(res => {
                    let bills = res.data.data.bills;
                    let itemList = res.data.data.itemList;
                    let workOrderItem = res.data.data.workOrderItem;
                    let orderItemBills = res.data.data.orderItemBills;
                    let totalCost = 0;
                    for (let i in bills) {
                        if(bills[i].amount){
                            totalCost = totalCost * 1 + bills[i].amount * 1;
                        }
                        bills[i].pickOutQty = bills[i].branchQty * 1 - bills[i].pickingEnterQty * 1;
                    }
                    for (let i in itemList) {
                        itemList[i].taxAmount = itemList[i].qty * itemList[i].taxPrice;
                        totalCost = totalCost * 1 + itemList[i].taxAmount * 1;
                    }
                    for (let i in workOrderItem) {
                        workOrderItem[i].taxAmount = workOrderItem[i].workerHour * workOrderItem[i].standardCost;
                        totalCost = totalCost * 1 + workOrderItem[i].taxAmount * 1;
                    }
                    for (let i in orderItemBills) {
                        totalCost = totalCost * 1 + orderItemBills[i].amount;
                    }
                    this.totalCost = totalCost;
                    this.completedQuantity = res.data.data.sum;
                    if (this.activeName == 'first') {
                        let completedQuantity = 0;
                        this.list = bills;
                    }
                    if (this.activeName == 'second') {
                        this.list = itemList;
                    }
                    if (this.activeName == 'third') {
                        this.list = workOrderItem;
                    }
                    if (this.activeName == 'fourth') {
                        this.list = orderItemBills;
                    }
                    console.log(this.list);
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
            handleSearchChange(params, done) {
                if (this.searchDisable) {
                    return;
                }
                this.searchDisable = true;
                this.listQuery = params;
                this.page.currentPage = 1;
                this.getList(this.page, params);
                done();
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
                const id = row.id;
                // this.$router.push({
                //     path: '/srm-warehouse-form',
                //     name: '仓库管理制单',
                //     query: {
                //         id: id,
                //         type: 'view'
                //     },
                //     meta: {
                //         i18n: 'srm-warehouse-form'
                //     }
                // });
            },
        },
        watch: {
            activeName(val) {

                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (val == 'first') {
                        this.tableOption.column = this.firstColumn;
                    }
                    if (val == 'second') {
                        this.tableOption.column = this.secondColumn;
                    }
                    if (val == 'third') {
                        this.tableOption.column = this.thirdColumn;
                    }
                    if (val == 'fourth') {
                        this.tableOption.column = this.fourthColumn;
                    }
                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page);
                    this.isShow = true;
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .projectCostItem {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid #E5E5E5;
        font-size: 15px;
        line-height: 3.2;
        div {
            font-size: 13px;
            width: 30%;

            padding-left: 20px;

        }
    }

    .projectCostConent {
        border-left: 1px solid #E5E5E5;
    }

    .projectCostConents {
        border-right: 1px solid #E5E5E5;
    }

    .projectCostItems {
        border-bottom: none !important;
    }
</style>
