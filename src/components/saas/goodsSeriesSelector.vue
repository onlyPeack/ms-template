<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :modal="true"
               :before-close="handleClose" title="商品系列选择" append-to-body class="public-dialog">
        <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
            <basic-container>
                <div class="avue-crud-container">
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
                               @row-click="rowClick"
                               :cell-style="handleCellStyle">
                    </avue-crud>
                </div>
            </basic-container>
        </list-container>
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="handleClose">取 消</el-button>-->
<!--            <el-button type="primary" @click="handleSubmit">确 定</el-button>-->
<!--        </div>-->
    </el-dialog>
</template>

<script>
    import {page as selectPage,} from '@/api/erp/saas/goodsSeries';
    export default {
        props: ['timeStamp','dialogVisible', 'isSingle','option','typeName','code','typeOption','id','itemVisible','selectType','operationType','craftId','config','discountLevel'],
        name: "brandManagerSelector",
        data() {
            return {
                dialogStatus: '',//当前表单为新建还是编辑
                isLoading:false,//按钮是否显示加载中
                isShow: true,
                searchDisable: true,
                dialogFormVisible:false,//是否展示新增品牌对话框
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {//顶部按钮显示隐藏
                    addBtn: true,
                    delBtn: true,
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
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: true,
                    menu:false,
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    delBtn:false,//行删除按钮是否显示
                    editBtn:false,//行编辑按钮是否显示
                    column: []
                },
                billColumn: [
                    {
                        label: "系列ID",
                        prop: "id",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "系列名称",
                        prop: "name",
                        minWidth: 160,
                        align: 'center',
                        search: true,

                    },
                    {
                        label: "关联品牌",
                        prop: "brandName",
                        minWidth: 160,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "关联分类",
                        prop: "seriesName",
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
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPage;
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
                try {
                    if(selection.length>1){
                        this.$refs.crud.toggleSelection();
                        //this.$refs.crud.toggleSelection([this.list[selection[selection.length-1].index]]);
                        this.$refs.crud.toggleSelection([this.list[selection[selection.length-1].$index]]);
                    }
                    this.selectedRows = selection;
                }catch (e) {}
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


            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message){
                this.$message.success(message)
                this.init()
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message){
                this.$message.error(message)
                this.isLoading=false
            },

            /**
             * 初始化方法
             */
            init(){
                //初始化所有状态
                this.dialogFormVisible = false
                this.isLoading=false
                this.getList(this.page)
            },

            /**
             * 从父组件中接收的关闭对话框方法
             */
            handleClose() {
                this.$emit('handleClose');
            },

            // /**
            //  * 确认选择事件
            //  */
            // handleSubmit() {
            //     if (this.selectedRows.length < 1) {
            //         this.vueMessage('warning', '请至少选择一条数据');
            //         return false;
            //     }
            //     let row=this.selectedRows.concat()
            //     let ids = {
            //         arr:row.splice(-1),
            //         type:'series',
            //     };
            //     this.$emit('handleSubmit', ids);
            // },

            /**
             *行单击
             */
            rowClick(row){
                let ids = {
                    arr:row,
                    type:'series',
                };
                this.$emit('handleSubmit', ids);
            }
        }
    }
    /*当前使用:全部商品关联分类(单选)*/
</script>

<style lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

</style>
