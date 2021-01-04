<template>
    <div class="projectOverView">
        <el-row :span="24">
            <div class="projectOverViewTop">
                <div class="projectOverViewTops">
                    <div class="projectOverViewConent">
                        <div class="projectOverViewConentItem" v-for="(item,index) in topData" @click="topIndex = index">
                            <span :class="topIndex == index ? 'selectBtn' : ''">{{item}}</span>
                            <div class="projectOverViewConentItemBottom" v-if="topIndex == index"></div>
                        </div>
                    </div>
                </div>
                <el-row :span="24" class="projectOverViewBottoms" style="margin-top: 20px;">
                    <el-col :span="8">
                        <span class="filter-item-span">审批状态</span>
                        <el-select v-model="listQuerys.auditStatus" class="filter-item" placeholder="审批状态" clearable>
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        <span class="filter-item-span">创建时间</span>
                        <el-date-picker
                                v-model="value1" value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="getList(page)">搜索</el-button>
                        <el-button  @click="rest">重置</el-button>
                    </el-col>
                </el-row>
                <el-row :span="24" class="projectOverViewBottoms"  v-if="isCriteria"  style="padding-top: 20px;border-top: 1px solid #EEEEEE;">
                    <el-col :span="8">
                        <span  class="filter-item-span">申请人</span>
                        <el-input v-model="listQuerys.operatorName" class="filter-item" style="width: 220px;" placeholder="申请人"/>
                    </el-col>
                    <el-col :span="8">
                        <span  class="filter-item-span">项目名称</span>
                        <el-input v-model="listQuerys.projectName" class="filter-item" style="width: 220px;" placeholder="项目名称"/>
                    </el-col>
                    <el-col :span="8">
                        <span style="margin-right: 35px;">审批类型</span>
                        <el-select v-model="listQuerys.auditType" class="filter-item" placeholder="审批类型" clearable>
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :span="24" class="projectOverViewBottoms" style="justify-content: center;">
                    <div v-if="!isCriteria" @click="isCriteria = true" style="cursor:pointer;margin-bottom:6px;display: flex;flex-direction: row;align-items: center;color: #9A9A9A !important;font-size: 12px;background:rgba(249,249,249,1);padding: 3px 6px;">
                        <i class="el-icon-arrow-down" style="margin-right: 6px">
                        </i>更多条件
                    </div>
                    <div v-else @click="isCriteria = false"  style="cursor:pointer;margin-bottom:6px;display: flex;flex-direction: row;align-items: center;color: #9A9A9A !important;font-size: 12px;background:rgba(249,249,249,1);padding: 3px 6px;">
                        <i class="el-icon-arrow-up" style="margin-right: 6px">
                        </i>收起
                    </div>
                </el-row>
            </div>
        </el-row>
        <el-row :span="24" class="projectOverViewCenter">
            <div class="projectOverViewCenterLeft">
                <div class="projectOverViewCenterLeftTop">
                    <div class="projectOverViewCenterLeftTopTitle">
                        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;"><img src="http://hejigy.com.cn/xm.png" style="width: 20px;height: 20px;margin-right: 10px;">共{{page.total}}个审批</div>
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
                                        <a v-if="scope.row.auditStatus == '0' && scope.row.chargeId == userId" style="color: #3E90FE;margin-right: 14px;cursor: pointer;" @click="toBtn(scope.row)">通过</a>
                                        <a  v-if="scope.row.auditStatus == '0' && scope.row.chargeId == userId" style="color: #FF5B52;cursor: pointer;" @click="rejectBtn(scope.row)">驳回</a>
                                    </div>
                                </template>
                            </avue-crud>
                        </list-container>
                    </div>
                </div>
            </div>
        </el-row>
        <el-dialog :visible.sync="rejectVisible" v-if="rejectVisible" width="30%"
                   @close="handleRejectClose"
                   :close-on-click-modal="false"
                   :before-close="handleRejectClose" title="驳回理由" append-to-body class="public-dialog insertBudgetDialog">
            <div class="selfEvaluation">
                <div class="selfEvaluationItem">
                    <label>驳回原因</label>
                    <div class="selfEvaluationItemRight ">
                        <el-input style="width: 100%;margin-top: 10px;"
                                  type="textarea"
                                  :rows="2"
                                  placeholder="请输入内容"
                                  v-model="textarea">
                        </el-input>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rejectVisible = false">取消</el-button>
                <el-button type="primary" v-loading="visible" @click="rejectsBtn(2)" :disabled="visible">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="selectVisible" v-if="selectVisible" width="30%"
                   @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="查看审批" append-to-body class="public-dialog insertBudgetDialog">
            <div class="secondChanges" v-if="selectedRows[0].auditType == '5'">
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">变更项</div>
                    <div class="secondChangeItemRight">变更值</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">项目名称</div>
                    <div class="secondChangeItemRight">{{data.projectName}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">项目阶段</div>
                    <div class="secondChangeItemRight">{{data.projectStage}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">所属部门</div>
                    <div class="secondChangeItemRight">{{data.departName}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">计划开始</div>
                    <div class="secondChangeItemRight">{{data.startDate}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">计划结束</div>
                    <div class="secondChangeItemRight">{{data.endDate}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">计划工期</div>
                    <div class="secondChangeItemRight">{{data.workTime}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">项目负责人</div>
                    <div class="secondChangeItemRight">{{data.chargeName}}</div>
                </div>
                <div class="secondChangeItem">
                    <div class="secondChangeItemLeft one">项目说明</div>
                    <div class="secondChangeItemRight">{{data.workText}}</div>
                </div>

            </div>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '3'" style="margin-top: -15px;">
                    <el-col :span="25">
                        <span>申请人:&nbsp;&nbsp;</span>
                        <span>{{data.applyName}}</span>
                    </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '3'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>申请时间:&nbsp;&nbsp;</span>
                    <span>{{data.crtTime}}</span>
                </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '3'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>操作类型:&nbsp;&nbsp;</span>
                    <span>{{data.text }}</span>
                </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '4'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>申请日期:&nbsp;&nbsp;</span>
                    <span>{{data.crtTime}}</span>
                </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '4'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>申请人:&nbsp;&nbsp;</span>
                    <span>{{data.applyName}}</span>
                </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '4'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>支出类型:&nbsp;&nbsp;</span>
                    <span>{{data.payType}}</span>
                </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '4'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>支出金额:&nbsp;&nbsp;</span>
                    <span>{{data.payAmount}}</span>
                </el-col>
            </el-row>
            <el-row :span="24"  v-if="selectedRows[0].auditType == '4'" style="margin-top: -15px;">
                <el-col :span="24">
                    <span>支出原因:&nbsp;&nbsp;</span>
                    <span>{{data.applyText}}</span>
                </el-col>
            </el-row>
            <el-input v-if="selectedRows[0].auditStatus == '0'" style="width: 100%;margin-top: 10px;"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="textarea">
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectVisible = false">取消</el-button>
                <el-button v-if="selectedRows[0].auditStatus == '0' && selectedRows.length>0 && selectedRows[0].chargeId == userId" type="warning" :disabled="isVisible" v-loading="isVisible" @click="rejectsBtn(1)">驳回</el-button>
                <el-button v-if="selectedRows[0].auditStatus == '0' && selectedRows.length>0 && selectedRows[0].chargeId == userId" type="primary" :disabled="visible" v-loading="visible" @click="rejectsBtn(0)">同意</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {paySelect,alterSelect,auditList as  list, groupByType, groupByStatus,pageAll,auditUpdate,auditSelect,statusSelect} from '@/api/erp/project_management/projectOverview';
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
                isVisible: false,
                selectVisible: false,
                visible: false,
                rejectVisible: false,
                textarea: undefined,
                typeOptions: [
                    {
                        value: '3',
                        label: '项目启停'
                    },
                    {
                        value: '4',
                        label: '项目支出'
                    },
                    {
                        value: '5',
                        label: '项目变更'
                    },
                ],
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
                topData: ['所有项目', '我创建的', '我审批的'],
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
                    selectionWidth: 60,
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
                        label: "申请人",
                        prop: "operatorName",
                        width:120,
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
                        label: "审批类型",
                        prop: "auditType",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: '3',
                                label: '项目启停'
                            },
                            {
                                value: '4',
                                label: '项目支出'
                            },
                            {
                                value: '5',
                                label: '项目变更'
                            },
                        ]
                    },
                    {
                        label: "创建时间",
                        prop: "crtTime",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                    },
                    {
                        label: "状态",
                        prop: "auditStatus",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        slot: true,
                    },

                    {
                        label: "操作",
                        prop: "opt",
                        width: 150,
                        align: 'left',
                        slot: true,
                    },
                ],
                typeList: [],
                data:{},
                statusList: [],
                userId: '',
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
           this.userId = this.$store.getters.userInfo.id;
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 240);
            };
            this.tableOption.column = this.billColumn;
            groupByType().then(res => {
                this.typeList = res.data.data
            })
            groupByStatus().then(res => {
                this.statusList = res.data.data
            })
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 240);
        },
        methods: {
            selectBtn(row){
                let select = row.auditType == 5 ? alterSelect : row.auditType == 4 ? paySelect : statusSelect;
                select(row.billId).then(res=>{
                    this.data = res.data.data;
                    if (res.data.code == '2000') {
                            this.selectedRows= [row];
                            this.selectVisible = true;
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                })

            },
            handleSelectClose(){
              this.selectVisible = false;
            },
            toBtn(row){
                this.selectedRows = [row];
                auditUpdate(this.selectedRows[0].id,0,'').then(res=>{
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.textarea = undefined;
                        this.getList(this.page);

                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                })
            },
            rejectsBtn(type){
                if(type == 2){
                    this.isVisible = true;
                }else{
                    this.visible = true;
                }
                auditUpdate(this.selectedRows[0].id,type,this.textarea).then(res=>{
                    if (res.data.code == '2000') {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.rejectVisible = false;
                        this.selectVisible = false;
                        this.textarea = undefined;
                        this.getList(this.page);

                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.msg
                        });
                    }
                    this.visible = false;
                    this.isVisible = false;
                }).catch(()=>{
                    this.visible = false;
                    this.isVisible = false;
                })
            },
            handleRejectClose(){
              this.rejectVisible = false;
            },
            rejectBtn(row){
                this.selectedRows = [row];
                console.log(this.selectedRows)
              this.rejectVisible = true;
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
                    queryObj.startTime = this.value1[0] + ' 00:00:00';
                    queryObj.endTime = this.value1[1] + ' 23:59:59';
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
                this.controlButtonShow(row, this);
                this.$refs.crud.toggleSelection([row]);

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
    .secondChanges {
        display: flex;
        flex-direction: column;
        border: 1px solid #eeeeee;
        margin-top: -15px;
        .secondChangeItem {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 12px;
            .secondChangeItemLeft {
                border-right: 1px solid #eeeeee;
                line-height: 36px;
                width: 85px;
                padding-left: 20px;
            }
            .one {
                width: 80px !important;
            }
            .secondChangeItemRight {
                padding-left: 20px;
            }
        }
        .secondChangeItem:not(:first-child) {
            border-top: 1px solid #eeeeee;
        }
    }

</style>