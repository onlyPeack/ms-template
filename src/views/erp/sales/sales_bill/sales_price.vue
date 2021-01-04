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
                           @row-click="handleRowClick"
                           :summary-method="getSummaries"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    :permission="permissionCopy"
                                    objectKey="XSBJ"
                                    :objectType="isDetailed ? 1 : 0"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handlePrint="handlePrint"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handleExport="handleExport"></button-bar>
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
        </basic-container>
        <a id="test123"
           :href="openUrl+'/api/manager/sales-quotation/exportDetail?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].id:'')"></a>
    </list-container>
</template>

<script>
    import {selectPage, selectPageByItem, batchDelBill} from "@/api/erp/sales/bill/salesQuotation";
    import {openUrl} from '@/config/env';

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        props: ['timeStamp'],
        name: "sales_price",
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
                    exportBtn: true,
                },
                permission: {
                    addBtn: true,
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
                    exportBtn: true,
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
                            name: "billAmount",
                            type: "sum"
                        }, {
                            name: "tax",
                            type: "sum"
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        },
                         {
                            name: "amount",
                            type: "sum"
                        },
                        {
                            name: "qty",
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
                        label: "单据编号",
                        prop: "billNo",
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                        width: 140,
                        overHidden:true
                    }, {
                        label: "单据状态",
                        prop: "billStatus",
                        width: 70,
                        type: 'select',
                        align: 'left',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true,
                        overHidden:true
                    },
                    {
                        label: "销售员ID",
                        prop: "salerId",
                        hide: true,
                    }, {
                        label: "销售员编号",
                        prop: "salerCode",
                        align: 'left',
                        width: 90,
                        overHidden:true
                    }, {
                        label: "销售员",
                        prop: "salerName",
                        width: 70,
                        align: 'left',
                        search: true,
                        overHidden:true
                    }, {
                        label: "销售部门",
                        prop: "salerDepart",
                        width: 190,
                        search: true,
                        align: 'left',
                        overHidden:true
                    }, {
                        label: "客户ID",
                        prop: "customerId",
                        hide: true
                    }, {
                        label: "客户编号",
                        prop: "customerCode",
                        width: 80,
                        align: 'left',
                        overHidden:true
                    }, {
                        label: "客户名称",
                        prop: "customerName",
                        width: 170,
                        search: true,
                        overHidden:true
                    }, {
                        label: "客户等级",
                        prop: "customerGrade",
                        width: 80,
                        align: 'left',
                        overHidden:true
                    }, {
                        label: "客户类型",
                        prop: "customerType",
                        width: 80,
                        align: 'left',
                        overHidden:true
                    }, {
                        label: "金额",
                        prop: "billAmount",
                        width: 80,
                        align: 'right',
                        textColor: "#ff0000",
                        overHidden:true,
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
                    },{
                        label: "价税合计",
                        prop: "taxBillAmount",
                        width: 80,
                        align: 'right',
                        textColor: "#ff0000",
                        overHidden:true,
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
                    }, {
                        label: "报价有效期",
                        prop: "usefulDate",
                        width: 110,
                        sortable: true,
                        type: 'date',
                        overHidden:true,
                        align: 'left'
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        width: 130,
                        align: 'left',
                        search: true,
                        sortable: true,
                        overHidden:true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期'
                    },
                    {
                        label: "整单备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                    },
                ],
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    }, {
                        label: "单据编号",
                        prop: "billNo",
                        width: 140,
                        search: true,
                        sortable: true,
                        fixed: true,
                        overHidden:true,
                        align: 'left'
                    }, {
                        label: "单据状态",
                        prop: "billStatus",
                        width: 70,
                        overHidden:true,
                        type: 'select',
                        align: 'left',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },{
                        label: "客户编号",
                        prop: "customerCode",
                        width: 70,
                        overHidden:true,
                        align: 'left',
                    }, {
                        label: "客户名称",
                        prop: "customerName",
                        width: 170,
                        overHidden:true,
                        search: true,
                        align: 'left',
                    }, {
                        label: "商品名称",
                        prop: "skuName",
                        width: 120,
                        overHidden:true,
                        search: true,
                        align: 'left'
                    },
                    {
                        label: "分类",
                        prop: "categoryName",
                        width: 80,
                        overHidden:true,
                        search: true
                    },
                    {
                        label: "品牌",
                        prop: "brandName",
                        width: 80,
                        overHidden:true,
                        search: true
                    },
                    {
                        label: "系列",
                        prop: "seriesName",
                        width: 80,
                        overHidden:true,
                        search: true
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        width: 85,
                        overHidden:true,
                        search: true
                    }, {
                        label: "规格型号",
                        prop: "specifications",
                        width: 100,
                        overHidden:true,
                        search: true
                    },
                    {
                        label: "单位",
                        prop: "unit",
                        width: 50,
                        overHidden:true,
                        align: 'center',
                    }, {
                        label: "数量",
                        prop: "qty",
                        width: 60,
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
                                "数量"
                            );
                        },
                    }, {
                        label: "面价",
                        prop: "surfacePrice",
                        width: 70,
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
                    }, {
                        label: "折扣",
                        prop: "discount",
                        width: 70,
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
                                "折扣"
                            );
                        },
                    }, {
                        label: "含税单价",
                        prop: "taxPrice",
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
                                "含税单价"
                            );
                        },
                    }, {
                        label: "不含税单价",
                        prop: "price",
                        width: 100,
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
                                "不含税单价"
                            );
                        },
                    }, {
                        label: "不含税金额",
                        prop: "amount",
                        width: 100,
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
                                "不含税金额"
                            );
                        },
                    }, {
                        label: "税率(%)",
                        prop: "taxRate",
                        width: 70,
                        overHidden:true,
                        align: 'right',
                        type: 'select',
                        dicData: this.taxRateOptions,
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "税率(%)"
                            );
                        },
                    }, {
                        label: "税额",
                        prop: "tax",
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
                                "税额"
                            );
                        },
                    }, {
                        label: "价税合计",
                        prop: "taxAmount",
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
                                "价税合计"
                            );
                        },
                    }, {
                        label: "货期",
                        prop: "deliveryDate",
                        width: 50,
                        overHidden:true,
                        align: 'center'
                    }, {
                        label: "备注",
                        prop: "note",
                        overHidden:true,
                        minWidth: 120
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
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getConfigList() {
                this.setList(this, 'XSBJ');
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
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
            //导出
            handleExport() {
                if (this.isDetailed) {
                    this.vueMessage('warning', '请选择主表进行导出操作!');
                    return
                }
                if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一个单据!');
                    return
                }
                document.getElementById('test123').click()
                // $("#test123").click()

                //this.$refs.crud.rowExcel();
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
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
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
                this.handleBillAdd(this, {path: '/sales_price_form', name: '销售报价制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.permission.exportBtn = false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.exportBtn = false;
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
                let query = JSON.parse(JSON.stringify(queryObj));
                query.startValidityPeriod = query.startValidityPeriod + ' 00:00:00';
                query.endValidityPeriod = query.startValidityPeriod + ' 23:59:59';
                select(queryObj).then(res => {
                    const data = res.data.data;
                    if (this.isDetailed) {
                        for (let i in data.records) {
                            if (data.records[i].mainDTO) {
                                data.records[i].billDate = !this.isEmpty(data.records[i].mainDTO.billDate) ? data.records[i].mainDTO.billDate : '';
                                data.records[i].customerName = !this.isEmpty(data.records[i].mainDTO.customerName) ? data.records[i].mainDTO.customerName : '';
                                data.records[i].customerCode = !this.isEmpty(data.records[i].mainDTO.customerCode) ? data.records[i].mainDTO.customerCode : '';
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
                    path: '/sales_price_form',
                    name: '销售报价制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'sales_price_form'
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
                    path: '/sales_price_form',
                    name: '销售报价制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'sales_price_form'
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


            handleCommand(command){
                this[command]()
            },
        }
    }
</script>
