<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox" >
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">发货清单(打印清单)</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td>
                            <span class="label">单据日期:</span>{{dataForm.billDate}}
                        </td>
                        <td>
                            <span class="label">出库单号:</span>{{dataForm.billNo}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">收货人:</span>{{dataForm.linkPerson}}
                        </td>
                        <td>
                            <span class="label">收货电话:</span>{{dataForm.linkPhone}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">配送方式:</span>{{dataForm.transportType == '0'? '快递运输':dataForm.transportType == '1'?'运费到付':'货物自提'}}
                        </td>
                        <td>
                            <span class="label">承运商:</span>{{dataForm.expressName}}
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2">
                            <span class="label">收货地址:</span>{{dataForm.linkAddress}}
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
                        <td style="background: #C5D9F1;">序号</td>
                        <td style="background: #C5D9F1;">仓位</td>
                        <td style="background: #C5D9F1;">商品名称</td>
                        <td style="background: #C5D9F1;">订货号</td>
                        <td style="background: #C5D9F1;">规格型号</td>
                        <td style="background: #C5D9F1;">单位</td>
                        <td style="background: #C5D9F1;">数量</td>
                        <!--<td style="background: #C5D9F1;">单价(含税)</td>-->
                        <!--<td style="background: #C5D9F1;">总金额(含税)</td>-->
                        <td style="background: #C5D9F1;">备注</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td style="text-align: center;">{{index+1}}</td>
                        <td>{{scope.positionName}}</td>
                        <td>{{scope.skuName}}</td>
                        <td>{{scope.itemNo}}</td>
                        <td>{{scope.specifications}}</td>
                        <td align="center">{{scope.unit}}</td>
                        <td align="right">{{scope.qty}}</td>
                        <!--<td align="right">{{scope.taxPrice}}</td>-->
                        <!--<td align="right">{{scope.taxAmount}}</td>-->
                        <td>{{scope.note}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td colspan="5"></td>
                        <td align="right">{{qtyTotal}}</td>
                        <td></td>
                        <!--<td align="right">{{taxAmountTotal}}</td>-->
                        <!--<td></td>-->
                    </tr>
                    <tr>
                        <td colspan="14">
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

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/wms/bill/salesStockOut';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "sales_stock_out_print",
        data() {
            return {
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
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            init() {
                getBill(this.$route.query.id)
                    .then(response => {
                        this.dataForm = response.data.data;
                        this.items = response.data.data.items;
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
                var amountTotal = 0;
                var taxTotal = 0;
                var taxAmountTotal = 0;
                var deliverQtyTotal = 0;
                for (var i in this.items) {
                    if (!isNaN(this.items[i].amount)) {
                        amountTotal = this.items[i].amount * 1 + amountTotal;
                    }
                    if (!isNaN(this.items[i].qty)) {
                        qtyTotal = this.items[i].qty * 1 + qtyTotal;
                    }
                    if (!isNaN(this.items[i].tax)) {
                        taxTotal = this.items[i].tax * 1 + taxTotal;
                    }
                    if (!isNaN(this.items[i].taxAmount)) {
                        taxAmountTotal = this.items[i].taxAmount * 1 + taxAmountTotal;
                    }
                    if (!isNaN(this.items[i].deliverQty)) {
                        deliverQtyTotal = this.items[i].deliverQty * 1 + deliverQtyTotal;
                    }
                }
                this.qtyTotal = qtyTotal.toFixed(this.sysParam.amountDecimal);
                this.amountTotal = amountTotal.toFixed(this.sysParam.amountDecimal);
                this.taxTotal = taxTotal.toFixed(this.sysParam.amountDecimal);
                this.taxAmountTotal = taxAmountTotal.toFixed(this.sysParam.amountDecimal);
                this.deliverQtyTotal = deliverQtyTotal.toFixed(this.sysParam.amountDecimal);
            }
        }
    }
</script>
