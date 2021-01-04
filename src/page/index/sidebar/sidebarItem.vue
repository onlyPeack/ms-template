<template>
    <div class="menu-wrapper">
        <template v-for="item in menu">
            <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
                          :index="item[pathKey]"
                          @click="open(item)"
                          :key="item[labelKey]"
                          :class="{'is-active':vaildAvtive(item)}">
                <img  v-if="item[iconKey]" class="iconKeyImg" :src="vaildAvtive(item) ? item.icon1:item.icon"/>
                <span slot="title"
                      :alt="item[pathKey]">{{generateTitle(item)}}</span>
            </el-menu-item>
            <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                        :index="item[pathKey]"
                        :key="item[labelKey]">
                <template slot="title">
                    <img v-if="item[iconKey]" class="iconKeyImg" :src="vaildAvtive(item) ? item.icon1:item.icon"/>
                    <span slot="title"
                          :class="{'el-menu--display':collapse && first}">{{generateTitle(item)}}</span>
                </template>
                <template v-for="(child,cindex) in item[childrenKey]">
                    <el-menu-item :index="child[pathKey],cindex"
                                  @click="open(child)"
                                  :class="{'is-active':vaildAvtive(child)}"
                                  v-if="validatenull(child[childrenKey])"
                                  :key="child[labelKey]">
                        <img v-if="child[iconKey]" class="iconKeyImg" :src="vaildAvtive(child) ? child.icon1:child.icon"/>
                        <span slot="title">{{generateTitle(child)}}</span>
                    </el-menu-item>
                    <sidebar-item v-else
                                  :menu="[child]"
                                  :key="cindex"
                                  :props="props"
                                  :screen="screen"
                                  :collapse="collapse"></sidebar-item>
                </template>
            </el-submenu>
        </template>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import {validatenull} from "@/util/validate";
    import config from "./config.js";

    export default {
        name: "sidebarItem",
        data() {
            return {
                config: config
            };
        },
        props: {
            menu: {
                type: Array
            },
            screen: {
                type: Number
            },
            first: {
                type: Boolean,
                default: false
            },
            props: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            collapse: {
                type: Boolean
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["roles"]),
            labelKey() {
                return this.props.title || this.config.propsDefault.title;
            },
            pathKey() {
                return this.props.path || this.config.propsDefault.path;
            },
            iconKey() {
                return this.props.icon || this.config.propsDefault.icon;
            },
            iconKey1() {
                return this.props.icon1 || this.config.propsDefault.icon1;
            },
            childrenKey() {
                return this.props.children || this.config.propsDefault.children;
            },
            nowTagValue() {
                return this.$router.$avueRouter.getValue(this.$route);
            }
        },
        methods: {
            generateTitle(item) {
                return this.$router.$avueRouter.generateTitle(
                    item[this.labelKey],
                    (item.meta || {}).i18n
                );
            },
            vaildAvtive(item) {
                const groupFlag = (item["group"] || []).some(ele =>
                    this.$route.path.includes(ele)
                );
                return this.nowTagValue === item[this.pathKey] || groupFlag;
            },
            vaildRoles(item) {
                item.meta = item.meta || {};
                return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
            },
            validatenull(val) {
                return validatenull(val);
            },
            open(item) {
                if(item.title&&item.title==='云订货'){
                    let localStorage = window.localStorage
                    let url=`${this.cloudOrderUrl}?tenantId=${localStorage['tenantId']}&username=${localStorage['username']}&password=${localStorage['password']}`
                    window.open(url, '_blank');
                }else if(item.title&&item.title==='云发布'){
                    let localStorage = window.localStorage
                    let url=`${this.SRMUrl}?tenantId=${localStorage['tenantId']}&username=${localStorage['username']}&password=${localStorage['password']}`
                    window.open(url, '_blank');
                } else{
                    if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
                    this.$router.$avueRouter.group = item.group;
                    this.$router.$avueRouter.meta = item.meta;
                    if(item.query == undefined){
                        item.query = {
                            timeStamp : new Date().getTime()
                        }
                    }else{
                        item.query.timeStamp = new Date().getTime()
                    }
                    this.$router.push({
                        path: this.$router.$avueRouter.getPath({
                            name: item[this.labelKey],
                            src: item[this.pathKey],

                        }, item.meta),
                        query: item.query
                    });
                }

            }
        }
    };
</script>
<style>
    .iconKeyImg{
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }
</style>

