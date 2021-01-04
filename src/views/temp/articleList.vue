<template>
    <div class="app-container calendar-list-container">
        <el-row>
            <el-col :span="24" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding:14px 16px;">
                    <el-button plain type="success" @click="columnCreate" icon="el-icon-plus">新增</el-button>
                </div>
                <div style="width: 100%;background: #ffffff;">
                    <!-- 查询结果 -->
                    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border
                              fit row-key="id"
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;margin-left: 1%;"
                              :default-sort="{prop: 'id', order: 'ascending'}">
                        <el-table-column width="60" label="ID" align="center" prop="id">
                        </el-table-column>
                        <el-table-column align="center" prop="name" label="栏目标题">
                        </el-table-column>
                        <el-table-column align="center" prop="title" label="文章标题">
                        </el-table-column>
                        <el-table-column align="center" prop="description" label="描述">
                        </el-table-column>
                        <el-table-column label="排序" align="center" prop="sort">
                        </el-table-column>
                        <el-table-column label="缩略图" align="center" prop="pic" v-slot="{row}">
                                <el-image :src="row.pic" style="width: 120px; height: 80px;cursor: pointer" v-if="row.pic&&row.pic!==''" @click="doShowImageViewer(row.pic)"></el-image>
                        </el-table-column>
                        <el-table-column label="发布时间" align="center" prop="releaseTime">
                        </el-table-column>
<!--                        <el-table-column label="是否关联" align="center" v-slot="{row}">-->
<!--                            <div v-if="!row.pid||row.pid===''||row.pid==='0'">-->
<!--                                <span v-if="row.isBind" style="color:#F56C6C;">是</span>-->
<!--                                <span v-else style="color: #67C23A">否</span>-->
<!--                            </div>-->

<!--                        </el-table-column>-->
                        <el-table-column label="关联栏目" align="center" prop="columnName">
                        </el-table-column>
                        <el-table-column label="备注" align="center" prop="note">
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="connectDown(scope.row)" plain v-if="!scope.row.pid||scope.row.pid===''||scope.row.pid==='0'"
                                           icon="el-icon-link">取消关联
                                </el-button>
                                <el-button type="primary" size="mini" @click="handleCreate(scope.row)" plain v-if="!scope.row.pid||scope.row.pid===''||scope.row.pid==='0'"
                                           icon="el-icon-plus">添加文章
                                </el-button>
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" plain
                                           icon="el-icon-edit">修改
                                </el-button>
                                <!--                                <router-link tag="a" target="_blank" :to="{path:'/bigPreview',query:{url:`bigPreview?id=${scope.row.id}`}}">-->

                                <el-button type="danger" size="mini" @click="handleDelete(scope.row)" plain
                                           icon="el-icon-delete" style="margin-left: 15px;">删除
                                </el-button>
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" modal-append-to-body append-to-body>
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right"
                     label-width="140px" size="medium">
                <el-form-item label="栏目名称：" prop="name">
                    <el-input v-model="addList.name" placeholder="请输入栏目名称" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input v-model="addList.sort" placeholder="请输入排序" style="width: 300px"></el-input>
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
        <el-image-viewer :url-list="srcList" v-if="showImageViewer" :on-close="closeImageViewer"/>
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
    import {page, delObj, putObj, addObj, list} from '@/api/temp/articleControl'
    import imgViewMixin from "../erp/saas/common/imgViewMixin";
    export default {
        name: 'articleList',
        mixins:[imgViewMixin],
        data() {
            return {
                addList: {},
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
                dialogStatus: 'create',
                textMap: {
                    update: '编辑文章栏目',
                    create: '创建文章栏目'
                },
                rules: {
                    name: [{required: true, message: '栏目名不能为空', trigger: 'blur'}],
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
        },
        watch: {
            '$route': function () {
                if (this.$route.query.success) {
                    this.getList()
                }
            }
        },
        methods: {
            deletePreview(val) {
                if (val == 1) {
                    this.dataForm.iconUrl = ''
                } else {
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
                page(this.listQuery).then(response => {
                    this.list = response.data.records;
                    for (let i = 0; i < this.list.length; i++) {
                        this.list[i].isBind = this.list[i].mid && this.list[i].mid !== ''
                    }
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
            handleCreate(row) {
                this.$router.push({
                    path: '/temp/articleForm',
                    query: {
                        flag: 'add',
                        pid:row.id,
                        pidName:row.name
                    }
                })
            },

            columnCreate() {
                this.addList = {}
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
            },


            goPreview(row) {
                //console.log(row,'goPreview')
                this.$router.push({
                    path: '/bigPreview',
                    query: {
                        id: row.id
                    }
                })
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
                        let method = this.dialogStatus === 'create' ? addObj : putObj
                        let message = this.dialogStatus === 'create' ? "栏目新增" : "栏目编辑"
                        method(this.addList).then(response => {
                            this.isLoading = false;
                            if (Number(response.data.code) === 2000) {
                                this.showSuccess(message + '成功')
                            } else {
                                this.showError(message + '失败,' + response.data.msg || response.data.data)
                            }
                        }, error => this.showError(message + '失败,' + error))
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
                if(!row.pid||row.pid===''||row.pid==='0'){
                    this.dialogStatus = 'update'
                    this.dialogFormVisible = true
                    this.addList=row
                }else{
                    this.$router.push({
                        path: '/temp/articleForm',
                        query: {
                            flag: 'upd',
                            id: row.id
                        }
                    })
                }

            },

            /**
             *添加下级
             * row
             */
            addHeeler(row) {
                this.$router.push({
                    path: '/temp/columnForm',
                    query: {
                        flag: 'heeler',
                        id: row.id,
                        pid: row.name,
                        type: row.type
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
                                    message: '成功',
                                });
                            } else {
                                this.$message({
                                    type: "warning",
                                    message: response.data.msg,
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(row.id).then(response => {
                        if (Number(response.data.code) === 2000 || Number(response.data.code) === 200) {
                            this.showSuccess('删除成功')
                        } else {
                            this.showError('删除失败,' + response.data.msg || response.data.data)
                        }
                    }, error => this.showError('删除失败,' + error));
                });
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
             * 取消关联
             * @param row
             */
            connectDown(row) {
                this.$confirm('是否取消关联?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    row.mid = ''
                    putObj(row).then(res => {
                        if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                            this.$message.success('取消关联成功!')
                            this.getList()
                        } else {
                            this.$message.error('取消关联失败!' + res.data.msg || res.data.data)
                        }
                    }, error => this.$message.error('取消关联失败!' + error))
                })
            }
        }
    }
</script>
<style>
    .el-upload--picture-card {
        position: relative;
    }

    .el-icona {
        position: absolute;
        font-size: 16px !important;
        right: 2px;
        top: 2px;
        z-index: 9999999;
    }
</style>
