<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="justify-content: unset;position: relative;">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="permission"
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <!--<router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"-->
                                 <!--:to="{path:'/print/sales_quotation_prices_print',query:{id:id}}">-->
                        <!--<el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印-->
                        <!--</el-button>-->
                    <!--</router-link>-->
                </div>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block;">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意
                    </el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           :class="type == 'view'?'main-form':'main-form main-form-select'" v-if="isShow"
                           :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="isBatch">
                        <div class="tableItem" style="display: unset">
                            <el-tooltip class="item" effect="dark"
                                        content="可针对折扣、税率、货期进行批量设置"
                                        placement="top-start">
                                <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                            </el-tooltip>
                            <el-switch v-model="formData.isBatch" placeholder="请输入调拨价"></el-switch>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <div style="position: relative">
                            <h3 style="position: absolute;left: 10px">订单明细</h3>
                            <div style="display: flex;flex-direction: row;justify-content: flex-end;margin-right: 10px;padding-top: 20px;">
                                <a :href="openUrl+'/api/manager/sales-quotation/downTemplate'"
                                style="color: #409EFF; margin-right: 6px;">
                                <el-button type="text">
                                    <img src="https://hejigy.com.cn/mobanxiaz.png" alt=""/>
                                    下载导入模板
                                </el-button>
                                </a>
                                <el-upload class="upload" action="/api/manager/sales-quotation/import"
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
                            <avue-crud :option="itemsOption" :data="formData.items"
                                       :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries"
                                       @header-cell-class-name="headerCellClassName">
                                <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                    <div>
                                        <i class="el-icon-plus" @click="handleAddRow(true)"
                                           style="margin-right: 15px;color:  #409EFF;"></i>
                                        <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                           style="color:#E80000;"></i>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="skuName">
                                    <div @click="skuBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                        <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                                  :disabled="(type=='view' && taskType=='now') || type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="discount">
                                    <div class="zRightClass">
                                        <el-input v-model="scope.row.discount" placeholder="请输入折扣"
                                                  @blur="publicColumnBlur(scope.row.$index,scope.row.discount,true,'discount', scope.row)"
                                                  :disabled="type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="qty">
                                    <div class="zRightClass">
                                        <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                                  @blur="publicColumnBlur(scope.row.$index,scope.row.qty,true,'qty',scope.row)"
                                                  :disabled="type!='view'?false:true"></el-input>
                                    </div>
                                </template>

                                <template slot-scope="scope" slot="taxRate">
                                    <div v-if="type!='view'" class="zRightClass">
                                        <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                                   :disabled="(type=='view' && taskType=='now') || type!='view'?false:true"
                                                   @change="publicColumnBlur(scope.row.$index,scope.row.taxRate,true,'taxRate', scope.row)">
                                            <el-option v-for="item in taxRateOptions" :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div v-else>
                                        <div v-for="item in taxRateOptions"><span v-if="item.value==scope.row.taxRate">{{item.label}}</span>
                                        </div>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="taxPrice">
                                    <div class="zRightClass">
                                        <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                                  @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,true,'taxPrice', scope.row)"
                                                  :disabled="(type=='view' && taskType=='now') || type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="taxAmount">
                                    <div class="zRightClass">
                                        <el-input v-model="scope.row.taxAmount" placeholder="请输入含税金额"
                                                  @blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,true,'taxAmount', scope.row)"
                                                  :disabled="(type=='view' && taskType=='now') || type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="deliveryDate">
                                    <div class="zLeftClass">
                                        <el-input v-model="scope.row.deliveryDate" placeholder="请输入货期(天)"
                                                  @blur="publicColumnBlur(scope.row.$index,scope.row.deliveryDate,true,'deliveryDate', scope.row)"
                                                  :readonly="(type=='view' && taskType=='now') || type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="productdescribe">
                                    <div class="zLeftClass" :disabled="(type=='view' && taskType=='now') || type!='view'?false:true">
                                        <el-input v-model="scope.row.productdescribe" placeholder="请输入产品描述"
                                                  @blur="publicColumnBlur(scope.row.$index,scope.row.productdescribe,true,'productdescribe', scope.row)"
                                        ></el-input>
                                    </div>
                                </template>
                                <template slot-scope="scope" slot="note">
                                    <div>
                                        <el-input
                                                @blur="disabled(scope.row.$index,scope.row.note,true,'note', scope.row)"
                                                v-model="scope.row.note" placeholder="请输入备注"
                                                :readonly="(type=='view' && taskType=='now') || type!='view'?false:true"></el-input>
                                    </div>
                                </template>
                            </avue-crud>
                        </div>
                    </template>

                </avue-form>
                <div class="order-making-info" v-if="type=='view'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departId && formData.departId.indexOf('{') !== -1">制单人部门：{{JSON.parse(formData.departId).name}}</span>
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
            <public-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                             :discountLevel="formData.discountLevel"
                             :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                             @handleClose="handleClosePublic"
                             @handleSubmit="handleSubmitPublic"></public-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill, auditBill} from "@/api/erp/sales/bill/salesQuotation";
    import {customerOption, commodityOption} from '@/util/table';
    import {getObj} from '@/api/admin/user/index';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    export default {
        name: "sales_price_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'publicSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                permission: {
                    tempAddBtn: true,
                    addBtn: false,
                },
                isSingle: true,
                fileList: undefined,
                headers: undefined,
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
                            span: 8
                        },
                        {
                            label: "单据日期",
                            prop: "billDate",
                            span: 8,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            rules: [{
                                required: true,
                                message: "请选择单据日期",
                                trigger: "change"
                            }],
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
                            label: "客户编码",
                            prop: "customerCode",
                            display: false
                        },
                        {
                            label: "客户",
                            prop: "customerName",
                            span: 8,
                            type: 'text',
                            dicData: [],
                            suffixIcon: 'el-icon-search',
                            placeholder: '请选择客户',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择客户",
                                trigger: "change"
                            }],
                            click: () => {
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
                            label: "订单编号",
                            prop: "billNo",
                            display: false
                        },
                        {
                            label: "销售员Id",
                            prop: "salerId",
                            display: false
                        },
                        {
                            label: "销售员编号",
                            prop: "salerCode",
                            display: false
                        },
                        {
                            label: "销售员",
                            prop: "salerName",
                            display: false
                        },
                        {
                            label: "销售员部门",
                            prop: "salerDepart",
                            display: false
                        },
                        {
                            label: "客户等级",
                            prop: "customerGrade",
                            readonly: true,
                            disabled: true,
                            span: 8
                        },
                        {
                            label: "客户类型",
                            prop: "customerType",
                            readonly: true,
                            disabled: true,
                            span: 8
                        },
                        {
                            label: "有效期",
                            prop: "usefulDate",
                            type: 'date',
                            span: 8,
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                            rules: [{
                                required: true,
                                message: "请选择有效期",
                                trigger: "change"
                            }],
                            pickerOptions: {
                                disabledDate(time) {
                                    return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                }
                            }
                        },
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
                        }, {
                            name: "taxAmount",
                            type: "sum"
                        }, {
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
                            label: "商品名称",
                            prop: "skuName",
                            placeholder: '请选择商品名称',
                            fixed: true,
                            align: 'left',
                            width: 160,
                            overHidden:true,
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
                            width: 160,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 130,
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
                            label: "折扣",
                            prop: "discount",
                            width: 112,
                            overHidden:true,
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
                            overHidden:true,
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
                                    "含税单价"
                                );
                            }
                        },
                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 140,
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
                                    "含税金额"
                                );
                            }
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 110,
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
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "货期(天)",
                            prop: "deliveryDate",
                            span: 6,
                            width: 132,
                            overHidden:true,
                            slot: true,
                            // renderHeader: h => {
                            //     return h(
                            //         "span",
                            //         {
                            //             style: {
                            //                 color: "#ff0000"
                            //             }
                            //         },
                            //         "货期(天)"
                            //     );
                            // }
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 80,
                            overHidden:true,
                            align: 'right'
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            // renderHeader: h => {
                            //     return h(
                            //         "span",
                            //         {
                            //             style: {
                            //                 color: "#F56C6C"
                            //             }
                            //         },
                            //         "单价"
                            //     );
                            // }
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            // renderHeader: h => {
                            //     return h(
                            //         "span",
                            //         {
                            //             style: {
                            //                 color: "#F56C6C"
                            //             }
                            //         },
                            //         "金额"
                            //     );
                            // }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 180,
                            overHidden:true,
                            slot: true,
                        },
                    ]
                },
                option: [],
            };
        },
        mounted() {
            this.headers = {
                Authorization: 'Bearer ' + this.$store.getters.token
            };
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
            console.log(this.type,'test')
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
            headerCellClassName: ({row, column, rowIndex, columnIndex}) => {
                console.log(111);
                return 'main-form-itemstable'
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
            publicColumnBlur(index, val, type, name, item) {
                if (this.type != 'view' || (this.type == 'view' && this.taskType == 'now')) {
                    if (isNaN(val)) {
                        this.vueMessage('warning', '请输入数字!');
                        return;
                    }
                    if (!isNaN(item.qty) && !isNaN(val)) {
                        if (type) {
                            // console.log(this.formData.isBatch&&index===0,777)
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
                                            this.formData.items[i].amount = Number(this.formData.items[i].amount).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].price = (Number(this.formData.items[i].amount) / Number(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].taxPrice = (Number(this.formData.items[i].price) * Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                        }
                                        if (name == 'taxPrice') {
                                            this.formData.items[i].taxPrice = Number(this.formData.items[i].taxPrice).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].discount = (Number(this.formData.items[i].taxPrice) / Number(this.formData.items[i].surfacePrice)).toFixed(this.sysParam.discountDecimal);
                                        }
                                        if (name == 'taxAmount') {
                                            this.formData.items[i].taxAmount = Number(this.formData.items[i].taxAmount).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].taxPrice = (Number(this.formData.items[i].taxAmount) / Number(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].taxAmount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].tax = (Number(this.formData.items[i].amount) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].discount = (Number(this.formData.items[i].taxPrice) / Number(this.formData.items[i].surfacePrice)).toFixed(this.sysParam.discountDecimal);
                                        }
                                        if (name == 'taxRate') {
                                            this.formData.items[i].price = (Number(this.formData.items[i].taxPrice) / Number(1 + Number(this.formData.items[i].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].amount = (Number(this.formData.items[i].qty) * Number(this.formData.items[i].price)).toFixed(this.sysParam.amountDecimal);
                                            this.formData.items[i].tax = (Number(this.formData.items[i].price) * Number(this.formData.items[i].taxRate / 100)).toFixed(this.sysParam.amountDecimal);

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
                                    this.formData.items[index].taxPrice = (Number(this.formData.items[index].discount) * Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                }
                                if (name == 'amount') {
                                    this.formData.items[index].amount = Number(this.formData.items[index].amount).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].price = (Number(this.formData.items[index].amount) / Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                }
                                if (name == 'taxPrice') {
                                    this.formData.items[index].taxPrice = Number(this.formData.items[index].taxPrice).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].discount = (Number(this.formData.items[index].taxPrice) / Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.discountDecimal);
                                }
                                if (name == 'taxAmount') {
                                    this.formData.items[index].taxAmount = Number(this.formData.items[index].taxAmount).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxPrice = (Number(this.formData.items[index].taxAmount) / Number(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].discount = (Number(this.formData.items[index].taxPrice) / Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.discountDecimal);
                                }
                                if (name == 'taxRate') {
                                    this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].amount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[index].tax = (Number(this.formData.items[index].price) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);

                                }
                                this.vueSet(this.formData.items, index, this.formData.items[index]);

                            }





                        }
                    }
                }
            },
            handleTypeChange(index) {
                let row = this.formData.items[index];
                if (!this.isEmpty(row.discount) && !this.isEmpty(row.qty)) {
                    row.price = Number(row.taxPrice / Number(1 + (row.taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                    row.amount = Number(row.price * row.qty).toFixed(this.sysParam.amountDecimal);
                    row.tax = Number(row.price * (row.taxRate) / 100).toFixed(this.sysParam.amountDecimal);
                }
                this.vueSet(this.formData.items, index, row);
            },
            skuBtn(item, index, type) {
                if (this.type != 'view' || (this.type == 'view' && this.taskType == 'now')) {
                    if (!this.formData.customerName) {
                        this.vueMessage('warning', '请先选择客户!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }
            },
            handleInputBlur(index, val, type) {
                // 含税单价 = 面价 * 折扣
                // 单价 = 含税单价 / ( 1 + 税率)
                if (isNaN(val)) {
                    this.vueMessage('warning', '请输入数字!');
                    return;
                }
                let row = this.formData.items[index];
                if (type == 'qty' || type == 'discount') {
                    if (type == 'discount') {

                        row[type] = Number(row[type]).toFixed(this.sysParam.discountDecimal);
                    }
                    if (!this.isEmpty(row.discount) && !this.isEmpty(row.qty)) {
                        row.taxPrice = Number(row.surfacePrice * row.discount).toFixed(this.sysParam.amountDecimal);
                        row.taxAmount = Number(row.taxPrice * row.qty).toFixed(this.sysParam.amountDecimal);
                        row.price = Number(row.taxPrice / Number(1 + (row.taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                        row.amount = Number(row.price * row.qty).toFixed(this.sysParam.amountDecimal);
                        row.tax = Number(row.price * (row.taxRate) / 100).toFixed(this.sysParam.amountDecimal);
                    }
                }
                this.vueSet(this.formData.items, index, row);
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
                };
                this.formData.items.push(d);
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'customerType') {
                        this.formData.customerId = list[0].id;
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                        this.formData.discountLevel = list[0].discountLevel;
                        this.formData.customerGrade = list[0].customerGrade;
                        this.formData.customerType = list[0].customerType;
                    }
                    if (this.typeName == 'commodityType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.whether = 1;
                            itemObj.skuName = item.goodsName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.skuName = item.goodsName;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                            itemObj.qty = 1;
                            itemObj.taxRate = 13;
                            itemObj.unit = item.unit;
                            itemObj.deliveryDate = '';
                            itemObj.discount = item.discount ? item.discount : '';
                            if (item.discount == undefined) {
                                itemObj.price = '';
                                itemObj.taxAmount = '';
                                itemObj.amount = '';
                                itemObj.tax = '';
                                itemObj.taxPrice = '';
                            } else {
                                itemObj.taxPrice = (Number(itemObj.discount) * Number(itemObj.surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                itemObj.price = (Number(itemObj.taxPrice) / Number(1 + Number(itemObj.taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                itemObj.amount = (Number(itemObj.qty) * Number(itemObj.price)).toFixed(this.sysParam.amountDecimal);
                                itemObj.taxAmount = (Number(itemObj.qty) * Number(itemObj.taxPrice)).toFixed(this.sysParam.amountDecimal);
                                itemObj.tax = (Number(itemObj.amount) * Number(itemObj.taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                            }
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
                const maxHeight = this.changeFormHeight(JSON.parse(JSON.stringify(this.formOption.column)), 40);
                this.itemsOption.maxHeight = maxHeight;
                if (type) {
                    this.changeFormWidth(this, 'formOption');
                }
            },
            init() {
                this.loading = true;
                this.processId = '';
                if (this.$refs.form) {
                    this.$refs.form.resetForm();
                    this.$nextTick(this.$refs.form.clearValidate)
                }
                this.vueSet(this, 'formData', {});
                if (this.type && this.type == 'view') {
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                } else {
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                for (var i in this.formOption.column) {
                    if (this.type == 'view') {
                        //this.formOption.column[i].readonly =  true;
                        if (this.formOption.column[i].disabled != undefined) {
                            this.formOption.column[i].disabled = false;
                        }
                    } else {
                        if (this.formOption.column[i].disabled != undefined) {
                            this.formOption.column[i].disabled = true;
                        }
                    }
                }
                if (this.id) {
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    let formData = {
                        salerId: this.$store.getters.userInfo.id,
                        salerCode: this.$store.getters.userInfo.no,
                        salerName: this.$store.getters.userInfo.name,
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [{
                            skuName: ''
                        }]
                    };
                    this.vueSet(this, 'formData', formData);
                    this.handleSetDepart(this.$store.getters.userInfo.id);
                    this.loading = false;
                }
            },
            handleSetDepart(id) {
                getObj(id).then(response => {
                    var depart = response.data.data.departId;
                    var salerDepart = depart.indexOf('{') > -1 ? JSON.parse(depart).name : depart;
                    this.vueSet(this.formData, 'salerDepart', salerDepart);
                })
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
                            name: '销售报价制单',
                            query: {
                                id: this.formData.id,
                                type: this.type
                            },
                            meta: {
                                i18n: 'sales_quotation_prices'
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
            handleIsNaN(value) {
                return typeof value === 'number' && !isNaN(value);
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
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        } else if (!this.handleIsNaN(Number(items[i].qty))) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为数字');
                            return false;
                        }
                        if (this.isEmpty(items[i].discount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的折扣为必填项');
                            return false;
                        } else if (!this.handleIsNaN(Number(items[i].discount))) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的折扣为数字');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxRate)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的税率为必填项');
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
                        let list = JSON.parse(JSON.stringify(this.formData.items));
                        let sumAmount = 0;
                        let sumTaxAmount = 0;
                        let formData = JSON.parse(JSON.stringify(this.formData));
                        formData.items = this.clearNoGoodsIdData(formData.items);
                        for (let i in formData.items) {
                            sumAmount = Number(sumAmount) + Number(formData.items[i].amount);
                            sumTaxAmount = Number(sumTaxAmount) + Number(formData.items[i].taxAmount);
                        }
                        formData.billAmount = sumAmount.toFixed(this.sysParam.amountDecimal);
                        formData.taxBillAmount = sumTaxAmount.toFixed(this.sysParam.amountDecimal);


                        saveBill(formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.clocseCurrent(this, this.$route);
                                this.$router.push({
                                    path: '/sales_price',
                                    name: '销售报价',
                                    meta: {
                                        i18n: 'sales_price'
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
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            uploadCompleted(response, file, fileList) {
                const dataMap = this.dataMap(this.formData.items, response.data);
                if (dataMap.length > 0) {
                    this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                    return;
                }
                for (var index in response.data) {
                    var item = response.data[index];
                    var itemObj = {};
                    itemObj.whether = 1;
                    itemObj.skuName = item.skuName;
                    itemObj.skuNo = item.skuNo;
                    itemObj.brandName = item.brandName;
                    itemObj.categoryName = item.categoryName;
                    itemObj.seriesName = item.seriesName;
                    itemObj.itemNo = item.itemNo;
                    itemObj.specifications = item.specifications;
                    itemObj.surfacePrice = item.surfacePrice;
                    itemObj.discount = item.discount;
                    itemObj.qty = item.qty;
                    itemObj.price = item.price;
                    itemObj.taxRate = item.taxRate;
                    itemObj.taxAmount = item.taxAmount;
                    itemObj.unit = item.unit;
                    itemObj.deliveryDate = item.deliveryDate;
                    itemObj.amount = item.amount;
                    itemObj.tax = item.tax;
                    itemObj.taxPrice = item.taxPrice;
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
        }
    };
</script>
