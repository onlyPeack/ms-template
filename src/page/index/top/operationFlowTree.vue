<template>
    <basic-container>
        <div class="operationFlow">
            <span class="operationFlowTilte">财务业务流程</span>
            <div class="operationFlowConent">
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/customer_reconciliation','customer_reconciliation','客户对账')">
                        <img src="http://hejigy.com.cn/Customerreconciliation.jpg"/>
                        <span>客户对账</span>
                    </div>
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/sales-receivable','sales-receivable','收款单')">
                        <img src="http://hejigy.com.cn/receipt.jpg"/>
                        <span>收款单</span>
                    </div>
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/receivables-detail','receivables-detail','应收明细')">
                        <img src="http://hejigy.com.cn/ARdetails.jpg"/>
                        <span>应收明细</span>
                    </div>
                </div>
                <div class="operationFlowConentItem" >
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent"   @click="backgroundItem('/bank-account','bank-account','银行资金')">
                        <img src="http://hejigy.com.cn/Fundbalance.jpg"/>
                        <span>资金余额</span>
                    </div>
                </div>
                <div class="operationFlowConentItem" >
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/supplier_reconciliation','supplier_reconciliation','供应商对账')">
                        <img src="http://hejigy.com.cn/Supplierreconciliation.jpg"/>
                        <span>供应商对账</span>
                    </div>
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/purchase-payment','purchase-payment','付款单')">
                        <img src="http://hejigy.com.cn/Paymentnote.jpg"/>
                        <span>付款单</span>
                    </div>
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/payable-detail','payable-detail','应付明细')">
                        <img src="http://hejigy.com.cn/APdetails.jpg"/>
                        <span>应付明细</span>
                    </div>
                </div>
            </div>
        </div>
    </basic-container>
</template>

<script>
    export default {
        name: "operationFlowTree",
        methods: {
            backgroundItem(url, urlName, dataName) {
                this.$router.push({
                    path: url,
                    name: dataName,
                    meta: {
                        i18n: urlName
                    },
                    query: {
                        timeStamp: new Date().getTime()
                    },
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .operationFlow {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px 10px 140px 10px;
        span {
            text-align: center;
        }
        .operationFlowTilte {
            font-size: 22px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0px 20px 0px;
        }
        .operationFlowConent {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            .operationFlowConentItem, .operationFlowConentItemConent {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index:99999999;
                img {
                    width: 90px;
                    height: 90px;
                    margin-top: 30px;
                }
                .operationFlowJianGeImg {
                    height: 14px;
                    width: auto;
                    margin: 0px 40px;
                }
                span {
                    font-size: 15px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin-top: 5px;
                }
            }
        }
    }
    img,span{
        cursor: pointer;
    }
</style>