<template>
    <div>
        <el-form
                 status-icon
                 :rules="loginRules"
                 ref="loginForm"
                 :model="loginForm"
                 label-width="0">
            <div>
                <h4 class="login-title" style="color:#5586FF;font-size: 24px;margin:20px 0px 20px 0px;">找回密码
                </h4>
            </div>
            <el-form-item prop="phone">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          v-model="loginForm.phone"
                          auto-complete="off"
                          :placeholder="$t('login.phone')">
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          v-model="loginForm.code"
                          auto-complete="off"
                          :placeholder="$t('login.code')">

                    <template slot="append">
          <span @click="handleSend"
                class="msg-text"
                :class="[{display:msgKey}]">{{msgText}}</span>
                    </template>
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
            <el-form-item prop="surePassword">
                <el-input size="small"
                          @keyup.enter.native="handleLogin"
                          :type="surePasswordType"
                          v-model="loginForm.surePassword"
                          auto-complete="off"
                          :placeholder="$t('login.surePassword')">
                    <i class="el-icon-view el-input__icon"
                       slot="suffix"
                       @click="showSurePassword"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small"
                           type="primary"
                           style="margin-top: 10px;"
                           @click.native.prevent="handleLogin"
                           class="login-submit">修改密码
                </el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import {isvalidatemobile} from "@/util/validate";
    import {mapGetters} from "vuex";
    import {registerCheckMobile, sendForgetSms, registerCheckUserName, forgetPassword} from "@/api/user"

    export default {
        name: "thirdlogin",
        data() {
            const validatePhone = (rule, value, callback) => {
                if (isvalidatemobile(value)[0]) {
                    callback(new Error(isvalidatemobile(value)[1]));
                } else {
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error("请输入至少6位数的密码"));
                } else {
                    callback();
                }
            };
            const validateCode = (rule, value, callback) => {
                if (value.length != 4) {
                    callback(new Error("请输入4位数的验证码"));
                } else {
                    callback();
                }
            };
            return {
                msgText: "",
                msgTime: "",
                msgKey: false,
                loginForm: {
                    phone: "",
                    code: "",
                    password: "",
                    surePassword: "",
                },
                passwordType: "password",
                surePasswordType: "password",
                loginRules: {
                    phone: [{required: true, trigger: "blur", validator: validatePhone}],
                    code: [{required: true, trigger: "blur", validator: validateCode}],
                    password: [{required: true, trigger: "blur", validator: validatePassword}],
                    surePassword: [{required: true, trigger: "blur", validator: validatePassword}],
                },
                code: undefined,
            };
        },
        created() {
            this.msgText = this.config.MSGINIT;
            this.msgTime = this.config.MSGTIME;
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["tagWel"]),
            config() {
                return {
                    MSGINIT: this.$t("login.msgText"),
                    MSGSCUCCESS: this.$t("login.msgSuccess"),
                    MSGTIME: 60
                };
            }
        },
        props: [],
        methods: {
            showSurePassword() {
                this.surePasswordType == ""
                    ? (this.surePasswordType = "password")
                    : (this.surePasswordType = "");
            },
            showPassword() {
                this.passwordType == ""
                    ? (this.passwordType = "password")
                    : (this.passwordType = "");
            },
            handleSend() {
                if (this.msgKey) return;
                if (this.loginForm.phone == '') {
                    this.vueMessage('warning', '请输入手机号!');
                    return
                }
                sendForgetSms(this.loginForm.phone).then(val => {
                    if (val.data.code == '2000') {
                        this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                        this.msgKey = true;
                        const time = setInterval(() => {
                            this.msgTime--;
                            this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                            if (this.msgTime == 0) {
                                this.msgText = this.config.MSGINIT;
                                this.msgKey = false;
                                clearInterval(time);
                                this.msgTime = this.config.MSGTIME;
                            }
                        }, 1000);
                    } else {
                        this.vueMessage('warning', val.data.msg);
                    }
                })
            },
            handleLogin() {
                if (this.loginForm.password != this.loginForm.surePassword) {
                    this.vueMessage('warning', '密码与确认码不一致!')
                    return
                }
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        forgetPassword(this.loginForm.code, this.loginForm.phone, this.loginForm.password).then(val => {
                            if (val.data.code == '2000') {
                                this.vueMessage('success', '修改密码成功!');
                                this.$emit('loginBtn');
                            } else {
                                this.vueMessage('warning', '修改密码失败!');
                            }
                        })
                    }
                });
            },
        }
    };
</script>

<style>
    .msg-text {
        display: block;
        width: 60px;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
    }

    .msg-text.display {
        color: #ccc;
    }
</style>
