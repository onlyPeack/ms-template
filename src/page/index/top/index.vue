<template>
    <div class="avue-top">
        <div class="top-bar__left">
            <div class="avue-breadcrumb"
                 :class="[{ 'avue-breadcrumb--active': isCollapse }]"
                 v-if="showCollapse">
                <i class="icon-navicon"
                   @click="setCollapse"></i>
            </div>
        </div>
        <div class="top-bar__title">
            <div class="top-bar__item top-bar__item--show"
                 v-if="showMenu">
                <top-menu ref="topMenu"></top-menu>
            </div>
            <!--<span class="top-bar__item"-->
            <!--v-if="showSearch">-->
            <!--<top-search></top-search>-->
            <!--</span>-->
        </div>

        <div class="top-bar__right">

            <!--<el-tooltip v-if="showColor"-->
            <!--effect="dark"-->
            <!--:content="$t('navbar.color')"-->
            <!--placement="bottom">-->
            <!--<div class="top-bar__item">-->
            <!--<top-color></top-color>-->
            <!--</div>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip v-if="showDebug"-->
            <!--effect="dark"-->
            <!--:content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"-->
            <!--placement="bottom">-->
            <!--<div class="top-bar__item">-->
            <!--<top-logs></top-logs>-->
            <!--</div>-->
            <!--</el-tooltip>-->
            <!--皮肤-->
            <!--<el-tooltip v-if="showLock"-->
            <!--effect="dark"-->
            <!--:content="$t('navbar.lock')"-->
            <!--placement="bottom">-->
            <!--<div class="top-bar__item">-->
            <!--<top-lock></top-lock>-->
            <!--</div>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip v-if="showTheme"-->
            <!--effect="dark"-->
            <!--:content="$t('navbar.theme')"-->
            <!--placement="bottom">-->
            <!--<div class="top-bar__item top-bar__item&#45;&#45;show">-->
            <!--<top-theme></top-theme>-->
            <!--</div>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip effect="dark"-->
            <!--:content="$t('navbar.notice')"-->
            <!--placement="bottom">-->
            <div class="top-bar__item top-bar__item--show" v-if="!this.isSAAS">
                <top-notice ref="topNotice"></top-notice>
            </div>
            <img src="http://gxcl-shop.qiniu.520mro.com/16y2r7kz0n6zigdu5wyd.png" alt="" v-if="this.isSAAS">
            <a :href="this.SAASShop" target="_blank" v-if="this.isSAAS">
                <span style="font-size: 14px;margin-right: 27px;margin-left: 10px;vertical-align: bottom;color: white">商城首页</span>
            </a>

            <!--</el-tooltip>-->
            <!--      <el-tooltip effect="dark"-->
            <!--                  :content="$t('navbar.language')"-->
            <!--                  placement="bottom">-->
            <!--        <div class="top-bar__item top-bar__item&#45;&#45;show">-->
            <!--          <top-lang></top-lang>-->
            <!--        </div>-->
            <!--      </el-tooltip>-->
            <!--<el-tooltip v-if="showFullScren"-->
            <!--effect="dark"-->
            <!--:content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"-->
            <!--placement="bottom">-->
            <!--<div class="top-bar__item">-->
            <!--<i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"-->
            <!--@click="handleScreen"></i>-->
            <!--</div>-->
            <!--</el-tooltip>-->
            <el-dropdown>
        <span class="el-dropdown-link"
              style="display: inline-block;display: flex;flex-direction: row;align-items: center;">
           <img v-if="userInfo.sex== '男'" src="http://hejigy.com.cn/sex1.png"
                style="width:26px;height: 26px;margin-right: 6px;">
           <img v-else src="http://hejigy.com.cn/sex2.png" style="width:26px;height: 26px;margin-right: 6px;">
          {{userInfo.name}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
                <el-dropdown-menu slot="dropdown">
                    <!--<el-dropdown-item>-->
                    <!--<a @click="initializationBtn">{{$t('navbar.initialization')}}</a>-->
                    <!--</el-dropdown-item>-->
                    <el-dropdown-item>
                        <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
                    </el-dropdown-item>
                    <!--<el-dropdown-item>-->
                    <!--<router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>-->
                    <!--</el-dropdown-item>-->

                    <!--<el-dropdown-item>-->
                    <!--<router-link to="/info/setting">{{$t('navbar.setting')}}</router-link>-->
                    <!--</el-dropdown-item>-->

                    <el-dropdown-item>
                        <router-link to="/info/userWizard" v-if="!this.isSAAS">用户向导</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <router-link to="/adminSys/baseManager/page_setting">首页设置</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <router-link to="/info/addedServices">增值服务设置</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="logout"
                                      divided>{{$t('navbar.logOut')}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    import {resetRouter} from '@/router/router'
    import {mapGetters, mapState} from "vuex";
    import {fullscreenToggel, listenfullscreen} from "@/util/util";
    import {parameterList} from '@/api/erp/manager/config/index'
    import topLock from "./top-lock";
    import topMenu from "./top-menu";
    import topSearch from "./top-search";
    import topTheme from "./top-theme";
    import topLogs from "./top-logs";
    import topColor from "./top-color";
    import topNotice from './top-notice'
    import topLang from "./top-lang";
    import {setTheme} from "@/util/util";
    import {selectWebsiteSetting} from '@/api/erp/saas/websiteControl/websiteSetting';

    export default {
        components: {
            topLock,
            topMenu,
            topSearch,
            topTheme,
            topLogs,
            topColor,
            topNotice,
            topLang
        },
        name: "top",
        data() {
            return {
                SAASShop: "",
            };
        },
        filters: {},
        created() {
            this.$store.commit("SET_THEME_NAME", 'theme-d2');
            setTheme('theme-d2');
            parameterList().then((res) => {
                const list = res.data.data.records;
                var sysParam = {
                    discountDecimal: 2,
                    amountDecimal: 2
                };
                if (list.length > 0) {
                    let index1 = list.findIndex(item => item.name == '折扣小数配置');
                    let index2 = list.findIndex(item => item.name == '金额小数配置');
                    sysParam.discountDecimal = index1 > -1 ? list[index1].value : 2;
                    sysParam.amountDecimal = index2 > -1 ? list[index2].value : 2;
                }
                this.$store.commit('SET_SYSPARAM', sysParam);
            }, error => {
            });

            selectWebsiteSetting().then(res => {
                if (Number(res.data.code) === 2000 || Number(res.data.code) === 200) {
                    if (res.data.data.webUrl && res.data.data.webUrl !== '') {
                        this.SAASShop = 'http://' + res.data.data.webUrl
                    } else {
                        this.SAASShop = this.SAASShopDefault
                    }

                } else {
                    this.showError('获取网站设置信息失败,' + res.data.msg || res.data.data, res.data.code)
                }
            }, error => this.showError('获取网站设置信息失败,' + error))
        },
        mounted() {
            listenfullscreen(this.setScreen);
        },
        computed: {
            ...mapState({
                showDebug: state => state.common.showDebug,
                showTheme: state => state.common.showTheme,
                showLock: state => state.common.showLock,
                showFullScren: state => state.common.showFullScren,
                showCollapse: state => state.common.showCollapse,
                showSearch: state => state.common.showSearch,
                showMenu: state => state.common.showMenu,
                showColor: state => state.common.showColor
            }),
            ...mapGetters([
                "userInfo",
                "isFullScren",
                "tagWel",
                "tagList",
                "isCollapse",
                "tag",
                "logsLen",
                "logsFlag"
            ])
        },
        methods: {
            initializationBtn() {
                this.$alert("请按计量单位,商品品牌,商品系列,商品分类,商品列表的顺序填写。", "提示", {
                    confirmButtonText: "确定",
                }).then(() => {
                    this.$router.push({
                        path: '/measureunit',
                        name: '计量单位',
                        meta: {
                            i18n: 'measureunit'
                        },
                        query: {
                            timeStamp: new Date().getTime()
                        },
                    });
                });
            },
            handleScreen() {
                fullscreenToggel();
            },
            setCollapse() {
                this.$store.commit("SET_COLLAPSE");
            },
            setScreen() {
                this.$store.commit("SET_FULLSCREN");
            },
            logout() {
                this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
                    confirmButtonText: this.$t("submitText"),
                    cancelButtonText: this.$t("cancelText"),
                    type: "warning"
                }).then(() => {
                    this.$store.dispatch("LogOut").then(() => {
                        resetRouter();
                        this.$router.push({path: '/login'});
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
