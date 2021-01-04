<template>
    <div class="addedServices">
        <div  class="addedServicesItem">
            <img src="http://hejigy.com.cn/msy.png"/>
            <div class="addedServicesItemConent">
                <div>单位名称&nbsp;&nbsp;:&nbsp;&nbsp;苏州梅施信息科技有限公司</div>
                <div>注册电话&nbsp;&nbsp;:&nbsp;&nbsp;18827878623</div>
                <div>注册时间&nbsp;&nbsp;:&nbsp;&nbsp;2020-05-10</div>
            </div>
            <div class="addedServicesItemXinXi">
                <div>到期日期&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2020-08-11&nbsp;&nbsp;&nbsp;&nbsp;<span class="isWarning">剩余13天</span></div>
                <div>系统版本&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标准版&nbsp;&nbsp;&nbsp;&nbsp;<span  class="isWarning">10&nbsp;用户</span></div>
                <div>剩余短信&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10  条&nbsp;&nbsp;&nbsp;&nbsp;<span  class="isInfo" @click="buyrecord">购买记录</span></div>
            </div>
        </div>
        <div  class="addedServicesItem">
            <div v-for="(item,index) in servicesList" class="servicesItem">
                <img src="http://hejigy.com.cn/msy.png" style="width: 100px;height: 100px;"/>
                <div class="servicesItemConet" >
                    <h3>{{item.title}}</h3>
                    <span>{{item.conent}}</span>
                    <div class="servicesItemConetBtn">
                        <div style="margin-right: 28px;cursor: pointer;">配置</div>
                        <div style="cursor: pointer;">查看</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "added_services",
        data() {
            return {
                servicesList: [
                    {
                        img: 'http://hejigy.com.cn/msy.png',
                        title:'商品数据包',
                        conent:'梅施云产品库含有海量工控商品信息，购买商品数据包可一键导入千条商品数据。'
                    },
                    {
                        img: 'http://hejigy.com.cn/msy.png',
                        title:'短信服务包',
                        conent:'服务介绍服务介绍服务介绍服务介绍服务介绍。'
                    },
                    {
                        img: 'http://hejigy.com.cn/msy.png',
                        title:'服务名称',
                        conent:'服务介绍服务介绍服务介绍服务介绍服务介绍。'
                    },
                    {
                        img: 'http://hejigy.com.cn/msy.png',
                        title:'服务名称',
                        conent:'服务介绍服务介绍服务介绍服务介绍服务介绍。'
                    }
                ]
            }
        },
        created() {
        },
        methods: {
            buyrecord(){
                this.$router.push({
                    path: '/buy_record',
                    name: '购买记录',
                    meta: {
                        i18n: 'buy_record'
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
    .addedServices{
        display: flex;
        flex-direction: column;
        .addedServicesItem{
            margin: 10px;
            background: #ffffff;
            padding: 40px 40px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            .servicesItem{
                border:1px solid #CCCCCC;
                border-radius: 4px;
                padding: 26px 16px;
                margin: 0px 40px 0px 0px;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                .servicesItemConet{
                    margin-left: 30px;width: 180px;
                    h3{
                        margin: 0px;
                    }
                    span{
                        display: inline-block;
                        margin-top: 12px;
                        height: 60px;
                        font-size: 14px;
                    }
                    .servicesItemConetBtn{
                        display: flex;
                        flex-direction: row;
                        align-content: center;
                        margin-top: 8px;
                        font-size: 14px;
                    }
                }
            }
            .addedServicesItemConent{
                margin-left:7rem;
                display: flex;
                flex-direction: column;
                div{
                    border:1px solid #CCCCCC;
                    line-height: 40px;
                    font-size: 14px;
                    border-radius: 4px;
                    padding: 0px 16px;
                    margin: 8px 0px;
                    align-items: center;
                }
            }
            .addedServicesItemXinXi{
                margin-left:8rem;
                display: flex;
                flex-direction: column;
                div{
                    line-height: 40px;
                    font-size: 14px;
                    padding: 0px 16px;
                    margin: 8px 0px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .isWarning{
                        display: inline-block;
                        line-height: 30px;
                        background: #FF9900;
                        color: #ffffff;
                        border-radius: 4px;
                        padding: 0px 16px;
                        cursor: pointer;
                    }
                    .isInfo{
                        display: inline-block;
                        cursor: pointer;
                        line-height: 30px;
                        background: #188DF9;
                        color: #ffffff;
                        border-radius: 4px;
                        padding: 0px 16px;
                    }
                }
            }
        }
    }
</style>
