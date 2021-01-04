<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="avue-crud-container" v-if="isShow">
                <avue-crud ref="crud" class="avue-crud-left-index"
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
                    <template slot-scope="scope" slot="picUrl">
                        <div>
                            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                        </div>
                    </template>
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    objectKey="YFCSH"
                                    :objectType="isDetailed ? 1 : 0"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                        <el-button icon="el-icon-circle-close"  type="danger" plain v-if="clock" @click="clockBtn">结束初始化</el-button>
                        <div class="avue-crud-diag">
                            <img style="width: 12px;height: 12px;" src="http://hejigy.com.cn/jingao.png" />
                            <div>&nbsp;系统初始化数据完成后不可随意更改，请核对正确后结束初始化!</div>
                        </div>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {
        page  as selectPage,
        addObj,
        getObj,
        delObj,
        putObj,
        selectInitStatus,
        endInit
    } from '@/api/erp/financial/financialPayableInit';

    export default {
        name: "payable-init",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                clock:false,
                isDetailed: false,
                isShow: true,
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
                    searchShow: false,//首次加载是否显示搜索
                    searchSpan: 4,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "payAmount",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "供应商名称",
                        prop: "supplierName",
                        minWidth: 190,
                        overHidden:true,
                        align: 'left',
                        search: true,
                        searchLabelWidth: 100,

                    },
                    {
                        label: "业务日期",
                        prop: "billDate",
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                        searchLabelWidth: 100,

                    },
                    {
                        label: "付款到期日",
                        prop: "repayDate",
                        minWidth: 140,
                        overHidden:true,
                        align: 'left',
                        searchLabelWidth: 100,
                    },
                    {
                        label: "应付金额",
                        prop: "payAmount",
                        minWidth: 120,
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
                                "应付金额"
                            );
                        },
                        searchLabelWidth: 100,

                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 160,
                        overHidden:true,
                        align: 'left',
                        searchLabelWidth: 100,

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
            this.selectInitStatus();
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
            clockBtn(){
                endInit().then(res=>{
                    console.log(res)
                    if(res.data.code == 2000){
                        this.vueMessage('success','操作成功!');
                    }else{
                        this.vueMessage('warning',res.data.msg);
                    }
                    this.selectInitStatus();
                })
            },
            selectInitStatus(){
                selectInitStatus().then(res => {
                    if (res.data.data == 0) {
                        this.permission = {
                            addBtn: true,
                            delBtn: true,
                            editBtn: false,
                            viewBtn: false,
                        };
                        this.clock = true;
                    }else{
                        this.clock = false;
                        this.permission = {
                            addBtn: false,
                            delBtn: false,
                            editBtn: false,
                            viewBtn: false,
                        };
                    }
                })
            },
            getConfigList() {
                this.setList(this, 'YFCSH');
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
                this.handleBillAdd(this,{path: '/payable-init-form', name: '应付初始化制单'});
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPage;
                select(queryObj).then(res => {
                    const data = res.data.data;
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
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbClick(row) {
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
                const id = this.selectedRows[0].id;
                this.$router.push({
                    path: '/payable-init-form',
                    name: '应付初始化制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'payable-init-form'
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
                this.$refs.crud.rowExcel();
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
                    ids.push(row.id)
                });
                if (flag) {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delObj(ids).then((res) => {
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

<style lang="scss">
    .avue-crud-left-index{
        .avue-crud__left{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
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
        }
    }
</style>
