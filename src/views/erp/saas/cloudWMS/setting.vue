<template>
    <list-container :timeStamp="timeStamp" :page="listQuery" @reload="getList" class="app-container calendar-list-container goods-list-container" >
        <div style="background-color: #fff;min-height: 780px">
            <div style="height: 80px"></div>
            <div style="margin-left: 80px;">
                <span>初始化内容：</span>
                <ol>
                    <li style="margin-bottom: 15px">全部商品</li>
                    <li style="margin-bottom: 15px">商品分类</li>
                    <li style="margin-bottom: 15px">品牌管理</li>
                    <li style="margin-bottom: 15px">商品系列</li>
                    <li style="margin-bottom: 15px">精选好货</li>
                    <li style="margin-bottom: 15px">商城楼层</li>
                    <li style="margin-bottom: 15px">广告管理</li>
                    <li style="margin-bottom: 15px">栏目管理</li>
                </ol>
            </div>

            <el-form size="medium" :model="addList" label-width="100px" label-position="right" :rules="rules" ref="addList">
<!--                <el-form-item label="承租人ID：" prop="tenantId">-->
<!--                        <el-input placeholder="请输入承租人ID" v-model="addList.tenantId" style="width: 300px"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="">
                        <el-button type="primary" @click="doInit" :disabled="canInit">初始化</el-button><i class="el-icon-warning-outline" style="color: #F56C6C;margin-left: 25px;margin-right: 5px;"></i>只能初始化一次，请谨慎操作
                </el-form-item>
            </el-form>
        </div>


    </list-container>
</template>


<script>
    import {init,isInit} from '@/api/erp/saas/cloudWMS/setting';
    import {addObj,page,delObj,updObj} from '@/api/erp/saas/salesScheme';
    export default {
        name: 'setting',
        components: {
            'memberSelector': () => import('@/components/saas/memberSelector'),
            'goodsSeriesSelector': () => import('@/components/saas/goodsSeriesSelector'),
        },
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
                showSeriesSelector:false,
                showMemberSelector:false,
                showSpecification:false,
                rules: {//新增类目表单验证
                    tenantId: [{required: true, message: '承租人ID不能为空', trigger: 'blur'}],
                    type: [{required: true, message: '调价类型不能为空', trigger: 'blur'}],
                    inventoryPlus: [{required: true, message: '库存加点不能为空', trigger: 'blur'}],
                    sumName: [{required: true, message: '适用客户不能为空', trigger: 'blur'}],
                    validTime: [{required: true, message: '有效期不能为空', trigger: 'blur'}],
                },
                isLoading:false,//按钮是否显示加载中
                headers: undefined,
                fromOut: '',
                canInit:true,
                tableData:[],
                activeName:'second',
                selfCategoryId: undefined,
                clientHeight: 300,
                list: [],
                nowIndex:0,
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
                    salesPricingSchemeItemList:[{}]
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
            // this.headers = {
            //     Authorization: 'Bearer ' + this.$store.getters.token
            // }
            // this.no = this.$store.getters.userInfo.no;
            // this.userId = this.$store.getters.userInfo.id;
            // this.changeDivHeight();
            // const _this = this;
            // window.onresize = function () {
            //     _this.changeDivHeight();
            // };
            // this.init();
            // if (this.$store.state.user.id == '1') {
            //     this.initializingShow = false; // 超级管理员不显示商品初始化功能
            // }
            isInit().then(res=>{
                if(Number(res.data.code)===200||Number(res.data.code)===2000){
                    if((!res.data.data)||res.data.data!==1){
                        this.canInit=false
                    }
                }else{
                    this.showError('查询是否初始化失败!'+res.data.msg||res.data.data,res.data.code)
                }
            },error => this.showError('查询是否初始化失败!'+error))
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
                this.activeName='second'
                this.isLoading=false
                this.addList={}
            },
            /**
             * 获取右侧表格数据
             */
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(res => {
                    this.listLoading = false;
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        for (let i = 0; i <res.data.data.length ; i++) {
                            res.data.data[i].sumName=[]
                            for (let j = 0; j <res.data.data[i].salesPricingSchemeCustomerList.length ; j++) {
                                res.data.data[i].sumName.push(res.data.data[i].salesPricingSchemeCustomerList[j].memberName)
                            }
                        }
                        this.list=res.data.data
                        this.total=res.data.data.length
                    }else{
                        this.showError('获取价格方案列表失败!'+res.data.msg||res.data.data,res.data.code)
                    }
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
            handleDelete(id) {
                // if (this.selectedRows.length < 1) {
                //     this.vueMessage('warning', '请至少选择一条数据');
                //     return false;
                // }
                // let ids = [];
                // this.selectedRows.forEach((row) => {
                //     ids.push(row.id)
                // });
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(id).then(res => {
                        if (Number(res.data.code) === 2000||Number(res.data.code)===200) {
                            this.$message.success("删除价格方案成功")
                            this.init();
                        } else {
                            this.$message.error('删除价格方案失败'+res.data.msg||res.data.data)
                        }
                    },error=>this.$message.error('删除价格方案失败'+error));
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
             * 新建&编辑商品类目
             */
            listSubmit(){
                this.$refs['addList'].validate((valid) => {
                    if (valid) {
                        this.isLoading=true
                        let params=Object.assign({},this.addList)
                        params.effectiveDate=params.validTime[0] +' 00:00:00'
                        params.disabledDate=params.validTime[1] +' 23:59:59'
                        delete params.validTime
                        //判断当前为创建还是为编辑 并赋予响应的方法及信息
                        let method=this.addList.id?updObj:addObj
                        let message=this.addList.id?"价格方案编辑":"价格方案新增"
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
                    let data=Object.assign({},command.row)
                    console.log('进入展示规格参数方法')
                    this.showSpecifications(data)
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
                this.showMemberSelector=false
                this.showSeriesSelector=false
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
                    this.specificationTags= [...row.dtoList]
                }
                //console.log(this.specificationTags,'specificationTags')
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

                console.log('马上开始弹窗')
                this.showSpecification=true
            },
            showInput() {
                this.inputVisible = true;
            },

            handleSubmitPublic(row){
                let arr=[]
                for (let i = 0; i <row.length ; i++) {
                    row[i].memberName=row[i].username
                    row[i].memberId=row[i].id
                    arr.push(row[i].memberName)
                }
                this.$set(this.addList,'salesPricingSchemeCustomerList',row)
                this.$set(this.addList,'sumName',arr.toString())
                this.$refs['addList'].validateField('sumName')
                this.showMemberSelector=false
            },

            pageSwitch(row){
                this.activeName='first'
                this.addList=Object.assign({},row)
                this.$set(this.addList,'validTime',[this.addList.effectiveDate,this.addList.disabledDate])
            },

            /**
             * 新增关联系列
             */
            addAssData(){
                this.addList.salesPricingSchemeItemList.push({})
            },

            /**
             * 删除关联系列
             * @param index 当前行索引
             */
            deleteAssData(index){
                this.addList.salesPricingSchemeItemList.splice(index,1)
                if(this.addList.salesPricingSchemeItemList.length===0){
                    this.addList.salesPricingSchemeItemList=[{}]
                }
            },

            handleSeriesSubmit(data){
                data.arr.seriesName=data.arr.name
                data.arr.seriesId=data.arr.id
                this.showSeriesSelector=false
                this.$set(this.addList.salesPricingSchemeItemList,this.nowIndex,data.arr)
                let hash={}
                this.addList.salesPricingSchemeItemList=this.addList.salesPricingSchemeItemList.reduce(function(item, next) {
                    hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                    return item
                }, [])
            },

            doShowSeriesSelector(index){
                this.showSeriesSelector=true
                this.nowIndex=index
            },

            doInit(){
                this.$confirm('此操作将初始化, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs['addList'].validate((valid) => {
                        if (valid) {
                            let localStorage = window.localStorage
                            // console.log(localStorage['tenantId'],'123')
                            // return false
                            init(localStorage['tenantId']).then(res=>{
                                if(Number(res.data.code)===2000||Number(res.data.code)===200){
                                    this.showSuccess(res.data.data)
                                }else{
                                    this.showError('初始化失败!'+res.data.msg||res.data.data,res.data.code)
                                }
                            },error => this.showError('初始化失败!'+error))
                        }
                    })
                })

            }
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
    .no-border .el-input__inner{
        border:0!important;
    }
    .red-title {
        color: #F56C6C;
    }
    .red-title .el-input__inner{
        border:0!important;
    }
</style>
