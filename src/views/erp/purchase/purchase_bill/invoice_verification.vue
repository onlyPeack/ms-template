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
                                    objectKey="FPHX"
                                    :objectType="isDetailed ? 1 : 0"
                                    :permission="permissionCopy"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleToVoid="toVoid"
                                    @handleExport="handleExport"></button-bar>
<!--                        <el-dropdown class="manyOptMenu" v-if="!isDetailed">-->
<!--                            <el-button plain style="padding: 7px 20px;" type="primary">-->
<!--                                更多操作<i class="el-icon-arrow-down el-icon&#45;&#45;right" style="margin-right: -10px"></i>-->
<!--                            </el-button>-->
<!--                            <el-dropdown-menu slot="dropdown">-->
<!--                                <el-dropdown-item>-->
<!--                                    <div class="manyOpt" @click="toVoid">&nbsp;&nbsp;&nbsp;&nbsp;作废</div>-->
<!--                                </el-dropdown-item>-->
<!--                            </el-dropdown-menu>-->
<!--                        </el-dropdown>-->
<!--                        <el-button icon="el-icon-unlock" type="warning" plain @click="toVoid" >作废</el-button>-->
                        <el-dropdown @command="handleCommand" placement="bottom-start">
                            <el-button type="primary" plain>
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="handleEdit" v-if="permission.editBtn">编辑　　　　&nbsp;</el-dropdown-item>
                                <el-dropdown-item command="handleRowDelete" v-if="permission.delBtn">删除　　　　&nbsp;</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot="menuRight">
                        <el-checkbox v-model="isDetailed" @change="handleSwitchChange" style="margin-right: 20px;">显示详情</el-checkbox>
                    </template>
                </avue-crud>
            </div>
            <a id="test123" :href="openUrl+'/api/manager/financial-purchase-invoice/exportDetail?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].id:'')"></a>
        </basic-container>
    </list-container>
</template>

<script>
    import {batchDelBill, selectPage, selectPageByItem,cancel} from "@/api/erp/financial/PurchaseInvoiceVerification";
    import {userOption} from '@/util/table';
    import {openUrl} from '@/config/env';

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        name: "invoice_verification",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
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
                listQuery: {},
                permissionCopy: {
                    addBtn: true,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: true,
                    exportBtn: false,
                    printBtn: false,
                    voidBtn:true
                },
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                    exportBtn: true,
                    printBtn: true,
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
                    selectionWidth: 60,
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
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "invoiceAmount",
                            type: "sum"
                        },
                        {
                            name: "notVerificationAmount",
                            type: "sum"
                        },
                        {
                            name: "returnQty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "verificationAmount",
                            type: "sum"
                        },
                        {
                            name: "purchaseQty",
                            type: "sum"
                        },
                        {
                            name: "verificationQty",
                            type: "sum"
                        },
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
                        width: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        width: 70,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "供应商编号",
                        prop: "supplierCode",
                        width: 90,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "供应商名称",
                        prop: "supplierName",
                        minWidth: 90,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "发票号码",
                        prop: "invoiceNo",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "发票代码",
                        prop: "invoiceCode",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "发票金额",
                        prop: "invoiceAmount",
                        width: 100,
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
                                "发票金额"
                            );
                        },
                    },
                    {
                        label: "核销金额",
                        prop: "verificationAmount",
                        width: 100,
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
                                "核销金额"
                            );
                        },
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
                        label: "备注",
                        prop: "note",
                        minWidth: 100,
                        overHidden:true,
                        align: 'left',
                    }
                ],
                detailedColumn: [
                    {
                        label: "单据编号",
                        prop: "billNo",
                        width: 140,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        width: 70,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "采购订单号",
                        prop: "sourceBillNo",
                        width: 140,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "商品名称",
                        prop: "skuName",
                        width: 120,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        width: 80,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        width: 85,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        width: 100,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 50,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "核销数量",
                        prop: "verificationQty",
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
                                "核销数量"
                            );
                        },
                    },
                    {
                        label: "采购数量",
                        prop: "purchaseQty",
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
                                "采购数量"
                            );
                        },
                    },
                    {
                        label: "退货数量",
                        prop: "returnQty",
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
                                "退货数量"
                            );
                        },
                    },
                    {
                        label: "采购单价",
                        prop: "purchasePrice",
                        width: 100,
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
                                "采购单价"
                            );
                        },
                    },
                    {
                        label: "核销金额",
                        prop: "verificationAmount",
                        width: 100,
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
                                "核销金额"
                            );
                        },
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    }
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
            this.getConfigList();
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
            getConfigList() {
                this.setList(this, 'FPHX');
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
                this.handleBillAdd(this,{path: '/invoice_verification_form', name: '发票核销制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.permission.exportBtn = false;
                        this.permission.printBtn = false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.exportBtn = false;
                        this.permission.printBtn = false;
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
                            if(data.records[i].mainDTO){
                                data.records[i].supplierName = data.records[i].mainDTO.supplierName;
                                data.records[i].billNo = data.records[i].mainDTO.billNo;
                                data.records[i].billStatus = data.records[i].mainDTO.billStatus;
                                data.records[i].departName = data.records[i].mainDTO.departName;
                                data.records[i].purchaserCode = data.records[i].mainDTO.purchaserCode;
                                data.records[i].purchaserId = data.records[i].mainDTO.purchaserId;
                                data.records[i].purchaserName = data.records[i].mainDTO.purchaserName;
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
                console.log(1234);
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
                    path: '/invoice_verification_form',
                    name: '发票核销制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'invoice_verification_form'
                    }
                });
            },
            toVoid(){
                if (this.selectedRows.length != 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    if (row.billStatus != 4) {
                        this.vueMessage('warning', '该状态单据不能作废');
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
                    path: '/invoice_verification_form',
                    name: '发票核销制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'invoice_verification_form'
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
                    path: '/invoice_verification_form',
                    name: '发票核销制单',
                    query: {
                        id: this.selectedRows[0].id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'invoice_verification_form'
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
                this[command]()
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
