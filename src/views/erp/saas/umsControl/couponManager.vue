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
                    <template slot="id" slot-scope="scope" >
                        <span>{{scope.row.id.padStart(3,'0')}}</span>
                    </template>
                    <template slot="activityTime" slot-scope="scope" >
                        <span>开始时间：{{scope.row.startTime}}</span><div></div>
                        <span>结束时间：{{scope.row.endTime}}</span>
                    </template>
                    <template slot="expired" slot-scope="scope" >
                        <span style="color:#F56C6C;" v-if="new Date(scope.row.endTime)<new Date()">已过期</span>
                        <span style="color:#67C23A" v-else>未过期</span>
                    </template>
                    <template slot="status" slot-scope="scope" >
                        <el-switch v-model="scope.row.status*1===1" @change="handleUpdateStatus(scope.row)"></el-switch>
                    </template>
                    <template slot-scope="scope" slot="menu">
<!--                        用户领取张数大于0或启用状态下禁用编辑-->
                        <el-button type="text" @click="updateShow(scope.row)" :disabled="scope.row.status*1===1||scope.row.receive*1>0">编辑</el-button>
                    </template>
                </avue-crud>
            </div>

        </basic-container>



        <el-dialog :visible.sync="showDialog" width="55%" @close="handleClosePublic" :close-on-click-modal="false" :modal-append-to-body="false"
                   :title="textMap[dialogStatus]" append-to-body class="public-dialog">
            <el-form :model="addList" ref="addList" label-position="right" label-width="150px" size="medium" :rules="rules">
                <el-form-item label="优惠券名称:" prop="name">
                    <el-input v-model="addList.name" autocomplete="off"  placeholder="请输入优惠券名称" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="优惠券类型:" :required="true">
                    <el-checkbox-group v-model="addList.rule">
                        <el-checkbox label="红包" disabled></el-checkbox>
                    </el-checkbox-group>
                    <span style="margin-right: 15px;">面额</span>
                    <div style="display: inline-block;width: 150px"><el-input v-model="addList.discountAmount"></el-input></div>
                    <span style="margin-right: 15px;margin-left: 15px;">元，使用规则：最低消费</span>
                    <div style="display: inline-block;width: 150px"><el-input v-model="addList.useConditions"></el-input></div>
                    <span style="margin-right: 15px;margin-left: 15px;">元，才可以使用此券</span><div></div>
                    <span>备注:代金券不兑现金，不设找零</span>
                </el-form-item>
                <el-form-item label="总张数:" prop="number">
                    <el-input v-model="addList.number" autocomplete="off"  placeholder="请输入优惠券数量" style="width: 50%"></el-input>
                </el-form-item>
                <el-form-item label="每个会员id可领张数:" prop="limitCollar">
                    <el-input v-model="addList.limitCollar" autocomplete="off"  placeholder="请输入领取张数" style="width: 50%"></el-input>
                </el-form-item>

                <el-form-item label="优惠券有效时间:" prop="activityTime">
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
<!--                        <el-checkbox label="券" disabled></el-checkbox>-->
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
        <!--        全部商品关联选择框-->
        <all-goods-selector v-if="showAllGoodsSelector" :dialogVisible="showAllGoodsSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></all-goods-selector>
    </list-container>
</template>

<script>
    import {createCoupon,page  as pages,updateCoupon,deleteCoupon,updateCouponStatus} from '@/api/erp/saas/umsControl/couponManager';
    export default {
        props: ['timeStamp'],
        name: "couponManager",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'allGoodsSelector': () => import('@/components/saas/allGoodsSelector'),
        },
        data() {
            return {
                fileList: undefined,
                sloganPic:undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑优惠券',
                    create: '新增优惠券'
                },
                dialogStatus:String,//当前编辑&新建商品系列弹窗状态
                searchDisable: false,
                addList:{//添加&编辑满送活动数据存储对象
                    rule:['红包'],
                    tag:['券']
                },
                goodsSpikeList:[{}],//满送活动规则数据存储数组
                listLoading:false,//品牌选择对话框是否为加载中状态
                showBrandSelector:false,//是否显示选择品牌对话框
                showDialog:false,//是否显示编辑&设置排序对话框
                isLoading:false,//按钮是否现在加载中状态
                rules: {//新增&编辑赠品表单验证
                    'limitCollar': [{required: true, message: '参与次数不能为空', trigger: 'blur'}],
                    'name': [{required: true, message: '赠品名称不能为空', trigger: 'blur'}],
                    'stock': [
                        {required: true, message: '赠品库存不能为空', trigger: 'blur'},
                        {type: 'number', message: '赠品库存只能为数字', trigger: 'blur'},
                    ],
                    'number': [{required: true, message: '总张数不能为空', trigger: 'blur'}],
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
                        label: "优惠券ID",
                        prop: "id",
                        minWidth: 120,
                        align: 'center',
                        slot: true
                    },
                    {
                        label: "优惠券名称",
                        prop: "name",
                        minWidth: 180,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "优惠券类型",
                        prop: "type",
                        minWidth: 120,
                        align: 'center',
                        dicData: [
                            {
                                value:1,
                                label:"红包"
                            },
                        ],
                        search: true,
                        type: 'select'
                    },
                    {
                        label: "面额",
                        prop: "discountAmount",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "总张数",
                        prop: "number",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "每人可领次数",
                        prop: "limitCollar",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "已领取张数",
                        prop: "receive",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "有效时间",
                        prop: "activityTime",
                        minWidth: 220,
                        dataType: 'string',
                        align: 'center',
                        slot: true,
                        search: true,
                        sortable: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "是否过期",
                        prop: "expired",
                        minWidth: 180,
                        align: 'center',
                        slot: true,
                        search: true,
                        type:'select',
                        dicData: [
                            {
                                value:1,
                                label:"未过期"
                            },
                            {
                                value:0,
                                label:"已过期"
                            },
                        ],
                    },
                    {
                        label: "是否启用",
                        prop: "status",
                        minWidth: 180,
                        align: 'center',
                        slot:true,
                        renderHeader: (h, {column, $index}) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: "#000"
                                    }
                                }, column.label+'   '),
                                // h('el-tooltip', {
                                //     attrs: {
                                //         class: "item",
                                //         effect: "dark",
                                //         content: `有用户领取的优惠券下架后无法编辑和启用，启用状态下无法编辑和删除`,
                                //         placement: 'top-start'//ele原来样式
                                //     },
                                // }, [h('img', {
                                //     attrs: {
                                //         class: "imgTabelItem",
                                //         src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                //     }
                                // })]),
                                h('el-tooltip',{
                                    attrs: {
                                        class: "item",
                                        effect: "dark",
                                        content: `有用户领取的优惠券下架后无法编辑和启用，启用状态下无法编辑和删除`,
                                        placement: 'top-start'//ele原来样式
                                     },
                                    // domProps:{
                                    //     innerHTML:"<div slot='content'>有用户领取的优惠券下架后无法编辑和启用，启用状态下无法编辑和删除1</div><img src='http://hejigy.com.cn/questionMarksBlue.png' class='imgTabelItem'/>"
                                    // }
                                },
                                    [
                                    h('div',{props:{
                                        slot:'content'
                                    }},'有用户领取的优惠券下架后无法编辑和启用，启用状态下无法编辑和删除1'),
                                    h('img',{
                                    attrs: {
                                                class: "imgTabelItem",
                                                src: 'http://hejigy.com.cn/questionMarksBlue.png'
                                    }
                                }
                                )
                            ]
                            )
                            ])
                        },
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
                let msg='您确定执行该操作?'
                if(new Date(row.endTime)<new Date()&&row.status*1===0){
                    this.showError('该活动已过期，请修改活动时间或新建活动',401)
                    return false
                }
                if(row.receive*1>0&&row.status*1===1){
                    msg='该优惠券已有用户领取，关闭后，无法启用和编辑'
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={
                        id:row.id,
                        status:Number(row.status)===1?0:1
                    }
                    updateCouponStatus(params).then(response => {
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
                    deleteCoupon(ids.toString()).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('删除优惠券成功!')
                        } else {
                            this.showError('删除优惠券失败,'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('删除优惠券失败,'+error));
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
                    if(selection[i].status*1===1&&new Date(selection[i].endTime)>new Date()){
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
                try {
                    this.listQuery.startTime=params.activityTime[0] +' 00:00:00'
                    this.listQuery.endTime=params.activityTime[1] + ' 23:59:59'
                    delete this.listQuery.activityTime
                }catch (e) {

                }
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
                    rule:['红包'],
                    tag:['券']
                }
                this.goodsSpikeList=[{}]
                this.picList=[]
                this.listLoading=true
                this.showDialog=true
                this.dialogStatus='create'
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
                        list.arr[i].stock=''
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
                        this.addList.goodsSpikeList=list.arr
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
                this.addList=Object.assign(JSON.parse(JSON.stringify(this.addList)),JSON.parse(JSON.stringify(data)))
                this.addList.activityTime=[this.addList.startTime,this.addList.endTime]
                this.dialogStatus='update'
                this.showDialog=true
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
                        params.startTime=params.activityTime[0] + ' 00:00:00'
                        params.endTime=params.activityTime[1] + ' 23:59:59'
                        //优惠券截至时间必须大于此刻
                        if(new Date(params.activityTime[1])<new Date()){
                            this.showError('时间设置错误!',401)
                            return false
                        }
                        delete params.activityTime


                        params.tag=params.tag.toString()
                        if(this.dialogStatus!=='create'){
                            params.id=this.nowRow.id
                        }
                        //判断当前为创建还是为编辑 并赋予相应的方法及提示信息
                        let method=this.dialogStatus==='create'?createCoupon:updateCoupon
                        let message=this.dialogStatus==='create'?"新建优惠券":"编辑优惠券"
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
            deleteTableFreeGood(index,){
                this.addList.goodsSpikeList.splice(index,1)
            },

            /**
             * 批量设置
             */
            doBatchSet(value,type){
                //console.log(value,type,this.isBatchSet,this.addList,'批量设置')
                if(this.isBatchSet){
                    for (let i = 0; i <this.addList.goodsSpikeList.length ; i++) {
                        this.addList.goodsSpikeList[i][type]=value
                        // let data=JSON.parse(JSON.stringify(this.addList.goodsSpikeList))
                        // this.addList.goodsSpikeList=data
                    }
                }
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
    .red-title{
        color: red;
    }
</style>
