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
                                    objectKey="CGFP"
                                    :objectType="isDetailed ? 1 : 0"
                                    :permission="permissionCopy"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
<!--                        <el-dropdown class="manyOptMenu">-->
<!--                            <el-button plain style="padding: 7px 20px;" type="primary">-->
<!--                                更多操作<i class="el-icon-arrow-down el-icon&#45;&#45;right" style="margin-right: -10px"></i>-->
<!--                            </el-button>-->
<!--                            <el-dropdown-menu slot="dropdown">-->
<!--                                <el-dropdown-item>-->
<!--                                    <div class="manyOpt" @click="handlePrint">&nbsp;&nbsp;&nbsp;&nbsp;打印</div>-->
<!--                                </el-dropdown-item>-->
<!--                                <el-dropdown-item>-->
<!--                                    <div class="manyOpt" @click="handleExport">&nbsp;&nbsp;&nbsp;&nbsp;导出</div>-->
<!--                                </el-dropdown-item>-->
<!--                                <el-dropdown-item>-->
<!--                                    <div class="manyOpt" @click="toVoid">&nbsp;&nbsp;&nbsp;&nbsp;作废</div>-->
<!--                                </el-dropdown-item>-->
<!--                            </el-dropdown-menu>-->
<!--                        </el-dropdown>-->
                        <el-dropdown @command="handleCommand" placement="bottom-start">
                            <el-button type="primary" plain>
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="handleExport" v-if="permission.exportBtn">导出　　　　&nbsp;</el-dropdown-item>
                                <el-dropdown-item command="handleEdit" v-if="permission.editBtn">编辑　　　　&nbsp;</el-dropdown-item>
                                <el-dropdown-item command="toVoid">作废　　　　&nbsp;</el-dropdown-item>
                                <el-dropdown-item command="handleRowDelete" v-if="permission.delBtn">删除　　　　&nbsp;</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot="menuRight">
                        <!--<el-switch v-model="isDetailed" active-text="详情" inactive-text="单据" class="el-switch-select"-->
                                   <!--@change="handleSwitchChange"></el-switch>-->
                    </template>
                </avue-crud>
            </div>
            <a id="test123" :href="openUrl+'/api/manager/financial-purchase-invoice/exportDetail?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].masterId:'')"></a>
        </basic-container>
    </list-container>
</template>

<script>
    import {batchDelBill, selectPage, selectPageByItem,cancel} from "@/api/erp/purchase/bill/invoiceOrder";
    import {userOption} from '@/util/table';
    import {openUrl} from '@/config/env';

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        name: "purchase_order",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        props: ['timeStamp'],
        data() {
            return {
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
                permissionCopy: {
                    addBtn: true,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: true,
                    exportBtn: false,
                    printBtn: true,
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
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "price",
                            type: "sum"
                        },
                        {
                            name: "amount",
                            type: "sum"
                        },
                        {
                            name: "tax",
                            type: "sum"
                        },
                        {
                            name: "taxPrice",
                            type: "sum"
                        },
                        {
                            name: "taxAmount",
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
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "billDate",
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
                        label: "发票类型",
                        prop: "invoiceType",
                        width: 110,
                        overHidden:true,
                        align: 'left',
                        type:'select',
                        search: true,
                        dicData: this.invoiceTypeOptions,
                    },
                    {
                        label: "采购员编号",
                        prop: "purchaserCode",
                        width: 90,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "采购员",
                        prop: "purchaserName",
                        width: 70,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "采购员部门",
                        prop: "departName",
                        width: 190,
                        overHidden:true,
                        search: true,
                        align: 'left',
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
                        width: 90,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "本次到票金额",
                        prop: "taxAmount",
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
                                "本次到票金额"
                            );
                        },
                    },
                    {
                        label: "不含税金额",
                        prop: "amount",
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
                                "不含税金额"
                            );
                        },
                    },
                    {
                        label: "税额",
                        prop: "tax",
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
                                "税额"
                            );
                        },
                    },
                    {
                        label: "发票代码",
                        prop: "invoiceCode",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "发票号码",
                        prop: "invoiceNo",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "开票日期",
                        prop: "invoiceDate",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "收票日期",
                        prop: "invoiceDate",
                        width: 100,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "整单备注",
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
            this.tableOption.column = this.detailedColumn;
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
                this.setList(this, 'CGFP');
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
                this.handleBillAdd(this,{path: '/purchase_invoice_form', name: '采购收票制单'});
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
                                data.records[i].supplierCode = data.records[i].mainDTO.supplierCode;
                                data.records[i].billNo = data.records[i].mainDTO.billNo;
                                data.records[i].departName = data.records[i].mainDTO.departName;
                                data.records[i].purchaserCode = data.records[i].mainDTO.purchaserCode;
                                data.records[i].purchaserId = data.records[i].mainDTO.purchaserId;
                                data.records[i].purchaserName = data.records[i].mainDTO.purchaserName;
                                data.records[i].invoiceType = data.records[i].mainDTO.invoiceType;
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
                    path: '/purchase_invoice_form',
                    name: '采购收票制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'purchase_invoice_form'
                    }
                });
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
                    path: '/purchase_invoice_form',
                    name: '采购收票制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'purchase_invoice_form'
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
                    path: '/purchase_invoice_form',
                    name: '采购收票制单',
                    query: {
                        id: this.selectedRows[0].id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'purchase_invoice_form'
                    }
                });
            },
            //导出
            handleExport() {
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
