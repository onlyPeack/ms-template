<template>
    <basic-container>
        <div class="backgroundDiv">
            <div class="backgroundItem" @click="backgroundItem('/operationFlowOne','operationFlowOne','销售业务流程')">
                <img src="http://hejigy.com.cn/Salesbusinessprocess.png" style="height: 150px; width: auto;"/>
            </div>
            <div class="backgroundItem" @click="backgroundItem('/operationFlowTwo','operationFlowTwo','采购业务流程')">
                <img src="http://hejigy.com.cn/Purchasebusinessprocess.png" style="height: 150px; width: auto;"/>
            </div>
            <div class="backgroundItem"  @click="backgroundItem('/operationFlowTree','operationFlowTree','财务业务流程')">
                <img src="http://hejigy.com.cn/Financialbusinessprocess.png" style="height: 150px; width: auto;"/>
            </div>
            <div class="backgroundItem"   @click="backgroundItem('/operationFlowFour','operationFlowFour','仓储业务流程')">
                <img src="http://hejigy.com.cn/Warehousingbusinessprocess.png" style="height: 150px; width: auto;"/>
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
            backgroundItem(url, urlName, dataName) {
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


<style lang="scss" scoped>
    .backgroundDiv {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        padding: 20px 0px;
        .backgroundItem{
            position: relative;
            margin: 10px 40px 10px 40px;
        }
    }
    a {
        text-decoration: none;
    }
</style>