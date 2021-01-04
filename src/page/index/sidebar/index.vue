<template>
    <div class="avue-sidebar">
        <logo></logo>
        <div class="top-bar__titles">
            <span class="top-bar__item">
                <top-search></top-search>
                <i class="el-icon-search" style="color: white;float: right;margin-top: 7px;margin-right: 12px;"></i>
              </span>
        </div>
        <el-scrollbar style="height:100%">
            <div v-if="validatenull(leftMenu)"
                 class="avue-sidebar--tip">{{$t('menuTip')}}
            </div>
            <el-menu unique-opened
                     :default-active="nowTagValue"
                     mode="vertical"
                     :show-timeout="200"
                     :collapse="keyCollapse">
                <sidebar-item :menu="leftMenu"
                              :screen="screen"
                              first
                              :props="website.menu.props"
                              :collapse="keyCollapse"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import logo from "../logo";
    import sidebarItem from "./sidebarItem";
    import topSearch from "../top/top-search";
    export default {
        name: "sidebar",
        components: {sidebarItem, logo,topSearch},
        inject: ["index"],
        data() {
            return {};
        },
        created() {
        },
        computed: {
            ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", "menuId"]),
            nowTagValue: function () {
                return this.$router.$avueRouter.getValue(this.$route);
            },
            leftMenu() {
                let result = [];
                if (this.menuId && this.menuId.length > 0) {
                    result = this.menuId[0].children ? this.menuId[0].children : [];
                } else {
                    if (this.menu.length > 0) {
                        result = this.menu[0].children ? this.menu[0].children : [];
                        this.$store.commit('SET_MENUID', [this.menu[0]]);
                    }
                }
                return result;
            }
        },
        mounted() {
        },
        methods: {}
    };
</script>
<style lang="scss">
    .top-bar__titles{
        margin-top: 14px;
        margin-left:18px;
        margin-bottom: 15px;
        .top-bar__item{
            width:152px;
            height:30px;
        }
       .el-autocomplete{
           width:152px;
           height:30px;
           line-height: 28px !important;
           .el-input{
               width:152px;
               height:30px;
               input{
                   padding: 0px !important;
                   color: #bbbbbb !important;
               }
           }
       }
        width:152px;
        height:30px;
        border:1px solid #e6e6e6;

        opacity:0.5;
        border-radius:15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

