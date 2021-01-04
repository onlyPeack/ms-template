<template>
    <el-form
             status-icon
             :rules="loginRules"
             ref="loginForm"
             :model="loginForm"
             label-width="0">
            <div>
                <h4 class="login-title" style="color: #8A8E92;font-size: 24px;margin:0px 0px 30px 0px;">
<!--                   {{this.isSAAS?'商城管理中心':'登录梅施云ERP'}}-->
                   {{this.isSAAS?'商城管理中心':'登录梅施云ERP'}}
                </h4>
            </div>
        <el-form-item prop="tenantId">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.tenantId"
                      auto-complete="off"
                      :placeholder="$t('login.tenantId')">
            </el-input>
        </el-form-item>
        <el-form-item prop="username">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.username"
                      auto-complete="off"
                      :placeholder="$t('login.username')">
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input size="small"
                      @keyup.enter.native="handleLogin"
                      :type="passwordType"
                      v-model="loginForm.password"
                      auto-complete="off"
                      :placeholder="$t('login.password')">
                <i class="el-icon-view el-input__icon"
                   slot="suffix"
                   @click="showPassword"></i>

            </el-input>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: space-between;color: #666666;">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <span style="font-size: 14px;cursor: pointer;" @click="loginsBtn" v-if="!this.isSAAS">忘记密码</span>
        </div>
        <el-form-item>
            <el-button type="primary"
                       size="small"
                       style="background-color: rgb(252,100,89);border-color: rgb(252,100,89)"
                       @click.native.prevent="handleLogin"
                       v-if="this.isSAAS"
                       class="login-submit">{{$t('login.submit')}}
            </el-button>
            <el-button
                    v-else
                    type="primary"
                       size="small"
                       @click.native.prevent="handleLogin"
                       class="login-submit">{{$t('login.submit')}}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {randomLenNum} from "@/util/util";
    import {mapGetters} from "vuex";

    export default {
        name: "userlogin",
        data() {
            return {
                checked: false,
                loginForm: {
                    tenantId: "",
                    username: "",
                    password: "",
                    code: "",
                    redomStr: ""
                },
                code: {
                    src: "",
                    value: "",
                    len: 4,
                    type: "text"
                },
                loginRules: {
                    tenantId: [
                        {required: true, message: "请输入租户编号", trigger: "blur"}
                    ],
                    username: [
                        {required: true, message: "请输入用户名", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {min: 6, message: "密码长度最少为6位", trigger: "blur"}
                    ],
                },
                passwordType: "password"
            };
        },
        created() {
            if (this.$route.query && this.$route.query.trial == 1) {
                this.loginForm.tenantId = '00001';
                this.loginForm.username = 'yanshi';
                this.loginForm.password = '123456';
            }
            if (this.$route.query && this.$route.query.tenantId && this.$route.query.username && this.$route.query.password) {
                this.loginForm.tenantId = this.$route.query.tenantId;
                this.loginForm.username = this.$route.query.username;
                this.loginForm.password = this.$route.query.password;
                this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
                    this.$router.push({name: this.$route.query.urlName, path: '/' + (this.$route.query.url || '')});
                });
            }
            this.refreshCode();
            this.handleSetLanguage('zh');
            this.getCookie()
        },
        mounted() {
        },
        watch: {
            checked(val) {
                if (this.checked) {
                    this.setCookie(this.loginForm.tenantId, this.loginForm.username, this.loginForm.password, this.checked, 7);
                } else {
                    this.clearCookie();
                }
            }
        },
        computed: {
            ...mapGetters(["tagWel"])
        },
        props: [],
        methods: {
            clearCookie() {
                this.setCookie("", "", "", -1); //修改2值都为空，天数为负1天就好了
                this.checked = false;
            },
            getCookie() {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split("="); //再次切割
                        //判断查找相对应的值

                        if (arr2[0] == "tenantId") {
                            this.loginForm.tenantId = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == "username") {
                            this.loginForm.username = arr2[1];
                        } else if (arr2[0] == "password") {
                            this.loginForm.password = arr2[1];
                        } else if (arr2[0] == "checked") {
                            this.checked = arr2[1] == 'true' || arr2[1] == true ? true : false;
                        }
                    }
                }
            },
            setCookie(c_id, c_name, c_pwd, c_check, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                window.document.cookie =
                    "tenantId" + "=" + c_id + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie =
                    "username" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie =
                    "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie =
                    "checked" + "=" + c_check + ";path=/;expires=" + exdate.toGMTString();
            },
            loginsBtn() {
                this.$emit('loginsBtn');
            },
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
            refreshCode() {
                this.loginForm.redomStr = randomLenNum(this.code.len, true);
                this.code.type == "text"
                    ? (this.code.value = randomLenNum(this.code.len))
                    : (this.code.src = `${this.codeUrl}/${this.loginForm.redomStr}`);
                this.loginForm.code = this.code.value;
            },
            showPassword() {
                this.passwordType == ""
                    ? (this.passwordType = "password")
                    : (this.passwordType = "");
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        let localStorage = window.localStorage
                        localStorage['tenantId']=this.loginForm.tenantId
                        localStorage['username']=this.loginForm.username
                        localStorage['password']=this.loginForm.password
                        this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
                            this.$router.push({path: this.tagWel.value});
                        });
                    }
                });
            }
        }
    };
</script>

<style>
</style>
