<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox">
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">生产订单</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td width="50%">
                            <span class="label">单据日期:</span>{{dataForm.billDate}}
                        </td>
                        <td>
                            <span class="label">项目编号:</span>{{dataForm.projectBillNo}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">项目名称:</span>{{dataForm.projectName}}
                        </td>
                        <td>
                            <span class="label">项目类型:</span>{{dataForm.projectCut}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">销售员:</span>{{dataForm.salesName}}
                        </td>
                        <td>
                            <span class="label">开工日期:</span>{{dataForm.openDate}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">结束日期:</span>{{dataForm.endsDate}}
                        </td>
                        <td>
                            <span class="label">技术人员:</span>{{dataForm.skillName}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="label">生产人员:</span>{{dataForm.produceName}}
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
                        <td>计量单位</td>
                        <td>数量</td>
                        <td>备注</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td>{{index+1}}</td>
                        <td>{{scope.skuName}}</td>
                        <td>{{scope.itemNo}}</td>
                        <td>{{scope.specifications}}</td>
                        <td>{{scope.unit}}</td>
                        <td align="center">{{scope.qty}}</td>
                        <td align="right">{{scope.note}}</td>
                    </tr>
                    <tr>
                        <td colspan="7">
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

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/product/shop_manager/product_order';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "product_order_print",
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
        }
    }
</script>
