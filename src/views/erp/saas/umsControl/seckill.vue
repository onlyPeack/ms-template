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
                           @search-reset="handleSearchReset"
                           @row-click="handleRowClick">
                    <template slot="menuLeft">
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleDelete="handleRowDelete"></button-bar>
                    </template>
                    <template slot="status" slot-scope="scope" >
                        <el-switch v-model="scope.row.status*1===1" @change="handleUpdateStatus(scope.row)"></el-switch>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button type="text" @click="updateShow(scope.row,'detail')">详情</el-button>
                        <el-button type="text" @click="updateShow(scope.row)" :disabled="scope.row.status*1===1">编辑</el-button>
                    </template>
                </avue-crud>
            </div>

        </basic-container>



        <el-dialog :visible.sync="showDialog" width="75%" @close="handleClosePublic" :close-on-click-modal="false" :modal-append-to-body="false"
                   :title="textMap[dialogStatus]" append-to-body class="public-dialog">
            <el-form :model="addList" ref="addList" label-position="right" label-width="85px" size="medium" :rules="rules">
                <el-form-item label="促销名称:" prop="name">
                    <el-input v-model="addList.name" autocomplete="off"  placeholder="请输入促销名称" style="width: 50%" :disabled="isView"></el-input>
                </el-form-item>
                <el-form-item label="选择商品:" v-if="!isView">
                    <el-button type="primary" @click="showAllGoodsSelector=true">选择商品</el-button>
                    <div style="margin-top: 15px;margin-bottom: -25px;">
                        <div style="display: inline-block">
                            <el-upload
                                    class="upload-demo"
                                    action="api/saas/goods/importSpikeFile"
                                    multiple
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    accept=".xlsx,.xls"
                                    :headers="uploadHeader"
                                    :show-file-list="false"
                                    :file-list="fileList">
                                <el-link type="primary" :underline="false" style="margin-right: 15px;"><i class="el-icon-download"></i>导入</el-link>
                            </el-upload>
                        </div>
                        <el-link type="primary" :underline="false" href="api/saas/goods/downTemplate" download="秒杀商品模板">下载模板</el-link> <span style="margin-left: 100px;vertical-align: bottom">是否批量设置：</span><el-switch v-model="isBatchSet"></el-switch>
                    </div>
                </el-form-item>
                <span style="margin-left: 15px;margin-right: 12px;">已选商品:</span>
                <div style="display: inline-block;width: 90%;vertical-align: text-top">
                    <el-table :data="addList.goodsSpikeList" border align="center">
                        <el-table-column  width="70" align="center" type="index"></el-table-column>
                        <el-table-column  width="70" align="center" label="操作" v-if="!isView">
                            <template slot-scope="scope" >
                                <el-link type="danger" @click="deleteTableFreeGood(scope.$index)" :underline="false">删除</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品名称" prop="name" >
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="商品品牌" prop="brandName">
                        </el-table-column>
                        <el-table-column align="center" min-width="120" label="规格型号" prop="specModel">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="图片" prop="picUrl">
                            <template slot-scope="scope">
                                <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="90" label="商品面价" prop="retailPrice">
                        </el-table-column>
                        <el-table-column align="center" label="计量单位" prop="measureUnitName" min-width="75">
                        </el-table-column>
                        <el-table-column align="center" min-width="70" label="起订量" prop="moqMinOrder">
                        </el-table-column>
                        <el-table-column align="center" min-width="80" label="可售数量" prop="availableStock" v-slot="{row}">
                            <span>{{row.stock-(row.lockedQty||0)}}</span>
                        </el-table-column>
                        <el-table-column align="left" min-width="100" label="秒杀折扣" class-name="red-title" v-slot="{row,$index}">
                            <el-form-item :prop="`goodsSpikeList[${$index}].count`" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" label-width="0">
                                <el-input v-model="row.count" @input="doBatchSet(row.count,'count',$index)" :disabled="isView"></el-input>
                            </el-form-item>
                        </el-table-column>
                        <el-table-column align="center" min-width="100" label="秒杀价" class-name="red-title">
                            <template slot-scope="scope">
                                <el-form-item :prop="`goodsSpikeList[${scope.$index}].myPrice`" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" label-width="0">
                                    <el-input v-model="scope.row.myPrice" @input="doBatchSet(scope.row.myPrice,'myPrice',scope.$index)" :disabled="isView"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="150" label="秒杀库存" class-name="red-title">
                            <template slot-scope="scope">
                                <el-form-item :prop="`goodsSpikeList[${scope.$index}].spikeStock`" :rules="[{required: true, message: '秒杀库存不能为空', trigger: 'blur'},
                        {type: 'number',min:0,max:(scope.row.stock-scope.row.lockedQty), message: '不能大于可售数量', trigger: 'blur'},]" label-width="0">
                                    <el-input v-model.number="addList.goodsSpikeList[scope.$index].spikeStock" @input="doBatchSet(scope.row.spikeStock,'spikeStock')" :disabled="isView"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>


                <div style="height: 15px"></div>
                <el-form-item label="活动时间:" prop="activityTime">
                    <el-date-picker
                            v-model="addList.activityTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            :disabled="isView"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
<!--                <el-form-item label="商品标签:" >-->
<!--                    <el-checkbox-group v-model="addList.tag">-->
<!--                        <el-checkbox label="秒杀" disabled></el-checkbox>-->
<!--                    </el-checkbox-group>-->
<!--                </el-form-item>-->
                <el-form-item label="是否启用:" prop="status">
                    <el-radio-group v-model="addList.status" :disabled="isView">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog=false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="isLoading" v-if="!isView">确 认</el-button>
            </div>
        </el-dialog>
        <!--        全部商品关联选择框-->
        <all-goods-selector v-if="showAllGoodsSelector" :isOnSale="0" title="选择商品" :dialogVisible="showAllGoodsSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></all-goods-selector>
    </list-container>
</template>

<script>
    import {createFullSend,page  as pages,fullSendDetail,deleteFullSend,updateFullSend,changeFullSendStatus} from '@/api/erp/saas/umsControl/fullSent';
    export default {
        props: ['timeStamp'],
        name: "fullSent",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'allGoodsSelector': () => import('@/components/saas/allGoodsSelector'),
        },
        data() {
            return {
                uploadHeader:{//文件上传请求头设置
                    Authorization: 'Bearer ' + this.$store.getters.token
                },
                fileList: undefined,
                sloganPic:undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑秒杀',
                    create: '新增秒杀',
                    detail:'秒杀详情'
                },
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                searchDisable: false,
                addList:{//添加&编辑满送活动数据存储对象
                    tag:['秒杀'],
                },
                goodsSpikeList:[{}],//满送活动规则数据存储数组
                listLoading:false,//品牌选择对话框是否为加载中状态
                showBrandSelector:false,//是否显示选择品牌对话框
                showDialog:false,//是否显示编辑&设置排序对话框
                isLoading:false,//按钮是否现在加载中状态
                rules: {//新增&编辑赠品表单验证
                    'title': [{required: true, message: '赠品标题不能为空', trigger: 'blur'}],
                    'name': [
                        {required: true, message: '赠品名称不能为空', trigger: 'blur'},
                        { min: 1, max: 17, message: '长度在 1 到 17 个字符', trigger: 'blur' }
                    ],
                    'stock': [
                        {required: true, message: '赠品库存不能为空', trigger: 'blur'},
                        {type: 'number', message: '赠品库存只能为数字', trigger: 'blur'},
                    ],
                    'frequency': [{required: true, message: '会员参与次数不能为空', trigger: 'blur'}],
                    'activityTime': [{required: true, message: '活动时间不能为空', trigger: 'blur'},],
                    'status': [{required: true, message: '启用状态不能为空', trigger: 'blur'},],
                    // 'pic': [{required: true, message: '赠品图片不能为空', trigger: 'blur'}],
                },
                picList:[],//赠品图片储存数组
                showAllGoodsSelector:false,//是否展示关联商品选择框
                nowIndex:Number,//当前促销规则索引
                isInfinite:false,//是否不限次数
                nowRow:{},//当前行
                isBatchSet:false,//是否批量设置
                isView:false,//是否为详情
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
                listQuery: {type:1},
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
                    menu: true,
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
                        label: "满送ID",
                        prop: "id",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "促销名称",
                        prop: "name",
                        minWidth: 180,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "开始时间",
                        prop: "startTime",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "结束时间",
                        prop: "endTime",
                        minWidth: 180,
                        type:'img',
                        dataType: 'string',
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
                        minWidth: 180,
                        align: 'center',
                        search: true,
                        sortable: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "是否启用",
                        prop: "status",
                        minWidth: 180,
                        align: 'center',
                        slot:true
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
                this.$confirm('秒杀活动暂只能启用一个，是否确定该操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={
                        id:row.id,
                        status:Number(row.status)===1?0:1,
                        type:1,
                    }
                    changeFullSendStatus(params).then(response => {
                        if (Number(response.data.code) === 2000||Number(response.data.code)===200) {
                            this.showSuccess('更变启用状态成功!')
                        } else {
                            this.showError('更变启用状态失败,'+response.data.msg||response.data.data,response.data.code)
                        }
                    },error => this.showError('更变启用状态失败,'+error));
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
                    let params={
                        ids:ids.toString(),
                        type:1
                    }
                    deleteFullSend(params).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('满赠删除成功!')
                        } else {
                            this.showError('满赠删除失败,'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('满赠删除失败,'+error));
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                pages(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.list = data.records;
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                    this.searchDisable = false;
                    console.log(error,'error')
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
                for (let i = 0; i <selection.length ; i++) {
                    if(selection[i].status*1===1){
                        this.permission.delBtn=false
                        return false
                    }
                }
                this.permission.delBtn = true
                this.selectedRows = selection;
            },
            handleSelectionClear() {
                this.selectedRows = [];
                this.$refs.crud.toggleSelection();
            },
            //搜索
            handleSearchChange(params) {
                // if (this.searchDisable) {
                //     return;
                // }
                // this.searchDisable = true;
                // this.listQuery = params;
                // this.listQuery.startTime=params.crtTime[0] +'00:00:00'
                // this.listQuery.endTime=params.crtTime[1] + '23:59:59'
                // delete this.listQuery.crtTime
                // this.page.currentPage = 1;

                this.getList(this.page, params);
            },
            //清空
            handleSearchReset() {
                this.listQuery = {type:1};
                this.getList(this.page);
            },

            //列样式
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },

            handleAdd() {
                this.addList={
                    tag:['秒杀'],
                }
                this.goodsSpikeList=[{}]
                this.picList=[]
                this.listLoading=true
                this.showDialog=true
                this.dialogStatus='create'
                this.isView=false
            },


            /**
             * 关闭赠品选择对话框
             */
            handleClosePublic() {
                this.showAllGoodsSelector=false
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
                if(list.type&&list.type==='allGoods'){
                    for (let i = 0; i <list.arr.length ; i++) {
                        list.arr[i].price=''
                    }
                    this.showAllGoodsSelector=false
                    if (this.addList.goodsSpikeList&&this.addList.goodsSpikeList.length>0){
                        this.addList.goodsSpikeList=this.addList.goodsSpikeList.concat(list.arr)
                        let hash={}
                        this.addList.goodsSpikeList=this.addList.goodsSpikeList.reduce(function(item, next) {
                            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                            return item
                        }, [])
                    }else{
                        // this.addList.goodsSpikeList=list.arr
                        this.$set(this.addList,'goodsSpikeList',list.arr)
                    }
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
             * @param type 当前是否为详情
             */
            updateShow(data,type){
                if(type==='detail'){
                    this.dialogStatus='detail'
                    this.isView=true
                }else{
                    this.dialogStatus='update'
                    this.isView=false
                }
                this.nowRow=data
                this.showDialog=true
                let params = new URLSearchParams();
                params.append("id", data.id);
                fullSendDetail(params).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList=res.data.data
                        this.addList.tag=this.addList.tag.split(',')
                        this.$set(this.addList,'activityTime',[this.addList.startTime,this.addList.endTime])
                        let arr=[]
                        for (let i = 0; i <res.data.data.goodsSpikeList.length ; i++) {
                            // res.data.data.goodsSpikeList[i].goodsList[0].count=res.data.data.goodsSpikeList[i].discount
                            // res.data.data.goodsSpikeList[i].goodsList[0].myPrice=res.data.data.goodsSpikeList[i].price
                            this.$set(res.data.data.goodsSpikeList[i].goodsList[0],'count',res.data.data.goodsSpikeList[i].discount)
                            this.$set(res.data.data.goodsSpikeList[i].goodsList[0],'myPrice',res.data.data.goodsSpikeList[i].price)
                            this.$set(res.data.data.goodsSpikeList[i].goodsList[0],'spikeStock',res.data.data.goodsSpikeList[i].spikeStock)
                            arr.push(res.data.data.goodsSpikeList[i].goodsList[0])
                        }
                        this.addList.goodsSpikeList=arr
                    }else {
                        this.showError('获取秒杀详情失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取秒杀详情失败,'+error))
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

                        let params=JSON.parse(JSON.stringify(this.addList))

                        params.type=1
                        for (let i = 0; i <params.goodsSpikeList.length ; i++) {
                            params.goodsSpikeList[i].goodsId=params.goodsSpikeList[i].id
                            params.goodsSpikeList[i].startTime=params.activityTime[0] + ' 00:00:00'
                            params.goodsSpikeList[i].endTime=params.activityTime[1] + ' 23:59:59'
                            params.goodsSpikeList[i].discount=params.goodsSpikeList[i].count
                            params.goodsSpikeList[i].facePrice=params.goodsSpikeList[i].retailPrice
                            params.goodsSpikeList[i].price=params.goodsSpikeList[i].myPrice
                            delete params.goodsSpikeList[i].tagsList
                        }
                        params.startTime=params.activityTime[0]
                        params.endTime=params.activityTime[1]
                        params.tag=params.tag.toString()
                        delete params.activityTime
                        if(this.dialogStatus!=='create'){
                            params.id=this.nowRow.id
                        }
                        //判断当前为创建还是为编辑 并赋予相应的方法及信息
                        let method=this.dialogStatus==='create'?createFullSend:updateFullSend
                        let message=this.dialogStatus==='create'?"新建秒杀":"编辑秒杀"
                        method(params).then(res => {
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
             * 图片上传之前添加参数
             * @param file
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
                this.picList.push({
                    url:res.data.url,
                    name:res.data.url
                })
            },
            /**
             *删除满赠图片事件
             * @param file
             * @param fileList
             */
            removePic(file,fileList){
                this.picList=fileList
            },

            /**
             * 行单击
             * @param row 当前行
             */
            handleRowClick(row){
                console.log(arguments,'参数')
                this.$refs.crud.toggleSelection([row]);
            },

            /**
             * 添加新规则
             */
            newRule(){
                this.goodsSpikeList.push({})
            },

            /**
             * 选择赠品
             *
             */
            chooseFreeGoods(index){
                this.showFreeGoodsSelector=true
                this.nowIndex=index
            },

            /**
             * 删除规则
             * @param index
             */
            deleteRule(index){
                this.goodsSpikeList.splice(index,1)
            },

            /**
             * 删除满赠商品
             * @param index 当前商品索引
             */
            deleteTableFreeGood(index){
                console.log(this.addList.goodsSpikeList,'before')
                this.addList.goodsSpikeList.splice(index,1)
                console.log(this.addList.goodsSpikeList,'after')
            },

            /**
             * 批量设置 优惠折扣和优惠价互相计算(含有批量设置功能)
             */
            doBatchSet(value,type,index){
                //console.log(value,type,this.isBatchSet,this.addList,'批量设置')
                if(type==='myPrice'){
                    if(this.isBatchSet){
                        for (let i = 0; i <this.addList.goodsSpikeList.length ; i++) {
                            this.$set(this.addList.goodsSpikeList[i],type,value)
                            this.$set(this.addList.goodsSpikeList[i],'count',this.division(value,this.addList.goodsSpikeList[i].retailPrice).toFixed(2))
                        }
                    }else{
                        this.$set(this.addList.goodsSpikeList[index],'count',this.division(value,this.addList.goodsSpikeList[index].retailPrice).toFixed(2))
                    }

                }else if(type==='count'){
                    if(this.isBatchSet){
                        for (let i = 0; i <this.addList.goodsSpikeList.length ; i++) {
                            this.$set(this.addList.goodsSpikeList[i],type,value)
                            this.$set(this.addList.goodsSpikeList[i],'myPrice',this.accMulti(this.addList.goodsSpikeList[i].retailPrice,value).toFixed(2))
                        }
                    }else{
                        this.$set(this.addList.goodsSpikeList[index],'myPrice',this.accMulti(this.addList.goodsSpikeList[index].retailPrice,value).toFixed(2))
                    }
                }else{
                    if(this.isBatchSet){
                        for (let i = 0; i <this.addList.goodsSpikeList.length ; i++) {
                            this.$set(this.addList.goodsSpikeList[i],type,value)
                        }
                    }
                }
                // if(this.isBatchSet){
                //     for (let i = 0; i <this.addList.goodsSpikeList.length ; i++) {
                //         this.addList.goodsSpikeList[i][type]=value
                //         // let data=JSON.parse(JSON.stringify(this.addList.goodsSpikeList))
                //         // this.addList.goodsSpikeList=data
                //     }
                // }
            },

            /**
             * 上传成功事件
             * @param res
             */
            uploadSuccess(res){
                //console.log(res,'上传成功')
                if(Number(res.code)===2000||Number(res.code)===200){
                    res=res.data
                    for (let i = 0; i <res.length ; i++) {
                        res[i].price=''
                        res[i].stock=''
                    }
                    if (this.addList.goodsSpikeList&&this.addList.goodsSpikeList.length>0){
                        this.addList.goodsSpikeList=this.addList.goodsSpikeList.concat(res)
                        let hash={}
                        this.addList.goodsSpikeList=this.addList.goodsSpikeList.reduce(function(item, next) {
                            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                            return item
                        }, [])
                    }else{
                        this.$set(this.addList,'goodsSpikeList',res)

                    }
                }else{
                    this.showError('文件导入失败,'+res.msg||res.data,res.code)
                }
            },

            /**
             * 文件上传失败
             * @param err
             */
            uploadError(err){
                console.log(err,'文件导入失败')
                this.showError('文件导入失败!')
            }
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
    .red-title{
        color: red;
    }
</style>
