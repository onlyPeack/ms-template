<template>
    <div class="projectOverView">
        <el-row :span="24">
            <div class="projectOverViewTop">
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
        </el-row>
        <el-row :span="24" class="projectOverViewCenter">
            <el-col :span="18">
                <div class="projectOverViewCenterLeft projectOverViewCenterLeftOne">
                    <div class="projectOverViewCenterLeftTop">
                        <div class="projectOverViewCenterLeftTopTitle">
                            <img src="http://hejigy.com.cn/yc.png" class="projectOverViewCenterLeftTopTitleImg"/><span>异常情况及项目预警</span>
                        </div>
                        <el-row :span="24" class="projectOverViewCenterLeftTopConent" style="display: inline-block;" :gutter="25">
                            <el-col :xs="12" :sm="8" :md="8"  :lg="6" :xl="4" v-for="(item,index) in warningData"
                                 @click="warningIndex = index">
                               <div class="projectOverViewCenterLeftTopConentItem">
                                   <div>
                                       <img :src="item.imgUrl" />
                                   </div>
                                   <div>
                                       <span>{{item.title}}</span>
                                       <span>{{item.content}}</span>
                                   </div>
                               </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="projectOverViewCenterLeftTop">
                        <div class="projectOverViewCenterLeftTopTitle">
                            <img src="http://hejigy.com.cn/zj.png" class="projectOverViewCenterLeftTopTitleImg"/>
                            <span @click="selectTypeBtn(0)" :class="selectType == 0?'selectBtn':''">最近新建</span>
                            <span style="display: inline-block;margin: 0px 20px;">|</span>
                            <span @click="selectTypeBtn(3)" :class="selectType == 3?'selectBtn':''">近期完成</span>
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
                                           :cell-style="handleCellStyle"
                                           @row-click="handleRowClick"
                                           @row-dblclick="handleRowDbClick">
                                </avue-crud>
                            </list-container>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="projectOverViewCenterLeft">
                    <div class="projectOverViewCenterLeftTop">
                        <div class="projectOverViewCenterLeftTopTitle">
                            <img src="http://hejigy.com.cn/tj.png" class="projectOverViewCenterLeftTopTitleImg"/><span>项目类型统计</span>
                        </div>
                        <div class="projectOverViewCenterLeftTopContent">
                            <div class="projectOverViewCenterLeftTopContentItem" v-for="(item,index) in typeList">
                                <div class="projectOverViewCenterLeftTopContentItemLeft">
                                    <div :class="'typeColor'+index" style="margin-right: 10px;"></div>
                                    <span>{{item.key}}</span>
                                </div>
                                <span>{{item.value}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="projectOverViewCenterLeftTop">
                        <div class="projectOverViewCenterLeftTopTitle">
                            <img src="http://hejigy.com.cn/xmzts.png" class="projectOverViewCenterLeftTopTitleImg"/> <span>项目状态</span>
                        </div>
                        <div class="projectOverViewCenterLeftTopContent">
                            <div class="projectOverViewCenterLeftTopContentItem" v-for="(item,index) in statusList">
                                <div class="projectOverViewCenterLeftTopContentItemLeft">
                                    <div :class="'typeColor'+index" style="margin-right: 10px;"></div>
                                    <span>{{item.key}}</span>
                                </div>
                                <span>{{item.value}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
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
    import {list, addObj, groupByType, groupByStatus,lists,projectEarly} from '@/api/erp/project_management/projectOverview';
    import {uploadPath} from '@/api/erp/goods/storage'
    var baseUrl = 'https://cli.avuejs.com/api/area'
    import {customerOption, userOption} from '@/util/table';

    export default {
        name: "project_overview",
        props: ['timeStamp'],
        components: {
            'publicSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            var validateRegionCodes = (rule, value, callback) => {
                if (!value || value.length == 0) {
                    callback(new Error('请选择所在区域'));
                } else {
                    callback();
                }
            };
            return {
                invisible: false,
                visible: false,
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
                topData: ['公司数据', '我负责的', '我参与的', '按部门查看'],
                warningData: [
                    {
                        imgUrl: 'http://hejigy.com.cn/gqcq.png',
                        title: '1',
                        content: '工期超时'
                    },
                    {
                        imgUrl: 'http://hejigy.com.cn/jjdqxm.png',
                        title: '22',
                        content: '即将到期'
                    },
                    {
                        imgUrl: 'http://hejigy.com.cn/yscq.png',
                        title: '22',
                        content: '预算超支'
                    },
                    {
                        imgUrl: 'http://hejigy.com.cn/jjczxm.png',
                        title: '23',
                        content: '即将超支'
                    },
                    {
                        imgUrl: 'http://hejigy.com.cn/jwgc.png',
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
                        label: "项目名称",
                        prop: "projectName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "项目类型",
                        prop: "projectType",
                        minWidth: 120,
                        align: 'left',
                        type: 'select',
                        dicMethod: 'get',
                        dicUrl: '/api/manager/sales-order-mold/pageAll',
                        props: {
                            value: 'name',
                            label: 'name'
                        },
                    },
                    {
                        label: "负责人",
                        prop: "chargeName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "创建时间",
                        prop: "updTime",
                        minWidth: 120,
                        align: 'center',
                    },
                ],
                typeList: [],
                statusList: [],
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
            topIndex(val) {
                this.getList(this.page)
            }
        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 340);
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
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 340);
        },
        methods: {
            selectTypeBtn(sum){
              this.selectType = sum;
              this.getList(this.page);
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
            startBtn() {
                if (this.form.startDate != '' && this.form.startDate != undefined && this.form.endDate != '' && this.form.endDate != undefined) {
                    let sum = this.getDaysBetween(this.form.startDate, this.form.endDate);
                    if (sum < 1) {
                        this.vueMessage('warning', '计划完工日期不能大与计划开工日期!');
                        return
                        this.form.endDate = '';
                    } else {
                        this.form.workTime = sum;
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
                        this.form.phone = list[0].name.mobilePhone;
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
                projectEarly().then(res=>{
                    this.warningData[0].title = res.data.data.workCount;
                    this.warningData[1].title = res.data.data.endCount;
                    this.warningData[2].title = res.data.data.overCount;
                    this.warningData[3].title = res.data.data.soonOverCount;
                    this.warningData[4].title = res.data.data.oldUpdateCount;
                })
                // this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType,});
                if(this.topIndex < 1){
                    if(this.selectType == 0){
                        queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType,type:3,});
                    }else{
                        queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType,type:3,projectStatus: this.selectType});
                    }

                }else{
                    if(this.selectType == 0){
                        queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType,type: this.topIndex * 1 - 1,});
                    }else{
                        queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize,selectType: this.selectType,type: this.topIndex * 1 - 1,projectStatus: this.selectType});
                    }
                }

                queryObj = JSON.parse(JSON.stringify(queryObj));
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
                    for(let i in data.records){
                        if(data.records[i].mainDto){
                            data.records[i].projectName = data.records[i].mainDto.projectName;
                            data.records[i].projectType = data.records[i].mainDto.projectType;
                            data.records[i].chargeName = data.records[i].mainDto.chargeName;
                        }
                    }
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
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            .projectOverViewConent {
                display: flex;
                flex-direction: row;
                .projectOverViewConentItem {
                    position: relative;
                    line-height: 50px;
                    font-size: 14px;
                    margin-left: 40px;
                    span {
                        cursor: pointer;
                    }
                    .projectOverViewConentItemBottom {
                        position: absolute;
                        right: 0px;
                        bottom: 0px;
                        height: 2px;
                        width: 100%;
                        background: #409EFF;
                    }
                }
            }
            .projectOverViewTopBtn {
                display: inline-block;
                height: 30px;
                margin-right: 30px;
            }
        }
        .projectOverViewCenter {
            margin-top: 14px;
            .projectOverViewCenterLeft {
                display: flex;
                flex-direction: column;
                .projectOverViewCenterLeftTop {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 14px;
                    background: white;
                    .projectOverViewCenterLeftTopTitle {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        font-size: 14px;
                        padding: 20px 0px 20px 30px;
                        cursor: pointer;
                        .projectOverViewCenterLeftTopTitleImg{
                            width: 20px;
                            height: 20px;
                            margin-right: 10px;
                        }
                    }
                }
                .projectOverViewCenterLeftTopContent {
                    padding: 0px 50px  20px 50px;
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
                            .typeColor6{
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
                    padding: 0px 20px 0px 20px;
                    .projectOverViewCenterLeftTopConentItem {
                        /*width:8.2rem;*/
                        height:120px;
                        background:rgba(255,255,255,1);
                        box-shadow:0px 2px 7px 0px rgba(63,74,91,0.16);
                        border-radius:3px;
                        /*margin-right: 0.8rem;*/
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 20px;
                        div{
                            img{
                                width:auto;
                                height: 3rem;
                                margin-right:20px;
                            }
                        }
                        div:last-child {
                            display: flex;
                            flex-direction: column;
                            span {
                                font-size: 0.9rem;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                            }
                            span:first-child{
                                color: #A7ABAF;
                                font-size: 0.6rem;
                                margin-bottom: 12px;
                            }
                        }
                    }
                    .projectOverViewCenterLeftTopConentItem:last-child{
                        margin-right: 0px !important;
                    }
                }
                .projectOverViewCenterLeftTopConentTwo {
                    padding: 20px 30px;
                }
            }
            .projectOverViewCenterLeftOne{
                margin-right: 14px !important;
            }
        }
    }

    .selectBtn{
        color: #409EFF !important;
    }
</style>