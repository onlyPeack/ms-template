<template>
    <div class="login-container"
         @keyup.enter.native="handleLogin">
        <div class="login-container-top">
            <top-color v-show="false"></top-color>
            <div class="login-weaper animated bounceInDown">
                <!--<div class="login-left">-->
                <!--<div class="login-time">-->
                <!--{{time}}-->
                <!--</div>-->
                <!--<img class="img"-->
                <!--src="https://avuejs.com/images/logo.png"-->
                <!--alt="">-->
                <!--<p class="title">{{ $t('login.info') }}</p>-->
                <!--</div>-->
                <div class="login-border">
                    <div class="login-main">
                        <!--<h4 class="login-title" style="margin-top: 60px;">-->
                        <!--{{ $t('login.title') }}{{website.title}}-->
                        <!--<top-lang></top-lang>-->
                        <!--</h4>-->
                        <userLogin v-if="activeName==='user'" @loginsBtn="loginsBtn"></userLogin>
                        <codeLogin v-else-if="activeName==='code'" @loginBtn="loginBtn"></codeLogin>
                        <thirdLogin v-else-if="activeName==='third'"  @loginBtn="loginBtn"></thirdLogin>
                        <faceLogin v-else-if="activeName==='face'"></faceLogin>
                        <div style="width: 100%;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
                            <div>

                            </div>
                            <div>
                                <span style="color: #336CF9;font-size: 12px;cursor: pointer;" v-if="activeName == 'user'" @click="activeName = 'code'">免费注册</span>
                                <span style="display:inline-block;color: #336CF9;font-size: 12px;cursor: pointer;margin-bottom: 20px;"   v-if="activeName == 'code'|| activeName == 'third'" @click="activeName = 'user'">立即登录</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <div class="last_div">© 2018-2040 梅施信息科技有限公司 All Rights Reserved   沪ICP备16009044号
        </div>
    </div>
</template>
<script>
    import userLogin from "./userlogin";
    import codeLogin from "./codelogin";
    import thirdLogin from "./thirdlogin";
    import faceLogin from "./facelogin";
    import {mapGetters} from "vuex";
    import {dateFormat} from "@/util/date";
    import {validatenull} from "@/util/validate";
    import topLang from "@/page/index/top/top-lang";
    import topColor from "@/page/index/top/top-color";

    export default {
        name: "login",
        components: {
            userLogin,
            codeLogin,
            thirdLogin,
            faceLogin,
            topLang,
            topColor
        },
        data() {
            return {
                time: "",
                activeName: "user"
            };
        },
        watch: {
            $route() {
                const params = this.$route.query;
                this.socialForm.state = params.state;
                this.socialForm.code = params.code;
                if (!validatenull(this.socialForm.state)) {
                    const loading = this.$loading({
                        lock: true,
                        text: `${
                            this.socialForm.state === "WX" ? "微信" : "QQ"
                            }登录中,请稍后。。。`,
                        spinner: "el-icon-loading"
                    });
                    setTimeout(() => {
                        loading.close();
                    }, 2000);
                }
            }
        },
        created() {
            this.getTime();
            setInterval(() => {
                this.getTime();
            }, 1000);
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["website"])
        },
        props: [],
        methods: {
            loginsBtn(){
                this.activeName = 'third'
            },
            loginBtn(){
                this.activeName = 'user'
            },
            getTime() {
                this.time = dateFormat(new Date());
            }
        }
    };
</script>

<style lang="scss">
    @import "@/styles/login.scss";
</style>