<template>
    <div class="avue-contail"
         :class="{'avue--collapse':isCollapse}">
        <screenshot></screenshot>
        <div class="avue-header">
            <!-- 顶部导航栏 -->
            <top ref="top"/>
        </div>

        <div class="avue-layout">
            <div class="avue-left">
                <!-- 左侧导航栏 -->
                <sidebar/>
            </div>
            <div class="avue-main"
                 :class="{'avue-main--fullscreen':!isMenu}">
                <!-- 顶部标签卡 -->
                <tags/>
                <transition name="fade-scale">
                    <search class="avue-view"
                            v-show="isSearch"></search>
                </transition>
                <!-- 主体视图层 -->
                <div style="height:100%;overflow-y:auto;overflow-x:hidden;"
                     id="avue-view"
                     v-show="!isSearch">
                    <keep-alive>
                        <router-view class="avue-view"/>
                    </keep-alive>
                    <!--<router-view class="avue-view"-->
                    <!--v-if="!$route.meta.$keepAlive"/>-->
                </div>
            </div>
        </div>
        <!-- <el-footer class="avue-footer">
          <img src="/svg/logo.svg"
               alt=""
               class="logo">
          <p class="copyright">© 2018 Avue designed by smallwei</p>
        </el-footer> -->
        <div class="avue-shade"
             @click="showCollapse"></div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import tags from "./tags";
    import screenshot from './screenshot';
    import search from "./search";
    import top from "./top/";
    import sidebar from "./sidebar/";
    import admin from "@/util/admin";
    import {validatenull} from "@/util/validate";
    import {calcDate} from "@/util/date.js";
    import {getStore} from "@/util/store.js";

    export default {
        components: {
            top,
            tags,
            search,
            sidebar,
            screenshot
        },
        name: "index",
        provide() {
            return {
                index: this
            };
        },
        data() {
            return {
                //搜索控制
                isSearch: false,
                //刷新token锁
                refreshLock: false,
                //刷新token的时间
                refreshTime: ""
            };
        },
        created() {
            this.handleSetLanguage('zh');
            //实时检测刷新token
            this.refreshToken();
        },
        mounted() {
            this.init();
        },
        computed: mapGetters(["isMenu", "isLock", "isCollapse", "website", "menu"]),
        props: [],
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
            showCollapse() {
                this.$store.commit("SET_COLLAPSE");
            },
            // 屏幕检测
            init() {
                this.$store.commit("SET_SCREEN", admin.getScreen());
                window.onresize = () => {
                    setTimeout(() => {
                        this.$store.commit("SET_SCREEN", admin.getScreen());
                    }, 0);
                };
            },
            //打开菜单
            openMenu(item = {}) {
                this.$store.commit('SET_MENUID', [item]);
                setTimeout(() => {
                    document.getElementsByClassName('menu-wrapper')[0].firstChild.firstChild.click();
                }, 100)
            },
            // 10分钟检测一次token
            refreshToken() {
                this.refreshTime = setInterval(() => {
                    const token = getStore({
                        name: "token",
                        debug: true
                    }) || {};
                    const date = calcDate(token.datetime, new Date().getTime());
                    if (validatenull(date)) return;
                    if (date.seconds >= this.website.tokenTime && !this.refreshLock) {
                        this.refreshLock = true;
                        this.$store
                            .dispatch("RefeshToken")
                            .then(() => {
                                this.refreshLock = false;
                            })
                            .catch(() => {
                                this.refreshLock = false;
                            });
                    }
                }, 1000000);
            }
        }
    };
</script>