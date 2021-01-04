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
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                        ></button-bar>
                    </template>
                    <template slot-scope="scope" slot="picUrl">
                        <div>
                            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                        </div>
                    </template>
                    <template slot="opt" slot-scope="scope" >
                        <el-switch
                                v-model="scope.row.status == 0 ? true : false" @change="handleUpdateStatus(scope.row.id,scope.row.status == 0?1:0)"/>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="50%"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" :title="this.budgetForm.id ? '修改商品系列':'新增商品系列'" append-to-body
                   class="public-dialog insertBudgetDialog">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm" class="insertBudget">
                <template slot-scope="scope" slot="picUrl">
                    <div style="margin-left: 10px;">
                        <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card"
                                   :show-file-list="false"
                                   accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
                            <img v-if="budgetForm.picUrl" :src="budgetForm.picUrl"
                                 style="max-width: 148px;max-height:148px;display: block;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <i v-if="budgetForm.picUrl" class="el-icon-delete el-icona" @click.stop="deletePreview"></i>
                        </el-upload>
                    </div>
                </template>
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="budgetVisible = false">取消</el-button>
                <el-button type="primary" @click="budgetBtn(false)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="budgetBtn(true)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
    </list-container>
</template>

<script>
    import {page  as pages , addObj, getObj, delObj, putObj, start, stop} from '@/api/erp/goods/series';
    import {uploadPath} from '@/api/erp/goods/storage'

    export default {
        props: ['timeStamp'],
        name: "series",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                uploadPath,
                budgetForm:{},
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth: 87,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "系列名称",
                            prop: "name",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入系列名称",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "子系列名称",
                            prop: "subName",
                            span: 12,
                        },
                        {
                            label: "关联品牌",
                            prop: "brandId",
                            span: 12,
                            type: 'select',
                            align: 'center',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/brand/allBrand',
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择关联品牌",
                                trigger: "change"
                            }],
                            props: {
                                value: 'id',
                                label: 'name'
                            },
                        },
                        {
                            label: "排序",
                            prop: "sortOrder",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入排序",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "系列图片",
                            prop: "picUrl",
                            row: true,
                            span: 24,
                            formslot: true,
                        },
                        {
                            label: "介绍",
                            prop: "desc",
                            type: 'textarea',
                            row: true,
                            span: 24,
                        },
                    ]
                },
                visible: false,
                invisible:false,
                budgetVisible: false,
                fileList: undefined,
                searchDisable: false,
                isShow: true,
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
                    editBtn:true,
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
                    indexLabel:'序号',
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
                    // {
                    //     label: "系列编码",
                    //     prop: "id",
                    //     minWidth: 120,
                    //     align: 'center',
                    // },
                    {
                        label: "系列名称",
                        prop: "name",
                        minWidth: 120,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "子系列名称",
                        prop: "subName",
                        minWidth: 120,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "所属品牌",
                        prop: "brandName",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "排序",
                        prop: "sortOrder",
                        minWidth: 80,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "系列图片",
                        prop: "picUrl",
                        minWidth: 120,
                        overHidden:true,
                        align: 'center',
                        slot: true
                    },
                    {
                        label: "介绍",
                        prop: "desc",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
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
            handleBudgetClose(){
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
                        this.budgetForm.type = "customer_type";
                        select(this.budgetForm).then(res => {
                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });

                                this.$refs.budgetForm ? this.$refs.budgetForm.resetForm() : '';
                                this.$nextTick(() => {
                                    this.$refs.budgetForm ? this.$refs.budgetForm.clearValidate() : '';
                                })
                                this.budgetForm = {};
                                this.vueSet(this, 'budgetForm', {});
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
            handleUpdateStatus(id, status) {
                this.$confirm('您确定执行该操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(status == 0){
                        start(id)
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
                    }else{
                        stop(id)
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
                this.budgetForm   = this.selectedRows[0];
                this.budgetVisible = true;
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                this.selectedRows.forEach((row) => {
                    ids.push(row.id)
                });
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
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
            },
            deletePreview(){
                this.budgetForm.picUrl = ''
            },
            uploadPicUrl: function (response) {
                this.budgetForm.picUrl = response.data.url;
            },
            handleAdd() {
                this.budgetForm   = {};
                this.budgetVisible = true;
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
