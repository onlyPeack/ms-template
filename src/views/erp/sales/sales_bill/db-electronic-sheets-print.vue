<template>
    <div class="bill-print-container" style="width:12.5cm;padding: 16px !important;" v-loading="loading"
         element-loading-background="rgba(255, 255, 255, 1)">

        <div class="print-box" id="printBox" ref="print" style="vertical-align：center;text-align: center;">
            <div style="border:1px solid #c0c0c0;padding-left: 0.2cm;padding-bottom: 0.2cm;width:11.6cm;">
                <div class="wrapper">
                    <div>
                        <img src="https://hejigy.com.cn/sflogo.jpg">
                        <img src="http://www.kwmzy.com:8005/admin/assets/sf/tel.png">
                    </div>
                    <div class="wrapper_title">
                        <span>&nbsp;&nbsp;打印时间 {{printTime}}</span>
                    </div>
                    <table class="container containerOne" style="height: 2.2cm;text-indent: 0;">
                        <tr>
                            <td class="containerOneTd">
                                <div style="text-align: center;margin-top: 3px;">
                                    <div>
                                        <canvas id="svgcode" style="height: 80px;"></canvas>
                                    </div>
                                    <div>
                                        <p style="text-align: center;font-family: Arial; font-size: 10pt;margin-bottom: 10px;">
                                            1/1&nbsp;&nbsp;&nbsp;母单号&nbsp;&nbsp;&nbsp;{{orderModel.mailNo}}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="containerTwoTd"><img style="height: 2cm; "
                                                            :src="'https://hejigy.com.cn/'+(orderModel.rlsInfoDtoList && orderModel.rlsInfoDtoList.length>0?orderModel.rlsInfoDtoList[0].proCode:'')+'.jpg'">
                            </td>
                        </tr>
                    </table>
                    <table class="container" style="height: 3cm; position: relative;">
                        <tr>
                            <td>
                                <div class="containerTwoDiv">
                                    <span class="containerTwoDivSpan">{{orderModel.rlsInfoDtoList && orderModel.rlsInfoDtoList.length>0?orderModel.rlsInfoDtoList[0].destRouteLabel:''}}</span>
                                    <div class="containerTwoDivAddress">
                                        <div>
                                            <img src="https://hejigy.com.cn/so.jpg" alt=""
                                                 style="width: 30px;height: auto"/>
                                            <div>
                                                <span>{{orderModel.consignerName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font
                                                        style="font-size: 13px;">{{orderModel.consignerMobile}}</font></span>
                                                <!--<span>{{orderModel.consignerCompany}}</span>-->
                                                <span>{{orderModel.consignerAddress}}</span>
                                            </div>
                                        </div>
                                        <img src="https://hejigy.com.cn/COD.jpg" alt=""
                                             style="width: 75px;height: auto;margin-right: 0px;"/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="container">
                        <tr>
                            <td style="width: 39%;">
                                <div style="text-align: center;border-bottom: 1px solid black;line-height: 0.8cm;margin-top: -0cm;">
                                    {{orderModel.payMethod == 1?'寄付':orderModel.payMethod ==
                                    2?'到付':'第三方付'}}{{orderModel.codValue}}
                                </div>
                                <p style="font-size: 40pt; text-align: center;font-weight: bold;flex: 1;margin-top: 0.3cm;margin-bottom: 0.3cm;">
                                    {{orderModel.rlsInfoDtoList &&
                                    orderModel.rlsInfoDtoList.length>0?orderModel.rlsInfoDtoList[0].codingMapping:''}}</p>
                            </td>
                            <td style="width: 18%;"><img v-if="orderModel.rlsInfoDtoList&&orderModel.rlsInfoDtoList.length>0"
                                    style="width: 3.2cm; height: 3.2cm; margin: 0.1cm 0 0 0;"
                                    :src="'data:image/png;base64,'+(orderModel.rlsInfoDtoList && orderModel.rlsInfoDtoList.length>0?orderModel.rlsInfoDtoList[0].qrcode:'')"/></td>
                            <td style="font-size: 18pt;text-align: center;" width="9%;">已验收</td>
                            <td style="width: 24%;">
                                <img src="https://hejigy.com.cn/A.jpg" alt=""
                                     style="width: 1.6cm;height: auto;margin-left: 0.5cm;margin-top: 0.3cm;"/>
                                <p style="font-size: 20pt; text-align: center;font-weight: bold;flex: 1;margin-top: 0.3cm;border-top: 1px solid black;">
                                    {{orderModel.rlsInfoDtoList &&
                                    orderModel.rlsInfoDtoList.length>0?orderModel.rlsInfoDtoList[0].codingMappingOut:''}}</p>
                            </td>
                        </tr>
                    </table>
                    <div style="height: 0.1cm; width: calc(100% + 0.4cm); border-bottom:1px solid #c0c0c0;margin-top: 0.2cm;margin-left: -0.2cm;margin-bottom:  0.1cm;"></div>
                    <table class="container" style="height: 1.5cm; font-size: 11pt;">
                        <tr>
                            <td>
                                <div class="containerTreeDiv">
                                    <div class="imgDiv">
                                        <img src="https://hejigy.com.cn/sflogo.jpg" alt=""
                                             style="width: 70px;height:auto;margin-top: 3px;"/>
                                        <img src="http://www.kwmzy.com:8005/admin/assets/sf/tel.png" alt=""
                                             style="width: 70px;height:auto;margin-top: 8px;"/>
                                    </div>
                                    <div style="margin-top: 3px;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;font-size: 13px;margin-left: 5px;">
                                        <img src="https://hejigy.com.cn/ji.jpg" alt=""
                                             style="width: 30px;height: auto"/>
                                        <div>
                                            <p>{{orderModel.deliverName}} &nbsp;&nbsp;&nbsp;&nbsp;
                                                {{orderModel.deliverMobile}} &nbsp;&nbsp;&nbsp;&nbsp;{{orderModel.deliverCompany}}</p>
                                            <p>
                                                {{(orderModel.deliverProvince||'')+(orderModel.deliverCity||'')+(orderModel.deliverCounty||'')+(orderModel.deliverAddress||'')}}</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="container" style="height: 2.6cm;">
                        <tr>
                            <td width="50%" class="pl" rowspan="2">
                                <div style="display: flex;flex-direction: column;justify-content: flex-start;text-align: left;min-height: 2.7cm;margin-top: 0.0cm;">
                                    <span>托寄物： </span>
                                    <span v-for="(item,index) in orderModel.cargoInfoDtoList">{{item.cargo+item.cargoCount+item.cargoUnit}}</span>
                                </div>
                            </td>
                            <td class="pl">
                                <div style="display: flex;flex-direction: column;justify-content: flex-start;text-align: left;min-height: 1.2cm;margin-top: 0.1cm;">
                                    <span>增值服务:</span>
                                    <span></span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pl">
                                <div style="display: flex;flex-direction: column;justify-content: flex-start;text-align: left;margin-bottom: 0.2cm;">
                                    <span>计费重量：&nbsp;&nbsp;&nbsp;实际重量：</span>
                                    <span>费用合计：{{orderModel.codValue}}元</span>
                                    <span>付款方式：&nbsp;&nbsp;&nbsp;{{orderModel.payMethod == 1?'寄付':orderModel.payMethod == 2?'到付':'第三方付'}}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%" class="pl">
                                <div style="display: flex;flex-direction: column;justify-content: flex-start;text-align: left;min-height: 2.7cm;margin-top: 0cm;">
                                    <span>客户自定义区域(订单号、备注等)</span>
                                    <span v-for="(item,index) in orderModel.cargoInfoDtoList">{{item.remark}}</span>
                                </div>
                            </td>
                            <td class="pl">
                                <div style="display: flex;flex-direction: row;justify-content: flex-start;text-align: left;min-height: 2.7cm;margin-top: 0cm;">
                                    <!--<img src="https://hejigy.com.cn/PI4.jpg" alt=""  style="width: 80px;height: 80px;margin-top: 10px;margin-right: 10px;"/>-->
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>

        <div class="footer-container" style="text-align: center;">
            <el-button v-print="'#printBox'" type="primary">打印</el-button>
        </div>
    </div>
</template>

<script>
    import {electronicSurfaceSingles} from '@/api/erp/wms/bill/salesStockOut'
    import JsBarcode from 'jsbarcode'

    export default {
        name: "db-electronic-sheet-print",
        props: ['id'],
        data() {
            return {
                orderModel: {
                    cargoDetails: {},
                    contactInfoList: {},
                    rlsInfoDtoList: [],
                    cargoInfoDtoList: [],
                },
                printTime: undefined,
                containerWidth: '474px',
                loading: false,
                styleText: '<style type="text/css" media="print">\n' + '  @page { size: portrait; }\n' + '</style>'
            };
        },
        created() {
            this.printTime = new Date().toLocaleString().replace('上午', '').replace('下午', '').replace(/\//g, '-');
            this.electronicSurfaceSingle();
        },
        methods: {
            electronicSurfaceSingle() {
                this.loading = true;
                electronicSurfaceSingles(this.$route.query.id).then(res => {
                    if (!this.isEmpty(res.data.data)) {
                        this.orderModel = res.data.data[0] || '';
                        var reg = /^(\d{3})\d{4}(\d{4})$/;
                        this.orderModel.consignerMobile  = this.orderModel.consignerMobile.replace(reg, "$1****$2");
                        this.orderModel.deliverMobile  = this.orderModel.deliverMobile.replace(reg, "$1****$2");
                        if (!this.isEmpty(this.orderModel.mailNo)) {
                            JsBarcode('#svgcode', this.orderModel.mailNo, {height: 80, displayValue: false})
                        }
                    } else {
                        this.vueMessage('warning', res.data.msg);
                    }
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
        }
    }
</script>
<style lang="scss">
    @media print {
        @page {
            size: auto;
            margin: 1cm;
        }

        #printBtnWrapper {
            display: none;
        }

        .printTitleHide {
            display: none;
        }
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .clearfix {
        display: inline-table;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: '思源宋体';
        font-size: 18px;
    }

    /*css reset*/
    body,
    h2,
    p {
        margin: 0;
        padding: 0;
    }

    h2,
    b {
        font-weight: normal;
    }

    ul,
    ol,
    li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .printBtn {
        width: 150px;
        height: 30px;
        background-color: #35aa47;
        color: #ffffff;
        font-size: 14px;
        border: none;
    }

    .wrapper {
        position: relative;
        width: 11.2cm;
        height: auto;
        > div:first-child {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: calc(100% - 20px);
            margin: 10px 0px;
            img:first-child {
                width: auto;
                height: 36px;
            }
            img:last-child {
                width: auto;
                height: 28px;
            }
        }
        .wrapper_title {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 10px;
            margin-bottom: 10px;
        }
        .containerOne {
            .containerOneTd {
                border: 1px solid #c0c0c0;
                border-right: none;
            }
            .containerTwoTd {
                border: 1px solid #c0c0c0;
                border-left: none;
            }
        }
        .containerTwoDiv {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            text-align: left;
            margin-bottom: 10px;
            .containerTwoDivSpan {
                font-size: 40px;
                margin-left: 10px;
                margin-bottom: 0.2cm;
                /*font-weight: 600;*/
            }
            .containerTwoDivAddress {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
                div {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    div {
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        span {
                            font-size: 14px;
                        }
                    }
                }
            }
        }
        .containerTreeDiv {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
            text-align: left;
            margin-bottom: 1px;
            .imgDiv {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }
        }
    }

    .logo {
        text-align: center;
        margin-bottom: 30px;
    }

    .user-info {
        width: 500px;
    }

    .user-info .title {
        padding-bottom: 10px;
        border-bottom: 1px solid #000;
    }

    .user-info .name {
        margin-top: 10px;
    }

    .inof-rig-ma {
        position: absolute;
        top: 95px;
        right: 50px;
        text-align: center;
    }

    .drug {
        padding: 10px 0;
    }

    .drug h2 {
        font-size: 18px;
    }

    .drug-list {
        color: #616262;
        margin-left: -20px;
    }

    .drug-list li {
        float: left;
        margin-bottom: 10px;
        margin-left: 20px;
        padding: 2px;
        border: 1px solid #000;
        color: #000;
    }

    .drug-product-list {
        width: 100%;
        color: #616262;
        margin-left: -20px;
    }

    .drug-product-list li {
        width: 100%;
        margin-bottom: 10px;
        margin-left: 20px;
        padding: 2px;
        color: #000;
    }

    .drug-product-list li .drug-product-ingredients {
        /*font-weight: bold;*/
    }

    .drug-product-list li .drug-product-name {
        margin-top: 6px;
        color: #777878;
        font-size: 14px;
    }

    .drug-product-list li .drug-product-other {
        width: 100%;
        text-align: right;
        margin-top: 6px;
        margin-right: 20px;
        font-size: 16px;
    }

    .herb-list {
        width: 100%;
        border-collapse: collapse;
        font-size: 22px;
    }

    .herb-list tr {
        display: flex;
        flex-flow: row wrap;
        flex-direction: row;
    }

    .herb-list td {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: 33.33%;
        padding: 10px;
        border: 1px solid #000;
    }

    .delay-drug label {
        color: #777878;
        margin-left: 30px;
    }

    .delay-drug label:first-of-type {
        margin-left: 0;
    }

    .delay-drug label input {
        display: none;
    }

    .delay-drug label a {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: solid 1px #0b0306;
        position: relative;
        margin-right: 5px;
    }

    .delay-drug label input:checked + a:after {
        /*display: block;
        content: '';
        width:30px;
        height:30px;
        position:absolute;
        left:0;
        top:-10px;
        background:url("./images/checked.png") no-repeat;
        background-size:30px 30px;*/
    }

    td > div {
        text-align: right;
    }

    * {
        margin: 0;
        padding: 0
    }

    table {
        margin-top: -1px;
        font: 12px "Microsoft YaHei", Verdana, arial, sans-serif;
        border-collapse: collapse;
    }

    table.container {
        width: 11.2cm;
    }

    table td {
        border: 1px solid #000
    }

    table.nob {
        width: 100%
    }

    table.nob td {
        border: 0
    }

    table td.center {
        text-align: center
    }

    table td.right {
        text-align: right
    }

    table td.pl {
        padding-left: 5px
    }

    .font_s {
        font-size: 10px;
        -webkit-transform: scale(0.84, 0.84);
        *font-size: 10px
    }

    .font_m {
        font-size: 14px;
        font-weight: bold
    }

    .font_l {
        font-size: 16px;
        font-weight: bold
    }

    .font_xl {
        font-size: 18px;
        font-weight: bold
    }

    .font_xxl {
        font-size: 32px;
        font-weight: bold
    }

    table td img {
        margin-left: 5px;
        margin-right: 5px;
    }
</style>
