<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
        <a id="test123"
           :href="openUrl+'/api/goods/goods/exportList?userId='+userId"></a>
        <el-row>
            <el-col style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">

                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="addGoodsCategory" plain>添加</el-button>
<!--                        <el-button type="danger" size="mini" @click="handleDelete" icon="el-icon-delete" plain>删除</el-button>-->
                    </div>
                </div>
                <!-- 查询结果 -->
                <div class="result-container"style="padding: 0% 1%; background: #ffffff;">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" row-key="id"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column type="selection" width="60">
                        </el-table-column>
                        <el-table-column align="left" min-width="100" label="栏目标题" prop="name" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="排序" prop="sort">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="关键字" prop="keyword">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="启用状态" prop="status" v-slot="{row}">
                            <el-switch v-model.number="row.status" @change="handleUpdateStatus(row)" :active-value="1" :inactive-value="0"/>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <div class="pagination-container" style="padding: 10px 0px;background: #ffffff;">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="listQuery.page"
                                   :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 添加或修改对话框 -->
<!--        <el-dialog modal-append-to-body @opened="dialogOpen"-->
<!--                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
<!--            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="100px" :inline="true" size="medium">-->
<!--                <el-form-item label="栏目标题:" prop="name">-->
<!--                    <el-input v-model="addList.name" style="width: 250px"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="所属栏目:" prop="pid" >-->
<!--                    <el-select v-model="addList.pid" placeholder="请选择所属类目">-->
<!--                        <el-option v-for="data in pidArr" :label="data.name" :value="data.id"></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="排序:" prop="sort">-->
<!--                    <el-input v-model="addList.sort" style="width: 250px"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="是否启用:" prop="status">-->
<!--                    <el-switch v-model="addList.status"  :active-value="1" :inactive-value="0"></el-switch>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="关键字:" prop="keyword">-->
<!--                    <el-input v-model="addList.keyword" type="textarea" style="width: 600px"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="内容:" prop="content">-->
<!--                    <div id="wangEditor" style="width: 100%;display: inline-block;vertical-align: text-top"></div>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <div slot="footer" class="dialog-footer">-->
<!--                <el-button @click="dialogFormVisible = false">取消</el-button>-->
<!--                <el-button type="primary" @click="listSubmit" :loading="isLoading">确定</el-button>-->
<!--            </div>-->
<!--        </el-dialog>-->
        <brand-manager-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></brand-manager-selector>
    </list-container>
</template>


<script>
    import {updateShowStatus,deleteMultiCategory} from '@/api/erp/saas/goodsClassify';
    import {addColumn,page,getPidColumn,delColumn,updateColumn,updateColumnStatus} from '@/api/erp/saas/contentControl/columnManager';

    let E = require('wangeditor')
    export default {
        name: 'columnManager',
        components: {
            'brandManagerSelector': () => import('@/components/saas/brandManagerSelector'),
        },
        props: ['timeStamp'],
        data() {
            return {
                textMap: {
                    update: '编辑栏目管理',
                    create: '新建栏目管理'
                },
                dialogStatus: '',//当前表单为新建还是编辑
                rules: {//新增类目表单验证
                    title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
                    categoryName: [{required: true, message: '品牌不能为空', trigger: 'blur'}],
                    sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
                    pic: [{required: true, message: '专题主图不能为空', trigger: 'blur'}],
                    recommendStatus: [{required: true, message: '是否推荐不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                showBrandSelector:false,//是否显示品牌选择对话框
                pic:'',//新增&编辑对话框专题主图
                headers: undefined,
                fromOut: '',
                selfCategoryId: undefined,
                clientHeight: 300,
                list: [],
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    skuName: undefined,
                    name: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    itemNo: undefined,
                    specModel: undefined,
                    isOnSale: undefined
                },
                addList: {//添加分类中数据存储
                },
                goodsTypeList: [],
                fileList: [],
                goodsDetail: '',
                detailDialogVisible: false,
                dialogFormVisible: false,
                goodsDialogTitle: '',
                downloadLoading: false,
                goodsId: null,
                categoryList: [],
                brandList: [],
                isOpenTree: true,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                filterText: '',
                breadcrumbList: [{label: '所有分类', value: 0}],
                initializingShow: true,
                queryVisible: true,
                dialogDataBaseVisible: false,
                no: undefined,
                selectedRows: [],
                userId:undefined,
                pidArr:[],//父类目存储数组
                editor:undefined,//富文本编辑器临时存储
            }
        },
        created() {
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            }
            this.no = this.$store.getters.userInfo.no;
            this.userId = this.$store.getters.userInfo.id;
            this.changeDivHeight();
            const _this = this;
            window.onresize = function () {
                _this.changeDivHeight();
            };
            this.init();
            if (this.$store.state.user.id == '1') {
                this.initializingShow = false; // 超级管理员不显示商品初始化功能
            }
            //this.getList(this.listQuery);
        },
        mounted() {

        },
        watch: {
            filterText(val) {
                this.$refs.categoryTree.filter(val);
            },
            '$route': function (to, from) {
                if(this.$route.query.myRefresh){
                    this.getList(this.listQuery);
                }

            },
        },
        methods: {

            /**
             * 行内更变推荐状态方法
             */
            handleUpdateStatus(row) {
                updateColumnStatus(row.id,row.status).then(response => {
                    if (Number(response.data.code) === 2000||Number(response.data.code)===200) {
                        this.showSuccess('更变启用状态成功!')
                    } else {
                        this.showError('更变启用状态失败,'+response.data.msg||response.data.data,response.data.code)
                    }
                },error => this.showError('更变启用状态失败,'+error));
            },

            /**
             *对话框打开事件
             */
            dialogOpen(){
                if(!this.editor){
                    this.$nextTick(()=>{
                        this.editor = new E('#wangEditor')
                        this.editor.create()
                    })
                }
            },
            uploadCompleted(response, file, fileList) {
                this.getList(this.listQuery);
                if (response.code == '2000' || response.code == 2000) {
                    this.$notify({
                        title: '成功',
                        message: response.msg,
                        type: 'success',
                        duration: 2000
                    });
                } else {
                    this.$alert(response.msg, "提示", {
                        confirmButtonText: "确定",
                    }).then(() => {
                    });
                }
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            beforeUpload(file) {
                const isXLS = file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isXLS) {
                    this.$message.error('只能上传xls/xlsx表格!');
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!');
                }
                return isXLS && isLt10M;
            },
            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            closeCoverDialog() {
                this.dialogDataBaseVisible = false;
            },
            handleInsert() {
                //this.handleBillAdd(this,{path: '/goodsListForm', name: '商品列表制单'});
            },
            handlechangeFun(val) {
                this.selectedRows = val;
            },
            dialogDataVisible() {
                if (this.listQuery.categoryId !== undefined) {
                    this.dialogDataBaseVisible = true;
                } else {
                    this.vueMessage('warning', '请选择分类');
                }
            },
            changeDivHeight() {
                if (document.getElementsByClassName('filter-container')[0]) {
                    var height = document.getElementsByClassName('filter-container')[0].clientHeight;
                } else {
                    height = 49;
                }
                this.clientHeight = (document.body.clientHeight - (240 + height)) * 1;
            },
            init() {
                //初始化所有状态
                this.dialogFormVisible = false
                this.isLoading=false
                this.getList()
                getPidColumn().then(res => {
                    if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                        this.pidArr=res.data.data
                    } else {
                        this.showError("获取父类目失败"+res.data.msg||res.data.data,res.data.code)
                    }
                }, error => this.showError("获取父类目失败"+error))
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                let params = new URLSearchParams();
                params.append("page", this.listQuery.page);
                params.append("limit", this.listQuery.limit);
                page(params).then(response => {
                    if(Number(response.data.code)===2000||Number(response.data.code)===200){
                        this.list = response.data.data.records;
                        this.total = response.data.data.total;
                        this.listLoading = false;
                    }else{
                        this.showError('获取栏目列表失败,'+response.data.msg||response.data.data,response.data.code)
                    }
                }).catch(() => {
                    this.list = [];
                    this.total = 0;
                    this.listLoading = false;
                })
            },
            insertBtn() {
                document.getElementById("productForm").submit();
            },
            handleOpenTree() {
                this.isOpenTree = !this.isOpenTree;
                for (const i in this.$refs.categoryTree.store.nodesMap) {
                    this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree;
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getAllParentNode(node, arr) {
                if (node.parent && node.parent.label) {
                    arr.push({
                        label: node.parent.label,
                        value: node.parent.key
                    });
                    if (node.parent.parent) {
                        this.getAllParentNode(node.parent, arr);
                    }
                }
                return arr;
            },
            getNodeData(data, node) {
                this.listQuery.categoryId = data.value;
                this.fromOut = data.label;
                this.selfCategoryId = data.value;
                let breadcrumbList = [];
                breadcrumbList.push(data);
                if (node.parent) {
                    breadcrumbList = this.getAllParentNode(node, breadcrumbList);
                }
                this.breadcrumbList = breadcrumbList.reverse();
                this.handleFilter();
            },
            changeTreeNode(data, index) {
                // if (data.label == '所有分类') {
                //     return;
                // }
                this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
                this.listQuery.categoryId = data.value;
                this.$refs.categoryTree.setCurrentKey(data.value);
                this.handleFilter();
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList(this.listQuery);
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList(this.listQuery);
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList(this.listQuery);
            },
            openGoodsDialog() {
                this.$router.push({
                    path: '/goodsListForm',
                    name: '商品列表制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'goodsListForm'
                    }
                });
                this.goodsId = '';
                this.goodsDialogTitle = '商品新增';
                this.dialogFormVisible = true;
            },
            /**
             * 表格行中switch按钮
             * index 当前按钮索引
             * row 当前行数据
             */
            handleSwitchChange(row, index) {
                updateShowStatus(Number(!row.showStatus),row.id).then(res=>{
                    this.$message.success('更改商品类目状态成功')
                    this.init()
                },error => this.$message.error('更改商品类目状态失败'+error.msg||error.data))
            },
            showDetail(detail) {
                this.goodsDetail = detail;
                this.detailDialogVisible = true;
            },
            /**
             * 删除商品类目方法
             */
            handleDelete(index,row) {
                let msg=(row.pid&&row.pid!=='')?'此操作将永久删除，请谨慎操作, 是否继续?':'此操作将永久删除,您删除的是父类栏目，删除后相关子栏目也会清除，请谨慎操作, 是否继续?'
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delColumn(row.id).then(res => {
                        if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                            this.$message.success("删除栏目成功")
                            this.init();
                        } else {
                            this.$message.error('删除栏目失败'+res.data.msg||res.data.data)
                        }
                    },error=>this.$message.error('删除栏目失败'+error));
                });
            },
            /**
             * 重置按钮方法
             */
            clear() {
                this.listQuery.name = ''
                this.listQuery.level=''
            },
            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.addList.pic = res.data.url;
                this.pic = res.data.url;
            },
            /**
             * 图片上传之前添加参数
             * @param file
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
             * 新建&编辑商品类目
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        this.addList.content=this.editor.txt.html()
                        let method=this.dialogStatus==='create'?addColumn:updateColumn
                        let message=this.dialogStatus==='create'?"新增栏目":"编辑栏目"
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
             * 添加栏目按钮
             */
            addGoodsCategory(){
                //this.dialogFormVisible = true
                //this.dialogStatus='create'
                //this.addList={}
                this.$router.push({name:'新增栏目',query:{flag:'add'}})
            },
            /**
             * 父类目选择事件
             */
            handleCategoryChange(value) {
                this.addList.pid = value[value.length - 1]
            },
            /**
             * 表格编辑按钮事件
             * index 当前按钮索引值
             * row 当前行中数据
             */
            handleUpdate(index,row){
                // this.dialogFormVisible = true
                // this.dialogStatus='update'
                this.addList=JSON.parse(JSON.stringify(row))
                if(this.addList.pid===0){
                    delete this.addList.pid
                }else{
                    this.addList.pid=this.addList.pid.toString()
                }

                this.$router.push({name:'编辑栏目',query:{flag:'edit',columnData:JSON.stringify(this.addList)}})

                // if(!this.editor){
                //     this.$nextTick(()=>{
                //         this.editor = new E('#wangEditor')
                //         this.editor.create()
                //         this.editor.txt.html(row.content)
                //     })
                // }else{
                //     this.editor.txt.html(row.content)
                // }
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message){
                this.$message.error(message)
                this.isLoading=false
                this.listLoading=false
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
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.showBrandSelector=false
            },

            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                if (data.type === 'brand') {
                    this.addList.categoryName = data.brandName
                    this.addList.categoryId = data.brandId
                    this.showBrandSelector = false
                }
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .goods-list-container {
        .left-title{
            font-weight: bold;
            line-height: 30px;
        }
        .box-card {
            overflow: auto;
        }
        .curr-classify {
            font-size: 14px;
            position: relative;
            top: -2px;
            color: #5a5e66;
        }
        .query-visible {
            color: #409EFF;
            margin-left: 10px;
            cursor: pointer;
            font-size: 14px;
        }

        .el-breadcrumb__inner a {
            color: #1276c3 !important;
            cursor: pointer !important;
        }

        .table-expand {
            font-size: 0;
        }

        .table-expand label {
            width: 100px;
            color: #99a9bf;
        }

        .table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
        }

        .gallery {
            width: 80px;
            margin-right: 10px;
        }

        .goodsFormDialog > .el-dialog {
            margin-top: 0vh !important;
            margin-bottom: 0vh !important;
            height: 100vh;
        }

        .goodsFormDialog > .el-dialog > .el-dialog__body {
            width: 100%;
            position: absolute;
            top: 40px;
            padding-top: 10px !important;
        }

        .goodsFormDialog > .el-dialog > .el-dialog__footer {
            position: absolute;
            width: 100%;
            bottom: 0px;
        }

        .goods-form-container {
            .topTable {
                .el-input input.el-input__inner {
                    border: none;
                    text-align: left;
                }

                .el-textarea__inner {
                    border: none;
                    resize: none;
                    padding: 10px 15px;
                }
                .el-form-item__content {
                    width: 100%;
                    margin-left: 0px !important;
                    line-height: 39px;
                    .el-form-item__error {
                        position: absolute;
                        display: inline-block;
                        top: 0px;
                        right: 15px;
                        text-align: right;
                    }
                }
                .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
                    line-height: 40px;
                    color: #444;
                    /* width: 220px!important;*/
                }goodsManager

                 .input-new-keyword .el-input__inner {
                     border: 1px solid #409EFF !important;
                 }
            }
        }
    }
    .classify{
        margin-bottom: 15px;
    }
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
