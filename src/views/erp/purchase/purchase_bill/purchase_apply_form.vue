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
                                @handlePreserve="handleSubmit"
                                @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/purchase_apply_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
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
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" v-if="isShows" :data="formData.items" :class="type == 'view'?'':'main-form-items'"
                                   @selection-change="handleSelectionChange">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow"
                                       style="margin-right: 15px;color:  #409EFF;" v-if="formData.applyType<2"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品"
                                              :disabled="type=='view'?true:false" readonly></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="applyQty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.applyQty" placeholder="本次申请数量"
                                              @blur="qtyBlur(scope.row.$index,scope.row.applyQty)"
                                              :disabled="type=='view'?true:false"></el-input>
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
            <task-history v-if="processId && processId!='' && taskType=='now'" :processId="processId" :class="type=='view'?'processIdBTN':''"
                          :billNo="formData.billNo"></task-history>
            <div style="margin-top: 5px;margin-bottom: 60px;">
                <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
                    <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注"
                              v-model="comment"></el-input>
                </div>

            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :selectType="formData.applyType == 4 || formData.applyType == '4'? 4 : 2"
                            :code="formData.warehouseId"
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
        auditBill,
        selectDefault
    } from "@/api/erp/purchase/bill/purchaseApply";
    import {customerOrderOption, warehouseOption, commodityOption, relationsOption, userOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    const transportOption = [
        {
            value: '0',
            label: '快递运输'
        },
        {
            value: '1',
            label: '运费到付'
        },
        {
            value: '2',
            label: '货物自提'
        }
    ]
    const applyOption = [
        {
            value: '0',
            label: '缺货补货'
        },
        {
            value: '1',
            label: '预警补货'
        }, {
            value: '4',
            label: '以销订购'
        }
    ]
    export default {
        name: "purchase_apply_form",
        props: ['type', 'id', 'taskType', 'step', 'obj'],
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
                isShows: true,
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
                    disabled: false,
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
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
                            width: 100,
                            overHidden:true,
                            placeholder: ' ',
                            readonly: true,
                            align: 'left',
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 100,
                            overHidden:true,
                            placeholder: ' ',
                            readonly: true,
                            align: 'left',
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 80,
                            overHidden:true,
                            placeholder: ' ',
                            readonly: true,
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
                            width: 80,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            overHidden:true,
                            align:'right',
                        },
                        {
                            label: "订单数量",
                            prop: "orderQty",
                            width: 100,
                            align: 'right'
                        },
                        {
                            label: "已锁库数量",
                            prop: "lockQty",
                            width: 100,
                            align: 'right',
                            hide: false
                        },
                        {
                            label: "可用库存数量",
                            prop: "stockQty",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                            hide: false
                        },
                        {
                            label: "本次申请数量",
                            prop: "applyQty",
                            width: 160,
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
                                    "本次申请数量"
                                );
                            }
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 160,
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
                                label: "客户ID",
                                prop: "customerId",
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
                                pickerOptions: {
                                    disabledDate(time) {
                                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                    },
                                }
                            },
                            {
                                label: "申请人编号",
                                prop: "applyCode",
                                display: false
                            },
                            {
                                label: "申请人",
                                prop: "applyName",
                                span: 8,
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
                                    this.isSingle = true;
                                    this.publicTitle = '请选择申请人';
                                    this.typeName = 'userType';
                                    this.option = userOption;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "需求仓库ID",
                                prop: "warehouseId",
                                display: false
                            },
                            {
                                label: "需求仓库",
                                prop: "warehouseName",
                                span: 8,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择需求仓库',
                                rules: [{
                                    required: true,
                                    message: "请选择需求仓库",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择需求仓库';
                                    this.typeName = 'warehouseType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "申请类型",
                                prop: "applyType",
                                span: 8,
                                type: 'select',
                                dicData: applyOption,
                                filterable: true,
                                readonly: true,
                                rules: [{
                                    required: true,
                                    message: "请选择申请类型",
                                    trigger: "change"
                                }],
                                change: ({value, column}) => {
                                    if (window.event && window.event.type == 'message') {
                                        this.formData.sourceBillNo = '';
                                        this.formData.items = [];

                                        for(let i in this.itemsOption.column){
                                            if (value == 4){
                                                if(this.itemsOption.column[i].prop == 'lockQty'){
                                                    this.itemsOption.column[i].hide = false;
                                                }
                                                if(this.itemsOption.column[i].prop == 'stockQty'){
                                                    this.itemsOption.column[i].hide = true;
                                                }
                                            }else{
                                                if(this.itemsOption.column[i].prop == 'lockQty'){
                                                    this.itemsOption.column[i].hide = true;
                                                }
                                                if(this.itemsOption.column[i].prop == 'stockQty'){
                                                    this.itemsOption.column[i].hide = false;
                                                }
                                            }
                                        }
                                        this.vueSet(this, 'itemsOption', this.itemsOption);
                                        this.isShows = false;
                                        setTimeout(()=>{
                                            this.isShows = true;
                                        },10)
                                        if (value < 2) {
                                            this.handleAddRow();
                                        }
                                    }
                                }
                            },
                            {
                                label: "关联单据",
                                prop: "sourceBillNo",
                                span: 8,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择关联单据',
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view' || this.formData.applyType != '2' || this.formData.applyType != '3' || this.formData.applyType != '4') {
                                        if (this.type == 'view') {
                                            return
                                        }
                                        if (this.formData.applyType != '2' && this.formData.applyType != '3' && this.formData.applyType != '4') {
                                            this.vueMessage('warning', '该申请类型无须关联单据!');
                                            return
                                        }

                                    }
                                    if (!this.formData.warehouseId || this.formData.warehouseId == undefined || this.formData.warehouseId == '') {
                                        this.vueMessage('warning', '请先选择需求仓库!');
                                        return
                                    }

                                    this.publicTitle = '请选择关联单据';
                                    if (this.formData.applyType == '2') {
                                        this.typeName = 'slectItemBillByPageSummaryType';
                                        this.option = customerOrderOption;
                                    }
                                    if (this.formData.applyType == '3') {
                                        this.typeName = 'relationssType';
                                        this.option = relationsOption;
                                    }
                                    if (this.formData.applyType == '4') {
                                        this.typeName = 'customerssOrderType';
                                        this.option = customerOrderOption;
                                    }
                                    this.isSingle = false;
                                    this.publicVisible = true;
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
            skuBtn() {
                if (this.type != 'view' && this.formData.applyType != '2' && this.formData.applyType != '3' && this.formData.applyType != '4') {
                    this.isSingle = false;
                    this.publicTitle = '请选择商品';
                    this.typeName =this.formData.applyType == '1'?'queryStockWarningType':'commodityType';
                    this.option = commodityOption;
                    this.publicVisible = true;
                }
            },
            handleAddRow() {
                const d = {
                    skuName: '',
                }
                this.formData.items.push(d);
            },
            qtyBlur(index, val) {
                if (this.formData.applyType == '4') {
                    if (this.formData.items[index].maxQty < val) {
                        this.vueMessage('warning', '你输入的本次申请数量不能大于可申请数量!');
                        this.formData.items[index].applyQty = 1;
                    }
                }
                this.vueSet(this.formData.items, index, this.formData.items[index]);
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
                    if (this.typeName == 'userType') {
                        this.formData.applyId = list[0].id;
                        this.formData.applyCode = list[0].no;
                        this.formData.applyName = list[0].name;
                        this.formData.departName = JSON.parse(list[0].departId).name;
                    }
                    if (this.typeName == 'customerType') {
                        this.formData.customerCode = list[0].customerCode;
                        this.formData.customerName = list[0].customerName;
                        this.formData.customerId = list[0].id;
                    }
                    if (this.typeName == 'slectItemBillByPageSummaryType' || this.typeName == 'relationssType') {
                        this.formData.sourceBillNo = list[0].billNo;
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillId = item.id;
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceObjectKey = 'SCDD';
                            itemObj.masterId = item.masterId;
                            itemObj.billNo = item.billNo;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.skuName = item.skuName;
                            itemObj.specifications = item.specifications;
                            itemObj.unit = item.unit;
                            itemObj.orderQty = item.qty;
                            if (this.typeName == 'relationssType') {
                                itemObj.maxQty = item.qty * 1 - item.stockQty * 1 - item.applyQty * 1;
                                itemObj.applyQty = item.qty * 1 - item.stockQty * 1 - item.applyQty * 1;
                            }
                            if (this.typeName == 'slectItemBillByPageSummaryType') {
                                itemObj.maxQty = item.qty * 1 - item.branchQty * 1 - item.applyQty * 1;
                                itemObj.applyQty = item.qty * 1 - item.branchQty * 1 - item.applyQty * 1;
                            }
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.stockQty = item.stockQty;
                            itemObj.allocatedQty = item.branchQty;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow()
                        });
                    }

                    if (this.typeName == 'customerssOrderType') {
                        this.formData.sourceBillNo = list[0].billNo;
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillId = item.id;
                            itemObj.sourceBillNo = item.billNo;
                            itemObj.sourceObjectKey = 'XSDD';
                            itemObj.masterId = item.masterId;
                            itemObj.billNo = item.billNo;
                            itemObj.skuNo = item.skuNo;
                            itemObj.skuName = item.skuName;
                            itemObj.specifications = item.specifications;
                            itemObj.brandName = item.brandName;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.unit = item.unit;
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.orderQty = item.qty;
                            itemObj.stockQty = item.stockQty;
                            itemObj.lockQty = item.lockQty;
                            itemObj.maxQty = item.notStockOutSaleQty * 1 - item.applyQty * 1 - item.lockQty * 1 - item.purchaseStockInQty * 1;
                            itemObj.applyQty = item.notStockOutSaleQty * 1 - item.applyQty * 1 - item.lockQty * 1 - item.purchaseStockInQty * 1;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow()
                        });
                    }

                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name;
                        this.formData.warehouseId = list[0].id
                    }
                    if (this.typeName == 'commodityType' || this.typeName == 'queryStockWarningType' ) {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.sourceBillId = item.id;
                            itemObj.stockQty = item.stockQty;
                            itemObj.billNo = item.billNo;
                            itemObj.skuNo = item.skuNo;
                            itemObj.skuName = item.goodsName;
                            itemObj.specifications = item.specifications;
                            itemObj.brandName = item.brandName;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.unit = item.unit;
                            itemObj.applyQty = 1;
                            itemObj.qty = item.qty;
                            itemObj.maxQty = item.lessQty;
                            itemObj.applyQty = item.lessQty;
                            itemObj.stockQty = item.useQty;
                            itemObj.surfacePrice = item.retailPrice;
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

                    let formData = {
                        applyId: this.$store.getters.userInfo.id,
                        applyCode: this.$store.getters.userInfo.no,
                        applyName: this.$store.getters.userInfo.name,
                        departName: this.$store.getters.userInfo.departName,
                        applyType: this.obj && this.obj != undefined ? '1' : '0',
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        deliverDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: []
                    };
                    for(let i in this.itemsOption.column){
                        if (Number(formData.applyType) == 4){
                            if(this.itemsOption.column[i].prop == 'lockQty'){
                                this.itemsOption.column[i].hide = false;
                            }
                            if(this.itemsOption.column[i].prop == 'stockQty'){
                                this.itemsOption.column[i].hide = true;
                            }
                        }else{
                            if(this.itemsOption.column[i].prop == 'lockQty'){
                                this.itemsOption.column[i].hide = true;
                            }
                            if(this.itemsOption.column[i].prop == 'stockQty'){
                                this.itemsOption.column[i].hide = false;
                            }
                        }
                    }
                    this.vueSet(this, 'itemsOption', this.itemsOption);
                    this.isShows = false;
                    setTimeout(()=>{
                        this.isShows = true;
                    },10)
                    if (this.obj && this.obj != undefined) {
                        for(let i in this.obj){
                            formData.items.push({
                                stockQty: this.obj[i].useQty,
                                skuNo: this.obj[i].skuNo,
                                skuName: this.obj[i].skuName,
                                specifications: this.obj[i].specifications,
                                brandName: this.obj[i].brandName,
                                categoryName: this.obj[i].categoryName,
                                seriesName: this.obj[i].seriesName,
                                itemNo: this.obj[i].itemNo,
                                unit: this.obj[i].unit,
                                applyQty: this.obj[i].lessQty,
                                maxQty : this.obj[i].lessQty,
                                stockQty : this.obj[i].useQty,
                                qty: this.obj[i].qty,
                                surfacePrice: this.obj[i].retailPrice,
                            })
                        }
                    } else {
                        formData.items.push({})
                    }
                    this.formData = formData;
                    this.$nextTick(() => {
                        this.vueSet(this, 'formData', formData);
                    })
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.handleBillAdd(this, {path: '/sales_stock_out_form', name: '采购申请制单'});
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
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        this.getProcessId(billPrefix);

                        this.$nextTick(() => {
                            this.vueSet(this, 'formData', formData);
                        })
                        for(let i in this.itemsOption.column){
                            if (Number(formData.applyType) == 4){
                                if(this.itemsOption.column[i].prop == 'lockQty'){
                                    this.itemsOption.column[i].hide = false;
                                }
                                if(this.itemsOption.column[i].prop == 'stockQty'){
                                    this.itemsOption.column[i].hide = true;
                                }
                            }else{
                                if(this.itemsOption.column[i].prop == 'lockQty'){
                                    this.itemsOption.column[i].hide = true;
                                }
                                if(this.itemsOption.column[i].prop == 'stockQty'){
                                    this.itemsOption.column[i].hide = false;
                                }
                            }
                        }
                        this.vueSet(this, 'itemsOption', this.itemsOption);
                        this.isShows = false;
                        setTimeout(()=>{
                            this.isShows = true;
                        },10)
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
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].applyQty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的本次申请数量为必填项');
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
                        let sum = 0;
                        this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        for (let i in this.formData.items) {
                            if (this.formData.items[i].applyQty != undefined) {
                                sum = this.formData.items[i].applyQty * 1 + sum * 1;
                            }
                        }
                        this.formData.applyQty = sum;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$router.push({
                                    path: '/purchase_apply',
                                    name: '采购申请',
                                    meta: {
                                        i18n: 'purchase_apply'
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
