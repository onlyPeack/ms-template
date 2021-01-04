<template>
    <div class="app-container calendar-list-container" style="margin-top: 8px;">

        <el-row>
            <el-col :span="4" >
                <el-card class="box-card" :style="{height:(clientHeight+90)+'px'}" style="overflow: auto;margin-left: 20px;margin-top: 0px !important;padding-bottom: 40px;">
                    <el-row >
                        <el-col :span="16">
                            <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                            </el-input>
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
                            style='margin-top:10px;'
                    >
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="20" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding:14px 10px;">
                    <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类:</span>
                    <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                                   style="display: inline-block;margin-right: 5px;">
                        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                            <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入父类目ID" v-model="listQuery.pid">
                    </el-input>-->
                    <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入类目ID" v-model="listQuery.id">-->
                    <!--</el-input>-->
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入类目名称" v-model="listQuery.name"
                              @keyup.enter.native="handleFilter">
                    </el-input>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                    <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
                </div>
                <div style="width: 100%;background: #ffffff;">
                    <!-- 查询结果 -->
                    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight" style="width: 98%;height: 100%;position:relative;margin-left: 1%;"
                              :default-sort="{prop: 'id', order: 'ascending'}">
                        <el-table-column type="index" width="60" label="序号" align="center">
                        </el-table-column>

                        <el-table-column align="center" label="类目名" prop="name">
                        </el-table-column>
                        <el-table-column align="center" property="iconUrl" label="类目图标">
                            <template slot-scope="scope">
                                <img :src="scope.row.iconUrl" width="40" v-if="scope.row.iconUrl"/>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" property="picUrl" label="类目图片">
                            <template slot-scope="scope">
                                <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="关键字" prop="keywords">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="简介" prop="desc">
                        </el-table-column>
                        <!--<el-table-column label="导航栏" width="100" align="center">-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-switch-->
                        <!--@change="handleNavStatusChange(scope.$index, scope.row)"-->
                        <!--:active-value=1-->
                        <!--:inactive-value=0-->
                        <!--v-model="scope.row.navStatus">-->
                        <!--</el-switch>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="是否显示" width="100" align="center">-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-switch-->
                        <!--@change="handleShowStatusChange(scope.$index, scope.row)"-->
                        <!--:active-value=1-->
                        <!--:inactive-value=0-->
                        <!--v-model="scope.row.showStatus">-->
                        <!--</el-switch>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column align="center" label="级别" prop="level"
                                         :filters="[{ text: '一级类目', value: 'L1' }, { text: '二级类目', value: 'L2' },{ text: '三级类目', value: 'L3' },{ text: '四级类目', value: 'L4' },]"
                                         :filter-method="filterLevel">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info' ">
                                    <span v-if="scope.row.level === 'L1'">一级类目</span>
                                    <span v-if="scope.row.level === 'L2'">二级类目</span>
                                    <span v-if="scope.row.level === 'L3'">三级类目</span>
                                    <span v-if="scope.row.level === 'L4'">四级类目</span>
                                </el-tag>
                            </template>
                        </el-table-column>

                        <!--<el-table-column align="center" label="父类目ID" prop="pid">
                        </el-table-column>-->

                        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div class="pagination-container" style="padding:20px 14px;background: #ffffff;">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="listQuery.page"
                                   :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!-- 添加或修改对话框 -->
        <el-dialog modal-append-to-body class="insertBudgetDialog"
                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <div style="margin:0px 30px;">
                <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="right" label-width="82px"
                         style='width: 100%;'>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item label="类目名称" prop="name">
                                <el-input v-model="dataForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="关键字" prop="keywords">
                                <el-input v-model="dataForm.keywords"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" v-if="dialogStatus=='create'">
                        <el-col :span="12">
                            <el-form-item label="父类目" prop="pid" v-if="dialogStatus=='create'">
                                <el-cascader expand-trigger="hover" :options="categoryList" v-model="dataForm.pid"
                                             @change="handleCategoryChange" :change-on-select="true" filterable></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序" prop="sortOrder">
                                <el-input v-model="dataForm.sortOrder"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" v-else>
                        <el-col :span="24">
                            <el-form-item label="排序" prop="sortOrder">
                                <el-input v-model="dataForm.sortOrder"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item label="类目图标" prop="iconUrl">
                                <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card" :show-file-list="false"
                                           accept=".jpg,.jpeg,.png,.gif" :on-success="uploadIconUrl">
                                    <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <i v-if="dataForm.iconUrl" class="el-icon-delete el-icona" @click.stop="deletePreview(1)"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类目图片" prop="picUrl">
                                <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card" :show-file-list="false"
                                           accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
                                    <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <i v-if="dataForm.picUrl" class="el-icon-delete el-icona"@click.stop="deletePreview(2)"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="类目简介" prop="desc">
                        <el-input v-model="dataForm.desc" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('Loading',1)" :loading="Loading">保存</el-button>
                <el-button v-else type="primary" @click="updateData('Loading',1)" :loading="Loading">保存</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('Loading',2)" :loading="isLoading">保存并新增</el-button>
                <el-button v-else type="primary" @click="updateData('Loading',2)" :loading="isLoading">保存并新增</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }

    .curr-classify {
        font-size: 14px;
        position: relative;
        top: -2px;
        color: #5a5e66;
    }

    .el-breadcrumb__inner a {
        color: #1276c3 !important;
        cursor: pointer !important;
    }
</style>

<script>
    import {
        page,
        getCategoryBylevel,
        addObj,
        putObj,
        delObj,
        categoryTree,
        updateNavStatus,
        updateShowStatus
    } from '@/api/erp/goods/category'
    import {uploadPath} from '@/api/erp/goods/storage'
    import {allBrand, pageBycategoryId} from '@/api/erp/goods/brand';

    export default {
        name: 'Category',
        data() {
            return {
                Loading: false.
                uploadPath,
                isLoading: false,
                list: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    id: undefined,
                    name: undefined
                },
                catLevel: [],
                dataForm: {
                    id: undefined,
                    name: '',
                    keywords: '',
                    level: 'L2',
                    pid: undefined,
                    desc: '',
                    iconUrl: undefined,
                    picUrl: undefined,
                    navStatus: 1,
                    showStatus: 1,
                    brandIds: []
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑商品类目',
                    create: '创建商品类目'
                },
                rules: {
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                    pid: [{required: true, message: '父类目不能为空', trigger: 'blur'}],
                    sortOrder: [{required: true, message: '排序不能为空', trigger: 'blur'}]
                },
                downloadLoading: false,
                categoryList: [],
                clientHeight: 300,
                isOpenTree: true,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                filterText: '',
                breadcrumbList: [{label: '所有分类', value: 0}],
                brandList: []
            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        computed:{
            uploadPath1(){
                return uploadPath();
            }
        },
        created() {
            this.getCategoryList();
            this.getCatBylevel('L1');
            this.init();
            this.getList();
            this.changeDivHeight();
            const _this = this;
            window.onresize = function () {
                _this.changeDivHeight();
            }
        },
        methods: {
            deletePreview(val){
                if(val == 1){
                    this.dataForm.iconUrl = ''
                }else{
                    this.dataForm.picUrl = ''
                }
            },
            handleCategoryChange(value) {
                this.dataForm.pid = value[value.length - 1]
            },
            changeDivHeight() {
                this.clientHeight = document.body.clientHeight - 280;
            },
            getCategoryList() {
                categoryTree().then(response => {
                    this.categoryList = response.data.data.categoryList;
                });
            },
            init() {
                allBrand().then(response => {

                    this.brandList = response.data;
                })
            },
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
                });
            },
            handleOpenTree() {
                this.isOpenTree = !this.isOpenTree;
                for (var i in this.$refs.categoryTree.store.nodesMap) {
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
                this.listQuery.pid = data.value;
                var breadcrumbList = [];
                breadcrumbList.push(data);
                if (node.parent) {
                    breadcrumbList = this.getAllParentNode(node, breadcrumbList);
                }
                this.breadcrumbList = breadcrumbList.reverse();
                this.handleFilter();
            },
            changeTreeNode(data, index) {
                this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
                this.listQuery.pid = data.value;
                this.$refs.categoryTree.setCurrentKey(data.value);
                this.handleFilter();
            },
            getCatBylevel(level) {
                getCategoryBylevel(level).then(response => {
                    this.catLevel = response.data.data;
                })
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            resetForm() {
                this.dataForm = {
                    id: undefined,
                    name: '',
                    keywords: '',
                    level: 'L2',
                    pid: undefined,
                    desc: '',
                    iconUrl: undefined,
                    picUrl: undefined,
                    navStatus: 1,
                    showStatus: 1,
                    brandIds: []
                }
            },
            filterLevel: function (value, row) {
                return row.level === value;
            },
            onLevelChange: function (value) {
                this.dataForm.pid = undefined;
                if (value === 'L2') {
                    this.getCatBylevel('L1');
                } else if (value === 'L3') {
                    this.getCatBylevel('L2');
                } else if (value === 'L4') {
                    this.getCatBylevel('L3');
                }
            },
            handleCreate() {
                this.resetForm();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate();
                })
            },
            uploadIconUrl: function (response) {
                this.dataForm.iconUrl = response.data.url
            },
            uploadPicUrl: function (response) {
                this.dataForm.picUrl = response.data.url
            },
            createData(type,sum) {
                if (this.dataForm.level != 'L1' && this.dataForm.pid == undefined) {
                    this.$notify({
                        title: '提示',
                        message: '请选择父类目',
                        type: 'warning',
                        duration: 2000
                    });
                    this.isLoading = false;
                    return;
                }

                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        if(type == 'Loading'){
                            this.Loading = true;
                        }else{
                            this.isLoading = true;
                        }
                        addObj(this.dataForm).then(response => {
                            this.isLoading = false;
                            if (response.data.code == '2000') {
                                this.list.unshift(response.data);
                                if(sum != 2){
                                    this.dialogFormVisible = false;
                                }else{
                                    this.resetForm();
                                    this.dialogStatus = 'create';
                                    this.dialogFormVisible = true;
                                    this.$nextTick(() => {
                                        this.$refs['dataForm'].clearValidate();
                                    })
                                }
                                this.getList()
                                this.getCategoryList();
                                this.$message({
                                    type: "success",
                                    message:  response.data.msg,
                                });
                            } else {
                                this.$message({
                                    type: "warning",
                                    message:  response.data.msg,
                                });
                            }
                            if(type == 'Loading'){
                                this.Loading = false
                            }else{
                                this.Loading = false
                            }
                        }).catch(()=>{
                            if(type == 'Loading'){
                                this.Loading = false
                            }else{
                                this.Loading = false
                            }
                        })
                    } else {
                        this.isLoading = false;
                        return false;
                    }
                })
            },
            handleSelectChange() {
                this.$forceUpdate();
            },
            handleUpdate(row) {
                this.dataForm = Object.assign({}, row);
                if (!this.dataForm.brandIds) {
                    this.dataForm.brandIds = [];
                }
                this.$forceUpdate();
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData(type,sum) {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        if(type == 'Loading'){
                            this.Loading = false
                        }else{
                            this.Loading = false
                        }
                        putObj(this.dataForm.id, this.dataForm).then(response => {
                            if (response.data.code == '2000') {
                                if(sum != 2){
                                    this.dialogFormVisible = false;
                                }else{
                                    this.resetForm();
                                    this.dialogStatus = 'create';
                                    this.dialogFormVisible = true;
                                    this.$nextTick(() => {
                                        this.$refs['dataForm'].clearValidate();
                                    })
                                }
                                this.getList();
                                this.getCategoryList();
                                this.$notify({
                                    title: '成功',
                                    message: '更新成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.$message({
                                    type: "success",
                                    message:   '成功',
                                });

                            } else {
                                this.$message({
                                    type: "warning",
                                    message:  response.data.msg,
                                });
                            }
                            if(type == 'Loading'){
                                this.Loading = false
                            }else{
                                this.Loading = false
                            }
                        }).catch(()=>{
                            if(type == 'Loading'){
                                this.Loading = false
                            }else{
                                this.Loading = false
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('该操作将删除该类目及其下属所有子类目，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(row.id).then(response => {
                        if (response.data.code == '2000') {
                            this.getCategoryList();
                            this.getList()
                            this.$message({
                                type: "success",
                                message:  response.data.msg,
                            });
                            const index = this.list.indexOf(row);
                            this.list.splice(index, 1);
                        }else if (response.data.code == '401') {
                            this.$message({
                                type: "warning",
                                message:  response.data.msg,
                            });
                        }else {
                            this.$message({
                                type: "warning",
                                message:  response.data.msg,
                            });
                        }
                    });
                });
            },
            // handleDownload() {
            //     this.downloadLoading = true;
            //     this.list = this.list == undefined || this.list == null ? [] : this.list;
            //     import('@/vendor/Export2Excel').then(excel => {
            //         const tHeader = ['类目ID', '类目名', '类目图标', '类目图片', '关键字', '简介', '导航栏', '是否显示', '级别'];
            //         const filterVal = ['id', 'name', 'iconUrl', 'picUrl', 'keywords', 'desc', 'navStatus', 'showStatus', 'level']
            //         excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品类目')
            //         this.downloadLoading = false
            //     })
            // },
            handleNavStatusChange(index, row) {
                updateNavStatus(row.navStatus, row.id).then(response => {
                    if (response.status == 200) {
                        this.$message({
                            type: "success",
                            message: '成功!',
                        });
                        this.getList()
                    } else {
                        this.$message({
                            type: "warning",
                            message: response.msg,
                        });
                    }
                })
            },
            handleShowStatusChange(index, row) {
                updateShowStatus(row.showStatus, row.id).then(response => {
                    if (response.status == 200) {
                        this.$message({
                            type: "success",
                            message: '成功!',
                        });
                        this.getList()
                    } else {
                        this.$message({
                            type: "warning",
                            message: response.msg,
                        });
                    }
                })
            }
        }
    }
</script>
<style>
    .el-upload--picture-card{
        position: relative;
    }
    .el-icona{
        position: absolute;
        font-size: 16px !important;
        right: 2px;
        top: 2px;
        z-index: 9999999;
    }
</style>
