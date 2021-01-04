<template>
    <el-dialog :visible.sync="dialogVisible" width="70%" @close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :nowRow="nowRow" :modal="false"
               :before-close="handleClose" title="选择赠品" append-to-body class="public-dialog">
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
                           @search-reset="handleSearchReset"
                           @row-click="handleRowClick">
                    <template slot="id" slot-scope="scope" >
                        <span>{{addPreZero(scope.row.id)}}</span>
                    </template>
                    <template slot="pic" slot-scope="scope" >
                        <img :src="scope.row.pic[0]" alt="" width="80">
                    </template>
                    <template slot="recommendStatus" slot-scope="scope" >
                        <el-switch v-model="!!scope.row.recommendStatus" @change="handleUpdateStatus(scope.row)"/>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="text" @click="updateShow(scope.row)">编辑</el-button>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {createBrandRecommend,changeBrandRecommendStatus} from '@/api/erp/saas/contentControl/brandRecommend';
    import {page  as pages,deleteFreeGood} from '@/api/erp/saas/umsControl/freeGoodsList';
    export default {
        props: ['timeStamp','dialogVisible',  'title','code','typeOption','id','itemVisible','selectType','operationType','craftId','config','discountLevel','nowRow','specificationTags'],
        name: "freeGoodsSelector",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
        },
        data() {
            return {
                fileList: undefined,
                sloganPic:undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑赠品',
                    create: '新增赠品'
                },
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                searchDisable: false,
                addList:{pic:Array},//添加品牌推荐数据存储对象
                listLoading:false,//品牌选择对话框是否为加载中状态
                showBrandSelector:false,//是否显示选择品牌对话框
                showDialog:false,//是否显示编辑&设置排序对话框
                isLoading:false,//按钮是否现在加载中状态
                rules: {//新增&编辑赠品表单验证
                    'title': [{required: true, message: '赠品标题不能为空', trigger: 'blur'}],
                    'name': [{required: true, message: '赠品名称不能为空', trigger: 'blur'}],
                    'stock': [
                        {required: true, message: '赠品库存不能为空', trigger: 'blur'},
                        {type: 'number', message: '赠品库存只能为数字', trigger: 'blur'},
                    ],
                    'specModel': [{required: true, message: '赠品型号不能为空', trigger: 'blur'}],
                    // 'pic': [{required: true, message: '赠品图片不能为空', trigger: 'blur'}],
                },
                picList:[],//赠品图片储存数组
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
                    menu: false,
                    menuWidth:100,
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
                        label: "赠品编号",
                        prop: "id",
                        search: true,
                        align: 'center',
                        slot: true
                    },
                    {
                        label: "赠品名称",
                        prop: "name",
                        minWidth: 130,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "赠品库存",
                        prop: "stock",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "赠品数量",
                        prop: "quantity",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "赠品单位",
                        prop: "unit",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "赠品图片",
                        prop: "pic",
                        minWidth: 180,
                        type:'img',
                        dataType: 'string',
                        align: 'center',
                        slot:true
                    },
                    {
                        label: "赠品规格",
                        prop: "specModel",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "创建人",
                        prop: "crtUserName",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "创建时间",
                        prop: "crtTime",
                        minWidth: 200,
                        align: 'center',
                        search: true,
                        sortable: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
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
                this.$confirm('您确定执行该操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    changeBrandRecommendStatus([row]).then(response => {
                        if (Number(response.status) === 2000||Number(response.data.code)===200) {
                            this.showSuccess('更变推荐状态成功!')
                        } else {
                            this.showError('更变推荐状态失败,'+response.data.msg||response.data.data,response.data.code)
                        }
                    },error => this.showError('更变推荐状态失败,'+error));
                })
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
                    deleteFreeGood(ids.toString()).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('满赠商品删除成功!')
                        } else {
                            this.showError('满赠商品删除失败,'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('满赠商品删除失败,'+error));
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
                    for (let i = 0; i <data.records.length ; i++) {
                        data.records[i].pic= data.records[i].pic.split(',')
                    }
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
                this.listQuery.startTime=params.crtTime[0] +'00:00:00'
                this.listQuery.endTime=params.crtTime[1] + '23:59:59'
                delete this.listQuery.crtTime
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
                this.addList={}
                this.picList=[]
                this.listLoading=true
                this.showDialog=true
                this.dialogStatus='create'
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
                    this.addList.brandId=list.arr[0]
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
                for (let i = 0; i <data.pic.length ; i++) {
                    this.picList.push({
                        url:data.pic[i],
                        name:data.pic[i]
                    })
                }
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
                let dto={
                    type:'freeGood',
                    arr:this.selectedRows
                }
                this.$emit('handleSubmit', dto);
            },

            /**
             * 数字前补零
             * @param num 需要补零的数字
             * @returns {string|*} 补零后的数字
             */
            addPreZero(num){
                if(num<10){
                    return '00'+num;
                }else if(num<100){
                    return '0'+num;
                }else{
                    return num;
                }
            },

            /**
             * 行单击
             * @param row 当前行
             */
            handleRowClick(row){
                this.$refs.crud.toggleSelection([row]);
            },

            /**
             * 从父组件中接收的关闭对话框方法
             */
            handleClose() {
                this.$emit('handleClose');
            },
        }
    }
</script>

<style lang="scss">
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
