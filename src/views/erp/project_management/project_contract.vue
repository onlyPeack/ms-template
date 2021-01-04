<template>
    <div class="projectOverView">
        <el-row :span="24">
            <div class="projectOverViewTop">
                <!--<div class="projectOverViewTops">-->
                    <!--<div class="projectOverViewConent">-->
                        <!--<div class="projectOverViewConentItem" v-for="(item,index) in topData" @click="topIndex = index">-->
                            <!--<span :class="topIndex == index ? 'selectBtn' : ''">{{item}}</span>-->
                            <!--<div class="projectOverViewConentItemBottom" v-if="topIndex == index"></div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
                <el-row :span="24" class="projectOverViewBottoms" style="margin-top: 20px;">
                    <el-col :span="8">
                        <span class="filter-item-span">创建时间</span>
                        <el-date-picker value-format="yyyy-MM-dd"
                                v-model="value1"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <span  class="filter-item-span" style="margin-left: 10px;">业务员</span>
                        <el-input v-model="listQuerys.salesName" class="filter-item" style="width: 220px;" placeholder="请输入业务员"/>
                    </el-col>
                    <el-col :span="6">
                        <span  class="filter-item-span">合同名称</span>
                        <el-input v-model="listQuerys.contractName" class="filter-item" style="width: 220px;" placeholder="合同名称"/>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="getList(page)">搜索</el-button>
                        <el-button  @click="rest">重置</el-button>
                    </el-col>
                </el-row>
                <!--<el-row :span="24" class="projectOverViewBottoms"  v-if="isCriteria"  style="padding-top: 20px;border-top: 1px solid #EEEEEE;">-->

                <!--</el-row>-->
                <!--<el-row :span="24" class="projectOverViewBottoms" style="justify-content: center;">-->
                    <!--<div v-if="!isCriteria" @click="isCriteria = true" style="cursor:pointer;margin-bottom:6px;display: flex;flex-direction: row;align-items: center;color: #9A9A9A !important;font-size: 12px;background:rgba(249,249,249,1);padding: 3px 6px;">-->
                        <!--<i class="el-icon-arrow-down" style="margin-right: 6px">-->
                        <!--</i>更多条件-->
                    <!--</div>-->
                    <!--<div v-else @click="isCriteria = false"  style="cursor:pointer;margin-bottom:6px;display: flex;flex-direction: row;align-items: center;color: #9A9A9A !important;font-size: 12px;background:rgba(249,249,249,1);padding: 3px 6px;">-->
                        <!--<i class="el-icon-arrow-up" style="margin-right: 6px">-->
                        <!--</i>收起-->
                    <!--</div>-->
                <!--</el-row>-->
            </div>
        </el-row>
        <el-row :span="24" class="projectOverViewCenter">
            <div class="projectOverViewCenterLeft">
                <div class="projectOverViewCenterLeftTop">
                    <div class="projectOverViewCenterLeftTopTitle">
                        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;"><img src="http://hejigy.com.cn/xm.png" style="width: 20px;height: 20px;margin-right: 10px;">共{{page.total}}个合同</div>
                        <el-select v-model="listQuerys.selectType" style="margin-right: 10px;" placeholder="选择项目时间范围" clearable>
                            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="projectOverViewCenterLeftTopConent" style="border-top: 1px solid #EBEEF5;padding-top: 14px;">
                        <list-container :timeStamp="timeStamp" :page="page" @reload="getList" style="width: 100%;">
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
                                       @row-click="handleRowClick" style="width: 96%;margin: 0% 2%;"
                                       @row-dblclick="handleRowDbClick">
                                <template slot-scope="scope" slot="auditStatus">
                                    <div style="display: flex;flex-direction: row;align-items: center;">
                                        <img v-if="scope.row.auditStatus == '1'" src="http://hejigy.com.cn/tg.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                        <img v-if="scope.row.auditStatus == '0'" src="http://hejigy.com.cn/sp1.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                        <img v-if="scope.row.auditStatus == '2'" src="http://hejigy.com.cn/zf.png" style="width: 10px;height: 10px;margin-right: 6px;"/>
                                        {{scope.row.auditStatus == '0' ? '待审批' :scope.row.auditStatus == '1' ? '已审批': '已驳回'}}
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="opt">
                                    <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                                        <a style="color: #3E90FE;margin-right: 14px;cursor: pointer;"
                                           @click="selectBtn(scope.row)">查看
                                        </a>
                                        <!--<router-link :to="{path:'/print/project_contract_print',query:{id:scope.row.id}}">-->
                                        <a @click="daYiBtn(scope.row.id)" style="color: #3E90FE;margin-right: 14px;cursor: pointer;">打印</a>
                                        <!--</router-link>-->
                                    </div>
                                </template>
                            </avue-crud>
                        </list-container>
                    </div>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script>
    import {selectPage as  list, groupByType, groupByStatus,pageAll,auditUpdate,getDefault} from '@/api/erp/project_management/projectOverview';
    import {uploadPath} from '@/api/erp/goods/storage'
    var baseUrl = 'https://cli.avuejs.com/api/area'
    import {customerOption, userOption} from '@/util/table';

    export default {
        name: "project_audit",
        props: ['timeStamp'],
        components: {
            'publicSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                isCriteria: false,
                value1: [],
                statusOptions: [
                    {
                        value: '0',
                        label: '待审批'
                    },
                    {
                        value: '1',
                        label: '已审批'
                    },
                    {
                        value: '2',
                        label: '已驳回'
                    },
                ],
                dateOptions: [
                    {
                        value: 0,
                        label: '项目创建时间倒序'
                    },
                    {
                        value:1,
                        label: '项目更新时间倒序'
                    },
                    {
                        value:2,
                        label: '计划开始时间倒序'
                    },
                    {
                        value:3,
                        label: '计划结束时间倒序'
                    }
                ],
                listQuerys: {},
                selectType: 0,
                uploadPath,
                activeName: 'first',
                warningIndex: 0,
                topIndex: 0,
                topData: ['所有合同', '我负责的', '我参与的','按部门查看'],
                warningData: [
                    {
                        imgUrl: '',
                        title: '1',
                        content: '工期超时'
                    },
                    {
                        imgUrl: '',
                        title: '22',
                        content: '即将到期项目'
                    },
                    {
                        imgUrl: '',
                        title: '22',
                        content: '预算超支'
                    },
                    {
                        imgUrl: '',
                        title: '23',
                        content: '即将超支项目'
                    },
                    {
                        imgUrl: '',
                        title: '23',
                        content: '久未更新'
                    }
                ],
                isShow: true,
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
                    index: true,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchBtn: false,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "retailPrice",
                            type: "sum"
                        }, {
                            name: "costPrice",
                            type: "sum"
                        }
                    ],
                    column: []
                },
                billColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    },
                    {
                        label: "合同编号",
                        prop: "billNo",
                        width:140,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "合同名称",
                        prop: "contractName",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "所属项目",
                        prop: "projectName",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "业务员",
                        prop: "salesName",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "签约日期",
                        prop: "signDate",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "生效日期",
                        prop: "takeDate",
                        minWidth: 120,
                        align: 'left',
                        overHidden:true,
                    },
                    {
                        label: "到期日期",
                        prop: "overDate",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        width: 130,
                        align: 'left',
                        overHidden:true,
                        slot: true,
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
            topIndex() {
                this.getList(this.page);
            }
        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 240);
            };
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 240);
        },
        methods: {
            daYiBtn(id){
                getDefault(2).then(res=>{
                    if(res.data.code == '401'){
                        this.vueMessage('warning',res.data.msg);
                    }else{
                        let routeData = this.$router.resolve({path:'/print/project_contract_print',query:{id:id}});
                        window.open(routeData.href, '_blank');
                        // this.$router.push({path:'/print/project_contract_print',query:{id:id}})
                    }
                })
            },
            selectBtn(row){
                this.$router.push({
                    path: '/project_view_add',
                    name: '项目合同制单',
                    query: {
                        id: row.id,
                        type: 'view',
                    },
                    meta: {
                        i18n: 'sales_price_form'
                    }
                });
            },
            rest(){
                this.listQuerys = {};
                this.value1 = [];
                this.getList(this.page);
            },
            viewItem(row){
                // this.$router.push({
                //     path: '/project_view_add',
                //     name: '项目合同制单',
                //     query: {
                //         id: row.id,
                //         type: 'view',
                //     },
                //     meta: {
                //         i18n: 'project_view'
                //     }
                // });
            },
            //获取数据
            getList(page, params = {}) {
                // this.loading = true;
                let queryObj = Object.assign(params, this.listQuery,this.listQuerys, {page: page.currentPage, limit: page.pageSize,descType: this.selectType,type: this.topIndex>0?this.topIndex:''});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select;
                select = list;
                if(this.value1 && this.value1.length>0){
                    queryObj.startBillDate = this.value1[0] + ' 00:00:00';
                    queryObj.endBillDate = this.value1[1] + ' 23:59:59';
                }
                select(queryObj).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.list = data.records;
                    this.loading = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
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
            },
            //双击查看
            handleRowDbClick(row) {
            },
        }
    }
</script>
<style lang="scss" scoped>
    .projectOverView {
        display: flex;
        flex-direction: column;
        padding: 8px 20px;
        .projectOverViewTop {
            background: white;
            display: flex;
            flex-direction: column;
            border-radius: 2px;
            .projectOverViewTops{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                border-bottom: 1px solid #EEEEEE;
                height: 49px;
                align-items: center;
                .projectOverViewConent {
                    display: flex;
                    flex-direction: row;
                    .projectOverViewConentItem {
                        position: relative;
                        line-height: 49px;
                        font-size: 15px;
                        margin-left: 40px;
                        span {
                            cursor: pointer;
                            font-size: 14px;
                        }
                        .projectOverViewConentItemBottom {
                            position: absolute;
                            right: 0px;
                            bottom: -2px;
                            height: 2px;
                            width: 100%;
                            background: #409EFF;
                        }
                    }
                }
                .projectOverViewTopBtn {
                    display: inline-block;
                    height: 30px;
                    margin-right: 20px;
                }
            }
            .projectOverViewBottoms{
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0px 20px 10px 20px;
                font-size: 14px;
                .el-col{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .filter-item-span{
                        width: 80px;
                    }
                }
                .filter-item{
                    margin-right: 10px;
                }
            }
        }

        .projectOverViewCenter {
            background: white;
            margin-top: 12px;
            border-radius: 2px;
            .projectOverViewCenterLeft {
                display: flex;
                flex-direction: column;
                margin: 0;
                .projectOverViewCenterLeftTop {
                    display: flex;
                    flex-direction: column;
                    .projectOverViewCenterLeftTopTitle {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        line-height: 50px;
                        padding-left: 30px;
                        cursor: pointer;
                    }
                }
                .projectOverViewCenterLeftTopContent {
                    padding: 20px 50px;
                    display: flex;
                    flex-direction: column;
                    .projectOverViewCenterLeftTopContentItem {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        line-height: 30px;
                        font-size: 12px;
                        .projectOverViewCenterLeftTopContentItemLeft {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            .typeColor0{
                                background: #F79683;
                                width: 15px;
                                height: 15px;
                            }
                            .typeColor1{
                                background: #FBC07C;
                                width: 15px;
                                height: 15px;
                            }
                            .typeColor2{
                                background: #F5B6C9;
                                width: 15px;
                                height: 15px;
                            }
                            .typeColor3{
                                background: #D8E385;
                                width: 15px;
                                height: 15px;
                            }
                            .typeColor4{
                                background: #99E3EC;
                                width: 15px;
                                height: 15px;
                            }
                            .typeColor5{
                                background: #8CDEC8;
                                width: 15px;
                                height: 15px;
                            }
                            .typeColor5{
                                background: #F87893;
                                width: 15px;
                                height: 15px;
                            }
                        }
                    }
                }
                .projectOverViewCenterLeftTopConent {
                    display: flex;
                    flex-direction: row;
                    .projectOverViewCenterLeftTopConentItem {
                        width: 160px;
                        height: 85px;
                        border: 1px solid #dfdfdf;
                        border-radius: 2px;
                        padding: 10px 15px;
                        margin-right: 20px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        div:last-child {
                            display: flex;
                            flex-direction: column;
                            h3 {
                                margin-top: 0px;
                                margin-bottom: 10px;
                            }
                            span {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
        .projectNameItem{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            text-align: left;
            padding-top: 27px;
            .projectNameItems{
                border-right:1px solid rgba(232,232,232,1);
                height: 120px;
            }
            div{
                cursor: pointer;
            }
            .projectNameItemBootom{
                display: flex;
                flex-direction: row;
                justify-content: center;
                padding:0px 20px;
                .projectNameItemBootomLeft,.projectNameItemBootomRight{
                    display: flex;
                    flex-direction: column;
                }
                .projectNameItemBootomLeft{
                    margin-right: 30px;
                    border-right: 1px solid #E8E8E8;
                    padding-right: 30px;
                }
            }
        }
    }
    .selectBtn{
        color: #409EFF !important;
    }
    .selfEvaluation {
        display: flex;
        flex-direction: column;
        .selfEvaluationItem {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            label {
                font-size: 14px;
                display: inline-block;
                width: 80px;
            }
            .selfEvaluationItemRight {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                margin-top: -10px;
                flex: 1;
            }
        }
    }
</style>