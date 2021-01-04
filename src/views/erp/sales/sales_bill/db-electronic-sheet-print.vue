<template>
  <div class="bill-print-container" :style="{width:containerWidth}" v-loading="loading"
       element-loading-background="rgba(255, 255, 255, 1)" style="padding: 16px !important;">
    <div class="print-box" id="printBox" ref="print">
      <div class="print-container">
        <div id="printContext" class="ordercontent">
          <div id="expressPrintArea">
            <span class="markerPenCode"></span>
            <table border="2" style="width: 99mm;border-collapse:collapse;">
              <!-- 上联 -->
              <tr class="tr1" style="height: 0; border: none;display: none;">
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="10mm"></td>
                <td width="5mm"></td>
              </tr>
              <!-- 德邦 -->
              <tr style="height: 14mm;">
                <td valign="bottom" colspan="3" style="width:180mm;border-right:0mm;">
                  <img src="https://hejigy.com.cn/debang.jpg" style="width: 35mm; height: 18mm"/>
                </td>
                <td valign="middle" colspan="3"
                    style="border-top:0mm;background:white;color:black;line-height:72px;font-weight:bold; text-align:center; font-size:20px;"
                    id="refundPaymentId"></td>
                <td valign="middle" colspan="4"
                    style="border-top:0mm;background:white;color:black;line-height:72px;font-weight:bold; text-align:center; font-size:20px;"
                    id="refundPaymentIds"></td>
              </tr>
              <!-- 金额 -->
              <tr style="height: 11mm;" class="top-amount">
                <td colspan="4" style="width: 30mm; vertical-align: middle; border-right: 0px;">
                  <span style="padding-bottom: 1.5mm;"><strong>付款方式：</strong></span>
                  <span class="refundPayment">
                    <!-- 0:发货人付款（现付） 1:收货人付款（到付） 2：发货人付款（月结） （电子运单客户不支持寄付）-->
                      {{orderModel.payType == '0' ? '现付' : orderModel.payType == '1' ? '到付' : '月结'}}
                    </span>
                  <br/>
                </td>
                <td colspan="6" style="width: 50mm; vertical-align: middle; border-left: 0px;">
                  <span style="padding-bottom: 1.5mm;"><strong>重量：</strong></span>
                  <span class="insuranceMoney">{{orderModel.packageInfo.totalWeight}}</span>
                  <br/>
                </td>
              </tr>
              <!-- 大头笔 -->
              <tr style="height: 14mm;">
                <td colspan="10"
                    style="text-align: center; line-height: 13mm; vertical-align: middle;font-size: 35px; font-weight: bold; margin: 0px; padding: 0px;"
                    id="markerPen">
                  {{orderModel.arrivedOrgSimpleName}}
                </td>
              </tr>

              <!-- 收件人 -->
              <tr style="height: 14mm;">
                <td colspan="1" style="border-right:0mm;font-size:10px;width:10mm;font-family:黑体;text-align:center;">
                  <img src="https://hejigy.com.cn/revice.png"/></td>
                <td colspan="9"
                    style="border-right:0mm;font-size:10pt;width:90mm;font-family:黑体;font-weight:bold;text-align:left; "
                    id="conMsg">
                  <span class="conName">{{orderModel.receiver.name}}</span>&nbsp;&nbsp;
                  <span class="conPhone">{{orderModel.receiver.mobile}}</span>&nbsp;&nbsp;&nbsp;
                  <span class="conTel"></span>
                  <br/>
                  <span class="caddress">{{orderModel.receiver.address}}</span>
                </td>
              </tr>
              <!-- 寄件人 -->
              <tr style="height: 11mm;">
                <td colspan="1"
                    style="border-right:0mm;font-size:25px;width:10mm;font-family:黑体;font-weight:bold;text-align:center;">
                  寄
                </td>
                <td colspan="9"
                    style="border-right:0mm;font-size:8pt;width:90mm;font-family:黑体;text-align:left;">
                  <span class="shipperName">{{orderModel.sender.name}}</span>&nbsp;&nbsp;&nbsp;
                  <span class="shipperPhone">{{orderModel.sender.mobile}}</span>
                  <br/>
                  <span class="saddress">{{orderModel.sender.address}}</span>
                </td>
              </tr>
              <!-- 运单号条码 -->
              <tr style="height: 23mm;">
                <td colspan="10">
                  <div style="text-align: center;">
                    <canvas id="svgcode"></canvas>
                  </div>
                </td>
              </tr>
              <!-- 打印时间验视 -->
              <tr style="height: 18mm; text-align: left;">
                <td colspan="2" valign="bottom"
                    style="text-align:left;font-size:12px;font-family:黑体;width:20mm;border-right:0mm;">
                  <span class="printTime"></span>
                  <br/>
                  {{printTime}}
                </td>
                <td colspan="6">
                  <div class="singlePlane">
                    快件送达收件人地址，经收件人或收件人（寄件人）允许的代收人签字，视为送达。您的签字代表您已经签收次包裹，并已确定商品信息无损，包装完好、没有划痕、破损等表面质量问题。
                    <br/>
                  </div>
                  <div class="sign">
                    签收栏
                  </div>
                </td>
                <td valign="bottom" colspan="2"
                    style="text-align:center;font-size:12px;width:20mm;font-family:黑体;border-right:0mm;">
                  已验视
                </td>
              </tr>
              <!-- 下联 -->
              <!-- 收件人 -->
              <tr style="height: 10mm;">
                <td colspan="1" style="border-right:0mm;font-family:黑体;font-size:11pt;text-align:center;">
                  <img src="https://hejigy.com.cn/revice.png"/></td>
                <td colspan="7" style="font-family:黑体;text-align:left; font-size:10px;font-weight:bold;" id="conMsg2">
                  <span class="conName">{{orderModel.receiver.name}}</span>&nbsp;&nbsp;
                  <span class="conPhone">{{orderModel.receiver.mobile}}</span>&nbsp;&nbsp;&nbsp;
                  <span class="conTel"></span><br/>
                  <span class="caddress">{{orderModel.receiver.address}}</span>
                </td>
                <td rowspan="2" valign="bottom">
                  <!--<img src="/img/code/deppon_qrcode.jpg"/>-->
                </td>
                <td valign="bottom" rowspan="2" style="width:180mm;border-right:0mm;">
                  <img src="https://hejigy.com.cn/qrCode.jpg" style="width: 18mm; height: 18mm"/>
                </td>
              </tr>
              <!--  寄件人 -->
              <tr style="height: 10mm;">
                <td colspan="1"
                    style="font-weight:bold;border-right:0mm;font-family:黑体;font-size:14pt;width:10mm;text-align:center;font-weight: bold;">
                  寄
                </td>
                <td colspan="7" style="font-family:黑体;text-align:left; font-size:7pt;width:70mm">
                  <span class="shipperName">{{orderModel.sender.name}}</span>&nbsp;&nbsp;&nbsp;
                  <span class="shipperPhone">{{orderModel.sender.mobile}}</span>
                  <br/>
                  <span class="saddress">{{orderModel.sender.address}}</span>
                </td>
              </tr>
              <tr>
                <td colspan="8" id="goodsInfoArea">
                  <div class="singlePlane2" style="height: 5mm; max-height: 5mm;">
                    客户订单号：
                    <span class="originalNumber">{{orderModel.mailNo}}</span>
                  </div>
                  <div class="singlePlane2" style="height: 10mm; max-height: 10mm;">
                    货物品名:
                    <span id="cargoName" class="cargoName">{{orderModel.packageInfo.cargoName}}</span>
                  </div>
                  <div class="singlePlane2" style="height: 11mm; max-height: 11mm;">
                    备注：
                    <span class="transNote" id="transNote">{{orderModel.remark}}</span>
                  </div>
                  <div class="singlePlane2" style="height: 2mm; max-height: 2mm;">
                    <!-- 用户订单号：<span class="orderNumber"></span> -->
                  </div>
                </td>
                <td colspan="2" id="strategyLogoArea">
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!--<div style="font-size: 16px;">
          很抱歉，未查询到当前数据
        </div>-->
      </div>
      <div v-html="styleText"></div>
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
          receiver: {},
          sender: {},
          packageInfo: {},
        },
        printTime: undefined,
        containerWidth: '634px',
        loading: true,
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
            this.orderModel = res.data.data;
            if (!this.isEmpty(this.orderModel.mailNo)) {
                JsBarcode('#svgcode', this.orderModel.mailNo, {height: 80})
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
  #printContext {
    margin-top: 15px;
    width: 630px;
    height: 750px;
    float: left;
    overflow-y: auto;
    text-align: center;
    display: block;

    .wayBill li {
      float: left;
      width: 85px;
    }

    .wayBill li a:hover {
      color: blue;
    }

    .wayBill li a {
      color: blue;
    }

    #expressPrintArea {
      width: 100mm;
      height: 180mm;
      margin-left: 100px;
      background-size: 104mm 175mm;
      padding: 4mm 0.5mm 0.5mm 2.3mm;
    }

    td {
      border: 0.2mm solid #404040;
      padding-left: 1mm;
      font-size: 12px;
      font-family: 宋体;
      vertical-align: middle;
      text-align: left;
    }

    tr {
      width: 100%;
      border-left: 0mm;
      border-right: 0mm;
      border: 0.3mm solid #000000;
    }

    .singlePlane {
      font-size: 7pt;
      width: 60mm;
      font-family: 黑体;
      text-align: left;
      valign: top;
    }

    .sign {
      font-size: 8pt;
      width: 60mm;
      font-family: 黑体;
      text-align: right;
      line-height: 5mm;
      padding-top: 2mm;
    }

    .singlePlane2 {
      font-size: 7pt;
      /*width:99mm;*/
      font-family: 黑体;
      text-align: left;
      valign: top;
      padding-left: 1mm;
      padding-right: 1mm;
    }

    .singlePlane2 span {
      word-break: break-all;
      word-wrap: break-word;
    }

    .houseCode td {
      font-size: 17px;
      width: 20mm;
      font-family: 黑体;
      font-weight: bold;
      text-align: center;
    }

    .originalNumber {
      font-size: 15px;
      font-weight: bold;
    }

    #cargoName {
      font-size: 16px;
      font-weight: bold;
    }

    #transNote {
      font-weight: bold;
    }

    #transNote {
      font-size: 10px;
    }

    .top-amount td span, .top-amount td strong, .outerField1, .signSheet {
      font-size: 10px !important;
      font-family: "黑体";
    }

    #payTypeId {
      font-family: "黑体";
      font-size: 32px;
    }

    #picPackageInfo {
      padding: 0;
      margin: 0;
    }

    #picPackageInfo ul {
      margin-left: 0;
      text-align: center;
      padding: 0;
      margin: 0;
    }

    #picPackageInfo ul li {
      font-size: 14pt;
      font-family: "黑体";
      list-style: none;
      padding: 0;
      margin: 0 auto;
    }

    td#strategyLogoArea {
      border: 0;
    }

    td#goodsInfoArea {
      text-align: left;
      border: 0;
    }

    td#strategyLogoArea div#strategyLogo {
      text-align: center;
    }

    td#strategyLogoArea div#strategyLogo img {
      text-align: center;
    }

    td#strategyLogoArea div.strategyLogoTip {
      text-align: center;
      font-family: "黑体", "微软雅黑", "宋体";
      font-size: 14px;
    }
  }
</style>
