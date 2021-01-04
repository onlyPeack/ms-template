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
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    objectKey="HTMB"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                    <template slot="content" slot-scope="scope">
                        <div @click.top="selectBtn(scope.row)">
                            <a style="color: #3E90FE;cursor: pointer;">点击查看</a>
                        </div>

                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="65%"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" :title="this.budgetForm.id ? '修改版本更新':'新增版本更新'" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm"
                       class="insertBudget insertBudgetBudget">
                <template slot-scope="scope" slot="content">
                    <div style="width: 100%;  height: 270px;">
                        <avue-ueditor v-model="budgetForm.content"
                                      :options="ueditorOptions" style="width: 100%;"></avue-ueditor>
                    </div>
                </template>
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="budgetVisible = false">取消</el-button>
                <el-button type="primary" @click="budgetBtn(false)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="budgetBtn(true)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="selectVisible" v-if="selectVisible" width="65%"
                   @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="查看" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-form :option="insertBudget" v-model="data" ref="budgetForm"
                       class="insertBudget insertBudgetBudget" disabled>
                <template slot-scope="scope" slot="isDefault">
                    <div>
                        <el-switch
                                v-model="data.isDefault" disabled
                                :active-value="1"
                                :inactive-value="0"
                                active-text="是"
                                inactive-text="否">
                        </el-switch>
                    </div>
                </template>
                <template slot-scope="scope" slot="content">
                    <div style="width: 100%;  height: 280px;">
                        <avue-ueditor v-model="data.content" disabled
                                      :options="ueditorOptions" style="width: 100%;"></avue-ueditor>
                    </div>
                </template>
            </avue-form>
        </el-dialog>
    </list-container>
</template>

<script>
    var DIC = {
        IS: [{
            label: '否',
            value: 0,
        }, {
            label: '是',
            value: 1
        }]
    }
    import {page as pages, addObj, getObj, delObj, putObj} from '@/api/erp/config/version_update';
    import {uploadPath} from '@/api/erp/goods/storage'

    export default {
        name: "version_update",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                selectVisible: false,
                ueditorOptions: {
                    //普通图片上传
                    action: uploadPath,
                    customConfig: {},//wangEditor编辑的配置
                    props: {
                        res: 'data'
                    },
                },
                budgetForm: {},
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth: 82,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "标题",
                            prop: "title",
                            span: 24,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入标题",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "内容",
                            prop: "content",
                            span: 24,
                            formslot: true
                        },
                    ]
                },
                visible: false,
                invisible: false,
                budgetVisible: false,
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
                    delBtn: true,
                    editBtn: true,
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                data: {},
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
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
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
                        label: "标题",
                        prop: "title",
                        minWidth: 120,
                        overHidden: true,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: " 内容",
                        prop: "content",
                        minWidth: 120,
                        overHidden: true,
                        align: 'left',
                        slot: true
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
            selectBtn(row) {
                this.selectVisible = true;
                this.data = row;
            },
            handleSelectClose() {
                this.selectVisible = false;
            },
            handleUpdateStatus(id, status) {
            },
            handleBudgetClose() {
                this.budgetVisible = false;
            },
            budgetBtn(type) {
                this.$refs['budgetForm'].validate((valid) => {
                    if (valid) {
                        if (type) {
                            this.invisible = true;
                        } else {
                            this.visible = true;
                        }
                        let select = this.budgetForm.id ? putObj : addObj;
                        select(this.budgetForm).then(res => {
                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$refs.budgetForm ? this.$refs.budgetForm.resetForm() : '';
                                this.$nextTick(() => {
                                    this.$refs.budgetForm ? this.$refs.budgetForm.clearValidate() : '';
                                    this.vueSet(this, 'budgetForm', {
                                        isDefault: 0
                                    });
                                })
                                this.getList(this.page);
                            } else {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            }
                            if (type) {
                                this.invisible = false;
                            } else {
                                this.visible = false;
                                this.budgetVisible = false;
                            }
                        }).catch(() => {
                            if (type) {
                                this.invisible = false;
                            } else {
                                this.visible = false;
                                this.budgetVisible = false;
                            }
                        })
                    }
                })
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
                this.budgetForm = this.selectedRows[0];
                this.budgetVisible = true;
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1 || this.selectedRows.length > 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return false;
                }
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(this.selectedRows[0].id).then((res) => {
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
            },
            handleAdd() {
                this.budgetVisible = true;
                this.budgetForm = {isDefault: 0};
                this.vueSet(this, 'budgetForm', this.budgetForm);
            },
        }
    }
</script>

<style lang="scss">
    .insertBudgetBudget {
        .el-form > .el-row > .avue-group > .avue-group__item > .avue-form__group > .el-form-item--feedback {
            margin-bottom: 0px !important;

        }
        .el-form > .el-row > .el-col {
            height: 0px;
            margin-bottom: 0px !important;
        }
    }

    .avue-ueditor {
        .quill-editor {
            height: 270px !important;
            .ql-container {
                height: calc(100% - 70px) !important;
            }
        }
    }

</style>
