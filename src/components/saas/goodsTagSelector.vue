<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false"
               :before-close="handleClose" title="商品标签选择" append-to-body class="public-dialog">
    <div class="app-container calendar-list-container">
        <el-row>
            <el-col :span="24" style='padding-left:10px;'>
                <!-- 查询和其他操作 -->
<!--                <div class="filter-container" style="background: #ffffff;padding:14px 16px;">-->
<!--                    <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">新增</el-button>-->
<!--                </div>-->
                <div style="width: 100%;background: #ffffff;">
                    <!-- 查询结果 -->
                    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight" style="width: 78%;height: 100%;position:relative;margin-left: 1%;" @row-click="rowClick"
                              :default-sort="{prop: 'id', order: 'ascending'}">
                        <el-table-column  width="60" label="ID" align="center" prop="id">
                        </el-table-column>
                        <el-table-column align="center" prop="name" label="标签名称">
                        </el-table-column>
                    </el-table>
                    <div style="position: absolute;top: 0;right: 10%">
                        <h3 style="margin-top: 0;">当前已选择标签:</h3>
                        <div v-for="tag in nowData.tagsList" style="margin-bottom: 10px;">
                            <el-tag closable @close="handleCloseTag(tag)">{{tag}}</el-tag>
                        </div>
                    </div>
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
        <el-dialog modal-append-to-body
                   append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="left" label-width="140px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="addList.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData" :loading="isLoading">确定</el-button>
            </div>
        </el-dialog>

    </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
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
    import {getCategoryBylevel,} from '@/api/erp/goods/category'
    import {uploadPath} from '@/api/erp/goods/storage'
    import {addGoodsTag,updateGoodsTag,updateStatus,deleteTag,searchPage as page} from '@/api/erp/saas/goodsTag'
    export default {
        name: 'goodsTagSelector',
        props: ['timeStamp','dialogVisible', 'isSingle','option','typeName','code','typeOption','id','itemVisible','selectType','operationType','craftId','config','nowRow'],
        data() {
            return {
                nowData:{tagsList:[]},//当前行存储对象
                addList:{//编辑&新建标签存储对象
                    name:''//商品标签名称
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
                dialogStatus: '',
                textMap: {
                    update: '编辑标签',
                    create: '创建标签'
                },
                rules: {
                    name: [{required: true, message: '标签名不能为空', trigger: 'blur'}],
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
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        created() {
            this.getCatBylevel('L1');
            this.init();
            this.getList();
            this.changeDivHeight();
            //this.nowData=JSON.parse(JSON.stringify(this._props.nowRow))
            const _this = this;
            window.onresize = function () {
                _this.changeDivHeight();
            }
        },
        methods: {
            changeDivHeight() {
                this.clientHeight = document.body.clientHeight - 230;
            },
            init() {
                this.dialogFormVisible=false
                this.getList()
            },
            getList() {
                this.listLoading = true;
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
            },
            uploadIconUrl: function (response) {
                this.dataForm.iconUrl = response.data.url
            },
            uploadPicUrl: function (response) {
                this.dataForm.picUrl = response.data.url
            },

            handleSelectChange() {
                this.$forceUpdate();
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
             * 删除标签方法
             * @param tag 当前删除的标签
             */
            handleCloseTag(tag) {
                this.nowData.tagsList.splice(this.nowData.tagsList.indexOf(tag), 1);
            },

            /**
             * 确认选择事件
             */
            handleSubmit() {
                let ids = {
                    arr:this.nowData,
                    type:'goodsTag',
                };
                this.$emit('handleSubmit', ids);
            },

            /**
             * 行单击事件
             * @param row 当前点击行
             * @param column
             * @param event
             */
            rowClick(row, column, event){
                if(this.nowData.tagsList.indexOf(row.name)>-1){
                    this.$message.warning('请勿添加相同标签')
                    return false
                }
                if(this.nowData.tagsList.length>2){
                    this.$message.warning('标签最多可以选择三个')
                    return false
                }else{
                    this.nowData.tagsList.push(row.name)
                }

            },

            /**
             * 新建和编辑商品标签
             */
            createData() {
                this.isLoading = true;
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        let method=this.dialogStatus==='create'?addGoodsTag:updateGoodsTag
                        let message=this.dialogStatus==='create'?"标签新增":"标签编辑"
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
