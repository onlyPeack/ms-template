<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :modal-append-to-body="false"
               :nowRow="nowRow"
               :before-close="handleClose" title="选择文章栏目" append-to-body class="public-dialog" custom-class="temp-dialog">

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
                   @row-click="handleRowClick"
                   :cell-style="handleCellStyle">
            <template slot-scope="scope" slot="pic">
                <el-image :src="scope.row.pic" style="height: 100px" v-if="scope.row.pic&&scope.row.pic!==''"></el-image>
            </template>
            <template slot="type" slot-scope="scope">
                <span>{{tempType[scope.row.type]}}</span>
            </template>
            <template slot="isBind" slot-scope="scope">
                    <span v-if="scope.row.isBind" style="color:#F56C6C;">是</span>
                    <span v-else style="color: #67C23A">否</span>
            </template>
        </avue-crud>


        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {page as selectPage} from '@/api/temp/articleControl';
    import {tempArea, tempType} from "../../views/temp/common/dic";

    export default {
        props: ['timeStamp', 'dialogVisible', 'isSingle', 'title', 'option', 'typeName', 'code', 'typeOption', 'id', 'itemVisible', 'selectType', 'operationType', 'craftId', 'config', 'discountLevel', 'nowRow', 'afterChoose'],
        name: "memberSelector",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),

        },
        data() {
            return {
                textMap: {//新增&编辑对话框顶部标题字典
                    update: '编辑会员信息',
                    create: '新增会员'
                },
                tempType,
                tempArea,
                showRecharge: false,
                dialogStatus: '',//当前表单为新建还是编辑
                isLoading: false,//按钮是否显示加载中
                isShow: true,
                searchDisable: false,
                dialogFormVisible: false,//是否展示新增品牌对话框
                addList: {//新增品牌数据存储
                    umsMemberInfo: {}
                },
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {//顶部按钮显示隐藏
                    addBtn: false,
                    delBtn: false,
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
                    expand:false,
                    //rowKey: 'id',
                    selection: !this.isSingle,
                    selectable:(row,index)=>{
                        return !row.isBind;
                    },
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    indexLabel: '序号',
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: true,//是否显示顶部搜索栏
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    menu: false,
                    menuWidth: 140,
                    delBtn: false,//行删除按钮是否显示
                    editBtn: false,//行编辑按钮是否显示
                    column: []
                },
                billColumn: [
                    {
                        label: "ID",
                        prop: "id",
                        align: 'center',
                    },
                    {
                        label: "栏目名称",
                        prop: "name",
                        minWidth: 160,
                        align: 'center',
                    },
                    // {
                    //     label: "文章标题",
                    //     prop: "title",
                    //     minWidth: 160,
                    //     align: 'center',
                    // },
                    // {
                    //     label: "描述",
                    //     prop: "description",
                    //     minWidth: 160,
                    //     align: 'center',
                    // },
                    // {
                    //     label: "缩略图",
                    //     prop: "pic",
                    //     minWidth: 160,
                    //     align: 'center',
                    //     type: 'select',
                    //     slot: true
                    // },
                    {
                        label: "排序",
                        prop: "sort",
                        minWidth: 160,
                        align: 'center',
                        type: 'select',
                    },
                    // {
                    //     label: "发布时间",
                    //     prop: "releaseTime",
                    //     minWidth: 160,
                    //     align: 'center',
                    // },
                    {
                        label: '关联栏目',
                        prop: 'columnName',
                        align: 'center'
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 160,
                        align: 'center',
                    }
                ],
            }
        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
            // console.log(this.$store.getters.userInfo.no,'no')
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            /**
             * 顶部新增按钮事件
             */
            handleAdd() {
                this.dialogFormVisible = true
                this.dialogStatus = 'create'
                this.addList = {
                    picUrl: ''
                }
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = selectPage;
                select(queryObj).then(res => {
                    const data = res.data;
                    this.page.total = data.total;
                    this.list = data.records;
                    for (let i = 0; i <this.list.length ; i++) {
                        this.list[i].isBind=this.list[i].mid&&this.list[i].mid!==''
                        delete this.list[i].children
                    }
                    this.loading = false;
                    this.searchDisable = false;
                    //this.handleSelectionClear();
                }, error => {
                    this.showError('失败,' + error)
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
                this.selectedRows = this.selectedRows.concat(selection);
                let hash = {}
                this.selectedRows = this.selectedRows.reduce(function (item, next) {
                    hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                    return item
                }, [])
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
                    path: '/brandForm',
                    name: '品牌管理制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'brandForm'
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
            /**
             *多选删除方法
             */
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
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteMultiBrand(ids).then((res) => {
                            if (res.data.code === 200 || res.data.code === 2000) {
                                this.showSuccess('品牌删除成功')
                            } else {
                                this.showError('品牌删除失败' + res.data.msg || res.data.data)
                            }
                        }, error => this.showError('品牌删除失败' + error));
                    });
                }
            },
            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.$set(this.addList.umsMemberInfo, 'qualification', res.data.url)
            },
            /**
             * 图片上传之前添加参数
             * @param res
             * @param done
             * @param loading
             */
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG或png 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isPNG || isJPG && isLt2M;
            },
            /**
             * 添加&编辑会员信息
             */
            listSubmit() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method = this.dialogStatus === 'create' ? addBrand : updateMember
                        let message = this.dialogStatus === 'create' ? "品牌新增" : "会员信息编辑"
                        if (this.addList.password) {
                            delete this.addList.password
                        }
                        if (this.addList.payPassword) {
                            delete this.addList.payPassword
                        }

                        method(this.addList.id, this.addList).then(res => {
                            if (Number(res.data.code) === 2000) {
                                this.showSuccess(message + '成功')
                            } else {
                                this.showError(message + "失败" + res.data.msg || res.data.data)
                            }
                        }, error => this.showError(message + "失败" + error))
                    }
                })
            },

            /**
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message) {
                this.$message.success(message)
                this.init()
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message) {
                this.$message.error(message)
                this.isLoading = false
                this.loading = false;
                this.searchDisable = false;
            },

            /**
             * 初始化方法
             */
            init() {
                //初始化所有状态
                this.dialogFormVisible = false
                this.showRecharge = false
                this.isLoading = false
                this.getList(this.page)
            },

            /**
             * 表格编辑按钮事件
             * index 当前按钮索引值
             * row 当前行中数据
             */
            handleUpdate(index, row) {
                this.dialogFormVisible = true
                this.dialogStatus = 'update'
                this.addList = row
            },


            /**
             * 从父组件中接收的关闭对话框方法
             */
            handleClose() {
                this.$emit('handleClose');
            },

            /**
             * 关闭标签
             */
            handleCloseTag(index) {
                this.selectedRows.splice(index, 1);
            },

            handleRowClick(row) {
                if (this.isSingle) {
                    this.$emit('handleSubmit', row);
                } else {
                    if(!row.isBind){
                        this.$refs.crud.toggleSelection([row]);
                    }

                }
            },

            handleSubmit() {
                if (this.selectedRows.length > 1 && this.isSingle) {
                    this.$message.warning('只允许关联一个公共模板')
                    return false
                }
                this.$emit('handleSubmit', this.selectedRows);
            }
        }
    }
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

    .public-dialog .temp-dialog {
        margin-top: 3vh !important;
    }
</style>
