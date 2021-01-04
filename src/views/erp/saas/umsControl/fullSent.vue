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
                        <el-button type="text" @click="updateShow(scope.row)" :disabled="scope.row.status*1">编辑</el-button>
                    </template>
                </avue-crud>
            </div>

        </basic-container>



        <el-dialog :visible.sync="showDialog" width="70%" @close="handleClosePublic" :close-on-click-modal="false" :modal-append-to-body="false"
                   :title="textMap[dialogStatus]" append-to-body class="public-dialog">
            <el-form :model="addList" ref="addList" label-position="right" label-width="170px" size="medium" :rules="rules">
                <el-form-item label="促销名称:" prop="name">
                    <el-input v-model="addList.name" autocomplete="off"  placeholder="请输入促销名称" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="促销规则:">
                    <el-checkbox-group v-model="addList.rule">
                        <el-checkbox label="订单金额" disabled></el-checkbox>
                    </el-checkbox-group>
                    <div v-for="(data,index) in umsMemberFullDeliveryList" style="margin-bottom: 15px;">
                        <span style="margin-right: 15px;">订单金额满</span>
                        <div style="display: inline-block;width: 150px"><el-input v-model="umsMemberFullDeliveryList[index].money"></el-input></div>
                        <span style="margin-right: 15px;margin-left: 15px;">元，赠送礼品</span>
                        <el-button type="primary" @click="chooseFreeGoods(index)">选择赠品</el-button>
                        <el-button type="warning" @click="deleteRule(index)">删除规则</el-button>
                        <el-table :data="data.umsMemberGiveawayList" border style="width: 100%;margin-top: 15px;" align="center">
                            <el-table-column  width="70" align="center" type="index"></el-table-column>
                            <el-table-column  width="70" align="center" label="操作">
                                <template slot-scope="scope" >
                                    <el-link type="danger" @click="deleteTableFreeGood(index,scope.row.$index)" :underline="false">删除</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column prop="id" label="赠品编号" width="180" align="center"></el-table-column>
                            <el-table-column prop="name" label="赠品名称" align="center"></el-table-column>
                            <el-table-column prop="stock" label="赠品库存" align="center"></el-table-column>
                            <el-table-column prop="quantity" label="赠品数量" align="center"></el-table-column>
                            <el-table-column prop="unit" label="赠品单位" align="center"></el-table-column>
                            <el-table-column prop="pic" label="赠品图片">
                                <template slot-scope="scope" >
                                    <img :src="scope.row.pic[0]" alt="" width="80">
                                </template>
                            </el-table-column>
                            <el-table-column prop="specModel" label="赠品规格" align="center"></el-table-column>
                            <el-table-column prop="note" label="备注" align="center"></el-table-column>
                        </el-table>
                    </div>
                    <el-button type="primary" @click="newRule">继续添加规则</el-button>
                </el-form-item>
                <el-form-item label="每个会员id参与的次数:" prop="frequency" v-if="!isInfinite">
                    <el-input v-model="addList.frequency" autocomplete="off" placeholder="请输入赠品库存" style="width: 50%" :disabled="isInfinite"></el-input>
                    <el-checkbox label="不限次数" style="margin-left: 15px;" v-model="isInfinite"></el-checkbox>
                </el-form-item>
                <el-form-item label="每个会员id参与的次数:" v-if="isInfinite">
                    <el-input autocomplete="off" placeholder="请输入赠品库存" style="width: 50%" :disabled="isInfinite"></el-input>
                    <el-checkbox label="不限次数" style="margin-left: 15px;" v-model="isInfinite"></el-checkbox>
                </el-form-item>

                <el-form-item label="活动时间:" prop="activityTime">
                    <el-date-picker
                            v-model="addList.activityTime"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
<!--                <el-form-item label="商品标签:" >-->
<!--                    <el-checkbox-group v-model="addList.tag">-->
<!--                        <el-checkbox label="满送" disabled></el-checkbox>-->
<!--                    </el-checkbox-group>-->
<!--                </el-form-item>-->
                <el-form-item label="是否启用:" prop="status">
                    <el-radio-group v-model="addList.status">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog=false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="isLoading">确 认</el-button>
            </div>
        </el-dialog>
        <!--        赠品选择框-->
        <free-goods-selector v-if="showFreeGoodsSelector" :dialogVisible="showFreeGoodsSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></free-goods-selector>
    </list-container>
</template>

<script>
    import {createFullSend,page  as pages,fullSendDetail,deleteFullSend,updateFullSend,changeFullSendStatus} from '@/api/erp/saas/umsControl/fullSent';
    export default {
        props: ['timeStamp'],
        name: "fullSent",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'freeGoodsSelector': () => import('@/components/saas/freeGoodsSelector'),
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
                addList:{//添加&编辑满送活动数据存储对象
                    tag:['满送'],
                    rule:['订单金额']
                },
                umsMemberFullDeliveryList:[{}],//满送活动规则数据存储数组
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
                    'frequency': [{required: true, message: '会员参与次数不能为空', trigger: 'blur'}],
                    'activityTime': [{required: true, message: '活动时间不能为空', trigger: 'blur'},],
                    'status': [{required: true, message: '启用状态不能为空', trigger: 'blur'},],
                    // 'pic': [{required: true, message: '赠品图片不能为空', trigger: 'blur'}],
                },
                picList:[],//赠品图片储存数组
                showFreeGoodsSelector:false,//是否展示赠品选择框
                nowIndex:Number,//当前促销规则索引
                isInfinite:false,//是否不限次数
                nowRow:{},//当前行
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
                listQuery: {type:2},
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
                        label: "每人可参与次数",
                        prop: "frequency",
                        minWidth: 180,
                        align: 'center',
                        dicData: [
                            {
                                value:0,
                                label:"不限"
                            },
                        ],
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
                this.$confirm('满送活动暂只能启用一个，是否确定该操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={
                        id:row.id,
                        status:Number(row.status)===1?0:1,
                        type:2
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
                        type:2
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
                    console.log(this.list,'select')
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
                this.listQuery = {};
                this.getList(this.page);
            },

            //列样式
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },

            handleAdd() {
                this.addList={
                    tag:['满送'],
                    rule:['订单金额']
                }
                this.umsMemberFullDeliveryList=[{}]
                this.picList=[]
                this.listLoading=true
                this.showDialog=true
                this.dialogStatus='create'
            },


            /**
             * 关闭赠品选择对话框
             */
            handleClosePublic() {
                this.showFreeGoodsSelector=false
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
                if(list.type&&list.type==='freeGood'){
                    this.showFreeGoodsSelector=false
                    if(this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList&&this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList.length>0){
                        this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList=this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList.concat(list.arr)
                        let hash={}
                        this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList=this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList.reduce(function(item, next) {
                            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                            return item
                        }, [])
                    }else{
                        this.umsMemberFullDeliveryList[this.nowIndex].umsMemberGiveawayList=list.arr
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
             */
            updateShow(data){
                this.nowRow=data
                this.dialogStatus='update'
                this.showDialog=true
                let params = new URLSearchParams();
                params.append("id", data.id);
                fullSendDetail(params).then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.addList=res.data.data
                        this.addList.tag=this.addList.tag.split(',')
                        this.addList.rule=['订单金额']
                        if(Number(res.data.data.frequency)===0){
                            this.isInfinite=true
                        }
                        this.$set(this.addList,'activityTime',[this.addList.startTime,this.addList.endTime])
                        for (let i = 0; i <res.data.data.umsMemberFullDeliveryList.length ; i++) {
                            for (let j = 0; j <res.data.data.umsMemberFullDeliveryList[i].umsMemberGiveawayList.length ; j++) {
                                res.data.data.umsMemberFullDeliveryList[i].umsMemberGiveawayList[j].pic=res.data.data.umsMemberFullDeliveryList[i].umsMemberGiveawayList[j].pic.split(',')
                            }
                        }
                        this.umsMemberFullDeliveryList=res.data.data.umsMemberFullDeliveryList
                    }else {
                        this.showError('获取满送详情失败,'+res.data.msg||res.data.data,res.data.code)
                    }
                },error => this.showError('获取满送详情失败,'+error))
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
                        this.addList.type=2
                        for (let i = 0; i <this.umsMemberFullDeliveryList.length ; i++) {
                            this.umsMemberFullDeliveryList[i].goodsId=[]
                            for (let j = 0; j <this.umsMemberFullDeliveryList[i].umsMemberGiveawayList.length ; j++) {
                                this.umsMemberFullDeliveryList[i].goodsId.push(this.umsMemberFullDeliveryList[i].umsMemberGiveawayList[j].id)
                            }
                            delete this.umsMemberFullDeliveryList[i].umsMemberGiveawayList
                            this.umsMemberFullDeliveryList[i].goodsId=this.umsMemberFullDeliveryList[i].goodsId.toString()
                            this.umsMemberFullDeliveryList[i].startTime=this.addList.activityTime[0] + ' 00:00:00'
                            this.umsMemberFullDeliveryList[i].endTime=this.addList.activityTime[1] + ' 23:59:59'
                        }
                        this.addList.umsMemberFullDeliveryList=this.umsMemberFullDeliveryList
                        if(this.isInfinite){
                            this.addList.frequency=0
                        }
                        this.addList.startTime=this.addList.activityTime[0] + ' 00:00:00'
                        this.addList.endTime=this.addList.activityTime[1] + ' 23:59:59'
                        this.addList.rule="0"
                        this.addList.tag=this.addList.tag.toString()
                        delete this.addList.activityTime
                        if(this.dialogStatus!=='create'){
                            this.addList.id=this.nowRow.id
                        }
                        //判断当前为创建还是为编辑 并赋予相应的方法及信息
                        let method=this.dialogStatus==='create'?createFullSend:updateFullSend
                        let message=this.dialogStatus==='create'?"新建满赠":"编辑满赠"
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
                this.$refs.crud.toggleSelection([row]);
            },

            /**
             * 添加新规则
             */
            newRule(){
                this.umsMemberFullDeliveryList.push({})
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
                this.umsMemberFullDeliveryList.splice(index,1)
            },

            /**
             * 删除满赠商品
             * @param index 当前规则索引
             * @param rowIndex 当前满赠商品索引
             */
            deleteTableFreeGood(index,rowIndex){
                this.umsMemberFullDeliveryList[index].umsMemberGiveawayList.splice(rowIndex,1)
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
</style>
