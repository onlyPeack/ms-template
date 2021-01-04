<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="justify-content: unset;position: relative">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="{tempAddBtn: true,addBtn: false}"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"></button-bar>
                    <!--<router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"-->
                                 <!--:to="{path:'/print/purchase_stock_in_print',query:{id:id}}">-->
                        <!--<el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印-->
                        <!--</el-button>-->
                    <!--</router-link>-->
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
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>

                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <!--<i class="el-icon-plus" @click="handleAddRow(true)"-->
                                    <!--style="margin-right: 15px;color:  #409EFF;"></i>-->
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择产品" readonly
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              :disabled="type=='view'?true:false"
                                              @blur="qtyBlur(scope.row.$index,scope.row.qty)"></el-input>
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
                          :billNo="formData.billNo" ></task-history>
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :code="formData.warehouseId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName" selectType="2"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
            <associated-selector v-if="associatedVisible" ref="associatedSelector" :dialogVisible="associatedVisible"
                                 :title="associatedTitle" :isSingle="isSingle" :associatedName="associatedName" selectType="2"
                                 @handleClose="handleCloseAssociated"
                                 @handleSubmit="handleSubmitAssociated"></associated-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, addBill, tempAddBill,auditBill} from "@/api/erp/wms/bill/purchaseStockIns";
    import {commodityOption, positionOption,warehouseOption,ordersOptions} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    export default {
        name: "purchase_stock_in_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'associatedSelector': () => import('@/components/erp/associated_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                positionIndex: 0,
                isSingle: true,
                isShow: true,
                loading: false,
                formData: {},
                publicVisible: false,
                associatedVisible: false,
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                publicTitle: '',
                typeName: '',
                index: 0,
                associatedTitle: '关联单据',
                associatedName: '',
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
                            label: "商品名称",
                            prop: "skuName",
                            width: 120,
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
                            align: 'left',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            align: 'left',
                            width: 100,
                            overHidden:true,
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
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            placeholder: ' ',
                            width: 70,
                            align: 'left'
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            placeholder: ' ',
                            width: 80,
                            overHidden:true,
                            align: 'left'
                        },
                        {
                            label: "入库数量",
                            prop: "stockInQty",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "取消数量",
                            prop: "qty",
                            width: 100,
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
                                    "取消数量"
                                );
                            }
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "含税金额",
                            prop: "taxAmount",
                            width: 100,
                            align: 'right',
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                            type: 'select',
                            dicData: this.taxRateOptions
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
                            minWidth: 100,
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
                                readonly: true,
                                placeholder: "自动生成",
                                span:8
                            },
                            {
                                label: "单据日期",
                                prop: "billDate",
                                span: 8,
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
                                span: 8,
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
                                    this.publicTitle = '请选择关联单据';
                                    this.typeName = 'ordersTypes';
                                    this.option = ordersOptions;
                                    this.isSingle = false;
                                    this.publicVisible = true;
                                },
                                rules: [{
                                    required: true,
                                    message: "请选择关联单据",
                                    trigger: "change"
                                }],
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
                                span: 8,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                disabled: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择供应商",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "取消入库仓库",
                                prop: "warehouseId",
                                display: false
                            },
                            {
                                label: "取消入库仓库",
                                prop: "warehouseName",
                                span: 8,
                                type: 'text',
                                disabled: true,
                                // dicData: [],
                                // filterable: true,
                                // readonly: true,
                                // suffixIcon: 'el-icon-search',
                                // placeholder:'请选择取消入库仓库',
                                // clearable: false,
                                click: ({value, column}) => {
                                    // if (this.type == 'view') {
                                    //     return
                                    // }
                                    // this.publicTitle = '请选择仓库';
                                    // this.typeName = 'warehouseType';
                                    // this.option = warehouseOption;
                                    // this.isSingle = true;
                                    // this.publicVisible = true;
                                },
                                rules: [{
                                    required: true,
                                    message: "请选择入库仓库",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "采购员Id",
                                prop: "purchaserId",
                                display: false
                            },
                            {
                                label: "采购员编号",
                                prop: "purchaserCode",
                                display: false
                            },
                            {
                                label: "采购员",
                                prop: "purchaserName",
                                span: 8,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                disabled: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择采购员",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "整单备注",
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
                option: [],
            };
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
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
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
                    this.isSingle = false;
                    this.publicTitle = '请选择产品';
                    this.typeName = 'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }

            },
            handleCloseAssociated() {
                this.associatedVisible = false;
            },
            handleSubmitAssociated(list) {
                this.associatedVisible = false;
                if (list.length > 0) {
                    this.publicVisible = false;

                    this.$refs.associatedSelector.selectionClear();
                }
            },
            handleAddRow() {
                const d = {
                    skuName: '',
                }
                this.formData.items.push(d);
            },
            qtyBlur(index, val) {
               if(val != ' ' &&  val!=''){
                   if (!isNaN(val)) {
                       if (this.formData.items[index].maxQty && val > this.formData.items[index].maxQty) {
                           this.vueMessage('warning', '你输入的入库取消数量不能大于可取消数量!');
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
               }
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
                    if (item.skuNo) {
                        list.forEach(function (obj) {
                            if (obj.skuNo == item.skuNo) {
                                map.push(obj.skuNo);
                            }
                        });
                    }
                });
                return map;
            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name
                        this.formData.warehouseId = list[0].id
                    }
                    if (this.typeName == 'commodityType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.whether = 1;
                            itemObj.skuName = item.goodsName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.qty = 1;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.price = item.price;
                            itemObj.amount = (Number(itemObj.price) * Number(itemObj.qty)).toFixed(this.sysParam.amountDecimal);
                            itemObj.taxAmount = (Number(itemObj.taxPrice) * Number(itemObj.qty)).toFixed(this.sysParam.amountDecimal);
                            itemObj.tax = (Number(itemObj.amount) * (Number(itemObj.taxRate) / 100)).toFixed(this.sysParam.amountDecimal);
                            itemObj.unit = item.unit;
                            itemObj.surfacePrice = item.retailPrice;
                            itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    this.formData.items = [];
                    if (this.typeName == 'ordersTypes') {
                        this.formData.sourceBillNo = list[0].billNo;
                        this.formData.supplierCode = list[0].mainDTO.supplierCode;
                        this.formData.supplierName = list[0].mainDTO.supplierName;
                        this.formData.supplierId = list[0].mainDTO.supplierId;
                        this.formData.purchaserCode = list[0].mainDTO.purchaserCode;
                        this.formData.purchaserName = list[0].mainDTO.purchaserName;
                        this.formData.purchaserId = list[0].mainDTO.purchaserId;
                        this.formData.warehouseId = list[0].mainDTO.warehouseId;
                        this.formData.warehouseName = list[0].mainDTO.warehouseName;
                        this.formData.linkPerson = list[0].mainDTO.linkMan;
                        this.formData.linkPhone = list[0].mainDTO.linkPhone;
                        this.formData.departName = list[0].mainDTO.departName;
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '产品编码(' + dataMap.join(",") + ')已有相同的产品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillId = item.id;
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceObjectKey = 'CGRK';
                            itemObj.skuName = item.skuName;
                            itemObj.brandName = item.brandName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.qty = Number(item.qty*1 - item.returnQty*1 - item.cancelQty*1);
                            itemObj.stockInQty =  item.qty;
                            itemObj.maxQty = Number(item.qty*1 - item.returnQty*1 - item.cancelQty*1);
                            itemObj.price = item.price;
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.amount = item.amount;
                            itemObj.taxRate = item.taxRate;
                            itemObj.tax = item.tax;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.taxAmount = item.taxAmount;
                            itemObj.unit = item.unit;
                            itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            this.formData.items.push(itemObj);
                        }
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
                    this.itemsOption.column[0].hide = true;
                    this.formOption.disabled = true;
                }else{
                    this.itemsOption.column[0].hide = false;
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getBill, this.id);
                } else {
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
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
                this.handleBillAdd(this,{path: '/purchase_stock_in_form', name: '入库取消制单'});
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
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
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
                                    path: '/purchase_stock_in_cancel',
                                    name: '入库取消',
                                    meta: {
                                        i18n: 'purchase_stock_in_cancel'
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
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
