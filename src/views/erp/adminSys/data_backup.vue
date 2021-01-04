<template>
    <list-container :timeStamp="timeStamp" :page="page" @reload="getList">
        <basic-container>
            <div class="beifen" v-if="isDetailed">
                <div>备份进度:</div>
                <div v-if="backup!=''" style="flex: 1;margin-left: 10px;"><el-progress :percentage="backup!=''?backup:0"  :color="customColorMethod"></el-progress></div>
            </div>
            <div class="avue-crud-container " v-if="isShow">
                <avue-crud ref="crud" class="avue-crud-left-index"
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
                    <template slot-scope="scope" slot="backupName">
                        <div style="color: #409EFF;">
                            数据备份{{scope.row.backupName}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="timeConsuming">
                        <div>
                            {{scope.row.timeConsuming}}分钟
                        </div>
                    </template>
                    <template slot-scope="scope" slot="size">
                        <div>
                            {{scope.row.size}}KB
                        </div>
                    </template>
                    <template slot-scope="scope" slot="indexLength">
                        <div>
                            {{scope.row.indexLength}}KB
                        </div>
                    </template>
                    <template slot-scope="scope" slot="dataLength">
                        <div>
                            {{scope.row.dataLength}}KB
                        </div>
                    </template>
                    <template slot="menuLeft">

                        <el-button type="primary" icon="el-icon-document-copy" plain v-if="!isDetailed" @click="isDetailed=true">数据备份</el-button>
                        <el-button type="primary" icon="el-icon-back" plain v-else="!isDetailed" :disabled="backup == ''?false:backup==0?true:backup<=100?true:false"  @click="isDetailed=false">返回</el-button>
                        <el-button type="primary" icon="el-icon-copy-document" plain v-if="isDetailed" @click="backupsBtn" :disabled="backup == ''?false:backup==0?true:backup<=100?true:false">立即备份</el-button>
                        <div class="avue-crud-diag" v-if="isDetailed">
                            <img style="width: 12px;height: 12px;" src="http://hejigy.com.cn/jingao.png" />
                            <div>&nbsp;备份过程不能中断!</div>
                        </div>
                    </template>
                    <template slot="opt" slot-scope="scope" >
                        <el-link type="primary" :underline="false" target="_blank" :disabled="scope.row.backupStatus != '0'? true: false" :href="'/api/manager/data/download/'+scope.row.tenantId+'/'+scope.row.backupName">下载</el-link>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
    </list-container>
</template>

<script>
    import {page as pages,delObj,updateStatus,backup,queryBackupProgress,selectPage} from '@/api/admin/data_backup';
    export default {
        name: "data_backup",
        props: ['timeStamp'],
        components: {
            'button-bar': () => import('@/components/setting/button_bar')
        },
        data() {
            return {
                clock: null,
                backup:'',
                isDetailed: false,
                isShow: true,
                searchDisable: false,
                page: {
                    pageSizes: [10, 20, 50, 100, 500, 1000],
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                listQuery: {},
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
                    selection: false,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    indexLabel:'序号',
                    index: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: true,//搜索显隐按钮、
                    searchShow: false,//首次加载是否显示搜索
                    searchSpan: 4,
                    showSummary: false,
                    column: []
                },
                billColumn: [
                    {
                        label: "备份名称",
                        prop: "backupName",
                        sortable: true,
                        search: true,
                        align: 'center',
                        minWidth: 100,
                        overHidden:true,
                        slot: true
                    },
                    {
                        label: "状态",
                        prop: "backupStatus",
                        minWidth: 100,
                        overHidden:true,
                        align: 'center',
                        dicData:[
                            {
                                value: '0',
                                label: '备份完成'
                            },
                            {
                                value: '1',
                                label: '备份中'
                            },
                            {
                                value: '2',
                                label: '备份失败'
                            }
                        ]

                    },
                    {
                        label: "执行开始时间",
                        prop: "startTime",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                    },
                    {
                        label: "执行结束时间",
                        prop: "endTime",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                    },
                    {
                        label: "执行耗时",
                        prop: "timeConsuming",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                        slot: true
                    },
                    {
                        label: "文件大小",
                        prop: "size",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                        slot: true
                    },
                    {
                        label:'操作',
                        prop:'opt',
                        width: 120,
                        align:'center',
                        slot:true,
                        fixed: 'right'
                    },
                ],
                detailedColumn: [
                    {
                        label: "表名称",
                        prop: "tableName",
                        sortable: true,
                        search: true,
                        align: 'center',
                        minWidth: 100,
                        overHidden:true,
                    },
                    {
                        label: "记录条数",
                        prop: "tableRows",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                    },
                    {
                        label: "索引大小",
                        prop: "indexLength",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                        slot: true
                    },
                    {
                        label: "数据大小",
                        prop: "dataLength",
                        minWidth: 90,
                        overHidden:true,
                        align: '',
                        slot: true
                    },
                ],
                id: ''
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
            this.id = this.$store.getters.userInfo.id;
            window.clearInterval(this.clock);
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
        watch:{
            isDetailed(){
                window.clearInterval(this.clock);
                this.backup = '';
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.tableOption.column = this.billColumn;
                    }

                    this.defaultSort = {descs: 'create_time'};
                    this.listQuery = {};
                    this.page.currentPage = 1;
                    this.getList(this.page, this.listQuery);
                    this.isShow = true;
                });
            }
        },
        methods: {
            customColorMethod(percentage) {
                if (percentage < 30) {
                    return '#909399';
                } else if (percentage < 70) {
                    return '#e6a23c';
                } else {
                    return '#67c23a';
                }
            },
            backupsBtn(){
                backup().then(res=>{
                    console.log(res.data)
                    if(res.data == 1){
                        this.backup  = 0;
                        this.vueMessage('success','正在备份，请稍等。。');
                        this.clock =setInterval(() => {
                            queryBackupProgress().then(val=>{
                                this.backup = (100/Number(val.data.data.backupTotal)* Number(val.data.data.backupProgress)).toFixed(0);
                                if(Number(this.backup) == 100){
                                    this.vueMessage('success','备份成功!');
                                    this.backup  = '';
                                    window.clearInterval(this.clock);
                                }
                            })
                        },1000)
                    }else if(res.data == 2){
                      this.$notify({
                        title: '失败',
                        message: '当前备份数据正在进行，请稍后',
                        type: 'warning',
                        duration: 2000
                      });
                  }

                })
            },
            handleUpdateStatus(id, status) {
                updateStatus(id, status)
                    .then(response => {
                        if (response.status == 200) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.getList(this.page);
                        } else {
                            this.$notify({
                                title: '失败',
                                message: response.msg,
                                type: 'warning',
                                duration: 2000
                            })
                        }
                    });
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = this.isDetailed? pages:selectPage;
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
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbClick(row) {
                const id = row.id;
            },
        }
    }
</script>
<style lang="scss">
    .avue-crud-left-index{
        .avue-crud__left{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .avue-crud-diag{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                font-size: 12px;
                padding:2px 6px;
                color: #E0A242;
                background:rgba(252,251,226,1);
                border:1px solid rgba(240,227,202,1);
                margin-bottom: 8px;
            }
        }
    }
</style>
<style scoped lang="scss">

.beifen{
    border: 1px solid #EBEEF5;
    font-size: 14px;
    margin: 10px 10px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

}
</style>
