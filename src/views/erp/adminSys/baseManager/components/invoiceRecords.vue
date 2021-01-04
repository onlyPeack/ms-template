<template>
    <div>
        <basic-container>
            <div class="transaction_head">
                <span :class="timeType == 1?'transaction_btns':'transaction_btn'" @click="timeType = 1">本月</span>
                <span :class="timeType == 2?'transaction_btns':'transaction_btn'"  @click="timeType = 2">上月</span>
                <div class="block">
                    <el-date-picker
                            v-model="value2"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" class="transaction_time"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            @change="pickerBtn"
                            align="right" style="height: 33px;border-radius: 0px;">
                    </el-date-picker>
                </div>
                <div class="typeOfTransaction">
                    <el-select v-model="listQuery.invoiceType" placeholder="全部发票类型" @change="getList(page)">
                        <el-option
                                v-for="item in invoiceOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="typeOfTransaction">
                    <el-select v-model="listQuery.transactionType" placeholder="全部状态" @change="getList(page)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="invoice_type_input">
                    <input type="text" placeholder="发票号码/申请单位/收件人" v-model="listQuery.searchStr"/>
                    <i class="el-icon-search" style="line-height: 31px;margin-left: 20px;" @click="getList(page)"></i>
                </div>
            </div>
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
                           @sort-change="handleSortChange"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick">
                </avue-crud>
            </div>
        </basic-container>
    </div>
</template>

<script>
    import {selectPage} from '@/api/admin/tenant/index';
    export default {
        name: "invoiceRecords",
        props:['id'],
        data() {
            return {
                invoiceOptions:[
                    {
                        value: 0,
                        label: '企业增值税普通发票'
                    },
                    {
                        value: 1,
                        label: '企业增值税专用发票'
                    },
                    {
                        value: 2,
                        label: '个人增值税普通发票'
                    },
                    {
                        value: 3,
                        label: '组织增值税普通发票'
                    }
                ],
                options: [{
                    value: 0,
                    label: '待处理'
                }, {
                    value: 1,
                    label: '财务处理开票'
                }, {
                    value: 2,
                    label: '已处理'
                }, {
                    value: 3,
                    label: '已撤销'
                }],
                value: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value2: '',
                isShow: true,
                isDetailed: false,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                timeType: undefined,
                listQuery: {
                    invoiceType: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    searchStr: undefined,
                    invoiceStatus: undefined
                },
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
                tableOption: {
                    height: '150',
                    calcHeight: 150,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: false,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: true,
                    column: []
                },
                billColumn: [
                    {
                        label: "发票号码",
                        prop: "billNo",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "申请时间",
                        prop: "crtTime",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "申请单位",
                        prop: "invoiceTitle",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "发票类型",
                        prop: "invoiceType",
                        minWidth: 100,
                        align: 'center',
                        dicData: this.invoiceOptions,
                    },
                    {
                        label: "开票金额",
                        prop: "invoiceAmount",
                        minWidth: 160,
                    },
                    {
                        label: "收件人",
                        prop: "recipients",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "联系方式",
                        prop: "phone",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "收件地址",
                        prop: "address",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "状态",
                        prop: "invoiceStatus",
                        width: 100,
                        align: 'center',
                        type: 'select',
                        dicData: [
                            {
                                value: 0,
                                label: '待处理'
                            },
                            {
                                value: 1,
                                label: '财务处理开票'
                            },
                            {
                                value: 2,
                                label: '已处理'
                            },
                            {
                                value: 3,
                                label: '已撤销'
                            }
                        ],
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
        watch: {
            timeType(val) {
                if(val == 1){
                    var nowDate = new Date();
                    var cloneNowDate = new Date();
                    var fullYear = nowDate.getFullYear();
                    var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
                    var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
                    function getFullDate(targetDate) {
                        var D, y, m, d;
                        if (targetDate) {
                            D = new Date(targetDate);
                            y = D.getFullYear();
                            m = D.getMonth() + 1;
                            d = D.getDate();
                        } else {
                            y = fullYear;
                            m = month;
                            d = date;
                        }
                        m = m > 9 ? m : '0' + m;
                        d = d > 9 ? d : '0' + d;
                        return y + '-' + m + '-' + d;
                    };
                    var endDate = getFullDate(cloneNowDate.setDate(endOfMonth));//当月最后一天
                    var starDate = getFullDate(cloneNowDate.setDate(1));//当月第一天
                    this.listQuery.endTime = endDate +" 23:59:59";
                    this.listQuery.startTime = starDate + " 00:00:00";
                    this.value2 = [this.listQuery.startTime, this.listQuery.endTime]
                }else{
                    this.lastMonth();
                    this.value2 = [this.listQuery.startTime, this.listQuery.endTime]
                }
                this.getList(this.page);
            },
        },
        created() {
            const _this = this;
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
        },
        methods: {
            lastMonth(){
                this.listQuery.startTime = this.getLastMonth();
                this.listQuery.endTime = this.getLastMonthAndDay();
            },
            getLastMonth(){//获取上个月日期
                var date = new Date;
                var year = date.getFullYear();
                var month = date.getMonth();
                if(month == 0){
                    year = year -1;
                    month = 12;
                }
                return year+"-"+month+"-"+'01'+" 00:00:00";
            },
            getLastMonthAndDay(){
                var nowDate = new Date();
                var year = nowDate.getFullYear();
                var month = nowDate.getMonth();
                if(month == 0){
                    month = 12;
                    year = year - 1;
                }
                var lastDay = new Date(year,month,0);
                var yyyyMMdd = year+"-"+month+"-"+lastDay.getDate()+" 23:59:59";
                return yyyyMMdd
            },
            pickerBtn(val){
                if(val.length > 0){
                    this.listQuery.startTime = val[0];
                    this.listQuery.endTime = val[1];
                }else{
                    this.listQuery.startTime = undefined;
                    this.listQuery.endTime = undefined;
                }
                this.getList(this.page);
            },
            handleCommand(command) {
                this.$message('click on item ' + command);
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,tenantId:this.id});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = selectPage;
                select(queryObj).then(res => {
                   const data = res.data.data;

                    this.page.total = data.page.total;
                    this.list = data.page.records;
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
    }
</script>

<style lang="scss">
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .transaction_time{
        .el-input__icon{
            line-height: 26px;
        }
    }
    .typeOfTransaction{
        margin-left: 10px;
        .el-input--mini,.el-input--mini .el-input__inner{
            border-radius: 0px;
            height: 33px;
        }
    }
    .transaction_head{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 0px 0px 20px 0px;
        .transaction_btn{
            display: inline-block;
            font-size: 14px;
            padding:6px 14px;
            border:1px solid #DDDDDD;
            color: #333333;
            cursor: pointer;
        }
        .transaction_btns{
            display: inline-block;
            font-size: 14px;
            padding:6px 14px;
            border:1px solid #006EFF;
            color: #006EFF;
            cursor: pointer;
        }
    }
    .transaction_content{
        background-color: #ecf5ff;
        border-color: #d9ecff;
        padding:20px 20px;
        height: auto;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .invoice_type_input{
        height: 31px;
        border: 1px solid #DCDFE6;
        margin-left: 10px;
        padding: 0px 10px;
        display: flex;
        flex-direction: row;
        input{
            background: none;
            border: none;
            line-height: 31px;
            font-size: 12px;
        }
    }
</style>
