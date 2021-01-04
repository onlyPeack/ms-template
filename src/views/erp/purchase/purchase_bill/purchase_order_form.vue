<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="{tempAddBtn: true,addBtn: false}"
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
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="isBatch">
                        <div class="tableItem" style="display: unset">
                            <el-tooltip class="item" effect="dark"
                                        content="可针对折扣、税率进行批量设置"
                                        placement="top-start">
                                <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                            </el-tooltip>
                            <el-switch v-model="formData.isBatch" placeholder="请输入调拨价"></el-switch>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items"   :summary-method="getSummaries" :class="type == 'view'?'':'main-form-items'"
                                   @selection-change="handleSelectionChange">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>

                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入采购数量"
                                              :disabled="type=='view'?true:false"
                                              @blur="qtyBlur(scope.row.$index,scope.row.qty)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discount">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.discount" placeholder="请输入折扣"
                                              @blur="taxPriceBlur(scope.row.$index,scope.row.discount,'discount')"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价"
                                              @blur="taxPriceBlur(scope.row.$index,scope.row.taxPrice,'taxPrice')"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxRate">
                                <div class="zRightClass">
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;"
                                               :disabled="type=='view'?true:false"
                                               @change="handleTypeChange(scope.row.$index,scope.row.taxRate)">
                                        <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="goodsDate">
                                <div>
                                    <el-date-picker v-model="scope.row.goodsDate" align="left" type="date"
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
                <div class="order-making-info" v-if="type=='view'">
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
                            :code="formData.customerCode" :selectType="selectType"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, auditBill, tempAddBill} from "@/api/erp/purchase/bill/purchaseOrder";
    import {purchaseOption, userOption, applyOption, commodityOption, warehouseOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    import { getDefault} from '@/api/erp/project_management/projectOverview';
    export default {
        name: "purchase_apply_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                selectType: 1,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                    },
                },
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
                index: 0,
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
                            label: "申请单号",
                            prop: "sourceBillNo",
                            width: 130,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            width: 120,
                            overHidden:true,
                            align: 'left',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "商品名称"
                                );
                            },
                            slot: true
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
                            width: 100,
                            overHidden:true,
                            align: 'left',
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            placeholder: ' ',
                            width: 85,
                            overHidden:true,
                            align: 'left',
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            placeholder: ' ',
                            width: 80,
                            overHidden:true,
                            align: 'left',
                        },
                        {
                            label: "系列",
                            prop: "seriesName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            placeholder: ' ',
                            width: 80,
                            overHidden:true,
                            align: 'left'
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            overHidden:true,
                            align:'right',
                        },
                        {
                            label: "折扣",
                            prop: "discount",
                            width: 120,
                            overHidden:true,
                            align:'right',
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
                            label: "采购数量",
                            prop: "qty",
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
                                    "采购数量"
                                );
                            }
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 120,
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
                            label: "价税合计",
                            prop: "taxAmount",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "税率(%)",
                            prop: "taxRate",
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
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 100,
                            overHidden:true,
                            align: 'right',
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
                            width: 100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 120,
                            overHidden:true,
                            align: 'left',
                            slot: true
                        },

                    ]
                },
                formOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    column:
                        [
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
                                span:6,
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
                                label: "供应商ID",
                                prop: "supplierId",
                                display: false
                            },
                            {
                                label: "供应商编号",
                                prop: "supplierCode",
                                display: false
                            },
                            {
                                label: "供应商",
                                prop: "supplierName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择供应商',
                                filterable: true,
                                readonly: true,
                                clearable: false,
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
                                    this.selectType = 1;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "采购员编号",
                                prop: "purchaserCode",
                                display: false
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
                            },
                            {
                                label: "采购部门",
                                prop: "departName",
                                span: 6,
                                readonly: true,
                                disabled: true,
                            },
                            {
                                label: "关联单据",
                                prop: "sourceBillNo",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择关联单据',
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择关联单据';
                                    this.typeName = 'applyType';
                                    this.option = applyOption;
                                    this.isSingle = false;
                                    this.selectType = 1;
                                    this.publicVisible = true;
                                },
                            },
                            {
                                label: "入库仓库",
                                prop: "warehouseName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择入库仓库',
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择入库仓库';
                                    this.typeName = 'warehouseType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.selectType = 1;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "联系人",
                                prop: "linkMan",
                                span: 6,
                                disabled: true,
                            },
                            {
                                label: "联系人电话",
                                prop: "linkPhone",
                                span: 6,
                                disabled: true,
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
            handleDownLoad(){
                getDefault(1).then(res => {
                    if(res.data.code == '401'){
                        this.vueMessage('warning',res.data.msg);
                    }else{
                        this.$router.push({path:'/print/purchase_order_print',query:{id:this.id}})
                    }
                })

            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    console.log(this.formData.sourceBillNo.length)
                    if(this.formData.sourceBillNo.length > 0){
                        this.vueMessage('warning', '关联单据时不能选择新的商品!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                    this.selectType = 1;
                }

            },
            handleTypeChange(index, val) {
                if(this.formData.isBatch&&index===0){//批量设置

                    let length=this.formData.items.length-1
                    if(this.formData.items[this.formData.items.length-1].id&&this.formData.items[this.formData.items.length-1].id!==''){
                        length=this.formData.items.length
                    }

                        //批量赋值
                        for (let i = 1; i <length ; i++) {
                            this.$set(this.formData.items[i],'taxRate',val)
                        }

                        //整理数据(仿照discount)
                        for (let i = 0; i <length ; i++) {
                            try {
                                if (this.formData.items[i].taxPrice && this.formData.items[i].qty) {
                                    if (!isNaN(this.formData.items[i].taxPrice) && !isNaN(this.formData.items[i].qty)) {
                                        this.formData.items[i].price = Number(this.formData.items[i].taxPrice / Number(1 + (this.formData.items[i].taxRate) / 100)).toFixed(this.sysParam.amountDecimal)
                                        this.formData.items[i].amount = (Number(this.formData.items[i].price) * parseInt(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[i].tax = (Number(this.formData.items[i].amount) * (Number(this.formData.items[i].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                                    }
                                }
                            }catch (e) {

                            }

                        }


                }else{
                    if (this.formData.items[index].taxPrice && this.formData.items[index].qty) {
                        if (!isNaN(this.formData.items[index].taxPrice) && !isNaN(this.formData.items[index].qty)) {
                            this.formData.items[index].price = Number(this.formData.items[index].taxPrice / Number(1 + (this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                            this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                            this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                            this.vueSet(this.formData.items, index, this.formData.items[index]);
                        }
                    }
                }

            },
            taxPriceBlur(index, val,type) {
                if (!isNaN(val)) {

                    if(this.formData.isBatch&&index===0){//批量设置
                        let keyArr=['discount','taxRate']
                        let length=this.formData.items.length-1
                        if(this.formData.items[this.formData.items.length-1].itemNo&&this.formData.items[this.formData.items.length-1].itemNo!==''){
                            length=this.formData.items.length
                        }
                        if(keyArr.indexOf(type)>-1){
                            //批量赋值
                            for (let i = 1; i <length ; i++) {
                                this.$set(this.formData.items[i],type,val)
                            }
                        }

                        //整理数据(仿照discount)
                        for (let i = 0; i <length ; i++) {
                            try {
                                if(type == 'discount'){
                                    this.formData.items[i].discount = Number(this.formData.items[i].discount).toFixed(this.sysParam.discountDecimal);
                                    this.formData.items[i].taxPrice =  (Number(this.formData.items[i].surfacePrice) * Number(this.formData.items[i].discount)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[i].taxAmount = (this.formData.items[i].taxPrice * parseInt(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[i].price = Number(this.formData.items[i].taxPrice / Number(1 + (this.formData.items[i].taxRate) / 100)).toFixed(this.sysParam.amountDecimal)
                                    this.formData.items[i].amount = (Number(this.formData.items[i].price) * parseInt(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                    this.formData.items[i].tax = (Number(this.formData.items[i].amount) * (Number(this.formData.items[i].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                                } else{
                                    if (this.formData.items[i].qty && !isNaN(this.formData.items[i].qty)) {
                                        this.formData.items[i].taxAmount = (this.formData.items[i].taxPrice * parseInt(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[i].price = Number(this.formData.items[i].taxPrice / Number(1 + (this.formData.items[i].taxRate) / 100)).toFixed(this.sysParam.amountDecimal)
                                        this.formData.items[i].amount = (Number(this.formData.items[i].price) * parseInt(this.formData.items[i].qty)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[i].tax = (Number(this.formData.items[i].amount) * (Number(this.formData.items[i].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                                        this.formData.items[i].discount =  (Number(this.formData.items[i].taxPrice) / Number(this.formData.items[i].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                    }
                                }
                            }catch (e) {

                            }

                        }

                    }else{

                        if(type == 'discount'){
                            this.formData.items[index].discount = Number(this.formData.items[index].discount).toFixed(this.sysParam.discountDecimal);
                            this.formData.items[index].taxPrice =  (Number(this.formData.items[index].surfacePrice) * Number(this.formData.items[index].discount)).toFixed(this.sysParam.amountDecimal);
                            this.formData.items[index].taxAmount = (this.formData.items[index].taxPrice * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                            this.formData.items[index].price = Number(this.formData.items[index].taxPrice / Number(1 + (this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal)
                            this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                            this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                            this.vueSet(this.formData.items, index, this.formData.items[index]);
                        } else{
                            if (this.formData.items[index].qty && !isNaN(this.formData.items[index].qty)) {
                                this.formData.items[index].taxAmount = (this.formData.items[index].taxPrice * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                                this.formData.items[index].price = Number(this.formData.items[index].taxPrice / Number(1 + (this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal)
                                this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(this.formData.items[index].qty)).toFixed(this.sysParam.amountDecimal);
                                this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                                this.formData.items[index].discount =  (Number(this.formData.items[index].taxPrice) / Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.amountDecimal);
                                this.vueSet(this.formData.items, index, this.formData.items[index]);
                            }
                        }

                    }




                } else {
                    if(type == 'discount'){
                        this.formData.items[index].discount = ''+ '';
                    }else{
                        this.formData.items[index].taxPrice = '' + '';
                    }
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                }
            },
            handleAddRow() {
                const d = {
                    skuName: '',
                    taxRate: 13,
                }
                this.formData.items.push(d);
            },
            qtyBlur(index, val) {
                if (!isNaN(val)) {
                    if (this.formData.items[index].maxQty && val > this.formData.items[index].maxQty) {
                        this.vueMessage('warning', '你输入的采购数量不能大于可做采购数量!');
                        this.formData.items[index].qty = this.formData.items[index].maxQty;
                        return
                    }
                    if (this.formData.items[index].taxPrice && !isNaN(this.formData.items[index].taxPrice)) {
                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice) / (Number(parseInt(100) + Number(this.formData.items[index].taxRate)) / 100)).toFixed(this.sysParam.amountDecimal)
                        this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(val)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * parseInt(val)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax = (Number(this.formData.items[index].amount) * (Number(this.formData.items[index].taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                } else {
                    this.formData.items[index].qty = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                }
            },
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    return
                }
                this.formData.items.splice(index, 1);
            },
            handleSelectionChange(selection) {

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
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'purchaseType') {
                        this.formData.supplierCode = list[0].supplierCode;
                        this.formData.supplierName = list[0].supplierName;
                        this.formData.supplierId = list[0].id;
                        this.formData.linkMan = list[0].linkMan;
                        this.formData.linkPhone = list[0].linkPhone;
                        this.formData.purchaserId = list[0].managerId;
                        this.formData.purchaserCode = list[0].managerCode;
                        this.formData.purchaserName = list[0].managerName;
                        this.formData.departName = list[0].departName;
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name
                        this.formData.warehouseId = list[0].id
                    }
                    if (this.typeName == 'applyType' || this.typeName == 'commodityType') {

                        if (this.typeName == 'applyType') {
                            this.formData.items= [{}];
                            this.formData.warehouseName = list[0].mainDTO.warehouseName;
                            this.formData.warehouseId = list[0].mainDTO.warehouseId;
                            this.formData.sourceBillNo = list[0].billNo;
                        }
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            if (this.typeName == 'applyType') {
                                itemObj.sourceBillId = item.id;
                                itemObj.sourceBillNo = item.billNo;
                                itemObj.sourceObjectKey = 'CGSQ';
                                itemObj.skuName = item.skuName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.categoryName = item.categoryName;
                                itemObj.seriesName = item.seriesName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.surfacePrice = item.surfacePrice;
                                itemObj.specifications = item.specifications;
                                itemObj.maxQty = Number(item.applyQty - item.purchasedQty);
                                itemObj.applyQty = item.applyQty;
                                itemObj.brandName = item.brandName;
                                itemObj.taxPrice =(item.taxPrice || '') + '';
                                itemObj.price ='';
                                itemObj.amount =item.amount;
                                itemObj.discount = '';
                                itemObj.tax =item.tax;
                                itemObj.taxAmount =item.taxAmount;
                                itemObj.unit = item.unit;
                                itemObj.qty = Number(item.applyQty - item.purchasedQty);
                                itemObj.taxRate = item.taxRate;
                                itemObj.goodsDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            } else {
                                itemObj.categoryName = item.categoryName;
                                itemObj.seriesName = item.seriesName;
                                itemObj.skuName = item.goodsName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.itemNo = item.itemNo;
                                itemObj.surfacePrice = item.retailPrice;
                                itemObj.specifications = item.specifications;
                                itemObj.applyQty = item.thisApplyQty - item.purchasedQty;
                                itemObj.brandName = item.brandName;
                                itemObj.unit = item.unit;
                                itemObj.discount = '';
                                itemObj.taxPrice = ''+ '';
                                itemObj.price ='';
                                itemObj.qty = 1;
                                itemObj.taxRate = 13;
                                itemObj.goodsDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            }

                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow();
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
                    this.index = 1;
                    this.handleGetBill(getBill, this.id);
                } else {
                    //purchaserName
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [
                            {
                                skuName: '',
                                taxRate: 13,
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
                this.handleBillAdd(this,{path: '/purchase_order_form', name: '采购订单制单'});
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
                        this.$nextTick(() => {
                            this.vueSet(this, 'formData', formData);
                        })
                        this.index = 0;
                    } else {
                        this.vueMessage('warning', res.data.msg);
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
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的采购数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的付款单价为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].discount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的折扣为必填项');
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
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        let list = JSON.parse(JSON.stringify(this.formData.items));
                        let sumAmount = 0;
                        let sumTaxAmount = 0;
                        for (let i in list) {
                            sumAmount = Number(sumAmount) + Number(list[i].amount);
                            sumTaxAmount = Number(sumTaxAmount) + Number(list[i].taxAmount);
                        }
                        this.formData.billAmount = sumAmount.toFixed(this.sysParam.amountDecimal);
                        this.formData.taxBillAmount = sumTaxAmount.toFixed(this.sysParam.amountDecimal);
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$router.push({
                                    path: '/purchase_order',
                                    name: '采购订单',
                                    meta: {
                                        i18n: 'purchase_order'
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
<style>
    .imgTabelItem{
        display: inline-block;
        width: 14px;
        height: 14px;
    }
    .tableItem{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 6px;
    }
</style>
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
