<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: true,addBtn: true}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items">
                        <avue-crud :option="itemsOption" :data="formData.items"
                                   @selection-change="handleSelectionChange">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              :disabled="type=='view'?true:false" @blur="qtyBlur(scope.row.$index,scope.row.qty)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="deliveryDate">
                                <div>
                                    <el-date-picker v-model="scope.row.deliveryDate" align="left" type="date"
                                                    :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                                    placeholder="请选择交货日期" :disabled="type=='view'?true:false">
                                    </el-date-picker>
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
                    <span v-if="formData.createUserName">制单人：{{formData.createUserName}}</span>
                    <span v-if="formData.createDeptName">制单人部门：{{formData.createDeptName}}</span>
                    <span v-if="formData.createTime">制单时间：{{formData.createTime}}</span>
                </div>
            </div>
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                            :code="formData.customerCode"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill} from "@/api/erp/purchase/bill/purchaseReceiptGoodsNotice";
    import {purchasesOption} from '@/util/table';
    export default {
        name: "receipt_goods_notice_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                    },
                },
                rateOption: [
                    {
                        value: '0',
                        label: '0%'
                    },
                    {
                        value: '13',
                        label: '13%'
                    },
                    {
                        value: '16',
                        label: '16%'
                    },
                    {
                        value: '17',
                        label: '17%'
                    },
                    {
                        value: '18',
                        label: '18%'
                    },
                    {
                        value: '19',
                        label: '19%'
                    },
                    {
                        value: '20',
                        label: '20%'
                    }
                ],
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                index:0,
                itemsOption: {
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    border:true,
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
                            minWidth: 220,
                            placeholder: '请选择商品名称',
                            align: 'center',
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            placeholder: ' ',
                            width: 180
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            width: 120,
                            align: 'right',
                            slot: true
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "税率",
                            prop: "taxRate",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "含税单价",
                            prop: "taxPrice",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "价税合计",
                            prop: "taxAmount",
                            width: 140,
                            align: 'right',
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            placeholder: ' ',
                            width: 80,
                            align: 'center'
                        },
                        {
                            label: "交货日期",
                            prop: "deliveryDate",
                            placeholder: ' ',
                            width: 180,
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "备注",
                            prop: "note",
                            width: 280,
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
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择关联单据';
                                    this.typeName = 'purchasesType';
                                    this.option = purchasesOption;
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
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择采购员",
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
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择供应商",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "联系人",
                                prop: "linkPerson",
                                span: 6,
                                readonly: true,
                            },
                            {
                                label: "联系人电话",
                                prop: "linkPhone",
                                span: 6,
                                readonly: true,
                            },
                            {
                                label: "预计到货日期",
                                prop: "expectArrivalDate",
                                span: 6,
                                type: 'date',
                                valueFormat: 'yyyy-MM-dd',
                                format: 'yyyy-MM-dd',
                                pickerOptions: {
                                    disabledDate(time) {
                                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                    },
                                },
                                rules: [{
                                    required: true,
                                    message: "请选择预计到货日期",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "到货仓库Id",
                                prop: "warehouseId",
                                display: false
                            },
                            {
                                label: "到货仓库",
                                prop: "warehouseName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择到货仓库",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "付款条件",
                                prop: "repayCondition",
                                minWidth: 150,
                                type: 'select',
                                align: 'center',
                                dicData: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
                                rules: [{
                                    required: true,
                                    message: "请选择付款条件",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "结算方式",
                                prop: "accountMethod",
                                minWidth: 150,
                                type: 'select',
                                align: 'center',
                                dicMethod: 'get',
                                dicUrl: '/api/manager/payments-means/pageAll',
                                props: {
                                    value: 'value',
                                    label: 'label'
                                },
                                rules: [{
                                    required: true,
                                    message: "请选择结算方式",
                                    trigger: "change"
                                }],
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
                option: [],
            };
        },
        created() {
            this.init();
            this.__cachehandleGetbill = this.id;
            this.__cachetype = this.type;
        },
        mounted() {
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
            qtyBlur(index, val) {
                if(!isNaN(val)){
                    if(this.formData.items[index].taxPrice && !isNaN(this.formData.items[index].taxPrice)){
                        this.formData.items[index].price = (Number(this.formData.items[index].taxPrice)/(Number(parseInt(100)+Number(this.formData.items[index].taxRate))/100)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].amount = (Number(this.formData.items[index].price) * parseInt(val)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].taxAmount = (Number(this.formData.items[index].taxPrice) * parseInt(val)).toFixed(this.sysParam.amountDecimal);
                        this.formData.items[index].tax =(Number(this.formData.items[index].amount)*(Number(this.formData.items[index].taxRate)/100)).toFixed(this.sysParam.amountDecimal);
                        this.vueSet(this.formData.items, index, this.formData.items[index]);
                    }
                }else {
                    this.formData.items[index].qty = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning','请输入数字!');
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
                    if (this.typeName == 'purchasesType') {
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
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.skuName = item.skuName;
                            itemObj.skuNo = item.skuNo;
                            itemObj.itemNo = item.itemNo;
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
                if (this.type && this.type == 'view') {
                    this.formOption.disabled = true;
                } else {
                    this.formOption.disabled = false;
                }
                if (this.id) {
                    this.index = 1;
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {});
                    let formData = {
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        expectArrivalDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: []
                    };
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.handleBillAdd(this,{path: '/receipt_goods_notice_form', name: '收货通知单制单'});
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
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
                        for(let i in list){
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
                                this.init();
                                this.$router.push({
                                    path: '/receipt_goods_notice',
                                    name: '收货通知单',
                                    meta: {
                                        i18n: 'receipt_goods_notice'
                                    }
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
