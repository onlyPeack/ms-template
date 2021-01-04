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
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="text" @click="updateShow(scope.row)">编辑</el-button>
                    </template>
                </avue-crud>
            </div>
            <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="30%" :title="textMap[dialogStatus]">
                <el-form :model="addList" label-position="right" label-width="6.25vw" :rules="rules" size="medium">
                    <el-form-item label="快递名称:" prop="name">
                        <el-input v-model="addList.name" autocomplete="off" style="width: 15.625vw;height: 30px;" placeholder="请输入快递名称"></el-input>
                    </el-form-item>
                    <el-form-item label="快递英文名称:" prop="englishName">
                        <el-input v-model="addList.englishName" autocomplete="off" style="width: 15.625vw;height: 30px;" placeholder="请输入快递英文名称"></el-input>
                    </el-form-item>
                    <el-form-item label="快递编码:" prop="code">
                        <el-input v-model="addList.code" autocomplete="off" style="width: 15.625vw;height: 30px;" placeholder="请输入快递编码"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用:" prop="status">
                        <el-radio-group v-model="addList.status">
                            <el-radio  label="0">是</el-radio>
                            <el-radio  label="1">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="listSubmit">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </basic-container>
    </list-container>
</template>

<script>
    import { start, stop,} from '@/api/erp/goods/series';
    import {deleteMultiSeries} from '@/api/erp/saas/goodsSeries';
    import {page as pages,updateLogistics,createLogistics,deleteLogistics} from '@/api/erp/saas/orderControl/logistics';
    export default {
        props: ['timeStamp'],
        name: "logistics",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'goodsClassifySelector': () => import('@/components/saas/goodsClassifySelector'),
            'brandManagerSelector': () => import('@/components/saas/brandManagerSelector'),
        },
        data() {
            return {
                fileList: undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑物流快递',
                    create: '新建物流快递'
                },
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否显示添加商品系列对话框
                addList:{status:'0'},//添加商品系列数据存储对象
                sourceClassifyVisible:false,//是否显示关联分类对话框
                sourceBrandVisible:false,//是否显示关联品牌对话框
                showSpecification:false,//是否显示规格参数对话框
                nowRow:Object,//当前行中值集合
                specificationTags:[],//当前行规格参数存储对象
                publicTitle:'',
                inputVisible: false,//规格参数是否显示输入框
                rules: {//新增&编辑商品表单验证
                    'name': [{required: true, message: '物流快递名称不能为空', trigger: 'blur'}],
                    'status': [{required: true, message: '启用状态不能为空', trigger: 'blur'}],
                    'code': [{required: true, message: '快递编码不能为空', trigger: 'blur'}],
                },
                inputValue: '',
                isSingle: true,
                option: [],
                typeName: '',
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
                    menu: true,
                    align:'left',
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    delBtn:false,
                    editBtn:false,
                    showSummary: false,
                    column: []
                },
                billColumn: [
                    {
                        label: "快递名称",
                        prop: "name",
                        minWidth: 180,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "英文名称",
                        prop: "englishName",
                        minWidth: 180,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "快递编码",
                        prop: "code",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "是否启用",
                        prop: "status",
                        minWidth: 180,
                        align: 'center',
                        search: true,
                        type:'select',
                        dicData: [
                            {
                                value:"0",
                                label:"启用中"
                            },
                            {
                                value:'1',
                                label: '关闭'
                            }
                        ]
                    }
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

            /**
             *顶部按钮删除方法
             */
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
                    deleteLogistics(ids.toString()).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('物流快递删除成功')
                        } else {
                            this.showError('物流快递删除失败'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('物流快递删除失败'+error));
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
                    const data = res.data;
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
                    path: '/seriesForm',
                    name: '商品系列制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'seriesForm'
                    }
                });
            },
            handleAdd() {
                this.dialogFormVisible = true
                this.dialogStatus='create'
                this.addList={status: '0'}
            },
            /**
             * 添加商品系列提交
             */
            listSubmit(){
                if(this.addList.name===undefined||this.addList.name.length===0){
                    this.showError('快递名称不能为空')
                }else{
                    this.isLoading=true
                    //判断当前为创建还是为编辑 并赋予响应的方法及信息
                    let method=this.dialogStatus==='create'?createLogistics:updateLogistics
                    let message=this.dialogStatus==='create'?"物联快递新增":"物流快递编辑"
                    method(this.addList).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess(message+'成功')
                        }else{
                            this.showError(message+'失败,'+res.data.msg||res.data.data)
                        }
                    },error => this.showError(message+'失败,'+error))
                }
            },


            /**
             * 从子组件中接收的提交方法
             * @param list
             */
            handleSubmitPublic(list){
                if(list.type&&list.type==='goodsClassify'){
                    this.addList.seriesName=list.seriesName
                    this.addList.seriesId=list.seriesId
                }else if(list.type&&list.type==='brand'){
                    this.addList.brandName=list.brandName
                    this.addList.brandId=list.brandId
                }
                this.sourceBrandVisible = false;
                this.sourceClassifyVisible = false;
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
             * 成功处理方法
             * @param message 成功提示信息
             */
            showSuccess(message){
                this.$message.success(message)
                this.init()
            },

            /**
             * 初始化所有状态
             */
            init(){
                this.dialogFormVisible = false
                this.showSpecification=false
                this.getList(this.page,this.listQuery)
            },

            /**
             * 行编辑事件
             * @param data 当前行数据
             */
            updateShow(data){
                this.dialogFormVisible = true
                this.dialogStatus='update'
                this.addList=data
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
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
