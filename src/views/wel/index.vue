<template>
    <div>
        <div v-loading="loading">
            <a id="test123" target="_top"
               :href="openUrl+'/api/manager/home-page-data/exportReport?type='+(activeName == 'first'? 0 : activeName == 'second' ? 1 : 2)+'&dateType='+value+'&id='+id"></a>
            <el-row :span="24"
                    v-if="(settingList.length > 0 && settingList.length != 0 && settingList[0].listData[0].show) || settingList.length == 0">
                <basic-container class="wel-index">
                    <avue-data-tabs :option="option" class="tabsData"></avue-data-tabs>
                </basic-container>
            </el-row>
            <el-row :span="24">
                <el-col :span="18">
                    <div class="toDoTasks"
                         v-if="(settingList.length > 0 && settingList.length != 0 && settingList[0].listData[1].show) || settingList.length == 0">
                        <div class="toDoTasksConent">
                            <img src="http://hejigy.com.cn/zj.png" alt=""
                                 style="width: 20px;height: 20px;margin-left: 20px;margin-right: 10px;"/>
                            <span>待办任务</span>
                        </div>
                        <div class="toDoTasksConentDiv" style="justify-content: flex-start;">
                            <div class="toDoTasksConentItem"
                                 @click="toDoTasksRight('taskNowList','待办任务',0)">
                                <div>
                                    <img src="http://hejigy.com.cn/pendingtrials1.png"/>
                                </div>
                                <div class="toDoTasksConentItemConent">
                                    <span>销售待审</span>
                                    <span>{{toStockOut}}</span>
                                </div>

                            </div>
                            <div class="toDoTasksConentItem"
                                 @click="toDoTasksRight('taskNowList','待办任务',1)">
                                <div>
                                    <img src="http://hejigy.com.cn/pendingtrials2.png"/>
                                </div>
                                <div class="toDoTasksConentItemConent">
                                    <span>购货待审</span>
                                    <span>{{toStockIn}}</span>
                                </div>

                            </div>
                            <div class="toDoTasksConentItem"
                                 @click="toDoTasksRight('taskNowList','待办任务',2)">
                                <div>
                                    <img src="http://hejigy.com.cn/pendingtrials3.png"/>
                                </div>
                                <div class="toDoTasksConentItemConent">
                                    <span>其他待办</span>
                                    <span>{{toAudit}}</span>
                                </div>

                            </div>
                            <!--<div class="toDoTasksConentItem"-->
                            <!--@click="toDoTasksRight('stock_warning_query','库存预警查询',3)">-->
                            <!--<div>-->
                            <!--<img src="http://hejigy.com.cn/pendingtrials4.png"/>-->
                            <!--</div>-->
                            <!--<div class="toDoTasksConentItemConent">-->
                            <!--<span>库存预警</span>-->
                            <!--<span>{{stockWarning}}</span>-->
                            <!--</div>-->
                            <!--</div>-->
                        </div>
                    </div>
                    <div class="programme" style="height: 440px;"
                         v-if="(settingList.length > 0 && settingList.length != 0 && settingList[0].listData[2].show) || settingList.length == 0">
                        <div class="settingList">
                            <div>
                                <img src="https://hejigy.com.cn/msycgyj.png" alt=""
                                     style="width: 20px;height: 20px;margin-left: 20px;margin-right: 10px;"/>
                                <div :class="activeName == 'first'? 'active':''" @click="activeName = 'first'">
                                    <span>销售</span>
                                    <div v-if="activeName == 'first'"></div>
                                </div>
                                <div :class="activeName == 'second'? 'active':''" @click="activeName = 'second'">
                                    <span>采购</span>
                                    <div v-if="activeName == 'second'"></div>
                                </div>
                                <div :class="activeName == 'third'? 'active':''" @click="activeName = 'third'">
                                    <span>仓库</span>
                                    <div v-if="activeName == 'third'"></div>
                                </div>
                                <div :class="activeName == 'four'? 'active':''" @click="activeName = 'four'">
                                    <span>财务</span>
                                    <div v-if="activeName == 'four'"></div>
                                </div>
                            </div>
                            <div class="toDoTasksRights">
                                <i class="el-icon-refresh" style="margin-right: 10px;" title="刷新"
                                   @click="queryRank"></i>
                                <i class="el-icon-download" style="margin-right: 10px;" title="下载"
                                   @click="handleExport"></i>
                                <el-select v-model="value" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-show="activeName == 'first'">
                            <div v-show="(settingList.length == 0) || (settingList.length > 0 && settingList[2].listData[0].show)">
                                <div v-loading="activeShow">
                                    <div class="saleDiv">
                                        <div :class="salesType? 'salesTypeDiv':''" @click="salesTypeBtn">销售金额</div>
                                        <div :class="!salesType? 'salesTypeDiv':''" @click="salesTypeBtn">销售回款</div>
                                    </div>
                                    <avue-echart-bar v-if="activeName == 'first'" :theme="themeColor"
                                                     :option="configOption" :data="echartsData"
                                                     width="100%"
                                                     height="370"></avue-echart-bar>
                                </div>
                            </div>
                        </div>
                        <div v-show="activeName == 'second'">
                            <div v-if="(settingList.length == 0) || (settingList.length > 0 && settingList[2].listData[1].show)">
                                <span style="text-align: center;display: inline-block;width: 100%;">采购金额</span>
                                <avue-echart-bar v-loading="activeShow" v-if="activeName == 'second'"
                                                 :theme="themeColor" :option="configOption" :data="echartsData"
                                                 width="100%" height="370"></avue-echart-bar>
                            </div>
                        </div>
                        <div v-show="activeName == 'third'">
                            <div label="仓库" name="third">
                                <div v-if="(settingList.length == 0) || (settingList.length > 0 && settingList[2].listData[2].show)">
                                    <div class="saleDiv">
                                        <div :class="stockType? 'salesTypeDiv':''" @click="stockTypeBtn">库存金额</div>
                                        <div :class="!stockType? 'salesTypeDiv':''" @click="stockTypeBtn">库存数量</div>
                                    </div>
                                    <div style="margin-top: -30px;">
                                        <pie-chart :vocational="rollOption" v-if="activeName == 'third'"
                                                   style="margin:0px auto 0px auto;" ref="vocational1"></pie-chart>
                                    </div>

                                    <div style="text-align: center;margin-top: -36px;font-size: 18px;">{{stockType?
                                        '库存总额' : '库存总量'}}:{{stockType? stockTypeSum : stockTypeSums}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-show="activeName == 'four'">
                            <div label="应收已收" name="four"
                                 v-show="(settingList.length == 0) || (settingList.length > 0 && settingList[2].listData[3].show)">
                                <div v-loading="activeShow">
                                    <div class="saleDiv">
                                        <div style="margin:0px;background: #23B7E5;line-height: 30px;font-size: 12px; cursor: pointer;color:#ffffff;border-top-left-radius: 4px;border-bottom-left-radius: 4px; ">
                                            应收金额
                                        </div>
                                        <div style="background: #188df0;line-height: 30px;font-size: 12px; cursor: pointer;;color:#ffffff;border-top-right-radius: 4px;border-bottom-right-radius: 4px; ">
                                            已收金额
                                        </div>
                                    </div>
                                    <avue-echart-bar v-if="activeName == 'four'" :theme="themeColor"
                                                     :option="configOption" :data="echartsData" width="100%"
                                                     height="370"></avue-echart-bar>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="toDoTasksRight" style="margin-bottom: 14px;">
                        <div class="toDoTasksConent">
                            <img src="http://hejigy.com.cn/yc.png" alt=""
                                 style="width: 20px;height: 20px;margin-left: 20px;margin-right: 10px;"/>
                            <span>常规预警</span>
                        </div>
                        <div class="toDoTasksRightContentYujing">
                            <div v-if="warningList.length != 0" v-for="(item,index) in warningList"
                                 class="toDoTasksRightContentYujingItem" @click="toDoTaskBtn(index,item)">
                                <div>
                                    <div></div>
                                    <span>{{item.title}}</span>
                                </div>
                                <span :class="item.sum>0?'sum':''">{{item.sum}}</span>
                            </div>
                        </div>

                    </div>
                    <div class="toDoTasksRight"
                         v-if="(settingList.length > 0 && settingList.length != 0) || settingList.length == 0">
                        <div class="toDoTasksConent">
                            <img src="https://hejigy.com.cn/bzbcygn.png" alt=""
                                 style="width: 20px;height: 20px;margin-left: 20px;margin-right: 10px;"/>
                            <span>常用功能</span>
                        </div>
                        <div class="toDoTasksRightContent" v-if="settingList.length != 0" style="margin-top: 13px;">
                            <div v-for="(item,index) in settingList[3].listData"
                                 @click="toDoTasksRight(item.code,item.title)" v-if="item.title!='' && index<6">
                                <img :src="item.imgUrl">
                                <span>{{item.title}}</span>
                            </div>
                        </div>
                        <div class="toDoTasksRightContent" v-else style="margin-top: 13px;">
                            <div v-for="(item,index) in settingLists"
                                 @click="toDoTasksRight(item.code,item.title)">
                                <img :src="item.imgUrl">
                                <span>{{item.title}}</span>
                            </div>
                        </div>
                    </div>
                    <!--<div class="toDoTasksRight" style="margin-top: 14px;"-->
                    <!--v-if="(settingList.length > 0 && settingList.length != 0 && settingList[0].listData[3].show) || settingList.length == 0">-->
                    <!--<span class="toDoTasksConent">应用服务</span>-->
                    <!--<div class="toDoTasksRightContent" >-->
                    <!--<div v-for="(item,index) in yingList"-->
                    <!--@click="openBtn(item.code)">-->
                    <!--<img :src="item.imgUrl" style="width: 34px;height: 34px;">-->
                    <!--<span>{{item.title}}</span>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="24">
                    <basic-container class="indexLast">
                        <!--<div class="indexTop">-->
                        <!--<div  class="indexTopConent">-->
                        <!--<div>-->
                        <!--<span style="display:inline-block;margin-right: 2rem;">QQ：3376893959&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
                        <!--<span>联系人：王小姐</span>-->
                        <!--</div>-->
                        <!--<div>-->
                        <!--<span style="display:inline-block;margin-right: 2rem;">电话：0512-636327063</span>-->
                        <!--&lt;!&ndash;<span>咨询热线：</span>&ndash;&gt;-->
                        <!--</div>-->
                        <!--<div>-->
                        <!--<span>公司地址：吴江经济技术开发区运东大道997号东方海悦花园4幢8层805、806室</span>-->
                        <!--</div>-->
                        <!--</div>-->
                        <!--<img src="http://hejigy.com.cn/ewm.png" style="width: 100px;height: 100px;">-->
                        <!--</div>-->
                        <div class="indexLastBottom">
                            梅施云ERP管理软件 V1.0&nbsp;&nbsp;苏州梅施信息科技有限公司
                        </div>
                    </basic-container>

                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {queryAmount, queryRank, queryWarningInfo} from "@/api/user";
    import {openUrl} from '@/config/env';
    import PieChart from './PieChart'
    import {getPageSetting} from "@/api/erp/config/index";

    var scriptt = document.createElement('script')
    scriptt.type = 'text/javascript';
    scriptt.src = 'http://libs.baidu.com/jquery/2.0.0/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(scriptt);
    export default {
        name: "wel",
        props: ['timeStamp'],
        components: {
            PieChart,
        },
        data() {
            return {
                warningList: [
                    {
                        title: '库存预警',
                        sum: 0,
                        urlName: 'stock_warning_query',
                        dataName: '库存预警查询'
                    },
                    {
                        title: '应收预警',
                        sum: 0,
                        urlName: 'sales_receive_warning',
                        dataName: '销售收款预警表'
                    },
                    {
                        title: '应付预警',
                        urlName: 'purchase_pay_warning',
                        dataName: '采购付款预警表',
                        sum: 0
                    },
                    {
                        title: '开票预警',
                        sum: 0,
                        urlName: 'sales_invoice_warning',
                        dataName: '销售开票预警表'
                    },
                    {
                        title: '收票预警',
                        urlName: 'purchase_invoice_warning',
                        dataName: '采购收票预警表',
                        sum: 0
                    }
                ],
                activeShow: false,
                settingLists: [
                    {
                        type: 1,
                        imgUrl: 'http://hejigy.com.cn/purchaseOrder1.png',
                        title: '采购订单',
                        code: 'purchase_order',
                    },
                    {
                        type: 1,
                        imgUrl: 'http://hejigy.com.cn/orderSales1.png',
                        title: '销售订单',
                        code: 'customer_order',
                    },
                    {
                        type: 1,
                        imgUrl: 'http://hejigy.com.cn/receipt1.png',
                        title: '收款单',
                        code: 'sales-receivable',
                    },
                    {
                        type: 1,
                        imgUrl: 'http://hejigy.com.cn/paymentNote1.png',
                        title: '付款单',
                        code: 'purchase-payment',
                    },
                    {
                        type: 1,
                        imgUrl: 'http://hejigy.com.cn/transferOrder1.png',
                        title: '商品调拨单',
                        code: 'allocation_stock_out',
                    },
                    {
                        type: 1,
                        imgUrl: 'http://hejigy.com.cn/InventorySheet1.png',
                        title: '库存盘点单',
                        code: 'check_stock',
                    },
                ],
                yingList: [
                    {
                        // code:'http://saas-test.520mro.com/',
                        code: 'http://serp-test.520mro.com/#/login',
                        imgUrl: 'http://hejigy.com.cn/ysc.png',
                        title: '云商城',
                    },
                    {
                        code: 'http://co-test.520mro.com',
                        imgUrl: 'http://hejigy.com.cn/ydh.png',
                        title: '云订货',
                    },
                    {
                        code: 'http://srm-test.520mro.com/#/login',
                        imgUrl: 'http://hejigy.com.cn/gxyc.png',
                        title: '共享云仓',
                    },
                    {
                        code: 'http://test.think-tank.hejizx.com/',
                        imgUrl: 'http://hejigy.com.cn/gxzk.png',
                        title: '工业智库',
                    },
                    {
                        code: 'http://college.hejizx.com/',
                        imgUrl: 'http://hejigy.com.cn/hbxt.png',
                        title: '伙伴学堂',
                    },
                    {
                        code: 'http://cs1.hejigy.cn/ms/login.do',
                        imgUrl: 'http://hejigy.com.cn/qygw.png',
                        title: '企业官网',
                    },
                    {
                        code: '',
                        imgUrl: 'http://hejigy.com.cn/crm.png',
                        title: '云CRM',
                    },
                    {
                        code: 'http://sasshop-test.520mro.com/',
                        imgUrl: 'http://hejigy.com.cn/gzh.png',
                        title: '公众号',
                    },
                    {
                        code: '',
                        imgUrl: 'http://hejigy.com.cn/yx.png',
                        title: '邮箱',
                    },
                ],
                id: '',
                settingList: [],
                loading: false,
                options: [
                    {
                        value: 'thisWeek',
                        label: '本周'
                    },
                    {
                        value: 'thisMouth',
                        label: '本月'
                    },
                    {
                        value: 'thisQuarter',
                        label: '本季度'
                    },
                    {
                        value: 'thisYear',
                        label: '本年'
                    },
                    {
                        value: 'lastYear',
                        label: '去年'
                    }
                ],
                stockWarning: 0,
                stockTypeSum: 0,
                stockTypeSums: 0,
                value: 'thisMouth',
                stockType: true,
                salesType: true,
                toAudit: 0,
                toStockIn: 0,
                toStockOut: 0,
                activeName: 'first',
                themeColor: 'wonderland',
                echartsData: {
                    "categories": [],
                    "series": [
                        {
                            "name": "单位:元",
                            "data": []
                        }
                    ]
                },
                configOption: {
                    switchTheme: false,
                    refreshTime: 5000,
                    titlePostion: '',
                    titleFontSize: 24,
                    titleColor: 'rgb(115, 170, 229)',
                    gridX: 105,
                    gridY: 50,
                    gridX2: 80,
                    gridY2: 100,
                    nameColor: '#333',
                    lineColor: '#333',
                    xNameFontSize: 12,
                    yNameFontSize: 12,
                    labelShow: false,
                    labelShowFontSize: 12,
                    labelShowFontWeight: 300,
                    yAxisInverse: false,
                    xAxisInverse: false,
                    xAxisShow: true,
                    yAxisShow: true,
                    xAxisSplitLineShow: false,
                    yAxisSplitLineShow: false,
                    refresh: 3000,
                    barWidth: 30,
                    barRadius: 2,
                    barColor: [
                        {
                            color1: '#23B7E5',
                            postion: 50
                        }],
                    barMinHeight: 2,
                },
                rollEchartsData: [
                    {value: 335, name: '直接访问'},
                    {value: 310, name: '邮件营销'},
                    {value: 234, name: '联盟广告'},
                    {value: 135, name: '视频广告'},
                    {value: 1548, name: '搜索引擎'}
                ],
                rollOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 10,
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['55%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                    formatter: '{b}: {@score}'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: [
                                {value: 335, name: '直接访问'},
                                {value: 310, name: '邮件营销'},
                                {value: 234, name: '联盟广告'},
                                {value: 135, name: '视频广告'},
                                {value: 1548, name: '搜索引擎'}
                            ]
                        }
                    ],
                    "barColor": [
                        {
                            "color1": "#83bff6",
                        },
                        {
                            "color1": "#23B7E5",
                        },
                        {
                            "color1": "rgba(154, 168, 212, 1)",
                        },
                        {
                            "color1": "#188df0",
                        },
                        {
                            "color1": "#564AA3",
                        }
                    ]
                },
                isInit: undefined,
                option: {
                    decimals: 4,
                    span: 6,
                    data: [
                        {
                            click: (item) => {
                                this.loading = true;
                                this.queryAmount();
                            },
                            title: this.$t("wel.data.column1"),
                            subtitle: this.$t("wel.data.subtitle"),
                            count: 0,
                            allcount: 0,
                            text: this.$t("wel.data.text1"),
                            color: "rgba(242,184,92,1)",
                            key: this.$t("wel.data.key1")
                        },
                        {
                            click: (item) => {
                                this.loading = true;
                                this.queryAmount();
                            },
                            title: this.$t("wel.data.column2"),
                            subtitle: this.$t("wel.data.subtitle"),
                            count: 0,
                            allcount: 0,
                            text: this.$t("wel.data.text2"),
                            color: "rgba(87,215,181,1)",
                            key: this.$t("wel.data.key2")
                        },
                        {
                            click: (item) => {
                                this.loading = true;
                                this.queryAmount();
                            },
                            title: this.$t("wel.data.column3"),
                            subtitle: this.$t("wel.data.subtitle"),
                            count: 0,
                            allcount: 0,
                            text: this.$t("wel.data.text3"),
                            color: "rgb(255, 183, 82)",
                            key: this.$t("wel.data.key3")
                        },
                        {
                            click: (item) => {
                                this.loading = true;
                                this.queryAmount();
                            },
                            title: this.$t("wel.data.column4"),
                            subtitle: this.$t("wel.data.subtitle"),
                            count: 0,
                            allcount: 0,
                            text: this.$t("wel.data.text4"),
                            color: "rgb(135, 184, 127)",
                            key: this.$t("wel.data.key4")
                        },
                    ]
                },
            };
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        created() {

            this.handleSetLanguage('zh');
            this.id = this.$store.getters.userInfo.id;
            this.isInit = this.$store.getters.userInfo.isInit;
            if (this.isInit == 0) {
                this.$router.push({
                    path: '/process',
                    name: '初始化流程',
                    meta: {
                        i18n: 'process'
                    },
                });
            }
            this.loading = true;
            getPageSetting().then(res => {
                if (res.data.data) {
                    this.settingList = res.data.data;
                    let data = [];
                    for (let i in this.settingList[1].listData) {
                        if (this.settingList[1].listData[i].show) {
                            data.push(this.settingList[1].listData[i])
                        }
                    }
                    let flag = true;
                    for (let i in this.settingList[2].listData) {
                        if (this.settingList[2].listData[i].show) {
                            if (flag) {
                                flag = false;
                                this.activeName = this.settingList[2].listData[i].label == '销售金额和回款统计' ? 'first' : this.settingList[2].listData[i].label == '采购金额统计' ? 'second' : this.settingList[2].listData[i].label == '库存资金和数量统计' ? 'third' : this.settingList[2].listData[i].label == '应收已收分析' ? 'four ' : '';
                            }
                        }
                    }
                    let list = JSON.parse(JSON.stringify(this.option))
                    list.data.splice(data.length - 1, list.data.length - data.length);
                    for (let i in data) {
                        list.data[i].title = data[i].title;
                        list.data[i].text = data[i].text;
                        list.data[i].key = data[i].key;
                    }
                    this.option = list;
                    this.queryAmount();
                } else {
                    this.option.data[0].count = 0;
                    this.option.data[0].allcount = 0;
                    this.option.data[1].count = 0;
                    this.option.data[1].allcount = 0;
                    this.option.data[2].count = 0;
                    this.option.data[2].allcount = 0;
                    this.option.data[3].count = 0;
                    this.option.data[3].allcount = 0;
                    this.toAudit = 0;
                    this.toStockIn = 0;
                    this.toStockOut = 0;
                    this.stockWarning = 0;
                    this.loading = false;
                }
                this.queryRank();
            })
            queryWarningInfo().then(res => {
                let data = res.data.data;
                this.warningList = [
                    {
                        title: '库存预警',
                        sum: data.stockWarning,
                        urlName: 'stock_warning_query',
                        dataName: '库存预警查询'
                    },
                    {
                        title: '应收预警',
                        sum: data.receiveWarning,
                        urlName: 'sales_receive_warning',
                        dataName: '销售收款预警表'
                    },
                    {
                        title: '应付预警',
                        sum: data.payWarning,
                        urlName: 'purchase_pay_warning',
                        dataName: '采购付款预警表',
                    },
                    {
                        title: '开票预警',
                        sum: data.salesInvoiceWarning,
                        urlName: 'sales_invoice_warning',
                        dataName: '销售开票预警表'
                    },
                    {
                        title: '收票预警',
                        sum: data.purchaseInvoiceWarning,
                        urlName: 'purchase_invoice_warning',
                        dataName: '采购收票预警表',
                    }
                ]
            })

        },
        watch: {
            value() {
                // this.loading = true;
                this.queryRank();
            },
            activeName() {
                this.salesType = true;
                this.stockType = true;
                this.queryRank();
            }
        },
        methods: {
            handleSetLanguage(lang) {
                this.$i18n.locale = lang;
                this.$store.commit("SET_LANGUAGE", lang);
                let tag = this.tag;
                if (this.tag) {
                    let title = this.$router.$avueRouter.generateTitle(
                        tag.label,
                        (tag.meta || {}).i18n
                    );
                    //根据当前的标签也获取label的值动态设置浏览器标题
                    this.$router.$avueRouter.setTitle(title);
                }
            },
            openBtn(url) {
                if (url != '') {
                    window.open(url);
                }
            },
            handleExport() {
                document.getElementById('test123').click()
            },
            stockTypeBtn() {
                this.stockType = !this.stockType;
                this.queryRank();
            },
            salesTypeBtn() {
                this.salesType = !this.salesType;
                this.queryRank();
            },
            queryRank() {
                this.activeShow = true;
                queryRank(this.activeName == 'first' ? 0 : this.activeName == 'second' ? 1 : this.activeName == 'four' ?4 : 2, this.value).then(res => {
                    this.loading = false;
                    if (this.activeName == 'first' || this.activeName == 'second' || this.activeName == 'four') {
                        let list = [];
                        let listData = [];
                        let listsData = [];
                        if (this.activeName == 'first') {
                            if (this.salesType) {
                                for (let i in res.data.salesAmount) {
                                    list.push(res.data.salesAmount[i].salerName);
                                    listData.push(res.data.salesAmount[i].stockOutAmount);
                                }
                            } else {
                                for (let i in res.data.receiveAmount) {
                                    list.push(res.data.receiveAmount[i].salerName);
                                    listData.push(res.data.receiveAmount[i].stockOutAmount);
                                }
                            }
                            console.log(listData)
                        } else if (this.activeName == 'second') {
                            for (let i in res.data.purchaseAmount) {
                                list.push(res.data.purchaseAmount[i].salerName);
                                listData.push(res.data.purchaseAmount[i].stockOutAmount);
                            }
                        } else {
                            for (let i in res.data.needAndReceive) {
                                list.push(res.data.needAndReceive[i].customerName);
                                listData.push(res.data.needAndReceive[i].needAmount);
                                listsData.push(res.data.needAndReceive[i].receiveAmount);
                            }
                        }
                        this.echartsData.categories = list;
                        if (this.activeName == 'first' || this.activeName == 'second') {
                            this.echartsData.series = [
                                {
                                    name: '单位: 元',
                                    data: listData
                                }
                            ]
                            this.configOption.barColor = [
                                {
                                    color1: '#23B7E5',
                                    postion: 50
                                }
                            ];
                        } else {
                            this.echartsData.series = [
                                {
                                    name: '应收',
                                    data: listData
                                },
                                {
                                    name: '已收',
                                    data: listsData
                                }
                            ];
                            this.configOption.barColor = [
                                {
                                    color1: '#23B7E5',
                                    postion: 50
                                },
                                {
                                    color1: '#188df0',
                                    postion: 50
                                }
                            ];
                        }


                    } else {
                        let list = [];
                        let listName = [];
                        if (this.stockType) {
                            for (let i in res.data.stockAmount) {
                                listName.push(res.data.stockAmount[i].warehouseName);
                                list.push({
                                    value: res.data.stockAmount[i].stockAmount,
                                    name: res.data.stockAmount[i].warehouseName,
                                });
                            }
                            this.stockTypeSum = res.data.stockTotalAmount
                        } else {
                            for (let i in res.data.stockQty) {
                                listName.push(res.data.stockQty[i].warehouseName);
                                list.push({
                                    value: res.data.stockQty[i].stockQty,
                                    name: res.data.stockQty[i].warehouseName,
                                });
                            }
                        }
                        this.stockTypeSums = res.data.stockTotalQty;
                        this.rollOption.legend.data = listName;
                        this.rollOption.series[0].data = list;
                        const refName = 'vocational1'
                        this.$refs[refName].initChart()
                    }
                    this.activeShow = false;
                }).catch(() => {
                    this.activeShow = false;
                })
            },
            queryAmount() {
                queryAmount().then(res => {
                    this.loading = false;
                    let list = JSON.parse(JSON.stringify(this.option))
                    var dataItems = $('.tabsData .item');
                    for (let i in list.data) {
                        if (list.data[i].title == '库存总量') {
                            list.data[i].allcount = res.data.data.stockTotalAmount;
                            $(dataItems[i]).find('span[class="h2"]').css({display: 'none'});
                            $(dataItems[i]).find('.item-body').append('<div class="h2" style="line-height: 2.6rem;">' + res.data.data.stockTotal.toFixed(0) + '</div>')
                        }
                        if (list.data[i].title == '本月采购总额') {
                            list.data[i].allcount = res.data.data.salesAmount;
                            $(dataItems[i]).find('span[class="h2"]').css({display: 'none'});
                            $(dataItems[i]).find('.item-body').append('<div class="h2" style="line-height: 2.6rem;">' + res.data.data.purchaseTotalAmount.toFixed(this.$store.getters.sysParam.amountDecimal) + '</div>')
                        }
                        if (list.data[i].title == '供应商欠款') {
                            list.data[i].allcount = res.data.data.customerAmount;
                            $(dataItems[i]).find('span[class="h2"]').css({display: 'none'});
                            $(dataItems[i]).find('.item-body').append('<div class="h2" style="line-height: 2.6rem;">' + res.data.data.supplierAmount.toFixed(this.$store.getters.sysParam.amountDecimal) + '</div>')
                        }
                        if (list.data[i].title == '本月出库总额') {
                            list.data[i].allcount = res.data.data.salesMarginThisMonth;
                            $(dataItems[i]).find('span[class="h2"]').css({display: 'none'});
                            $(dataItems[i]).find('.item-body').append('<div class="h2" style="line-height: 2.6rem;">' + res.data.data.saleroomThisMonth.toFixed(this.$store.getters.sysParam.amountDecimal) + '</div>')
                        }
                        if (list.data[i].title == '本月收款') {
                            list.data[i].allcount = res.data.data.payAmountThisMouth;
                            $(dataItems[i]).find('span[class="h2"]').css({display: 'none'});
                            $(dataItems[i]).find('.item-body').append('<div class="h2" style="line-height: 2.6rem;">' + res.data.data.receiveAmountThisMouth.toFixed(this.$store.getters.sysParam.amountDecimal) + '</div>')
                        }
                        if (list.data[i].title == '本月新增客户') {
                            list.data[i].allcount = res.data.data.tradeCustomer;
                            $(dataItems[i]).find('span[class="h2"]').css({display: 'none'});
                            $(dataItems[i]).find('.item-body').append('<div class="h2" style="line-height: 2.6rem;">' + res.data.data.addCustomer.toFixed(this.$store.getters.sysParam.amountDecimal) + '</div>')
                        }
                    }
                    this.toAudit = res.data.data.toAudit;
                    this.toStockIn = res.data.data.toStockIn;
                    this.toStockOut = res.data.data.toStockOut;
                    this.stockWarning = res.data.data.stockWarning;
                    this.option = list;
                })
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            toDoTaskBtn(sum, item) {
                console.log(item)
                if (item.urlName) {
                    this.$router.push({
                        path: '/' + item.urlName,
                        name: item.dataName,
                        meta: {
                            i18n: item.urlName
                        },
                        query: {
                            timeStamp: new Date().getTime(),
                        },
                    });
                }
            },
            toDoTasksRight(urlName, dataName, sum) {
                this.$router.push({
                    path: '/' + urlName,
                    name: dataName,
                    meta: {
                        i18n: urlName
                    },
                    query: {
                        timeStamp: new Date().getTime(),
                        selectType: sum,
                    },
                });
            },
            setUp(url, urlName, dataName) {
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
    };
</script>


<style lang="scss">
    .item-header {
        span {
            display: none !important;
        }
    }

    .wel-index {
        padding-bottom: 14px;
        margin-top: 8px;
        .el-card__body {
            padding: 0px;
            .tabsData {
                .el-col {
                    margin-bottom: 0px;
                }
            }
        }
    }

    .backgroundDiv {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        padding: 20px 0px;

        .backgroundItem {
            position: relative;
            margin: 10px 10px 10px 10px;

            .bgItem {
                width: 340px;
                height: auto;
            }

            .backgroundItemConent {
                position: absolute;
                top: 18px;
                left: 20px;
                right: 18px;
                color: white;
                height: 202px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;

                .backgroundItemConentLeft {
                    display: inline-block;
                    margin-right: 10px;
                    color: #666666;
                    background: #ffffff;
                    line-height: 18px;
                    background: rgba(255, 255, 255, 1);
                    border-radius: 8px;
                    padding: 0px 8px;
                }

                .backgroundItemConentRightStart {
                    font-size: 16px;
                    height: 130px;

                    span:first-child {
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        margin-top: 0px;
                    }

                    span:last-child {
                        display: inline-block;
                        font-size: 12px;
                        margin-top: 4px;
                        line-height: 1.8;
                    }
                }

                .backgroundItemConentRightEnter {
                    text-align: center;

                    div {
                        display: inline-block;
                        font-size: 12px;
                        width: 100px;
                        color: #3994FE;
                        text-align: center;
                        border-radius: 15px;
                        line-height: 2;
                        background: #ffffff;
                        cursor: pointer;
                    }

                }
            }
        }
    }

    .avue-data-tabs {
        .el-row {
            .el-col:nth-child(1) .item {
                background: rgba(242, 184, 92, 1) !important;
            }

            .el-col:nth-child(2) .item {
                background: rgba(247, 113, 113, 1) !important;
            }

            .el-col:nth-child(3) .item {
                background: rgba(92, 196, 243, 1) !important;
            }
            .el-col:nth-child(4) .item {
                background: rgba(87, 215, 181, 1) !important;

            }
            .el-col:nth-child(1):hover .item {
                background: rgba(242, 184, 92, 0.8) !important;
            }

            .el-col:nth-child(2):hover .item {
                background: rgba(247, 113, 113, 0.8) !important;
            }
            .el-col:nth-child(3):hover .item {
                background: rgba(92, 196, 243, 0.8) !important;
            }
            .el-col:nth-child(4):hover .item {
                background: rgba(87, 215, 181, 0.8) !important;
            }
        }

        .item-tip {
            bottom: -35px !important;
        }
    }

    a {
        text-decoration: none;
    }
</style>
<style scoped="scoped" lang="scss">
    .toDoTasksRightContentYujing {
        margin-top: 19px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 223px;
        div {
            width: calc(100% - 20px);
            margin-left: 10px;
            height: 37px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0px;
            div {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 0px;
                div {
                    margin-left: 10px;
                    width: 5px;
                    height: 5px;
                    background: rgba(60, 146, 254, 0.8);
                    opacity: 0.8;
                    border-radius: 50%;
                    margin-right: 12px;
                }
                span {
                    text-align: left;
                    font-size: 14px;
                    color: #666666;

                }
            }
            span {
                display: inline-block;
                width: auto;
                margin-right: 10px;
                font-size: 14px;
                color: #666666;
                text-align: right;
            }
            margin-bottom: 8px;
        }
        .toDoTasksRightContentYujingItem {
            background: #F3F6FB;
            .sum {
                color: #E54646;
            }
        }
        .toDoTasksRightContentYujingItem:hover {
            background: #ECF4FF;

        }
    }

    .wel {
        &__header {
            padding: 25px 40px;
            border-bottom: 1px solid #e8e8e8;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &__info {
            display: flex;
            align-items: center;

            &-img {
                border-radius: 72px;
                display: block;
                width: 72px;
                height: 72px;

                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }

            &-content {
                position: relative;
                margin-left: 24px;
                color: rgba(0, 0, 0, 0.45);
                line-height: 22px;
            }

            &-title {
                font-size: 20px;
                line-height: 28px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                margin-bottom: 12px;
            }

            &-subtitle {
                position: relative;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.45);
                line-height: 22px;
            }
        }

        &__extra {
            &-item {
                position: relative;
                padding: 0 32px;
                display: inline-block;

                &:last-child {
                    &::after {
                        display: none;
                    }
                }

                &:after {
                    background-color: #e8e8e8;
                    position: absolute;
                    top: 30px;
                    right: 0;
                    width: 1px;
                    height: 40px;
                    content: "";
                }
            }

            &-title {
                color: rgba(0, 0, 0, 0.45);
                font-size: 14px;
                line-height: 22px;
                margin-bottom: 4px;
            }

            &-subtitle {
                color: rgba(0, 0, 0, 0.85);
                font-size: 30px;
                line-height: 38px;
                margin: 0;

                span {
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 20px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .settingList {
        margin-bottom: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 49px;
        width: 100%;
        border-bottom: 1px solid #F0F0F0;
        > div:first-child {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            div {
                font-size: 16px;
                color: #9A9A9A;
                position: relative;
                height: 50px;
                line-height: 50px;
                width: 70px;
                text-align: center;
                margin-right: 10px;
                span {
                    cursor: pointer;
                }
                div {
                    position: absolute;
                    bottom: 0px;
                    width: 70px;
                    height: 2px;
                    background: #3E90FE;
                }
            }
            div.active {
                font-size: 16px;
                color: #444444;
            }
        }
    }

    .avue-data-tabs .item-tip {
        width: 4.2rem;
        height: 4.2rem;
        font-size: 2.2rem !important;
        bottom: -1.4rem !important;
    }

    .tabsData {
        .el-row {
            .item {
                margin: 17px;
                height: 8.2rem;
                .item-body {
                    span {
                        line-height: 2.6rem !important;
                    }
                }
                .item-footer {
                    span, p {
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .echarts_left, .echarts_right {
        display: flex;
        flex-direction: column;
        background: #ffffff;
    }

    .programme {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        margin-top: 14px;
        margin-left: 20px;
    }

    .toDoTasks {
        background: #ffffff;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .toDoTasksConent {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 16px;
            width: 100%;
            border-bottom: 1px solid #EBEEF5;
            height: 50px;
        }

        .toDoTasksConentDiv {
            padding: 30px 0px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            .toDoTasksConentItem {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 25%;

                .toDoTasksConentItemConent {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin-left: 2rem;
                    color: #666666;

                    span {
                        font-size: 32px;
                        text-align: center;
                    }

                    span:first-child {
                        font-size: 1rem;
                    }
                }

                div {
                    img {
                        width: 58px;
                        height: 58px;
                    }
                }
            }
        }
    }

    .toDoTasksRight {
        margin-left: 14px;
        margin-right: 20px;
        padding-bottom: 30px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-wrap: wrap;

        .toDoTasksConent {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 16px;
            width: 100%;
            border-bottom: 1px solid #EBEEF5;
            height: 50px;
        }

        .toDoTasksRightContent {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding-top: 16px;
            div {
                width: 33%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                color: #666666;
                cursor: pointer;
                margin-bottom: 30px;
                img {
                    margin-bottom: 10px;
                    height: 34px;
                    width: auto;
                }
                span {
                    font-size: 0.8rem;
                }
            }
        }

    }

    .el-tabs-items {
        margin-left: 20px;

        .el-tabs__header {
            .el-tabs__nav-wrap {
                .el-tabs__nav-scroll {
                    .el-tabs__item {
                        line-height: 50px !important;
                        height: 50px !important;
                    }
                }
            }
        }
    }

    .saleDiv {
        flex-direction: row;
        justify-content: center;
        margin-top: 6px;
        display: block;
        z-index: 99999999;
        position: relative;
        text-align: center;

        div:first-child {
            margin-right: 20px;
        }

        div {
            font-size: 14px;
            color: #999999;
            line-height: 34px;
            padding: 0px 10px;
            cursor: pointer;
            display: inline-block;
            width: 70px;
        }

        .salesTypeDiv {
            color: white;
            background: rgb(64, 158, 255);
            border-radius: 4px;
        }
    }

    .toDoTasksRights {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-right: 20px;
        div {
            width: 84px;
        }
    }

    .indexLast {
        display: flex;
        flex-direction: row;
        margin: 6px 0px 20px 0px;
        justify-content: center;
        align-items: center;
        .indexTop {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 20px 0px;
            .indexTopConent {
                display: flex;
                flex-direction: column;
                margin-right: 68px;
                div {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    font-size: 14px;
                    color: #666666;
                    line-height: 26px;
                }
            }
        }
        .el-card__body {
            padding: 0px;
        }
        .indexLastBottom {
            border-top: 1px solid #EEEEEE;
            line-height: 49px;
            text-align: center;
            font-size: 14px;
            color: #999999;
        }
    }
</style>
