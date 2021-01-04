<template>
    <div class="top-menu">
        <el-menu :default-active="activeIndex"
                 mode="horizontal"
                 text-color="#333">
            <template v-for="(item,index) in items" v-if="generateTitle(item) !='商城管理'">
                <el-menu-item :index="item.parentId+''"
                              @click.native="openMenu(item)"
                              :key="index">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span :class="menuId && menuId.length>0 && item.id==menuId[0].id ? 'active':''">{{generateTitle(item)}}</span>
                    </template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "top-menu",
        data() {
            return {
                activeIndex: "0",
                items: []
            };
        },
        inject: ["index"],
        created() {
            this.getMenu();
        },
        computed: {
            ...mapGetters(["tagCurrent", "menu", "menuId"]),
        },
        methods: {
            openMenu(item) {
                this.index.openMenu(item)
            },
            getMenu() {
                this.$store.dispatch("GetTopMenu").then(res => {
                    //console.log(this.isSAAS,'',this.$store.getters.userInfo.name==='超级管理员')
                    let localStorage = window.localStorage
                    localStorage['canOpenERP']='0'
                    for (let i = 0; i <res.length ; i++) {
                        if(res[i].title==='客户管理'){
                            localStorage['canOpenERP']='1'
                            break;
                        }
                    }
                    if(this.isSAAS){
                        if(this.$store.getters.userInfo.name==='超级管理员'){
                            this.$store.commit('SET_MENU', res);
                            if (this.menuId.length < 1) {
                                this.openMenu(res[0]);
                            } else {
                                this.openMenu(this.menuId[0]);
                            }
                            this.items = res;
                        }else{
                            let arr=[]
                            for (let i = 0; i <res.length ; i++) {
                                if (res[i].title==='商城管理'||res[i].title==='模板管理'){
                                    arr.push(res[i])
                                }
                            }

                            this.$store.commit('SET_MENU', arr);
                                this.openMenu(arr[0]);
                            this.items = arr;

                        }
                    }else{
                        this.$store.commit('SET_MENU', res);
                        if (this.menuId.length < 1) {
                            this.openMenu(res[0]);
                        } else {
                            this.openMenu(this.menuId[0]);
                        }
                        this.items = res;
                    }

                    console.log(this.items,'items',this.$store.getters.userInfo)
                });
            },
            generateTitle(item) {
                return this.$router.$avueRouter.generateTitle(
                    item.title,
                    (item.meta || {}).i18n
                );
            }
        }
    };
</script>

<style scoped>
    .active {
        color: #409EFF;
    }
</style>
