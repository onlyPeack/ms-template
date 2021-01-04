<template>
    <basic-container style="height: 100%;overflow: auto;background: #fff;">
        <div class="bill-print-container" :style="{width:containerWidth}">
            <div class="print-box" id="printBox" ref="print">
                <div class="print-container">
                    <div class="print-top">
                        <div class="print-title">{{data.contractName}}产品购销合同</div>
                        <table style="margin: 20px 0px;width: 100%;font-size: 12px;">
                            <tr>
                                <td width="50%">
                                    <span class="label">甲方:</span>{{data.firstParty}}
                                </td>
                                <td width="50%">
                                    <span class="label">合同编号:</span>{{data.billNo}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">乙方:</span>{{data.secondParty}}
                                </td>
                                <td width="50%">
                                    <span class="label">签订地点:</span>{{data.location}}
                                </td>
                            </tr>
                        </table>
                        <strong style="margin-bottom: 10px;display: inline-block;"> 根据《中华人民共和国合同法》及相关法律法规，买卖双方经平等友好协商达成一致，订立本合同以下条款：
                        </strong>
                        <strong style="margin-bottom: 10px;display: inline-block;">
                            一、买卖双方所签订的产品品名、品牌、型号规格、数量、金额（人民币）如下：
                        </strong>
                    </div>
                    <div class="print-table">
                        <table v-if="itemsList.length<1" class="formTable itemsTable hiddenTable">
                            <tr>
                                <td>序号</td>
                                <td>品牌</td>
                                <td>商品名称</td>
                                <td>规格型号</td>
                                <td>数量</td>
                                <td>单价</td>
                                <td>金额</td>
                            </tr>
                            <tr v-for="(scope,index) in items">
                                <td width="10%">{{index+1}}</td>
                                <td width="20%">{{scope.brandName}}</td>
                                <td width="20%">{{scope.skuName}}</td>
                                <td width="20%">{{scope.specifications}}</td>
                                <td width="10%" align="right">{{scope.qty}}</td>
                                <td width="10%" align="right">{{scope.taxPrice}}</td>
                                <td width="10%" align="right">{{scope.taxAmount}}</td>
                            </tr>
                            <tr>
                            <tr>
                                <td>合计</td>
                                <td colspan="5"></td>
                                <!--<td align="right">{{qtyTotal}}</td>-->
                                <!--<td></td>-->
                                <td align="right">{{taxAmountTotal}}</td>
                            </tr>
                        </table>
                        <div v-else>
                            <div v-for="(item,idx) in itemsList" v-if="item.list">
                                <table class="formTable itemsTable">
                                    <tr v-if="idx==0" class="table-head">
                                        <td>序号</td>
                                        <td>品牌</td>
                                        <td>商品名称</td>
                                        <td>规格型号</td>
                                        <td>数量</td>
                                        <td>单价</td>
                                        <td>金额</td>
                                    </tr>
                                    <tr v-for="scope in item.list">
                                        <td :width="tdsWidth.length>0 ? tdsWidth[0]+'px':''">{{scope.index}}</td>
                                        <td :width="tdsWidth.length>0 ? tdsWidth[1]+'px':''">{{scope.brandName}}</td>
                                        <td :width="tdsWidth.length>0 ? tdsWidth[2]+'px':''">{{scope.skuName}}</td>
                                        <td :width="tdsWidth.length>0 ? tdsWidth[3]+'px':''">{{scope.specifications}}
                                        </td>
                                        <td :width="tdsWidth.length>0 ? tdsWidth[4]+'px':''" align="center">
                                            {{scope.qty}}
                                        </td>
                                        <td :width="tdsWidth.length>0 ? tdsWidth[5]+'px':''" align="right">
                                            {{scope.taxPrice}}
                                        </td>
                                        <td :width="tdsWidth.length>0 ? tdsWidth[6]+'px':''" align="right">
                                            {{scope.taxAmount}}
                                        </td>
                                    </tr>
                                    <tr v-if="idx==itemsList.length-1" class="table-head">
                                        <td>合计</td>
                                        <td colspan="5"></td>
                                        <!--<td align="right">{{qtyTotal}}</td>-->
                                        <!--<td></td>-->
                                        <td align="right">{{taxAmountTotal}}</td>
                                    </tr>
                                </table>
                                <div class="page-break" v-if="idx!=itemsList.length-1"></div>
                            </div>
                        </div>
                    </div>
                    <div class="print-footer">
                        <div class="page-break"
                             v-if="itemsList && itemsList.length>0 && itemsList[itemsList.length-1].lastPage==3"></div>
                        <table style="width: 100%;" class="formTable itemsTable">
                            <tr>
                                <td colspan="7" style="text-align: center">合计人民币金额大写: {{data.bigAmount}}
                                </td>
                            </tr>
                        </table>
                        <div v-html="dataDefault"></div>
                        <table style="margin-top: 20px;width: 100%;font-size: 12px;">
                            <tr>
                                <td width="50%">
                                    <span class="label">甲方:</span>{{data.firstParty}}
                                </td>
                                <td width="50%">
                                    <span class="label">乙方:</span>{{data.secondParty}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">开户银行:</span>{{data.firstBankName}}
                                </td>
                                <td width="50%">
                                    <span class="label">开户银行:</span>{{data.secondBankName}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">账号:</span>{{data.firstBankNo}}
                                </td>
                                <td width="50%">
                                    <span class="label">账号:</span>{{data.secondBankNo}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">税号:</span>{{data.firstTaxNo}}
                                </td>
                                <td width="50%">
                                    <span class="label">税号:</span>{{data.secondTaxNo}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">地址:</span>{{data.firstAddress}}
                                </td>
                                <td width="50%">
                                    <span class="label">地址:</span>{{data.secondAddress}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">电话:</span>{{data.firstTelPhone}}
                                </td>
                                <td width="50%">
                                    <span class="label">电话:</span>{{data.secondTelPhone}}
                                </td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <span class="label">联系人:</span>{{data.firstTelMan}}
                                </td>
                                <td width="50%">
                                    <span class="label">联系人:</span>{{data.secondTelMan}}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div v-html="styleText"></div>
            </div>

            <div class="footer-container">
                <el-radio v-model="isPortrait" label="1" @change="handleRadioChange">纵向</el-radio>
                <el-radio v-model="isPortrait" label="0" @change="handleRadioChange">横向</el-radio>
                <el-button v-print="'#printBox'" type="primary">打印</el-button>
            </div>
        </div>
    </basic-container>
</template>

<script>

    import {addBill, getBill, tempAddBill, auditBill,contractPrint} from '@/api/erp/sales/bill/salesOrder';
    import { getDefault} from '@/api/erp/project_management/projectOverview';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "customer_order_print",
        data() {
            return {
                containerWidth: '720px',
                tdsWidth: [],
                itemsList: [],
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
                receiptConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
                items: [],
                qtyTotal: 0,
                amountTotal: 0,
                taxTotal: 0,
                taxAmountTotal: 0,
                deliverQtyTotal: 0,
                isPortrait: '1',
                hideHeader: false,
                currTime: undefined,
                data: {},
                dataDefault: undefined,
                styleText: '<style type="text/css" media="print">\n' + '  @page { size: portrait; }\n' + '</style>'
            };
        },
        created() {
            this.init();
            this.currTime = new Date().toLocaleDateString().replace(/\//g, '-');
        },
        computed: {
            sysParam() {
                return this.$store.getters.sysParam;
            }
        },
        methods: {
            init() {
                getDefault(0).then(res => {
                    this.dataDefault = res.data.data;
                })
                contractPrint(this.$route.query.id).then(res => {
                    this.data = res.data.data;
                })
                getBill(this.$route.query.id)
                    .then(response => {
                        this.dataForm = response.data.data;
                        this.items=response.data.data.items;
                        this.printRecombinationData.call(this);
                        console.log(this.itemsList)
                        this.getTotal();
                    });

            },
            handleRadioChange() {
                if (this.isPortrait == '1') {
                    this.containerWidth = '720px';
                    this.styleText = '<style type="text/css" media="print">\ n' + '  @page { size: portrait; }\n' + '</style>';
                } else {
                    this.containerWidth = '1100px';
                    this.styleText = '<style type="text/css" media="print">\n' + '  @page { size: landscape; }\n' + '</style>';
                }
                //组装分页数据
                this.printRecombinationData.call(this);

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

