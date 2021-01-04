<template>
    <el-dialog :visible.sync="dialogVisible" width="75%" @close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false"
               :before-close="handleClose" title="全部商品选择" append-to-body class="public-dialog">
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
                    <div style="background-color: rgb(255,247,232);padding: 15px;width: 600px;font-size: 14px;margin-left: 12px;" v-if="title==='选择推荐商品'">
                        <h3 style="color: red">温馨提示:</h3>
                        <h4>1、商品推荐最多添加50条，最少0条</h4>
                        <h4>2、已经添加的商品推荐将在个人中心-热门推荐、下架商品的详情中展示</h4>
                    </div>
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
                        <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入产品名称" v-model="listQuery.name">
                        </el-input>
                        <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入品牌名称" v-model="listQuery.brandName">
                        </el-input>
                        <el-input clearable class="filter-item" style="width: 200px;margin-right: 10px;" placeholder="请输入规格型号"
                                  v-model="listQuery.specifications">
                        </el-input>
                        <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入订货号"
                                  v-model="listQuery.itemNo">
                        </el-input>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                        <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>

                        <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        </div>
                    </div>
                    <!-- 查询结果 -->
                    <div class="result-container"style="padding: 0% 1%; background: #ffffff;">
                        <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" @row-click="handleRowClick" ref="list"
                                  element-loading-text="正在查询中。。。" border fit
                                  highlight-current-row :height="clientHeight"
                                  style="height: 100%;position:relative;overflow: auto;">
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
                            <el-table-column align="center" min-width="100" label="产品面价" prop="retailPrice">
                            </el-table-column>
                            <el-table-column align="center" min-width="100" label="零售折扣" prop="retailDiscount">
                            </el-table-column>
                            <el-table-column align="center" min-width="100" label="零售价" prop="retailPrice">
                            </el-table-column>
                            <el-table-column align="center" label="计量单位" prop="measureUnitName">
                            </el-table-column>
                            <el-table-column align="center" min-width="100" label="起订量" prop="moqMinOrder">
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
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>


<script>
    import {listCatAndBrand} from '@/api/erp/saas/goodsClassify';
    import {page} from '@/api/erp/saas/allGoods';
    export default {
        name: 'allGoodsSelector',
        components: {},
        props: ['timeStamp','dialogVisible','isOnsale', 'isSingle','title', 'option','typeName','code','isOnSale','typeOption','id','itemVisible','selectType','operationType','craftId','config','discountLevel'],
        data() {
            return {
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
                    isOnSale: this.isOnSale
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
                    label: 'name'
                },
                filterText: '',
                breadcrumbList: [{label: '所有分类', value: 0}],
                initializingShow: true,
                queryVisible: true,
                dialogDataBaseVisible: false,
                no: undefined,
                selectedRows: [],//当前多选框选中所有行
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
                this.listQuery.isOnsale=this.isOnsale
                page(this.listQuery).then(response => {
                    this.list = response.data.data.records;
                    for (let i in response.data.data.records) {
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
                    type:'allGoods',
                    seriesName:this.selectedRows[this.selectedRows.length-1].name,
                    seriesId:this.selectedRows[this.selectedRows.length-1].id
                };
                this.$emit('handleSubmit', ids);
            },

            /**
             * 行点击时选中此行
             * @param row 当前行
             * @param event
             * @param column
             */
            handleRowClick(row, event, column) {
                this.$refs.list.toggleRowSelection(row);
            },
        },
    }
    /*目前使用:添加商品中关联商品,商城楼层添加商品,多选;秒杀:新增商品,多选*/
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
