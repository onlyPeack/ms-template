<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="avue-crud-container" >
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
                           v-if="true"
                           @row-click="handleRowClick">
                </avue-crud>

                <div style="text-align: center;padding-top: 16%">
                    <el-image src="http://gxcl-shop.qiniu.520mro.com/mo8c1ptgz3zijjzxsgim.png"></el-image><div style="height: 15px"></div>
                    <span>您暂未购买短信服务，</span><span style="color: red;cursor: pointer" @click="goBuyNote">去购买 ></span>
                    <div style="height: 300px"></div>
                </div>
            </div>

        </basic-container>
    </list-container>
</template>

<script>
    import {page  as pages,deleteNote} from '@/api/erp/saas/orderControl/noteList';
    export default {
        props: ['timeStamp'],
        name: "noteList",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'allGoodsSelector': () => import('@/components/saas/allGoodsSelector'),
        },
        data() {
            return {
                fileList: undefined,
                sloganPic:undefined,
                textMap: {//编辑&新建商品系列弹窗头部文字字典
                    update: '编辑秒杀',
                    create: '新增秒杀'
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
                    addBtn: false,
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
                        label: "手机号码",
                        prop: "phone",
                        minWidth: 180,
                        align: 'left',
                        search: true
                    },
                    {
                        label: "时间",
                        prop: "crtTime",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "短信内容",
                        prop: "content",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "发送状态",
                        prop: "deliveryStatus",
                        minWidth: 180,
                        dataType: 'string',
                        align: 'center',
                        search:true,
                        type:'select',
                        dicData: [
                            {
                                value:0,
                                label:"未发送"
                            },
                            {
                                value:1,
                                label:"已发送"
                            },
                        ]
                    }
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
                    }
                    deleteNote(params).then((res) => {
                        if (Number(res.data.code) === 200 || Number(res.data.code) === 2000) {
                            this.showSuccess('短信记录删除成功!')
                        } else {
                            this.showError('短信记录删除失败,'+res.data.msg||res.data.data)
                        }
                    }, error => this.showError('短信记录删除失败,'+error));
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
             * 行单击
             * @param row 当前行
             */
            handleRowClick(row){
                this.$refs.crud.toggleSelection([row]);
            },

            goBuyNote(){
                window.open('http://39.100.72.132/#/','_blank')
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
