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
                               :summary-method="getSummaries"
                               @sort-change="handleSortChange"
                               :cell-style="handleCellStyle"
                               @row-click="handleRowClick"
                               @row-dblclick="handleRowDbClick">
                        <!--自定义按钮-->
                        <template slot="menuLeft">
                            <button-bar type="lists"
                                        ref="buttonBar"
                                        :permission="permission"
                                        :tableOption="tableOption"
                                        :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                        @handleBomBill="handleBomBill"
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
                    </avue-crud>
                </div>
            </basic-container>
        </list-container>
        <!--查看BOM清单-->
        <el-dialog :visible.sync="dialogSelectVisible" width="60%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="查看BOM清单" append-to-body class="public-dialog">
            <avue-crud ref="selectCrud" :data="bomList"  :page="pages" :option="selectOption" @size-change="handleSizeChanges"
                       @current-change="handleCurrentChanges">
            </avue-crud>
        </el-dialog>
    </div>

</template>

<script>
    import {
        selectPages as selectPage,
        selectPageByItems as selectPageByItem,
        batchDelBill,
        findBill,
        revokeDate
    } from "@/api/erp/product/shop_manager/product_order";

    const orderType = [
        {
            value: '0',
            label: '技术审核'
        }, {
            value: '1',
            label: '生产审核'
        }, {
            value: '2',
            label: '生产中'
        }, {
            value: '3',
            label: '生产变更'
        }, {
            value: '4',
            label: '生产报工'
        }, {
            value: '5',
            label: '生产结束'
        }
    ];
    export default {
        name: "product_order_tail",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                dialogSelectVisible: false,
                formData: {},
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                pages: {
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
                    bomBtn: true,
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
                    index: false,
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
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
                            name: "price",
                            type: "sum"
                        },
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "branchQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "applyQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "stockQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "pickingOutQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "pickingEnterQty",
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
                        sortable: true,
                        hide: true
                    }, {
                        label: "生产订单号",
                        prop: "productBillNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "项目订单号",
                        prop: "projectBillNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    }, {
                        label: "订单状态",
                        prop: "billStatus",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicData: orderType,
                        searchFilterable: true
                    }, {
                        label: "产品名称",
                        prop: "skuName",
                        minWidth: 180,
                        align: 'left',
                        search: true,
                    }, {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 140,
                        align: 'left',
                        search: true,
                    }, {
                        label: "物料",
                        prop: "materielStatus",
                        minWidth: 80,
                        type: 'select',
                        align: 'left',
                        dicData: [
                            {
                                value: '0',
                                label: '充足'
                            },
                            {
                                value: '1',
                                label: '不足'
                            }
                        ],
                    }, {
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
                        label: "器件名称",
                        prop: "skuName",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "器件品牌",
                        prop: "brandName",
                        minWidth: 120,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "器件型号",
                        prop: "specifications",
                        minWidth: 120,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "器件订货号",
                        prop: "itemNo",
                        minWidth: 140,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "器件面价",
                        prop: "price",
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
                                "器件面价"
                            );
                        },
                    },
                    {
                        label: "器件订单数量",
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
                                "器件订单数量"
                            );
                        },
                    },
                    {
                        label: "分配数量",
                        prop: "branchQty",
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
                                "分配数量"
                            );
                        },
                    },
                    {
                        label: "已做采购申请数量",
                        prop: "applyQty",
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
                                "已做采购申请数量"
                            );
                        },
                    },
                    {
                        label: "库存可用数量",
                        prop: "stockQty",
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
                                "库存可用数量"
                            );
                        },
                    },
                    {
                        label: "领料数量",
                        prop: "pickingOutQty",
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
                                "领料数量"
                            );
                        },
                    },
                    {
                        label: "退料数量",
                        prop: "pickingEnterQty",
                        minWidth: 100,
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "退料数量"
                            );
                        },
                    },
                ],
                selectOption: {
                    height: '350',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    menu: false,
                    column: [
                        {
                            label: "id",
                            prop: "id",
                            sortable: true,
                            hide: true
                        }, {
                            label: "器件名称",
                            prop: "skuName",
                            minWidth: 180,
                            search: true,
                            sortable: true,
                            fixed: true,
                            align: 'left',
                        },
                        {
                            label: "器件品牌",
                            prop: "brandName",
                            minWidth: 120,
                            search: true,
                            sortable: true,
                            fixed: true,
                            align: 'left',
                        }, {
                            label: "器件型号",
                            prop: "specifications",
                            minWidth: 120,
                            align: 'left',
                            search: true,
                        }, {
                            label: "器件订货号",
                            prop: "itemNo",
                            minWidth: 120,
                            align: 'left',
                            search: true,
                        },
                        {
                            label: "器件面价",
                            prop: "price",
                            minWidth: 100,
                            align: 'right',
                        },
                        {
                            label: "器件订单数量",
                            prop: "qty",
                            minWidth: 100,
                            align: 'right',
                        },
                        {
                            label: "分配数量",
                            prop: "branchQty",
                            minWidth: 100,
                            align: 'right',
                        },
                        {
                            label: "已做采购申请数量",
                            prop: "applyQty",
                            minWidth: 120,
                            align: 'right',
                        },
                        {
                            label: "库存可用数量",
                            prop: "stockQty",
                            minWidth: 100,
                            align: 'right',
                        },
                        {
                            label: "领料数量",
                            prop: "pickingOutQty",
                            minWidth: 100,
                            align: 'right',
                        },
                        {
                            label: "退料数量",
                            prop: "pickingEnterQty",
                            minWidth: 100,
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
            this.tableOption.column = this.billColumn;
            if (this.isDetailed) {
                this.permission.bomBtn = false;
            } else {
                this.permission.bomBtn = true;
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
            handleSelectClose() {
                this.dialogSelectVisible = false;
            },
            handleBomBill() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要查看DOM清单的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能查看DOM清单一个条目');
                    return false;
                }
               this.findList();
                this.dialogSelectVisible = true;
            },
            findList(){
                selectPageByItem(Object.assign({page: this.pages.currentPage, limit:  this.pages.pageSize,id:this.selectedRows[0].id})).then(res => {
                    const data = res.data.data;
                    for (let i in data.records) {
                        if (data.records[i].mainDTO) {
                            data.records[i].billDate = !this.isEmpty(data.records[i].mainDTO.billDate) ? data.records[i].mainDTO.billDate : '';
                            data.records[i].billNo = !this.isEmpty(data.records[i].mainDTO.billNo) ? data.records[i].mainDTO.billNo : '';
                            data.records[i].customerName = !this.isEmpty(data.records[i].mainDTO.customerName) ? data.records[i].mainDTO.customerName : '';
                            data.records[i].billStatus = !this.isEmpty(data.records[i].mainDTO.billStatus) ? data.records[i].mainDTO.billStatus : '';
                        }
                    }
                    this.pages.total = data.total;
                    this.bomList = data.records;
                }).catch(() => {
                });
            },
            assignmentBtn(val, row) {
                if (val == 1) {
                    if (row.materielStatus == '1') {
                        this.vueMessage('warning', '物料不充足,不允许该操作!');
                        return
                    }
                    this.$router.push({
                        path: '/product_dispatch_list_form',
                        name: '派工单制单',
                        query: {
                            type: 'add',
                            masterId: row.id,
                            productBillNo: row.productBillNo,
                            skuName: row.skuName,
                            specifications: row.specifications,
                            itemNo: row.itemNo,
                            goodsDate: row.goodsDate,
                        },
                        meta: {
                            i18n: 'product_dispatch_list_form'
                        }
                    });
                }
                if (val == 2) {
                    this.$router.push({
                        path: '/product_work_order_form',
                        name: '报工单制单',
                        query: {
                            type: 'add',
                            masterId: row.id,
                        },
                        meta: {
                            i18n: 'product_work_order_form'
                        }
                    });
                }
                if (val == 4) {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        revokeDate(row.id).then(res => {
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.vueMessage('success', '操作成功!');
                                this.getList(this.page);
                            } else {
                                this.vueMessage('warning', res.data.msg);
                            }
                        })
                    });

                }
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
            handleAdd() {
                this.$router.push({
                    path: '/product_order_form',
                    name: '生产订单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'product_order_form'
                    }
                });
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
                        this.permission.bomBtn = true;
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
                if (queryObj.goodsDate && queryObj.goodsDate !== undefined && queryObj.goodsDate.length > 0) {
                    queryObj.startDate = queryObj.goodsDate[0] + ' 00:00:00';
                    queryObj.endDate = queryObj.goodsDate[1] + ' 23:59:59';
                    delete queryObj.goodsDate;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    for (let i in data.records) {
                        if (data.records[i].mainDTO) {
                            data.records[i].billDate = !this.isEmpty(data.records[i].mainDTO.billDate) ? data.records[i].mainDTO.billDate : '';
                            data.records[i].billNo = !this.isEmpty(data.records[i].mainDTO.billNo) ? data.records[i].mainDTO.billNo : '';
                            data.records[i].customerName = !this.isEmpty(data.records[i].mainDTO.customerName) ? data.records[i].mainDTO.customerName : '';
                            data.records[i].billStatus = !this.isEmpty(data.records[i].mainDTO.billStatus) ? data.records[i].mainDTO.billStatus : '';
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
            //当前页改变时
            handleCurrentChanges(val) {
                this.pages.currentPage = val;
                this.findList();
            },
            //页面显示条数改变时
            handleSizeChanges(val) {
                this.pages.currentPage = 1;
                this.pages.pageSize = val;
                this.findList()
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
                    path: '/product_order_form',
                    name: '生产订单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'product_order_form'
                    }
                });
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

</style>
