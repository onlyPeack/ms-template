<template>
  <div>
      <!-- 导航条 -->
      <div style="background: #FFF8DC;">
          <div id="nav">
              <div class="nav_center">
                  <div class="nav_left">
                      <div class="nav_igation">
                          <router-link>
                              <span>首页</span>
                          </router-link>
                      </div>
                      <div class="nav_igation">
                          <span>产品</span>
                      </div>
                      <div class="nav_igation">
                          <router-link>
                              <span>增值市场</span>
                          </router-link>
                      </div>
                      <div class="nav_igation">
                          <span>下载</span>
                      </div>
                  </div>
                  <!--<div class="nav_right">-->

                  <!--</div>-->
              </div>
          </div>
      </div>
      <div class="settle_ments">
          <div v-if="isSettle" class="settle_ment">
              <span class="select_pay">订单应付金额</span>
              <div class="settle_order">
                  <div  class="settle_order_left">
                      <span>您购买的 【短信服务】 订单提交成功，请尽快付款！订单编号：20200619091900001</span>
                  </div>
                  <div  class="settle_order_right">
                      <span class="settle_order_pay">应付金额:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span  class="settle_order_pay_sum">10.00元</span>
                  </div>
              </div>
              <div class="dividing_line"></div>
              <span class="select_pay">请选择支付方式</span>
              <div class="payment_method">
                  <div class="payment_method_top">
                      <div :class="settleIndex == 0?'settleDiv': ''" @click="settleIndex = 0">微信支付</div>
                      <div :class="settleIndex == 1?'settleDiv': ''" @click="settleIndex = 1">支付宝支付</div>
                  </div>
                  <div class="payment_method_conent">
                      <div class="payment_method_conent_top">
                          <div class="payment_method_conent_top_left">微信支付</div>
                          <div class="payment_method_conent_top_right">
                              <span>支付:</span>
                              <span>￥10.00</span>
                          </div>
                      </div>
                      <div class="dividing_line"></div>
                      <div class="payment_code">
                          <div></div>
                          <div class="payment_pay">
                              <div class="payment_pay_top">
                                  <span>当前需要支付的金额为:</span>
                                  <span>&nbsp;&nbsp;&nbsp;&nbsp;￥10.00</span>
                              </div>
                              <div></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div v-else class="settle_ment">
              <span class="select_pay">订单支付结果</span>
              <div class="payment_method">
                  <div class="payment_method_top">
                      <div :class="settleIndex == 0?'settleDiv': ''" @click="settleIndex = 0">微信支付</div>
                      <div :class="settleIndex == 1?'settleDiv': ''" @click="settleIndex = 1">支付宝支付</div>
                  </div>
                  <div class="payment_method_conent">
                      <div class="payment_method_conent_top">
                          <div class="payment_method_conent_top_left">您购买的 【短信服务】 订单支付成功！</div>
                          <div class="payment_method_conent_top_right">
                              <span>已付金额:</span>
                              <span>￥10.00</span>
                          </div>
                      </div>
                      <div class="payment_method_conent_order">
                          <span><font style="color: orange">{{count}}</font>&nbsp;&nbsp;&nbsp;&nbsp;秒后自动跳转至增值服务市场或前往【会员中心】查看</span>
                          <div  class="payment_method_conent_myOrder">我的订单</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
    export default {
        name: "project_view_pay",
        data() {
            return {
                isSettle: true,
                settleIndex: 0,
                count: 5,
            };
        },
        created() {
        },
        computed: {
        },
        methods: {
        }
    }
</script>
<style lang="scss"  scoped>
    #nav {
        position: relative;
        width: 100%;
        background: #20222A;
        line-height: 50px;
        height: 50px;
        font-size: 12px;
    }
    .nav_center {
        position: relative;
        width: 1190px;
        clear: both;
        margin: 0 auto;
    }

    /*header左导航栏*/
    .nav_left {
        float: left;
    }

    .nav_igation {
        position: relative;
        float: left;
        margin-right: 2rem;
        cursor: pointer;
        font-size: 14px;
        span {
            color: #ffffff;
        }
        span:hover {
            color: #0078d7;
        }
    }
    .nav_right {
        float: right;
    }
    .settle_ments {
        background: white;
        padding: 40px 0px;
    }
    .settle_ment{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 1200px;
        margin: 0 auto;
        .settle_order{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #cccccc;
            padding: 30px;
            .settle_order_left,.settle_order_right{
                display: flex;
                flex-direction: row;
                align-items: center;
                .settle_order_pay{
                    font-size: 16px;
                }
                .settle_order_pay_sum{
                    font-size: 28px;
                    color: orange;
                    margin-right: 60px;
                }
            }
        }
        .dividing_line{
            border-bottom: 1px solid #cccccc;
            margin: 40px 0px  30px 0px;
        }
        .select_pay{
            font-size: 16px;
            margin-bottom: 20px;
        }
        .payment_method{
            display: flex;
            flex-direction: column;
            .payment_method_top{
                display: flex;
                flex-direction: row;
                div{
                    border: 1px solid #cccccc;
                    font-size: 18px;
                    padding: 10px 20px;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    background: white;
                    z-index: 100000;
                    cursor: pointer;
                }
                div:first-child{
                    border-right: none;
                }
                .settleDiv{
                    border-bottom: none;
                }
            }
            .payment_method_conent{
                border: 1px solid #cccccc;
                padding: 20px;
                margin-top: -1px;
                display: flex;
                flex-direction: column;
                .payment_method_conent_top{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin:30px 40px 0px 40px;
                    .payment_method_conent_top_left,.payment_method_conent_top_right{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                    .payment_method_conent_top_left{
                        font-size: 18px;
                    }
                    .payment_method_conent_top_right{
                        margin-right: 20px;
                        span:first-child{
                            margin-right: 10px;
                        }
                        span:last-child{
                            color: orange;
                            font-size: 22px;
                            margin-left: 10px;
                        }
                    }
                }
                .payment_code {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .payment_pay {
                        display: flex;
                        flex-direction: column;
                        .payment_pay_top {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            span:last-child{
                                color: orange;
                                font-size: 18px;
                            }
                        }
                    }
                }
                .payment_method_conent_order{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin: 80px 0px 90px 0px;
                    .payment_method_conent_myOrder{
                        background: #188DF9;
                        width: 100px;
                        border-radius: 4px;
                        color: white;
                        text-align: center;
                        line-height: 32px;
                        margin-left: 20px;
                    }
                }
            }
        }
    }
</style>
