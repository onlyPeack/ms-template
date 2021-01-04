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
                                    @handleDelete="handleRowDelete"
                                    @handleEdit="handleEdit"
                                    @handleSettingSubmit="handleSettingSubmit"
                        ></button-bar>
                    </template>
                    <template slot="opt" slot-scope="scope" >
                        <el-switch
                                v-model="scope.row.status == 0 ? true : false" @change="handleUpdateStatus(scope.row.id,scope.row.status == 0?1:0)"/>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {page as pages, addObj, getObj, delObj, putObj,updateStatus} from '@/api/erp/financial/account';
    export default {
        name: "subject",
        props: ['timeStamp'],
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
                    delBtn: true,
                    editBtn: true,
                    viewBtn: true,
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
                        label: "科目编码",
                        prop: "number",
                        minWidth: 100,
                        overHidden:true,
                        search: true,
                        sortable: true,
                        align: 'center',
                    },
                    {
                        label: "科目名称",
                        prop: "name",
                        minWidth: 100,
                        overHidden:true,
                        align: 'center',
                        search: true,
                    },
                    {
                        label: "科目类别",
                        prop: "groupKey",
                        minWidth: 100,
                        overHidden:true,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '1',
                                label: '负债类'
                            }, {
                                value: '2',
                                label: '损益类'
                            }, {
                                value: '3',
                                label: '所有者权益类'
                            }, {
                                value: '4',
                                label: '资产类'
                            }
                            //   ,{
                            //   value: '5',
                            //   label: '所有者权益'
                            // }, {
                            //   value: '6',
                            //   label: '成本'
                            // }, {
                            //   value: '7',
                            //   label: '营业收入'
                            // }, {
                            //   value: '8',
                            //   label: '营业成本及税金'
                            // }, {
                            //   value: '9',
                            //   label: '期间费用'
                            // }, {
                            //   value: '10',
                            //   label: '其他收益'
                            // }, {
                            //   value: '11',
                            //   label: '其他损失'
                            // }, {
                            //   value: '12',
                            //   label: '以前年度损益调整'
                            // }, {
                            //   value: '13',
                            //   label: '所得税'
                            // }
                        ]
                    },
                    {
                        label: "余额方向",
                        prop: "dcKey",
                        minWidth: 80,
                        overHidden:true,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '借方',
                                label: '借方'
                            },
                            {
                                value: '贷方',
                                label: '贷方'
                            }
                        ]
                    },
                    {
                        label: "科目属性",
                        prop: "attribute",
                        minWidth: 80,
                        overHidden:true,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: '无'
                            }, {
                                value: '1',
                                label: '银行科目'
                            }, {
                                value: '2',
                                label: '现金科目'
                            }, {
                                value: '3',
                                label: '现金等价物'
                            }
                        ]
                    },
                    {
                        label: "期末调汇",
                        prop: "isAdjustRate",
                        minWidth: 80,
                        overHidden:true,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: '否'
                            },
                            {
                                value: '1',
                                label: '是'
                            }
                        ]
                    },
                    {
                        label: "辅助核算",
                        prop: "detailJson",
                        minWidth: 80,
                        overHidden:true,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '1',
                                label: '银行账户'
                            }, {
                                value: '2',
                                label: '客户'
                            }, {
                                value: '3',
                                label: '供应商'
                            }, {
                                value: '4',
                                label: '部门'
                            }, {
                                value: '5',
                                label: '仓库'
                            }, {
                                value: '6',
                                label: '用户'
                            }, {
                                value: '7',
                                label: '项目'
                            }, {
                                value: '8',
                                label: '门店'
                            }, {
                                value: '9',
                                label: '商品'
                            }
                        ],
                    },
                    // {
                    //     label: "科目状态",
                    //     prop: "status",
                    //     minWidth: 120,
                    //     align: 'center',
                    //     type: 'select',
                    //     dicData: [
                    //         {
                    //             value: 0,
                    //             label: '启用'
                    //         }, {
                    //             value: 1,
                    //             label: '禁用'
                    //         }
                    //     ],
                    // },
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
                                message: response.msg,
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
                    path: '/subject_form',
                    name: '科目制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'subject_form'
                    }
                });
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1 && this.selectedRows.length > 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    //this.vueNotification('success', '提示', '请至少选择一条数据');
                    return false;
                }
                let flag = true;
                if (flag) {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
                }
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
                    for(let i in data.records){
                        data.records[i].vendibility = Number(data.records[i].qty) - Number(data.records[i].lockedQty)
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
                    path: '/subject_form',
                    name: '科目制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'subject_form'
                    }
                });
            },
            handleAdd() {
                this.handleBillAdd(this,{path: '/subject_form', name: '科目制单'});
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
