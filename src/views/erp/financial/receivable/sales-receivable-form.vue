<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"   :class="type == 'view'?'main-form main-form-view':'main-form main-form-select'"
                           class="main-form" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="operationType">
                        <div>
                            <el-select v-model="formData.operationType" @change="handleReceiveMethodsChange"
                                       :disabled="type == 'view'? true : false">
                                <el-option :value="'0'" label="收款"></el-option>
                                <el-option :value="'1'" label="退款"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="receiveMethod">
                        <div>
                            <el-select v-model="formData.receiveMethod" @change="handleReceiveMethodChange"
                                       :disabled="type == 'view'? true : false">
                                <el-option :value="formData.operationType == '0'?'0':'2'" :label="formData.operationType == '0'? '按单收款':'按单退款'"></el-option>
                                <el-option :value="formData.operationType == '0'?'1':'3'" :label="formData.operationType == '0'? '普通收款':'普通退款'"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <div style="position: relative">
                            <h3 style="position: absolute;left: 10px">订单明细</h3>
                        <div style="display: flex;flex-direction: row;justify-content: flex-end;margin-right: 10px;padding-top: 20px" v-if="formData.receiveMethod == '1'">
                            <a :href="openUrl+'/api/manager/sales-collections/downTemplate'" style="color: #409EFF;margin-right: 10px;">
                            <el-button type="text">
                                <img src="https://hejigy.com.cn/mobanxiaz.png" alt="" style="margin-right: 3px;"/>
                                下载导入模板
                            </el-button>
                            </a>
                            <el-upload class="upload" action="/api/manager/sales-collections/import" :before-upload="beforeUpload"
                                       :on-remove="handleRemove" :show-file-list="false"
                                       :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                                       style="display:inline;" :on-success="uploadCompleted" :headers="headers">
                                <el-button type="text" icon="el-icon-download">
                                    导入
                                </el-button>
                            </el-upload>
                        </div>
                        <avue-crud v-if="isShow" :option="itemsOptions" :data="formData.items"   :class="type == 'view'?'':'main-form-items'">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="customerName">
                                <div @click="customerBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.customerName" placeholder="请选择客户" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="sourceBillNo">
                                <div @click="orderBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.sourceBillNo" placeholder="请选择订单" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amountFormer">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.amountFormer" placeholder="请输入金额"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="receiveDate">
                                <div class="zLeftClass">
                                    <el-date-picker v-model="scope.row.receiveDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择到款金额" :disabled="type=='view'?true:false">
                                    </el-date-picker>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                        </div>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <task-history v-if="processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>

            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :selectType="formData.operationType == '1' && formData.receiveMethod == '2'?6:formData.operationType == '0' || formData.receiveMethod == '0'? 5 : 1"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {
        getBill,
        getHistoryBill,
        addBill,
        tempAddBill,
        auditBill
    } from "@/api/erp/financial/financialSalesReceivables";
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';
    import {customerOption, sellOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    import {openUrl} from '@/config/env';

    export default {
        name: "sales-receivable-form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                fileList: undefined,
                headers: undefined,
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 3600 * 1000 * 24;
                    },
                },
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column: [
                        {
                            label: "单据编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span: 4,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                },
                            }
                        },
                        {
                            label: "收款账户",
                            prop: "receiveAccount",
                            span: 5,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/financial-bank-account/pageAll',
                            props: {
                                value: 'accountCode',
                                label: 'name'
                            },
                            rules: [{
                                required: true,
                                message: "请选择收款账户",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "结算方式",
                            prop: "paymentsMeans",
                            span: 5,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/payments-means/pageAll',
                            props: {
                                value: 'value',
                                label: 'label'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择结算方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "操作类型",
                            prop: "operationType",
                            span: 5,
                            type: 'select',
                            dicData: [
                                {
                                    value: '0',
                                    label: '收款'
                                },
                                {
                                    value: '1',
                                    label: '退款'
                                }
                            ],

                            formslot: true,
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择操作类型",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "收款方式",
                            prop: "receiveMethod",
                            span: 5,
                            type: 'select',
                            formslot: true,
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择收款方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: '附件上传',
                            prop: 'files',
                            type: 'upload',
                            loadText: '附件上传中，请稍等',
                            span: 24,
                            propsHttp: {
                                res: 'data'
                            },
                            action: '/api/manager/storage/create'
                        },
                        {
                            label: "备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24
                        },
                        {
                            prop: "items",
                            type: "dynamic",
                            span: 24,
                            formslot: true
                        },
                    ]
                },
                itemsOptions: {
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    height: 'auto',
                    calcHeight: 350,
                    column: [],
                },
                itemsOneOption: [
                    {
                        label: "操作",
                        prop: "operate",
                        fixed: true,
                        align: 'center',
                        width: 80,
                        slot: true,
                    },
                    {
                        label: "客户编号",
                        prop: "customerCode",
                        placeholder: ' ',
                        width: 100,
                        overHidden:true,
                        align: "left",
                        readonly: true,
                        disabled: true,
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        minWidth: 190,
                        overHidden:true,
                        align: 'left',
                        slot: true,
                    },
                    {
                        label: "客户负责人",
                        prop: "managerName",
                        placeholder: ' ',
                        width: 100,
                        overHidden:true,
                        align: "left",
                    },
                    {
                        label: "销售部门",
                        prop: "departName",
                        placeholder: ' ',
                        minWidth: 190,
                        overHidden:true,
                        readonly: true,
                        disabled: true,
                        align: "left",
                    },
                    {
                        label: "收(退)款金额",
                        prop: "amountFormer",
                        placeholder: ' ',
                        minWidth: 140,
                        overHidden:true,
                        align: 'right',
                        slot: true,
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "收(退)款金额"
                            );
                        },
                    },
                    {
                        label: "收(退)款日期",
                        prop: "receiveDate",
                        minWidth: 160,
                        overHidden:true,
                        align: 'left',
                        slot: true,
                    },
                    {
                        label: "备注",
                        prop: "note",
                        minWidth: 120,
                        overHidden:true,
                        align: 'left',
                        slot: true,
                    },
                ],
                itemsTwoOption: [
                    {
                        label: "操作",
                        prop: "operate",
                        fixed: true,
                        align: 'center',
                        width: 80,
                        slot: true,
                    },
                    {
                        label: "订单编号",
                        prop: "sourceBillNo",
                        width: 170,
                        align: 'left',
                        slot: true,
                    },
                    {
                        label: "客户编号",
                        prop: "customerCode",
                        placeholder: ' ',
                        width: 180,
                        align: "left",
                        readonly: true,
                        disabled: true,
                    },
                    {
                        label: "客户名称",
                        prop: "customerName",
                        width: 180,
                        align: 'left',
                    },
                    {
                        label: "客户负责人",
                        prop: "managerName",
                        placeholder: ' ',
                        width: 120,
                        align: "left",
                    },
                    {
                        label: "销售部门",
                        prop: "departName",
                        placeholder: ' ',
                        width: 200,
                        readonly: true,
                        disabled: true,
                        align: "left",
                    },
                    {
                        label: "订单金额",
                        prop: "billAmount",
                        width: 160,
                        align: 'right',
                    },
                    {
                        label: "收(退)金额",
                        prop: "amountFormer",
                        placeholder: ' ',
                        width: 160,
                        slot: true,
                        align: 'right',
                        renderHeader: h => {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: "#ff0000"
                                    }
                                },
                                "收(退)金额"
                            );
                        },
                    },
                    {
                        label: "收(退)款日期",
                        prop: "receiveDate",
                        width: 180,
                        align: 'left',
                        slot: true,
                    },
                    {
                        label: "备注",
                        prop: "note",
                        width: 180,
                        align: 'left',
                        slot: true,
                    },
                ],
                option: [],
            };
        },
        mounted() {
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            }
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
            this.changeFormWidth(this, 'formOption');
            window.addEventListener('resize', this.changeMaxHeight.bind(this, 'auto'));
        },
        destroyed() {
            window.removeEventListener("resize", this.changeMaxHeight);
        },
        updated() {
            this.changeMaxHeight();
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            uploadCompleted(response, file, fileList) {
                const dataMap = this.dataMap(this.formData.items, response.data);
                if (dataMap.length > 0) {
                    this.vueMessage('warning', '客户编码(' + dataMap.join(",") + ')已有相同的客户信息，不能重复添加');
                    return;
                }
                for (var index in response.data) {
                    var item = response.data[index];
                    var itemObj = {};
                    itemObj.customerId = item.id;
                    itemObj.customerCode = item.customerCode;
                    itemObj.customerName = item.customerName;
                    itemObj.departName = item.departName;
                    itemObj.managerId = item.managerId;
                    itemObj.managerName = item.managerName;
                    itemObj.amountFormer = item.amountFormer;
                    itemObj.receiveDate = new Date().toLocaleDateString().replace(/\//g, '-'),
                    this.formData.items.push(itemObj);
                    this.$nextTick(() => {
                        //清除没有商品ID的数据
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                    });
                }
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
            handleReceiveMethodsChange(){
                for(let i in this.formOption.column){
                    if(this.formOption.column[i].prop == 'receiveMethod'){
                        this.formOption.column[i].label = this.formData.operationType == '0'?'收款方式':'退款方式';
                    }

                }

                this.formData.items = [
                    {
                        customerCode: '',
                        receiveDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                    }
                ];
                if (this.formData.operationType == '0') {
                    if (this.formData.receiveMethod == '0' || this.formData.receiveMethod == '2') {
                        this.formData.receiveMethod = '0';
                    }else{
                        this.formData.receiveMethod = '1';
                    }
                }else{
                    if (this.formData.receiveMethod == '1' || this.formData.receiveMethod == '3') {
                        this.formData.receiveMethod = '3';
                    }else{
                        this.formData.receiveMethod = '2';
                    }
                }

            },
            handleReceiveMethodChange() {
                this.isShow = false;
                this.$nextTick(() => {
                    //清除没有商品ID的数据
                    this.itemsOptions.column = [];
                    if (this.formData.receiveMethod == '0' || this.formData.receiveMethod == '2') {
                        this.itemsOptions.column = this.itemsTwoOption;
                    }
                    if (this.formData.receiveMethod == '1'|| this.formData.receiveMethod == '3') {
                        this.itemsOptions.column = this.itemsOneOption;
                    }
                    if (this.type.indexOf('add') > -1 || (this.type == 'edit' && this.formData.items.length < 1)) {
                        this.formData.items = [
                            {
                                customerCode: '',
                                receiveDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            }
                        ];
                    }
                    this.isShow = true;
                    if (this.type && this.type == 'view') {
                        this.itemsOptions.column[0].hide = true;
                        this.itemsOptions.disabled = true;
                    } else {
                        this.itemsOptions.column[0].hide = false;
                        this.itemsOptions.disabled = false;
                    }

                });
            },
            customerBtn() {
                this.publicTitle = '请选择客户';
                this.typeName = 'customerType';
                this.option = customerOption;
                this.isSingle = true;
                this.publicVisible = true;
            },
            orderBtn() {
                this.publicTitle = '请选择订单';
                this.typeName = 'sellType';
                this.option = sellOption;
                this.isSingle = false;
                this.publicVisible = true;
            },
            handleAddRow() {
                const d = {
                    customerCode: '',
                }
                this.formData.items.push(d);
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.customerCode == item.customerCode) {
                            map.push(obj.customerCode);
                        }
                    })
                });
                return map;
            },
            dataMaps(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.billNo == item.billNo) {
                            map.push(obj.customerCode);
                        }
                    })
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '客户编码(' + dataMap.join(",") + ')已有相同的客户信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.customerId = item.id;
                            itemObj.customerCode = item.customerCode;
                            itemObj.customerName = item.customerName;
                            itemObj.departName = item.departName;
                            itemObj.managerId = item.managerId;
                            itemObj.managerName = item.managerName;
                            itemObj.receiveDate = new Date().toLocaleDateString().replace(/\//g, '-'),
                                this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow()
                        });
                    }
                    if (this.typeName == 'sellType') {
                        const dataMap = this.dataMaps(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '订单编号(' + dataMap.join(",") + ')已有相同的订单信息，不能重复添加');
                            return;
                        }
                        console.log(list);
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.billNo = item.billNo;
                            itemObj.customerId = item.customerId;
                            itemObj.customerCode = item.customerCode;
                            itemObj.customerName = item.customerName;
                            itemObj.departName = item.departName;
                            itemObj.managerId = item.salerId;
                            itemObj.managerName = item.salerName;
                            itemObj.billAmount = item.taxBillAmount;
                            itemObj.receiveDate = new Date().toLocaleDateString().replace(/\//g, '-'),
                                this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow()
                        });
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.publicVisible = false;
            },
            reload() {
                this.loading = true;
                setTimeout(() => {
                    this.isShow = false;
                    this.$nextTick(() => {
                        this.init();
                        this.isShow = true;
                    })
                }, 17)
            },
            changeMaxHeight(type) {
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                for(let i in this.formOption.column) {
                        if (this.formOption.column[i].prop == 'receiveAccount' || this.formOption.column[i].prop == 'paymentsMeans'|| this.formOption.column[i].prop == 'files') {
                            this.formOption.column[i].readonly = false;
                            this.formOption.column[i].disabled = false;
                        }
                }
                this.processId = '';
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    for(let i in this.formOption.column){
                        if(this.formOption.column[i].prop == 'receiveMethod'){
                            this.formOption.column[i].label = '收款方式';
                        }
                    }
                    let formData = {
                        operationType: '0',
                        receiveMethod: '1',
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [
                            {
                                customerCode: '',
                                receiveDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                            }
                        ]
                    };
                    this.$nextTick(() => {
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.handleReceiveMethodChange();
                    this.loading = false;
                }


            },
            //新增
            handleAdd() {
                this.handleBillAdd(this,{path: '/sales-receivable-form', name: '收款单制单'});
            },
            getProcessId(billPrefix) {
                getProcessId({
                    billPrefix: billPrefix
                }).then(response => {
                    if (response != null && response != '') {
                        this.processId = response.data;
                    }
                });
            },
            async handleAuditBill(val) {
                this.formData.taskMap = {
                    step: this.step,
                    opinion: val,
                    comment: this.comment
                };
                let sum = await this.auditBill(this, 'formData', auditBill);

                if (sum.data.code == '2000') {
                    this.clocseCurrent(this, this.$route);
                    this.$router.push({
                        path: '/taskNowList',
                        name: '待办任务',
                        meta: {
                            i18n: 'taskNowList'
                        },
                        query: {
                            timeStamp: new Date().getTime()
                        },
                    });
                    this.isAgreeLoading = false;
                    this.isRejectLoading = false;
                    this.init();

                }
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        res.data.data.paymentsMeans = Number(res.data.data.paymentsMeans);
                        let formData = res.data.data;
                        this.formData = formData;
                        for(let i in this.formOption.column){
                            if(this.formOption.column[i].prop == 'receiveMethod'){
                                this.formOption.column[i].label = this.formData.operationType == '0'?'收款方式':'退款方式';
                            }
                            if(this.type == 'view'){
                                if(this.formOption.column[i].prop == 'receiveAccount' || this.formOption.column[i].prop == 'paymentsMeans'|| this.formOption.column[i].prop == 'files'){
                                    this.formOption.column[i].readonly = true;
                                    this.formOption.column[i].disabled = true;
                                }
                            }
                        }

                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        this.getProcessId(billPrefix);
                        this.handleReceiveMethodChange();
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/sales-receivable-form',
                            name: '收款单制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            }
                        });
                        this.$refs.billContainer.refreshId(this.formData.id);
                    }

                }).catch(() => {
                    this.loading = false;
                });
            },
            handleGetHistoryBill(type) {
                this.handleGetBill(getHistoryBill, {id: this.formData.id, type: type}, 'historyBill');
            },
            //清除没有客户customerCode的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].customerCode)) {
                        items.splice(i, 1);
                    }
                }
                return items;
            },
            handleCheckItemFuc() {
                if (this.formData.items.length == 0) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                var items = this.formData.items;
                var flag = true;
                for (var i in items) {
                    if (this.formData.receiveMethod == '0') {
                        if (!this.isEmpty(items[i].sourceBillNo)) {
                            flag = false;
                            if (this.isEmpty(items[i].sourceBillNo)) {
                                this.vueMessage('warning', '第' + (i * 1 + 1) + '行的订单编号为必填项');
                                return false;
                            }
                            if (this.isEmpty(items[i].customerName)) {
                                this.vueMessage('warning', '第' + (i * 1 + 1) + '行的客户名称为必填项');
                                return false;
                            }
                            if (this.isEmpty(items[i].amountFormer)) {
                                this.vueMessage('warning', '第' + (i * 1 + 1) + '行的收(退)款金额为必填项');
                                return false;
                            }
                        }
                    } else {
                        if (!this.isEmpty(items[i].customerCode)) {
                            flag = false;
                            if (this.isEmpty(items[i].customerName)) {
                                this.vueMessage('warning', '第' + (i * 1 + 1) + '行的客户名称为必填项');
                                return false;
                            }
                            if (this.isEmpty(items[i].amountFormer)) {
                                this.vueMessage('warning', '第' + (i * 1 + 1) + '行的收(退)款金额为必填项');
                                return false;
                            }
                        }
                    }

                }

                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                return true;
            },
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                //this.init();
                                this.$router.push({
                                    path: '/sales-receivable',
                                    name: '收款单',
                                    meta: {
                                        i18n: 'sales-receivable'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });

                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.data.msg
                                });
                            }
                        }, error => {
                            this.preventRepeatSubmit(false, type);
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    .main-form-view{
        .el-upload{
            .el-button--primary{
                display: none;
            }
        }
    }
</style>
