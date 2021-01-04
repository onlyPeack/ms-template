<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" style="margin-left: 20px;"
                    class="app-container calendar-list-container goods-list-container">
        <a id="test123"
           :href="openUrl+'/api/manager/goods/exportList?userId='+userId"></a>
        <el-row>
            <el-col :span="4" >
                <el-card class="box-card" :style="{height:queryVisible?(clientHeight+120)+'px':(clientHeight+90)+'px'}">
                    <el-row>
                        <el-col :span="16">
                            <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="text" icon="plus" @click="handleOpenTree"
                                       style="margin-left: 15px;font-size: 14px;">
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
                            style='margin-top:10px;'
                    >
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="20" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
                    <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类:</span>
                    <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                                   style="display: inline-block;margin-right: 5px;">
                        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                            <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <!--</div>-->
                </div>
                <!-- 导入产品对话框 -->
                <!-- 导入产品对话框 -->
                <product-import v-if="dialogDataBaseVisible" :dialogDataBaseVisible="dialogDataBaseVisible"
                                @closeCoverDialog="closeCoverDialog" :selfCategoryId="selfCategoryId"
                                :categoryLists="categoryList">
                </product-import>
                <!-- 查询结果 -->
                <div class="result-container" style="padding: 0% 1%; background: #ffffff;">
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
                               style="padding-top: 10px;"
                               :cell-style="handleCellStyle">
                        <template slot="menuLeft">
                            <button-bar type="list"
                                        objectKey="SPLB"
                                        :objectType="0"
                                        ref="buttonBar"
                                        :permission="permissionCopy"
                                        :tableOption="tableOption"
                                        :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                        @handleSettingSubmit="handleSettingSubmit"
                                        @handleAdd="handleInsert"
                                        @handleExport="handleDownload"
                                        @handleEdit="handleEdit"
                                        @handleDelete="handleDelete"
                            ></button-bar>
<!--                            <el-button class="filter-item" type="warning" :loading="downloadLoading" plain-->
<!--                                       icon="el-icon-download"-->
<!--                                       @click="handleDownload">导出-->
<!--                            </el-button>-->
                            <!--<el-button plain class="filter-item" icon="el-icon-download">-->
                            <!--<a :href="openUrl+'/api/manager/goods/downTemplate'" style="color: #606266;">EXCEL导入模板下载</a>-->
                            <!--</el-button>-->
<!--                            <el-button type="info" plain icon="el-icon-download" class="filter-item filter-itemss">-->
<!--                                <a :href="openUrl+'/api/manager/goods/downTemplate'"-->
<!--                                   style="color: #606266;">EXCEL导入模板下载</a>-->
<!--                            </el-button>-->
<!--                            <el-button type="info" plain icon="el-icon-download" class="filter-item" @click="dialogDataVisible">-->
<!--                            导入产品库数据-->
<!--                            </el-button>-->
<!--                            <el-upload class="upload" action="/api/manager/goods/import" :before-upload="beforeUpload"-->
<!--                                       :on-remove="handleRemove" :show-file-list="false"-->
<!--                                       :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList"-->
<!--                                       style="display:inline;margin: 0px 0px;" :on-success="uploadCompleted"-->
<!--                                       :headers="headers">-->
<!--                                <el-button type="primary" plain icon="el-icon-download">-->
<!--                                    EXCEL导入-->
<!--                                </el-button>-->
<!--                            </el-upload>-->
                            <!--<el-checkbox v-model="checked" @change="batchNumber">按批次号显示</el-checkbox>-->
                            <el-dropdown @command="handleCommand" placement="bottom-start">
                                <el-button type="primary" plain>
                                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="dialogDataVisible">导入产品库数据</el-dropdown-item>
                                    <el-dropdown-item command="excelImport">
                                        <el-upload class="upload" action="/api/manager/goods/import" :before-upload="beforeUpload"
                                                   :on-remove="handleRemove" :show-file-list="false"
                                                   :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList"
                                                   style="display:inline;margin: 0px 0px;" :on-success="uploadCompleted"
                                                   :headers="headers">
                                            <span>
                                                EXCEL导入
                                            </span>
                                        </el-upload>
                                    </el-dropdown-item>
                                    <el-dropdown-item command="excelDownload">导入模板下载</el-dropdown-item>
                                    <el-dropdown-item command="handleDelete" v-if="permission.delBtn">删除　　　　&nbsp;</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <template slot-scope="scope" slot="menu">
                            <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑
                            </el-button>
                        </template>
                    </avue-crud>
                </div>
            </el-col>
        </el-row>
    </list-container>
</template>


<script>
    import {
        page,
        delObj,
        listCatAndBrand,
        initGoodsFromStandardStore,
        updateOnSaleStatus,
        updateIsNewStatus,
    } from '@/api/erp/goods/goods';
    import productImport from './productImport';
    import {openUrl} from '@/config/env';

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);

    export default {
        name: 'componentList',
        components: {
            productImport,
            'button-bar': () => import('@/components/setting/button_bar')
        },
        props: ['timeStamp'],
        data() {
            return {
                checked: false,
                permissionCopy: {
                    checked: false,
                    addBtn: true,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: true,
                    exportBtn: true,
                    printBtn: false,
                },
                permission: {
                    checked: false,
                    addBtn: true,
                    delBtn: true,
                    editBtn: false,
                    viewBtn: true,
                    exportBtn: false,
                    printBtn: false,
                },
                loading: false,
                categoryId: undefined,
                tableOption: {
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    menu: true,
                    menuWidth: 120,
                    editBtn: false,
                    viewBtn: false,
                    delBtn: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: []
                },
                billColumn: [
                    {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 160,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "分类名称",
                        prop: "categoryName",
                        minWidth: 160,
                        align: 'left',
                    },
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        minWidth: 120,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "系列名称",
                        prop: "seriesName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 140,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "规格型号",
                        prop: "specifications",
                        minWidth: 160,
                        align: 'left',
                        search: true,
                    },
                    {
                        label: "产品面价",
                        prop: "retailPrice",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "产品面价"
                            );
                        },
                    },
                    {
                        label: "计量单位",
                        prop: "unit",
                        minWidth: 100,
                        align: 'left',
                    },
                ],
                isShow: true,
                page: {
                    pageSizes: [10, 20, 50, 100, 300],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                headers: undefined,
                fromOut: '',
                selfCategoryId: undefined,
                clientHeight: 300,
                list: [],
                total: 0,
                listLoading: true,
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
                detailedColumn: [],
                userId: undefined
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
            this.tableOption.column = this.billColumn;
            this.getConfigList();
            this.getList(this.page);
        },
        watch: {
            filterText(val) {
                this.$refs.categoryTree.filter(val);
            }
        },
        methods: {
            batchNumber() {
                this.getList(this.page);
            },
            handleSettingSubmit(obj) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption = obj;
                    this.billColumn = obj.column;
                    this.isShow = true;
                })
            },
            getConfigList() {
                this.setList(this, 'SPLB');
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
            handleExceed(files, fileList) {
            },
            uploadCompleted(response, file, fileList) {
                this.getList(this.page);
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
                // return this.$confirm(`确定移除 ${file.name}？`);
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
                if(isXLS && isLt10M){
                    this.$alert('正在导入中，请耐心等待。', "提示", {
                        confirmButtonText: "确定",
                    }).then(() => {
                    });
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
                this.handleBillAdd(this, {path: '/goodsListForm', name: '商品列表制单'});
            },
            dialogDataVisible() {
                if (this.categoryId !== undefined) {
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
                listCatAndBrand().then(response => {
                    this.categoryList = response.data.data.categoryList;
                    this.brandList = response.data.data.brandList;
                });
            },
            getList(pages, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {
                    page: pages.currentPage,
                    limit: pages.pageSize,
                    categoryId: this.categoryId
                });
                queryObj = JSON.parse(JSON.stringify(queryObj));
                page(queryObj).then(response => {
                    this.list = response.data.data.records;
                    for (let i in response.data.data.records) {
                        if (response.data.data.records[i].tags && respons.data.data.records[i].tags !== '') {
                            response.data.data.records[i].tagsList = response.data.data.records[i].tags.split(',');
                        } else {
                            response.data.data.records[i].tagsList = [];
                        }
                    }
                    this.page.total = response.data.data.total;
                    this.loading = false;
                }).catch(() => {
                    this.list = [];
                    this.total = 0;
                    this.loading = false;
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
                this.categoryId = data.value;
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
                this.categoryId = data.value;
                this.$refs.categoryTree.setCurrentKey(data.value);
                this.handleFilter();
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList(this.page);
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getList(this.page);
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList(this.page);
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
            handleUpdate(index, row) {
                this.$router.push({
                    path: '/goodsListForm',
                    name: '商品列表制单',
                    query: {
                        id: row.goodsId,
                        type: 'edit'
                    },
                    meta: {
                        i18n: 'goodsListForm'
                    }
                });
            },
            //编辑
            handleEdit(type) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要查看的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能查看一个条目');
                    return false;
                }
                this.$router.push({
                    path: '/goodsListForm',
                    name: '商品列表制单',
                    query: {
                        id: this.selectedRows[0].goodsId,
                        type: type
                    },
                    meta: {
                        i18n: 'goodsListForm'
                    }
                });
            },
            showDetail(detail) {
                this.goodsDetail = detail;
                this.detailDialogVisible = true;
            },
            handleDelete(index, row) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                this.selectedRows.forEach((row) => {
                    ids.push(row.goodsId)
                });
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(ids).then(res => {
                        if (res.data.code == "2000") {
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.getList(this.page);
                        } else {
                            this.$notify({
                                title: '删除失败',
                                message: res.data.msg,
                                type: 'warning',
                                duration: 2000
                            });
                        }


                    });
                });
            },
            handleDownload() {
                document.getElementById('test123').click()
            },

            handleCommand(command){
                if(command==='excelDownload'){
                    window.open(openUrl+'/api/manager/goods/downTemplate','_blank')
                    return false
                }else if(command==='excelImport'){
                    return false
                }
                this[command]()
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .el-card.is-always-shadow{
        margin-top: 0px !important;
    }
    .filter-itemss:hover {
        a {
            color: #ffffff !important;
        }
    }

    .goods-list-container {
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
                }

                goodsManager
                .input-new-keyword .el-input__inner {
                    border: 1px solid #409EFF !important;
                }
            }
        }
    }
</style>
