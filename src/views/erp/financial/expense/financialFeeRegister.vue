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
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    objectKey="FYDJ"
                                    :objectType="isDetailed ? 1 : 0"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <!--<template slot="menuRight">-->
                        <!--<el-switch v-model="isDetailed" active-text="详情" inactive-text="单据" class="el-switch-select"-->
                                   <!--@change="handleSwitchChange"></el-switch>-->
                    <!--</template>-->
                    <template slot-scope="scope" slot="registerType">
                        <div>
                            <span
                                    v-for="item in registerTypeOptions"
                                    :key="item.value"
                                    :label="item.labelDefault"
                                    :value="item.value" v-if="scope.row.registerType==item.value">
                                {{item.labelDefault}}
                            </span>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="makeAccountType">
                        <div>
                            <span
                                    v-for="item in makeAccountTypeOptions"
                                    :key="item.value"
                                    :label="item.labelDefault"
                                    :value="item.value" v-if="scope.row.makeAccountType==item.value">
                                 {{item.labelDefault}}
                            </span>
                        </div>
                    </template>
                </avue-crud>
                <a id="test123"
                   :href="openUrl+'/api/manager/financial-fee-register/exportFee?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].id:'')"></a>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {selectPage, selectPageByItem, batchDelBill} from "@/api/erp/financial/feeRegisterService";
    import {getObj as getSetting} from "@/api/erp/config/index";
    import {getTypeValue} from '@/api/dict/dictValue/index';
    export default {
        name: "financialFeeRegister",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
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
                    selectionWidth: 60,
                    border: true,
                    index: true,
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
                            name: "registerAmount",
                            type: "sum"
                        },
                    ],
                    column: []
                },
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "登记单位",
                        prop: "companyName",
                        minWidth: 180,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "登记类型",
                        prop: "registerType",
                        minWidth: 180,
                        sortable: true,
                        align: 'left',
                    },
                    {
                        label: "账户",
                        prop: "accountCode",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "账户名称",
                        prop: "accountName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "科目编号",
                        prop: "subjectCode",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "科目名称",
                        prop: "subjectName",
                        minWidth: 120,
                        align: 'left',
                    },
                    // {
                    //     label: "操作员",
                    //     prop: "salerName",
                    //     minWidth: 120,
                    //     align: 'left',
                    // },
                    // {
                    //     label: "操作员工号",
                    //     prop: "salerCode",
                    //     minWidth: 120,
                    //     align: 'left',
                    // },
                    // {
                    //     label: "操作员部门",
                    //     prop: "salerDepartName",
                    //     minWidth: 120,
                    //     align: 'left',
                    // },
                    {
                        label: "报销人",
                        prop: "userName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "登记金额",
                        prop: "registerAmount",
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
                                "登记金额"
                            );
                        },
                    },
                    {
                        label: "单据日期",
                        prop: "billDate",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                ],
                billColumn: [
                    {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "单据状态",
                        prop: "billStatus",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    },
                    {
                        label: "登记类型",
                        prop: "registerType",
                        minWidth: 180,
                        sortable: true,
                        slot: true,
                        align: 'left',
                    },
                    // {
                    //     label: "做账类型",
                    //     prop: "makeAccountType",
                    //     minWidth: 180,
                    //     sortable: true,
                    //     align: 'left',
                    //     slot: true,
                    // },
                    {
                        label: "单据日期",
                        prop: "billDate",
                        minWidth: 120,
                        align: 'left',
                        search: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                ],
                makeAccountTypeOptions:[],
                registerTypeOptions: [],
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
            this.tableOption.column = this.detailedColumn;
            this.getConfigList();
            getTypeValue('comm_tmp_make_account_type').then(response => {
                this.makeAccountTypeOptions = response.data.data.rows;
            });
            getTypeValue('comm_tmp_register_type').then(response => {
                this.registerTypeOptions = response.data.data.rows;
            });
            this.getList(this.page);

        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getConfigList() {
                this.setList(this, 'FYDJ');
            },
            handleSettingSubmit(obj) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption = obj;
                    this.billColumn = obj.column;
                    this.isShow = true;
                })
            },
            handleAdd() {
                this.handleBillAdd(this,{path: '/financialFeeRegisterForm', name: '费用登记单制单'});
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.tableOption.showSummary = true;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.tableOption.showSummary = false;
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
                select(queryObj).then(res => {
                    const data = res.data.data;
                        for (let i in data.records) {
                            if (data.records[i].mainDTO) {
                                data.records[i].billNo = data.records[i].mainDTO.billNo;
                                data.records[i].billDate = data.records[i].mainDTO.billDate;
                                data.records[i].registerType = data.records[i].mainDTO.registerType;
                                data.records[i].companyName = data.records[i].mainDTO.companyName;
                                data.records[i].billStatus = data.records[i].mainDTO.billStatus;
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
                    path: '/financialFeeRegisterForm',
                    name: '费用登记单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'financialFeeRegisterForm'
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
                    path: '/financialFeeRegisterForm',
                    name: '费用登记单制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'financialFeeRegisterForm'
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
                if (this.selectedRows.length > 1 || this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一个单据!');
                    return
                }
                document.getElementById('test123').click()
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
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
        }
    }
</script>

<style scoped lang="scss">

</style>
