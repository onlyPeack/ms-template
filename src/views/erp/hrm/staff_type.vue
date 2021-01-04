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
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                        ></button-bar>
                    </template>
                    <template slot="opt" slot-scope="scope" >
                        <el-button type="primary" size="mini"  @click="handleEdit(scope.row.id)">编辑</el-button>
                        <el-button type="info" v-if="scope.row.status ==0" size="mini"
                                   @click="handleUpdateStatus(scope.row.id,1)">禁用
                        </el-button>
                        <el-button type="info" v-if="scope.row.status ==1" size="mini"
                                   @click="handleUpdateStatus(scope.row.id,0)">启用
                        </el-button>
                        <el-button type="danger" size="mini"  @click="handleRowDelete(scope.row.id)">删除</el-button>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {page as pages, addObj, getObj, delObj, putObj, updateStatus} from '@/api/erp/hrm/staffType';
    export default {
        name: "staff_type",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                fileList: undefined,
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
                    index: false,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "retailPrice",
                            type: "sum"
                        }, {
                            name: "costPrice",
                            type: "sum"
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
                        label: "类别编码",
                        prop: "code",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "类别名称",
                        prop: "name",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "状态",
                        prop: "status",
                        minWidth: 160,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: 0,
                                label: '启用'
                            }, {
                                value: 1,
                                label: '禁用'
                            }
                        ],
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label:'操作',
                        prop:'opt',
                        minWidth: 160,
                        align:'center',
                        slot:true
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
            handleUpdateStatus(id, status) {
                updateStatus(id, status)
                    .then(response => {
                        if (response.status == 200) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.getList(this.page);
                        } else {
                            this.$notify({
                                title: '失败',
                                message: response.msg,
                                type: 'warning',
                                duration: 2000
                            })
                        }
                    });
            },
            //编辑
            handleEdit(id) {
                this.$router.push({
                    path: '/staff_type_form',
                    name: '人员类别制单',
                    query: {
                        id: id,
                        type: 'edit'
                    },
                    meta: {
                        i18n: 'staff_type_form'
                    }
                });
            },
            //删除方法
            handleRowDelete(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(id).then((res) => {
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
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = pages;
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
                const id = row.id;
                this.$router.push({
                    path: '/staff_type_form',
                    name: '人员类别制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'staff_type_form'
                    }
                });
            },
            handleAdd() {
                this.$router.push({
                    path: '/staff_type_form',
                    name: '人员类别制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'staff_type_form'
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
