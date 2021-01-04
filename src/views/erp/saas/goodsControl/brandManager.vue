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
                           :cell-style="handleCellStyle">
                    <template slot-scope="scope" slot="picUrl">
                        <div>
                            <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                        </div>
                    </template>
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </avue-crud>
            </div>
            <!-- 新增或修改对话框 -->
            <el-dialog modal-append-to-body append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
                <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="140px" size="medium">
                    <el-form-item label="品牌商名称" prop="name">
                        <el-input v-model="addList.name" style="width: 20.83vw"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名称" prop="nameEn">
                        <el-input v-model="addList.nameEn" style="width:20.83vw"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sortOrder">
                        <el-input v-model="addList.sortOrder" style="width: 20.83vw"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌LOGO" prop="picUrl">
                        <el-upload
                                class="avatar-uploader"
                                action="api/saas/storage/create"
                                :show-file-list="false"
                                accept=".jpg,.jpeg,.png,.svg,.gif"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="addList.picUrl" :src="addList.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div class="el-upload__tip" slot="tip">
                                <ul style="padding: 0;margin-left: 14px;">
                                    <li>只能上传jpg/png/svg/gif文件，且不超过1MB</li>
                                    <li>建议上传图片尺寸大小为144*48px</li>
                                </ul>
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="listSubmit" :loading="isLoading">确定</el-button>
                </div>
            </el-dialog>
        </basic-container>
    </list-container>
</template>

<script>
    import { addObj, getObj, delObj, putObj} from '@/api/erp/goods/brand';
    import {addBrand,page as selectPage,updateBrand,deleteMultiBrand} from '@/api/erp/saas/brandManager';
    export default {
        props: ['timeStamp'],
        name: "brand",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                textMap: {//新增&编辑对话框顶部标题字典
                    update: '编辑品牌',
                    create: '新增品牌'
                },
                dialogStatus: '',//当前表单为新建还是编辑
                rules: {//新增类目表单验证
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                    iconUrl: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否展示新增品牌对话框
                addList:{//新增品牌数据存储
                    picUrl:''
                },
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
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    delBtn:false,//行删除按钮是否显示
                    editBtn:false,//行编辑按钮是否显示
                    column: []
                },
                billColumn: [
                    // {
                    //     label: "品牌商ID",
                    //     prop: "id",
                    //     sortable: true,
                    //     search: true,
                    //     align: 'center',
                    //     minWidth: 120,
                    // },
                    {
                        label: "品牌商ID",
                        prop: "id",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "品牌商名称",
                        prop: "name",
                        minWidth: 160,
                        align: 'center',
                        search: true,

                    },
                    {
                        label: "英文名称",
                        prop: "nameEn",
                        minWidth: 160,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "品牌LOGO",
                        prop: "picUrl",
                        minWidth: 120,
                        align: 'center',
                        slot: true
                    },
                    {
                        label: "排序",
                        prop: "sortOrder",
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
            /**
             * 顶部新增按钮事件
             */
            handleAdd() {
                this.dialogFormVisible=true
                this.dialogStatus='create'
                this.addList={
                    picUrl: ''
                }
            },
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
                            if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                                this.showSuccess('品牌删除成功')
                            } else {
                                this.showError('品牌删除失败'+res.data.msg||res.data.data)
                            }
                        }, error => this.showError('品牌删除失败'+error));
                    });
                }
            },
            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.addList.picUrl = res.data.url;
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
                if (!isJPG&&!isPNG) {
                    this.$message.error('上传头像图片只能是 JPG或png 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isPNG||isJPG && isLt2M;
            },
            /**
             * 添加&编辑分类
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method=this.dialogStatus==='create'?addBrand:updateBrand
                        let message=this.dialogStatus==='create'?"品牌新增":"品牌编辑"
                        method(this.addList).then(res => {
                            if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                                this.showSuccess(message+'成功')
                            } else {
                                this.showError(message+"失败"+res.data.msg||res.data.data)
                            }
                        }, error => this.showError(message+"失败"+error))
                    }
                })
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
             * 表格编辑按钮事件
             * index 当前按钮索引值
             * row 当前行中数据
             */
            handleUpdate(index,row){
                this.dialogFormVisible = true
                this.dialogStatus='update'
                this.addList=row
            },
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

</style>
