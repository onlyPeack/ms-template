<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="avue-crud-container">
                <avue-crud ref="crud"
                           :page="page"
                           :data="list"
                           :table-loading="loading"
                           :option="tableOption"
                           @refresh-change="refreshChange"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           @selection-change="handleSelectionChange"
                           @search-change="handleSearchChange"
                           @search-reset="handleSearchReset">
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                    <template slot="sloganPic" slot-scope="scope" >
                        <div @click="doShowImageViewer(scope.row.sloganPic)" style="cursor: pointer" v-if="scope.row.sloganPic&&scope.row.sloganPic!==''">
                            <el-image :src="scope.row.sloganPic" :url-list="srcList" fit="contain" style="width: 80px"></el-image>
                        </div>
                    </template>

                    <template slot="recommendStatus" slot-scope="scope" >
                        <el-switch v-model.number="scope.row.recommendStatus" @change="handleUpdateStatus(scope.row)" :active-value="1" :inactive-value="0"/>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="text" @click="setShort(scope.row)">设置排序</el-button>
                        <el-button type="text" @click="updateShow(scope.row)">编辑</el-button>
                    </template>
                </avue-crud>
            </div>

        </basic-container>



        <el-dialog :visible.sync="showDialog" width="30%" @close="handleClosePublic"  :modal-append-to-body="false"
                   :title="textMap[dialogStatus]" append-to-body class="public-dialog" >
            <el-form :model="addList" ref="addList" label-position="right" label-width="120px" size="medium">
                <el-form-item label="排序:" v-if="dialogStatus==='sort'">
                    <el-input v-model="addList.sort" autocomplete="off" style="width: 300px;height: 30px;"></el-input>
                </el-form-item>
                <el-form-item label="标语:" v-if="dialogStatus!=='sort'">
                    <el-input v-model="addList.slogan" autocomplete="off" style="width: 300px;height: 30px;"></el-input>
                </el-form-item>
                <el-form-item label="标语图片:" prop="sloganPic" v-if="dialogStatus!=='sort'" >
                    <el-upload
                            class="avatar-uploader"
                            action="api/saas/storage/create"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-remove="handleAvatarSuccess"
                            :before-remove="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img :src="addList.sloganPic" class="avatar" v-if="addList.sloganPic">
                        <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                        <div class="el-upload__tip" slot="tip">
                            <ul style="padding: 0;margin-left: 15px;">
                                <li>只能上传jpg/png文件，且不超过1MB</li>
                                <li>建议上传图片尺寸大小为188*96px</li>
                            </ul>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
<!--            <avue-form :option="formOption" v-model="addList" :upload-preview="uploadPreview" :upload-error="uploadError" :upload-delete="uploadDelete" :upload-before="uploadBefore" > </avue-form>-->
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog=false">取 消</el-button>
                <el-button type="warning" @click="clearImg" v-if="dialogStatus!=='sort'">清空图片</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="isLoading">确 认</el-button>
            </div>
        </el-dialog>
        <el-image-viewer :url-list="srcList" v-if="showImageViewer" :on-close="closeImageViewer"/>
        <!--        品牌选择对话框-->
        <brand-manager-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></brand-manager-selector>
    </list-container>
</template>

<script>
    import {page  as pages,updateSort,updateBrandRecommend,deleteBrandRecommend,createBrandRecommend,changeBrandRecommendStatus} from '@/api/erp/saas/contentControl/brandRecommend';
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import 'element-ui/lib/theme-chalk/index.css';
    export default {
        props: ['timeStamp'],
        name: "brandRecommend",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'brandManagerSelector': () => import('@/components/saas/brandManagerSelector'),
            ElImageViewer
        },
        data() {
            return {
                fileList: undefined,
                sloganPic:undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑推荐品牌',
                    sort: '设置排序'
                },
                formOption:{
                    labelWidth: 80,
                    size:'medium',
                    emptyBtn:false,
                    submitBtn:false,
                    column: [
                        {
                            label: "标语",
                            prop: "slogan",
                            span:24
                        },
                        {
                            label: '标语图片',
                            prop: 'sloganPic',
                            type: 'upload',
                            listType: 'picture-img',
                            span: 24,
                            propsHttp: {
                                res: 'data'
                            },
                            tip: '只能上传jpg/png用户头像，且不超过10MB',
                            action: 'api/saas/storage/create'
                        },
                    ]
                },
                picList:[],
                showImageViewer:false,//是否展示图片预览
                srcList: ['http://gxcl-shop.qiniu.520mro.com/5snm6e6lxrkaysv6w2gj.jpg'],//图片预览数组
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                searchDisable: false,
                addList:{sloganPic:undefined},//添加品牌推荐数据存储对象
                listLoading:false,//品牌选择对话框是否为加载中状态
                showBrandSelector:false,//是否显示选择品牌对话框
                showDialog:false,//是否显示编辑&设置排序对话框
                isLoading:false,//按钮是否现在加载中状态
                publicTitle:'',
                isSingle: true,
                option: [],
                typeName: '',
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: true,
                    delBtn: true,
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                tableOption: {
                    dialogDrag:true,
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: false,
                    indexLabel:'序号',
                    menu: true,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    delBtn:false,
                    editBtn:false,
                    searchSpan: 4,
                    showSummary: false,
                    column: []
                },
                billColumn: [
                    {
                        label: "品牌名称",
                        prop: "brandName",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "标语",
                        prop: "slogan",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "标语图片",
                        prop: "sloganPic",
                        minWidth: 180,
                        type:'img',
                        dataType: 'string',
                        align: 'center',
                        slot:true
                    },
                    {
                        label: "是否推荐",
                        prop: "recommendStatus",
                        minWidth: 180,
                        align: 'center',
                        slot: true
                    },
                    {
                        label: "排序",
                        prop: "sort",
                        minWidth: 180,
                        align: 'center',
                        sortable:true,
                    },
                    {
                        label: "推荐状态",
                        prop: "recommendStatus",
                        minWidth: 180,
                        align: 'center',
                        search: true,
                        type:'select',
                        dicData:[
                            {
                                label:'推荐中',
                                value:1
                            },{
                                label:'未推荐',
                                value:0
                            }
                        ]
                    },
                ],
            }
        },
        computed: {
            ids() {
                let ids = [];
                this.selectedRows.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {

            /**
             * 行内更变推荐状态方法
             */
            handleUpdateStatus(row) {

                let params = new URLSearchParams();
                params.append("ids", row.id);
                params.append("recommendStatus",Number(row.recommendStatus));
                changeBrandRecommendStatus(params).then(response => {
                    if (Number(response.data.code) === 2000||Number(response.data.code)===200) {
                        this.showSuccess('更变推荐状态成功!')
                    } else {
                        this.showError('更变推荐状态失败,'+response.data.msg||response.data.data,response.data.code)
                    }
                },error => this.showError('更变推荐状态失败,'+error));
            },

            /**
             *顶部按钮删除方法
             */
            handleRowDelete(form, index) {
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
                    deleteBrandRecommend(ids).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('品牌推荐删除成功!')
                        } else {
                            this.showError('品牌推荐删除失败,'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('品牌推荐删除失败,'+error));
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = pages;
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.list = data.records;
                    this.loading = false;
                    this.searchDisable = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
                    this.searchDisable = false;
                });
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
                if (this.searchDisable) {
                    return;
                }
                this.searchDisable = true;
                this.listQuery = params;
                this.page.currentPage = 1;
                this.getList(this.page, params);
            },
            //清空
            handleSearchReset() {
                this.listQuery = {};
                this.getList(this.page);
            },

            //列样式
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },

            handleAdd() {
                this.showBrandSelector = true
                this.addList={}
                this.listLoading=true
            },

            /**
             * 删除选中的关联品牌
             * @param tag
             */
            handleBrandClose(tag) {
                this.chooseBrandNames.splice(this.chooseBrandNames.indexOf(tag), 1);
            },

            /**
             * 关闭关联系列对话框
             */
            handleClosePublic() {
                this.showBrandSelector=false
                this.showDialog=false
            },

            /**
             * 展示关联商品分类&关联品牌选择框
             * type 选择框类型
             */
            showSelect(type){
                if(type==='classify'){
                    this.publicTitle = '请选择关联商品分类';
                    this.isSingle = true;
                    this.sourceClassifyVisible = true;
                }else{
                    this.publicTitle = '请选择关联品牌';
                    this.isSingle = true;
                    this.sourceBrandVisible = true;
                }
            },

            /**
             * 从子组件中接收的提交方法
             * @param list
             */
            handleSubmitPublic(list){
                if(list.type&&list.type==='brand'){
                    this.addList.brandName=list.brandName
                    this.addList.brandId=list.brandId
                    let arr=[]
                    arr.push(this.addList)
                    createBrandRecommend(arr).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess('推荐品牌添加成功!')
                        }else{
                            this.showError('推荐品牌添加失败,'+res.data.msg||res.data.data,res.data.code)
                        }
                    },error => this.showError('推荐品牌添加失败,'+error))
                }

            },

            /**
             * 错误处理方法
             * @param message 错误信息
             * @param code 错误码
             */
            showError(message,code){
                if(Number(code)===401){
                    this.$message.warning(message||'操作失败')
                }else{
                    this.$message.error(message||'操作失败')
                }
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
             * 初始化所有状态
             */
            init(){
                this.showSpecification=false
                this.showDialog=false
                this.showBrandSelector=false
                this.isLoading=false
                this.getList(this.page,this.listQuery)
            },

            /**
             * 行编辑事件
             * @param data 当前行数据
             */
            updateShow(data){
                this.dialogStatus='update'
                this.showDialog=true
                this.addList=JSON.parse(JSON.stringify(data))
                this.sloganPic=this.addList.sloganPic
                this.picList=[{name:this.addList.sloganPic,url:this.addList.sloganPic}]
            },

            /**
             * 显示规格参数对话框方法
             * @param row 当前行数据
             */
            showSpecifications(row){
                this.showSpecification=true
                this.nowRow=row
                this.specificationTags=[]
                this.specificationTags= JSON.parse(JSON.stringify(row.dtoList))
                for(let i=0;i<row.dtoList.length;i++){
                    let dataArr=row.dtoList[i].value.split(',')
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
            },

            /**
             * 设置排序&编辑推荐品牌对话框提交事件
             */
            handleSubmit() {
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        //判断当前为创建还是为编辑 并赋予相应的方法及信息
                        let method=this.dialogStatus==='sort'?updateSort:updateBrandRecommend
                        let message=this.dialogStatus==='sort'?"设置排序":"编辑推荐品牌"
                        method(this.addList).then(res => {
                            if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                                this.showSuccess(message+'成功!')
                            } else {
                                this.showError(message+'失败,' + res.data.msg || res.data.data)
                            }
                        }, error => this.showError(message+'失败,' + error))
                    }
                })
            },

            /**
             *设置品牌推荐排序按钮
             */
            setShort(row){
                this.showDialog=true
                this.dialogStatus='sort'
                this.addList=row
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
             * 图片上传成功事件
             * @param res
             * @param file
             */
            handleAvatarSuccess(res, file) {
                this.$set(this.addList,'sloganPic',res.data.url)
                // this.addList.sloganPic = res.data.url;
                // this.sloganPic = res.data.url;
            },

            /**
             * 展示图片大图预览
             * @param img 图片地址
             */
            doShowImageViewer(img){
                this.$set(this.srcList,0,img)
                this.showImageViewer=true
            },

            /**
             * 关闭图片预览
             */
            closeImageViewer(){
                this.showImageViewer=false
            },

            uploadPreview(file,column,done){
                console.log(file,column)
                done()//默认执行打开方法
                this.$message.success('自定义查看方法,查看控制台')
            },
            uploadDelete(column,file) {
                console.log(column,file)
                return this.$confirm(`这里是自定义的，是否确定移除该选项？`);
            },

            clearImg(){
                this.$set(this.addList,'sloganPic','')
            }
        }
    }
</script>

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
