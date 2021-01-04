<template>
    <div style="height: 100%">
        <div class="order-card card2" v-loading.body="twoLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
            <h3>今日订单数</h3>
            <span>{{order}}</span>
            <img src="../../../../../public/img/bg/order.png" alt="">
            <i class="el-icon-refresh" @click="myRefresh('twoLoading')"></i>
        </div>
        <div class="order-card card3" v-loading.body="fourLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
            <h3>本月订单数</h3>
            <span>{{person}}</span>
            <img src="../../../../../public/img/bg/本月订单数.png" alt="">
            <i class="el-icon-refresh" @click="myRefresh('fourLoading')"></i>
        </div>
        <div class="order-card card1" v-loading.body="oneLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
            <h3>今日销售额</h3>
            <span>{{sale}}</span>
            <img src="../../../../../public/img/bg/sale.png" alt="">
            <i class="el-icon-refresh" @click="myRefresh('oneLoading')"></i>
        </div>
        <div class="order-card card4" v-loading.body="threeLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
            <h3>本月销售额</h3>
            <span>{{commodity}}</span>
            <img src="../../../../../public/img/bg/本月销售额.png" alt="">
            <i class="el-icon-refresh" @click="myRefresh('threeLoading')"></i>
        </div>
        <div></div>
        <div style="width: 47.6%;display: inline-block;height: 200px;text-align:center;background-color: #fff;margin-left: 1.7%;border-radius: 5px;vertical-align: top;" class="statistics-card">
            <h2 style="text-align: left;padding-left: 25px;font-size: 22px">快捷入口</h2>
            <div style="width: 90%;margin: 0 auto">
                <div style="display: inline-block;width: 20%;padding-top: 5px;cursor: pointer">
                    <router-link :to="{path:'/shop/goodsControl/allGoods',query:{tabType:1}}">
                        <img src="../../../../../public/img/bg/商品管理.png" alt="">
                        <div style="height: 10px"></div>
                        <span>商品管理</span>
                    </router-link>
                </div>
<!--                <div style="display: inline-block;width: 20%;padding-top: 25px;cursor: pointer">-->
<!--                    <router-link :to="{path:'/shop/orderControl/orderList',query:{tabType:1}}">-->
<!--                        <img src="../../../../../public/img/bg/待审核.png" alt="">-->
<!--                        <div style="height: 10px"></div>-->
<!--                        <span>待审核</span>-->
<!--                    </router-link>-->
<!--                </div>-->
                <div style="display: inline-block;width: 20%;padding-top: 5px;cursor: pointer">
                    <router-link :to="{path:'/shop/orderControl/orderList',query:{tabType:'first'}}">
                        <img src="../../../../../public/img/bg/待付款.png" alt="">
                        <div style="height: 10px"></div>
                        <span>待付款</span>
                    </router-link>
                </div>
                <div style="display: inline-block;width: 20%;padding-top: 5px;cursor: pointer">
                    <router-link :to="{path:'/shop/orderControl/orderList',query:{tabType:'second'}}">
                        <img src="../../../../../public/img/bg/待发货.png" alt="">
                        <div style="height: 10px"></div>
                        <span>待发货</span>
                    </router-link>
                </div>
                <div style="display: inline-block;width: 20%;padding-top: 5px;cursor: pointer">
                    <router-link :to="{path:'/shop/umsControl/couponManager'}">
                        <img src="../../../../../public/img/bg/优惠活动.png" alt="">
                        <div style="height: 10px"></div>
                        <span>当前优惠活动</span>
                    </router-link>
                </div>
            </div>
        </div>
        <div style="width: 47.6%;display: inline-block;height: 200px;text-align:center;background-color: #fff;margin-left: 1.7%;border-radius: 5px;overflow: hidden" class="statistics-card">
            <h2 style="text-align: left;padding-left: 25px;font-size: 22px;margin-bottom: 35px;">其他</h2>
            <div style="text-align: center" v-if="isDev">
                <router-link to="/temp/tempList">
                    <el-button>公共模板库(仅开发,仅管理员)</el-button>
                </router-link>
                <router-link to="/temp/tempList">
                    <el-button disabled="">我的模板库(仅开发)</el-button>
                </router-link>
                <router-link to="/temp/columnList">
                    <el-button>网页管理(仅开发)</el-button>
                </router-link>
                <router-link to="/temp/articleList">
                    <el-button >文章管理(仅开发)</el-button>
                </router-link>
            </div>
        </div>
<!--        <div style="width: 47.6%;display: inline-block;height: 200px;text-align:center;background-color: #fff;margin-left: 1.7%;border-radius: 5px;overflow: hidden">-->
<!--            <h2 style="text-align: left;padding-left: 25px;font-size: 22px;margin-bottom: 35px;">应用服务</h2>-->
<!--            <div class="toDoTasksRightContent" style="position: relative">-->
<!--                <div style="position: absolute;top: -58px;right: 25px">-->
<!--                    <el-button icon="el-icon-arrow-left" style="padding: 5px" @click="pageTurn('prev')"></el-button>-->
<!--                    <el-button icon="el-icon-arrow-right" style="padding: 5px" @click="pageTurn('next')"></el-button>-->
<!--                </div>-->
<!--                <el-carousel  height="128" style="height: 128px" indicator-position="none" arrow="never" :loop="true" ref="cloudService">-->
<!--                    <el-carousel-item style="height: 128px">-->
<!--                        <div @click="openBtn(yingList[0].code)" class="cloudService" style="height: 128px">-->
<!--                            <img :src="yingList[0].imgUrl" style="width: 34px;height: 34px"><div></div>-->
<!--                            <span>{{yingList[0].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[1].code)" class="cloudService">-->
<!--                            <img :src="yingList[1].imgUrl" style="width: 34px;height: 34px"><div></div>-->
<!--                            <span>{{yingList[1].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[2].code)" class="cloudService">-->
<!--                            <img :src="yingList[2].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[2].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[3].code)" class="cloudService">-->
<!--                            <img :src="yingList[3].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[3].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[4].code)" class="cloudService">-->
<!--                            <img :src="yingList[4].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[4].title}}</span>-->
<!--                        </div>-->
<!--                    </el-carousel-item>-->
<!--                    <el-carousel-item>-->
<!--                        <div @click="openBtn(yingList[5].code)" class="cloudService">-->
<!--                            <img :src="yingList[5].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[5].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[6].code)" class="cloudService">-->
<!--                            <img :src="yingList[6].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[6].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[7].code)" class="cloudService">-->
<!--                            <img :src="yingList[7].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[7].title}}</span>-->
<!--                        </div>-->
<!--                        <div @click="openBtn(yingList[8].code)" class="cloudService">-->
<!--                            <img :src="yingList[8].imgUrl" style="width: 34px;height: 34px;"><div></div>-->
<!--                            <span>{{yingList[8].title}}</span>-->
<!--                        </div>-->
<!--                    </el-carousel-item>-->
<!--                </el-carousel>-->

<!--            </div>-->
<!--        </div>-->
        <div style="width: 47.6%;display: inline-block;height: 200px;text-align:center;background-color: #fff;margin-left: 1.7%;margin-top: 15px;border-radius: 5px" class="statistics-card">
            <h2 style="text-align: left;padding-left: 25px;font-size: 22px">商品统计</h2>
            <div style="width: 90%;margin: 0 auto">
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{goodsSet.goodsDown}}</span>
                    <div style="height: 10px"></div>
                    <span>已下架</span>
                </div>
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{goodsSet.goodsOn}}</span>
                    <div style="height: 10px"></div>
                    <span>已上架</span>
                </div>
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{goodsSet.goodsTodayInsert}}</span>
                    <div style="height: 10px"></div>
                    <span>今日新增</span>
                </div>
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{goodsSet.allGoods}}</span>
                    <div style="height: 10px"></div>
                    <span>全部商品</span>
                </div>
            </div>
        </div>
        <div style="width: 47.6%;display: inline-block;height: 200px;text-align:center;background-color: #fff;margin-left: 1.7%;margin-top: 15px;border-radius: 5px" class="statistics-card">
            <h2 style="text-align: left;padding-left: 25px;font-size: 22px">会员统计</h2>
            <div style="width: 90%;margin: 0 auto">
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{memberSet.memberTodayInsert}}</span>
                    <div style="height: 10px"></div>
                    <span>今日新增</span>
                </div>
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{memberSet.memberYeastDayInsert}}</span>
                    <div style="height: 10px"></div>
                    <span>昨日新增</span>
                </div>
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{memberSet.memberMonthInsert}}</span>
                    <div style="height: 10px"></div>
                    <span>本月新增</span>
                </div>
                <div style="display: inline-block;width: 25%;padding-top: 25px">
                    <span style="color: rgb(255,125,136);font-size: 30px">{{memberSet.allMember}}</span>
                    <div style="height: 10px"></div>
                    <span>会员总数</span>
                </div>
            </div>
        </div>
        <div class="picture-card">
<!--                <span class="card-title">近7天销售订单数量</span>-->
            <h2 style="font-size: 22px">近7天销售订单数量</h2>
            <div id="myChart" :style="{width: '100%', height: '85%'}"></div>
        </div>
        <div class="picture-card">
<!--                <span class="card-title">近7天销售额</span>-->
            <h2 style="font-size: 22px">近7天销售额</h2>
            <div id="money" :style="{width: '100%', height: '85%'}"></div>
        </div>
        <div style="vertical-align: bottom" class="picture-card">
<!--                <span class="card-title">近7天销售额</span>-->
            <h2 style="font-size: 22px">近7天单品销售排名</h2>
            <el-table align="center" stripe style="width: 80%;margin: 0 auto" :data="goodsRankData">
                <el-table-column label="排名" type="index"></el-table-column>
                <el-table-column label="单品名称" prop="name"></el-table-column>
                <el-table-column label="销量统计%" v-slot="{row}">
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="Math.round((Number(row.amount)/goodsAmount)*100)"></el-progress>
                </el-table-column>
            </el-table>
        </div>
        <div class="picture-card">
<!--                <span class="card-title">近7天销售额</span>-->
            <h2 style="font-size: 22px">近7天品牌销售排名</h2>
            <el-table align="center" stripe style="width: 80%;margin: 0 auto" :data="brandRankData">
                <el-table-column label="排名" type="index"></el-table-column>
                <el-table-column label="品牌名称" prop="name"></el-table-column>
                <el-table-column label="销量统计%" v-slot="{row}">
                    <div>
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="Math.round((Number(row.amount)/brandAmount)*100)" ></el-progress>
                    </div>
                </el-table-column>
            </el-table>
        </div>

    </div>

</template>

<script>
    import {getChartData,getCardData,getStatistics,getGoodsRank} from '@/api/erp/saas/orderControl/orderChart';
    import {enableErp} from '@/api/erp/saas/allGoods';
    export default {
        name: "orderChart",
        data(){
          return{
              date:[],
              money:[],
              amount:[],
              oneLoading:false,
              twoLoading:false,
              threeLoading:false,
              fourLoading:false,
              isDev:false,
              sale:'',//今日销售额
              order:'',//今日订单数
              commodity:'',//本月销售额
              person:'',//本月订单数
              goodsSet:{},//商品统计汇总
              memberSet:{},//会员统计汇总
              goodsRankData:[],//商品排名数据源
              brandRankData:[],//品牌排名数据源
              goodsAmount:0,//商品销售总计
              brandAmount:0,//品牌销售总计
              yingList: [
                  {
                      // code:'http://saas-test.520mro.com/',
                      code:'http://101.230.251.213:1887/',
                      imgUrl: 'http://gxcl-shop.qiniu.520mro.com/woce6yq4kpwvh9j8frtp.png',
                      title: '云ERP',
                  },
                  {
                      code:'http://co-test.520mro.com',
                      imgUrl: 'http://hejigy.com.cn/ydh.png',
                      title: '云订货',
                  },
                  {
                      code:'http://srm-test.520mro.com/#/login',
                      imgUrl: 'http://hejigy.com.cn/gxyc.png',
                      title: '共享云仓',
                  },
                  {
                      code:'http://test.think-tank.hejizx.com/',
                      imgUrl: 'http://hejigy.com.cn/gxzk.png',
                      title: '工业智库',
                  },
                  {
                      code:'http://college.hejizx.com/',
                      imgUrl: 'http://hejigy.com.cn/hbxt.png',
                      title: '伙伴学堂',
                  },
                  {
                      code:'http://cs1.hejigy.cn/ms/login.do',
                      imgUrl: 'http://hejigy.com.cn/qygw.png',
                      title: '企业官网',
                  },
                  {
                      code:'',
                      imgUrl: 'http://hejigy.com.cn/crm.png',
                      title: '云CRM',
                  },
                  {
                      code:'http://sasshop-test.520mro.com/',
                      imgUrl: 'http://hejigy.com.cn/gzh.png',
                      title: '公众号',
                  },
                  {
                      code:'http://wms.hejigy.com/#/login',
                      imgUrl: 'http://gxcl-shop.qiniu.520mro.com/zcule5vesyxfzz8it6g0.png',
                      title: 'WMS',
                  },
              ],
          }
        },
        mounted() {
            window.addEventListener('resize', this.debounce(this.drawLine, 1000));
        },
        created() {
            //console.log(window.location,'router')
            if(window.location.origin.indexOf('192.168.1.144')>-1||window.location.origin.indexOf('serp-test.520mro.com')>-1){
                console.log(window.location.origin.indexOf('192.168.1.144'))
                this.isDev=true
            }
            getChartData().then(res=>{
                if(Number(res.data.code)===2000||Number(res.data.code)===200){
                    for (let i = 0; i <res.data.data.length ; i++) {
                        this.date.push(res.data.data[i].date)
                        this.money.push(res.data.data[i].amoutTotal)
                        this.amount.push(res.data.data[i].orderCount)
                    }
                    this.drawLine()
                }else{
                    this.$message.error('获取图表数据失败,'+res.data.msg||res.data.data)
                }
            },error => this.$message.error('获取图表数据失败,'+error))
            getCardData().then(res=>{
                if(Number(res.data.code)===2000||Number(res.data.code)===200){
                    this.order=res.data.data.dailyOrderCount
                    this.sale=res.data.data.dailySales
                    this.person=res.data.data.monthlyOrderCount
                    this.commodity=res.data.data.monthlySales
                }else{
                    this.$message.error('获取销售额失败,'+res.data.msg||res.data.data)
                }
            },error => this.$message.error('获取销售额失败,'+error))
            getStatistics().then(res=>{
                if(Number(res.data.code)===2000||Number(res.data.code)===200){
                    this.$set(this.goodsSet,'allGoods',res.data.data.goodsStatisticsVO.allGoods)
                    this.$set(this.goodsSet,'goodsDown',res.data.data.goodsStatisticsVO.goodsDown)
                    this.$set(this.goodsSet,'goodsOn',res.data.data.goodsStatisticsVO.goodsOn)
                    this.$set(this.goodsSet,'goodsTodayInsert',res.data.data.goodsStatisticsVO.goodsTodayInsert)
                    this.$set(this.memberSet,'allMember',res.data.data.memberStatisticsVO.allMember)
                    this.$set(this.memberSet,'memberMonthInsert',res.data.data.memberStatisticsVO.memberMonthInsert)
                    this.$set(this.memberSet,'memberTodayInsert',res.data.data.memberStatisticsVO.memberTodayInsert)
                    this.$set(this.memberSet,'memberYeastDayInsert',res.data.data.memberStatisticsVO.memberYeastDayInsert)
                }else{
                    this.$message.error('获取商品和会员统计失败,'+res.data.msg||res.data.data)
                }
            },error => this.$message.error('获取商品和会员统计失败,'+error))
            getGoodsRank().then(res=>{
                if(Number(res.data.code)===2000||Number(res.data.code)===200){
                    for (let i = 0; i <res.data.data.goodsRank.length ; i++) {
                        this.goodsAmount+=res.data.data.goodsRank[i].amount
                    }
                    for (let i = 0; i <res.data.data.brandRank.length ; i++) {
                        this.brandAmount+=res.data.data.brandRank[i].amount
                    }
                    this.goodsRankData=res.data.data.goodsRank.reverse()
                    this.brandRankData=res.data.data.brandRank.reverse()

                }else{
                    this.$message.error('获取商品和会员统计失败,'+res.data.msg||res.data.data)
                }
            },error => this.$message.error('获取商品和会员统计失败,'+error))

            enableErp().then(res=>{
                if(Number(res.data.code)===200||Number(res.data.code)===2000){
                    let localStorage = window.localStorage
                    localStorage['openERP']=res.data.data.enable
                    // this.$store.commit('SET_OPEN_ERP',res.data.data.enable)
                }else{
                    this.showError('请求ERP状态失败!'+res.data.msg||res.data.data,res.data.code)
                }
            },error => this.showError('请求ERP状态失败!'+error))
        },
        methods: {
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        data: this.date.reverse(),
                        name:'日期'
                    },
                    yAxis: {
                        type: 'value',
                        name:'订单数量',
                        axisLabel: {
                            formatter: '{value} 条'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    series: [{
                        data: this.amount.reverse(),
                        type: 'bar',
                        itemStyle:{
                            color:'#6cf'
                        }
                    }]
                });

                // 基于准备好的dom，初始化echarts实例
                let money = this.$echarts.init(document.getElementById('money'))
                // 绘制图表
                money.setOption({
                    xAxis: {
                        type: 'category',
                        data: this.date,
                        name:'日期'
                    },
                    yAxis: {
                        type: 'value',
                        name:'销售额',
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    series: [{
                        data: this.money.reverse(),
                        type: 'line'
                    }],
                    color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
                });
            },

            /**
             * 顶部四个区域重新加载
             * @param name
             */
            myRefresh(name){
                this[name]=true
                getCardData().then(res=>{
                    if(Number(res.data.code)===2000||Number(res.data.code)===200){
                        this.order=res.data.data.dailyOrderCount
                        this.sale=res.data.data.dailySales
                        this.person=res.data.data.monthlyOrderCount
                        this.commodity=res.data.data.monthlySales
                        this.oneLoading=false
                        this.twoLoading=false
                        this.threeLoading=false
                        this.fourLoading=false
                    }else{
                        this.$message.error('获取销售额失败,'+res.data.msg||res.data.data)
                        this.oneLoading=false
                        this.twoLoading=false
                        this.threeLoading=false
                        this.fourLoading=false
                    }
                },error => {
                    this.$message.error('获取销售额失败,'+error)
                    this.oneLoading=false
                    this.twoLoading=false
                    this.threeLoading=false
                    this.fourLoading=false
                })
            },

            openBtn(url){
                if (url != '') {
                    window.open(url);
                }
            },

            /**
             * 手动翻页
             * @param method 当前需要执行的方法
             */
            pageTurn(method){
                this.$refs['cloudService'][method]()
            },

            debounce(fn, wait) {
                let timeout = null;
                return function() {
                    if(timeout !== null)   clearTimeout(timeout);
                    timeout = setTimeout(fn, wait);
                }
            }
        }
    }
</script>

<style scoped>
.order-card{
    width: 23%;
    height: 21%;
    display: inline-block;
    background-repeat: no-repeat;
    position: relative;
    margin-left: 1.7%;
    margin-bottom: .85%;
    background-size: auto;
    border-radius: 5px;
    min-height: 180px;
}
.order-card>h3{
    padding-top: 6%;
    color: white;
    font-weight: 400;
    text-indent: 30px;
}
.order-card>span{
    color: white;
    margin-left: 30px;
    font-size: 38px;
}
.order-card>img{
    position: absolute;
    top: 38px;
    right: 35px;
}
.order-card>i{
    position: absolute;
    top: 12px;
    right: 12px;
    color: white;
    font-size: 22px;
    cursor: pointer;
}
    .card1{
        background-image: url('../../../../../public/img/bg/rectangle1.png');
    }
    .card2{
        background-image: url('../../../../../public/img/bg/rectangle2.png');
    }
    .card3{
        background-image: url('../../../../../public/img/bg/rectangle3.png');
    }
    .card4{
        background-image: url('../../../../../public/img/bg/rectangle4.png');
    }
    .card-title{
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        color: #606266;
        text-align: left;
    }
.picture-card{
    width: 47.6%;
    display: inline-block;
    height: 500px;
    text-align:center;
    background-color: #fff;
    margin-left: 1.7%;
    margin-top: 15px;
    border-radius: 5px
}
@media screen and (max-width: 1430px) {
    .picture-card{
        width: 97%;
    }
    .statistics-card{
        margin-bottom: 15px;
    }
}
</style>
<style>
    .el-progress-bar__inner{
        text-align: center!important;
    }
    a{
        outline: none!important;
    }
    .cloudService{
        display: inline-block;
        width: 20%;
        cursor: pointer;
    }
    /*.el-carousel__container{*/
    /*    height: 86px!important;*/
    /*}*/
</style>
