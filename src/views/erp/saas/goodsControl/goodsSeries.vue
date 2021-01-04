<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="avue-crud-container" v-if="isShow">
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
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick">
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleDelete="handleRowDelete"
                        ></button-bar>
                    </template>
                    <template slot="opt" slot-scope="scope" >
                        <el-switch
                                v-model="scope.row.status == 0 ? true : false" @change="handleUpdateStatus(scope.row.id,scope.row.status == 0?1:0)"/>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="text" @click="updateShow(scope.row)">编辑</el-button>
                        <el-button type="text" @click="showSpecifications(scope.row)">规格参数</el-button>
                    </template>
                </avue-crud>
            </div>
            <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="30%" :title="textMap[dialogStatus]" append-to-body>
                <el-form :model="addList" label-position="right" label-width="120px" :rules="rules" ref="addList" size="medium">
                    <el-form-item label="系列名称:" prop="name">
                        <el-input v-model="addList.name" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请输入系列名称"></el-input>
                    </el-form-item>
                    <el-form-item label="关联分类:" prop="seriesName">
                        <div @click="showSelect('classify')">
                            <el-input v-model="addList.seriesName" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请选择关联分类">
                                <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 34px" slot="suffix"></i>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="关联品牌:" prop="brandName">
                        <div @click="showSelect('brandNames')">
                            <el-input v-model="addList.brandName" autocomplete="off" style="width: 300px;height: 30px;" placeholder="请选择关联品牌">
                                <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 34px" slot="suffix"></i>
                            </el-input>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="listSubmit">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </basic-container>

<!--        新增&修改规格参数-->
        <el-dialog :visible.sync="showSpecification" width="70%" @close="handleClosePublic" v-if="showSpecification"
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

        <!--        关联商品分类弹窗-->
        <goods-classify-selector v-if="sourceClassifyVisible" ref="goodsClassifySelector" :dialogVisible="sourceClassifyVisible"
                                 :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                                 @handleClose="handleClosePublic"
                                 @handleSubmit="handleSubmitPublic"></goods-classify-selector>
        <!--        关联品牌弹窗-->
        <brand-manager-selector v-if="sourceBrandVisible" ref="brandManagerSelector" :dialogVisible="sourceBrandVisible"
                                :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                                @handleClose="handleClosePublic"
                                @handleSubmit="handleSubmitPublic"></brand-manager-selector>
    </list-container>
</template>

<script>
    import { start, stop,} from '@/api/erp/goods/series';
    import {page  as pages ,addSeries,deleteMultiSeries,updateSeries} from '@/api/erp/saas/goodsSeries';
    import {updateSpecification} from '@/api/erp/saas/goodsSeries';
    import {getSpecifications} from '@/api/erp/saas/goodsClassify';
    export default {
        props: ['timeStamp'],
        name: "series",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'goodsClassifySelector': () => import('@/components/saas/goodsClassifySelector'),
            'brandManagerSelector': () => import('@/components/saas/brandManagerSelector'),
        },
        data() {
            return {
                fileList: undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑商品系列',
                    create: '新建商品系列'
                },
                rules: {//新增系列表单验证
                    name: [{required: true, message: '系列不能为空', trigger: 'blur'}],
                    seriesName: [{required: true, message: '关联系列不能为空', trigger: 'blur'}],
                    brandName: [{required: true, message: '关联品牌不能为空', trigger: 'blur'}],
                },
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                isShow: true,
                searchDisable: false,
                dialogFormVisible:false,//是否显示添加商品系列对话框
                addList:{},//添加商品系列数据存储对象
                sourceClassifyVisible:false,//是否显示关联分类对话框
                sourceBrandVisible:false,//是否显示关联品牌对话框
                showSpecification:false,//是否显示规格参数对话框
                nowRow:Object,//当前行中值集合
                specificationTags:[],//当前行规格参数存储对象
                publicTitle:'',
                inputVisible: false,//规格参数是否显示输入框
                inputValue: '',
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
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 60,
                    border: true,
                    index: true,
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
                        label: "系列ID",
                        prop: "id",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                        searchSpan: 4,
                    },
                    {
                        label: "系列名称",
                        prop: "name",
                        minWidth: 180,
                        align: 'center',
                        search: true,
                        searchSpan: 4,
                    },
                    {
                        label: "关联品牌",
                        prop: "brandName",
                        minWidth: 180,
                        search: true,
                        align: 'center',
                        searchSpan: 4,
                    },
                    {
                        label: "关联分类",
                        prop: "seriesName",
                        minWidth: 180,
                        search: true,
                        align: 'center',
                        searchSpan: 4,
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
            handleUpdateStatus(id, status) {
                this.$confirm('您确定执行该操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(status == 0){
                        start(id)
                            .then(response => {
                                if (response.status == 200) {
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success',
                                        duration: 2000
                                    });
                                    this.getList(this.page);
                                } else {
                                    this.$notify({
                                        title: '失败',
                                        message: response.msg,
                                        type: 'warning',
                                        duration: 2000
                                    })
                                }
                            });
                    }else{
                        stop(id)
                            .then(response => {
                                if (response.status == 200) {
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success',
                                        duration: 2000
                                    });
                                    this.getList(this.page);
                                } else {
                                    this.$notify({
                                        title: '失败',
                                        message: response.msg,
                                        type: 'warning',
                                        duration: 2000
                                    })
                                }
                            });
                    }
                });
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
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMultiSeries(ids).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('商品系列删除成功')
                        } else {
                            this.showError('商品系列删除失败'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('商品系列删除失败'+error));
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = pages;
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
            //行点击事件
            handleRowClick(row, event, column) {
                this.controlButtonShow(row, this);
                this.$refs.crud.toggleSelection([row]);
            },
            handleAdd() {
                this.dialogFormVisible = true
                this.dialogStatus='create'
                this.addList={}
            },
            /**
             * 添加商品系列提交
             */
            listSubmit(){
                if(this.addList.name===undefined||this.addList.name.length===0){
                    this.showError('系列名称不能为空')
                }else if(!this.addList.seriesName||!this.addList.brandName){
                    this.showError('请选择要关联的商品系列和品牌')
                }else{
                    this.isLoading=true
                    //判断当前为创建还是为编辑 并赋予响应的方法及信息
                    let method=this.dialogStatus==='create'?addSeries:updateSeries
                    let message=this.dialogStatus==='create'?"系列新增":"系列编辑"
                    method(this.addList).then(res=>{
                        if(Number(res.data.code)===2000||Number(res.data.code)===200){
                            this.showSuccess(message+'成功')
                        }else{
                            this.showError(message+'失败,'+res.data.msg||res.data.data)
                        }
                    },error => this.showError(message+'失败,'+error))
                }
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
                if(list.type&&list.type==='goodsClassify'){
                    this.$set(this.addList,'seriesName',list.seriesName)
                    this.addList.seriesId=list.seriesId
                    this.$refs['addList'].validateField('seriesName')
                }else if(list.type&&list.type==='brand'){
                    this.$set(this.addList,'brandName',list.brandName)
                    this.addList.brandId=list.brandId
                    this.$refs['addList'].validateField('brandName')
                }
                this.sourceBrandVisible = false;
                this.sourceClassifyVisible = false;
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
             * 初始化所有状态
             */
            init(){
                this.dialogFormVisible = false
                this.showSpecification=false
                this.getList(this.page,this.listQuery)
            },

            /**
             * 行编辑事件
             * @param data 当前行数据
             */
            updateShow(data){
                this.dialogFormVisible = true
                this.dialogStatus='update'
                this.addList=data
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

            getSpecifications(){
                getSpecifications(command.row.id).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.showSpecifications(res.data.data)
                    }else{
                        this.showError('获取规格参数失败!'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取规格参数失败!'+error))
            },

            showInput() {
                this.inputVisible = true;

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

            showChildInput(index){
                // this._props.specificationTags[index].inputChildVisible = true;
                let data=this.specificationTags[index]
                data.inputChildVisible=true
                this.$set(this.specificationTags,index,data)
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

            /**
             * 标签删除方法
             * @param arr 当前标签存储数组
             * @param tag 当前标签
             * @param index 当前数组在父数组索引
             */
            handleCloseTag(arr,tag,index) {
                arr.splice(index, 1);
            },

            /**
             * 规格参数对话框提交事件
             */
            handleSubmit() {
                let dto={
                    seriesName:this.nowRow.name,
                    seriesId:this.nowRow.id,
                    dtoList:[]
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
