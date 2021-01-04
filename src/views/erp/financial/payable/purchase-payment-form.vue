<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content:unset ">
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
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0">No.{{formDataN.billNo}}</h3>
            </div>

            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           :class="type == 'view'?'main-form main-form-view':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="operationType">
                        <div>
                            <el-select v-model="formData.operationType" @change="handleReceiveMethodsChange"
                                       :disabled="type == 'view'? true : false">
                                <el-option :value="'0'" label="付款"></el-option>
                                <el-option :value="'1'" label="退款"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="paymentForm">
                        <div>
                            <el-select v-model="formData.paymentForm" :disabled="type == 'view'? true : false">
                                <el-option :value="formData.operationType == '0'?'0':'2'"
                                           :label="formData.operationType == '0'?'直接付款':'直接退款'"></el-option>
                                <el-option :value="formData.operationType == '0'?'1':'3'"
                                           :label="formData.operationType == '0'?'预付款':'预退款'"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="paymentMethod">
                        <div>
                            <el-select v-model="formData.paymentMethod" @change="handleMethodChange"
                                       :disabled="type=='view'?true:false">
                                <el-option :label="formData.operationType == '0'?'按单付款':'按单退款'"
                                           :value="formData.operationType == '0'?'0':'2'"></el-option>
                                <el-option :label="formData.operationType == '0'?'普通付款':'普通退款'"
                                           :value="formData.operationType == '0'?'1':'3'"></el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="payAmount">
                        <div>
                            <el-input v-model="formData.payAmount" placeholder="请输入付款金额"
                                      :readonly="formData.paymentMethod=='0'?true:false"
                                      :disabled="type=='view'?true:false"></el-input>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items"
                                   v-if="formData.paymentMethod=='0' || formData.paymentMethod=='2'?true:false"
                                   :class="type == 'view'?'':'main-form-items'">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>

                            <template slot-scope="scope" slot="operate">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow(true)"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="sourceBillNo">
                                <div @click="sourceBillNoBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.sourceBillNo" placeholder="请选择关联单据" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="thisPaymentAmount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.thisPaymentAmount" placeholder="请输入本次付款"
                                              @blur="thisPaymentAmountBlur(scope.row.$index,scope.row.thisPaymentAmount)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :code="formData.supplierId"
                            :selectType="formData.operationType == '1' && formData.paymentMethod == '2' ? 2 : 1"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, auditBill} from "@/api/erp/purchase/bill/purchasePayment";
    import {purchaseOption, ordersOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "purchase-payment-form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                isSingle: true,
                isShow: true,
                loading: false,
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
                            label: "供应商编号",
                            prop: "supplierCode",
                            display: false
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span:6,
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
                            label: "操作类型",
                            prop: "operationType",
                            span: 6,
                            type: 'select',
                            dicData: [
                                {
                                    value: '0',
                                    label: '付款'
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
                            label: "付款形式",
                            prop: "paymentForm",
                            span: 6,
                            type: 'select',
                            formslot: true,
                            dicData: [
                                {
                                    value: '0',
                                    label: '直接付款'
                                },
                                {
                                    value: '1',
                                    label: '预付款'
                                }
                            ],
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择付款方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "付款账户",
                            prop: "payAccount",
                            span: 6,
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
                            label: "供应商",
                            prop: "supplierName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            suffixIcon: 'el-icon-search',
                            placeholder: '请选择供应商',
                            rules: [{
                                required: true,
                                message: "请选择供应商",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择供应商';
                                this.typeName = 'purchaseType';
                                this.option = purchaseOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "开户银行",
                            prop: "bankName",
                            span: 6,
                            disabled: true,
                        },
                        {
                            label: "银行账户",
                            prop: "bankAccount",
                            span: 6,
                            disabled: true,
                        },
                        {
                            label: "付款方式",
                            prop: "paymentMethod",
                            span: 6,
                            type: 'select',
                            formslot: true,
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择付款方式",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "结算方式",
                            prop: "paymentsMeans",
                            span: 12,
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
                            label: "付款金额",
                            prop: "payAmount",
                            span: 12,
                            rules: [{
                                required: true,
                                message: "请选择付款金额",
                                trigger: "change"
                            }],
                            formslot: true,
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
                itemsOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
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
                            label: "关联单据",
                            prop: "sourceBillNo",
                            width: 140,
                            overHidden:true,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "单据日期",
                            prop: "sourceBillDate",
                            placeholder: ' ',
                            minWidth: 140,
                            overHidden:true,
                            align: "left",
                        },
                        {
                            label: "应付",
                            prop: "applyAmount",
                            placeholder: ' ',
                            minWidth: 160,
                            overHidden:true,
                            readonly: true,
                            disabled: true,
                            align: "right",
                        },
                        {
                            label: "已付金额",
                            prop: "paymentAmount",
                            placeholder: ' ',
                            minWidth: 160,
                            overHidden:true,
                            readonly: true,
                            disabled: true,
                            align: "right",
                        },
                        {
                            label: "本次付款",
                            prop: "thisPaymentAmount",
                            placeholder: ' ',
                            minWidth: 160,
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
                                    "本次付款"
                                );
                            }
                        },
                    ]
                },
                option: [],
            };
        },
        mounted() {
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
        methods: {
            handleReceiveMethodsChange() {
                for(let i in this.formOption.column){
                    if(this.formOption.column[i].prop == 'paymentMethod'){
                        this.formOption.column[i].label = this.formData.operationType == '0' ? '付款方式' : '退款方式';
                        this.formOption.column[i].placeholder = this.formData.operationType == '0' ? '请选择付款方式' : '请选择退款方式';
                    }
                    if(this.formOption.column[i].prop == 'paymentForm'){
                        this.formOption.column[i].label = this.formData.operationType == '0' ? '付款形式' : '退款形式';
                        this.formOption.column[i].placeholder = this.formData.operationType == '0' ? '请选择付款形式' : '请选择退款形式';
                    }

                }
                this.formData.items = [
                    {
                        customerCode: '',
                        receiveDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                    }
                ];
                if (this.formData.operationType == '0') {
                    if (this.formData.paymentForm != '' && this.formData.paymentForm != undefined) {
                        if (this.formData.paymentForm == '2') {
                            this.formData.paymentForm = '0';
                        }
                        if (this.formData.paymentForm == '3') {
                            this.formData.paymentForm = '1';
                        }
                    }

                    if (this.formData.paymentMethod == '0' || this.formData.paymentMethod == '2') {
                        this.formData.paymentMethod = '0';
                    } else {
                        this.formData.paymentMethod = '1';
                    }
                } else {
                    if (this.formData.paymentForm != '' && this.formData.paymentForm != undefined) {
                        if (this.formData.paymentForm == '0') {
                            this.formData.paymentForm = '2';
                        }
                        if (this.formData.paymentForm == '1') {
                            this.formData.paymentForm = '3';
                        }
                    }
                    if (this.formData.paymentMethod == '1' || this.formData.paymentMethod == '3') {
                        this.formData.paymentMethod = '3';
                    } else {
                        this.formData.paymentMethod = '2';
                    }
                }
            },
            thisPaymentAmountBlur(index, val) {
                if (isNaN(val)) {
                    this.formData.items[index].thisPaymentAmount = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                } else {
                    let sum = (this.formData.items[index].taxBillAmount * 1 - this.formData.items[index].paymentAmount * 1).toFixed(this.sysParam.amountDecimal);
                    if (sum < val) {
                        this.vueMessage('warning', '本次输入金额不能超出剩余应付金额!');
                        this.formData.items[index].thisPaymentAmount = sum;
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                    let price = 0;
                    for (let i in this.formData.items) {
                        price = (price * 1 + this.formData.items[i].thisPaymentAmount * 1).toFixed(this.sysParam.amountDecimal);
                    }
                    this.formData.payAmount = price;
                }
            },
            sourceBillNoBtn() {
                if (this.type != 'view') {
                    if (!this.formData.supplierId) {
                        this.vueMessage('warning', '请先选择供应商!');
                        return
                    }
                    this.publicTitle = '请选择关联单据';
                    this.typeName = 'purchasesTypes';
                    this.option = ordersOption;
                    this.isSingle = false;
                    this.publicVisible = true;
                }

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
                        if (obj.billNo == item.billNo) {
                            map.push(obj.billNo);
                        }
                    })
                });
                return map;
            },
            handleMethodChange(val) {
                this.formData.thisPaymentAmount = '';
                this.formData.items = [{}];
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'purchaseType') {
                        this.formData.supplierId = list[0].id;
                        this.formData.supplierName = list[0].supplierName;
                        this.formData.supplierCode = list[0].supplierCode;
                        this.formData.bankName = list[0].bankName;
                        this.formData.bankAccount = list[0].bankAccount;
                        this.formData.items = [{}];
                    }
                    if (this.typeName == 'purchasesTypes') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '关联单据(' + dataMap.join(",") + ')已有相同的单据信息，不能重复添加');
                            return;
                        }
                        let price = 0;
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceBillId = item.id;
                            itemObj.sourceBillDate = item.billDate;
                            itemObj.sumOfAdvance = 0;
                            itemObj.paymentAmount = item.paymentAmount;
                            itemObj.applyAmount = item.taxBillAmount;
                            itemObj.thisPaymentAmount = (item.taxBillAmount * 1 - item.paymentAmount).toFixed(this.sysParam.amountDecimal);
                            price = (price * 1 + itemObj.thisPaymentAmount * 1).toFixed(this.sysParam.amountDecimal);
                            this.formData.items.push(itemObj);
                        }
                        this.formData.payAmount = price;
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
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
                const index = this.itemsOption.column.findIndex(item => item.prop == 'items');
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.itemsOption.column)), 40);
                // this.itemsOption.column[index].children.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                for(let i in this.formOption.column) {
                    if (this.formOption.column[i].prop == 'files') {
                        this.formOption.column[i].readonly = false;
                        this.formOption.column[i].disabled = false;
                    }
                }
                this.processId = '';
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    for(let i in this.formOption.column){
                        if(this.formOption.column[i].prop == 'paymentMethod'){
                            this.formOption.column[i].label = '付款方式';
                            this.formOption.column[i].placeholder = '请选择付款方式';
                        }
                        if(this.formOption.column[i].prop == 'paymentForm'){
                            this.formOption.column[i].label = '付款形式';
                            this.formOption.column[i].placeholder = '请选择付款形式';
                        }

                    }
                    let formData = {
                        operationType: '0',
                        paymentMethod: '0',
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
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.handleBillAdd(this, {path: '/purchase-payment-form', name: '付款单制单'});
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
                        let formData = res.data.data;
                        formData.paymentsMeans = parseInt(formData.paymentsMeans);
                        this.formData = formData;
                        for(let i in this.formOption.column){
                            if(this.formOption.column[i].prop == 'paymentMethod'){
                                this.formOption.column[i].label = this.formData.operationType == '0' ? '付款方式' : '退款方式';
                                this.formOption.column[i].placeholder = this.formData.operationType == '0' ? '请选择付款方式' : '请选择退款方式';
                            }
                            if(this.formOption.column[i].prop == 'paymentForm'){
                                this.formOption.column[i].label = this.formData.operationType == '0' ? '付款形式' : '退款形式';
                                this.formOption.column[i].placeholder = this.formData.operationType == '0' ? '请选择付款形式' : '请选择退款形式';
                            }
                            if(this.type == 'view'){
                                if(this.formOption.column[i].prop == 'files'){
                                    this.formOption.column[i].readonly = true;
                                    this.formOption.column[i].disabled = true;
                                }
                            }

                        }
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/purchase-payment-form',
                            name: '付款单制单',
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
            //清除没有billNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].sourceBillNo)) {
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
                    if (!this.isEmpty(items[i].sourceBillNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].thisPaymentAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的本次付款为必填项');
                            return false;
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
                if (this.formData.paymentMethod == '0') {
                    if (!this.handleCheckItemFuc()) {
                        return;
                    }
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : addBill;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/purchase-payment',
                                    name: '付款单',
                                    meta: {
                                        i18n: 'purchase-payment'
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
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
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
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
