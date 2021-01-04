<template>
    <div class="app-container calendar-list-container">
        <el-row>
            <el-col :span="24" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding:14px 16px;">
                    <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">新增</el-button>
                </div>
                <div style="width: 100%;background: #ffffff;">
                    <!-- 查询结果 -->
                    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight" style="width: 98%;height: 100%;position:relative;margin-left: 1%;"
                              :default-sort="{prop: 'id', order: 'ascending'}">
                        <el-table-column  width="60" label="ID" align="center" prop="id">
                        </el-table-column>
                        <el-table-column align="center" prop="name" label="标签名称">
                        </el-table-column>
                        <el-table-column label="启用" width="100" align="center">
                            <template slot-scope="scope">
                                <el-switch
                                        @change="handleShowStatusChange(scope.$index, scope.row)"
                                        :active-value=1
                                        :inactive-value=0
                                        v-model="scope.row.status">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
                                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div class="pagination-container" style="padding:2px 14px;background: #ffffff;">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="listQuery.page"
                                   :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!-- 添加或修改对话框 -->
        <el-dialog modal-append-to-body
                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="140px" :inline="true" size="medium">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="addList.name" placeholder="请输入名称" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="启用：" prop="status">
                    <el-switch v-model="addList.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" :loading="isLoading">确定</el-button>
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
        getCategoryBylevel,
        updateNavStatus,
    } from '@/api/erp/goods/category'
    import {uploadPath} from '@/api/erp/goods/storage'
    import {page,addObj,putObj,delObj} from '@/api/erp/saas/contentControl/hotRecommend'

    export default {
        name: 'goodsTag',
        data() {
            return {
                addList:{//编辑&新建标签存储对象
                    name:'',//商品标签名称
                    status:1
                },
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
                dialogStatus:typeof String,
                textMap: {
                    update: '编辑热门搜索',
                    create: '创建热门搜索'
                },
                rules: {
                    name: [{required: true, message: '标签名不能为空', trigger: 'blur'}],
                    status: [{required: true, message: '启用状态不能为空', trigger: 'blur'}],
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
                brandList: [],

            }
        },
        created() {
            this.init();
            this.changeDivHeight();
            const _this = this;
            window.onresize = function () {
                _this.changeDivHeight();
            }
        },
        methods: {
            handleCategoryChange(value) {
                this.dataForm.pid = value[value.length - 1]
            },
            changeDivHeight() {
                this.clientHeight = document.body.clientHeight - 230;
            },
            init() {
                this.dialogFormVisible = false;
                // allBrand().then(response => {
                //     this.brandList = response.data;
                // })
                this.getList()
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
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
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
                this.addList = {
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
                //this.resetForm();
                this.addList={
                    status:1
                }
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            uploadIconUrl: function (response) {
                this.dataForm.iconUrl = response.data.url
            },
            uploadPicUrl: function (response) {
                this.dataForm.picUrl = response.data.url
            },

            /**
             * 新建和编辑商品标签
             */
            createData() {
                this.isLoading = true;
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        let method=this.dialogStatus==='create'?addObj:putObj
                        let message=this.dialogStatus==='create'?"热门搜索新增":"热门搜索编辑"
                        //this.addList.tags=this.addList.name
                        method(this.addList).then(response => {
                            this.isLoading = false;
                            if (Number(response.data.code) === 2000) {
                                this.list.unshift(response.data);
                                this.showSuccess(message+'成功')
                            } else {
                                this.showError(message+'失败,'+response.data.msg||response.data.data)
                            }
                        },error => this.showError(message+'失败,'+error))
                    } else {
                        this.isLoading = false;
                        return false;
                    }
                })
            },
            handleSelectChange() {
                this.$forceUpdate();
            },

            /**
             *行编辑事件
             * row
             */
            handleUpdate(row) {
                this.addList=row
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        putObj(this.dataForm.id, this.dataForm).then(response => {
                            if (response.data.code == '2000') {
                                this.dialogFormVisible = false;
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
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该记录，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(row.id).then(response => {
                        if (Number(response.data.code) === 2000||Number(response.data.code)===200) {
                            this.showSuccess('删除热门搜索成功')
                        }else {
                            this.showError('删除热门搜索失败,'+response.data.msg||response.data.data)
                        }
                    },error => this.showError('删除热门搜索失败,'+error));
                });
            },

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
                let params={
                    id:row.id,
                    status:row.status,
                    name:row.name
                }
                putObj(params).then(response => {
                    if (Number(response.data.code) === 200||Number(response.data.code)===2000) {
                        this.showSuccess('热门搜索启用状态更变成功')
                    } else {
                        this.showError('热门搜索启用状态状态变更失败,'+response.data.msg||response.data.data)
                    }
                },error => this.showError('热门搜索启用状态变更失败,'+error))
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
