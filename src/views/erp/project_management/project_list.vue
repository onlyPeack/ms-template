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
                    <el-button type="primary" icon="el-icon-plus" class="projectOverViewTopBtn"
                               @click="insertBtn">新建项目
                    </el-button>
                </div>
                <el-row :span="24" class="projectOverViewBottoms" style="margin-top: 20px;">
                    <el-col :span="6">
                        <span class="filter-item-span">项目状态</span>
                        <el-select v-model="listQuerys.projectStatus" class="filter-item" placeholder="项目状态" clearable>
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span class="filter-item-span">项目类型</span>
                        <el-select v-model="listQuerys.projectType"  placeholder="项目类型" clearable>
                            <el-option v-for="item in typeOptions" :key="item.name" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <span class="filter-item-span">是否超期</span>
                        <el-select v-model="listQuerys.overdueTime" placeholder="是否超期" clearable>
                            <el-option v-for="item in overdueOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="getList(page)">搜索</el-button>
                        <el-button @click="rest">重置</el-button>
                    </el-col>
                </el-row>
                <el-row :span="24" class="projectOverViewBottoms"  v-if="isCriteria"  style="padding-top: 20px;border-top: 1px solid #EEEEEE;">
                    <el-col :span="12">
                        <span  class="filter-item-span">负责人</span>
                        <el-input v-model="listQuerys.chargeName" class="filter-item" style="width: 220px;" placeholder="负责人"/>
                    </el-col>
                    <el-col :span="12">
                        <span  class="filter-item-span">项目名称</span>
                        <el-input v-model="listQuerys.projectName" class="filter-item" style="width: 220px;" placeholder="项目名称"/>
                    </el-col>
                </el-row>
                <el-row :span="24" class="projectOverViewBottoms" v-if="isCriteria">
                    <el-col :span="12">
                        <span  class="filter-item-span">计划开始</span>
                        <el-date-picker class="filter-item"
                                v-model="value1"
                                type="daterange" value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="12">
                        <span class="filter-item-span">计划结束</span>
                        <el-date-picker
                                v-model="value2" class="filter-item"
                                type="daterange" value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
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
                           <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;"><img src="http://hejigy.com.cn/xm.png" style="width: 20px;height: 20px;margin-right: 10px;">共{{page.total}}个项目</div>
                            <el-select v-model="listQuerys.selectType" style="margin-right: 10px;" placeholder="选择项目时间范围" @change="getList(page)" clearable>
                                <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="projectOverViewCenterLeftTopConent">
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
                                           :cell-style="handleCellStyle" class="projectList"
                                           @row-click="handleRowClick" style="width: 100%;margin: 0px;"
                                           @row-dblclick="handleRowDbClick">
                                    <template slot="projectName" slot-scope="scope" >
                                        <div class="projectNameItem">
                                            <div class="projectNameItems">
                                                <div style="font-size:16px;color:rgba(51,51,51,1);margin-bottom: 10px;">{{scope.row.projectName}}</div>
                                                <div class="projectNameItemBootom">
                                                    <div  class="projectNameItemBootomLeft">
                                                        <div style="display: flex;flex-direction: row;align-items: center;">
                                                            <img src="http://hejigy.com.cn/gcxm.png" style="width: 7px;height: 7px;margin-right: 8px;"/>
                                                            <span v-for="item in statusOptions" v-if="scope.row.projectStatus == item.value">{{item.label}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                            <span>|&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.overdue == 0 ? '未超期': '已超期'}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                            <span>|&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.projectType}}</span>
                                                        </div>
                                                        <div> <img src="http://hejigy.com.cn/jhgq.png" style="width: 7px;height: 7px;margin-right: 8px;"/>计划工期:&nbsp;&nbsp;{{scope.row.startDate}}~{{scope.row.endDate}}</div>
                                                    </div>
                                                    <div  class="projectNameItemBootomRight">
                                                        <div><img src="http://hejigy.com.cn/zjgx.png" style="width: 7px;height: 7px;margin-right: 8px;"/>最后更新:&nbsp;&nbsp;{{scope.row.updTime}}</div>
                                                        <div><img src="http://hejigy.com.cn/cjsj.png" style="width: 7px;height: 7px;margin-right: 8px;"/>创建时间:&nbsp;&nbsp;{{scope.row.crtTime}}</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </template>
                                    <template slot="updTime" slot-scope="scope" >
                                        <div class="projectNameItem">
                                            <div class="projectNameItems">
                                                <div>时间进度</div>
                                                <div style="margin-top: 6px;" >
                                                    <el-progress v-if="scope.row.dataTime !=undefined"  :percentage="scope.row.dataTime<0?100:parseInt(scope.row.dataTime)"  :color="customColorMethod"></el-progress>
                                                </div>
                                                <div style="margin-top: 6px;">自评进度</div>

                                                <div style="margin-top: 6px;" >
                                                    <el-progress v-if="scope.row.speed > -1" :percentage="scope.row.speed<0?100:scope.row.speed"  :color="customColorMethod"></el-progress>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="chargeName">
                                        <div style="display: flex;flex-direction: row;align-items: center;">
                                            <img src="http://hejigy.com.cn/fzr.png" style="width: 13px;height: 14px;margin-right: 6px;"/>
                                            {{scope.row.chargeName}}
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="opt">
                                        <div style="display: flex;flex-direction: row;align-items: center;">
                                            <a style="color: #3E90FE;margin-right: 14px;cursor: pointer;"
                                               @click="viewItem(scope.row)">查看
                                            </a>
                                        </div>
                                    </template>
                                </avue-crud>
                            </list-container>
                        </div>
                    </div>
                </div>
        </el-row>
        <el-dialog :visible.sync="dialogSelectVisible" v-if="dialogSelectVisible" width="50%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="新建项目" append-to-body class="public-dialog">
            <el-tabs v-model="activeName">

                <el-tab-pane label="基本信息" name="first">
                    <avue-form :option="option" v-model="form" ref="form" @submit="handleSubmit" class="codeItem">
                        <!--<template slot-scope="scope" slot="place">-->
                        <!--<area-cascader type="all" v-model="selected" :level='1' v-if="isSelected"-->
                        <!--:data="$pcaa"></area-cascader>-->
                        <!--</template>-->
                        <template slot-scope="scope" slot="startDate">
                            <el-date-picker
                                    v-model="form.startDate" @change="startBtn"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </template>
                        <template slot-scope="scope" slot="endDate">
                            <el-date-picker
                                    v-model="form.endDate" @change="startBtn"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </template>
                    </avue-form>
                </el-tab-pane>
                <!--<el-tab-pane label="项目预算" name="second">-->
                    <!--<el-form :model="form" label-width="120px">-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="预计收入" prop="income">-->
                                    <!--<el-input v-model="form.income" placeholder="请输入预计收入">-->
                                    <!--</el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="预计工时" prop="taskTime">-->
                                    <!--<el-input v-model="form.taskTime" placeholder="请输入预计工时">-->
                                    <!--</el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="预计工时" prop="payCost">-->
                                    <!--<el-input v-model="form.payCost" placeholder="请输入预算支出">-->
                                    <!--</el-input>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                    <!--</el-form>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="附件资料" name="second">
                    <div style="margin-left: 10px;">
                        <el-upload class="avatar-uploader" action='/api/manager/storage/create' list-type="picture-card"
                                   :show-file-list="false"
                                   accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
                            <img v-if="form.file" :src="form.file"
                                 style="max-width: 148px;max-height:148px;display: block;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <i v-if="form.file" class="el-icon-delete el-icona" @click.stop="deletePreview"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>

            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSelectVisible = false">取消</el-button>
                <el-button @click="formBtn(true)" v-loading="visible" :disabled="visible">保存</el-button>
                <el-button type="primary" @click="formBtn(false)" v-loading="invisible" :disabled="invisible">保存并新增</el-button>
            </div>
        </el-dialog>
        <public-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                         :title="publicTitle" :isSingle="isSingle" :option="options" :typeName="typeName"
                         @handleClose="handleClosePublic"
                         @handleSubmit="handleSubmitPublic"></public-selector>
    </div>
</template>

<script>
    import {list, addObj, groupByType, groupByStatus,pageAll,} from '@/api/erp/project_management/projectOverview';
    import {uploadPath} from '@/api/erp/goods/storage'

    var baseUrl = 'https://cli.avuejs.com/api/area'
    import {customerOption, userOption} from '@/util/table';

    export default {
        name: "project_list",
        props: ['timeStamp'],
        components: {
            'publicSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                visible:false,
                invisible: false,
                value1: [],
                value2: [],
                isCriteria: false,
                statusOptions: [
                    {
                        value: '0',
                        label: '未启动'
                    },
                    {
                        value: '1',
                        label: '进行中'
                    },
                    {
                        value: '2',
                        label: '已暂停'
                    },
                    {
                        value: '3',
                        label: '已完成'
                    }
                ],
                typeOptions: [],
                overdueOptions: [
                    {
                        value: 1,
                        label: '已超期'
                    },
                    {
                        value: 0,
                        label: '未超期'
                    }
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
                isSelected: false,
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                isSingle: true,
                activeName: 'first',
                selected: [],
                form: {},
                options: [],
                option: {
                    menuPosition: 'center',
                    labelWidth: 120,
                    emptyBtn: false,
                    menuBtn: false,
                    column: [
                        {
                            label: "项目名称",
                            prop: "projectName",
                            minWidth: 120,
                            align: 'left',
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入项目名称",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "项目类型",
                            prop: "projectType",
                            minWidth: 120,
                            align: 'left',
                            type: 'select',
                            span: 12,
                            dicMethod: 'get',
                            dicUrl: '/api/manager/project-type/pageAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择项目类型",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "项目阶段",
                            prop: "projectStage",
                            minWidth: 120,
                            align: 'left',
                            type: 'select',
                            span: 12,
                            dicMethod: 'get',
                            dicUrl: '/api/manager/sales-order-stage/pageAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择项目阶段",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "项目负责人",
                            prop: "chargeName",
                            minWidth: 120,
                            align: 'left',
                            span: 12,
                            type: 'search',
                            readonly: true,
                            rules: [{
                                required: true,
                                message: "请选择项目负责人",
                                trigger: "change"
                            }],
                            appendClick: () => {
                                this.isSingle = true;
                                this.publicTitle = '请选择项目负责人';
                                this.typeName = 'userType';
                                this.options = userOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "项目地点",
                            prop: "place",
                            minWidth: 220,
                            span: 24
                        },
                        // {
                        //     label: "项目地点",
                        //     prop: "place",
                        //     minWidth: 220,
                        //     formslot: true,
                        //     rules: [{
                        //         required: true,
                        //         validator: validateRegionCodes,
                        //         trigger: 'blur'
                        //     }],
                        //     span: 24
                        // },
                        {
                            label: "业主单位",
                            prop: "companyName",
                            span: 12,
                            // type: 'search',
                            // readonly: true,
                            // appendClick: () => {
                            //     this.publicTitle = '请选择客户';
                            //     this.typeName = 'customerType';
                            //     this.options = customerOption;
                            //     this.isSingle = true;
                            //     this.publicVisible = true;
                            // },
                            rules: [{
                                required: true,
                                message: "请输入业主单位",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "项目成员",
                            prop: "projectMember",
                            span: 12,
                            type: 'search',
                            readonly: true,
                            rules: [{
                                required: true,
                                message: "请选择项目成员",
                                trigger: "change"
                            }],
                            appendClick: () => {
                                this.isSingle = false;
                                this.publicTitle = '请选择项目成员';
                                this.typeName = 'userType';
                                this.options = userOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "计划开工日期",
                            prop: "startDate",
                            type: "date",
                            span: 12,
                            format: 'yyyy-MM-dd',
                            valueFormat: 'yyyy-MM-dd',
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请选择计划开工日期",
                                trigger: "change"
                            }]

                        },
                        {
                            label: "计划完工日期",
                            prop: "endDate",
                            type: "date",
                            searchLabelWidth: 120,
                            span: 12,
                            format: 'yyyy-MM-dd',
                            valueFormat: 'yyyy-MM-dd',
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请选择计划完工日期",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "计划工期",
                            prop: "workTime",
                            minWidth: 120,
                            align: 'left',
                            span: 24,
                            disabled: true,
                        },
                        {
                            label: '项目描述',
                            prop: 'workText',
                            type: 'textarea',
                            minRows: 4,
                            showWordLimit: true,
                            span: 24,
                        },
                        {
                            label: '备注',
                            prop: 'note',
                            type: 'textarea',
                            minRows: 4,
                            showWordLimit: true,
                            span: 24,
                        },
                    ]
                },
                dialogSelectVisible: false,
                warningIndex: 0,
                topIndex: 0,
                topData: ['所有项目', '我负责的', '我参与的', '按部门查看'],
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
                    border: false,
                    index: false,
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
                        label: "项目名称",
                        prop: "projectName",
                        width:600,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "项目进度",
                        prop: "updTime",
                        minWidth: 220,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "负责人",
                        prop: "chargeName",
                        minWidth: 120,
                        align: 'left',
                        slot: true
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        width: 120,
                        align: 'left',
                        slot: true
                    },
                ],
                typeList: [],
                statusList: []
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
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 140);
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
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 140);
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
            deletePreview() {
                this.form.file = ''
            },
            uploadPicUrl: function (response) {
                this.form.file = ''
                this.vueSet(this.form, 'file', response.data.url);
                this.$forceUpdate();

            },
            insertBtn() {
                this. activeName= 'first';
                this.form = {};
                this.isSelected = true;
                this.dialogSelectVisible = true;
                this.form.chargeId = this.$store.getters.userInfo.id;
                this.form.chargeCode = this.$store.getters.userInfo.no;
                this.form.chargeName = this.$store.getters.userInfo.name;
                this.form.phone = this.$store.getters.userInfo.mobilePhone;
            },
            formBtn(type) {
                let sum = this.getDaysBetween(this.form.startDate, this.form.endDate);
                if (sum < 1) {
                    this.vueMessage('warning', '计划完工日期不能大与计划开工日期!');
                    return
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (type) {
                            this.visible = true;
                        } else {
                            this.invisible = true;
                        }
                        addObj(this.form).then(res => {

                            if (res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.vueSet(this, 'form', {});
                                this.isSelected = false;
                                this.$nextTick(() => {
                                    this.isSelected = true;
                                })
                                if (this.$refs.form) {
                                    this.$refs.form.resetForm();
                                    this.$nextTick(this.$refs.form.clearValidate)
                                }
                                this.form.chargeId = this.$store.getters.userInfo.id;
                                this.form.chargeCode = this.$store.getters.userInfo.no;
                                this.form.chargeName = this.$store.getters.userInfo.name;
                                this.selected = [];
                                if (type) {
                                    this.visible = false;
                                } else {
                                    this.invisible = false;
                                    this.dialogSelectVisible = false;
                                }
                                this.getList(this.page);
                            } else {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
                                });
                            }
                        }).catch(() => {
                            if (type) {
                                this.visible = false;

                            } else {
                                this.invisible = false;
                                this.dialogSelectVisible = false;
                            }
                        })
                    }
                })
            },
            rest(){
              this.listQuerys = {};
              this.value1 = [];
              this.value2 = [];
              this.getList(this.page);
            },
            startBtn() {
                if (this.form.startDate != '' && this.form.startDate != undefined && this.form.endDate != '' && this.form.endDate != undefined) {
                    let sum = this.getDaysBetween(this.form.startDate, this.form.endDate);
                    if (sum < 1) {
                        this.vueMessage('warning', '计划完工日期不能大与计划开工日期!');
                        return
                        this.form.endDate = '';
                    } else {
                        this.form.workTime = sum.toFixed(0);
                    }
                }

            },
            getDaysBetween(dateString1, dateString2) {
                var startDate = Date.parse(dateString1);
                var endDate = Date.parse(dateString2);
                var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
                // alert(days);
                return days;
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        this.form.companyId = list[0].id;
                        this.form.companyCode = list[0].customerCode;
                        this.form.companyName = list[0].customerName;
                    }
                    if (this.typeName == 'userType' && this.isSingle) {
                        this.form.chargeId = list[0].id;
                        this.form.chargeCode = list[0].no;
                        this.form.chargeName = list[0].name;
                        this.form.phone = list[0].mobilePhone;
                    }
                    if (this.typeName == 'userType' && !this.isSingle) {
                        let userDate = [];
                        let userName = [];
                        for (let i in list) {
                            userDate.push({
                                userId: list[i].id,
                                userName: list[i].name,
                                userCode: list[i].no,
                                phone: list[i].mobilePhone,
                            });
                            userName.push(list[i].name);
                        }
                        this.form.manages = userDate;
                        this.form.projectMember = userName.toString();
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleSubmit(form, done) {
                // putObj(this.form.id,this.form).then(res => {
                //     done();
                //     if (res.data && res.data.code == '2000') {
                //         this.vueMessage('success', '编写成功!');
                //         this.dialogSelectVisible = false;
                //     } else {
                //         this.vueMessage('warning', res.data.msg);
                //     }
                //     this.getList(this.page);
                // }).catch(() => {
                //     this.dialogSelectVisible = false;
                // });

                done();
            },
            handleSelectClose() {
                this.dialogSelectVisible = false;
                this.isSelected = false;
            },
            //获取数据
            getList(page, params = {}) {
                pageAll().then(res=>{
                    this.typeOptions = res.data.data;

                let queryObj = Object.assign(params, this.listQuery,this.listQuerys, {page: page.currentPage, limit: page.pageSize,});
                if(this.topIndex < 1){
                    queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,type: 3});
                }else{
                    queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,type: this.topIndex * 1 - 1});
                }
                queryObj = JSON.parse(JSON.stringify(queryObj));
                if(this.value1 && this.value1.length>0){
                    queryObj.sDate = this.value1[0] + ' 00:00:00';
                    queryObj.eDate = this.value1[1] + ' 23:59:59';
                }
                if(this.value2 && this.value2.length>0){
                    queryObj.sTime = this.value2[0] + ' 00:00:00';
                    queryObj.eTime = this.value2[1] + ' 23:59:59';
                }
                let select;
                select = list;
                select(queryObj).then(res => {
                    if(this.topIndex == 3){
                        if(res.data.code == '401'){
                            this.vueMessage('warning',res.data.msg);
                            this.activeName = "first"
                            this.topIndex = 0
                            return
                        }
                    }
                    const data = res.data.data;
                    this.page.total = data.total;
                    let now = new Date();
                    let year = now.getFullYear();
                    let month = now.getMonth() + 1;
                    let day = now.getDate();
                    for(let i in data.records){
                        if(data.records[i].mainDto){
                            data.records[i].projectName = data.records[i].mainDto.projectName;
                            data.records[i].endDate = data.records[i].mainDto.endDate;
                            data.records[i].startDate = data.records[i].mainDto.startDate;
                            data.records[i].speed = data.records[i].mainDto.speed;
                            data.records[i].projectType = data.records[i].mainDto.projectType;
                            data.records[i].chargeName = data.records[i].mainDto.chargeName;
                            data.records[i].overdue = data.records[i].mainDto.overdue;
                            data.records[i].projectStatus = data.records[i].mainDto.projectStatus;
                            data.records[i].workTime = data.records[i].mainDto.workTime;
                        }
                        let sumOne = this.getDaysBetween(data.records[i].startDate,year+'-'+month+'-'+day);
                        let sumTwo = ((sumOne * 1)/(data.records[i].workTime * 1))*100;
                        data.records[i].dataTime = Number((sumTwo).toFixed(0)) < 0 ? 0 : Number((sumTwo).toFixed(0));
                    }
                    console.log(data.records)
                    this.list = data.records;
                    this.loading = false;
                    this.handleSelectionClear();
                }).catch(() => {
                    this.loading = false;
                });
                })
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
            handleCellStyle({row,column,rowIndex}) {
                if(rowIndex%2===0){
                    return {
                        backgroundColor:'#F9F9F9',
                        color:'#666666'
                    }
                }
            },
            viewItem(row){
                this.$router.push({
                    path: '/project_view',
                    name: '项目详情',
                    query: {
                        id: this.topIndex == 2 ? row.projectBillId : row.id,
                        type: 'add' + new Date().getTime(),
                        timeStamp: new Date().getTime()
                    },
                    meta: {
                        i18n: 'project_view'
                    }
                });
            },
            //行点击事件
            handleRowClick(row, event, column) {
                this.controlButtonShow(row, this);
                this.$router.push({
                    path: '/project_view',
                    name: '项目详情',
                    query: {
                        id: this.topIndex == 2 ? row.projectBillId : row.id,
                        type: 'add'+new Date().getTime(),
                        timeStamp: new Date().getTime()
                    },
                    meta: {
                        i18n: 'project_view'
                    }
                });
                this.$refs.crud.toggleSelection([row]);

            },
            //双击查看
            handleRowDbClick(row) {
                // this.$router.push({
                //     path: '/project_view',
                //     name: '项目详情',
                //     query: {
                //         id: this.topIndex == 2 ? row.projectBillId : row.id,
                //         type: 'add'+new Date().getTime(),
                //         timeStamp: new Date().getTime()
                //     },
                //     meta: {
                //         i18n: 'project_view'
                //     }
                // });
            },
        }
    }
</script>
<style lang="scss">
    .projectList{
        .el-table{
            .el-table__header-wrapper{
                .el-table__header{
                    border-top:1px solid #EBECF5;
                    .has-gutter{
                        tr{
                             th{
                                 height:42px;
                                 background:#F5F9FF;
                                 border-bottom:1px solid #EBECF5;
                             }
                        }
                    }
                }
            }
            .el-table__body-wrapper{
                .el-table__row{
                    td{
                        padding: 0px !important;
                        .cell{
                            margin-left: 30px !important;
                        }
                    }
                }
            }
        }
    }
</style>
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
</style>