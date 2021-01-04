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
                               @row-click="handleRowClick"
                               @row-dblclick="handleRowDbClick">
                        <template slot-scope="scope" slot="opt">
                            <el-button type="warning"
                                       size="small"
                                       plain @click="assignmentBtn(0,scope.row)"
                                       v-if="isDetailed && scope.row.productStatus == '0'">派工中
                            </el-button>
                            <el-button type="info"
                                       size="small"
                                       plain @click="assignmentBtn(1,scope.row)"
                                       v-if="isDetailed &&(scope.row.productStatus == '0' || scope.row.productStatus == '3' || scope.row.productStatus == '4')">
                                派工
                            </el-button>
                            <el-button type="primary"
                                       size="small" @click="assignmentBtn(2,scope.row)"
                                       v-if="isDetailed &&(scope.row.productStatus == '0' || scope.row.productStatus == '1' || scope.row.productStatus == '3')"
                                       plain>报工
                            </el-button>
                            <el-button type="warning" size="small" v-if="!isDetailed" @click="assignmentBtn(4,scope.row)"
                                       plain>撤销
                            </el-button>
                        </template>
                        <!--自定义按钮-->
                        <template slot="menuLeft">
                            <button-bar type="list"
                                        ref="buttonBar"
                                        objectKey="SCDD"
                                        :objectType="isDetailed ? 1 : 0"
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
                            <el-button v-if="!isDetailed" type="warning" icon="el-icon-lock" plain @click="lockLibrary">锁库</el-button>
                        </template>
                        <template slot="menuRight">
                            <el-checkbox v-model="isDetailed" @change="handleSwitchChange" style="margin-right: 20px;">显示详情</el-checkbox>
                        </template>
                    </avue-crud>
                </div>
            </basic-container>
        </list-container>
        <a id="test123" :href="openUrl+'/api/manager/product-production-order/exportDetail?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].id:'')"></a>
        <!--查看BOM清单-->
        <el-dialog :visible.sync="dialogSelectVisible" width="60%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="查看BOM清单" append-to-body class="public-dialog">
            <avue-crud ref="selectCrud" :data="bomList" :option="selectOption">
            </avue-crud>
        </el-dialog>
    </div>

</template>

<script>
    import {
        selectPage,
        selectPageByItem,
        batchDelBill,
        findList,
        revokeDate,
        lockStock
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
    import {userOption} from '@/util/table';
    import {openUrl} from '@/config/env';
    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        name: "product_order",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                dialogSelectVisible: false,
                formData: {},
                operateType: [
                    {
                        value: 0,
                        label: '派工中'
                    }, {
                        value: 1,
                        label: '派工'
                    }, {
                        value: 2,
                        label: '报工'
                    }
                ],
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
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                    bomBtn: true,
                    exportBtn: false,
                    printBtn: false,
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
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    addBtn: false,//新增
                    saveBtn: false,
                    updateBtn: false,
                    cancelBtn: false,
                    delBtn: false,
                    editBtn: false,
                    page: false,
                    align: 'center',
                    sumColumnList: [
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
                        label: "订单编号",
                        prop: "billNo",
                        minWidth: 160,
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
                        search: true,
                        searchFilterable: true
                    }, {
                        label: "单据日期",
                        prop: "billDate",
                        minWidth: 120,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    }, {
                        label: "客户编号",
                        prop: "customerCode",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 180,
                        align: 'left',
                    }, {
                        label: "销售员编号",
                        prop: "salesCode",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "销售员姓名",
                        prop: "salesName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "生产人员编号",
                        prop: "produceCode",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "生产人员姓名",
                        prop: "produceName",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "技术人员编号",
                        prop: "skillCode",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "技术人员姓名",
                        prop: "skillName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "开工日期",
                        prop: "openDate",
                        minWidth: 120,
                        sortable: true,
                        align: 'center',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',

                    },
                    {
                        label: "结束日期",
                        prop: "endsDate",
                        minWidth: 120,
                        sortable: true,
                        align: 'left',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',

                    },
                    {
                        label: "项目编号",
                        prop: "projectBillNo",
                        minWidth: 160,
                        align: 'left',
                    }, {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        fixed: "right",
                        slot: true,
                        minWidth: 180,
                        align: 'center',
                    },
                ],
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    }, {
                        label: "生产订单号",
                        prop: "productBillNo",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "项目订单号",
                        prop: "projectBillNo",
                        minWidth: 160,
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
                        search: true,
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
                        minWidth: 120,
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
                    {
                        label: "操作",
                        prop: "opt",
                        fixed: "right",
                        slot: true,
                        minWidth: 250,
                        align: 'center',
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
                            label: "产品名称",
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
            this.getConfigList();
            this.tableOption.column = this.detailedColumn;
            if (this.isDetailed) {
                this.permission.bomBtn = true;
            } else {
                this.permission.bomBtn = false;
            }
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getConfigList() {
                this.setList(this, 'SCDD');
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
            lockLibrary(){
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择条目');
                    return false;
                }
                lockStock(this.selectedRows).then(res=>{
                    if (res.data.code == 200 || res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: res.data.msg
                        });
                        this.getList(this.page);

                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                })
            },
            handleBomBill() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要查看DOM清单的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能查看DOM清单一个条目');
                    return false;
                }
                findList(this.selectedRows[0].id).then(res => {
                    if (res.data.code == '2000' && res.data.data && res.data.data.records.length > 0) {
                        this.dialogSelectVisible = true;
                        this.bomList = res.data.data.records;
                    }
                })
            },
            assignmentBtn(val, row) {
                if (val == 1) {
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
                this.handleBillAdd(this,{path: '/product_order_form', name: '生产订单制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.permission.bomBtn = true;
                        this.permission.exportBtn = false;
                        this.permission.printBtn= false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.bomBtn = false;
                        this.permission.exportBtn = true;
                        this.permission.printBtn= true;
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
                    if (this.isDetailed) {
                        for (let i in data.records) {
                            if (data.records[i].mainDTO) {
                                data.records[i].billDate = !this.isEmpty(data.records[i].mainDTO.billDate) ? data.records[i].mainDTO.billDate : '';
                                data.records[i].billNo = !this.isEmpty(data.records[i].mainDTO.billNo) ? data.records[i].mainDTO.billNo : '';
                                data.records[i].customerName = !this.isEmpty(data.records[i].mainDTO.customerName) ? data.records[i].mainDTO.customerName : '';
                                data.records[i].billStatus = !this.isEmpty(data.records[i].mainDTO.billStatus) ? data.records[i].mainDTO.billStatus : '';
                            }
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
                    path: '/product_order_form',
                    name: '生产订单制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'product_order_form'
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
                    path: '/product_order_form',
                    name: '生产订单制单',
                    query: {
                        id: this.selectedRows[0].id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'product_order_form'
                    }
                });
            },
            //导出
            handleExport() {
                if(this.isDetailed){
                    this.vueMessage('warning','请选择主表进行导出操作!');
                    return
                }
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一条单据导出!');
                    return
                }
                if(this.selectedRows.length>1){
                    this.vueMessage('warning','只能选择一个单据!');
                    return
                }
                document.getElementById('test123').click()
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
