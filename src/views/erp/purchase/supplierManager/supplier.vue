<template>
    <div>
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
                        <button-bar type="lists"
                                    ref="buttonBar"
                                    :permission="permission"
                                    :tableOption="tableOption"
                                    :row="selectedRows.length>0?selectedRows[selectedRows.length-1]:undefined"
                                    @handleAdd="handleAdd"
                                    @handleEdit="handleEdit"
                                    @handleDelete="handleRowDelete"
                                    @handlePrint="handlePrint"
                                    @handleExport="handleExport"></button-bar>
                    </template>
                    <template slot="menuRight">
                        <div style="display: inline-block;width: auto;">
                            <a href="/api/manager/supplier/download" style="color: #409EFF;margin-right: 5px;">
                            <el-button type="text">
                                <img src="https://hejigy.com.cn/mobanxiaz.png" alt="" style="margin-right: 3px;"/>
                                下载导入模板
                            </el-button>
                            </a>
                            <el-upload class="upload" action="/api/manager/supplier/import"
                                       :before-upload="beforeUpload"
                                       :on-remove="handleRemove" :show-file-list="false"
                                       :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed"
                                       :file-list="fileList"
                                       style="display:inline;" :on-success="uploadCompleted" :headers="headers">
                                <el-button type="text" icon="el-icon-download">
                                    导入
                                </el-button>
                            </el-upload>
                        </div>
                    </template>
                </avue-crud>
            </div>
        </basic-container>
        <el-dialog v-if="dialogSelectVisible" :visible.sync="dialogSelectVisible" width="60%" @close="handleSelectClose"
                   :close-on-click-modal="false"
                   :before-close="handleSelectClose" :title="selectType" append-to-body class="public-dialog">
            <div slot="footer" class="dialog-footer">
                <div>
                    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商全称" prop="supplierName">
                                    <el-input v-model="dataForm.supplierName" placeholder="请输入供应商全称" :readonly="isRead"
                                              @blur="isSupplierName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="供应商简称" prop="abbrName">
                                    <el-input v-model="dataForm.abbrName" placeholder="请输入供应商简称"
                                              :readonly="isRead"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="供应商负责人" prop="managerName">
                                    <div @click="managerClick(isRead)">
                                        <el-input v-model="dataForm.managerName" placeholder="请选择供应商负责人"
                                                  readonly></el-input>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="供应商类别" prop="supplierType">
                                    <div style="display: flex;flex-direction: row;">
                                        <el-select v-model="dataForm.supplierType" filterable>
                                            <el-option
                                                    v-for="item in supplierOptions"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="first" style="height:228px;">
                                <el-row>
                                    <el-form-item label="区域" prop="address">
                                        <el-cascader  :props="{ checkStrictly: true ,value:'title', label:'title'}" ref="tree_right"
                                                      v-model="selected" :disabled="isRead" style="width: 100%;"
                                                      :options="options"
                                        ></el-cascader>
                                    </el-form-item>
                                    <el-col :span="12">
                                        <el-form-item label="公司网站" prop="fax">
                                            <el-input v-model="dataForm.website" placeholder="请输入公司网站"
                                                      :readonly="isRead"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="传真" prop="fax">
                                            <el-input v-model="dataForm.fax" placeholder="请输入传真"
                                                      :readonly="isRead"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="详细地址" prop="address">
                                            <el-input v-model="dataForm.address" placeholder="请输入详细地址"
                                                      :readonly="isRead"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="备注" prop="note">
                                            <el-input v-model="dataForm.note" placeholder="请输入备注"
                                                      :readonly="isRead"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="联系人信息" name="second">
                                <avue-crud :option="itemsOption" :data="dataForm.items"
                                           @selection-change="handleSelectionChange">
                                    <template slot-scope="scope" slot="operate">
                                        <div>
                                            <i class="el-icon-plus" @click="handleAddRow"
                                               style="margin-right: 15px;color:  #409EFF;"></i>
                                            <i class="el-icon-minus"
                                               @click="handleRemoveRow(scope.row,scope.row.$index)"
                                               style="color:#E80000;"></i>
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="linkMan">
                                        <div>
                                            <el-input size="mini" v-model="scope.row.linkMan"
                                                      placeholder="请输入供应商联系人" :readonly="isRead"></el-input>
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="linkPosition">
                                        <div>
                                            <el-input size="mini" v-model="scope.row.linkPosition"
                                                      placeholder="请输入联系人职务" :readonly="isRead"></el-input>
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="linkPhone">
                                        <div>
                                            <el-input size="mini" v-model="scope.row.linkPhone"
                                                      placeholder="请输入联系人电话" :readonly="isRead"></el-input>
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="linkEmail">
                                        <div>
                                            <el-input size="mini" v-model="scope.row.linkEmail"
                                                      placeholder="请输入联系人邮箱" :readonly="isRead"></el-input>
                                        </div>
                                    </template>
                                    <template slot-scope="scope" slot="linkIsMain">
                                        <div>
                                            <el-checkbox size="mini"
                                                         v-model="scope.row.linkIsMain == 'true' || scope.row.linkIsMain == true? true: false"
                                                         @change="handleLinkManChange(scope.row.$index, scope.row)"
                                                         :readonly="isRead"></el-checkbox>
                                        </div>
                                    </template>
                                </avue-crud>
                            </el-tab-pane>
                            <el-tab-pane label="财务信息" name="third">
                                <br/>
                                <avue-form v-model="dataForm" :option="formOption" ref="form"
                                           class="main-form" :disabled="isRead"></avue-form>
                            </el-tab-pane>
                            <el-tab-pane label="预警设置" name="four">
                                <br/>
                                <avue-form v-model="earlyForm" :option="earlyOption" ref="earlyForm"
                                           class="main-form" :disabled="isRead"></avue-form>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form>
                </div>
                <el-button @click="dialogSelectVisible = false">取消</el-button>
                <el-button type="primary" @click="supplierBtn">确定</el-button>
            </div>
        </el-dialog>
        <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                        :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                        @handleClose="handleClosePublic"
                        @handleSubmit="handleSubmitPublic"></pubil-selector>
    </div>
</template>

<script>
    import {selectArea} from '@/api/erp/crm/customer/index';
    import {
        batchDel,
        page as pages,
        addObj,
        getObj,
        putObj,
        supplierType,
        checkName
    } from '@/api/erp/purchase/supplier/index'
    import {userOption} from '@/util/table';

    export default {
        name: "supplier",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                options: [],
                supplierOptions: [],
                selected: [],
                isRead: false,
                activeName: 'first',
                dialogSelectVisible: false,
                isShow: true,
                headers: undefined,
                fileList: undefined,
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
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
                collectionTermsOptions: [],
                paymentsMeansOptions: [],
                loading: false,
                selectType: '',
                tableOption: {
                    height: 'auto',
                    calcHeight: 350,
                    size: 'mini',
                    emptyText: '暂无数据',
                    rowKey: 'id',
                    selection: true,
                    highlightCurrentRow: true,
                    selectionWidth: 50,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [],
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
                        label: "供应商编码",
                        prop: "supplierCode",
                        minWidth: 110,
                        overHidden: true,
                        search: true,
                        sortable: true,
                        fixed: true,
                        searchLabelWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "供应商全称",
                        prop: "supplierName",
                        minWidth: 170,
                        overHidden: true,
                        search: true,
                        searchLabelWidth: 100,
                        align: 'left',
                    },
                    {
                        label: "状态",
                        prop: "status",
                        minWidth: 60,
                        overHidden: true,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: '启用'
                            },
                            {
                                value: '1',
                                label: '禁用'
                            }
                        ],
                        search: true,
                        searchLabelWidth: 100,
                        searchFilterable: true
                    },
                    {
                        label: "采购员工号",
                        prop: "managerCode",
                        minWidth: 90,
                        overHidden: true,
                        align: 'left',
                        search: true,
                        searchLabelWidth: 100,
                    },
                    {
                        label: "采购员",
                        prop: "managerName",
                        minWidth: 70,
                        overHidden: true,
                        align: 'left',
                        search: true,
                        searchLabelWidth: 100,
                    },
                    {
                        label: "采购员部门",
                        prop: "departName",
                        minWidth: 180,
                        overHidden: true,
                        search: true,
                        align: 'left',
                        searchLabelWidth: 100,
                    },
                    {
                        label: "供应商联系人",
                        prop: "linkMan",
                        minWidth: 100,
                        overHidden: true,
                        searchLabelWidth: 100,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "联系人职务",
                        prop: "linkPosition",
                        minWidth: 100,
                        overHidden: true,
                        align: 'left',
                    },
                    {
                        label: "联系人电话",
                        prop: "linkPhone",
                        minWidth: 100,
                        overHidden: true,
                        align: 'left',
                    },
                    {
                        label: "联系人邮箱",
                        prop: "linkEmail",
                        minWidth: 100,
                        overHidden: true,
                        align: 'left',
                    },
                    {
                        label: "单据日期",
                        prop: "crtTime",
                        minWidth: 140,
                        overHidden: true,
                        search: true,
                        sortable: true,
                        align: 'LEFT',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                    },
                ],
                dataForm: {
                    id: undefined,
                    supplierName: undefined,
                    abbrName: undefined,
                    managerName: undefined,
                    website: undefined,
                    fax: undefined,
                    address: undefined,
                    note: undefined,
                    bankName: undefined,
                    bankAccount: undefined,
                    taxpayerNumber: undefined,
                    collectionTerms: undefined,
                    paymentsMeans: undefined,
                    regionCodes: [],
                    items: [],
                    linkManTableData: [],
                    province: undefined,
                    city: undefined,
                    county: undefined
                },
                rules: {
                    supplierName: [
                        {
                            required: true,
                            message: '请输入供应商全称',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    managerName: [
                        {
                            required: true,
                            message: '请输入供应商负责人',
                            trigger: 'change'
                        },
                    ],
                },
                publicTitle: '',
                typeName: '',
                option: [],
                isSingle: true,
                publicVisible: false,
                earlyForm:{},
                earlyOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    labelWidth: 180,
                    column: [
                        {
                            label: "付款预警天数",
                            prop: "payWarning",
                            span: 12
                        },
                        {
                            label: "收票预警天数",
                            prop: "invoiceWarning",
                            span: 12,
                        }
                    ]
                },
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    labelWidth: 180,
                    column: [
                        {
                            label: "开户银行",
                            prop: "bankName",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入开户银行",
                                trigger: "blur"
                            }],
                        },
                        {
                            label: "银行账号",
                            prop: "bankAccount",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入银行账号",
                                trigger: "blur"
                            }],
                        }, {
                            label: "纳税人识别号",
                            prop: "taxpayerNumber",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入纳税人识别号",
                                trigger: "blur"
                            }],
                        },
                        // {
                        //     label: "收款条件",
                        //     prop: "collectionTerms",
                        //     span: 12,
                        //     type: 'select',
                        //     dicMethod: 'get',
                        //     dicUrl: 'api/dict/dictValue/dictType/collection_terms',
                        //     props: {
                        //         value: 'value',
                        //         label: 'labelDefault'
                        //     },
                        // },
                        // {
                        //     label: "结算方式",
                        //     prop: "paymentsMeans",
                        //     span: 12,
                        //     type: 'select',
                        //     dicMethod: 'get',
                        //     dicUrl: '/api/manager/payments-means/pageAll',
                        //     props: {
                        //         value: 'value',
                        //         label: 'label'
                        //     },
                        // },

                    ]
                },
                itemsOption: {
                    addBtn: false,
                    refreshBtn: false,
                    columnBtn: false,
                    saveBtn: false,
                    border: true,
                    menu: false,
                    height: 'auto',
                    maxHeight: 300,
                    selection: true,
                    selectionWidth: 50,
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 80,
                            slot: true,
                        },
                        {
                            label: "供应商联系人",
                            prop: "linkMan",
                            width: 160,
                            slot: true,
                        },
                        {
                            label: "联系人职务",
                            prop: "linkPosition",
                            width: 160,
                            slot: true,
                        },
                        {
                            label: "联系人电话",
                            prop: "linkPhone",
                            width: 160,
                            slot: true,
                        },
                        {
                            label: "联系人邮箱",
                            prop: "linkEmail",
                            width: 160,
                            slot: true,
                        },
                        {
                            label: "是否主要联系人",
                            prop: "linkIsMain",
                            minwidth: 120,
                            slot: true,
                            align: 'center'
                        },
                    ]
                },
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
            selectArea().then(res => {
                this.options = res.data.data;
            });
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            };
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
        watch: {
            activeName(val) { //监听切换状态-计划单
                if (val == 'second') {
                    if(this.dataForm.items==undefined){
                        this.dataForm.items =[];
                        this.handleAddRow();
                    }else{
                        if (this.dataForm.items.length < 1) {
                            this.handleAddRow();
                        }
                    }


                }
            },
        },
        methods: {
            isSupplierName() {
                if (this.dataForm.supplierName && !this.isRead) {
                    checkName(this.dataForm.supplierName, this.dataForm.id).then(res => {
                        if (res.data.code != '2000') {
                            this.vueMessage('warning', res.data.msg);
                        }
                    })
                }
            },
            handleLinkManChange(index, val) {
                for (let i in this.dataForm.items) {
                    this.dataForm.items[i].linkIsMain = false;
                    this.vueSet(this.dataForm.items, i, this.dataForm.items[i]);
                }
                this.dataForm.items[index].linkIsMain = true;
                this.vueSet(this.dataForm.items, index, this.dataForm.items[index]);
            },
            supplierBtn() {
                if (this.dataForm && this.dataForm.supplierName == undefined || this.dataForm.supplierName == '') {
                    this.vueMessage('warning', '请填写供应商全称!');
                    return
                }
                if (this.dataForm.managerName == undefined || this.dataForm.managerName == '') {
                    this.vueMessage('warning', '请填写供应商负责人!');
                    return
                }
                if (this.dataForm.items && this.dataForm.items.length < 1 ) {
                    this.vueMessage('warning', '联系人信息不完整');
                    return
                }else{
                    if(this.dataForm.items!=undefined){
                        if(!this.dataForm.items[0].linkMan || !this.dataForm.items[0].linkPhone){
                            this.vueMessage('warning', '联系人信息不完整');
                            return
                        }
                    }

                }
                this.dataForm.linkManTableData = this.dataForm.items;
                let select;
                if (this.selected.length > 0) {
                    if(this.selected.length  == 1){
                        this.dataForm.province = this.selected[0];
                        this.dataForm.city = '';
                        this.dataForm.county = '';
                    }
                    if(this.selected.length  == 2){
                        this.dataForm.province = this.selected[0];
                        this.dataForm.city = this.selected[1];
                        this.dataForm.county = '';
                    }
                    if(this.selected.length  == 3){
                        this.dataForm.province = this.selected[0];
                        this.dataForm.city = this.selected[1];
                        this.dataForm.county = this.selected[2];
                    }
                }
                delete this.dataForm.regionCodes;
                this.dataForm.payWarning = this.earlyForm.payWarning || '';
                this.dataForm.invoiceWarning  = this.earlyForm.invoiceWarning  || '';
                if (this.dataForm.taxpayerNumber && (this.dataForm.taxpayerNumber.length == 18 || this.dataForm.taxpayerNumber.length == 15)) {
                    if (!this.dataForm.id || this.dataForm.id == undefined) {
                        select = addObj;
                        select(this.dataForm).then(response => {
                            if (response.data.code == '2000') {
                                this.dialogSelectVisible = false;
                                this.$notify({
                                    title: '成功',
                                    message: '创建成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.getList(this.page);
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.data.msg,
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                        })

                    } else {
                        select = putObj;
                        for(let i in this.dataForm.linkManTableData){
                            this.dataForm.linkManTableData[i].supplierName = this.dataForm.supplierName;
                            this.dataForm.linkManTableData[i].supplierId= this.dataForm.id;
                            this.dataForm.linkManTableData[i].supplierCode = this.dataForm.supplierCode;
                        }
                        select(this.dataForm.id, this.dataForm).then(response => {
                            if (response.data.code == '2000') {
                                this.dialogSelectVisible = false;
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.getList(this.page);
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: response.data.msg,
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                        })
                    }
                } else {
                    this.vueMessage('warning', '纳税人识别号必须为15位或18位!');
                    return
                }
            },
            handleAddRow() {
                if (this.isRead) {
                    return
                }
                let flag = true;
                if (this.dataForm.items.length > 0) {
                    for (let i in this.dataForm.items) {
                        if (this.dataForm.items[i].linkIsMain) {
                            flag = false;
                        }
                    }
                }
                const d = {
                    linkMan: '',
                    linkIsMain: flag,
                }
                this.dataForm.items.push(d);
            },
            handleRemoveRow(item, index) {
                if (this.isRead) {
                    return
                }
                let ValueIndex = this.dataForm.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.dataForm.items.splice(index, 1);
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.dataForm.managerId = list[0].id;
                    this.dataForm.managerCode = list[0].no;
                    this.dataForm.managerName = list[0].name;
                    this.publicVisible = false;
                }
            },
            managerClick(type) {
                if (!type) {
                    this.publicTitle = '请选择供应商负责人';
                    this.typeName = 'userType';
                    this.option = userOption;
                    this.isSingle = true;
                    this.publicVisible = true;
                }

            },
            handleSelectClose() {
                this.dialogSelectVisible = false;
            },
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },
            handleAdd() {
                this.isRead = false;
                this.selectType = '创建供应商';
                this.earlyForm = {};
                this.dataForm = {
                    id: undefined,
                    supplierName: undefined,
                    abbrName: undefined,
                    website: undefined,
                    fax: undefined,
                    address: undefined,
                    note: undefined,
                    bankName: undefined,
                    bankAccount: undefined,
                    taxpayerNumber: undefined,
                    collectionTerms: undefined,
                    paymentsMeans: undefined,
                    items: [],
                    managerId :this.$store.getters.userInfo.id,
                    managerCode: this.$store.getters.userInfo.no,
                    managerName : this.$store.getters.userInfo.name,
                    linkManTableData: [],
                };
                supplierType().then(res => {
                    this.supplierOptions = res.data.data
                })
                this.dialogSelectVisible = true;
            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = pages;
                if (queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0) {
                    queryObj.startDate = queryObj.crtTime[0] + ' 00:00:00';
                    queryObj.endDate = queryObj.crtTime[1] + ' 23:59:59';
                    delete queryObj.crtTime;
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
            //行点击事件
            handleRowClick(row, event, column) {
                this.controlButtonShow(row, this);
                this.$refs.crud.toggleSelection([row]);
            },
            //双击查看
            handleRowDbClick(row) {
            },
            //编辑
            handleEdit(type) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要' + text + '的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能' + text + '一个条目');
                    return false;
                }
                if (type == "view") {
                    this.isRead = true;
                } else {
                    this.isRead = false;
                }
                this.selectType = '编辑供应商';
                getObj(this.selectedRows[0].id)
                    .then(response => {
                        this.dataForm = response.data.data
                        this.selected = [];
                        if(this.dataForm.province && this.dataForm.province != ''){
                            this.selected.push(this.dataForm.province)
                        }
                        if(this.dataForm.city && this.dataForm.city != ''){
                            this.selected.push(this.dataForm.city)
                        }
                        if(this.dataForm.county && this.dataForm.county != ''){
                            this.selected.push(this.dataForm.county)
                        }
                        this.dataForm.items = response.data.data.linkManTableData;
                        this.earlyForm.payWarning = this.dataForm.payWarning;
                        this.earlyForm.invoiceWarning = this.dataForm.invoiceWarning;
                    });
                this.dialogSelectVisible = true;
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
            },
            //导出
            handleExport() {
                this.$refs.crud.rowExcel();
            },
            //导入
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            uploadCompleted(response, file, fileList) {
                this.getList(this.page);
                if (response.code == '2000') {
                    this.$notify({
                        title: '成功',
                        message: response.msg,
                        type: 'success',
                        duration: 2000
                    });

                } else {
                    this.$notify({
                        title: '失败',
                        message: response.msg,
                        type: 'warning',
                        duration: 2000
                    })
                }
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            beforeUpload(file) {
                const isXLS = file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isXLS) {
                    this.$message.error('只能上传xls/xlsx表格!');
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!');
                }
                return isXLS && isLt10M;
            },
            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
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
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        batchDel(ids).then((res) => {
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
                    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        batchDel(ids).then((res) => {
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
        }
    }
</script>

<style scoped lang="scss">


</style>
