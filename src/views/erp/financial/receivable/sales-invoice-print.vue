<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox">
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">销售开票单</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td>
                            <span class="label">单据日期:</span>{{dataForm.billDate}}
                        </td>
                        <td>
                            <span class="label">操作类型:</span>{{dataForm.operationType == '0' ? '开票' : '退票'}}
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <span class="label">关联单据:</span>{{dataForm.sourceBillNo}}
                        </td>
                        <td>
                            <span class="label">客户:</span>{{dataForm.customerName}}
                        </td>

                    </tr>
                    <tr>
                        <td width="50%">
                            <span class="label">发票类型:</span>{{dataForm.invoiceType == '1'? '增值税专用发票':'采购普通发票'}}
                        </td>
                        <td>
                            <span class="label">开票电话:</span>{{dataForm.kpTel}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">开票地址:</span>{{dataForm.kpAddress}}
                        </td>
                        <td>
                            <span class="label">开票电话:</span>{{dataForm.kpTel}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">收货地址:</span>{{dataForm.kpAddress}}
                        </td>
                        <td>
                            <span class="label">收票人:</span>{{dataForm.spMan}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">收票电话:</span>{{dataForm.spTel}}
                        </td>
                        <td>
                            <span class="label">收票地址:</span>{{dataForm.spAddress}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">寄票类型:</span>{{dataForm.sendInvoiceType == '0'? '单寄':dataForm.sendInvoiceType == '1'? '合寄': '自领'}}
                        </td>
                        <td>
                            <span class="label">寄送方式:</span>{{dataForm.expressName}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">纳税人识别号:</span>{{dataForm.taxpayerNumber}}
                        </td>
                        <td>
                            <span class="label">开户银行:</span>{{dataForm.bankName}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="label">银行账号:</span>{{dataForm.bankAccount}}
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
                        <td>规格型号</td>
                        <td>数量</td>
                        <td>单价</td>
                        <td>金额</td>
                        <td>税率</td>
                        <td>税额</td>
                        <td>含税单价</td>
                        <td>价税合计</td>
                        <td>单位</td>
                        <td>备注</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td>{{index+1}}</td>
                        <td>{{scope.skuName}}</td>
                        <td>{{scope.specifications}}</td>
                        <td align="right">{{scope.qty}}</td>
                        <td align="right">{{scope.price}}</td>
                        <td align="right">{{scope.amount}}</td>
                        <td align="center">{{scope.taxRate}}%</td>
                        <td align="right">{{scope.tax}}</td>
                        <td align="right">{{scope.taxPrice}}</td>
                        <td align="right">{{scope.taxAmount}}</td>
                        <td align="center">{{scope.unit}}</td>
                        <td>{{scope.note}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td colspan="2"></td>
                        <td align="right">{{qtyTotal}}</td>
                        <td></td>
                        <td align="right">{{amountTotal}}</td>
                        <td></td>
                        <td align="right">{{taxTotal}}</td>
                        <td></td>
                        <td align="right">{{taxAmountTotal}}</td>
                        <td></td>
                        <td></td>
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

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/financialSalesInvoice';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "sales-invoice-print",
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
                console.log(1);
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
                }
                this.qtyTotal = qtyTotal.toFixed(this.sysParam.amountDecimal);
                this.amountTotal = amountTotal.toFixed(this.sysParam.amountDecimal);
                this.taxTotal = taxTotal.toFixed(this.sysParam.amountDecimal);
                this.taxAmountTotal = taxAmountTotal.toFixed(this.sysParam.amountDecimal);
            }
        }
    }
</script>
