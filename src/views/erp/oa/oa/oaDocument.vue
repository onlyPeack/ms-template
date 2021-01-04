<template>
    <div class="app-container calendar-list-container">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content bg-purple" style="margin-left: 20px;">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>公司文件夹</span>
                        </div>
                        <div class="filter-container">
                            <el-button type="success" icon="el-icon-plus" @click="handleCreateTree">新建文件夹</el-button>
                            <el-button type="success" icon="el-icon-upload" @click="handleCreate">上传文件</el-button>

                        </div>
                        <div style="margin-top: 10px">
                            <el-row>
                                <el-col>
                                    <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
                                             :expand-on-click-node="false" :filter-node-method="filterNode" ref="documentTree"
                                             @node-click="getNodeData"
                                             :render-content="renderContent">
                                    </el-tree>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="16" style="height:100%;padding-left: 5px;">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card" style="height:100%">
                        <div slot="header" class="clearfix">
                            <span>公司文件</span>
                        </div>
                        <div>

                            <!-- 查询和其他操作 -->
                            <div class="filter-container" style="margin-bottom: 10px;">
                                <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入文件名称"
                                          v-model="listQuery.name">
                                </el-input>
                                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                                <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
                            </div>

                            <!-- 查询结果 -->
                            <el-table size="small" :data="list" border fit
                                      highlight-current-row style="margin-bottom: 10px;">
                                <el-table-column align="center" label="文件名称" prop="name"></el-table-column>
                                <el-table-column align="center" label="大小(KB)" prop="size"></el-table-column>
                                <el-table-column align="center" label="上传人" prop="crtUserName"></el-table-column>
                                <el-table-column align="center" label="上传时间" prop="crtTime"></el-table-column>

                                <el-table-column align="center" label="操作" width="240" class-name="small-padding fixed-width">
                                    <template slot-scope="scope">


                                        <a style="margin: 0px 10px 0px 0px;" v-if="scope.row.path && (scope.row.path.indexOf('pdf')>-1 || scope.row.path.indexOf('jpg')>-1 || scope.row.path.indexOf('png')>-1)" :href="scope.row.path" target="_blank"><el-button type="success" size="mini"  >下载</el-button></a>
                                        <el-button v-else type="success" size="mini" @click="handleAttachmentDownLoad(scope.row.path)">下载
                                        </el-button>
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

                            <!-- 添加或修改对话框 -->
                            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body>
                                <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left"
                                         label-width="100px"
                                         style='width: 400px; margin-left:50px;'>
                                    <el-form-item label="文件夹" prop="treeId" v-show="false">
                                        <el-input v-model="dataForm.treeId"></el-input>
                                    </el-form-item>
                                    <el-form-item label="文件夹" prop="treeIds" v-show="false">
                                        <el-input v-model="dataForm.treeIds"></el-input>
                                    </el-form-item>
                                    <el-form-item label="文件夹名称" prop="parentName">
                                        <el-input v-model="dataForm.parentName" :disabled="true"></el-input>
                                    </el-form-item>

                                    <el-form-item label="上传文件" v-show="'create'===dialogStatus">
                                        <el-upload
                                                class="upload-demo"
                                                accept=".jpg,.jpeg,.png,.gif,.doc,.xls,.xlsx,.zip,.docx,.ppt,.pptx,.pdf"
                                                :action="uploadPath"
                                                :on-preview="handlePreview"
                                                :on-remove="handleRemove"
                                                :before-upload="handleUpload"
                                                :before-remove="beforeRemove"
                                                :on-change="onChange"
                                                :on-success="uploadSuccess"
                                                multiple
                                                :file-list="fileList">
                                            <el-button size="small" type="primary">点击上传</el-button>
                                        </el-upload>
                                        <!--<el-upload class="avatar-uploader" :action="uploadPath" list-type="picture-card"-->
                                                   <!--:show-file-list="false"-->
                                                   <!--:on-success="uploadSuccess">-->

                                            <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
                                        <!--</el-upload>-->
                                   </el-form-item>

                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="dialogFormVisible = false">取消</el-button>
                                    <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
                                    <el-button v-else type="primary" @click="updateData">确定</el-button>
                                </div>
                            </el-dialog>


                            <!-- 添加或修改文件夹对话框 -->
                            <el-dialog :title="textMap[dialogStatusTree]" :visible.sync="dialogFormVisibleTree" append-to-body>
                                <el-form :rules="rulesTree" ref="dataTreeForm" :model="dataTreeForm" status-icon label-position="left"
                                         label-width="100px"
                                         style='width: 400px; margin-left:50px;'>
                                    <el-form-item label="ID" prop="id" v-show="false">
                                        <el-input v-model="dataTreeForm.id" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="父级ID" prop="parentId" v-show="false">
                                        <el-input v-model="dataTreeForm.parentId" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="父级名称" prop="parentName" v-show="dialogStatusTree==='create'">
                                        <el-input v-model="dataTreeForm.parentName" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="文件夹名称" prop="name">
                                        <el-input v-model="dataTreeForm.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="排序" prop="sort">
                                        <el-input v-model="dataTreeForm.sort"></el-input>
                                    </el-form-item>


                                </el-form>
                                <div slot="footer" class="dialog-footer">
                                    <el-button @click="dialogFormVisibleTree = false">取消</el-button>
                                    <el-button v-if="dialogStatusTree==='create'" type="primary" @click="createTreeData" :loading="isLoading">确定</el-button>
                                    <el-button v-else type="primary" @click="updateTreeData">确定</el-button>
                                </div>
                            </el-dialog>


                        </div>
                    </el-card>
                </div>


            </el-col>
        </el-row>

    </div>
</template>

<script>
    import { fetchTree, getTreeObj, addTreeObj, delTreeObj, putTreeObj } from '@/api/erp/oa/oaDocumentTree';
    import { page, addObj, getObj, delObj, putObj } from '@/api/erp/oa/oaDocument'
    import { uploadPath, downloadPath } from '@/api/erp/goods/storage'


    export default {
        name: 'oaDocument',
        data() {
            const validateNo = (rule, value, callback) => {
                if(isNaN(this.dataTreeForm.sort)){
                    callback(new Error('必须为数字'));
                }
                else {
                    callback();
                }
            };
            return {
                fileList: [],
                uploadPath,
                isLoading:false,
                list: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    name: undefined,
                    treeIds: undefined
                },
                dataForm: {
                    treeId: '',
                    treeIds: '',
                    parentName: '',
                },
                dataTreeForm: {
                    id: '',
                    parentId: '',
                    parentName: '',
                    sort: '',
                    name: ''
                },
                dialogFormVisible: false,
                dialogFormVisibleTree: false,
                dialogStatus: '',
                dialogStatusTree: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    parentName: [{ required: true, message: '请点击选择一个文件夹', trigger: 'blur' }]
                },
                rulesTree: {
                    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                    sort: [{ required: true, message: '排序不能为空' },{validator: validateNo, trigger: 'blur'}]
                },
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        },

        created() {
            this.getList();
            this.getTree();
        },

        methods: {
            handleUpload(file){
                if(this.fileList.length>0) {
                    var arr=this.fileList;
                    var field='name';
                    var map = {};
                    for (var i = 0; i < arr.length; i++) {
                        if (map[arr[i][field]]) {
                           this.vueMessage('warning','选中文件包含已上传文件！')
                            return false;
                        }else{
                            map[arr[i][field]]=1;
                        }
                    }
                }
            },
            handleRemove(file, fileList) {
                for(let i in this.fileList){
                    if(this.fileList[i].name == file.name){
                        this.fileList.splice(i*1, 1);
                    }
                }
            },
            handlePreview(file) {
            },
            unique(arr,field){
                var map = {};
                var res = [];
                for (var i = 0; i < arr.length; i++) {
                    if (!map[arr[i][field]]) {
                        map[arr[i][field]]=1;
                        res.push(arr[i]);
                    }
                }
                return res;
            },
            beforeRemove(file, fileList) {
                if(this.fileList.length>0) {
                    this.fileList = this.unique(this.fileList,"name");
                }
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
                })
            },
            getTree() {
                fetchTree().then(data => {
                    this.treeData = data.data;
                });
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
                }
            },
            resetTreeForm() {
                this.dataTreeForm = {
                    id: '',
                    parentId: '',
                    parentName: '',
                    sort: '',
                    name: ''
                }
            },
            handleAttachmentDownLoad(url) {
                const ele = document.createElement('a');
                ele.setAttribute('href', downloadPath(url)); // 设置下载文件的url地址
                ele.click();
            },
            // 重置查询条件
            resetQuery() {
                this.listQuery.name = undefined;
                this.listQuery.treeIds = undefined;
            },
            handleCreate() {
                if (this.$refs.documentTree.getCurrentNode() === null) {
                    this.$notify({
                        title: '请点击选择一个文件夹',
                        message: '请点击选择一个文件夹!',
                        type: 'warning',
                        duration: 2000
                    })
                }
                this.resetForm();
                this.fileList = [];
                this.dataForm.treeId = this.$refs.documentTree.getCurrentNode().id;
                this.dataForm.treeIds = this.$refs.documentTree.getCurrentNode().parentIds + ',' + this.$refs.documentTree.getCurrentNode().id;
                this.dataForm.parentName = this.$refs.documentTree.getCurrentNode().name;
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;

                this.$nextTick(() => {
                    this.$refs.dataForm.clearValidate();
                })
            },
            onChange(file,fileList){
                this.fileList = [];
                for(let i in fileList){
                    this.fileList.push(fileList[i]);
                }
            },
            uploadSuccess(response) {
            },
            createData() {
                let sumData = JSON.parse(JSON.stringify(this.fileList));
                this.dataForm.fileList = [];
                for(let i in sumData){
                    this.dataForm.fileList.push(sumData[i].response.data)
                }
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        addObj(this.dataForm).then(response => {
                            if (response.data.code == 200 || response.data.code == '2000') {
                                if(this.list == undefined){
                                    this.list= [];
                                }
                                this.list.unshift(response.data.data);
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
                                    message: response.data.msg,
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
                this.resetTreeForm();
                this.dataTreeForm.parentName = data.name;
                this.dataTreeForm.parentId = data.id;
                this.dialogStatusTree = 'create';
                this.dialogFormVisibleTree = true;
                this.$nextTick(() => {
                    this.$refs.dataTreeForm.clearValidate();
                })
            },
            createTreeData() {
                this.$refs.dataTreeForm.validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        addTreeObj(this.dataTreeForm).then(response => {
                            if (response.status == 200) {
                                this.isLoading= false;
                                this.dialogFormVisibleTree = false;
                                this.$notify({
                                    title: '成功',
                                    message: '创建成功',
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
                        })
                    } else {
                        return false;
                    }

                })
            },
            handleUpdate(row) {
                this.dataForm = Object.assign({}, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs.dataForm.clearValidate()
                })
            },
            updateData() {
                this.dataForm.fileList = this.fileList;
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        putObj(this.dataForm.id, this.dataForm).then(response => {
                            if (response.status == 200) {
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
            handleUpdateTree(data) {
                this.dataTreeForm = Object.assign({}, data);
                this.dialogStatusTree = 'update';
                this.dialogFormVisibleTree = true;
                this.$nextTick(() => {
                    this.$refs.dataTreeForm.clearValidate()
                })
            },
            updateTreeData() {
                this.$refs.dataTreeForm.validate(valid => {
                    if (valid) {
                        putTreeObj(this.dataTreeForm.id, this.dataTreeForm).then(response => {
                            if (response.status == 200) {
                                this.dialogFormVisibleTree = false;
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
                    delObj(row.id).then(() => {
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
            handleDeleteTree(id) {
                this.$confirm(this.dataTreeForm.id + '将被永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delTreeObj(id).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.getTree();
                    });
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getNodeData(data) {
                this.listQuery.treeIds = data.id;
                this.getList();
            },
            renderContent(h, { node, data }) {
                return (
                    < span class = "custom-tree-node" > < span > {node.label }< /span>
                < span >
                < el-button size = "mini" type = "text" icon = "el-icon-plus" on-click = {() => this.handleCreateTree(data) }> 添加下级 < /el-button>
                < el-button size = "mini" type = "text" icon = "el-icon-edit" on-click = {() => this.handleUpdateTree(data) }> 修改 < /el-button>
                < el-button size = "mini" type = "text" icon = "el-icon-delete" on-click = {() => this.handleDeleteTree(data.id) }> 删除 < /el-button>
                < /span>
                < /span>

            )
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
