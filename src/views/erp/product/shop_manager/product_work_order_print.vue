<template>
    <div class="contractPrintContainer" :style="{width:containerWidth}" style="overflow: auto;">
        <div class="print-box" id="printBox">
            <div class="print-container">
                <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
                <div class="print-title">报工单</div>
                <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
                <div class="print-hr"></div>
                <table class="formTable">
                    <tr>
                        <td>
                            <span class="label">关联单据:</span>{{dataForm.sourceBillNo}}
                        </td>
                        <td>
                            <span class="label">产品名称:</span>{{dataForm.skuName}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">柜体号:</span>{{dataForm.itemNo}}
                        </td>
                        <td>
                            <span class="label">下达数量:</span>{{dataForm.qty}}
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
                        <td>工序名称</td>
                        <td>作业要求</td>
                        <td>操作员</td>
                        <td>开始时间</td>
                        <td>完工时间</td>
                        <td>计划工时</td>
                        <td>实际工时</td>
                        <td>是否合格</td>
                        <td>不合格原因</td>
                    </tr>
                    <tr v-for="(scope,index) in items">
                        <td>{{index+1}}</td>
                        <td>{{scope.workOn}}</td>
                        <td>{{scope.demand}}</td>
                        <td>{{scope.skillName}}</td>
                        <td>{{scope.startTime}}</td>
                        <td align="center">{{scope.endTime}}</td>
                        <td align="right">{{scope.estimateHour}}</td>
                        <td align="right">{{scope.workerHour}}</td>
                        <td align="right">{{scope.onTest}}</td>
                        <td align="right">{{scope.onText}}</td>
                    </tr>
                    <tr>
                        <td colspan="10">
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

    import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/product/shop_manager/product_work_order';
    import "@/styles/print.scss";
    import {getFloat} from '@/util/util'
    import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

    export default {
        name: "product_work_order_print",
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
