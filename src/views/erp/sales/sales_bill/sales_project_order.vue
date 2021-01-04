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
                           :summary-method="getSummaries"
                           :cell-style="handleCellStyle"
                           @row-click="handleRowClick"
                           @row-dblclick="handleRowDbClick">
                    <!--自定义按钮-->
                    <template slot="menuLeft">
                        <button-bar type="list"
                                    ref="buttonBar"
                                    objectKey="XMDD"
                                    :objectType="isDetailed ? 1 : 0"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleCreate="handleCreate"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handleSettingSubmit="handleSettingSubmit"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <template slot="menuRight">
                        <el-checkbox v-model="isDetailed" @change="handleSwitchChange" style="margin-right: 20px;">显示详情</el-checkbox>
                    </template>
                    <template slot-scope="scope" slot="opt">
                        <el-button size="small"  type="warning" @click="projectBtn(scope.row)" plain v-if="scope.row.billStatus == '4'">
                            {{isDetailed ? '项目报表': '项目核算'}}
                        </el-button>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog :visible.sync="dialogSelectVisible" v-if="dialogSelectVisible" width="30%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" title="请填写信息" append-to-body class="public-dialog">
            <avue-form :option="option" v-model="form"  ref="form" @submit="handleSubmit">
            </avue-form>
        </el-dialog>
        <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                        :title="publicTitle" :isSingle="isSingle" :option="publicOption" :typeName="typeName"
                        @handleClose="handleClosePublic"
                        @handleSubmit="handleSubmitPublic"></pubil-selector>
        <a id="test123"
           :href="openUrl+'/api/manager/project-order/exportProjectOrder?id='+(selectedRows&&selectedRows.length>0?selectedRows[0].id:'')"></a>
    </list-container>
</template>

<script>
    import {
        selectPage,
        selectPageByItem,
        batchDelBill,
        generateProductOrder,
        exportProjectOrder
    } from "@/api/erp/manager/project_order/index";
    import {userOption} from '@/util/table';
    import {openUrl} from '@/config/env';

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        name: "sales_project_order",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        props: ['timeStamp'],
        data() {
            return {
                form: {},
                publicVisible: false,
                dialogSelectVisible: false,
                publicTitle: undefined,
                typeName: undefined,
                publicOption: undefined,
                isSingle: false,
                publicIndex: undefined,
                option: {
                    labelWidth: 120,
                    column: [
                        {
                            label: '生产人员ID',
                            prop: 'produceId',
                            display: false
                        },
                        {
                            label: '生产人员编号',
                            prop: 'produceCode',
                            display: false
                        },
                        {
                            label: "生产人员",
                            prop: "produceName",
                            rules: [{
                                required: true,
                                message: "请选择生产人员",
                                trigger: "change"
                            }],
                            span: 24,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            click: ({value, column}) => {
                                this.publicTitle = '请选择生产人员';
                                this.typeName = 'userType';
                                this.publicOption = userOption;
                                this.isSingle = false;
                                this.publicIndex = parseInt(1);
                                this.publicVisible = true;
                            },
                        },
                        {
                            label: "管理费比例",
                            prop: "manageCost",
                            placeholder:'请输入管理费比例,例 : 0.1',
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入管理费比例",
                                trigger: "change"
                            }],
                        },
                        // {
                        //     label: '技术人员ID',
                        //     prop: 'skillId',
                        //     display: false
                        // },
                        // {
                        //     label: '技术人员编号',
                        //     prop: 'skillCode',
                        //     display: false
                        // },
                        // {
                        //     label: "技术人员",
                        //     prop: "skillName",
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择技术人员",
                        //         trigger: "change"
                        //     }],
                        //     type: 'text',
                        //     dicData: [],
                        //     filterable: true,
                        //     readonly: true,
                        //     clearable: false,
                        //     click: ({value, column}) => {
                        //         this.publicTitle = '请选择技术人员';
                        //         this.typeName = 'userType';
                        //         this.publicOption = userOption;
                        //         this.isSingle = false;
                        //         this.publicIndex = parseInt(2);
                        //         this.publicVisible = true;
                        //     },
                        // },
                        {
                            label: "开工日期",
                            prop: "openDate",
                            span: 24,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            rules: [{
                                required: true,
                                message: "请选择开工日期",
                                trigger: "change"
                            }],
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                        {
                            label: "结束日期",
                            prop: "endsDate",
                            span: 24,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            rules: [{
                                required: true,
                                message: "请选择结束日期",
                                trigger: "change"
                            }],
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                    ]
                },
                isShow: true,
                isDetailed: false,
                searchDisable: false,
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
                    createBtn: true,
                    exportBtn: true,
                    printBtn: true,
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
                    index: true,
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,//首次加载是否显示搜索
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },
                        {
                            name: "taxPrice",
                            type: "sum"
                        }, {
                            name: "taxAmount",
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
                    }, {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    }, {
                        label: "订单状态",
                        prop: "billStatus",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicData: this.orderType,
                        searchFilterable: true
                    }, {
                        label: "单据日期",
                        prop: "billDate",
                        minWidth: 120,
                        align: 'left',
                        search: true,
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    }, {
                        label: "已生成生产订单",
                        prop: "projectType",
                        minWidth: 120,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: 0,
                                label: '无'
                            },
                            {
                                value: 1,
                                label: '有'
                            }
                        ]
                    }, {
                        label: "客户编号",
                        prop: "customerCode",
                        minWidth: 100,
                        align: 'left',
                    }, {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 220,
                        search: true,
                        align: 'left',
                    },
                    // {
                    //     label: "生产人员编号",
                    //     prop: "produceCode",
                    //     minWidth: 100,
                    //     align: 'left',
                    // }, {
                    //     label: "生产人员",
                    //     prop: "produceName",
                    //     minWidth: 180,
                    //     search: true,
                    //     align: 'left',
                    // },
                    {
                        label: "技术人员编号",
                        prop: "skillCode",
                        minWidth: 100,
                        align: 'left',
                    }, {
                        label: "技术人员",
                        prop: "skillName",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                    }, {
                        label: "销售员编号",
                        prop: "salesCode",
                        minWidth: 100,
                        align: 'left',
                    }, {
                        label: "销售员姓名",
                        prop: "salesName",
                        minWidth: 100,
                        align: 'center',
                    }, {
                        label: "结算方式",
                        prop: "settlementWay",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicMethod: 'get',
                        dicUrl: '/api/manager/payments-means/pageAll',
                        props: {
                            value: 'value',
                            label: 'label'
                        },
                        searchFilterable: true
                    }, {
                        label: "交货方式",
                        prop: "deliveryWay",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicData: [
                            {
                                value: 0,
                                label: '自提'
                            },
                            {
                                value: 1,
                                label: '快件'
                            },
                            {
                                value: 2,
                                label: '物流'
                            }
                        ],
                        searchFilterable: true
                    }, {
                        label: "收货人",
                        prop: "goodsName",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "收货电话",
                        prop: "goodsPhone",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "收货地址",
                        prop: "goodsAddress",
                        minWidth: 180,
                        align: 'left',
                    }, {
                        label: "签订地点",
                        prop: "signing",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        fixed: "right",
                        slot: true,
                        minWidth: 120,
                        align: 'center',
                    },
                ],
                detailedColumn: [
                    {
                        label: "id",
                        prop: "id",
                        sortable: true,
                        hide: true
                    }, {
                        label: "单据编号",
                        prop: "billNo",
                        minWidth: 160,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    }, {
                        label: "订单状态",
                        prop: "billStatus",
                        minWidth: 100,
                        type: 'select',
                        align: 'left',
                        dicData: this.orderType,
                        search: true,
                        searchFilterable: true
                    }, {
                        label: "单据日期",
                        prop: "billDate",
                        search: true,
                        minWidth: 120,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    }, {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 160,
                        search: true,
                        align: 'left',
                    }, {
                        label: "商品名称",
                        prop: "skuName",
                        minWidth: 120,
                        align: 'left',
                        search: true,
                    }, {
                        label: "订货号",
                        prop: "itemNo",
                        minWidth: 120,
                        align: 'left',
                        search: true,
                    }, {
                        label: "数量",
                        prop: "qty",
                        minWidth: 120,
                        align: 'left',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "数量"
                            );
                        }
                    }, {
                        label: "计量单位",
                        prop: "unit",
                        minWidth: 120,
                        align: 'left',
                    }, {
                        label: "含税单价",
                        prop: "taxPrice",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "含税单价"
                            );
                        }
                    }, {
                        label: "含税金额",
                        prop: "taxAmount",
                        minWidth: 120,
                        align: 'right',
                        textColor: "#ff0000",
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "含税金额"
                            );
                        }
                    }, {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "操作",
                        prop: "opt",
                        fixed: "right",
                        slot: true,
                        minWidth: 120,
                        align: 'center',
                    },
                ]
            }
        },
        computed: {
            ids() {
                this.permission.exportBtn = false;
                let ids = [];
                this.selectedRows.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        watch:{
            dialogSelectVisible(val){
                if(!val){
                    this.$refs.form.resetForm();
                }
            }
        },
        created() {
            const _this = this;
            window.onresize = function () {
                _this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
            };
            this.getConfigList();
            this.tableOption.column = this.billColumn;
            this.getList(this.page);
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        methods: {
            getSummaries(param) {
                return this.getSummariesMethod(param, this.tableOption.sumColumnList);
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.publicIndex == 1) {
                        this.form.produceName = list[0].name;
                        this.form.produceId = list[0].id;
                        this.form.produceCode = list[0].no;
                    }
                    if (this.publicIndex == 2) {
                        this.form.skillName = list[0].name;
                        this.form.skillId = list[0].id;
                        this.form.skillCode = list[0].no;
                    }
                }
                this.$refs.publicSelector.selectionClear();
            },
            handleSubmit(form, done) {
                generateProductOrder(this.form).then(res => {
                    done();
                    if (res.data && res.data.code == '2000') {
                        this.vueMessage('success', '生成生产订单成功!');
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    this.getList(this.page);
                })
                this.dialogSelectVisible = false;
                done();
            },
            handleSelectClose() {
                this.dialogSelectVisible = false;
            },
            getConfigList() {
                this.setList(this, 'XMDD');
            },
            handleSettingSubmit(obj) {
                this.isShow = false;
                this.$nextTick(() => {
                    this.tableOption = obj;
                    if (this.isDetailed) {
                        this.detailedColumn = obj.column;
                    } else {
                        this.billColumn = obj.column;
                    }
                    this.isShow = true;
                })
            },
            handleCreate() {
                if (this.selectedRows.length != 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    //this.vueNotification('success', '提示', '请至少选择一条数据');
                    return false;
                }
                if (this.selectedRows[0].projectType == 1) {
                    this.vueMessage('warning', '该单据已生成生产订单!');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    if (row.billStatus != '4') {
                        this.vueMessage('warning', '非正常状态下不能生成生产订单!');
                        flag = false;
                        return
                    }
                    ids.push(row.id)
                });
                if(!flag){
                    return
                }
                this.dialogSelectVisible = true;
                this.form.id = this.selectedRows[0].id;
                this.form.skillName = this.selectedRows[0].skillName;
                this.form.skillId = this.selectedRows[0].skillId;
                this.form.skillCode = this.selectedRows[0].skillCode;
                // if(flag){
                //     generateProductOrder(ids).then(res=>{
                //         if(res.data && res.data.code == '2000'){
                //             this.vueMessage('success','生成生产订单成功!');
                //         }else{
                //             this.vueMessage('warning',res.data.msg);
                //         }
                //         this.getList(this.page);
                //     })
                // }
            },
            //删除方法
            handleRowDelete(form, index) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    //this.vueNotification('success', '提示', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    if (row.billStatus == 2 || row.billStatus == 3 || row.billStatus == 4) {
                        this.vueMessage('warning', '选择包含不能删除的单据!');
                        flag = false;
                    }
                    ids.push(row.id)
                });
                if (flag) {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        batchDelBill(ids).then((res) => {
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.getList(this.page);

                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                        });
                    });
                }
            },
            //导出
            handleExport() {
                if (this.isDetailed) {
                    this.vueMessage('warning', '请选择主表进行导出操作!');
                    return
                }
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一条单据导出!');
                    return
                }
                if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一个单据!');
                    return
                }
                document.getElementById('test123').click()
            },
            handleAdd() {
                this.handleBillAdd(this, {path: '/sales_project_order_form', name: '项目订单制单'});
            },
            handleSwitchChange() {
                this.permission.createBtn = !this.isDetailed;
                this.isShow = false;
                this.$nextTick(() => {
                    //判断是单据还是详情
                    this.tableOption.column = [];
                    if (this.isDetailed) {
                        this.permission.printBtn = false;
                        this.tableOption.showSummary = true;
                        this.permission.exportBtn = false;
                        this.tableOption.column = this.detailedColumn;
                    } else {
                        this.permission.printBtn = true;
                        this.tableOption.showSummary = false;
                        this.permission.exportBtn = false;
                        this.tableOption.column = this.billColumn;
                    }

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
                if (this.isDetailed) {
                    select = selectPageByItem;
                } else {
                    select = selectPage;
                }
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                let query = JSON.parse(JSON.stringify(queryObj));
                query.startValidityPeriod = query.startValidityPeriod + ' 00:00:00';
                query.endValidityPeriod = query.startValidityPeriod + ' 23:59:59';
                select(queryObj).then(res => {
                    const data = res.data.data;
                    for (let i in data.records) {
                        data.records[i].settlementWay = parseInt(data.records[i].settlementWay);
                        if (data.records[i].mainDTO) {
                            data.records[i].billDate = !this.isEmpty(data.records[i].mainDTO.billDate) ? data.records[i].mainDTO.billDate : '';
                            data.records[i].billNo = !this.isEmpty(data.records[i].mainDTO.billNo) ? data.records[i].mainDTO.billNo : '';
                            data.records[i].customerName = !this.isEmpty(data.records[i].mainDTO.customerName) ? data.records[i].mainDTO.customerName : '';
                            data.records[i].billStatus = !this.isEmpty(data.records[i].mainDTO.billStatus) ? data.records[i].mainDTO.billStatus : '';
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
                const id = this.isDetailed ? row.masterId : row.id;
                this.$router.push({
                    path: '/sales_project_order_form',
                    name: '项目订单制单',
                    query: {
                        id: id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'sales_project_order_form'
                    }
                });
            },
            //编辑
            handleEdit(type) {
                const text = type == 'view' ? '查看' : '编辑';
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要' + text + '的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能' + text + '一个条目');
                    return false;
                }

                if (type != 'view') {
                    if (this.selectedRows[0].billStatus == 2 || this.selectedRows[0].billStatus == 3 || this.selectedRows[0].billStatus == 4) {
                        this.vueMessage('warning', '该状态不可编辑');
                        return false;
                    }
                }

                const id = this.isDetailed ? this.selectedRows[0].masterId : this.selectedRows[0].id;

                this.$router.push({
                    path: '/sales_project_order_form',
                    name: '项目订单制单',
                    query: {
                        id: id,
                        type: type
                    },
                    meta: {
                        i18n: 'sales_project_order_form'
                    }
                });
            },
            projectBtn(item) {
                if (this.isDetailed) {
                    this.$router.push({
                        path: '/project_summary',
                        name: '项目报表',
                        query: {
                            goodsDate: item.goodsDate,
                            billNo: item.billNo,
                            taxAmount: item.taxAmount,
                            timeStamp: new Date().getTime()
                        },
                        meta: {
                            i18n: 'project_summary'
                        }
                    });
                } else {
                    this.$router.push({
                        path: '/project_accounting',
                        name: '项目核算',
                        query: {
                            goodsDate: item.goodsDate,
                            billNo: item.billNo,
                            taxBillAmount: item.taxBillAmount,
                            projectName: item.projectName,
                            timeStamp: new Date().getTime()
                        },
                        meta: {
                            i18n: 'project_accounting'
                        }
                    });
                }
            },
            //打印
            handlePrint() {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择一条数据');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能选择一条数据');
                    return false;
                }
                this.$router.push({
                    path: '/sales_project_order_form',
                    name: '项目订单制单',
                    query: {
                        id: this.selectedRows[0].id,
                        type: 'view'
                    },
                    meta: {
                        i18n: 'sales_project_order_form'
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
