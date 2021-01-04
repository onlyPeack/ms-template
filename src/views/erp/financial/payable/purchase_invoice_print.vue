<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox">
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">采购收票单</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td>
                            <span class="label">单据日期:</span>{{dataForm.billDate}}
                        </td>
                        <td>
                            <span class="label">供应商:</span>{{dataForm.supplierName}}
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <span class="label">发票类型:</span>{{dataForm.invoiceType == '1' ? '增值税专用发票' : '采购普通发票'}}
                        </td>
                        <td width="50%">
                            <span class="label">税率:</span>{{dataForm.taxRate}}%
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">采购员:</span>{{dataForm.purchaserName}}
                        </td>
                        <td>
                            <span class="label">采购员部门:</span>{{dataForm.departName}}
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
                        <td>本次到票金额</td>
                        <td>不含税金额</td>
                        <td>税额</td>
                        <td>发票代码</td>
                        <td>发票号码</td>
                        <td>开票日期</td>
                        <td>收票日期</td>
                        <td>备注</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td>{{index+1}}</td>
                        <td>{{scope.taxAmount}}</td>
                        <td>{{scope.amount}}</td>
                        <td>{{scope.tax}}</td>
                        <td align="center">{{scope.invoiceCode}}</td>
                        <td align="right">{{scope.invoiceNo}}</td>
                        <td align="right">{{scope.invoiceDate}}</td>
                        <td align="right">{{scope.receiveDate}}</td>
                        <td align="center">{{scope.note}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td align="right">{{taxAmountTotal}}</td>
                        <td align="right">{{amountTotal}}</td>
                        <td align="right">{{taxTotal}}</td>
                        <td  colspan="5"></td>
                    </tr>
                    <tr>
                        <td colspan="9">
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

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/invoiceOrder';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "purchase_order_print",
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
                var amountTotal = 0;
                var taxTotal = 0;
                var taxAmountTotal = 0;
                for (var i in this.items) {

                    if (!isNaN(this.items[i].amount)) {
                        amountTotal = this.items[i].amount * 1 + amountTotal;
                    }
                    if (!isNaN(this.items[i].tax)) {
                        taxTotal = this.items[i].tax * 1 + taxTotal;
                    }
                    if (!isNaN(this.items[i].taxAmount)) {
                        taxAmountTotal = this.items[i].taxAmount * 1 + taxAmountTotal;
                    }

                }
                this.amountTotal = amountTotal.toFixed(2);
                this.taxTotal = taxTotal.toFixed(2);
                this.taxAmountTotal = taxAmountTotal.toFixed(2);
            }
        }
    }
</script>
