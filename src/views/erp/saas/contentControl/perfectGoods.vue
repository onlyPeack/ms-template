<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
        <a id="test123"
           :href="openUrl+'/api/goods/goods/exportList?userId='+userId"></a>
        <el-row>
            <el-col style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
                    <el-form :inline="true">
                        <el-form-item label="系列名称:">
                            <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入系列名称" v-model="listQuery.seriesName"></el-input>
                        </el-form-item>
                        <el-form-item label="推荐状态:">
                            <el-select v-model="listQuery.recommend" placeholder="请选择推荐状态">
                                <el-option  value="1">推荐中</el-option>
                                <el-option  value="0">未推荐</el-option>
                            </el-select>
                        </el-form-item>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
                    </el-form>
                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="addGoodsCategory" plain>添加</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete" icon="el-icon-delete" plain>删除</el-button>
                    </div>
                </div>
                <!-- 查询结果 -->
                <div class="result-container"style="padding: 0% 1%; background: #ffffff;">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column type="selection" width="60">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="标题" prop="title" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="系列名称" prop="seriesName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="关联品牌" prop="brandName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="关联分类" prop="categoryName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="海报图" prop="pic" v-slot="{row}">
                            <div @click="doShowImageViewer(row.pic)" style="cursor: pointer">
                                <el-image :src="row.pic" :url-list="srcList" fit="contain" style="width: 60px" @click=""></el-image>
                            </div>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="推荐状态" prop="recommend" v-slot="{row}">
                            {{row.recommend===0?'未推荐':'推荐中'}}
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
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
        <el-dialog modal-append-to-body top="3vh" append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="140px" size="medium">
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="addList.title" placeholder="请输入标题" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="商品系列：" prop="seriesName">
                    <div @click="showSelect('series')">
                        <el-input v-model="addList.seriesName" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请选择商品系列">
                            <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 36px" slot="suffix"></i>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="关联分类：" prop="categoryName">
                    <div @click="showSelect('classify')" style="display: inline-block">
                        <el-input v-model="addList.categoryName" autocomplete="off" style="width: 300px;height: 30px;margin-right: 15px;" placeholder="请选择关联分类" :disabled="true">
<!--                            <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 28px" slot="suffix"></i>-->
                        </el-input>
                        <el-tooltip class="item" effect="dark" content="该关联分类将作为跳转链接" placement="top-start">
                            <span class="el-icon-question" style="cursor: pointer;color: red"></span>
                        </el-tooltip>
                    </div>

                </el-form-item>
                <el-form-item label="关联品牌：" prop="brandName">
                    <div @click="showSelect('brandNames')">
                        <el-input v-model="addList.brandName" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请选择关联品牌" :disabled="true">
<!--                            <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 28px" slot="suffix"></i>-->
                        </el-input>
                    </div>
                </el-form-item>

                <el-form-item label="海报图：" prop="pic">
                    <el-upload
                            class="avatar-uploader"
                            action="api/saas/storage/create"
                            :show-file-list="false"
                            accept=".jpg,.jpeg,.png,.svg"
                            :on-success="handleAvatarSuccess">
                        <img v-if="pic" :src="pic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">
                            <ul style="padding: 0;margin-left: 14px;">
                                <li>只能上传jpg/png文件，且不超过1MB</li>
                                <li>建议上传海报尺寸大小为224*294px</li>
                            </ul>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否推荐：">
                    <el-radio-group v-model="addList.recommend">
                        <el-radio :label=1>是</el-radio>
                        <el-radio :label=0>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="listSubmit" :loading="isLoading">确定</el-button>
            </div>
        </el-dialog>
        <el-image-viewer :url-list="srcList" v-if="showImageViewer" :on-close="closeImageViewer"/>
        <!--    关联品牌选择-->
        <brand-manager-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></brand-manager-selector>

        <!--        关联商品分类弹窗-->
        <goods-classify-selector v-if="sourceClassifyVisible" ref="goodsClassifySelector" :dialogVisible="sourceClassifyVisible" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></goods-classify-selector>

        <!--        商品系列选择对话框-->
        <goods-series-selector v-if="showSeriesSelector" :dialogVisible="showSeriesSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></goods-series-selector>
    </list-container>
</template>


<script>
    import {updateShowStatus} from '@/api/erp/saas/goodsClassify';
    import {createPerfectGoods,updatePerfectGoods,page as pages,deletePerfectGoods} from '@/api/erp/saas/contentControl/perfectGoods';
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'


    export default {
        name: 'perfectGoods',
        components: {
            'brandManagerSelector': () => import('@/components/saas/brandManagerSelector'),
            'goodsClassifySelector': () => import('@/components/saas/goodsClassifySelector'),
            'goodsSeriesSelector': () => import('@/components/saas/goodsSeriesSelector'),
            ElImageViewer
        },
        props: ['timeStamp'],
        data() {
            return {
                textMap: {
                    update: '编辑精选好货',
                    create: '新建精选好货'
                },
                dialogStatus: '',//当前表单为新建还是编辑
                showImageViewer:false,//是否展示图片预览
                srcList: ['http://gxcl-shop.qiniu.520mro.com/5snm6e6lxrkaysv6w2gj.jpg'],//图片预览数组
                rules: {//新增类目表单验证
                    title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
                    seriesName: [{required: true, message: '商品系列不能为空',trigger:'change'}],
                    categoryName: [{required: true, message: '关联分类不能为空', trigger: 'blur'}],
                    pic: [{required: true, message: '海报图不能为空', trigger: 'blur'}],
                    brandName: [{required: true, message: '关联品牌不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                showBrandSelector:false,//是否显示品牌选择对话框
                pic:'',//新增&编辑对话框专题主图
                sourceClassifyVisible:false,//是否显示关联分类对话框
                showSeriesSelector:false,//是否显示商品系列选择
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
                    iconUrl:'',//图标路径
                    recommend:1,//默认为显示
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
            this.getList(this.listQuery);
        },
        watch: {
            filterText(val) {
                this.$refs.categoryTree.filter(val);
            }
        },
        methods: {
            handleExceed(files, fileList) {
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
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                pages(this.listQuery).then(response => {
                    this.list = response.data.records;
                    this.total = response.data.total;
                    this.listLoading = false;
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
            handleDelete() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                this.selectedRows.forEach((row) => {
                    ids.push(row.id)
                });
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePerfectGoods(ids).then(res => {
                        if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                            this.$message.success("删除精选好货成功")
                            this.init();
                        } else {
                            this.$message.error('删除精选好货失败'+res.data.msg||res.data.data)
                        }
                    },error=>this.$message.error('删除精选好货失败'+error));
                });
            },
            handleDownload() {
                document.getElementById('test123').click()
            },
            /**
             * 重置按钮方法
             */
            clear() {
                delete this.listQuery.seriesName
                delete this.listQuery.recommend
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
             * 新建&编辑商品类目
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method=this.dialogStatus==='create'?createPerfectGoods:updatePerfectGoods
                        let message=this.dialogStatus==='create'?"精选好货新增":"精选好货编辑"
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
             * 添加商品类目按钮
             */
            addGoodsCategory(){
                this.dialogFormVisible = true
                this.dialogStatus='create'
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
                this.dialogFormVisible = true
                this.dialogStatus='update'
                this.addList=row
                this.pic=this.addList.pic
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
             * 所有对话框关闭事件
             */
            handleClosePublic() {
                this.showBrandSelector=false
                this.showSeriesSelector=false
                this.sourceClassifyVisible=false
            },

            /**
             * 对话选择框提交事件
             * data 选择的信息
             */
            handleSubmitPublic(data) {
                if (data.type === 'brand') {
                    this.addList.brandName = data.brandName
                    this.addList.brandId = data.brandId
                    this.showBrandSelector = false
                }else if(data.type==='goodsClassify'){
                    this.sourceClassifyVisible=false
                    this.addList.categoryName=data.seriesName
                    this.addList.categoryId=data.seriesId
                }else{
                    //this.addList.seriesName=data.arr.name
                    this.$set(this.addList,'seriesName',data.arr.name)
                    this.addList.seriesId=data.arr.id
                    if(data.arr.brandName&&data.arr.brandName!==''){
                        this.addList.brandName=data.arr.brandName
                        this.addList.brandId=data.arr.brandId
                    }
                    if(data.arr.seriesName&&data.arr.seriesName!==''){
                        this.addList.categoryName=data.arr.seriesName
                        this.addList.categoryId=data.arr.seriesId
                    }
                    this.showSeriesSelector=false
                }
                this.$refs['addList'].validateField('seriesName')

            },

            /**
             * 展示关联商品分类&关联品牌选择框
             * type 选择框类型
             */
            showSelect(type){
                if(type==='classify'){
                    // this.sourceClassifyVisible = true;
                }else if(type==='brandNames'){
                    // this.showBrandSelector = true;
                }else{
                    this.showSeriesSelector=true
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
