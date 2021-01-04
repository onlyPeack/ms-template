<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" style="margin: 0 auto;width: 99%;">
        <a id="test123"
           :href="openUrl+'/api/goods/goods/exportList?userId='+userId"></a>

                <!-- 查询和其他操作 -->
                <div class="filter-container" style="background: #ffffff;padding-top: 20px;padding-left: 20px;">
                    <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入分类名称" v-model="listQuery.name" @keyup.enter.native="handleFilter"></el-input>
<!--                    <el-select v-model="listQuery.level" placeholder="请选择分类级别">-->
<!--                        <el-option  value="" label="全部"></el-option>-->
<!--                        <el-option  value="L1" label="一级"></el-option>-->
<!--                        <el-option  value="L2" label="二级"></el-option>-->
<!--                        <el-option  value="L3" label="三级"></el-option>-->
<!--                    </el-select>-->
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
                    <el-button class="filter-item" icon="el-icon-delete" @click="clear" style="margin-left: 10px;">重置</el-button>

                    <div style="padding-left: 0px;margin-top:10px;padding-bottom: 10px;" >
                        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="addGoodsCategory" plain>添加</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete()" icon="el-icon-delete" plain>删除</el-button>
                    </div>
                </div>
                <!-- 查询结果 -->
                <div class="result-container" style="padding: 0% 1%; background: #ffffff;">
                    <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun" row-key="id"
                              element-loading-text="正在查询中。。。" border fit
                              highlight-current-row :height="clientHeight"
                              style="width: 98%;height: 100%;position:relative;overflow: auto;">
                        <el-table-column type="selection" width="60">
                        </el-table-column>
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
                        <el-table-column align="center" min-width="100" label="是否启用" prop="showStatus">
                            <template slot-scope="scope" >
                                <el-switch v-model="scope.row.showStatus" active-color="#188AE2" inactive-color="#C0CCDA" :active-value="1" :inactive-value="0"
                                           @change="handleSwitchChange(scope.row,scope.$index)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="220" fixed="right" class-name="small-padding fixed-width" v-slot="{row,$index}">
<!--                            <el-dropdown @command="handleUpdate">-->
<!--                                <el-button type="primary">-->
<!--                                    更多<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                                </el-button>-->
<!--                                <el-dropdown-menu slot="dropdown">-->
<!--                                    <el-dropdown-item :command="{index:$index,row:row,type:'update'}">编辑</el-dropdown-item>-->
<!--                                    <el-dropdown-item :command="{index:$index,row:row,type:'create'}">添加下级</el-dropdown-item>-->
<!--                                    <el-dropdown-item :command="{index:$index,row:row,type:'specifications'}">规格参数</el-dropdown-item>-->
<!--                                </el-dropdown-menu>-->
<!--&lt;!&ndash;                                <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;                                <el-button type="warning" size="mini" @click="handleUpdate(scope.$index, scope.row)">添加下级</el-button>&ndash;&gt;-->
<!--                            </el-dropdown>-->
                            <el-link type="primary" :underline="false" @click="handleUpdate({index:$index,row:row,type:'update'})">编辑</el-link><span style="margin-right: 15px"></span>
                            <el-link type="primary" :underline="false" @click="handleUpdate({index:$index,row:row,type:'create'})">添加下级</el-link><span style="margin-right: 15px"></span>
                            <el-link type="primary" :underline="false" @click="handleUpdate({index:$index,row:row,type:'specifications'})">规格参数</el-link>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <div class="pagination-container" style="padding: 10px 10px;background: #ffffff;">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="listQuery.page"
                                   :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
        <!-- 添加或修改对话框 -->
        <el-dialog modal-append-to-body append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
            <el-form :rules="rules" ref="addList" :model="addList" status-icon label-position="right" label-width="140px" size="medium">
                <el-form-item label="类目名称" prop="name">
                    <el-input v-model="addList.name" placeholder="请输入类目名称" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="父类目" prop="pid">
                    <el-cascader style="width: 300px"  v-model="addList.pid" :show-all-levels="false" :props="{ label:'name',value:'id',checkStrictly: true }" :options="cascaderData" filterable></el-cascader>
                </el-form-item>
                <el-form-item label="排序" prop="sortOrder">
                    <el-input v-model="addList.sortOrder" style="width: 300px" placeholder="请输入排序"></el-input>
                </el-form-item>
                <el-form-item label="类目图标" prop="iconUrl">
                    <el-upload
                            class="avatar-uploader"
                            action="api/saas/storage/create"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="addList.iconUrl" :src="addList.iconUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1MB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否显示" prop="showStatus">
                    <el-radio-group v-model="addList.showStatus">
                        <el-radio :label=1>是</el-radio>
                        <el-radio :label=0>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="listSubmit" :loading="isLoading">确定</el-button>
            </div>
        </el-dialog>

        <!--        新增&修改规格参数-->
        <el-dialog :visible.sync="showSpecification" width="70%"
                   title="规格参数" append-to-body class="public-dialog">
            <div style="font-size: 16px">
                规格参数:　<el-tag :key="index"
                              v-for="(data,index) in specificationTags"
                              :closable="data.attributesType*1===0" size="medium"
                              :disable-transitions="false"
                              @close="handleCloseTag(specificationTags,data.specifications,index)">
                {{data.specifications}}
            </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="medium"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新规则</el-button>
            </div>

            <div style="font-size: 16px;margin-top: 15px" v-for="(data,index) in specificationTags">
                {{data.specifications}}:　<el-tag
                    v-for="childData in data.value"
                    :closable="data.attributesType*1===0" size="medium"
                    :disable-transitions="false"
                    @close="handleCloseTag(data.value,childData.specifications,index)">
                {{childData.specifications}}
            </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="data.inputChildVisible"
                        v-model="data.inputChildValue"
                        ref="saveTagInput"
                        size="medium"
                        @keyup.enter.native="handleChildInputConfirm(index)"
                        @blur="handleChildInputConfirm(index)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showChildInput(index)" v-show="data.attributesType*1===0">+ 添加属性</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showSpecification=false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">提 交</el-button>
            </div>
        </el-dialog>
    </list-container>
</template>


<script>
    import {addCategory,updateShowStatus,deleteMultiCategory,updateCategory,treePage,getSpecifications} from '@/api/erp/saas/goodsClassify';
    import {updateSpecification} from '@/api/erp/saas/goodsSeries';
    export default {
        name: 'goodsClassify',
        components: {},
        props: ['timeStamp'],
        data() {
            return {
                textMap: {
                    update: '编辑商品类目',
                    create: '新建商品类目'
                },
                dialogStatus: '',//当前表单为新建还是编辑
                inputVisible: false,//规格参数是否显示输入框
                inputValue: '',
                showSpecification:false,
                rules: {//新增类目表单验证
                    name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                    pid: [{required: true, message: '父类目不能为空', trigger: 'blur'}],
                    sortOrder: [{required: true, message: '排序不能为空', trigger: 'blur'}],
                    showStatus: [{required: true, message: '是否显示不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                headers: undefined,
                fromOut: '',
                tableData:[],
                selfCategoryId: undefined,
                clientHeight: 300,
                list: [],
                total: 0,
                specificationTags:[],//当前行规格参数存储对象
                cascaderData:[],
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
                    pid:0,//默认顶级栏目
                },
                goodsTypeList: [],
                fileList: [],
                nowRow:{},
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

        },
        methods: {
            myTest(data){
              console.log(data,123,this.addList.pid)
            },
            handleExceed(files, fileList) {
            },
            uploadCompleted(response, file, fileList) {
                this.getList(this.listQuery);
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
                return this.$confirm(`确定移除 ${file.name}？`);
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
                return isXLS && isLt10M;
            },
            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            closeCoverDialog() {
                this.dialogDataBaseVisible = false;
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
                this.showSpecification=false
                this.isLoading=false
                this.getList(this.listQuery);
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                treePage(this.listQuery).then(response => {
                    this.tableData=response.data.data||[]
                    let data=[...this.tableData]
                    this.cascaderData=[{name:'顶级栏目',id:0,children: [...data]}]
                    if(this.listQuery.name&&this.listQuery.name!==''){
                        data = this.treeSelect(data, this.listQuery.name)
                    }
                    this.total=data.length
                    this.list=data.slice((this.listQuery.page-1)*this.listQuery.limit,this.listQuery.page*this.listQuery.limit)


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
                // let data=[...this.tableData]
                // if(this.listQuery.name&&this.listQuery.name!==''){
                //     data=data.filter(item=>item.name.indexOf(this.listQuery.name)>-1)
                // }
                // this.list=data
                // this.total=this.list.length
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList(this.listQuery);
                // let data=[...this.tableData]
                // if(this.listQuery.name&&this.listQuery.name!==''){
                //     data=data.filter(item=>item.name.indexOf(this.listQuery.name)>-1)
                // }
                //
                // this.list=data.slice((this.listQuery.page-1)*this.listQuery.limit,this.listQuery.page*this.listQuery.limit)
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList(this.listQuery);
                // let data=[...this.tableData]
                // if(this.listQuery.name&&this.listQuery.name!==''){
                //     data=data.filter(item=>item.name.indexOf(this.listQuery.name)>-1)
                // }
                // this.list=data.slice((this.listQuery.page-1)*this.listQuery.limit,this.listQuery.page*this.listQuery.limit)
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
            /**
             * 表格行中switch按钮
             * index 当前按钮索引
             * row 当前行数据
             */
            handleSwitchChange(row, index) {
                updateShowStatus(Number(!row.showStatus),row.id).then(res=>{
                    this.$message.success('更改商品类目状态成功')
                    this.init()
                },error => this.$message.error('更改商品类目状态失败'+error.msg||error.data))
            },
            showDetail(detail) {
                this.goodsDetail = detail;
                this.detailDialogVisible = true;
            },
            /**
             * 删除商品类目方法
             */
            handleDelete() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                this.selectedRows.forEach((row) => {
                    ids.push(row.id)
                });
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMultiCategory(ids).then(res => {
                        if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                            this.$message.success("删除商品类目成功")
                            this.init();
                        } else {
                            this.$message.error('删除商品类目失败'+res.data.msg||res.data.data)
                        }
                    },error=>this.$message.error('删除商品类目失败'+error));
                });
            },
            handleDownload() {
                document.getElementById('test123').click()
            },
            /**
             * 重置按钮方法
             */
            clear() {
                delete this.listQuery.name
                // this.list=[...this.tableData]
                this.getList(this.listQuery)
            },
            /**
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.$set(this.addList,'iconUrl',res.data.url)
            },
            /**
             * 图片上传之前添加参数
             * @param res
             * @param done
             * @param loading
             */
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 1;

                if (!isJPG&&!isPNG) {
                    this.$message.error('上传头像图片只能是 JPG或png 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isPNG||isJPG && isLt2M;
            },
            /**
             * 新建&编辑商品类目
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        let params=Object.assign({},this.addList)
                        params.pid=params.pid[params.pid.length-1]
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method=this.dialogStatus==='create'?addCategory:updateCategory
                        let message=this.dialogStatus==='create'?"类目新增":"类目编辑"
                        method(params).then(res => {
                            if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                                this.showSuccess(message+'成功')
                            } else {
                                this.showError(message+"失败"+res.data.msg||res.data.data)
                            }
                        }, error => this.showError(message+"失败"+error))
                    }
                })
            },
            /**
             * 添加商品类目按钮
             */
            addGoodsCategory(){
                this.addList={
                    pid:[0],
                    showStatus: 1
                }
                this.dialogFormVisible = true
                this.dialogStatus='create'
            },
            /**
             * 父类目选择事件
             */
            handleCategoryChange(value) {
                this.addList.pid = value[value.length - 1]
            },
            /**
             * 表格编辑按钮事件
             * index 当前按钮索引值
             * row 当前行中数据
             */
            handleUpdate(command){
                if(command.type==='update'){
                    this.dialogFormVisible = true
                    this.dialogStatus='update'
                    this.addList=JSON.parse(JSON.stringify(command.row))
                    this.addList.pid=[this.addList.pid]
                }else if(command.type==='create'){
                    this.dialogFormVisible = true
                    this.dialogStatus='create'
                    let data=Object.assign({},command.row)
                    this.addList={
                        showStatus: 1
                    }
                    this.addList.pid=[data.id]
                }else if(command.type==='specifications'){
                    //let data=Object.assign({},command.row)
                    //console.log('进入展示规格参数方法')
                    getSpecifications(command.row.id).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSpecifications(res.data.data)
                        }else{
                            this.showError('获取规格参数失败!'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('获取规格参数失败!'+error))

                }
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
             * 关闭关联系列对话框
             */
            handleClosePublic() {
                this.sourceClassifyVisible = false;
                this.sourceBrandVisible = false;
                this.showSpecification=false
            },

            /**
             * 标签删除方法
             * @param arr 当前标签存储数组
             * @param tag 当前标签
             * @param index 当前数组在父数组索引
             */
            handleCloseTag(arr,tag,index) {
                arr.splice(index, 1);
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    let data={
                        value:[],
                        specifications:inputValue,
                        inputChildVisible:false,
                        inputChildValue:'',
                        attributesType:0
                    }
                    this.specificationTags.push(data);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            handleChildInputConfirm(index) {
                let inputChildValue = this.specificationTags[index].inputChildValue;
                if (inputChildValue) {
                    let data={
                        value:[],
                        specifications:inputChildValue,
                        inputChildVisible:false,
                        inputChildValue:'',
                        attributesType:0
                    }
                    if(!this.specificationTags[index].value){
                        this.specificationTags[index].value=[]
                    }
                    this.specificationTags[index].value.push(data);
                }
                this.specificationTags[index].inputChildVisible = false;
                this.specificationTags[index].inputChildValue = '';
            },

            showChildInput(index){
                // this._props.specificationTags[index].inputChildVisible = true;
                let data=this.specificationTags[index]
                data.inputChildVisible=true
                this.$set(this.specificationTags,index,data)
            },

            /**
             * 规格参数对话框提交事件
             */
            handleSubmit() {
                let dto={
                    type:1,
                    dtoList:[],
                    categoryId:this.nowRow.id
                }
                for (let i = 0; i <this.specificationTags.length ; i++) {
                    let data={
                        specifications: this.specificationTags[i].specifications,
                        attributesType:this.specificationTags[i].attributesType,
                        value:[]
                    }
                    try {
                        for (let j = 0; j <this.specificationTags[i].value.length ; j++) {
                            data.value.push(this.specificationTags[i].value[j].specifications)
                        }
                    }catch (e) {

                    }

                    data.value=data.value.toString()
                    dto.dtoList.push(data)
                }
                for (let i = 0; i <dto.dtoList.length ; i++) {
                    if(dto.dtoList[i].value===""){
                        dto.dtoList[i].value='未设置'
                    }
                }
                updateSpecification(dto).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSuccess('规格参数提交成功!')
                    }else{
                        this.showError('规格参数提交失败,'+res.data.msg||res.data.data)
                    }
                },error => this.showError('规格参数提交失败,'+error))
            },

            /**
             * 显示规格参数对话框方法
             * @param row 当前行数据
             */
            showSpecifications(row){
                this.nowRow=Object.assign({},row)
                this.specificationTags=[]
                if(row.dtoList){
                    this.specificationTags=row.dtoList
                }
                console.log(this.specificationTags,'specificationTags','after')
                try {
                    for(let i=0;i<this.specificationTags.length;i++){
                        let dataArr=this.specificationTags[i].value.split(',')
                        this.specificationTags[i].value=[]
                        for (let j=0;j<dataArr.length;j++){
                            let data={
                                specifications:dataArr[j],
                                inputChildVisible:false,
                                inputChildValue:'',
                            }
                            this.specificationTags[i].inputChildVisible=false
                            this.specificationTags[i].value.push(data)
                        }
                    }
                }catch (e) {
                    console.log('error!',e)
                }
                console.log(this.specificationTags,'specificationTags','before')
                console.log('马上开始弹窗')
                this.showSpecification=true
            },
            showInput() {
                this.inputVisible = true;
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
<style lang="scss">
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
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
