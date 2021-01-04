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
                        <div style="display: flex;flex-direction: row;align-items: center;">
                            <button-bar type="list"
                                        ref="buttonBar"
                                        :permission="permission"
                                        :tableOption="tableOption"
                                        :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                        objectKey="JSKCCX"
                                        :objectType="isDetailed ? 1 : 0"
                                        @handleSettingSubmit="handleSettingSubmit"></button-bar>
                            <el-button type="warning" plain class="el-icon-upload2-as"><a
                                    :href="'/api/manager/stock-detail/exportStock?id='+ id">导出清单</a></el-button>
                            <span style="margin-left: 15px;margin-bottom:8px;">批次查询</span>
                            <el-switch v-model="isDetailed"
                                       @change="handleSwitchChange" style="margin-left: 15px;;margin-bottom:8px;"></el-switch>
                        </div>

                        <!--<el-button type="primary" plain icon="el-icon-upload2" class="el-icon-upload2-a" style="text-align: right;">-->

                        <!--</el-button>-->
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {pageBySingleProduct, pageByBatchNo} from '@/api/erp/wms/stock_query/index'

    export default {
        props: ['timeStamp'],
        name: "goods_stock_query",
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
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: false,
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
                    searchBtn: true,//搜索显隐按钮
                    searchShow: false,
                    searchSpan: 4,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "stockAmount",
                            type: "sum"
                        },
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "vendibility",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "retailPrice",
                            type: "sum"
                        },
                        {
                            name: "allocationPrice",
                            type: "sum"
                        },
                        {
                            name: "lockedQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "costPrice",
                            type: "sum"
                        },
                        {
                            name: "purchasePrice",
                            type: "sum"
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
                        minWidth: 120,
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
                        label: "仓库名称",
                        prop: "warehouseName",
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
                        label: "库存数量",
                        prop: "qty",
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
                        label: "可售数量",
                        prop: "vendibility",
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
                                "可售数量"
                            );
                        },
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
                        label: "成本价",
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
                                "成本价"
                            );
                        },
                    },
                    {
                        label: "库存金额",
                        prop: "stockAmount",
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
                                "库存金额"
                            );
                        },
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
                    // {
                    //     label: "锁定数量",
                    //     prop: "lockedQty",
                    //     minWidth: 100,
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
                    //             "锁定数量"
                    //         );
                    //     },
                    // },
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
                    {
                        label: "库存金额",
                        prop: "stockAmount",
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
                                "库存金额"
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
            getConfigList() {
                this.setList(this, 'JSKCCX');
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
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = this.isDetailed ? pageByBatchNo : pageBySingleProduct;
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    for (let i in data.records) {
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
    .el-icon-upload2-as {
        a {
            /*color: #606266;*/
            color: #E6A23C;
        }

    }

    .el-icon-upload2-as:hover {
        a {
            color: white;
            /*color: #409EFF;*/
        }

    }
</style>
