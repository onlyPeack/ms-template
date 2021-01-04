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
                        <a :href="'/api/manager/payable-detail/export?id='+ id" >
                            <el-button icon="el-icon-upload2" id="export_bill" type="primary" plain>
                                导出
                            </el-button>
                        </a>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {supplierReconciliation as selectPage} from '@/api/erp/financial/financialPayableDetail'
    export default {
        name: "supplier_reconciliation",
        props: ['timeStamp'],
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
                id: undefined,
                listQuery: {},
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
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "notPaymentAmount",
                            type: "sum"
                        }, {
                            name: "paymentAmount",
                            type: "sum"
                        },  {
                            name: "shouldPaymentAmount",
                            type: "sum"
                        }, {
                            name: "stockReturnAmount",
                            type: "sum"
                        }, {
                            name: "stockInPurchaseAmount",
                            type: "sum"
                        }, {
                            name: "billAmount",
                            type: "sum"
                        },{
                            name: "straightOutAmount",
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
                        label: "供应商名称",
                        prop: "supplierName",
                        minWidth  : 190,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'left',
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
                        label: "订单金额",
                        prop: "taxBillAmount",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        sortable: true,
                    },
                    {
                        label: "入库金额",
                        prop: "stockInPurchaseAmount",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor:"#ff0000",
                        sortable: true,
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "入库金额"
                            );
                        },
                    },
                    {
                        label: "直发金额",
                        prop: "straightOutAmount",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor:"#ff0000",
                        sortable: true,
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "直发金额"
                            );
                        },
                    },
                    {
                        label: "应付金额",
                        prop: "shouldPaymentAmount",
                        minWidth: 110,
                        overHidden:true,
                        align: 'right',
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                }, column.label+'   '),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '应付金额=入库金额-退货金额',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },
                    },
                    {
                        label: "付款金额",
                        prop: "paymentAmount",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        textColor:"#ff0000",
                        sortable: true,
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "付款金额"
                            );
                        },
                    },
                    {
                        label: "应付余额",
                        prop: "notPaymentAmount",
                        minWidth: 110,
                        overHidden:true,
                        align: 'right',
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                }, column.label+'   '),
                                h('el-tooltip', {
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: '应收余额=应付金额-付款金额',
                                        placement: 'top-start'//ele原来样式
                                    },
                                }, [h('img', {
                                    attrs: {
                                        class: "imgTabelItem",
                                        src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }

                                })]),
                            ])
                        },
                    },
                    {
                        label: "退货金额",
                        prop: "stockReturnAmount",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        sortable: true,
                    },
                    {
                        label: "付款单号",
                        prop: "payBillNo",
                        minWidth: 140,
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
            this.id = this.$store.getters.userInfo.id;
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
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },
            //获取数据
            getList(page, params = {}) {
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
                if (queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0) {
                    queryObj.startBillDate = queryObj.crtTime[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.crtTime[1] + ' 23:59:59';
                    delete queryObj.crtTime;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for(let i in data.records){
                        data.records[i].objectName = '采购订单'
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
            //行点击事件
            handleRowClick(row, event, column) {
                this.controlButtonShow(row, this);
                this.$refs.crud.toggleSelection([row]);
            },
        }
    }
</script>


<style scoped lang="scss">
    .el-icon-upload2-as{
        a{
            /*color: #606266;*/
            color: #E6A23C;
        }

    }
    .el-icon-upload2-as:hover{
        a{
            color: white;
            /*color: #409EFF;*/
        }

    }
</style>
