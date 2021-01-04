<template>
    <div class="app-container calendar-list-container">
        <el-row>
            <el-col :span="24" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding:14px 16px;">
                    <el-form :inline="true" label-width="100px" label-position="right">
                        <el-form-item label="路径：">
                            <el-input v-model="listQuery.url" style="width: 250px" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="租户号：">
                            <el-input v-model="listQuery.tenant" style="width: 250px" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button icon="el-icon-search" type="primary" @click="getList">查询</el-button>
                            <el-button icon="el-icon-delete" @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button plain type="success" @click="handleCreate" icon="el-icon-plus">新增</el-button>
                </div>
                <div style="width: 100%;background: #ffffff;">
                    <!-- 查询结果 -->
                    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight" style="width: 98%;height: 100%;position:relative;margin-left: 1%;"
                              :default-sort="{prop: 'id', order: 'ascending'}">
                        <el-table-column  width="60" type="index" align="center"></el-table-column>
                        <el-table-column align="center" prop="url" label="路径">
                        </el-table-column>
                        <el-table-column label="租户号" align="center" prop="tenant">
                        </el-table-column>
                        <el-table-column label="备注" align="center" prop="note">
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
<!--                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" plain>修改</el-button>-->
                                <el-button type="danger" size="mini" @click="handleDelete(scope.row)" plain>删除</el-button>
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
                <div style="height: 50px"></div>
            </el-col>
        </el-row>

        <!-- 添加或修改对话框 -->
        <el-dialog modal-append-to-body width="30%"
                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="140px" size="medium">
                <el-form-item label="路径：" prop="url">
                    <el-input v-model="addList.url" placeholder="请输入路径" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="租户号：" prop="tenant">
                    <el-input v-model="addList.tenant" placeholder="请输入租户号" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="note">
                    <el-input v-model="addList.note" placeholder="请输入备注" style="width: 300px"></el-input>
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
    import {tempType,tempArea} from "./common/dic";
    import {addObj,putObj,page,delObj} from '@/api/temp/urlMap'

    export default {
        name: 'urlMap',
        data() {
            return {
                addList:{//编辑&新建标签存储对象
                    name:'',//商品标签名称
                    status:1
                },
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
                tempType,
                tempArea,
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
                    update: '编辑路径',
                    create: '添加路径'
                },
                rules: {
                    url: [{required: true, message: '路径不能为空', trigger: 'blur'}],
                    tenant: [{required: true, message: '租户号不能为空', trigger: 'blur'}],
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
            //this.getList();
            this.changeDivHeight();
            const _this = this;
            window.onresize = function () {
                _this.changeDivHeight();
            }
            // console.log(tempType[1],'tempType')
        },
        watch:{
            '$route':function () {
                if(this.$route.query.success){
                    this.getList()
                }
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
                this.clientHeight = document.body.clientHeight - 230;
            },
            init() {
                this.dialogFormVisible = false;
                this.getList()
            },
            getList() {
                this.listLoading = true;
                console.log(this.listQuery,'query')
                page(this.listQuery).then(response => {
                    this.list = response.data.records;
                    this.total = response.data.total;
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
                delete this.listQuery.url
                delete this.listQuery.tenant
                this.getList()
            },
            filterLevel: function (value, row) {
                return row.level === value;
            },
            handleCreate() {
                this.dialogStatus='create'
                this.dialogFormVisible=true
                this.addList={}
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
                        let message=this.dialogStatus==='create'?"路径新增":"路径编辑"
                        this.addList.tags=this.addList.name
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
                this.$router.push({
                    path:'/temp/tempForm',
                    query:{
                        flag:'upd',
                        id:row.id
                    }
                })
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
                this.$confirm('此操作将永久删除该路径，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(row.id).then(response => {
                        if (Number(response.data.code) === 2000||Number(response.data.code)===200) {
                            this.showSuccess('删除路径成功')
                        }else {
                            this.showError('删除路径失败,'+response.data.msg||response.data.data)
                        }
                    },error => this.showError('删除路径失败,'+error));
                });
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
