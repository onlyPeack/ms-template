<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handleAdd="handleAdd"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>

            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="registerType">
                        <el-select v-model="formData.registerType"
                                   :disabled="type=='view'?true:false">
                            <el-option
                                    v-for="item in registerTypeOptions"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items"   :class="type == 'view'?'':'main-form-items'">
                            <template slot-scope="scope" slot="operate">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="accountCode">
                                <div @click="popupSelect(scope.row,scope.row.$index,'accountCode')">
                                    <el-input v-model="scope.row.accountCode" placeholder="请选择账户" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="salerName">
                                <div @click="popupSelect(scope.row,scope.row.$index,'salerName')">
                                    <el-input v-model="scope.row.salerName" placeholder="请选择操作员" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="subjectName">
                                <div @click="popupSelect(scope.row,scope.row.$index,'subjectName')">
                                    <el-input v-model="scope.row.subjectName" placeholder="请选择科目名称" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="userName">
                                <div @click="popupSelect(scope.row,scope.row.$index,'userName')">
                                    <el-input v-model="scope.row.userName" placeholder="请选择报销人" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="registerAmount">
                                <div>
                                    <el-input v-model="scope.row.registerAmount" placeholder="请输入登记金额"
                                              @blur="thisPaymentAmountBlur(scope.row.$index,scope.row.registerAmount)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input v-model="scope.row.note" placeholder="请输入备注"
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
            <task-history v-if="processId && processId!='' && taskType=='now'" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block;margin-bottom: 60px;">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :code="formData.supplierId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill,auditBill} from "@/api/erp/financial/feeRegisterService";
    import {userOption, bankAccountOption, subjectOption, capitalAccountOption,customerOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    import {getTypeValue,pageAll} from '@/api/dict/dictValue/index';
    import {getSelfCompany} from "@/api/admin/company";

    export default {
        name: "financialFeeRegisterForm",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                selectIndex: 0,
                registerTypeOptions: [],
                makeAccountTypeOptions: [],
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
                            disabled: true,
                            placeholder: "自动生成",
                            span:6
                        },
                        {
                            label: "单据编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span: 6,
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
                            label: "登记单位",
                            prop: "companyName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            disabled: true,
                            clearable: false,
                        },
                        {
                            label: "登记类型",
                            prop: "registerType",
                            span: 6,
                            formslot: true,
                            rules: [{
                                required: true,
                                message: "请选择登记类型",
                                trigger: "change"
                            }]
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
                    menu: false,
                    border: true,
                    index: true,
                    height: 'auto',
                    calcHeight: 350,
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
                            label: "账户",
                            prop: "accountCode",
                            placeholder: ' ',
                            width: 180,
                            align: "left",
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#F56C6C"
                                        }
                                    },
                                    "账户"
                                );
                            }
                        },
                        {
                            label: "账户名称",
                            prop: "accountName",
                            placeholder: ' ',
                            align: 'left',
                            width: 180,
                            readonly: true,
                        },
                        // {
                        //     label: "操作员Id",
                        //     prop: "salerId",
                        //     hide: true,
                        // },
                        // {
                        //     label: "操作员编号",
                        //     prop: "salerCode",
                        //     hide: true,
                        // },
                        // {
                        //     label: "操作员",
                        //     prop: "salerName",
                        //     placeholder: ' ',
                        //     width: 160,
                        //     align: "left",
                        //     slot: true,
                        //     renderHeader: h => {
                        //         return h(
                        //             "span",
                        //             {
                        //                 style: {
                        //                     color: "#F56C6C"
                        //                 }
                        //             },
                        //             "操作员"
                        //         );
                        //     }
                        // },
                        // {
                        //     label: "操作员部门",
                        //     prop: "salerDepartName",
                        //     placeholder: ' ',
                        //     align: 'left',
                        //     width: 160,
                        //     readonly: true,
                        // },
                        {
                            label: "科目编号",
                            prop: "subjectCode",
                            placeholder: ' ',
                            width: 180,
                            align: "left",
                        },
                        {
                            label: "科目名称",
                            prop: "subjectName",
                            placeholder: ' ',
                            align: 'left',
                            width: 180,
                            readonly: true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "科目名称"
                                );
                            }
                        },
                        {
                            label: "报销人",
                            prop: "userName",
                            placeholder: ' ',
                            width: 180,
                            readonly: true,
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "报销人"
                                );
                            }
                        },
                        {
                            label: "登记金额",
                            prop: "registerAmount",
                            placeholder: ' ',
                            width: 180,
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
                                    "登记金额"
                                );
                            }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 80,
                            align: 'left',
                            slot: true,
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
            popupSelect(item, index, type) {
                if (this.type != 'view') {
                    if (type == 'accountCode') {
                        this.publicTitle = '请选择账户';
                        this.typeName = 'bankAccountType';
                        this.option = bankAccountOption;
                        this.selectIndex = index;
                        this.isSingle = true;
                        this.publicVisible = true;
                    }
                    if (type == 'salerName') {
                        this.publicTitle = '请选择操作员';
                        this.typeName = 'userType';
                        this.selectIndex = index;
                        this.option = userOption;
                        this.isSingle = true;
                        this.publicVisible = true;
                    }
                    if (type == 'subjectName') {
                        this.publicTitle = '请选择科目';
                        this.typeName = 'subjectType';
                        this.selectIndex = index;
                        this.option = subjectOption;
                        this.isSingle = true;
                        this.publicVisible = true;
                    }
                    if (type == 'userName') {
                        this.publicTitle = '请选择报销人';
                        this.typeName = 'userType';
                        this.selectIndex = index;
                        this.option = userOption;
                        this.selectIndex = index;
                        this.isSingle = true;
                        this.publicVisible = true;
                    }
                }

            },
            thisPaymentAmountBlur(index, val) {
                if (isNaN(val)) {
                    this.formData.items[index].thisPaymentAmount = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
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
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    if (this.typeName == 'capitalAccountType') {
                        this.formData.items[this.selectIndex].userName = list[0].name;
                        this.formData.items[this.selectIndex].userCode = list[0].accountCode;
                        this.vueSet(this.formData.items, this.selectIndex, this.formData.items[this.selectIndex]);
                    }
                    if (this.typeName == 'subjectType') {
                        this.formData.items[this.selectIndex].subjectCode = list[0].number;
                        this.formData.items[this.selectIndex].subjectName = list[0].name;
                        this.vueSet(this.formData.items, this.selectIndex, this.formData.items[this.selectIndex]);
                    }
                    if (this.typeName == 'userType') {
                        this.formData.items[this.selectIndex].userName = list[0].name;
                        this.formData.items[this.selectIndex].userCode = list[0].accountCode;
                        this.formData.items[this.selectIndex].salerId = list[0].id;
                        this.formData.items[this.selectIndex].salerCode = list[0].no;
                        this.formData.items[this.selectIndex].salerName = list[0].name;
                        this.formData.items[this.selectIndex].salerDepartName = JSON.parse(JSON.parse(JSON.stringify(list[0].departId))).name;
                        this.vueSet(this.formData.items, this.selectIndex, this.formData.items[this.selectIndex]);
                    }
                    if (this.typeName == 'bankAccountType') {
                        this.formData.items[this.selectIndex].accountId = list[0].id;
                        this.formData.items[this.selectIndex].accountName = list[0].name;
                        this.formData.items[this.selectIndex].accountCode = list[0].accountCode;
                        this.vueSet(this.formData.items, this.selectIndex, this.formData.items[this.selectIndex]);
                    }
                    this.$refs.publicSelector.selectionClear();
                    this.publicVisible = false;
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
                this.processId = '';
                getTypeValue('comm_tmp_make_account_type').then(response => {
                    this.makeAccountTypeOptions = response.data.data.rows;
                });
                pageAll().then(response => {
                    this.registerTypeOptions = response.data.data;
                });
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
                    this.vueSet(this, 'formData', {});
                    getSelfCompany().then(res => {
                        let formData = {
                            companyName: res.data.companyName,
                            companyId: res.data.companyName.id,
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
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/financialFeeRegisterForm',
                    name: '费用登记单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'financialFeeRegisterForm'
                    }
                });
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
                        this.formData = formData;
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        this.getProcessId(billPrefix);
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }

                    if (funType && funType == 'historyBill') {
                        this.$router.push({
                            path: '/financialFeeRegisterForm',
                            name: '费用登记单制单',
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
                    if (this.isEmpty(items[i].accountId)) {
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
                    if (!this.isEmpty(items[i].accountCode)) {
                        flag = false;
                        if (this.isEmpty(items[i].accountCode)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的账户为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].salerName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的科目名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].userName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的报销人为必填项');
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
                if (!this.handleCheckItemFuc()) {
                    return;
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
                                    path: '/financialFeeRegister',
                                    name: '费用登记单',
                                    meta: {
                                        i18n: 'financialFeeRegister'
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
