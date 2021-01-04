<template>
    <div>
        <div>
            <div class="backgroundDiv">
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background1.png" class="bgItem"/>
                    <div class="backgroundItemConent">
                        <div class="backgroundItemConentLeft">1</div>
                        <div>
                            <div class="backgroundItemConentRightStart">
                                <span>系统设置</span>
                                <br/>
                                <span>
                                系统使用前，为了健全组织机构和权限管理，须配置【系统参数】、【角色权限】、【组织部门】和【用户管理】。完成后可进行下一步设置。
                            </span>
                            </div>
                            <div class="backgroundItemConentRightEnter">
                                <div @click="setUp('/business_configuration','business_configuration','订单配置')">点击前往
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background7.png" style="height: 60px; width: auto;"/>
                </div>
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background2.png" class="bgItem"/>
                    <div class="backgroundItemConent">
                        <div class="backgroundItemConentLeft">2</div>
                        <div>
                            <div class="backgroundItemConentRightStart">
                                <span>基础资料</span>
                                <br/>
                                <span>完成系统设置后，需要对业务流程中需要配置的信息，进行设置。可前往系统【基础资料】模块配置：【商品】、【销售】、【采购】、【客户】、【仓储】、【财务】和【其他】相关基础信息。完成后可进行下一步设置。
                            </span>
                            </div>
                            <div class="backgroundItemConentRightEnter">
                                <div @click="setUp('/goodsList','goodsList','商品列表')">点击前往</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background7.png" style="height: 50px; width: auto;"/>
                </div>
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background3.png" class="bgItem"/>
                    <div class="backgroundItemConent">
                        <div class="backgroundItemConentLeft">3</div>
                        <div>
                            <div class="backgroundItemConentRightStart">
                                <span>客户资料</span>
                                <br/>
                                <span>为了进销存业务流程的开展，需要添加客户信息，可前往【客户管理】-【我的客户】中添加客户，完成客户基本信息、财务信息、联系人信息和收货信息。完成后可进行下一步操作。
                            </span>
                            </div>
                            <div class="backgroundItemConentRightEnter">
                                <div @click="setUp('/customerInfo','customerInfo','我的客户')">点击前往</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="backgroundDiv">
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background4.png" class="bgItem"/>
                    <div class="backgroundItemConent">
                        <div class="backgroundItemConentLeft">4</div>
                        <div>
                            <div class="backgroundItemConentRightStart">
                                <span>供应商资料</span>
                                <br/>
                                <span>
                                为了采购等相关业务的开展，需要添加供应商信息，可前往【采购管理】-【供应商管理】中添加供应商，完成供应商基本信息、财务信息、联系人信息。完成后可进行下一步操作。
                            </span>
                            </div>
                            <div class="backgroundItemConentRightEnter">
                                <div @click="setUp('/supplier','supplier','供应商资料')">点击前往
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background7.png" style="height: 50px; width: auto;"/>
                </div>
                <div class="backgroundItem">
                    <img src="http://hejigy.com.cn/background5.png" class="bgItem"/>
                    <div class="backgroundItemConent">
                        <div class="backgroundItemConentLeft">5</div>
                        <div>
                            <div class="backgroundItemConentRightStart">
                                <span>余额初始化</span>
                                <br/>
                                <span>系统使用前，为了高效的开展企业业务，需要对相关数据进行初始化操作。可前往系统【系统管理】-【余额期初】对库存、应收/应付、银行资金进行初始化。完成后即可开始使用系统开展业务了。
                            </span>
                            </div>
                            <div class="backgroundItemConentRightEnter">
                                <div @click="setUp('/stock_initial_entry','stock_initial_entry','期初库存')">点击前往</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="backgroundItem" style="visibility: hidden;">
                    <img src="http://hejigy.com.cn/background7.png" style="height: 50px; width: auto;"/>
                </div>
                <div class="backgroundItem" style="visibility: hidden;">
                    <img src="http://hejigy.com.cn/background5.png" class="bgItem"/>
                    <div class="backgroundItemConent">
                        <div class="backgroundItemConentLeft">5</div>
                        <div>
                            <div class="backgroundItemConentRightStart">
                                <span>余额初始化</span>
                                <br/>
                                <span>系统使用前，为了高效的开展企业业务，需要对相关数据进行初始化操作。可前往系统【系统管理】-【余额期初】对库存、应收/应付、银行资金进行初始化。完成后即可开始使用系统开展业务了。
                            </span>
                            </div>
                            <div class="backgroundItemConentRightEnter">
                                <div @click="setUp('/customerInfo','customerInfo','我的客户')">点击前往</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {queryAmount, queryRank} from "@/api/user";
    export default {
        name: "wel",
        data() {
            return {
                isInit: undefined,
            };
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        created() {
            this.isInit = this.$store.getters.userInfo.isInit;
            if (this.isInit == 0) {
                this.$alert("第1步为初始化流程时必填内容；第2,3,4,5步为初始化流程时选填内容，如不填，请在后续制单前到基础资料中完善", "提示", {
                    confirmButtonText: "确定",
                }).then(() => {
                });
            }
        },
        watch: {
        },
        methods: {
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
                    line-height:18px;
                    background:rgba(255,255,255,1);
                    border-radius:8px;
                    padding: 0px 8px;
                }
                .backgroundItemConentRightStart {
                    font-size: 16px;
                    height: 130px;
                    span:first-child{
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
            .el-col:nth-child(1):hover .item {
                background: #d43f3a !important;
            }
            .el-col:nth-child(2):hover .item {
                background: #269abc !important;
            }
            .el-col:nth-child(3):hover .item {
                background: #eea236 !important;
            }
            .el-col:nth-child(4):hover .item {
                background: #4cae4c !important;
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
    .echarts_left, .echarts_right {
        display: flex;
        flex-direction: column;
        background: #ffffff;
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

</style>
