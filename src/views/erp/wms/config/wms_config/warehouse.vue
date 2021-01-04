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
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <template slot="opt" slot-scope="scope">
                        <el-switch
                                v-model="scope.row.status" :active-value="1"
                                :inactive-value="0" active-color="#C0CCDA" inactive-color="#188AE2"
                                @change="handleUpdateStatus(scope.row.id,scope.row.status)"/>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :selectType="1"
                        :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                        @handleClose="handleClosePublic"
                        @handleSubmit="handleSubmitPublic"></pubil-selector>
        <el-dialog :visible.sync="budgetVisible" v-if="budgetVisible" width="50%"
                   @close="handleBudgetClose"
                   :close-on-click-modal="false"
                   :before-close="handleBudgetClose" :title="this.budgetForm.id ? '修改仓库信息':'新增仓库信息'" append-to-body
                   class="public-dialog insertBudgetDialog ">
            <avue-form :option="insertBudget" v-model="budgetForm" ref="budgetForm" class="insertBudget">
                <template slot-scope="scope" slot="isOpenPosition">
                    <div class="tableItem">
                        <el-tooltip class="item" effect="dark" content="不启用仓位信息，创建仓库时系统将自动创建1个默认仓位，反之则需要手动创建仓位。"
                                    placement="top-start">
                            <img src="http://hejigy.com.cn/questionMarksBlue.png" style="margin-right: 6px;"/>
                        </el-tooltip>
                        <el-select v-model="budgetForm.isOpenPosition">
                            <el-option value="0" label="不启用"></el-option>
                            <el-option value="1" label="启用"></el-option>
                        </el-select>
                    </div>
                </template>
                <template slot-scope="scope" slot="location">
                    <div>
                        <area-cascader v-if="areaShow" type="all" v-model="selected" :level='1' placeholder="省/市/区"
                                       :data="$pcaa"></area-cascader>
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
    import {
        page as pages,
        delObj as batchDelBill,
        updateStatus,
        addObj,
        putObj,
        getObj
    } from '@/api/erp/wms/config/warehouse'
    import {commodityOption, positionOption, userOption} from '@/util/table';
    import {isMobile} from "@/util/validate";

    var DIC = {
        allocation: [{
            label: '数量核算',
            value: '0'
        }, {
            label: '数量金额核算',
            value: '1'
        }],
        inventory: [{
            label: '不控制',
            value: '0'
        }, {
            label: '预警提示',
            value: '1'
        }, {
            label: '不允许负库存',
            value: '2'
        }]
    }
    export default {
        props: ['timeStamp'],
        name: "warehouse",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                option: [],
                publicVisible: false,
                areaShow: true,
                publicTitle: '',
                typeName: '',
                selected: [],
                budgetForm: {},
                insertBudget: {
                    menuPosition: 'center',
                    labelWidth: 82,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "仓库编码",
                            prop: "code",
                            disabled: true,
                            placeholder: "自动生成",
                            span: 12
                        },
                        {
                            label: "仓库名称",
                            prop: "name",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请选择仓库",
                                rigger: "change"
                            }],
                        },
                        {
                            label: "仓库类型",
                            prop: "warehouseType",
                            span: 12,
                            align: 'center',
                            type: 'select',
                            rules: [{
                                required: true,
                                message: "请选择仓库类型",
                                rigger: "change"
                            }],
                            dicData: [
                                {
                                    value: '0',
                                    label: '普通仓库'
                                },
                                {
                                    value: '1',
                                    label: '门店仓库',
                                },
                                {
                                    value: '2',
                                    label: '供应商仓库'
                                }
                            ],
                        },
                        {
                            label: "仓库状态",
                            prop: "status",
                            span: 12,
                            align: 'center',
                            type: 'select',
                            dicData: [
                                {
                                    value: '0',
                                    label: '启用'
                                },
                                {
                                    value: '1',
                                    label: '停用',
                                },
                            ],
                        },
                        {
                            label: "仓位启用",
                            prop: "isOpenPosition",
                            span: 12,
                            align: 'center',
                            type: 'select',
                            rules: [{
                                required: true,
                                message: "请选择仓位信息",
                                rigger: "change"
                            }],
                            formslot: true,
                            dicData: [
                                {
                                    value: '0',
                                    label: '不启用'
                                },
                                {
                                    value: '1',
                                    label: '启用',
                                },
                            ],
                        },
                        {
                            label: "管理员",
                            prop: "managerName",
                            span: 12,
                            type: 'text',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择管理员",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                this.publicTitle = '请选择管理员';
                                this.typeName = 'userType';
                                this.option = userOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "所在国家",
                            prop: "country",
                            span: 12,
                            readonly: true
                        },
                        {
                            label: "所在地区",
                            prop: "location",
                            span: 12,
                            formslot: true
                        },
                        {
                            label: "详细地址",
                            prop: "address",
                            span: 24,
                        },
                        {
                            label: "仓库备注",
                            prop: "note",
                            type: "textarea",
                            span: 24,
                        },
                    ]
                },
                visible: false,
                invisible: false,
                budgetVisible: false,
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
                            name: "taxPrice",
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
                        label: "仓库编码",
                        prop: "code",
                        minWidth: 80,
                        overHidden: true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "仓库名称",
                        prop: "name",
                        minWidth: 100,
                        overHidden: true,
                        search: true,
                        align: 'center',
                    },
                    {
                        label: "仓库类型",
                        prop: "warehouseType",
                        minWidth: 80,
                        overHidden: true,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: '普通仓库'
                            },
                            {
                                value: '1',
                                label: '门店仓库',
                            },
                            {
                                value: '2',
                                label: '供应商仓库'
                            }
                        ],
                    },
                    {
                        label: "仓库管理员",
                        prop: "managerName",
                        minWidth: 90,
                        overHidden: true,
                        search: true,
                        align: 'center',
                    },

                    {
                        label: "所在地区",
                        prop: "location",
                        minWidth: 120,
                        overHidden: true,
                        align: 'center',
                    },
                    {
                        label: "详细地址",
                        prop: "address",
                        minWidth: 120,
                        overHidden: true,
                        align: 'center',
                    },
                    {
                        label: "仓库备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden: true,
                        span: 24,
                    },
                    {
                        label: '启用/禁用',
                        prop: 'opt',
                        minWidth: 80,
                        overHidden: true,
                        align: 'center',
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
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    if (this.typeName == 'userType') {
                        this.budgetForm.managerId = list[0].id;
                        this.budgetForm.managerCode = list[0].no;
                        this.budgetForm.managerName = list[0].name;
                    }
                }
                this.publicVisible = false;
            },
            handleBudgetClose() {
                this.budgetVisible = false;
            },
            budgetBtn(type) {
                if (this.selected.length > 0) {
                    if (this.budgetForm.province) {
                        this.budgetForm.province = this.selected[0];
                    }
                    if (this.budgetForm.city) {
                        this.budgetForm.city = this.selected[1];
                    }
                    if (this.budgetForm.county) {
                        this.budgetForm.county = this.selected[2];
                    }
                    this.budgetForm = this.getRegionInfo(this.selected, this.budgetForm, 'province', 'city', 'county');
                    if (this.budgetForm.regionCodes) {
                        this.budgetForm.regionCodes = this.selected;
                    }

                }
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
                                this.areaShow = false;
                                this.$nextTick(() => {
                                    this.$refs.budgetForm ? this.$refs.budgetForm.clearValidate() : '';
                                    this.vueSet(this, 'budgetForm', {country: '中国'});
                                    this.vueSet(this, 'selected', []);
                                    this.areaShow = true;
                                });
                                // this.budgetForm = {country: '中国'};
                                // this.vueSet(this, 'budgetForm', {country: '中国'});
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
            handleAdd() {
                this.budgetForm = {country: '中国',};
                this.budgetVisible = true;
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {
                    page: page.currentPage,
                    limit: page.pageSize,
                    selectType: 0
                });
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
                getObj(this.selectedRows[0].id).then(res => {
                    this.budgetForm = res.data.data;
                    this.selected = this.setRegionInfo(this.budgetForm.regionCodes);
                    this.budgetVisible = true;
                })

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
                if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '单次只能删除一条数据');
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

                            } else if (res.data.code == 401 || res.data.code == '401') {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
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

<style>

    .tableItem {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
</style>
