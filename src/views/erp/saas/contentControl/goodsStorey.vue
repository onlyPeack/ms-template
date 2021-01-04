<template>
    <div class="app-container calendar-list-container">
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple" style="margin-right: 10px;margin-left: 10px;">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>首页楼层分类</span>
                        </div>
                        <div class="filter-container">
                            <el-button type="success" icon="el-icon-plus" @click="handleCreateTree">新建楼层</el-button>
                        </div>
                        <div style="margin-top: 10px">
                            <el-row>
                                <el-col>
                                    <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
                                             :expand-on-click-node="false" :filter-node-method="filterNode" ref="documentTree" default-expand-all
                                             @node-click="getNodeData"
                                             :render-content="renderContent">
                                    </el-tree>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="16" style="height:100%">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card" style="height:100%">
                        <div slot="header" class="clearfix">
                            <span>楼层商品</span>
                        </div>
                        <div>
                            <!-- 查询和其他操作 -->
                            <div class="filter-container">
                                <el-form :inline="true">
                                    <el-form-item label="商品名称:">
                                        <el-input clearable class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="请输入商品名称" v-model="listQuery.goodsName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="订货号:">
                                        <el-input clearable class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="请输入订货号" v-model="listQuery.itemNo"></el-input>
                                    </el-form-item>
                                    <el-form-item label="型号:">
                                        <el-input clearable class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="请输入型号" v-model="listQuery.specModel"></el-input>
                                    </el-form-item>
                                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                                    <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
                                    <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">添加商品</el-button>

                                </el-form>
                            </div>

                            <!-- 查询结果 -->
                            <el-table size="small" :data="list" border fit highlight-current-row>
                                <el-table-column align="center" label="商品编号" prop="goodsId"></el-table-column>
                                <el-table-column align="center" label="产品编号" prop="goodsCode"></el-table-column>
                                <el-table-column align="center" label="商品名称" prop="goodsName"></el-table-column>
                                <el-table-column align="center" label="订货号" prop="itemNo"></el-table-column>
                                <el-table-column align="center" label="型号" prop="specModel"></el-table-column>
                                <el-table-column align="center" label="零售价" prop="retailPrice"></el-table-column>
                                <el-table-column align="center" label="订货价" prop="goodsPrice"></el-table-column>
                                <el-table-column align="center" label="图片路径" prop="url" width="200" v-slot="{row}">
                                    <div @click="doShowImageViewer(row.url)" style="cursor: pointer">
                                        <el-image :src="row.url" :url-list="srcList" fit="contain" style="width: 60px"></el-image>
                                    </div>
                                </el-table-column>
                                <el-table-column align="center" label="操作人" prop="crtUserName"></el-table-column>
                                <el-table-column align="center" label="创建时间" prop="crtTime"></el-table-column>

                                <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
                                    <template slot-scope="scope">
                                        <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>-->
                                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <!-- 分页-->
                            <div class="pagination-container">
                                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                               :current-page="listQuery.page"
                                               :page-sizes="[5,10,20,30,50]" :page-size="listQuery.limit"
                                               layout="total, sizes, prev, pager, next, jumper" :total="total">
                                </el-pagination>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div style="height: 50px"></div>
            </el-col>
        </el-row>

        <!-- 添加或修改分类对话框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleTree" :modal-append-to-body="false">
            <el-form  ref="addList" :model="addList" status-icon label-position="right" :rules="rules" size="medium"
                      label-width="200px">
                <el-form-item label="父级名称" prop="parentName" v-show="addList.level*1===2">
                    <el-input v-model="addList.parentName" :disabled="true" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item :label="addList.level*1===2?'分类名称':'楼层名称'" prop="name">
                    <el-input v-model="addList.name" style="width: 300px" placeholder="请输入名称"></el-input>
                </el-form-item>
<!--                <el-form-item label="类型(分类可添加商品)" prop="level">-->
<!--                    <el-select v-model="addList.level" style="width: 100%;">-->
<!--                        <el-option label="分类" value='2'></el-option>-->
<!--                        <el-option label="楼层" value='1'></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
                <el-form-item label="图片" prop="url" v-if="(addList.level*1)===1">
                    <el-upload class="avatar-uploader" action='api/saas/storage/create' list-type="picture-card"
                               :show-file-list="false"
                               accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
                        <img v-if="picUrl" :src="picUrl" class="avatar" style="width: auto;height: 148px;">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">
                            <ul style="padding: 0;margin-left: 15px;">
                                <li>只能上传jpg/png文件，且不超过1MB</li>
                                <li>建议上传图片尺寸大小为284*502px</li>
                            </ul>
                        </div>
                    </el-upload>

                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="addList.sort" placeholder="请输入排序" style="width: 300px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleTree = false">取消</el-button>
<!--                <el-button type="primary" @click="createTreeData">确定</el-button>-->
                <el-button type="primary" @click="createTreeData">确定</el-button>
            </div>
        </el-dialog>
        <el-image-viewer :url-list="srcList" v-if="showImageViewer" :on-close="closeImageViewer"/>
        <!--        全部商品关联选择框-->
        <all-goods-selector v-if="showAllGoodsSelector" :dialogVisible="showAllGoodsSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic" :isOnSale="0"></all-goods-selector>

    </div>
</template>

<script>
    import {getTree,createTree,updateTree,createStoreGoods,page,deleteStoreGood,deleteStoreGoodTree} from '@/api/erp/saas/contentControl/goodsStorey';
    import ElImageViewer from "element-ui/packages/image/src/image-viewer";
    import 'element-ui/lib/theme-chalk/index.css';
    export default {
        name: 'goodsStorey',
        components: {
            'allGoodsSelector': () => import('@/components/saas/allGoodsSelector'),
            ElImageViewer
        },
        data() {
            return {
                treeData:[],//左侧商城楼层树数据源
                dialogFormVisibleTree:false,//是否展示新建&编辑楼层分类对话框
                textMap: {//新建&编辑楼层分类对话框顶部文字字典
                    update: '编辑楼层',
                    create: '创建楼层',
                    updateStorey:'编辑分类',
                    createStorey:'创建分类'
                },
                showImageViewer:false,//是否展示图片预览
                srcList: ['http://gxcl-shop.qiniu.520mro.com/5snm6e6lxrkaysv6w2gj.jpg'],//图片预览数组
                dialogStatus:'',//当前新建&编辑楼层对话框状态
                addList:{},//需要提交的表单数据
                rules: {//表单验证条件
                    name: [{required: true, message: '标题不能为空', trigger: 'blur'}],
                    level: [{required: true, message: '标题不能为空', trigger: 'blur'}],
                    url: [{required: true, message: '图片能为空', trigger: 'blur'}],
                    sort: [{required: true, message: '排序能为空', trigger: 'blur'}],
                },
                picUrl:'',//图片地址暂存参数
                defaultProps: {//左侧商城楼层数据参数
                    children: 'children',
                    label: 'name',
                },
                listQuery:{//查询条件
                    page:1,//页数
                    limit:10,//行数
                },
                list:[],
                showAllGoodsSelector:false,//是否展示全部商品选择框
            }
        },
        created() {
            this.getList();
            this.getTree();
        },
        methods: {
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(response => {
                    this.list = response.data.data.records;
                    this.total = response.data.data.total;
                    this.listLoading = false;
                }).catch(() => {
                    this.list = [];
                    this.total = 0;
                    this.listLoading = false;
                })
            },
            getTree() {
                getTree().then(res => {
                    this.treeData = Array.from(res.data);
                },error => this.showError('加载商城楼层分类树失败,'+error));
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            resetForm() {
                this.dataForm = {
                    treeId: '',
                    treeIds: '',
                    parentName: '',
                    goodsId: '',
                    goodsName: '',
                    goodsCode: '',
                    level: '',
                    sort: ''
                }
            },
            resetTreeForm() {
                this.dataTreeForm = {
                    id: '',
                    parentId: '',
                    parentName: '',
                    sort: '',
                    url: undefined,
                    name: ''
                }
            },

            //重置查询条件
            resetQuery() {
                this.listQuery.name = undefined;
                this.listQuery.treeIds = undefined;
                delete this.listQuery.goodsId
                delete this.listQuery.goodsName
                this.getList()
            },
            handleCreate() {
                if (this.$refs.documentTree.getCurrentNode() === null) {
                    this.$notify({
                        title: '请点击选择左侧一个分类',
                        message: '请点击选择左侧一个分类!',
                        type: 'warning',
                        duration: 2000
                    });
                    return;
                }
                if (this.$refs.documentTree.getCurrentNode().level != 2) {
                    this.$notify({
                        title: '只有分类可以添加商品！',
                        message: '只有分类可以添加商品！',
                        type: 'warning',
                        duration: 2000
                    });
                    return;
                }
                this.showAllGoodsSelector = true;
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        addObj(this.dataForm).then(response => {
                            if (response.code == '2000') {
                                this.list.unshift(response.data);
                                this.dialogFormVisible = false;
                                this.$notify({
                                    title: '成功',
                                    message: '创建成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.getList();
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.msg,
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            handleCreateTree(data) {
                //this.resetTreeForm();
                if(data.id){
                    this.addList.parentName = data.name;
                    this.addList.parentId = data.id;
                    this.addList.level=2
                    this.dialogStatus = 'createStorey';
                }else{
                    this.addList={}
                    this.addList.level=1
                    this.dialogStatus = 'create';
                }

                this.dialogFormVisibleTree = true;
            },

            /**
             * 创建&编辑商城楼层分类提交事件
             */
            createTreeData() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        let method=(this.dialogStatus==='create'||this.dialogStatus==='createStorey')?createTree:updateTree
                        let message
                        if(this.addList.type===2){
                            message=this.dialogStatus==='create'?'创建分类':'编辑分类'
                        }else{
                            message=this.dialogStatus==='createStorey'?'创建商城楼层':'编辑商城楼层'
                        }

                        method(this.addList).then(response => {
                            if (Number(response.data.code) === 2000||Number(response.data.code)===200) {
                                this.showSuccess(message+'成功!')
                                this.getTree();
                            } else {
                                this.showError(message+'失败,',response.data.code)
                            }
                        },error => this.showError(message+'失败,'+error))
                    } else {
                        return false;
                    }
                })
            },

            /**
             *编辑商城楼层分类
             */
            handleUpdate(row) {
                this.addList= row;
                this.dialogStatus = 'update';
                this.dialogFormVisibleTree = true;
                console.log(row,1111)
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        putObj(this.dataForm.id, this.dataForm).then(response => {
                            if (response.code == '2000') {
                                this.dialogFormVisible = false;
                                this.$notify({
                                    title: '成功',
                                    message: '更新成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.getList();
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.msg,
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            /**
             * 图片上传成功事件
             * @param response 响应参数
             */
            uploadPicUrl(response) {
                if(Number(response.code)===200||Number(response.code)===2000){
                    this.addList.url = response.data.url;
                    this.picUrl = response.data.url;
                }else{
                    this.showError('图片上传失败',response.code)
                }
            },
            handleUpdateTree(data,node) {
                this.addList=data
                this.addList.level=node.level
                this.addList.parentName=node.parent.label
                this.picUrl=this.addList.url
                console.log(this.addList,'addlist',data,node)
                if(Number(this.addList.level)===2){
                    this.dialogStatus = 'updateStorey';
                }else{
                    this.dialogStatus = 'update';
                }


                this.dialogFormVisibleTree = true;
            },
            updateTreeData() {
                this.$refs['dataTreeForm'].validate((valid) => {
                    if (valid) {
                        putTreeObj(this.dataTreeForm.id, this.dataTreeForm).then(response => {
                            if (response.code == '2000') {
                                this.$notify({
                                    title: '成功',
                                    message: '更新成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.getTree();
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.msg,
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteStoreGood(row.id).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.getList();
                    });
                });
            },
            handleDeleteTree(data) {
                this.$confirm(data.name + '将被永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteStoreGoodTree(data.id).then(res => {
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.getTree();
                        }else{
                            this.showError('删除商品楼层失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('删除商品楼层失败,'+error));
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getNodeData(data) {
                this.listQuery.treeId = data.id;
                this.getList();
            },
            renderContent(h, {node, data}) {
                if(node.level===1){
                    return ( <span class = "custom-tree-node" > < span > {node.label}</span>
                        < span >
                        < el-button size = "mini" type = "text" icon = "el-icon-plus" on-click = {() => this.handleCreateTree(data) } > 添加下级 < /el-button>
                    < el-button size = "mini" type = "text" icon = "el-icon-edit" on-click = {() => this.handleUpdateTree(data,node) }> 修改 < /el-button>
                    < el-button size = "mini" type = "text" icon = "el-icon-delete" on-click = {() => this.handleDeleteTree(data) }> 删除 < /el-button>
                    < /span>
                    </span>)
                }else{
                    return ( <span class = "custom-tree-node" > < span > {node.label}</span>
                        < span >
                    < el-button size = "mini" type = "text" icon = "el-icon-edit" on-click = {() => this.handleUpdateTree(data,node) }> 修改 < /el-button>
                    < el-button size = "mini" type = "text" icon = "el-icon-delete" on-click = {() => this.handleDeleteTree(data) }> 删除 < /el-button>
                    < /span>
                    </span>)
                }

            },

            //商品选择
            handleProductShow() {
                this.productVisible = true;
            },
            handleCloseProduct() {
                this.productVisible = false;
                this.selectedProducts = [];
                this.$refs.goodsSelector.reset();
            },
            closeGoodsDialog(list) {
                if (list.length == 0) {
                    this.productVisible = false;
                    return;
                } else if (list.length > 1) {
                    this.$message.error('只能选择一个商品');
                    return;
                }
                this.dataForm.goodsId = list[0].goodsId;
                this.dataForm.goodsName = list[0].goodsName;
                this.dataForm.goodsCode = list[0].skuNo;
                this.dataForm.url = list[0].url;
                this.productVisible = false;
                this.$refs.goodsSelector.reset();
                this.$refs['dataForm'].validate(valid => {
                });
            },
            handleSubmitProduct() {
                this.$refs.goodsSelector.OnSubmit();
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if(Number(code)===401){
                    this.$message.warning(message||'操作失败')
                }else{
                    this.$message.error(message||'操作失败')
                }
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
                this.showAllGoodsSelector=false
                this.dialogFormVisibleTree=false
                this.getList()
            },

            /**
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.showAllGoodsSelector=false
            },

            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                if(data.type==='allGoods'){
                    //this.$set(this.addList.items,this.clickRow,data.arr[0])
                    for (let i = 0; i <data.arr.length ; i++) {
                        data.arr[i].treeId=this.listQuery.treeId
                        data.arr[i].goodsId=data.arr[i].id
                        data.arr[i].level=this.listQuery.level
                    }
                    createStoreGoods(data.arr).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('新增商城楼层商品成功!')
                        }else{
                            this.showError('新增商城楼层商品失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('新增商城楼层商品失败,'+error))
                }
            },

            /**
             * 展示图片大图预览
             * @param img 图片地址
             */
            doShowImageViewer(img){
                this.$set(this.srcList,0,img)
                this.showImageViewer=true
            },

            /**
             * 关闭图片预览
             */
            closeImageViewer(){
                this.showImageViewer=false
            },

             *myFunction(){
                 for (let i = 0; true ; i++) {
                     yield i
                 }
            },

            goNext(){
                console.log(this.myFunction().next())
            }
        }
    };
</script>
<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
