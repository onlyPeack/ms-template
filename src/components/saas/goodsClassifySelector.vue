<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose"
               :before-close="handleClose" title="选择商品分类" append-to-body class="public-dialog">
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入分类名称" v-model="listQuery.name">
                    </el-input>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                    <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>
                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" ></div>
                </div>
                <!-- 查询结果 -->
                <div class="result-container" style="padding: 0% 1%; background: #ffffff;">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" row-key="id" @row-click="rowClick"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column align="left" min-width="100" label="分类名称" prop="name">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="分类ID" prop="id" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="图标" prop="iconUrl">
                            <template slot-scope="scope">
                                <img :src="scope.row.iconUrl" width="40"/>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="排序" prop="sortOrder" sortable>
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
    </list-container>
    </el-dialog>
</template>


<script>
    import {treePage} from '@/api/erp/saas/goodsClassify';

    export default {
        name: 'goodsClassifySelector',
        components: {},
        props: ['timeStamp','dialogVisible', 'isSingle', 'title','option','typeName','isOnSale','code','typeOption','id','itemVisible','selectType','operationType','craftId','config','discountLevel'],
        data() {
            return {
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
                tableData:[]
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
            if (this.$store.state.user.id == '1') {
                this.initializingShow = false; // 超级管理员不显示商品初始化功能
            }
            this.getList(this.listQuery);
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

            /**
             *表格单选
             */
            handlechangeFun(newRow, oldRow) {
                this.selectedRows = newRow;
                console.log(this.selectedRows, '单选')
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
                this.isLoading = false
                this.getList()
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                treePage(this.listQuery).then(response => {
                    this.tableData = response.data.data || []
                    let data = [...this.tableData]
                    //this.cascaderData=[{name:'顶级栏目',id:0,children: [...data]}]
                    if (this.listQuery.name && this.listQuery.name !== '') {
                        // data=data.filter(item=>item.name.indexOf(this.listQuery.name)>-1)
                        data = this.treeSelect(data, this.listQuery.name)
                    }
                    this.total = data.length
                    this.list = data.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
                    this.listLoading = false;
                    //console.log(this.list)
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
                this.listQuery.level = ''
                this.getList(this.listQuery);
            },

            /**
             * 错误处理方法
             * @param message 错误信息
             */
            showError(message) {
                this.$message.error(message)
                this.isLoading = false
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
             * 从父组件中接收的关闭对话框方法
             */
            handleClose() {
                this.$emit('handleClose');
            },

            /**
             * 确认选择事件
             */
            handleSubmit() {
                if (!this.selectedRows.id) {
                    this.vueMessage('warning', '请选择需要关联的商品分类');
                    return false;
                }
                let ids = {
                    arr: [],
                    type: 'goodsClassify',
                    seriesName: this.selectedRows.name,
                    seriesId: this.selectedRows.id
                };
                ids.arr.push(this.selectedRows.id)
                this.$emit('handleSubmit', ids);
            },

            /**
             *行单击
             */
            rowClick(row) {
                let ids = {
                    arr: row,
                    type: 'goodsClassify',
                    seriesName: row.name,
                    seriesId: row.id
                };
                this.$emit('handleSubmit', ids);
            },

            fuzzyQuery(list, keyWord) {
                let arr = [];
                for (let i = 0; i < list.length; i++) {
                    if (list[i].name.match(keyWord) != null) {
                        arr.push(list[i])
                    } else if (list[i].children && list[i].children.length > 0) {
                        if (this.fuzzQueryDeep(list[i].children, keyWord)) {
                            arr.push(list[i])
                        }
                    }

                }
                return arr;
            },
            fuzzQueryDeep(list, keyWord) {
                for (let j = 0; j < list.length; j++) {
                    if (list[j].name.match(keyWord) != null) {
                        return true
                    } else if (list[j].children && list[j].children.length > 0) {
                        return this.fuzzQueryDeep(list[j].children, keyWord)
                    }
                }
                return false
            },

            treeSelect(list,keyWord){
                let arr=[]
                //console.log('start')
                for (let i = 0; i <list.length ; i++) {
                    if (list[i].name.match(keyWord) != null) {
                        arr.push(list[i])
                    }else{
                        if (list[i].children && list[i].children.length > 0) {
                            let Ts = this.treeSelect(list[i].children, keyWord)
                            if (Ts.length > 0) {
                                arr.push(list[i])
                                arr[arr.length - 1].children = Ts
                            }
                        }
                    }
                }
                //console.log(arr,'over')
                return arr
            },



            async searchCategory_name(data, keyWord) {
                if (keyWord !== '') {
                    this.list=  await this.searchData(data, keyWord);
                }
            },
            searchData(data, val) {
                return data.filter(function f(o) {
                    if (o.name.includes(val)) return true
                    if (o.children) {
                        return (o.children = o.children.filter(f)).length
                    }
                })
            },
        }
    }
    /*目前使用:全部商品中新增商品(单选) 商品系列关联分类(单选)*/
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
