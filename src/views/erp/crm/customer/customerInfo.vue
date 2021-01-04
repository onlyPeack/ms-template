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
                           @row-click="handleRowClick">
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
                        <!--<el-button type="warning" @click="tusongBtn" plain>推送商城客户</el-button>-->
                    </template>
                    <template slot="menuRight">
                        <div style="display: inline-block;width: 180px;">
                            <a href="/api/manager/customer/download" style="color: #409EFF;margin-right: 10px;">
                            <el-button type="text">
                                <img src="https://hejigy.com.cn/mobanxiaz.png" alt=""/>
                               下载导入模板
                            </el-button>
                            </a>
                            <el-upload class="upload" action="/api/manager/customer/import" :before-upload="beforeUpload"
                                       :on-remove="handleRemove" :show-file-list="false"
                                       :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
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
            <div>
                <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px"
                         :disabled="formOption.disabled">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="客户全称" prop="customerName">
                                <el-input v-model="dataForm.customerName" placeholder="请输入客户全称" :readonly="isRead" @blur="isCustomerName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户简称" prop="abbrName">
                                <el-input v-model="dataForm.abbrName" placeholder="请输入客户商简称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户负责人" prop="managerId">
                                <div @click="managerClick">
                                    <el-input v-model="dataForm.managerName" placeholder="请选择客户负责人"
                                              readonly></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="note">
                                <el-input v-model="dataForm.note" placeholder="请输入备注"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="基本信息" name="first" style="height:260px;">
                            <el-row>
                                <br/>
                                <el-col :span="12">
                                    <el-form-item label="区域" prop="address">
                                        <el-cascader  :props="{ checkStrictly: true ,value:'title', label:'title'}" ref="tree_right"
                                                      v-model="regionCodes" :disabled="formOption.disabled" style="width: 100%;"
                                                      :options="options"
                                        ></el-cascader>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="详细地址" prop="address">
                                        <el-input v-model="dataForm.address" placeholder="请输入详细地址"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="公司网站" prop="fax">
                                        <el-input v-model="dataForm.website" placeholder="请输入公司网站"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="传真" prop="fax">
                                        <el-input v-model="dataForm.fax" placeholder="请输入传真"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="客户类型" prop="customerType">
                                        <el-select v-model="dataForm.customerType" placeholder="请选择客户类型"
                                                   style="width: 100%;">
                                            <el-option v-for="item in customerTypeList"
                                                       :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="客户属性" prop="customerAttribute">
                                        <el-select v-model="dataForm.customerAttribute" placeholder="请选择客户属性"
                                                   style="width: 100%;">
                                            <el-option v-for="item in customerAttributeList"
                                                       :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="客户等级" prop="customerGrade">
                                        <el-select v-model="dataForm.customerGrade" placeholder="请选择客户等级"
                                                   style="width: 100%;">
                                            <el-option v-for="item in customerGradeList"
                                                       :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="联系人信息" name="second">
                            <avue-crud :option="itemsOption" :data="dataForm.items"
                                       @selection-change="handleSelectionChange" v-if="isShow">
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
                                                  placeholder="请输入客户联系人"
                                                  :disabled="formOption.disabled"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="linkPosition">
                                    <div>
                                        <el-input size="mini" v-model="scope.row.linkPosition"
                                                  placeholder="请输入联系人职务"
                                                  :disabled="formOption.disabled"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="linkPhone">
                                    <div>
                                        <el-input size="mini" v-model="scope.row.linkPhone"
                                                  placeholder="请输入联系人电话"
                                                  :disabled="formOption.disabled"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="linkEmail">
                                    <div>
                                        <el-input size="mini" v-model="scope.row.linkEmail"
                                                  placeholder="请输入联系人邮箱"
                                                  :disabled="formOption.disabled"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="linkIsMain">
                                    <div>
                                        <el-checkbox size="mini" v-model="scope.row.linkIsMain == 'true' || scope.row.linkIsMain == true? true: false"
                                                     @change="handleLinkManChange(scope.row.$index, scope.row)"
                                                     :disabled="formOption.disabled"></el-checkbox>
                                    </div>
                                </template>
                            </avue-crud>
                        </el-tab-pane>
                        <el-tab-pane label="财务信息" name="third">
                            <br/>
                            <avue-form v-model="dataForm" :option="formOption" ref="form"
                                       class="main-form" :disabled="formOption.disabled"></avue-form>
                        </el-tab-pane>
                        <el-tab-pane label="收货地址" name="fourth">
                            <receive-address v-if="activeName == 'fourth'" :customerName="dataForm.customerName"></receive-address>
                        </el-tab-pane>
                        <el-tab-pane label="预警设置" name="four">
                            <br/>
                            <avue-form v-model="earlyForm" :option="earlyOption" ref="earlyForm"
                                       class="main-form" :disabled="isRead"></avue-form>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="dialogSelectVisible = false">取消</el-button>
                <el-button type="primary" @click="supplierBtn">确定</el-button>
            </div>
        </el-dialog>
        <public-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                         :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                         @handleClose="handleClosePublic"
                         @handleSubmit="handleSubmitPublic"></public-selector>
    </div>
</template>

<script>
    import {batchDel, page as pages, addObj, getObj, putObj,checkName,selectArea} from '@/api/erp/crm/customer/index';
    import {pageAll as getCustomerGrade,pushToMall} from '@/api/erp/crm/customerGrade';
    import {pageAll as getCustomerInfo} from '@/api/erp/crm/customerType';
    import {isPhone, isMobile} from "@/util/validate";
    import {userOption} from '@/util/table';

    export default {
        name: "customerInfo",
        components: {
            'button-bar': () => import('@/components/setting/button_bar'),
            'publicSelector': () => import('@/components/erp/public_selector'),
            'receiveAddress': () => import('./receiveAddress')
        },
        data() {
            return {
                options: [],
                earlyForm:{},
                earlyOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    labelWidth: 180,
                    column: [
                        {
                            label: "收款预警天数",
                            prop: "receiveWarning",
                            span: 12
                        },
                        {
                            label: "开票预警天数",
                            prop: "invoiceWarning",
                            span: 12,
                        }
                    ]
                },
                isRead: false,
                regionCodes: [],
                activeName: 'first',
                dialogSelectVisible: false,
                headers: undefined,
                fileList: undefined,
                isShow: true,
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
                    viewBtn: false,
                },
                defaultSort: {descs: 'create_time'},
                list: [],
                selectedRows: [],
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
                    indexLabel:'序号',
                    menu: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    searchShow: false,
                    searchBtn: true,//搜索显隐按钮
                    searchSpan: 4,
                    showSummary: false,
                    sumColumnList: [
                        {
                            name: "taxPrice",
                            type: "sum"
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        }, {
                            name: "amount",
                            type: "sum"
                        }, {
                            name: "price",
                            type: "sum"
                        }, {
                            name: "purchaseInvoiceQty",
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
                        label: "客户编码",
                        prop: "customerCode",
                        minWidth: 100,
                        search: true,
                        sortable: true,
                        fixed: true,
                        align: 'left',
                    },
                    {
                        label: "客户全称",
                        prop: "customerName",
                        minWidth: 180,
                        search: true,
                        align: 'left',
                    },
                    {
                        label: "客户来源",
                        prop: "type",
                        minWidth: 80,
                        align: 'left',
                        type: 'select',
                        dicData: [
                            {
                                value: '0',
                                label: 'ERP客户'
                            },
                            {
                                value: '1',
                                label: '商城客户'
                            }
                        ],
                        search: true,
                        searchFilterable: true
                    },
                    // {
                    //     label: "客户负责人工号",
                    //     prop: "managerCode",
                    //     minWidth: 120,
                    //     align: 'center',
                    // },
                    {
                        label: "客户负责人姓名",
                        prop: "managerName",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "客户负责人部门",
                        prop: "departName",
                        minWidth: 220,
                        align: 'left',
                    },
                    {
                        label: "联系人",
                        prop: "linkMan",
                        minWidth: 120,
                        align: 'left',
                    },

                    {
                        label: "联系人职务",
                        prop: "linkPosition",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "联系人电话",
                        prop: "linkPhone",
                        minWidth: 120,
                        align: 'left',
                    },
                    {
                        label: "联系人邮箱",
                        prop: "linkEmail",
                        minWidth: 180,
                        align: 'left',
                    },
                    {
                        label: "收款条件",
                        prop: "collectionTerms",
                        minWidth: 120,
                        align: 'left',
                        hide: true
                    },
                    {
                        label: "结算方式",
                        prop: "paymentsMeans",
                        minWidth: 120,
                        align: 'left',
                        hide: true
                    },
                    {
                        label: "创建时间",
                        prop: "crtTime",
                        minWidth: 180,
                        search: true,
                        sortable: true,
                        align: 'left',
                        valueFormat: 'yyyy-MM-dd',
                        format: 'yyyy-MM-dd',
                        type: "daterange",
                        startPlaceholder: '开始时间',
                        endPlaceholder: '结束时间',
                    },
                ],
                dataForm: {},
                rules: {
                    customerName: [
                        {
                            required: true,
                            message: '请输入客户全称',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    managerId: [
                        {
                            required: true,
                            message: '请选择负责人',
                            trigger: 'blur'
                        }
                    ]
                },
                publicTitle: '',
                typeName: '',
                option: [],
                isSingle: true,
                publicVisible: false,
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    labelWidth: 100,
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
                        },
                        {
                            label: "纳税人识别号",
                            prop: "taxpayerNumber",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请输入收纳税人识别号",
                                trigger: "blur"
                            }],
                        },
                        {
                            label: "开票电话",
                            prop: "kpTel",
                            span: 12
                        },
                        {
                            label: "开票地址",
                            prop: "kpAddress",
                            span: 12
                        },
                        {
                            label: "收票人",
                            prop: "spMan",
                            span: 12
                        },
                        {
                            label: "收票电话",
                            prop: "spTel",
                            span: 12
                        },
                        {
                            label: "收票地址",
                            prop: "spAddress",
                            span: 12
                        },
                        {
                            label: "收款条件",
                            prop: "collectionTerms",
                            display: false
                        },
                        {
                            label: "结算方式",
                            prop: "paymentsMeans",
                            display: false
                        },

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
                            label: "客户联系人",
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
                            label: "是否主要联系人   ",
                            prop: "linkIsMain",
                            minwidth: 120,
                            slot: true,
                            align: 'center',
                            renderHeader: (h, { column, $index }) => {
                                return h('div',[
                                    h('span',{
                                        style: {
                                            color: "#ff0000"
                                        }
                                    }, column.label),
                                    h('el-tooltip',{
                                        attrs: {
                                            class: "item",
                                            effect: "dark",
                                            content: '业务单据关联客户时，默认选择主要联系人',
                                            placement: 'top-start'//ele原来样式
                                        },
                                    },[h('img', {
                                        attrs: {
                                            class: "imgTabelItem",
                                            src:'http://hejigy.com.cn/questionMarksBlue.png'
                                        }

                                    })]),
                                ])
                            },
                        },
                    ]
                },
                customerGradeList: [],
                customerTypeList: [],
                customerAttributeList: [],
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
            getCustomerInfo('customer_attribute').then(response => {
                this.customerAttributeList = response.data.data ? response.data.data : [];
            });
            getCustomerInfo('customer_type').then(response => {
                this.customerTypeList = response.data.data ? response.data.data : [];
            });
        },
        updated() {
            this.changeTableHeight(this, 'avue-crud-search', 'tableOption', 40);
        },
        watch: {
            activeName(val) { //监听切换状态-计划单
                if (val == 'second') {
                    if (this.dataForm.items == undefined) {
                        this.handleAddRow();
                        return
                    }
                    if (this.dataForm.items.length < 1) {
                        this.handleAddRow();
                        return
                    }

                }
            },
        },
        methods: {
            tusongBtn(){
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请至少选择一条数据');
                    return false;
                }
                let ids = [];
                let flag = true;
                this.selectedRows.forEach((row) => {
                    if (row.type != 0) {
                        this.vueMessage('warning', '已经是商城客户，不能推送');
                        flag = false;
                    }
                    ids.push(row.id)
                });
                if (flag) {
                    this.$confirm('您正在执行推送操作, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        pushToMall(ids).then((res) => {
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
            handleLinkManChange(index, val) {
                for (let i in this.dataForm.items) {
                    this.dataForm.items[i].linkIsMain = false;
                    this.vueSet(this.dataForm.items, i, this.dataForm.items[i]);
                }
                this.dataForm.items[index].linkIsMain = true;
                this.vueSet(this.dataForm.items, index, this.dataForm.items[index]);
            },
            isCustomerName(){
                if(this.dataForm.customerName && !this.isRead){
                    checkName(this.dataForm.customerName,this.dataForm.id).then(res=>{
                        if(res.data.code != '2000'){
                            this.vueMessage('warning',res.data.msg);
                        }
                    })
                }
            },
            supplierBtn() {
                if (this.dataForm.customerName == undefined || this.dataForm.customerName == '') {
                    this.vueMessage('warning', '请填写客户全称!');
                    return
                }
                if (this.dataForm.managerName == undefined || this.dataForm.managerName == '') {
                    this.vueMessage('warning', '请填写客户负责人!');
                    return
                }
                if (this.dataForm.items && this.dataForm.items.length < 1) {
                    this.vueMessage('warning', '联系人信息不完整');
                    return
                }
                if (this.dataForm.items == undefined) {
                    this.vueMessage('warning', '联系人信息不完整');
                    return
                }
                if (!this.dataForm.items[0].linkMan || !this.dataForm.items[0].linkPhone) {
                    this.vueMessage('warning', '联系人信息不完整');
                    return
                }
                if (this.regionCodes.length > 0) {
                    if(this.regionCodes.length  == 1){
                        this.dataForm.province = this.regionCodes[0];
                        this.dataForm.city = '';
                        this.dataForm.county = '';
                    }
                    if(this.regionCodes.length  == 2){
                        this.dataForm.province = this.regionCodes[0];
                        this.dataForm.city = this.regionCodes[1];
                        this.dataForm.county = '';
                    }
                    if(this.regionCodes.length  == 3){
                        this.dataForm.province = this.regionCodes[0];
                        this.dataForm.city = this.regionCodes[1];
                        this.dataForm.county = this.regionCodes[2];
                    }
                }
                delete  this.dataForm.regionCodes;
                this.dataForm.fullName = this.dataForm.customerName;
                this.dataForm.linkManTableData = this.dataForm.items;
                this.dataForm.receiveWarning = this.earlyForm.receiveWarning || '';
                this.dataForm.invoiceWarning  = this.earlyForm.invoiceWarning || '';
                if (this.dataForm.taxpayerNumber && (this.dataForm.taxpayerNumber.length == 18 || this.dataForm.taxpayerNumber.length == 15)) {
                    if (!this.dataForm.id || this.dataForm.id == undefined) {
                        addObj(this.dataForm).then(response => {
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
                        putObj(this.dataForm.id, this.dataForm).then(response => {
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
                                    message: response.msg,
                                    type: 'warning',
                                    duration: 2000
                                })
                            }
                        })
                    }
                }else{
                    this.vueMessage('warning', '纳税人识别号必须为15位或18位!');
                    return
                }
            },
            handleAddRow() {
                if(this.isRead){
                    return
                }
                let flag = true;
                if (this.dataForm.items == undefined) {
                    this.dataForm.items = [];
                }
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
                };
                this.dataForm.items.push(d);
            },
            handleRemoveRow(item, index) {
                if(this.isRead){
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
            managerClick() {
                this.publicTitle = '请选择客户负责人';
                this.typeName = 'userType';
                this.option = userOption;
                this.isSingle = true;
                this.publicVisible = true;
            },
            handleSelectClose() {
                this.dialogSelectVisible = false;
            },
            handleCellStyle({row, column, rowIndex, columnIndex}) {
                return this.cellStyle(this.tableOption, column.property);
            },
            handleAdd() {
                this.isRead = false;
                this.activeName = 'first';
                this.selectType = '创建客户';
                this.earlyForm = {};
                this.dataForm = {
                    customerName: undefined,
                    fullName: undefined,
                    abbrName: undefined,
                    managerId: this.$store.getters.userInfo.id,
                    managerCode: this.$store.getters.userInfo.no,
                    managerName: this.$store.getters.userInfo.name,
                    website: undefined,
                    fax: undefined,
                    address: undefined,
                    note: undefined,
                    bankName: undefined,
                    bankAccount: undefined,
                    taxpayerNumber: undefined,
                    collectionTerms: undefined,
                    paymentsMeans: undefined,
                    customerGrade: undefined,
                    customerType: undefined,
                    customerAttribute: undefined,
                    kpTel: undefined,
                    kpAddress: undefined,
                    spMan: undefined,
                    spTel: undefined,
                    spAddress: undefined,
                    items: [],
                    regionCodes: [],
                    linkManTableData: [],
                };
                this.regionCodes = [];
                this.handleAddRow();
                getCustomerGrade().then(response => {
                    this.customerGradeList = response.data.data ? response.data.data : [];
                    this.dialogSelectVisible = true;
                });

            },
            //获取数据
            getList(page, params = {}) {
                this.loading = true;
                let queryObj = Object.assign(params, this.listQuery, {page: page.currentPage, limit: page.pageSize});
                queryObj = JSON.parse(JSON.stringify(queryObj));
                let select = pages;
                if (queryObj.billDate && queryObj.billDate !== undefined && queryObj.billDate.length > 0) {
                    queryObj.startBillDate = queryObj.billDate[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.billDate[1] + ' 23:59:59';
                    delete queryObj.billDate;
                }
                if (queryObj.crtTime && queryObj.crtTime !== undefined && queryObj.crtTime.length > 0) {
                    queryObj.startBillDate = queryObj.crtTime[0] + ' 00:00:00';
                    queryObj.endBillDate = queryObj.crtTime[1] + ' 23:59:59';
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
            //编辑
            handleEdit(type) {
                if (this.selectedRows.length < 1) {
                    this.vueMessage('warning', '请选择要编辑的条目');
                    return false;
                } else if (this.selectedRows.length > 1) {
                    this.vueMessage('warning', '只能编辑一个条目');
                    return false;
                }
                if(type=="view"){
                    this.isRead = true;
                }else{
                    this.isRead = false;
                }
                this.selectType = '编辑客户';
                getObj(this.selectedRows[0].id)
                    .then(response => {
                        this.dataForm = response.data.data;
                        this.regionCodes = [];
                        if(this.dataForm.province && this.dataForm.province != ''){
                            this.regionCodes.push(this.dataForm.province)
                        }
                        if(this.dataForm.city && this.dataForm.city != ''){
                            this.regionCodes.push(this.dataForm.city)
                        }
                        if(this.dataForm.county && this.dataForm.county != ''){
                            this.regionCodes.push(this.dataForm.county)
                        }
                        this.dataForm.items = response.data.data.linkManTableData;
                        this.earlyForm.receiveWarning = this.dataForm.receiveWarning;
                        this.earlyForm.invoiceWarning = this.dataForm.invoiceWarning;
                    });
                this.activeName = 'first';
                getCustomerGrade().then(val => {
                    this.customerGradeList = val.data.data ? val.data.data : [];
                    this.dialogSelectVisible = true;
                });

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
        }
    }
</script>

<style scoped lang="scss">
    .dialog-footer {
        padding: 15px 20px 10px;
        text-align: right;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>
