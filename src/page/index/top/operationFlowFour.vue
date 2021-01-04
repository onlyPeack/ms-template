<template>
    <basic-container>
        <div class="operationFlow">
            <span class="operationFlowTilte">仓储业务流程</span>
            <div class="operationFlowConent">
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/purchase_stock_in','purchase_stock_in','采购入库')">
                        <img src="http://hejigy.com.cn/Purchasereceipt.jpg"/>
                        <span>采购入库</span>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent">
                        <img src="http://hejigy.com.cn/Receipt.jpg"/>
                        <span>收货</span>
                    </div>
                </div>
                <div class="operationFlowConentItem" style="margin-right: 20px;">
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem" style="margin-right: 20px; padding: 130px 0px;">
                    <div class="operationFlowConentItemConentTop">
                            <div class="operationFlowConentItemConent" @click="backgroundItem('/other_stock_in','other_stock_in','其它入库')">
                                <img src="http://hejigy.com.cn/Miscellaneousreceipt.jpg"/>
                                <span>其它入库</span>
                            </div>
                            <div style="width: 20px;height: 1px;"></div>
                            <div class="operationFlowConentItemConent" @click="backgroundItem('/other_stock_out','other_stock_out','其它出库')">
                                <img src="http://hejigy.com.cn/Miscellaneousissue.jpg"/>
                                <span>其它出库</span>
                            </div>
                    </div>
                    <div class="operationFlowConentItemConents" >
                        <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/jiantouleft.png" style="margin-bottom: -14px;margin-top: 30px;margin-right: 12px;"/>
                        <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/Onthearrow.png" style="margin-bottom: -14px;margin-top: 30px;transform: rotate(180deg);
-ms-transform: rotate(180deg);"/>
                    </div>
                    <div class="operationFlowConentItem">
                        <div class="operationFlowConentItemConent" @click="backgroundItem('/goods_stock_query','goods_stock_query','即时库存查询')">
                            <img src="http://hejigy.com.cn/Immediateinventory.jpg"/>
                            <span>即时库存</span>
                        </div>
                    </div>
                    <div class="operationFlowConentItemConents" >
                        <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/jiantouleft.png" style="margin-right: 12px;"/>
                        <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/Onthearrow.png" style="transform: rotate(180deg);
-ms-transform: rotate(180deg);"/>
                    </div>
                    <div class="operationFlowConentItemConentTops">
                        <div class="operationFlowConentItemConent" @click="backgroundItem('/combind','combind','组装拆卸单')">
                            <img src="http://hejigy.com.cn/Assemblyanddisassembly.jpg"/>
                            <span>组装拆卸</span>
                        </div>
                        <div style="width: 20px;height: 1px;"></div>
                        <div class="operationFlowConentItemConent" @click="backgroundItem('/check_stock','check_stock','库存盘点单')">
                            <img src="http://hejigy.com.cn/Inventorycheck.jpg"/>
                            <span>库存盘点</span>
                        </div>
                        <div class="operationFlowConentItem">
                            <div class="operationFlowConentItemConent">
                                <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg" style="margin: 0px 20px 0px 50px;"/>
                            </div>
                        </div>
                        <div class="operationFlowConentItem">
                            <div class="operationFlowConentItemConent"  @click="backgroundItem('/check_stock_profit','check_stock_profit','盘盈入库单')">
                                <img src="http://hejigy.com.cn/Inventorygainwarehousing.jpg"/>
                                <span>盘盈入库</span>
                            </div>
                        </div>
                        <div style="width: 30px;height: 1px;"></div>
                        <div class="operationFlowConentItem">
                            <div class="operationFlowConentItemConent"  @click="backgroundItem('/check_stock_loss','check_stock_loss','盘亏出库单')">
                                <img src="http://hejigy.com.cn/Inventorysurplusissue.jpg"/>
                                <span>盘亏出库</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem" style="margin-top: -240px;">
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/customer_order','customer_order','销售订单')">
                        <img src="http://hejigy.com.cn/Salesorder.jpg"/>
                        <span>销售订单</span>
                    </div>
                    <div class="operationFlowConentItemConents" >
                        <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/jiantouleft.png" style="margin-bottom: -10px;margin-top: 32px;"/>
                    </div>
                    <div class="operationFlowConentItemConent">
                        <img src="http://hejigy.com.cn/sorting.jpg"/>
                        <span>分拣</span>
                    </div>
                </div>
                <div class="operationFlowConentItem">
                    <div class="operationFlowConentItemConent">
                        <img class="operationFlowJianGeImg" src="http://hejigy.com.cn/Arrowright.jpg"/>
                    </div>
                </div>
                <div class="operationFlowConentItem" style="margin-top: -240px;">
                    <div class="operationFlowConentItemConent" @click="backgroundItem('/purchase_stock_return','purchase_stock_return','采购退货')">
                        <img src="http://hejigy.com.cn/Purchasereturn.jpg"/>
                        <span>采购退货</span>
                    </div>
                    <div class="operationFlowConentItemConents" >
                        <img class="operationFlowJianGeImgs" src="http://hejigy.com.cn/jiantouleft.png" style="margin-bottom: -10px;margin-top: 32px;"/>
                    </div>
                    <div class="operationFlowConentItemConent">
                        <img src="http://hejigy.com.cn/delivergoods.jpg"/>
                        <span>发货</span>
                    </div>
                </div>
            </div>
        </div>
    </basic-container>
</template>

<script>
    export default {
        name: "operationFlowFour",
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
            margin-top: 40px;
            .operationFlowConentItem, .operationFlowConentItemConent, .operationFlowConentItemXuXian {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index:99999999;
                position: relative;
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
            .operationFlowConentItemThree, .operationFlowConentItemXuXians{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
            }
            .operationFlowConentItemThree .operationFlowConentItemConents{
                display: flex;
                flex-direction: row;
                justify-content: center;
            }
            .operationFlowJianGe {
                height: 40px;
            }
            .operationFlowConentItemXuXians {
                position: relative;
            }
            .operationFlowConentItemConentTop,.operationFlowConentItemConentTops {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                position: absolute;

                &:after {
                    content: url('http://hejigy.com.cn/xuxianheng.png');
                    width: 0;
                    height: 0;
                    left: -35px;
                    bottom: 0;
                    top: -5px;
                    border: 15px solid #ffffff;
                    border-left: 15px solid transparent;
                    border-top: 15px solid transparent;
                    border-bottom-right-radius: 10px;
                    border-style: solid;
                    position: absolute;
                }
            }
            .operationFlowConentItemConentTop{
                top: -20px;
            }
            .operationFlowConentItemConentTops{
                left: -50px;
                top: 440px;
            }
        }
    }
    img,span{
        cursor: pointer;
    }
</style>