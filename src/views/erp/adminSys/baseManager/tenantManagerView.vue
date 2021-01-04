<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="bill-form-container">
                <div class="information_div">
                    <div class="information_title">
                        <div class="mark"></div>
                        <span>企业信息</span>
                    </div>
                    <div class="information_conent" v-if="enterpriseInformation">
                        <div class="information_item">
                            <span class="span_one">账号密码：*******</span>
                            <span  style="color: #0088FF;margin-left: 20px;cursor: pointer;">重置密码</span>
                        </div>
                        <div class="information_item">
                            <span class="span_one">注册时间：{{enterpriseInformation.authenticationCommitTime}}</span>
                        </div>
                        <div class="information_item">
                            <span class="span_one">登录账号：{{enterpriseInformation.username}}</span>
                        </div>
                        <div class="information_item">
                            <span class="span_one">当前版本：{{enterpriseInformation.currentVersion == '0' ? '免费版' : enterpriseInformation.currentVersion == '1' ? '标准版' : '高级版'}}</span>
                        </div>
                        <div class="information_item">
                            <span class="span_one">绑定号码：{{enterpriseInformation.registerPhone}}</span>
                            <span  style="color: #0088FF;margin-left: 20px;cursor: pointer;">修改绑定号码</span>
                        </div>
                        <div class="information_item">
                            <span class="span_one">版本有效期：{{enterpriseInformation.endTime}}</span>
                            <span style="color: red;margin-left: 20px;">有效期还有{{days}}天!</span>
                        </div>
                        <div class="information_item">
                            <span  class="span_one">所属行业：{{enterpriseInformation.industry}}</span>
                        </div>
                    </div>
                </div>
                <div class="information_div">
                    <div class="information_title">
                        <div class="mark"></div>
                        <span>认证信息</span>
                    </div>
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
                               @sort-change="handleSortChange"
                               :cell-style="handleCellStyle"
                               @row-click="handleRowClick">
                        <template slot="operate" slot-scope="scope" >
                            <el-button type="success" plain @click="operateBtn(1)">
                                通过
                            </el-button>
                            <el-button type="warning" plain @click="operateBtn(2)">
                                驳回
                            </el-button>
                        </template>
                    </avue-crud>
                </div>
                <div class="information_div">
                    <div class="information_title">
                        <div class="mark"></div>
                        <span>交易信息</span>
                    </div>
                    <el-tabs value="first">
                        <el-tab-pane label="订单记录" name="first">
                            <order-records :id="id"></order-records>
                        </el-tab-pane>
                        <el-tab-pane label="交易记录" name="second">
                            <transaction-records :id="id"></transaction-records>
                        </el-tab-pane>
                        <el-tab-pane label="发票记录" name="third">
                            <invoice-records :id="id"></invoice-records>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        getObj,
        page as pages,
        queryTenantDetail,
        checkTenant,
        invoiceManage,
        addInvoiceManage
    } from '@/api/admin/tenant/index';
    export default {
        name: "material_stock_out_form",
        props: ['type', 'id'],
        components: {
            'order-records': () => import('./components/orderRecords'),
            'transaction-records': () => import('./components/transactionRecords'),
            'invoice-records': () => import('./components/invoiceRecords')
        },
        data() {
            return {
                enterpriseInformation:undefined,
                value1:false,
                loading: false,
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                issueAmount:undefined,
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
                    editBtn: true,
                    viewBtn: true,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                loading: false,
                days: 0,
                tableOption: {
                    height: '150',
                    calcHeight: 150,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    highlightCurrentRow: true,
                    border: true,
                    index: false,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    column: []
                },
                billColumn: [
                    {
                        label: "公司名称",
                        prop: "name",
                        minWidth: 200,
                        align: 'center',
                    },
                    {
                        label: "联系电话",
                        prop: "mobilePhone",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "企业类型",
                        prop: "tenantType",
                        minWidth: 120,
                        align: 'center',
                    },
                    {
                        label: "开户银行",
                        prop: "depositBank",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "银行账户",
                        prop: "depositAccount",
                        minWidth: 160,
                        align: 'center',
                    },
                    {
                        label: "企业税号",
                        prop: "dutyParagraph",
                        width: 160,
                        align: 'center',
                    },
                    {
                        label: "收票人",
                        prop: "mailRecipients",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "收票电话",
                        prop: "mailPhone",
                        width: 120,
                        align: 'center'
                    },
                    {
                        label: "收票地址",
                        prop: "mailAddress",
                        width: 160,
                        align: 'left'
                    },
                    {
                        label: "营业执照",
                        prop: "businessLicense",
                        width: 160,
                        align: 'center'
                    },
                    {
                        label: "提交时间",
                        prop: "authenticationCommitTime",
                        minWidth: 160,
                        sortable: true,
                        align: 'center',
                        type: 'date',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                    {
                        label: "认证状态",
                        prop: "authenticationStatus",
                        width: 100,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: '待审核'
                            },
                            {
                                value: '1',
                                label: '已认证'
                            },
                            {
                                value: '2',
                                label: '已驳回'
                            },
                            {
                                value: '3',
                                label: '禁用'
                            }
                        ],
                    },
                    {
                        label: "操作",
                        prop: "operate",
                        fixed:"right",
                        slot:true,
                        width: 180,
                        align: 'center'
                    },
                ],
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            this.tableOption.column = this.billColumn;
            this.queryTenantDetail(this.id);
            this.invoiceManage();
        },
        mounted() {
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            operateBtn(status){
                this.$confirm('你确定执行该操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    checkTenant(this.id,status).then(res=>{
                        if(res.status == '200'){
                            this.vueMessage('success','操作成功!');
                        }else{
                            this.vueMessage('success','操作失败!');
                        }
                    })
                });

            },
            getDaysBetween(dateString1,dateString2){
                var  startDate = Date.parse(dateString1);
                var  endDate = Date.parse(dateString2);
                var days=(endDate - startDate)/(1*24*60*60*1000);
                // alert(days);
                return  parseInt(days);
            },
            invoiceManage(){
                invoiceManage(this.id).then(res=>{
                })
            },
            addInvoiceManage(){
                // addInvoiceManage({})
            },
            queryTenantDetail(id){
                this.loading = true;
                queryTenantDetail(id).then(res=>{
                    if(res.status==200){
                        this.enterpriseInformation = res.data.data;
                        this.list = [res.data.data];
                        this.page.total = 1;
                        if(this.enterpriseInformation && this.enterpriseInformation.authenticationCommitTime && this.enterpriseInformation.endTime){
                            this.days = this.getDaysBetween(this.enterpriseInformation.authenticationCommitTime,this.enterpriseInformation.endTime);
                        }
                        this.loading = false;
                        this.searchDisable = false;
                        this.handleSelectionClear();
                    }
                })
                this.loading = false;
                this.searchDisable = false;
            },
            reload() {
                this.loading = true;
            },
            handleGetBill(fun, id){
                // fun(id).then(res=>{
                //     console.log(res);
                // })
            },
            init() {
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getObj, this.id);
                }
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
        }
    };
</script>
<style scoped lang="scss">
    .information_div{
        border: 1px solid #dcdcdc;
        padding:15px 15px;
        border-radius: 4px;
        height: auto;
        margin: 0px 0px 20px 0px;
        .information_title{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            margin-bottom: 10px;
            span{
                font-size: 18px;
            }
            .mark{
                width: 4px;
                height: 20px;
                background: #409EFF;
                margin-right: 10px;
            }
        }
        .information_conent{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .information_item{
                width: 50%;
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
                span{
                    font-size: 14px;
                    line-height: 34px;
                }
                .span_one{
                    margin-left: 20px;
                }
            }
        }
    }
    .invoice_records_item{
        width: 80%;
        border: 1px solid #dcdcdc;
        margin: 10px 10%;
        .invoice_records_item_title{
            display: inline-block;
            margin:22px 22px 0px 22px;
            font-weight: bold;
            font-size: 18px;
        }
        .invoice_records_item_div{
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            margin:22px 22px 0px 22px;
            span{
                font-size: 14px;
            }
            span:first-child{
                font-weight: bold;
                font-size: 16px;
            }
        }
        .invoice_records_item_div_left_right{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin:22px 22px 0px 22px;
            padding: 0px 0px 20px 0px;
            .invoice_records_item_div_left{
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
            }
            .invoice_records_item_div_right{
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                .invoice_btn{
                    display: inline-block;
                    font-size: 14px;
                    margin: 0px 0px 0px 40px;
                    border:1px solid #dcdcdc;
                    padding: 4px 10px;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
        .invoice_records_input{
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: #F9F9F9;
            padding: 40px 0px;
            .invoice_input{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                .invoice_price{
                    display: inline-block;
                    font-size: 12px;
                    margin-left: 10px;
                }
                .invoice_input_btn{
                    background:#006EFF;
                    padding:8px 16px;
                    font-size: 14px;
                    color: white;
                    margin-left: 40px;
                    cursor: pointer;
                }
                .invoice_inputs{
                    border: 1px solid #dcdcdc;
                    padding: 0px 10px;
                    height: 34px;
                    width: 280px;
                }
            }
            .invoice_text{
                font-size: 12px;
                text-align: center;
                margin-top: 18px;
            }
        }
    }
    .invoice_records_item_img{
        text-align: center;
        margin-top: 20px;
        margin-bottom: 40px;

    }
</style>
