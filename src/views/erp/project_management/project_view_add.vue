<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData">
                <div>
                    <button-bar :type="type=='view'?'view':'form'"
                                ref="buttonBar"
                                :marginBottom="10"
                                :row="formData"
                                :permission="permission"
                                @handlePreserve="handleSubmit"></button-bar>
                    <router-link v-if="type == 'view' && formData && formData.billStatus == '4'" target="_blank"
                                 :to="{path:'/print/project_contract_print',query:{id:id}}">
                        <el-button icon="el-icon-printer" type="warning" plain style="margin-left: 10px;">打 印
                        </el-button>
                    </router-link>
                </div>
                <h3 v-if="formData && formData.billNo">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit" :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items" >
                        <avue-crud :option="itemsOption" :data="formData.items" :class="type == 'view'?'':'main-form-items'">
                            <template slot-scope="scope" slot="operate" v-if="type != 'view'">
                                <div>
                                    <i class="el-icon-plus" @click="handleAddRow()"
                                       style="margin-right: 15px;color:  #409EFF;"></i>
                                    <i class="el-icon-minus" @click="handleRemoveRow(scope.row,scope.row.$index)"
                                       style="color:#E80000;"></i>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="skuName">
                                <div @click="skuBtn(scope.row,scope.row.$index)">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品" readonly></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="discount">
                                <div>
                                    <el-input v-model="scope.row.discount" :disabled="type=='view'?true:false" placeholder="请输入折扣" @blur="publicColumnBlur(scope.row.$index,scope.row.discount,true,'discount', scope.row)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量" :disabled="type=='view'?true:false"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.qty,true,'qty',scope.row)"></el-input>
                                </div>
                            </template>

                            <template slot-scope="scope" slot="taxRate">
                                <div>
                                    <el-select v-model="scope.row.taxRate" style="width: 100%;" :disabled="type=='view'?true:false"
                                               @change="publicColumnBlur(scope.row.$index,scope.row.taxRate,true,'taxRate', scope.row)">
                                        <el-option v-for="item in taxRateOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div>
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入含税单价" :disabled="type=='view'?true:false"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.taxPrice,true,'taxPrice', scope.row)"></el-input>
                                </div>
                            </template>
                            <!--<template slot-scope="scope" slot="taxAmount">-->
                            <!--<div>-->
                            <!--<el-input v-model="scope.row.taxAmount" placeholder="请输入含税金额"-->
                            <!--@blur="publicColumnBlur(scope.row.$index,scope.row.taxAmount,true,'taxAmount', scope.row)"-->
                            <!--:disabled="type=='view'?true:false"></el-input>-->
                            <!--</div>-->
                            <!--</template>-->
                            <template slot-scope="scope" slot="productdescribe">
                                <div>
                                    <el-input v-model="scope.row.productdescribe" placeholder="请输入商品描述" :disabled="type=='view'?true:false"
                                              @blur="publicColumnBlur(scope.row.$index,scope.row.productdescribe,true,'productdescribe', scope.row)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="note">
                                <div>
                                    <el-input :disabled="type=='view'?true:false"
                                            @blur="publicColumnBlur(scope.row.$index,scope.row.note,true,'note', scope.row)"
                                            v-model="scope.row.note" placeholder="请输入备注"></el-input>
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
            <pubil-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible" :selectType="1"
                            :discountLevel="formData.discountLevel"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            :operationType="formData.customerId"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {addBill,getBill} from '@/api/erp/project_management/projectOverview';
    import {
        customerOption,
        userOption,
        commodityOption,
    } from '@/util/table';

    export default {
        name: "project_view_add",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                permission: {tempAddBtn: false, addBtn: false},
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
                            label: "合同编号",
                            prop: "billNo",
                            placeholder: "手输或自动生成",
                            span:6
                        },
                        {
                            label: "合同名称",
                            prop: "contractName",
                            span: 6,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入合同名称",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "客户",
                            prop: "customerName",
                            span: 6,
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
                                if (this.type && this.type == 'view') {
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
                            label: "业务员",
                            prop: "salesName",
                            span: 6,
                            type: 'text',
                            dicData: [],
                            disabled: true,
                            // suffixIcon: 'el-icon-search',
                            placeholder: '请选择业务员',
                            filterable: true,
                            readonly: true,
                            clearable: false,
                            rules: [{
                                required: true,
                                message: "请选择业务员",
                                trigger: "change"
                            }],
                            click: () => {
                                if (this.type && this.type == 'view') {
                                    return
                                }
                                // this.isSingle = true;
                                // this.publicTitle = '请选择业务员';
                                // this.typeName = 'userType';
                                // this.option = userOption;
                                // this.publicVisible = true;
                            }
                        },
                        {
                            label: "合同金额",
                            prop: "amount",
                            span: 6,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入合同金额",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "签约日期",
                            prop: "signDate",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "生效日期",
                            prop: "takeDate",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "到期日期",
                            prop: "overDate",
                            span: 6,
                            type: 'date',
                            valueFormat: 'yyyy-MM-dd',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            label: "客户行业",
                            prop: "customerTrade",
                            span: 6,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入客户行业",
                                trigger: "change"
                            }],
                        },
                        {
                            label: "项目名称",
                            prop: "projectName",
                            span: 6,
                            type: 'text',
                            rules: [{
                                required: true,
                                message: "请输入项目名称",
                                trigger: "change"
                            }],
                            disabled: true,
                        },
                        {
                            label: "备注",
                            prop: "note",
                            span: 24,
                            type: 'textarea',
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
                        },{
                            name: "tax",
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
                            placeholder: '请选择商品',
                            align: 'left',
                            minWidth: 180,
                            slot: true,
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            width: 180,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            width: 140,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            width: 120,
                            align: 'left',
                            placeholder: ' ',
                            readonly: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            width: 100,
                            align: 'left',
                            placeholder: ' ',
                        },
                        {
                            label: "面价",
                            prop: "surfacePrice",
                            width: 100,
                            align: 'right',
                            placeholder: ' ',
                        },
                        {
                            label: "折扣",
                            prop: "discount",
                            width: 140,
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
                            width: 140,
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
                            width: 160,
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
                            width: 160,
                            align: 'right',
                            // slot: true,
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
                                    "税率"
                                );
                            }
                        },
                        {
                            label: "税额",
                            prop: "tax",
                            width: 140,
                            align: 'right'
                        },
                        {
                            label: "单价",
                            prop: "price",
                            width: 160,
                            align: 'right',
                        },
                        {
                            label: "金额",
                            prop: "amount",
                            width: 160,
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
        created() {
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
            handleRemoveRow(item, index) {
                let ValueIndex = this.formData.items.length;
                if (ValueIndex === 1) {
                    this.formData.items = [{}]
                } else {
                    this.formData.items.splice(index, 1);
                }
            },
            publicColumnBlur(index, val, type, name, item) {
                    if (!isNaN(item.qty) && !isNaN(val)) {
                        if (type) {
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
                                this.formData.items[index].taxPrice = (Number(this.formData.items[index].price) * Number(1 + Number(this.formData.items[index].taxRate / 100))).toFixed(this.sysParam.amountDecimal);
                                this.formData.items[index].taxAmount = (Number(this.formData.items[index].qty) * Number(this.formData.items[index].taxPrice)).toFixed(this.sysParam.amountDecimal);
                                this.formData.items[index].tax = (Number(this.formData.items[index].price) * Number(this.formData.items[index].taxRate / 100)).toFixed(this.sysParam.amountDecimal);
                                this.formData.items[index].discount = (Number(this.formData.items[index].taxPrice) / Number(this.formData.items[index].surfacePrice)).toFixed(this.sysParam.discountDecimal);
                            }
                            this.vueSet(this.formData.items, index, this.formData.items[index]);
                        }
                    }
            },
            skuBtn(item, index, type) {
                if (this.type != 'view') {
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
                        // this.formData.linkAddress = list[0].receiveAddress;
                    }
                    if (this.typeName == 'userType') {
                        this.formData.salesId = list[0].id;
                        this.formData.salesCode = list[0].no;
                        this.formData.salesName = list[0].name;
                    }
                    if (this.typeName == 'quotationType' || this.typeName == 'commodityType') {
                        if (this.typeName == 'quotationType') {
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
                                itemObj.discount = item.discount || '';
                                itemObj.deliverDate = new Date().toLocaleDateString().replace(/\//g, '-');
                                this.formData.items.push(itemObj);
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
                                itemObj.skuName = item.goodsName;
                                itemObj.skuNo = item.skuNo;
                                itemObj.brandName = item.brandName;
                                itemObj.itemNo = item.itemNo;
                                itemObj.specifications = item.specifications;
                                itemObj.surfacePrice = item.retailPrice || item.surfacePrice;
                                itemObj.qty = 1;
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
                    let formData = {
                        projectName:this.taskType.projectName,
                        salesId: this.$store.getters.userInfo.id,
                        salesCode: this.$store.getters.userInfo.no,
                        salesName: this.$store.getters.userInfo.name,
                        items: []
                    };
                    this.formData = formData;
                    this.$nextTick(() => {
                        this.vueSet(this, 'formData', formData);
                    })
                    this.handleAddRow();
                    this.loading = false;
                }
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData;
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
            getDaysBetween(dateString1, dateString2) {
                var startDate = Date.parse(dateString1);
                var endDate = Date.parse(dateString2);
                var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
                // alert(days);
                return days;
            },
            handleSubmit(type) {
                //校验明细必填信息是否填写
                if (!this.handleCheckItemFuc()) {
                    return;
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        let sum = this.getDaysBetween(this.formData.signDate, this.formData.overDate);
                        if (sum < 1) {
                            this.vueMessage('warning', '到期日期不能大与签约日期!');
                            return
                        }
                        let sum1 = this.getDaysBetween(this.formData.takeDate, this.formData.overDate);
                        if (sum1 < 1) {
                            this.vueMessage('warning', '到期日期不能大与生效日期!');
                            return
                        }
                        this.preventRepeatSubmit(true, type);
                        let saveBill = addBill;
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

                                this.clocseCurrent(this, this.$route);
                                this.$router.push({
                                    path: '/project_view',
                                    name: '项目详情',
                                    query: {
                                        id: this.step,
                                        type: 'add' + new Date().getTime(),
                                        timeStamp: new Date().getTime()
                                    },
                                    meta: {
                                        i18n: 'project_view'
                                    }
                                });
                                this.init();

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
