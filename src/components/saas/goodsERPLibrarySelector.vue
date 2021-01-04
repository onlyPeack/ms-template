<template>
    <el-dialog :visible.sync="dialogVisible" width="80%" @close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :nowClassify="nowClassify"
               :before-close="handleClose" title="从梅施产品库导入" append-to-body class="public-dialog">
        <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
            <a id="test123"
               :href="openUrl+'/api/goods/goods/exportList?userId='+userId"></a>
            <el-row>
                <!--                <el-col :span="4">-->
                <!--                    <el-card class="box-card" :style="{height:queryVisible?(clientHeight+120)+'px':(clientHeight+90)+'px'}">-->
                <!--                        <el-row>-->
                <!--                            <el-col :span="16">-->
                <!--                                <el-input-->
                <!--                                        placeholder="输入关键字进行过滤"-->
                <!--                                        v-model="filterText">-->
                <!--                                </el-input>-->
                <!--                            </el-col>-->
                <!--                            <el-col :span="8">-->
                <!--                                <el-button type="text" icon="plus" @click="handleOpenTree" style="margin-left: 15px;font-size: 14px;">-->
                <!--                                    <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>-->
                <!--                                    <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>-->
                <!--                                </el-button>-->
                <!--                            </el-col>-->
                <!--                        </el-row>-->
                <!--                        <el-tree-->
                <!--                                class="filter-tree"-->
                <!--                                :data="categoryList"-->
                <!--                                node-key="value"-->
                <!--                                highlight-current-->
                <!--                                :props="defaultProps"-->
                <!--                                :expand-on-click-node="false"-->
                <!--                                :filter-node-method="filterNode"-->
                <!--                                ref="categoryTree"-->
                <!--                                @node-click="getNodeData"-->
                <!--                                default-expand-all-->
                <!--                                style='margin-top:10px;'>-->
                <!--                        </el-tree>-->
                <!--                    </el-card>-->
                <!--                </el-col>-->
                <el-col :span="24" style='padding-left:10px;'>
                    <!-- 查询和其他操作 -->
                    <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
<!--                        <div class="classify">-->
<!--                            <div style="margin-bottom: 5px;">-->
<!--                                <el-tag>将加入本部分类:{{nowClassifyName}}</el-tag>-->
<!--                            </div>-->
<!--                            <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类:</span>-->
<!--                            <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"-->
<!--                                           style="display: inline-block;margin-right: 5px;">-->
<!--                                <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">-->
<!--                                    <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>-->
<!--                                </el-breadcrumb-item>-->
<!--                            </el-breadcrumb>-->
<!--                        </div>-->
                        <el-input clearable v-if="this.openERP*1===1" @keyup.enter.native="handleFilter" class="filter-item" style="width: 200px;margin-right: 15px" placeholder="请输入分类名称" v-model="listQuery.name">
                        </el-input>
                        <el-input clearable class="filter-item" @keyup.enter.native="handleFilter" style="width: 200px;margin-right: 15px" placeholder="请输入产品品牌名称" v-model="listQuery.brandName">
                        </el-input>
                        <el-input clearable v-if="this.openERP*1===1" @keyup.enter.native="handleFilter" class="filter-item" style="width: 200px;margin-right: 15px" placeholder="请输入产品系列名称" v-model="listQuery.productSeries">
                        </el-input>
                        <el-input clearable v-if="this.openERP*1===1" @keyup.enter.native="handleFilter" class="filter-item" style="width: 200px;margin-right: 15px" placeholder="请输入订货号" v-model="listQuery.itemNo">
                        </el-input>
                        <el-input clearable v-if="this.openERP*1!==1" @keyup.enter.native="handleFilter" class="filter-item" style="width: 200px;margin-right: 15px" placeholder="请输入产品系列名称" v-model="listQuery.seriesName">
                        </el-input>
                        <el-input clearable v-if="this.openERP*1!==1" @keyup.enter.native="handleFilter" class="filter-item" style="width: 200px;margin-right: 15px" placeholder="请输入产品编号" v-model="listQuery.productId">
                        </el-input>
                        <el-input class="filter-item" @keyup.enter.native="handleFilter" style="width: 200px;margin-right: 15px" placeholder="请输入产品型号" v-model="listQuery.productModel">
                        </el-input>
                        <el-input clearable v-if="this.openERP*1!==1" @keyup.enter.native="handleFilter" class="filter-item" style="width: 200px;margin-right: 15px" placeholder="请输入产品名称" v-model="listQuery.productName">
                        </el-input>
<!--                        <el-input  class="filter-item" style="width: 160px;margin-right:20px;" @keyup.enter.native="handleFilter" v-if="this.openERP*1!==1" placeholder="请输入产品订货号,多个订货号用','隔开" v-model="listQuery.orderNos" type="textarea" clearable>-->
<!--                        </el-input>-->
                        <!--                        <el-select v-model="listQuery.level" placeholder="请选择分类级别">-->
                        <!--                            <el-option  value="">全部</el-option>-->
                        <!--                            <el-option  value="L1">一级</el-option>-->
                        <!--                            <el-option  value="L2">二级</el-option>-->
                        <!--                            <el-option  value="L3">三级</el-option>-->
                        <!--                        </el-select>-->
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>

                        <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        </div>
                    </div>
                    <!-- 查询结果 -->
                    <div class="result-container"style="padding: 0% 1%; background: #ffffff;">
                        <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" @row-click="rowClick" ref="list"
                                  element-loading-text="正在查询中。。。" border fit
                                  highlight-current-row :height="clientHeight"
                                  style="width: 98%;height: 100%;position:relative;overflow: auto;">
                            <el-table-column type="selection" width="60" prop="index">
                            </el-table-column>
                            <el-table-column align="center" label="产品分类名称" prop="categoryName" v-slot="{row}">
                                <span>{{row.categoryName||row.cpCategory.name}}</span>
                            </el-table-column>
                            <el-table-column align="center" label="产品品牌名称" prop="brandName">
                            </el-table-column>
                            <el-table-column align="center" label="产品系列名称" prop="productSeries">
                            </el-table-column>
                            <el-table-column align="center" label="产品订货号" prop="itemNo" v-slot="{row}">
                                <span>{{row.itemNo||row.orderNo}}</span>
                            </el-table-column>
                            <el-table-column align="center" label="产品型号" prop="productModel">
                            </el-table-column>
                            <el-table-column align="center" label="产品名称" prop="skuName" v-slot="{row}">
                                <span>{{row.skuName||row.productName}}</span>
                            </el-table-column>
                            <el-table-column align="center" label="计量单位" prop="unit" v-slot="{row}">
                                <span>{{row.unit||row.measureUnit}}</span>
                            </el-table-column>
                            <el-table-column align="right" label="指导价" prop="retailPrice" v-slot="{row}">
                                <span>{{row.retailPrice||row.guidePrice}}</span>
                            </el-table-column>
                            <el-table-column align="center" label="产品编号" w prop="skuNo" v-slot="{row}">
                                <span>{{row.skuNo||row.productId}}</span>
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
        </list-container>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">导 入</el-button>
        </div>
    </el-dialog>
</template>


<script>
    import {page,getTree,selectPageFromErp} from '@/api/erp/saas/goodsLibrary';


    export default {
        name: 'goodsERPLibrarySelector',
        components: {},
        props: ['timeStamp','dialogVisible', 'isSingle', 'title','option','typeName','code','typeOption','id','itemVisible','selectType','operationType','craftId','config','discountLevel','nowClassify','nowClassifyName'],
        data() {
            return {
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
                    children: 'item',
                    label: 'name'
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
            //this.getList(this.listQuery);
        },
        // watch: {
        //     /**
        //      *分类树过滤
        //      */
        //     filterText(val) {
        //         this.$refs.categoryTree.filter(val);
        //     }
        // },
        computed:{
            openERP(){
                let localStorage = window.localStorage
                return localStorage['openERP']
            }
        },
        methods: {
            handleExceed(files, fileList) {
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
                // getTree().then(response => {
                //     this.categoryList = response.data;
                // });
                this.getList(this.listQuery)
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                //this.listQuery.categoryId=this._props.nowClassify
                //console.log(this._props,'props')
                let method=selectPageFromErp
                let params=Object.assign({},this.listQuery)
                if(this.openERP*1!==1){
                    params.pageNo=params.page
                    params.pageSize=params.limit
                    delete params.page
                    delete params.limit
                }
                method(params).then(response => {
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
                return data.name.indexOf(value) !== -1;
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
                this.listQuery.categoryId = data.id;
                this.listQuery.categoryName = data.name;
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


            handleDownload() {
                document.getElementById('test123').click()
            },
            /**
             * 重置按钮方法
             */
            clear() {
                this.listQuery={
                    page:1,
                    limit:10
                }
                this.getList()
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
             * 从父组件中接收的关闭对话框方法
             */
            handleClose() {
                this.$emit('handleClose');
            },

            /**
             * 确认选择事件
             */
            handleSubmit() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = {
                    arr:this.selectedRows,
                    type:'goodsERPLibrary',
                };
                this.$emit('handleSubmit', ids);
            },

            /**
             * 行单击
             * @param row 当前行
             */
            rowClick(row){
                this.$refs.list.toggleRowSelection(row);
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
