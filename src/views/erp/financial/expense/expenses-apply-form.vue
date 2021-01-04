<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="permission"
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
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items">

                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>


                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                            <div>
                            <i class="el-icon-plus" @click="handleAddRow(true)"
                            style="margin-right: 15px;color:  #409EFF;"></i>
                            <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                            style="color:#E80000;"></i>
                            </div>
                            </template>
                            <template slot-scope="scope" slot="type">
                                <div class="zLeftClass">
                                    <el-select v-model="scope.row.type" style="width: 100%;"
                                               :disabled="(type=='view'|| (type!='view' && formData.projectName && formData.projectName != undefined)?true:false)">
                                        <el-option v-for="item in typeOptions" :key="item.name"
                                                   :label="item.name"
                                                   :value="item.name">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="amount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.amount" placeholder="请输入申请金额"
                                              @change="publicColumnBlur(scope.row.amount)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.note" placeholder="请输入摘要说明"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type=='view'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departName">制单人部门：{{formData.departName}}</span>
                    <span v-if="formData.crtTime">制单时间：{{formData.crtTime}}</span>
                </div>
            </div>
            <task-history v-if="formData.billNo && processId && processId!=''" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>

            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic" selectType="5"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {pageAll,selectPay} from "@/api/erp/sales/bill/salesOrderChange";
    import {getBill, getHistoryBill, addBill, tempAddBill,auditBill} from  "@/api/erp/financial/financiaCostApply";
    import {getObj} from '@/api/erp/crm/customer/index';
    import {getSelfCompany} from "@/api/admin/company";
    import {customerOrderOption,userOption, bankOption,projectOption} from '@/util/table';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "expenses-apply-form",
        props: ['type', 'id','taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            var validateMobile = (rule, value, callback) => {
                if (value && value != '' && !isMobile(value)) {
                    callback(new Error('请输入正确的手机号码'));
                } else {
                    callback();
                }
            };
            return {
                typeOptions:[],
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                permission:{tempAddBtn: true,addBtn: false},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                    },
                },
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
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
                            label: "id",
                            prop: "id",
                            display: false
                        },
                        {
                            label: "单据编号",
                            prop: "billNo",
                            disabled: true,
                            placeholder: "自动生成",
                            span:6
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
                            label: "申请人",
                            prop: "applyName",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择申请人',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择申请人",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }

                                this.isSingle = false;
                                this.publicTitle = '请选择申请人';
                                this.typeName = 'userType';
                                this.option = userOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "申请部门",
                            prop: "departName",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择申请部门',
                            dicData: [],
                            filterable: true,
                            disabled: true,
                        },
                        {
                            label: "联系电话",
                            prop: "linkPhone",
                            span: 6,
                            // readonly: true,
                            rules: [{
                                validator: validateMobile,
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "所属项目",
                            prop: "projectName",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择所属项目',
                            dicData: [],
                            display:false,
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }

                                this.isSingle = false;
                                this.publicTitle = '请选择所属项目';
                                this.typeName = 'projectType';
                                this.option = projectOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "承担账户",
                            prop: "accountName",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择承担账户',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择承担账户",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }

                                this.isSingle = false;
                                this.publicTitle = '请选择承担账户';
                                this.typeName = 'bankType';
                                this.option = bankOption;
                                this.publicVisible = true;
                            }
                        },

                        {
                            label: "备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24,
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
                    column: [
                        {
                            label: "操作",
                            prop: "operate",
                            fixed: true,
                            align: 'center',
                            width: 120,
                            slot: true,
                        },
                        {
                            label: "费用类型",
                            prop: "type",
                            minWidth: 120,
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "申请金额",
                            prop: "amount",
                            minWidth: 120,
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
                                    "申请金额"
                                );
                            }
                        },
                        {
                            label: "摘要说明",
                            prop: "note",
                            minWidth: 280,
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
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            publicColumnBlur(val) {
                if (isNaN(val)) {
                    this.vueMessage('warning', '请输入数字!');
                    this.formData.items.amount = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                }else{
                    this.formData.items.amount = val;
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                }

            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.sourceBillId == item.id) {
                            map.push(obj.sourceBillId);
                        }
                    });
                });
                return map;
            },
            handleRemoveRow(item, index) {
                if(this.formData.projectName == undefined || this.formData.projectName == '' ) {
                    let ValueIndex = this.formData.items.length;
                    if (ValueIndex === 1) {
                        return
                    }
                    this.formData.items.splice(index, 1);
                }else{
                    this.vueMessage('warning',"关联所属项目不能进行增加或减少操作");
                }
            },
            handleAddRow() {
                if(this.formData.projectName == undefined || this.formData.projectName == '' ) {
                    const d = {
                        skuName: '',
                    }
                    this.formData.items.push(d);
                }else{
                    this.vueMessage('warning',"关联所属项目不能进行增加或减少操作");
                }
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'bankType') {
                        this.formData.accountId = list[0].id;
                        this.formData.accountCode = list[0].accountCode;
                        this.formData.accountName = list[0].name;
                    }
                    if (this.typeName == 'userType') {
                        this.formData.applyId = list[0].id;
                        this.formData.applyCode = list[0].no;
                        this.formData.applyName = list[0].name;
                        this.formData.linkPhone = list[0].mobilePhone;
                        this.formData.departName =  JSON.parse(list[0].departId).name;
                    }
                    if (this.typeName == 'projectType') {
                        this.formData.items = [];
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '项目(' + dataMap.join(",") + ')已有相同的项目信息，不能重复添加');
                            return;
                        }
                        this.formData.projectName = list[0].projectName;
                        selectPay(list[0].id).then(res => {
                            for (var index in res.data.data) {
                                var item = res.data.data[index];
                                var itemObj = {};
                                itemObj.type = item.payType;
                                itemObj.sourceBillId = list[0].id + '';
                                itemObj.amount = item.payAmount + '';
                                itemObj.note = item.applyText + '';
                                this.formData.items.push(itemObj);
                            }
                            this.$nextTick(() => {
                                //清除没有商品ID的数据
                                if(this.formData.items.length > 0){
                                    this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                                }

                            });
                        })

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
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                pageAll().then(res=>{
                    this.typeOptions = res.data.data;
                    this.processId = '';
                    this.vueSet(this, 'formData', {});
                    if(this.$refs.form){
                        this.$refs.form.resetForm();
                        this.$nextTick(this.$refs.form.clearValidate)
                    }
                    if (this.type && this.type == 'view') {
                        this.formOption.disabled = true;
                    }else{
                        this.formOption.disabled = false;
                    }
                    if(this.$store.getters.userInfo.isProjectVersion ==0){
                        for(let i in this.formOption.column){
                            if(this.formOption.column[i].prop == 'projectName'){
                                this.formOption.column[i].display = false;
                            }
                        }
                    }else{
                        for(let i in this.formOption.column){
                            if(this.formOption.column[i].prop == 'projectName'){
                                this.formOption.column[i].display = true;
                            }
                        }
                    }
                    this.vueSet(this, 'formOption', this.formOption);
                    this.$forceUpdate() ? this.$forceUpdate() : '';
                    if (this.id) {
                        this.handleGetBill(getBill, this.id);
                    } else {
                            let formData = {
                                applyName: this.$store.getters.userInfo.name,
                                applyNo: this.$store.getters.userInfo.no,
                                departName:  this.$store.getters.userInfo.departName,
                                linkPhone:this.$store.getters.userInfo.mobilePhone,
                                billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                items: [{}]
                            };

                            this.$nextTick(()=>{
                                this.formData = formData;
                                this.vueSet(this, 'formData', formData);
                            })
                            this.loading = false;
                    }
                })

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
                let sum =await this.auditBill(this, 'formData', auditBill);
                if (sum.data.code == '2000') {
                    this.clocseCurrent(this,this.$route);
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
                            path: '/expenses-apply-form',
                            name: '费用申请制单',
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
            //清除没有商品skuNo的数据
            clearNoGoodsIdData(items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    if (this.isEmpty(items[i].type)) {
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
                    if (!this.isEmpty(items[i].type)) {
                        flag = false;
                        if (this.isEmpty(items[i].type)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的费用类型为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].amount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的申请金额为必填项');
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
                        let amount = 0;
                        let formData = JSON.parse(JSON.stringify(this.formData));
                        formData.items = this.clearNoGoodsIdData(this.formData.items);
                        for (let i in formData.items) {
                            if(formData.items[i].amount){
                                amount = Number(amount) + Number(formData.items[i].amount);
                            }
                        }
                        formData.amount = amount.toFixed(this.sysParam.amountDecimal);
                        saveBill(formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/expenses-apply',
                                    name: '费用申请',
                                    meta: {
                                        i18n: 'expenses-apply'
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
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
