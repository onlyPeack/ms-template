<template>
    <basic-container>
        <div class="operationFlow">
            <span class="operationFlowTilte">采购业务流程</span>
            <div class="operationFlowConent">
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/purchase_apply','purchase_apply','采购申请')">
                        <img src="http://hejigy.com.cn/Purchaserequisition.jpg"/>
                        <span>采购申请</span>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent">
                        <img src="http://hejigy.com.cn/PurchaseImg.png" style="width: 110px;height: auto;margin-left: 40px;"/>
                    </div>
                </div>
                <div class="operationFlowConentItem" style="margin-right: 20px;">
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem operationFlowConentItemThree" style="margin-top: 200px;">
                    <div class="operationFlowConentItemXuXians">
                        <img class="operationFlowConentItemImgs" src="http://hejigy.com.cn/Dottedline2.png"/>
                        <div class="operationFlowConentItemConentTop">
                            <div class="operationFlowConentItemConent"  @click="backgroundItem('/purchase_order','purchase_order','采购订单')">
                                <img src="http://hejigy.com.cn/Purchaseorder.jpg"/>
                                <span>采购订单</span>
                            </div>
                            <div class="operationFlowConentItemConent" style="margin-left: 10px">
                                <img class="operationFlowJianGeImg" style="margin: 0px 30px  0px 40px;" src="http://hejigy.com.cn/Arrowright.jpg"/>
                            </div>
                            <div class="operationFlowConentItemXuXians">
                                <div class="operationFlowConentItemConent"  @click="backgroundItem('/purchase_stock_in','purchase_stock_in','采购入库')">
                                    <img src="http://hejigy.com.cn/Purchasereceipt.jpg"/>
                                    <span>采购入库</span>
                                </div>
                                <div class="operationFlowConentItemConentLast">
                                    <div class="operationFlowConentItemXuXianLast">
                                        <div class="operationFlowConentItemConents" style="margin-left: 38px;">
                                            <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/Onthearrow.png " style="margin-bottom: -10px;transform: rotate(180deg);
-ms-transform: rotate(180deg);"/>
                                        </div>
                                        <div class="operationFlowConentItemConentTop">
                                            <div class="operationFlowConentItemConent"  @click="backgroundItem('/purchase_stock_return','purchase_stock_return','采购退货')">
                                                <img src="http://hejigy.com.cn/Purchasereturn.jpg"/>
                                                <span>采购退货</span>
                                            </div>
                                            <div class="operationFlowConentItemConent" style="margin-left: 10px">
                                                <img style="margin: 0px 20px;" class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                                            </div>
                                            <div class="operationFlowConentItemConent">
                                                <img src="http://hejigy.com.cn/Warehousedelivery.jpg"/>
                                                <span>仓库发货</span>
                                            </div>
                                            <div class="operationFlowConentItemConent" style="margin-left: 10px">
                                                <img style="margin: 0px 20px;" class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                                            </div>
                                            <div class="operationFlowConentItemConent"    @click="backgroundItem('/supplier','supplier','供应商资料')">
                                                <img src="http://hejigy.com.cn/supplier.jpg"/>
                                                <span>供应商</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="operationFlowConentItemConent" style="margin-left: 10px">
                                <img style="margin: 0px 20px;" class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                            </div>
                            <div class="operationFlowConentItemConent"   @click="backgroundItem('/purchase-payment','purchase-payment','付款单')">
                                <img src="http://hejigy.com.cn/Purchasepayment.jpg"/>
                                <span>付款单</span>
                            </div>
                        </div>
                        <div class="operationFlowConentItemConent" @click="backgroundItem('/purchase-invoice','purchase-invoice','采购收票')">
                            <img src="http://hejigy.com.cn/Purchaseinvoice.jpg"/>
                            <span>采购发票</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </basic-container>
</template>

<script>
    export default {
        name: "operationFlowTwo",
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
            .operationFlowConentItem, .operationFlowConentItemConent, .operationFlowConentItemXuXian {
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
                .operationFlowJianGeImgs {
                    width: 14px;
                    height: auto;
                    margin: 14px 0px;
                }
                .operationFlowConentItemImgs {
                    position: absolute;
                    top: -28px;
                    left: -17px;
                    width: 126px;
                    height: auto;
                }
                span {
                    font-size: 15px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    margin-top: 5px;
                }
            }
            .operationFlowConentItemThree,.operationFlowConentItemThree .operationFlowConentItemConents, .operationFlowConentItemXuXians{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
            }
            .operationFlowJianGe {
                height: 40px;
            }
            .operationFlowConentItemXuXians {
                position: relative;
            }
            .operationFlowConentItemConentTop {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
            }
            .operationFlowConentItemConentLast{
                position: absolute;
                top: 150px;
                left: 0px;
                .operationFlowConentItemXuXianLast{
                    display: flex;
                    flex-direction: column;
                    align-content: flex-start;
                    align-items: flex-start;
                }
            }
        }
    }
    img,span{
        cursor: pointer;
    }
</style>