<template>
    <div>
        <basic-container>
            <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin-bottom: 20px;">
                <div :class="status=='1'?'bill_statu_Item bill_statu_Items':'bill_statu_Item '">待生产</div>
                <img class="bill_statu_Item_img" src="http://hejigy.com.cn/%E7%AE%AD%E5%A4%B4.png"
                     style="width: auto;height: 14px;"/>
                <div :class="status=='2'?'bill_statu_Item bill_statu_Items':'bill_statu_Item'">生产中</div>
                <img class="bill_statu_Item_img" src="http://hejigy.com.cn/%E7%AE%AD%E5%A4%B4.png"
                     style="width: auto;height: 14px;"/>
                <div :class="status=='3' || status=='5'?'bill_statu_Item bill_statu_Items':'bill_statu_Item'">待出库</div>
                <img class="bill_statu_Item_img" src="http://hejigy.com.cn/%E7%AE%AD%E5%A4%B4.png"
                     style="width: auto;height: 14px;"/>
                <div :class="status=='4'?'bill_statu_Item bill_statu_Items':'bill_statu_Item'">待验收</div>
            </div>
            <div class="avue-crud-container" v-if="isShow">
                <div class="projectCost">
                    <div>
                        <div class="projectCostItem projectCostItems">
                            <div>订单号:&nbsp;&nbsp;&nbsp;&nbsp;{{billNo}}</div>
                            <div class="projectCostConent">订单金额: &nbsp;&nbsp;&nbsp;&nbsp;{{taxAmount}}</div>
                            <div class="projectCostConent">完成量:&nbsp;&nbsp;&nbsp;&nbsp;{{completedQuantity}}</div>
                        </div>
                        <div class="projectCostItem">
                            <div>总达成率: &nbsp;&nbsp;&nbsp;&nbsp;{{taxRate}}%</div>
                        </div>
                    </div>
                </div>
                <br/>
                <div style="width: 100%;">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="缺少物料列表" name="first"></el-tab-pane>
                        <el-tab-pane label="生产进度" name="second"></el-tab-pane>
                        <el-tab-pane label="生产任务" name="third"></el-tab-pane>
                    </el-tabs>
                </div>
                <avue-crud ref="crud"
                           v-if="isShow"
                           :data="list"
                           :table-loading="loading"
                           :option="tableOption"
                           @refresh-change="refreshChange"
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
    </div>
</template>

<script>
    import {findProjectTable} from '@/api/erp/product/project_analysis/project_accounting';

    export default {
        name: "project_summary",
        props: ['timeStamp', 'billNo', 'goodsDate', 'taxAmount'],
        data() {
            return {
                status: '0',
                completedQuantity: 0,
                activeName: 'first',
                taxRate: 0,
                isShow: true,
                page: {},
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
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "retailPrice",
                            type: "sum"
                        }, {
                            name: "costPrice",
                            type: "sum"
                        }
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
                        align: 'left',
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
                    },
                    {
                        label: "缺少数量",
                        prop: "missingQuantity",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "已领取数量",
                        prop: "applyQty",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "在途数量",
                        prop: "wayQty",
                        minWidth: 100,
                        align: 'center',
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
                        label: "订单数量",
                        prop: "qty",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "生产中数量",
                        prop: "workQty",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "已入库数量",
                        prop: "enterQty",
                        minWidth: 100,
                        align: 'right',
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
                        label: "分派工序",
                        prop: "name",
                        minWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "计划工时",
                        prop: "estimateHour",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "已进行工时",
                        prop: "workerHour",
                        minWidth: 100,
                        align: 'right',
                    },
                    {
                        label: "完工工时",
                        prop: "completeHour",
                        minWidth: 100,
                        align: 'right',
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
                select = findProjectTable;
                select(queryObj).then(res => {
                    this.status = res.data.data.status;
                    let itemBills = res.data.data.itemBills;
                    let listItems = res.data.data.listItems;
                    let orderItems = res.data.data.orderItems;
                    let completedQuantity = 0;
                    for (let i in orderItems) {
                        orderItems[i].workQty = orderItems[i].qty * 1 - orderItems[i].enterQty * 1;
                        if (orderItems[i].taxPrice) {
                            completedQuantity = completedQuantity * 1 + (orderItems[i].taxPrice * orderItems[i].enterQty);
                        }
                    }
                    if (completedQuantity == 0) {
                        this.taxRate = 0;
                    } else {
                        this.taxRate = Number(this.taxAmount / completedQuantity) * 100;
                    }
                    this.completedQuantity = completedQuantity;
                    if (this.activeName == 'first') {
                        for(let i in itemBills){
                            itemBills[i].missingQuantity = itemBills[i].qty * 1 - itemBills[i].branchQty;
                        }
                        this.list = itemBills;
                    }
                    if (this.activeName == 'second') {
                        this.list = orderItems;
                    }
                    if (this.activeName == 'third') {
                        this.list = listItems;
                        for (let i in listItems) {
                            let data = JSON.parse(listItems[i].skillMuster);
                            let skillCode = [];
                            let skillName = [];
                            if (data && data.length > 0) {
                                for (let j in data) {
                                    skillName.push(data[j].skillName);
                                    skillCode.push(data[j].skillCode);
                                }
                            }
                            listItems[i].skillName = skillName.toString();
                            listItems[i].skillCode = skillCode.toString();
                        }

                    }
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
                //判断是单据还是详情
                this.tableOption.column = [];
                this.$nextTick(() => {

                    if (val == 'first') {
                        this.tableOption.column = this.firstColumn;
                    }
                    if (val == 'second') {
                        this.tableOption.column = this.secondColumn;
                    }
                    if (val == 'third') {
                        this.tableOption.column = this.thirdColumn;
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

    .bill_statu_Item {
        background: #CCCCCC;
        font-size: 14px;
        padding: 4px 16px;
        color: white;
        border-radius: 14px;
        margin-right: 5px;
    }

    .bill_statu_Item_img {
        margin-right: 5px;
    }

    .bill_statu_Items {
        background: #8167F5;
    }
</style>
