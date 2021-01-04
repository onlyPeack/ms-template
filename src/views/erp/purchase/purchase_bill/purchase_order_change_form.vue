<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="justify-content: unset;position: relative">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="permission"
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
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'"  :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <!--<template slot-scope="scope" slot="operate" v-if="type != 'view'">-->
                            <!--<div>-->
                            <!--&lt;!&ndash;<i class="el-icon-plus" @click="handleAddRow(true)"&ndash;&gt;-->
                            <!--&lt;!&ndash;style="margin-right: 15px;color:  #409EFF;"></i>&ndash;&gt;-->
                            <!--<i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"-->
                            <!--style="color:#E80000;"></i>-->
                            <!--</div>-->
                            <!--</template>-->
                            <template slot-scope="scope" slot="skuName">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="newQty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.newQty" placeholder="请输入新数量"
                                              @change="publicColumnBlur(scope.row.$index,scope.row.newQty,'newQty', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="newPrice">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.newPrice" :placeholder="'请输入新含税单价'"
                                              @change="publicColumnBlur(scope.row.$index,scope.row.newPrice,'newPrice', scope.row)"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="deliveryDate">
                                <div class="zLeftClass">
                                    <el-date-picker v-model="scope.row.deliveryDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择交货日期" :disabled="type=='view'?true:false">
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
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
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
                            @handleClose="handleClosePublic" selectType="3"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill,auditBill} from "@/api/erp/purchase/bill/purchase_order_change";
    import {getObj} from '@/api/erp/crm/customer/index';
    import {getSelfCompany} from "@/api/admin/company";
    import {purchasesOption} from '@/util/table';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "purchase_order_change_form",
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
                            label: "关联单据",
                            prop: "sourceBillNo",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择关联单据',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择关联单据",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }

                                this.isSingle = false;
                                this.publicTitle = '请选择关联单据';
                                this.typeName = 'purchasesType';
                                this.option = purchasesOption;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "供应商",
                            prop: "supplierName",
                            span: 6,
                            type: 'text',
                            disabled: true,
                            filterable: true,
                        },
                        {
                            label: "采购员",
                            prop: "purchaserName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            disabled: true,
                            rules: [{
                                required: true,
                                message: "请选择采购员",
                                trigger: "change"
                            }],
                            // click: ({value, column}) => {
                            //     if (this.type == 'view') {
                            //         return
                            //     }
                            //     this.isSingle = true;
                            //     this.publicTitle = '请选择业务员';
                            //     this.typeName = 'userType';
                            //     this.option = userOption;
                            //     this.publicVisible = true;
                            // }
                        },
                        {
                            label: "采购部门",
                            prop: "departName",
                            span: 6,
                            type: 'text',
                            disabled: true,
                            filterable: true,
                        },
                        {
                            label: "变更原因",
                            prop: "changeReason",
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
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel:'序号',
                    height: 'auto',
                    calcHeight: 350,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "newQty",
                            type: "sum",
                            len: 0
                        },{
                            name: "taxPrice",
                            type: "sum"
                        },{
                            name: "taxAmount",
                            type: "sum"
                        },{
                            name: "newAmount",
                            type: "sum"
                        },{
                            name: "newPrice",
                            type: "sum"
                        },
                    ],
                    column: [

                        {
                            label: "商品名称",
                            prop: "skuName",
                            width: 160,
                            overHidden:true,
                            placeholder: '请选择商品名称',
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            placeholder: ' ',
                            width: 160,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            placeholder: ' ',
                            width: 130,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            placeholder: ' ',
                            width: 130,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            placeholder: ' ',
                            width: 130,
                            overHidden:true,
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            width: 70,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "原数量",
                            prop: "qty",
                            width: 90,
                            overHidden:true,
                            align: 'right',

                        },
                        {
                            label: "原含税单价",
                            prop: "price",
                            width: 110,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "原含税金额",
                            prop: "amount",
                            width: 110,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "新数量",
                            prop: "newQty",
                            width: 122,
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
                                    "新数量"
                                );
                            }
                        },
                        {
                            label: "新含税单价",
                            prop: "newPrice",
                            width: 132,
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
                                    "新含税单价"
                                );
                            }
                        },
                        {
                            label: "新含税金额",
                            prop: "newAmount",
                            width: 110,
                            overHidden:true,
                            align: 'right',
                            readonly: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "新含税金额"
                                );
                            }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 120,
                            align: 'left',
                            slot: true,
                            overHidden:true,
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
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            publicColumnBlur(index, val, name, item) {
                if (!isNaN(this.formData.items[index].newQty) && !isNaN(this.formData.items[index].newPrice)) {
                    if (name == 'newQty' || name == 'newPrice') {
                        this.formData.items[index].newAmount = (Number(this.formData.items[index].newQty) * Number(this.formData.items[index].newPrice)).toFixed(this.sysParam.amountDecimal);
                    }
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                }
            },
            //校验是否已选择
            dataMap(items, list) {
                let map = [];
                items.forEach(function (item) {
                    list.forEach(function (obj) {
                        if (obj.skuNo == item.skuNo) {
                            map.push(obj.skuNo);
                        }
                    });
                });
                return map;
            },
            handleAddRow() {
                const d = {
                    skuName: '',
                }
                this.formData.items.push(d);
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'purchasesType') {
                        this.formData.items = [];
                        this.formData.sourceBillNo = list[0].billNo;
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        this.formData.purchaserName = list[0].mainDTO.purchaserName;
                        this.formData.purchaserId = list[0].mainDTO.purchaserId;
                        this.formData.purchaserCode = list[0].mainDTO.purchaserCode;
                        this.formData.supplierCode = list[0].mainDTO.supplierCode;
                        this.formData.supplierId = list[0].mainDTO.supplierId;
                        this.formData.supplierName = list[0].mainDTO.supplierName;
                        this.formData.departName = list[0].mainDTO.departName;
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceBillId = item.id;
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.itemNo = item.itemNo;
                            itemObj.brandName = item.brandName;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.qty = item.qty;
                            itemObj.price =item.taxPrice;
                            itemObj.amount = item.taxAmount;
                            itemObj.taxRate = item.taxRate;
                            itemObj.tax = item.tax;
                            itemObj.unit = item.unit;
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            this.formData.items.push(itemObj);
                        }
                        console.log(this.formData.items)
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
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
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
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: []
                    };
                    this.$nextTick(()=>{
                        this.formData = formData;
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;

                }
            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/purchase_order_change_form',
                    name: '采购订单变更制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'purchase_order_change_form'
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
                            path: '/purchase_order_change_form',
                            name: '采购订单变更制单',
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
                    if (this.isEmpty(items[i].skuNo)) {
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
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].newQty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的新数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].newPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的新单价为必填项');
                            return false;
                        }
                        // if (this.isEmpty(items[i].newAmount)) {
                        //     this.vueMessage('warning', '第' + (i * 1 + 1) + '行的金额不能小于1');
                        //     return false;
                        // }
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
                                    path: '/purchase_order_change',
                                    name: '采购订单变更',
                                    meta: {
                                        i18n: 'purchase_order_change'
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
