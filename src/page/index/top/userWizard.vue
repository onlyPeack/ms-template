<template>
    <basic-container>
        <div class="backgroundDiv">
            <div class="backgroundItem" @click="backgroundItem">
                <img src="http://hejigy.com.cn/Initializationprocess.png" style="height: 140px; width: auto;"/>
            </div>
            <div class="backgroundItem" @click="backgroundItems">
                <img src="http://hejigy.com.cn/Overallbusinessnavigation.png" style="height: 140px; width: auto;"/>
            </div>
            <div class="backgroundItem">
                <img src="http://hejigy.com.cn/GettingStartedHelp.png" style="height: 140px; width: auto;"/>
            </div>
        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from "vuex";
    import {queryAmount, queryRank} from "@/api/user";

    export default {
        name: "userWizard",
        data() {
            return {
                titleIndex: 0,
                dialogInsertVisible: false,
                isShow: true,
            };
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        created() {
        },
        watch: {},
        methods: {
            backgroundItem() {
                this.$router.push({
                    path: '/process',
                    name: '初始化流程',
                    meta: {
                        i18n: 'process'
                    },
                });
            },
            backgroundItems() {
                this.$router.push({
                    path: '/overallNavigation',
                    name: '系统总体导航',
                    meta: {
                        i18n: 'overallNavigation'
                    },
                });
            }
        }
    };
</script>


<style lang="scss" scoped>
    .backgroundDiv {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        padding: 20px 0px;
        .backgroundItem {
            position: relative;
            margin: 10px 40px 10px 40px;
        }
    }
    a {
        text-decoration: none;
    }
</style>