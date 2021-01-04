<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
        <a id="test123"
           :href="openUrl+'/api/goods/goods/exportList?userId='+userId"></a>
        <el-row>
            <el-col :span="4">
                <el-card class="box-card" :style="{height:queryVisible?(clientHeight+120)+'px':(clientHeight+90)+'px'}">
                    <el-row>
                        <el-col :span="16">
                            <span class="left-title">商品分类</span>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="text" icon="plus" @click="handleOpenTree" style="margin-left: 15px;font-size: 14px;">
                                <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>
                                <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-tree
                            class="filter-tree"
                            :data="categoryList"
                            node-key="value"
                            highlight-current
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            :filter-node-method="filterNode"
                            ref="categoryTree"
                            @node-click="getNodeData"
                            default-expand-all
                            style='margin-top:10px;'>
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="20" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
                    <div class="classify">
                        <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类:</span>
                        <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                                       style="display: inline-block;margin-right: 5px;">
                            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                                <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="listQuery.name">
                    </el-input>
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品品牌" v-model="listQuery.name">
                    </el-input>
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入规格型号" v-model="listQuery.name">
                    </el-input>
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入订货号" v-model="listQuery.name">
                    </el-input>
                    <el-select v-model="listQuery.level" placeholder="请选择上架状态">
                        <el-option  value="0">下架</el-option>
                        <el-option  value="1">上架</el-option>
                    </el-select>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                    <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>

                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="" plain >批量上架</el-button>
                        <el-button class="filter-item" type="success" icon="el-icon-download" @click="" plain >批量下架</el-button>
                        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="" plain disabled>贴标签</el-button>
                        <el-button type="warning" size="mini" @click="" icon="el-icon-download" plain disabled>导出</el-button>
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
                        <el-table-column align="center" min-width="100" label="商品名称" prop="name" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品品牌" prop="brandName">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="规格型号" prop="specModel">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="图片" prop="picUrl">
                            <template slot-scope="scope">
                                <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="系列" prop="seriesName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品面价" prop="productFacePrice">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="零售折扣" prop="retailDiscount">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="零售价" prop="retailPrice">
                        </el-table-column>
                        <el-table-column align="center" label="计量单位" prop="measureUnitName">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="上架状态" prop="isOnSale">
                            <template slot-scope="scope" >
                                <el-switch v-model="scope.row.isOnSale" active-color="#C0CCDA" inactive-color="#188AE2"
                                           @change="handleSwitchChange(scope.row,scope.$index)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="标签" prop="tagsList">
                            <template slot-scope="scope" >
                                <el-tag v-for="tag in scope.row.tagsList">{{tag}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="起订量" prop="moqMinOrder">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="库存数量" prop="stock">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="可售数量" prop="stock">
                        </el-table-column>


                        <el-table-column align="center" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)" disabled>编辑</el-button>
                                <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)" disabled>详情</el-button>
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
        <el-dialog modal-append-to-body
                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="left" label-width="140px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="类目名称" prop="name">
                    <el-input v-model="addList.name"></el-input>
                </el-form-item>
                <el-form-item label="父类目" prop="pid" v-if="dialogStatus=='create'">
                    <el-cascader v-model="addList.pid" :show-all-levels="false" :props="{ checkStrictly: true }" :options="categoryList" @change="handleCategoryChange" :change-on-select="true"></el-cascader>
                </el-form-item>
                <el-form-item label="级别" prop="level">
                    <el-select v-model="addList.level">
                        <el-option label="一级类目" value="L1">
                        </el-option>
                        <el-option label="二级类目" value="L2">
                        </el-option>
                        <el-option label="三级类目" value="L3">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sortOrder">
                    <el-input v-model="addList.sortOrder"></el-input>
                </el-form-item>
                <el-form-item label="类目图标" prop="iconUrl">
                    <el-upload
                            class="avatar-uploader"
                            action="api/saas/storage/create"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="addList.iconUrl" :src="addList.iconUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1MB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio-group v-model="addList.showStatus">
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
    </list-container>
</template>


<script>
    import {listCatAndBrand,addCategory,deleteMultiCategory,updateCategory} from '@/api/erp/saas/goodsClassify';
    import {page,goodsPutaway} from '@/api/erp/saas/allGoods';

    export default {
        name: 'goodsPutaway',
        components: {},
        props: ['timeStamp'],
        data() {
            return {
                textMap: {
                    update: '编辑商品类目',
                    create: '新建商品类目'
                },
                dialogStatus: '',//当前表单为新建还是编辑
                rules: {//新增类目表单验证
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
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
                    showStatus:1,//默认为显示
                    pid:'',//父类目
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
                listCatAndBrand().then(response => {
                    this.categoryList = response.data.data.categoryList;
                    this.brandList = response.data.data.brandList;
                });
                this.getList()
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(response => {
                    this.list = response.data.data.records;
                    for (let i in response.data.data.records) {
                        response.data.data.records[i].isOnSale=Boolean(response.data.data.records[i].isOnSale)
                        if (response.data.data.records[i].tags && response.data.data.records[i].tags !== '') {
                            response.data.data.records[i].tagsList = response.data.data.records[i].tags.split(',');
                        } else {
                            response.data.data.records[i].tagsList = [];
                        }
                        this.list[i].showStatus=!Boolean(this.list[i].showStatus)
                    }
                    this.total = response.data.data.total;
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
                console.log(row)
                let data={
                    id:row.id,
                    status:row.isOnSale?1:0
                }
                goodsPutaway(data).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('更改商品上下架状态成功!')
                    }else{
                        this.showError('更改商品上下架状态失败,'+res.data.msg||res.data.data,res.data.code)
                        this.init()
                    }

                },error => this.$message.error('更改商品上下架状态失败,'+error))
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
                    deleteMultiCategory(ids).then(res => {
                        if (res.data.code === 2000) {
                            this.$message.success("删除商品类目成功")
                            this.init();
                        } else {
                            this.$message.error('删除商品类目失败'+res.data.msg||res.data.data)
                        }
                    },error=>this.$message.error('删除商品类目失败'+error));
                });
            },
            handleDownload() {
                document.getElementById('test123').click()
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
                this.addList.iconUrl = res.data.url;
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
                        let method=this.dialogStatus==='create'?addCategory:updateCategory
                        let message=this.dialogStatus==='create'?"类目新增":"类目编辑"
                        method(this.addList).then(res => {
                            if (res.data.code === 2000) {
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
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if(Number(code)===401){
                    this.$message.warning(message)
                }else{
                    this.$message.error(message)
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
