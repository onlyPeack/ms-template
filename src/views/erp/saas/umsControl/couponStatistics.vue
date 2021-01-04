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
                    <template slot="id" slot-scope="scope" >
                        <span>{{scope.row.id.padStart(3,'0')}}</span>
                    </template>
                    <template slot="activityTime" slot-scope="scope" >
                        <span>开始时间：{{scope.row.startTime}}</span><div></div>
                        <span>结束时间：{{scope.row.endTime}}</span>
                    </template>
                </avue-crud>
            </div>

        </basic-container>
    </list-container>
</template>

<script>
    import {computeCoupon} from '@/api/erp/saas/umsControl/couponManager';
    export default {
        props: ['timeStamp'],
        name: "couponStatistics",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'allGoodsSelector': () => import('@/components/saas/allGoodsSelector'),
        },
        data() {
            return {
                fileList: undefined,
                sloganPic:undefined,
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
                showAllGoodsSelector:false,//是否展示关联商品选择框
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
                        label: "最低消费",
                        prop: "useConditions",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "领取用户",
                        prop: "memberName",
                        minWidth: 180,
                        align: 'center',
                        search: true
                    },
                    {
                        label: "领取张数",
                        prop: "receive",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "使用张数",
                        prop: "use",
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
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                computeCoupon(queryObj).then(res => {
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
                // this.page.currentPage = 1;
                this.getList(this.page, params);
            },
            //清空
            handleSearchReset() {
                this.listQuery = {};
                this.getList(this.page);
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
