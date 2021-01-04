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
                           :summary-method="getSummaries"
                           @sort-change="handleSortChange"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <template slot="menuLeft">
                        <div style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
                            <el-button type="warning" plain @click="replenishment">补货</el-button>
                            <el-button plain class="el-icon-upload2-a"><a
                                    :href="'/api/manager/stock-detail/exportStockWarning?id='+ id">导出清单</a></el-button>
                            <div class="avue-crud-diag">
                                <img style="width: 12px;height: 12px;" src="http://hejigy.com.cn/jingao.png" />
                                <div>&nbsp;提示：只有下限预警商品，才能进行申请预警补货。</div>
                            </div>
                        </div>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {queryStockWarning} from '@/api/erp/wms/stock_query/index'

    export default {
        props: ['timeStamp'],
        name: "stock_warning_query",
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
                    indexLabel: '序号',
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
                            name: "stockQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "useQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "retailPrice",
                            type: "sum"
                        },
                        {
                            name: "purchaseQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "salesQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "upperQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "floorQty",
                            type: "sum",
                            len: 0
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "id",
                        prop: "id",
                        hide: true
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 110,
                        overHidden:true,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 85,
                        overHidden:true,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 50,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "面价",
                        prop: "retailPrice",
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
                                "面价"
                            );
                        },
                    },
                    {
                        label: "库存数量",
                        prop: "stockQty",
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
                                "库存数量"
                            );
                        },
                    },
                    {
                        label: "可用数量",
                        prop: "useQty",
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
                                "可用数量"
                            );
                        },
                    },
                    {
                        label: "库存上限",
                        prop: "upperQty",
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
                                "库存上限"
                            );
                        },
                    },
                    {
                        label: "库存下限",
                        prop: "floorQty",
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
                                "库存下限"
                            );
                        },
                    },
                    {
                        label: "说明",
                        prop: "warningType",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.warningTypeOptions,
                    },
                    {
                        label: "预警类型",
                        prop: "note",
                        width: 80,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        search: true,
                        hide: true,
                        dicData: this.warningTypeOptions1,
                    },
                ],
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        hide: true
                    },
                    {
                        label: "批次号",
                        prop: "batchNo",
                        minWidth: 120,
                        align: 'left',
                        search: true
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 160,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 180,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "仓库名称",
                        prop: "warehouseName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "仓位",
                        prop: "positionName",
                        minWidth: 120,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "库存数量",
                        prop: "qty",
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
                                "库存数量"
                            );
                        },
                    },
                    {
                        label: "锁定数量",
                        prop: "lockedQty",
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
                                "锁定数量"
                            );
                        },
                    },
                    {
                        label: "可售数量",
                        prop: "vendibility",
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
                                "可售数量"
                            );
                        },
                    },
                    {
                        label: "面价",
                        prop: "retailPrice",
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
                                "面价"
                            );
                        },
                    },
                    {
                        label: "成本价",
                        prop: "purchasePrice",
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
                                "成本价"
                            );
                        },
                    },
                    {
                        label: "调拨价",
                        prop: "allocationPrice",
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
                                "调拨价"
                            );
                        },
                    },
                ],
                id: undefined
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
            replenishment() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择至少一条数据!');
                    return
                }
                for (let i in this.selectedRows) {
                    if (this.selectedRows[i].note == '1') {
                        this.vueMessage('warning', '只有下限预警的商品才可以申请预警补货');
                        return;
                    }
                    if (this.selectedRows[i].lessQty < 0) {
                        this.vueMessage('warning', '选中的数量包含不可补货的商品');
                        return;
                    }
                }
                this.$router.push({
                    path: '/purchase_apply_form',
                    name: '采购申请制单',
                    meta: {
                        i18n: 'purchase_apply_form'
                    },
                    query: {
                        type: 'add' + new Date().getTime(),
                        obj: this.selectedRows
                    },
                });
            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
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

                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page);
                    this.isShow = true;
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = queryStockWarning;
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for (let i in data.records) {
                        data.records[i].warningType = data.records[i].note;
                        data.records[i].vendibility = Number(data.records[i].qty) - Number(data.records[i].lockedQty)
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
        }
    }
</script>
<style scoped lang="scss">

    .avue-crud-diag{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        padding:2px 6px;
        color: #E0A242;
        background:rgba(252,251,226,1);
        border:1px solid rgba(240,227,202,1);
        margin-bottom: 8px;
    }
    .el-icon-upload2-a {
        a {
            color: #606266;
        }
    }

    .el-icon-upload2-a:hover {
        a {
            color: #409EFF;
        }
    }
</style>
