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
                           @sort-change="handleSortChange"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <el-button type="primary"  icon="el-icon-document-checked" plain @click="documentChecked(true)">标记为已读</el-button>
                        <el-button type="danger"  icon="el-icon-document-delete" plain  @click="documentChecked(false)">标记为未读</el-button>
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    objectKey="消息设置"
                                    :objectType="isDetailed ? 1 : 0"
                                    @handleEdit="handleEdit"
                        ></button-bar>
                        <el-button type="warning"  icon="el-icon-refresh-left" plain  @click="getList(page)">刷新</el-button>
                    </template>
                    <template slot-scope="scope" slot="newsText">
                        <div style="cursor: pointer; color: #409EFF;" @click="viewBtn(scope.row.id)">
                            {{scope.row.newsText}}
                        </div>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="dialogSelectVisible" v-if="dialogSelectVisible" width="30%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="消息查看" append-to-body class="public-dialog">
            <div class="notice_div">
                <div class="notice_div_item">
                    <span>消息类型:</span>
                    <span v-for="item in typeOption" v-if="form.newsType == item.value">{{item.label}}</span>
                </div>
                <div class="notice_div_item">
                    <span>来源:</span>
                    <span v-for="item in typeOption" v-if="form.newsType == item.value">{{item.label}}</span>
                </div>
                <div class="notice_div_item">
                    <span>时间:</span>
                    <span>{{form.newTime}}</span>
                </div>
                <div class="notice_div_item_conent">{{form.newsText}}<span style="color: #409EFF;cursor: pointer;" @click="noticeBtn(form)">&nbsp;&nbsp;&nbsp;&nbsp;查看详情</span></div>
            </div>
        </el-dialog>
    </list-container>
</template>

<script>
    import {list as listPage,update,select} from "@/api/erp/config/index";
    var  dataTime = new Date();
    export default {
        name: "notice",
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        props: ['timeStamp'],
        inject:['index'],
        data() {
            return {
                form:{},
                dialogSelectVisible: false,
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                timeOptions:[
                    {
                        value: 'yy',
                        label: '年('+dataTime.getFullYear().toString().substr(2,2)+ ')'
                    },
                    {
                        value: 'yyMM',
                        label: '年月('+dataTime.getFullYear().toString().substr(2,2)+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+ ')'
                    },
                    {
                        value: 'yyMMdd',
                        label: '年月日('+dataTime.getFullYear().toString().substr(2,2)+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+dataTime.getDate()+ ')'
                    },
                    {
                        value: 'yyyy',
                        label: '年('+dataTime.getFullYear()+ ')'
                    },
                    {
                        value: 'yyyyMM',
                        label: '年月('+dataTime.getFullYear()+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+ ')'
                    },
                    {
                        value: 'yyyyMMdd',
                        label: '年月日('+dataTime.getFullYear()+(dataTime.getMonth() * 1>9?'':'0')+(dataTime.getMonth() * 1 + 1)+dataTime.getDate()+ ')'
                    },
                ],
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
                permission: {
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    viewBtn: true,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                tableOption: {
                    formData:{},
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
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: true,//首次加载是否显示搜索
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "amountFormer",
                            type: "sum"
                        },
                    ],
                    column: []
                },
                typeOption:[
                    {
                        value: 0,
                        label: '库存预警'
                    },
                    {
                        value: 1,
                        label: '应收预警'
                    },
                    {
                        value: 2,
                        label: '应付预警'
                    },
                    {
                        value: 3,
                        label: '开票超期'
                    },
                    {
                        value: 4,
                        label: '收票超期'
                    },
                ],
                billColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "状态",
                        prop: "status",
                        width: 120,
                        sortable: true,
                        search: true,
                        type:'select',
                        dicData:[
                            {
                                value: 0,
                                label: '未读'
                            },
                            {
                                value: 1,
                                label: '已读'
                            },
                        ],
                        align: 'left',
                    },
                    {
                        label: "时间",
                        prop: "newTime",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "消息类型",
                        prop: "newsType",
                        width: 120,
                        align: 'left',
                        type:'select',
                        dicData:[
                            {
                                value: 0,
                                label: '库存预警'
                            },
                            {
                                value: 1,
                                label: '应收预警'
                            },
                            {
                                value: 2,
                                label: '应付预警'
                            },
                            {
                                value: 3,
                                label: '开票超期'
                            },
                            {
                                value: 4,
                                label: '收票超期'
                            },
                        ],
                    },
                    {
                        label: "消息内容",
                        prop: "newsText",
                        minWidth: 220,
                        align: 'left',
                        slot: true
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
            noticeBtn(item){
                let path = '';
                let pathName = '';
                if(item.newsType == 0){
                    path = 'stock_warning_query';
                    pathName = '库存预警查询';
                }else if(item.newsType == 1){
                    path = 'sales_receive_warning';
                    pathName = '销售收款预警表';
                }else if(item.newsType == 2){
                    path = 'purchase_pay_warning';
                    pathName = '采购付款预警表';
                }else if(item.newsType == 3){
                    path = 'sales_invoice_warning';
                    pathName = '销售开票预警表';
                }else{
                    path = 'purchase_invoice_warning';
                    pathName = '采购收票预警表';
                }
                this.$router.push({
                    path: '/' + path,
                    name:pathName,
                    meta: {
                        i18n: path
                    },
                    query: {
                        timeStamp: new Date().getTime()
                    },
                });
                this.dialogSelectVisible = false;
            },
            handleSelectClose(){
                this.dialogSelectVisible = false;
            },
            documentChecked(type){
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择您要标记的数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    ids.push(row.id)
                });
                if (flag) {
                    let lists = {
                        id: ids,
                        status: type ? 1 : 0
                    }
                    update(lists).then((res) => {
                        if (res.data.code == 200 || res.data.code == '2000') {
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                            this.index.$refs.top.$refs.topNotice.findUnreadList()
                            // console.log(this.index.$refs.top.$refs.topNotice.findUnreadList())
                            this.getList(this.page);

                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    }, error => {
                    });
                }
            },
            handleSwitchChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];

                    this.tableOption.showSummary = true;
                    this.tableOption.column = this.billColumn;

                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = listPage;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
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
            //排序
            handleSortChange(obj) {
                let defaultSort = {};
                if (obj.order == 'ascending') {
                    defaultSort.ascs = this.convertToUnderline(obj.prop);
                } else if (obj.order = 'descending') {
                    defaultSort.descs = this.convertToUnderline(obj.prop);
                }
                this.defaultSort = defaultSort;
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
            //双击查看
            handleRowDbClick(row) {
                const id = row.id;
            },
            //编辑
            viewBtn(id){
                let lists = {
                    id:[id],
                    status:  1
                };
                update(lists).then((res) => {
                    if (res.data.code == 200 || res.data.code == '2000') {
                        select(id).then(res=>{
                            this.form = res.data.data
                        })
                        this.getList(this.page);
                        this.dialogSelectVisible = true;
                    } else {
                    }
                }, error => {
                });
            },
            handleEdit(type) {
                const text = type == 'view' ? '查看' : '编辑';
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要' + text + '的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能' + text + '一个条目');
                    return false;
                }
                let lists = {
                    id:[this.selectedRows[0].id],
                    status:  1
                };
                update(lists).then((res) => {
                    if (res.data.code == 200 || res.data.code == '2000') {
                        select(this.selectedRows[0].id).then(res=>{
                            this.form = res.data.data
                        })
                        this.getList(this.page);
                        this.dialogSelectVisible = true;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                }, error => {
                });


            },
        }
    }
</script>

<style  lang="scss">
    .el-input.is-disabled .el-input__inner{
        background: #ffffff;
        color: #000000;
    }
    .codeItem .el-form .el-row .el-col .el-form-item .el-form-item__content .avue-form__menu .el-button{
        margin-left: -7.4rem;
    }
    .notice_div{
        display: flex;
        flex-direction: column;
        width: 100%;
        .notice_div_item{
           display: flex;
            flex-direction: row;
            line-height: 30px;
            span:first-child{
                display: inline-block;
                width: 100px;
            }
        }
        .notice_div_item_conent{
            border: 1px solid #CCCCCC;
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            font-size: 12px;
            display: flex;
            flex-direction: row;
            height: 100px;
        }
    }
</style>
