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
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {addBrand,deleteMultiBrand} from '@/api/erp/saas/brandManager';
    import {page as selectPage} from '@/api/erp/saas/memberCenter/memberBill';
    export default {
        props: ['timeStamp'],
        name: "member",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                textMap: {//新增&编辑对话框顶部标题字典
                    update: '编辑会员信息',
                    create: '新增会员'
                },
                dialogStatus: '',//当前表单为新建还是编辑
                rules: {//新增类目表单验证
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    mobile: [{required: true, message: '手机不能为空', trigger: 'blur'}],
                    job: [{required: true, message: '职业不能为空', trigger: 'blur'}],
                    companyName: [{required: true, message: '公司名称不能为空', trigger: 'blur'}],
                    memberLevelId: [{required: true, message: '会员等级不能为空', trigger: 'blur'}],
                    memberPriceStatus: [{required: true, message: '价格策略不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否展示新增品牌对话框
                addList:{//新增品牌数据存储
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
                    searchShow: true,//是否显示顶部搜索栏
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    menu:false,
                    menuWidth:140,
                    delBtn:false,//行删除按钮是否显示
                    editBtn:false,//行编辑按钮是否显示
                    column: []
                },
                billColumn: [
                    {
                        label: "会员名",
                        prop: "accountName",
                        minWidth: 160,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "交易名称",
                        prop: "tradeType",
                        minWidth: 160,
                        align: 'center',
                        dicData: [
                            {
                                value:'1',
                                label:"商城充值"
                            },
                            {
                                value:'2',
                                label:"商城下单冻结"
                            },
                            {
                                value:'3',
                                label:"商城下单付款"
                            },
                            {
                                value:'4',
                                label:"商城订单取消"
                            },
                            {
                                value:'5',
                                label:"资金转账"
                            },
                            {
                                value:'6',
                                label:"商城金额修改"
                            },
                        ],
                    },
                    {
                        label: "金额",
                        prop: "amount",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "交易时间",
                        prop: "crtTime",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 160,
                        align: 'center',
                    },
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
                let select= selectPage;
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
                },error => {
                    this.showError('失败,'+error)
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
                            if (res.data.code === 200 || res.data.code === 2000) {
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
                this.$set(this.addList,'qualification',res.data.url)
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
             * 添加&编辑会员信息
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method=this.dialogStatus==='create'?addBrand:updateMember
                        let message=this.dialogStatus==='create'?"品牌新增":"会员信息编辑"
                        if(this.addList.password){
                            delete this.addList.password
                        }
                        if(this.addList.payPassword){
                            delete this.addList.payPassword
                        }

                        method(this.addList.id,this.addList).then(res => {
                            if (Number(res.data.code) === 2000) {
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
                this.loading = false;
                this.searchDisable = false;
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

            /**
             * 重置密码
             */
            resetPassword(){
                this.$confirm('此操作将会重置该会员的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetPassword({id:this.addList.id}).then(res => {
                        if (Number(res.data.code) === 2000) {
                            this.$message.success('密码重置成功')
                        } else {
                            this.showError("密码重置失败"+res.data.msg||res.data.data)
                        }
                    }, error => this.showError("密码重置失败"+error))
                })
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

</style>
