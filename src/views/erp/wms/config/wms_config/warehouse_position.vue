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
                        <button-bar type="lists"
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
                    </template>
                    <template slot="opt" slot-scope="scope" >
                        <el-switch
                                v-model="scope.row.status" :active-value="1"
                                :inactive-value="0" active-color="#C0CCDA" inactive-color="#188AE2" @change="handleUpdateStatus(scope.row.id,scope.row.status)"/>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="50%"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" :title="this.budgetForm.id ? '修改仓位信息':'新增仓位信息'" append-to-body
                   class="public-dialog insertBudgetDialog ">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm" class="insertBudget">
            </avue-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="budgetVisible = false">取消</el-button>
                <el-button type="primary" @click="budgetBtn(false)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="budgetBtn(true)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
        <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                        :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                        @handleClose="handleClosePublic"
                        @handleSubmit="handleSubmitPublic"></pubil-selector>
    </list-container>
</template>

<script>
    import {page as pages,delObj,updateStatus,getObj, addObj, putObj} from '@/api/erp/wms/config/warehousePosition'
    import {warehouseOption} from '@/util/table';
    export default {
        name: "warehouse",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                budgetForm:{},
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth:82,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "仓位编码",
                            prop: "code",
                            disabled: true,
                            placeholder: "自动生成",
                            span:12
                        },
                        {
                            label: "仓位名称",
                            prop: "name",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请填写仓位名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "所属仓库ID",
                            prop: "warehouseId",
                            display: false
                        },
                        {
                            label: "所属仓库",
                            prop: "warehouseName",
                            span: 12,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择所属仓库",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if(this.type == 'view'|| this.type == 'edit'){
                                    return
                                }
                                this.publicTitle = '请选择所属仓库';
                                this.typeName = 'warehouseType';
                                this.option = warehouseOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "仓位条码",
                            prop: "positionCode",
                            span:12
                        },
                        {
                            label: "最大体积",
                            prop: "maxVolume",
                            span:12
                        },
                        {
                            label: "最大重量",
                            prop: "maxWeight",
                            span:12
                        },
                        {
                            label: "仓位备注",
                            prop: "note",
                            type:"textarea",
                            span: 24,
                        },
                    ]
                },
                visible: false,
                invisible:false,
                budgetVisible: false,
                option: [],
                isSingle: true,
                publicVisible: false,
                publicTitle: '',
                typeName: '',
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
                    sumColumnList: [],
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
                        label: "仓位编码",
                        prop: "code",
                        minWidth: 80,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "仓位名称",
                        prop: "name",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "所属仓库",
                        prop: "warehouseName",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "仓位条码",
                        prop: "positionCode",
                        minWidth: 120,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "最大体积",
                        prop: "maxVolume",
                        minWidth: 100,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "最大重量",
                        prop: "maxWeight",
                        minWidth: 100,
                        overHidden:true,
                        align: 'center',
                    },
                    {
                        label: "仓位备注",
                        prop: "note",
                        minWidth: 150,
                        overHidden:true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label:'启用/禁用',
                        prop:'opt',
                        minWidth: 80,
                        overHidden:true,
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
                        this.budgetForm.type = "customer_attribute";
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
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'warehouseType') {
                        this.budgetForm.warehouseName = list[0].name
                        this.budgetForm.warehouseId = list[0].id
                    }

                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleUpdateStatus(id, status) {
                updateStatus(id, status)
                    .then(response => {
                        if (response.data.code == '2000') {
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
                                message: response.data.msg,
                                type: 'warning',
                                duration: 2000
                            })
                        }
                    });
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
                this.budgetForm   = {};
                this.budgetVisible = true;
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = pages;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
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

<style scoped lang="scss">

</style>
