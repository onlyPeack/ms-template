<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="justify-content:unset;position: relative">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="{tempAddBtn: true,addBtn: false}"
                                @handleAdd="handleAdd"
                                @handlePreserve="handleSubmit"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/purchase_stock_return_print',query:{id:id}}">
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
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="carrier">
                        <div>
                            <el-select v-model="formData.carrier" :placeholder="formData.warehouseName ? '请选择物流名称':'请先选择仓库'" @change="expressNameBtn"
                                       :disabled="type == 'view'? true : false">
                                <el-option
                                        v-for="item in expressOption"
                                        :key="item.expressName"
                                        :label="item.expressName"
                                        :value="item.expressName">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
                            <template slot="menuLeft" slot-scope="scope">
                                <h3 style="margin: 10px 0px;">订单明细</h3>
                            </template>
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionName">
                                <div @click="positionBtn(scope.row,scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.positionName" placeholder="请选择仓位" readonly
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
                        </avue-crud>
                    </template>
                </avue-form>
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
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
                            :code="formData.warehouseId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, addBill, tempAddBill, auditBill} from "@/api/erp/wms/bill/purchaseStockReturn";
    import {positionOption, userOption, purchaseOption, warehouseOption, ordersOptions,carrierOption} from '@/util/table';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';
    import { getObj} from '@/api/erp/purchase/supplier/index'
    import {selectExpressByWarehouseId} from "@/api/erp/manager/config/index"
    export default {
        name: "purchase_stock_return_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                expressOption: [],
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                positionIndex: 0,
                isSingle: true,
                isShow: true,
                loading: false,
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
                            label: "仓位",
                            prop: "positionName",
                            width: 130,
                            overHidden:true,
                            placeholder: '请选择仓位',
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            width: 160,
                            overHidden:true,
                            placeholder: '请选择商品名称',
                            align: 'left',
                        },
                        {
                            label: "分类",
                            prop: "categoryName",
                            width: 100,
                            overHidden:true,
                            align: 'left',
                            placeholder: ' ',
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
                            width: 130,
                            overHidden:true,
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            align: 'left',
                            width: 100,
                            overHidden:true,
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
                            width: 70,
                            align: 'left'
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            placeholder: ' ',
                            align:'right',
                            width: 100,
                            overHidden:true,
                        },
                        {
                            label: "入库数量",
                            prop: "stockInQty",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "已退数量",
                            prop: "returnQty",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "可退数量",
                            prop: "canReturnQty",
                            width: 80,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "退货数量",
                            prop: "qty",
                            width: 130,
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
                                    "退货数量"
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
                            label: "价税合计",
                            prop: "taxAmount",
                            width: 100,
                            overHidden:true,
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
                            width:100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "退货单价",
                            prop: "price",
                            width: 100,
                            overHidden:true,
                            align: 'right',
                        },
                        {
                            label: "退货金额",
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
                                label: "到货日期",
                                prop: "arrivalDate",
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
                                label: "供货单位编号",
                                prop: "supplierCode",
                                display: false
                            },
                            {
                                label: "供应商",
                                prop: "supplierName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                disabled: true,
                                placeholder:'请选择供应商',
                                // filterable: true,
                                // clearable: false,
                                // suffixIcon: 'el-icon-search',
                                // rules: [{
                                //     required: true,
                                //     message: "请选择供应商",
                                //     trigger: "change"
                                // }],
                                // click: ({value, column}) => {
                                //     if (this.type == 'view') {
                                //         return
                                //     }
                                //     this.publicTitle = '请选择供应商';
                                //     this.typeName = 'purchaseType';
                                //     this.option = purchaseOption;
                                //     this.isSingle = true;
                                //     this.publicVisible = true;
                                // }
                            },
                            {
                                label: "联系人",
                                prop: "linkMan",
                                span: 6,
                            },
                            {
                                label: "联系电话",
                                prop: "linkPhone",
                                span: 6,
                            },
                            {
                                label: "仓库",
                                prop: "warehouseName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择仓库',
                                rules: [{
                                    required: true,
                                    message: "请选择仓库",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if(this.type=='view'){
                                        return
                                    }
                                    this.publicTitle = '请选择仓库';
                                    this.typeName = 'warehouseType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "货运单号",
                                prop: "carryNumber",
                                span: 6,
                            },
                            {
                                label: "物流名称",
                                prop: "carrier",
                                span: 6,
                                type: 'select',
                                formslot: true,
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
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择采购员',
                                rules: [{
                                    required: true,
                                    message: "请选择采购员",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.isSingle = true;
                                    this.publicTitle = '请选择采购员';
                                    this.typeName = 'userType';
                                    this.option = userOption;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "采购员部门",
                                prop: "departName",
                                span: 6,
                                disabled: true,
                            },
                            {
                                label: "仓库Id",
                                prop: "warehouseId",
                                display: false
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
            expressNameBtn(e){
                for(let i in this.expressOption){
                    if(this.expressOption[i].expressName == e){
                        this.formData.carrierId = this.expressOption[i].expressId;
                    }
                }
            },
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
            },
            positionBtn(val, index) {
                if (this.type != 'view') {
                    this.isSingle = false;
                    this.publicTitle = '请选择仓位';
                    this.typeName = 'positionType';
                    this.option = positionOption;
                    this.publicVisible = true;
                    this.positionIndex = index;
                }

            },
            qtyBlur(index, val) {
                if (isNaN(val)) {
                    this.formData.items[index].qty = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning', '请输入数字!');
                    return
                } else {
                    if(this.formData.items[index].canReturnQty < val){
                        this.vueMessage('warning', '输入数量已大于可退数量!');
                        this.formData.items[index].qty = this.formData.items[index].canReturnQty;
                    }

                    this.formData.items[index].taxAmount = (parseInt(val) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].amount = (parseInt(val) * Number(this.formData.items[index].price)).toFixed(this.sysParam.amountDecimal);
                    this.formData.items[index].tax = (Number(this.formData.items[index].amount) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
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
                    if (this.typeName == 'ordersTypes') {
                        getObj(list[0].mainDTO.supplierId).then(res=>{
                            this.formData.linkMan = res.data.data.linkMan;
                            this.formData.linkPhone = res.data.data.linkPhone;
                        })
                        this.formData.purchaserId = list[0].mainDTO.purchaserId;
                        this.formData.purchaserName = list[0].mainDTO.purchaserName;
                        this.formData.purchaserCode = list[0].mainDTO.purchaserCode;
                        this.formData.sourceBillNo = list[0].billNo;
                        this.formData.crtUserName = list[0].crtUserName;
                        this.formData.crtUserNo = list[0].crtUserNo;
                        this.formData.supplierId = list[0].mainDTO.supplierId;
                        this.formData.supplierCode = list[0].supplierCode;
                        this.formData.supplierName = list[0].supplierName;
                        this.formData.warehouseId = list[0].mainDTO.warehouseId;
                        this.formData.warehouseName = list[0].mainDTO.warehouseName;
                        this.formData.departName = list[0].mainDTO.departName;
                        selectExpressByWarehouseId(this.formData.warehouseId).then(res=>{
                            this.expressOption = res.data.data;
                        })
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
                            itemObj.whether = 1;
                            itemObj.positionName = item.positionName;
                            itemObj.positionId = item.positionId;
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.brandName = item.brandName;
                            itemObj.price = item.price;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.categoryName = item.categoryName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.qty = item.qty - item.returnQty;
                            itemObj.stockInQty = item.qty;
                            itemObj.returnQty = item.returnQty;
                            itemObj.canReturnQty  = item.qty - item.returnQty;
                            itemObj.surfacePrice = item.surfacePrice;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.taxRate = item.taxRate;
                            itemObj.taxRates = item.taxRate + '%';
                            itemObj.taxAmount = item.taxAmount;
                            itemObj.amount = item.amount;
                            itemObj.unit = item.unit;
                            itemObj.tax = item.tax;
                            itemObj.deliveryDate = new Date().toLocaleDateString().replace(/\//g, '-');
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    if (this.typeName == 'purchaseType') {
                        this.formData.supplierCode = list[0].supplierCode;
                        this.formData.supplierName = list[0].supplierName;
                        this.formData.supplierId = list[0].id;
                        this.formData.linkMan = list[0].linkMan;
                        this.formData.linkPhone = list[0].linkPhone;
                    }
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseId = list[0].id;
                        this.formData.warehouseName = list[0].name;
                        selectExpressByWarehouseId(this.formData.warehouseId).then(res=>{
                            this.expressOption = res.data.data;
                        })
                    }
                    if (this.typeName == 'userType') {
                        this.formData.purchaserId = list[0].id;
                        this.formData.purchaserName = list[0].name;
                        this.formData.purchaserCode = list[0].no;
                    }
                    if (this.typeName == 'positionType') {
                        this.formData.items[this.positionIndex].positionName = list[0].name;
                        this.formData.items[this.positionIndex].positionId = list[0].id;
                        this.$nextTick(() => {
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
                console.log(this.taskType)
                this.vueSet(this, 'formData', {items: []});
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
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        arrivalDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: []
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
                this.$router.push({
                    path: '/purchase_stock_return_form',
                    name: '采购退货制单',
                    query: {
                        type: 'add'
                    },
                    meta: {
                        i18n: 'purchase_stock_return_form'
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
                        var billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.comment = '';
                        console.log(billPrefix)
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
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的领料数量为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].positionName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的货架为必填项');
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
                        let sumAmount = 0;
                        let sumTaxAmount = 0;
                        let list = this.formData.items;
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
                                    path: '/purchase_stock_return',
                                    name: '采购退货',
                                    meta: {
                                        i18n: 'purchase_stock_return'
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
