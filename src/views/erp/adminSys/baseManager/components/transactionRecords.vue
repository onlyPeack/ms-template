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
                    <el-select v-model="listQuery.transactionType" placeholder="全部交易类型" @change="getList(page)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-checkbox v-model="listQuery.showZero" style="margin-left: 10px;" @change="getList(page)">不显示0元费用</el-checkbox>
                </div>
            </div>
            <div class="transaction_content">
                <span style="font-weight: bold;">按已选交易类型汇总</span>
                <span style="font-size: 14px;">&nbsp;&nbsp;&nbsp;&nbsp;入账合计{{gather.allEnterBalance}}元</span>
                <span style="font-size: 14px;">&nbsp;&nbsp;&nbsp;&nbsp;出账合计{{gather.allOutBalance}}元</span>
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
    import {transactionRecordsPage,tatisticsTransactionRecords} from '@/api/admin/tenant/index';
    export default {
        name: "transactionRecords",
        props:['id'],
        data() {
            return {
                options: [{
                    value: 1,
                    label: '充值'
                }, {
                    value: 2,
                    label: '退款'
                }, {
                    value: 3,
                    label: '解冻'
                }, {
                    value: 4,
                    label: '资金转入'
                }, {
                    value: 5,
                    label: '垫付'
                }, {
                    value: 6,
                    label: '扣费'
                }, {
                    value: 7,
                    label: '冻结'
                }, {
                    value: 8,
                    label: '资金转出'
                }, {
                    value: 9,
                    label: '垫付回款'
                }, {
                    value: 10,
                    label: '提现'
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
                gather: {
                    allEnterBalance: 0,
                    allOutBalance: 0
                },
                timeType: undefined,
                listQuery: {
                    startTime: undefined,
                    endTime: undefined,
                    showZero: true,
                    transactionType: undefined,
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
                        label: "交易时间",
                        prop: "crtTime",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "交易类型",
                        prop: "transactionType",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "相关描述",
                        prop: "description",
                        minWidth: 180,
                        align: 'center',
                    },
                    {
                        label: "入账(元)",
                        prop: "enterBalance",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        label: "支出(元)",
                        prop: "outBalance",
                        minWidth: 160,
                    },
                    {
                        label: "可用余额(元)",
                        prop: "allBalance",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "现金余额(元)",
                        prop: "balance",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "赠送余额(元)",
                        prop: "freeGoldBalance",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "冻结金额(元)",
                        prop: "frozenBalance",
                        width: 100,
                        align: 'center',
                    },
                    {
                        label: "操作",
                        prop: "crtName",
                        width: 100,
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
                tatisticsTransactionRecords(this.listQuery).then(res=>{
                    if(res.status == 200){
                        this.gather = res.data.data;
                    }
                })
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,tenantId:this.id});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = transactionRecordsPage;
                select(queryObj).then(res => {
                    const data = res.data.data;
                    if(data){
                        for(let i in data.records){
                            for(let j in this.options){
                                if(data.records[i].transactionType == this.options[j].value){

                                    data.records[i].transactionType =  this.options[j].label;
                                    data.records[i].description = this.options[j].label + '-' + data.records[i].systemServiceName;
                                }
                            }
                        }
                    }
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
</style>
