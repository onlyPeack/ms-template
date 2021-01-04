<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox">
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">报价单</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td>
                            <span class="label">单据日期:</span>{{dataForm.billDate}}
                        </td>
                        <td>
                            <span class="label">销售员:</span>{{dataForm.salesName}}
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <span class="label">客户名称:</span>{{dataForm.customerName}}
                        </td>
                        <td width="50%">
                            <span class="label">客户联系人:</span>{{dataForm.contactName}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">客户联系人电话:</span>{{dataForm.contactPhone}}
                        </td>
                        <td>
                            <span class="label">项目负责人:</span>{{dataForm.projectName}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">报价类型:</span>{{dataForm.quotationType == 0? '生产':'普通'}}
                        </td>
                        <td>
                            <span class="label">报价有效期:</span>{{dataForm.startDate+'至'+dataForm.endDate}}
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
                        <td>产品名称</td>
                        <td>订货号</td>
                        <td>规格型号</td>
                        <td>单位</td>
                        <td>数量</td>
                        <td>单价</td>
                        <td>金额</td>
                        <td>税率</td>
                        <td>税额</td>
                        <td>含税单价</td>
                        <td>含税金额</td>
                        <td>货期(天)</td>
                        <td>产品描述</td>
                        <td>备注</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td>{{index+1}}</td>
                        <td>{{scope.skuName}}</td>
                        <td>{{scope.itemNo}}</td>
                        <td>{{scope.specifications}}</td>
                        <td align="center">{{scope.unit}}</td>
                        <td align="right">{{scope.qty}}</td>
                        <td align="right">{{scope.price}}</td>
                        <td align="right">{{scope.amount}}</td>
                        <td align="center">{{scope.taxRate}}%</td>
                        <td align="right">{{scope.tax}}</td>
                        <td align="right">{{scope.taxPrice}}</td>
                        <td align="right">{{scope.taxAmount}}</td>
                        <td align="right">{{scope.productionTime}}</td>
                        <td align="right">{{scope.productdescribe}}</td>
                        <td>{{scope.note}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td colspan="4"></td>
                        <td align="right">{{qtyTotal}}</td>
                        <td></td>
                        <td align="right">{{amountTotal}}</td>
                        <td></td>
                        <td align="right">{{taxTotal}}</td>
                        <td></td>
                        <td align="right">{{taxAmountTotal}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="15">
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

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchasePrices';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "salesOrderPrint",
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
                        this.items =response.data.data.quotationType == 0 ? response.data.data.items :  response.data.data.bills;
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
                this.qtyTotal = getFloat(qtyTotal, 2);
                this.amountTotal = getFloat(amountTotal, 2);
                this.taxTotal = getFloat(taxTotal, 2);
                this.taxAmountTotal = getFloat(taxAmountTotal, 2);
                this.deliverQtyTotal = getFloat(deliverQtyTotal, 2);
            }
        }
    }
</script>
