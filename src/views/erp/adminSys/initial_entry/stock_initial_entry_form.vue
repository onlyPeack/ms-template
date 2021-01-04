<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <button-bar :type="type=='view'?'view':'form'"
                        ref="buttonBar"
                        :marginBottom="10"
                        :row="formData"
                        :permission="{tempAddBtn: false,addBtn: false}"
                        @handlePreserve="handleSubmit"
                        @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
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
    import { enteringStock} from '@/api/erp/wms/stock_query/index'
    import {getBill, getHistoryBill, addBill, tempAddBill} from "@/api/erp/purchase/bill/purchaseApply";
    import {warehouseOption, commodityOption,positionOption} from '@/util/table';
    import {getSelfCompany} from '@/api/admin/company';
    import {isMobile} from "@/util/validate";

    export default {
        name: "stock_initial_entry_form",
        props: ['type', 'id'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'pubilSelector': () => import('@/components/erp/public_selector'),
        },
        data() {
            return {
                isSingle: true,
                isShow: true,
                loading: false,
                goodsVisible: false,
                showRegion: true,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                index:0,
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
                                label: "商品名称",
                                prop: "skuName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择商品",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.isSingle = false;

                                    this.publicTitle = '请选择商品';
                                    this.typeName = 'commodityType';
                                    this.option = commodityOption;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "订货号",
                                prop: "itemNo",
                                span: 6,
                                readonly:true,
                            },
                            {
                                label: "规格型号",
                                prop: "specifications",
                                span: 6,
                                readonly:true,
                            },
                            {
                                label: "品牌",
                                prop: "brandName",
                                span: 6,
                                readonly:true,
                            },
                            {
                                label: "系列",
                                prop: "seriesName",
                                span: 6,
                                readonly:true,
                            },
                            {
                                label: "面价",
                                prop: "retailPrice",
                                span: 6,
                                readonly:true,
                            },
                            {
                                label: "需求仓库ID",
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
                                    if (this.type == 'view') {
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
                                label: "仓位",
                                prop: "positionName",
                                span: 6,
                                type: 'text',
                                dicData: [],
                                filterable: true,
                                readonly: true,
                                clearable: false,
                                rules: [{
                                    required: true,
                                    message: "请选择仓位",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type != 'view') {
                                        if(!this.formData.warehouseName){
                                            this.vueMessage('warning','请先选仓库!');
                                            return
                                        }
                                        this.isSingle = false;
                                        this.publicTitle = '请选择仓位';
                                        this.typeName = 'positionType';
                                        this.option = positionOption;
                                        this.publicVisible = true;
                                    }
                                }
                            },
                            {
                                label: "库存数量",
                                prop: "qty",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入库存数量",
                                    trigger: "change"
                                }],
                                change: ({value, column}) =>{
                                    if(window.event && window.event.type == 'change' && this.formData.vendibility){
                                        if(Number(this.formData.qty)< Number(this.formData.vendibility)) {
                                            this.vueMessage('warning', '可售数量大于库存数量,请重新输入可售数量!');
                                            this.formData.vendibility = undefined;
                                            this.formData.lockedQty = 0;
                                        }
                                        else{
                                            this.formData.lockedQty = Number(this.formData.qty) - Number(this.formData.vendibility);
                                        }
                                    }
                                }
                            },
                            {
                                label: "可售数量",
                                prop: "vendibility",
                                span: 6,
                                change: ({value, column}) =>{
                                    if(window.event && window.event.type == 'change' && !this.formData.qty ){
                                        this.vueMessage('warning','请先输入库存数量!');
                                        this.formData.vendibility = undefined;
                                        return
                                    }
                                    if(window.event && window.event.type == 'change' &&  this.formData.qty){
                                        if(Number(this.formData.qty)< Number(value)) {
                                            this.vueMessage('warning', '可售数量不能大于库存数量');
                                            this.formData.vendibility = undefined;
                                        }
                                        else{
                                            this.formData.lockedQty = Number(this.formData.qty) - Number(value);
                                        }
                                    }
                                }
                            },
                            // {
                            //     label: "锁定数量",
                            //     prop: "lockedQty",
                            //     span: 6,
                            //     readonly:true,
                            // },
                            {
                                label: "成本价",
                                prop: "purchasePrice",
                                span: 6,
                                rules: [{
                                    required: true,
                                    message: "请输入成本价",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: "调拨价",
                                prop: "allocationPrice",
                                span: 6
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
        },
        destroyed() {
        },
        updated() {
        },
        methods: {
            handleSelectionChange(selection) {

            },
            handleSubmitPublic(list) {
                if (list.length > 0) {
                    this.publicVisible = false;
                    if (this.typeName == 'warehouseType') {
                        this.formData.warehouseName = list[0].name
                        this.formData.warehouseId = list[0].id
                    }
                    if (this.typeName == 'commodityType') {
                        this.formData.skuName = list[0].goodsName;
                        this.formData.brandName = list[0].brandName;
                        this.formData.itemNo = list[0].itemNo;
                        this.formData.specifications = list[0].specifications;
                        this.formData.skuNo = list[0].skuNo;
                        this.formData.retailPrice = list[0].retailPrice;
                        this.formData.seriesName = list[0].seriesName;
                    }
                    if(this.typeName == 'positionType'){
                        this.formData.positionName = list[0].name;
                        this.formData.positionId= list[0].id;
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
                    this.vueSet(this, 'formData', {lockedQty:0});
                    this.loading = false;

                }
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
            preventRepeatSubmit(val, type) {
                if (type && type == 'tempAdd') {
                    this.$refs.buttonBar.preventRepeatSubmit('tempAddLoading', val);
                } else {
                    this.$refs.buttonBar.preventRepeatSubmit('preserveLoading', val);
                }
            },
            handleSubmit(type) {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        //防止重复提交
                        this.preventRepeatSubmit(true, type);
                        let saveBill = type && type == 'tempAdd' ? tempAddBill : enteringStock;
                        saveBill(this.formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.init();
                                this.$router.push({
                                    path: '/stock_initial_entry',
                                    name: '期初库存',
                                    meta: {
                                        i18n: 'stock_initial_entry'
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
