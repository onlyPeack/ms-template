<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox">
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">采购申请单</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td>
                            <span class="label">单据日期:</span>{{dataForm.billDate}}
                        </td>
                        <td>
                            <span class="label">需求仓库:</span>{{dataForm.warehouseName}}
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <div v-for="item in applyOption">
                                <span v-if="dataForm.applyType==item.value"><span class="label">申请类型:</span>{{item.label}}</span>
                            </div>
                        </td>
                        <td width="50%">
                            <span class="label">关联单据:</span>{{dataForm.sourceBillNo}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="label">备注:</span>{{dataForm.note}}
                        </td>
                    </tr>

                </table>
                <table class="formTable itemsTable">
                    <tr>
                        <td></td>
                        <td>商品名称</td>
                        <td>品牌</td>
                        <td>分类</td>
                        <td>系列</td>
                        <td>规格型号</td>
                        <td>订货号</td>
                        <td>计量单位</td>
                        <td>订单数量</td>
                        <td>可用库存数量</td>
                        <td>已分配数量</td>
                        <td>本次申请数量</td>
                        <td>备注</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td>{{index+1}}</td>
                        <td>{{scope.skuName}}</td>
                        <td>{{scope.brandName}}</td>
                        <td>{{scope.categoryName}}</td>
                        <td align="center">{{scope.seriesName}}</td>
                        <td align="right">{{scope.specifications}}</td>
                        <td align="right">{{scope.itemNo}}</td>
                        <td align="right">{{scope.unit}}</td>
                        <td align="center">{{scope.requiredQty}}</td>
                        <td align="right">{{scope.stockQty}}</td>
                        <td align="right">{{scope.allocatedQty}}</td>
                        <td align="right">{{scope.applyQty}}</td>
                        <td align="right">{{scope.note}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td colspan="10"></td>
                        <td align="right">{{qtyTotal}}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="13">
                            制单人：{{dataForm.crtUserName}}
                            <span style="float: right">制单时间：{{dataForm.crtTime}}</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div v-html="styleText"></div>
        </div>

        <div class="footer-container">
            <el-radio v-model="isPortrait" label="1" @change="handleRadioChange">纵向</el-radio>
            <el-radio v-model="isPortrait" label="0" @change="handleRadioChange">横向</el-radio>
            <el-checkbox v-model="hideHeader">隐藏页头</el-checkbox>
            <el-button v-print="'#printBox'" type="primary">打印</el-button>
        </div>
    </div>

</template>

<script>

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseApply';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "purchase_apply_print",
        data() {
            return {
                applyOption : [
                    {
                        value: '0',
                        label: '缺货补货'
                    },
                    {
                        value: '1',
                        label: '预警补货'
                    }, {
                        value: '2',
                        label: '生产订购'
                    }, {
                        value: '3',
                        label: '项目订货'
                    }, {
                        value: '4',
                        label: '已销订购'
                    }
                ],
                containerWidth: '70%',
                dataForm: {
                    id: undefined,
                    billNo: undefined,
                    billDate: undefined,
                    deliverDate: undefined,
                    linkPerson: undefined,
                    linkPhone: undefined,
                    linkAddress: undefined,
                    receiptBank: undefined,
                    customerId: undefined,
                    customerName: undefined,
                    salerId: undefined,
                    salerName: undefined,
                    currencyId: '1',
                    note: undefined,
                    billStatus: undefined,
                    sourceBillNo: undefined,
                    sourceObjectKey: undefined,
                    receiptCondition: '1',
                    accountMethod: '1',
                    companyName: undefined,
                    companyId: undefined,
                    changeCount: undefined,
                    items: []
                },
                accountMethodOptions: [],
                receiptConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
                items: [],
                qtyTotal: 0,
                amountTotal: 0,
                taxTotal: 0,
                taxAmountTotal: 0,
                deliverQtyTotal: 0,
                isPortrait: '1',
                hideHeader: false,
                styleText: '<style type="text/css" media="print">\n' + '  @page { size: portrait; }\n' + '</style>'
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                getBill(this.$route.query.id)
                    .then(response => {
                        this.dataForm = response.data.data;
                        this.items =response.data.data.items;
                        this.getTotal();
                    });
                pageAll().then(res=>{
                    this.accountMethodOptions = res.data
                })
            },
            handleRadioChange() {
                if (this.isPortrait == '1') {
                    this.containerWidth = '70%';
                    this.styleText = '<style type="text/css" media="print">\ n' + '  @page { size: portrait; }\n' + '</style>';
                } else {
                    this.containerWidth = '90%';
                    this.styleText = '<style type="text/css" media="print">\n' + '  @page { size: landscape; }\n' + '</style>';
                }
            },
            getTotal() {
                var qtyTotal = 0;
                for (var i in this.items) {
                    if (!isNaN(this.items[i].applyQty)) {
                        qtyTotal = this.items[i].applyQty * 1 + qtyTotal;
                    }
                }
                this.qtyTotal = qtyTotal.toFixed(2);
            }
        }
    }
</script>
