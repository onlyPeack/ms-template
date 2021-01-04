<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: true,addBtn: true}"
                        @handleAdd="handleAdd"
                        @handlePreserve="handleSubmit"></button-bar>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
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
                            <template slot-scope="scope" slot="qty">
                                <div>
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              :disabled="type=='view'?true:false" @blur="qtyBlur(scope.row.$index,scope.row.qty)"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionName">
                                <div @click="positionBtn(scope.row,scope.row.$index)">
                                    <el-input v-model="scope.row.positionName" placeholder="请选择货架" readonly
                                              :disabled="type=='view'?true:false"></el-input>
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
                            :code="formData.warehouseId"
                            :title="publicTitle" :isSingle="isSingle" :option="option" :typeName="typeName"
                            @handleClose="handleClosePublic"
                            @handleSubmit="handleSubmitPublic"></pubil-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, addBill, tempAddBill} from "@/api/erp/wms/bill/productStockIn";
    import {positionOption,userOption,warehouseOption,manufacturesOption } from '@/util/table';
    export default {
        name: "material_stock_out_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                positionIndex: 0,
                isSingle: true,
                isShow: true,
                loading: false,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                index:0,
                itemsOption: {
                    addBtn:false,
                    refreshBtn:false,
                    columnBtn:false,
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
                            align: 'left',
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            placeholder: ' ',
                            width: 180
                        },

                        {
                            label: "规格型号",
                            prop: "specifications",
                            placeholder: ' ',
                            width: 180
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            placeholder: ' ',
                            width: 180
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            placeholder: ' ',
                            width: 120,
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            width: 120,
                            align: 'center',
                        },
                        {
                            label: "货架",
                            prop: "positionName",
                            placeholder: ' ',
                            width: 160,
                            align: 'center',
                            slot: true
                        },
                        {
                            label: "单价",
                            prop: "taxPrice",
                            width: 120,
                            align: 'center',
                        },
                        {
                            label: "金额",
                            prop: "taxAmount",
                            width: 120,
                            align: 'center',
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
                                    this.typeName = 'manufacturesType';
                                    this.option = manufacturesOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                },
                                rules: [{
                                    required: true,
                                    message: "请选择关联单据",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "操作员Id",
                                prop: "operatorId",
                                display: false
                            },
                            {
                                label: "操作员编号",
                                prop: "operatorCode",
                                display: false
                            },
                            {
                                label: "操作员",
                                prop: "operatorName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择操作员",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    this.publicTitle = '请选择操作员';
                                    this.typeName = 'userType';
                                    this.option = userOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "仓库Id",
                                prop: "warehouseId",
                                display: false
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
                                rules: [{
                                    required: true,
                                    message: "请选择仓库",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    this.publicTitle = '请选择仓库';
                                    this.typeName = 'warehouseType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
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
            positionBtn(val,index) {
                if (this.type != 'view') {
                    if(!this.formData.warehouseName){
                        this.vueMessage('请先选择仓库!');
                        return
                    }
                    this.isSingle = false;
                    this.publicTitle = '请选择仓位';
                    this.typeName = 'positionType';
                    this.option = positionOption;
                    this.publicVisible = true;
                    this.positionIndex = index;
                }
            },
            qtyBlur(index, val) {
                if(isNaN(val)){
                    this.formData.items[index].qty = '';
                    this.vueSet(this.formData.items, index, this.formData.items[index]);
                    this.vueMessage('warning','请输入数字!');
                }else{
                    this.formData.items[index].taxAmount = Number(this.formData.items[index].taxPrice) * parseInt(val);
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
                    if (this.typeName == 'userType') {
                        this.formData.operatorId = list[0].id;
                        this.formData.operatorCode = list[0].no;
                        this.formData.operatorName = list[0].name;
                    }
                    if(this.typeName == 'warehouseType'){
                        this.formData.warehouseId = list[0].id;
                        this.formData.warehouseName = list[0].name;
                    }
                    if(this.typeName == 'positionType'){
                        this.formData.items[this.positionIndex].positionName = list[0].name;
                        this.formData.items[this.positionIndex].positionId= list[0].id;
                        this.$nextTick(() => {
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                        });
                    }
                    if(this.typeName == 'manufacturesType'){
                        this.formData.sourceBillNo = list[0].productBillNo;
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
                            itemObj.brandName = item.brandName;
                            itemObj.itemNo = item.itemNo;
                            itemObj.specifications = item.specifications;
                            itemObj.qty = itemObj.qty;
                            itemObj.returnQty = 0;
                            itemObj.taxPrice = item.taxPrice;
                            itemObj.unit = item.unit;
                            this.formData.items.push(itemObj);
                        }
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
                        items: []
                    };
                    this.vueSet(this, 'formData', formData);
                    this.loading = false;
                }
            },
            //新增
            handleAdd() {
                this.handleBillAdd(this,{path: '/product_stock_in_form', name: '生产入库单制单'});
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
                        if (this.isEmpty(items[i].positionName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的货架为必填项');
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
                                    path: '/product_stock_in',
                                    name: '生产入库单',
                                    meta: {
                                        i18n: 'product_stock_in'
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
<style scoped>
    >>>.bill-form-container .avue-group .el-col .el-form-item .el-form-item__content .avue-crud .avue-crud__menu{
        display: flex!important;
    }
</style>
