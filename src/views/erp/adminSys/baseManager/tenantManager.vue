<template>
    <div>
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
                    <template slot-scope="scope" slot="picUrl">
                        <div>
                            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                        </div>
                    </template>
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"
                                    @handleForbidden="handleForbidden"></button-bar>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {
        page as pages,
        addObj,
        getObj,
        delObj,
        putObj,
        updateUser,
        getOwner,
        forbidden
    } from '@/api/admin/tenant/index';
    export default {
        name: "userManager",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
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
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: true,
                    forbiddenBtn: true,
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
                    index: false,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    column: []
                },
                billColumn: [
                    {
                        label: "编码",
                        prop: "code",
                        sortable: true,
                        search: true,
                        align: 'center',
                        minWidth: 120,
                    },
                    {
                        label: "租户名称",
                        prop: "name",
                        minWidth: 240,
                        align: 'center',
                        search: true,

                    },
                    {
                        label: "绑定号码",
                        prop: "registerPhone",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "所属行业",
                        prop: "industry",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "公司规模",
                        prop: "companyScale",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "认证状态",
                        prop: "authenticationStatus",
                        minWidth: 120,
                        type: 'select',
                        align: 'center',
                        dicData: [
                            {
                                value: '0',
                                label: '待审核'
                            },
                            {
                                value: '1',
                                label: '已认证'
                            },
                            {
                                value: '2',
                                label: '已驳回'
                            },
                            {
                                value: '3',
                                label: '禁用'
                            }
                        ],
                    },
                    {
                        label: "注册时间",
                        prop: "crtTime",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "当前版本",
                        prop: "currentVersion",
                        minWidth: 120,
                        type: 'select',
                        align: 'center',
                        dicData: [
                            {
                                value: '0',
                                label: '免费版'
                            },
                            {
                                value: '1',
                                label: '标准版'
                            },
                            {
                                value: '2',
                                label: '高级版'
                            }
                        ],
                    },
                    {
                        label: "版本有效期",
                        prop: "startTime",
                        minWidth: 120,
                        align: 'center',
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
            handleAdd() {
                // this.$router.push({
                //     path: '/userManagerForm',
                //     name: '租户管理制单',
                //     query: {
                //         type: 'add'
                //     },
                //     meta: {
                //         i18n: 'userManagerForm'
                //     }
                // });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = pages;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.list = data.rows;
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
                const id = row.id;
                // this.$router.push({
                //     path: '/userManagerForm',
                //     name: '用户管理制单',
                //     query: {
                //         id: id,
                //         type: 'view'
                //     },
                //     meta: {
                //         i18n: 'userManagerForm'
                //     }
                // });
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
                const id = this.selectedRows[0].tenantId;
                this.$router.push({
                    path: '/tenantManagerView',
                    name: '租户管理详情',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'tenantManagerView'
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
                if (this.selectedRows.length < 1 || this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一条数据');
                    return false;
                }
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(this.selectedRows[0].id).then((res) => {
                        if (res.status == 200) {
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
            },
            handleForbidden(form, index) {
                if (this.selectedRows.length < 1 || this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一条数据');
                    return false;
                }
                this.$confirm('确认禁止该租户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    forbidden(this.selectedRows[0].id).then((res) => {
                        if (res.status == 200) {
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
        }
    }
</script>

<style scoped lang="scss">

</style>
