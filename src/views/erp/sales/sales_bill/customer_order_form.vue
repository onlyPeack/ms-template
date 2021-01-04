<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="permission"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <el-button v-if="type == 'view' && formData && formData.billStatus == '4'" @click="handleDownLoad" icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印</el-button>
                </div>
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
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit" :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="isBatch">
                        <div class="tableItem" style="display: unset">
                            <el-tooltip class="item" effect="dark"
                                        content="可针对折扣、税率、货期进行批量设置"
                                        placement="top-start">
                                <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                            </el-tooltip>
                            <el-switch v-model="formData.isBatch" placeholder="请输入调拨价" :disabled="type !='view'?false:true"></el-switch>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items" >
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'"  :summary-method="getSummaries">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow()"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="warehouseName">
                                <div @click="warehouseBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.warehouseName" placeholder="请选择仓库" readonly
                                              :disabled="(type=='view' && taskType=='now') || type !='view'?false:true"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index)"  class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="(type=='view' && taskType=='now') || type !='view'?false:true"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discount" >
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.discount" placeholder="请输入折扣"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.discount,true,'discount', scope.row)"
                                              :disabled="type !='view'?false:true"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.qty,true,'qty',scope.row)"
                                              :disabled="type !='view'?false:true"></el-input>
                                </div>
                            </template>

                            <template slot-scope="scope" slot="taxRate">
                                <div class="zRightClass">
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                               :disabled="type !='view'?false:true"
                                               @change="publicColumnBlur(scope.row.$index,scope.row.taxRate,true,'taxRate', scope.row)">
                                        <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,true,'taxPrice', scope.row)"
                                              :disabled="(type=='view' && taskType=='now') || type !='view'?false:true"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                            <div>
                            <el-input v-model="scope.row.taxAmount" placeholder="请输入含税金额"
                            @blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,true,'taxAmount', scope.row)"
                                      :disabled="type !='view'?false:true"></el-input>
                            </div>
                            </template>
                            <template slot-scope="scope" slot="deliveryDate">
                                <div class="zLeftClass">
                                    <el-input v-model="scope.row.deliveryDate" placeholder="请输入货期(天)"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.deliveryDate,true,'deliveryDate', scope.row)"
                                              :disabled="type !='view'?false:true"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="productdescribe">
                                <div>
                                    <el-input v-model="scope.row.productdescribe" placeholder="请输入商品描述"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.productdescribe,true,'productdescribe', scope.row)"
                                              :disabled="(type=='view' && taskType=='now') || type !='view'?false:true"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div class="zLeftClass">
                                    <el-input
                                            @blur="publicColumnBlur(scope.row.$index,scope.row.note,true,'note', scope.row)"
                                            v-model="scope.row.note" placeholder="请输入备注"
                                            :disabled="(type=='view' && taskType=='now') || type !='view'?false:true"></el-input>
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :selectType="1"
                            :discountLevel="formData.discountLevel"
                            :code="warehouseIndex == -1?warehouse.id:formData.items[warehouseIndex].warehouseId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :operationType="formData.customerId"
                            :orderVisible = "true"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, auditBill,selectAllById} from "@/api/erp/sales/bill/salesOrder";
    import {getDefaultWarehouse} from "@/api/erp/config/index";
    import {getUseStockQty} from "@/api/erp/manager/config/index";
    import {getBill as getBills} from "@/api/erp/purchase/bill/purchasePrices";
    import { getDefault} from '@/api/erp/project_management/projectOverview';
    import {
        customerOption,
        userOption,
        sourceOption,
        commodityOption,
        priceOption,
        quotationOption,
        warehouseOption
    } from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "customer_order_form",
        props: ['type', 'id', 'taskType', 'step'],
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
                warehouseIndex: undefined,
                permission: {tempAddBtn: true, addBtn: false},
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                warehouse:{},
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
                            span: 6
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
                            label: "客户ID",
                            prop: "customerId",
                            display: false
                        },
                        {
                            label: "客户",
                            prop: "customerName",
                            span: 6,
                            type: 'text',
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择客户',
                            dicData: [],
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择客户",
                                trigger: "change"
                            }],
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                this.publicTitle = '请选择客户';
                                this.typeName = 'customerType';
                                this.option = customerOption;
                                this.isSingle = true;
                                this.publicVisible = true;
                            }
                        },
                        {
                            label: "供货单位ID",
                            prop: "companyId",
                            display: false
                        },
                        // {
                        //     label: "供货单位",
                        //     prop: "companyName",
                        //     span: 6,
                        //     type: 'text',
                        //     filterable: true,
                        //     readonly: true,
                        // },
                        {
                            label: "订单编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "业务员Id",
                            prop: "salerId",
                            display: false
                        },
                        {
                            label: "业务员编号",
                            prop: "salerCode",
                            display: false
                        },
                        {
                            label: "业务员",
                            prop: "salerName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            placeholder:'请选择业务员',
                            filterable: true,
                            readonly: true,
                            disabled: true,
                        },
                        {
                            label: "交货日期",
                            prop: "deliverDate",
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
                            dicData: [],
                            suffixIcon: 'el-icon-search',
                            placeholder:'请选择关联单据',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            click: ({value, column}) => {
                                if (this.type == 'view') {
                                    return
                                }
                                if (!this.formData.customerName) {
                                    this.vueMessage('warning', '请先选择客户!');
                                    return
                                }
                                this.isSingle = false;
                                this.publicTitle = '请选择单据';
                                this.typeName = 'quotationType';
                                this.option = JSON.parse(JSON.stringify(quotationOption));
                                this.publicVisible = true;
                            }
                        },
                        // {
                        //     label: "仓库ID",
                        //     prop: "warehouseId",
                        //     display: false
                        // },
                        // {
                        //     label: "仓库",
                        //     prop: "warehouseName",
                        //     span: 6,
                        //     type: 'text',
                        //     dicData: [],
                        //     filterable: true,
                        //     readonly: true,
                        //     clearable: false,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择仓库",
                        //         trigger: "change"
                        //     }],
                        //     click: ({value, column}) => {
                        //         if (this.type == 'view') {
                        //             return
                        //         }
                        //         this.publicTitle = '请选择仓库';
                        //         this.typeName = 'warehouseType';
                        //         this.option = warehouseOption;
                        //         this.isSingle = true;
                        //         this.publicVisible = true;
                        //     }
                        // },
                        // {
                        //     label: "收款类型",
                        //     prop: "paymentType",
                        //     span: 6,
                        //     type: 'select',
                        //     dicMethod: 'get',
                        //     dicUrl: '/api/manager/receipt-type/pageAll',
                        //     props: {
                        //         value: 'name',
                        //         label: 'name'
                        //     },
                        //     filterable: true,
                        //     rules: [{
                        //         required: true,
                        //         message: "请选择收款类型",
                        //         trigger: "change"
                        //     }]
                        // },
                        {
                            label: "订单类型",
                            prop: "billType",
                            span: 6,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/sales-order-type/pageAll',
                            props: {
                                value: 'name',
                                label: 'name'
                            },
                            filterable: true,
                            rules: [{
                                required: true,
                                message: "请选择订单类型",
                                trigger: "change"
                            }]
                        },
                        {
                            label: "结算方式",
                            prop: "accountMethod",
                            span: 6,
                            type: 'select',
                            dicMethod: 'get',
                            dicUrl: '/api/manager/payments-means/pageAll',
                            props: {
                                value: 'label',
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
                            label: "联系人",
                            prop: "linkPerson",
                            span: 6,
                            // readonly: true,
                        },
                        {
                            label: "联系电话",
                            prop: "linkPhone",
                            span: 6,
                            // readonly: true,
                            // rules: [{
                            //     validator: validateMobile,
                            //     trigger: "blur"
                            // }]
                        },
                        // {
                        //     label: "收货地址",
                        //     prop: "linkAddress",
                        //     readonly: true,
                        //     span: 6,
                        // },
                        {
                            label: "整单备注",
                            prop: "note",
                            type: 'textarea',
                            row: true,
                            span: 24
                        },
                        {
                            label: "是否批量设置",
                            prop: "isBatch",
                            span: 24,
                            type: "isBatch",
                            dicData:  [{
                                label: '',
                                value: 'false'
                            }, {
                                label: '',
                                value: 'true'
                            }],
                            mock: {
                                type: 'dic'
                            },
                            hide: true,
                            formslot: true,
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
                    indexLabel: '序号',
                    height: 'auto',
                    calcHeight: 350,
                    showSummary: true,
                    sumColumnList: [
                        {
                            name: "qty",
                            type: "sum",
                            len: 0
                        },{
                            name: "taxPrice",
                            type: "sum"
                        },{
                            name: "taxAmount",
                            type: "sum"
                        },{
                            name: "price",
                            type: "sum"
                        },{
                            name: "amount",
                            type: "sum"
                        },
                    ],
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
                            label: "仓库",
                            prop: "warehouseName",
                            width: 130,
                            placeholder: '请选择仓库',
                            align: 'left',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "仓库"
                                );
                            }
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品',
                            align: 'left',
                            width: 130,
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
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            width: 60,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            placeholder: ' ',
                        },
                        {
                            label: "可用库存",
                            prop: "stockQty",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            placeholder: ' ',
                        },
                        {
                            label: "折扣",
                            prop: "discount",
                            width: 112,
                            align: 'right',
                            placeholder: ' ',
                            slot: true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "折扣"
                                );
                            }
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 112,
                            align: 'right',
                            type: 'number',
                            slot: true,
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
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 140,
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
                                    "含税单价"
                                );
                            }
                        },
                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 140,
                            slot: true,
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
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 110,
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
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "货期(天)",
                            prop: "deliveryDate",
                            span: 6,
                            width: 132,
                            slot: true,
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 100,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width:100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            slot: true,
                        },
                    ]
                },
                option: [],
            };
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        mounted() {
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            for (var i in this.formOption.column) {
                this.formOption.column[i].oldSpan = this.formOption.column[i].span ? this.formOption.column[i].span : 12;
            }
            this.changeFormWidth(this, 'formOption');
            window.addEventListener('resize', this.changeMaxHeight.bind(this, 'auto'));
            this.init();
        },
        destroyed() {
            window.removeEventListener("resize", this.changeMaxHeight);
        },
        updated() {
            this.changeMaxHeight();
        },
        methods: {
            handleDownLoad(){
                getDefault(0).then(res => {
                    if(res.data.code == '401'){
                        this.vueMessage('warning',res.data.msg);
                    }else{
                        this.$router.push({path:'/print/customer_order_print',query:{id:this.id}})
                    }
                })

            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    this.formData.items = [{}]
                } else {
                    this.formData.items.splice(index, 1);
                }
            },
            publicColumnBlur(index, val, type, name, item) {
                if(!isNaN(val) && this.formData.items[index].skuName){
                    if (this.type != 'view' || (this.type == 'view' && this.taskType == 'now')){
                        if (!isNaN(item.qty)) {
                            if (type) {

                                if(this.formData.isBatch&&index===0){//批量设置
                                    let keyArr=['deliveryDate','discount','taxRate']
                                    let length=this.formData.items.length-1
                                    if(this.formData.items[this.formData.items.length-1].itemNo&&this.formData.items[this.formData.items.length-1].itemNo!==''){
                                        length=this.formData.items.length
                                    }
                                    if(keyArr.indexOf(name)>-1){
                                        //批量赋值
                                        for (let i = 1; i <length ; i++) {
                                            this.$set(this.formData.items[i],name,val)
                                        }
                                    }
                                    //整理数据(仿照discount)
                                    for (let i = 0; i <length ; i++) {
                                        try {
                                            if (name == 'qty') {
                                                this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                            }
                                            if (name == "discount") {
                                                this.formData.items[i].discount = Number(this.formData.items[i].discount).toFixed(this.sysParam.discountDecimal);
                                                this.formData.items[i].taxPrice = (Number(this.formData.items[i].discount) * Number(this.formData.items[i].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                            }
                                            if (name == 'amount') {
                                                this.formData.items[i].price = (Number(this.formData.items[i].amount) / Number(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].taxPrice = (Number(this.formData.items[i].price) * Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                            }
                                            if (name == 'taxPrice') {
                                                this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].discount = (Number(this.formData.items[i].taxPrice) / Number(this.formData.items[i].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                            }
                                            if (name == 'taxAmount') {
                                                this.formData.items[i].taxPrice = (Number(this.formData.items[i].taxAmount) / Number(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].discount = (Number(this.formData.items[i].taxPrice) / Number(this.formData.items[i].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                            }
                                            if (name == 'taxRate') {
                                                this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                                this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                            }
                                        }catch (e) {

                                        }

                                    }

                                }else{
                                    if (name == 'qty') {
                                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    }
                                    if (name == "discount") {
                                        this.formData.items[index].discount = Number(this.formData.items[index].discount).toFixed(this.sysParam.discountDecimal);
                                        this.formData.items[index].taxPrice = (Number(val) * Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                    }
                                    if (name == 'amount') {
                                        this.formData.items[index].price = (Number(this.formData.items[index].amount) / Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    }
                                    if (name == 'taxPrice') {
                                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].discount = (Number(this.formData.items[index].taxPrice) / Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                    }
                                    if (name == 'taxAmount') {
                                        this.formData.items[index].taxPrice = (Number(this.formData.items[index].taxAmount) / Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].discount = (Number(this.formData.items[index].taxPrice) / Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                    }
                                    if (name == 'taxRate') {
                                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                    }
                                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                                }



                            }
                        }
                    }
                }

            },
            warehouseBtn(item, index, type) {
                if (this.type != 'view' || (this.type == 'view' && this.taskType=='now') ) {
                    if (!this.formData.customerName) {
                        this.vueMessage('warning', '请先选择客户!');
                        return
                    }
                    this.publicTitle = '请选择仓库';

                    this.warehouseIndex = index;
                    this.typeName = 'warehouseType';
                    this.option = warehouseOption;
                    this.isSingle = true;
                    this.publicVisible = true;
                }
            },
            skuBtn(item, index, type) {
                if (this.type != 'view'|| (this.type == 'view' && this.taskType=='now')) {
                    if (!this.formData.customerName) {
                        this.vueMessage('warning', '请先选择客户!');
                        return
                    }
                    if(this.formData.sourceBillNo.length > 0){
                        this.vueMessage('warning', '关联单据时不能选择新的商品!');
                        return
                    }
                    if (!this.formData.items[index].warehouseName) {
                        this.vueMessage('warning', '请先选择仓库!');
                        return
                    }
                    this.warehouseIndex = index;
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }
            },
            qtyBlur(index, val) {
                if (isNaN(val)) {
                    this.formData.items[index].qty = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                } else {
                    this.formData.items[index].amount = (parseInt(val) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].taxAmount = (parseInt(val) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
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
                    warehouseName : this.warehouse.name,
                    warehouseId : this.warehouse.id
                }
                this.formData.items.push(d);
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        this.formData.customerId = list[0].id;
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                        this.formData.linkPerson = list[0].linkMan;
                        this.formData.discountLevel = list[0].discountLevel;
                        this.formData.linkPhone = list[0].linkPhone;
                        this.formData.salerId = list[0].managerId;
                        this.formData.salerCode = list[0].managerCode;
                        this.formData.salerName = list[0].managerName;
                        this.formData.items= [{
                            skuName: '',
                            warehouseName : this.warehouse.name,
                            warehouseId : this.warehouse.id
                        }]
                        // this.formData.linkAddress = list[0].receiveAddress;
                    }

                    if (this.typeName == 'warehouseType') {
                        this.formData.items[this.warehouseIndex].warehouseName = list[0].name;
                        this.formData.items[this.warehouseIndex].warehouseId = list[0].id;
                        getUseStockQty(this.formData.items[this.warehouseIndex].warehouseId,this.formData.items[this.warehouseIndex].skuNo).then(res=>{
                            this.formData.items[this.warehouseIndex].stockQty = res.data.data;
                            this.vueSet(this.formData.items, this.warehouseIndex, this.formData.items[this.warehouseIndex]);
                        })

                    }
                    if (this.typeName == 'quotationType' || this.typeName == 'commodityType') {

                        if (this.typeName == 'quotationType') {
                            this.formData.items= [{}];
                            if(list[0].isDetailed){
                                selectAllById(list[0].id).then(res=>{
                                    let data = res.data.data;
                                    this.formData.quotedPriceOn = list[0].billNo;
                                    this.formData.sourceBillNo = list[0].billNo;
                                    for (var index in data) {
                                        var item = data[index];
                                        var itemObj = {};
                                        itemObj.sourceBillNo = item.billNo;
                                        itemObj.sourceBillId = item.id;
                                        itemObj.skuName = item.skuName;
                                        itemObj.skuNo = item.skuNo;
                                        itemObj.itemNo = item.itemNo;
                                        itemObj.categoryName = item.categoryName;
                                        itemObj.seriesName = item.seriesName;
                                        itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                                        itemObj.brandName = item.brandName;
                                        itemObj.specifications = item.specifications;
                                        itemObj.qty = item.qty;
                                        itemObj.price = item.price;
                                        itemObj.amount = item.amount;
                                        itemObj.taxRate = item.taxRate;
                                        itemObj.tax = item.tax;
                                        itemObj.taxPrice = item.taxPrice;
                                        itemObj.taxAmount = item.taxAmount;
                                        itemObj.unit = item.unit;
                                        itemObj.stockQty = item.stockQty;
                                        itemObj.warehouseName = this.warehouse.name;
                                        itemObj.warehouseId =  this.warehouse.id;
                                        itemObj.discount = item.discount || '';
                                        itemObj.deliverDate = new Date().toLocaleDateString().replace(/\//g, '-');
                                        this.formData.items.push(itemObj);
                                    }
                                    this.$nextTick(() => {
                                        //清除没有商品ID的数据
                                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                                        this.handleAddRow()
                                    });
                                })

                            }else{
                                this.formData.quotedPriceOn = list[0].billNo;
                                this.formData.sourceBillNo = list[0].billNo;
                                for (var index in list) {
                                    var item = list[index];
                                    var itemObj = {};
                                    itemObj.sourceBillNo = item.billNo;
                                    itemObj.sourceBillId = item.id;
                                    itemObj.skuName = item.skuName;
                                    itemObj.skuNo = item.skuNo;
                                    itemObj.itemNo = item.itemNo;
                                    itemObj.categoryName = item.categoryName;
                                    itemObj.seriesName = item.seriesName;
                                    itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                                    itemObj.brandName = item.brandName;
                                    itemObj.specifications = item.specifications;
                                    itemObj.qty = item.qty;
                                    itemObj.price = item.price;
                                    itemObj.amount = item.amount;
                                    itemObj.taxRate = item.taxRate;
                                    itemObj.tax = item.tax;
                                    itemObj.taxPrice = item.taxPrice;
                                    itemObj.stockQty = item.stockQty;
                                    itemObj.taxAmount = item.taxAmount;
                                    itemObj.unit = item.unit;
                                    itemObj.warehouseName = this.warehouse.name;
                                    itemObj.warehouseId =  this.warehouse.id;
                                    itemObj.discount = item.discount || '';
                                    itemObj.deliverDate = new Date().toLocaleDateString().replace(/\//g, '-');
                                    this.formData.items.push(itemObj);
                                }
                                this.$nextTick(() => {
                                    //清除没有商品ID的数据
                                    this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                                    this.handleAddRow()
                                });
                            }

                        } else {
                            const dataMap = this.dataMap(this.formData.items, list);
                            if (dataMap.length > 0) {
                                this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                                return;
                            }
                            for (var index in list) {
                                var item = list[index];
                                var itemObj = {};
                                itemObj.warehouseName = this.warehouse.name;
                                itemObj.warehouseId =  this.warehouse.id;
                                itemObj.skuName = item.goodsName;
                                itemObj.categoryName = item.categoryName;
                                itemObj.seriesName = item.seriesName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.brandName = item.brandName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.specifications = item.specifications;
                                itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                                itemObj.qty = 1;
                                itemObj.stockQty = item.stockQty;
                                itemObj.taxRate = 13;
                                itemObj.taxAmount = '';
                                itemObj.unit = item.unit;
                                itemObj.deliverDate = new Date().toLocaleDateString().replace(/\//g, '-');
                                itemObj.discount = item.discount || '';
                                if (item.discount == undefined) {
                                    itemObj.price = '';
                                    itemObj.amount = '';
                                    itemObj.tax = '';
                                    itemObj.taxPrice = '';
                                    itemObj.taxAmount = '';
                                } else {
                                    itemObj.taxPrice = (Number(itemObj.discount) * Number(itemObj.surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                    itemObj.price = (Number(itemObj.taxPrice) / Number(1 + Number(itemObj.taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                    itemObj.amount = (Number(itemObj.qty) * Number(itemObj.price)).toFixed(this.sysParam.amountDecimal);
                                    itemObj.taxAmount = (Number(itemObj.qty) * Number(itemObj.taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    itemObj.tax = (Number(itemObj.amount) * Number(itemObj.taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                }
                                this.formData.items.push(itemObj);
                            }
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
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                getDefaultWarehouse().then(res=>{
                    this.warehouseIndex = -1;
                    this.warehouse = res.data.data
                    this.processId = '';
                    if (this.$refs.form) {
                        this.$refs.form.resetForm();
                        this.$nextTick(this.$refs.form.clearValidate)
                    }

                    if (this.id) {
                        this.handleGetBill(getBill, this.id);
                    } else {
                        this.vueSet(this, 'formData', {});
                        getSelfCompany().then(response => {
                            let formData = {
                                billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                                items: []
                            };
                            formData.companyId = response.data.id ? response.data.id : undefined
                            formData.companyName = response.data.companyName ? response.data.companyName : undefined
                            this.formData = formData;
                            this.$nextTick(() => {
                                this.vueSet(this, 'formData', formData);
                            })
                            this.handleAddRow();
                            this.loading = false;
                        })

                    }
                })

            },
            //新增
            handleAdd() {
                this.$router.push({
                    path: '/customer_order_form',
                    name: '销售订单制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'customer_order_form'
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
                            path: '/warehousing-order-form',
                            name: '销售订单制单',
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
                        if (this.isEmpty(items[i].warehouseName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的仓库为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].price)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxRate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的金额不能小于1');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的含税单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的价税合计为必填项');
                            return false;
                        }
                        // if (this.isEmpty(items[i].deliveryDate)) {
                        //     this.vueMessage('warning', '第' + (i * 1 + 1) + '行的货期为必填项');
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
                        let list = JSON.parse(JSON.stringify(this.formData.items));
                        list = this.clearNoGoodsIdData(this.formData.items);
                        let sumAmount = 0;
                        let sumTaxAmount = 0;

                        for (let i in list) {
                            sumAmount = Number(sumAmount) + Number(list[i].amount);
                            sumTaxAmount = Number(sumTaxAmount) + Number(list[i].taxAmount);
                        }
                        this.formData.billAmount = sumAmount.toFixed(this.sysParam.amountDecimal);
                        this.formData.taxBillAmount = sumTaxAmount.toFixed(this.sysParam.amountDecimal);
                        this.formData.items = this.clearNoGoodsIdData(this.formData.items);
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/customer_order',
                                    name: '销售订单',
                                    meta: {
                                        i18n: 'customer_order'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            } else if (res.data.code == '401') {
                                this.$message({
                                    type: "warning",
                                    message: res.data.msg
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
