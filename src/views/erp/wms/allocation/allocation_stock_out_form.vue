<template>
    <bill-container @reload="reload" :type="type" :id="id" ref="billContainer">
        <basic-container v-loading="loading">
            <div class="viewData" style="position: relative;justify-content: unset">
                <button-bar :type="type=='view'?'view':'form'"
                            ref="buttonBar"
                            :marginBottom="10"
                            :row="formData"
                            :permission="{tempAddBtn: true,addBtn: false}"
                            @handlePreserve="handleSubmit"
                            @handleGetHistoryBill="handleGetHistoryBill"></button-bar>
                <div v-if="processId && processId!='' && taskType=='now'"
                     style="float: left;display: inline-block">
                    <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                               v-if="formData.billStatus!=5">驳 回
                    </el-button>
                    <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
                </div>
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <h3 v-if="formData && formData.billNo" style="position: absolute;right: 0;">No.{{formData.billNo}}</h3>
            </div>
            <div class="bill-form-container" v-if="isShow">
                <avue-form v-model="formData" :option="formOption" ref="form" @submit="handleSubmit"  :class="type == 'view'?'main-form':'main-form main-form-select'"
                           class="main-form" v-if="isShow" :disabled="formOption.disabled">
                    <template slot-scope="scope" slot="items" >
                        <avue-crud :option="itemsOption" :data="formData.items"   :class="type == 'view'?'':'main-form-items'" :summary-method="getSummaries">
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
                                <div @click="handleOpenPublic('allocationStockOutType',scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.skuName" placeholder="请选择商品"
                                              :disabled="type=='view'?true:false" readonly></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionInName">
                                <div @click="handleOpenPublic('positionInType',scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.positionInName" placeholder="请选择调入仓位"
                                              :disabled="type=='view'?true:false" readonly></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="positionOutName">
                                <div @click="handleOpenPublic('positionOutType',scope.row.$index)" class="zLeftClass">
                                    <el-input v-model="scope.row.positionOutName" placeholder="请选择调出仓位"
                                              :disabled="type=='view'?true:false" readonly></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="qty">
                                <div class="zRightClass">
                                    <el-input v-model="scope.row.qty" placeholder="请输入数量"
                                              @blur="handleInputBlur(scope.row.$index,scope.row.qty,'qty')"
                                              :disabled="type=='view'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxPrice">
                                <div>
                                    <el-input v-model="scope.row.taxPrice" placeholder="请输入调拨单价"
                                              @blur="handleInputBlur(scope.row.$index,scope.row.taxPrice,'taxPrice')"
                                              :disabled="type=='view'||formData.type=='0'?true:false"></el-input>
                                </div>
                            </template>
                            <template slot-scope="scope" slot="taxAmount">
                                <div>
                                    <el-input v-model="scope.row.taxAmount" placeholder="请输入调拨金额"
                                              @blur="handleInputBlur(scope.row.$index,scope.row.taxAmount,'taxAmount')"
                                              :disabled="type=='view'||formData.type=='0'?true:false"></el-input>
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
                <div class="order-making-info" v-if="type!='add'">
                    <span v-if="formData.crtUserName">制单人：{{formData.crtUserName}}</span>
                    <span v-if="formData.departId && formData.departId.indexOf('{') !== -1">制单人部门：{{JSON.parse(formData.departId).name}}</span>
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
            <public-selector v-if="publicVisible" ref="publicSelector" :dialogVisible="publicVisible"
                             :code="typeName=='positionInType'?formData.warehouseInId:formData.warehouseOutId"
                             :positionOutId = "positionOutId"
                             :title="publicTitle" :isSingle="isSingle" :option="option"
                             :typeName="typeName=='positionInType'||typeName=='positionOutType'?'positionType':typeName"
                             @handleClose="handleClosePublic"
                             @handleSubmit="handleSubmitPublic"></public-selector>
        </basic-container>
    </bill-container>
</template>

<script>
    import {getBill, getHistoryBill, addBill, tempAddBill,auditBill } from "@/api/erp/wms/bill/allocationStock";
    import {warehouseOption, userOption, allocationStockOutOption, positionOption} from '@/util/table';
    import {getObj} from '@/api/admin/user/index';
    import {getProcessId} from '@/api/erp/oa/task/taskBill';

    const typeOption = [
        {
            value: '0',
            label: '同价调拨'
        },
        {
            value: '1',
            label: '异价调拨'
        }
    ];
    export default {
        name: "allocation_stock_out_form",
        props: ['type', 'id', 'taskType', 'step'],
        components: {
            'buttonBar': () => import('@/components/setting/button_bar'),
            'publicSelector': () => import('@/components/erp/public_selector'),
            'taskHistory': () => import('@/components/erp/task_history'),
        },
        data() {
            return {
                positionOutId: undefined,
                isAgreeLoading: false,
                isRejectLoading: false,
                processId: undefined,
                comment: undefined,
                isSingle: true,
                isShow: true,
                loading: false,
                formData: {},
                publicVisible: false,
                publicTitle: '',
                typeName: '',
                warehouseType: '',
                itemsOption: {
                    addBtn: false,//新增
                    columnBtn: false,//列显示隐藏
                    refreshBtn: false,//刷新
                    disabled: false,
                    emptyBtn: false,
                    submitBtn: false,
                    menu: false,
                    index: true,
                    indexLabel: '序号',
                    border: true,
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
                            label: "调出仓位ID",
                            prop: "positionOutId",
                            hide: true
                        },
                        {
                            label: "调出仓位",
                            prop: "positionOutName",
                            minWidth: 150,
                            overHidden:true,
                            slot: true
                        },
                        {
                            label: "商品名称",
                            prop: "skuName",
                            minWidth: 140,
                            overHidden:true,
                            placeholder: '请选择商品名称',
                            align: 'left',
                            slot: true,
                        },
                        {
                            label: "订货号",
                            prop: "itemNo",
                            minWidth: 100,
                            overHidden:true,
                            align: 'left'
                        },
                        {
                            label: "规格型号",
                            prop: "specifications",
                            minWidth: 100,
                            overHidden:true,
                            align: 'left'
                        },
                        {
                            label: "品牌",
                            prop: "brandName",
                            minWidth: 100,
                            overHidden:true,
                            align: 'left'
                        },
                        {
                            label: "单位",
                            prop: "unit",
                            minWidth: 80,
                            overHidden:true,
                            align: 'left'
                        },
                        {
                            label: "调入仓位ID",
                            prop: "positionInId",
                            hide: true
                        },
                        {
                            label: "调入仓位",
                            prop: "positionInName",
                            minWidth: 150,
                            overHidden:true,
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "调入仓位"
                                );
                            },
                            slot: true
                        },
                        {
                            label: "数量",
                            prop: "qty",
                            minWidth:120,
                            overHidden:true,
                            align: 'right',
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
                            },
                            slot: true
                        },
                        {
                            label: "调拨单价",
                            prop: "taxPrice",
                            minWidth: 140,
                            overHidden:true,

                            align: 'right',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "调拨单价"
                                );
                            },
                            slot: true
                        },
                        {
                            label: "调拨金额",
                            prop: "taxAmount",
                            minWidth: 140,
                            overHidden:true,
                            align: 'right',
                            renderHeader: h => {
                                return h(
                                    "span",
                                    {
                                        style: {
                                            color: "#ff0000"
                                        }
                                    },
                                    "调拨金额"
                                );
                            },
                            slot: true
                        },
                        {
                            label: "备注",
                            prop: "note",
                            minWidth: 120,
                            overHidden:true,
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
                                span: 6
                            },
                            {
                                label: "单据日期",
                                prop: "billDate",
                                type: 'date',
                                span: 6,
                                valueFormat: 'yyyy-MM-dd',
                                format: 'yyyy-MM-dd',
                                pickerOptions: {
                                    disabledDate(time) {
                                        return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24;
                                    }
                                }
                            },
                            {
                                label: "调拨类型",
                                prop: "type",
                                span: 6,
                                type: 'select',
                                dicData: typeOption,
                                filterable: true,
                                readonly: true,
                                rules: [{
                                    required: true,
                                    message: "请选择调拨类型",
                                    trigger: "change"
                                }],
                                change: ({value, column}) => {
                                    if (window.event && (window.event.type == 'change' || window.event.type == 'message')) {
                                        this.formData.items = [{skuName: ''}];
                                    }
                                }
                            },
                            {
                                label: "调拨金额",
                                prop: "taxBillAmount",
                                display: false
                            },
                            {
                                label: "调出仓库ID",
                                prop: "warehouseOutId",
                                display: false
                            },
                            {
                                label: "调出仓库",
                                prop: "warehouseOutName",
                                span: 6,
                                type: 'text',
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择调出仓库',
                                rules: [{
                                    required: true,
                                    message: "请选择调出仓库",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择调出仓库';
                                    this.typeName = 'warehouseType';
                                    this.warehouseType = 'warehouseOutType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "调入仓库ID",
                                prop: "warehouseInId",
                                display: false
                            },
                            {
                                label: "调入仓库",
                                prop: "warehouseInName",
                                span: 6,
                                type: 'text',
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择调入仓库',
                                rules: [{
                                    required: true,
                                    message: "请选择调入仓库",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.publicTitle = '请选择调入仓库';
                                    this.typeName = 'warehouseType';
                                    this.warehouseType = 'warehouseInType';
                                    this.option = warehouseOption;
                                    this.isSingle = true;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "调拨人ID",
                                prop: "operatorName",
                                display: false
                            },
                            {
                                label: "调拨人编码",
                                prop: "operatorCode",
                                display: false
                            },
                            {
                                label: "调拨人",
                                prop: "operatorName",
                                span: 6,
                                type: 'text',
                                readonly: true,
                                clearable: false,
                                suffixIcon: 'el-icon-search',
                                placeholder:'请选择调拨人',
                                rules: [{
                                    required: true,
                                    message: "请选择调拨人",
                                    trigger: "change"
                                }],
                                click: ({value, column}) => {
                                    if (this.type == 'view') {
                                        return
                                    }
                                    this.isSingle = true;
                                    this.publicTitle = '请选择业务员';
                                    this.typeName = 'userType';
                                    this.option = userOption;
                                    this.publicVisible = true;
                                }
                            },
                            {
                                label: "调拨部门",
                                prop: "departName",
                                span: 12
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
            getSummaries(param) {
                return this.getSummariesMethod(param, this.itemsOption.sumColumnList);
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
            handleOpenPublic(typeName, index) {
                if (this.type != 'view') {
                    if ((typeName == 'allocationStockOutType' || typeName == 'positionOutType') && this.isEmpty(this.formData.warehouseOutId)) {
                        this.vueMessage('warning', '请先选择调出仓库');
                        return;
                    }
                    if (typeName == 'positionInType' && this.isEmpty(this.formData.warehouseInId)) {
                        this.vueMessage('warning', '请先选择调入仓库');
                        return;
                    }
                    if (typeName == 'positionInType' &&  this.isEmpty(this.formData.items[index].skuNo)) {
                        this.vueMessage('warning', '请先选择商品');
                        return;
                    }
                    this.positionIndex = undefined;
                    if (typeName == 'allocationStockOutType') {
                        this.isSingle = false;
                        this.option = allocationStockOutOption;
                        this.positionOutId = this.formData.items[index].positionOutId;
                    } else {
                        this.isSingle = true;
                        this.positionIndex = index;
                        this.option = positionOption;
                    }
                    this.publicTitle = '请选择';
                    this.typeName = typeName;
                    this.publicVisible = true;
                }
            },
            handleAddRow() {
                const d = {
                    skuName: '',
                };
                this.formData.items.push(d);
            },
            handleInputBlur(index, val, type) {
                let row = this.formData.items[index];
                if (!this.isEmpty(this.formData.items[index].qty)) {
                    if (type == 'qty' && !this.isEmpty(row.taxPrice)) {
                        row.taxAmount = Number(row.qty * row.taxPrice).toFixed(this.sysParam.amountDecimal);
                        row.costAmount = (row.qty  * row.costPrice).toFixed(this.sysParam.amountDecimal);
                        row.differencePrice  = (row.taxPrice* 1 - row.costPrice * 1).toFixed(this.sysParam.amountDecimal);
                    } else if (type == 'taxPrice') {
                        row.taxPrice = Number(row.taxPrice).toFixed(this.sysParam.amountDecimal);
                        row.taxAmount = Number(row.qty * row.taxPrice).toFixed(this.sysParam.amountDecimal);
                        row.costAmount = (row.qty  * row.costPrice).toFixed(this.sysParam.amountDecimal);
                        row.differencePrice  = (row.taxPrice* 1 - row.costPrice * 1).toFixed(this.sysParam.amountDecimal);
                    } else if (type == 'taxAmount') {
                        row.taxAmount = Number(row.taxAmount).toFixed(this.sysParam.amountDecimal);
                        row.taxPrice = Number(row.taxAmount / row.qty).toFixed(this.sysParam.amountDecimal);
                        row.costAmount = (row.qty  * row.costPrice).toFixed(this.sysParam.amountDecimal);
                        row.differencePrice  = (row.taxPrice* 1 - row.costPrice * 1).toFixed(this.sysParam.amountDecimal);
                    }
                    this.vueSet(this.formData.items, index, row);
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
                    // 调入仓库
                    if (this.typeName == 'warehouseType' && this.warehouseType == 'warehouseInType') {
                        //修改调入仓库清空调入仓位的值
                        if (!this.isEmpty(this.formData.warehouseInId) && this.formData.warehouseInId != list[0].id) {
                            const items = this.formData.items;
                            for (var x in items) {
                                items[x].positionInId = '';
                                items[x].positionInName = '';
                                this.vueSet(this.formData.items, x * 1, items[x]);
                            }
                        }
                        this.formData.warehouseInName = list[0].name;
                        this.formData.warehouseInId = list[0].id;
                    }
                    // 调出仓库
                    if (this.typeName == 'warehouseType' && this.warehouseType == 'warehouseOutType') {
                        //修改调出仓库清空明细
                        if (!this.isEmpty(this.formData.warehouseOutId) && this.formData.warehouseOutId != list[0].id) {
                            this.formData.items = [{skuName: ''}];
                        }
                        this.formData.warehouseOutName = list[0].name;
                        this.formData.warehouseOutId = list[0].id;
                    }
                    // 调拨人
                    if (this.typeName == 'userType') {
                        this.formData.operatorName = list[0].name;
                        this.formData.operatorCode = list[0].no;
                        this.formData.operatorId = list[0].id;
                        this.handleSetDepart(list[0].id);
                    }
                    this.vueSet(this, 'formData', this.formData);

                    // 商品选择
                    if (this.typeName == 'allocationStockOutType') {
                        const dataMap = this.dataMap(this.formData.items, list);
                        if (dataMap.length > 0) {
                            this.vueMessage('warning', '商品编码(' + dataMap.join(",") + ')已有相同的商品信息，不能重复添加');
                            return;
                        }
                        for (var index in list) {
                            var item = list[index];
                            var itemObj = {};
                            itemObj.skuNo = item.skuNo;
                            itemObj.skuName = item.goodsName;
                            itemObj.specifications = item.specifications;
                            itemObj.itemNo = item.itemNo;
                            itemObj.brandName = item.brandName;
                            itemObj.seriesName = item.seriesName;
                            itemObj.unit = item.unit;
                            itemObj.positionOutName= item.positionName;
                            itemObj.positionOutId= item.positionId;
                            itemObj.taxPrice = this.formData.type == '0' ? item.costPrice : '';
                            itemObj.taxAmount = this.formData.type == '0' ? item.costPrice : '';
                            itemObj.qty = 1;
                            itemObj.costPrice = item.costPrice;
                            itemObj.costAmount = itemObj.qty * itemObj.costPrice;
                            itemObj.differencePrice  = itemObj.taxPrice* 1 - itemObj.costPrice * 1;
                            this.formData.items.push(itemObj);
                        }
                        this.$nextTick(() => {
                            //清除没有商品ID的数据
                            this.formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(this.formData.items)));
                            this.handleAddRow()
                        });
                    }

                    //调入仓位
                    if (this.typeName == 'positionInType') {
                        this.formData.items[this.positionIndex].positionInName = list[0].name;
                        this.formData.items[this.positionIndex].positionInId = list[0].id;
                        this.vueSet(this.formData.items, this.positionIndex, this.formData.items[this.positionIndex]);
                    }
                    //调出仓位
                    if (this.typeName == 'positionOutType') {
                        this.formData.items[this.positionIndex].positionOutName = list[0].name;
                        this.formData.items[this.positionIndex].positionOutId = list[0].id;
                        this.vueSet(this.formData.items, this.positionIndex, this.formData.items[this.positionIndex]);
                    }
                    this.$refs.publicSelector.selectionClear();
                }
            },
            handleClosePublic() {
                this.positionIndex = undefined;
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
                    this.handleGetBill(getBill, this.id);
                } else {
                    this.vueSet(this, 'formData', {
                        type: '0',
                        operatorId: this.$store.getters.userInfo.id,
                        operatorName: this.$store.getters.userInfo.name,
                        operatorCode: this.$store.getters.userInfo.no,
                        billDate: new Date().toLocaleDateString().replace(/\//g, '-'),
                        items: [{skuName: ''}]
                    });
                    this.handleSetDepart(this.$store.getters.userInfo.id);
                    this.loading = false;
                }
            },
            handleSetDepart(id) {
                getObj(id).then(response => {
                    var depart = response.data.data.departId;
                    var departName = depart.indexOf('{') > -1 ? JSON.parse(depart).name : depart;
                    this.vueSet(this.formData, 'departName', departName);
                })
            },
            handleGetBill(fun, val, funType) {
                this.loading = true;
                fun(val).then(res => {
                    this.loading = false;
                    if ((res.data.code == 200 || res.data.code == '2000') && !this.isEmpty(res.data.data)) {
                        let formData = res.data.data;
                        this.formData = formData
                        this.$nextTick(() => {
                            this.vueSet(this, 'formData', formData);
                        })

                        let billPrefix = formData.billNo.replace(/[^a-z]+/ig, "");
                        this.getProcessId(billPrefix);

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
                let taxBillAmount = 0;
                for (var i in items) {
                    if (!this.isEmpty(items[i].skuNo)) {
                        flag = false;
                        if (this.isEmpty(items[i].skuName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的商品名称为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].positionInName)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的调入仓位为必填项');
                            return false;
                        }
                        if (this.isEmpty(items[i].qty)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为必填项');
                            return false;
                        } else if (!this.handleIsNaN(Number(items[i].qty))) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的数量为数字');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxPrice)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的调拨单价为必填项');
                            return false;
                        } else if (!this.handleIsNaN(Number(items[i].taxPrice))) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的调拨单价为数字');
                            return false;
                        }
                        if (this.isEmpty(items[i].taxAmount)) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的调拨金额为必填项');
                            return false;
                        } else if (!this.handleIsNaN(Number(items[i].taxAmount))) {
                            this.vueMessage('warning', '第' + (i * 1 + 1) + '行的调拨金额为数字');
                            return false;
                        }
                        taxBillAmount = taxBillAmount + items[i].taxAmount;
                    }
                }
                if (flag) {
                    this.vueMessage('warning', '单据明细不能为空');
                    return false;
                }
                if (!this.isEmpty(taxBillAmount)) {
                    this.vueSet(this.formData, 'taxBillAmount', Number(taxBillAmount).toFixed(this.sysParam.amountDecimal));
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
                        let formData = JSON.parse(JSON.stringify(this.formData));
                        formData.items = this.clearNoGoodsIdData(formData.items);
                        let sum = 0;
                        for (let i in formData.items) {
                            if (formData.items[i].qty) {
                                sum = sum * 1 + formData.items[i].qty * 1;
                            }
                        }
                        formData.allocationQty = sum;
                        formData.items = this.clearNoGoodsIdData(JSON.parse(JSON.stringify(formData.items)));
                        saveBill(formData).then((res) => {
                            this.preventRepeatSubmit(false, type);
                            if (res.data.code == 200 || res.data.code == '2000') {
                                this.$message({
                                    type: "success",
                                    message: "操作成功!"
                                });
                                this.$router.push({
                                    path: '/allocation_stock_out',
                                    name: '商品调拨单',
                                    meta: {
                                        i18n: 'allocation_stock_out'
                                    },
                                    query: {
                                        timeStamp: new Date().getTime()
                                    },
                                });
                            } else if (res.data.code == '401' || res.data.code == '50000000000') {
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
