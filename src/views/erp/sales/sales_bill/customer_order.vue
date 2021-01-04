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
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    :permission="permissionCopy"
                                    objectKey="XSDD"
                                    :objectType="isDetailed ? 1 : 0"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handlePosition="positionBtn"
                                    @handleExport="handleExport"></button-bar>
                        <!--                        <el-button icon="el-icon-document-delete" v-if="!isDetailed" type="warning" plain @click="toVoid" >作废</el-button>-->
                        <!--                        <el-button type="warning" v-if="!isDetailed" size="mini" plain icon="el-icon-printer" @click="handleDownLoad">打印合同</el-button>-->
                        <!--                        <el-button icon="el-icon-lock" v-if="!isDetailed" type="warning" plain @click="lock(true)" >锁定库存</el-button>-->
                        <!--                        <el-button icon="el-icon-unlock" v-if="!isDetailed" type="warning" plain @click="lock(false)" >解锁库存</el-button>-->
<!--                        <el-button icon="el-icon-position" type="warning" plain @click="positionBtn" >跟踪</el-button>-->
                        <el-dropdown @command="handleCommand" placement="bottom-start">
                            <el-button type="primary" plain>
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="handleDownLoad" v-if="!isDetailed">打印合同</el-dropdown-item>
                                <el-dropdown-item command="lockTrue" v-if="!isDetailed">锁定库存</el-dropdown-item>
                                <el-dropdown-item command="lockFalse" v-if="!isDetailed">解锁库存</el-dropdown-item>
                                <el-dropdown-item command="handleExport" v-if="permission.exportBtn">导出　　　　&nbsp;</el-dropdown-item>
                                <el-dropdown-item command="handleEdit" v-if="permission.editBtn">编辑</el-dropdown-item>
                                <el-dropdown-item command="toVoid" v-if="!isDetailed">作废</el-dropdown-item>
                                <el-dropdown-item command="handleRowDelete" v-if="permission.delBtn"></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot="menuRight">
                        <el-checkbox v-model="isDetailed" @change="handleSwitchChange" style="margin-right: 20px;">显示详情</el-checkbox>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <a id="test123"
           :href="openUrl+'/api/manager/sales-order/exportDetail?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].id:'')"></a>
    </list-container>
</template>

<script>
    import {selectPage, selectPageByItem, batchDelBill,cancel,unlockStock,lockStock} from "@/api/erp/sales/bill/salesOrder";
    import { getDefault} from '@/api/erp/project_management/projectOverview';
    import {getObj as getSetting} from "@/api/erp/config/index";
    import {userOption} from '@/util/table';
    import {openUrl} from '@/config/env';

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        name: "customer_order",
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
                permissionCopy: {
                    addBtn: true,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: true,
                    exportBtn: false,
                    printBtn: false,
                    positionBtn:true
                },
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                    exportBtn: true,
                    printBtn: false
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
                    indexLabel:'序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "taxPrice",
                            type: "sum"
                        },  {
                            name: "taxAmount",
                            type: "sum"
                        }, {
                            name: "orderQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "purchaseStockInQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "stockOutSaleQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "stockInSaleAmount",
                            type: "sum"
                        }, {
                            name: "notStockInSaleAmount",
                            type: "sum"
                        }, {
                            name: "notStockOutSaleQty",
                            type: "sum",
                            len: 0
                        }, {
                            name: "notStockInSaleAmount",
                            type: "sum"
                        }, {
                            name: "purchaseInvoiceQty",
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
                    },
                    {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 70,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "订单类型",
                        prop: "billType",
                        search: true,
                        minWidth: 70,
                        overHidden:true,
                        type: 'select',
                        dicMethod: 'get',
                        dicUrl: '/api/manager/sales-order-type/pageAll',
                        props: {
                            value: 'name',
                            label: 'name'
                        }
                    },
                    {
                        label: "销售员编号",
                        prop: "salerCode",
                        minWidth: 90,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "销售员",
                        prop: "salerName",
                        minWidth: 70,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "销售部门",
                        prop: "departName",
                        minWidth: 190,
                        overHidden:true,
                        search: true,
                        align: 'left',
                        //hide: true
                    },
                    {
                        label: "客户编号",
                        prop: "customerCode",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 170,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "开票状态",
                        prop: "invoiceStatus",
                        minWidth: 80,
                        overHidden:true,
                        type: 'select',
                        align: 'left',
                        dicData: this.invoiceType,
                        searchFilterable: true
                    },
                    {
                        label: "出库状态",
                        prop: "storageStatus",
                        minWidth: 80,
                        overHidden:true,
                        type: 'select',
                        align: 'left',
                        dicData: this.storageType,
                        searchFilterable: true
                    },
                    {
                        label: "源报价单号",
                        prop: "sourceBillNo",
                        search: true,
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        minWidth: 130,
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
                        label: "整单备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                ],
                detailedColumn: [
                    {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 70,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "客户编号",
                        prop: "customerCode",
                        minWidth: 80,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 170,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 120,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "分类",
                        prop: "categoryName",
                        minWidth: 80,
                        overHidden:true,
                        search: true
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "系列",
                        prop: "seriesName",
                        minWidth: 80,
                        overHidden:true,
                        search: true
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 85,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        minWidth: 50,
                        overHidden:true,
                        align: 'center',
                    },
                    // {
                    //     label: "货物类型",
                    //     prop: "salesType",
                    //     minWidth: 80,
                    //     overHidden:true,
                    //     align: 'left',
                    //     type: 'select',
                    //     dicData: [
                    //         {
                    //             value: 0,
                    //             label: '现货'
                    //         },
                    //         {
                    //             value: 1,
                    //             label: '期货'
                    //         },
                    //     ],
                    // },
                    {
                        label: "订单数量",
                        prop: "qty",
                        minWidth: 80,
                        overHidden:true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "订单数量"
                            );
                        },
                        textColor: "#ff0000",
                    },
                    {
                        label: "不含税单价",
                        prop: "price",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        hide: true,
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "单价"
                            );
                        },
                    }, {
                        label: "不含税金额",
                        prop: "amount",
                        minWidth: 100,
                        overHidden:true,
                        align: 'right',
                        hide: true,
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "金额"
                            );
                        },
                    },
                    {
                        label: "含税单价",
                        prop: "taxPrice",
                        minWidth: 80,
                        overHidden:true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "含税单价"
                            );
                        },
                        textColor: "#ff0000",
                    },
                    {
                        label: "价税合计",
                        prop: "taxAmount",
                        minWidth: 80,
                        overHidden:true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "价税合计"
                            );
                        },
                        textColor: "#ff0000",
                    },
                    {
                        label: "出库数量",
                        prop: "stockOutSaleQty",
                        minWidth: 80,
                        overHidden:true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "出库数量"
                            );
                        },
                        textColor: "#ff0000",
                    },
                    {
                        label: "出库金额",
                        prop: "stockInSaleAmount",
                        minWidth: 80,
                        overHidden:true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "出库金额"
                            );
                        },
                        textColor: "#ff0000",
                    },
                    {
                        label: "锁库数量",
                        prop: "lockedQty",
                        minWidth: 80,
                        overHidden:true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "锁库数量"
                            );
                        },
                        textColor: "#ff0000",
                    },
                    {
                        label: "源报价单号",
                        prop: "sourceBillNo",
                        search: true,
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        minWidth: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'left',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
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
            positionBtn(){
                if (this.selectedRows.length != 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return;
                }
                this.$router.push({
                    path: '/sales_order_tail',
                    name: '销售订单跟踪',
                    meta: {
                        i18n: 'sales_order_tail'
                    },
                    query: {
                        timeStamp: new Date().getTime(),
                        id: this.selectedRows[0].billNo
                    },
                });
            },
            lock(type){
                let selectType = type? lockStock:unlockStock;
                if (this.selectedRows.length != 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return;
                }
                selectType(this.selectedRows[0].id).then(res=>{
                    if (res.data.code == 200 || res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.getList(this.page);
                    }else if (res.data.code == 401 || res.data.code == '401') {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                })
            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
            getConfigList() {
                this.setList(this, 'XSDD');
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
                this.handleBillAdd(this,{path: '/customer_order_from', name: '销售订单制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.tableOption.showSummary = true;
                        this.permission.printBtn = false;
                        this.permission.exportBtn = false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.printBtn = false;
                        this.tableOption.showSummary = false;
                        this.permission.exportBtn = true;
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
                if (queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0) {
                    queryObj.startBillDate = queryObj.crtTime[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.crtTime[1] + ' 23:59:59';
                    delete queryObj.crtTime;
                }

                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    if (this.isDetailed) {
                        for (let i in data.records) {
                            if (data.records[i].mainDTO) {
                                data.records[i].customerCode = data.records[i].mainDTO.customerCode;
                                data.records[i].customerName = data.records[i].mainDTO.customerName;
                                data.records[i].storageStatus = data.records[i].mainDTO.storageStatus;
                                data.records[i].billStatus = data.records[i].mainDTO.billStatus;
                                data.records[i].salerName = data.records[i].mainDTO.salerName;
                                data.records[i].salerCode = data.records[i].mainDTO.salerCode;
                                data.records[i].taxBillAmount = data.records[i].mainDTO.taxBillAmount;
                            }

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
            handleDownLoad(){
                getDefault(0).then(res => {
                    if(res.data.code == '401'){
                        this.vueMessage('warning',res.data.msg);
                    }else{
                        if (this.selectedRows.length != 1) {
                            this.vueMessage('warning', '请选择一条数据');
                            return false;
                        }
                        let routerJump = this.$router.resolve({path:'/print/customer_order_print',query:{id:this.selectedRows[0].id}})
                        window.open(routerJump.href, '_blank');
                    }
                })
            },
            toVoid(){
                if (this.selectedRows.length != 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    //this.vueNotification('success', '提示', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    if (row.billStatus != 4) {
                        this.vueMessage('warning', '该状态订单不能作废');
                        flag = false;
                    }
                    ids.push(row.id)
                });
                if (flag) {
                    this.$confirm('是否继续本次操作?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        cancel(this.selectedRows[0].id).then((res) => {
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.getList(this.page);
                            }else if (res.data.code == 401 || res.data.code == '401') {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
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
                    path: '/customer_order_form',
                    name: '销售订单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'customer_order_form'
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
                let ids = [];
                for(let i in this.list){
                    ids.push(this.list[i].id);
                }
                const id = this.isDetailed ? this.selectedRows[0].masterId : this.selectedRows[0].id;
                this.$router.push({
                    path: type != 'view' ? '/customer_order_form' : '/customer_order_view',
                    name: type != 'view' ? '销售订单制单' : '销售订单详情',
                    query: {
                        id: id,
                        type: type,
                        ids: JSON.stringify(ids)
                    },
                    meta: {
                        i18n: 'customer_order_form'
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
                    path: '/customer_order_form',
                    name: '销售订单制单',
                    query: {
                        id: this.selectedRows[0].id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'customer_order_form'
                    }
                });
            },
            //导出
            handleExport() {
                if (this.isDetailed) {
                    this.vueMessage('warning', '请选择主表进行导出操作!');
                    return
                }
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一条单据导出!');
                    return
                }
                if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一个单据!');
                    return
                }
                document.getElementById('test123').click()
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

            handleCommand(command){
                if(command==='lockTrue'){
                    this.lock(true)
                }else if(command==='lockFalse'){
                    this.lock(true)
                }else{
                    this[command]()
                }
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
